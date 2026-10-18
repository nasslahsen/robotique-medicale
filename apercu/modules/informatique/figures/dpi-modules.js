/* Figure : les volets du DPI autour de la synthèse, et les modules avec lesquels il échange. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-volets", {
    largeur: 960, hauteur: 540, titre: "DPI : volets et interaction avec les modules du SIH",
    essai: "<strong>Essaie</strong> : touche les volets et les modules. <strong>Observe</strong> : à gauche les échanges médico-techniques (HL7, DICOM, SNOMED), à droite l'administratif (NGAP, NABM, CIM-10)."
  });
  var V = [["Volet administratif", "identité, couverture sociale, séjours."], ["Volet paramédical", "transmissions et soins infirmiers, plan de soins."], ["Volet GED", "gestion électronique des documents : courriers et documents numérisés."], ["Volet pharmaceutique", "prescriptions validées par le pharmacien, dispensation."], ["Volet social", "situation sociale et familiale, aides à organiser."], ["Volet médical", "diagnostics, comptes rendus, antécédents."]];
  var items = V.map(function (v, k) { var a = -Math.PI / 2 + k * Math.PI / 3, c = [480 + 140 * Math.cos(a), 270 + 140 * Math.sin(a)], st = A.BACS[k % 5]; return { x: c[0] - 82, y: c[1] - 50, w: 164, h: 100, t: v[0], texte: v[1], coul: st.coul, pale: st.pale, taille: 16, rx: 50 }; });
  items.push({ x: 420, y: 235, w: 120, h: 70, t: "Synthèse", coul: C.jeu, pale: C.jeuPale, texte: "le centre du DPI : la vue d'ensemble du patient, nourrie par tous les volets.", taille: 18, rx: 35 });
  [["RIS", "radiologie : demandes et comptes rendus, échangés en HL7."], ["PACS", "images, échangées en DICOM."], ["LIS", "laboratoire : demandes et résultats, échangés en HL7, codés avec SNOMED."]].forEach(function (m, k) { items.push({ x: 20, y: 90 + k * 130, w: 130, h: 80, t: m[0], texte: m[1], taille: 20 }); });
  [["Admission", "identité, séjour ; diagnostics codés en CIM-10."], ["Cotation et facturation", "actes cotés avec la NGAP, la NABM."], ["RDV", "rendez-vous de consultation et d'examens."]].forEach(function (m, k) { items.push({ x: 810, y: 90 + k * 130, w: 140, h: 80, t: m[0], texte: m[1], taille: 17 }); });
  A.explorer(f, items, { fond: function (g) {
    var t1 = A.texte(g, "HL7, DICOM, SNOMED", [215, 270], { taille: 15, gras: 700, coul: C.doux }); t1.setAttribute("transform", "rotate(-90 215 270)");
    var t2 = A.texte(g, "NGAP, NABM, CIM-10", [745, 270], { taille: 15, gras: 700, coul: C.doux }); t2.setAttribute("transform", "rotate(-90 745 270)");
    [0, 1, 2].forEach(function (k) { A.fleche(g, [152, 130 + k * 130], [196, 130 + k * 130], { ep: 3, double: true, coul: C.doux }); A.fleche(g, [764, 130 + k * 130], [806, 130 + k * 130], { ep: 3, double: true, coul: C.doux }); });
  } });
})();
