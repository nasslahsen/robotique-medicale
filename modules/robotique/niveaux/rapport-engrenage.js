/* Niveau : engrenage cylindrique extérieur. Sens de rotation, i₁₂ = |ω₂/ω₁| = d₁/d₂ = Z₁/Z₂, d = mZ, entraxe a = m(Z₁ + Z₂)/2. */
NIVEAU({
  id: "rapport-engrenage",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { Z1: 17, Z2: 20, th: 0, libre: true, surTour: null, fleches: false, montrer2: false };
    var Y = 300;
    function geo() {
      var mpx = Math.min(14, 580 / (n.Z1 + n.Z2 + 4)), a = mpx * (n.Z1 + n.Z2) / 2, ra1 = mpx * (n.Z1 / 2 + 1), ra2 = mpx * (n.Z2 / 2 + 1);
      var x1 = 340 - (a + ra2 - ra1) / 2;
      return { m: mpx, c1: [x1, Y], c2: [x1 + a, Y], ra1: ra1 };
    }
    n.geo = geo;
    function flecheRot(c, r, sens, coul) {
      // arc de 70° au-dessus de la roue, dans le sens de rotation (sens > 0 : trigo)
      var a0 = 55 * Math.PI / 180, a1 = 125 * Math.PI / 180, P = function (a) { return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]; };
      var dep = sens > 0 ? a0 : a1, arr = sens > 0 ? a1 : a0, p0 = P(dep), p1 = P(arr);
      E.s("path", { d: "M" + p0 + " A" + r + " " + r + " 0 0 " + (sens > 0 ? 0 : 1) + " " + p1, fill: "none", stroke: coul, "stroke-width": 5, "stroke-linecap": "round" }, g);
      var t = [sens > 0 ? -Math.sin(arr) : Math.sin(arr), sens > 0 ? -Math.cos(arr) : Math.cos(arr)];
      E.s("polygon", { points: [[p1[0] + t[0] * 16, p1[1] + t[1] * 16], [p1[0] - t[1] * 9, p1[1] + t[0] * 9], [p1[0] + t[1] * 9, p1[1] - t[0] * 9]].map(function (p) { return p.join(","); }).join(" "), fill: coul }, g);
    }
    n.dessin = function () {
      E.vider(g);
      var G = geo(), th2 = Math.PI + Math.PI / n.Z2 - n.th * n.Z1 / n.Z2;
      var r1 = MECA.roue(g, G.c1, { m: G.m, Z: n.Z1, rot: n.th, fill: PLATEFORME.teinte(0.22), repereCoul: C.jeu });
      var r2 = MECA.roue(g, G.c2, { m: G.m, Z: n.Z2, rot: th2, fill: "#dfe3ea", repereCoul: "#3b5bdb" });
      D.texte(g, "1", [G.c1[0], G.c1[1] + r1.ra + 26], { taille: 24, coul: C.jeu });
      D.texte(g, "2", [G.c2[0], G.c2[1] + r2.ra + 26], { taille: 24, coul: "#3b5bdb" });
      D.texte(g, "Z1 = " + n.Z1, [G.c1[0], G.c1[1] + r1.ra + 56], { taille: 17, mono: true });
      D.texte(g, "Z2 = " + n.Z2, [G.c2[0], G.c2[1] + r2.ra + 56], { taille: 17, mono: true });
      if (n.fleches) { flecheRot(G.c1, r1.ra + 22, 1, C.jeu); flecheRot(G.c2, r2.ra + 22, -1, "#3b5bdb"); }
      if (n.entraxe) {
        var y = Y - Math.max(r1.ra, r2.ra) - 60;
        D.ligne(g, [G.c1[0], Y], [G.c1[0], y - 10], C.doux, 1.5, "4 4"); D.ligne(g, [G.c2[0], Y], [G.c2[0], y - 10], C.doux, 1.5, "4 4");
        D.fleche(g, [(G.c1[0] + G.c2[0]) / 2, y], [G.c1[0], y], C.encre, 2.5); D.fleche(g, [(G.c1[0] + G.c2[0]) / 2, y], [G.c2[0], y], C.encre, 2.5);
        D.texte(g, "a", [(G.c1[0] + G.c2[0]) / 2, y - 20], { taille: 22 });
      }
      if (n.libre && n.surTour) D.poignee(g, [G.c1[0] + r1.rf * 0.62 * Math.cos(n.th), G.c1[1] - r1.rf * 0.62 * Math.sin(n.th)], C.jeu);
      var t1 = n.th / (2 * Math.PI);
      fig.chip("roue 1 : " + E.fmt(Math.abs(t1), 2) + " tour" + (n.montrer2 ? "    roue 2 : " + E.fmt(Math.abs(t1 * n.Z1 / n.Z2), 2) + " tour" : ""));
    };
    var dernier = null;
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.libre || !n.surTour) return false;
        var G = geo();
        if (Math.hypot(p[0] - G.c1[0], p[1] - G.c1[1]) > G.ra1 + 30) return false;
        dernier = Math.atan2(G.c1[1] - p[1], p[0] - G.c1[0]);
        return true;
      },
      bouge: function (p) {
        if (!n.libre || !n.surTour || dernier === null) return;
        var G = geo(), a = Math.atan2(G.c1[1] - p[1], p[0] - G.c1[0]), d = a - dernier;
        if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
        dernier = a; n.th += d; n.dessin(); n.surTour(n.th);
      },
      fin: function () { dernier = null; }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Un tour", jouer: function (j, n) {
      j.fig.astuce("Fais tourner la roue 1 avec le doigt.");
      j.titre("Dans un réducteur, la roue 1 du moteur entraîne la roue 2. Fais faire un tour complet à la roue 1, dans le sens que tu veux.");
      var fini = false;
      function gagne() {
        fini = true; n.surTour = null; n.libre = false; n.th = 2 * Math.PI; n.dessin();
        j.info("Un tour pour la roue 1. Regarde le repère bleu de la roue 2.");
        j.consigne("Par rapport à la roue 1, la roue 2 tourne :");
        j.choix([{ html: "en sens inverse", juste: true }, { html: "dans le même sens", aide: "Au point de contact, les dents poussent dans la même direction : l'une monte quand l'autre monte, donc les deux centres sont de part et d'autre." }], { colonnes: 2, ok: function () {
          n.fleches = true; n.dessin();
          j.bravo("Deux roues extérieures tournent en sens inverses.");
          j.suite();
        } });
      }
      n.surTour = function (t) { if (!fini && Math.abs(t) >= 2 * Math.PI - 0.05) gagne(); };
      n.dessin();
      j.reponse(function () { if (!fini) gagne(); });
      j.nettoyer(function () { n.surTour = null; });
    } },
    { nom: "Combien de tours ?", jouer: function (j, n) {
      j.fig.astuce("Pendant un tour, les 17 dents de la roue 1 sont passées au point de contact.");
      j.titre("Pendant que la roue 1 fait un tour, combien de tours fait la roue 2 ?");
      j.nombre({ avant: "\\text{tours de la roue 2} =", cases: [{ attendu: 0.85, tol: 0.005 }], ligne: true,
        aide: function () { return "17 dents de la roue 2 passent aussi au contact. Elle en a 20 : quelle fraction de tour ?"; },
        ok: function () {
          n.montrer2 = true; n.dessin();
          j.bravo("17/20 = 0,85 tour.");
          j.expliquer("<p>Les dents passent une à une au point de contact : autant de dents de chaque côté. La roue qui a le plus de dents tourne le moins vite.</p>");
          j.suite();
        } });
    } },
    { nom: "La formule", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Complète le rapport de transmission d'un engrenage extérieur simple.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:22px">\\(i_{12} = \\left|\\dfrac{\\omega_2}{\\omega_1}\\right| = \\left|\\dfrac{n_2}{n_1}\\right| =\\) <span class="trou" data-attendu="d"></span> = <span class="trou" data-attendu="z"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "d2", tex: "\\dfrac{d_2}{d_1}" }, { id: "z", tex: "\\dfrac{Z_1}{Z_2}" }, { id: "d", tex: "\\dfrac{d_1}{d_2}" }, { id: "z2", tex: "\\dfrac{Z_2}{Z_1}" }],
        aide: "Tu viens de trouver 0,85 = 17/20 pour la roue 2 : la roue 1 est au numérateur. Les diamètres suivent les dents (d = mZ).",
        ok: function () {
          j.bravo("\\(i_{12} = d_1/d_2 = Z_1/Z_2\\).");
          j.expliquer("\\[ i_{12} = \\left|\\frac{\\omega_2}{\\omega_1}\\right| = \\left|\\frac{n_2}{n_1}\\right| = \\frac{d_1}{d_2} = \\frac{Z_1}{Z_2} \\]<p>En valeur absolue (le signe dirait le sens). Ici le rapport est sortie sur entrée : il est inférieur à 1 quand l'engrenage réduit la vitesse.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Exemple du cours", jouer: function (j, n) {
      n.entraxe = true; n.dessin();
      j.fig.astuce("Module m = 2 mm.");
      j.titre("\\(m = 2\\) mm, \\(Z_1 = 17\\), \\(Z_2 = 20\\). Diamètres primitifs et entraxe ?");
      j.nombre({ avant: "d_1,\\ d_2,\\ a :", apres: "\\text{mm}", cases: [{ attendu: 34, tol: 0.01 }, { attendu: 40, tol: 0.01 }, { attendu: 37, tol: 0.01 }], ligne: true,
        aide: function (k) { return k < 2 ? "\\(d = mZ\\)." : "Les cercles primitifs se touchent : \\(a = (d_1 + d_2)/2\\)."; },
        ok: function () {
          j.bravo("34 mm, 40 mm, 37 mm ; i = 0,85.");
          j.expliquer("\\[ a = \\frac{d_1 + d_2}{2} = m\\,\\frac{Z_1 + Z_2}{2} = 2 \\times \\frac{17 + 20}{2} = 37 \\text{ mm} \\]");
          j.suite();
        } });
    } },
    { nom: "Viser", jouer: function (j, n) {
      n.Z1 = 15; n.Z2 = 20; n.th = 0; n.montrer2 = false; n.fleches = false; n.entraxe = false; n.dessin();
      j.fig.chip(null);
      j.fig.astuce("Règle le nombre de dents de la roue 2.");
      j.titre("Pignon de 15 dents. Combien de dents pour la roue 2, pour qu'elle tourne 3 fois moins vite ?");
      var fini = false, cur;
      function gagne() {
        fini = true; n.Z2 = 45; n.dessin(); if (cur) { cur.regler(45); cur.input.disabled = true; }
        j.fig.chip("i = 15/45 = 1/3    a = 2 × (15 + 45)/2 = 60 mm");
        j.bravo("45 dents : \\(i_{12} = 15/45 = 1/3\\).");
        j.expliquer("<p>Avec un module de 2 mm, l'entraxe passe à \\(a = 2 \\times (15 + 45)/2 = 60\\) mm : changer le rapport, c'est aussi changer la place que prend l'engrenage.</p>");
        j.suite();
      }
      cur = j.curseur({ nom: "Z₂", min: 15, max: 60, pas: 1, val: 20, change: function (v) { if (fini) return; n.Z2 = v; n.dessin(); j.fig.chip(null); if (v === 45) gagne(); } });
      j.reponse(function () { if (!fini) gagne(); });
    } }
  ]
});
