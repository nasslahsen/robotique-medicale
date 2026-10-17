/* Niveau : architecture ARM (Section I, diapositives 16 à 18). Le sigle, les composants MMU, MPU, DSP, FPU, l'évolution des familles. */
NIVEAU({
  id: "arm",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "composants", vus: {}, famille: null };
    var COMP = {
      MMU: [40, 90, 250, 120, "MMU\nMemory Management Unit"],
      MPU: [390, 90, 250, 120, "MPU\nMemory Protection Unit"],
      DSP: [40, 390, 250, 120, "DSP\ntraitement du signal"],
      FPU: [390, 390, 250, 120, "FPU\nnombres flottants"]
    };
    // graphe de la diapositive 18 : [nom, famille, x, y]
    var EVO = [
      ["ARM7", "classic", 62, 528], ["ARM9", "classic", 108, 486], ["ARM11", "classic", 158, 408],
      ["Cortex-M0", "embedded", 196, 528], ["Cortex-M1", "embedded", 226, 488], ["Cortex-M3", "embedded", 256, 448], ["Cortex-M4", "embedded", 286, 408],
      ["Cortex-R4", "embedded", 318, 368], ["Cortex-R5", "embedded", 350, 328], ["Cortex-R7", "embedded", 382, 288],
      ["Cortex-A5", "application", 414, 248], ["Cortex-A8", "application", 446, 208], ["Cortex-A9", "application", 478, 168], ["Cortex-A15", "application", 510, 128]
    ];
    var FC = { classic: "#2a8fa8", embedded: "#8db33a", application: "#f0a12a" };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "composants") {
        EMB.el("rect", { x: 210, y: 245, width: 260, height: 110, rx: 18, fill: C.acc, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.texte(g, "Cœur ARM\n(RISC)", [340, 300], { taille: 22, coul: "#fff", halo: false });
        Object.keys(COMP).forEach(function (k) {
          var b = COMP[k], on = n.vus[k];
          EMB.el("line", { x1: b[0] + b[2] / 2, y1: b[1] < 300 ? b[1] + b[3] : b[1], x2: b[0] < 300 ? 270 : 410, y2: b[1] < 300 ? 245 : 355, stroke: on ? C.acc : C.gris, "stroke-width": 3, "stroke-dasharray": on ? null : "6 6" }, g);
          EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: 18, actif: on });
          if (on) EMB.texte(g, on, [b[0] < 300 ? b[0] + 4 : b[0] + b[2] - 4, b[1] < 300 ? b[1] + b[3] + 22 : b[1] - 20], { taille: 15, coul: C.acc, gras: false, ancre: b[0] < 300 ? "start" : "end" });
        });
      } else {
        EMB.fleche(g, [40, 572], [660, 572], { ep: 3, coul: C.gris });
        EMB.fleche(g, [40, 572], [40, 100], { ep: 3, coul: C.gris });
        EMB.texte(g, "Capability", [600, 552], { taille: 14, coul: C.doux });
        EMB.texte(g, "Performance,\nFunctionality", [100, 210], { taille: 14, coul: C.doux, ancre: "start" });
        [["Classic", "classic", 150], ["Embedded", "embedded", 340], ["Application", "application", 530]].forEach(function (h) {
          var on = n.famille === h[1];
          EMB.el("rect", { x: h[2] - 78, y: 66, width: 156, height: 38, rx: 6, fill: FC[h[1]], stroke: on ? C.encre : "none", "stroke-width": 3 }, g);
          EMB.texte(g, h[0], [h[2], 85], { taille: 17, coul: "#fff", halo: false });
        });
        EVO.forEach(function (e) {
          var on = !n.famille || n.famille === e[1];
          EMB.el("rect", { x: e[2], y: e[3], width: 112, height: 32, rx: 5, fill: FC[e[1]], opacity: on ? 1 : 0.25 }, g);
          EMB.texte(g, e[0], [e[2] + 56, e[3] + 16], { taille: 14, coul: "#fff", halo: false, op: on ? 1 : 0.6 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le sigle", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Que veut dire ARM ?");
      j.choix([
        { html: "Acorn (Advanced) RISC Machine", juste: true },
        { html: "Advanced Register Memory", aide: "Le M final désigne la machine entière, et le R le type de jeu d'instructions vu à la page CISC et RISC." },
        { html: "Atmel RISC Microcontroller", aide: "Atmel, c'est la société de l'AVR. ARM vient d'une autre société, britannique : Acorn." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Acorn RISC Machine, devenu Advanced RISC Machine.");
        j.suite();
      } });
    } },
    { nom: "Un fichier", jouer: function (j, n) {
      j.titre("Un fabricant de pompes à perfusion veut un cœur ARM dans sa propre puce. Qu'achète-t-il ?");
      j.choix([
        { html: "Le processeur sous forme de fichier, qu'il intègre dans son microcontrôleur", juste: true },
        { html: "Une carte ARM toute montée", aide: "Relis la diapositive : le processeur est « vendu sous forme de fichier »." },
        { html: "Un logiciel qui imite un processeur ARM", aide: "Le fichier décrit un vrai processeur matériel, à graver dans une puce." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Un fichier, à intégrer dans un microcontrôleur ou un système embarqué.");
        j.expliquer("<p><b>ARM</b> est un processeur RISC de la société Acorn, vendu sous forme de fichier pour l'intégrer dans les microcontrôleurs ou des systèmes embarqués. Beaucoup de fabricants mettent donc le même cœur dans des puces différentes.</p>");
        j.suite();
      } });
    } },
    { nom: "Quatre composants", jouer: function (j, n) {
      j.titre("Associe chaque besoin au composant qui y répond.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:center;font-size:17px"><span>faire tourner un Linux (adressage virtuel)</span><span class="trou" data-attendu="mmu"></span><span>protéger simplement la mémoire</span><span class="trou" data-attendu="mpu"></span><span>filtrer un signal ECG</span><span class="trou" data-attendu="dsp"></span><span>calculer en virgule flottante</span><span class="trou" data-attendu="fpu"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "fpu", html: "FPU" }, { id: "mmu", html: "MMU" }, { id: "dsp", html: "DSP" }, { id: "mpu", html: "MPU" }],
        aide: "MMU : Management (adressage virtuel). MPU : Protection. DSP : signal numérique. FPU : Floating Point.",
        ok: function () {
          n.vus = { MMU: "Linux, Windows CE", MPU: "protection simplifiée", DSP: "filtrage, extraction", FPU: "flottants" }; n.dessin();
          j.bravo("Les quatre composants essentiels du cours.");
          j.expliquer("<p><b>MMU</b> (<i>Memory Management Unit</i>) : gestionnaire de mémoire qui permet l'adressage virtuel ; nécessaire pour Windows CE ou la plupart des Linux. <b>MPU</b> (<i>Memory Protection Unit</i>) : protection de la mémoire, partie du MMU, donc protection simplifiée. <b>DSP</b> : composant optimisé pour les calculs, surtout le traitement du signal numérique (filtrage, extraction de signaux). <b>FPU</b> : unité de calcul sur les nombres flottants.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Les familles Cortex", jouer: function (j, n) {
      n.mode = "evolution"; n.dessin();
      j.titre("Place un processeur de chaque sorte d'après la diapositive 17.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:center;font-size:17px"><span><i>application processeur</i></span><span class="trou" data-attendu="a"></span><span><i>real time processeur</i></span><span class="trou" data-attendu="r"></span><span><i>embedded processor</i></span><span class="trou" data-attendu="m"></span><span>ARM classique</span><span class="trou" data-attendu="c"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", html: "Cortex-M3" }, { id: "c", html: "ARM9" }, { id: "a", html: "Cortex-A5" }, { id: "r", html: "Cortex-R4" }],
        aide: "La lettre dit tout : A pour application, R pour real time, M pour embedded (microcontrôleur). Les ARM7, ARM9, ARM11 sont les « Classic ».",
        ok: function () {
          j.bravo("A, R, M, et les classiques.");
          j.expliquer("<p>Cortex-A : processeur d'application (Cortex-A5 MPCore : 1 à 4 CPU). Cortex-R : temps réel, architecture ARMv7-R (Cortex-R4). Cortex-M : processeur embarqué, architecture ARMv7-M (Cortex-M3). Sur le graphe, plus on va vers les Cortex-A, plus la performance et la capacité montent.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pour un appareil", jouer: function (j, n) {
      j.titre("Un glucomètre connecté sur pile : peu de calcul, pas de système d'exploitation lourd, consommation minimale. Quelle famille choisir ?");
      j.choix([
        { html: "Cortex-A", aide: "Cortex-A, ce sont les processeurs d'application : grosse puissance, MMU pour Linux. Trop pour un glucomètre sur pile." },
        { html: "Cortex-R", aide: "Cortex-R vise le temps réel dur. Ici, rien ne l'exige." },
        { html: "Cortex-M", juste: true }
      ], { colonnes: 3, ok: function () {
        n.famille = "embedded"; n.dessin();
        j.bravo("Cortex-M : les processeurs embarqués, en bas du graphe.");
        j.suite();
      } });
    } },
    { nom: "ARM2", jouer: function (j, n) {
      n.famille = null; n.dessin();
      j.titre("ARM2 (1987) adresse sur 24 bits des mots de 32 bits. Combien de Mio cela fait-il ?");
      j.nombre({ avant: "2^{24} \\text{ mots} \\times 4 \\text{ octets} =", apres: "\\text{Mio}", cases: [{ attendu: 64, tol: 0 }], ligne: true,
        aide: function () { return "\\(2^{24}\\) mots, c'est 16 mébimots (\\(2^{20}\\) = 1 Mi). Un mot de 32 bits fait 4 octets."; },
        ok: function () {
          j.bravo("16 mébimots de 32 bits, soit 64 Mio adressables.");
          j.expliquer("<p>La diapositive 17 résume l'évolution : ARM1 (1985), premier prototype ; ARM2 (1987), pipeline à 3 niveaux, 8 puis 12 MHz ; ARM3, interface FPU et 4K de cache ; ARM4T et ARM5TE (2000), fonctions DSP ; ARM6 (1990) ; ARM7 (ARM720T, MMU) ; ARM9, pipeline à 5 niveaux et MMU ; ARM9E (DSP, MPU, port AHB) ; ARM10E (DSP, MMU) ; ARM11 (FPU) ; puis les Cortex-A, R et M.</p>");
          j.suite();
        } });
    } }
  ]
});
