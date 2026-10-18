/* Révision du chapitre 4 : référence de puce, plan d'adressage, brochage, DMA, horloges, dans des situations nouvelles. */
NIVEAU({
  id: "revision-esp32",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "nom", vu: false, t: 0 };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "nom") {
        var cases = [["ESP32", 120], ["D", 70], ["0", 70], ["WD", 80], ["Q6", 80], ["V3", 80]], x = 340 - (cases.reduce(function (a, c) { return a + c[1]; }, 0) + 50) / 2;
        cases.forEach(function (c, k) {
          EMB.el("rect", { x: x, y: 230, width: c[1], height: 76, rx: 8, fill: k === 0 ? C.acc : n.vu ? C.ok : "#2b2f3a" }, g);
          EMB.texte(g, c[0], [x + c[1] / 2, 268], { taille: 28, mono: true, coul: "#fff", halo: false });
          x += c[1] + 10;
        });
        EMB.texte(g, "Glucomètre connecté : la puce choisie", [340, 160], { taille: 20 });
        if (n.vu) EMB.texte(g, "dual core · pas de flash intégrée · Wi-Fi + Bluetooth\nQFN 6*6 · révision v3.0 ou plus", [340, 380], { taille: 18, gras: false });
      } else if (n.mode === "adresse") {
        var L = [["0x400C_0000", "0x400C_1FFF", "RTC FAST Memory"], ["0x400C_2000", "0x40BF_FFFF", "Cache, mémoire externe"], ["0x4007_0000", "0x400B_FFFF", "Internal SRAM"]];
        EMB.texte(g, "adresse lue : 0x400C_0100", [340, 110], { taille: 22, mono: true, coul: C.acc });
        [L[2], L[0], L[1]].forEach(function (l, i) {
          var y = 180 + i * 110, bon = n.vu && l[2] === "RTC FAST Memory";
          EMB.bloc(g, 40, y, 300, 70, l[0] + "\n" + l[1], { taille: 17, mono: true, actif: bon });
          if (n.vu) { EMB.fleche(g, [340, y + 35], [400, y + 35], { coul: bon ? C.acc : C.gris, ep: bon ? 3.5 : 2 }); EMB.bloc(g, 400, y, 250, 70, l[2], { taille: 17, actif: bon }); }
        });
      } else if (n.mode === "broches") {
        // un bouton d'appel tactile au lit du patient
        EMB.el("rect", { x: 70, y: 200, width: 260, height: 200, rx: 30, fill: C.fond, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("circle", { cx: 200, cy: 300, r: 60, fill: n.vu ? C.acc : "#fff", stroke: C.encre, "stroke-width": 3 }, g);
        EMB.texte(g, "appel", [200, 300], { taille: 22, coul: n.vu ? "#fff" : C.encre, halo: false });
        EMB.texte(g, "électrode tactile", [200, 430], { taille: 17, gras: false });
        EMB.el("line", { x1: 330, y1: 300, x2: 460, y2: 300, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.bloc(g, 460, 230, 170, 140, n.vu ? "ESP32\nGPIO4\n(Touch0)" : "ESP32\nGPIO ?", { taille: 20, actif: n.vu });
      } else if (n.mode === "dma") {
        var octets = Math.min(10000, Math.floor(n.t * 1000));
        EMB.bloc(g, 40, 250, 140, 90, "ADC", { taille: 20 });
        EMB.bloc(g, 260, 250, 140, 90, "DMA", { taille: 20, actif: true });
        EMB.bloc(g, 480, 160, 160, 270, "", {});
        EMB.el("rect", { x: 496, y: 414 - 240 * octets / 10000, width: 128, height: 240 * octets / 10000, fill: EMB.teinte(0.35) }, g);
        EMB.texte(g, "SRAM", [560, 140], { taille: 20 });
        EMB.fleche(g, [180, 295], [260, 295], { ep: 3 }); EMB.fleche(g, [400, 295], [480, 295], { ep: 3 });
        EMB.texte(g, n.vu ? octets + " octets" : "? octets", [560, 470], { taille: 20, mono: true, coul: C.acc });
        EMB.texte(g, "500 échantillons/s · 2 octets chacun", [220, 400], { taille: 17, gras: false });
      } else {
        // horloges
        [["Quartz 40 MHz", 140, true], ["Quartz 26 MHz", 480, false]].forEach(function (q) {
          EMB.el("rect", { x: q[1] - 90, y: 220, width: 180, height: 90, rx: 40, fill: "#e8eaf0", stroke: C.encre, "stroke-width": 3 }, g);
          EMB.texte(g, q[0], [q[1], 265], { taille: 19, halo: false });
          if (n.vu) EMB.texte(g, q[2] ? "Wi-Fi et Bluetooth : oui" : "Wi-Fi et Bluetooth : non", [q[1], 360], { taille: 18, coul: q[2] ? C.ok : C.ko });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Une autre puce", jouer: function (j, n) {
      j.titre("Décode la référence ESP32-D0WDQ6-V3.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><span>D</span><span class="trou" data-attendu="d"></span><span>0</span><span class="trou" data-attendu="z"></span><span>Q6</span><span class="trou" data-attendu="q"></span><span>V3</span><span class="trou" data-attendu="v"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "q", html: "QFN 6*6" }, { id: "z", html: "pas de flash intégrée" }, { id: "s", html: "single core" }, { id: "v", html: "révision v3.0 ou plus" }, { id: "d", html: "dual core" }, { id: "f", html: "2 MB de flash" }],
        aide: "D : comme sur la diapositive 4. Le chiffre 0 dit qu'il n'y a pas de flash dans le boîtier.",
        ok: function () { n.vu = true; n.dessin(); j.bravo("Dual core, sans flash intégrée, QFN 6*6, v3.0 ou plus (puce NRND dans le tableau)."); j.suite(); }
      });
    } },
    { nom: "Une adresse", jouer: function (j, n) {
      n.mode = "adresse"; n.vu = false; n.dessin();
      j.titre("Le programme lit à 0x400C_0100. Quelle mémoire répond ?");
      j.choix([
        { html: "Internal SRAM", aide: "La SRAM interne de ce côté s'arrête à 0x400B_FFFF." },
        { html: "RTC FAST Memory", juste: true },
        { html: "Le cache, vers la flash externe", aide: "Le cache commence à 0x400C_2000 : 0x0100 est plus petit que 0x2000." }
      ], { colonnes: 1, ok: function () { n.vu = true; n.dessin(); j.bravo("0x400C_0000 à 0x400C_1FFF : RTC FAST Memory."); j.suite(); } });
    } },
    { nom: "Un bouton tactile", jouer: function (j, n) {
      n.mode = "broches"; n.vu = false; n.dessin();
      j.titre("Le bouton d'appel du patient est une simple électrode, sans pièce mobile. Sur quelle broche de la carte le brancher ?");
      j.choix([
        { html: "GPIO34 (entrée seule, ADC1_6)", aide: "GPIO34 mesure une tension, mais n'a pas de fonction Touch sur le brochage." },
        { html: "GPIO4 (ADC2_0, Touch0)", juste: true },
        { html: "GPIO1 (TXD0)", aide: "GPIO1 est l'émission de l'UART0, reliée au CP2102." }
      ], { colonnes: 1, ok: function () {
        n.vu = true; n.dessin();
        j.bravo("Touch0 : un capteur tactile capacitif.");
        j.expliquer("<p>L'ESP32 a 10 capteurs tactiles (<i>capacitive sensing GPIOs</i>) : une électrode suffit, le doigt change la capacité mesurée.</p>");
        j.suite();
      } });
    } },
    { nom: "Le DMA compte", jouer: function (j, n) {
      n.mode = "dma"; n.vu = false; n.t = 0; n.dessin();
      j.titre("Exemple ajouté : l'ADC produit 500 échantillons d'ECG par seconde, de 2 octets chacun. Combien d'octets le DMA a-t-il copiés en 10 s ?");
      j.nombre({ avant: "\\text{octets} =", cases: [{ attendu: 10000, tol: 0 }], ligne: true,
        aide: function () { return "500 × 2 octets par seconde, pendant 10 s."; },
        ok: function () {
          n.vu = true;
          var h = setInterval(function () { n.t += 0.25; n.dessin(); if (n.t >= 10) clearInterval(h); }, 40); j.nettoyer(function () { clearInterval(h); });
          j.bravo("10 000 octets, sans un seul cycle du CPU pour les copier.");
          j.suite();
        } });
    } },
    { nom: "Changer de quartz", jouer: function (j, n) {
      n.mode = "quartz"; n.vu = false; n.dessin();
      j.titre("Pour économiser, un fabricant remplace le quartz 40 MHz par un quartz 26 MHz. Le Wi-Fi du thermomètre marchera-t-il encore ?");
      j.choix([
        { html: "Oui : 26 MHz est entre 2 et 60 MHz", aide: "Cette plage vaut sans radio. La diapositive 8 ajoute une condition pour le Wi-Fi et le Bluetooth." },
        { html: "Non : le Wi-Fi et le Bluetooth demandent 40 MHz", juste: true }
      ], { colonnes: 1, ok: function () { n.vu = true; n.dessin(); j.bravo("40 MHz seulement pour le Wi-Fi et le Bluetooth."); j.suite(); } });
    } }
  ]
});
