/* Niveau : ADC de l'ESP32 (Section III, diapositives 20 à 23). Formule ADC_OUT, canaux ADC1 / ADC2 et Wi-Fi, résolution, SAR. */
NIVEAU({
  id: "adc",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var ADC1 = [36, 37, 38, 39, 32, 33, 34, 35], ADC2 = [4, 0, 2, 15, 13, 12, 14, 27, 25, 26];
    var n = { mode: "conv", vin: 1.1, code: null, choisi: null, surTouche: null, sar: 0 };
    function ys(v) { return 520 - v / 3.3 * 400; }
    n.zones = function () {
      var z = {};
      ADC1.forEach(function (p, i) { z["1-" + p] = [60, 140 + i * 40, 260, 38]; });
      ADC2.forEach(function (p, i) { z["2-" + p] = [360, 140 + i * 40, 260, 38]; });
      return z;
    };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "conv" || n.mode === "sar") {
        // échelle de tension
        EMB.el("line", { x1: 120, y1: 120, x2: 120, y2: 520, stroke: C.encre, "stroke-width": 3 }, g);
        [0, 0.825, 1.65, 2.475, 3.3].forEach(function (v) {
          EMB.el("line", { x1: 112, y1: ys(v), x2: 128, y2: ys(v), stroke: C.encre, "stroke-width": 2 }, g);
          EMB.texte(g, EMB.virgule(v) + " V", [104, ys(v)], { taille: 15, ancre: "end", mono: true, gras: false });
        });
        EMB.texte(g, "ADC_IN", [120, 95], { taille: 17 });
        EMB.el("circle", { cx: 120, cy: ys(n.vin), r: 11, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
        EMB.texte(g, EMB.virgule(n.vin, 2) + " V", [146, ys(n.vin)], { taille: 18, ancre: "start", coul: C.acc });
        if (n.mode === "conv") {
          EMB.bloc(g, 260, 270, 160, 100, "SAR ADC\n12 bits", { taille: 19, actif: true });
          EMB.fleche(g, [200, 320], [260, 320], { ep: 3 });
          EMB.fleche(g, [420, 320], [480, 320], { ep: 3 });
          // échelle des codes
          EMB.el("line", { x1: 560, y1: 120, x2: 560, y2: 520, stroke: C.encre, "stroke-width": 3 }, g);
          [0, 1024, 2048, 3072, 4095].forEach(function (c) {
            EMB.el("line", { x1: 552, y1: 520 - c / 4095 * 400, x2: 568, y2: 520 - c / 4095 * 400, stroke: C.encre, "stroke-width": 2 }, g);
            EMB.texte(g, String(c), [580, 520 - c / 4095 * 400], { taille: 15, ancre: "start", mono: true, gras: false });
          });
          EMB.texte(g, "ADC_OUT", [560, 95], { taille: 17 });
          if (n.code !== null) {
            var yc = 520 - n.code / 4095 * 400;
            EMB.el("circle", { cx: 560, cy: yc, r: 11, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
            EMB.texte(g, String(n.code), [520, yc], { taille: 20, ancre: "end", coul: C.acc, mono: true });
            EMB.texte(g, EMB.binaire(n.code, 12), [340, 420], { taille: 20, mono: true });
            EMB.texte(g, "12 bits", [340, 450], { taille: 14, coul: C.doux, gras: false });
          }
        } else {
          // approximations successives : chaque seuil coupe l'intervalle restant en deux
          var bas = 0, haut = 3.3, bits = [];
          for (var k = 0; k < n.sar; k++) {
            var s = (bas + haut) / 2, b = n.vin >= s ? 1 : 0;
            bits.push(b);
            EMB.el("line", { x1: 160, y1: ys(s), x2: 440, y2: ys(s), stroke: C.v, "stroke-width": 2.5, "stroke-dasharray": "8 6" }, g);
            EMB.texte(g, String(k + 1), [452, ys(s)], { taille: 15, coul: C.v });
            EMB.texte(g, (k + 1) + " : " + EMB.virgule(s, 3) + " V → " + b, [490, 150 + k * 44], { taille: 16, ancre: "start", coul: C.v, mono: true });
            if (b) bas = s; else haut = s;
          }
          if (n.sar) EMB.el("rect", { x: 240, y: ys(haut), width: 190, height: ys(bas) - ys(haut), fill: EMB.teinte(0.18), stroke: C.acc, "stroke-width": 2 }, g);
          if (n.sar) EMB.texte(g, "seuil : tension → bit", [490, 112], { taille: 15, ancre: "start", coul: C.doux, gras: false });
          if (n.sar) EMB.texte(g, "bits trouvés : " + bits.join(""), [320, 565], { taille: 20, mono: true });
        }
      } else {
        // table des canaux (diapo 21)
        EMB.el("rect", { x: 470, y: 58, width: 190, height: 40, rx: 20, fill: C.clair, stroke: C.acc, "stroke-width": 2 }, g);
        EMB.texte(g, "Wi-Fi actif", [565, 78], { taille: 17, coul: C.acc, halo: false });
        EMB.texte(g, "ADC1", [190, 120], { taille: 20 }); EMB.texte(g, "ADC2", [490, 120], { taille: 20 });
        [[ADC1, 60, "1"], [ADC2, 360, "2"]].forEach(function (c) {
          c[0].forEach(function (p, i) {
            var id = c[2] + "-" + p, ch = n.choisi === id, ok = c[2] === "1";
            EMB.el("rect", { x: c[1], y: 140 + i * 40, width: 260, height: 36, rx: 8, fill: ch ? (ok ? "#e3f7ee" : "#fdecec") : "#fff", stroke: ch ? (ok ? C.ok : C.ko) : C.pale, "stroke-width": ch ? 3 : 1.5 }, g);
            EMB.texte(g, "ADC" + c[2] + "_CH" + i + "  (GPIO " + p + ")", [c[1] + 130, 158 + i * 40], { taille: 16, mono: true, halo: false });
          });
        });
      }
    };
    EMB.toucher(fig.svg, function () { return n.mode === "canaux" && n.surTouche ? n.zones() : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le capteur", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un capteur de température donne 1,1 V sur une entrée ADC réglée en 12 bits. Quelle valeur ADC_OUT lit le programme ?");
      j.nombre({ avant: "ADC\\_OUT =", cases: [{ attendu: 4095 * 1.1 / 3.3, tol: 1 }], ligne: true,
        aide: function () { return "\\(ADC\\_OUT = 4095 \\times \\dfrac{ADC\\_IN}{3{,}3\\ \\text{V}}\\), et 1,1 V est le tiers de 3,3 V."; },
        ok: function () {
          n.code = Math.round(4095 * 1.1 / 3.3); n.dessin();
          j.bravo("\\(4095 \\times 1{,}1 / 3{,}3 = 1365\\).");
          j.expliquer("<p>En 12 bits, la plage va de 0 à 4095 : \\[ ADC\\_OUT = 4095 \\times \\frac{ADC\\_IN}{3{,}3\\ \\text{V}} \\] 0 V donne 0, 3,3 V donne 4095.</p>");
          j.suite();
        } });
    } },
    { nom: "À l'envers", jouer: function (j, n) {
      j.titre("Le programme lit ADC_OUT = 2730. Quelle tension y a-t-il sur la broche ?");
      j.nombre({ avant: "ADC\\_IN =", apres: "\\text{V}", cases: [{ attendu: 2730 * 3.3 / 4095, tol: 0.01 }], ligne: true,
        aide: function () { return "Isole \\(ADC\\_IN\\) : \\(ADC\\_IN = ADC\\_OUT \\times 3{,}3 / 4095\\)."; },
        ok: function () { n.vin = 2.2; n.code = 2730; n.dessin(); j.bravo("\\(2730 \\times 3{,}3 / 4095 = 2{,}2\\) V."); j.suite(); } });
    } },
    { nom: "Avec le Wi-Fi", jouer: function (j, n) {
      n.mode = "canaux"; n.dessin();
      j.titre("La semelle envoie ses mesures en Wi-Fi. Touche un canal sur lequel tu peux brancher un capteur analogique.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.dessin();
        if (k.charAt(0) === "2") { j.erreur("Les broches de l'ADC2 ne peuvent pas être utilisées quand le Wi-Fi est utilisé."); return; }
        fini = true; n.surTouche = null;
        j.bravo("Un canal de l'ADC1 : GPIO " + k.slice(2) + ".");
        j.expliquer("<p>L'ESP32 intègre deux ADC SAR 12 bits. Note du cours : <b>les broches ADC2 ne peuvent pas être utilisées quand le Wi-Fi est utilisé</b>. Un appareil connecté en Wi-Fi met donc ses capteurs analogiques sur l'ADC1.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("1-34"); });
    } },
    { nom: "10 bits", jouer: function (j, n) {
      n.mode = "conv"; n.vin = 3.3; n.code = null; n.dessin();
      j.titre("On règle l'ADC en 10 bits. Quelle valeur lit-on alors pour 3,3 V, le haut de la plage ?");
      j.nombre({ avant: "ADC\\_OUT_{max} =", cases: [{ attendu: Math.pow(2, 10) - 1, tol: 0 }], ligne: true,
        aide: function () { return "En 12 bits, le maximum est \\(4095 = 2^{12} - 1\\). Fais pareil avec 10."; },
        ok: function () {
          j.bravo("\\(2^{10} - 1 = 1023\\).");
          j.expliquer("<p>La résolution se règle à 12, 11, 10 ou 9 bits. Avec \\(n\\) bits, les codes vont de 0 à \\(2^n - 1\\) : moins de bits, des marches plus grosses, mais une conversion plus courte.</p>");
          j.suite();
        } });
    } },
    { nom: "Approximations", jouer: function (j, n) {
      n.mode = "sar"; n.vin = 1.1; n.sar = 1; n.dessin();
      j.titre("Complément : un ADC SAR compare d'abord ADC_IN au milieu de la plage. Avec 1,1 V, que vaut le premier bit, le MSB ?");
      j.choix([{ html: "0", juste: true }, { html: "1", aide: "Le seuil est 1,65 V. 1,1 V est-il au-dessus ou en dessous ?" }], { colonnes: 2, ok: function () {
        n.sar = 4; n.dessin();
        j.bravo("1,1 V est sous 1,65 V : MSB = 0. Les seuils suivants donnent 1, 0, 1…");
        j.expliquer("<p>SAR veut dire <i>Successive Approximation Register</i>. Le convertisseur cherche le code bit par bit, du MSB au LSB : à chaque étape il compare la tension au milieu de l'intervalle restant, garde la bonne moitié et écrit 1 ou 0. Douze comparaisons donnent les 12 bits.</p>");
        j.suite();
      } });
    } },
    { nom: "La fiche", jouer: function (j, n) {
      n.mode = "conv"; n.vin = 2.2; n.code = 2730; n.dessin();
      j.titre("Complète la fiche de l'ADC de l'ESP32.");
      var z = j.zone("", '<div style="font-size:17px;line-height:2.5">Deux ADC SAR 12 bits, gérés par <span class="trou" data-attendu="5"></span> contrôleurs SAR, jusqu\'à <span class="trou" data-attendu="18"></span> pads analogiques, résolution 12, 11, 10 ou <span class="trou" data-attendu="9"></span> bits.</div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "18", html: "18" }, { id: "8", html: "8" }, { id: "9", html: "9" }, { id: "5", html: "5" }, { id: "16", html: "16" }],
        aide: "Cinq contrôleurs, dix-huit pads, et la plus petite résolution est 9 bits.",
        ok: function () {
          j.bravo("5 contrôleurs, 18 pads, jusqu'à 9 bits.");
          j.expliquer("<p>Les deux ADC échantillonnent et convertissent en même temps. Le DMA n'est disponible que sur un contrôleur, les modes de balayage de plusieurs canaux sur deux, et le fonctionnement en Deep-sleep sur un.</p>");
          j.suite();
        }
      });
    } }
  ]
});
