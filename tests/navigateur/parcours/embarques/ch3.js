"use strict";
// Chapitre 3 : bus de communication
const tous = {};
tous.bus = async (a) => {
  await a.svg([300, 190]); await a.suite();
  await a.nombres([21]); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['u', 's', 'i']); await a.suite();
};
tous.uart = async (a) => {
  await a.choix(0); await a.suite();
  // trame de 75 : start 0, puis 1 1 0 1 0 0 1 0, stop 1 (tout part de 1)
  for (const k of [1, 4, 6, 7, 9]) await a.svg([22 + k * 53 + 26, 130]);
  await a.bouton('Vérifier'); await a.suite();
  await a.nombres([37]); await a.suite();
  await a.nombres([1.042, 960]); await a.suite();
  await a.choix(1); await a.suite();
};
tous['uart-materiel'] = async (a) => {
  await a.jetons(['r', 's', 'p']); await a.suite();
  await a.svg([95, 153]); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([634, 145]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous.spi = async (a) => {
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  for (let k = 0; k < 6; k++) await a.bouton("Coup d'horloge");
  await a.suite();
  await a.jetons(['o', 'i', 'k']); await a.suite();
  await a.nombres([4]); await a.suite();
  await a.choix(1); await a.suite();
};
tous['spi-esclaves'] = async (a) => {
  await a.svg([423, 150]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([7, 13]); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([423, 150]); await a.svg([91, 150]); await a.suite();
};
tous.i2c = async (a) => {
  await a.svg([340, 420]); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([125, 420]); await a.svg([555, 420]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([16]); await a.suite();
};
tous['i2c-trame'] = async (a, pg) => {
  await a.jetons(['s', 'a', 'r', 'k', 'd', 'k', 'd', 'n', 'p']); await a.suite();
  const x = await pg.evaluate(() => essaiJeu.n.pos[3] + 28); await a.svg([x, 260]); await a.suite();
  await a.nombres([27]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([128]); await a.suite();
  await a.choix(0); await a.suite();
};
tous['revision-bus'] = async (a) => {
  await a.jetons(['i', 's', 'u']); await a.suite();
  await a.svg([22 + 10 * 53 + 26, 145]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([36]); await a.suite();
  await a.nombres([86.8]); await a.suite();
};
tous['boss-bus'] = async (a) => {
  for (const k of [0, 2, 4, 5, 6, 7]) await a.svg([84 + k * 64 + 32, 216]);
  await a.bouton('Vérifier'); await a.suite();
  await a.nombres([27]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([3.125]); await a.suite();
  await a.choix(0); await a.suite();
};
module.exports = tous;
