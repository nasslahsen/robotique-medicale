(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Carte du chapitre 2 ---------- */
  (function () {
    var f = R.figure("fig-carte", {
      largeur: 960, hauteur: 400, titre: "Carte du chapitre : des liaisons aux familles de matériaux",
      essai: "<strong>Essaie</strong> : touche une famille. <strong>Observe</strong> : sa liaison typique et ce qu'elle donne comme propriétés, avec un exemple d'implant."
    });
    var g = R.el("g", null, f.svg), choisi = 0;
    var FAM = [
      { nom: "Métaux et alliages", coul: "#8e97a6", l: "liaison métallique", p: "conducteurs, ductiles, modules élevés", ex: "tige de hanche en titane" },
      { nom: "Céramiques", coul: "#c9a96e", l: "liaisons ioniques et covalentes", p: "dures, fragiles, réfractaires, isolantes", ex: "tête fémorale en zircone" },
      { nom: "Polymères organiques", coul: C.acc, l: "covalentes + intermoléculaires", p: "modules faibles, légers, faciles à mouler", ex: "seringue, insert en PE" },
      { nom: "Composites", coul: "#12a26b", l: "renfort + matrice", p: "propriétés que les constituants n'ont pas seuls", ex: "main prothétique en carbone" }
    ];
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      R.el("rect", { x: 360, y: 20, width: 240, height: 64, rx: 16, fill: "#fff", stroke: C.fonce, "stroke-width": 2.5 }, g);
      T(g, "nature des liaisons", [480, 52], { taille: 20, gras: true });
      FAM.forEach(function (F, i) {
        var x = 16 + i * 236, y = 170, sel = i === choisi;
        R.ligne(g, [480, 84], [x + 111, y], { couleur: sel ? F.coul : "#c6cbd8", epaisseur: sel ? 4 : 2 });
        var b = R.el("g", { style: "cursor:pointer" }, g);
        R.el("rect", { x: x, y: y, width: 222, height: 90, rx: 18, fill: sel ? F.coul : "#fff", "fill-opacity": sel ? 0.18 : 1, stroke: F.coul, "stroke-width": sel ? 5 : 3 }, b);
        T(b, F.nom, [x + 111, y + 34], { taille: 18, gras: true });
        T(b, F.l, [x + 111, y + 62], { taille: 13, couleur: C.doux });
        b.addEventListener("click", function () { choisi = i; dessin(); });
      });
      var F = FAM[choisi];
      T(g, F.p, [480, 315], { taille: 22, gras: true, couleur: C.fonce });
      T(g, "exemple : " + F.ex, [480, 355], { taille: 18, couleur: C.doux });
      zone.innerHTML = "<strong>" + F.nom + "</strong> : " + F.l + " ; " + F.p + ".";
    }
    dessin();
  })();

  /* ---------- Le maillon le plus faible ---------- */
  (function () {
    var f = R.figure("fig-maillon", {
      largeur: 960, hauteur: 460, titre: "Deux chaînes de polymère tirées l'une de l'autre",
      essai: "<strong>Essaie</strong> : augmente la force qui écarte les deux chaînes. <strong>Observe</strong> : les liaisons intermoléculaires (pointillés) lâchent bien avant que les liaisons covalentes C–C ne soient menacées. Énergies du cours, force en unités arbitraires."
    });
    var g = R.el("g", null, f.svg);
    var cF = R.curseur(f.reglages, { nom: "Force", min: 0, max: 100, pas: 1, val: 0, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      var F = cF.v, seuilInter = 25, ec = F > seuilInter ? Math.min(70, (F - seuilInter) * 1.5) : F * 0.15;
      var Y1 = 130 - ec / 2, Y2 = 280 + ec / 2, X0 = 120, PAS = 72, NB = 11;
      for (var k = 1; k < NB - 1; k += 2) {
        var x = X0 + k * PAS;
        if (F > seuilInter) { R.ligne(g, [x, Y1 + 18], [x, Y1 + 34], { couleur: C.x, epaisseur: 3, tirets: "3 5" }); R.ligne(g, [x, Y2 - 34], [x, Y2 - 18], { couleur: C.x, epaisseur: 3, tirets: "3 5" }); }
        else R.ligne(g, [x, Y1 + 18], [x, Y2 - 18], { couleur: C.acc, epaisseur: 3.5, tirets: "5 7" });
      }
      [Y1, Y2].forEach(function (y) {
        R.ligne(g, [X0, y], [X0 + (NB - 1) * PAS, y], { couleur: C.fonce, epaisseur: 6 });
        for (var k = 0; k < NB; k++) { R.el("circle", { cx: X0 + k * PAS, cy: y, r: 16, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g); T(g, "C", [X0 + k * PAS, y + 1], { taille: 15, gras: true, halo: false }); }
      });
      T(g, "covalentes C–C : 349 kJ/mol", [480, Y1 - 34], { taille: 17, gras: true });
      T(g, F > seuilInter ? "liaisons intermoléculaires rompues" : "intermoléculaires : 2,1 à 29,3 kJ/mol", [480, Y2 + 46], { taille: 17, gras: true, couleur: F > seuilInter ? C.x : C.acc });
      if (F > 0) { R.fleche(g, [60, Y1], [60, Y1 - 30 - F * 0.4], { couleur: C.x, epaisseur: 4 }); R.fleche(g, [60, Y2], [60, Y2 + 30 + F * 0.4], { couleur: C.x, epaisseur: 4 }); }
      zone.innerHTML = F > seuilInter ? "Les liaisons faibles ont cédé : les molécules s'écartent, les chaînes restent entières." : "Les chaînes tiennent encore ensemble.";
    }
    dessin();
  })();

  /* ---------- Énergies de liaison ---------- */
  (function () {
    var f = R.figure("fig-energies", {
      largeur: 960, hauteur: 480, titre: "Énergies des liaisons dans les polymères (tableau du cours)",
      essai: "<strong>Essaie</strong> : bascule en échelle logarithmique, puis touche une barre. <strong>Observe</strong> : en échelle normale, les liaisons faibles sont presque invisibles ; en échelle log, on voit qu'elles sont 10 à 100 fois plus faibles. Pour les forces faibles, la barre va de la valeur basse à la valeur haute du cours."
    });
    var g = R.el("g", null, f.svg), b = R.boutons(f.reglages), log = R.bascule(b, "Échelle logarithmique", false, dessin), sel = null;
    var zone = R.h("div", null, "", f.direct);
    var L = [["C–F", 485, 485], ["O–H", 459, 459], ["C–H", 411, 411], ["C–O", 357, 357], ["C–C", 349, 349], ["hydrogène", 12.6, 29.3], ["dipolaires", 6.3, 12.6], ["Van der Waals", 2.1, 8.4]];
    function X(v) { return 190 + (log.checked ? Math.log10(v) / Math.log10(600) : v / 600) * 700; }
    function dessin() {
      R.vider(g);
      [0, 100, 200, 300, 400, 500].concat(log.checked ? [1, 10, 100] : []).forEach(function (v) {
        if (log.checked && [0, 200, 300, 400, 500].indexOf(v) >= 0) return;
        var x = X(Math.max(v, 1e-9)); if (v === 0) x = 190;
        R.ligne(g, [x, 30], [x, 440], { couleur: "#eef0f5" });
        T(g, String(v), [x, 460], { taille: 14, couleur: C.doux });
      });
      L.forEach(function (l, i) {
        var y = 50 + i * 49 + (i >= 5 ? 14 : 0), x0 = l[1] === l[2] ? 190 : X(l[1]), x1 = X(l[2]), faible = i >= 5;
        if (log.checked && l[1] === l[2]) x0 = 190;
        var r = R.el("rect", { x: x0, y: y - 15, width: Math.max(4, x1 - x0), height: 30, rx: 6, fill: faible ? C.acc : "#c6cbd8", stroke: sel === i ? C.fonce : "none", "stroke-width": 3, style: "cursor:pointer" }, g);
        r.addEventListener("click", function () { sel = i; dessin(); });
        T(g, l[0], [176, y], { taille: 16, gras: true, ancre: "end" });
        T(g, (l[1] === l[2] ? String(l[1]) : (l[1] + " à " + l[2])).replace(/\./g, ","), [x1 + 10, y], { taille: 15, ancre: "start", couleur: C.doux });
      });
      T(g, "kJ/mol", [900, 460], { taille: 14, couleur: C.doux, ancre: "end" });
      if (sel !== null) { var l = L[sel]; zone.innerHTML = "<strong>" + l[0] + "</strong> : " + (l[1] === l[2] ? l[1] + " kJ/mol, liaison covalente (intramoléculaire)." : String(l[1]).replace(".", ",") + " à " + String(l[2]).replace(".", ",") + " kJ/mol, force intermoléculaire : environ " + Math.round(349 / l[2]) + " fois plus faible que C–C (au mieux)."); }
      else zone.innerHTML = "Touche une barre pour lire sa valeur.";
    }
    dessin();
  })();
})();
