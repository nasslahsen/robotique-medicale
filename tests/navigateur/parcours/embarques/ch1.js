"use strict";
const tous = {};
tous.definition = async (a, pg) => {
  await a.svg([180, 440]); await a.suite();
  await a.jetons(['e', 'i', 'a', 't']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(2); await a.suite();
  await a.jetons(['c', 's']); await a.suite();
};
tous.conception = async (a, pg) => {
  await a.jetons(['dsp', 'sysml', 'c', 'safety']); await a.suite();
  await a.svg([340, 125]); await a.suite();
  await a.svg([515, 370]); await a.suite();
  await a.jetons(['t', 'r', 'c']); await a.suite();
  await a.choix(1); await a.suite();
};
tous.organisation = async (a) => {
  await a.jetons(['app', 'drv', 'rtos', 'hal', 'boot']); await a.suite();
  await a.svg([375, 448]); await a.suite();
  await a.choix(1); await a.suite();
  for (const y of [196, 280, 364, 524]) await a.svg([375, y]);
  await a.suite();
  await a.choix(1); await a.suite();
};
tous.semelle = async (a) => {
  await a.jetons(['s1', 's3', 's5']); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([5]); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg([582, 252]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.tensiometre = async (a) => {
  await a.jetons(['amp', 'pga', 'adc', 'f']); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([198, 362]); await a.attendre(800); await a.suite();
  await a.svg([180, 198]); await a.suite();
  await a.jetons(['ui', 'com', 'num']); await a.suite();
  await a.choix(1); await a.suite();
};
tous['revision-systeme'] = async (a) => {
  await a.choix(1); await a.suite();
  await a.svg([340, 425]); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['amp', 'adc', 'lcd']); await a.suite();
  await a.choix(0); await a.suite();
};
tous['boss-systeme'] = async (a) => {
  await a.jetons(['drv', 'radio', 'alim']); await a.suite();
  await a.svg([140, 338]); await a.suite();
  await a.jetons(['s', 't', 'v']); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([16.7]); await a.suite();
};
module.exports = tous;
