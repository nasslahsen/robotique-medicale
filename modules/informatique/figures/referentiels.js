/* Figure : normes et règlements internationaux et pourquoi ils concernent le Maroc. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-normes", {
    largeur: 960, hauteur: 520, titre: "Normes et règlements internationaux",
    essai: "<strong>Essaie</strong> : touche chaque référence. <strong>Observe</strong> : elles entrent au Maroc par les dispositifs achetés, les méthodes et les partenaires."
  });
  var K = [
    ["Marquage CE (MDR 2017/745), FDA", "le dispositif", "exigences de sécurité des dispositifs, dont la cybersécurité (annexe I du MDR). La plupart des DM importés portent le marquage CE ou une autorisation FDA : la documentation de sécurité du fabricant est exigible contractuellement."],
    ["IEC 80001-1", "le réseau de DM", "gestion des risques d'un réseau qui incorpore des DM : répartition des responsabilités entre l'établissement et le fabricant. Norme de métier de l'ingénieur biomédical, qui compense l'absence de texte national spécifique."],
    ["ISO/IEC 27001, 27002, 27799, 27005", "la méthode", "système de management de la sécurité de l'information, mesures, spécificités de la santé (27799), gestion des risques (27005). Référence de mise en œuvre de la DNSSI et de la loi 05-20."],
    ["RGPD, Convention 108", "les données", "standards européens de protection des données ; le Maroc a ratifié la Convention 108 en 2019 et la loi 09-08 partage ses principes. S'applique en plus avec des données de résidents européens ou un prestataire européen."],
    ["NIS2, CRA", "les produits numériques", "cadres européens de cybersécurité des produits numériques ; les DM relevant du MDR sont exclus du CRA. Repères de bonnes pratiques qui influencent les fabricants européens."]
  ];
  var it = K.map(function (k, i) { var st = A.BACS[i % 5]; return { x: 20 + (i % 3) * 315, y: i < 3 ? 40 : 290, w: 290, h: 190, t: k[0], sous: k[1], texte: k[2], coul: st.coul, pale: st.pale, taille: 19, tailleSous: 15 }; });
  it[3].x = 177; it[4].x = 492;
  A.explorer(f, it);
})();
