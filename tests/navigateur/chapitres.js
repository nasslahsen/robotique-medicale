// Structure par chapitres : plan, écrans de chapitre, sections du cours, S'entraîner.
// Vérifie : aucune erreur, plan et écran de chapitre sans défilement, état des nœuds, Précédent / Suivant et « 2 / 4 »,
// section lue en bas de page, fin du cours avec l'option S'entraîner, exercice ouvert depuis S'entraîner (lien Chapitre,
// suite dans le chapitre, « Revoir dans le cours » vers la section), Reprendre. Une capture par écran.
// Lancer : node tests/navigateur/chapitres.js <module>      (W et H pour la taille d'écran)
"use strict";
const path = require("path");
const { BASE, lancer, dossier, W, H } = require("./commun");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/chapitres.js <module>"); process.exit(2); }
let P = null;
global.PLATEFORME = { parcours: (id, p) => { P = p; } };
require(path.join(__dirname, "..", "..", "modules", mid, "module.js"));
const dc = `${BASE}modules/${mid}/${P.dossierChapitres ? P.dossierChapitres + "/" : ""}`;

(async () => {
  const b = await lancer();
  const pg = await (await b.newContext({ viewport: { width: W, height: H }, hasTouch: true })).newPage();
  const out = dossier(mid, "chapitres-" + W + "x" + H);
  let ko = 0;
  const pb = m => { ko++; console.error("ÉCHEC", m); };
  const errs = []; pg.on("pageerror", e => errs.push(String(e))); pg.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  const verifErr = ou => { if (errs.length) pb(`${ou} : ${errs.splice(0).join(" | ")}`); };
  const deborde = () => pg.evaluate(() => document.documentElement.scrollHeight - innerHeight);

  await pg.goto(BASE + "index.html", { waitUntil: "networkidle" }); await pg.evaluate(() => localStorage.clear()); await pg.waitForTimeout(300); errs.splice(0);
  // Plan
  await pg.goto(dc + "index.html", { waitUntil: "networkidle" }); await pg.waitForTimeout(300);
  verifErr("plan");
  if (await deborde() > 1) pb("plan : la page défile");
  const noeuds = await pg.$$eval(".noeud-chapitre", l => l.map(a => { const r = a.getBoundingClientRect(); return { cls: a.className, r: [r.left, r.top, r.right, r.bottom] }; }));
  const chs = [...new Set(P.sections.map(s => s.chapitre))];
  if (noeuds.length !== chs.length) pb(`plan : ${noeuds.length} nœuds pour ${chs.length} chapitres`);
  noeuds.forEach((n, i) => { if (n.r[0] < 0 || n.r[2] > W || n.r[1] < 72 || n.r[3] > H) pb(`plan : nœud ${i} hors de l'écran`);
    noeuds.forEach((m, j) => { if (j > i && n.r[0] < m.r[2] && m.r[0] < n.r[2] && n.r[1] < m.r[3] && m.r[1] < n.r[3]) pb(`plan : nœuds ${i} et ${j} se chevauchent`); }); });
  if (noeuds.some(n => /encours|fait/.test(n.cls))) pb("plan : un nœud commencé sans progression");
  const nbF = await pg.$$eval(".fleches path.f", l => l.length), attendu = P.chapitres.filter(c => chs.includes(c.id)).reduce((a, c) => a + (c.avant || []).length, 0);
  if (nbF !== attendu) pb(`plan : ${nbF} flèches pour ${attendu} prérequis`);
  if (await pg.$$eval(".btn.reprendre", l => l.length) !== 1) pb("plan : pas de bouton Reprendre");
  await pg.screenshot({ path: path.join(out, "plan.png") });

  for (const ch of chs) {
    const ss = P.sections.filter(s => s.chapitre === ch);
    await pg.goto(dc + "chapitre.html?ch=" + ch, { waitUntil: "networkidle" }); await pg.waitForTimeout(200);
    verifErr("chapitre " + ch);
    if (await deborde() > 1) pb(`chapitre ${ch} : la page défile`);
    const lst = await pg.evaluate(() => [...document.querySelectorAll(".carte-ch .liste")].map(l => l.scrollHeight - l.clientHeight));
    if (lst.some(x => x > 1)) pb(`chapitre ${ch} : une liste défile (${lst})`);
    await pg.screenshot({ path: path.join(out, `chapitre-${ch}.png`) });
    // chaque section : figures et KaTeX sans erreur, rang, Précédent / Suivant, lue en bas
    for (let k = 0; k < ss.length; k++) {
      await pg.goto(dc + "cours/" + ss[k].id + ".html", { waitUntil: "networkidle" }); await pg.waitForTimeout(250);
      verifErr("section " + ss[k].id);
      const v = await pg.evaluate(() => ({ rang: (document.querySelector(".suite-section .rang") || {}).textContent, liens: [...document.querySelectorAll(".suite-section a")].map(a => a.href),
        opt: !!document.querySelector(".option-entrainer a"), katexErr: document.querySelectorAll(".katex-error").length, figs: document.querySelectorAll(".fig .dessin").length,
        notions: [...document.querySelectorAll("article.notion")].map(a => a.id) }));
      if (v.rang !== `${k + 1} / ${ss.length}`) pb(`${ss[k].id} : rang « ${v.rang} »`);
      if (v.katexErr) pb(`${ss[k].id} : ${v.katexErr} formules en erreur`);
      if (v.notions.join() !== ss[k].notions.map(n => "n-" + n).join()) pb(`${ss[k].id} : notions ${v.notions}`);
      if (!v.figs) pb(`${ss[k].id} : aucune figure dessinée`);
      if (k < ss.length - 1 && !v.liens[1].endsWith(ss[k + 1].id + ".html")) pb(`${ss[k].id} : Suivant ne mène pas à ${ss[k + 1].id}`);
      if (k === ss.length - 1 && (!v.opt || !/chapitre\.html/.test(v.liens[1]))) pb(`${ss[k].id} : fin du cours sans retour au chapitre ou sans l'option S'entraîner`);
      if (k === 0) await pg.screenshot({ path: path.join(out, `section-${ss[k].id}.png`) });
      await pg.evaluate(() => document.querySelector(".suite-section").scrollIntoView()); await pg.waitForTimeout(150);
      const lue = await pg.evaluate(([m, s]) => !!(JSON.parse(localStorage.getItem("s5-progres"))[m].sections || {})[s], [mid, ss[k].id]);
      if (!lue) pb(`${ss[k].id} : pas marquée lue en bas de page`);
    }
  }
  // Après lecture : nœuds commencés ; Reprendre mène à la dernière section ouverte
  await pg.goto(dc + "index.html", { waitUntil: "networkidle" }); await pg.waitForTimeout(200);
  if (await pg.$$eval(".noeud-chapitre.encours", l => l.length) !== chs.length) pb("plan : les chapitres lus ne sont pas « commencés »");
  const rep = await pg.$eval(".btn.reprendre", a => a.href);
  if (!rep.endsWith(P.sections.filter(s => s.chapitre === chs[chs.length - 1]).pop().id + ".html")) pb("Reprendre ne mène pas à la dernière section ouverte : " + rep);

  // S'entraîner : un exercice du premier chapitre, lien Chapitre, Revoir dans le cours vers une section
  const n0 = P.niveaux.find(n => n.chapitre === chs[0] && n.pret);
  await pg.goto(dc + "chapitre.html?ch=" + chs[0], { waitUntil: "networkidle" });
  await pg.click("#entrainer .btn"); await pg.waitForTimeout(600);
  verifErr("exercice");
  if (!pg.url().includes("plan=") || !pg.url().endsWith("#" + n0.id)) pb("S'entraîner n'ouvre pas le premier exercice : " + pg.url());
  const lc = await pg.$eval(".barre .carte-lien", a => [a.textContent, a.href]);
  if (!/^Chapitre/.test(lc[0]) || !/chapitre\.html\?ch=/.test(lc[1])) pb("exercice : le lien du haut ne mène pas au chapitre");
  const cours = await pg.$$eval(".barre .carte-lien", l => l.map(a => a.href));
  if (!cours.some(h => /\/cours\/[^/]+\.html#n-/.test(h) && h.includes(`/${P.dossierChapitres}/`))) pb("exercice : le lien Cours ne mène pas à la section");
  await pg.screenshot({ path: path.join(out, "exercice.png") });
  // voir la réponse sur chaque étape jusqu'à la fin : bouton suivant dans le chapitre
  for (let i = 0; i < 8; i++) {
    const fini = await pg.evaluate(() => document.getElementById("resultat").classList.contains("on"));
    if (fini) break;
    const vr = await pg.$(".etape:not(.sortie) .voir-reponse, .etape:not(.sortie) [data-voir]");
    const boutons = await pg.$$eval(".etape:not(.sortie) button", l => l.map(b => b.textContent.trim()));
    const iv = boutons.findIndex(t => /Voir la réponse/.test(t));
    if (iv < 0) { const ic = boutons.findIndex(t => /Continuer|Terminer/.test(t)); if (ic < 0) break; await (await pg.$$(".etape:not(.sortie) button"))[ic].click(); await pg.waitForTimeout(400); continue; }
    await (await pg.$$(".etape:not(.sortie) button"))[iv].click(); await pg.waitForTimeout(500);
    if (i === 0) {
      const rv = await pg.$(".etape:not(.sortie) .revoir");
      if (rv) { await rv.click(); await pg.waitForTimeout(900);
        const src = await pg.$eval("#fenetre-cours iframe", f => f.src);
        if (!src.includes(`/${P.dossierChapitres}/cours/`) || !src.includes("dans=1")) pb("Revoir dans le cours n'ouvre pas la section : " + src);
        const vise = await pg.frames()[1].evaluate(() => document.querySelectorAll(".repere").length).catch(() => 0);
        if (!vise) pb("Revoir dans le cours : aucun passage surligné");
        await pg.screenshot({ path: path.join(out, "revoir.png") });
        await pg.click("#fenetre-cours .fc-tete button"); }
      else pb("pas de lien Revoir dans le cours après une réponse vue");
    }
    const ic = (await pg.$$eval(".etape:not(.sortie) button", l => l.map(b => b.textContent.trim()))).findIndex(t => /Continuer|Terminer/.test(t));
    if (ic >= 0) { await (await pg.$$(".etape:not(.sortie) button"))[ic].click(); await pg.waitForTimeout(400); }
  }
  const suite = await pg.$eval("#resultat .btn-suivant", a => a.href).catch(() => "");
  const n1 = P.niveaux.filter(n => n.chapitre === chs[0] && n.pret)[1];
  if (!suite.endsWith("#" + n1.id) || !suite.includes("plan=")) pb("fin d'exercice : le bouton principal ne mène pas à l'exercice suivant du chapitre : " + suite);
  await pg.screenshot({ path: path.join(out, "fin-exercice.png") });
  verifErr("fin d'exercice");
  await b.close();
  console.log(ko ? `${ko} échec(s)` : `structure par chapitres : ${chs.length} chapitres, ${P.sections.length} sections, tout est bon (${W} × ${H})`);
  process.exit(ko ? 1 : 0);
})();
