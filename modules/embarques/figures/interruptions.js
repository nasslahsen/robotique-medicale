(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : les six valeurs de GPIO_PINn_INT_TYPE sur un même signal ---------- */
  (function () {
    var f = R.figure("fig-types", {
      largeur: 960, hauteur: 560,
      titre: "Déclenchement selon GPIO_PINn_INT_TYPE",
      essai: "<strong>Essaie</strong> : touche le signal pour changer son niveau case par case, et choisis un type avec les boutons. <strong>Observe</strong> : les types 1, 2 et 3 marquent des instants (les ronds) ; les types 4 et 5 colorent toute une durée.",
      direct: true
    });
    var SIG = [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1];
    var NOMS = ["0 : désactivée", "1 : front montant", "2 : front descendant", "3 : tout front", "4 : niveau bas", "5 : niveau haut"];
    var x0 = 250, pas = 42, choisi = 2, b = R.boutons(f.reglages), btns = [];
    NOMS.forEach(function (t, k) { btns.push(R.bouton(b, "INT_TYPE = " + k, function () { choisi = k; dessiner(); })); });
    var g = EMB.el("g", null, f.svg);
    function yl(k) { return 190 + k * 60; }
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === choisi); });
      EMB.texte(g, "signal de la broche", [x0 - 16, 70], { taille: 17, ancre: "end" });
      for (var i = 0; i < SIG.length; i++) EMB.el("rect", { x: x0 + i * pas, y: 30, width: pas, height: 80, fill: i % 2 ? "#fafbfd" : "#f3f5f9" }, g);
      EMB.onde(g, x0, 40, pas, 60, SIG, { ep: 4, fronts: true });
      var nb = 0;
      NOMS.forEach(function (t, k) {
        var y = yl(k), ch = k === choisi;
        EMB.el("rect", { x: 20, y: y - 25, width: 920, height: 50, rx: 12, fill: ch ? EMB.teinte(0.1) : "#fff", stroke: ch ? C.acc : C.pale, "stroke-width": ch ? 3 : 1.5 }, g);
        EMB.texte(g, t, [36, y], { taille: 17, ancre: "start", gras: ch ? true : "fin", halo: false });
        SIG.forEach(function (v, i) {
          if ((k === 4 && v === 0) || (k === 5 && v === 1)) { EMB.el("rect", { x: x0 + i * pas, y: y - 11, width: pas, height: 22, fill: EMB.teinte(ch ? 0.5 : 0.22) }, g); }
          if (!i) return;
          var p = SIG[i - 1], monte = !p && v, desc = p && !v;
          if ((k === 1 && monte) || (k === 2 && desc) || (k === 3 && (monte || desc))) { EMB.el("circle", { cx: x0 + i * pas, cy: y, r: ch ? 11 : 8, fill: ch ? C.acc : EMB.teinte(0.5), stroke: "#fff", "stroke-width": 2 }, g); if (ch) nb++; }
        });
      });
      var bas = SIG.filter(function (v) { return !v; }).length;
      f.direct.innerHTML = "<p>" + (choisi === 0 ? "Aucune interruption." : choisi <= 3 ? nb + " interruption" + (nb > 1 ? "s" : "") + ", une à chaque " + (choisi === 1 ? "front montant" : choisi === 2 ? "front descendant" : "changement") + "." : "Interruption demandée pendant " + (choisi === 4 ? bas : SIG.length - bas) + " cases sur " + SIG.length + ", tant que la broche reste " + (choisi === 4 ? "à 0" : "à 1") + ".") + "</p>";
    }
    f.svg.addEventListener("pointerdown", function (ev) {
      var p = EMB.point(f.svg, ev), i = Math.floor((p[0] - x0) / pas);
      if (p[1] < 20 || p[1] > 120 || i < 0 || i >= SIG.length) return;
      SIG[i] = 1 - SIG[i]; dessiner();
    });
    dessiner();
  })();

  /* ---------- Figure 2 : la matrice d'interruptions (diapositive 19) ---------- */
  (function () {
    var f = R.figure("fig-matrice", {
      largeur: 960, hauteur: 520,
      titre: "Interrupt Matrix",
      essai: "<strong>Essaie</strong> : envoie la source vers un CPU, puis vers les deux. <strong>Observe</strong> : la même source d'interruption de périphérique peut être attribuée à PRO_CPU, à APP_CPU, ou aux deux, indépendamment ; chaque CPU a ses propres registres.",
      direct: false
    });
    var k = 0, b = R.boutons(f.reglages), btns = [];
    ["Vers PRO_CPU", "Vers APP_CPU", "Vers les deux"].forEach(function (t, i) { btns.push(R.bouton(b, t, function () { k = i; dessiner(); })); });
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === k); });
      var pro = k === 0 || k === 2, app = k === 1 || k === 2;
      EMB.bloc(g, 380, 210, 210, 190, "Interrupt Matrix", { taille: 20, actif: true });
      EMB.fleche(g, [40, 305], [380, 305], { ep: 3.5, coul: C.acc });
      EMB.texte(g, "Peripheral Interrupt Source", [200, 285], { taille: 16 });
      [["PRO_CPU Peripheral Interrupt Configuration Register", 55, 565, pro], ["PRO_CPU NMI Interrupt Mask", 95, 540, pro], ["APP_CPU Peripheral Interrupt Configuration Register", 135, 430, app], ["APP_CPU NMI Interrupt Mask", 175, 405, app]].forEach(function (r) {
        EMB.el("polyline", { points: "40," + r[1] + " " + r[2] + "," + r[1] + " " + r[2] + ",202", fill: "none", stroke: r[3] ? C.acc : C.encre, "stroke-width": r[3] ? 3 : 2 }, g);
        EMB.el("polygon", { points: (r[2] - 7) + ",196 " + (r[2] + 7) + ",196 " + r[2] + ",210", fill: r[3] ? C.acc : C.encre }, g);
        EMB.texte(g, r[0], [44, r[1] - 12], { taille: 14, ancre: "start", gras: false });
      });
      [["PRO_CPU Peripheral Interrupt", 260, pro], ["APP_CPU Peripheral Interrupt", 340, app]].forEach(function (s) {
        EMB.fleche(g, [590, s[1]], [930, s[1]], { ep: s[2] ? 4.5 : 2.5, coul: s[2] ? C.acc : C.gris });
        EMB.texte(g, s[0], [760, s[1] - 18], { taille: 16, coul: s[2] ? C.acc : C.doux });
      });
      [["PRO_CPU Peripheral Interrupt Source Status Register", 445, 520, pro], ["APP_CPU Peripheral Interrupt Source Status Register", 495, 430, app]].forEach(function (r) {
        EMB.el("polyline", { points: r[2] + ",400 " + r[2] + "," + r[1] + " 925," + r[1], fill: "none", stroke: r[3] ? C.acc : C.encre, "stroke-width": r[3] ? 3 : 2 }, g);
        EMB.el("polygon", { points: "925," + (r[1] - 7) + " 939," + r[1] + " 925," + (r[1] + 7), fill: r[3] ? C.acc : C.encre }, g);
        EMB.texte(g, r[0], [r[2] + 12, r[1] - 13], { taille: 14, ancre: "start", gras: false });
      });
    }
    dessiner();
  })();
})();
