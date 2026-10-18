/* Figure : la position centrale du DPP dans le projet de portail national de santé. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-dpp", {
    largeur: 960, hauteur: 560, titre: "Position centrale d'un DPP au sein d'un SIS",
    essai: "<strong>Essaie</strong> : touche chaque étage. <strong>Observe</strong> : publics et privés passent par la même plateforme d'échange avant d'atteindre le DPP."
  });
  var B = [
    { x: 20, y: 20, w: 450, h: 90, t: "Établissements de soins publics", sous: "SI Hosix, SI Enova, SI DxCare, SI Bilmedical", texte: "les systèmes d'information hospitaliers publics, de plusieurs éditeurs." },
    { x: 490, y: 20, w: 450, h: 90, t: "Établissements de soins privés", sous: "systèmes d'information du secteur privé", texte: "les SI des cliniques et cabinets privés." },
    { x: 20, y: 150, w: 920, h: 80, t: "Plateforme d'échange santé", sous: "HL7, HL7 FHIR, HL7 (CDA, CCD, SPL, CCOW), IHE, XDS, DICOM ISO 12052", coul: C.ko, pale: C.koPale, texte: "le point de passage commun : des standards d'échange que tous les SI comprennent." },
    { x: 20, y: 270, w: 420, h: 100, t: "Serveur d'identification du patient", sous: "carte nationale d'identité électronique", texte: "il garantit que deux dossiers concernent bien la même personne." },
    { x: 500, y: 270, w: 440, h: 100, t: "Base de consolidation santé", sous: "dossier patient partagé", coul: C.jeu, pale: C.jeuPale, texte: "le DPP : les données de tous les établissements, consolidées par patient." },
    { x: 20, y: 410, w: 920, h: 60, t: "Portail patient, portail professionnel, systèmes BI", coul: C.ok, pale: C.okPale, texte: "les portes d'accès : le patient, les professionnels, et le pilotage." },
    { x: 140, y: 495, w: 680, h: 55, t: "Citoyen, médecin privé, MSPS", texte: "les utilisateurs : le citoyen, le médecin privé, et le ministère de la Santé et de la Protection sociale." }
  ];
  A.explorer(f, B, { taille: 18, fond: function (g) {
    [[245, 112, 245, 148], [715, 112, 715, 148], [230, 232, 230, 268], [720, 232, 720, 268], [230, 372, 230, 408], [720, 372, 720, 408], [480, 472, 480, 493]].forEach(function (l) { A.fleche(g, [l[0], l[1]], [l[2], l[3]], { ep: 3, double: true, coul: C.doux }); });
    A.fleche(g, [442, 320], [498, 320], { ep: 3, double: true, coul: C.doux });
  } });
})();
