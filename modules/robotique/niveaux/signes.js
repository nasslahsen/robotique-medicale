/* Niveau : angles remarquables, signes par quadrant, symétries utiles aux matrices de rotation. */
NIVEAU({
  id: "signes",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [330, 310], 210);
    var n = { mode: "remarquables", a: 35, libre: false, surQuadrant: null, quadrants: false, signes: false, surAngle: null };
    var b = fig.bande(null);
    function cadre() {
      pl.grille({ pas: 0.25, fort: 4 });
      D.fleche(pl.fond, pl.P([-1.4, 0]), pl.P([1.45, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -1.3]), pl.P([0, 1.42]), "#c3c8d2", 2.5);
      D.rond(pl.fond, pl.P([0, 0]), pl.u, { fill: "none", stroke: "#d6dae3", ep: 2.5 });
    }
    function point(t, coul, nom, ombres) {
      var c = Math.cos(t * D.DEG), s = Math.sin(t * D.DEG), M = pl.P([c, s]);
      if (ombres) { D.ligne(pl.fig, M, pl.P([c, 0]), coul, 2, "5 6"); D.ligne(pl.fig, M, pl.P([0, s]), coul, 2, "5 6"); }
      D.ligne(pl.fig, pl.P([0, 0]), M, coul, 4);
      D.rond(pl.fig, M, 9, { fill: coul, stroke: "#fff", ep: 2.5 });
      if (nom) D.texte(pl.fig, nom, [M[0] + (c >= 0 ? 22 : -22), M[1] + (s >= 0 ? -20 : 20)], { coul: coul, taille: 20 });
    }
    n.dessin = function () {
      pl.vider(); cadre();
      if (n.mode === "remarquables") {
        [[30, "30°", C.x], [45, "45°", C.jeu], [60, "60°", C.v]].forEach(function (p) { point(p[0], p[2], p[1], true); });
        [[Math.cos(30 * D.DEG), "a"], [Math.cos(45 * D.DEG), "b"], [Math.cos(60 * D.DEG), "c"]].forEach(function (p) {
          D.rond(pl.fig, pl.P([p[0], 0]), 5, { fill: C.encre });
        });
      } else if (n.mode === "quadrants") {
        var Q = [[0, 90, "1"], [90, 180, "2"], [180, 270, "3"], [270, 360, "4"]];
        Q.forEach(function (q, i) {
          var c = pl.P([0, 0]), r = pl.u * 1.2, p0 = [c[0] + r * Math.cos(q[0] * D.DEG), c[1] - r * Math.sin(q[0] * D.DEG)], p1 = [c[0] + r * Math.cos(q[1] * D.DEG), c[1] - r * Math.sin(q[1] * D.DEG)];
          var z = E.s("path", { d: "M" + c + " L" + p0 + " A" + r + " " + r + " 0 0 0 " + p1 + " Z", fill: n.choisi === i ? (n.bon === i ? "rgba(18,162,107,.18)" : "rgba(229,72,77,.15)") : "rgba(59,91,219,.04)", stroke: "#dfe3ec", "stroke-width": 1.5, style: "cursor:pointer" }, pl.fond);
          var m = (q[0] + 45) * D.DEG;
          D.texte(pl.fond, n.signes ? ["cos > 0, sin > 0", "cos < 0, sin > 0", "cos < 0, sin < 0", "cos > 0, sin < 0"][i] : "quadrant " + q[2], pl.P([0.68 * Math.cos(m), 0.68 * Math.sin(m)]), { coul: n.signes ? C.encre : C.gris, taille: n.signes ? 16 : 18 });
        });
      } else if (n.mode === "symetrie") {
        point(n.a, C.acc, "M (α)", true); point(-n.a, C.jeu, "M′ (−α)", true);
        pl.arc(pl.fig, [0, 0], 0.3 * pl.u, 0, n.a, C.acc, "α"); pl.arc(pl.fig, [0, 0], 0.3 * pl.u, 0, -n.a, C.jeu, "−α");
      } else if (n.mode === "quart") {
        point(n.a, C.acc, "M (α)", true); point(n.a + 90, C.y, "N (α + 90°)", true);
        pl.arc(pl.fig, [0, 0], 0.22 * pl.u, n.a, n.a + 90, C.y, "90°");
        if (n.libre) D.poignee(pl.haut, pl.P([Math.cos(n.a * D.DEG), Math.sin(n.a * D.DEG)]), C.acc);
      }
      if (n.mode === "quart" || n.mode === "symetrie") {
        b = fig.bande("");
        var a = n.a * D.DEG;
        E.k(b, n.mode === "quart"
          ? "M = (" + E.tn(Math.cos(a), 3) + "\\,;\\ " + E.tn(Math.sin(a), 3) + ") \\qquad N = (" + E.tn(Math.cos(a + Math.PI / 2), 3) + "\\,;\\ " + E.tn(Math.sin(a + Math.PI / 2), 3) + ")"
          : "M = (" + E.tn(Math.cos(a), 3) + "\\,;\\ " + E.tn(Math.sin(a), 3) + ") \\qquad M' = (" + E.tn(Math.cos(-a), 3) + "\\,;\\ " + E.tn(Math.sin(-a), 3) + ")");
      } else fig.bande(null);
      fig.chip(n.mode === "quart" || n.mode === "symetrie" ? "α = " + Math.round(n.a) + "°" : null);
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        // en mode quadrants, toucher n'importe où dans une zone la choisit
        if (n.mode === "quadrants" && n.surQuadrant) {
          var u = pl.U(p); if (Math.hypot(u[0], u[1]) > 1.25) return false;
          var a = Math.atan2(u[1], u[0]) / D.DEG; if (a < 0) a += 360;
          n.surQuadrant(Math.floor(a / 90)); return false;
        }
        return n.libre;
      },
      bouge: function (p) { if (!n.libre) return; var a = Math.round(Math.atan2(pl.O[1] - p[1], p[0] - pl.O[0]) / D.DEG); n.a = a; n.dessin(); }
    });
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Valeurs remarquables", jouer: function (j, n) {
      j.fig.astuce("Trois points du cercle, à 30°, 45° et 60°, avec leurs ombres.");
      j.titre("Range les valeurs : glisse chaque nombre sous le bon cosinus.");
      j.consigne("Plus l'angle est petit, plus l'ombre sur l'axe horizontal est longue.");
      var t = j.zone("", '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;font-size:20px">' +
        ['30', '45', '60'].map(function (a, k) { return '<span>\\(\\cos ' + a + '° =\\)</span><span class="trou" data-attendu="' + k + '"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(t.querySelectorAll(".trou")),
        jetons: [{ id: "2", tex: "\\tfrac{1}{2}" }, { id: "0", tex: "\\tfrac{\\sqrt{3}}{2}" }, { id: "1", tex: "\\tfrac{\\sqrt{2}}{2}" }],
        aide: "Compare les ombres : \\(\\tfrac{\\sqrt{3}}{2} \\approx 0{,}87\\), \\(\\tfrac{\\sqrt{2}}{2} \\approx 0{,}71\\), \\(\\tfrac{1}{2} = 0{,}5\\).",
        ok: function () {
          j.bravo("Bien rangé.");
          j.expliquer("<p>Le sinus prend les mêmes valeurs dans l'ordre inverse, car l'ombre verticale grandit quand l'angle grandit :</p>\\[ \\begin{array}{c|ccc} & 30° & 45° & 60° \\\\ \\hline \\cos & \\tfrac{\\sqrt{3}}{2} \\approx 0{,}866 & \\tfrac{\\sqrt{2}}{2} \\approx 0{,}707 & \\tfrac{1}{2} \\\\ \\sin & \\tfrac{1}{2} & \\tfrac{\\sqrt{2}}{2} & \\tfrac{\\sqrt{3}}{2} \\end{array} \\]<p>Le 0,866 du cours, c'est \\(\\cos 30°\\).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Quadrants", jouer: function (j, n) {
      n.mode = "quadrants"; n.choisi = null; n.dessin();
      j.fig.astuce("Touche une zone du cercle.");
      j.titre("Dans quelle zone a-t-on \\(\\cos\\theta < 0\\) et \\(\\sin\\theta > 0\\) ?");
      j.consigne("Cosinus négatif : M à gauche. Sinus positif : M en haut.");
      var fini = false;
      var AIDE = ["Ici M est à droite : le cosinus est positif.", null, "Ici M est en bas : le sinus est négatif.", "Ici M est à droite et en bas : les deux signes sont faux."];
      n.surQuadrant = function (i) {
        if (fini) return;
        n.choisi = i; n.bon = 1; n.dessin();
        if (i !== 1) { j.erreur(AIDE[i]); return; }
        fini = true; n.signes = true; n.dessin();
        j.bravo("Le quadrant 2, en haut à gauche.", n.pl.P([-0.5, 0.5]));
        j.expliquer("<p>Les signes de \\(\\cos\\) et \\(\\sin\\) se lisent sur la figure, quadrant par quadrant. C'est le meilleur moyen de vérifier un calcul : si un bras pointe vers la gauche, sa composante horizontale doit être négative.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surQuadrant) n.surQuadrant(1); });
    } },
    { nom: "Symétrie", jouer: function (j, n) {
      n.mode = "symetrie"; n.surQuadrant = null; n.a = 35; n.dessin();
      j.fig.astuce("M est à l'angle α, M′ à l'angle −α.");
      j.titre("Compare M et M′. Que deviennent cosinus et sinus quand on change le signe de l'angle ?");
      j.choix([
        { tex: "\\cos(-\\alpha) = -\\cos\\alpha \\quad \\text{et} \\quad \\sin(-\\alpha) = \\sin\\alpha", aide: "M et M′ sont du même côté de l'axe vertical : leurs abscisses sont égales." },
        { tex: "\\cos(-\\alpha) = \\cos\\alpha \\quad \\text{et} \\quad \\sin(-\\alpha) = -\\sin\\alpha", juste: true },
        { html: "Les deux changent de signe", aide: "Regarde les valeurs sous la figure : une seule des deux coordonnées change." }
      ], { colonnes: 1, ok: function () {
        j.bravo("M′ est le reflet de M dans l'axe horizontal.");
        j.expliquer("\\[ \\cos(-\\alpha) = \\cos\\alpha \\qquad \\sin(-\\alpha) = -\\sin\\alpha \\]<p>Dans une matrice de rotation, passer de \\(+\\alpha\\) à \\(-\\alpha\\) ne change donc que le signe des sinus.</p>");
        j.suite();
      } });
    } },
    { nom: "Quart de tour", jouer: function (j, n) {
      n.mode = "quart"; n.a = 30; n.libre = true; n.dessin();
      j.fig.astuce("Fais tourner M : N le suit, toujours un quart de tour plus loin.");
      j.titre("N est M tourné d'un quart de tour. Quelles sont les coordonnées de N ?");
      j.consigne("Bouge M et compare les nombres sous la figure avant de choisir.");
      j.choix([
        { tex: "(\\sin\\alpha \\,;\\ -\\cos\\alpha)", aide: "Ça, c'est un quart de tour dans l'autre sens. Avec α = 0, N est en haut : (0 ; 1)." },
        { tex: "(-\\sin\\alpha \\,;\\ \\cos\\alpha)", juste: true },
        { tex: "(\\cos\\alpha \\,;\\ \\sin\\alpha)", aide: "Ça, ce sont les coordonnées de M lui-même." }
      ], { colonnes: 1, ok: function () {
        n.libre = false;
        j.bravo("Les coordonnées s'échangent et l'une change de signe.");
        j.expliquer("\\[ \\cos(\\alpha + 90°) = -\\sin\\alpha \\qquad \\sin(\\alpha + 90°) = \\cos\\alpha \\]<p>Retiens ce résultat : quand un repère tourne de α, son deuxième axe est le premier tourné d'un quart de tour. Ses coordonnées seront \\((-\\sin\\alpha \\,;\\ \\cos\\alpha)\\), la deuxième colonne de la matrice de rotation.</p>");
        j.suite();
      } });
    } }
  ]
});
