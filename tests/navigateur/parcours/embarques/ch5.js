"use strict";
const tous = {};
// zones à toucher, lues dans la figure du niveau
const zone = async (pg, k) => pg.evaluate((k) => { const n = essaiJeu.n; const r = (n.zonesTest || n.zones)()[k]; return [r[0] + r[2] / 2, r[1] + r[3] / 2]; }, k);
tous.gpio = async (a, pg) => {
  await a.choix(1); await a.suite();
  for (const k of ['34', '35', '36', '39']) await a.svg(await zone(pg, k));
  await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['m', 'i', 'r']); await a.suite();
  await a.choix(0); await a.suite();
};
tous.pad = async (a) => {
  await a.bouton('IE : 0'); await a.bouton('WPU : 0'); await a.bouton('Vérifier'); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.bouton('OE : 0'); await a.bouton('Le périphérique envoie 1'); await a.bouton('Vérifier'); await a.suite();
  await a.jetons(['ie', 'oe', 'wpd', 'bp']); await a.suite();
};
tous.interruptions = async (a) => {
  await a.nombres([2]); await a.suite();
  await a.svg([340, 388]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([26, 52]); await a.suite();
  await a.choix(0); await a.suite();
};
tous['registre-gpio'] = async (a, pg) => {
  await a.svg(await zone(pg, 'cINT_TYPE')); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg(await zone(pg, 'b8')); await a.bouton('Vérifier'); await a.suite();
  await a.nombres([4]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous.adc = async (a, pg) => {
  await a.nombres([1365]); await a.suite();
  await a.nombres([2.2]); await a.suite();
  await a.svg(await zone(pg, '1-34')); await a.suite();
  await a.nombres([1023]); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['5', '18', '9']); await a.suite();
};
tous.dac = async (a) => {
  await a.nombres([2.588]); await a.suite();
  await a.curseur(0, 77); await a.suite();
  await a.nombres([12.9]); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['25', '26']); await a.suite();
  await a.choix(0); await a.suite();
};
tous.timer = async (a) => {
  await a.jetons(['64', '16', '65536']); await a.suite();
  await a.nombres([1]); await a.suite();
  await a.nombres([2000]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([40]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.watchdog = async (a) => {
  await a.bouton('Bloquer le programme'); await a.attendre(3200); await a.choix(0); await a.suite();
  await a.nombres([3]); await a.suite();
  await a.jetons(['m', 'r']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous.pwm = async (a) => {
  await a.curseur(0, 30); await a.suite();
  await a.nombres([2.475]); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['f', 'r', 'c', 'g']); await a.suite();
  await a.nombres([16]); await a.suite();
  await a.nombres([2000]); await a.suite();
};
tous['bus-esp32'] = async (a, pg) => {
  for (const k of ['21', '22']) await a.svg(await zone(pg, k));
  await a.suite();
  await a.jetons(['16', '17']); await a.suite();
  for (const k of ['23', '19', '18', '5']) await a.svg(await zone(pg, k));
  await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([6]); await a.suite();
  await a.choix(0); await a.suite();
};
tous['revision-peripheriques'] = async (a) => {
  await a.nombres([1]); await a.suite();
  await a.nombres([1.32]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([127.5]); await a.suite();
};
tous['boss-peripheriques'] = async (a) => {
  await a.choix(1); await a.suite();
  await a.nombres([30]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([3276]); await a.suite();
  await a.nombres([250]); await a.suite();
  await a.choix(0); await a.suite();
};
module.exports = tous;
