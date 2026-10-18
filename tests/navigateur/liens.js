// Génère modules/<module>/liens-cours.js : pour chaque étape de chaque niveau, la partie du cours qui l'explique.
// Le jeu s'en sert pour le lien « Revoir dans le cours » (après une erreur ou une réponse vue).
// Méthode : on lit chaque page de cours (sections h2 et h3, découpées en blocs, comme nav.js), on joue chaque niveau
// avec « Voir la réponse » pour lire tout le texte de chaque étape (question, choix, réponse, explication),
// puis on choisit le bloc le plus proche (TF-IDF, cosinus) parmi les pages candidates :
// la page de la notion pour un niveau de notion, les pages du chapitre pour une révision ou un boss,
// les pages du sous-module pour un niveau sans page (TD). Un rapport liste les correspondances faibles, à relire.
// Lancer : node tests/navigateur/liens.js <module> [id ...]     (aperçu : RACINE=apercu BASE=http://127.0.0.1:8765/apercu/)
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const { BASE, RACINE, lancer, dossier, W, H } = require("./commun");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/liens.js <module> [id ...]"); process.exit(2); }

// module.js et registre lus dans un bac à sable
const bac = { window: {}, parcours: {} };
bac.PLATEFORME = { parcours: (id, p) => { bac.parcours[id] = p; } };
vm.createContext(bac);
vm.runInContext(fs.readFileSync(path.join(RACINE, "registre.js"), "utf8"), bac);
vm.runInContext(fs.readFileSync(path.join(RACINE, "modules", mid, "module.js"), "utf8"), bac);
const MOD = bac.parcours[mid], REG = bac.window.REGISTRE.modules.find(m => m.id === mid);
const smDe = ch => { const c = MOD.chapitres.find(x => x.id === ch); return REG.sousModules.length ? (c && c.sousModule) || REG.sousModules[0].id : ""; };

// Corrections relues à la main : niveau → { numéro d'étape (à partir de 1) : [page, ancre, section] }
const CORRECTIONS = {
  robotique: { "boss-transformations": { 3: ["bras-2r", "calcul~11", "Calcul"], 4: ["bras-2r", "calcul~11", "Calcul"] } } // espace de travail du bras 2R
};
const VIDES = new Set(("les des une un le la de du et en est sur pour par que qui dans au aux ce cette ces son sa ses il elle on se ne pas plus "
  + "avec sans mais ou donc car tout tous toute toutes leur leurs lui sont etre fait faire peut comme quand quel quelle quels quelles ici "
  + "deux trois entre cela ceci alors ainsi aussi tres bien deja encore chaque meme autre autres quoi dont vers chez avant apres sous "
  + "touche choisis regarde observe essaie glisse place clique coche continuer reponse voir passer bravo etape niveau oui non vrai faux").split(" "));
function mots(t) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ")
    .filter(w => w.length > 2 && !VIDES.has(w) && !/^\d+$/.test(w));
}

