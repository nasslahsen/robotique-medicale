/* Niveau : le problème de communication (Section II, diapositives 2 et 3). Bus partagé, nombre de liaisons, intérêt du série, trois bus du cours. */
NIVEAU({
  id: "bus",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "reseau", choisi: null, bon: null, surTouche: null, paires: false };
    var BLOCS = {
      mem: [250, 62, 180, 66, "Memory\n(RAM, EEPROM,…)"],
      mcu1: [16, 150, 170, 80, "Microcontrôleur\nMCU1"],
      mcu2: [494, 150, 170, 80, "Microcontrôleur\nMCU2"],
      adc: [16, 450, 142, 76, "ADC"],
      sens: [184, 450, 142, 76, "Sensors"],
      act: [352, 450, 142, 76, "Actuators"],
      aff: [520, 450, 146, 76, "Display\n(LCD,\nOLED,…)"]
    };
    // zones des bus : le bus 1 est fait de deux bras
    var ZONES = { bus1h: [186, 168, 308, 44], bus1v: [318, 128, 44, 192], bus2: [24, 324, 632, 34], bus3: [60, 360, 560, 84] };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "reseau") {
        var c1 = n.choisi === "bus1" ? (n.bon === "bus1" ? C.ok : C.ko) : C.bleu;
        var c2 = n.choisi === "bus2" ? C.ko : C.bleu, c3 = n.choisi === "bus3" ? C.ko : C.bleu;
        EMB.bus(g, [190, 190], [490, 190], { coul: c1, larg: 26 });
        EMB.bus(g, [340, 130], [340, 334], { coul: c1, larg: 26 });
        EMB.bus(g, [28, 341], [652, 341], { coul: c2, larg: 10 });
        [87, 255, 423, 593].forEach(function (x) { EMB.bus(g, [x, 352], [x, 448], { coul: c3, larg: 12 }); });
        Object.keys(BLOCS).forEach(function (k) { var b = BLOCS[k]; EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: 17, fill: "#eef5ea", coul: "#a3271f" }); });
        EMB.texte(g, "BUS 1", [430, 150], { taille: 18, coul: "#a3271f" });
        EMB.texte(g, "BUS 2", [560, 312], { taille: 18, coul: "#a3271f" });
        EMB.texte(g, "BUS 3", [640, 404], { taille: 18, coul: "#a3271f" });
      } else {
        // sept composants : une liaison par paire, ou un seul bus partagé
        var noms = ["MCU1", "MCU2", "Memory", "ADC", "Sensors", "Actuators", "Display"], pts = [];
        var cx = n.paires === "bus" ? 340 : 340, cy = 300, r = 220;
        noms.forEach(function (t, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / 7; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); });
        if (n.paires === true) for (var i = 0; i < 7; i++) for (var k = i + 1; k < 7; k++) EMB.el("line", { x1: pts[i][0], y1: pts[i][1], x2: pts[k][0], y2: pts[k][1], stroke: C.acc, "stroke-width": 2.5, opacity: 0.75 }, g);
        if (n.paires === "bus") {
          EMB.el("circle", { cx: cx, cy: cy, r: 120, fill: "none", stroke: C.bleu, "stroke-width": 12 }, g);
          pts.forEach(function (p) { var d = [p[0] - cx, p[1] - cy], l = Math.hypot(d[0], d[1]); EMB.el("line", { x1: cx + d[0] / l * 120, y1: cy + d[1] / l * 120, x2: p[0] - d[0] / l * 40, y2: p[1] - d[1] / l * 40, stroke: C.bleu, "stroke-width": 5 }, g); });
          EMB.texte(g, "un bus partagé", [cx, cy], { taille: 20, coul: C.bleu });
        }
        pts.forEach(function (p, i) { EMB.bloc(g, p[0] - 58, p[1] - 26, 116, 52, noms[i], { taille: 16, fill: "#eef5ea" }); });
      }
    };
    EMB.toucher(fig.svg, function () { return n.mode === "reseau" && n.surTouche ? ZONES : {}; }, function (k) { if (n.surTouche) n.surTouche(k.replace(/[hv]$/, "")); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le bon bus", jouer: function (j, n) {
      j.fig.astuce("Touche un bus (les flèches bleues).");
      j.titre("MCU1 lit une valeur dans l'EEPROM, puis l'envoie au MCU2. Touche le bus qu'ils partagent tous les trois.");
      var fini = false, AIDE = { bus2: "Le BUS 2 relie le bloc central aux périphériques du bas (ADC, capteurs…). Regarde ce qui touche MCU1, MCU2 et la mémoire.", bus3: "Les BUS 3 descendent vers un seul périphérique chacun. Regarde plus haut, vers les deux microcontrôleurs." };
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "bus1"; n.dessin();
        if (k !== "bus1") { j.erreur(AIDE[k]); setTimeout(function () { if (!fini) { n.choisi = null; n.dessin(); } }, 900); return; }
        fini = true; n.surTouche = null;
        j.bravo("Le BUS 1 relie MCU1, MCU2 et la mémoire.", [340, 190]);
        j.expliquer("<p>Un <b>bus</b> est un ensemble de lignes partagées par plusieurs composants. Le schéma du cours montre le problème de communication d'un système embarqué : deux microcontrôleurs, une mémoire (RAM, EEPROM), un ADC, des capteurs, des actionneurs et un afficheur (LCD, OLED) doivent échanger des données, par trois niveaux de bus.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("bus1"); });
    } },
    { nom: "Sans bus", jouer: function (j, n) {
      n.mode = "paires"; n.paires = false; n.dessin();
      j.fig.astuce("Les sept composants du schéma.");
      j.titre("Sans bus, il faudrait une liaison pour chaque paire de composants. Combien de liaisons pour ces sept composants ?");
      j.nombre({ avant: "\\text{liaisons} =", cases: [{ attendu: 21, tol: 0 }], ligne: true,
        aide: function () { return "Chaque composant se relie aux 6 autres, et chaque liaison est comptée deux fois : \\(7 \\times 6 / 2\\)."; },
        ok: function () {
          n.paires = true; n.dessin();
          j.bravo("21 liaisons : un vrai plat de spaghettis.");
          var b = E.h("button", "btn clair", "Voir avec un bus", j.el); b.type = "button";
          b.addEventListener("click", function () { n.paires = n.paires === "bus" ? true : "bus"; b.textContent = n.paires === "bus" ? "Voir sans bus" : "Voir avec un bus"; n.dessin(); });
          j.expliquer("<p>Exemple ajouté. Avec \\(N\\) composants reliés deux à deux, il faut \\(N(N-1)/2\\) liaisons. Avec un bus, chaque composant n'a qu'un seul branchement : 7 au lieu de 21. En échange, les composants doivent se partager le bus et respecter un protocole.</p>");
          j.suite();
        } });
    } },
    { nom: "Peu de fils", jouer: function (j, n) {
      n.mode = "reseau"; n.choisi = null; n.dessin();
      j.fig.astuce("");
      j.titre("Le cours dit qu'avec SPI, on transmet 8 bits avec seulement 3 fils. Pourquoi est-ce précieux dans une semelle connectée ?");
      j.choix([
        { html: "Moins de broches et de pistes : la place est comptée", juste: true },
        { html: "Plus de fils voudrait dire moins de données", aide: "Avec 8 fils, on enverrait les 8 bits d'un coup. La question n'est pas la quantité : pense aux ressources limitées d'un système embarqué." },
        { html: "Un bus série ne consomme aucune énergie", aide: "Tout bus consomme un peu. Pense plutôt à l'espace des circuits." }
      ], { colonnes: 1, ok: function () {
        j.bravo("L'espace des circuits est une ressource limitée.");
        j.expliquer("<p>Un bus <b>série</b> envoie les bits l'un après l'autre sur un même fil, au lieu de 8 fils en parallèle. On gagne des broches et de la place sur la carte, ce qui compte dans un système embarqué.</p>");
        j.suite();
      } });
    } },
    { nom: "Trois bus", jouer: function (j, n) {
      j.titre("Le chapitre étudie trois bus. Associe chacun à sa signature.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px 14px;align-items:center;font-size:18px">' +
        '<span>transmission asynchrone, sans horloge</span><span class="trou" data-attendu="u"></span>' +
        '<span>3 fils : MOSI, MISO, SCK</span><span class="trou" data-attendu="s"></span>' +
        '<span>2 fils : SDA, SCL</span><span class="trou" data-attendu="i"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "i", html: "I2C" }, { id: "u", html: "UART" }, { id: "s", html: "SPI" }],
        aide: "UART est le seul sans horloge. SPI a une sortie et une entrée séparées. I2C se contente de deux fils.",
        ok: function () {
          j.bravo("UART, SPI, I2C : la suite du chapitre.");
          j.expliquer("<p>Le plan du cours annonce aussi un cinquième point, le <b>bus CAN</b>, sans diapositive qui le détaille. On le croise ailleurs dans le cours : l'ESP32 a un <i>CAN bus 2.0</i>, et le contrôleur embarqué de la section I a un réseau IVN (CAN, LIN).</p>");
          j.suite();
        }
      });
    } }
  ]
});
