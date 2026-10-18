/* Figure : ombre portée sur la plaie selon le nombre et l'écartement des foyers du scialytique (modèle plan simplifié). */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-scialytique", {
    largeur: 960, hauteur: 540, titre: "Le scialytique et l'ombre portée",
    essai: "<strong>Essaie</strong> : augmente le nombre de foyers et leur écartement. <strong>Observe</strong> : la bande sous le champ montre la part de lumière reçue en chaque point ; avec plusieurs foyers écartés, la plaie reste éclairée malgré la tête de l'équipe."
  });
  var g = A.s("g", null, f.svg);
  var G = { yS: 110, yO: 340, yF: 450, o1: 430, o2: 530 };
  var cK = R.curseur(f.reglages, { nom: "Foyers", min: 1, max: 5, pas: 1, val: 1, surChange: dessiner });
  var cE = R.curseur(f.reglages, { nom: "Écartement", min: 0, max: 380, pas: 10, val: 0, surChange: dessiner });
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    var xs = A.calc.foyers(cK.v, cE.v, 480);
    A.s("rect", { x: 20, y: 20, width: 920, height: 18, fill: "#d9e2ef" }, g);
    A.s("line", { x1: 480, y1: 38, x2: 480, y2: 80, stroke: C.encre, "stroke-width": 6 }, g);
    A.s("rect", { x: Math.min.apply(null, xs) - 30, y: 80, width: Math.max.apply(null, xs) - Math.min.apply(null, xs) + 60, height: 16, rx: 8, fill: C.doux }, g);
    xs.forEach(function (x) { A.s("polygon", { points: [x, G.yS, 250, G.yF, 710, G.yF].join(" "), fill: "#ffd84d", opacity: 0.16 / Math.sqrt(xs.length) + 0.05 }, g); });
    var mini = 1;
    for (var xf = 250; xf < 710; xf += 4) {
      var fr = A.calc.lumiere(xs, xf, G);
      if (xf >= 460 && xf <= 500) mini = Math.min(mini, fr);
      A.s("rect", { x: xf, y: G.yF, width: 4, height: 20, fill: "rgb(" + Math.round(40 + 215 * fr) + "," + Math.round(40 + 200 * fr) + "," + Math.round(40 + 120 * fr) + ")" }, g);
    }
    A.s("rect", { x: 458, y: G.yF - 4, width: 44, height: 28, fill: "none", stroke: C.ko, "stroke-width": 3 }, g);
    A.texte(g, "plaie", [480, G.yF + 44], { taille: 16, coul: C.ko });
    A.s("rect", { x: 220, y: G.yF + 20, width: 520, height: 18, fill: C.doux }, g);
    A.s("ellipse", { cx: 480, cy: G.yO, rx: 50, ry: 20, fill: C.acc, opacity: 0.85 }, g);
    A.texte(g, "tête et mains de l'équipe", [550, G.yO], { taille: 15, coul: C.acc, ancre: "start" });
    xs.forEach(function (x) { A.s("circle", { cx: x, cy: G.yS, r: 14, fill: "#ffd84d", stroke: C.encre, "stroke-width": 2.5 }, g); });
    zone.innerHTML = "Lumière reçue au point le plus sombre de la plaie : <strong>" + Math.round(mini * 100) + " %</strong> des foyers. " + (mini === 0 ? "<span class=\"alerte\">La plaie est dans l'ombre.</span>" : "Faible production d'ombre : la plaie reste éclairée.");
  }
  dessiner();
})();
