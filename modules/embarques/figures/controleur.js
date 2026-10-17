(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : le contrôleur de la diapositive 6, trajet par trajet ---------- */
  (function () {
    var f = R.figure("fig-controleur", {
      largeur: 960, hauteur: 570,
      titre: "Architecture d'un contrôleur embarqué",
      essai: "<strong>Essaie</strong> : choisis un trajet avec les boutons, ou touche un bloc. <strong>Observe</strong> : une mesure entre par la gauche, rejoint le CPU par le Data Bus ; le CPU désigne toujours une case mémoire par l'Address Bus, et la donnée passe par le Data Bus."
    });
    var g = EMB.el("g", null, f.svg);
    var B = {
      afe: [125, 45, 170, 54, "Analog\nFront End", "Reçoit les entrées analogiques : tension d'un capteur de pression, d'une électrode ECG."],
      dinp: [125, 107, 170, 54, "Digital\ninp Ports", "Reçoivent les entrées numériques : niveaux 0 ou 1 d'un bouton, d'un capteur tout ou rien."],
      ui: [335, 45, 250, 82, "User Interface\nModules", "Modules d'interface utilisateur."],
      da: [665, 45, 175, 54, "D/A,\nIsolation", "Sorties analogiques : convertit un nombre en tension, et isole électriquement."],
      dout: [665, 107, 175, 54, "Digital\noup Ports", "Sorties numériques : niveaux 0 ou 1 vers une LED, un relais."],
      support: [665, 178, 175, 80, "Support :\nTimers, Watchdog", "Timers pour mesurer et cadencer le temps ; Watchdog pour surveiller le programme."],
      comms: [665, 272, 175, 100, "Comms :\nUSB, IIC,\nSPI, CAN", "Liaisons de communication vers d'autres systèmes (Links to Other Systems)."],
      cpu: [260, 210, 190, 92, "CPU", "Exécute le programme. Reçoit les interruptions (interrupts)."],
      databus: [180, 350, 430, 40, "Data Bus", "Transporte les données entre le CPU, les mémoires et les entrées-sorties."],
      addrbus: [130, 430, 570, 36, "Address Bus", "Porte l'adresse de la case visée en mémoire."],
      dmem: [170, 482, 190, 52, "Data Memory", "Mémoire des données : mesures, variables."],
      pmem: [425, 482, 200, 52, "Program Memory", "Mémoire du programme : les instructions."]
    };
    var TRAJETS = [
      ["Mesure analogique", ["afe", "databus", "cpu", "addrbus", "dmem"], "La tension entre par l'Analog Front End ; sa valeur rejoint le CPU par le Data Bus ; le CPU la range en Data Memory, à l'adresse posée sur l'Address Bus."],
      ["Lire une instruction", ["cpu", "addrbus", "pmem", "databus"], "Le CPU pose l'adresse de l'instruction sur l'Address Bus ; l'instruction revient de la Program Memory par le Data Bus."],
      ["Sortie analogique", ["cpu", "databus", "da"], "Le CPU envoie un nombre par le Data Bus au bloc D/A, qui le change en tension isolée."],
      ["Sortie numérique", ["cpu", "databus", "dout"], "Le CPU écrit 0 ou 1 sur un Digital oup Port."],
      ["Interruption", ["support", "int", "cpu"], "Un timer arrive à échéance (ou un bouton change) : la ligne interrupts prévient le CPU, qui interrompt sa tâche pour traiter l'événement."],
      ["Communication", ["cpu", "databus", "comms", "liens"], "Le CPU confie un message au bloc Comms (USB, IIC, SPI, CAN), qui le transmet aux autres systèmes."]
    ];
    var actifs = [], b = R.boutons(f.reglages), btns = [], zone = R.h("p", null, "Choisis un trajet ou touche un bloc.", f.direct);
    TRAJETS.forEach(function (t, i) { btns.push(R.bouton(b, t[0], function () { actifs = t[1]; btns.forEach(function (x, k) { x.classList.toggle("actif", k === i); }); zone.textContent = t[2]; dessiner(); })); });
    function on(k) { return actifs.indexOf(k) >= 0; }
    function dessiner() {
      EMB.vider(g);
      EMB.el("rect", { x: 100, y: 22, width: 760, height: 525, rx: 10, fill: "#f4f5f8", stroke: C.encre, "stroke-width": 3, "stroke-dasharray": "4 6" }, g);
      EMB.el("rect", { x: 112, y: 32, width: 738, height: 140, rx: 8, fill: "#e8f0e2" }, g);
      EMB.el("rect", { x: 652, y: 32, width: 198, height: 352, rx: 8, fill: "#e8f0e2" }, g);
      [[72, "Analog i/p"], [134, "Digital i/p"]].forEach(function (p) { EMB.fleche(g, [10, p[0]], [125, p[0]], { ep: 3 }); EMB.texte(g, p[1], [52, p[0] - 14], { taille: 13, gras: false, coul: C.doux }); });
      [[72, "Analog o/p"], [134, "Digital o/p"]].forEach(function (p) { EMB.fleche(g, [840, p[0]], [955, p[0]], { ep: 3 }); EMB.texte(g, p[1], [905, p[0] - 14], { taille: 13, gras: false, coul: C.doux }); });
      EMB.texte(g, "INPUTS", [52, 190], { taille: 16, italique: true });
      EMB.texte(g, "OUTPUTS", [905, 190], { taille: 16, italique: true });
      var or = "#e07b2a", bl = "#4a6fc4";
      EMB.fleche(g, [300, 161], [300, 210], { ep: on("int") ? 5 : 2.5, coul: on("int") ? C.acc : C.encre });
      EMB.texte(g, "interrupts", [238, 186], { taille: 15, gras: false, coul: on("int") ? C.acc : C.encre });
      if (on("int")) EMB.fleche(g, [665, 218], [450, 218], { ep: 4, coul: C.acc, tirets: "8 6" });
      EMB.fleche(g, [540, 127], [540, 350], { ep: 4, double: true, coul: or });
      EMB.fleche(g, [400, 302], [400, 350], { ep: 4, double: true, coul: or });
      EMB.el("polyline", { points: "260,256 222,256 222,430", fill: "none", stroke: bl, "stroke-width": 4 }, g);
      EMB.fleche(g, [222, 420], [222, 430], { ep: 4, coul: bl });
      EMB.fleche(g, [265, 390], [265, 482], { ep: 4, double: true, coul: or });
      EMB.fleche(g, [525, 390], [525, 482], { ep: 4, double: true, coul: or });
      EMB.fleche(g, [610, 370], [665, 330], { ep: 4, double: true, coul: or });
      EMB.fleche(g, [680, 430], [680, 372], { ep: 4, coul: bl });
      EMB.fleche(g, [815, 372], [815, 566], { ep: on("liens") ? 5 : 4, coul: on("liens") ? C.acc : C.encre });
      EMB.texte(g, "Links to\nOther Systems", [800, 540], { taille: 14, italique: true, ancre: "end", coul: on("liens") ? C.acc : C.encre });
      Object.keys(B).forEach(function (k) {
        var x = B[k];
        if (k === "databus" || k === "addrbus") {
          EMB.el("rect", { x: x[0], y: x[1], width: x[2], height: x[3], rx: 6, fill: on(k) ? C.acc : (k === "databus" ? "#f0a35c" : "#6f8fd6") }, g);
          EMB.texte(g, x[4], [x[0] + x[2] / 2, x[1] + x[3] / 2], { taille: 18, coul: "#fff", halo: false });
        } else EMB.bloc(g, x[0], x[1], x[2], x[3], x[4], { taille: k === "cpu" ? 24 : 17, actif: on(k) });
      });
    }
    EMB.toucher(f.svg, function () { var z = {}; Object.keys(B).forEach(function (k) { z[k] = B[k].slice(0, 4); }); return z; }, function (k) {
      actifs = [k]; btns.forEach(function (x) { x.classList.remove("actif"); });
      zone.textContent = B[k][4].replace(/\n/g, " ") + " : " + B[k][5]; dessiner();
    });
    dessiner();
  })();

  /* ---------- Figure 2 : CompactRIO et contrôleur embarqué du commerce ---------- */
  (function () {
    var f = R.figure("fig-autres", {
      largeur: 960, hauteur: 520,
      titre: "Deux autres contrôleurs",
      essai: "<strong>Essaie</strong> : passe d'un schéma à l'autre avec les boutons. <strong>Observe</strong> : dans le CompactRIO, le FPGA est entre le processeur et les E/S ; dans le contrôleur du commerce, le microcontrôleur est entouré de l'alimentation, de l'interface capteurs, de la commande d'actionneurs et du réseau.",
      direct: false
    });
    var g = EMB.el("g", null, f.svg), vue = 0, b = R.boutons(f.reglages);
    var b1 = R.bouton(b, "CompactRIO", function () { vue = 0; dessiner(); });
    var b2 = R.bouton(b, "Embedded controller du commerce", function () { vue = 1; dessiner(); });
    function dessiner() {
      EMB.vider(g);
      b1.classList.toggle("actif", vue === 0); b2.classList.toggle("actif", vue === 1);
      if (vue === 0) {
        EMB.bloc(g, 60, 150, 230, 230, "Processor", { taille: 24, fill: "#24302b", coul: "#fff" });
        EMB.bloc(g, 380, 150, 230, 230, "FPGA", { taille: 24, fill: "#24302b", coul: "#fff" });
        EMB.el("line", { x1: 290, y1: 265, x2: 380, y2: 265, stroke: C.encre, "stroke-width": 3 }, g);
        ["Analog I/O", "Digital I/O", "Industrial Communication", "Custom I/O"].forEach(function (t, i) {
          var y = 140 + i * 66;
          EMB.el("line", { x1: 610, y1: y + 24, x2: 680, y2: y + 24, stroke: C.encre, "stroke-width": 2.5 }, g);
          EMB.bloc(g, 680, y, 240, 48, t, { taille: 17, gras: false });
        });
        EMB.texte(g, "VI LabVIEW", [175, 410], { taille: 18, coul: C.acc });
        EMB.texte(g, "VI LabVIEW", [495, 410], { taille: 18, coul: C.acc });
        EMB.texte(g, "The main processor and FPGA run separate LabVIEW VIs.", [480, 470], { taille: 19, italique: true, gras: false });
      } else {
        EMB.el("rect", { x: 140, y: 70, width: 680, height: 430, rx: 8, fill: "#eef0f5" }, g);
        EMB.bloc(g, 400, 10, 160, 42, "Bat (Supply)", { taille: 16 });
        EMB.bloc(g, 300, 80, 360, 76, "Voltage Supply\nIncl. Reverse polarity protection\nand input filter", { taille: 15 });
        EMB.fleche(g, [480, 52], [480, 80], { ep: 2.5 }); EMB.fleche(g, [480, 156], [480, 180], { ep: 2.5 });
        EMB.bloc(g, 170, 180, 110, 220, "Sensor\nInterface", { taille: 16 });
        EMB.bloc(g, 680, 180, 110, 220, "Actuator\nDriver", { taille: 16 });
        EMB.el("rect", { x: 320, y: 180, width: 320, height: 220, rx: 10, fill: "#5c9bd1", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "Microcontroller", [480, 202], { taille: 18, coul: "#fff", halo: false });
        EMB.bloc(g, 345, 222, 270, 40, "Cores", { taille: 16, fill: "#e6eef7" });
        EMB.bloc(g, 345, 272, 125, 40, "NVM", { taille: 16, fill: "#e6eef7" });
        EMB.bloc(g, 490, 272, 125, 40, "SRAM", { taille: 16, fill: "#e6eef7" });
        EMB.bloc(g, 345, 322, 270, 66, "Peripherals,\nADC, SCI, PWM, ...", { taille: 16, fill: "#e6eef7" });
        EMB.fleche(g, [280, 290], [320, 290], { ep: 2.5, double: true }); EMB.fleche(g, [640, 290], [680, 290], { ep: 2.5, double: true });
        EMB.bloc(g, 320, 420, 320, 64, "IVN\nEthernet, FlexRay, CAN, LIN", { taille: 16 });
        EMB.fleche(g, [480, 400], [480, 420], { ep: 2.5, double: true });
        EMB.texte(g, "GND", [480, 512], { taille: 16 });
        [[70, 240], [70, 340], [890, 240], [890, 340]].forEach(function (p) { EMB.el("line", { x1: p[0] < 400 ? 100 : 790, y1: p[1], x2: p[0] < 400 ? 170 : 860, y2: p[1], stroke: C.encre, "stroke-width": 2 }, g); EMB.bloc(g, p[0] < 400 ? 76 : 860, p[1] - 12, 24, 24, "", { rx: 2 }); });
        EMB.texte(g, "Texas Instruments, NXP, Freescale", [60, 30], { taille: 14, ancre: "start", coul: C.doux, gras: false });
      }
    }
    dessiner();
  })();
})();
