/* Niveau : monocouche unidirectionnelle, directions L/T/3, isotrope (2 constantes) ou orthotrope (9, puis 4 en plaque mince). */
NIVEAU({
  id: "isotrope-orthotrope",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    // pli carbone-époxy illustratif (exemple ajouté) : EL = 140, ET = 10, GLT = 5 GPa, νLT = 0,3
    var EL = 140, ET = 10, G = 5, nu = 0.3;
    function Etheta(t) { var c = Math.cos(t * D.DEG), s = Math.sin(t * D.DEG); return 1 / (Math.pow(c, 4) / EL + (1 / G - 2 * nu / EL) * s * s * c * c + Math.pow(s, 4) / ET); }
    var n = { theta: 60, libre: true, mode: "pli", Etheta: Etheta };
    n.dessin = function () {
      E.vider(g);
      var cx = n.mode === "pli" ? 300 : 340, cy = 300;
      if (n.mode === "pli") {
        // pli vu de dessus, fibres horizontales
        E.s("rect", { x: cx - 170, y: cy - 130, width: 340, height: 260, rx: 10, fill: "#f6efe0", stroke: C.encre, "stroke-width": 2.5 }, g);
        for (var k = 0; k < 13; k++) D.ligne(g, [cx - 160, cy - 120 + k * 20], [cx + 160, cy - 120 + k * 20], C.jeu, 4);
        var t = n.theta * D.DEG, L = 230;
        D.fleche(g, [cx, cy], [cx + L * Math.cos(t), cy - L * Math.sin(t)], "#3b5bdb", 7);
        D.fleche(g, [cx, cy], [cx - L * Math.cos(t), cy + L * Math.sin(t)], "#3b5bdb", 7);
        D.texte(g, "F", [cx + (L + 24) * Math.cos(t), cy - (L + 24) * Math.sin(t)], { taille: 24, coul: "#3b5bdb" });
        // jauge du module dans la direction de la charge
        var e = Etheta(n.theta), x0 = 80, w = 520;
        D.texte(g, "module dans la direction de F", [x0, 500], { taille: 17, ancre: "start" });
        E.s("rect", { x: x0, y: 516, width: w, height: 22, rx: 8, fill: "#eef0f5" }, g);
        E.s("rect", { x: x0, y: 516, width: w * e / EL, height: 22, rx: 8, fill: C.jeu }, g);
        D.texte(g, E.fmt(e, 0) + " GPa", [x0 + w, 500], { taille: 18, ancre: "end", mono: true });
        fig.chip("angle de la charge : " + Math.round(n.theta) + "°");
      } else {
        // monocouche en perspective avec ses axes
        var P = function (x, y, z) { return [cx + x + y * 0.6, cy + 40 - z - y * 0.5]; };
        var R = 140, W = 190, T = 34;
        E.s("polygon", { points: [P(-W, -R, 0), P(W, -R, 0), P(W, -R, -T), P(-W, -R, -T)].join(" "), fill: "#e8dcc2", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("polygon", { points: [P(W, -R, 0), P(W, R, 0), P(W, R, -T), P(W, -R, -T)].join(" "), fill: "#ddd0b2", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("polygon", { points: [P(-W, -R, 0), P(W, -R, 0), P(W, R, 0), P(-W, R, 0)].join(" "), fill: "#f6efe0", stroke: C.encre, "stroke-width": 2 }, g);
        for (var i = -R + 20; i < R; i += 25) D.ligne(g, P(-W + 6, i, 0), P(W - 6, i, 0), C.jeu, 3.5);
        for (i = -R + 20; i < R; i += 25) D.rond(g, P(W, i, -T / 2), 6, { fill: PLATEFORME.teinte(0.8), stroke: C.encre, ep: 1 });
        D.fleche(g, P(0, 0, 0), P(255, 0, 0), C.x, 6); D.texte(g, "a", P(278, 0, 0), { taille: 26, coul: C.x });
        D.fleche(g, P(0, 0, 0), P(0, 250, 0), C.y, 6); D.texte(g, "b", P(0, 275, 0), { taille: 26, coul: C.y });
        D.fleche(g, P(0, 0, 0), P(0, 0, 200), C.z, 6); D.texte(g, "c", P(0, 0, 226), { taille: 26, coul: C.z });
        fig.chip(null);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Tirer dans le bon sens", jouer: function (j, n) {
      j.fig.astuce("Un pli de fibres alignées (orange), exemple ajouté. Tourne la charge F.");
      j.titre("Dans quelle direction ce pli est-il le plus rigide ? Règle l'angle de la charge.");
      var c = j.curseur({ nom: "angle", min: 0, max: 90, pas: 5, val: 60, unite: "°", change: function (v) {
        if (!n.libre) { c.regler(0); return; }
        n.theta = v; n.dessin(); if (v === 0) gagne();
      } });
      function gagne() {
        n.libre = false; n.theta = 0; n.dessin();
        j.bravo("À 0°, le long des fibres : 140 GPa, contre 10 GPa en travers.");
        j.expliquer("<p>Le module dépend de la direction : le pli n'est pas isotrope. La <b>monocouche unidirectionnelle</b> est le <b>pli</b> de base des composites stratifiés : on empile des plis orientés à 0°, ±θ, 90°.</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(0); gagne(); });
    } },
    { nom: "Nommer les directions", jouer: function (j, n) {
      n.libre = true; n.mode = "axes"; n.dessin();
      j.fig.astuce("Les fibres sont parallèles à l'axe a.");
      j.titre("Associe chaque axe du dessin à son nom dans le cours.");
      var t = function (a, l) { return "<span>axe " + l + '</span><span class="trou" data-attendu="' + a + '" style="min-width:220px"></span>'; };
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto auto;gap:8px 12px;align-items:center;justify-content:start">' + t("L", "a") + t("T", "b") + t("3", "c") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "T", html: "transverse T ou 2" }, { id: "3", html: "épaisseur : 3" }, { id: "L", html: "longitudinale L ou 1" }],
        aide: "L (ou 1) suit les fibres, T (ou 2) est perpendiculaire aux fibres dans le plan du pli, 3 traverse l'épaisseur.",
        ok: function () { j.bravo("L ou 1, T ou 2, et 3."); j.suite(); }
      });
    } },
    { nom: "Combien de constantes ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Combien de constantes élastiques indépendantes pour : un matériau isotrope, une monocouche orthotrope (1, 2, 3), un stratifié mince calculé en 2D ?");
      j.nombre({ cases: [{ attendu: 2, tol: 0 }, { attendu: 9, tol: 0 }, { attendu: 4, tol: 0 }], ligne: true,
        aide: function (k) { return ["Isotrope : E, ν et G, mais l'une se déduit des deux autres.", "Le cours donne ce nombre pour la monocouche orthotrope dans ses trois axes.", "En 2D : EL, ET, GLT et νLT."][k]; },
        ok: function () {
          j.bravo("2, 9 et 4.");
          j.expliquer("<p>Isotrope : deux constantes parmi \\(E\\), \\(\\nu\\), \\(G\\), avec \\(G = E/(2(1+\\nu))\\). Plaque mince orthotrope : \\(E_L\\) (ou \\(E_{11}\\)), \\(E_T\\) (ou \\(E_{22}\\)), \\(G_{LT}\\) (ou \\(G_{12}\\)) et le coefficient de Poisson majeur \\(\\nu_{LT}\\) (ou \\(\\nu_{12}\\)).</p>");
          j.suite();
        } });
    } },
    { nom: "La troisième constante", jouer: function (j, n) {
      j.titre("Un alliage isotrope a E = 200 GPa et G = 80 GPa. Que vaut ν ?");
      j.nombre({ avant: "\\nu =", cases: [{ attendu: 0.25, tol: 0.005 }], ligne: true,
        aide: function () { return "De G = E / (2(1 + ν)) : 1 + ν = E / (2G)."; },
        ok: function () { j.bravo("1 + ν = 200 / 160 = 1,25, donc ν = 0,25."); j.suite(); } });
    } },
    { nom: "Trouver l'erreur", jouer: function (j, n) {
      j.titre("La diapo écrit : « Module transversal, perpendiculaire aux fibres (direction L ou 1) : ET ou E22 ». Qu'est-ce qui cloche ?");
      j.choix([
        { html: "La direction : c'est T ou 2", juste: true },
        { html: "Le nom : c'est EL", aide: "EL est le module le long des fibres ; ici on parle bien du module perpendiculaire." },
        { html: "Rien, c'est juste", aide: "Perpendiculaire aux fibres, peut-on être dans la direction des fibres ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("Une coquille recopiée de la ligne du dessus : ET se mesure dans la direction T ou 2.");
        j.suite();
      } });
    } }
  ]
});
