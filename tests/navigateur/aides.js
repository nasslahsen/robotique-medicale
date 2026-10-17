// Gestes de joueur pour les parcours de test : glisser, toucher, choisir, taper des nombres, poser des jetons.
// Chaque parcours (parcours/<module>.js) reçoit ces aides pour jouer un niveau du début à la fin sans erreur.
"use strict";
const R = (d) => d * Math.PI / 180;

function aides(pg, id) {
  let num = 0;
  const ecran = (v) => pg.evaluate((v) => { const s = document.getElementById('fig'), q = essaiJeu.n.pl.P(v), p = s.createSVGPoint(); p.x = q[0]; p.y = q[1]; const r = p.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, v);
  const a = {
    attendre: (ms) => pg.waitForTimeout(ms),
    // tourne en suivant le cercle de rayon r (unités du plan)
    tourner: async (de, vers, r = 1, pas = 14) => {
      let p = await ecran([r * Math.cos(R(de)), r * Math.sin(R(de))]);
      await pg.mouse.move(p[0], p[1]); await pg.mouse.down();
      for (let k = 1; k <= pas; k++) { const t = de + (vers - de) * k / pas; p = await ecran([r * Math.cos(R(t)), r * Math.sin(R(t))]); await pg.mouse.move(p[0], p[1]); }
      await pg.mouse.up(); await pg.waitForTimeout(700);
    },
    glisser: async (de, vers, pas = 10) => {
      let p = await ecran(de); await pg.mouse.move(p[0], p[1]); await pg.mouse.down();
      for (let k = 1; k <= pas; k++) { p = await ecran([de[0] + (vers[0] - de[0]) * k / pas, de[1] + (vers[1] - de[1]) * k / pas]); await pg.mouse.move(p[0], p[1]); }
      await pg.mouse.up(); await pg.waitForTimeout(600);
    },
    svg: async (q) => { const p = await pg.evaluate((q) => { const s = document.getElementById('fig'), p = s.createSVGPoint(); p.x = q[0]; p.y = q[1]; const r = p.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, q); await pg.mouse.click(p[0], p[1]); await pg.waitForTimeout(400); },
    bascules: async (ks) => { for (const k of ks) { await pg.evaluate((k) => { const z = [...document.querySelectorAll('.etape:not(.sortie) div')].find(d => d.children.length === 6 && [...d.children].every(c => c.tagName === 'BUTTON')); z.children[k].click(); }, k); await pg.waitForTimeout(150); } },
    toucher: async (v) => { const p = await ecran(v); await pg.mouse.click(p[0], p[1]); await pg.waitForTimeout(300); },
    choix: async (k) => { const b = await pg.$$('.etape:not(.sortie) .choix:last-of-type button'); const l = await pg.$$('.etape:not(.sortie) .choix'); const bs = await l[l.length - 1].$$('button'); await bs[k].click(); await pg.waitForTimeout(700); },
    nombres: async (vals) => {
      const cs = await pg.$$('.etape:not(.sortie) .saisie');
      for (let i = 0; i < vals.length; i++) {
        await cs[i].click();
        for (const ch of String(vals[i]).replace('.', ',').replace('-', '−')) await pg.click(`.etape:not(.sortie) .clavier .touche >> text="${ch}"`);
      }
      await pg.click('.etape:not(.sortie) .touche.ok'); await pg.waitForTimeout(700);
    },
    jetons: async (ordre) => { // ordre[k] = id du jeton à mettre dans le trou k
      const trous = await pg.$$('.etape:not(.sortie) .trou');
      for (let k = 0; k < ordre.length; k++) {
        const t = await pg.$(`.etape:not(.sortie) .jetons .jeton[data-id="${ordre[k]}"]`); const bb = await t.boundingBox(), tb = await trous[k].boundingBox();
        await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await pg.mouse.down();
        await pg.mouse.move(bb.x + bb.width / 2 + 20, bb.y + 10, { steps: 3 }); await pg.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 6 }); await pg.mouse.up(); await pg.waitForTimeout(200);
      }
      await pg.click('.etape:not(.sortie) .btn.bleu'); await pg.waitForTimeout(800);
    },
    curseur: async (k, v) => { await pg.$$eval('.etape:not(.sortie) .curseur input', (els, a) => { els[a.k].value = a.v; els[a.k].dispatchEvent(new Event('input')); }, { k, v }); await pg.waitForTimeout(300); },
    bouton: async (txt) => { await pg.click(`.etape:not(.sortie) button >> text="${txt}"`); await pg.waitForTimeout(400); },
    cellule: async (i, j) => { await pg.click(`#bande button[data-i="${i}"][data-j="${j}"]`); await pg.waitForTimeout(400); },
    cadran: async (v, vue) => {
      const bb = await (await pg.$('#coin .cadran svg')).boundingBox();
      const th0 = vue ? await pg.evaluate(() => { const a = essaiJeu.n.sc.az * Math.PI / 180; return Math.atan2(-Math.cos(a), -Math.sin(a)) * 180 / Math.PI; }) : 0;
      const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2, r = bb.width * 84 / 236, t = (v + th0) * Math.PI / 180;
      await pg.mouse.move(cx + r * Math.cos(t), cy - r * Math.sin(t)); await pg.mouse.down(); await pg.mouse.move(cx + r * Math.cos(t) + 1, cy - r * Math.sin(t)); await pg.mouse.up(); await pg.waitForTimeout(600);
    },
    suite: async () => { await pg.waitForTimeout(500); if (process.env.CAPTURES) await pg.screenshot({ path: `${process.env.CAPTURES}/${id}-${++num}.png` }); await pg.click('.etape:not(.sortie) .btn.suite'); await pg.waitForTimeout(900); }
  };
  return a;
}

module.exports = aides;
