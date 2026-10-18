/* Révision du chapitre 2 : contrôleur, Von Neumann et Harvard, CISC et RISC, ARM, bus AMBA, CompactRIO, dans des situations nouvelles. */
NIVEAU({
  id: "revision-architectures",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { scene: "pompe", fait: false, N: 6, t: 0 };
    n.dessin = function () {
      EMB.vider(g);
      var s = n.scene, f = n.fait;
      if (s === "pompe") {
        // pousse-seringue : capteur d'occlusion (analogique) et bouton d'arrêt (0 ou 1)
        EMB.el("rect", { x: 30, y: 120, width: 220, height: 120, rx: 14, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("rect", { x: 55, y: 150, width: 150, height: 34, rx: 6, fill: C.clair, stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "Pousse-seringue", [140, 270], { taille: 17 });
        EMB.bloc(g, 40, 330, 200, 70, "Capteur d'occlusion\n(tension analogique)", { taille: 15, fill: C.fond });
        EMB.bloc(g, 40, 440, 200, 70, "Bouton d'arrêt\n(0 ou 1)", { taille: 15, fill: C.fond });
        EMB.el("rect", { x: 330, y: 300, width: 320, height: 250, rx: 12, fill: "#f4f5f8", stroke: C.encre, "stroke-width": 2.5, "stroke-dasharray": "4 6" }, g);
        EMB.texte(g, "Contrôleur", [490, 530], { taille: 16, coul: C.doux });
        EMB.bloc(g, 360, 330, 160, 70, f ? "Analog\nFront End" : "?", { taille: f ? 16 : 26, actif: f });
        EMB.bloc(g, 360, 440, 160, 70, f ? "Digital\ninp Ports" : "?", { taille: f ? 16 : 26, actif: f });
        EMB.bloc(g, 545, 380, 85, 70, "CPU", { taille: 18 });
        EMB.fleche(g, [240, 365], [360, 365], { ep: 3 }); EMB.fleche(g, [240, 475], [360, 475], { ep: 3 });
        EMB.fleche(g, [520, 365], [545, 400], { ep: 2.5 }); EMB.fleche(g, [520, 475], [545, 430], { ep: 2.5 });
      } else if (s === "cycles") {
        EMB.texte(g, "Programme de " + n.N + " instructions, une donnée chacune", [340, 110], { taille: 18 });
        var w = 36, x0 = 100;
        [["Von Neumann", 200, 2 * n.N], ["Harvard", 340, n.N + 1]].forEach(function (r) {
          EMB.texte(g, r[0], [x0 - 10, r[1] - 26], { taille: 17, ancre: "start" });
          for (var i = 0; i < 12; i++) EMB.el("rect", { x: x0 + i * w, y: r[1], width: w - 4, height: 44, rx: 6, fill: f && i < r[2] ? (r[0] === "Harvard" ? C.acc : C.bleu) : C.fond, stroke: C.pale }, g);
          if (f) EMB.texte(g, r[2] + " cycles", [x0 + 12 * w + 20, r[1] + 22], { taille: 18, ancre: "start", coul: C.acc });
        });
      } else if (s === "code") {
        EMB.texte(g, "Même tâche, deux compilations", [340, 110], { taille: 18 });
        [["Puce X", 120, 160], ["Puce Y", 360, 40]].forEach(function (p) {
          EMB.texte(g, p[0], [p[1] + 80, 575], { taille: 18 });
          var h = p[2] * 2;
          EMB.el("rect", { x: p[1] + 30, y: 520 - h, width: 100, height: h, rx: 8, fill: f ? (p[2] > 100 ? C.acc : C.gris) : C.gris }, g);
          EMB.texte(g, p[2] + " instructions", [p[1] + 80, 545], { taille: 16 });
          if (f) EMB.texte(g, p[2] > 100 ? "RISC" : "CISC", [p[1] + 80, 520 - h - 22], { taille: 20, coul: p[2] > 100 ? C.acc : C.doux });
        });
      } else if (s === "arm") {
        EMB.el("rect", { x: 140, y: 120, width: 400, height: 280, rx: 18, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("rect", { x: 165, y: 145, width: 350, height: 200, rx: 6, fill: "#eef3f7" }, g);
        EMB.el("polyline", { points: "180,300 220,260 240,280 270,180 300,320 330,250 360,270 400,210 440,260 480,230 500,240", fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
        EMB.texte(g, "Linux + interface graphique", [340, 375], { taille: 16, gras: false });
        EMB.bloc(g, 200, 450, 280, 70, f ? "MMU : adressage virtuel" : "? ", { taille: 18, actif: f });
      } else if (s === "bus") {
        EMB.bloc(g, 60, 150, 260, 300, "", { fill: EMB.teinte(0.08) });
        EMB.bloc(g, 360, 150, 260, 300, "", { fill: "#fdf1dc" });
        EMB.texte(g, f ? "System Bus\n(AHB ou ASB)" : "?", [190, 200], { taille: 18 });
        EMB.texte(g, f ? "Peripheral Bus\n(APB)" : "?", [490, 200], { taille: 18 });
        EMB.bloc(g, 100, 290, 180, 60, "On-chip RAM", { taille: 17, op: f ? 1 : 0.35 });
        EMB.bloc(g, 400, 290, 180, 60, "Timer", { taille: 17, op: f ? 1 : 0.35 });
        EMB.el("rect", { x: 325, y: 180, width: 30, height: 240, fill: "#a45d86" }, g);
        EMB.texte(g, "Bridge", [340, 470], { taille: 15 });
      } else {
        EMB.texte(g, "CompactRIO", [340, 120], { taille: 24 });
        EMB.bloc(g, 40, 220, 170, 150, "Processor", { taille: 19, actif: f });
        EMB.bloc(g, 270, 220, 170, 150, "FPGA", { taille: 19, actif: f });
        EMB.el("line", { x1: 210, y1: 295, x2: 270, y2: 295, stroke: C.encre, "stroke-width": 3 }, g);
        ["E/S"].forEach(function () { EMB.bloc(g, 500, 240, 150, 110, "Analog I/O\nDigital I/O\n...", { taille: 16 }); });
        EMB.el("line", { x1: 440, y1: 295, x2: 500, y2: 295, stroke: C.encre, "stroke-width": 3 }, g);
        if (f) { EMB.texte(g, "VI 1", [125, 400], { taille: 17, coul: C.acc }); EMB.texte(g, "VI 2", [355, 400], { taille: 17, coul: C.acc }); }
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Deux entrées", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le capteur d'occlusion d'un pousse-seringue donne une tension ; le bouton d'arrêt donne 0 ou 1. Par quel bloc entre chacun ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:center;font-size:17px"><span>capteur d\'occlusion</span><span class="trou" data-attendu="afe"></span><span>bouton d\'arrêt</span><span class="trou" data-attendu="dip"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "dop", html: "Digital oup Ports" }, { id: "dip", html: "Digital inp Ports" }, { id: "afe", html: "Analog Front End" }, { id: "da", html: "D/A" }],
        aide: "Deux entrées : une analogique, une numérique. Les « oup » et le D/A sont des sorties.",
        ok: function () { n.fait = true; n.dessin(); j.bravo("Tension par l'Analog Front End, 0 ou 1 par un port numérique d'entrée."); j.suite(); }
      });
    } },
    { nom: "Six instructions", jouer: function (j, n) {
      n.scene = "cycles"; n.fait = false; n.dessin();
      j.titre("Six instructions, une donnée chacune. Combien de cycles de bus en Von Neumann et en Harvard ?");
      j.nombre({ avant: "\\text{VN},\\ \\text{Harvard} :", cases: [{ attendu: 12, tol: 0 }, { attendu: 7, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Un seul bus : instruction puis donnée, pour chacune." : "Deux bus en parallèle : un cycle de plus que le nombre d'instructions."; },
        ok: function () { n.fait = true; n.dessin(); j.bravo("12 contre 7."); j.suite(); } });
    } },
    { nom: "Quel jeu d'instructions ?", jouer: function (j, n) {
      n.scene = "code"; n.fait = false; n.dessin();
      j.titre("La même tâche compile en 160 instructions sur la puce X et en 40 sur la puce Y. Laquelle est probablement RISC ?");
      j.choix([
        { html: "X, le code le plus long", juste: true },
        { html: "Y, le code le plus court", aide: "Le tableau du cours : CISC, <i>small code sizes</i> ; RISC, <i>large code sizes</i>." }
      ], { colonnes: 1, ok: function () { n.fait = true; n.dessin(); j.bravo("Instructions simples, donc plus nombreuses : X est RISC."); j.suite(); } });
    } },
    { nom: "Un écran sous Linux", jouer: function (j, n) {
      n.scene = "arm"; n.fait = false; n.dessin();
      j.titre("Le moniteur affiche les courbes avec Linux sur un processeur ARM. Quel composant est alors indispensable ?");
      j.choix([
        { html: "MMU", juste: true },
        { html: "MPU", aide: "La MPU protège la mémoire, mais ne fait pas l'adressage virtuel qu'exige Linux." },
        { html: "FPU", aide: "La FPU calcule sur les flottants ; elle aide, mais Linux ne tourne pas sans adressage virtuel." },
        { html: "DSP", aide: "Le DSP sert au traitement du signal, pas au système d'exploitation." }
      ], { colonnes: 2, ok: function () { n.fait = true; n.dessin(); j.bravo("La MMU, nécessaire pour la plupart des Linux."); j.suite(); } });
    } },
    { nom: "Deux bus", jouer: function (j, n) {
      n.scene = "bus"; n.fait = false; n.dessin();
      j.titre("Dans un système ARM, sur quel bus se trouve chaque bloc ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:center;font-size:17px"><span>On-chip RAM</span><span class="trou" data-attendu="s"></span><span>Timer</span><span class="trou" data-attendu="p"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "APB" }, { id: "s", html: "AHB ou ASB" }],
        aide: "Le bus système relie l'ARM et la mémoire ; le bus périphérique, derrière le Bridge, porte les périphériques.",
        ok: function () { n.fait = true; n.dessin(); j.bravo("RAM sur le System Bus, Timer sur le Peripheral Bus."); j.suite(); }
      });
    } },
    { nom: "La phrase fausse", jouer: function (j, n) {
      n.scene = "crio"; n.fait = false; n.dessin();
      j.titre("Un rapport dit : « Dans le CompactRIO, le processeur est relié directement aux E/S et exécute un seul VI LabVIEW. » Quelle version est correcte ?");
      j.choix([
        { html: "Le processeur est relié aux E/S ; le FPGA exécute le seul VI", aide: "Suis les traits : qui touche les E/S ?" },
        { html: "Le FPGA est relié aux E/S ; processeur et FPGA exécutent des VI séparés", juste: true },
        { html: "La phrase est juste", aide: "Deux choses sont fausses : le lien vers les E/S et le nombre de VI." }
      ], { colonnes: 1, ok: function () { n.fait = true; n.dessin(); j.bravo("<i>The main processor and FPGA run separate LabVIEW VIs.</i>"); j.suite(); } });
    } }
  ]
});
