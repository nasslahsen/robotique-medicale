(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : la même multiplication en CISC et en RISC (exemple ajouté) ---------- */
  var f = R.figure("fig-mult", {
    largeur: 960, hauteur: 440,
    titre: "Multiplier deux nombres rangés en mémoire",
    essai: "<strong>Essaie</strong> : choisis CISC ou RISC, puis avance étape par étape. <strong>Observe</strong> : le CISC fait tout en une instruction qui touche directement la mémoire ; le RISC charge dans des registres, calcule entre registres, puis range : quatre instructions plus simples."
  });
  var g = EMB.el("g", null, f.svg), prog = "risc", b = R.boutons(f.reglages);
  var bc = R.bouton(b, "CISC", function () { prog = "cisc"; k = 0; dessiner(); });
  var br = R.bouton(b, "RISC", function () { prog = "risc"; k = 0; dessiner(); });
  var zone = R.h("p", null, "", f.direct);
  var ETATS = {
    cisc: [
      { pas: -1, m: 6, A: null, B: null, vise: [], txt: "Départ : la case 2:3 contient 6, la case 5:2 contient 7." },
      { pas: 0, m: 42, A: null, B: null, vise: ["2:3", "5:2"], txt: "MULT 2:3, 5:2 : le processeur lit les deux cases, multiplie et range 42 en 2:3, en une seule instruction qui dure plusieurs cycles d'horloge." }
    ],
    risc: [
      { pas: -1, m: 6, A: null, B: null, vise: [], txt: "Départ : la case 2:3 contient 6, la case 5:2 contient 7." },
      { pas: 0, m: 6, A: 6, B: null, vise: ["2:3"], txt: "LOAD A, 2:3 : la valeur de la case 2:3 est chargée dans le registre A." },
      { pas: 1, m: 6, A: 6, B: 7, vise: ["5:2"], txt: "LOAD B, 5:2 : la valeur de la case 5:2 est chargée dans le registre B." },
      { pas: 2, m: 6, A: 42, B: 7, vise: [], txt: "PROD A, B : produit entre registres, le résultat 42 va dans A. La mémoire n'est pas touchée." },
      { pas: 3, m: 42, A: 42, B: 7, vise: ["2:3"], txt: "STORE 2:3, A : le contenu de A est rangé dans la case 2:3." }
    ]
  };
  var k = 0;
  var b2 = R.boutons(f.reglages);
  var bs = R.bouton(b2, "Instruction suivante", function () { if (k < ETATS[prog].length - 1) k++; dessiner(); });
  R.bouton(b2, "Recommencer", function () { k = 0; dessiner(); });
  var etx = R.h("span", { "class": "etape-texte" }, "", b2);
  function dessiner() {
    EMB.vider(g);
    bc.classList.toggle("actif", prog === "cisc"); br.classList.toggle("actif", prog === "risc");
    var e = ETATS[prog][k], x0 = 90, y0 = 80, w = 66, h = 50;
    EMB.texte(g, "Mémoire", [x0 + 2 * w, 30], { taille: 20 });
    for (var r = 1; r <= 5; r++) {
      EMB.texte(g, String(r), [x0 - 22, y0 + (r - 0.5) * h], { taille: 15, coul: C.doux, mono: true, halo: false });
      for (var c = 1; c <= 4; c++) {
        var id = r + ":" + c, v = id === "2:3" ? e.m : id === "5:2" ? 7 : null, vise = e.vise.indexOf(id) >= 0;
        EMB.el("rect", { x: x0 + (c - 1) * w, y: y0 + (r - 1) * h, width: w, height: h, fill: vise ? C.clair : v !== null ? "#fff" : C.fond, stroke: vise ? C.acc : C.pale, "stroke-width": vise ? 3.5 : 1.5 }, g);
        if (v !== null) EMB.texte(g, String(v), [x0 + (c - 0.5) * w, y0 + (r - 0.5) * h], { taille: 20, mono: true, halo: false });
      }
    }
    for (c = 1; c <= 4; c++) EMB.texte(g, String(c), [x0 + (c - 0.5) * w, y0 - 16], { taille: 15, coul: C.doux, mono: true, halo: false });
    EMB.texte(g, "ligne : colonne", [x0 + 2 * w, y0 + 5 * h + 26], { taille: 14, coul: C.doux, gras: false });
    EMB.texte(g, "Registres", [490, 30], { taille: 20 });
    [["A", e.A], ["B", e.B]].forEach(function (rg, i) {
      EMB.bloc(g, 420, 70 + i * 70, 54, 54, rg[0], { taille: 20, fill: C.fond });
      EMB.bloc(g, 480, 70 + i * 70, 120, 54, rg[1] === null ? "" : String(rg[1]), { taille: 22, mono: true, actif: rg[1] !== null && prog === "risc" });
    });
    EMB.texte(g, prog === "cisc" ? "Programme CISC" : "Programme RISC", [780, 30], { taille: 20, coul: C.ko });
    var lignes = prog === "cisc" ? ["MULT 2:3, 5:2"] : ["LOAD A, 2:3", "LOAD B, 5:2", "PROD A, B", "STORE 2:3, A"];
    lignes.forEach(function (l, i) { EMB.bloc(g, 650, 70 + i * 60, 270, 48, l, { taille: 18, mono: true, actif: e.pas === i, rx: 6 }); });
    EMB.texte(g, lignes.length + (lignes.length > 1 ? " instructions" : " instruction"), [785, 70 + lignes.length * 60 + 20], { taille: 17, coul: C.doux, gras: false });
    if (prog === "risc") EMB.texte(g, "La mémoire ne sert\nqu'à LOAD et STORE", [520, 290], { taille: 16, coul: C.doux, gras: false });
    bs.disabled = k >= ETATS[prog].length - 1;
    etx.textContent = k === 0 ? "Départ" : "Instruction " + k + " sur " + (ETATS[prog].length - 1);
    zone.textContent = e.txt;
  }
  dessiner();
})();
