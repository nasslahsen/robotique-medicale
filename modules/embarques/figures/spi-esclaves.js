(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : un maître, quatre esclaves ---------- */
  (function () {
    var f = R.figure("fig-multi", {
      largeur: 960, hauteur: 560,
      titre: "Architecture multi esclaves",
      essai: "<strong>Essaie</strong> : sélectionne un esclave, puis essaie « Deux à la fois ». <strong>Observe</strong> : SCK, MOSI et MISO restent partagés ; seule la ligne \\(\\overline{SS}\\) de l'esclave choisi passe à 0. À deux, les sorties se mélangent sur MISO."
    });
    var g = EMB.el("g", null, f.svg), ss = [1, 1, 1, 1], b = R.boutons(f.reglages), btns = [];
    var NOMS = ["Mémoire", "Afficheur", "Capteur de\ntempérature", "Moteur\npas-à-pas"], XS = [30, 260, 490, 720], W = 210;
    NOMS.forEach(function (t, k) { btns.push(R.bouton(b, "Esclave " + (k + 1), function () { ss = [1, 1, 1, 1]; ss[k] = 0; dessiner(); })); });
    var b2 = R.bouton(b, "Deux à la fois", function () { ss = [0, 1, 0, 1]; dessiner(); });
    var b0 = R.bouton(b, "Aucun", function () { ss = [1, 1, 1, 1]; dessiner(); });
    var zone = R.h("p", null, "", f.direct);
    function barre(x, y, coul) { EMB.el("line", { x1: x - 11, y1: y - 12, x2: x + 11, y2: y - 12, stroke: coul, "stroke-width": 1.8 }, g); }
    function dessiner() {
      EMB.vider(g);
      var nb = ss.filter(function (v) { return v === 0; }).length, conflit = nb > 1;
      btns.forEach(function (x, k) { x.classList.toggle("actif", nb === 1 && ss[k] === 0); });
      b2.classList.toggle("actif", conflit); b0.classList.toggle("actif", nb === 0);
      var L = [["SCK", 250, C.encre], ["MOSI", 280, C.encre], ["MISO", 310, conflit ? C.ko : C.encre]];
      L.forEach(function (l, i) {
        EMB.el("line", { x1: 60 + i * 34, y1: l[1], x2: 900, y2: l[1], stroke: l[2], "stroke-width": conflit && i === 2 ? 5 : 2.5 }, g);
        EMB.el("line", { x1: 60 + i * 34, y1: l[1], x2: 60 + i * 34, y2: 380, stroke: l[2], "stroke-width": 2.5 }, g);
        XS.forEach(function (x) { var c = x + 40 + i * 50; EMB.el("line", { x1: c, y1: 190, x2: c, y2: l[1], stroke: l[2], "stroke-width": 2 }, g); EMB.el("circle", { cx: c, cy: l[1], r: 4.5, fill: l[2] }, g); });
      });
      XS.forEach(function (x, k) {
        var sel = ss[k] === 0;
        EMB.bloc(g, x, 60, W, 130, "", { actif: sel, stroke: sel && conflit ? C.ko : undefined });
        EMB.texte(g, NOMS[k], [x + 90, 112], { taille: 18, halo: false });
        EMB.texte(g, "Slave Device " + (k + 1), [x + 90, 76], { taille: 13, coul: C.doux, gras: false, halo: false });
        ["SCK", "MOSI", "MISO"].forEach(function (t, i) { EMB.texte(g, t, [x + 40 + i * 50, 172], { taille: 13, halo: false }); });
        var cs = sel ? (conflit ? C.ko : C.acc) : C.gris;
        EMB.texte(g, "SS = " + ss[k], [x + W - 6, 34], { taille: 17, mono: true, ancre: "end", coul: sel ? cs : C.encre });
        barre(x + W - 49, 34, sel ? cs : C.encre);
        var y = 400 + k * 34;
        EMB.el("polyline", { points: [[330, y], [x + W - 20, y], [x + W - 20, 190]].join(" "), fill: "none", stroke: cs, "stroke-width": sel ? 4 : 2.5 }, g);
      });
      EMB.bloc(g, 40, 380, 290, 170, "", { fill: C.fond });
      EMB.texte(g, "Master Device", [160, 470], { taille: 20, halo: false });
      EMB.texte(g, "Ports", [300, 470], { taille: 14, coul: C.doux, halo: false });
      EMB.texte(g, "SCK MOSI MISO", [100, 398], { taille: 12, halo: false, ancre: "start" });
      EMB.texte(g, "SS", [90, 530], { taille: 15, halo: false }); barre(90, 530, C.encre);
      EMB.texte(g, "5 V", [12, 530], { taille: 15, ancre: "start" });
      if (conflit) EMB.texte(g, "deux esclaves pilotent MISO : données mélangées", [620, 336], { taille: 17, coul: C.ko });
      zone.innerHTML = nb === 0 ? "Aucun esclave sélectionné : personne ne répond." : conflit ? "Deux lignes \\(\\overline{SS}\\) à 0 : conflit sur MISO." : "Esclave " + (ss.indexOf(0) + 1) + " sélectionné. Fils utilisés : 3 partagés + 4 lignes de sélection = 7.";
      if (window.renderMathInElement) renderMathInElement(zone, { delimiters: [{ left: "\\(", right: "\\)", display: false }] });
    }
    dessiner();
  })();
})();
