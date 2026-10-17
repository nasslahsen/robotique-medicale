/* Niveau : architecture d'un contrôleur embarqué (Section I, diapositives 6, 7 et 21). Entrées, CPU, bus, mémoires, sorties ; CompactRIO ; embedded controllers. */
NIVEAU({
  id: "controleur",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "s6", chemin: [], faux: null, surTouche: null };
    // blocs de la diapositive 6 : [x, y, w, h, texte]
    var S6 = {
      afe: [75, 52, 150, 52, "Analog\nFront End"],
      dinp: [75, 110, 150, 52, "Digital\ninp Ports"],
      ui: [240, 52, 190, 70, "User Interface\nModules"],
      da: [450, 52, 155, 52, "D/A,\nIsolation"],
      dout: [450, 110, 155, 52, "Digital\noup Ports"],
      support: [450, 182, 155, 74, "Support :\nTimers,\nWatchdog"],
      comms: [450, 268, 155, 86, "Comms :\nUSB, IIC,\nSPI, CAN"],
      cpu: [160, 228, 160, 78, "CPU"],
      databus: [110, 352, 320, 38, "Data Bus"],
      addrbus: [75, 418, 450, 34, "Address Bus"],
      dmem: [95, 488, 165, 62, "Data\nMemory"],
      pmem: [300, 488, 175, 62, "Program\nMemory"]
    };
    var CRIO = {
      proc: [40, 210, 170, 170, "Processor"],
      fpga: [270, 210, 170, 170, "FPGA"],
      aio: [490, 160, 170, 56, "Analog I/O"],
      dio: [490, 236, 170, 56, "Digital I/O"],
      ind: [490, 312, 170, 56, "Industrial\nCommunication"],
      cio: [490, 388, 170, 56, "Custom I/O"]
    };
    var EC = {
      bat: [270, 18, 140, 40, "Bat (Supply)"],
      supply: [170, 82, 340, 92, "Voltage Supply\nIncl. Reverse polarity protection\nand input filter"],
      sensor: [40, 210, 100, 250, "Sensor\nInterface"],
      mcu: [175, 205, 330, 260, ""],
      actu: [540, 210, 100, 250, "Actuator\nDriver"],
      ivn: [175, 490, 330, 80, "IVN\nEthernet, FlexRay, CAN, LIN"]
    };
    n.ZONES = { s6: S6, crio: CRIO, ec: EC };
    function blocs(T, o) {
      Object.keys(T).forEach(function (k) {
        var b = T[k], on = n.chemin.indexOf(k) >= 0, faux = n.faux === k;
        if (k === "databus" || k === "addrbus") {
          EMB.el("rect", { x: b[0], y: b[1], width: b[2], height: b[3], rx: 6, fill: on ? C.acc : faux ? C.ko : (k === "databus" ? "#f0a35c" : "#6f8fd6"), opacity: on || faux ? 1 : 0.9 }, g);
          EMB.texte(g, b[4], [b[0] + b[2] / 2, b[1] + b[3] / 2], { taille: 17, coul: "#fff", halo: false });
          return;
        }
        if (!b[4]) return;
        EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: (o && o.taille) || 15, actif: on, stroke: faux ? C.ko : null, fill: faux ? "#fdecec" : on ? null : (o && o.fill) || "#fff" });
      });
    }
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "s6") {
        EMB.el("rect", { x: 58, y: 34, width: 564, height: 530, rx: 10, fill: "#f4f5f8", stroke: C.encre, "stroke-width": 3, "stroke-dasharray": "4 6" }, g);
        EMB.el("rect", { x: 68, y: 44, width: 545, height: 125, rx: 8, fill: "#e8f0e2" }, g);
        EMB.el("rect", { x: 440, y: 44, width: 173, height: 320, rx: 8, fill: "#e8f0e2" }, g);
        // liaisons
        EMB.fleche(g, [8, 78], [75, 78], { ep: 3 }); EMB.fleche(g, [8, 136], [75, 136], { ep: 3 });
        EMB.texte(g, "INPUTS", [40, 186], { taille: 15, italique: true });
        EMB.fleche(g, [605, 78], [676, 78], { ep: 3 }); EMB.fleche(g, [605, 136], [676, 136], { ep: 3 });
        EMB.texte(g, "OUTPUTS", [645, 186], { taille: 15, italique: true });
        EMB.fleche(g, [200, 168], [200, 228], { ep: 2.5 });
        EMB.texte(g, "interrupts", [140, 200], { taille: 14, gras: false });
        EMB.fleche(g, [360, 168], [360, 352], { ep: 4, double: true, coul: "#e07b2a" });
        EMB.fleche(g, [240, 306], [240, 352], { ep: 4, double: true, coul: "#e07b2a" });
        EMB.fleche(g, [180, 306], [180, 418], { ep: 4, coul: "#4a6fc4" });
        EMB.fleche(g, [180, 390], [180, 488], { ep: 4, double: true, coul: "#e07b2a" });
        EMB.fleche(g, [380, 390], [380, 488], { ep: 4, double: true, coul: "#e07b2a" });
        EMB.fleche(g, [130, 452], [130, 488], { ep: 4, coul: "#4a6fc4" });
        EMB.fleche(g, [450, 452], [450, 488], { ep: 4, coul: "#4a6fc4" });
        EMB.fleche(g, [500, 418], [500, 354], { ep: 4, coul: "#4a6fc4" });
        EMB.fleche(g, [585, 354], [585, 596], { ep: 4 });
        EMB.texte(g, "Links to\nOther Systems", [574, 578], { taille: 13, italique: true, ancre: "end" });
        blocs(S6);
      } else if (n.mode === "crio") {
        EMB.texte(g, "CompactRIO", [340, 120], { taille: 26 });
        EMB.el("line", { x1: 210, y1: 295, x2: 270, y2: 295, stroke: C.encre, "stroke-width": 3 }, g);
        ["aio", "dio", "ind", "cio"].forEach(function (k) { var b = CRIO[k]; EMB.el("line", { x1: 440, y1: b[1] + b[3] / 2, x2: 490, y2: b[1] + b[3] / 2, stroke: C.encre, "stroke-width": 2.5 }, g); });
        blocs(CRIO, { taille: 18 });
        if (n.vi) {
          EMB.texte(g, "VI LabVIEW 1", [125, 410], { taille: 16, coul: C.acc });
          EMB.texte(g, "VI LabVIEW 2", [355, 410], { taille: 16, coul: C.acc });
        }
      } else {
        EMB.el("rect", { x: 25, y: 70, width: 630, height: 510, rx: 8, fill: "#eef0f5" }, g);
        EMB.fleche(g, [340, 58], [340, 82], { ep: 2.5 });
        EMB.fleche(g, [340, 174], [340, 205], { ep: 2.5 });
        EMB.fleche(g, [140, 335], [175, 335], { ep: 2.5, double: true });
        EMB.fleche(g, [505, 335], [540, 335], { ep: 2.5, double: true });
        EMB.fleche(g, [340, 465], [340, 490], { ep: 2.5, double: true });
        blocs(EC, { taille: 15 });
        var m = EC.mcu, on = n.chemin.indexOf("mcu") >= 0;
        EMB.el("rect", { x: m[0], y: m[1], width: m[2], height: m[3], rx: 10, fill: on ? C.acc : "#5c9bd1", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "Microcontroller", [340, 228], { taille: 18, coul: "#fff", halo: false });
        EMB.bloc(g, 200, 250, 280, 44, "Cores", { taille: 16, fill: "#e6eef7" });
        EMB.bloc(g, 200, 306, 130, 44, "NVM", { taille: 16, fill: "#e6eef7" });
        EMB.bloc(g, 350, 306, 130, 44, "SRAM", { taille: 16, fill: "#e6eef7" });
        EMB.bloc(g, 200, 362, 280, 84, "Peripherals,\nADC, SCI, PWM, ...", { taille: 16, fill: "#e6eef7" });
        EMB.texte(g, "GND", [340, 590], { taille: 15 });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var T = n.ZONES[n.mode], z = {};
      Object.keys(T).forEach(function (k) { z[k] = EMB.zoneMin(T[k].slice(0, 4)); });
      return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "L'entrée analogique", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un capteur ECG fournit une petite tension analogique. Touche le bloc qui la reçoit en premier.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "afe") {
          n.faux = k; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800);
          j.erreur(k === "dinp" ? "Ce port reçoit des niveaux logiques 0 ou 1, pas une tension qui varie." : "Regarde le côté INPUTS, à gauche : deux entrées, une analogique et une numérique.");
          return;
        }
        fini = true; n.surTouche = null; n.chemin = ["afe"]; n.dessin();
        j.bravo("L'<i>Analog Front End</i> accueille les signaux analogiques.", [150, 78]);
        j.expliquer("<p>Le contrôleur reçoit ses entrées par l'<b>Analog Front End</b> (signaux analogiques) et les <b>Digital inp Ports</b> (signaux numériques). Ses sorties passent par le bloc <b>D/A, Isolation</b> (analogiques) et les <b>Digital oup Ports</b> (numériques).</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("afe"); });
    } },
    { nom: "Le trajet", jouer: function (j, n) {
      n.chemin = []; n.dessin();
      j.titre("Une pompe ralentit quand la pression mesurée monte : la mesure analogique entre, le CPU décide, une tension analogique sort vers le moteur. Touche les trois blocs dans l'ordre.");
      var ordre = ["afe", "cpu", "da"], k = 0;
      n.surTouche = function (id) {
        if (k >= ordre.length) return;
        if (id !== ordre[k]) {
          j.erreur(k === 0 ? "D'abord l'entrée : la mesure est analogique." : k === 1 ? "Qui décide ? Le bloc au centre qui exécute le programme." : "La commande du moteur est une tension analogique : cherche la sortie analogique, en haut à droite.");
          return;
        }
        n.chemin.push(id); n.dessin(); k++;
        if (k < ordre.length) { j.info("Oui. Ensuite ?"); return; }
        n.surTouche = null;
        j.bravo("Analog Front End, CPU, D/A : l'entrée, la décision, la sortie.");
        j.suite();
      };
      j.reponse(function () { while (n.surTouche && k < ordre.length) n.surTouche(ordre[k]); });
    } },
    { nom: "Ranger", jouer: function (j, n) {
      n.chemin = []; n.dessin();
      j.fig.astuce("");
      j.titre("Range chaque élément dans le bloc du schéma qui le contient.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><span>Support</span><span class="trou" data-attendu="w"></span><span>Comms</span><span class="trou" data-attendu="c"></span><span>Program Memory</span><span class="trou" data-attendu="p"></span><span>Data Memory</span><span class="trou" data-attendu="d"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "le bus CAN" }, { id: "d", html: "les mesures de pression" }, { id: "w", html: "le Watchdog" }, { id: "p", html: "les instructions du programme" }],
        aide: "Relis les étiquettes : Support liste Timers et Watchdog, Comms liste USB, IIC, SPI, CAN. Les deux mémoires séparent les instructions et les données.",
        ok: function () {
          n.chemin = ["support", "comms", "pmem", "dmem"]; n.dessin();
          j.bravo("Le programme d'un côté, les données de l'autre.");
          j.expliquer("<p>Le bloc <b>Support</b> regroupe les <b>Timers</b> et le <b>Watchdog</b>. Le bloc <b>Comms</b> regroupe les liaisons USB, IIC, SPI, CAN, qui mènent vers d'autres systèmes. La <b>Program Memory</b> contient le programme, la <b>Data Memory</b> les données.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Quel bus ?", jouer: function (j, n) {
      n.chemin = ["cpu", "dmem"]; n.dessin();
      j.titre("Le CPU veut lire la case numéro 0x20 de la Data Memory. Sur quel bus envoie-t-il ce numéro ?");
      j.choix([
        { html: "Address Bus", juste: true },
        { html: "Data Bus", aide: "Le Data Bus transporte la valeur lue. Le numéro de la case, c'est une adresse." },
        { html: "La ligne interrupts", aide: "Les interruptions vont des périphériques vers le CPU : elles ne choisissent pas une case mémoire." }
      ], { ok: function () {
        n.chemin = ["cpu", "addrbus", "databus", "dmem"]; n.dessin();
        j.bravo("L'adresse part sur l'Address Bus, la valeur revient sur le Data Bus.");
        j.expliquer("<p>Le CPU désigne une case par son adresse sur l'<b>Address Bus</b> ; la donnée circule sur le <b>Data Bus</b>, dans les deux sens. Les <b>interrupts</b> préviennent le CPU qu'un événement attend.</p>");
        j.suite();
      } });
    } },
    { nom: "CompactRIO", jouer: function (j, n) {
      n.mode = "crio"; n.chemin = []; n.dessin();
      j.fig.astuce("Le CompactRIO de National Instruments.");
      j.titre("Dans un CompactRIO, quel composant est relié directement aux entrées et sorties ?");
      j.choix([
        { html: "Le Processor", aide: "Suis les traits : le Processor n'est relié qu'à un seul bloc." },
        { html: "Le FPGA", juste: true }
      ], { colonnes: 2, ok: function () {
        n.chemin = ["fpga", "aio", "dio", "ind", "cio"]; n.vi = true; n.dessin();
        j.bravo("Le FPGA est entre le processeur et les E/S.");
        j.expliquer("<p>Le CompactRIO associe un <b>Processor</b> et un <b>FPGA</b> relié aux Analog I/O, Digital I/O, Industrial Communication et Custom I/O. <i>The main processor and FPGA run separate LabVIEW VIs</i> : chacun exécute son propre programme LabVIEW.</p>");
        j.suite();
      } });
    } },
    { nom: "Embedded controller", jouer: function (j, n) {
      n.mode = "ec"; n.chemin = []; n.vi = false; n.dessin();
      j.fig.astuce("");
      j.titre("Un technicien a branché la batterie à l'envers. Touche le bloc qui protège la carte.");
      j.consigne("Schéma d'un contrôleur embarqué du commerce (Texas Instruments, NXP, Freescale).");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "supply") { j.erreur("Cherche le bloc qui reçoit l'alimentation de la batterie, juste sous « Bat (Supply) »."); return; }
        fini = true; n.surTouche = null; n.chemin = ["supply"]; n.dessin();
        j.bravo("Le <i>Voltage Supply</i> inclut une protection contre l'inversion de polarité.", [340, 128]);
        j.expliquer("<p>Autour du <b>Microcontroller</b> (Cores, NVM, SRAM, Peripherals : ADC, SCI, PWM…), on trouve le <b>Voltage Supply</b> (protection d'inversion de polarité, filtre d'entrée), la <b>Sensor Interface</b>, l'<b>Actuator Driver</b> et l'<b>IVN</b>, le réseau qui relie la carte aux autres (Ethernet, FlexRay, CAN, LIN).</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("supply"); });
    } }
  ]
});
