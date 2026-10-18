/* Niveau : TD 1, cas 1. Réorganisation d'un bloc conventionnel (3 salles, SSPI, stockage) ; réponses proposées à partir du cours. */
NIVEAU({
  id: "td-cas-flux",
  init: function (fig) {
    var A = ARCHI, C = A.C, Z = A.ZONES, g = A.s("g", null, fig.svg);
    var n = { trouves: {}, faux: -1, mode: "constat", g: g, pl: { P: function (v) { return v; } } };
    n.PB = [
      { id: "croise", c: [340, 262], ok: true, nom: "les instruments souillés croisent l'approvisionnement stérile : contamination" },
      { id: "porte", c: [146, 214], ok: true, nom: "porte de salle ouverte : cascade de pression non préservée" },
      { id: "chariot", c: [480, 290], ok: true, nom: "chariots dans le couloir : obstruction des circulations" },
      { id: "issue", c: [610, 262], ok: true, nom: "issue encombrée : évacuation gênée" },
      { id: "stock", c: [636, 492], ok: true, nom: "stockage trop petit : les chariots débordent dans les couloirs" },
      { id: "sspi", c: [176, 492], ok: false }, { id: "salle", c: [410, 84], ok: false }
    ];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      [["Salle 1", 20], ["Salle 2", 240], ["Salle 3", 460]].forEach(function (s) { A.boite(g, s[1], 60, 200, 150, { fond: Z.restreinte.fond, bord: Z.restreinte.bord, titre: s[0], taille: 18 }); });
      A.s("rect", { x: 20, y: 230, width: 640, height: 70, rx: 6, fill: Z.semi.fond, stroke: Z.semi.bord, "stroke-width": 2 }, g);
      A.texte(g, "Couloir unique du bloc", [120, 248], { taille: 14, coul: Z.semi.texte, halo: false });
      A.boite(g, 20, 470, 180, 110, { titre: "SSPI", fond: Z.semi.fond, bord: Z.semi.bord });
      A.boite(g, 220, 470, 200, 110, { titre: "Stérilisation (arrivée du stérile)", fond: C.okPale, bord: C.propre, taille: 15 });
      A.boite(g, 440, 470, 220, 110, { titre: "Stockage", fond: "#fff", taille: 16 });
      A.boite(g, 580, 330, 80, 110, { fond: C.ok, bord: C.ok, titre: "Issue", coul: "#fff", taille: 15 });
      if (n.mode === "constat") {
        A.s("rect", { x: 120, y: 206, width: 50, height: 8, fill: "#fff" }, g);
        A.s("path", { d: "M120 210 L150 230", stroke: C.encre, "stroke-width": 5 }, g);
        A.chemin(g, [[300, 212], [300, 262], [380, 262], [380, 468]], { coul: C.sale, ep: 5, tirets: "10 6" });
        A.chemin(g, [[260, 468], [260, 270], [400, 250], [400, 212]], { coul: C.propre, ep: 5 });
        [[440, 270], [500, 280], [600, 250]].forEach(function (q) { A.s("rect", { x: q[0], y: q[1], width: 40, height: 26, rx: 4, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 2 }, g); });
      } else {
        // après : couloir propre + circuit sale dédié à l'arrière des salles
        A.s("rect", { x: 20, y: 14, width: 640, height: 40, rx: 6, fill: "#fbeee6", stroke: C.sale, "stroke-width": 2 }, g);
        A.texte(g, "Circuit sale dédié", [130, 34], { taille: 15, coul: C.sale, halo: false });
        A.chemin(g, [[260, 468], [260, 265], [340, 265], [340, 212]], { coul: C.propre, ep: 5 });
        A.chemin(g, [[340, 60], [340, 34], [652, 34]], { coul: C.sale, ep: 5 });
        A.texte(g, "vers stérilisation et local déchets", [600, 64], { taille: 13, coul: C.sale, ancre: "end" });
      }
      if (n.mode === "constat") n.PB.forEach(function (p, i) {
        var t = n.trouves[p.id], f = n.faux === i;
        A.s("circle", { cx: p.c[0], cy: p.c[1], r: 20, fill: t ? C.ko : f ? "#fff" : "rgba(59,91,219,.14)", stroke: t ? "#fff" : f ? C.gris : C.acc, "stroke-width": 3 }, g);
        A.texte(g, t ? "!" : "?", p.c, { taille: 18, coul: t ? "#fff" : f ? C.gris : C.acc, halo: false, gras: 800 });
        A.cible(g, p.c[0] - 32, p.c[1] - 32, 64, 64, function () { if (n.surPb) n.surPb(i); });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les dysfonctionnements", jouer: function (j, n) {
      j.titre("Le circuit des instruments souillés croise l'approvisionnement stérile, les portes restent ouvertes, des chariots encombrent les circulations. Touche cinq dysfonctionnements.");
      n.surPb = function (i) {
        var p = n.PB[i];
        if (n.trouves[p.id]) return;
        if (!p.ok) { n.faux = i; n.dessin(); j.erreur("Rien d'anormal ici. Suis le pointillé marron, regarde les portes, les chariots, l'issue et le stockage."); return; }
        n.trouves[p.id] = true; n.faux = -1; n.dessin();
        j.info(p.nom.charAt(0).toUpperCase() + p.nom.slice(1) + ".");
        if (Object.keys(n.trouves).length < 5) return;
        n.surPb = null;
        j.bravo("Cinq dysfonctionnements identifiés.");
        j.expliquer("<p>Contamination par croisement propre / sale ; cascade de pression non préservée ; obstruction des circulations ; évacuation gênée ; stockage insuffisant. Les deux derniers ont la même cause : un local de stockage trop petit pousse les chariots dans les couloirs.</p>");
        j.suite();
      };
      j.reponse(function () { n.PB.forEach(function (p, i) { if (p.ok && n.surPb) n.surPb(i); }); });
    } },
    { nom: "Réorganiser les flux", jouer: function (j, n) {
      n.mode = "apres"; n.dessin();
      j.titre("Proposition : un circuit sale dédié à l'arrière des salles, le couloir réservé au propre, aux patients et au personnel. Quel type de séparation est-ce ?");
      j.choix([
        { html: "Physique : deux circulations distinctes", juste: true },
        { html: "Temporelle", aide: "Il n'y a pas d'horaire ici : ce sont deux couloirs." },
        { html: "Organisationnelle", aide: "Ce n'est pas une règle, c'est un couloir construit." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Séparation physique, la préférée quand le projet le permet.");
        j.expliquer("<p>Flux proposés : patient (hospitalisation → préparation → transfert → salle → SSPI → réanimation / hospitalisation) ; personnel (vestiaires → zone semi-restreinte → zone restreinte, accès contrôlé) ; propre / stérile (stérilisation ou réception → stockage → préparation → salle, par le couloir propre) ; instruments souillés et déchets (salle → circuit sale dédié → stérilisation ou local déchets).</p>");
        j.suite();
      } });
    } },
    { nom: "Hiérarchiser les mesures", jouer: function (j, n) {
      j.titre("Range chaque mesure proposée : architecturale ou organisationnelle.");
      var res = j.zone("", "");
      var S = [["Créer un circuit sale dédié", "a"], ["Poser des portes à fermeture automatique", "a"], ["Agrandir le local de stockage", "a"], ["Interdire tout chariot stationné dans les couloirs", "o"], ["Faire sortir le sale à des horaires décalés en attendant les travaux", "o"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 190px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "o", html: "Organisationnelle" }, { id: "a", html: "Architecturale" }, { id: "a", html: "Architecturale" }, { id: "o", html: "Organisationnelle" }, { id: "a", html: "Architecturale" }],
        aide: "Architecturale : on construit ou on modifie le bâtiment. Organisationnelle : on change des règles ou des horaires.",
        ok: function () {
          j.bravo("Trois mesures architecturales, deux organisationnelles.");
          j.expliquer("<p>Hiérarchie proposée, cohérente avec le cours : d'abord ce qui supprime le risque par la conception (circuit sale dédié, portes à fermeture automatique, stockage suffisant), puis ce qui le réduit par l'organisation, en attendant les travaux ou en complément.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Mesurer l'amélioration", jouer: function (j, n) {
      j.titre("Après la réorganisation, lequel de ces indicateurs permet vraiment d'évaluer l'amélioration ?");
      j.choix([
        { html: "Le nombre de croisements propre / sale observés par semaine, comparé à avant", juste: true },
        { html: "L'avis général de la direction", aide: "Un avis ne se mesure pas : cherche une grandeur qu'on peut compter avant et après." },
        { html: "Le prix des travaux", aide: "Le coût ne dit pas si les flux sont mieux maîtrisés." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Un indicateur se compte avant et après.");
        j.expliquer("<p>Autres indicateurs possibles (proposés, le TD n'en donne pas la liste) : proportion de temps où les portes de salle restent ouvertes, nombre de chariots stationnés dans les couloirs lors d'audits, ruptures de stock, écarts de pression différentielle enregistrés.</p>");
        j.suite();
      } });
    } }
  ]
});
