/* Révision du chapitre 0 : binaire, hexadécimal, valeurs maximales, fronts, fréquence, dans des situations nouvelles. */
NIVEAU({
  id: "revision-bases",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "octet", bits: [0, 0, 0, 0, 0, 0, 0, 0], libre: false, surBit: null, fini: false, compte: false };
    var X0 = 52, W = 72, Y = 220, H = 84;
    n.valeur = function () { return n.bits.reduce(function (s, b) { return s * 2 + b; }, 0); };
    n.regler = function (v) { n.bits = []; for (var k = 7; k >= 0; k--) n.bits.push((v >> k) & 1); };
    var SIG = [1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1];
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "octet") {
        EMB.texte(g, "Oxymètre : SpO2 = 97 %", [340, 100], { taille: 22, coul: C.acc });
        EMB.bits(g, X0, Y, n.bits, { w: W, h: H, indices: [7, 6, 5, 4, 3, 2, 1, 0], taille: 34, marques: n.fini ? { 1: "#c9f0dc", 2: "#c9f0dc", 7: "#c9f0dc" } : {} });
        for (var k = 0; k < 8; k++) EMB.texte(g, String(Math.pow(2, 7 - k)), [X0 + k * W + W / 2, Y + H + 30], { taille: 17, mono: true, coul: n.bits[k] ? C.acc : C.gris });
        EMB.el("rect", { x: 170, y: 440, width: 340, height: 90, rx: 18, fill: n.valeur() === 97 ? "#e3f7ee" : C.fond, stroke: C.pale, "stroke-width": 2 }, g);
        EMB.texte(g, "= " + n.valeur() + "   0x" + EMB.hexa(n.valeur(), 2), [340, 485], { taille: 34, mono: true });
      } else if (n.mode === "table") {
        EMB.texte(g, "Les 16 chiffres hexadécimaux", [340, 100], { taille: 22 });
        for (var d = 0; d < 16; d++) {
          var x = 50 + (d % 4) * 150, y = 140 + Math.floor(d / 4) * 104;
          EMB.bloc(g, x, y, 130, 84, EMB.hexa(d) + "\n" + EMB.binaire(d, 4) + "\n= " + d, { taille: 17, mono: true, fill: d >= 10 ? EMB.teinte(0.1) : "#fff" });
        }
      } else if (n.mode === "max") {
        EMB.texte(g, "Valeurs possibles sur n bits", [340, 100], { taille: 22 });
        [[8, 255], [10, 1023], [12, 4095], [16, null]].forEach(function (r, k) {
          var y = 150 + k * 100;
          EMB.bloc(g, 90, y, 200, 76, r[0] + " bits", { taille: 24, mono: true, fill: C.fond });
          EMB.fleche(g, [300, y + 38], [380, y + 38], { ep: 3 });
          EMB.bloc(g, 390, y, 200, 76, r[1] === null ? (n.fini ? "0 à 65535" : "0 à ?") : "0 à " + r[1], { taille: 24, mono: true, actif: r[1] === null });
        });
      } else if (n.mode === "onde") {
        EMB.texte(g, "Détecteur de pouls : une impulsion par battement", [340, 100], { taille: 20 });
        EMB.onde(g, 60, 190, 40, 150, SIG, { ep: 4 });
        EMB.texte(g, "1", [40, 190], { taille: 16, mono: true, coul: C.doux, halo: false });
        EMB.texte(g, "0", [40, 340], { taille: 16, mono: true, coul: C.doux, halo: false });
        if (n.compte) for (var i = 1; i < SIG.length; i++) if (SIG[i - 1] === 1 && SIG[i] === 0) EMB.fleche(g, [60 + i * 40, 225], [60 + i * 40, 305], { coul: C.acc, ep: 5 });
      } else {
        EMB.texte(g, "Quartz de l'ESP32 pour le Wi-Fi", [340, 100], { taille: 22 });
        EMB.horloge(g, 80, 200, 160, 140, 3, { ep: 4, coul: C.acc });
        EMB.fleche(g, [80, 390], [240, 390], { double: true, ep: 2.5 });
        EMB.texte(g, "T", [160, 418], { taille: 20 });
        EMB.bloc(g, 140, 460, 400, 84, n.fini ? "40 MHz → T = 25 ns" : "40 MHz → T = ?", { taille: 26, mono: true, fill: C.fond });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.libre || n.mode !== "octet") return {};
      var z = {}; n.bits.forEach(function (b, k) { z[k] = [X0 + k * W, Y, W, H]; }); return z;
    }, function (k) { if (!n.libre) return; n.bits[+k] = 1 - n.bits[+k]; n.dessin(); if (n.surBit) n.surBit(); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "SpO2 en binaire", jouer: function (j, n) {
      n.mode = "octet"; n.fini = false; n.regler(0); n.libre = true; n.dessin();
      j.fig.astuce("Touche les bits.");
      j.titre("L'oxymètre envoie la saturation sur un octet. Écris 97.");
      function gagne() {
        if (n.fini) return;
        n.fini = true; n.libre = false; n.surBit = null; n.regler(97); n.dessin();
        j.bravo("97 = 64 + 32 + 1 = 01100001 = 0x61.");
        j.suite();
      }
      n.surBit = function () { if (n.valeur() === 97) gagne(); };
      j.reponse(gagne);
    } },
    { nom: "L'erreur", jouer: function (j, n) {
      n.mode = "table"; n.dessin();
      j.fig.astuce("");
      j.titre("Un camarade a écrit quatre conversions. Une seule est fausse : laquelle ?");
      j.choix([
        { html: "<span class='mono'>0xFF = 255</span>", aide: "\\(15 \\times 16 + 15 = 255\\) : juste." },
        { html: "<span class='mono'>0x10 = 16</span>", aide: "\\(1 \\times 16 + 0 = 16\\) : juste." },
        { html: "<span class='mono'>0x1F = 15</span>", juste: true },
        { html: "<span class='mono'>0x0A = 10</span>", aide: "A vaut 10 : juste." }
      ], { colonnes: 2, ok: function () {
        j.bravo("0x1F = 16 + 15 = 31, pas 15.");
        j.suite();
      } });
    } },
    { nom: "16 bits", jouer: function (j, n) {
      n.mode = "max"; n.fini = false; n.dessin();
      j.titre("Un capteur de pression code sa mesure sur 16 bits. Quelle est la plus grande valeur possible ?");
      j.nombre({ avant: "v_{max} =", cases: [{ attendu: 65535, tol: 0 }], ligne: true,
        aide: function () { return "\\(2^{16} - 1\\), avec \\(2^{16} = 65\\,536\\)."; },
        ok: function () { n.fini = true; n.dessin(); j.bravo("\\(2^{16} - 1 = 65\\,535\\)."); j.suite(); } });
    } },
    { nom: "Compter les fronts", jouer: function (j, n) {
      n.mode = "onde"; n.compte = false; n.dessin();
      j.titre("Le microcontrôleur compte un battement à chaque front descendant. Combien en voit-il sur ce signal ?");
      j.nombre({ avant: "N =", cases: [{ attendu: 3, tol: 0 }], ligne: true,
        aide: function () { return "Un front descendant, c'est un passage du haut vers le bas. Suis le trait de gauche à droite."; },
        ok: function () { n.compte = true; n.dessin(); j.bravo("Trois fronts descendants."); j.suite(); } });
    } },
    { nom: "Période", jouer: function (j, n) {
      n.mode = "horloge"; n.fini = false; n.dessin();
      j.titre("Le quartz qui sert au Wi-Fi et au Bluetooth de l'ESP32 vibre à 40 MHz. Quelle est sa période, en ns ?");
      j.nombre({ avant: "T =", apres: "\\text{ns}", cases: [{ attendu: 25, tol: 0 }], ligne: true,
        aide: function () { return "\\(T = 1/f\\), avec \\(f = 40 \\times 10^6\\) Hz, puis en nanosecondes."; },
        ok: function () { n.fini = true; n.dessin(); j.bravo("\\(T = 1/(40 \\times 10^6) = 25\\) ns."); j.suite(); } });
    } }
  ]
});
