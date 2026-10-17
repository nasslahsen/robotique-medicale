// Charge le tableau de bord et toutes les pages d'un module : aucune erreur JavaScript ou KaTeX,
// pas de défilement horizontal, chaque niveau marqué « cours » a sa page.
// Lancer : node tests/navigateur/pages.js <module>
"use strict";
const { BASE, lancer, pagesCours, W, H } = require("./commun");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/pages.js <module>"); process.exit(2); }

(async () => {
  const b = await lancer();
  const pg = await (await b.newContext({ viewport: { width: W, height: H } })).newPage();
  const urls = ["index.html", `modules/${mid}/index.html`, `modules/${mid}/cours/index.html`].concat(pagesCours(mid).map(p => `modules/${mid}/cours/${p}.html`));
  let ko = 0;
  for (const u of urls) {
    const errs = [], h = e => errs.push(String(e)), r = rep => { if (rep.status() >= 400) errs.push(rep.status() + " " + rep.url()); };
    pg.on("pageerror", h); pg.on("response", r);
    await pg.goto(BASE + u, { waitUntil: "networkidle" }); await pg.waitForTimeout(300);
    const v = await pg.evaluate(() => ({ katex: document.querySelectorAll(".katex-error").length, large: document.documentElement.scrollWidth > innerWidth + 1 }));
    pg.off("pageerror", h); pg.off("response", r);
    const ok = !errs.length && !v.katex && !v.large;
    if (!ok) ko++;
    console.log((ok ? "ok    " : "ÉCHEC ") + u + (v.katex ? " katex=" + v.katex : "") + (v.large ? " défilement horizontal" : "") + (errs.length ? " " + errs.join(" | ") : ""));
  }
  await b.close();
  console.log(ko ? ko + " page(s) en échec" : urls.length + " pages sans erreur");
  process.exit(ko ? 1 : 0);
})();
