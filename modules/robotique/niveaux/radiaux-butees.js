/* Niveau : roulements radiaux et butées. Nature des charges, angle de contact α, limite de 45°, vitesse. */
NIVEAU({
  id: "radiaux-butees",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "montage", alpha: 10, revele: false };

    function montage() {
      var yc = 330, r = 46, h = 84, l = 84, xs = [190, 500];
      // carter en coupe
      [-1, 1].forEach(function (s) {
        var y0 = s < 0 ? yc - r - h - 40 : yc + r + h;
        xs.forEach(function (x) { E.s("rect", { x: x - 80, y: y0, width: 160, height: 40, fill: MECA.hachures(g, "#9aa0ad", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g); });
      });
      MECA.arbre(g, 70, 610, yc, r);
      xs.forEach(function (x, i) {
        [1, -1].forEach(function (s) { MECA.roulement(g, x, yc - s * r, l, h, { type: i === 0 ? "rouleaux" : "billes", sens: s, surligne: n.revele && i === 0 ? "element" : null, surligneCoul: D.C.jeu }); });
      });
      // charges
      D.fleche(g, [345, 120], [345, yc - r - 4], C.x, 8); D.texte(g, "charge radiale", [360, 135], { ancre: "start", coul: C.x, taille: 19 });
      D.fleche(g, [10, yc], [66, yc], C.x, 8); D.texte(g, "charge axiale", [16, yc - 66], { ancre: "start", coul: C.x, taille: 19 });
      D.texte(g, "A", [xs[0], 548], { taille: 30 }); D.texte(g, "B", [xs[1], 548], { taille: 30 });
      if (n.revele) {
        D.texte(g, "radial seul", [xs[0], 580], { taille: 18, coul: C.jeu });
        D.texte(g, "radial et axial", [xs[1], 580], { taille: 18, coul: C.doux });
      }
    }
    function angle() {
      var c = [340, 300], a = n.alpha * D.DEG, R = 64, k = Math.max(0, Math.min(1, n.alpha / 90));
      MECA.traitAxe(g, [60, 560], [620, 560]);
      D.texte(g, "axe du roulement", [70, 540], { taille: 16, coul: C.doux, ancre: "start" });
      // bagues : leur face de contact est perpendiculaire à la ligne de contact
      [[1, "bague extérieure"], [-1, "bague intérieure"]].forEach(function (b) {
        var gg = E.s("g", { transform: "rotate(" + (-n.alpha) + " " + c[0] + " " + c[1] + ")" }, g);
        var y0 = b[0] > 0 ? c[1] - R - 58 : c[1] + R;
        E.s("rect", { x: c[0] - 110, y: y0, width: 220, height: 58, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2.5 }, gg);
      });
      D.rond(g, c, R, { fill: "#cfd5df", stroke: C.encre, ep: 2.5 });
      // ligne de contact (de la bague extérieure à la bague intérieure)
      var u = [Math.sin(a), -Math.cos(a)];
      D.ligne(g, [c[0] + u[0] * 190, c[1] + u[1] * 190], [c[0] - u[0] * 190, c[1] - u[1] * 190], C.v, 3, "10 6");
      // direction radiale de référence et angle α
      D.ligne(g, [c[0], c[1] - 210], [c[0], c[1] + 200], C.gris, 2, "4 6");
      var r0 = 150, p0 = [c[0], c[1] - r0], p1 = [c[0] + r0 * Math.sin(a), c[1] - r0 * Math.cos(a)];
      if (n.alpha > 1) E.s("path", { d: "M" + p0 + " A" + r0 + " " + r0 + " 0 0 1 " + p1, fill: "none", stroke: C.jeu, "stroke-width": 4 }, g);
      D.texte(g, "α = " + Math.round(n.alpha) + "°", [c[0] + 95 * Math.sin(a / 2) + 70, c[1] - 175 * Math.cos(a / 2) - 20], { coul: C.jeu, taille: 24 });
      var radial = n.alpha <= 45;
      D.texte(g, radial ? "roulement radial" : "butée", [340, 60], { taille: 28, coul: radial ? C.acc : C.v });
    }
    function butees() {
      // deux butées en demi-coupe, axe horizontal en bas
      [[180, "billes", "A"], [500, "conique", "B"]].forEach(function (b) {
        var yb = 470;
        MECA.traitAxe(g, [b[0] - 140, yb + 40], [b[0] + 140, yb + 40]);
        E.s("rect", { x: b[0] - 140, y: yb, width: 280, height: 40, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2 }, g);
        var y0 = yb - 260, cy = y0 + 130, H = MECA.hachures(g, "#5b6172", { fond: "#fff" });
        // B : bagues inclinées, perpendiculaires à une ligne de contact oblique
        var gg = E.s("g", { transform: b[1] === "billes" ? null : "rotate(-35 " + b[0] + " " + cy + ")" }, g);
        E.s("rect", { x: b[0] - 104, y: cy - 115, width: 40, height: 210, fill: H, stroke: C.encre, "stroke-width": 2.5 }, gg);
        E.s("rect", { x: b[0] + 64, y: cy - 95, width: 40, height: 210, fill: H, stroke: C.encre, "stroke-width": 2.5 }, gg);
        if (b[1] === "billes") D.rond(gg, [b[0], cy], 63, { fill: "#cfd5df", stroke: C.encre, ep: 2.5 });
        else E.s("rect", { x: b[0] - 63, y: cy - 70, width: 126, height: 140, rx: 8, fill: "#cfd5df", stroke: C.encre, "stroke-width": 2.5 }, gg);
        D.fleche(g, [b[0] - 165, cy + 60], [b[0] - 112, cy + 60], C.x, 7);
        if (b[1] !== "billes" && n.revele) D.fleche(g, [b[0], y0 - 70], [b[0], y0 + 6], C.x, 7);
        D.texte(g, b[2], [b[0], 578], { taille: 30 });
      });
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "montage") montage(); else if (n.mode === "angle") angle(); else butees();
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Quelle charge ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("L'arbre porte une charge radiale et une charge axiale. Un seul roulement est à rouleaux cylindriques et ne reprend que la charge radiale. Lequel ?");
      j.choix([
        { html: "A", juste: true },
        { html: "B", aide: "B est un roulement rigide à billes : il peut reprendre des charges combinées. Regarde l'élément roulant de A." }
      ], { colonnes: 2, ok: function () {
        n.revele = true; n.dessin();
        j.bravo("A, à rouleaux cylindriques : charge purement radiale.");
        j.expliquer("<p>Les roulements radiaux sont choisis en fonction de la nature des charges à supporter. Les roulements à rouleaux cylindriques supportent des charges purement radiales. Les roulements rigides à billes peuvent supporter des charges combinées (radiale et axiale).</p>");
        j.suite();
      } });
    } },
    { nom: "La limite", jouer: function (j, n) {
      n.mode = "angle"; n.alpha = 10; n.dessin();
      j.fig.astuce("Fais varier l'angle de contact.");
      j.titre("Règle l'angle de contact α à la limite entre roulement radial et butée, puis valide.");
      var c = j.curseur({ nom: "α", min: 0, max: 90, pas: 5, val: 10, unite: "°", change: function (v) { if (!n.libre) return; n.alpha = v; n.dessin(); } });
      n.libre = true;
      var b = E.h("button", "btn bleu", "Valider", j.el); b.type = "button";
      function verifier() {
        if (!n.libre) return;
        if (n.alpha !== 45) { j.erreur(n.alpha < 45 ? "Le roulement est encore radial : la limite est plus loin." : "Au-delà de la limite, c'est déjà une butée : reviens en arrière."); return; }
        n.libre = false; b.remove();
        j.bravo("45° : jusqu'à 45°, radial ; au-delà, butée.");
        j.expliquer("<p>L'angle de contact détermine le groupe auquel appartient le roulement. Les roulements avec un angle de contact \\(\\alpha \\le 45°\\) sont des roulements radiaux ; les autres sont des butées.</p>");
        j.suite();
      }
      b.addEventListener("click", verifier);
      j.reponse(function () { n.alpha = 45; c.regler(45); n.dessin(); verifier(); });
    } },
    { nom: "Classer", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Classe ces quatre roulements d'après leur angle de contact.");
      var L = [["15°", "R"], ["60°", "B"], ["40°", "R"], ["90°", "B"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center">' + L.map(function (x) { return '<div><div style="font:700 22px JetBrains Mono,monospace;margin-bottom:6px">α = ' + x[0] + '</div><span class="trou" data-attendu="' + x[1] + '" style="min-width:100px"></span></div>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "R", html: "radial" }, { id: "B", html: "butée" }, { id: "R", html: "radial" }, { id: "B", html: "butée" }],
        aide: "Compare chaque angle à 45°. Tu peux vérifier avec le curseur de la figure précédente.",
        ok: function () { j.bravo("15° et 40° : radiaux. 60° et 90° : butées."); j.suite(); }
      });
    } },
    { nom: "Pourquoi pas ?", jouer: function (j, n) {
      j.titre("Une broche tourne très vite et ne subit presque qu'une charge axiale. Un camarade y met une butée de mêmes dimensions qu'un roulement radial. Quel risque ?");
      j.choix([
        { html: "Les butées n'acceptent pas des vitesses aussi élevées que les roulements radiaux", juste: true },
        { html: "Une butée ne supporte aucune charge axiale", aide: "C'est l'inverse : la butée est faite pour les charges qui agissent dans l'axe de l'arbre." },
        { html: "Aucun risque", aide: "La charge convient à une butée, mais regarde l'autre exigence : la vitesse." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La vitesse est la limite de la butée.");
        j.suite();
      } });
    } },
    { nom: "Charge combinée", jouer: function (j, n) {
      n.mode = "butees"; n.revele = false; n.dessin();
      j.fig.astuce("Deux butées, charge axiale en rouge.");
      j.titre("On ajoute une charge radiale. Laquelle de ces deux butées peut aussi la supporter ?");
      j.choix([
        { html: "A, à billes", aide: "Ses rondelles sont perpendiculaires à l'axe : la bille ne peut être appuyée que dans l'axe." },
        { html: "B, à rouleaux inclinés", juste: true }
      ], { colonnes: 2, ok: function () {
        n.revele = true; n.dessin();
        j.bravo("B : son contact incliné reprend aussi un effort radial.");
        j.expliquer("<p>Les butées supportent des charges agissant principalement dans l'axe de l'arbre. Selon leur conception, elles supportent des charges purement axiales, et certaines peuvent aussi supporter des charges radiales (charges combinées).</p>");
        j.suite();
      } });
    } }
  ]
});
