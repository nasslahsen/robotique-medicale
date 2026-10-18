(function () {
  "use strict";
  var R = RM, C = R.C, M = MECA, GR = "#5b6172", OK = "#12a26b";

  /* ---------- Figure : quatre liaisons complètes, chaque élément et sa fonction ---------- */
  (function () {
    var f = R.figure("fig-liaisons", {
      largeur: 960, hauteur: 560,
      titre: "Liaisons complètes : qui fait quoi ?",
      essai: "<strong>Essaie</strong> : choisis une liaison, puis touche un élément sur le dessin ou dans la liste. " +
        "<strong>Observe</strong> : chaque élément assure une fonction précise ; aucun ne fait tout."
    });
    var SC = {
      bride: { nom: "Vis et goupilles", el: [
        ["vis", "Vis", "SERRER : elle crée la précharge qui plaque la pièce sur le socle. Elle passe avec du jeu dans la pièce du haut."],
        ["goupille", "Goupilles", "POSITIONNER : ajustées dans les deux pièces, elles redonnent la même position relative à chaque montage."],
        ["piece", "Pièce", "La pièce assemblée sur le socle."]] },
      ecrou: { nom: "Écrou à encoches", el: [
        ["ecrou", "Écrou à encoches", "SERRER et MAINTENIR AXIALEMENT : vissé sur la tête filetée de l'arbre, il plaque le roulement contre l'épaulement. Il se serre avec une clé à ergots."],
        ["rondelle", "Rondelle frein", "PRÉVENIR LE DESSERRAGE : sa languette intérieure entre dans la rainure de clavette usinée sur l'arbre fileté ; une languette extérieure est déformée (outil de frappe, marteau) dans une encoche de l'écrou."],
        ["roulement", "Roulement", "La pièce fixée sur l'arbre. Le montage reste démontable."]] },
      meplat: { nom: "Vis sur méplat", el: [
        ["vis", "Vis", "Vissée dans le moyeu, elle appuie sur le méplat et plaque l'arbre contre la paroi opposée de l'alésage : la roue est immobilisée en rotation et peut transmettre un couple."],
        ["arbre", "Méplat de l'arbre", "Il offre une surface d'appui à la vis et limite le risque de glissement en rotation."],
        ["moyeu", "Moyeu de la roue", "Remarque : la vis retient aussi la roue axialement par frottement, mais ce montage ne garantit pas un positionnement axial précis."]] },
      goupille: { nom: "Goupille transversale", el: [
        ["goupille", "Goupille", "Insérée dans les trous alignés de l'arbre et du moyeu : elle immobilise la roue en rotation et transmet le couple par cisaillement. Elle contribue aussi au maintien axial."],
        ["arbre", "Arbre et alésage", "Les surfaces cylindriques de l'arbre et de l'alésage assurent le centrage de la roue."],
        ["moyeu", "Moyeu de la roue", "La roue dentée, entraînée par la goupille."]] }
    };
    var scene = "bride", choisi = "vis", cibles = {};
    var b1 = R.boutons(f.reglages), b2 = R.boutons(f.reglages), bs = {}, be = {};
    Object.keys(SC).forEach(function (k) { bs[k] = R.bouton(b1, SC[k].nom, function () { scene = k; choisi = SC[k].el[0][0]; boutonsEl(); dessiner(); }); });
    var info = R.h("p", null, "", f.direct);
    function boutonsEl() {
      b2.innerHTML = "";
      be = {};
      SC[scene].el.forEach(function (e) { be[e[0]] = R.bouton(b2, e[1], function () { choisi = e[0]; dessiner(); }); });
    }
    var g = R.el("g", { transform: "translate(150 -20) scale(0.95)" }, f.svg);
    f.svg.addEventListener("click", function (ev) {
      var p = R.coordSVG(f.svg, ev), q = [(p[0] - 150) / 0.95, (p[1] + 20) / 0.95], best = null, dmin = 90;
      Object.keys(cibles).forEach(function (k) { var c = cibles[k], d = Math.hypot(q[0] - c[0], q[1] - c[1]); if (d < dmin) { dmin = d; best = k; } });
      if (best) { choisi = best.replace(/2$/, ""); dessiner(); }
    });
    function coupe(x, y, w, h, angle, cle) { return R.el("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, choisi === cle ? C.acc : GR, { fond: "#fff", angle: angle }), stroke: C.fonce, "stroke-width": choisi === cle ? 3.5 : 2.5 }, g); }
    function vue(x, y, w, h, cle, rx) { var on = choisi === cle; return R.el("rect", { x: x, y: y, width: w, height: h, rx: rx || 0, fill: on ? PLATEFORME.teinte(0.3) : "#dfe3ea", stroke: on ? C.acc : C.fonce, "stroke-width": on ? 3.5 : 2.5 }, g); }
    function txt(t, p, a) { R.texte(g, t, p, { italique: false, taille: 18, couleur: C.doux, ancre: a || "middle" }); }
    function dessiner() {
      R.vider(g);
      Object.keys(bs).forEach(function (k) { bs[k].classList.toggle("actif", k === scene); });
      Object.keys(be).forEach(function (k) { be[k].classList.toggle("actif", k === choisi); });
      var yc, y, x;
      if (scene === "bride") {
        coupe(60, 340, 560, 150, 45, "socle"); coupe(150, 230, 380, 110, -45, "piece");
        R.el("rect", { x: 323, y: 230, width: 34, height: 110, fill: "#fff" }, g); R.el("rect", { x: 326, y: 340, width: 28, height: 112, fill: "#fff" }, g);
        [205, 475].forEach(function (x) { R.el("rect", { x: x - 11, y: 262, width: 22, height: 150, fill: "#fff" }, g); });
        vue(326, 230, 28, 214, "vis"); for (y = 352; y < 440; y += 9) R.ligne(g, [326, y], [354, y + 4], { epaisseur: 1.2 });
        vue(298, 186, 84, 44, "vis", 4);
        [205, 475].forEach(function (x) { vue(x - 11, 262, 22, 150, "goupille", 9); });
        cibles = { vis: [340, 210], goupille: [205, 336], goupille2: [475, 336], piece: [420, 270] };
        txt("pièce", [585, 260], "end"); txt("socle", [600, 516], "end");
      } else if (scene === "ecrou") {
        yc = 300;
        M.arbre(g, 30, 300, yc, 92); M.arbre(g, 300, 640, yc, 62);
        for (x = 470; x < 600; x += 10) { R.ligne(g, [x, yc - 62], [x + 5, yc - 52], { epaisseur: 1.2 }); R.ligne(g, [x, yc + 62], [x + 5, yc + 52], { epaisseur: 1.2 }); }
        R.el("rect", { x: 384, y: yc - 62, width: 70, height: 12, fill: "#fff", stroke: C.fonce, "stroke-width": 1.6 }, g);
        [1, -1].forEach(function (s) {
          M.roulement(g, 340, yc - s * 62, 80, 92, { sens: s, surligne: choisi === "roulement" ? "exterieure" : null, surligneCoul: C.acc });
          R.el("rect", { x: 383, y: s > 0 ? yc - 132 : yc + 62, width: 12, height: 70, fill: choisi === "rondelle" ? C.acc : GR, stroke: C.fonce, "stroke-width": 1.5 }, g);
          coupe(398, s > 0 ? yc - 142 : yc + 62, 72, 80, 45, "ecrou");
        });
        var lc = choisi === "rondelle" ? C.acc : GR;
        R.el("rect", { x: 383, y: yc - 62, width: 12, height: 10, fill: lc, stroke: C.fonce, "stroke-width": 1.2 }, g);
        R.el("rect", { x: 420, y: yc - 142, width: 22, height: 14, fill: "#fff", stroke: C.fonce, "stroke-width": 1.6 }, g);
        R.el("polyline", { points: "389,166 389,152 431,152 431,166", fill: "none", stroke: lc, "stroke-width": 7, "stroke-linejoin": "round" }, g);
        txt("épaulement", [292, 186], "end"); txt("arbre fileté", [600, 400]); txt("encoche", [431, 128]);
        cibles = { roulement: [340, 192], rondelle: [389, 400], rondelle2: [389, 200], ecrou: [440, 405], ecrou2: [440, 195] };
      } else {
        yc = 330;
        coupe(250, yc - 205, 200, 140, 45, "moyeu"); coupe(250, yc + 65, 200, 140, 45, "moyeu");
        if (scene === "meplat") {
          R.el("path", { d: "M30 " + (yc - 60) + " L265 " + (yc - 60) + " L285 " + (yc - 46) + " L415 " + (yc - 46) + " L435 " + (yc - 60) + " L650 " + (yc - 60) + " L650 " + (yc + 65) + " L30 " + (yc + 65) + " Z", fill: choisi === "arbre" ? PLATEFORME.teinte(0.3) : "#e8edf5", stroke: choisi === "arbre" ? C.acc : C.fonce, "stroke-width": 2.5 }, g);
          M.traitAxe(g, [10, yc + 2], [670, yc + 2]);
          vue(337, yc - 205, 26, 159, "vis"); for (y = yc - 190; y < yc - 52; y += 9) R.ligne(g, [337, y], [363, y + 4], { epaisseur: 1.1 });
          R.fleche(g, [395, yc - 120], [395, yc - 52], { couleur: C.v, epaisseur: 4 }); R.fleche(g, [395, yc + 140], [395, yc + 70], { couleur: C.v, epaisseur: 4 });
          txt("méplat", [470, yc - 30], "start");
          cibles = { vis: [350, yc - 150], arbre: [150, yc], moyeu: [300, yc + 140] };
        } else {
          R.el("rect", { x: 30, y: yc - 65, width: 620, height: 130, fill: choisi === "arbre" ? PLATEFORME.teinte(0.3) : "#e8edf5", stroke: choisi === "arbre" ? C.acc : C.fonce, "stroke-width": 2.5 }, g);
          M.traitAxe(g, [10, yc], [670, yc]);
          vue(340, yc - 205, 22, 410, "goupille", 10);
          if (choisi === "goupille") [yc - 65, yc + 65].forEach(function (y) { R.ligne(g, [318, y], [384, y], { couleur: "#e5484d", epaisseur: 6 }); });
          cibles = { goupille: [351, yc - 150], arbre: [150, yc], moyeu: [420, yc + 140] };
        }
        txt("roue (moyeu)", [462, yc - 150], "start"); txt("arbre", [80, yc - 82]);
      }
      var e = SC[scene].el.filter(function (x) { return x[0] === choisi; })[0];
      info.innerHTML = "<b>" + e[1] + "</b> : " + e[2];
    }
    boutonsEl();
    dessiner();
  })();
})();
