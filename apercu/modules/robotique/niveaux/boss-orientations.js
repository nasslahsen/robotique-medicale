/* Boss du chapitre 3 : décoder une matrice, trouver une erreur, rotation ou miroir, inverse, Euler. */
NIVEAU({
  id: "boss-orientations",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [330, 340], ech: 120, az: 32, el: 24 });
    var I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    var n = { R: I, pince: true, cadran: null, cellules: null, surCellule: null, marques: {} };
    var fc = function (x) { return E.tc(x, 3).replace("{,}", ",").replace("-", "−"); };
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle();
      sc.sol(l, 2.4, true);
      sc.repere(l, [0, 0, 0], I, 1.9, ["x₀", "y₀", "z₀"], { pale: true, ep: 2.5 });
      if (n.pince) {
        sc.pave(l, n.R, [0, 0, 0], [0.42, 0, 0.27], [0.58, 0.12, 0.08], "#ffb38f");
        sc.pave(l, n.R, [0, 0, 0], [1.12, 0.1, 0.27], [0.13, 0.025, 0.06], "#ffb38f");
        sc.pave(l, n.R, [0, 0, 0], [1.12, -0.1, 0.27], [0.13, 0.025, 0.06], "#ffb38f");
      }
      sc.repere(l, [0, 0, 0], n.R, 1.45, ["x₁", "y₁", "z₁"], { ep: 5 });
      sc.dessiner(g, l);
      if (n.cadran) n.cadran.dessiner();
      if (n.bande) n.bande();
    };
    // matrice affichée sous la figure, cases touchables
    n.grille = function (nom, M, opts) {
      opts = opts || {};
      var cl = [C.x, C.y, C.z], h = '<div style="display:flex;align-items:center;gap:8px"><span style="font-weight:700">' + nom + '</span><div style="display:grid;grid-template-columns:repeat(3,auto);gap:2px 4px;border-left:2.5px solid #15171f;border-right:2.5px solid #15171f;border-radius:9px;padding:3px 6px">';
      for (var i = 0; i < 3; i++) for (var k = 0; k < 3; k++) {
        var m = n.marques[i + "" + k];
        h += '<button data-i="' + i + '" data-j="' + k + '" style="min-width:70px;height:36px;border:0;border-radius:9px;font:700 16px JetBrains Mono,monospace;cursor:' + (opts.touche ? "pointer" : "default") + ";color:" + (opts.noir ? C.encre : cl[k]) + ";background:" + (m === "ko" ? "#fdecec" : m === "ok" ? "#e3f7ee" : opts.touche ? "#f3f5fa" : "transparent") + '">' + fc(M[i][k]) + "</button>";
      }
      return h + "</div></div>";
    };
    var bande = fig.bande("");
    bande.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (b && n.surCellule) n.surCellule(+b.dataset.i, +b.dataset.j); });
    n.fc = fc; n.sc = sc;
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Décoder", jouer: function (j, n) {
      var cible = E.Rz(-70 * D.DEG), alpha = 20, fini = false;
      n.R = E.Rz(alpha * D.DEG);
      n.bande = function () { j.fig.bande(n.grille("Cible", cible, { noir: true }) + n.grille("R<sup>0,1</sup>", n.R)); };
      n.cadran = D.cadran(j.fig.coin, { pas: 1, decalage: function () { var a = n.sc.az * D.DEG; return Math.atan2(-Math.cos(a), -Math.sin(a)) / D.DEG; },
        change: function (v) { alpha = v; n.R = E.Rz(v * D.DEG); n.dessin(); if (!fini && v === -70) gagne(); } });
      n.cadran.regler(20, true);
      j.nettoyer(function () { j.fig.coin.innerHTML = ""; n.cadran = null; });
      n.dessin();
      j.fig.astuce("Tourne la pince avec le cadran.");
      j.titre("Une autre pince a la matrice « Cible ». Tourne la tienne jusqu'à avoir exactement la même.");
      j.reponse(gagne);
      function gagne() { fini = true; n.cadran.verrouiller(true); j.bravo("α = −70° : \\(\\sin\\) négatif, sens horaire."); j.suite(); }
    } },
    { nom: "L'erreur", jouer: function (j, n) {
      var c = Math.cos(40 * D.DEG), s = Math.sin(40 * D.DEG), copie = [[c, -s, 0], [-s, c, 0], [0, 0, 1]], fini = false;
      n.R = E.Rz(40 * D.DEG); n.marques = {};
      n.bande = function () { j.fig.bande(n.grille("Copie", copie, { touche: !fini })); };
      n.dessin();
      j.fig.astuce("La pince est à 40°.");
      j.titre("Cette copie annonce \\(R_z(40°)\\). Touche la case fausse.");
      n.surCellule = function (i, k) {
        if (fini) return;
        if (i === 1 && k === 0) { fini = true; n.marques["10"] = "ko"; n.dessin(); j.bravo("\\(r_{21} = \\sin 40° = +0{,}643\\) : la pince pointe du côté de \\(+\\vec{y}_0\\)."); j.suite(); }
        else { n.marques[i + "" + k] = "ok"; n.dessin(); j.erreur("Cette case est juste."); }
      };
      j.nettoyer(function () { n.surCellule = null; n.marques = {}; });
      j.reponse(function () { if (n.surCellule) n.surCellule(1, 0); });
    } },
    { nom: "Rotation ou miroir", jouer: function (j, n) {
      var M = [[0, 1, 0], [1, 0, 0], [0, 0, 1]];
      n.R = M; n.pince = false;
      n.bande = function () { j.fig.bande(n.grille("M", M)); };
      n.dessin();
      j.fig.astuce("Le repère dessiné a pour axes les colonnes de M.");
      j.titre("Ses colonnes sont orthonormées. M est-elle une rotation ?");
      j.choix([{ html: "Oui, une rotation", aide: "Calcule le déterminant, ou vérifie la main droite sur le repère : \\(\\vec{x}_1 \\wedge \\vec{y}_1 = -\\vec{z}_1\\)." }, { html: "Non, un miroir", juste: true }], { ok: function () {
        j.bravo("\\(\\det M = -1\\) : x et y sont échangés, le repère est indirect.");
        j.suite();
      } });
    } },
    { nom: "Inverse", jouer: function (j, n) {
      n.R = E.Rz(-70 * D.DEG); n.pince = true;
      n.bande = function () { j.fig.bande(n.grille("R", n.R)); };
      n.dessin();
      j.fig.astuce("");
      j.titre("Donne la première colonne de \\(R^{-1}\\), pour la matrice de la cible.");
      j.nombre({ avant: "\\text{colonne 1 de } R^{-1} =", cases: [{ attendu: 0.342, tol: 0.002 }, { attendu: 0.94, tol: 0.002 }, { attendu: 0, tol: 0.002 }],
        aide: function () { return "\\(R^{-1} = R^T\\) : la colonne 1 de \\(R^{-1}\\) est la ligne 1 de \\(R\\)."; },
        ok: function () { j.bravo("\\((0{,}342 \\,;\\ 0{,}940 \\,;\\ 0)\\), la ligne 1 de R."); j.suite(); } });
    } },
    { nom: "Euler", jouer: function (j, n) {
      n.R = E.mm(E.Rz(90 * D.DEG), E.Ry(90 * D.DEG));
      n.bande = function () { j.fig.bande(""); E.k(j.fig.bande(""), "R^{(0,2)} = R_z(90°)\\,R_y(90°)"); };
      n.dessin();
      j.fig.astuce("Orientation après les deux rotations, en axes mobiles.");
      j.titre("ZYX avec \\(\\alpha = 90°\\) puis \\(\\beta = 90°\\). Donne la première colonne de \\(R^{(0,2)}\\).");
      j.nombre({ avant: "[\\vec{x}_2]_{R_0} =", cases: [{ attendu: 0, tol: 0.002 }, { attendu: 0, tol: 0.002 }, { attendu: -1, tol: 0.002 }],
        aide: function () { return "Après le tangage de 90°, \\(\\vec{x}\\) pointe vers le bas, quel que soit le lacet."; },
        ok: function () {
          j.bravo("\\(\\vec{x}_2 = -\\vec{z}_0\\).");
          j.expliquer("<p>Boss vaincu. Une orientation se lit dans les colonnes de sa matrice, se vérifie par \\(R^TR = I\\) et \\(\\det R = 1\\), s'inverse en transposant, et se construit en chaînant les rotations élémentaires.</p>");
          j.suite();
        } });
    } }
  ]
});
