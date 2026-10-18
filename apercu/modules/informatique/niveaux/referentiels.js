/* Niveau : normes et règlements internationaux (MDR, FDA, IEC 80001-1, ISO 27001, 27002, 27799, 27005, RGPD, Convention 108, NIS2, CRA) (cyber, diapo 15). */
NIVEAU(SIS.rejouable({
  id: "referentiels",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Chaque référence son contenu", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque référence à son contenu.");
      var p = A.paires({
        g: n.g, gauche: ["Marquage CE (MDR 2017/745), FDA", "IEC 80001-1", "ISO/IEC 27001, 27002, 27799, 27005", "RGPD, Convention 108", "NIS2, règlement CRA"],
        droite: ["Système de management de la sécurité de l'information, spécificités santé, risques", "Cybersécurité des produits numériques (les DM du MDR sont exclus du CRA)", "Risques d'un réseau qui incorpore des DM : responsabilités hôpital / fabricant", "Exigences de sécurité des dispositifs, dont la cybersécurité (annexe I)", "Standards européens de protection des données"],
        bon: [3, 2, 0, 4, 1],
        xg: 10, wg: 240, xd: 280, wd: 390, y0: 20, h: 96, pas: 114, taille: 15, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Ce qu'on exige d'un dispositif pour le vendre.", "La norme du réseau qui contient des DM.", "La famille ISO de la sécurité de l'information.", "La protection des données personnelles en Europe.", "Les cadres européens récents sur les produits numériques."][i]; },
        fin: function () { j.bravo("MDR, IEC 80001-1, ISO 27000, RGPD, NIS2 et CRA."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Pourquoi au Maroc ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Ces références sont étrangères. Range chaque situation marocaine sous la référence qui s'y applique.");
      var cartes = [{ t: "Exiger du fabricant la documentation de sécurité d'un échographe importé", bac: 0 }, { t: "Répartir les responsabilités avec le fabricant du réseau de monitorage", bac: 1 }, { t: "Bâtir le plan de sécurité qui met en œuvre la DNSSI", bac: 2 }, { t: "Une étude avec un partenaire européen sur des patients résidents en Europe", bac: 3 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Marquage CE, FDA" }, { t: "IEC 80001-1" }, { t: "ISO/IEC 27001..." }, { t: "RGPD, Convention 108" }],
        pos: function (i) { return { x: 10, y: 14 + i * 146, w: 330, h: 130 }; },
        bacsPos: function (k) { return { x: 380, y: 14 + k * 146, w: 290, h: 130 }; },
        taille: 16, tailleBac: 19,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["La plupart des DM importés portent le marquage CE ou une autorisation FDA.", "La norme métier de l'ingénieur biomédical.", "La référence de mise en œuvre de la DNSSI et de la loi 05-20.", "Données de résidents européens."][i]; },
        fin: function () { j.bravo("CE / FDA, IEC 80001-1, ISO 27001, RGPD."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La norme du biomédical", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["reseau", "moniteur"], titre: "IEC 80001-1", sous: "un réseau qui incorpore des DM" });
      j.titre("Pourquoi le cours présente-t-il IEC 80001-1 comme la norme métier de l'ingénieur biomédical au Maroc ?");
      j.choix([{ html: "Elle gère les risques des réseaux qui incorporent des DM, et compense l'absence de texte national spécifique", juste: true }, { html: "Elle est obligatoire par la loi 09-08", aide: "La loi 09-08 porte sur les données personnelles." }, { html: "Elle remplace le marquage CE", aide: "Elle ne certifie pas un dispositif ; elle organise la gestion du réseau." }], { colonnes: 1, ok: function () { j.bravo("Pas de texte national spécifique : IEC 80001-1 le compense."); j.suite(); } });
    } },
    { nom: "Le CRA et les DM", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["moniteur", "document"], titre: "Un moniteur cardiaque relevant du MDR" });
      j.titre("Un moniteur cardiaque relève du MDR. Est-il soumis au règlement CRA ?");
      j.choix([{ html: "Non : les dispositifs médicaux relevant du MDR sont exclus du CRA", juste: true }, { html: "Oui : tout produit numérique est soumis au CRA", aide: "Relis la ligne du cours sur NIS2 et le CRA : une exclusion y est mentionnée." }], { colonnes: 1, ok: function () { j.bravo("Exclu du CRA ; mais ces cadres influencent les fabricants européens dont l'hôpital achète les produits."); j.suite(); } });
    } }
  ]
}));
