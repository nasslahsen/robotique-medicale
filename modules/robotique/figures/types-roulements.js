(function () {
  "use strict";
  var R = RM, C = R.C;

  // Fiches du cours. d : dessin [type MECA, nombre de rangées, miroir] ; v : vitesse ; ax : charge axiale ; dev : désalignement ; pl : encombrement
  // Valeurs des filtres : 1 = le cours l'indique, 0 = le cours l'exclut, null = le cours ne le précise pas.
  var T = [
    { id: "rigide", nom: "Une rangée de billes, contact radial", d: [["billes"]], dev: "2' à 10'",
      l: ["charges radiales et axiales relativement importantes", "bonne coaxialité des portées de l'arbre et des alésages", "type de roulement très employé", "variantes : rainure et segment d'arrêt, flasques, joints (lubrification à vie)"], f: { ax: 1, v: null, dv: 0, pl: null } },
    { id: "oblique1", nom: "Une rangée de billes, contact oblique", d: [["oblique"]], dev: "≈ 0",
      l: ["charges axiales élevées dans un seul sens, ou combinées", "en général non démontables", "grandes fréquences de rotation", "bonne coaxialité des portées"], f: { ax: 1, v: 1, dv: 0, pl: null } },
    { id: "oblique2", nom: "Deux rangées de billes, contact oblique", d: [["oblique", 2, true]], dev: "≈ 0",
      l: ["charges radiales assez importantes", "charges axiales alternées", "fréquences plus faibles qu'avec une rangée", "très bonne coaxialité des portées"], f: { ax: 1, v: 0, dv: 0, pl: null } },
    { id: "rotuleB", nom: "Deux rangées de billes, à rotule", d: [["rotule", 2]], dev: "1,5° à 3°",
      l: ["charges radiales moyennes, axiales faibles", "grandes fréquences de rotation", "quand l'alignement précis des paliers est difficile"], f: { ax: 1, v: 1, dv: 1, pl: null } },
    { id: "cylindriques", nom: "Rouleaux cylindriques", d: [["rouleaux"]], dev: "2'",
      l: ["charges radiales élevées, aucune charge axiale", "grandes fréquences de rotation", "très bonne coaxialité des portées", "bague séparable"], f: { ax: 0, v: 1, dv: 0, pl: null } },
    { id: "rotuleR", nom: "Deux rangées de rouleaux, à rotule", d: [["rouleaux", 2]], dev: "1° à 2,5°",
      l: ["charges radiales très importantes, radiales et axiales combinées", "fréquences de rotation moyennes", "quand l'alignement des paliers est difficile"], f: { ax: 1, v: 0, dv: 1, pl: null } },
    { id: "coniques", nom: "Rouleaux coniques", d: [["conique"]], dev: "2'",
      l: ["charges radiales et axiales relativement importantes", "ne conviennent pas pour les grandes fréquences", "très bonne coaxialité ; cuvette séparable", "montés par paire, en opposition ; réglage du jeu", "paliers de grandes et moyennes dimensions, mécanismes précis fortement sollicités"], f: { ax: 1, v: 0, dv: 0, pl: null } },
    { id: "aiguilles", nom: "Roulements à aiguilles", d: [["aiguilles"]], dev: "≈ 0 (auto-alignement : 3° max)",
      l: ["charges radiales importantes sous encombrement réduit", "aucune charge axiale ; résistent bien aux chocs", "grandes fréquences ; très bonne coaxialité", "léger déplacement axial ; bague intérieure séparable", "sans bague : surfaces HRC min. 57, Ra max. 0,2"], f: { ax: 0, v: 1, dv: 1, pl: 1 } },
    { id: "butee1", nom: "Butée à billes, simple effet", d: [["butee"]], dev: "non précisé",
      l: ["charges axiales relativement importantes", "dans un seul sens", "bagues séparables", "vitesses moins élevées que les radiaux"], f: { ax: 1, v: 0, dv: null, pl: null } },
    { id: "butee2", nom: "Butée à billes, double effet", d: [["butee", 2, true]], dev: "non précisé",
      l: ["charges axiales alternées", "bagues séparables", "vitesses moins élevées que les radiaux"], f: { ax: 1, v: 0, dv: null, pl: null } },
    { id: "combine", nom: "Combinés aiguilles et billes", d: [["aiguilles"], ["butee"]], dev: "non précisé",
      l: ["paliers fixes, charges axiales et radiales", "radiales : par les aiguilles ; axiales : par les billes", "types NX, NKX, NKIA (simple effet), NKIB (double effet)", "encombrement très réduit"], f: { ax: 1, v: null, dv: null, pl: 1 } }
  ];
  var FILTRES = [["ax", "Il y a une charge axiale"], ["v", "Grandes vitesses"], ["dv", "Paliers mal alignés"], ["pl", "Peu de place radiale"]];

  var f = R.figure("fig-types", {
    largeur: 960, hauteur: 600,
    titre: "Comparateur de roulements",
    essai: "<strong>Essaie</strong> : coche les besoins de ton axe, puis touche un roulement de la liste pour voir sa fiche. " +
      "<strong>Observe</strong> : en vert, ce que le cours indique comme adapté ; en gris, ce qu'il exclut ou ne précise pas. Le désalignement admissible se lit en minutes (') ou en degrés (°)."
  });
  var g = R.el("g", null, f.svg), choisi = "rigide", besoins = {};
  FILTRES.forEach(function (x) { R.bascule(f.reglages, x[1], false, function (e) { besoins[x[0]] = e.target.checked; dessiner(); }); });
  var zone = R.h("p", null, "", f.direct);
  function ok(t) { return FILTRES.every(function (x) { return !besoins[x[0]] || t.f[x[0]] === 1; }); }
  function raison(t) {
    var r = [];
    FILTRES.forEach(function (x) { if (besoins[x[0]] && t.f[x[0]] !== 1) r.push(x[1].toLowerCase() + " : " + (t.f[x[0]] === 0 ? "exclu par le cours" : "non précisé par le cours")); });
    return r;
  }
  function dessinRoulement(t, cx, yb) {
    var n = t.d.length;
    t.d.forEach(function (d, i) {
      var x = cx + (n === 2 ? (i === 0 ? -70 : 80) : 0), rangs = d[1] || 1;
      for (var k = 0; k < rangs; k++) {
        var xx = rangs === 2 ? x + (k === 0 ? -42 : 42) : x, l = rangs === 2 ? 84 : d[0] === "aiguilles" ? (n === 2 ? 120 : 170) : d[0] === "butee" ? 110 : 130;
        var gg = R.el("g", { transform: d[2] && k === 0 ? "translate(" + 2 * xx + " 0) scale(-1 1)" : null }, g);
        MECA.roulement(gg, xx, yb, l, d[0] === "aiguilles" ? 100 : rangs === 2 ? 150 : 170, { type: d[0] });
      }
    });
  }
  function dessiner() {
    R.vider(g);
    T.forEach(function (t, i) {
      var y = 14 + i * 50, bon = ok(t), sel = t.id === choisi;
      var gr = R.el("g", { style: "cursor:pointer" }, g);
      R.el("rect", { x: 10, y: y, width: 360, height: 42, rx: 12, fill: sel ? PLATEFORME.teinte(0.2) : bon ? "#e3f7ee" : "#f3f4f7", stroke: sel ? C.acc : bon ? C.y : "#d9dde6", "stroke-width": sel ? 3 : 1.5 }, gr);
      R.texte(gr, t.nom, [24, y + 21], { italique: false, ancre: "start", taille: 16, couleur: bon ? C.fonce : "#8a90a0", gras: sel });
      gr.addEventListener("click", function () { choisi = t.id; dessiner(); });
    });
    var t = T.filter(function (x) { return x.id === choisi; })[0], cx = 660, yb = 270;
    R.texte(g, t.nom, [cx, 30], { italique: false, gras: true, taille: 21 });
    MECA.traitAxe(g, [430, yb + 36], [890, yb + 36]);
    R.el("rect", { x: 440, y: yb, width: 440, height: 36, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 1.5 }, g);
    dessinRoulement(t, cx, yb);
    MECA.roulementSimplifie(g, 900, 120, 56, {});
    R.texte(g, "représentation", [900, 168], { italique: false, couleur: C.doux, taille: 13 });
    R.texte(g, "simplifiée", [900, 184], { italique: false, couleur: C.doux, taille: 13 });
    var y = 345;
    t.l.forEach(function (s) {
      // coupe les lignes longues aux espaces (environ 50 caractères)
      var mots = s.split(" "), l = "", lignes = [];
      mots.forEach(function (m) { if ((l + " " + m).length > 50 && l) { lignes.push(l); l = m; } else l = l ? l + " " + m : m; });
      lignes.push(l);
      lignes.forEach(function (x, k) { R.texte(g, (k ? "  " : "· ") + x, [430, y], { italique: false, ancre: "start", taille: 16 }); y += k < lignes.length - 1 ? 22 : 28; });
    });
    R.texte(g, "déversement admissible : " + t.dev, [430, y + 8], { italique: false, ancre: "start", taille: 16, gras: true, couleur: C.v });
    var r = raison(t);
    zone.textContent = (ok(t) ? "Compatible avec les besoins cochés, d'après le cours." : "Écarté : " + r.join(" ; ") + ".");
  }
  dessiner();
})();
