// « Voir la réponse » et « Passer » sur chaque question de chaque niveau d'un module.
// Mode reveler (par défaut) : chaque question doit donner sa réponse puis « Continuer » ; l'écran de fin liste
// toutes les étapes, et « Réessayer » ramène à l'étape puis au bilan. Mode passer : on passe tout.
// Lancer : node tests/navigateur/reveler.js <module> [id ...]     (MODE=passer pour le second mode)
"use strict";
const fs = require("fs"), path = require("path");
const { BASE, RACINE, lancer, dossier, W, H } = require("./commun");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/reveler.js <module> [id ...]"); process.exit(2); }
const MODE = process.env.MODE || "reveler";

// identifiants des niveaux prêts, lus dans module.js
const src = fs.readFileSync(path.join(RACINE, "modules", mid, "module.js"), "utf8");
const prets = [...src.matchAll(/\{ id: "([^"]+)"[^}]*pret: true/g)].map(m => m[1]);

(async () => {
  const b = await lancer();
  const ids = process.argv.slice(3).length ? process.argv.slice(3) : prets;
  const fin = dossier(mid, MODE);
  let ko = 0;
  for (const id of ids) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true });
    const pg = await ctx.newPage();
    const errs = []; pg.on("pageerror", e => errs.push(String(e)));
    await pg.goto(BASE + "modules/" + mid + "/jouer.html#" + id, { waitUntil: "networkidle" }); await pg.waitForTimeout(700);
    const nEtapes = await pg.$$eval("#segments span", s => s.length);
    const sansReponse = [];
    for (let k = 0; k < nEtapes; k++) {
      await pg.waitForTimeout(600);
      if (MODE === "passer") { await pg.click('.etape:not(.sortie) .aide-q button >> text="Passer"'); continue; }
      await pg.click('.etape:not(.sortie) .aide-q button >> text="Voir la réponse"');
      // la réponse arrive avec « Continuer » (au plus quelques secondes pour les questions en plusieurs temps)
      const ok = await pg.waitForSelector(".etape:not(.sortie) .btn.suite", { timeout: 6000 }).then(() => true, () => false);
      if (!ok) { sansReponse.push(k + 1); await pg.click('.etape:not(.sortie) .aide-q button >> text="Passer"'); continue; }
      await pg.waitForTimeout(300);
      await pg.click(".etape:not(.sortie) .btn.suite");
    }
    await pg.waitForTimeout(900);
    const bilan = await pg.evaluate(() => {
      const r = document.getElementById("resultat");
      return { on: r.classList.contains("on"), lignes: r.querySelectorAll(".a-revoir > div").length, etoiles: r.querySelectorAll(".etoiles .pleine").length };
    });
    await pg.screenshot({ path: `${fin}/${id}.png` });
    // Réessayer la première question de la liste : retour à l'étape, puis au bilan
    let rejeu = "";
    if (bilan.on && bilan.lignes) {
      await pg.click("#resultat .a-revoir .btn"); await pg.waitForTimeout(900);
      const titre = await pg.$eval(".etape:not(.sortie) h2", h => h.textContent.length).catch(() => 0);
      if (!titre) rejeu = "rejeu sans question";
      else if (MODE === "reveler" && !sansReponse.includes(1)) {
        await pg.click('.etape:not(.sortie) .aide-q button >> text="Voir la réponse"');
        await pg.waitForSelector('.etape:not(.sortie) .btn.suite >> text="Revenir au bilan"', { timeout: 6000 }).then(() => pg.click(".etape:not(.sortie) .btn.suite"), () => { rejeu = "pas de « Revenir au bilan »"; });
        await pg.waitForTimeout(900);
        const de = await pg.evaluate(() => document.getElementById("resultat").classList.contains("on"));
        if (!de && !rejeu) rejeu = "pas de retour au bilan";
      }
    }
    const kerr = await pg.$$eval(".katex-error", e => e.length);
    const bon = bilan.on && bilan.lignes === nEtapes && bilan.etoiles === 0 && !sansReponse.length && !errs.length && !kerr && !rejeu;
    if (!bon) ko++;
    console.log((bon ? "ok    " : "ÉCHEC ") + id + ` (${nEtapes} étapes)` +
      (sansReponse.length ? " sans réponse : étapes " + sansReponse.join(", ") : "") +
      (bilan.on ? (bilan.lignes !== nEtapes ? ` bilan=${bilan.lignes} lignes` : "") + (bilan.etoiles ? ` étoiles=${bilan.etoiles}` : "") : " pas d'écran de fin") +
      (rejeu ? " " + rejeu : "") + (errs.length ? " JS: " + errs.join(" | ") : "") + (kerr ? " katex=" + kerr : ""));
    await ctx.close();
  }
  await b.close();
  console.log(ko ? ko + " niveau(x) en échec" : ids.length + " niveaux vérifiés (" + MODE + ")");
  process.exit(ko ? 1 : 0);
})();
