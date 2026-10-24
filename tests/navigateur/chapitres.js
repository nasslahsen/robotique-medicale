// Structure par chapitres : plan, écrans de chapitre, sections du cours, S'entraîner.
// Vérifie : aucune erreur, plan et écran de chapitre sans défilement, état des nœuds, cours du chapitre sur une page
// (sections dans l'ordre, « 2 / 4 » dans la barre qui suit la lecture, section lue quand on passe sa fin), fin du cours avec l'option S'entraîner, exercice ouvert depuis S'entraîner (lien Chapitre,
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
    // le cours du chapitre : une page, toutes les sections, la barre suit la lecture, chaque section lue en passant sa fin
    await pg.goto(dc + `cours/chapitre-${ch}.html`, { waitUntil: "networkidle" }); await pg.waitForTimeout(300);
    verifErr("cours du chapitre " + ch);
    const v = await pg.evaluate(() => ({ parties: [...document.querySelectorAll("section.partie")].map(x => x.id), notions: [...document.querySelectorAll("article.notion")].map(a => a.id),
      katexErr: document.querySelectorAll(".katex-error").length, figs: document.querySelectorAll(".fig .dessin").length, vides: [...document.querySelectorAll(".fig")].filter(f => !f.querySelector(".dessin")).length,
      fin: !!document.querySelector(".fin-cours a.aller[href*='chapitre.html']"), opt: !!document.querySelector(".fin-cours .option-entrainer a"),
      boutons: document.querySelectorAll(".suite-section, .suite").length }));
    if (v.parties.join() !== ss.map(x => "s-" + x.id).join()) pb(`chapitre ${ch} : sections ${v.parties}`);
    if (v.notions.join() !== ss.flatMap(x => x.notions).map(n => "n-" + n).join()) pb(`chapitre ${ch} : notions ${v.notions}`);
    if (v.katexErr) pb(`chapitre ${ch} : ${v.katexErr} formules en erreur`);
    if (!v.figs || v.vides) pb(`chapitre ${ch} : ${v.vides} figures pas dessinées`);
    if (!v.fin || !v.opt) pb(`chapitre ${ch} : fin du cours sans retour au chapitre ou sans l'option S'entraîner`);
    if (v.boutons) pb(`chapitre ${ch} : boutons entre les sections`);
    await pg.screenshot({ path: path.join(out, `cours-${ch}-debut.png`) });
    for (let k = 0; k < ss.length; k++) {
      await pg.evaluate(id => document.getElementById(id).scrollIntoView({ block: "start" }), "s-" + ss[k].id); await pg.waitForTimeout(250);
      const r = await pg.$eval(".rang-barre", e => e.textContent);
      if (k < ss.length - 1 && r !== `${k + 1} / ${ss.length}`) pb(`chapitre ${ch}, section ${k + 1} : la barre indique « ${r} »`);
      if (k === 1) await pg.screenshot({ path: path.join(out, `cours-${ch}-section-2.png`) });
      await pg.evaluate(id => document.querySelector(`.fin-partie[data-section="${id}"]`).scrollIntoView({ block: "center" }), ss[k].id); await pg.waitForTimeout(200);
      const lue = await pg.evaluate(([m, s]) => !!(JSON.parse(localStorage.getItem("s5-progres"))[m].sections || {})[s], [mid, ss[k].id]);
      if (!lue) pb(`${ss[k].id} : pas marquée lue en passant sa fin`);
    }
    await pg.evaluate(() => scrollTo(0, 1e7)); await pg.waitForTimeout(1000);
    if (await pg.$eval(".rang-barre", e => e.textContent) !== `${ss.length} / ${ss.length}`) pb(`chapitre ${ch} : en bas, la barre n'indique pas la dernière section`);
    await pg.screenshot({ path: path.join(out, `cours-${ch}-fin.png`) });
  }
  // Après lecture : nœuds commencés ; Reprendre mène à la dernière section ouverte
  await pg.goto(dc + "index.html", { waitUntil: "networkidle" }); await pg.waitForTimeout(200);
  if (await pg.$$eval(".noeud-chapitre.encours", l => l.length) !== chs.length) pb("plan : les chapitres lus ne sont pas « commencés »");
  const rep = await pg.$eval(".btn.reprendre", a => a.href);
  if (!rep.endsWith(`chapitre-${chs[chs.length - 1]}.html#s-` + P.sections.filter(s => s.chapitre === chs[chs.length - 1]).pop().id)) pb("Reprendre ne mène pas à la dernière section lue : " + rep);

  // S'entraîner : un exercice du premier chapitre, lien Chapitre, Revoir dans le cours vers une section
  const n0 = P.niveaux.find(n => n.chapitre === chs[0] && n.pret);
  await pg.goto(dc + "chapitre.html?ch=" + chs[0], { waitUntil: "networkidle" });
  await pg.click("#entrainer .btn"); await pg.waitForTimeout(600);
  verifErr("exercice");
  if (!pg.url().includes("plan=") || !pg.url().endsWith("#" + n0.id)) pb("S'entraîner n'ouvre pas le premier exercice : " + pg.url());
  const lc = await pg.$eval(".barre .carte-lien", a => [a.textContent, a.href]);
  if (!/^Chapitre/.test(lc[0]) || !/chapitre\.html\?ch=/.test(lc[1])) pb("exercice : le lien du haut ne mène pas au chapitre");
  const cours = await pg.$$eval(".barre .carte-lien", l => l.map(a => a.href));
  if (!cours.some(h => /\/cours\/chapitre-\d+\.html#n-/.test(h) && h.includes(`/${P.dossierChapitres}/`))) pb("exercice : le lien Cours ne mène pas au cours du chapitre");
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
        if (!/\/cours\/chapitre-\d+\.html\?dans=1#/.test(src) || !src.includes(`/${P.dossierChapitres}/`)) pb("Revoir dans le cours n'ouvre pas le cours du chapitre : " + src);
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
