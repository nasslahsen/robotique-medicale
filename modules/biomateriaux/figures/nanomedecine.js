(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Échelle logarithmique des tailles ---------- */
  (function () {
    var f = R.figure("fig-echelle", {
      largeur: 960, hauteur: 350, titre: "Échelle des tailles, de 0,1 nm à 100 µm",
      essai: "<strong>Essaie</strong> : déplace la poignée bleue le long de la règle. <strong>Observe</strong> : chaque graduation multiplie la taille par 10 ; la bande colorée de 1 à 100 nm est le domaine des nanotechnologies. Tailles d'objets : exemple ajouté, ordres de grandeur."
    });
    var X0 = 80, X1 = 880, Y = 210, L0 = -1, L1 = 5, lg = Math.log10(50);
    function X(l) { return X0 + (l - L0) / (L1 - L0) * (X1 - X0); }
    function txt(l) { var v = Math.pow(10, l); return v < 1000 ? (v < 10 ? R.fmt(v, 1) : Math.round(v)) + " nm" : (v < 10000 ? R.fmt(v / 1000, 1) : Math.round(v / 1000)) + " µm"; }
    var OBJ = [[0.3, "molécule d'eau", 0], [2, "ADN (largeur)", 1], [100, "virus", 0], [1000, "bactérie", 1], [7000, "globule rouge", 0], [20000, "cellule", 1]];
    var g = R.el("g", null, f.svg), gp = R.el("g", null, f.svg);
    function dessin() {
      R.vider(g); R.vider(gp);
      R.el("rect", { x: X(0), y: Y - 150, width: X(2) - X(0), height: 200, rx: 14, fill: PLATEFORME.teinte(0.14), stroke: C.acc, "stroke-width": 2 }, g);
      R.texte(g, "nanotechnologies : 1 à 100 nm", [(X(0) + X(2)) / 2, Y - 128], { italique: false, gras: true, couleur: C.acc, taille: 17 });
      R.ligne(g, [X0, Y], [X1, Y], { couleur: C.fonce, epaisseur: 4 });
      for (var l = L0; l <= L1; l++) { R.ligne(g, [X(l), Y - 10], [X(l), Y + 10], { couleur: C.fonce, epaisseur: 3 }); R.texte(g, txt(l), [X(l), Y + 32], { italique: false, couleur: C.doux, taille: 16 }); }
      OBJ.forEach(function (o) {
        var x = X(Math.log10(o[0])), y = o[2] ? Y - 90 : Y - 50;
        R.ligne(g, [x, Y], [x, y + 10], { couleur: "#9aa0a6", tirets: "4 4" });
        R.el("circle", { cx: x, cy: Y, r: 6, fill: C.v }, g);
        R.texte(g, o[1], [x, y], { italique: false, gras: true, couleur: C.v, taille: 16 });
      });
      var xm = X(lg);
      R.ligne(g, [xm, Y + 50], [xm, Y + 90], { couleur: C.z, epaisseur: 4 });
      R.poignee(f.svg, gp, [xm, Y + 110], function (q) { lg = Math.max(L0, Math.min(L1, L0 + (q[0] - X0) / (X1 - X0) * (L1 - L0))); dessin(); }, { couleur: C.z });
      var v = Math.pow(10, lg), nano = v >= 1 && v <= 100;
      f.direct.innerHTML = "<p>Taille : <strong>" + txt(lg) + "</strong>. " + (nano ? "Dans le domaine des nanotechnologies." : "Hors de l'intervalle 1 à 100 nm.") + " Une cellule de 20 µm est environ " + Math.round(20000 / v) + " fois plus grande.</p>";
    }
    dessin();
  })();

  /* ---------- Usages : touche une carte ---------- */
  (function () {
    var f = R.figure("fig-usages", {
      largeur: 960, hauteur: 300, titre: "Prévention, diagnostic, traitement",
      essai: "<strong>Essaie</strong> : touche chaque colonne. <strong>Observe</strong> : les mêmes nano-objets servent avant la maladie, pour la voir, puis pour la soigner."
    });
    var COL = [
      ["Prévention", ["filtres cosmétiques", "revêtements anti-infection"], "Nanoparticules comme filtres dans les cosmétiques dermiques ; revêtements destinés à prévenir les infections (par exemple sur un implant)."],
      ["Diagnostic", ["biocapteurs, nanoarrays", "agents de contraste"], "Diagnostic in vitro et in vivo : bioessais, nanoarrays, biocapteurs, imagerie, agents de contraste. Buts : sensibilité, fiabilité, rapidité, miniaturisation ; détection plus précoce."],
      ["Traitement", ["ciblage, suivi", "délivrance de médicaments", "ou de gènes"], "Ciblage, suivi, délivrance de médicaments ou de gènes, modification de surface : un ciblage plus spécifique permet de diminuer les doses et les effets secondaires."]
    ];
    var g = R.el("g", null, f.svg), choisi = 1;
    function dessin() {
      R.vider(g);
      COL.forEach(function (c, k) {
        var x = 40 + k * 300, a = k === choisi, grp = R.el("g", { style: "cursor:pointer" }, g);
        R.el("rect", { x: x, y: 30, width: 280, height: 240, rx: 22, fill: a ? PLATEFORME.teinte(0.18) : "#fff", stroke: a ? C.acc : "#c6cbd8", "stroke-width": a ? 3.5 : 2.5 }, grp);
        R.texte(grp, c[0], [x + 140, 76], { italique: false, gras: true, taille: 22, halo: false });
        c[1].forEach(function (t, i) { R.texte(grp, t, [x + 140, 140 + i * 40], { italique: false, taille: 17, couleur: C.doux, halo: false }); });
        grp.addEventListener("click", function () { choisi = k; dessin(); });
      });
      f.direct.innerHTML = "<p><strong>" + COL[choisi][0] + "</strong> : " + COL[choisi][2] + "</p>";
    }
    dessin();
  })();
})();
