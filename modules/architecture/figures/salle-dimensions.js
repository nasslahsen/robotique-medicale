/* Figures : surface d'une salle hybride (deux conditions du FGI 2022) ; volume technique au-dessus du plafond. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;

  /* ---------- Figure 1 : surface et dimension minimale ---------- */
  (function () {
    var f = R.figure("fig-surface", {
      largeur: 960, hauteur: 540, titre: "Dimensionner une salle hybride",
      essai: "<strong>Essaie</strong> : règle longueur et largeur, puis active les couches. <strong>Observe</strong> : il faut à la fois 55,74 m² et au moins 6,10 m dans chaque direction ; une salle longue et étroite échoue même si sa surface suffit."
    });
    var g = A.s("g", null, f.svg);
    var cL = R.curseur(f.reglages, { nom: "Longueur [m]", min: 5, max: 11, pas: 0.1, val: 9.2, dec: 2, surChange: dessiner });
    var cl = R.curseur(f.reglages, { nom: "Largeur [m]", min: 5, max: 9, pas: 0.1, val: 6.1, dec: 2, surChange: dessiner });
    var bb = R.boutons(f.reglages);
    var bEq = R.bascule(bb, "Équipe et équipements", true, dessiner);
    var bCi = R.bascule(bb, "Circulation et maintenance", true, dessiner);
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      A.vider(g);
      var L = cL.v, l = cl.v, u = 46, w = L * u, h = l * u, x0 = 480 - w / 2, y0 = 270 - h / 2, ok = A.calc.hybrideOk(L, l);
      A.s("rect", { x: x0, y: y0, width: w, height: h, fill: ok ? C.okPale : C.koPale, stroke: C.encre, "stroke-width": 5 }, g);
      A.texte(g, R.fmt(L, 2) + " m", [480, y0 - 18], { taille: 18, mono: true, coul: L >= 6.1 ? C.encre : C.ko });
      A.texte(g, R.fmt(l, 2) + " m", [x0 - 12, 270], { taille: 18, mono: true, ancre: "end", coul: l >= 6.1 ? C.encre : C.ko });
      if (bCi.checked) A.s("rect", { x: 480 - 150, y: 270 - 120, width: 300, height: 240, rx: 30, fill: "none", stroke: C.acc, "stroke-width": 3, "stroke-dasharray": "9 7" }, g);
      A.s("rect", { x: 450, y: 190, width: 60, height: 160, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
      A.s("path", { d: "M415 235 A65 65 0 0 1 545 235", fill: "none", stroke: C.v, "stroke-width": 12, "stroke-linecap": "round" }, g);
      if (bEq.checked) {
        [[400, 250], [560, 250], [400, 320]].forEach(function (q) { A.icone(g, "personne", q, 34, C.personnel); });
        A.boite(g, 560, 160, 70, 70, { fond: C.vPale, bord: C.v, rx: 8, ep: 2, titre: "Anesth.", taille: 13 });
        A.boite(g, 330, 330, 80, 50, { fond: C.vPale, bord: C.v, rx: 8, ep: 2, titre: "Colonne", taille: 13 });
      }
      var S = L * l;
      zone.innerHTML = "S = " + R.fmt(L, 2) + " × " + R.fmt(l, 2) + " = <strong>" + R.fmt(S, 2) + " m²</strong> " + (S >= 55.74 - 1e-9 ? "≥" : "<") + " 55,74 m² ; plus petite dimension " + R.fmt(Math.min(L, l), 2) + " m " + (Math.min(L, l) >= 6.1 - 1e-9 ? "≥" : "<") + " 6,10 m → " + (ok ? "<strong>conforme</strong>" : "<span class=\"alerte\">non conforme</span>") + " (FGI 2022, salle hybride).";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : volume technique ---------- */
  (function () {
    var f = R.figure("fig-volume", {
      largeur: 960, hauteur: 540, titre: "Le volume caché de la salle",
      essai: "<strong>Essaie</strong> : réduis puis augmente l'espace technique au-dessus du plafond. <strong>Observe</strong> : la salle visible ne change pas, mais les réseaux cessent de tenir. Proportions illustratives."
    });
    var g = A.s("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "Espace technique", min: 0, max: 20, pas: 1, val: 15, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      A.vider(g);
      var sol = 520, plafond = 340, haut = plafond - 30 - c.v * 9;
      A.s("rect", { x: 40, y: haut, width: 880, height: plafond - haut, fill: C.fond }, g);
      A.s("rect", { x: 30, y: haut - 26, width: 900, height: 26, fill: "#9aa0ad" }, g);
      A.texte(g, "Dalle de l'étage au-dessus", [480, haut - 13], { taille: 14, coul: "#fff", halo: false });
      var R2 = [["Gaine de ventilation", 120, C.acc, 60, 260], ["Chemins de câbles", 40, C.ko, 340, 150], ["Réseaux médicaux", 40, C.ok, 510, 150], ["Supports des bras et du scialytique", 70, C.encre, 680, 220]];
      var manque = [];
      R2.forEach(function (r) {
        var y = plafond - 4 - r[1], tient = y >= haut + 4;
        if (!tient) manque.push(r[0].toLowerCase());
        A.s("rect", { x: r[3], y: y, width: r[4], height: r[1], rx: 6, fill: tient ? "#fff" : C.koPale, stroke: tient ? r[2] : C.ko, "stroke-width": 3 }, g);
        A.texte(g, r[0], [r[3] + r[4] / 2, y + r[1] / 2], { taille: 15, largeur: r[4] - 12, halo: false, coul: tient ? C.encre : C.ko });
      });
      A.s("line", { x1: 40, y1: plafond, x2: 920, y2: plafond, stroke: C.encre, "stroke-width": 5 }, g);
      A.s("line", { x1: 40, y1: sol, x2: 920, y2: sol, stroke: C.encre, "stroke-width": 5 }, g);
      A.texte(g, "Salle visible", [120, 490], { taille: 17, coul: C.doux });
      A.s("rect", { x: 400, y: 450, width: 160, height: 14, fill: C.doux }, g); A.s("rect", { x: 470, y: 464, width: 20, height: 54, fill: C.doux }, g);
      A.s("line", { x1: 480, y1: plafond, x2: 480, y2: 390, stroke: C.encre, "stroke-width": 6 }, g);
      A.s("path", { d: "M440 410 A40 22 0 0 1 520 410 Z", fill: "#ffe9a8", stroke: C.encre, "stroke-width": 2.5 }, g);
      A.s("line", { x1: 480, y1: 390, x2: 480, y2: 410, stroke: C.encre, "stroke-width": 4 }, g);
      zone.innerHTML = manque.length ? "<span class=\"alerte\">Ne tiennent plus :</span> " + manque.join(", ") + ". La salle visible est pourtant la même." : "Tout tient au-dessus du plafond : ventilation, câbles, réseaux médicaux, supports.";
    }
    dessiner();
  })();
})();
