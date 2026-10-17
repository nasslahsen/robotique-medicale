"use strict";
const tous = {};
// touche les bits d'index donnés (zones du registre), dans l'ordre
const toucherBits = async (a, pg, ks) => { for (const k of ks) { const r = await pg.evaluate((k) => essaiJeu.n.zones()[k], k); await a.svg([r[0] + r[2] / 2, r[1] + r[3] / 2]); } };

tous.binaire = async (a, pg) => {
  await toucherBits(a, pg, [2, 5, 7]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([200]); await a.suite();
  await a.nombres([255, 4095]); await a.suite();
  await a.jetons(['a', 'b', 'c']); await a.suite();
};
tous.hexadecimal = async (a, pg) => {
  await toucherBits(a, pg, [0, 2, 5, 7]); await a.suite();
  await a.choix(0); await a.nombres([60]); await a.suite();
  await a.jetons(['9', '4']); await a.suite();
  await a.nombres([2]); await a.suite();
  await toucherBits(a, pg, [9]); await a.suite();
  await a.nombres([16384]); await a.suite();
};
tous.signaux = async (a, pg) => {
  const fr = await pg.evaluate(() => essaiJeu.n.fronts().filter(f => f.montant).map(f => f.x));
  for (const x of fr) await a.svg([x, 245]);
  await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([125]); await a.suite();
  await a.nombres([104.17]); await a.suite();
  await a.jetons(['s', 'a']); await a.suite();
};
tous['revision-bases'] = async (a, pg) => {
  for (const k of [1, 2, 7]) await a.svg([52 + k * 72 + 36, 262]);
  await a.suite();
  await a.choix(2); await a.suite();
  await a.nombres([65535]); await a.suite();
  await a.nombres([3]); await a.suite();
  await a.nombres([25]); await a.suite();
};
tous['boss-bases'] = async (a) => {
  await a.jetons(['a', '1', 'f', '4']); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([2]); await a.suite();
  await a.nombres([500]); await a.suite();
  await a.nombres([0.403]); await a.suite();
};
module.exports = tous;
