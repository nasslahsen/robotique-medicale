/* Boss du chapitre 2 : choisir le cœur d'un holter ECG (architecture mémoire, cycles, composant ARM, famille Cortex, puce AVR, RISC). */
NIVEAU({
  id: "boss-architectures",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "holter", t: 0, fiche: {}, choisi: null, surTouche: null };
    var b = fig.bande("");
    var TAB = [
      ["ATmega6450", "64", "4K", "", "1", "8"], ["ATmega1284P", "128", "16K", "Y", "2", "8"], ["ATmega128", "128", "4K", "", "2", "8"],
      ["ATmega1280", "128", "8K", "", "4", "16"], ["ATmega1281", "128", "8K", "", "2", "8"], ["ATmega2560", "256", "8K", "", "4", "16"], ["ATmega2561", "256", "8K", "", "2", "8"]
    ];
    var COLS = [["Product", 200], ["Flash (KB)", 100], ["RAM (Bytes)", 110], ["picoPower", 100], ["UART/USART", 90], ["A/D 10 bits", 90]];
    n.TAB = TAB;
    function rangee(i) { return [-5, 130 + i * 60, 690, 54]; }
    n.zones = function () { var z = {}; if (n.mode === "table") TAB.forEach(function (r, i) { z[r[0]] = rangee(i); }); return z; };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "holter") {
        // boîtier de holter, trois électrodes et la trace ECG
        EMB.el("rect", { x: 240, y: 300, width: 200, height: 130, rx: 22, fill: "#fff", stroke: C.encre, "stroke-width": 3.5 }, g);
        EMB.el("rect", { x: 262, y: 322, width: 156, height: 60, rx: 6, fill: "#eef3f7", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "HOLTER 24 h", [340, 405], { taille: 15, mono: true, halo: false });
        [[110, 520], [340, 545], [570, 520]].forEach(function (p, i) {
          EMB.el("path", { d: "M" + (290 + i * 50) + " 430 Q" + (290 + i * 50) + " 490 " + p[0] + " " + (p[1] - 18), fill: "none", stroke: ["#e5484d", "#12a26b", "#3b5bdb"][i], "stroke-width": 3 }, g);
          EMB.el("circle", { cx: p[0], cy: p[1], r: 20, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
          EMB.el("circle", { cx: p[0], cy: p[1], r: 7, fill: C.gris }, g);
        });
        var pts = [], t = n.t;
        for (var x = 0; x <= 600; x += 3) {
          var u = ((x + t * 4) % 150) / 150, y = 0;
          if (u > 0.30 && u < 0.34) y = -14; else if (u > 0.40 && u < 0.43) y = 12; else if (u >= 0.43 && u < 0.47) y = -95 * (1 - Math.abs(u - 0.45) / 0.02); else if (u >= 0.47 && u < 0.50) y = 18; else if (u > 0.62 && u < 0.72) y = -22 * Math.sin((u - 0.62) / 0.10 * Math.PI);
          pts.push((40 + x) + "," + (200 + y).toFixed(1));
        }
        EMB.el("polyline", { points: pts.join(" "), fill: "none", stroke: C.acc, "stroke-width": 3.5, "stroke-linejoin": "round" }, g);
      } else {
        var x = -5;
        COLS.forEach(function (c, k) {
          EMB.el("rect", { x: x, y: 74, width: c[1], height: 50, fill: "#2f78c4" }, g);
          EMB.texte(g, c[0], [x + c[1] / 2, 99], { taille: 14, coul: "#fff", halo: false });
          TAB.forEach(function (r, i) {
            var y = rangee(i)[1], on = n.choisi === r[0], ok = on && r[0] === "ATmega1280";
            EMB.el("rect", { x: x, y: y, width: c[1], height: 54, fill: on ? (ok ? "#d6f2e4" : "#fbdcdc") : i % 2 ? "#fdf1dc" : "#fff", stroke: "#d9dde6" }, g);
            EMB.texte(g, r[k], [x + c[1] / 2, y + 28], { taille: 16, gras: k === 0, halo: false, mono: k > 0 });
          });
          x += c[1];
        });
      }
      var f = n.fiche, champ = function (k, v) { return "\\text{" + k + "} : " + (v || "\\,?\\,"); };
      E.k(b, champ("mémoire", f.mem) + " \\quad " + champ("cycles", f.cyc) + " \\quad " + champ("unité", f.unite) + " \\quad " + champ("famille", f.fam) + " \\quad " + champ("AVR", f.puce));
    };
    EMB.toucher(fig.svg, n.zones, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Mémoires", jouer: function (j, n) {
      j.titre("Le holter enregistre l'ECG 24 h. Son processeur doit lire ses instructions et les échantillons sans attendre. Quelle architecture, et pourquoi ?");
      j.consigne("Boss : pas d'indice, chaque erreur compte.");
      j.choix([
        { html: "Von Neumann : une seule mémoire suffit pour tout", aide: "Une seule mémoire, un seul bus de données : instruction et échantillon font la queue." },
        { html: "Harvard : deux mémoires lues en même temps", juste: true },
        { html: "Harvard : parce qu'elle a moins de bus", aide: "Harvard a plus de bus, pas moins : PM et DM ont chacune les leurs." }
      ], { colonnes: 1, ok: function () {
        n.fiche.mem = "\\text{Harvard}"; n.dessin();
        j.bravo("Harvard : instructions et données en parallèle, <i>High Speed</i>.");
        j.suite();
      } });
    } },
    { nom: "Cycles", jouer: function (j, n) {
      j.titre("Pour chaque échantillon, la boucle de filtrage exécute 25 instructions, chacune avec une donnée. Combien de cycles de bus en Von Neumann, puis en Harvard ?");
      j.nombre({ avant: "\\text{VN},\\ \\text{Harvard} :", cases: [{ attendu: 50, tol: 0 }, { attendu: 26, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Un seul bus : deux passages par instruction." : "Deux bus : le premier cycle lit seulement la première instruction, puis tout se recouvre."; },
        ok: function () {
          n.fiche.cyc = "26"; n.dessin();
          j.bravo("50 contre 26.");
          j.suite();
        } });
    } },
    { nom: "Filtrer", jouer: function (j, n) {
      j.titre("Le holter doit filtrer le bruit et extraire les complexes QRS. Quel composant d'un cœur ARM est fait pour cela ?");
      j.choix([
        { html: "MMU", aide: "La MMU gère l'adressage virtuel de la mémoire." },
        { html: "MPU", aide: "La MPU protège la mémoire." },
        { html: "DSP", juste: true },
        { html: "FPU", aide: "La FPU calcule sur les flottants, mais le composant optimisé pour filtrer et extraire des signaux a un autre nom." }
      ], { colonnes: 2, ok: function () {
        n.fiche.unite = "\\text{DSP}"; n.dessin();
        j.bravo("Le DSP : filtrage, extraction de signaux.");
        j.suite();
      } });
    } },
    { nom: "Famille", jouer: function (j, n) {
      j.titre("Il tient 24 h sur une pile, sans système d'exploitation lourd. Quelle famille Cortex ?");
      j.choix([
        { html: "Cortex-A : processeur d'application", aide: "Cortex-A vise la performance maximale et les systèmes comme Linux : trop gourmand pour une pile." },
        { html: "Cortex-M : processeur embarqué", juste: true },
        { html: "ARM7 : ARM classique", aide: "ARM7 est un ancien cœur classique ; la famille embarquée actuelle du cours est une famille Cortex." }
      ], { colonnes: 1, ok: function () {
        n.fiche.fam = "\\text{Cortex-M}"; n.dessin();
        j.bravo("Cortex-M : <i>embedded processor</i>.");
        j.suite();
      } });
    } },
    { nom: "Version 8 bits", jouer: function (j, n) {
      n.mode = "table"; n.choisi = null; n.dessin();
      j.titre("Une version simple sur AVR 8 bits demande au moins 4 UART et 12 canaux A/D. Parmi les puces qui conviennent, prends celle qui a le moins de flash. Touche sa ligne.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.dessin();
        if (k !== "ATmega1280") {
          var r = n.TAB.filter(function (x) { return x[0] === k; })[0];
          j.erreur(+r[4] < 4 || +r[5] < 12 ? k + " : " + r[4] + " UART et " + r[5] + " canaux A/D, il en manque." : k + " convient, mais une autre puce qui convient a moins de flash.");
          return;
        }
        fini = true; n.surTouche = null;
        n.fiche.puce = "\\text{ATmega1280}"; n.dessin();
        j.bravo("ATmega1280 : 4 UART, 16 canaux A/D, 128 KB.");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("ATmega1280"); });
    } },
    { nom: "RISC", jouer: function (j, n) {
      n.mode = "holter"; n.dessin();
      j.titre("ARM comme AVR sont des processeurs RISC. Que peux-tu prévoir du programme du holter ?");
      j.choix([
        { html: "Des instructions d'un cycle, LOAD et STORE séparés, un code plus long", juste: true },
        { html: "Peu d'instructions, chacune sur plusieurs cycles", aide: "Ça, c'est le CISC : <i>multi-clock complex instructions, small code sizes</i>." },
        { html: "Des opérations directement de mémoire à mémoire", aide: "<i>Memory-to-memory</i> est une propriété du CISC. Le RISC travaille de registre à registre." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Fiche complète : Harvard, DSP, Cortex-M, et un ATmega1280 pour la version simple.");
        j.suite();
      } });
    } }
  ]
});
