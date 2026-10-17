/* Niveau : l'UART en matériel (Section II, diapositives 4 à 7). Bloc d'émission et de réception du PIC18F4520, chronogramme TXIF / TRMT, erreurs OERR et FERR, PSoC 5. */
NIVEAU({
  id: "uart-materiel",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "emission", allume: {}, choisi: null, bon: null, surTouche: null };
    var EMI = {
      txreg: [230, 50, 240, 56, "TXREG Register"], txif: [40, 50, 110, 56, "TXIF"], txie: [40, 128, 110, 50, "TXIE"],
      tsr: [190, 176, 320, 72, ""], pin: [470, 294, 190, 64, "Pin Buffer\nand Control"], trmt: [300, 300, 110, 50, "TRMT"],
      spen: [440, 440, 110, 56, "SPEN"], txpin: [570, 440, 90, 56, "TX pin"], brg: [24, 300, 246, 64, "SPBRGH | SPBRG\nBaud Rate Generator"],
      brg16: [24, 400, 100, 50, "BRG16"], txen: [160, 400, 110, 50, "TXEN"], tx9: [24, 500, 100, 50, "TX9"], tx9d: [160, 500, 110, 50, "TX9D"]
    };
    var REC = {
      brg: [20, 130, 230, 64, "SPBRGH | SPBRG\nBaud Rate Generator"], div: [276, 116, 112, 92, "÷ 64\n÷ 16\n÷ 4"],
      cren: [430, 120, 76, 50, "CREN"], oerr: [516, 120, 72, 50, "OERR"], ferr: [598, 120, 72, 50, "FERR"],
      rsr: [430, 226, 240, 60, ""], rcreg: [430, 340, 240, 64, "RX9D | RCREG Register\nFIFO"],
      rx: [16, 430, 70, 56, "RX"], pinr: [104, 430, 140, 56, "Pin Buffer\nand Control"], spenr: [114, 520, 120, 48, "SPEN"],
      rec: [270, 430, 130, 56, "Data\nRecovery"], rcif: [440, 470, 90, 48, "RCIF"], rcie: [440, 530, 90, 48, "RCIE"]
    };
    function blocs(T) {
      Object.keys(T).forEach(function (k) {
        var b = T[k], ch = n.choisi === k, coul = ch ? (k === n.bon ? C.ok : C.ko) : null;
        EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: b[4].length > 12 ? 15 : 17, actif: !!n.allume[k], stroke: coul || undefined, fill: coul ? (k === n.bon ? "#e3f7ee" : "#fdecec") : undefined, mono: b[4].length < 6 });
      });
    }
    function cellules(x, y, w, h, noms, taille) {
      var l = w / noms.length;
      noms.forEach(function (t, k) { EMB.el("rect", { x: x + k * l, y: y, width: l, height: h, fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g); EMB.texte(g, t, [x + k * l + l / 2, y + h / 2], { taille: taille || 14, mono: true, halo: false }); });
    }
    n.dessin = function () {
      EMB.vider(g);
      var F = function (a, b, o) { EMB.fleche(g, a, b, o || { ep: 2.2 }); };
      if (n.mode === "emission") {
        EMB.texte(g, "Data Bus", [350, 18], { taille: 15, coul: C.doux });
        F([350, 28], [350, 50]);
        blocs(EMI);
        cellules(205, 200, 290, 40, ["(8)", "", "• • •", "", "0"]);
        EMB.texte(g, "TSR Register", [350, 188], { taille: 14, halo: false });
        EMB.texte(g, "MSb", [205, 166], { taille: 13, coul: C.doux, ancre: "start" }); EMB.texte(g, "LSb", [495, 166], { taille: 13, coul: C.doux, ancre: "end" });
        F([350, 106], [350, 176]); EMB.texte(g, "8", [364, 140], { taille: 14 });
        F([230, 78], [150, 78]);
        F([95, 178], [95, 222]); F([95, 106], [95, 128]); EMB.texte(g, "Interrupt", [95, 240], { taille: 15, coul: C.doux });
        F([510, 220], [565, 294]); F([495, 358], [495, 440]); F([615, 358], [615, 440]);
        F([355, 248], [355, 300]);
        F([147, 300], [230, 248]); EMB.texte(g, "Baud Rate CLK", [30, 276], { taille: 13, coul: C.doux, ancre: "start" });
        F([124, 425], [160, 425]); F([215, 400], [215, 364]);
        F([124, 525], [160, 525]); F([270, 525], [215, 248], { ep: 1.8, tirets: "5 5" });
      } else if (n.mode === "reception") {
        blocs(REC);
        cellules(440, 236, 220, 40, ["Stop", "(8)", "7", "• •", "1", "0", "Start"], 11);
        EMB.texte(g, "RSR Register", [550, 300], { taille: 14 });
        F([250, 162], [276, 162]); F([332, 208], [332, 430]); EMB.texte(g, "×64 Baud Rate CLK", [135, 112], { taille: 13, coul: C.doux });
        F([86, 458], [104, 458]); F([174, 520], [174, 486]); F([244, 458], [270, 458]);
        F([400, 445], [440, 270]);
        F([468, 170], [468, 226]); F([552, 226], [552, 170]); F([634, 226], [634, 170]);
        F([550, 286], [550, 340]);
        EMB.texte(g, "Data Bus", [620, 440], { taille: 14, coul: C.doux }); F([620, 404], [620, 424]);
        F([440, 494], [400, 520]); F([440, 554], [400, 524]); EMB.texte(g, "Interrupt", [330, 540], { taille: 15, coul: C.doux });
      } else if (n.mode === "chrono") {
        var X0 = 200, PAS = 36, Y = [70, 150, 240, 340, 440];
        [["Write to TXREG", 0], ["BRG Output\n(Shift Clock)", 1], ["TX (pin)", 2], ["TXIF bit", 3], ["TRMT bit", 4]].forEach(function (r) {
          EMB.texte(g, r[0], [16, Y[r[1]] + 18], { taille: 15, ancre: "start", gras: !!n.allume[["w", "b", "tx", "txif", "trmt"][r[1]]], coul: n.allume[["w", "b", "tx", "txif", "trmt"][r[1]]] ? C.acc : C.encre });
        });
        EMB.onde(g, X0, Y[0], PAS / 4, 36, [0, 1, 0, 0].concat(new Array(48).fill(0)), { ep: 2.5 });
        EMB.texte(g, "Word 1", [X0 + 14, Y[0] - 14], { taille: 13, coul: C.doux });
        EMB.horloge(g, X0, Y[1], PAS, 36, 13, { ep: 2.5 });
        EMB.onde(g, X0, Y[2], PAS, 36, [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1], { ep: 3, fronts: true, coul: C.acc, etiquettes: ["", "start", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "stop", "", ""], taille: 12 });
        EMB.onde(g, X0, Y[3], PAS / 4, 36, [1, 1, 0, 1].concat(new Array(48).fill(1)), { ep: 3, coul: n.allume.txif ? C.acc : C.encre });
        EMB.onde(g, X0, Y[4], PAS / 4, 36, [1, 1, 1, 0].concat(new Array(37).fill(0), new Array(12).fill(1)), { ep: 3, coul: n.allume.trmt ? C.acc : C.encre });
        EMB.el("line", { x1: X0 + PAS * 0.75, y1: 40, x2: X0 + PAS * 0.75, y2: 490, stroke: C.gris, "stroke-width": 1.5, "stroke-dasharray": "4 5" }, g);
        EMB.el("line", { x1: X0 + PAS * 11, y1: 220, x2: X0 + PAS * 11, y2: 490, stroke: C.gris, "stroke-width": 1.5, "stroke-dasharray": "4 5" }, g);
        EMB.texte(g, "Word 1 → Transmit Shift Reg", [X0 + 10, 520], { taille: 14, ancre: "start", coul: C.doux, gras: false });
        EMB.texte(g, "fin du stop bit", [X0 + PAS * 11, 560], { taille: 14, coul: C.doux, gras: false });
      } else {
        // vote 2 sur 3 : un bit suréchantillonné 16 fois
        var x0 = 60, w = 560, y1 = 170, y0 = 290;
        EMB.texte(g, "un bit reçu, échantillonné 16 fois", [340, 70], { taille: 19 });
        var d = "M" + x0 + " " + y1 + " L" + (x0 + w * 0.47) + " " + y1 + " L" + (x0 + w * 0.48) + " " + y0 + " L" + (x0 + w * 0.53) + " " + y0 + " L" + (x0 + w * 0.54) + " " + y1 + " L" + (x0 + w) + " " + y1;
        EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
        EMB.texte(g, "parasite", [x0 + w * 0.505, y0 + 34], { taille: 15, coul: C.ko });
        for (var k = 0; k < 16; k++) {
          var x = x0 + w * (k + 0.5) / 16, mil = k >= 7 && k <= 9, v = x > x0 + w * 0.475 && x < x0 + w * 0.535 ? 0 : 1;
          EMB.el("line", { x1: x, y1: 340, x2: x, y2: mil ? 390 : 365, stroke: mil ? C.encre : C.gris, "stroke-width": mil ? 3 : 1.5 }, g);
          if (mil) { EMB.bloc(g, x - 22, 400, 44, 46, String(v), { taille: 22, mono: true, actif: n.allume.vote }); }
        }
        EMB.texte(g, "échantillons 7, 8, 9 : au milieu du bit", [340, 490], { taille: 16, gras: false });
        if (n.allume.vote) EMB.texte(g, "deux 1 contre un 0 : le bit vaut 1", [340, 540], { taille: 19, coul: C.ok });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var T = n.mode === "emission" ? EMI : n.mode === "reception" ? REC : {}, z = {};
      Object.keys(T).forEach(function (k) { z[k] = EMB.zoneMin(T[k].slice(0, 4)); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le chemin", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Bloc d'émission de l'UART du PIC18F4520. Le programme écrit un octet sur le bus de données. Dans quel ordre traverse-t-il les blocs jusqu'à la broche TX ?");
      var z = j.zone("", '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:17px"><span>Data Bus</span><span>→</span><span class="trou" data-attendu="r"></span><span>→</span><span class="trou" data-attendu="s"></span><span>→</span><span class="trou" data-attendu="p"></span><span>→</span><span>TX pin</span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "TSR" }, { id: "p", html: "Pin Buffer and Control" }, { id: "r", html: "TXREG" }],
        aide: "Suis les flèches sur la figure, depuis « Data Bus » en haut.",
        ok: function () {
          n.allume = { txreg: true, tsr: true, pin: true, txpin: true }; n.dessin();
          j.bravo("TXREG, puis TSR, puis la broche.");
          j.expliquer("<p><b>TXREG</b> reçoit l'octet en parallèle (8 fils). Il le passe au registre à décalage <b>TSR</b>, qui le sort bit par bit au rythme de l'horloge du générateur de baud (<b>SPBRGH:SPBRG</b>, sur 16 bits si <b>BRG16</b> = 1). La broche n'est pilotée que si <b>SPEN</b> (<i>serial port enable</i>) vaut 1 ; <b>TXEN</b> autorise l'émission. En mode 9 bits (<b>TX9</b>), le 9e bit vient de <b>TX9D</b>.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Être prévenu", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le programme veut une interruption dès qu'il peut écrire l'octet suivant. Touche sur la figure le bit qu'il doit mettre à 1.");
      var fini = false, AIDE = { txif: "TXIF est le drapeau mis par le matériel. Le programme, lui, autorise l'interruption avec l'autre entrée de la porte ET.", tsr: "Le TSR décale les bits. Regarde la porte qui produit « Interrupt ».", txreg: "TXREG reçoit l'octet. Regarde la porte qui produit « Interrupt »." };
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "txie"; n.dessin();
        if (k !== "txie") { j.erreur(AIDE[k] || "Regarde ce qui entre dans la porte qui produit « Interrupt »."); return; }
        fini = true; n.surTouche = null; n.allume = { txif: true, txie: true }; n.choisi = null; n.dessin();
        j.bravo("TXIE autorise l'interruption.", [95, 153]);
        j.expliquer("<p>L'interruption part quand <b>TXIF</b> (le tampon TXREG est vide) ET <b>TXIE</b> (autorisation) valent 1. Le matériel met TXIF ; le programme choisit TXIE.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("txie"); });
    } },
    { nom: "TXIF ou TRMT", jouer: function (j, n) {
      n.mode = "chrono"; n.allume = {}; n.dessin();
      j.fig.astuce("");
      j.titre("Juste après l'écriture dans TXREG, le mot part dans le registre à décalage. Quel drapeau dit qu'on peut déjà écrire le mot suivant ?");
      j.choix([
        { html: "TXIF : il redescend 1 TCY puis remonte", juste: true },
        { html: "TRMT : il reste à 1", aide: "Regarde la ligne TRMT : elle tombe à 0 dès que le mot entre dans le TSR et ne remonte qu'à la fin du stop bit." }
      ], { colonnes: 1, ok: function () {
        n.allume = { txif: true, trmt: true }; n.dessin();
        j.bravo("TXIF remonte presque tout de suite : TXREG est libre.");
        j.expliquer("<p><b>TXIF</b> (<i>Transmit Buffer Reg. Empty Flag</i>) : TXREG est vide, on peut y écrire. <b>TRMT</b> (<i>Transmit Shift Reg. Empty Flag</i>) : le TSR est vide, la trame est complètement partie. Pendant que le TSR envoie le mot 1, TXREG peut déjà recevoir le mot 2.</p>");
        j.suite();
      } });
    } },
    { nom: "Erreur de trame", jouer: function (j, n) {
      n.mode = "reception"; n.allume = {}; n.choisi = null; n.dessin();
      j.fig.astuce("Bloc de réception du PIC18F4520. Touche un bloc.");
      j.titre("Le récepteur lit un stop bit à 0 au lieu de 1. Touche le bit d'erreur qui s'allume.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "ferr"; n.dessin();
        if (k !== "ferr") { j.erreur(k === "oerr" ? "OERR signale un débordement : un octet arrive alors qu'il n'y a plus de place. Ici, c'est la forme de la trame qui est fausse." : "Cherche un bit d'erreur relié au registre RSR, qui contient le stop bit."); return; }
        fini = true; n.surTouche = null; n.allume = { ferr: true, rsr: true }; n.choisi = null; n.dessin();
        j.bravo("FERR : <i>framing error</i>.", [634, 145]);
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("ferr"); });
    } },
    { nom: "Débordement", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le programme ne lit plus RCREG. La FIFO est pleine et un nouvel octet arrive. Que se passe-t-il ?");
      j.choix([
        { html: "OERR passe à 1 : débordement", juste: true },
        { html: "FERR passe à 1", aide: "La trame est bien formée, stop bit compris. Le problème, c'est qu'il n'y a plus de place pour la ranger." },
        { html: "Rien : RCREG s'agrandit", aide: "RCREG est une petite FIFO de taille fixe. Regarde le bit d'erreur relié au registre de réception." }
      ], { colonnes: 1, ok: function () {
        n.allume = { oerr: true, rcreg: true }; n.dessin();
        j.bravo("OERR : <i>overrun error</i>.");
        j.expliquer("<p>À la réception, <b>Data Recovery</b> lit RX au rythme du générateur de baud (<i>×64 Baud Rate CLK</i>, divisée par 64, 16 ou 4), le registre <b>RSR</b> reçoit la trame, puis l'octet passe dans <b>RCREG</b>, une FIFO. <b>RCIF</b> (avec <b>RCIE</b>) déclenche l'interruption, <b>CREN</b> autorise la réception continue. Erreurs : <b>FERR</b> (trame), <b>OERR</b> (débordement).</p>");
        j.suite();
      } });
    } },
    { nom: "Vote 2 sur 3", jouer: function (j, n) {
      n.mode = "vote"; n.allume = {}; n.dessin();
      j.fig.astuce("UART du PSoC 5.");
      j.titre("L'UART du PSoC 5 suréchantillonne chaque bit et vote à 2 sur 3. Ici un parasite tombe au milieu du bit. Quelle valeur retient-il ?");
      j.choix([{ html: "0", aide: "Un seul des trois échantillons du milieu vaut 0. Compte les 1." }, { html: "1", juste: true }], { colonnes: 2, ok: function () {
        n.allume = { vote: true }; n.dessin();
        j.bravo("Deux contre un : 1.");
        j.expliquer("<p>Fonctionnalités de l'UART du PSoC 5 : mode adresse 9 bits avec détection matérielle d'adresse ; débits de 110 à 921600 bps, ou quelconque jusqu'à 4 Mbps ; tampons RX et TX de 4 à 65535 ; détection des erreurs de trame, de parité et de débordement ; matériel optimisé full duplex, half duplex, TX seul ou RX seul ; vote 2 sur 3 par bit ; génération et détection de <i>break</i> ; suréchantillonnage 8x ou 16x.</p>");
        j.suite();
      } });
    } }
  ]
});
