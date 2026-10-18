/* Niveau : le système ARM et son cœur (Section I, diapositives 19 et 20). Bridge, AHB/ASB et APB, AMBA, banc de registres, barrel shifter, ALU. */
NIVEAU({
  id: "arm-interne",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "systeme", chemin: [], faux: null, surTouche: null };
    var SYS = {
      arbiter: [150, 74, 110, 40, "Arbiter"], reset: [500, 74, 110, 40, "Reset"],
      arm: [300, 70, 130, 70, "ARM"], tic: [150, 140, 92, 28, "TIC"], ebi: [150, 168, 92, 100, "External\nBus\nInterface"],
      rom: [12, 170, 96, 62, "External\nROM"], ram: [12, 252, 96, 62, "External\nRAM"],
      onchip: [320, 252, 110, 60, "On-chip\nRAM"], decoder: [222, 318, 92, 34, "Decoder"],
      bridge: [446, 140, 30, 200, ""], timer: [500, 140, 92, 42, "Timer"], remap: [600, 140, 72, 54, "Remap/\nPause"],
      ic: [518, 252, 132, 54, "Interrupt\nController"]
    };
    var COEUR = {
      areg: [110, 66, 260, 34, "address register"], inc: [250, 120, 120, 30, "incrementer"],
      bank: [110, 176, 260, 88, "register\nbank"], mult: [250, 290, 120, 34, "multiply\nregister"],
      shift: [250, 352, 120, 38, "barrel\nshifter"], alu: [110, 424, 260, 46, "ALU"],
      dec: [500, 66, 160, 410, "instruction\ndecode\n&\ncontrol"],
      dout: [110, 512, 230, 34, "data out register"], din: [400, 512, 230, 34, "data in register"]
    };
    n.Z = { systeme: SYS, coeur: COEUR };
    function boites(T) {
      Object.keys(T).forEach(function (k) {
        var b = T[k], on = n.chemin.indexOf(k) >= 0, faux = n.faux === k;
        var fill = faux ? "#fdecec" : on ? C.clair : k === "arm" ? "#45505f" : k === "dec" ? "#7d838e" : (n.mode === "systeme" && /timer|remap|ic/.test(k)) ? "#f1a35f" : (n.mode === "systeme" && /arbiter|reset|decoder|bridge/.test(k)) ? "#a45d86" : "#fff";
        var blanc = !on && !faux && fill !== "#fff";
        EMB.el("rect", { x: b[0], y: b[1], width: b[2], height: b[3], rx: 5, fill: fill, stroke: faux ? C.ko : on ? C.acc : C.encre, "stroke-width": on || faux ? 3.5 : 1.8 }, g);
        if (b[4]) EMB.texte(g, b[4], [b[0] + b[2] / 2, b[1] + b[3] / 2], { taille: k === "arm" ? 22 : 14.5, coul: blanc ? "#fff" : C.encre, halo: false });
      });
    }
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "systeme") {
        EMB.el("rect", { x: 128, y: 60, width: 552, height: 310, fill: "#a9d0e6", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("rect", { x: 300, y: 140, width: 130, height: 24, fill: "#3fbf4f", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.texte(g, "Bus Interface", [365, 152], { taille: 13, coul: "#fff", halo: false });
        EMB.el("rect", { x: 242, y: 210, width: 204, height: 16, fill: "#8a8f99" }, g);
        EMB.el("rect", { x: 357, y: 164, width: 16, height: 46, fill: "#8a8f99" }, g);
        EMB.el("rect", { x: 357, y: 226, width: 16, height: 26, fill: "#8a8f99" }, g);
        EMB.el("line", { x1: 108, y1: 201, x2: 150, y2: 201, stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("line", { x1: 108, y1: 283, x2: 128, y2: 283, stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("line", { x1: 128, y1: 201, x2: 128, y2: 283, stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("polyline", { points: "205,74 205,60", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("polyline", { points: "260,94 300,94", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("polyline", { points: "476,240 545,240 545,182 M545,240", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("polyline", { points: "476,240 636,240 636,194", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("polyline", { points: "584,240 584,252", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("polyline", { points: "268,318 268,226", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("polyline", { points: "314,335 375,335 375,312", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        EMB.el("polyline", { points: "196,268 196,355 461,355 461,340", fill: "none", stroke: C.encre, "stroke-width": 1.5 }, g);
        boites(SYS);
        EMB.texte(g, "Bridge", [461, 240], { taille: 13, coul: n.chemin.indexOf("bridge") >= 0 ? C.encre : "#fff", halo: false });
        var onS = n.bus === "s", onP = n.bus === "p";
        [[240, 452, "AHB or ASB", "System Bus", onS], [452, 676, "APB", "Peripheral Bus", onP]].forEach(function (d) {
          EMB.el("line", { x1: d[0], y1: 380, x2: d[0], y2: 470, stroke: C.encre, "stroke-width": 2 }, g);
          EMB.el("line", { x1: d[1], y1: 380, x2: d[1], y2: 470, stroke: C.encre, "stroke-width": 2 }, g);
          EMB.fleche(g, [d[0] + 2, 420], [d[1] - 2, 420], { ep: 2, double: true, coul: d[4] ? C.acc : C.encre });
          EMB.texte(g, d[2], [(d[0] + d[1]) / 2, 404], { taille: 17, coul: d[4] ? C.acc : C.encre });
          EMB.texte(g, d[3], [(d[0] + d[1]) / 2, 450], { taille: 17, gras: false, coul: d[4] ? C.acc : C.encre });
        });
      } else {
        EMB.fleche(g, [180, 66], [180, 30], { ep: 8, coul: "#c9ccd3", double: false });
        EMB.texte(g, "A[31:0]", [235, 34], { taille: 15, coul: C.ko, mono: true });
        EMB.fleche(g, [580, 40], [580, 66], { ep: 8, coul: "#c9ccd3", double: true });
        EMB.texte(g, "control", [630, 40], { taille: 15, gras: false });
        // bus internes
        var L = function (pts) { EMB.el("polyline", { points: pts, fill: "none", stroke: C.encre, "stroke-width": 3 }, g); };
        L("80,470 80,83 110,83"); L("80,220 110,220");
        EMB.texte(g, "ALU\nbus", [60, 330], { taille: 13, gras: false });
        EMB.fleche(g, [150, 264], [150, 424], { ep: 3 }); EMB.texte(g, "A\nbus", [132, 350], { taille: 13, gras: false });
        EMB.fleche(g, [330, 264], [330, 290], { ep: 3 }); EMB.fleche(g, [310, 324], [310, 352], { ep: 3 }); EMB.fleche(g, [310, 390], [310, 424], { ep: 3 });
        EMB.fleche(g, [400, 264], [400, 512], { ep: 3 }); EMB.texte(g, "B\nbus", [420, 380], { taille: 13, gras: false });
        EMB.fleche(g, [240, 100], [240, 176], { ep: 3 }); EMB.fleche(g, [310, 100], [310, 120], { ep: 3 });
        L("370,135 390,135 390,83 370,83"); L("240,470 240,512");
        EMB.fleche(g, [520, 546], [520, 590], { ep: 6, coul: "#c9ccd3", double: true }); EMB.fleche(g, [225, 546], [225, 590], { ep: 6, coul: "#c9ccd3" });
        EMB.texte(g, "D[31:0]", [380, 584], { taille: 15, mono: true });
        boites(COEUR);
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var T = n.Z[n.mode], z = {}; Object.keys(T).forEach(function (k) { z[k] = EMB.zoneMin(T[k].slice(0, 4)); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le pont", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le Timer et l'Interrupt Controller sont sur le bus des périphériques. Touche le bloc qui relie ce bus au bus système.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "bridge") { n.faux = k; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800); j.erreur("Cherche la frontière entre les deux bus, marquée en bas de la figure : un bloc vertical s'y trouve."); return; }
        fini = true; n.surTouche = null; n.chemin = ["bridge"]; n.dessin();
        j.bravo("Le Bridge relie le System Bus au Peripheral Bus.", [461, 240]);
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("bridge"); });
    } },
    { nom: "Quel bus ?", jouer: function (j, n) {
      j.titre("Comment s'appelle le bus des périphériques, côté Timer ?");
      j.choix([
        { html: "AHB ou ASB", aide: "AHB ou ASB, c'est le System Bus, côté ARM et On-chip RAM." },
        { html: "APB", juste: true },
        { html: "TIC", aide: "Le TIC est un bloc relié à l'External Bus Interface, pas un bus." }
      ], { colonnes: 3, ok: function () {
        n.bus = "p"; n.dessin();
        j.bravo("APB : Peripheral Bus. AHB ou ASB : System Bus.");
        j.suite();
      } });
    } },
    { nom: "AMBA", jouer: function (j, n) {
      n.bus = "s"; n.dessin();
      j.titre("Associe chaque sigle à sa définition.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:center;font-size:16px"><span><i>Advanced Microcontroller Bus Architecture</i></span><span class="trou" data-attendu="amba"></span><span><i>Complete AMBA Design Kit</i></span><span class="trou" data-attendu="adk"></span><span><i>AMBA Compliance Testbench</i></span><span class="trou" data-attendu="act"></span><span><i>ARM\'s AMBA compliant peripherals</i></span><span class="trou" data-attendu="pc"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "act", html: "ACT" }, { id: "pc", html: "PrimeCell" }, { id: "amba", html: "AMBA" }, { id: "adk", html: "ADK" }],
        aide: "Lis les initiales : A-M-B-A, A-D-K (Design Kit), A-C-T (Compliance Testbench). Le seul qui n'est pas un sigle désigne des périphériques.",
        ok: function () {
          j.bravo("AMBA est l'architecture de bus ; ADK, ACT et PrimeCell gravitent autour.");
          j.expliquer("<p>Le système ARM s'organise autour de l'<b>AMBA</b> : un bus système rapide (AHB ou ASB) pour l'ARM, la RAM et l'interface externe, et un bus périphérique (APB) pour le Timer, le Remap/Pause et l'Interrupt Controller, reliés par le Bridge.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le banc de registres", jouer: function (j, n) {
      n.mode = "coeur"; n.chemin = ["bank"]; n.bus = null; n.dessin();
      j.titre("Le banc de registres du cœur ARM : combien de ports de lecture, combien de ports d'écriture, et quel registre est réservé au PC ?");
      j.nombre({ avant: "\\text{lecture},\\ \\text{écriture},\\ R :", cases: [{ attendu: 2, tol: 0 }, { attendu: 1, tol: 0 }, { attendu: 15, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Deux bus sortent du banc vers le bas : A bus et B bus." : k === 1 ? "Un seul bus revient écrire dans le banc : l'ALU bus." : "Le PC est le dernier registre, celui qui porte le plus grand numéro."; },
        ok: function () {
          j.bravo("2 ports de lecture, 1 port d'écriture, R15 = PC.");
          j.expliquer("<p>L'<b>ensemble registres</b> a 2 ports de lecture et 1 port d'écriture ; R15 est réservé pour le <b>PC</b> (compteur de programme, l'adresse de la prochaine instruction). L'<i>incrementer</i> fait avancer cette adresse.</p>");
          j.suite();
        } });
    } },
    { nom: "Suivre R2", jouer: function (j, n) {
      n.chemin = []; n.dessin();
      j.titre("Exemple ajouté : l'instruction ADD R0, R1, R2, LSL #2 calcule R0 = R1 + (R2 décalé de 2 bits). Touche, dans l'ordre, les trois blocs que traverse R2.");
      var ordre = ["bank", "shift", "alu"], k = 0;
      n.surTouche = function (id) {
        if (k >= ordre.length) return;
        if (id !== ordre[k]) { j.erreur(k === 0 ? "R2 est d'abord lu là où sont rangés les registres." : k === 1 ? "Il faut décaler R2 : suis le B bus, quel bloc fait les décalages ?" : "Il reste l'addition : quel bloc fait les opérations arithmétiques ?"); return; }
        n.chemin.push(id); n.dessin(); k++;
        if (k < ordre.length) { j.info("Oui. Ensuite ?"); return; }
        n.surTouche = null;
        j.bravo("Banc de registres, barrel shifter, ALU : le décalage est fait au passage.");
        j.expliquer("<p>Le <b>barrel shifter</b> fait un décalage ou une rotation de la valeur d'entrée ; l'<b>ALU</b> réalise les opérations arithmétiques et logiques ; le résultat revient au banc par l'ALU bus.</p>");
        j.suite();
      };
      j.reponse(function () { while (n.surTouche && k < ordre.length) n.surTouche(ordre[k]); });
    } },
    { nom: "Lire la mémoire", jouer: function (j, n) {
      j.titre("Pour lire une donnée en mémoire, le cœur doit envoyer son adresse sur A[31:0]. Dans quel registre la place-t-il ?");
      j.choix([
        { html: "address register", juste: true },
        { html: "data in register", aide: "Le data in register reçoit la donnée qui arrive de la mémoire par D[31:0]. L'adresse part par le haut." },
        { html: "register bank", aide: "Le banc garde les registres R0 à R15 ; l'adresse vers la mémoire passe par un registre dédié, relié à A[31:0]." }
      ], { colonnes: 1, ok: function () {
        n.chemin = ["areg", "din", "dout", "dec"]; n.dessin();
        j.bravo("L'address register envoie l'adresse ; la donnée revient dans le data in register.");
        j.expliquer("<p><b>Memory address register</b> : registre pour envoyer une adresse vers la mémoire. <b>Memory data in/out registers</b> : registres pour récupérer ou envoyer les données de la mémoire. <b>Instruction decoder and associated control logic</b> : décodage des instructions.</p>");
        j.suite();
      } });
    } }
  ]
});
