/* Niveau : DAC de l'ESP32 (Section III, diapositives 24 et 25). DACn_OUT = VDD3P3_RTC × PDACn_DAC / 255. */
NIVEAU({
  id: "dac",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { code: 200, vdd: 3.3, mode: "plan", cible: null, libre: false };
    function xc(c) { return 110 + c / 255 * 500; }
    function yv(v) { return 500 - v / 3.3 * 360; }
    n.sortie = function () { return n.vdd * n.code / 255; };
    n.dessin = function () {
      EMB.vider(g);
      EMB.texte(g, "PDACn_DAC = " + n.code, [470, 70], { taille: 20, mono: true });
      EMB.bits(g, 330, 92, EMB.binaire(n.code, 8).split(""), { w: 34, h: 38, taille: 18 });
      if (n.mode === "plan") {
        EMB.el("line", { x1: 110, y1: 500, x2: 630, y2: 500, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("line", { x1: 110, y1: 500, x2: 110, y2: 120, stroke: C.encre, "stroke-width": 2.5 }, g);
        [0, 64, 128, 192, 255].forEach(function (c) { EMB.texte(g, String(c), [xc(c), 522], { taille: 15, mono: true, gras: false }); });
        [0, 1, 2, 3.3].forEach(function (v) { EMB.texte(g, EMB.virgule(v) + " V", [100, yv(v)], { taille: 15, ancre: "end", mono: true, gras: false }); EMB.el("line", { x1: 110, y1: yv(v), x2: 630, y2: yv(v), stroke: "#eef0f5", "stroke-width": 1.5 }, g); });
        EMB.texte(g, "PDACn_DAC", [600, 555], { taille: 16, coul: C.doux });
        EMB.texte(g, "DACn_OUT", [150, 168], { taille: 16, coul: C.doux, ancre: "start" });
        var d = "M" + xc(0) + " " + yv(0);
        for (var c = 0; c <= 255; c++) d += " L" + xc(c) + " " + yv(n.vdd * c / 255) + " L" + xc(c + 1 > 255 ? 255 : c + 1) + " " + yv(n.vdd * c / 255);
        EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 3 }, g);
        if (n.cible !== null) {
          EMB.el("line", { x1: 110, y1: yv(n.cible), x2: 630, y2: yv(n.cible), stroke: C.v, "stroke-width": 2.5, "stroke-dasharray": "8 6" }, g);
          EMB.texte(g, "consigne " + EMB.virgule(n.cible) + " V", [620, yv(n.cible) - 16], { taille: 15, coul: C.v, ancre: "end" });
        }
        var v = n.sortie();
        EMB.el("line", { x1: xc(n.code), y1: 500, x2: xc(n.code), y2: yv(v), stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "4 5" }, g);
        EMB.el("line", { x1: 110, y1: yv(v), x2: xc(n.code), y2: yv(v), stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "4 5" }, g);
        EMB.el("circle", { cx: xc(n.code), cy: yv(v), r: 10, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
        EMB.texte(g, EMB.virgule(v, 3) + " V", [xc(n.code) + 16, yv(v) + 22], { taille: 18, ancre: "start", coul: C.acc });
      } else {
        // générateur de cosinus
        EMB.el("line", { x1: 60, y1: 340, x2: 640, y2: 340, stroke: C.pale, "stroke-width": 2 }, g);
        var p = "";
        for (var x = 0; x <= 580; x += 4) p += (x ? " L" : "M") + (60 + x) + " " + (340 - 120 * Math.cos(x / 580 * 4 * Math.PI));
        EMB.el("path", { d: p, fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
        EMB.texte(g, "CW generator : forme d'onde cosinus", [340, 520], { taille: 18, coul: C.acc });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La formule", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("VDD3P3_RTC = 3,3 V et le programme écrit PDACn_DAC = 200. Quelle tension sort du DAC ?");
      j.nombre({ avant: "DACn\\_OUT =", apres: "\\text{V}", cases: [{ attendu: 3.3 * 200 / 255, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(DACn\\_OUT = VDD3P3\\_RTC \\times PDACn\\_DAC / 255\\)."; },
        ok: function () {
          j.bravo("\\(3{,}3 \\times 200 / 255 \\approx 2{,}588\\) V.", [530, 210]);
          j.expliquer("<p>L'ESP32 a <b>2 canaux DAC 8 bits</b> qui transforment un nombre en tension. Pour chaque canal : \\[ DACn\\_OUT = \\frac{VDD3P3\\_RTC \\times PDACn\\_DAC}{255} \\] La tension de référence vient de la broche VDD3P3_RTC.</p>");
          j.suite();
        } });
    } },
    { nom: "La consigne", jouer: function (j, n) {
      n.cible = 1; n.dessin();
      j.titre("Un module de stimulation attend une consigne de 1 V. Règle PDACn_DAC pour t'en approcher à 0,01 V près.");
      n.libre = true;
      var fini = false;
      function tester(v) {
        if (fini || !n.libre) return;
        n.code = v; n.dessin();
        if (Math.abs(n.sortie() - 1) <= 0.01) {
          fini = true; n.libre = false;
          j.bravo("PDACn_DAC = " + v + " donne " + EMB.virgule(n.sortie(), 3) + " V.");
          j.expliquer("<p>Le nombre exact serait \\(255 \\times 1 / 3{,}3 \\approx 77{,}3\\). Le DAC n'accepte que des entiers de 0 à 255 : on arrondit à 77.</p>");
          j.suite();
        }
      }
      var cur = j.curseur({ nom: "PDACn_DAC", min: 0, max: 255, pas: 1, val: 200, change: tester });
      j.reponse(function () { cur.regler(77); tester(77); });
    } },
    { nom: "Une marche", jouer: function (j, n) {
      j.titre("De combien monte la tension quand PDACn_DAC augmente de 1 ? Réponds en millivolts.");
      j.nombre({ avant: "\\Delta V =", apres: "\\text{mV}", cases: [{ attendu: 3300 / 255, tol: 0.1 }], ligne: true,
        aide: function () { return "Une marche vaut \\(VDD3P3\\_RTC / 255\\). 3,3 V font 3300 mV."; },
        ok: function () { j.bravo("\\(3300 / 255 \\approx 12{,}9\\) mV par pas : la tension ne sort que par marches."); j.suite(); } });
    } },
    { nom: "La référence", jouer: function (j, n) {
      n.cible = null; n.code = 200; n.dessin();
      j.titre("Même nombre, 200, mais VDD3P3_RTC ne vaut plus que 3,0 V. Que donne le DAC ?");
      j.choix([{ html: "2,35 V", juste: true }, { html: "2,59 V", aide: "2,59 V, c'était avec 3,3 V. La référence entre dans la formule." }, { html: "3,0 V", aide: "3,0 V serait la sortie pour 255, pas pour 200." }], { ok: function () {
        n.vdd = 3; n.dessin();
        j.bravo("\\(3{,}0 \\times 200 / 255 \\approx 2{,}35\\) V : la sortie suit la référence.");
        j.suite();
      } });
    } },
    { nom: "Les broches", jouer: function (j, n) {
      n.vdd = 3.3; n.dessin();
      j.titre("Sur quelles broches sortent les deux DAC ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 12px;align-items:center;font-size:19px"><b>DAC1</b><span class="trou" data-attendu="25"></span><b>DAC2</b><span class="trou" data-attendu="26"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "34", html: "GPIO34" }, { id: "26", html: "GPIO26" }, { id: "25", html: "GPIO25" }],
        aide: "GPIO34 est une entrée seulement : elle ne peut pas sortir de tension. Les DAC sont sur 25 et 26.",
        ok: function () { j.bravo("DAC1 sur GPIO25, DAC2 sur GPIO26."); j.suite(); }
      });
    } },
    { nom: "Une onde", jouer: function (j, n) {
      j.titre("Tu veux produire en continu une onde sinusoïdale de test, sans que le programme calcule chaque point. Quelle fonction du DAC utiliser ?");
      j.choix([
        { html: "Le générateur de cosinus (CW generator)", juste: true },
        { html: "La conversion simultanée des deux canaux", aide: "Les deux canaux peuvent convertir en même temps, mais il faut toujours leur donner les valeurs." },
        { html: "La référence VDD3P3_RTC", aide: "La référence fixe l'échelle de tension, pas la forme du signal." }
      ], { colonnes: 1, ok: function () {
        n.mode = "cw"; n.dessin();
        j.bravo("Le CW generator fabrique la forme d'onde en matériel.");
        j.expliquer("<p>Le DAC de l'ESP32 offre : conversion indépendante ou simultanée des canaux, référence de tension VDD3P3_RTC, générateur de cosinus (<i>Cosine waveform</i>, CW) et accès DMA. Sur le schéma du cours, des multiplexeurs choisissent la source de PDACn_DAC : les registres, le générateur CW ou le DMA.</p>");
        j.suite();
      } });
    } }
  ]
});
