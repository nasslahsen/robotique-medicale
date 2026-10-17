/* Niveau : la matrice de rotation R^{0,1} = R_z(α). Reprend l'essai A. */
NIVEAU({
  id: "matrice-rotation",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [320, 330], 170);
    var n = { alpha: 0, libre: true, cible: false, proj1: false, proj2: false, y1: false, grilleR1: false, pin: null, chemin: 0, cellule: null, mat: "rien", surAngle: null, surRelache: null, surTape: null, surCellule: null };
    var fc = function (x) { return E.tc(x, 3).replace("{,}", ",").replace("-", "\u2212"); };
    var bande = fig.bande("");
    function m(v, k) { return [v[0] * k, v[1] * k, 0]; }
    function ad(a, b) { return [a[0] + b[0], a[1] + b[1], 0]; }
    function projections(v, coul, nx, ny) {
      var p = pl.P(v), fx = pl.P([v[0], 0]), fy = pl.P([0, v[1]]);
      D.ligne(pl.fig, p, fx, coul, 2, "5 6"); D.ligne(pl.fig, p, fy, coul, 2, "5 6");
      D.rond(pl.fig, fx, 5, { fill: coul }); D.rond(pl.fig, fy, 5, { fill: coul });
      D.texte(pl.fig, nx + " = " + fc(v[0]), [fx[0], fx[1] + (v[1] >= 0 ? 24 : -24)], { coul: coul, taille: 16 });
      D.texte(pl.fig, ny + " = " + fc(v[1]), [fy[0] + (v[0] >= 0 ? -12 : 12), fy[1]], { coul: coul, taille: 16, ancre: v[0] >= 0 ? "end" : "start" });
    }
    n.dessin = function () {
      pl.vider();
      var R = E.Rz(n.alpha * D.DEG), x1 = E.col(R, 0), y1 = E.col(R, 1);
      pl.grille({ pas: 0.5 });
      if (n.grilleR1) for (var k = -1; k <= 3; k++) {
        D.ligne(pl.fond, pl.P(ad(m(x1, k), m(y1, -1.2))), pl.P(ad(m(x1, k), m(y1, 3.2))), "#e9dcfb", 1.6);
        D.ligne(pl.fond, pl.P(ad(m(y1, k), m(x1, -1.2))), pl.P(ad(m(y1, k), m(x1, 3.2))), "#e9dcfb", 1.6);
      }
      if (pl.u > 120) D.rond(pl.fond, pl.P([0, 0]), pl.u, { fill: "none", stroke: "#dfe3ec", ep: 2, tirets: "3 7" });
      pl.axes({ lx: [-1.55, 1.62], ly: [-1.25, 1.62] });
      if (n.cible) {
        var c = pl.P([1.35 * Math.cos(60 * D.DEG), 1.35 * Math.sin(60 * D.DEG)]);
        D.rond(pl.fond, c, 30, { fill: "#ffe3e6" }).setAttribute("class", "halo");
        D.rond(pl.fond, c, 16, { fill: "#ff8a95" }); D.rond(pl.fond, c, 5, { fill: "#fff" });
        D.texte(pl.fond, "tumeur", [c[0] + 52, c[1] - 18], { coul: "#c2394a", taille: 17 });
      }
      pl.arc(pl.fig, [0, 0], 0.3 * pl.u, 0, n.alpha, C.acc, "α");
      if (n.proj1) projections(x1, C.x, "cos α", "sin α");
      if (n.proj2) projections(y1, C.y, "−sin α", "cos α");
      D.ligne(pl.fig, pl.P(m(x1, -0.28)), pl.P(m(x1, 0.82)), "#e4e7ef", 26);
      if (n.y1) pl.vec(pl.fig, [0, 0], y1, C.y, 4.5, "y₁");
      pl.vec(pl.fig, [0, 0], x1, C.x, 5, "x₁");
      pl.origine(pl.fig, "z₀ = z₁");
      if (n.cellule) {
        var i = n.cellule[0], jj = n.cellule[1], A0 = [[1, 0, 0], [0, 1, 0]], cl = [C.x, C.y];
        if (i < 2) pl.vec(pl.haut, [0, 0], A0[i], cl[i], 7, null, { op: 0.5 });
        if (jj < 2) pl.vec(pl.haut, [0, 0], E.col(R, jj), cl[jj], 7);
        if (i < 2 && jj < 2) {
          var a0 = Math.atan2(A0[i][1], A0[i][0]) / D.DEG, v1 = E.col(R, jj), a1 = Math.atan2(v1[1], v1[0]) / D.DEG, d = E.angle360(a1 - a0);
          pl.arc(pl.haut, [0, 0], 0.55 * pl.u, a0, a0 + d, C.encre, Math.round(Math.abs(d)) + "°", { tirets: "4 5" });
        }
      }
      if (n.chemin > 0) {
        var t1 = Math.min(1, n.chemin), t2 = Math.max(0, Math.min(1, n.chemin - 1)), t3 = Math.max(0, Math.min(1, n.chemin - 2)), b1 = m(x1, 2 * t1);
        pl.vec(pl.haut, [0, 0], b1, C.x, 5);
        if (t1 >= 1) D.texte(pl.haut, "2 x₁", [pl.P(m(x1, 1.45))[0] + 16, pl.P(m(x1, 1.45))[1] + 22], { coul: C.x, taille: 20 });
        if (t2 > 0) pl.vec(pl.haut, b1, ad(b1, m(y1, t2)), C.y, 5);
        if (t2 >= 1) D.texte(pl.haut, "1 y₁", pl.P(ad(b1, m(y1, 0.5))), { coul: C.y, taille: 20, ancre: "start" });
        if (t3 > 0) { var V0 = E.mv(R, [2, 1, 0]); pl.vec(pl.haut, [0, 0], m(V0, t3), C.v, 5.5); if (t3 >= 1) D.texte(pl.haut, "V", [pl.P(V0)[0] + 22, pl.P(V0)[1] - 14], { coul: C.v, taille: 24 }); }
      }
      if (n.pin) {
        var q = pl.P(n.pin);
        D.rond(pl.haut, q, 13, { fill: "#fff", stroke: C.encre, ep: 3 });
        D.ligne(pl.haut, [q[0] - 6, q[1]], [q[0] + 6, q[1]], C.encre, 2.5); D.ligne(pl.haut, [q[0], q[1] - 6], [q[0], q[1] + 6], C.encre, 2.5);
        D.texte(pl.haut, "ta prédiction", [q[0], q[1] + 34], { taille: 15, coul: C.doux });
      }
      if (n.libre) D.poignee(pl.haut, pl.P(x1), C.acc);
      fig.chip("α = " + String(Math.round(n.alpha)).replace("-", "\u2212") + "°");
      majMat(R);
    };
    function majMat(R) {
      if (n.mat === "rien") { bande.innerHTML = '<span style="color:#5b6172;font-size:15px">La matrice se construira ici.</span>'; return; }
      if (n.mat === "colonnes") {
        var h = '<span style="color:#5b6172;font-size:14px;margin-right:12px">Vecteurs<br>trouvés</span>';
        [["x₁", 0, C.x], ["y₁", 1, C.y], ["z₁", 2, C.z]].forEach(function (a) {
          if (a[1] > 0 && !n.proj2) return;
          h += '<div style="text-align:center;color:' + a[2] + ';font:600 17px JetBrains Mono,monospace;line-height:1.3;margin:0 8px">' + a[0] + "<br>" + E.col(R, a[1]).map(fc).join("<br>") + "</div>";
        });
        bande.innerHTML = h; return;
      }
      var cl = [C.x, C.y, C.z];
      var t = '<span class="titre" style="font-size:22px;font-weight:700">R<sup>0,1</sup> =</span><div style="display:grid;grid-template-columns:repeat(3,auto);gap:2px 4px;border-left:2.5px solid #15171f;border-right:2.5px solid #15171f;border-radius:9px;padding:4px 6px">';
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
        var grise = n.mat === "colonne1" && j !== 0, choisi = n.cellule && n.cellule[0] === i && n.cellule[1] === j;
        t += '<button data-i="' + i + '" data-j="' + j + '" style="min-width:78px;height:40px;border:0;border-radius:10px;font:700 18px JetBrains Mono,monospace;cursor:pointer;color:' + (grise ? "#c3c7d1" : cl[j]) + ";background:" + (choisi ? "#ffe066" : n.mat === "colonne1" && j === 0 ? "#fdecec" : "transparent") + '">' + fc(R[i][j]) + "</button>";
      }
      bande.innerHTML = t + "</div>";
    }
    bande.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (b && n.surCellule) n.surCellule(+b.dataset.i, +b.dataset.j); });
    var mode = null;
    D.glisser(fig.svg, {
      debut: function (p) {
        if (n.libre) { var t = pl.P(E.col(E.Rz(n.alpha * D.DEG), 0)); if (Math.hypot(p[0] - t[0], p[1] - t[1]) < 60) { mode = "rot"; return true; } }
        if (n.surTape) { mode = "pin"; return true; }
        return false;
      },
      bouge: function (p) {
        if (mode === "rot") { n.alpha = Math.round(Math.atan2(pl.O[1] - p[1], p[0] - pl.O[0]) / D.DEG); n.dessin(); if (n.surAngle) n.surAngle(n.alpha); }
        else if (mode === "pin") { n.pin = pl.U(p); n.dessin(); n.surTape(); }
      },
      fin: function () { if (mode === "rot" && n.surRelache) n.surRelache(n.alpha); mode = null; }
    });
    n.animer = function (vers, ms, fin) { var de = n.alpha; E.anime(ms || 700, function (e) { n.alpha = de + (vers - de) * e; n.dessin(); }, function () { n.alpha = vers; n.dessin(); if (fin) fin(); }); };
    n.echelle = function (vers) { var de = pl.u; E.anime(700, function (e) { pl.u = de + (vers - de) * e; n.dessin(); }); };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Viser", jouer: function (j, n) {
      Object.assign(n, { alpha: 0, libre: true, cible: true, y1: false, mat: "rien" }); n.dessin();
      j.fig.astuce("Vue de dessus : l'axe z₀ sort de l'écran.");
      j.titre("Le robot doit pointer son instrument vers la tumeur. Fais-le tourner.");
      j.consigne("Fais glisser la pointe ronde de l'instrument jusqu'à la cible.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false;
        n.animer(60, 300, function () {
          n.proj1 = true; n.mat = "colonnes"; n.dessin();
          j.bravo("Visé. L'instrument a tourné de α = 60° autour de \\(\\vec{z}_0\\).", n.pl.P([0.5, 0.87]));
          j.expliquer("<p>Pour décrire cette orientation depuis le repère fixe \\(R_0\\), il suffit de dire où pointe l'axe \\(\\vec{x}_1\\) de l'instrument. Ses projections se lisent sur la figure :</p>\\[ [\\vec{x}_1]_{R_0} = \\begin{pmatrix} \\cos\\alpha \\\\ \\sin\\alpha \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 0{,}5 \\\\ 0{,}866 \\\\ 0 \\end{pmatrix} \\]<p>Tu viens de trouver la première colonne de la matrice.</p>");
          j.suite();
        });
      }
      n.surAngle = function (a) { if (E.ecartAngle(a, 60) < 3) gagne(); };
      n.surRelache = function (a) { if (E.ecartAngle(a, 60) < 7) gagne(); };
    } },
    { nom: "Prédire", jouer: function (j, n) {
      Object.assign(n, { cible: false, y1: true, surAngle: null, surRelache: null }); n.dessin();
      j.fig.astuce("");
      j.titre("Où pointe l'axe \\(\\vec{y}_1\\), vu depuis \\(R_0\\) ?");
      j.consigne("Il est perpendiculaire à \\(\\vec{x}_1\\). Souviens-toi du quart de tour du chapitre 0.");
      j.choix([
        { tex: "\\begin{pmatrix} 0{,}866 \\\\ 0{,}5 \\\\ 0 \\end{pmatrix}", aide: "Ce vecteur pointe vers le haut à droite. Sur la figure, \\(\\vec{y}_1\\) part vers la gauche : sa composante sur \\(\\vec{x}_0\\) est négative." },
        { tex: "\\begin{pmatrix} -0{,}866 \\\\ 0{,}5 \\\\ 0 \\end{pmatrix}", juste: true },
        { tex: "\\begin{pmatrix} 0{,}5 \\\\ -0{,}866 \\\\ 0 \\end{pmatrix}", aide: "Ce vecteur pointe vers le bas. \\(\\vec{y}_1\\) pointe vers le haut à gauche." }
      ], { ok: function () {
        n.proj2 = true; n.dessin();
        j.bravo("Exact.");
        j.expliquer("<p>\\(\\vec{y}_1\\) est \\(\\vec{x}_1\\) tourné d'un quart de tour :</p>\\[ [\\vec{y}_1]_{R_0} = \\begin{pmatrix} -\\sin\\alpha \\\\ \\cos\\alpha \\\\ 0 \\end{pmatrix} \\]<p>La rotation se fait autour de \\(\\vec{z}_0\\), donc \\(\\vec{z}_1 = \\vec{z}_0\\) ne bouge pas : \\([\\vec{z}_1]_{R_0} = (0 \\,;\\ 0 \\,;\\ 1)\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Construire", jouer: function (j, n) {
      n.proj1 = false; n.proj2 = false; n.dessin();
      var R = E.Rz(60 * D.DEG);
      j.titre("Range les trois axes dans la matrice \\(R^{0,1}\\).");
      j.consigne("Une colonne par axe de l'instrument. Glisse chaque vecteur dans une case, ou touche-le pour le poser dans la prochaine case libre.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:10px;font-size:22px;margin:6px 0"><span>\\(R^{0,1} =\\)</span><div style="display:flex;gap:8px;padding:8px 10px;border-left:3px solid #15171f;border-right:3px solid #15171f;border-radius:10px">' +
        [0, 1, 2].map(function (k) { return '<span class="trou" data-attendu="' + k + '" style="width:96px;height:118px"></span>'; }).join("") + "</div></div>");
      var noms = ["x₁", "y₁", "z₁"], cl = [D.C.x, D.C.y, D.C.z];
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [2, 0, 1].map(function (k) {
          return { id: String(k), html: '<div style="text-align:center"><div style="color:' + cl[k] + ';font-weight:700;font-size:15px">' + noms[k] + "</div>" + katex.renderToString(E.texVec(E.col(R, k))) + "</div>" };
        }),
        aide: "La colonne \\(j\\) contient le \\(j\\)-ième axe du repère qui a tourné : \\(\\vec{x}_1\\), puis \\(\\vec{y}_1\\), puis \\(\\vec{z}_1\\).",
        ok: function () {
          n.mat = "matrice"; n.dessin();
          j.bravo("Bien rangé.");
          j.expliquer("<p>C'est la matrice de rotation : ses colonnes sont les axes de \\(R_1\\) exprimés dans \\(R_0\\). Pour une rotation d'angle α autour de \\(\\vec{z}_0\\) :</p>\\[ R^{0,1} = R_z(\\alpha) = \\begin{pmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]<p>Le cours l'écrit aussi \\({}^0R_1\\), \\(R_{01}\\) ou \\(R^0_1\\) : c'est le même objet.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Trouver", jouer: function (j, n) {
      Object.assign(n, { libre: true, mat: "colonne1" }); n.animer(20, 500);
      j.fig.astuce("La colonne surlignée est celle de x₁.");
      j.titre("Trouve α pour que la première colonne vaille \\((0 \\,;\\ 1 \\,;\\ 0)\\).");
      j.consigne("Tourne l'instrument en regardant la matrice sous la figure.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false;
        n.animer(90, 300, function () {
          j.bravo("Trouvé : α = 90°.", n.pl.P([0, 1]));
          j.expliquer("<p>La première colonne vaut \\((0 \\,;\\ 1 \\,;\\ 0)\\) quand \\(\\vec{x}_1\\) pointe exactement selon \\(\\vec{y}_0\\) :</p>\\[ R_z(90°) = \\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]<p>C'est la matrice du dernier exercice du chapitre 0.</p>");
          j.suite();
        });
      }
      n.surAngle = function (a) {
        if (fini) return;
        if (E.ecartAngle(a, -90) < 4) j.info("Presque : là, \\(\\vec{x}_1\\) pointe selon \\(-\\vec{y}_0\\), la colonne vaut \\((0 \\,;\\ -1 \\,;\\ 0)\\)."); else j.efface();
        if (E.ecartAngle(a, 90) < 2) gagne();
      };
      n.surRelache = function (a) { if (E.ecartAngle(a, 90) < 6) gagne(); };
    } },
    { nom: "Appliquer", jouer: function (j, n) {
      Object.assign(n, { libre: false, mat: "matrice", grilleR1: true, surAngle: null, surRelache: null }); n.animer(30, 600); n.echelle(100);
      j.fig.astuce("La grille violette est celle de R₁.");
      j.titre("L'instrument tient une aiguille fixe dans \\(R_1\\) : \\(V^1 = (2 \\,;\\ 1 \\,;\\ 0)\\). Où arrive sa pointe ?");
      j.consigne("Ici α = 30°. Touche la figure là où tu penses que se trouve la pointe, puis vérifie.");
      var b = j.zone(""), verif = E.h("button", "btn bleu", "Vérifier", b); verif.type = "button"; verif.disabled = true;
      n.surTape = function () { verif.disabled = false; };
      verif.addEventListener("click", function () {
        verif.remove(); n.surTape = null;
        var V0 = E.mv(E.Rz(30 * D.DEG), [2, 1, 0]), d = Math.hypot(n.pin[0] - V0[0], n.pin[1] - V0[1]);
        E.anime(2400, function (e) { n.chemin = 3 * e; n.dessin(); }, function () {
          if (d < 0.3) j.bravo("Ta prédiction est à " + E.fmt(d, 2) + " de la pointe.", n.pl.P(V0));
          else j.erreur("Ta prédiction est à " + E.fmt(d, 2) + " de la pointe. Suis le chemin : 2 pas selon \\(\\vec{x}_1\\), puis 1 pas selon \\(\\vec{y}_1\\).");
          j.expliquer("<p>La pointe est à 2 pas selon \\(\\vec{x}_1\\) et 1 pas selon \\(\\vec{y}_1\\). Dans \\(R_0\\), c'est 2 fois la première colonne plus 1 fois la deuxième : le produit de la matrice par le vecteur.</p>\\[ \\begin{aligned} V^0 = R^{0,1}\\,V^1 &= 2\\begin{pmatrix} 0{,}866 \\\\ 0{,}5 \\\\ 0 \\end{pmatrix} + 1\\begin{pmatrix} -0{,}5 \\\\ 0{,}866 \\\\ 0 \\end{pmatrix} \\\\[4pt] &= \\begin{pmatrix} 1{,}232 \\\\ 1{,}866 \\\\ 0 \\end{pmatrix} \\end{aligned} \\]");
          j.suite();
        });
      });
    } },
    { nom: "Bilan", jouer: function (j, n) {
      Object.assign(n, { libre: true, grilleR1: false, pin: null, chemin: 0, mat: "matrice" }); n.echelle(170); n.animer(40, 600);
      j.fig.astuce("Touche une case de la matrice, sous la figure.");
      j.titre("Chaque case est un produit scalaire. Laquelle vaut \\(\\vec{x}_0 \\cdot \\vec{y}_1\\) ?");
      j.consigne("Les deux axes de la case touchée s'allument sur la figure.");
      var dir = j.zone("", ""); dir.style.cssText = "font-size:20px;min-height:40px";
      var A0 = ["\\vec{x}_0", "\\vec{y}_0", "\\vec{z}_0"], A1 = ["\\vec{x}_1", "\\vec{y}_1", "\\vec{z}_1"];
      var F = [["\\cos\\alpha", "-\\sin\\alpha", "0"], ["\\sin\\alpha", "\\cos\\alpha", "0"], ["0", "0", "1"]], fini = false;
      function ecrire() { if (!n.cellule) return; var i = n.cellule[0], k = n.cellule[1], R = E.Rz(n.alpha * D.DEG); E.k(dir, "r_{" + (i + 1) + (k + 1) + "} = " + A0[i] + " \\cdot " + A1[k] + " = " + F[i][k] + " = " + E.tc(R[i][k])); }
      n.surAngle = ecrire;
      n.surCellule = function (i, k) {
        n.cellule = [i, k]; n.dessin(); ecrire();
        if (fini) return;
        if (i === 0 && k === 1) {
          fini = true;
          j.bravo("C'est \\(r_{12}\\) : ligne 1 pour \\(\\vec{x}_0\\), colonne 2 pour \\(\\vec{y}_1\\).");
          j.expliquer("<p>La ligne donne l'axe de \\(R_0\\), la colonne l'axe de \\(R_1\\) : \\(r_{ij}\\) est le produit scalaire de l'axe \\(i\\) de \\(R_0\\) par l'axe \\(j\\) de \\(R_1\\). Ici \\(r_{12} = \\vec{x}_0 \\cdot \\vec{y}_1 = -\\sin\\alpha\\).</p><p>À retenir : colonnes de \\(R^{0,1}\\) = axes de \\(R_1\\) dans \\(R_0\\) ; vecteur fixe dans \\(R_1\\) : \\(V^0 = R^{0,1}\\,V^1\\) ; notations \\(R^{i,j} = {}^iR_j = R_{ij} = R^i_j\\).</p>");
          j.suite();
        } else j.erreur("Cette case relie \\(" + A0[i] + "\\) et \\(" + A1[k] + "\\). Cherche la ligne de \\(\\vec{x}_0\\) et la colonne de \\(\\vec{y}_1\\).");
      };
    } }
  ]
});
