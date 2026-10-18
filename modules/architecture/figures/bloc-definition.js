/* Figures : ce que le bloc concentre et les risques qui en naissent ; schéma global construit pas à pas. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;

  /* ---------- Figure 1 : concentration et risques ---------- */
  (function () {
    var f = R.figure("fig-concentre", {
      largeur: 960, hauteur: 540, titre: "Ce que le bloc concentre",
      essai: "<strong>Essaie</strong> : touche un des trois risques. <strong>Observe</strong> : les éléments du bloc qui le créent ou l'aggravent s'allument."
    });
    var g = A.s("g", null, f.svg), sel = 0;
    var E = ["Patients à risque", "Actes invasifs", "Personnel nombreux", "Équipements biomédicaux complexes", "Médicaments et produits stériles", "Gaz médicaux", "Dispositifs électriques", "Systèmes de ventilation"];
    // liens risque → éléments (lecture proposée pour comprendre, à partir des listes du cours)
    var LIENS = [[0, 1, 2, 4, 7], [3, 6], [5, 6]];
    var RQ = ["Risques infectieux", "Risques électriques", "Risques incendie"];
    var EXPL = [
      "Un patient fragile, un corps ouvert, une équipe nombreuse, des produits qui doivent rester stériles et un air qui peut transporter des germes.",
      "Des appareils complexes branchés au secteur, utilisés sur un patient anesthésié.",
      "Des gaz médicaux, dont l'oxygène, et des dispositifs électriques qui peuvent chauffer ou produire une étincelle."
    ];
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      A.vider(g);
      E.forEach(function (e, i) {
        var y = 24 + i * 64, on = LIENS[sel].indexOf(i) >= 0;
        A.boite(g, 30, y, 380, 54, { fond: on ? A.C.jeuPale : "#fff", bord: on ? C.jeu : C.trait, ep: on ? 3 : 2, titre: e, taille: 17 });
        if (on) A.fleche(g, [412, y + 27], [598, 130 + sel * 140], { coul: C.ko, ep: 3 });
      });
      RQ.forEach(function (r, k) {
        var on = sel === k;
        A.boite(g, 600, 90 + k * 140, 330, 80, { fond: on ? C.koPale : "#fff", bord: on ? C.ko : C.trait, ep: on ? 4 : 2, titre: r, taille: 20, coul: on ? C.ko : C.doux });
        A.cible(g, 600, 90 + k * 140, 330, 80, function () { sel = k; dessiner(); });
      });
      zone.innerHTML = "<strong>" + RQ[sel] + "</strong> : " + EXPL[sel] + " (Liens proposés pour comprendre ; la liste des éléments et des risques est celle du cours.)";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : schéma global, étape par étape ---------- */
  (function () {
    var f = R.figure("fig-global", {
      largeur: 960, hauteur: 540, titre: "Schéma global à retenir",
      essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : trois piliers, un bloc, une salle, des exigences, un but."
    });
    var g = A.s("g", null, f.svg);
    var noms = ["", "trois piliers", "le bloc", "la salle", "les exigences", "le but"];
    function dessiner(k) {
      A.vider(g);
      var P = [["Fonctionnel", "Flux, zonage", C.acc], ["Technique", "CVC, électricité, gaz médicaux, informatique", C.ok], ["Sécurité", "Incendie, évacuation, radioprotection", "#d9730d"]];
      if (k >= 1) P.forEach(function (p, i) {
        var x = 30 + i * 310;
        A.boite(g, x, 20, 280, 110, { fond: "#fff", bord: p[2], ep: 3 });
        A.texte(g, p[0], [x + 140, 48], { taille: 20, gras: 800, coul: p[2], halo: false });
        A.texte(g, p[1], [x + 140, 92], { taille: 16, largeur: 250, halo: false, coul: C.doux });
        if (k >= 2) A.fleche(g, [x + 140, 132], [480, 176], { coul: C.gris, ep: 3 });
      });
      if (k >= 2) A.boite(g, 340, 180, 280, 60, { fond: C.encre, bord: C.encre, titre: "Bloc opératoire", taille: 20, coul: "#fff" });
      if (k >= 3) { A.fleche(g, [480, 242], [480, 270], { coul: C.gris, ep: 3 }); A.boite(g, 160, 274, 640, 70, { titre: "Salle opératoire : patient, personnel, matériel", taille: 19 }); }
      if (k >= 4) { A.fleche(g, [480, 346], [480, 374], { coul: C.gris, ep: 3 }); A.boite(g, 160, 378, 640, 64, { titre: "Hygiène, sécurité, biomédical", taille: 19 }); }
      if (k >= 5) { A.fleche(g, [480, 444], [480, 468], { coul: C.gris, ep: 3 }); A.boite(g, 240, 472, 480, 60, { fond: A.C.jeu, bord: A.C.jeu, titre: "Qualité et continuité des soins", taille: 20, coul: "#fff" }); }
      if (k === 0) A.texte(g, "Touche « Étape suivante »", [480, 270], { taille: 20, coul: C.doux });
    }
    var e = R.etapes(f.reglages, 5, noms, dessiner);
    e.aller(5);
  })();
})();
