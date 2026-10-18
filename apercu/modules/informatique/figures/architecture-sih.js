/* Figures : les couches d'un SIH moderne ; le SIH des centres hospitaliers publics, avec le DPP au centre. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-couches", {
    largeur: 960, hauteur: 480, titre: "Architecture fonctionnelle d'un SIH moderne",
    essai: "<strong>Essaie</strong> : touche chaque couche. <strong>Observe</strong> : l'interopérabilité est séparée en interne (entre modules) et externe (hors de l'hôpital)."
  });
  var CO = [
    { t: "Couche présentation", l: ["Module RDV", "Module consultation", "Module biologie"], d: "ce que l'utilisateur voit et manipule : modules RDV, consultation, biologie..." },
    { t: "Couche métiers", l: ["Logique médicale (pharmaco-, hémovigilance)", "Moteur d'aide à la prescription", "Protocoles et gestes de soins"], d: "la logique médicale : vigilances, moteur d'aide à la prescription, gestion des protocoles et gestes de soins." },
    { t: "Couche données", l: ["Données structurées", "Documents", "Images", "Référentiels"], d: "ce qui est stocké : données structurées, documents, images, référentiels." }
  ];
  var items = CO.map(function (c, k) { var st = A.BACS[k]; return { x: 20 + k * 215, y: 40, w: 200, h: 400, t: c.t, texte: c.d, coul: st.coul, pale: st.pale, taille: 18, haut: true }; });
  items.push({ x: 680, y: 40, w: 260, h: 190, t: "Interopérabilité interne", sous: "intra-modules hospitaliers : HL7 V2, MWL...", texte: "les échanges entre modules du même hôpital, par exemple le LIS vers le DPI en HL7 V2, ou la liste de travail (MWL) envoyée à une modalité d'imagerie.", coul: C.brun, pale: C.brunPale, taille: 18 });
  items.push({ x: 680, y: 250, w: 260, h: 190, t: "Interopérabilité externe", sous: "DPI national, télémédecine, identité, partenaires", texte: "les échanges avec l'extérieur : DPI national, télémédecine, identité, partenaires.", coul: C.ok, pale: C.okPale, taille: 18 });
  A.explorer(f, items, { devant: function (g) {
    CO.forEach(function (c, k) { c.l.forEach(function (x, i) { A.boite(g, 34 + k * 215, 120 + i * 78, 172, 64, { titre: x, taille: 14, gras: 600, ep: 1.5, rx: 8, fond: "#fff", bord: C.trait }); }); });
  } });

  var f2 = R.figure("fig-sih-public", {
    largeur: 960, hauteur: 540, titre: "SIH déployé dans les centres hospitaliers publics",
    essai: "<strong>Essaie</strong> : touche le centre, les modules, puis les acteurs extérieurs. <strong>Observe</strong> : tout passe par le DPP ; la CNSS intervient à l'entrée et à la sortie."
  });
  var MOD = [
    { x: 200, y: 40, w: 160, h: 70, t: "Module médecin", texte: "le médecin consulte et alimente le DPP (flèche 2 du schéma du cours)." },
    { x: 400, y: 40, w: 160, h: 70, t: "Module infirmier", texte: "l'infirmier consulte et alimente le DPP (flèche 3)." },
    { x: 200, y: 160, w: 160, h: 90, t: "Admission, GIH, RDV", texte: "l'entrée du patient : identification, vérification d'éligibilité auprès de la CNSS, authentification du patient (flèche 1)." },
    { x: 600, y: 160, w: 160, h: 90, t: "Facturation, recouvrement, caisse", texte: "la sortie : facturation, et recouvrement digital des factures avec la CNSS (flèche 4)." },
    { x: 200, y: 420, w: 110, h: 70, t: "LIS", texte: "le laboratoire (flèche 5)." },
    { x: 330, y: 420, w: 110, h: 70, t: "RIS", texte: "la radiologie (flèche 6)." },
    { x: 460, y: 420, w: 130, h: 70, t: "Pharmacie", texte: "le pharmacien (flèche 7)." },
    { x: 610, y: 420, w: 110, h: 70, t: "Bloc...", texte: "et les autres modules du SIH." },
    { x: 400, y: 260, w: 160, h: 110, t: "DPP", sous: "dossier patient partagé", coul: C.jeu, pale: C.jeuPale, texte: "le centre du schéma : tous les modules échangent avec lui." },
    { x: 10, y: 160, w: 150, h: 90, t: "CNSS", sous: "éligibilité", coul: C.acc, pale: C.accPale, texte: "acteur externe à l'admission : identification et vérification d'éligibilité." },
    { x: 10, y: 290, w: 150, h: 90, t: "Identité du patient", sous: "carte, lecture NFC", coul: C.acc, pale: C.accPale, texte: "identification et authentification du patient à l'admission." },
    { x: 800, y: 160, w: 150, h: 90, t: "CNSS", sous: "recouvrement", coul: C.acc, pale: C.accPale, texte: "acteur externe à la sortie : recouvrement digital des factures." }
  ];
  A.explorer(f2, MOD, { taille: 16, fond: function (g) {
    A.s("rect", { x: 180, y: 20, width: 600, height: 490, rx: 30, fill: C.fond, stroke: C.trait, "stroke-width": 2 }, g);
    var dpp = MOD[8];
    MOD.slice(0, 8).forEach(function (m) { A.fleche(g, A.bord(m, [480, 315]), A.bord(dpp, [m.x + m.w / 2, m.y + m.h / 2], 4), { ep: 2.5, coul: C.doux, tirets: "5 5", double: true }); });
    A.fleche(g, [162, 205], [198, 205], { ep: 3, coul: C.acc, double: true }); A.fleche(g, [162, 320], [230, 252], { ep: 3, coul: C.acc, double: true }); A.fleche(g, [762, 205], [798, 205], { ep: 3, coul: C.acc, double: true });
  } });
})();