(async () => {
  const b = await lancer();
  const pg = await (await b.newContext({ viewport: { width: W, height: H }, hasTouch: true })).newPage();
  // 1. pages de cours : sections et blocs
  const pages = {};
  for (const c of MOD.cours || []) {
    await pg.goto(`${BASE}modules/${mid}/cours/${c.id}.html?dans=1`, { waitUntil: "networkidle" }); await pg.waitForTimeout(150);
    pages[c.id] = await pg.evaluate(() => {
      const txt = el => { const k = el.cloneNode(true); k.querySelectorAll(".katex-mathml, svg, .reglages, .direct").forEach(x => x.remove()); return k.textContent.replace(/\s+/g, " ").trim(); };
      const out = [];
      document.querySelectorAll("main h2, main h3").forEach(t => {
        const seuil = t.tagName === "H2" ? /^(H2|NAV)$/ : /^(H2|H3|NAV)$/, blocs = [];
        let n = t.nextElementSibling;
        while (n && !seuil.test(n.tagName)) { blocs.push(txt(n)); n = n.nextElementSibling; }
        out.push({ id: t.id, titre: t.textContent.trim(), niveau: t.tagName, blocs });
      });
      return { titre: document.querySelector("main h1").textContent.trim(), sections: out };
    });
  }
  // documents : un par bloc (rattaché à la section la plus fine : h3 si le bloc est sous un h3)
  const docs = [];
  for (const [pid, p] of Object.entries(pages)) {
    const sousH3 = new Set();
    p.sections.filter(s => s.niveau === "H3").forEach(s => s.blocs.forEach(x => sousH3.add(x)));
    p.sections.forEach(s => {
      const generique = /^(Formules cl|Le chapitre en bref|Ce que couvre)/.test(s.titre);
      s.blocs.forEach((t, k) => {
        if (s.niveau === "H2" && sousH3.has(t)) return;
        if (t.length < 25) return;
        docs.push({ page: pid, ancre: s.id + (s.blocs.length > 2 ? "~" + k : ""), section: s.titre, t, m: mots(s.titre + " " + t), poids: generique ? 0.75 : 1 });
      });
    });
  }
  const df = {};
  docs.forEach(d => new Set(d.m).forEach(w => { df[w] = (df[w] || 0) + 1; }));
  const idf = w => Math.log(1 + docs.length / (1 + (df[w] || 0)));
  function vecteur(ms) { const v = {}; ms.forEach(w => { v[w] = (v[w] || 0) + 1; }); let n = 0; for (const w in v) { v[w] *= idf(w); n += v[w] * v[w]; } n = Math.sqrt(n) || 1; for (const w in v) v[w] /= n; return v; }
  docs.forEach(d => { d.v = vecteur(d.m); });
  const cos = (a, b) => { let s = 0; for (const w in a) if (b[w]) s += a[w] * b[w]; return s; };

  // 2. niveaux : texte de chaque étape, réponse montrée
  const niveaux = process.argv.slice(3).length ? MOD.niveaux.filter(n => process.argv.slice(3).includes(n.id)) : MOD.niveaux.filter(n => n.pret);
  const sortie = path.join(RACINE, "modules", mid, "liens-cours.js");
  const liens = {};
  try { vm.runInContext(fs.readFileSync(sortie, "utf8"), bac); Object.assign(liens, bac.window.LIENS_COURS || {}); } catch (e) { /* premier passage */ }
  const rapport = [];
  for (const n of niveaux) {
    await pg.goto(`${BASE}modules/${mid}/jouer.html#${n.id}`, { waitUntil: "networkidle" }); await pg.waitForTimeout(700);
    const nb = await pg.$$eval("#segments span", s => s.length);
    const textes = [];
    for (let k = 0; k < nb; k++) {
      await pg.waitForTimeout(500);
      await pg.click('.etape:not(.sortie) .aide-q button >> text="Voir la réponse"').catch(() => {});
      const ok = await pg.waitForSelector(".etape:not(.sortie) .btn.suite", { timeout: 6000 }).then(() => true, () => false);
      await pg.waitForTimeout(250);
      textes.push(await pg.evaluate(() => {
        const e = document.querySelector(".etape:not(.sortie)"), k = e.cloneNode(true);
        k.querySelectorAll(".katex-mathml, .kicker, .aide-q, .revoir, .clavier, .btn").forEach(x => x.remove());
        return k.textContent.replace(/\s+/g, " ").trim() + " " + (document.getElementById("astuce").textContent || "");
      }));
      if (ok) await pg.click(".etape:not(.sortie) .btn.suite"); else await pg.click('.etape:not(.sortie) .aide-q button >> text="Passer"').catch(() => {});
    }
    // pages candidates
    const chapitreCours = (MOD.cours || []).filter(c => c.chapitre === n.chapitre).map(c => c.id);
    // révision, boss : les pages du chapitre d'abord, celles des chapitres précédents du sous-module un peu moins
    const smCours = (MOD.cours || []).filter(c => smDe(c.chapitre) === smDe(n.chapitre) && c.chapitre <= n.chapitre).map(c => c.id);
    const cand = n.cours ? { [n.id]: 1 } : {};
    // (pages d'autres chapitres seulement si le chapitre a moins de deux pages, comme le chapitre de TD)
    if (!n.cours) smCours.forEach(id => { if (chapitreCours.includes(id) || chapitreCours.length < 2) cand[id] = chapitreCours.includes(id) || !chapitreCours.length ? 1 : 0.85; });
    liens[n.id] = textes.map((t, k) => {
      const v = vecteur(mots(t));
      let best = null;
      docs.filter(d => cand[d.page]).forEach(d => { const s = cos(v, d.v) * d.poids * cand[d.page]; if (!best || s > best.s) best = { d, s }; });
      if (!best) return null;
      rapport.push(`${best.s.toFixed(2)}\t${n.id} ${k + 1}\t${t.slice(0, 90)}\t→ ${best.d.page} · ${best.d.section} · ${best.d.t.slice(0, 70)}`);
      // correspondance trop faible : le haut de la page plutôt qu'une section au hasard
      return best.s < 0.07 ? [best.d.page, "", ""] : [best.d.page, best.d.ancre, best.d.section];
    });
    Object.entries((CORRECTIONS[mid] || {})[n.id] || {}).forEach(([k, v]) => { liens[n.id][k - 1] = v; });
    console.log(n.id, liens[n.id].map(x => x ? x[0] + "#" + x[1] : "-").join("  "));
  }
  await b.close();
  const ordre = MOD.niveaux.map(n => n.id).filter(id => liens[id]);
  fs.writeFileSync(sortie, "/* Généré par tests/navigateur/liens.js : pour chaque niveau, étape par étape, [page de cours, ancre, section] du lien « Revoir dans le cours ». */\n" +
    "window.LIENS_COURS = {\n" + ordre.map(id => "  " + JSON.stringify(id) + ": " + JSON.stringify(liens[id])).join(",\n") + "\n};\n");
  fs.writeFileSync(path.join(dossier(mid), "liens-rapport.tsv"), rapport.sort().join("\n") + "\n");
  console.log("écrit " + path.relative(process.cwd(), sortie) + " ; rapport : " + path.join(dossier(mid), "liens-rapport.tsv"));
})();
