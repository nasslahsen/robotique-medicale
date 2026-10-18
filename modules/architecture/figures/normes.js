/* Figure : une salle, ses domaines, et le référentiel de chacun ; toucher un domaine. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-normes", {
    largeur: 960, hauteur: 540, titre: "Une norme par domaine",
    essai: "<strong>Essaie</strong> : touche un domaine autour de la salle. <strong>Observe</strong> : chacun a ses référentiels ; aucun ne couvre tout le bloc."
  });
  var g = A.s("g", null, f.svg), sel = 0;
  var D = [["Architecture / conception", "FGI Guidelines ; référentiels nationaux de construction hospitalière ; exigences locales de sécurité incendie", [200, 70]], ["Ventilation", "ASHRAE 170 ; HTM 03-01 (Royaume-Uni) ; recommandations OMS ; recommandations professionnelles de prévention des infections. Le FGI renvoie à ANSI/ASHRAE/ASHE 170.", [760, 70]], ["Électricité", "IEC 60364-7-710, installations électriques des locaux médicaux ; normes nationales associées", [140, 270]], ["Éclairage", "EN 12464-1, éclairage des lieux de travail intérieurs", [820, 270]], ["Fluides médicaux", "ISO 7396-1, distribution de gaz médicaux et de vide", [200, 470]], ["Équipements électromédicaux", "IEC 60601-1, sécurité de base et performances essentielles", [760, 470]], ["Stérilisation", "ISO 17665 (chaleur humide), ISO 11135 (oxyde d'éthylène), ISO 11140 (indicateurs chimiques), ISO 11607 (emballages des DM stérilisés terminalement)", [480, 500]]];
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    A.boite(g, 340, 160, 280, 220, { fond: A.ZONES.restreinte.fond, bord: A.ZONES.restreinte.bord, ep: 3, titre: "Bloc opératoire", taille: 22 });
    D.forEach(function (d, i) {
      var on = sel === i, w = 250, h = 66;
      A.s("line", { x1: d[2][0], y1: d[2][1], x2: 480, y2: 270, stroke: on ? C.jeu : C.trait, "stroke-width": on ? 4 : 2 }, g);
      A.boite(g, d[2][0] - w / 2, d[2][1] - h / 2, w, h, { fond: on ? C.jeu : "#fff", bord: on ? C.jeu : C.encre, ep: 2.5, titre: d[0], taille: 15, coul: on ? "#fff" : C.encre });
      A.cible(g, d[2][0] - w / 2, d[2][1] - h / 2, w, h, function () { sel = i; dessiner(); });
    });
    A.boite(g, 340, 160, 280, 220, { fond: A.ZONES.restreinte.fond, bord: A.ZONES.restreinte.bord, ep: 3, titre: "Bloc opératoire", taille: 22 });
    zone.innerHTML = "<strong>" + D[sel][0] + "</strong> : " + D[sel][1] + ".";
  }
  dessiner();
})();
