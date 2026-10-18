/* Boss du chapitre 0 : le registre d'un capteur (exemple ajouté). Hexadécimal vers binaire, champs de bits, valeur 12 bits, tension. */
NIVEAU({
  id: "boss-bases",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { etat: 0, champ: null };
    var VAL = 0xA1F4, X0 = 52, W = 36, Y = 250, H = 64;
    n.dessin = function () {
      EMB.vider(g);
      EMB.texte(g, "Capteur de température d'un incubateur", [340, 92], { taille: 21 });
      EMB.texte(g, "exemple ajouté", [340, 120], { taille: 14, coul: C.doux, gras: false });
      EMB.texte(g, "STATUS = 0x" + EMB.hexa(VAL, 4), [340, 175], { taille: 34, mono: true, coul: C.acc });
      var bits = [], ind = [];
      for (var k = 15; k >= 0; k--) { bits.push(n.etat ? (VAL >> k) & 1 : ""); ind.push(k); }
      var marques = {};
      if (n.etat) {
        marques[0] = n.champ === "pret" ? EMB.teinte(0.35) : EMB.teinte(0.12);
        [1, 2, 3].forEach(function (k) { marques[k] = n.champ === "mode" ? "#e7dcf7" : "#f3eefb"; });
        for (k = 4; k < 16; k++) marques[k] = n.champ === "mesure" ? "#c9f0dc" : "#eaf8f1";
      }
      EMB.bits(g, X0, Y, bits, { w: W, h: H, indices: ind.map(function (i) { return i % 4 === 3 || i === 0 ? i : ""; }), marques: marques, taille: 22 });
      [1, 2, 3].forEach(function (q) { EMB.el("line", { x1: X0 + q * 4 * W, y1: Y - 6, x2: X0 + q * 4 * W, y2: Y + H + 6, stroke: C.encre, "stroke-width": 3.5 }, g); });
      // champs
      function accolade(k0, k1, nom, sous, coul) {
        var xa = X0 + k0 * W + 3, xb = X0 + (k1 + 1) * W - 3, y = Y + H + 14;
        EMB.el("path", { d: "M" + xa + " " + y + " v10 H" + xb + " v-10", fill: "none", stroke: coul, "stroke-width": 3 }, g);
        EMB.texte(g, nom, [(xa + xb) / 2, y + 36], { taille: 17, coul: coul });
        EMB.texte(g, sous, [(xa + xb) / 2, y + 58], { taille: 13, coul: C.doux, gras: false });
      }
      accolade(0, 0, "PRÊT", "bit 15", C.acc);
      accolade(1, 3, "MODE", "bits 14 à 12", C.v);
      accolade(4, 15, "MESURE (12 bits)", "bits 11 à 0", C.ok);
      EMB.bloc(g, 70, 460, 540, 96, "MESURE : 0 à 4095 pour 0 à 3,3 V\nPRÊT = 1 : mesure disponible", { taille: 19, fill: C.fond });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Déplier", jouer: function (j, n) {
      n.etat = 0; n.champ = null; n.dessin();
      j.fig.astuce("");
      j.titre("Le capteur renvoie STATUS = 0xA1F4. Écris ses 16 bits, quartet par quartet, de gauche à droite.");
      var z = j.zone("", '<p style="display:flex;gap:8px;flex-wrap:wrap;font-family:JetBrains Mono,monospace;font-size:20px"><span class="trou" data-attendu="a"></span><span class="trou" data-attendu="1"></span><span class="trou" data-attendu="f"></span><span class="trou" data-attendu="4"></span></p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "f", html: "1111" }, { id: "x", html: "1110" }, { id: "4", html: "0100" }, { id: "a", html: "1010" }, { id: "y", html: "0010" }, { id: "1", html: "0001" }],
        aide: "Un chiffre par quartet : A = 10 = 8 + 2, 1, F = 15, 4.",
        ok: function () { n.etat = 1; n.dessin(); j.bravo("1010 0001 1111 0100."); j.suite(); }
      });
    } },
    { nom: "Prête ?", jouer: function (j, n) {
      n.champ = "pret"; n.dessin();
      j.titre("La mesure est-elle disponible ?");
      j.choix([
        { html: "Oui : le bit 15 vaut 1", juste: true },
        { html: "Non : le bit 15 vaut 0", aide: "Le bit 15 est le MSB, la case la plus à gauche. A = 1010 commence par 1." },
        { html: "On ne peut pas savoir sans convertir tout le registre en décimal", aide: "Un champ se lit seul : il suffit de regarder ses bits." }
      ], { colonnes: 1, ok: function () { j.bravo("PRÊT = 1."); j.suite(); } });
    } },
    { nom: "Mode", jouer: function (j, n) {
      n.champ = "mode"; n.dessin();
      j.titre("Quelle valeur contient le champ MODE ?");
      j.nombre({ avant: "\\text{MODE} =", cases: [{ attendu: 2, tol: 0 }], ligne: true,
        aide: function () { return "Les bits 14 à 12 sont les trois cases après le bit 15 : 010."; },
        ok: function () { j.bravo("010 = 2."); j.suite(); } });
    } },
    { nom: "Mesure", jouer: function (j, n) {
      n.champ = "mesure"; n.dessin();
      j.titre("Quelle valeur brute contient le champ MESURE ?");
      j.nombre({ avant: "\\text{MESURE} =", cases: [{ attendu: 500, tol: 0 }], ligne: true,
        aide: function () { return "Les 12 bits de droite s'écrivent 0x1F4 : \\(1 \\times 256 + 15 \\times 16 + 4\\)."; },
        ok: function () { j.bravo("0x1F4 = 256 + 240 + 4 = 500."); j.suite(); } });
    } },
    { nom: "Tension", jouer: function (j, n) {
      j.titre("4095 correspond à 3,3 V. Quelle tension a mesurée le capteur ?");
      j.nombre({ avant: "U =", apres: "\\text{V}", cases: [{ attendu: 500 * 3.3 / 4095, tol: 0.005 }], ligne: true,
        aide: function () { return "Règle de trois : \\(U = 500 \\times 3{,}3 / 4095\\)."; },
        ok: function () {
          j.bravo("\\(U = \\dfrac{500 \\times 3{,}3}{4095} \\approx 0{,}403\\) V.");
          j.expliquer("<p>Hexadécimal pour lire vite, binaire pour découper les champs, décimal pour calculer : c'est tout le chemin d'une donnée de capteur. Tu retrouveras cette règle de trois avec l'ADC de l'ESP32 au chapitre 5.</p>");
          j.suite();
        } });
    } }
  ]
});
