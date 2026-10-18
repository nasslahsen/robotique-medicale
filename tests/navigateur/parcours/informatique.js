// Parcours de test du module Informatique médicale : pour chaque niveau, la suite de gestes qui le réussit sans erreur.
// Lancer : node tests/navigateur/jouer.js informatique [id ...]
"use strict";
const tous = {};

// centre de la carte i d'une grille SIS.grille(n, col, x, y, w, h, e)
const grille = (col, x, y, w, h, e) => (i) => { const lw = (w - (col - 1) * e) / col; return [x + (i % col) * (lw + e) + lw / 2, y + Math.floor(i / col) * (h + e) + h / 2]; };
// ranger : chaque carte puis son bac
const trier = async (a, carte, bac, bacs) => { for (let i = 0; i < bacs.length; i++) { await a.svg(carte(i)); await a.svg(bac(bacs[i])); } };
// relier : chaque élément de gauche puis son partenaire à droite
const paires = async (a, g, d, bon) => { for (let i = 0; i < bon.length; i++) { await a.svg(g(i)); await a.svg(d(bon[i])); } };
// toucher dans l'ordre
const ordre = async (a, pos, liste) => { for (const i of liste) await a.svg(pos(i)); };

/* ---------- Chapitre 1 : les bases du SI ---------- */
tous["informatique-medicale"] = async (a) => {
  await trier(a, grille(2, 30, 60, 620, 100, 22), (k) => [177.5 + 325 * k, 475], [0, 1, 0, 1]); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([340, 317]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
};
tous["donnee-information"] = async (a) => {
  await a.jetons(["i", "o", "b"]); await a.suite();
  await trier(a, grille(2, 20, 20, 640, 84, 14), (k) => [340, [370, 460, 550][k]], [2, 1, 2, 1, 0, 2]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
};
tous["systeme-information"] = async (a) => {
  await paires(a, (i) => [196, 78 + 92 * i], (k) => [560, 78 + 92 * k], [2, 5, 3, 1, 0, 4]); await a.suite();
  await a.choix(0); await a.suite();
  await paires(a, (i) => [150, 100 + 100 * i], (k) => [490, 100 + 100 * k], [2, 4, 3, 0, 1]); await a.suite();
  await trier(a, (i) => [144, 117 + 125 * i], (k) => [480, 117 + 125 * k], [2, 0, 3, 1]); await a.suite();
  await a.choix(1); await a.suite();
};
tous["revision-si"] = async (a) => {
  await trier(a, grille(2, 30, 60, 620, 110, 22), (k) => [177.5 + 325 * k, 475], [0, 1, 0, 1]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(3); await a.suite();
  await a.choix(0); await a.suite();
};
tous["boss-si"] = async (a) => {
  await paires(a, (i) => [206, 92 + 104 * i], (k) => [560, 92 + 104 * k], [2, 4, 0, 3, 1]); await a.suite();
  await trier(a, grille(2, 20, 30, 640, 96, 18), (k) => [175 + (k % 2) * 330, 355 + Math.floor(k / 2) * 150], [1, 3, 0, 2]); await a.suite();
  await trier(a, (i) => [170, 100 + 150 * i], (k) => [510, 100 + (2 - k) * 150], [1, 2, 0]); await a.suite();
  await a.choix(1); await a.suite();
};

/* ---------- Chapitre 2 : les cinq composants ---------- */
const penta = (k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; return [340 + 175 * Math.cos(a), 395 + 160 * Math.sin(a)]; };
tous["composants-si"] = async (a) => {
  await trier(a, grille(3, 14, 14, 652, 70, 12), penta, [4, 2, 1, 0, 3]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(2); await a.suite();
};
tous.processus = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 90, 16), (k) => [k ? 567 : 113, 380], [0, 1, 0, 1]); await a.suite();
  await trier(a, grille(2, 20, 30, 640, 110, 20), (k) => [175 + 330 * k, 430], [0, 1, 0, 1]); await a.suite();
  await ordre(a, (i) => [[385, 487], [205, 107], [575, 107], [295, 297], [575, 487]][i], [1, 3, 0, 4, 2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["maturite-cartographie"] = async (a) => {
  await trier(a, (i) => [117 + (i % 3) * 222, i < 3 ? 64 : 184], (k) => [104 + k * 118, 559 - k * 62], [3, 0, 4, 1, 2]); await a.suite();
  await trier(a, (i) => [120, 61 + 96 * i], (k) => [461, 108 + 196 * k], [0, 1, 2, 2, 1, 0]); await a.suite();
  await ordre(a, (i) => [[560, 445], [130, 445], [130, 165], [345, 445], [345, 165]][i], [2, 4, 1, 3, 0]); await a.suite();
  await a.choix(1); await a.suite();
};
tous["schema-directeur"] = async (a) => {
  await a.choix(0); await a.suite();
  await ordre(a, (i) => [[175, 150], [505, 150], [175, 390], [505, 390]][i], [1, 3, 0, 2]); await a.suite();
  await trier(a, grille(2, 14, 14, 652, 76, 12), (k) => [173 + (k % 2) * 334, 358 + Math.floor(k / 2) * 150], [1, 2, 3, 0, 1, 2]); await a.suite();
  await trier(a, (i) => [568, 105 + 130 * i], (k) => [310, 120 + 175 * k], [0, 2, 1, 2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.logiciels = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 80, 14), (k) => [175 + 330 * k, 440], [0, 1, 0, 1, 0, 1]); await a.suite();
  await a.svg([415.5, 360]); await a.suite();
  await a.svg([592, 240]); await a.suite();
  await paires(a, (i) => [210, 80 + 112 * i], (k) => [570, 80 + 112 * k], [3, 0, 4, 2, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["donnees-sgbd"] = async (a) => {
  await paires(a, (i) => [200, 95 + 136 * i], (k) => [560, 95 + 136 * k], [1, 0, 3, 2]); await a.suite();
  await trier(a, grille(2, 20, 20, 640, 74, 14), (k) => [118 + 222 * k, 420], [0, 1, 2, 0, 1, 2]); await a.suite();
  await trier(a, grille(2, 20, 20, 640, 110, 18), (k) => [175 + 330 * k, 435], [0, 1, 0, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["materiel-reseau"] = async (a) => {
  await paires(a, (i) => [200, 140 + 160 * i], (k) => [560, 140 + 160 * k], [1, 2, 0]); await a.suite();
  await trier(a, (i) => [118 + 222 * i, 125], (k) => [118 + 222 * k, 430], [0, 2, 1]); await a.suite();
  await trier(a, grille(3, 14, 30, 652, 90, 16), (k) => [175 + 330 * k, 420], [0, 1, 0, 1, 0, 1]); await a.suite();
  await a.choix(1); await a.suite();
};
tous.personnel = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 80, 14), (k) => [175 + 330 * k, 435], [0, 1, 0, 1, 0, 1]); await a.suite();
  await trier(a, grille(4, 10, 20, 660, 70, 12), (k) => [118 + 222 * k, 400], [0, 1, 2, 0, 1, 2, 0, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-composants"] = async (a) => {
  await trier(a, (i) => [200, 64 + 116 * i], (k) => [550, 64 + 116 * k], [0, 3, 2, 4, 1]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};
tous["boss-composants"] = async (a) => {
  await trier(a, (i) => [175, 79 + 146 * i], (k) => [525, 79 + 146 * k], [1, 0, 3, 2]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};

/* ---------- Chapitre 3 : le SIH ---------- */
tous.sih = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 80, 14), (k) => [175 + 330 * k, 440], [0, 1, 0, 1, 0, 1]); await a.suite();
  await a.choix(1); await a.suite();
  await paires(a, (i) => [210, 62 + 96 * i], (k) => [560, 62 + 96 * k], [2, 3, 4, 0, 5, 1]); await a.suite();
};
tous["composants-sih"] = async (a) => {
  await paires(a, (i) => [135, 50 + 82 * i], (k) => [485, 50 + 82 * k], [2, 4, 6, 0, 3, 5, 1]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await trier(a, grille(4, 14, 60, 652, 100, 12), (k) => [175 + 330 * k, 410], [0, 1, 1, 1]); await a.suite();
};
tous["architecture-sih"] = async (a) => {
  await trier(a, grille(2, 14, 10, 652, 62, 10), (k) => [72 + 134 * k, 435], [0, 1, 2, 3, 4, 1, 2, 0]); await a.suite();
  await a.svg([340, 285]); await a.suite();
  await a.choix(0); await a.suite();
  await trier(a, grille(2, 20, 20, 640, 110, 18), (k) => [175 + 330 * k, 435], [0, 1, 0, 1]); await a.suite();
};
tous["sih-maroc"] = async (a) => {
  await a.nombres([4]); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([245, 113]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-sih"] = async (a) => {
  await a.jetons(["r", "t", "f"]); await a.suite();
  await trier(a, grille(3, 14, 14, 652, 76, 12), (k) => [72 + 134 * k, 430], [0, 1, 2, 1, 4]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous["boss-sih"] = async (a) => {
  await ordre(a, (i) => [[565, 300], [115, 490], [340, 110], [115, 110], [340, 490]][i], [3, 2, 0, 4, 1]); await a.suite();
  await a.choix(0); await a.suite();
  await trier(a, grille(2, 20, 20, 640, 110, 18), (k) => [175 + 330 * k, 435], [0, 1, 1, 0]); await a.suite();
  await a.choix(0); await a.suite();
};

/* ---------- Chapitre 4 : les données de santé ---------- */
tous["donnee-sante"] = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 84, 14), (k) => [175 + 330 * k, 445], [0, 0, 1, 0, 0, 1]); await a.suite();
  await trier(a, (i) => [118 + 222 * i, 104], (k) => [[165, 445], [515, 445], [340, 572]][k], [1, 0, 2]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(2); await a.suite();
};
tous["parcours-donnee"] = async (a) => {
  await ordre(a, (i) => [[562, 270], [118, 90], [118, 270], [118, 450], [340, 90], [340, 270], [562, 90]][i], [0, 1, 2, 3, 4, 5, 6]); await a.suite();
  await a.nombres([94.1]); await a.suite();
  await a.choix(1); await a.suite();
};
tous["types-donnees"] = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 80, 14), (k) => [118 + 222 * k, 440], [0, 1, 2, 0, 1, 2]); await a.suite();
  await a.svg([340, 330]); await a.suite();
  await a.nombres([2]); await a.suite();
  await a.choix(0); await a.suite();
  await paires(a, (i) => [175, 68 + 114 * i], (k) => [525, 68 + 114 * k], [2, 0, 4, 3, 1]); await a.suite();
};
tous["qualite-donnees"] = async (a) => {
  for (const p of [[155, 215], [260, 277], [360, 339], [535, 401], [55, 463]]) await a.svg(p);
  await a.suite();
  await trier(a, (i) => [145, 64 + 116 * i], (k) => [389 + (k % 2) * 188, 102 + Math.floor(k / 2) * 194], [2, 1, 0, 4, 3]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-donnees"] = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 110, 18), (k) => [175 + 330 * k, 435], [0, 1, 0, 0]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(1); await a.suite();
  await trier(a, grille(2, 20, 20, 640, 110, 18), (k) => [173 + (k % 2) * 334, 362 + Math.floor(k / 2) * 140], [1, 2, 0, 3]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["boss-donnees"] = async (a) => {
  await a.nombres([2]); await a.suite();
  for (const p of [[270, 255], [155, 325], [400, 325], [560, 395], [400, 465]]) await a.svg(p);
  await a.suite();
  await trier(a, (i) => [160, 64 + 116 * i], (k) => [505, 78 + 146 * k], [1, 2, 0, 3, 1]); await a.suite();
  await a.choix(1); await a.suite();
};

/* ---------- Chapitre 5 : le DPI ---------- */
tous.dpi = async (a) => {
  await paires(a, (i) => [110, 68 + 114 * i], (k) => [460, 68 + 114 * k], [2, 4, 0, 3, 1]); await a.suite();
  await a.choix(0); await a.choix(1); await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};
tous["dpi-sejours"] = async (a) => {
  await trier(a, (i) => [200, 64 + 116 * i], (k) => [545, 102 + 194 * k], [0, 1, 2, 1, 2]); await a.suite();
  await trier(a, (i) => [545, 88 + 140 * i], (k) => [230, 235 + 130 * k], [1, 2, 0, 2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["dpi-modules"] = async (a) => {
  await trier(a, grille(3, 14, 20, 652, 90, 14), (k) => [k ? 570 : 110, 410], [0, 1, 0, 1, 0, 1]); await a.suite();
  await paires(a, (i) => [190, 62 + 96 * i], (k) => [550, 62 + 96 * k], [2, 4, 0, 5, 3, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["plan-soins"] = async (a) => {
  await paires(a, (i) => [160, 110 + 130 * i], (k) => [520, 110 + 130 * k], [2, 3, 0, 1]); await a.suite();
  await trier(a, grille(2, 20, 20, 640, 80, 14), (k) => [175 + 330 * k, 440], [0, 1, 0, 1, 0, 1]); await a.suite();
  await a.svg([90 + 8 * 34, 470 - (38.3 - 36.5) * 150]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["dpp-national"] = async (a) => {
  await ordre(a, (i) => [[175, 65], [505, 65], [340, 195], [510, 330], [340, 455], [340, 550]][i], [1, 2, 3, 4, 5]); await a.suite();
  await a.svg([170, 330]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["urgences-dpi"] = async (a) => {
  await ordre(a, (i) => { const c = [3, 0, 4, 1, 5, 2][i]; return [175 + (c % 2) * 330, 95 + Math.floor(c / 2) * 180]; }, [0, 1, 2, 3, 4, 5]); await a.suite();
  await a.choix(0); await a.suite();
  await trier(a, (i) => [160, 64 + 116 * i], (k) => [505, 55 + 96 * k], [0, 1, 3, 4, 5]); await a.suite();
};
tous["revision-dpi"] = async (a) => {
  await trier(a, (i) => [118 + 222 * i, 120], (k) => [118 + 222 * k, 420], [1, 0, 2]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};
tous["boss-dpi"] = async (a) => {
  await trier(a, (i) => [180, 64 + 116 * i], (k) => [525, 110 + 190 * k], [0, 1, 2, 1, 0]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};

/* ---------- Chapitre 6 : les circuits patient ---------- */
const six = (c) => [175 + (c % 2) * 330, 95 + Math.floor(c / 2) * 180];
const cinq = (c) => c === 4 ? [340, 455] : six(c);
tous["circuit-patient"] = async (a) => {
  await ordre(a, (i) => six([2, 5, 0, 4, 1, 3][i]), [0, 1, 2, 3, 4, 5]); await a.suite();
  await paires(a, (i) => [165, 85 + 110 * i], (k) => [515, 85 + 110 * k], [3, 4, 0, 1, 2]); await a.suite();
  await paires(a, (i) => [165, 85 + 110 * i], (k) => [515, 85 + 110 * k], [2, 4, 1, 3, 0]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.identite = async (a) => {
  await a.svg([606, 179]); await a.suite();
  await a.svg([606, 309]); await a.suite();
  await a.svg([502, 497]); await a.suite();
  await paires(a, (i) => [115, 68 + 114 * i], (k) => [460, 68 + 114 * k], [3, 0, 4, 1, 2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.appariement = async (a) => {
  await trier(a, (i) => [340, 64 + 116 * i], (k) => [175 + 330 * k, 475], [0, 1, 1]); await a.suite();
  await a.nombres([0.95]); await a.suite();
  await a.nombres([0.7]); await a.suite();
  await a.choix(1); await a.suite();
  await ordre(a, (i) => [[505, 385], [505, 115], [175, 385], [175, 115]][i], [2, 1, 3, 0]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.identitovigilance = async (a) => {
  await trier(a, grille(2, 10, 10, 660, 62, 8), (k) => [117 + (k % 3) * 222, 368 + Math.floor(k / 3) * 150], [0, 1, 2, 3, 4, 0, 3, 1]); await a.suite();
  await a.nombres([0.3]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["admission-facturation"] = async (a) => {
  await ordre(a, (i) => cinq([3, 0, 4, 1, 2][i]), [0, 1, 2, 3, 4]); await a.suite();
  await paires(a, (i) => [160, 78 + 112 * i], (k) => [515, 78 + 112 * k], [2, 4, 0, 3, 1]); await a.suite();
  await a.choix(1); await a.suite();
  await trier(a, (i) => [118 + 222 * i, 115], (k) => [k ? 175 : 505, 420], [0, 1, 0]); await a.suite();
};
tous["circuit-lis"] = async (a) => {
  await trier(a, grille(3, 10, 10, 660, 54, 8), (k) => [117 + 222 * k, 420], [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2]); await a.suite();
  await a.nombres([54]); await a.suite();
  await trier(a, (i) => [118 + 222 * i, 105], (k) => [117 + 222 * k, 395], [0, 2, 2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["circuit-ris-pis"] = async (a) => {
  await ordre(a, (i) => cinq([2, 4, 1, 3, 0][i]), [0, 1, 2, 3, 4]); await a.suite();
  await ordre(a, (i) => cinq([3, 0, 4, 2, 1][i]), [0, 1, 2, 3, 4]); await a.suite();
  await trier(a, grille(2, 20, 14, 640, 60, 10), (k) => [175 + 330 * k, 435], [0, 1, 0, 1, 0, 1, 0, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-circuits"] = async (a) => {
  await a.svg([606, 309]); await a.suite();
  await a.nombres([0.75]); await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous["boss-circuits"] = async (a) => {
  await a.svg([606, 439]); await a.suite();
  await a.nombres([72]); await a.suite();
  await a.nombres([0.74]); await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};

/* ---------- Chapitres 7 à 10 : sécurité des réseaux hospitaliers ---------- */
const deux = grille(2, 20, 30, 640, 110, 18), bas2 = (k) => [175 + 330 * k, 435], bas3 = (k) => [118 + 222 * k, 435];
const g6 = grille(2, 20, 14, 640, 80, 12), gauche4 = (i) => [180, 79 + 146 * i], droite4 = (k) => [525, 79 + 146 * k];
const haut3 = (i) => [118 + 222 * i, 120], bas3b = (k) => [118 + 222 * k, 420];
tous["scenario-rancon"] = async (a) => {
  await trier(a, deux, bas2, [0, 1, 0, 1]); await a.suite();
  await trier(a, grille(2, 14, 10, 652, 46, 8), (k) => [72 + 134 * k, 435], [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["hopital-different"] = async (a) => {
  await paires(a, (i) => [170, 90 + 140 * i], (k) => [515, 90 + 140 * k], [2, 3, 0, 1]); await a.suite();
  await paires(a, (i) => [170, 125 + 170 * i], (k) => [515, 125 + 170 * k], [2, 0, 1]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["panorama-menace"] = async (a) => {
  await paires(a, (i) => [135, 68 + 114 * i], (k) => [480, 68 + 114 * k], [2, 4, 0, 3, 1]); await a.suite();
  await paires(a, (i) => [110, 95 + 136 * i], (k) => [455, 95 + 136 * k], [1, 3, 2, 0]); await a.suite();
  await trier(a, g6, bas3, [0, 1, 2, 0, 1, 2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-menace"] = async (a) => { for (let k = 0; k < 4; k++) { await a.choix(0); await a.suite(); } };
tous["boss-menace"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await trier(a, deux, bas2, [0, 0, 0, 1]); await a.suite();
};
tous["defense-profondeur"] = async (a) => {
  await a.nombres([1]); await a.suite();
  await a.nombres([3]); await a.suite();
  await trier(a, (i) => [200, 64 + 116 * i], (k) => [545, 102 + 194 * k], [1, 2, 0, 2, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["triade-cid"] = async (a) => {
  await trier(a, grille(3, 14, 14, 652, 90, 12), (k) => [[114, 390], [340, 330], [566, 390]][k], [1, 2, 0, 1, 2, 0]); await a.suite();
  await paires(a, (i) => [160, 135 + 160 * i], (k) => [510, 135 + 160 * k], [1, 2, 0]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["regle-aaa"] = async (a) => {
  await ordre(a, (i) => [[510, 120], [340, 460], [170, 120]][i], [2, 0, 1]); await a.suite();
  await trier(a, g6, bas3, [0, 1, 2, 0, 1, 2]); await a.suite();
  await a.nombres([1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-principes"] = async (a) => {
  await trier(a, (i) => [118 + 222 * i, 130], (k) => [118 + 222 * k, 430], [2, 0, 1]); await a.suite();
  for (let k = 0; k < 3; k++) { await a.choix(0); await a.suite(); }
};
tous["boss-principes"] = async (a) => {
  await ordre(a, (i) => [[340, 475], [170, 115], [510, 295]][i], [1, 2, 0]); await a.suite();
  for (let k = 0; k < 3; k++) { await a.choix(0); await a.suite(); }
};
tous["cadre-maroc"] = async (a) => {
  await trier(a, grille(2, 14, 10, 652, 62, 10), bas2, [0, 1, 0, 0, 0, 1, 0]); await a.suite();
  await paires(a, (i) => [125, 68 + 114 * i], (k) => [470, 68 + 114 * k], [3, 4, 0, 1, 2]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous.referentiels = async (a) => {
  await paires(a, (i) => [130, 68 + 114 * i], (k) => [475, 68 + 114 * k], [3, 2, 0, 4, 1]); await a.suite();
  await trier(a, (i) => [175, 79 + 146 * i], droite4, [0, 1, 2, 3]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-cadre"] = async (a) => { for (let k = 0; k < 4; k++) { await a.choix(0); await a.suite(); } };
tous["boss-cadre"] = async (a) => {
  await trier(a, gauche4, droite4, [0, 1, 2, 3]); await a.suite();
  for (let k = 0; k < 3; k++) { await a.choix(0); await a.suite(); }
};
tous["menace-vulnerabilite"] = async (a) => {
  await trier(a, grille(2, 20, 20, 640, 80, 14), (k) => [175 + 330 * k, 440], [0, 1, 1, 0, 0, 1]); await a.suite();
  await trier(a, deux, bas2, [0, 1, 0, 0]); await a.suite();
  await a.jetons(["m", "v"]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["surface-attaque"] = async (a) => {
  await trier(a, g6, bas3, [0, 1, 2, 0, 1, 2]); await a.suite();
  await trier(a, deux, bas2, [0, 1, 0, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
const kc = (k) => { const t = -Math.PI / 2 + k * Math.PI / 4; return [340 + 235 * Math.cos(t), 305 + 225 * Math.sin(t)]; };
tous["kill-chain"] = async (a) => {
  await ordre(a, (i) => kc([5, 2, 7, 0, 3, 6, 1, 4][i]), [0, 1, 2, 3, 4, 5, 6, 7]); await a.suite();
  await paires(a, (i) => [190, 78 + 112 * i], (k) => [545, 78 + 112 * k], [2, 4, 0, 3, 1]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.risque = async (a) => {
  await a.svg([603, 184]); await a.suite();
  await a.nombres([12]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([6]); await a.suite();
  await trier(a, haut3, bas3b, [0, 1, 2]); await a.suite();
};
tous["incident-spof"] = async (a) => {
  await trier(a, deux, bas2, [0, 1, 0, 1]); await a.suite();
  await paires(a, (i) => [210, 140 + 160 * i], (k) => [560, 140 + 160 * k], [1, 2, 0]); await a.suite();
  for (const p of [[340, 195], [340, 445], [480, 552]]) await a.svg(p);
  await a.suite();
  await trier(a, haut3, bas3b, [0, 1, 2]); await a.suite();
};
tous["revision-risque"] = async (a) => {
  await a.choix(1); await a.suite();
  for (let k = 0; k < 4; k++) { await a.choix(0); await a.suite(); }
};
tous["boss-risque"] = async (a) => {
  await trier(a, gauche4, droite4, [0, 1, 2, 3]); await a.suite();
  await a.nombres([12, 6]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};

module.exports = tous;
