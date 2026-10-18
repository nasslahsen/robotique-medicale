/* Niveau : l'ESP32 et sa nomenclature (Section III, diapositives 3 et 4). Plage de température, ESP-IDF, décoder une référence, choisir une puce. */
NIVEAU({
  id: "esp32",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "thermo", lieux: [], verdict: {}, code: [], trouve: {}, faux: null, surTouche: null, zones: {} };
    var ty = function (t) { return 570 - (t + 60) * 460 / 210; };
    n.dessin = function () {
      EMB.vider(g); n.zones = {};
      if (n.mode === "thermo") {
        // thermomètre : la plage de fonctionnement de l'ESP32
        EMB.el("rect", { x: 120, y: 86, width: 60, height: 506, rx: 30, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("rect", { x: 128, y: ty(125), width: 44, height: ty(-40) - ty(125), rx: 8, fill: EMB.teinte(0.25), stroke: C.acc, "stroke-width": 2.5 }, g);
        for (var t = -60; t <= 150; t += 30) {
          EMB.el("line", { x1: 180, y1: ty(t), x2: 194, y2: ty(t), stroke: C.encre, "stroke-width": 2 }, g);
          EMB.texte(g, EMB.virgule(t) + " °C", [100, ty(t)], { taille: 15, ancre: "end", gras: false, mono: true });
        }
        EMB.texte(g, "+125 °C", [150, ty(125) - 18], { taille: 16, coul: C.acc });
        EMB.texte(g, "−40 °C", [150, ty(-40) + 20], { taille: 16, coul: C.acc });
        n.lieux.forEach(function (l, i) {
          var y = ty(l.t), v = n.verdict[l.id], coul = v === undefined ? C.encre : v ? C.ok : C.ko;
          EMB.el("line", { x1: 194, y1: y, x2: 250, y2: y, stroke: coul, "stroke-width": 2.5, "stroke-dasharray": "5 4" }, g);
          EMB.el("circle", { cx: 194, cy: y, r: 6, fill: coul }, g);
          EMB.bloc(g, 255, y - 26, 390, 52, l.nom + " : " + EMB.virgule(l.t) + " °C", { taille: 17, stroke: coul, ep: v === undefined ? 2 : 3, fill: v === undefined ? "#fff" : v ? "#e3f7ee" : "#fdecec" });
        });
      } else {
        // nomenclature : une case par champ, puis la liste des champs trouvés
        var x = 20, y = 96, h = 64, larg = n.code.map(function (c) { return c[0].length > 3 ? 110 : 66; });
        var total = larg.reduce(function (a, b) { return a + b; }, 0) + 10 * (n.code.length - 1);
        x = 340 - total / 2;
        n.code.forEach(function (c, k) {
          var w = larg[k], tr = n.trouve[k], fx = n.faux === k;
          EMB.el("rect", { x: x, y: y, width: w, height: h, rx: 8, fill: k === 0 ? C.acc : fx ? C.ko : tr ? C.ok : "#2b2f3a" }, g);
          EMB.texte(g, c[0], [x + w / 2, y + h / 2], { taille: k === 0 ? 24 : 26, coul: "#fff", halo: false, mono: true });
          n.zones[k] = EMB.zoneMin([x, y, w, h], 56);
          c.x = x + w / 2;
          x += w + 10;
        });
        var rang = 0;
        n.code.forEach(function (c, k) {
          if (!n.trouve[k]) return;
          var yy = 206 + rang * 52; rang++;
          EMB.el("line", { x1: c.x, y1: y + h, x2: c.x, y2: y + h + 12, stroke: C.ok, "stroke-width": 3 }, g);
          EMB.el("rect", { x: 30, y: yy, width: 82, height: 42, rx: 8, fill: k === 0 ? C.acc : C.ok }, g);
          EMB.texte(g, c[0], [71, yy + 21], { taille: 19, coul: "#fff", halo: false, mono: true });
          EMB.texte(g, c[1], [130, yy + 21], { taille: 18, ancre: "start", gras: false });
        });
      }
    };
    EMB.toucher(fig.svg, function () { return n.surTouche ? n.zones : {}; }, function (k) { if (n.surTouche) n.surTouche(+k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Plage de température", jouer: function (j, n) {
      n.mode = "thermo";
      n.lieux = [{ id: "a", nom: "Autoclave de stérilisation", t: 134 }, { id: "b", nom: "Chambre d'hôpital", t: 22 }, { id: "c", nom: "Congélateur de laboratoire", t: -30 }];
      n.dessin();
      j.fig.astuce("La bande colorée : la plage de fonctionnement de l'ESP32.");
      j.titre("On veut poser un capteur à ESP32 dans trois endroits. Lequel est hors de sa plage de fonctionnement ?");
      j.choix([
        { html: "Le congélateur de laboratoire (−30 °C)", aide: "−30 °C est au-dessus de −40 °C : c'est dans la bande." },
        { html: "La chambre d'hôpital (22 °C)", aide: "22 °C est au milieu de la bande." },
        { html: "L'autoclave de stérilisation (134 °C)", juste: true }
      ], { colonnes: 1, ok: function () {
        n.verdict = { a: false, b: true, c: true }; n.dessin();
        j.bravo("134 °C dépasse +125 °C.");
        j.expliquer("<p>L'<b>ESP32</b> d'Espressif est un MCU riche en fonctions avec Wi-Fi et Bluetooth intégrés. Il fonctionne de façon fiable en milieu industriel, de −40 °C à +125 °C.</p>");
        j.suite();
      } });
    } },
    { nom: "ESP-IDF", jouer: function (j, n) {
      j.titre("Pour programmer l'ESP32, Espressif fournit ESP-IDF. Qu'est-ce que c'est ?");
      j.choix([
        { html: "Un module radio à souder sur la carte", aide: "Les modules, ce sont les ESP32-S2-WROOM ou WROVER des photos. IDF est un outil logiciel." },
        { html: "Le framework officiel de développement IoT d'Espressif", juste: true },
        { html: "Un bus de communication entre deux ESP32", aide: "Les bus (UART, SPI, I2C) sont au chapitre 3. IDF veut dire IoT Development Framework." }
      ], { colonnes: 1, ok: function () {
        j.bravo("<i>IoT Development Framework</i>.");
        j.expliquer("<p><b>ESP-IDF</b> est le <i>IoT Development Framework</i> officiel d'Espressif, pour les séries de SoC ESP32, ESP32-S, ESP32-C et ESP32-H.</p>");
        j.suite();
      } });
    } },
    { nom: "Lire le nom", jouer: function (j, n) {
      n.mode = "nom"; n.trouve = { 0: true }; n.faux = null;
      n.code = [["ESP32", "série de la puce"], ["D", "cœur : D ou U dual core, S single core"], ["0", "flash intégrée : 0 aucune, 2 : 2 MB, 4 : 4 MB"], ["WD", "Wi-Fi b/g/n + Bluetooth/Bluetooth LE dual mode"], ["R2", "PSRAM intégrée : 2 MB"], ["H", "haute température"], ["Q6", "boîtier : Q6 = QFN 6*6, rien = QFN 5*5"], ["V3", "révision de la puce v3.0 ou plus récente"]];
      n.dessin();
      j.fig.astuce("Touche une case du nom.");
      j.titre("Chaque lettre du nom dit quelque chose. Touche la case qui répond.");
      var Q = [[1, "Combien de cœurs ?"], [4, "Y a-t-il de la PSRAM dans le boîtier ?"], [6, "Quel boîtier ?"], [3, "Quelle connexion sans fil ?"]], k = 0;
      var cons = j.consigne("");
      function poser() { cons.innerHTML = "Question " + (k + 1) + " sur " + Q.length + " : " + Q[k][1]; }
      poser();
      n.surTouche = function (c) {
        if (k >= Q.length) return;
        if (c === Q[k][0]) {
          n.trouve[c] = true; n.faux = null; n.dessin(); k++;
          if (k < Q.length) { j.info("Oui. Suivante."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          Object.keys(n.code).forEach(function (i) { n.trouve[i] = true; }); n.dessin();
          j.bravo("Le nom se lit champ par champ.");
          j.expliquer("<p>Nomenclature de la diapositive 4 : ESP32 D 0 WD R2 H Q6 V3. Un champ absent prend la valeur par défaut : pas de Q6 veut dire QFN 5*5.</p>");
          j.suite();
        } else if (c !== 0) {
          n.faux = c; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800);
          j.erreur("Cette case, c'est : " + n.code[c][1] + ".");
        }
      };
      j.reponse(function () { for (var s = 0; s < 6 && n.surTouche; s++) n.surTouche(Q[k][0]); });
    } },
    { nom: "Décoder", jouer: function (j, n) {
      n.surTouche = null;
      n.code = [["ESP32", "série de la puce"], ["U", "?"], ["4", "?"], ["WD", "?"], ["H", "?"]]; n.trouve = { 0: true }; n.dessin();
      j.fig.astuce("");
      j.titre("Décode la référence ESP32-U4WDH.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><span>U</span><span class="trou" data-attendu="d"></span><span>4</span><span class="trou" data-attendu="f"></span><span>H</span><span class="trou" data-attendu="h"></span><span>boîtier</span><span class="trou" data-attendu="q"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "single core" }, { id: "d", html: "dual core" }, { id: "f", html: "4 MB de flash" }, { id: "p", html: "4 MB de PSRAM" }, { id: "h", html: "haute température" }, { id: "q", html: "QFN 5*5" }, { id: "q6", html: "QFN 6*6" }],
        aide: "U est rangé avec D. Le chiffre après la lettre du cœur parle de flash. Pas de Q6 : boîtier par défaut.",
        ok: function () {
          n.code = [["ESP32", "série de la puce"], ["U", "dual core"], ["4", "4 MB de flash dans le boîtier"], ["WD", "Wi-Fi + Bluetooth/BLE dual mode"], ["H", "haute température"]];
          n.trouve = { 0: true, 1: true, 2: true, 3: true, 4: true }; n.dessin();
          j.bravo("Dual core, 4 MB de flash, haute température, QFN 5*5.");
          j.expliquer("<p>C'est bien la ligne ESP32-U4WDH du tableau de la diapositive 4 : <i>dual core</i>, révision v3.0/v3.1, 4 MB de flash, QFN 5*5, VDD_SDIO 3,3 V.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Choisir la puce", jouer: function (j, n) {
      j.titre("Un patch ECG Bluetooth doit garder des signaux en mémoire : il faut 2 MB de PSRAM dans le boîtier. Quelle puce du tableau ?");
      j.choix([
        { html: "ESP32-D0WD-V3", aide: "Rien après WD : ni R2 ni chiffre de flash. Pas de PSRAM." },
        { html: "ESP32-D0WDRH2-V3", juste: true },
        { html: "ESP32-S0WD", aide: "S : un seul cœur, et pas de R2 : pas de PSRAM." },
        { html: "ESP32-D0WDQ6-V3", aide: "Q6 parle du boîtier (QFN 6*6), pas de mémoire." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Le R2 : 2 MB de PSRAM.");
        j.expliquer("<p>Dans le tableau, l'ESP32-D0WDR2-V3 (2 MB de PSRAM) est en fin de vie (EOL) et remplacé par l'ESP32-D0WDRH2-V3 : dans ce nom réel, le H (haute température) se glisse entre le R et le 2. Les puces marquées NRND sont déconseillées pour un nouveau produit.</p>");
        j.suite();
      } });
    } }
  ]
});
