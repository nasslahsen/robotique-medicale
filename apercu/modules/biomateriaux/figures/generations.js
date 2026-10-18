(function () {
  "use strict";
  var R = RM, C = R.C;
  var OS = "#f3ead8", BORD = "#b9a77f";

  /* ---------- Quatre générations, un même défaut osseux ---------- */
  (function () {
    var f = R.figure("fig-generations", {
      largeur: 960, hauteur: 500, titre: "Quatre générations de biomatériaux dans un même os",
      essai: "<strong>Essaie</strong> : passe d'une génération à l'autre. <strong>Observe</strong> : le défaut osseux est le même ; ce qui change, c'est ce qu'on sait du matériau, puis de sa surface, puis le fait que le corps reconstruit lui-même le tissu."
    });
    var g = R.el("g", null, f.svg), gen = 1;
    var b = R.boutons(f.reglages), btn = [];
    ["1re génération", "2e génération", "3e génération", "4e génération"].forEach(function (t, k) { btn.push(R.bouton(b, t, function () { gen = k + 1; dessin(); })); });
    var TXT = [
      "<strong>1re génération</strong> : du bois, du verre ou de l'or, choisis par la pratique. Rien n'est connu de la réponse de l'hôte : matériaux « non contrôlés ».",
      "<strong>2e génération</strong> (début du XXe siècle) : un alliage choisi pour ses propriétés mécaniques et sa résistance à la corrosion. Le matériau est maîtrisé, sa surface reste brute.",
      "<strong>3e génération</strong> : la surface de l'implant reçoit des molécules d'intérêt biologique (enduction, deep-coating, physisorption, greffage chimique) pour améliorer l'intégration et moduler la réponse de l'hôte.",
      "<strong>4e génération</strong> : un échafaudage biodégradable, des cellules vivantes et des facteurs bioactifs ; le support disparaît pendant que l'os se reforme (ingénierie tissulaire, médecine régénérative, nanomédecine)."
    ];
    function dessin() {
      R.vider(g);
      btn.forEach(function (x, k) { x.classList.toggle("actif", k + 1 === gen); });
      // frise
      R.ligne(g, [120, 50], [840, 50], { couleur: "#d9dde6", epaisseur: 6 });
      ["1re", "2e", "3e", "4e"].forEach(function (t, k) {
        var x = 120 + k * 240, a = k + 1 === gen;
        R.el("circle", { cx: x, cy: 50, r: a ? 22 : 16, fill: a ? C.acc : "#fff", stroke: a ? C.acc : "#9aa0a6", "stroke-width": 3 }, g);
        R.texte(g, t, [x, 51], { italique: false, gras: true, taille: a ? 16 : 14, couleur: a ? "#fff" : C.fonce, halo: false });
      });
      // os en coupe
      R.el("rect", { x: 250, y: 110, width: 460, height: 360, rx: 40, fill: OS, stroke: BORD, "stroke-width": 3 }, g);
      R.texte(g, "os", [290, 140], { italique: false, couleur: "#8a7650", taille: 17 });
      var dx = 380, dy = 190, dl = 200, dh = 200;
      R.el("rect", { x: dx, y: dy, width: dl, height: dh, fill: "#fff6f0", stroke: BORD, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
      if (gen === 1) {
        R.el("rect", { x: dx + 14, y: dy + 14, width: dl - 28, height: dh - 28, rx: 10, fill: "#c9a46a", stroke: "#7a5a2b", "stroke-width": 3 }, g);
        for (var i = 0; i < 5; i++) R.el("path", { d: "M" + (dx + 30) + " " + (dy + 40 + i * 30) + " q80 -12 140 6", fill: "none", stroke: "#a07c45", "stroke-width": 2 }, g);
        ["?", "?", "?"].forEach(function (q, k) { R.texte(g, q, [dx - 30 + k * 130, dy - 30 + (k % 2) * 270], { italique: false, gras: true, couleur: C.doux, taille: 34 }); });
        R.texte(g, "bois", [dx + dl / 2, dy + dh / 2], { italique: false, gras: true, taille: 22 });
      } else if (gen === 2 || gen === 3) {
        R.el("rect", { x: dx + 10, y: dy + 10, width: dl - 20, height: dh - 20, rx: 10, fill: "#b8c0cc", stroke: C.fonce, "stroke-width": 3 }, g);
        R.texte(g, "alliage", [dx + dl / 2, dy + dh / 2], { italique: false, gras: true, taille: 22 });
        if (gen === 3) {
          for (var t = 0; t < 4; t++) for (var k = 0; k < 7; k++) {
            var pos = k / 6, x, y, nx, ny;
            if (t === 0) { x = dx + 10 + pos * (dl - 20); y = dy + 10; nx = 0; ny = -1; }
            else if (t === 1) { x = dx + 10 + pos * (dl - 20); y = dy + dh - 10; nx = 0; ny = 1; }
            else if (t === 2) { x = dx + 10; y = dy + 10 + pos * (dh - 20); nx = -1; ny = 0; }
            else { x = dx + dl - 10; y = dy + 10 + pos * (dh - 20); nx = 1; ny = 0; }
            R.ligne(g, [x, y], [x + nx * 18, y + ny * 18], { couleur: C.acc, epaisseur: 3 });
            R.el("circle", { cx: x + nx * 22, cy: y + ny * 22, r: 5, fill: C.acc }, g);
          }
          R.texte(g, "molécules greffées en surface", [480, 440], { italique: false, couleur: C.acc, gras: true, taille: 17 });
        }
      } else {
        for (var a = 0; a < 6; a++) for (var c = 0; c < 6; c++) R.el("circle", { cx: dx + 18 + a * 33, cy: dy + 18 + c * 33, r: 13, fill: "none", stroke: C.acc, "stroke-width": 4, opacity: 0.55 }, g);
        R.el("path", { d: "M" + dx + " " + dy + " h" + dl + " v" + dh + " h" + (-dl) + " Z M" + (dx + 45) + " " + (dy + 45) + " v" + (dh - 90) + " h" + (dl - 90) + " v" + (-(dh - 90)) + " Z", fill: "#e9d6ae", "fill-rule": "evenodd", opacity: 0.9 }, g);
        for (var m = 0; m < 10; m++) R.el("circle", { cx: dx + dl / 2 + 60 * Math.cos(m * 0.63), cy: dy + dh / 2 + 60 * Math.sin(m * 0.63), r: 7, fill: C.v }, g);
        R.texte(g, "échafaudage, cellules, os neuf", [480, 440], { italique: false, couleur: C.acc, gras: true, taille: 17 });
      }
      f.direct.innerHTML = "<p>" + TXT[gen - 1] + "</p>";
    }
    dessin();
  })();

  /* ---------- Modification de surface : hydrophobe ou hydrophile ---------- */
  (function () {
    var f = R.figure("fig-surface", {
      largeur: 960, hauteur: 420, titre: "Goutte d'eau sur une surface d'implant",
      essai: "<strong>Essaie</strong> : augmente la densité de molécules greffées. <strong>Observe</strong> : la goutte s'étale, l'angle de contact baisse : la surface passe d'hydrophobe à hydrophile. Modèle illustratif (exemple ajouté) : les valeurs d'angle ne sont pas celles d'un matériau réel."
    });
    var g = R.el("g", null, f.svg);
    var cd = R.curseur(f.reglages, { nom: "Molécules greffées", min: 0, max: 100, pas: 1, val: 0, unite: " %", surChange: dessin });
    function dessin() {
      R.vider(g);
      var d = cd.v / 100, a = 110 - 80 * d, t = a * Math.PI / 180;
      R.el("rect", { x: 120, y: 300, width: 720, height: 70, fill: "#b8c0cc", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.texte(g, "implant", [160, 340], { italique: false, couleur: C.fonce, taille: 17, ancre: "start" });
      var nb = Math.round(d * 30);
      for (var i = 0; i < nb; i++) { var x = 140 + i * 680 / 29; R.ligne(g, [x, 300], [x, 280], { couleur: C.acc, epaisseur: 3 }); R.el("circle", { cx: x, cy: 276, r: 5, fill: C.acc }, g); }
      var V = 12000, fv = (2 - 3 * Math.cos(t) + Math.pow(Math.cos(t), 3)) / (3 * Math.pow(Math.sin(t), 3));
      var w = Math.pow(V / (Math.PI * fv), 1 / 3) * 4.6, Rr = w / Math.sin(t), h = Rr * (1 - Math.cos(t)), cx = 480, base = 272;
      R.el("path", { d: "M" + (cx - w) + " " + base + " A" + Rr + " " + Rr + " 0 " + (a > 90 ? 1 : 0) + " 1 " + (cx + w) + " " + base + " Z", fill: "rgba(59,91,219,0.22)", stroke: "#3b5bdb", "stroke-width": 3 }, g);
      R.ligne(g, [cx + w, base], [cx + w - 90 * Math.cos(t), base - 90 * Math.sin(t)], { couleur: C.fonce, epaisseur: 2.5, tirets: "6 4" });
      R.texte(g, "angle de contact " + Math.round(a) + "°", [cx, base - h - 30], { italique: false, gras: true, couleur: "#3b5bdb", taille: 20 });
      f.direct.innerHTML = "<p>Surface <strong>" + (a > 90 ? "hydrophobe" : "hydrophile") + "</strong> : angle de contact " + Math.round(a) + "°. Une molécule d'intérêt biologique liée à la surface peut viser l'équilibre hydrophobe / hydrophile, une spécificité ou une bioactivité.</p>";
    }
    dessin();
  })();
})();
