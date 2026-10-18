(function () {
  "use strict";
  var R = RM, C = R.C, PI = Math.PI;
  function engr(rA, ZA, phi, ZB) { return phi + PI + PI / ZB + (phi - rA) * ZA / ZB; }
  function pts(l) { return l.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
  function cone(g, sommet, u, L0, L1, r0, r1, fill) {
    var v = [-u[1], u[0]], P = function (L, r) { return [sommet[0] + u[0] * L + v[0] * r, sommet[1] + u[1] * L + v[1] * r]; };
    var l = [P(L0, r0), P(L1, r1), P(L1, -r1), P(L0, -r0)];
    R.el("polygon", { points: pts(l), fill: fill, stroke: C.fonce, "stroke-width": 2 }, g);
    for (var k = 1; k < 7; k++) { var f = k / 7; R.ligne(g, [l[0][0] + (l[1][0] - l[0][0]) * f, l[0][1] + (l[1][1] - l[0][1]) * f], [l[3][0] + (l[2][0] - l[3][0]) * f, l[3][1] + (l[2][1] - l[3][1]) * f], { couleur: C.fonce, epaisseur: 1 }); }
  }
  function face(g, x, y, w, h, pente, fill, chevron) {
    R.el("rect", { x: x, y: y, width: w, height: h, rx: 4, fill: fill, stroke: C.fonce, "stroke-width": 2 }, g);
    for (var k = 0; k <= 10; k++) {
      var yy = y + 6 + (h - 12) * k / 10;
      if (chevron) { R.ligne(g, [x, yy - pente / 2], [x + w / 2, yy], { couleur: C.fonce, epaisseur: 1.6 }); R.ligne(g, [x + w / 2, yy], [x + w, yy - pente / 2], { couleur: C.fonce, epaisseur: 1.6 }); }
      else R.ligne(g, [x + 2, yy - pente / 2], [x + w - 2, yy + pente / 2], { couleur: C.fonce, epaisseur: 1.6 });
    }
  }
  function vis(g, x0, x1, y, r) {
    R.el("rect", { x: x0, y: y - r, width: x1 - x0, height: 2 * r, rx: 8, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2 }, g);
    for (var x = x0 + 10; x < x1 - 4; x += 18) R.ligne(g, [x, y - r + 2], [x + 11, y + r - 2], { couleur: C.fonce, epaisseur: 2 });
  }
  function axe(g, a, b) { MECA.traitAxe(g, a, b, { coul: C.z, ep: 2.4 }); }

  /* ---------- Figure 1 : pignon, roue, couronne, crémaillère ---------- */
  (function () {
    var f = R.figure("fig-vocabulaire", {
      largeur: 960, hauteur: 540,
      titre: "Pignon et roue, pignon et couronne, pignon et crémaillère",
      essai: "<strong>Essaie</strong> : choisis une pièce, puis fais tourner les pignons. " +
        "<strong>Observe</strong> : la roue tourne en sens inverse de son pignon et moins vite ; la couronne tourne dans le même sens que son pignon ; la crémaillère se déplace en ligne droite."
    });
    var g = R.el("g", null, f.svg), t = 0, choisi = null, btns = {};
    var DEF = {
      pignon: "Pignon : petite roue dentée d'un engrenage.",
      roue: "Roue : roue dentée qui s'engrène avec le pignon ; dans un engrenage pignon-roue extérieur, elle est généralement la plus grande des deux.",
      couronne: "Couronne : roue dentée dont les dents sont situées sur sa face intérieure ; elle engrène avec un pignon placé à l'intérieur.",
      cremaillere: "Crémaillère : barre droite munie de dents qui s'engrènent avec un pignon ; la rotation du pignon devient un déplacement rectiligne, ou inversement."
    };
    var b = R.boutons(f.reglages);
    [["pignon", "Pignon"], ["roue", "Roue"], ["couronne", "Couronne"], ["cremaillere", "Crémaillère"]].forEach(function (p) {
      btns[p[0]] = R.bouton(b, p[1], function () { choisi = p[0]; Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === choisi); }); dessiner(); });
    });
    var bt = R.bouton(b, "Faire tourner les pignons", function () {
      bt.disabled = true; var t0 = t;
      R.animer(3000, function (u) { t = t0 + u * 2 * PI; dessiner(); }, function () { bt.disabled = false; });
    });
    var info = R.h("p", null, "Choisis une pièce.", f.direct);
    function coul(k) { return choisi === k ? PLATEFORME.teinte(0.45) : k === "pignon" ? "#cfe0ff" : "#dfe3ea"; }
    function dessiner() {
      R.vider(g);
      // pignon (12 dents) et roue (30 dents)
      var m1 = 6, cr = [180, 200], cp = [180 + m1 * 21, 200];
      MECA.roue(g, cr, { m: m1, Z: 30, rot: engr(t, 12, PI, 30), fill: coul("roue") });
      MECA.roue(g, cp, { m: m1, Z: 12, rot: t, fill: coul("pignon") });
      // couronne (40 dents) et pignon intérieur (14 dents)
      var m2 = 5, cc = [670, 200], cpi = [670, 200 + m2 * 13];
      MECA.couronne(g, cc, { m: m2, Z: 40, rot: -PI / 2 + (t + PI / 2) * 14 / 40, fill: coul("couronne") });
      MECA.roue(g, cpi, { m: m2, Z: 14, rot: t - PI / 2, fill: coul("pignon") });
      // crémaillère et pignon (14 dents)
      var m3 = 8, cx = 480, yp = 470, rp = m3 * 7;
      MECA.cremaillere(g, 60, 900, yp, { m: m3, dx: cx + PI * m3 / 2 + t * rp, fill: coul("cremaillere") });
      MECA.roue(g, [cx, yp - rp], { m: m3, Z: 14, rot: t - PI / 2, fill: coul("pignon") });
      R.texte(g, "roue", [180, 330], { italique: false, couleur: C.doux, taille: 17 });
      R.texte(g, "couronne", [670, 345], { italique: false, couleur: C.doux, taille: 17 });
      R.texte(g, "crémaillère", [800, 525], { italique: false, couleur: C.doux, taille: 17 });
      info.textContent = choisi ? DEF[choisi] : "Choisis une pièce.";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : position relative des axes ---------- */
  (function () {
    var f = R.figure("fig-axes", {
      largeur: 960, hauteur: 420,
      titre: "Axes parallèles, concourants, gauches",
      essai: "<strong>Essaie</strong> : choisis une famille. " +
        "<strong>Observe</strong> : les axes (traits mixtes bleus) sont parallèles, se coupent en un point, ou se croisent sans être dans un même plan (l'axe de la roue sort de l'écran, celui de la vis est horizontal)."
    });
    var g = R.el("g", null, f.svg), choisi = "par", btns = {};
    var DEF = { par: "Engrenages parallèles : axes parallèles (ici deux roues vues de côté).", conc: "Engrenages concourants : les axes se coupent (roues coniques, sommet commun).", gau: "Engrenages gauches : les axes ne sont pas dans un même plan (roue et vis sans fin)." };
    var b = R.boutons(f.reglages);
    [["par", "Parallèles"], ["conc", "Concourants"], ["gau", "Gauches"]].forEach(function (p) {
      btns[p[0]] = R.bouton(b, p[1], function () { choisi = p[0]; maj(); });
    });
    var info = R.h("p", null, "", f.direct);
    function maj() { Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === choisi); }); dessiner(); }
    function dessiner() {
      R.vider(g);
      [["par", 160], ["conc", 480], ["gau", 800]].forEach(function (z) {
        var on = z[0] === choisi;
        R.el("rect", { x: z[1] - 150, y: 20, width: 300, height: 380, rx: 20, fill: on ? "#fff" : "#fafbfd", stroke: on ? C.acc : "#e3e6ee", "stroke-width": on ? 3 : 2, opacity: 1 }, g);
      });
      var op = function (k) { return k === choisi ? 1 : 0.35; };
      var gp = R.el("g", { opacity: op("par") }, g);
      axe(gp, [30, 160], [290, 160]); axe(gp, [30, 290], [290, 290]);
      R.el("rect", { x: 125, y: 95, width: 70, height: 130, rx: 4, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2 }, gp);
      R.el("rect", { x: 125, y: 225, width: 70, height: 130, rx: 4, fill: "#cfe0ff", stroke: C.fonce, "stroke-width": 2 }, gp);
      var gc = R.el("g", { opacity: op("conc") }, g), S = [560, 160];
      axe(gc, [350, 160], [590, 160]); axe(gc, [560, 380], [560, 130]);
      cone(gc, S, [-1, 0], 40, 140, 22, 80, "#dfe3ea"); cone(gc, S, [0, 1], 40, 140, 22, 80, "#cfe0ff");
      R.point(gc, S, { couleur: C.z, r: 7 }); R.texte(gc, "S", [S[0] + 18, S[1] - 16], { couleur: C.z, gras: true });
      var gg = R.el("g", { opacity: op("gau") }, g);
      MECA.roue(gg, [800, 175], { m: 6, Z: 30, fill: "#dfe3ea", trou: 14 });
      R.point(gg, [800, 175], { couleur: C.z, r: 6 });
      vis(gg, 690, 910, 293, 22); axe(gg, [670, 293], [930, 293]);
      R.texte(gg, "axe de la roue : vers toi", [800, 370], { italique: false, couleur: C.z, taille: 15 });
      info.textContent = DEF[choisi];
    }
    maj();
  })();

  /* ---------- Figure 3 : types d'engrenages ---------- */
  (function () {
    var f = R.figure("fig-types", {
      largeur: 960, hauteur: 440,
      titre: "Types d'engrenages",
      essai: "<strong>Essaie</strong> : passe d'un type à l'autre. " +
        "<strong>Observe</strong> : à gauche, les deux roues vues de dessus (dents droites, inclinées ou en chevron) ; les coniques relient des axes qui se coupent ; la vis doit faire un tour pour avancer la roue d'une seule dent."
    });
    var g = R.el("g", null, f.svg), choisi = "droite", btns = {};
    var DEF = {
      droite: "Denture droite : les dents sont parallèles à l'axe de rotation.",
      helico: "Denture hélicoïdale : les dents sont inclinées par rapport à l'axe, ce qui offre un fonctionnement plus progressif et silencieux. Les deux roues ont des inclinaisons opposées.",
      chevron: "Denture chevron (figure du cours) : deux hélices opposées sur la même roue.",
      conique: "Engrenages coniques : ils transmettent le mouvement entre des arbres qui se croisent, généralement perpendiculaires. Denture droite, hélicoïdale ou spirale.",
      vis: "Roue et vis sans fin : grand rapport de réduction entre deux arbres non concourants et perpendiculaires ; le système est souvent irréversible."
    };
    var b = R.boutons(f.reglages);
    [["droite", "Denture droite"], ["helico", "Hélicoïdale"], ["chevron", "Chevron"], ["conique", "Coniques"], ["vis", "Roue et vis sans fin"]].forEach(function (p) {
      btns[p[0]] = R.bouton(b, p[1], function () { choisi = p[0]; maj(); });
    });
    var info = R.h("p", null, "", f.direct);
    function maj() { Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === choisi); }); dessiner(); }
    function dessiner() {
      R.vider(g);
      if (choisi === "droite" || choisi === "helico" || choisi === "chevron") {
        var pente = choisi === "droite" ? 0 : 26, ch = choisi === "chevron";
        R.texte(g, "vue de dessus", [230, 30], { italique: false, couleur: C.doux, taille: 16 });
        axe(g, [80, 140], [380, 140]); axe(g, [80, 320], [380, 320]);
        face(g, 170, 50, 120, 180, pente, "#dfe3ea", ch);
        face(g, 170, 230, 120, 180, ch ? pente : -pente, "#cfe0ff", ch);
        R.texte(g, "vue de face", [700, 30], { italique: false, couleur: C.doux, taille: 16 });
        MECA.roue(g, [640, 230], { m: 7, Z: 24, fill: "#dfe3ea" });
        MECA.roue(g, [640 + 7 * 18, 230], { m: 7, Z: 12, rot: PI + PI / 12, fill: "#cfe0ff" });
      } else if (choisi === "conique") {
        var S = [560, 140];
        axe(g, [300, 140], [600, 140]); axe(g, [560, 420], [560, 110]);
        cone(g, S, [-1, 0], 40, 190, 26, 110, "#dfe3ea"); cone(g, S, [0, 1], 40, 190, 26, 110, "#cfe0ff");
        R.point(g, S, { couleur: C.z, r: 7 }); R.texte(g, "S", [S[0] + 18, S[1] - 16], { couleur: C.z, gras: true });
      } else {
        MECA.roue(g, [480, 190], { m: 6, Z: 40, fill: "#dfe3ea", trou: 16 });
        vis(g, 300, 660, 338, 26);
        axe(g, [270, 338], [690, 338]);
        R.point(g, [480, 190], { couleur: C.z, r: 6 });
        R.texte(g, "1 tour de vis = 1 dent de roue (vis à un filet)", [480, 410], { italique: false, couleur: C.doux, taille: 16 });
      }
      info.textContent = DEF[choisi];
    }
    maj();
  })();
})();
