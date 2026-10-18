/* Niveau : deux cœurs Harvard, DMA et plan d'adressage de l'ESP32 (Section III, diapositives 10, 12 et 13). */
NIVEAU({
  id: "coeurs-memoire",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "coeurs", actif: {}, t: 0, anim: false, cpuLibre: false, surTouche: null, zones: {}, adresse: null, marque: {} };
    // plan d'adressage (diapositive 13) : [début, fin, destination] ; destination null = plage grise
    var PLAN = [
      ["0x0000_0000", "0x3F3F_FFFF", null], ["0x3F40_0000", "0x3F7F_FFFF", "cache"], ["0x3F80_0000", "0x3FBF_FFFF", "cache"],
      ["0x3FC0_0000", "0x3FEF_FFFF", null], ["0x3FF0_0000", "0x3FF7_FFFF", "periph"], ["0x3FF8_0000", "0x3FF8_1FFF", "rtcfast"],
      ["0x3FF8_2000", "0x3FF8_FFFF", null], ["0x3FF9_0000", "0x3FF9_FFFF", "rom"], ["0x3FFA_0000", "0x3FFA_DFFF", null],
      ["0x3FFA_E000", "0x3FFF_FFFF", "sram"], ["0x4000_0000", "0x4005_FFFF", "rom"], ["0x4006_0000", "0x4006_FFFF", null],
      ["0x4007_0000", "0x400B_FFFF", "sram"], ["0x400C_0000", "0x400C_1FFF", "rtcfast"], ["0x400C_2000", "0x40BF_FFFF", "cache"],
      ["0x40C0_0000", "0x4FFF_FFFF", null], ["0x5000_0000", "0x5000_1FFF", "rtcslow"], ["0x5000_2000", "0xFFFF_FFFF", null]
    ];
    var DEST = { cache: [430, 78, 230, 84, "Cache, MMU\nmémoire externe"], periph: [430, 172, 230, 66, "Peripheral"], rtcfast: [430, 248, 230, 66, "RTC FAST Memory"], rom: [430, 324, 230, 66, "Internal ROM"], sram: [430, 400, 230, 66, "Internal SRAM"], rtcslow: [430, 476, 230, 66, "RTC SLOW Memory"] };
    n.PLAN = PLAN;
    function val(h) { return parseInt(h.replace(/0x|_/g, ""), 16); }
    n.cherche = function (h) { var v = val(h); for (var i = 0; i < PLAN.length; i++) if (v >= val(PLAN[i][0]) && v <= val(PLAN[i][1])) return i; return -1; };
    function coeurs() {
      var a = n.actif;
      EMB.bloc(g, 30, 90, 120, 480, "PRO_CPU", { taille: 18, actif: a.pro });
      EMB.bloc(g, 530, 90, 120, 480, "APP_CPU", { taille: 18, actif: a.app });
      var M = { dma: [280, 90, 120, 50, "DMA"], emb: [250, 170, 180, 70, "Embedded\nMemory"], cache: [250, 280, 180, 44, "Cache"], mmu: [250, 360, 180, 44, "MMU"], ext: [250, 440, 180, 70, "External\nMemory"], per: [250, 520, 180, 50, "Peripheral"] };
      Object.keys(M).forEach(function (k) { var b = M[k]; EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: 16, actif: a[k] }); });
      [205, 302, 545].forEach(function (y) { EMB.fleche(g, [150, y], [250, y], { ep: 2.5 }); EMB.fleche(g, [530, y], [430, y], { ep: 2.5 }); });
      EMB.fleche(g, [340, 140], [340, 170], { ep: 2.5 }); EMB.fleche(g, [340, 324], [340, 360], { ep: 2.5, coul: a.cache ? C.acc : C.encre }); EMB.fleche(g, [340, 404], [340, 440], { ep: 2.5, coul: a.mmu ? C.acc : C.encre });
    }
    function dma() {
      var t = n.t;
      EMB.bloc(g, 250, 80, 180, 70, n.cpuLibre ? "CPU\nlibre : calcule le pouls" : "CPU", { taille: 16, actif: n.cpuLibre });
      EMB.bloc(g, 30, 300, 120, 80, "ADC\n(périphérique)", { taille: 16 });
      EMB.el("rect", { x: 200, y: 190, width: 200, height: 330, rx: 10, fill: "#fafbfd", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "DMA_ENGINE", [300, 210], { taille: 16 });
      ["in_link0", "...", "in_linkn"].forEach(function (s, i) { EMB.bloc(g, 225, 240 + i * 42, 150, 38, s, { taille: 15, rx: 4, mono: true }); });
      ["out_link0", "...", "out_linkn"].forEach(function (s, i) { EMB.bloc(g, 225, 385 + i * 42, 150, 38, s, { taille: 15, rx: 4, mono: true }); });
      EMB.el("rect", { x: 440, y: 190, width: 40, height: 330, fill: "#eef0f5", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "AHB_BUS", [460, 355], { taille: 14, halo: false });
      g.lastChild.setAttribute("transform", "rotate(90 460 355)");
      EMB.bloc(g, 520, 190, 130, 330, "RAM\n(SRAM)", { taille: 18 });
      EMB.fleche(g, [150, 330], [225, 290], { ep: 2.5 }); EMB.fleche(g, [375, 290], [440, 290], { ep: 2.5 }); EMB.fleche(g, [480, 290], [520, 290], { ep: 2.5 });
      EMB.fleche(g, [520, 440], [480, 440], { ep: 2.5 }); EMB.fleche(g, [440, 440], [375, 440], { ep: 2.5 }); EMB.fleche(g, [225, 440], [150, 360], { ep: 2.5 });
      EMB.el("line", { x1: 340, y1: 150, x2: 340, y2: 190, stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "5 5" }, g);
      if (n.anim) {
        // un échantillon de l'ADC vers la RAM, sans passer par le CPU
        var chemin = [[150, 330], [225, 290], [375, 290], [460, 290], [585, 290]], u = (t % 1) * (chemin.length - 1), i = Math.floor(u), f = u - i;
        var p = [chemin[i][0] + (chemin[i + 1][0] - chemin[i][0]) * f, chemin[i][1] + (chemin[i + 1][1] - chemin[i][1]) * f];
        EMB.el("circle", { cx: p[0], cy: p[1], r: 11, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
        EMB.texte(g, "échantillons copiés : " + Math.floor(t), [585, 545], { taille: 15, coul: C.doux, gras: false });
      }
    }
    function adresses() {
      var y = 72;
      n.lignes = [];
      PLAN.forEach(function (p, i) {
        var h = p[2] ? 30 : 10, m = n.marque[i];
        EMB.el("rect", { x: 40, y: y, width: 250, height: h, fill: p[2] ? (m ? C.clair : "#fff") : "#c6cbd8", stroke: m ? C.acc : C.encre, "stroke-width": m ? 3 : 1.2 }, g);
        if (p[2]) EMB.texte(g, p[0] + " – " + p[1].slice(2), [165, y + h / 2 + 1], { taille: 13, mono: true, halo: false, gras: false });
        n.lignes.push([y, h]);
        if (m && p[2]) { var d = DEST[p[2]]; EMB.fleche(g, [290, y + h / 2], [430, d[1] + d[3] / 2], { coul: C.acc, ep: 3 }); }
        y += h + 2;
      });
      Object.keys(DEST).forEach(function (k) {
        var d = DEST[k], m = n.marqueDest === k ? "ok" : n.fauxDest === k ? "ko" : null;
        EMB.bloc(g, d[0], d[1], d[2], d[3], d[4], { taille: 17, actif: m === "ok", stroke: m === "ko" ? C.ko : null, ep: m === "ko" ? 4 : null });
        n.zones[k] = [d[0], d[1], d[2], d[3]];
      });
      if (n.adresse) EMB.texte(g, "adresse : " + n.adresse, [545, 572], { taille: 18, mono: true, coul: C.acc });
    }
    n.dessin = function () {
      EMB.vider(g); n.zones = {};
      if (n.mode === "coeurs") coeurs(); else if (n.mode === "dma") dma(); else adresses();
    };
    EMB.toucher(fig.svg, function () { return n.surTouche ? n.zones : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Deux cœurs", jouer: function (j, n) {
      n.actif = { pro: true, app: true }; n.dessin();
      j.fig.astuce("");
      j.titre("L'ESP32 a deux CPU Xtensa LX6. Quelle est leur architecture, d'après la diapositive ?");
      j.choix([
        { html: "Von Neumann : une seule mémoire pour données et instructions", aide: "Le cours précise que chaque CPU est d'architecture Harvard : bus d'instructions et bus de données séparés." },
        { html: "Harvard : bus d'instructions et bus de données séparés", juste: true },
        { html: "CISC : instructions complexes en plusieurs cycles", aide: "CISC ou RISC parle du jeu d'instructions, pas de l'organisation des mémoires." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Deux CPU Harvard.");
        j.expliquer("<p>L'<b>ESP32</b> est un système <i>dual-core</i> à deux CPU Xtensa LX6 d'architecture Harvard (chapitre 2). Toute la mémoire embarquée, la mémoire externe et les périphériques sont sur le bus de données et/ou le bus d'instructions de ces CPU.</p>");
        j.suite();
      } });
    } },
    { nom: "PRO et APP", jouer: function (j, n) {
      j.titre("Que veulent dire les noms des deux CPU ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><span class="mono">PRO_CPU</span><span class="trou" data-attendu="p"></span><span class="mono">APP_CPU</span><span class="trou" data-attendu="a"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "application" }, { id: "r", html: "processeur" }, { id: "p", html: "protocole" }],
        aide: "PRO pour le protocole (la radio), APP pour l'application.",
        ok: function () {
          j.bravo("PRO_CPU : protocole. APP_CPU : application.");
          j.expliquer("<p>Pour la plupart des usages, les deux CPU sont interchangeables : un programme peut tourner sur l'un ou l'autre.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Mémoire externe", jouer: function (j, n) {
      n.actif = { cache: true, mmu: true, ext: true }; n.dessin();
      j.titre("Le CPU lit une donnée en mémoire externe. Remets le chemin dans l'ordre.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:18px"><span>CPU</span><span>→</span><span class="trou" data-attendu="c"></span><span>→</span><span class="trou" data-attendu="m"></span><span>→</span><span class="trou" data-attendu="e"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", html: "MMU" }, { id: "e", html: "External Memory" }, { id: "c", html: "Cache" }],
        aide: "Suis les flèches du schéma, de haut en bas dans la colonne du milieu.",
        ok: function () {
          j.bravo("CPU → Cache → MMU → External Memory.");
          j.expliquer("<p>La MMU (<i>Memory Management Unit</i>, chapitre 2) traduit les adresses vers la mémoire externe ; le cache garde près du CPU ce qu'il vient de lire.</p>");
          j.suite();
        }
      });
    } },
    { nom: "DMA", jouer: function (j, n) {
      n.mode = "dma"; n.anim = false; n.cpuLibre = false; n.t = 0; n.dessin();
      j.titre("Le DMA copie 250 échantillons d'ECG par seconde de l'ADC vers la RAM. Prédis : que fait le CPU pendant ce temps ?");
      j.choix([
        { html: "Il copie chaque échantillon lui-même", aide: "C'est justement le travail que le DMA lui enlève." },
        { html: "Il est libre pour traiter les données", juste: true },
        { html: "Il est arrêté jusqu'à la fin du transfert", aide: "Le transfert passe par le bus AHB, pas par le CPU : rien ne l'oblige à attendre." }
      ], { colonnes: 1, ok: function () {
        n.anim = true; n.cpuLibre = true;
        var h = setInterval(function () { n.t += 0.04; n.dessin(); }, 40); j.nettoyer(function () { clearInterval(h); });
        j.bravo("Le CPU calcule pendant que le DMA copie.");
        j.expliquer("<p>Le <b>DMA</b> (<i>Direct Memory Access</i>) transfère rapidement des données entre périphériques et mémoire, ou de mémoire à mémoire, sans intervention du CPU. Le moteur DMA accède à la SRAM par le bus AHB, avec ses listes <span class=\"mono\">in_link</span> et <span class=\"mono\">out_link</span>.</p>");
        j.suite();
      } });
    } },
    { nom: "Le plan d'adressage", jouer: function (j, n) {
      n.mode = "adresses"; n.marque = {}; n.dessin();
      j.titre("Chaque adresse mène à une mémoire. Touche la destination de l'adresse affichée.");
      var Q = ["0x3FF4_4000", "0x4000_8000", "0x3FFB_0000", "0x5000_0100"], k = 0;
      var cons = j.consigne("");
      function poser() { n.adresse = Q[k]; n.marqueDest = null; n.dessin(); cons.innerHTML = "Adresse " + (k + 1) + " sur " + Q.length + " : <span class=\"mono\">" + Q[k] + "</span>"; }
      poser();
      n.surTouche = function (d) {
        if (k >= Q.length) return;
        var i = n.cherche(Q[k]);
        if (n.PLAN[i][2] === d) {
          n.marque[i] = true; n.marqueDest = d; n.dessin(); k++;
          if (k < Q.length) { j.info("Oui."); setTimeout(poser, 700); return; }
          n.surTouche = null; cons.innerHTML = ""; n.adresse = null; n.dessin();
          j.bravo("Périphériques, ROM interne, SRAM interne, RTC SLOW.");
          j.expliquer("<p>Le plan d'adressage (<i>System Address Mapping</i>) découpe l'espace de 32 bits en plages. Les plages grises ne mènent à aucune mémoire sur le schéma. Une même mémoire peut être vue par deux plages : la ROM interne par 0x3FF9_0000 et par 0x4000_0000.</p>");
          j.suite();
        } else {
          n.fauxDest = d; n.dessin(); setTimeout(function () { n.fauxDest = null; n.dessin(); }, 800);
          j.erreur("Cherche la plage qui contient " + Q[k] + " dans la colonne de gauche : compare d'abord les quatre premiers chiffres.");
        }
      };
      j.reponse(function () { for (var s = 0; s < 6 && n.surTouche; s++) n.surTouche(n.PLAN[n.cherche(Q[k])][2]); });
    } },
    { nom: "Plage grise", jouer: function (j, n) {
      n.surTouche = null;
      j.titre("Un programme bogué lit à l'adresse 0x3FC0_1000. Où tombe-t-il ?");
      j.choix([
        { html: "Dans la SRAM interne", aide: "La SRAM interne commence à 0x3FFA_E000 : 0x3FC0 est plus petit." },
        { html: "Dans une plage grise : aucune mémoire n'y est reliée", juste: true },
        { html: "Dans les périphériques", aide: "Les périphériques commencent à 0x3FF0_0000." }
      ], { colonnes: 1, ok: function () {
        n.marque = {}; n.marque[n.cherche("0x3FC0_1000")] = true; n.dessin();
        j.bravo("0x3FC0_0000 à 0x3FEF_FFFF : plage grise.");
        j.suite();
      } });
    } }
  ]
});
