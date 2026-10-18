/* Niveau : modules en MPa et GPa, puissances de 10, échelle logarithmique (log Er). */
NIVEAU({
  id: "echelle-log",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), gh = E.s("g", null, fig.svg);
    var X0 = 300, Y5 = 560, u = 60; // une décade = 60 px, de 10^5 à 10^12 Pa
    var pl = { P: function (v) { return [X0 + v[0] * u, Y5 - (v[1] - 5) * u]; }, U: function (p) { return [(p[0] - X0) / u, 5 + (Y5 - p[1]) / u]; } };
    var MAT = {
      caout: { nom: "caoutchouc", lg: 6, coul: "#8b3fd9", dy: 0 },
      poly: { nom: "plastique rigide", lg: 9, coul: "#3b5bdb", dy: 0 },
      ti: { nom: "Ti-6Al-4V (110 GPa)", lg: Math.log10(110e9), coul: "#5b6172", dy: 14 },
      acier: { nom: "acier (207 GPa)", lg: Math.log10(207e9), coul: C.encre, dy: -14 }
    };
    var n = { pl: pl, lv: 7, libre: true, curseurVis: true, montres: [], chute: false, surLv: null };
    n.dessin = function () {
      E.vider(g); E.vider(gh);
      D.fleche(g, pl.P([0, 4.7]), pl.P([0, 12.3]), C.encre, 4);
      D.texte(g, "module E (Pa)", [X0 + 22, 118], { taille: 18, ancre: "start" });
      var noms = { 6: "1 MPa", 9: "1 GPa" };
      for (var k = 5; k <= 12; k++) {
        var p = pl.P([0, k]);
        D.ligne(g, [p[0] - 14, p[1]], [p[0] + 14, p[1]], C.encre, 3);
        D.texte(g, "10", [p[0] - 50, p[1] + 4], { taille: 22, ancre: "end", mono: true });
        D.texte(g, String(k), [p[0] - 48, p[1] - 9], { taille: 15, ancre: "start", mono: true });
        D.texte(g, "log E = " + k, [p[0] - 120, p[1] + 2], { taille: 16, coul: C.gris, ancre: "end", gras: false });
        if (noms[k]) D.texte(g, noms[k], [p[0] + 24, p[1] - 15], { taille: 15, coul: C.doux, ancre: "start", gras: false });
        if (k < 12) for (var m = 2; m < 10; m++) { var q = pl.P([0, k + Math.log10(m)]); D.ligne(g, [q[0] - 6, q[1]], [q[0] + 6, q[1]], C.gris, 1.5); }
      }
      n.montres.forEach(function (id) {
        var M = MAT[id], q = pl.P([0, M.lg]);
        D.rond(g, q, 9, { fill: M.coul, stroke: "#fff", ep: 2.5 });
        D.ligne(g, q, [q[0] + 110, q[1]], M.coul, 2, "4 4");
        D.ligne(g, [q[0] + 110, q[1]], [q[0] + 124, q[1] + M.dy], M.coul, 2);
        D.texte(g, M.nom, [q[0] + 130, q[1] + M.dy], { taille: 18, coul: M.coul, ancre: "start" });
      });
      if (n.chute) {
        var a = pl.P([0, 9]), b = pl.P([0, 6]);
        D.fleche(g, [a[0] + 230, a[1]], [b[0] + 230, b[1]], C.jeu, 5);
        D.texte(g, "passage de Tg", [a[0] + 242, (a[1] + b[1]) / 2], { taille: 17, coul: C.jeu, ancre: "start" });
      }
      if (n.curseurVis) {
        var c = pl.P([0, n.lv]);
        D.ligne(g, [c[0], c[1]], [c[0] + 70, c[1]], C.jeu, 4);
        if (n.libre) D.poignee(gh, [c[0] + 70, c[1]], C.jeu); else D.rond(gh, [c[0] + 70, c[1]], 11, { fill: C.jeu, stroke: "#fff", ep: 3 });
        var E0 = Math.pow(10, n.lv);
        fig.chip("E = " + (E0 >= 1e9 ? E.fmt(E0 / 1e9, E0 >= 1e10 ? 0 : 2) + " GPa" : E0 >= 1e6 ? E.fmt(E0 / 1e6, E0 >= 1e7 ? 0 : 2) + " MPa" : E.fmt(E0 / 1e3, 0) + " kPa"));
      } else fig.chip(null);
    };
    D.glisser(fig.svg, {
      debut: function () { return n.libre && n.curseurVis; },
      bouge: function (p) { if (!n.libre) return; n.lv = Math.max(5, Math.min(12, Math.round(pl.U(p)[1] * 20) / 20)); n.dessin(); },
      fin: function () { if (n.libre && n.surLv) n.surLv(n.lv); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Placer 1 GPa", jouer: function (j, n) {
      j.fig.astuce("Axe logarithmique : chaque graduation principale vaut 10 fois la précédente.");
      j.titre("Les plastiques rigides ont un module d'environ 1 GPa. Glisse le curseur à cette valeur.");
      n.surLv = function (v) {
        if (Math.abs(v - 9) > 0.06) { j.erreur("1 GPa = 1 000 000 000 Pa = 10⁹ Pa : cherche la graduation 10⁹."); return; }
        n.surLv = null; n.libre = false; n.lv = 9; n.montres = ["poly"]; n.dessin();
        j.bravo("10⁹ Pa : log E = 9.");
        j.expliquer("<p>1 MPa = 10⁶ Pa et 1 GPa = 10⁹ Pa. Sur un axe logarithmique, on place \\(\\log E\\) : chaque pas d'une unité multiplie le module par 10. C'est ainsi que le cours trace \\(\\log E_r\\) en fonction de la température.</p>");
        j.suite();
      };
      j.reponse(function () { n.lv = 9; if (n.surLv) n.surLv(9); });
    } },
    { nom: "Caoutchouc et plastique", jouer: function (j, n) {
      n.curseurVis = false; n.montres = ["caout", "poly"]; n.dessin();
      j.fig.astuce("Le cours : E ≈ 1 MPa pour un élastomère, contre 1 GPa pour les plastiques.");
      j.titre("Combien de fois un plastique rigide est-il plus rigide qu'un caoutchouc, et combien de décades les séparent ?");
      j.nombre({ avant: "\\text{rapport, puis nombre de décades :}", cases: [{ attendu: 1000, tol: 0 }, { attendu: 3, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Divise 10⁹ Pa par 10⁶ Pa." : "Une décade = un facteur 10. Compte les graduations entre 10⁶ et 10⁹."; },
        ok: function () {
          j.bravo("1 000 fois, soit 3 décades.");
          j.suite();
        } });
    } },
    { nom: "Lire 9,48", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le corrigé du TD 1.1 écrit log Er = 9,48 pour la zone vitreuse. Que vaut Er en GPa ?");
      j.nombre({ avant: "E_r = 10^{9{,}48}\\ \\text{Pa} \\approx", apres: "\\text{GPa}", cases: [{ attendu: 3, tol: 0.1 }], ligne: true,
        aide: function () { return "10^9,48 = 10^9 × 10^0,48, et 10^0,48 ≈ 3."; },
        ok: function () {
          n.curseurVis = true; n.libre = false; n.lv = 9.48; n.dessin();
          j.bravo("Environ 3 GPa : la valeur du plateau vitreux.");
          j.suite();
        } });
    } },
    { nom: "Une chute de 3", jouer: function (j, n) {
      n.curseurVis = false; n.chute = true; n.dessin();
      j.titre("En passant Tg, log Er tombe de 9 à 6. Par combien le module est-il divisé ?");
      j.choix([{ html: "Par 3", aide: "On a perdu 3 unités de log, pas 3 unités de module." }, { html: "Par 1 000", juste: true }, { html: "Par 30", aide: "Chaque unité de log est un facteur 10 : 10 × 10 × 10." }], { ok: function () {
        j.bravo("Par 10³ = 1 000 : de 1 GPa à 1 MPa.");
        j.expliquer("<p>Sur une échelle logarithmique, une différence de \\(\\log\\) est un rapport : \\(\\log E_1 - \\log E_2 = \\log (E_1 / E_2)\\). Une chute de 3 unités divise le module par 1 000.</p>");
        j.suite();
      } });
    } },
    { nom: "Ranger par rigidité", jouer: function (j, n) {
      n.chute = false; n.montres = ["caout", "poly", "ti", "acier"]; n.dessin();
      j.titre("Range du moins rigide au plus rigide.");
      var t = function (a, l) { return "<span>" + l + '</span><span class="trou" data-attendu="' + a + '" style="min-width:190px"></span>'; };
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto auto;gap:8px 12px;align-items:center;justify-content:start">' + t("c", "1. le moins rigide") + t("p", "2.") + t("t", "3.") + t("a", "4. le plus rigide") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "t", html: "Ti-6Al-4V" }, { id: "c", html: "Caoutchouc" }, { id: "a", html: "Acier" }, { id: "p", html: "Plastique rigide" }],
        aide: "Lis la position de chaque matériau sur l'axe : plus il est haut, plus il est rigide.",
        ok: function () {
          j.bravo("Du MPa à la centaine de GPa : cinq décades.");
          j.expliquer("<p>Les modules des matériaux couvrent plusieurs puissances de 10 : on ne peut les comparer que sur une échelle logarithmique. Les valeurs du titane (110 GPa) et de l'acier (207 GPa) viennent du tableau du cours.</p>");
          j.suite();
        }
      });
    } }
  ]
});
