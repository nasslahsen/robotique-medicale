(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Trieur : vivant ou non, d'où vient le tissu ---------- */
  (function () {
    var f = R.figure("fig-greffe", {
      largeur: 960, hauteur: 440, titre: "Greffe, bioprothèse ou implant",
      essai: "<strong>Essaie</strong> : choisis l'origine du tissu, puis s'il est vivant ou traité. <strong>Observe</strong> : le même donneur (un porc) donne une xénogreffe si le tissu est vivant, une bioprothèse s'il est traité et non vivant ; sans tissu du tout, c'est un implant fait de biomatériaux."
    });
    var b = R.boutons(f.reglages);
    var orig = R.choix(b, [["meme", "Tissu du patient lui-même"], ["humain", "Tissu d'un autre humain"], ["animal", "Tissu d'une autre espèce"], ["aucun", "Aucun tissu : que des biomatériaux"]], dessin);
    var vivant = R.bascule(b, "Tissu vivant", true, dessin);
    var g = R.el("g", null, f.svg);
    function personne(x, y, coul, nom) {
      R.el("circle", { cx: x, cy: y - 110, r: 32, fill: coul, stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("path", { d: "M" + (x - 56) + " " + (y + 40) + " Q" + (x - 56) + " " + (y - 70) + " " + x + " " + (y - 70) + " Q" + (x + 56) + " " + (y - 70) + " " + (x + 56) + " " + (y + 40) + " Z", fill: coul, stroke: C.fonce, "stroke-width": 3 }, g);
      R.texte(g, nom, [x, y + 70], { italique: false, gras: true, taille: 18 });
    }
    function porc(x, y) {
      R.el("ellipse", { cx: x, cy: y - 30, rx: 80, ry: 52, fill: "#f7c6cf", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("circle", { cx: x - 86, cy: y - 42, r: 28, fill: "#f7c6cf", stroke: C.fonce, "stroke-width": 3 }, g);
      [-46, -18, 26, 54].forEach(function (d) { R.ligne(g, [x + d, y + 12], [x + d, y + 40], { couleur: C.fonce, epaisseur: 6 }); });
      R.texte(g, "donneur : autre espèce", [x, y + 70], { italique: false, gras: true, taille: 18 });
    }
    function dessin() {
      R.vider(g);
      var o = orig.value;
      vivant.disabled = o === "aucun" || o === "meme";
      if (o === "meme") vivant.checked = true;
      var v = vivant.checked;
      var nom, def;
      if (o === "aucun") {
        nom = "implant (ou prothèse, organe artificiel)";
        def = "dispositif constitué d'un ou plusieurs biomatériaux, introduit dans le corps ; avec des cellules vivantes, on parle d'organe artificiel hybride.";
        R.el("rect", { x: 160, y: 170, width: 170, height: 110, rx: 14, fill: "#b8c0cc", stroke: C.fonce, "stroke-width": 3 }, g);
        R.texte(g, "biomatériaux", [245, 226], { italique: false, gras: true, taille: 18, halo: false });
        personne(720, 290, "#ffe6da", "receveur");
      } else if (o === "meme") {
        nom = "autogreffe";
        def = "donneur et receveur sont la même personne (par exemple, de l'os prélevé sur la hanche pour reconstruire la mâchoire).";
        personne(480, 290, "#ffe6da", "même personne");
        R.el("path", { d: "M520 320 C680 330 680 150 512 182", fill: "none", stroke: C.acc, "stroke-width": 5 }, g);
      } else if (o === "humain") {
        nom = v ? "allogreffe" : "bioprothèse";
        def = v ? "donneur et receveur de la même espèce, mais génétiquement distincts." : "prothèse constituée d'un tissu non vivant « traité », obtenu auprès d'un donneur.";
        personne(240, 290, "#ffe6da", "donneur");
        personne(720, 290, "#f6dcc4", "receveur");
      } else {
        nom = v ? "xénogreffe" : "bioprothèse";
        def = v ? "donneur et receveur d'espèces différentes." : "prothèse constituée d'un tissu non vivant « traité », obtenu auprès d'un donneur (par exemple une valve cardiaque).";
        porc(240, 300);
        personne(720, 290, "#ffe6da", "receveur");
      }
      if (o !== "meme") R.fleche(g, [380, 220], [600, 220], { couleur: C.acc, epaisseur: 6 });
      R.texte(g, nom, [480, 60], { italique: false, gras: true, couleur: C.acc, taille: 26 });
      R.texte(g, o === "aucun" ? "" : (v ? "tissu vivant" : "tissu traité, non vivant"), [480, 100], { italique: false, couleur: C.doux, taille: 17 });
      f.direct.innerHTML = "<p><strong>" + nom.charAt(0).toUpperCase() + nom.slice(1) + "</strong> : " + def + "</p>";
    }
    dessin();
  })();
})();
