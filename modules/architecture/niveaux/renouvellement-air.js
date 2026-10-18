/* Niveau : renouvellement d'air (diapo 30) et distribution de l'air (diapo 31). */
NIVEAU({
  id: "renouvellement-air",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg), ga = A.s("g", null, fig.svg);
    var n = { mode: "cta", debit: 1890, config: null, u: 0, g: g, pl: { P: function (v) { return v; } } };
    n.V = A.calc.volume(7, 6, 3);
    n.dessin = function () {
      A.vider(g); A.vider(ga);
      fig.chip(null);
      if (n.mode === "salle") {
        // salle en perspective simple, cotée
        var x0 = 150, y0 = 180, w = 330, h = 220, dx = 90, dy = -70;
        A.s("path", { d: "M" + x0 + " " + y0 + " l" + dx + " " + dy + " h" + w + " l" + (-dx) + " " + (-dy) + " Z", fill: "#eef2f7", stroke: C.encre, "stroke-width": 3 }, g);
        A.s("path", { d: "M" + (x0 + w) + " " + y0 + " l" + dx + " " + dy + " v" + h + " l" + (-dx) + " " + (-dy) + " Z", fill: "#e3e8f0", stroke: C.encre, "stroke-width": 3 }, g);
        A.s("rect", { x: x0, y: y0, width: w, height: h, fill: "#f7f9fc", stroke: C.encre, "stroke-width": 3 }, g);
        A.texte(g, "7 m", [x0 + w / 2, y0 + h + 26], { taille: 18, mono: true });
        A.texte(g, "6 m", [x0 + w + dx / 2 + 14, y0 + h + dy / 2 + 14], { taille: 18, mono: true, ancre: "start" });
        A.texte(g, "3 m", [x0 - 14, y0 + h / 2], { taille: 18, mono: true, ancre: "end" });
        A.fleche(g, [100, 110], [200, 150], { coul: C.acc, ep: 5 });
        A.texte(g, "air soufflé : " + String(n.debit).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " m³/h", [96, 92], { taille: 17, coul: C.acc, ancre: "start" });
        A.texte(g, "Salle d'exemple (exemple ajouté)", [340, 560], { taille: 15, coul: C.doux });
        if (n.montreAch) fig.chip(E.fmt(A.calc.ach(n.debit, n.V), 1) + " renouvellements/h");
      } else if (n.mode === "distribution") {
        var cfg = [["A", "Soufflage au plafond, extraction près du sol"], ["B", "Soufflage près du sol, extraction au plafond"], ["C", "Soufflage par un mur, extraction par le mur opposé"]];
        cfg.forEach(function (c, i) {
          var x = 24 + i * 214, y = 70, w = 200, h = 300, sel = n.config === i;
          A.s("rect", { x: x, y: y, width: w, height: h, rx: 10, fill: "#fff", stroke: sel ? (i === 0 ? C.ok : C.ko) : C.encre, "stroke-width": sel ? 5 : 3 }, g);
          A.s("rect", { x: x + 70, y: y + 210, width: 60, height: 14, fill: C.doux }, g);
          A.s("circle", { cx: x + 80, cy: y + 202, r: 9, fill: "#f6c2b0" }, g);
          // bouches : soufflage (bleu) et extraction (gris)
          var sf = i === 0 ? [[x + 40, y + 6, x + 160, y + 6]] : i === 1 ? [[x + 6, y + h - 10, x + 60, y + h - 10]] : [[x + 4, y + 60, x + 4, y + 160]];
          var ex = i === 0 ? [[x + 6, y + h - 30, x + 6, y + h - 6], [x + w - 6, y + h - 30, x + w - 6, y + h - 6]] : i === 1 ? [[x + 140, y + 6, x + 194, y + 6]] : [[x + w - 4, y + 140, x + w - 4, y + 240]];
          sf.forEach(function (q) { A.s("line", { x1: q[0], y1: q[1], x2: q[2], y2: q[3], stroke: C.acc, "stroke-width": 9 }, g); });
          ex.forEach(function (q) { A.s("line", { x1: q[0], y1: q[1], x2: q[2], y2: q[3], stroke: C.gris, "stroke-width": 9 }, g); });
          A.texte(g, c[0], [x + w / 2, y + h + 30], { taille: 24, gras: 800 });
          A.texte(g, c[1], [x + w / 2, y + h + 82], { taille: 14, largeur: 190, coul: C.doux });
          A.cible(g, x, y, w, h + 120, function () { if (n.surConfig) n.surConfig(i); });
        });
        A.s("line", { x1: 120, y1: 560, x2: 160, y2: 560, stroke: C.acc, "stroke-width": 9 }, g); A.texte(g, "soufflage d'air filtré", [168, 560], { taille: 14, ancre: "start" });
        A.s("line", { x1: 380, y1: 560, x2: 420, y2: 560, stroke: C.gris, "stroke-width": 9 }, g); A.texte(g, "extraction", [428, 560], { taille: 14, ancre: "start" });
        n.fleches();
      } else {
        // centrale de traitement d'air : quatre airs
        A.boite(g, 196, 230, 190, 140, { fond: C.fond, bord: C.encre, titre: "Centrale de traitement d'air", taille: 17 });
        A.boite(g, 470, 180, 190, 240, { fond: "#fff", bord: C.encre, titre: "Salle", taille: 18 });
        A.fleche(g, [40, 260], [192, 260], { coul: C.ok, ep: 5 }); A.texte(g, "1", [116, 238], { taille: 20, gras: 800, coul: C.ok });
        A.fleche(g, [390, 300], [466, 300], { coul: C.acc, ep: 5 }); A.texte(g, "2", [428, 278], { taille: 20, gras: 800, coul: C.acc });
        A.chemin(g, [[560, 422], [560, 470], [291, 470], [291, 374]], { coul: C.v, ep: 5 }); A.texte(g, "3", [430, 492], { taille: 20, gras: 800, coul: C.v });
        A.chemin(g, [[620, 178], [620, 120], [40, 120]], { coul: C.gris, ep: 5 }); A.texte(g, "4", [330, 100], { taille: 20, gras: 800, coul: C.doux });
        A.texte(g, "extérieur", [40, 300], { taille: 15, coul: C.doux, ancre: "start" });
      }
    };
    n.fleches = function () {
      A.vider(ga);
      if (n.config === null || n.config === undefined) return;
      var x = 24 + n.config * 214, y = 70;
      if (n.u >= 1) {
        if (n.config === 0) [x + 60, x + 100, x + 140].forEach(function (q) { A.fleche(ga, [q, y + 30], [q, y + 180], { coul: C.acc, ep: 4 }); });
        if (n.config === 1) A.fleche(ga, [x + 40, y + 270], [x + 100, y + 40], { coul: C.ko, ep: 4 });
        if (n.config === 2) A.fleche(ga, [x + 20, y + 110], [x + 180, y + 190], { coul: C.ko, ep: 4 });
        return;
      }
      if (n.config === 0) [[x + 60], [x + 100], [x + 140]].forEach(function (q) { A.souffle(ga, [q[0], y + 24], [q[0], y + 190], n.u, { nb: 1 }); });
      if (n.config === 1) A.souffle(ga, [x + 40, y + 280], [x + 100, y + 30], n.u, { nb: 3, coul: C.ko });
      if (n.config === 2) A.souffle(ga, [x + 20, y + 110], [x + 190, y + 190], n.u, { nb: 3, coul: C.ko });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Quatre airs", jouer: function (j, n) {
      j.titre("Le cours distingue quatre airs. Associe chaque flèche numérotée de la figure à son nom.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center"><b>1 · pris dehors</b><span class="trou" data-attendu="n"></span><b>2 · soufflé après les filtres</b><span class="trou" data-attendu="f"></span><b>3 · repris dans la salle, renvoyé à la centrale</b><span class="trou" data-attendu="r"></span><b>4 · aspiré hors de la salle et rejeté</b><span class="trou" data-attendu="e"></span></div>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "e", html: "Air extrait" }, { id: "n", html: "Air neuf" }, { id: "r", html: "Air recyclé" }, { id: "f", html: "Air filtré" }],
        aide: "Neuf : il vient de dehors. Filtré : il a traversé les filtres. Recyclé : il a déjà servi et repasse par la centrale. Extrait : il sort de la salle pour de bon.",
        ok: function () { j.bravo("Air neuf, air filtré, air recyclé, air extrait."); j.suite(); }
      });
    } },
    { nom: "Calculer les renouvellements", jouer: function (j, n) {
      n.mode = "salle"; n.debit = 1890; n.montreAch = false; n.dessin();
      j.titre("Une salle de 7 m × 6 m × 3 m reçoit 1 890 m³ d'air par heure. Combien de fois son volume est-il renouvelé par heure ?");
      j.consigne("Calcule d'abord le volume, puis le nombre de renouvellements par heure (ACH).");
      j.nombre({ avant: "V =", apres: "\\text{m}^3", cases: [{ attendu: 126, tol: 0.001 }], ligne: true,
        aide: function () { return "Volume = longueur × largeur × hauteur."; },
        ok: function () {
          [].forEach.call(j.el.querySelectorAll(".nombres, .clavier"), function (e) { e.remove(); });
          j.info("Volume : 126 m³. Maintenant le nombre de renouvellements par heure.");
          j.nombre({ avant: "\\text{ACH} =", cases: [{ attendu: 15, tol: 0.01 }], ligne: true,
            aide: function () { return "ACH = débit d'air soufflé (m³/h) ÷ volume (m³)."; },
            ok: function () {
              n.montreAch = true; n.dessin();
              j.bravo("126 m³ et 15 renouvellements par heure.");
              j.expliquer("\\[ \\text{ACH} = \\frac{\\text{débit d'air soufflé (m}^3/\\text{h)}}{\\text{volume de la salle (m}^3)} = \\frac{1\\,890}{126} = 15 \\]<p>Formule ajoutée au cours pour s'entraîner (ACH : air changes per hour). 15 ACH, c'est l'ordre de grandeur que le CDC mentionne pour les systèmes conventionnels.</p>");
              j.suite();
            } });
        } });
    } },
    { nom: "Viser plus de 22 ACH", jouer: function (j, n) {
      n.mode = "salle"; n.debit = 1890; n.montreAch = true; n.libre = true; n.dessin();
      j.titre("Les recommandations 2026 de la Healthcare Infection Society demandent de concevoir les systèmes pour permettre plus de 22 ACH. Règle le débit de la même salle.");
      var c = j.curseur({ nom: "Débit", min: 1500, max: 3500, pas: 50, val: 1890, unite: " m³/h", change: function (v) {
        if (!n.libre) return;
        n.debit = v; n.dessin();
        if (ARCHI.calc.ach(v, n.V) > 22) fini();
      } });
      function fini() {
        n.libre = false;
        j.bravo("Plus de 22 ACH : il faut plus de 2 772 m³/h pour 126 m³.");
        j.expliquer("<p>Pourquoi viser plus haut que 15 ? La HIS veut tenir compte de la <b>dégradation des performances dans le temps</b> : filtres qui s'encrassent, réglages qui dérivent. On dimensionne avec une marge pour rester au niveau voulu pendant des années.</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(2800); n.debit = 2800; n.dessin(); fini(); });
    } },
    { nom: "Le chiffre isolé", jouer: function (j, n) {
      j.titre("Sur sa fiche, un étudiant a écrit : « Salle d'opération : 15 renouvellements par heure. » Qu'en dit le cours ?");
      j.choix([
        { html: "C'est la valeur universelle", aide: "Le cours cite au moins deux valeurs, selon les références." },
        { html: "Il ne faut pas retenir un chiffre isolé sans préciser le référentiel utilisé", juste: true },
        { html: "C'est faux : la seule bonne valeur est 22", aide: "22 vient d'un référentiel précis, la HIS 2026 ; le CDC mentionne environ 15 pour les systèmes conventionnels." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Toujours associer le chiffre à son référentiel.");
        j.expliquer("<p>Certaines références historiques indiquent environ <b>15 renouvellements d'air par heure minimum</b> pour les salles conventionnelles, d'autres référentiels de conception utilisent des valeurs supérieures. Le CDC mentionne environ 15 ACH pour les systèmes conventionnels ; la HIS 2026 demande de concevoir pour <b>plus de 22 ACH</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Distribuer l'air", jouer: function (j, n) {
      n.mode = "distribution"; n.config = null; n.dessin();
      j.titre("Trois façons de distribuer l'air dans la salle. Laquelle est le principe classique décrit par le CDC pour les salles conventionnelles ? Touche-la.");
      n.surConfig = function (i) {
        n.config = i; n.u = 0; n.dessin();
        ARCHI.animer(2400, function (u) { n.u = u; n.fleches(); });
        if (i === 1) { j.erreur("L'air propre arrive par le sol et repart au plafond : il remonte la poussière du sol vers le champ opératoire."); return; }
        if (i === 2) { j.erreur("L'air balaie la salle de côté : il emporte vers la plaie ce qu'il ramasse en chemin."); return; }
        n.surConfig = null;
        j.bravo("Air filtré introduit par le plafond, extrait près du sol.");
        j.expliquer("<p>L'air propre descend sur la zone opératoire et pousse les particules vers le bas, où elles sont extraites. C'est la configuration que le CDC décrit notamment pour les salles opératoires conventionnelles.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surConfig) n.surConfig(0); });
    } }
  ]
});
