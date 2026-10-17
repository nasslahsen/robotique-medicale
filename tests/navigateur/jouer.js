// Joue chaque niveau d'un module comme un joueur et vérifie l'écran de fin : 3 étoiles, aucune erreur JavaScript ni KaTeX.
// Lancer : node tests/navigateur/jouer.js <module> [id ...]     (CAPTURES=1 pour garder une capture par étape)
"use strict";
const { BASE, lancer, dossier, W, H } = require("./commun");
const aides = require("./aides");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/jouer.js <module> [id ...]"); process.exit(2); }
const tous = require("./parcours/" + mid + ".js");

(async () => {
  const b = await lancer();
  const ids = process.argv.slice(3).length ? process.argv.slice(3) : Object.keys(tous);
  if (process.env.CAPTURES) process.env.CAPTURES = dossier(mid, "etapes");
  const fin = dossier(mid, "fins");
  let ko = 0;
  for (const id of ids) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true });
    const pg = await ctx.newPage();
    const errs = []; pg.on("pageerror", e => errs.push(String(e)));
    await pg.goto(BASE + "modules/" + mid + "/jouer.html#" + id, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    let msg = "";
    try { await tous[id](aides(pg, id), pg); } catch (e) { msg = String(e).split("\n")[0]; }
    await pg.waitForTimeout(800);
    const etoiles = await pg.evaluate(() => { const r = document.getElementById("resultat"); return r.classList.contains("on") ? r.querySelectorAll(".etoiles .pleine").length : -1; });
    const kerr = await pg.$$eval(".katex-error", e => e.length);
    await pg.screenshot({ path: `${fin}/${id}.png` });
    const ok = etoiles === 3 && !errs.length && !kerr && !msg;
    if (!ok) ko++;
    console.log((ok ? "ok    " : "ÉCHEC ") + id + (ok ? "" : " étoiles=" + etoiles) + (msg ? " " + msg : "") + (errs.length ? " JS: " + errs.join(" | ") : "") + (kerr ? " katex=" + kerr : ""));
    await ctx.close();
  }
  await b.close();
  console.log(ko ? ko + " niveau(x) en échec" : ids.length + " niveaux réussis avec 3 étoiles");
  process.exit(ko ? 1 : 0);
})();
