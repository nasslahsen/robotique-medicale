(function () {
  "use strict";
  var R = RM, C = R.C, M = window.MECA;

  /* ---------- Figure 3 : contraintes du contexte biomédical ---------- */
  (function () {
    var f = R.figure("fig-biomedical", {
      largeur: 960, hauteur: 500,
      titre: "Un bras de soin au-dessus d'un patient : où vivent les contraintes",
      essai: "<strong>Essaie</strong> : touche les pastilles numérotées. <strong>Observe</strong> : chaque contrainte biomédicale vise un endroit précis de la machine ; le choix final pèse ces critères avec les critères classiques."
    });
    var g = R.el("g", null, f.svg), choisi = 1, info = R.h("p", null, "", f.direct);
    var PTS = [
      [1, [520, 150], "Masse mobile", "Tout ce que porte le bras est accéléré à chaque mouvement : moins de masse mobile, c'est moins d'inertie et un choc moins violent en cas de contact."],
      [2, [215, 250], "Bruit et vibrations", "Moteurs et engrenages font du bruit et vibrent ; près d'un patient éveillé, on les limite."],
      [3, [395, 175], "Points de pincement", "Là où deux pièces se rapprochent pendant le mouvement, un doigt ou un tissu peut être coincé."],
      [4, [760, 260], "Nettoyage et maintenance", "Surfaces lisses, sans recoins, faciles à nettoyer et à entretenir."],
      [5, [300, 300], "Lubrifiants confinés", "La graisse du réducteur reste dans son carter : rien ne doit tomber sur le champ de soin."],
      [6, [120, 420], "Critères classiques", "Charge, rigidité, durée de vie et coût restent à respecter, comme pour toute machine."]
    ];
    function dessiner() {
      R.vider(g);
      R.el("rect", { x: 260, y: 430, width: 640, height: 26, rx: 8, fill: "#d9dde6" }, g);
      R.el("ellipse", { cx: 600, cy: 415, rx: 250, ry: 26, fill: "#f3d2bf", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("circle", { cx: 870, cy: 405, r: 32, fill: "#f3d2bf", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: 80, y: 120, width: 90, height: 360, rx: 12, fill: "#5b6172" }, g);
      R.el("rect", { x: 170, y: 210, width: 110, height: 80, rx: 14, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("rect", { x: 280, y: 215, width: 80, height: 70, rx: 12, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 3 }, g);
      R.ligne(g, [360, 250], [560, 170], { couleur: "#c6cbd8", epaisseur: 30 });
      R.el("circle", { cx: 360, cy: 250, r: 22, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g);
      R.ligne(g, [560, 170], [700, 300], { couleur: "#c6cbd8", epaisseur: 24 });
      R.el("circle", { cx: 560, cy: 170, r: 20, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g);
      R.ligne(g, [700, 300], [700, 380], { couleur: C.fonce, epaisseur: 7 });
      PTS.forEach(function (p) {
        var sel = p[0] === choisi, gp = R.el("g", { style: "cursor:pointer" }, g);
        gp.addEventListener("click", function () { choisi = p[0]; dessiner(); });
        R.el("circle", { cx: p[1][0], cy: p[1][1], r: 28, fill: "transparent" }, gp);
        R.el("circle", { cx: p[1][0], cy: p[1][1], r: 18, fill: sel ? PLATEFORME.couleur() : "#fff", stroke: C.fonce, "stroke-width": 2.5 }, gp);
        R.texte(gp, String(p[0]), [p[1][0], p[1][1] + 1], { italique: false, gras: true, taille: 18, couleur: sel ? "#fff" : C.fonce, halo: false });
      });
      var p = PTS[choisi - 1];
      info.innerHTML = "<strong>" + p[2] + "</strong> : " + p[3];
    }
    dessiner();
  })();
})();
