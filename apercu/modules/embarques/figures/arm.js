(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : un cœur ARM et ses composants, selon l'appareil ---------- */
  (function () {
    var f = R.figure("fig-composants", {
      largeur: 960, hauteur: 440,
      titre: "Composants ajoutés au cœur ARM",
      essai: "<strong>Essaie</strong> : choisis un appareil (exemples ajoutés). <strong>Observe</strong> : chaque besoin allume un composant ; un appareil sous Linux exige la MMU, un filtre ECG profite du DSP, des calculs en flottants de la FPU."
    });
    var g = EMB.el("g", null, f.svg), k = 0, b = R.boutons(f.reglages), btns = [], zone = R.h("p", null, "", f.direct);
    var COMP = { MMU: [40, 40, 300, 130, "MMU\nMemory Management Unit"], MPU: [620, 40, 300, 130, "MPU\nMemory Protection Unit"], DSP: [40, 270, 300, 130, "DSP\ntraitement du signal"], FPU: [620, 270, 300, 130, "FPU\nnombres flottants"] };
    var APP = [
      ["Tablette d'échographe sous Linux", ["MMU", "FPU"], "Linux exige l'adressage virtuel de la MMU ; l'affichage d'images profite de la FPU."],
      ["Holter ECG", ["DSP", "MPU"], "Le DSP filtre l'ECG et extrait les complexes ; la MPU protège simplement la mémoire du programme."],
      ["Glucomètre sur pile", ["MPU"], "Peu de calcul, pas de système d'exploitation lourd : un cœur simple suffit, avec au plus une protection mémoire simplifiée."],
      ["Calcul de dose en virgule flottante", ["FPU"], "Les calculs sur les nombres flottants vont plus vite avec une FPU."]
    ];
    APP.forEach(function (a, i) { btns.push(R.bouton(b, a[0], function () { k = i; dessiner(); })); });
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === k); });
      var on = APP[k][1];
      EMB.el("rect", { x: 380, y: 160, width: 200, height: 120, rx: 18, fill: C.acc, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "Cœur ARM\n(RISC)", [480, 220], { taille: 24, coul: "#fff", halo: false });
      Object.keys(COMP).forEach(function (c) {
        var bx = COMP[c], a = on.indexOf(c) >= 0, gch = bx[0] < 480, haut = bx[1] < 200;
        EMB.el("line", { x1: gch ? bx[0] + bx[2] : bx[0], y1: bx[1] + bx[3] / 2, x2: gch ? 380 : 580, y2: haut ? 190 : 250, stroke: a ? C.acc : C.gris, "stroke-width": a ? 4 : 2.5, "stroke-dasharray": a ? null : "7 7" }, g);
        EMB.bloc(g, bx[0], bx[1], bx[2], bx[3], bx[4], { taille: 20, actif: a, op: a ? 1 : 0.45 });
      });
      zone.textContent = APP[k][2];
    }
    dessiner();
  })();

  /* ---------- Figure 2 : l'évolution des ARM (diapositive 18) ---------- */
  (function () {
    var f = R.figure("fig-evolution", {
      largeur: 960, hauteur: 560,
      titre: "Évolution des ARM",
      essai: "<strong>Essaie</strong> : choisis une famille, ou touche un processeur. <strong>Observe</strong> : les Cortex-M sont en bas de l'escalier (embarqué), les Cortex-R au milieu (temps réel), les Cortex-A en haut (application) ; les ARM classiques restent à gauche."
    });
    var g = EMB.el("g", null, f.svg), fam = null, choisi = null, b = R.boutons(f.reglages), bf = {}, zone = R.h("p", null, "Touche un processeur.", f.direct);
    var FC = { classic: "#2a8fa8", embedded: "#8db33a", application: "#f0a12a" };
    var EVO = [
      ["ARM7", "classic", 80, 505, "Famille ARM7 : ARM720T (MMU)."], ["ARM9", "classic", 120, 435, "Famille ARM9 : 5 niveaux de pipeline sur les entiers, MMU ; ARM920T (double cache de 16 Ko) et ARM922T (double cache de 8 Ko)."],
      ["ARM11", "classic", 170, 365, "Famille ARM11 : ARM1136JF-S, avec FPU."],
      ["Cortex-M0", "embedded", 250, 505, "Cortex-M : embedded processor."], ["Cortex-M1", "embedded", 300, 470, "Cortex-M : embedded processor."],
      ["Cortex-M3", "embedded", 350, 435, "Cortex-M3 : architecture ARMv7-M, embedded processor."], ["Cortex-M4", "embedded", 400, 400, "Cortex-M : embedded processor."],
      ["Cortex-R4", "embedded", 450, 365, "Cortex-R4 : architecture ARMv7-R, real time processeur."], ["Cortex-R5", "embedded", 500, 330, "Cortex-R : real time processeur."], ["Cortex-R7", "embedded", 550, 295, "Cortex-R : real time processeur."],
      ["Cortex-A5", "application", 600, 260, "Cortex-A5 MPCore : version multiprocesseur (1 à 4 CPU), application processeur."], ["Cortex-A8", "application", 650, 225, "Cortex-A : application processeur."],
      ["Cortex-A9", "application", 700, 190, "Cortex-A : application processeur."], ["Cortex-A15", "application", 750, 155, "Cortex-A : application processeur."]
    ];
    [["classic", "Classic"], ["embedded", "Embedded"], ["application", "Application"], [null, "Tout"]].forEach(function (x) { bf[x[1]] = R.bouton(b, x[1], function () { fam = x[0]; dessiner(); }); });
    function dessiner() {
      EMB.vider(g);
      EMB.fleche(g, [60, 550], [950, 550], { ep: 3, coul: C.gris }); EMB.fleche(g, [60, 550], [60, 20], { ep: 3, coul: C.gris });
      EMB.texte(g, "Capability", [880, 530], { taille: 16, coul: C.doux });
      EMB.texte(g, "Performance,\nFunctionality", [80, 70], { taille: 15, coul: C.doux, ancre: "start" });
      [["Classic ARM Processors", "classic", 80, 300], ["Embedded Cortex", "embedded", 560, 470], ["Application Cortex", "application", 760, 120]].forEach(function (h) {
        EMB.texte(g, h[0], [h[2], h[3]], { taille: 17, coul: FC[h[1]], ancre: "start" });
      });
      EVO.forEach(function (e) {
        var vis = !fam || fam === e[1], on = choisi === e[0];
        EMB.el("rect", { x: e[2], y: e[3], width: 130, height: 30, rx: 6, fill: FC[e[1]], opacity: vis ? 1 : 0.2, stroke: on ? C.encre : "none", "stroke-width": 3 }, g);
        EMB.texte(g, e[0], [e[2] + 65, e[3] + 15], { taille: 16, coul: "#fff", halo: false, op: vis ? 1 : 0.6 });
      });
    }
    EMB.toucher(f.svg, function () { var z = {}; EVO.forEach(function (e) { z[e[0]] = [e[2], e[3], 130, 30]; }); return z; }, function (k) {
      choisi = k; var e = EVO.filter(function (x) { return x[0] === k; })[0]; zone.textContent = e[4]; dessiner();
    });
    dessiner();
  })();
})();
