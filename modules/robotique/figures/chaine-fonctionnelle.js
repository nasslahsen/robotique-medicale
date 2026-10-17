(function () {
  "use strict";
  var R = RM, C = R.C, M = window.MECA;

  /* ---------- Figure 1 : un bras à 5 axes, monté ou éclaté ---------- */
  (function () {
    var f = R.figure("fig-robot-axes", {
      largeur: 960, hauteur: 540,
      titre: "Bras à 5 axes fait de modules d'articulation et de pièces de liaison",
      essai: "<strong>Essaie</strong> : passe en vue éclatée, puis touche une pièce. <strong>Observe</strong> : le bras n'est qu'une pile de modules d'articulation (un axe chacun, avec son moteur) reliés par des pièces rigides de longueurs différentes."
    });
    var g = R.el("g", null, f.svg), t = 0, choisi = null;
    var b = R.boutons(f.reglages);
    var bM = R.bouton(b, "Vue montée", function () { aller(0); }), bE = R.bouton(b, "Vue éclatée", function () { aller(1); });
    var info = R.h("p", null, "", f.direct);
    // pièces : [id, type, position montée, décalage éclaté, nom, description]
    var P = [
      ["base", "base", [300, 470], [-150, 20], "Base", "Boîtier fixe qui porte tout le bras (et ici l'électronique)."],
      ["a1", "module", [300, 405], [-150, -20], "Module d'articulation 1", "Rotation de tout le bras autour de l'axe vertical. Un module = un axe : moteur, réduction, guidage dans un même boîtier."],
      ["l1", "liaison", [300, 350], [-120, -50], "Pièce de liaison courte", "Pièce rigide qui relie deux modules. Elle fixe la distance entre deux axes."],
      ["a2", "module", [300, 300], [-80, -80], "Module d'articulation 2 (épaule)", "Rotation de l'épaule. C'est l'axe qui porte le plus de charge : tout le bras est au-dessus."],
      ["l2", "bras", [300, 300], [-20, -110], "Pièce de liaison longue", "Segment le plus long : un petit jeu de l'épaule devient ici un grand déplacement en bout."],
      ["a3", "module", [470, 170], [40, -120], "Module d'articulation 3 (coude)", "Rotation du coude."],
      ["l3", "bras2", [470, 170], [90, -90], "Pièce de liaison moyenne", "Relie le coude au poignet."],
      ["a4", "module", [640, 250], [150, -60], "Module d'articulation 4 (poignet)", "Oriente l'outil."],
      ["a5", "outil", [640, 318], [220, -10], "Module 5 et effecteur", "Rotation de l'outil sur lui-même, puis la pince."]
    ];
    function aller(v) { var d = t; R.animer(700, function (u) { t = d + (v - d) * u; dessiner(); }); bM.classList.toggle("actif", v === 0); bE.classList.toggle("actif", v === 1); }
    function pos(p) { return [p[2][0] + p[3][0] * t, p[2][1] + p[3][1] * t]; }
    function dessiner() {
      R.vider(g);
      R.ligne(g, [80, 512], [880, 512], { couleur: "#d9dde6", epaisseur: 6 });
      P.forEach(function (p) {
        var q = pos(p), gp = R.el("g", { style: "cursor:pointer" }, g), sel = choisi === p[0];
        var fill = sel ? PLATEFORME.teinte(0.35) : "#5b6172", clair = sel ? PLATEFORME.teinte(0.2) : "#9aa0ad";
        gp.addEventListener("click", function () { choisi = p[0]; dessiner(); });
        if (p[1] === "base") R.el("rect", { x: q[0] - 120, y: q[1] - 30, width: 240, height: 70, rx: 12, fill: fill, stroke: C.fonce, "stroke-width": 2 }, gp);
        else if (p[1] === "module") {
          R.el("rect", { x: q[0] - 46, y: q[1] - 30, width: 92, height: 60, rx: 14, fill: clair, stroke: C.fonce, "stroke-width": 2.5 }, gp);
          R.el("circle", { cx: q[0], cy: q[1], r: 22, fill: "#fff", stroke: C.fonce, "stroke-width": 2.5 }, gp);
          R.el("circle", { cx: q[0], cy: q[1], r: 8, fill: PLATEFORME.couleur() }, gp);
          R.el("rect", { x: q[0] + 46, y: q[1] - 16, width: 40, height: 32, rx: 4, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2 }, gp);
        } else if (p[1] === "liaison") R.el("rect", { x: q[0] - 34, y: q[1] - 22, width: 68, height: 44, rx: 6, fill: fill, stroke: C.fonce, "stroke-width": 2 }, gp);
        else if (p[1] === "bras") { var a = [q[0], q[1] - 40], bb = [q[0] + 170, q[1] - 130]; R.el("line", { x1: a[0], y1: a[1], x2: bb[0], y2: bb[1], stroke: fill, "stroke-width": 40, "stroke-linecap": "round" }, gp); }
        else if (p[1] === "bras2") { var c0 = [q[0] + 30, q[1] + 30], c1 = [q[0] + 150, q[1] + 60]; R.el("line", { x1: c0[0], y1: c0[1], x2: c1[0], y2: c1[1], stroke: fill, "stroke-width": 34, "stroke-linecap": "round" }, gp); }
        else {
          R.el("rect", { x: q[0] - 22, y: q[1] - 34, width: 44, height: 50, rx: 8, fill: clair, stroke: C.fonce, "stroke-width": 2.5 }, gp);
          R.ligne(gp, [q[0] - 10, q[1] + 16], [q[0] - 16, q[1] + 56], { couleur: C.fonce, epaisseur: 7 }); R.ligne(gp, [q[0] + 10, q[1] + 16], [q[0] + 16, q[1] + 56], { couleur: C.fonce, epaisseur: 7 });
        }
      });
      // flèches de rotation, en vue montée
      if (t < 0.05) {
        [[300, 405, "1"], [300, 300, "2"], [470, 170, "3"], [640, 250, "4"]].forEach(function (a) {
          R.el("path", { d: "M" + (a[0] - 52) + " " + (a[1] - 30) + " A 60 60 0 0 1 " + (a[0] + 30) + " " + (a[1] - 54), fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
          R.texte(g, a[2], [a[0] - 70, a[1] - 46], { italique: false, gras: true, couleur: C.acc, taille: 22 });
        });
        R.el("ellipse", { cx: 640, cy: 378, rx: 34, ry: 10, fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
        R.texte(g, "5", [692, 380], { italique: false, gras: true, couleur: C.acc, taille: 22 });
      }
      var p = P.filter(function (x) { return x[0] === choisi; })[0];
      info.innerHTML = p ? "<strong>" + p[4] + "</strong> : " + p[5] : "Touche une pièce pour la nommer. Les flèches numérotées sont les 5 axes de rotation.";
    }
    aller(0);
  })();

  /* ---------- Figure 2 : la chaîne fonctionnelle d'un axe, maillon par maillon ---------- */
  (function () {
    var f = R.figure("fig-chaine", {
      largeur: 960, hauteur: 460,
      titre: "Chaîne fonctionnelle d'un axe, en coupe",
      essai: "<strong>Essaie</strong> : touche un maillon de la chaîne. <strong>Observe</strong> : chaque maillon a sa fonction, et chacun peut ajouter un défaut (jeu, souplesse, frottement, désalignement) que l'outil subira."
    });
    var g = R.el("g", null, f.svg), choisi = "moteur", info = R.h("p", null, "", f.direct);
    var MAILLONS = [
      ["moteur", "Moteur", "Actionneur : transforme l'énergie (ici électrique) en rotation.", [40, 150]],
      ["reduction", "Réduction", "Diminue la vitesse et augmente le couple : \\(C_s \\simeq \\eta\\, i\\, C_e\\). Peut apporter du jeu et des pertes (rendement).", [230, 150]],
      ["transmission", "Transmission", "Amène le mouvement jusqu'à l'organe (arbre, accouplement). Peut se tordre (rigidité torsionnelle).", [420, 150]],
      ["guidage", "Guidage", "Tient l'arbre : autorise la rotation utile, bloque le reste. Peut apporter jeu, frottement, défauts d'alignement.", [610, 150]],
      ["bras", "Bras / effecteur", "Structure qui porte l'outil. Se déforme sous la charge ; un petit angle à l'axe devient un déplacement \\(L\\,\\Delta\\theta\\).", [800, 150]]
    ];
    function dessiner() {
      R.vider(g);
      // blocs de la chaîne
      MAILLONS.forEach(function (m, k) {
        var x = 30 + k * 186, sel = m[0] === choisi;
        var gp = R.el("g", { style: "cursor:pointer" }, g);
        gp.addEventListener("click", function () { choisi = m[0]; dessiner(); });
        R.el("rect", { x: x, y: 24, width: 160, height: 56, rx: 12, fill: sel ? PLATEFORME.couleur() : "#fff", stroke: C.fonce, "stroke-width": 2.5 }, gp);
        R.texte(gp, m[1], [x + 80, 53], { italique: false, gras: true, taille: 18, couleur: sel ? "#fff" : C.fonce, halo: false });
        if (k < 4) R.fleche(g, [x + 162, 52], [x + 184, 52], { couleur: C.fonce, epaisseur: 3, tete: 10 });
      });
      // l'axe en coupe
      var Y = 290, sel = function (id) { return choisi === id ? PLATEFORME.teinte(0.18) : "none"; };
      [["moteur", 70, 230], ["reduction", 240, 380], ["transmission", 380, 520], ["guidage", 520, 700], ["bras", 700, 920]].forEach(function (z) { R.el("rect", { x: z[1], y: 110, width: z[2] - z[1], height: 330, rx: 18, fill: sel(z[0]) }, g); });
      R.el("rect", { x: 90, y: Y - 70, width: 140, height: 140, rx: 16, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 3 }, g);
      for (var k = 1; k < 6; k++) R.ligne(g, [90 + k * 23, Y - 70], [90 + k * 23, Y + 70], { couleur: "#9aa0ad", epaisseur: 2 });
      R.el("rect", { x: 250, y: Y - 80, width: 120, height: 160, rx: 16, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 3 }, g);
      M.roue(g, [282, Y - 30], { m: 3.2, Z: 12, fill: "#fff", repere: false, trou: 4 });
      M.roue(g, [282 + 3.2 * 36 / 2, Y + 8], { m: 3.2, Z: 24, rot: Math.PI / 24, fill: "#fff", repere: false, trou: 6 });
      M.arbre(g, 370, 800, Y, 15, { axe: false });
      M.traitAxe(g, [60, Y], [930, Y]);
      var H = M.hachures(g, "#5b6172", { fond: "#fff" });
      R.el("rect", { x: 540, y: Y - 110, width: 150, height: 60, fill: H, stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: 540, y: Y + 50, width: 150, height: 60, fill: H, stroke: C.fonce, "stroke-width": 2 }, g);
      [570, 660].forEach(function (x) { M.roulement(g, x, Y - 15, 44, 35, {}); M.roulement(g, x, Y + 15, 44, 35, { sens: -1 }); });
      R.el("rect", { x: 760, y: Y - 50, width: 90, height: 100, rx: 14, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("path", { d: "M775 " + (Y - 40) + " L790 140 L830 140 L835 " + (Y - 40) + " Z", fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 3 }, g);
      R.ligne(g, [796, 140], [786, 112], { couleur: C.fonce, epaisseur: 7 }); R.ligne(g, [824, 140], [834, 112], { couleur: C.fonce, epaisseur: 7 });
      var m = MAILLONS.filter(function (x) { return x[0] === choisi; })[0];
      info.innerHTML = "<strong>" + m[1] + "</strong> : " + m[2];
      rendreInfo();
    }
    function rendreInfo() { if (window.renderMathInElement) window.renderMathInElement(info, { delimiters: [{ left: "\\(", right: "\\)", display: false }], throwOnError: false }); }
    f.svg.addEventListener("click", function (ev) {
      var p = R.coordSVG(f.svg, ev);
      if (p[1] < 100) return;
      [["moteur", 70, 230], ["reduction", 240, 380], ["transmission", 380, 520], ["guidage", 520, 700], ["bras", 700, 920]].forEach(function (z) { if (p[0] >= z[1] && p[0] < z[2]) choisi = z[0]; });
      dessiner();
    });
    dessiner();
  })();

  /* ---------- Figure 3 : contraintes du contexte biomédical ---------- */
  (function () {
    var f = R.figure("fig-biomedical", {
      largeur: 960, hauteur: 500,
      titre: "Un bras de soin au-dessus d'un patient : où vivent les contraintes",
      essai: "<strong>Essaie</strong> : touche les pastilles numérotées. <strong>Observe</strong> : chaque contrainte biomédicale vise un endroit précis de la machine ; le choix final pèse ces critères avec les critères classiques."
    });
    var g = R.el("g", null, f.svg), choisi = 1, info = R.h("p", null, "", f.direct);
    var PTS = [
      [1, [520, 150], "Masse mobile", "Tout ce que porte le bras est accéléré à chaque mouvement : moins de masse mobile, c'est moins d'inertie et un choc moins violent en cas de contact."],
      [2, [215, 250], "Bruit et vibrations", "Moteurs et engrenages font du bruit et vibrent ; près d'un patient éveillé, on les limite."],
      [3, [395, 175], "Points de pincement", "Là où deux pièces se rapprochent pendant le mouvement, un doigt ou un tissu peut être coincé."],
      [4, [760, 260], "Nettoyage et maintenance", "Surfaces lisses, sans recoins, faciles à nettoyer et à entretenir."],
      [5, [300, 300], "Lubrifiants confinés", "La graisse du réducteur reste dans son carter : rien ne doit tomber sur le champ de soin."],
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
