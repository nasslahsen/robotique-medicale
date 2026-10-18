/* Révision du chapitre 2 : zones, flux, séparation, déchets, SSPI, dans des situations nouvelles. */
NIVEAU(ARCHI.rejouable({
  id: "revision-flux",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { trouve: false, faux: -1, pl: { P: function (v) { return v; } } };
    n.PTS = [{ c: [440, 250], ok: false }, { c: [300, 300], ok: true }, { c: [440, 525], ok: false }];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "rien") return;
      var Z = A.ZONES;
      A.texte(g, "Bloc d'une clinique (exemple ajouté)", [340, 50], { taille: 16, coul: C.doux });
      A.boite(g, 20, 80, 160, 110, { titre: "Local sale", fond: "#fbeee6", bord: C.sale });
      A.boite(g, 20, 230, 160, 200, { titre: "Stockage propre", fond: C.okPale, bord: C.propre });
      A.boite(g, 500, 80, 160, 200, { titre: "Salle d'opération", fond: Z.restreinte.fond, bord: Z.restreinte.bord });
      A.boite(g, 20, 470, 160, 110, { titre: "Vestiaires", tirets: "6 5", bord: C.gris });
      A.chemin(g, [[182, 300], [440, 300], [440, 200], [498, 200]], { coul: C.propre, ep: 5 });
      A.chemin(g, [[580, 282], [580, 370], [300, 370], [300, 135], [182, 135]], { coul: C.sale, ep: 5, tirets: "10 6" });
      A.chemin(g, [[182, 525], [620, 525], [620, 284]], { coul: C.personnel, ep: 5 });
      [["propre", C.propre], ["sale", C.sale], ["personnel", C.personnel]].forEach(function (l, i) {
        A.s("line", { x1: 230 + i * 150, y1: 588, x2: 262 + i * 150, y2: 588, stroke: l[1], "stroke-width": 6, "stroke-linecap": "round" }, g);
        A.texte(g, l[0], [270 + i * 150, 588], { taille: 15, ancre: "start", halo: false });
      });
      n.PTS.forEach(function (p, i) {
        var t = n.trouve && p.ok, f = n.faux === i;
        A.s("circle", { cx: p.c[0], cy: p.c[1], r: 22, fill: t ? C.ko : "rgba(59,91,219,.12)", stroke: t ? "#fff" : f ? C.gris : C.acc, "stroke-width": 3 }, g);
        A.texte(g, t ? "!" : "?", p.c, { taille: 20, coul: t ? "#fff" : C.acc, halo: false, gras: 800 });
        A.cible(g, p.c[0] - 32, p.c[1] - 32, 64, 64, function () { if (n.surPoint) n.surPoint(i); });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le point qui pose problème", jouer: function (j, n) {
      j.titre("Sur ce plan, un flux en croise un autre là où il ne faut pas. Touche le point du problème.");
      n.surPoint = function (i) {
        if (n.trouve) return;
        if (!n.PTS[i].ok) { n.faux = i; n.dessin(); j.erreur("Ici, aucun flux propre ne rencontre le sale. Suis la ligne pointillée marron."); return; }
        n.trouve = true; n.surPoint = null; n.dessin();
        j.bravo("Le flux sale coupe le flux propre en allant au local sale.", [300, 300]);
        j.expliquer("<p>Le sale ne doit pas croiser le propre : il faut un circuit sale qui ne traverse pas inutilement les zones propres, ou au moins une séparation temporelle ou organisationnelle si la place manque.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surPoint) n.surPoint(1); });
    } },
    { nom: "Classer des locaux nouveaux", jouer: function (j, n) {
      n.mode = "rien"; n.dessin();
      j.titre("Range ces locaux dans leur zone.");
      var S = [["Salle d'opération hybride", "r"], ["Couloir de transfert des patients", "s"], ["Salle d'attente des familles", "p"], ["Local de stockage du bloc", "s"]];
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 210px;gap:10px;align-items:center">' + S.map(function (x) { return '<span style="font-size:17px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "Semi-restreinte" }, { id: "p", html: "Publique" }, { id: "r", html: "Restreinte" }, { id: "s", html: "Semi-restreinte" }],
        aide: "Restreinte : là où l'on opère. Semi-restreinte : personnel, transfert, préparation, stockage. Publique : accueil, attente.",
        ok: function () { j.bravo("Restreinte, semi-restreinte, publique, semi-restreinte."); j.suite(); }
      });
    } },
    { nom: "Le bon bac", jouer: function (j, n) {
      j.titre("Une seringue munie de son aiguille vient de servir. Dans quelle filière la trier ?");
      j.choix([
        { html: "Déchets assimilables aux déchets ménagers", aide: "Une aiguille usagée peut piquer et contaminer : pas de poubelle ordinaire." },
        { html: "Objets piquants / coupants", juste: true },
        { html: "Déchets chimiques éventuels", aide: "Ce n'est pas un produit chimique. Pense au risque de piqûre." }
      ], { colonnes: 1, ok: function () { j.bravo("Piquants / coupants, dans le collecteur dédié."); j.suite(); } });
    } },
    { nom: "Quel type de séparation ?", jouer: function (j, n) {
      j.titre("Dans un bloc ancien, on construit une cloison qui coupe le couloir unique en deux : un côté propre, un côté sale. Quel type de séparation est-ce ?");
      j.choix([
        { html: "Physique", juste: true },
        { html: "Temporelle", aide: "Aucun horaire ici : c'est un mur qui sépare." },
        { html: "Organisationnelle", aide: "Ce n'est pas une règle à respecter : c'est un élément construit." }
      ], { colonnes: 3, ok: function () { j.bravo("Une cloison : séparation physique, la préférée quand le projet le permet."); j.suite(); } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Un étudiant écrit le flux des dispositifs médicaux : « stérilisation centrale → bloc → stockage stérile → utilisation → instruments souillés → stérilisation ». Quelle est l'erreur ?");
      j.choix([
        { html: "Le stockage stérile vient avant le bloc, pas après", juste: true },
        { html: "Les instruments souillés ne retournent pas en stérilisation", aide: "Si : le flux est une boucle, c'est même son trait principal." },
        { html: "Il n'y a pas d'erreur", aide: "Relis l'ordre : où la boîte attend-elle avant de monter au bloc ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("Stérilisation centrale → stockage stérile → bloc → utilisation → instruments souillés → stérilisation.");
        j.suite();
      } });
    } },
    { nom: "SSPI", jouer: function (j, n) {
      j.titre("Un projet propose de placer la SSPI au rez-de-chaussée, le bloc étant au deuxième étage. Ton avis ?");
      j.choix([
        { html: "Bonne idée : l'accès des familles est plus facile", aide: "La SSPI accueille des patients qui se réveillent d'une anesthésie : c'est la proximité du bloc qui compte." },
        { html: "À refuser : la SSPI doit être à proximité immédiate du bloc", juste: true },
        { html: "Indifférent, du moment qu'il y a un ascenseur", aide: "Le cours demande justement de limiter les ascenseurs et les distances." }
      ], { colonnes: 1, ok: function () { j.bravo("Proximité immédiate du bloc."); j.suite(); } });
    } }
  ]
}));
