/* Figure : prise en charge aux urgences, le DPI mis à jour à chaque étape. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-urgences", {
    largeur: 960, hauteur: 560, titre: "Prise en charge d'un patient aux urgences",
    essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : le DPI, à droite, se remplit au fil de la prise en charge."
  });
  var ET = [["Accueil", "identité, motif", "Motif : douleur thoracique"], ["Triage", "score de tri (IOA)", "Score de tri : 2"], ["Consultation urgence", "examen médical initial", "Examen : ECG sans sus-décalage"], ["Explorations", "résultats bio / imagerie", "Troponine : 45 ng/L"], ["Salle d'observation", "surveillance, réévaluation", "H+6 : douleur disparue"], ["Sortie", "domicile ou hospitalisation", "Retour à domicile"]];
  var N = ET.map(function (e, i) { return { t: e[0], sous: e[1], x: 30, y: 20 + i * 88, w: 340, h: 74, taille: 18 }; });
  A.etapesFig(f, N, ET.map(function (e) { return "<strong>" + e[0] + "</strong> : le DPI reçoit « " + e[2] + " »."; }), {
    fond: function (g, k) {
      A.s("rect", { x: 560, y: 20, width: 380, height: 514, rx: 20, fill: C.okPale, stroke: C.ok, "stroke-width": 3 }, g);
      A.texte(g, "DPI, mis à jour en continu", [750, 50], { taille: 18, gras: 800, coul: C.ok });
      for (var i = 0; i < k; i++) { A.fleche(g, [374, 57 + i * 88], [556, 57 + i * 88], { ep: 2.5, coul: C.doux }); A.texte(g, ET[i][2], [750, 57 + i * 88 + 28], { taille: 15, gras: 600, largeur: 340 }); }
    }, depart: "Un patient arrive aux urgences. Avance pour suivre sa prise en charge."
  });
})();
