/* Figure : sept caractéristiques de l'hôpital et leur conséquence pour la sécurité. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-specificites", {
    largeur: 960, hauteur: 540, titre: "Ce qui rend un hôpital différent",
    essai: "<strong>Essaie</strong> : touche chaque caractéristique. <strong>Observe</strong> : chacune ouvre une faiblesse que la sécurité doit compenser."
  });
  var K = [
    ["Pas de retard toléré", "La disponibilité et l'intégrité des données priment souvent sur leur confidentialité."],
    ["Ouvert 24 h / 24", "Fenêtres de maintenance trop serrées : correctifs retardés, redémarrages difficiles à planifier."],
    ["DM durables, 10 à 15 ans", "Des équipements sous des systèmes non supportés, impossibles à mettre à jour sans le fabricant."],
    ["Qualification, responsabilité du fabricant", "On ne peut pas installer un antivirus ou un correctif sur un DM à sa guise."],
    ["Parc très hétérogène", "Inventaire incomplet, protocoles disparates, maintenance par des dizaines de prestataires."],
    ["Nombreux tiers connectés", "Télémaintenance, éditeurs, hébergeurs, groupements sanitaires : la surface d'attaque dépasse l'établissement."],
    ["Données recherchées, non modifiables", "Un dossier médical ne se révoque pas : un vol a des conséquences durables (chantage, usurpation, phishing ciblé)."]
  ];
  var it = K.map(function (k, i) { var c = i < 4 ? [20 + i * 235, 40] : [137 + (i - 4) * 235, 300], st = A.BACS[i % 5]; return { x: c[0], y: c[1], w: 215, h: 190, t: k[0], texte: k[1], coul: st.coul, pale: st.pale, taille: 19 }; });
  A.explorer(f, it);
})();
