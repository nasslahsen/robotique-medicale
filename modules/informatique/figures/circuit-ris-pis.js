/* Figures : le circuit de l'imagerie (RIS) et le circuit du médicament (PIS), étape par étape. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  function circuit(id, titre, E, fin, bio) {
    var f = R.figure(id, { largeur: 960, hauteur: 380, titre: titre, essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : " + fin });
    var N = E.map(function (e, i) { return { t: e[0], sous: e[1], x: 10 + i * 190, y: 30, w: 175, h: 120, taille: 17, tailleSous: 13 }; });
    A.etapesFig(f, N, E.map(function (e) { return "<strong>" + e[0] + "</strong> : " + e[2]; }), {
      fond: function (g, k) {
        if (k < E.length) return;
        A.boite(g, 10, 190, 940, 150, { titre: "Côté biomédical", sous: bio, taille: 18, tailleSous: 16, fond: C.turqPale, bord: C.turq });
      }, depart: "Avance pour suivre le circuit."
    });
  }
  circuit("fig-ris", "RIS : circuit de l'imagerie", [
    ["Demande", "prescription informatisée", "l'urgentiste prescrit l'examen. Risque : mauvaise identité dès la demande."],
    ["Planification", "créneau et salle", "la secrétaire ou le manipulateur trouve un créneau et une salle."],
    ["Accueil et réalisation", "vérification d'identité, examen", "le manipulateur vérifie l'identité et réalise l'examen. Indicateur : suivi de dose ; risque : radiovigilance."],
    ["Compte rendu", "dictée et validation", "le radiologue dicte et valide. Risque : compte rendu tardif ; indicateur : délai demande – compte rendu."],
    ["Archivage", "consultation des images", "les images sont archivées et consultables. Risque : examen non tracé ; indicateur : examens non réalisés."]
  ], "l'identité est vérifiée à l'accueil, juste avant l'examen.", "radio et scanner sont des DM qui alimentent le RIS : qui les paramètre, les maintient, répond à la panne ?");
  circuit("fig-pis", "PIS : circuit du médicament", [
    ["Prescription", "aides : interactions, allergies, doses", "le médecin prescrit avec des aides. Risque : alerte ignorée (fatigue d'alerte)."],
    ["Analyse pharmaceutique", "validation par le pharmacien", "le pharmacien valide. Risque : interaction non détectée ; indicateur : interventions pharmaceutiques."],
    ["Dispensation", "stocks et dotations de service", "la pharmacie délivre au service, avec le préparateur."],
    ["Administration", "geste infirmier au lit du patient", "l'infirmier administre. Risque : erreur de dose (pharmacovigilance)."],
    ["Traçabilité", "dossier patient à jour", "l'administration est tracée. Indicateurs : prescriptions informatisées, administrations tracées."]
  ], "chaque étape a son acteur : médecin, pharmacien, préparateur, infirmier.", "pompes et armoires sécurisées : les données de l'appareil remontent-elles au dossier patient ?");
})();
