/* Niveau : quatre générations de biomatériaux. Non contrôlés, matériaux choisis, surfaces modifiées, ingénierie tissulaire et nanomédecine. */
NIVEAU({
  id: "generations",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "frise", places: [false, false, false, false], angle: 100, libre: true, surAngle: null };
    var GEN = [
      { nom: "1re génération", sous: "bois, verre, or : réponse de l'hôte inconnue" },
      { nom: "2e génération", sous: "début du XXe siècle : métaux, céramiques, polymères" },
      { nom: "3e génération", sous: "nouveaux matériaux, surfaces modifiées, biodégradables" },
      { nom: "4e génération", sous: "ingénierie tissulaire, nanomédecine, médecine régénérative" }
    ];
    function frise() {
      GEN.forEach(function (G, k) {
        var y = 70 + k * 125, ok = n.places[k];
        E.s("rect", { x: 40, y: y, width: 600, height: 100, rx: 18, fill: ok ? PLATEFORME.teinte(0.08 + k * 0.06) : "#fff", stroke: ok ? C.jeu : "#c6cbd8", "stroke-width": 2.5 }, g);
        D.texte(g, G.nom, [64, y + 34], { ancre: "start", taille: 21 });
        D.texte(g, ok ? G.sous : "?", [64, y + 70], { ancre: "start", taille: 16, gras: false, coul: ok ? C.doux : C.gris });
        if (k < 3) D.fleche(g, [600, y + 100], [600, y + 124], C.gris, 3);
      });
    }
    // goutte d'eau posée sur une surface d'implant : angle de contact
    function goutte() {
      var a = n.angle;
      D.texte(g, "Surface d'un implant en titane", [340, 70], { taille: 22 });
      E.s("rect", { x: 60, y: 380, width: 560, height: 70, fill: "#b8c0cc", stroke: C.encre, "stroke-width": 2.5 }, g);
      // molécules greffées : petits bâtonnets, d'autant plus nombreux que l'angle est faible
      var nb = Math.round((110 - a) / 6);
      for (var i = 0; i < nb; i++) {
        var x = 80 + i * (520 / Math.max(1, nb - 1 || 1));
        D.ligne(g, [x, 380], [x, 358], C.jeu, 3); D.rond(g, [x, 354], 5, { fill: C.jeu });
      }
      // calotte de rayon R, demi-largeur w, hauteur h selon l'angle de contact
      var t = a * D.DEG, V = 9000, f = (2 - 3 * Math.cos(t) + Math.pow(Math.cos(t), 3)) / (3 * Math.pow(Math.sin(t), 3));
      var w = Math.pow(V / (Math.PI * f), 1 / 3) * 4.2, R = w / Math.sin(t), h = R * (1 - Math.cos(t));
      var cx = 340, base = 352, large = a > 90 ? 1 : 0;
      E.s("path", { d: "M" + (cx - w) + " " + base + " A" + R + " " + R + " 0 " + large + " 1 " + (cx + w) + " " + base + " Z", fill: "rgba(59,91,219,0.22)", stroke: "#3b5bdb", "stroke-width": 3 }, g);
      // tangente au bord droit
      D.ligne(g, [cx + w, base], [cx + w - 80 * Math.cos(t), base - 80 * Math.sin(t)], C.encre, 2.5, "6 4");
      D.texte(g, "angle de contact " + Math.round(a) + "°", [340, base - h - 34], { taille: 20, coul: "#3b5bdb" });
      D.texte(g, a > 90 ? "surface hydrophobe" : "surface hydrophile", [340, 500], { taille: 20, coul: a > 90 ? C.doux : C.ok });
      if (n.libre) D.texte(g, "Glisse la goutte vers la droite pour greffer des molécules", [340, 120], { taille: 16, coul: C.doux, gras: false });
    }
    n.dessin = function () { E.vider(g); if (n.mode === "frise") frise(); else goutte(); };
    D.glisser(fig.svg, {
      debut: function () { return n.mode === "goutte" && n.libre; },
      bouge: function (p) { if (!n.libre) return; n.angle = Math.max(30, Math.min(110, 110 - (p[0] - 120) / 440 * 80)); n.dessin(); if (n.surAngle) n.surAngle(n.angle); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Ranger les générations", jouer: function (j, n) {
      j.fig.astuce("Du bois et de l'or des premiers temps aux tissus régénérés.");
      j.titre("Range chaque exemple dans sa génération de biomatériaux.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;font-size:18px"><b>1re</b><span class="trou" data-attendu="1"></span><b>2e</b><span class="trou" data-attendu="2"></span><b>3e</b><span class="trou" data-attendu="3"></span><b>4e</b><span class="trou" data-attendu="4"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "3", html: "Molécule bioactive greffée sur un implant" }, { id: "1", html: "Dent réparée à l'or, sans rien savoir de la réponse du corps" }, { id: "4", html: "Médecine régénérative" }, { id: "2", html: "Prothèse en alliage métallique choisi pour sa résistance à la corrosion" }],
        aide: "1re : matériaux du quotidien, non contrôlés. 2e : métaux, céramiques, polymères choisis pour leurs propriétés. 3e : surfaces modifiées et nouveaux matériaux. 4e : ingénierie tissulaire, nanomédecine, médecine régénérative.",
        ok: function () {
          n.places = [true, true, true, true]; n.dessin();
          j.bravo("Quatre générations, de plus en plus proches du vivant.");
          j.expliquer("<p>La 1re génération réunit les matériaux auxquels on avait accès au quotidien (bois, verre, or). Depuis le début du XXe siècle, la <b>2e génération</b> exploite des métaux, céramiques et polymères aux propriétés multiples pour l'ophtalmologie, le dentaire, le cardiovasculaire et l'orthopédie.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Non contrôlés", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Pourquoi dit-on que les biomatériaux de la 1re génération étaient « non contrôlés » ?");
      j.choix([
        { html: "Ils étaient fabriqués sans machine", aide: "Le mot « contrôle » porte sur le corps du patient, pas sur la fabrication." },
        { html: "On ne connaissait rien de la réponse de l'hôte : la notion de biocompatibilité n'existait pas", juste: true },
        { html: "Ils étaient interdits par la loi", aide: "Il n'y avait pas encore de réglementation des biomatériaux : on ne pouvait rien interdire." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le bon matériau était trouvé par la pratique, sans rien savoir de la réponse du corps.");
        j.suite();
      } });
    } },
    { nom: "Modifier la surface", jouer: function (j, n) {
      n.mode = "goutte"; n.dessin();
      j.fig.astuce("Une goutte d'eau s'étale plus sur une surface hydrophile.");
      j.titre("3e génération : on greffe des molécules à la surface d'un implant. Rends la surface hydrophile (angle de contact sous 60°).");
      n.surAngle = function (a) {
        if (a > 60) return;
        n.surAngle = null; n.libre = false; n.angle = Math.min(a, 55); n.dessin();
        j.bravo("La goutte s'étale : la surface est devenue hydrophile.");
        j.expliquer("<p>La <b>modification de surface</b> lie une molécule d'intérêt biologique à la surface d'un implant (polymère, métal ou céramique) par enduction, deep-coating, physisorption ou greffage chimique. Buts : un meilleur équilibre hydrophobe / hydrophile, une spécificité, ou une <b>bioactivité</b> (moduler la réponse de l'hôte). La goutte est un exemple ajouté pour visualiser l'hydrophilie.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surAngle) { n.angle = 55; n.surAngle(55); } });
    } },
    { nom: "La 4e génération", jouer: function (j, n) {
      n.mode = "frise"; n.dessin();
      j.fig.astuce("");
      j.titre("Quels domaines forment la quatrième génération de biomatériaux ?");
      j.choix([
        { html: "Bois, verre et or", aide: "Ce sont les matériaux de la toute première génération." },
        { html: "Métaux, céramiques et polymères", aide: "C'est la deuxième génération, au début du XXe siècle." },
        { html: "Ingénierie tissulaire, nanomédecine et médecine régénérative", juste: true }
      ], { colonnes: 1, ok: function () {
        j.bravo("Les avancées récentes : ingénierie tissulaire, nanomédecine, médecine régénérative.");
        j.expliquer("<p>La 3e génération cherche à mieux remplacer les organes et à prévenir les réponses hostiles : nouveaux polymères, métaux et céramiques, surfaces modifiées, structures biodégradables (échafaudages) et nanomatériaux. La 4e génération réunit l'ingénierie tissulaire, la nanomédecine et la médecine régénérative.</p>");
        j.suite();
      } });
    } }
  ]
});
