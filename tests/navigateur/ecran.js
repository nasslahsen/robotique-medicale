// Chaque figure des pages de cours tient sur un écran : le bloc (dessin + commandes) tient sous la barre,
// la colonne de droite et la bande des nombres ne débordent pas, le dessin n'est pas minuscule,
// et les étiquettes du dessin ne se chevauchent pas. Une capture d'écran par figure en défaut.
// Lancer : node tests/navigateur/ecran.js <module> [page ...]     (W et H pour la taille d'écran ; aperçu : RACINE, BASE)
"use strict";
const { BASE, lancer, dossier, pagesCours, W, H } = require("./commun");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/ecran.js <module> [page ...]"); process.exit(2); }

(async () => {
  const b = await lancer();
  const pg = await (await b.newContext({ viewport: { width: W, height: H }, hasTouch: true })).newPage();
  const out = dossier(mid, "ecran-" + W + "x" + H);
  const pages = process.argv.slice(3).length ? process.argv.slice(3) : pagesCours(mid);
  let ko = 0, n = 0;
  for (const p of pages) {
    const errs = []; const h = e => errs.push(String(e)); pg.on("pageerror", h);
    await pg.goto(`${BASE}modules/${mid}/cours/${p}.html`, { waitUntil: "networkidle" }); await pg.waitForTimeout(300);
    const nb = await pg.$$eval(".fig", f => f.length);
    for (let i = 0; i < nb; i++) {
      n++;
      await pg.evaluate(i => document.querySelectorAll(".fig")[i].scrollIntoView({ block: "start" }), i);
      await pg.waitForTimeout(150);
      const v = await pg.evaluate(i => {
        const f = document.querySelectorAll(".fig")[i], r = f.getBoundingClientRect();
        const barre = (document.querySelector(".site-barre") || { getBoundingClientRect: () => ({ bottom: 0 }) }).getBoundingClientRect().bottom;
        const cote = f.querySelector(".fig-cote"), direct = f.querySelector(".direct");
        const svgs = [...f.querySelectorAll("svg.dessin")].map(s => s.getBoundingClientRect());
        const pb = [];
        if (r.top < barre - 1 || r.bottom > innerHeight + 1) pb.push(`bloc ${Math.round(r.height)} px pour ${Math.round(innerHeight - barre)} px`);
        if (cote && cote.scrollHeight > cote.clientHeight + 2) pb.push(`colonne de droite déborde de ${cote.scrollHeight - cote.clientHeight} px`);
        if (direct && direct.offsetParent) {
          const trop = [direct].concat([...direct.querySelectorAll(".katex-display, table, .tableau")]).map(x => x.scrollWidth - x.clientWidth).reduce((a, b) => Math.max(a, b), 0);
          if (trop > 2) pb.push(`bande des nombres trop large de ${trop} px`);
        }
        svgs.forEach((s, k) => { if (s.width < 380 && s.height < 300) pb.push(`dessin ${k} petit (${Math.round(s.width)} × ${Math.round(s.height)})`); });
        // étiquettes qui se chevauchent (textes SVG visibles, boîtes à l'écran, marge de 2 px)
        const ts = [...f.querySelectorAll("svg.dessin text")].filter(t => t.textContent.trim() && getComputedStyle(t).opacity !== "0" && t.getAttribute("opacity") !== "0")
          .map(t => ({ t: t.textContent.trim(), b: t.getBoundingClientRect() })).filter(x => x.b.width > 1);
        const chev = [];
        for (let a = 0; a < ts.length; a++) for (let c = a + 1; c < ts.length; c++) {
          const A = ts[a].b, B = ts[c].b, ix = Math.min(A.right, B.right) - Math.max(A.left, B.left), iy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
          if (ts[a].t === ts[c].t && Math.abs(A.left - B.left) < 3 && Math.abs(A.top - B.top) < 3) continue; // même texte doublé (halo)
          if (ix > 3 && iy > 3 && ix * iy > 0.2 * Math.min(A.width * A.height, B.width * B.height)) chev.push(`« ${ts[a].t.slice(0, 18)} » / « ${ts[c].t.slice(0, 18)} »`);
        }
        if (chev.length) pb.push("étiquettes qui se chevauchent : " + chev.slice(0, 4).join(", ") + (chev.length > 4 ? ` (+${chev.length - 4})` : ""));
        return { id: f.id, pb };
      }, i);
      if (v.pb.length) {
        ko++;
        console.log(`ÉCHEC ${p} #${v.id} : ${v.pb.join(" ; ")}`);
        await pg.screenshot({ path: `${out}/${p}-${i}.png` });
      }
    }
    pg.off("pageerror", h);
    if (errs.length) { ko++; console.log(`ÉCHEC ${p} : JS ${errs.join(" | ")}`); }
  }
  await b.close();
  console.log(ko ? `${ko} figure(s) en défaut sur ${n} (${W} × ${H}), captures dans ${out}` : `${n} figures tiennent sur l'écran (${W} × ${H})`);
  process.exit(ko ? 1 : 0);
})();
