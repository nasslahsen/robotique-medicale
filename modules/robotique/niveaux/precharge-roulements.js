/* Niveau : jeu, précharge et frottement. Serrer l'écrou jusqu'à supprimer le jeu, effets de la précharge, applications. */
NIVEAU({
  id: "precharge-roulements",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { s: 0, jauges: false, libre: true };
    var DECALAGE = 15; // µm : écart entre les bagues intérieures avant serrage
    n.etat = function () {
      var jeu = Math.max(0, DECALAGE - n.s), pre = Math.max(0, n.s - DECALAGE) / 25; // précharge relative (0 à 1)
      return { jeu: jeu / DECALAGE, rig: 0.35 + 0.65 * Math.min(1, (n.s / DECALAGE) * 0.5 + pre * 0.8), frot: 0.15 + 0.85 * pre, duree: pre < 0.45 ? 0.85 : 0.85 - (pre - 0.45) * 1.4, pre: pre };
    };
    n.dessin = function () {
      E.vider(g);
      var e = n.etat(), yc = 240, r = 40, h = 88, l = 84, gap = (DECALAGE - Math.min(n.s, DECALAGE)) * 1.6; // px
      var H = MECA.hachures(g, "#9aa0ad", { fond: "#fff" });
      // logement : tient les deux bagues extérieures
      [-1, 1].forEach(function (s) { E.s("rect", { x: 140, y: s < 0 ? yc - r - h - 34 : yc + r + h, width: 290, height: 34, fill: H, stroke: C.encre, "stroke-width": 2 }, g); });
      E.s("rect", { x: 70, y: yc - r, width: 520, height: 2 * r, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2 }, g);
      MECA.traitAxe(g, [50, yc], [620, yc]);
      // deux roulements à contact oblique dos à dos ; le droit est poussé par l'écrou
      var xG = 230, xD = xG + l + gap;
      [[xG, -1], [xD, 1]].forEach(function (b) {
        var gg = E.s("g", { transform: b[1] < 0 ? "translate(" + 2 * b[0] + " 0) scale(-1 1)" : null }, g);
        [1, -1].forEach(function (s) { MECA.roulement(gg, b[0], yc - s * r, l, h, { type: "oblique", sens: s }); });
      });
      // entretoise d'épaulement à gauche, écrou à droite
      [1, -1].forEach(function (s) {
        E.s("rect", { x: xG - l / 2 - 16, y: s > 0 ? yc - r - 26 : yc + r, width: 16, height: 26, fill: C.encre }, g);
        E.s("rect", { x: xD + l / 2, y: s > 0 ? yc - r - 40 : yc + r, width: 40, height: 40, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      });
      D.texte(g, "écrou", [xD + l / 2 + 50, yc - r - 20], { taille: 18, ancre: "start" });
      if (gap > 2) D.texte(g, "jeu", [(xG + xD) / 2, yc - r - h - 54], { taille: 18, coul: C.ko });
      else if (e.pre > 0) {
        D.fleche(g, [xD + l / 2 + 110, yc + r + 20], [xD + l / 2 + 44, yc + r + 20], C.jeu, 5 + e.pre * 5);
        D.texte(g, "précharge", [xD + l / 2 + 50, yc + r + 54], { taille: 18, coul: C.jeu, ancre: "start" });
      }
      // jauges qualitatives
      if (!n.jauges) return;
      var L = [["jeu", e.jeu, C.ko], ["rigidité", e.rig, C.acc], ["frottement, échauffement", e.frot, C.x], ["durée de vie", e.duree, C.ok]];
      L.forEach(function (q, i) {
        var y = 440 + i * 38;
        D.texte(g, q[0], [250, y + 10], { taille: 17, ancre: "end" });
        E.s("rect", { x: 266, y: y, width: 300, height: 20, rx: 10, fill: "#eef0f5" }, g);
        E.s("rect", { x: 266, y: y, width: Math.max(4, 300 * Math.max(0, Math.min(1, q[1]))), height: 20, rx: 10, fill: q[2] }, g);
      });
      D.texte(g, "allure qualitative", [566, 420], { taille: 14, coul: C.doux, ancre: "end", gras: false });
    };
    n.regler = function (v) { n.s = v; n.dessin(); };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "À quoi ça sert ?", jouer: function (j, n) {
      j.fig.astuce("Broche : deux roulements à contact oblique dos à dos.");
      j.titre("Une broche de machine-outil doit tourner de façon très précise. Pourquoi applique-t-on une charge aux roulements dès le montage ?");
      j.choix([
        { html: "Pour éliminer tout jeu excessif, et gagner en rigidité et en précision", juste: true },
        { html: "Pour réduire le frottement", aide: "C'est même l'inverse : une charge permanente ajoute des efforts internes." },
        { html: "Pour pouvoir démonter plus facilement", aide: "Le démontage n'a rien à voir : regarde l'écart entre les deux bagues intérieures." }
      ], { colonnes: 1, ok: function () {
        j.bravo("C'est la précharge du roulement.");
        j.expliquer("<p>Les broches de machines-outils, les moteurs électriques et les différentiels automobiles demandent une rotation précise, avec une rigidité et une précision de positionnement accrues. On applique alors une charge constante aux roulements lors du montage pour éliminer tout jeu excessif : c'est la <b>précharge</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Serrer", jouer: function (j, n) {
      n.s = 0; n.jauges = true; n.libre = true; n.dessin();
      j.fig.astuce("L'écrou pousse la bague intérieure de droite.");
      j.titre("Serre l'écrou juste assez pour supprimer le jeu, pas plus, puis valide.");
      var c = j.curseur({ nom: "serrage", min: 0, max: 40, pas: 5, val: 0, unite: " µm", change: function (v) { if (!n.libre) return; n.regler(v); } });
      var b = E.h("button", "btn bleu", "Valider", j.el); b.type = "button";
      function verifier() {
        if (!n.libre) return;
        if (n.s < 15) { j.erreur("Il reste du jeu entre les bagues intérieures : regarde l'écart marqué « jeu »."); return; }
        if (n.s > 15) { j.erreur("Le jeu a disparu plus tôt : regarde la jauge de frottement, elle monte déjà."); return; }
        n.libre = false; b.remove();
        j.bravo("15 µm : plus de jeu, et pas encore de précharge forte.");
        j.suite();
      }
      b.addEventListener("click", verifier);
      j.reponse(function () { c.regler(15); n.regler(15); verifier(); });
    } },
    { nom: "Effets", jouer: function (j, n) {
      n.libre = true;
      j.fig.astuce("Serre au maximum pour voir les jauges.");
      n.jauges = true; n.dessin();
      j.titre("Quand la précharge augmente, que devient chaque grandeur ?");
      var c = j.curseur({ nom: "serrage", min: 0, max: 40, pas: 5, val: n.s, unite: " µm", change: function (v) { n.regler(v); } });
      var L = [["jeu", "moins"], ["rigidité", "plus"], ["frottement", "plus"], ["échauffement", "plus"], ["durée de vie, si la précharge est trop forte", "moins"]];
      var z = j.zone("", L.map(function (x) { return '<div style="display:flex;align-items:center;gap:12px;margin:4px 0"><span style="flex:1;font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '" style="min-width:120px;min-height:52px"></span></div>'; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "plus", html: "augmente" }, { id: "moins", html: "diminue" }, { id: "plus", html: "augmente" }, { id: "moins", html: "diminue" }, { id: "plus", html: "augmente" }],
        aide: "La précharge serre les éléments roulants : moins de jeu et plus de rigidité, mais des efforts internes qui frottent et chauffent.",
        ok: function () {
          c.regler(40); n.regler(40);
          j.bravo("Rigidité contre frottement : un compromis.");
          j.expliquer("<p>La précharge réduit le jeu et augmente la rigidité. Elle augmente aussi les efforts internes, le frottement et l'échauffement. Une précharge trop forte réduit la durée de vie.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un technicien dit : « pour une broche plus rigide, je serre la précharge au maximum ». Qu'est-ce qui cloche ?");
      j.choix([
        { html: "Une précharge trop forte chauffe et réduit la durée de vie : il faut suivre les recommandations du fabricant", juste: true },
        { html: "La précharge diminue la rigidité", aide: "Non, elle l'augmente bien. Le problème est ailleurs : regarde les autres jauges." },
        { html: "Rien, plus c'est serré, mieux c'est", aide: "Regarde la jauge de durée de vie quand le serrage est au maximum." }
      ], { colonnes: 1, ok: function () {
        j.bravo("On applique les recommandations de montage du fabricant.");
        j.expliquer("<p>C'est encore plus vrai avec des ajustements serrés ou des variations de température, qui modifient la précharge réelle.</p>");
        j.suite();
      } });
    } },
    { nom: "Où précharger ?", jouer: function (j, n) {
      j.titre("Dans lequel de ces systèmes une précharge des roulements est-elle la plus utile ?");
      j.choix([
        { html: "Le moteur électrique d'un axe de robot chirurgical", juste: true },
        { html: "Les roulettes d'un chariot de linge", aide: "Rien ne demande ici une rotation précise : un petit jeu ne gêne pas." },
        { html: "La charnière d'une porte de placard", aide: "La précision de rotation n'y sert à rien, le frottement ajouté serait inutile." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Rotation précise et rigide : on précharge.");
        j.suite();
      } });
    } }
  ]
});
