/* Révision du chapitre 3 : la salle d'opération, dans des situations nouvelles. */
NIVEAU(ARCHI.rejouable({
  id: "revision-salle",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { pl: { P: function (v) { return v; } } };
    n.dessin = function (t) {
      A.vider(g);
      fig.chip(null);
      if (t === "salle") {
        A.s("rect", { x: 60, y: 90, width: 560, height: 420, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.s("rect", { x: 300, y: 210, width: 80, height: 200, rx: 10, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
        A.texte(g, "7,20 m", [340, 70], { taille: 18, mono: true }); A.texte(g, "6,00 m", [40, 300], { taille: 18, mono: true, ancre: "end" }).setAttribute("transform", "rotate(-90 40 300)");
        A.texte(g, "Salle hybride proposée (exemple ajouté)", [340, 560], { taille: 15, coul: C.doux });
      } else if (t === "murs") {
        [["Panneaux lisses", 0], ["Peinture texturée", 1], ["Carrelage à joints", 2]].forEach(function (e, i) {
          var x = 30 + i * 215;
          A.s("rect", { x: x, y: 120, width: 190, height: 300, rx: 8, fill: "#eef2f7", stroke: C.encre, "stroke-width": 2.5 }, g);
          if (i === 0) A.s("line", { x1: x + 95, y1: 120, x2: x + 95, y2: 420, stroke: "#c7cdd8", "stroke-width": 1.5 }, g);
          if (i === 1) { var gr = 7; for (var k = 0; k < 110; k++) { gr = (gr * 9301 + 49297) % 233280; var px = gr / 233280; gr = (gr * 9301 + 49297) % 233280; A.s("circle", { cx: x + 10 + px * 170, cy: 130 + gr / 233280 * 280, r: 3.5, fill: "#c9b896" }, g); } }
          if (i === 2) for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) A.s("rect", { x: x + 6 + c * 46, y: 126 + r * 49, width: 40, height: 43, fill: "#fff", stroke: "#8f98a8", "stroke-width": 2 }, g);
          A.texte(g, e[0], [x + 95, 450], { taille: 16 });
        });
      } else if (t === "coupe") {
        A.s("rect", { x: 60, y: 120, width: 560, height: 120, fill: C.fond, stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "8 6" }, g);
        A.texte(g, "?", [340, 180], { taille: 48, coul: C.gris, gras: 800 });
        A.s("rect", { x: 60, y: 240, width: 560, height: 260, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.texte(g, "50 m² de salle visible", [340, 380], { taille: 20, gras: 700 });
      } else if (t === "porte") {
        A.boite(g, 40, 120, 300, 360, { fond: A.ZONES.restreinte.fond, bord: A.ZONES.restreinte.bord, titre: "Salle", taille: 20 });
        A.boite(g, 380, 120, 260, 360, { fond: A.ZONES.semi.fond, bord: A.ZONES.semi.bord, titre: "Couloir", taille: 20 });
        A.s("rect", { x: 340, y: 230, width: 40, height: 140, fill: "#fff" }, g);
        A.s("path", { d: "M340 230 L420 200", stroke: C.encre, "stroke-width": 6, "stroke-linecap": "round" }, g);
        A.s("path", { d: "M418 214 L434 226 L418 230 Z", fill: C.ko }, g);
        for (var k = 0; k < 4; k++) A.fleche(g, [290, 260 + k * 30], [430, 260 + k * 30], { coul: C.acc, ep: 3 });
        A.texte(g, "porte calée ouverte", [340, 520], { taille: 16, coul: C.ko });
      } else if (t === "rx") {
        A.boite(g, 40, 120, 360, 360, { fond: A.ZONES.restreinte.fond, bord: C.encre, ep: 6, titre: "Salle avec arceau", taille: 18 });
        A.boite(g, 420, 120, 220, 360, { titre: "Bureau occupé", taille: 18 });
        A.icone(g, "radiation", [220, 340], 50, C.ko);
        A.icone(g, "personne", [530, 380], 50, C.acc);
      }
    };
    return n;
  },
  etapes: [
    { nom: "Le plan qui passe ?", jouer: function (j, n) {
      n.dessin("salle");
      j.titre("Cette salle hybride fait 7,20 m × 6,00 m de surface libre. Calcule sa surface, puis juge.");
      j.nombre({ avant: "S =", apres: "\\text{m}^2", cases: [{ attendu: 43.2, tol: 0.005 }], ligne: true,
        aide: function () { return "7,20 × 6 : 7 × 6 = 42, plus 0,20 × 6."; },
        ok: function () {
          j.consigne("Respecte-t-elle le FGI 2022 pour une salle hybride ?");
          j.choix([
            { html: "Oui", aide: "Compare à 55,74 m² et regarde aussi la largeur." },
            { html: "Non : surface sous 55,74 m² et largeur sous 6,10 m", juste: true },
            { html: "Non, uniquement à cause de la surface", aide: "Regarde la largeur : 6,00 m face aux 6,10 m demandés." }
          ], { colonnes: 1, ok: function () { j.bravo("Deux conditions ratées sur deux."); j.suite(); } });
        } });
    } },
    { nom: "Quel matériau ?", jouer: function (j, n) {
      n.dessin("murs");
      j.titre("Pour l'habillage des murs d'une salle, que choisis-tu ?");
      j.choix([
        { html: "Des panneaux lisses à joints étanches, résistants aux désinfectants", juste: true },
        { html: "Une peinture texturée décorative", aide: "Une surface texturée est poreuse et retient la saleté ; la décoration inutile est à limiter." },
        { html: "Du carrelage à joints ouverts", aide: "Les joints ouverts sont justement à limiter." }
      ], { colonnes: 1, ok: function () { j.bravo("Lisse, lavable, non poreux, sans joints ouverts."); j.suite(); } });
    } },
    { nom: "Le volume", jouer: function (j, n) {
      n.dessin("coupe");
      j.titre("Un collègue affirme : « La salle fait 50 m², le dimensionnement est fini. » Qu'a-t-il oublié ?");
      j.choix([
        { html: "Le volume technique au-dessus du plafond", juste: true },
        { html: "La couleur du sol", aide: "Ce n'est pas une question de dimensionnement." },
        { html: "Rien, la surface suffit", aide: "Erreur fréquente du cours : dimensionner uniquement la salle visible." }
      ], { colonnes: 1, ok: function () { j.bravo("La ventilation, les réseaux et les supports des bras logent au-dessus du plafond."); j.suite(); } });
    } },
    { nom: "Porte et pression", jouer: function (j, n) {
      n.dessin("porte");
      j.titre("Une porte de salle reste souvent bloquée ouverte pour faciliter le passage. Quel est le principal problème ?");
      j.choix([
        { html: "La cascade de pression n'est plus préservée", juste: true },
        { html: "Le bruit des conversations", aide: "Gênant, mais pas le principal : que devient l'air de la salle ?" },
        { html: "La porte s'use plus vite", aide: "Le cours parle de l'air, pas de l'usure." }
      ], { colonnes: 1, ok: function () { j.bravo("D'où les portes à fermeture automatique entre les zones."); j.suite(); } });
    } },
    { nom: "Radioprotection", jouer: function (j, n) {
      n.dessin("rx");
      j.titre("On installe un arceau dans une salle voisine d'un bureau occupé. Range les éléments dans l'ordre logique de la démarche.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center"><b>1</b><span class="trou" data-attendu="a"></span><b>2</b><span class="trou" data-attendu="b"></span><b>3</b><span class="trou" data-attendu="c"></span></div>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "Contrôle réglementaire" }, { id: "a", html: "Étude radiophysique / radioprotection" }, { id: "b", html: "Blindage des parois, portes, vitrages" }],
        aide: "On calcule d'abord, on construit ensuite, on vérifie à la fin.",
        ok: function () { j.bravo("Étudier, protéger, contrôler."); j.suite(); }
      });
    } }
  ]
}));
