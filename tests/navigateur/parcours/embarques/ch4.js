// Parcours du chapitre 4 (l'ESP32 : la carte et la puce).
"use strict";
const tous = {};
// toucher la zone k de la figure (essaiJeu.n.zones)
const zone = async (a, pg, k) => { const r = await pg.evaluate((k) => essaiJeu.n.zones[k], k); await a.svg([r[0] + r[2] / 2, r[1] + r[3] / 2]); };

tous.esp32 = async (a, pg) => {
  await a.choix(2); await a.suite();
  await a.choix(1); await a.suite();
  for (const k of [1, 4, 6, 3]) await zone(a, pg, k);
  await a.suite();
  await a.jetons(['d', 'f', 'h', 'q']); await a.suite();
  await a.choix(1); await a.suite();
};
tous.devkit = async (a, pg) => {
  for (const k of ['cp2102', 'reg', 'wroom', 'antenne', 'ledb']) await zone(a, pg, k);
  await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  for (const k of ['g3', 'g7', 'd4']) await zone(a, pg, k);
  await a.suite();
  await a.nombres([4]); await a.suite();
};
tous.specifications = async (a, pg) => {
  for (const k of ['crypto', 'core', 'rtc', 'p12', 'wifi']) await zone(a, pg, k);
  await a.suite();
  await a.nombres([2.5]); await a.suite();
  await a.jetons(['a', 'b', 'c']); await a.suite();
  await a.choix(2); await a.suite();
  await a.nombres([4, 2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous['coeurs-memoire'] = async (a, pg) => {
  await a.choix(1); await a.suite();
  await a.jetons(['p', 'a']); await a.suite();
  await a.jetons(['c', 'm', 'e']); await a.suite();
  await a.choix(1); await a.suite();
  for (const k of ['periph', 'rom', 'sram', 'rtcslow']) { await zone(a, pg, k); await a.attendre(800); }
  await a.suite();
  await a.choix(1); await a.suite();
};
tous.alimentation = async (a, pg) => {
  await zone(a, pg, 'rtcpin'); await a.suite();
  await zone(a, pg, 'ldo18'); await zone(a, pg, 'r6'); await a.suite();
  await a.nombres([2.2]); await a.suite();
  await a.nombres([0.3, 3]); await a.suite();
  await a.jetons(['s', 'u', 'u']); await a.suite();
};
tous['revision-esp32'] = async (a) => {
  await a.jetons(['d', 'z', 'q', 'v']); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([10000]); await a.suite();
  await a.choix(1); await a.suite();
};
tous['boss-esp32'] = async (a) => {
  await a.nombres([2, 2, 0]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([6.25, 4.17]); await a.suite();
  await a.jetons(['21', '22', '23', '18']); await a.suite();
  await a.choix(1); await a.suite();
};
module.exports = tous;
