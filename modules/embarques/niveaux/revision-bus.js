/* Révision du chapitre 3 : choisir un bus, repérer une erreur de trame UART, l'échange SPI sur un octet nouveau, compter SCL, durée UART. */
NIVEAU({
  id: "revision-bus",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "cas", surTouche: null, choisi: null, montre: false };
    var TRAME = [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1], X0 = 22, PAS = 53;
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "cas") {
        [["A", "Cinq capteurs de température\nsur la même paire de fils,\nchacun avec son adresse"], ["B", "Une carte mémoire rapide\n(plus de 1 Mbit/s), lecture\net écriture simultanées"], ["C", "Un câble vers le PC,\nsans fil d'horloge"]].forEach(function (c, i) {
          var y = 70 + i * 170;
          EMB.bloc(g, 40, y, 600, 140, "", { fill: C.fond, stroke: C.pale });
          EMB.texte(g, c[0], [90, y + 70], { taille: 40, coul: C.acc });
          EMB.texte(g, c[1], [380, y + 70], { taille: 19, gras: false });
        });
      } else if (n.mode === "trame") {
        EMB.texte(g, "trame reçue sur RX", [340, 70], { taille: 19, coul: C.doux });
        TRAME.forEach(function (b, k) {
          var x = X0 + k * PAS, fixe = k === 0 || k === 11, m = n.choisi === k;
          EMB.el("rect", { x: x + 3, y: 110, width: PAS - 6, height: 70, rx: 8, fill: m ? (k === 10 ? "#e3f7ee" : "#fdecec") : fixe ? C.fond : "#fff", stroke: m ? (k === 10 ? C.ok : C.ko) : fixe ? C.pale : C.encre, "stroke-width": 2 }, g);
          EMB.texte(g, String(b), [x + PAS / 2, 145], { taille: 26, mono: true, halo: false, coul: fixe ? C.gris : C.encre });
        });
        EMB.onde(g, X0, 250, PAS, 80, TRAME, { coul: C.acc, ep: 4, fronts: true });
        ["repos", "start", "bit 0", "bit 1", "bit 2", "bit 3", "bit 4", "bit 5", "bit 6", "bit 7", "stop", "repos"].forEach(function (t, k) {
          var x = X0 + k * PAS + PAS / 2;
          EMB.el("text", { x: x, y: 372, transform: "rotate(-55 " + x + " 372)", "text-anchor": "end", "font-size": 15, "font-family": "Inter, sans-serif", fill: C.doux }, g).textContent = t;
        });
        if (n.montre) EMB.texte(g, "FERR = 1 : framing error", [340, 500], { taille: 22, coul: C.ko });
      } else {
        // SPI : registres avant l'échange
        EMB.texte(g, "Maître", [190, 120], { taille: 22 }); EMB.texte(g, "Esclave (dessiné MSB à droite)", [490, 120], { taille: 18 });
        [[60, "11110000", "MSB", "start"], [370, "00110011", "MSB", "end"]].forEach(function (r, i) {
          r[1].split("").forEach(function (b, k) {
            EMB.el("rect", { x: r[0] + k * 32, y: 160, width: 32, height: 50, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
            EMB.texte(g, b, [r[0] + k * 32 + 16, 186], { taille: 24, mono: true, halo: false, coul: i ? C.acc : C.ko });
          });
          EMB.texte(g, "MSB", [i ? r[0] + 256 : r[0], 230], { taille: 15, coul: C.doux, ancre: r[3] });
        });
        EMB.fleche(g, [60, 300], [620, 300], { double: true, coul: C.doux, ep: 2.5 });
        EMB.texte(g, "8 coups d'horloge", [340, 280], { taille: 17, coul: C.doux });
        if (n.montre) {
          EMB.texte(g, "après l'échange", [340, 370], { taille: 18, coul: C.doux });
          "11001100".split("").forEach(function (b, k) { EMB.el("rect", { x: 60 + k * 32, y: 400, width: 32, height: 50, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g); EMB.texte(g, b, [76 + k * 32, 426], { taille: 24, mono: true, halo: false, coul: C.acc }); });
          "00001111".split("").forEach(function (b, k) { EMB.el("rect", { x: 370 + k * 32, y: 400, width: 32, height: 50, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g); EMB.texte(g, b, [386 + k * 32, 426], { taille: 24, mono: true, halo: false, coul: C.ko }); });
        }
      }
    };
    EMB.toucher(fig.svg, function () {
      if (n.mode !== "trame" || !n.surTouche) return {};
      var z = {}; for (var k = 1; k <= 10; k++) z[k] = [X0 + k * PAS, 100, PAS, 280]; return z;
    }, function (k) { if (n.surTouche) n.surTouche(+k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Quel bus ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Choisis le bus de chaque situation.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto auto;gap:10px 14px;align-items:center;font-size:20px;justify-content:start"><b>A</b><span class="trou" data-attendu="i"></span><b>B</b><span class="trou" data-attendu="s"></span><b>C</b><span class="trou" data-attendu="u"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "SPI" }, { id: "u", html: "UART" }, { id: "i", html: "I2C" }],
        aide: "Adresses sur deux fils : I2C. Plus de 1 Mbit/s, écriture et lecture simultanées : SPI. Pas d'horloge : UART.",
        ok: function () { j.bravo("A : I2C, B : SPI, C : UART."); j.suite(); }
      });
    } },
    { nom: "Trame fautive", jouer: function (j, n) {
      n.mode = "trame"; n.dessin();
      j.titre("Cette trame déclenche une erreur au récepteur. Touche le bit fautif.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.dessin();
        if (k !== 10) { j.erreur(k === 1 ? "Le start bit doit être à 0 : il l'est." : "Un bit de données peut valoir 0 ou 1. Cherche le bit dont la valeur est imposée par le protocole."); return; }
        fini = true; n.surTouche = null; n.montre = true; n.dessin();
        j.bravo("Le stop bit vaut 0 au lieu de 1 : erreur de trame (FERR).", [552, 145]);
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche(10); });
    } },
    { nom: "Échange SPI", jouer: function (j, n) {
      n.mode = "spi"; n.montre = false; n.dessin();
      j.titre("Même câblage que dans le cours, avec d'autres octets. Après 8 coups d'horloge, que contient le maître (MSB à gauche) ?");
      j.choix([
        { html: "<span class='mono'>11001100</span>", juste: true },
        { html: "<span class='mono'>00110011</span>", aide: "L'esclave est dessiné à l'envers : son MSB est à droite. Lis son octet de droite à gauche." },
        { html: "<span class='mono'>11110000</span>", aide: "Le maître a envoyé son octet : il ne le garde pas, il reçoit celui de l'esclave." }
      ], { colonnes: 1, ok: function () {
        n.montre = true; n.dessin();
        j.bravo("Le maître reçoit l'octet de l'esclave, 11001100.");
        j.suite();
      } });
    } },
    { nom: "Compter SCL", jouer: function (j, n) {
      j.titre("Un MCU lit trois octets dans un capteur I2C (adresse, puis trois octets de données). Combien d'impulsions sur SCL entre START et STOP ?");
      j.nombre({ avant: "N_{SCL} =", cases: [{ attendu: 36, tol: 0 }], ligne: true,
        aide: function () { return "9 impulsions par octet transmis (8 bits + l'accusé), et il y a 4 octets en comptant l'adresse."; },
        ok: function () { j.bravo("4 × 9 = 36."); j.suite(); } });
    } },
    { nom: "Durée UART", jouer: function (j, n) {
      j.titre("Même trame de 10 bits, mais à 115200 bps. Combien de µs dure-t-elle ?");
      j.nombre({ avant: "t =", apres: "\\mu\\text{s}", cases: [{ attendu: 86.8, tol: 0.1 }], ligne: true,
        aide: function () { return "\\(t = 10 / 115200\\) s ; multiplie par \\(10^6\\) pour avoir des µs."; },
        ok: function () { j.bravo("Environ 86,8 µs : 12 fois plus court qu'à 9600 bps."); j.suite(); } });
    } }
  ]
});
