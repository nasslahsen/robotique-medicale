/* Niveau : anatomie d'un robot. Toucher les parties, rotoïde ou prismatique, lecture d'une chaîne, effecteur médical. */
NIVEAU({
  id: "anatomie",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { q: [60, -50, -40], mode: "bras", allume: null, choisis: {}, surTouche: null, t: 0 };
    var parts = {};
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "bras") {
        var base = [220, 470], L = [170, 140, 50], a = 0, p = [base[0], base[1] - 30], pts = [p];
        E.s("rect", { x: 150, y: 470, width: 140, height: 46, rx: 8, fill: parts.base = "#9aa0ad" }, g);
        E.s("rect", { x: 40, y: 516, width: 600, height: 10, fill: "#d9dde6" }, g);
        D.ligne(g, [base[0], 470], p, "#9aa0ad", 26);
        for (var i = 0; i < 3; i++) { a += n.q[i]; var q = [p[0] + L[i] * Math.cos(a * D.DEG), p[1] - L[i] * Math.sin(a * D.DEG)]; pts.push(q); p = q; }
        D.ligne(g, pts[0], pts[1], "#ff8a5c", 26); D.ligne(g, pts[1], pts[2], "#ff8a5c", 22); D.ligne(g, pts[2], pts[3], "#ffb38f", 16);
        // pince
        var d = [Math.cos(a * D.DEG), -Math.sin(a * D.DEG)], nrm = [-d[1], d[0]], e = pts[3];
        [-1, 1].forEach(function (s) { D.ligne(g, [e[0] + nrm[0] * 14 * s, e[1] + nrm[1] * 14 * s], [e[0] + nrm[0] * 14 * s + d[0] * 34, e[1] + nrm[1] * 14 * s + d[1] * 34], C.encre, 7); });
        D.ligne(g, [e[0] - nrm[0] * 16, e[1] - nrm[1] * 16], [e[0] + nrm[0] * 16, e[1] + nrm[1] * 16], C.encre, 7);
        [0, 1, 2].forEach(function (k) { D.rond(g, pts[k], 15, { fill: "#fff", stroke: C.encre, ep: 4 }); });
        n.cibles = { base: [220, 492], segment: [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2], articulation: pts[1], poignet: pts[2], effecteur: [e[0] + d[0] * 24, e[1] + d[1] * 24] };
        Object.keys(n.choisis).forEach(function (k) {
          var c = n.cibles[k]; D.rond(g, c, 30, { fill: "none", stroke: n.choisis[k] ? C.ok : C.ko, ep: 4 });
          D.texte(g, k, [c[0] + 40, c[1] - 30], { coul: n.choisis[k] ? C.ok : C.ko, taille: 18, ancre: "start" });
        });
      } else {
        // deux articulations côte à côte : rotoïde (A) et prismatique (B)
        var t = n.t, a1 = 30 + 35 * Math.sin(t), d1 = 50 + 40 * Math.sin(t);
        D.texte(g, "A", [180, 120], { taille: 30 }); D.texte(g, "B", [500, 120], { taille: 30 });
        E.s("rect", { x: 140, y: 380, width: 80, height: 40, rx: 6, fill: "#9aa0ad" }, g);
        var o = [180, 360], q2 = [o[0] + 170 * Math.cos(a1 * D.DEG), o[1] - 170 * Math.sin(a1 * D.DEG)];
        D.ligne(g, [180, 380], o, "#9aa0ad", 20); D.ligne(g, o, q2, "#ff8a5c", 22); D.rond(g, o, 16, { fill: "#fff", stroke: C.encre, ep: 4 });
        if (n.labels) { pl0arc(g, o, 60, 0, a1, C.jeu); D.texte(g, "θ", [o[0] + 80, o[1] - 30], { coul: C.jeu, taille: 24 }); }
        E.s("rect", { x: 420, y: 330, width: 170, height: 34, rx: 6, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 420 + d1, y: 300, width: 60, height: 94, rx: 8, fill: "#ff8a5c", stroke: C.encre, "stroke-width": 2 }, g);
        if (n.labels) { D.fleche(g, [430, 420], [420 + d1 + 30, 420], C.jeu, 3); D.texte(g, "d", [430 + d1 / 2, 445], { coul: C.jeu, taille: 24 }); }
      }
    };
    function pl0arc(g, o, r, a0, a1, coul) {
      var p0 = [o[0] + r * Math.cos(a0 * D.DEG), o[1] - r * Math.sin(a0 * D.DEG)], p1 = [o[0] + r * Math.cos(a1 * D.DEG), o[1] - r * Math.sin(a1 * D.DEG)];
      E.s("path", { d: "M" + p0 + " A" + r + " " + r + " 0 0 " + (a1 > a0 ? 0 : 1) + " " + p1, fill: "none", stroke: coul, "stroke-width": 3 }, g);
    }
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche || n.mode !== "bras") return false;
        var best = null, dmin = 70;
        Object.keys(n.cibles).forEach(function (k) { var c = n.cibles[k], d = Math.hypot(p[0] - c[0], p[1] - c[1]); if (d < dmin) { dmin = d; best = k; } });
        if (best) n.surTouche(best);
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Toucher", jouer: function (j, n) {
      j.fig.astuce("Touche les parties du robot sur la figure.");
      var ordre = [["effecteur", "l'<b>effecteur</b> : l'outil au bout du robot"], ["poignet", "le <b>poignet</b> : les articulations terminales qui orientent l'outil"], ["articulation", "une <b>articulation</b> entre deux segments (le coude)"], ["segment", "un <b>segment</b> : une pièce rigide entre deux articulations"]];
      var k = 0, consigne = null;
      j.titre("Touche les parties du robot, une à une.");
      consigne = j.consigne("");
      function poser() { consigne.innerHTML = "Touche " + ordre[k][1] + "."; }
      poser();
      n.surTouche = function (id) {
        if (id === ordre[k][0]) {
          n.choisis[id] = true; n.dessin(); k++;
          if (k < ordre.length) { j.info("Oui. Suivant."); poser(); }
          else {
            n.surTouche = null; consigne.innerHTML = "";
            j.bravo("Base, segments, articulations, poignet, effecteur : tout est repéré.");
            j.expliquer("<p>Un robot est une succession de <b>segments</b> rigides reliés par des <b>articulations</b>, fixée sur une <b>base</b>. Chaque articulation définit un <b>axe</b> : la direction de son mouvement. Le <b>poignet</b> oriente l'<b>effecteur</b> (organe terminal), l'outil qui fait la tâche.</p>");
            j.suite();
          }
        } else { n.choisis[id] = false; n.dessin(); setTimeout(function () { delete n.choisis[id]; n.dessin(); }, 900); j.erreur("Ça, c'est " + (id === "base" ? "la base" : id === "segment" ? "un segment" : id === "articulation" ? "une articulation" : id === "poignet" ? "le poignet" : "l'effecteur") + "."); }
      };
    } },
    { nom: "R ou P", jouer: function (j, n) {
      n.mode = "joints"; n.choisis = {};
      var anim = setInterval(function () { n.t += 0.06; n.dessin(); }, 50); j.nettoyer(function () { clearInterval(anim); });
      j.fig.astuce("Deux articulations en mouvement.");
      j.titre("Laquelle est une articulation prismatique ?");
      j.choix([{ html: "A", aide: "A tourne autour d'un axe : c'est une rotoïde (R)." }, { html: "B", juste: true }], { ok: function () {
        n.labels = true;
        j.bravo("B glisse le long d'un axe : prismatique (P).");
        j.expliquer("<p>Une articulation <b>rotoïde (R)</b> produit un mouvement angulaire ; sa variable est un angle \\(\\theta_i\\). Une articulation <b>prismatique (P)</b> produit un mouvement linéaire ; sa variable est une distance \\(d_i\\). Un robot cartésien est P-P-P, un robot articulé R-R-R-R-R-R, un SCARA mélange R et P.</p>");
        j.suite();
      } });
    } },
    { nom: "Lire une chaîne", jouer: function (j, n) {
      n.mode = "bras"; n.dessin();
      j.fig.astuce("");
      j.titre("Complète la lecture d'une chaîne robotique.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:19px"><span class="trou" data-attendu="s"></span><span>→</span><span class="trou" data-attendu="a"></span><span>→</span><span class="trou" data-attendu="t"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", tex: "\\text{Articulation}_i" }, { id: "t", tex: "\\text{Segment}_{i+1}" }, { id: "s", tex: "\\text{Segment}_i" }],
        aide: "Un segment, puis l'articulation qui le relie au suivant, puis le segment suivant.",
        ok: function () { j.bravo("\\(\\text{Segment}_i \\rightarrow \\text{Articulation}_i \\rightarrow \\text{Segment}_{i+1}\\)."); j.suite(); }
      });
    } },
    { nom: "Effecteur médical", jouer: function (j, n) {
      j.titre("Un robot chirurgical doit refermer une plaie par des points de suture. Quel effecteur monter au poignet ?");
      j.choix([{ html: "Ventouse", aide: "Une ventouse saisit des pièces lisses : c'est un effecteur industriel." }, { html: "Porte-aiguille", juste: true }, { html: "Caméra endoscopique", aide: "Elle sert à voir, pas à coudre." }], { ok: function () {
        j.bravo("Le porte-aiguille, pour la suture.");
        j.expliquer("<p>Le choix de l'effecteur dépend de la tâche. En médecine : pince (préhension de tissus), ciseaux (section), porte-aiguille (suture), caméra endoscopique (visualisation), instrument de biopsie (prélèvement), électrode de coagulation. Ces outils sont interchangeables au poignet.</p>");
        j.suite();
      } });
    } }
  ]
});
