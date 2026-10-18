(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Un octet : chaque bit a un poids 2^k ---------- */
  (function () {
    var f = R.figure("fig-octet", {
      largeur: 800, hauteur: 400,
      titre: "Un octet : huit bits, chacun avec son poids",
      essai: "<strong>Essaie</strong> : touche les bits pour les basculer et écris 42, puis 150. Choisis ensuite 8, 10 ou 12 bits et mets tout à 1. " +
        "<strong>Observe</strong> : la valeur est la somme des poids des bits à 1. Avec n bits, la plus grande valeur est \\(2^n - 1\\) : 255, 1023, 4095."
    });
    var g = EMB.el("g", null, f.svg);
    var nb = 8, bits = [0, 0, 0, 1, 0, 0, 1, 1];
    var b = R.boutons(f.reglages), bt = {};
    [8, 10, 12].forEach(function (k) { bt[k] = R.bouton(b, k + " bits", function () { taille(k); }); });
    var b2 = R.boutons(f.reglages);
    R.bouton(b2, "Tout à 1", function () { bits = bits.map(function () { return 1; }); dessin(); });
    R.bouton(b2, "Tout à 0", function () { bits = bits.map(function () { return 0; }); dessin(); });
    function taille(k) {
      var v = valeur();
      nb = k; bits = [];
      for (var i = nb - 1; i >= 0; i--) bits.push((v >> i) & 1);
      dessin();
    }
    function valeur() { return bits.reduce(function (s, x) { return s * 2 + x; }, 0); }
    function dessin() {
      EMB.vider(g);
      Object.keys(bt).forEach(function (k) { bt[k].classList.toggle("actif", +k === nb); });
      var w = Math.min(84, 640 / nb), x0 = 450 - nb * w / 2, y = 140, h = 84;
      bits.forEach(function (v, k) {
        var rang = nb - 1 - k, x = x0 + k * w;
        var r = EMB.el("rect", { x: x, y: y, width: w, height: h, fill: v ? EMB.teinte(0.3) : "#fff", stroke: C.encre, "stroke-width": 2, style: "cursor:pointer" }, g);
        EMB.texte(g, String(v), [x + w / 2, y + h / 2 + 2], { taille: 36, mono: true, halo: false });
        EMB.texte(g, String(rang), [x + w / 2, y - 18], { taille: 17, mono: true, coul: C.doux, gras: false });
        EMB.texte(g, String(Math.pow(2, rang)), [x + w / 2, y + h + 28], { taille: nb > 10 ? 16 : 20, mono: true, coul: v ? C.acc : C.gris });
        // zone de toucher : toute la colonne du bit
        var z = EMB.el("rect", { x: x, y: y - 36, width: w, height: h + 76, fill: "transparent", style: "cursor:pointer" }, g);
        z.addEventListener("click", function () { bits[k] = 1 - bits[k]; dessin(); });
        void r;
      });
      EMB.el("rect", { x: x0, y: y, width: nb * w, height: h, fill: "none", stroke: C.encre, "stroke-width": 3.5 }, g);
      EMB.texte(g, "rang", [x0 - 12, y - 18], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
      EMB.texte(g, "poids", [x0 - 12, y + h + 28], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
      EMB.texte(g, "MSB", [x0 + w / 2, y + h + 64], { taille: 18, coul: C.v });
      EMB.texte(g, "LSB", [x0 + nb * w - w / 2, y + h + 64], { taille: 18, coul: C.v });
      var somme = [];
      bits.forEach(function (v, k) { if (v) somme.push(Math.pow(2, nb - 1 - k)); });
      EMB.texte(g, (somme.length ? somme.join(" + ") : "0") + " = " + valeur(), [400, 62], { taille: somme.length > 6 ? 24 : 30, mono: true, coul: C.encre });
      EMB.texte(g, "plus grande valeur sur " + nb + " bits : " + (Math.pow(2, nb) - 1), [400, 362], { taille: 20, coul: C.doux, gras: false });
      R.rendre(f.direct, "\\text{" + bits.join("") + "}_2 = " + valeur() + " \\qquad v_{max} = 2^{" + nb + "} - 1 = " + (Math.pow(2, nb) - 1));
    }
    dessin();
  })();
})();
