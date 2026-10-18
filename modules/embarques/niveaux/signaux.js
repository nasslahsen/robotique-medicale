/* Niveau : signaux logiques et horloge. Niveaux 0 et 1 en tension, fronts montants et descendants, niveaux, période et fréquence, débit, synchrone et asynchrone. */
NIVEAU({
  id: "signaux",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "fronts", niv: [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1], touches: {}, libre: false, surFront: null, ombre: false };
    var X0 = 80, PAS = 40, YH = 170, HAUT = 150;
    n.fronts = function () {
      var f = [];
      for (var k = 1; k < n.niv.length; k++) if (n.niv[k] !== n.niv[k - 1]) f.push({ k: k, montant: n.niv[k] === 1, x: X0 + k * PAS });
      return f;
    };
    function axes(y1, h, t1, t0) {
      EMB.texte(g, t1, [X0 - 14, y1], { taille: 15, mono: true, ancre: "end", coul: C.doux, gras: false });
      EMB.texte(g, t0, [X0 - 14, y1 + h], { taille: 15, mono: true, ancre: "end", coul: C.doux, gras: false });
      EMB.el("line", { x1: X0, y1: y1, x2: X0 + 14 * PAS, y2: y1, stroke: C.pale, "stroke-width": 1.5, "stroke-dasharray": "4 6" }, g);
      EMB.el("line", { x1: X0, y1: y1 + h, x2: X0 + 14 * PAS, y2: y1 + h, stroke: C.pale, "stroke-width": 1.5, "stroke-dasharray": "4 6" }, g);
    }
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "fronts") {
        EMB.texte(g, "Bouton d'appel d'une chambre", [340, 88], { taille: 22 });
        axes(YH, HAUT, "3,3 V  1", "0 V  0");
        if (n.ombre) n.niv.forEach(function (v, k) { if (!v) EMB.el("rect", { x: X0 + k * PAS, y: YH - 10, width: PAS, height: HAUT + 20, fill: EMB.teinte(0.13) }, g); });
        EMB.onde(g, X0, YH, PAS, HAUT, n.niv, { ep: 4, coul: C.encre });
        n.fronts().forEach(function (f) {
          var t = n.touches[f.k];
          if (t === undefined) return;
          var coul = t ? C.ok : C.ko, y = YH + HAUT / 2;
          EMB.fleche(g, [f.x, f.montant ? y + 40 : y - 40], [f.x, f.montant ? y - 40 : y + 40], { coul: coul, ep: 5 });
        });
        EMB.texte(g, "temps", [X0 + 14 * PAS - 20, YH + HAUT + 40], { taille: 15, coul: C.doux, gras: false });
        if (n.legende) {
          EMB.fleche(g, [140, 470], [140, 420], { coul: C.ok, ep: 5 }); EMB.texte(g, "front montant : 0 → 1", [165, 445], { taille: 18, ancre: "start" });
          EMB.fleche(g, [140, 500], [140, 550], { coul: C.acc, ep: 5 }); EMB.texte(g, "front descendant : 1 → 0", [165, 525], { taille: 18, ancre: "start" });
        }
      } else if (n.mode === "horloge") {
        EMB.texte(g, "Horloge : un signal carré régulier", [340, 88], { taille: 22 });
        axes(YH, HAUT, "1", "0");
        EMB.horloge(g, X0, YH, 4 * PAS, HAUT, 3, { ep: 4, coul: C.acc });
        var y = YH + HAUT + 50;
        EMB.fleche(g, [X0, y], [X0 + 4 * PAS, y], { double: true, ep: 2.5 });
        EMB.texte(g, "T (période)", [X0 + 2 * PAS, y + 26], { taille: 18 });
        EMB.bloc(g, 120, 460, 440, 90, n.texteHorloge || "f = 1 / T", { taille: 26, mono: true, fill: C.fond });
      } else if (n.mode === "debit") {
        EMB.texte(g, "Liaison série : un bit après l'autre", [340, 88], { taille: 22 });
        var bits = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1];
        axes(YH, HAUT, "1", "0");
        EMB.onde(g, X0, YH, PAS, HAUT, bits, { ep: 4 });
        bits.forEach(function (b, k) { EMB.texte(g, String(b), [X0 + k * PAS + PAS / 2, YH - 24], { taille: 18, mono: true, coul: C.acc }); });
        var yb = YH + HAUT + 50;
        EMB.fleche(g, [X0 + 2 * PAS, yb], [X0 + 3 * PAS, yb], { double: true, ep: 2.5, tete: 9 });
        EMB.texte(g, "durée d'un bit", [X0 + 2.5 * PAS, yb + 26], { taille: 16 });
        EMB.bloc(g, 120, 460, 440, 90, "durée d'un bit = 1 / débit", { taille: 24, mono: true, fill: C.fond });
      } else {
        // synchrone et asynchrone
        EMB.texte(g, "A", [40, 110], { taille: 30, coul: C.acc });
        EMB.texte(g, "horloge", [X0 + 6, 82], { taille: 15, coul: C.doux, gras: false, ancre: "start" });
        EMB.horloge(g, X0 + 20, 100, PAS, 50, 13, { ep: 3, coul: C.acc });
        EMB.texte(g, "données", [X0 + 6, 182], { taille: 15, coul: C.doux, gras: false, ancre: "start" });
        EMB.onde(g, X0 + 20, 200, PAS, 50, [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0], { ep: 3 });
        EMB.texte(g, "B", [40, 400], { taille: 30, coul: C.acc });
        EMB.texte(g, "données seules", [X0 + 6, 362], { taille: 15, coul: C.doux, gras: false, ancre: "start" });
        EMB.onde(g, X0 + 20, 380, PAS, 50, [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1], { ep: 3 });
        if (n.sync) {
          EMB.texte(g, "synchrone : une horloge partagée", [340, 300], { taille: 18, coul: C.ok });
          EMB.texte(g, "asynchrone : pas d'horloge, débit convenu", [340, 480], { taille: 18, coul: C.ok });
        }
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.libre || n.mode !== "fronts") return {};
      var z = {}; n.fronts().forEach(function (f) { z[f.k] = [f.x - 24, YH - 20, 48, HAUT + 40]; }); return z;
    }, function (k) { if (n.libre && n.surFront) n.surFront(+k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Fronts montants", jouer: function (j, n) {
      n.mode = "fronts"; n.touches = {}; n.legende = false; n.ombre = false; n.libre = true; n.dessin();
      j.fig.astuce("Touche les transitions du signal.");
      j.titre("L'infirmière doit être prévenue quand le patient appuie : à chaque passage de 0 à 1. Touche tous les fronts montants.");
      var montants = n.fronts().filter(function (f) { return f.montant; }).map(function (f) { return f.k; }), fini = false;
      function gagne() {
        if (fini) return;
        fini = true; n.libre = false; n.surFront = null;
        montants.forEach(function (k) { n.touches[k] = true; }); n.dessin();
        j.bravo("Trois fronts montants : trois appuis.");
        j.expliquer("<p>Un signal logique a deux niveaux : <b>haut</b> (1, ici 3,3 V) et <b>bas</b> (0, 0 V). Un <b>front montant</b> est le passage de 0 à 1, un <b>front descendant</b> le passage de 1 à 0.</p>");
        n.legende = true; n.dessin();
        j.suite();
      }
      n.surFront = function (k) {
        if (fini || n.touches[k]) return;
        if (montants.indexOf(k) < 0) {
          n.touches[k] = false; n.dessin();
          setTimeout(function () { if (n.touches[k] === false) { delete n.touches[k]; n.dessin(); } }, 900);
          j.erreur("Ici le signal descend de 1 à 0 : c'est un front descendant.");
          return;
        }
        n.touches[k] = true; n.dessin();
        if (montants.every(function (m) { return n.touches[m]; })) gagne(); else j.info("Oui. Il en reste.");
      };
      j.reponse(gagne);
    } },
    { nom: "Niveau bas", jouer: function (j, n) {
      n.mode = "fronts"; n.ombre = false; n.dessin();
      j.fig.astuce("");
      j.titre("Une interruption « au niveau bas » se déclenche…");
      j.choix([
        { html: "tant que le signal est à 0", juste: true },
        { html: "au passage de 1 à 0", aide: "Le passage de 1 à 0, c'est un front descendant : un instant précis. Un niveau dure." },
        { html: "au passage de 0 à 1", aide: "Ça, c'est un front montant." }
      ], { colonnes: 1, ok: function () {
        n.ombre = true; n.dessin();
        j.bravo("Tout l'intervalle grisé déclenche.");
        j.expliquer("<p>Un <b>front</b> est un instant (la transition), un <b>niveau</b> dure tant que le signal reste à 0 ou à 1. Au chapitre 5, l'ESP32 propose les deux : déclenchement sur front montant, descendant ou les deux, et sur niveau bas ou haut.</p>");
        j.suite();
      } });
    } },
    { nom: "Fréquence", jouer: function (j, n) {
      n.mode = "horloge"; n.texteHorloge = "f = 1 / T"; n.dessin();
      j.titre("L'oscillateur interne de l'ESP32 tourne à 8 MHz. Quelle est sa période, en nanosecondes ?");
      j.nombre({ avant: "T =", apres: "\\text{ns}", cases: [{ attendu: 125, tol: 0 }], ligne: true,
        aide: function () { return "\\(T = 1/f = 1/(8 \\times 10^6)\\) s, puis convertis : 1 s = \\(10^9\\) ns."; },
        ok: function () {
          n.texteHorloge = "8 MHz → T = 125 ns"; n.dessin();
          j.bravo("\\(T = \\dfrac{1}{8 \\times 10^{6}} = 125\\) ns.");
          j.expliquer("<p>Une <b>horloge</b> est un signal carré régulier qui rythme le circuit. Sa <b>période</b> \\(T\\) est la durée d'un motif, sa <b>fréquence</b> \\(f\\) le nombre de motifs par seconde (en Hz, kHz, MHz).</p>\\[ f = \\frac{1}{T} \\]");
          j.suite();
        } });
    } },
    { nom: "Débit", jouer: function (j, n) {
      n.mode = "debit"; n.dessin();
      j.titre("Une liaison envoie 9600 bits par seconde. Combien dure un bit, en microsecondes ?");
      j.nombre({ avant: "t_{bit} =", apres: "\\mu\\text{s}", cases: [{ attendu: 104.17, tol: 0.1 }], ligne: true,
        aide: function () { return "\\(t_{bit} = 1/9600\\) s, puis multiplie par \\(10^6\\) pour des microsecondes."; },
        ok: function () {
          j.bravo("\\(1/9600 \\approx 104{,}2\\ \\mu\\)s.");
          j.expliquer("<p>Le <b>débit</b> se compte en bits par seconde (bps). Chaque bit occupe la ligne pendant \\(1/\\text{débit}\\).</p>\\[ t_{bit} = \\frac{1}{\\text{débit}} \\]");
          j.suite();
        } });
    } },
    { nom: "Avec ou sans horloge", jouer: function (j, n) {
      n.mode = "sync"; n.sync = false; n.dessin();
      j.titre("Deux liaisons. Place le bon mot sous chacune.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:19px"><b>A</b><span class="trou" data-attendu="s"></span><b>B</b><span class="trou" data-attendu="a"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "asynchrone" }, { id: "s", html: "synchrone" }],
        aide: "Synchrone : l'émetteur envoie aussi son horloge sur un fil. Regarde quelle liaison a ce fil.",
        ok: function () {
          n.sync = true; n.dessin();
          j.bravo("A a un fil d'horloge : synchrone. B n'en a pas : asynchrone.");
          j.expliquer("<p>Une liaison <b>synchrone</b> partage une horloge entre émetteur et récepteur (SPI, I2C). Une liaison <b>asynchrone</b> n'en a pas : les deux côtés conviennent du débit à l'avance (UART).</p>");
          j.suite();
        }
      });
    } }
  ]
});
