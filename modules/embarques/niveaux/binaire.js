/* Niveau : bits et binaire. Écrire un nombre en touchant les bits, poids, MSB et LSB, conversion, valeur maximale sur n bits. */
NIVEAU({
  id: "binaire",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { nb: 8, bits: [0, 0, 0, 0, 0, 0, 0, 0], libre: false, surBit: null, marques: {}, cible: null };
    var X0 = 52, LARG = 576, Y = 210, H = 84;
    n.valeur = function () { return n.bits.reduce(function (s, b) { return s * 2 + b; }, 0); };
    n.regler = function (v, nb) {
      if (nb) n.nb = nb;
      n.bits = []; for (var k = n.nb - 1; k >= 0; k--) n.bits.push((v >> k) & 1);
    };
    n.zones = function () {
      var w = LARG / n.nb, z = {};
      n.bits.forEach(function (b, k) { z[k] = [X0 + k * w, Y, w, H]; });
      return z;
    };
    n.dessin = function () {
      EMB.vider(g);
      var w = LARG / n.nb, ind = [], marques = {};
      for (var k = 0; k < n.nb; k++) ind.push(n.nb - 1 - k);
      Object.keys(n.marques).forEach(function (k) { marques[k] = n.marques[k]; });
      if (n.cible !== null) EMB.texte(g, "Objectif : " + n.cible, [340, 88], { taille: 22, coul: C.acc });
      EMB.texte(g, "rang du bit", [X0, Y - 42], { taille: 14, coul: C.doux, gras: false, ancre: "start" });
      EMB.bits(g, X0, Y, n.bits, { w: w, h: H, indices: ind, marques: marques, taille: n.nb > 8 ? 24 : 34 });
      // poids sous chaque case
      if (n.nb <= 8) {
        EMB.texte(g, "poids", [X0, Y + H + 64], { taille: 14, coul: C.doux, gras: false, ancre: "start" });
        for (k = 0; k < n.nb; k++) EMB.texte(g, String(Math.pow(2, n.nb - 1 - k)), [X0 + k * w + w / 2, Y + H + 30], { taille: 17, mono: true, coul: n.bits[k] ? C.acc : C.gris });
      }
      EMB.texte(g, "MSB", [X0 + w / 2, Y + H + (n.nb <= 8 ? 100 : 34)], { taille: 16, coul: C.doux });
      EMB.texte(g, "LSB", [X0 + LARG - w / 2, Y + H + (n.nb <= 8 ? 100 : 34)], { taille: 16, coul: C.doux });
      // valeur décimale en direct
      EMB.el("rect", { x: 170, y: 460, width: 340, height: 90, rx: 18, fill: n.cible !== null && n.valeur() === n.cible ? "#e3f7ee" : C.fond, stroke: C.pale, "stroke-width": 2 }, g);
      EMB.texte(g, n.cache ? "= ?" : "= " + n.valeur(), [340, 505], { taille: 40, mono: true });
      if (n.libre) EMB.texte(g, "touche un bit pour le basculer", [340, 150], { taille: 16, coul: C.doux, gras: false });
    };
    EMB.toucher(fig.svg, function () { return n.libre ? n.zones() : {}; }, function (k) {
      if (!n.libre) return;
      n.bits[+k] = 1 - n.bits[+k]; n.dessin();
      if (n.surBit) n.surBit();
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Écrire 37", jouer: function (j, n) {
      n.regler(0, 8); n.cible = 37; n.libre = true; n.dessin();
      j.fig.astuce("Chaque bit à 1 ajoute son poids.");
      j.titre("Le thermomètre envoie la température sur un octet. Allume les bits qui écrivent 37 °C.");
      var fini = false;
      function gagne() {
        if (fini) return;
        fini = true; n.libre = false; n.surBit = null; n.regler(37); n.dessin();
        j.bravo("37 = 32 + 4 + 1, soit 00100101.");
        j.expliquer("<p>Un <b>bit</b> vaut 0 ou 1. Huit bits forment un <b>octet</b>. Le bit de rang \\(k\\) pèse \\(2^k\\) : la valeur est la somme des poids des bits à 1.</p>\\[ 00100101_2 = 2^5 + 2^2 + 2^0 = 37 \\]");
        j.suite();
      }
      n.surBit = function () { if (n.valeur() === 37) gagne(); };
      j.reponse(gagne);
    } },
    { nom: "Le MSB", jouer: function (j, n) {
      n.cible = null; n.regler(37, 8); n.dessin();
      j.fig.astuce("");
      j.titre("Le bit le plus à gauche s'appelle le MSB. Combien pèse-t-il dans un octet ?");
      j.choix([
        { html: "7", aide: "7, c'est son rang. Son poids est \\(2^7\\)." },
        { html: "128", juste: true },
        { html: "255", aide: "255, c'est la somme de tous les poids, quand les huit bits sont à 1." },
        { html: "1", aide: "1, c'est le poids du bit de droite, le LSB." }
      ], { colonnes: 2, ok: function () {
        j.bravo("\\(2^7 = 128\\).");
        j.expliquer("<p><b>MSB</b> (<i>most significant bit</i>) : le bit de poids fort, à gauche. <b>LSB</b> (<i>least significant bit</i>) : le bit de poids faible, à droite, qui pèse 1. Le cours écrit aussi MSb et LSb sur les registres.</p>");
        j.suite();
      } });
    } },
    { nom: "Lire un octet", jouer: function (j, n) {
      n.regler(200, 8); n.cache = true; n.dessin();
      j.titre("Un capteur renvoie l'octet affiché. Quelle valeur en décimal ?");
      j.nombre({ avant: "11001000_2 =", cases: [{ attendu: 200, tol: 0 }], ligne: true,
        aide: function () { return "Additionne seulement les poids des bits à 1 : ceux de rang 7, 6 et 3."; },
        ok: function () {
          n.cache = false; n.dessin();
          j.bravo("128 + 64 + 8 = 200.");
          j.suite();
        } });
    } },
    { nom: "Le plus grand", jouer: function (j, n) {
      n.regler(4095, 12); n.cache = true; n.dessin();
      j.titre("Tous les bits à 1 : quelle est la plus grande valeur sur 8 bits ? Et sur 12 bits ?");
      j.nombre({ avant: "v_{max}\\ (8 \\text{ bits},\\ 12 \\text{ bits}) :", cases: [{ attendu: 255, tol: 0 }, { attendu: 4095, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Sur 8 bits il y a \\(2^8 = 256\\) valeurs, en partant de 0." : "Sur 12 bits il y a \\(2^{12} = 4096\\) valeurs, en partant de 0."; },
        ok: function () {
          n.cache = false; n.dessin();
          j.bravo("255 et 4095.");
          j.expliquer("<p>Avec \\(n\\) bits on écrit \\(2^n\\) valeurs, de 0 à \\(2^n - 1\\). Tu retrouveras 255 dans le DAC 8 bits de l'ESP32 et 4095 dans son ADC 12 bits.</p>\\[ v_{max} = 2^n - 1 \\]");
          j.suite();
        } });
    } },
    { nom: "Associer", jouer: function (j, n) {
      n.regler(1023, 10); n.cache = true; n.dessin();
      j.titre("Associe chaque taille à sa valeur maximale.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:19px"><span>8 bits</span><span class="trou" data-attendu="a"></span><span>10 bits</span><span class="trou" data-attendu="b"></span><span>12 bits</span><span class="trou" data-attendu="c"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "4095" }, { id: "x", html: "1024" }, { id: "a", html: "255" }, { id: "b", html: "1023" }],
        aide: "La valeur maximale est \\(2^n - 1\\) : jamais une puissance de 2 exacte.",
        ok: function () {
          n.cache = false; n.dessin();
          j.bravo("255, 1023, 4095.");
          j.expliquer("<p>Un convertisseur 10 bits (celui des ATmega par exemple) va de 0 à 1023. Chaque bit en plus double le nombre de valeurs.</p>");
          j.suite();
        }
      });
    } }
  ]
});
