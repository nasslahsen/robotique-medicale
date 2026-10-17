"use strict";
// Chapitre 2 : architectures matérielles
const tous = {};
const centre = (pg, mode, k) => pg.evaluate((a) => { const b = essaiJeu.n.ZONES[a[0]][a[1]]; return [b[0] + b[2] / 2, b[1] + b[3] / 2]; }, [mode, k]);
tous.controleur = async (a, pg) => {
  await a.svg(await centre(pg, 's6', 'afe')); await a.suite();
  for (const k of ['afe', 'cpu', 'da']) await a.svg(await centre(pg, 's6', k));
  await a.suite();
  await a.jetons(['w', 'c', 'p', 'd']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg(await centre(pg, 'ec', 'supply')); await a.suite();
};
tous['von-neumann-harvard'] = async (a, pg) => {
  await a.choix(1); await a.suite();
  await a.nombres([8]); await a.attendre(2400); await a.suite();
  await a.jetons(['pa', 'pd', 'da', 'dd']); await a.suite();
  await a.nombres([5]); await a.attendre(1600); await a.suite();
  await a.svg([580, 335]); await a.suite();
  await a.nombres([20, 11]); await a.attendre(3200); await a.suite();
};
tous['cisc-risc'] = async (a) => {
  await a.jetons(['c', 'r']); await a.suite();
  await a.jetons(['c1', 'r1', 'c2', 'r2', 'c3', 'r3']); await a.suite();
  await a.nombres([1, 4]); await a.attendre(3200); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
const zone = (pg, k) => pg.evaluate((k) => { const b = essaiJeu.n.zones()[k]; return [b[0] + b[2] / 2, b[1] + b[3] / 2]; }, k);
tous.avr = async (a, pg) => {
  await a.svg(await zone(pg, 'adc')); await a.suite();
  await a.svg(await zone(pg, 'twi')); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg(await zone(pg, 'uc3')); await a.suite();
  await a.svg(await zone(pg, 'ATmega2560')); await a.suite();
  await a.svg(await zone(pg, 'ATmega1284P')); await a.suite();
};
tous.arm = async (a) => {
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['mmu', 'mpu', 'dsp', 'fpu']); await a.suite();
  await a.jetons(['a', 'r', 'm', 'c']); await a.suite();
  await a.choix(2); await a.suite();
  await a.nombres([64]); await a.suite();
};
const z2 = (pg, mode, k) => pg.evaluate((a) => { const b = essaiJeu.n.Z[a[0]][a[1]]; return [b[0] + b[2] / 2, b[1] + b[3] / 2]; }, [mode, k]);
tous['arm-interne'] = async (a, pg) => {
  await a.svg(await z2(pg, 'systeme', 'bridge')); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['amba', 'adk', 'act', 'pc']); await a.suite();
  await a.nombres([2, 1, 15]); await a.suite();
  for (const k of ['bank', 'shift', 'alu']) await a.svg(await z2(pg, 'coeur', k));
  await a.suite();
  await a.choix(0); await a.suite();
};
tous['revision-architectures'] = async (a) => {
  await a.jetons(['afe', 'dip']); await a.suite();
  await a.nombres([12, 7]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['s', 'p']); await a.suite();
  await a.choix(1); await a.suite();
};
tous['boss-architectures'] = async (a, pg) => {
  await a.choix(1); await a.suite();
  await a.nombres([50, 26]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg(await zone(pg, 'ATmega1280')); await a.suite();
  await a.choix(0); await a.suite();
};
module.exports = tous;
