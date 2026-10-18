/* Niveau : élastomère ou plastomère. Tv et température ambiante, module 1 MPa contre 1 GPa, 1000 %, élasticité caoutchoutique, déformation plastique. */
NIVEAU({
  id: "elastomere-plastomere",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "courbe", Tv: -60, chaud: false, h: 0, libre: true };
    var X0 = 100, X1 = 630, Y0 = 480, Y1 = 130, T0 = -100, T1 = 160, L0 = 2.5, L1 = 10;
    function px(T) { return X0 + (T - T0) / (T1 - T0) * (X1 - X0); }
    function py(l) { return Y0 - (l - L0) / (L1 - L0) * (Y0 - Y1); }
    function axes() {
      D.fleche(g, [X0, Y0], [X1 + 20, Y0], C.encre, 3); D.fleche(g, [X0, Y0], [X0, Y1 - 30], C.encre, 3);
      D.texte(g, "T (°C)", [X1 + 8, Y0 - 22], { taille: 16 });
      D.texte(g, "log module (Pa)", [X0 + 6, Y1 - 46], { taille: 16, ancre: "start" });
      [-100, -50, 0, 50, 100, 150].forEach(function (t) { D.ligne(g, [px(t), Y0], [px(t), Y0 + 8], C.encre, 2); D.texte(g, String(t).replace("-", "−"), [px(t), Y0 + 24], { taille: 15, gras: false, mono: true }); });
      [[9, "1 GPa"], [6, "1 MPa"]].forEach(function (l) { D.ligne(g, [X0 - 8, py(l[0])], [X0, py(l[0])], C.encre, 2); D.texte(g, l[1], [X0 - 12, py(l[0])], { taille: 15, ancre: "end", gras: false }); });
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "courbe") {
        axes();
        var pts = [];
        for (var T = T0; T <= T1; T += 2) pts.push([px(T), py(BIO.logModule(T, { Tg: n.Tv, Tl: Infinity }))]);
        E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5, "stroke-linejoin": "round" }, g);
        D.ligne(g, [px(n.Tv), Y0], [px(n.Tv), py(9.6)], C.gris, 2, "6 5");
        D.texte(g, "Tv", [px(n.Tv), py(9.9)], { taille: 18, coul: C.doux });
        D.ligne(g, [px(20), Y0], [px(20), Y1], C.acc, 3, "8 6");
        D.texte(g, "ambiante 20 °C", [px(20) + 8, Y1 + 4], { taille: 16, coul: C.acc, ancre: "start" });
        var l20 = BIO.logModule(20, { Tg: n.Tv, Tl: Infinity });
        D.rond(g, [px(20), py(l20)], 10, { fill: C.acc, stroke: "#fff", ep: 3 });
        fig.chip(n.chipOn ? (n.Tv < 20 ? "à 20 °C : élastomère" : "à 20 °C : plastomère") : null);
      } else if (n.mode === "chauffe") {
        fig.chip(null);
        // bande de caoutchouc suspendue avec une masse : la contrainte reste constante
        E.s("rect", { x: 170, y: 120, width: 340, height: 18, fill: "#9aa0ad" }, g);
        for (var x = 175; x < 510; x += 22) D.ligne(g, [x, 120], [x + 14, 104], C.gris, 2);
        var L = 230 - n.h;
        E.s("path", { d: "M330 138 C300 " + (138 + L * 0.3) + " 360 " + (138 + L * 0.7) + " 330 " + (138 + L), fill: "none", stroke: "#8b3fd9", "stroke-width": 16, "stroke-linecap": "round" }, g);
        E.s("rect", { x: 290, y: 138 + L, width: 80, height: 70, rx: 8, fill: "#5b6172", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "masse", [330, 173 + L], { taille: 16, coul: "#fff", fond: false });
        D.ligne(g, [420, 138 + 230], [470, 138 + 230], C.gris, 2, "5 4");
        D.texte(g, "avant", [480, 368], { taille: 15, ancre: "start", coul: C.doux });
        // flammes stylisées si on chauffe
        if (n.chaud) [250, 410].forEach(function (cx) { E.s("path", { d: "M" + cx + " 520 q-24 -30 0 -70 q24 40 0 70 Z", fill: "#ff9f6b", stroke: "#e5484d", "stroke-width": 2 }, g); });
        D.texte(g, n.chaud ? "on chauffe" : "contrainte constante", [330, 556], { taille: 18, coul: n.chaud ? C.ko : C.encre });
      } else {
        fig.chip(null);
        // deux essais de traction : charge puis décharge
        [[60, "A"], [370, "B"]].forEach(function (c, i) {
          var ox = c[0], oy = 430, w = 250, h = 250;
          D.fleche(g, [ox, oy], [ox + w + 10, oy], C.encre, 2.5); D.fleche(g, [ox, oy], [ox, oy - h - 10], C.encre, 2.5);
          D.texte(g, "σ", [ox - 16, oy - h], { taille: 18 }); D.texte(g, "ε", [ox + w + 10, oy + 22], { taille: 18 });
          D.texte(g, c[1], [ox + w / 2, oy - h - 30], { taille: 26, coul: C.jeu });
          if (i === 0) {
            E.s("path", { d: "M" + ox + " " + oy + " C" + (ox + 120) + " " + (oy - 40) + " " + (ox + 170) + " " + (oy - 120) + " " + (ox + 230) + " " + (oy - 210), fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
            E.s("path", { d: "M" + (ox + 230) + " " + (oy - 210) + " C" + (ox + 190) + " " + (oy - 100) + " " + (ox + 110) + " " + (oy - 20) + " " + ox + " " + oy, fill: "none", stroke: C.jeu, "stroke-width": 4, "stroke-dasharray": "9 6" }, g);
          } else {
            E.s("path", { d: "M" + ox + " " + oy + " L" + (ox + 60) + " " + (oy - 140) + " C" + (ox + 120) + " " + (oy - 190) + " " + (ox + 180) + " " + (oy - 200) + " " + (ox + 220) + " " + (oy - 205), fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
            D.ligne(g, [ox + 220, oy - 205], [ox + 132, oy], C.jeu, 4, "9 6");
            D.texte(g, "εp", [ox + 132, oy + 24], { taille: 17, coul: C.jeu });
          }
        });
        D.texte(g, "trait plein : charge   pointillé : décharge", [340, 500], { taille: 16, coul: C.doux, gras: false });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Lire la courbe", jouer: function (j, n) {
      j.fig.astuce("Caoutchouc naturel vulcanisé : Tv ≈ −60 °C.");
      j.titre("À la température ambiante (20 °C), sur quelle partie de sa courbe se trouve le caoutchouc naturel ?");
      j.choix([
        { html: "Le plateau vitreux, vers 1 GPa", aide: "Le plateau vitreux est à gauche de Tv. Le point bleu est à droite de Tv." },
        { html: "Le plateau caoutchouteux, vers 1 MPa", juste: true },
        { html: "La chute de module autour de Tv", aide: "La chute est autour de −60 °C. 20 °C est bien plus loin." }
      ], { colonnes: 1, ok: function () {
        n.chipOn = true; n.dessin();
        j.bravo("Plateau caoutchouteux : c'est un élastomère.");
        j.expliquer("<p>La température de transition vitreuse \\(T_v\\) dépend des doubles liaisons, de la polarité des chaînes, de la microstructure. En règle générale : si \\(T_v\\) est <b>inférieure</b> à l'ambiante, on a un <b>élastomère</b> ; si elle est <b>supérieure</b>, un <b>plastomère</b> (non cristallin).</p>");
        j.suite();
      } });
    } },
    { nom: "Le polystyrène", jouer: function (j, n) {
      j.fig.astuce("Le curseur règle la Tv du matériau.");
      j.titre("Le polystyrène a une Tv voisine de 100 °C. Règle la Tv sur 100 °C.");
      var fait = false;
      var c = j.curseur({ nom: "Tv", min: -100, max: 150, pas: 5, val: n.Tv, unite: " °C", change: function (v) {
        if (fait) return;
        n.Tv = v; n.dessin();
        if (Math.abs(v - 100) <= 5) { fait = true; question(); }
      } });
      function question() {
        c.input.disabled = true;
        j.consigne("Alors, à 20 °C, le polystyrène est…");
        j.choix([{ html: "un élastomère", aide: "Compare Tv et 20 °C : Tv est au-dessus." }, { html: "un plastomère", juste: true }], { ok: function () {
          j.bravo("Plastomère : vitreux et rigide à 20 °C.");
          j.expliquer("<p>Même famille de courbe, seule \\(T_v\\) a bougé. Un élastomère est une matière <b>amorphe</b> à \\(T_v\\) faible, souvent inférieure à −40 °C.</p>");
          j.suite();
        } });
      }
      j.reponse(function () { c.regler(100); n.Tv = 100; n.dessin(); if (!fait) { fait = true; question(); } });
    } },
    { nom: "Mille fois", jouer: function (j, n) {
      j.titre("Module d'un élastomère : environ 1 MPa. Celui d'un plastique : environ 1 GPa. Combien de fois le plastique est-il plus rigide ?");
      j.nombre({ avant: "\\dfrac{1\\ \\text{GPa}}{1\\ \\text{MPa}} =", cases: [{ attendu: 1000, tol: 0 }], ligne: true,
        aide: function () { return "1 GPa = 1 000 MPa. Sur l'axe, c'est trois graduations de log."; },
        ok: function () {
          j.bravo("1000 fois : trois décades sur l'échelle log.");
          j.expliquer("<p>Les applications des élastomères exploitent leurs caractéristiques uniques : un <b>faible module</b> \\(E \\approx 1\\) MPa (contre 1 GPa pour les plastiques) et des <b>déformations élevées</b>, jusqu'à 1000 %.</p>");
          j.suite();
        } });
    } },
    { nom: "Jusqu'à 1000 %", jouer: function (j, n) {
      j.titre("Une bande en élastomère de 5 cm est étirée de 1000 % sans casser. Quelle est sa longueur étirée ?");
      j.nombre({ avant: "L =", apres: "\\text{cm}", cases: [{ attendu: 55, tol: 0.01 }], ligne: true,
        aide: function (k, v) { return v[0] === "50" ? "50 cm, c'est l'allongement \\(\\Delta l\\). Ajoute la longueur de départ." : "1000 % veut dire \\(\\Delta l = 10\\, l_0\\). Puis \\(L = l_0 + \\Delta l\\)."; },
        ok: function () {
          j.bravo("5 + 50 = 55 cm.");
          j.expliquer("<p>\\(\\varepsilon = \\Delta l / l_0 = 10\\). L'élastomère supporte de grandes déformations élastiques avant rupture : relâché, il revient à 5 cm.</p>");
          j.suite();
        } });
    } },
    { nom: "On chauffe", jouer: function (j, n) {
      n.mode = "chauffe"; n.h = 0; n.chaud = false; n.dessin();
      j.fig.astuce("La masse tire toujours avec la même force.");
      j.titre("La bande porte une masse : contrainte constante. Prédis : si on chauffe la bande, que fait-elle ?");
      j.choix([
        { html: "Elle s'allonge, comme un métal", aide: "C'est l'intuition du métal. Le caoutchouc étiré a des chaînes alignées qui veulent retrouver leur désordre." },
        { html: "Elle se contracte et soulève la masse", juste: true },
        { html: "Rien ne change", aide: "Le cours montre un effet visible sur le dessin de l'élasticité caoutchoutique." }
      ], { colonnes: 1, ok: function () {
        n.chaud = true;
        E.anime(1200, function (u) { n.h = 60 * u; n.dessin(); });
        j.bravo("Elle se contracte.");
        j.expliquer("<p>C'est le <b>phénomène de l'élasticité caoutchoutique</b> : sous contrainte constante, le caoutchouc se déforme, puis se contracte quand on augmente sa température. Sans charge, chauffé, il s'allonge (dessin du cours).</p>");
        j.suite();
      } });
    } },
    { nom: "Élastique ou plastique", jouer: function (j, n) {
      n.mode = "cycle"; n.dessin();
      j.fig.astuce("");
      j.titre("On charge puis on décharge deux matériaux. Lequel est un plastomère ?");
      j.choix([
        { html: "A", aide: "A revient à l'origine à la décharge : toute la déformation était élastique." },
        { html: "B", juste: true }
      ], { ok: function () {
        j.bravo("B garde une déformation permanente εp.");
        j.expliquer("<p>L'<b>élastomère</b> subit seulement une déformation élastique. Le <b>plastomère</b> peut subir une déformation élastique accompagnée d'une <b>déformation plastique</b> (permanente). La diapo représente le travail fourni par l'aire hachurée sous la droite force-allongement, notée \\(W = F\\,\\Delta l\\) (pour une droite qui part de zéro, cette aire vaut en toute rigueur \\(\\tfrac12 F\\,\\Delta l\\)).</p>");
        j.suite();
      } });
    } }
  ]
});
