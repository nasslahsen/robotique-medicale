// Parcours de test du module Systèmes embarqués : pour chaque niveau, la suite de gestes qui le réussit sans erreur.
// Lancer : node tests/navigateur/jouer.js embarques [id ...]
"use strict";
const tous = {};

// Chapitre 0 (bloc : les aides locales de chaque chapitre restent séparées)
{
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
}

// Chapitre 1 (bloc : les aides locales de chaque chapitre restent séparées)
{
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
}

// Chapitre 2 (bloc : les aides locales de chaque chapitre restent séparées)
{
// Chapitre 2 : architectures matérielles

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
}

// Chapitre 3 (bloc : les aides locales de chaque chapitre restent séparées)
{
// Chapitre 3 : bus de communication

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
}

// Chapitre 4 (bloc : les aides locales de chaque chapitre restent séparées)
{
// Parcours du chapitre 4 (l'ESP32 : la carte et la puce).

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
}

// Chapitre 5 (bloc : les aides locales de chaque chapitre restent séparées)
{
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
}

module.exports = tous;
