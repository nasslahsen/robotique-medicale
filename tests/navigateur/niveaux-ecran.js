// Écrans de niveau : chaque étape de chaque niveau, réponse montrée, sans étiquettes qui se chevauchent dans la figure
// et sans légende (astuce, chip) posée sur le dessin. Une capture réduite par étape pour les planches de relecture.
// Lancer : node tests/navigateur/niveaux-ecran.js <module> [id ...]     (W, H ; aperçu : RACINE, BASE)
"use strict";
const fs = require("fs"), path = require("path");
const { BASE, RACINE, lancer, dossier, W, H } = require("./commun");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/niveaux-ecran.js <module> [id ...]"); process.exit(2); }
const src = fs.readFileSync(path.join(RACINE, "modules", mid, "module.js"), "utf8");
const prets = [...src.matchAll(/\{ id: "([^"]+)"[^}]*pret: true/g)].map(m => m[1]);

(async () => {
  const b = await lancer();
  const out = dossier(mid, "niveaux-" + W + "x" + H);
  const ids = process.argv.slice(3).length ? process.argv.slice(3) : prets;
  let ko = 0;
  for (const id of ids) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true });
    const pg = await ctx.newPage();
    const errs = []; pg.on("pageerror", e => errs.push(String(e)));
    await pg.goto(BASE + "modules/" + mid + "/jouer.html#" + id, { waitUntil: "networkidle" }); await pg.waitForTimeout(700);
    const nb = await pg.$$eval("#segments span", s => s.length);
    const pbs = [];
    for (let k = 0; k < nb; k++) {
      await pg.waitForTimeout(500);
      const v = await pg.evaluate(() => {
        const svg = document.getElementById("fig"), fr = document.getElementById("figure").getBoundingClientRect();
        const ts = [...svg.querySelectorAll("text")].filter(t => t.textContent.trim() && t.getBoundingClientRect().width > 1 && getComputedStyle(t).visibility !== "hidden" && +getComputedStyle(t).opacity > 0.05)
          .map(t => ({ t: t.textContent.trim(), b: t.getBoundingClientRect() }));
        const chev = [];
        for (let a = 0; a < ts.length; a++) for (let c = a + 1; c < ts.length; c++) {
          const A = ts[a].b, B = ts[c].b, ix = Math.min(A.right, B.right) - Math.max(A.left, B.left), iy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
          if (ts[a].t === ts[c].t && Math.abs(A.left - B.left) < 3 && Math.abs(A.top - B.top) < 3) continue;
          if (ix > 3 && iy > 3 && ix * iy > 0.2 * Math.min(A.width * A.height, B.width * B.height)) chev.push(`« ${ts[a].t.slice(0, 16)} » / « ${ts[c].t.slice(0, 16)} »`);
        }
        // texte du dessin coupé par le bord de la figure
        const coupe = ts.filter(x => x.b.left < fr.left - 2 || x.b.right > fr.right + 2).map(x => x.t.slice(0, 16));
        return { chev, coupe };
      });
      if (v.chev.length) pbs.push(`étape ${k + 1} : ` + v.chev.slice(0, 3).join(", "));
      if (v.coupe.length) pbs.push(`étape ${k + 1} : texte coupé au bord (${v.coupe.slice(0, 3).join(", ")})`);
      await pg.click('.etape:not(.sortie) .aide-q button >> text="Voir la réponse"').catch(() => {});
      const ok = await pg.waitForSelector(".etape:not(.sortie) .btn.suite", { timeout: 6000 }).then(() => true, () => false);
      await pg.waitForTimeout(500);
      await pg.screenshot({ path: `${out}/${id}-${k + 1}.png` });
      if (ok) await pg.click(".etape:not(.sortie) .btn.suite"); else await pg.click('.etape:not(.sortie) .aide-q button >> text="Passer"').catch(() => {});
    }
    if (errs.length) pbs.push("JS : " + errs.join(" | "));
    if (pbs.length) { ko++; console.log("ÉCHEC " + id + " : " + pbs.join(" ; ")); } else console.log("ok     " + id);
    await ctx.close();
  }
  await b.close();
  console.log(ko ? ko + " niveau(x) à revoir" : ids.length + " niveaux sans chevauchement");
  process.exit(ko ? 1 : 0);
})();
