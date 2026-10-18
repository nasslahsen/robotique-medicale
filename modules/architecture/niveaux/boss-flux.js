/* Boss du chapitre 2 : tracer le circuit sale sur un plan, puis corriger les défauts de flux d'un bloc. */
NIVEAU(ARCHI.rejouable({
  id: "boss-flux",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    var Z = A.ZONES;
    // Pièces du plan : un tracé propre doit les relier sans passer par le propre
    n.NOEUDS = [
      { t: "Salle d'opération 2", x: 250, y: 70, w: 180, h: 120 },
      { t: "Stockage stérile", x: 470, y: 70, w: 190, h: 120 },
      { t: "Sas d'évacuation du sale", x: 20, y: 250, w: 190, h: 110 },
      { t: "Préparation", x: 20, y: 70, w: 190, h: 120 },
      { t: "Circuit sale", x: 250, y: 420, w: 180, h: 70 },
      { t: "Couloir du personnel", x: 250, y: 250, w: 180, h: 110 },
      { t: "Local déchets, sortie", x: 470, y: 420, w: 190, h: 140 }
    ];
    n.fond = function (gg) {
      fig.chip(null);
      A.texte(gg, "Plan du bloc (exemple ajouté)", [340, 36], { taille: 16, coul: C.doux });
    };
    return n;
  },
  etapes: [
    { nom: "Le circuit sale", jouer: function (j, n) {
      j.titre("Les instruments souillés et les déchets de la salle 2 doivent sortir du bloc. Trace leur circuit en touchant les pièces dans l'ordre.");
      var t = ARCHI.trace({ g: n.g, noeuds: n.NOEUDS, ordre: [0, 2, 4, 6], coul: ARCHI.C.sale, fond: n.fond,
        erreur: j.erreur,
        aide: function (i) { return [1, 3].indexOf(i) >= 0 ? "Cette pièce est propre : le circuit sale ne doit pas la traverser." : i === 5 ? "Le couloir du personnel sert au propre et aux patients : le sale a mieux." : "Ce n'est pas encore cette étape."; },
        fin: function () {
          j.bravo("Salle → sas d'évacuation → circuit sale → local déchets.");
          j.suite();
        } });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Quatre défauts, quatre corrections", jouer: function (j, n) {
      j.titre("L'audit d'un autre bloc relève quatre défauts. Relie chacun à la correction que demande le cours.");
      var D = ["Les sacs DASRI traversent le stockage stérile", "Le personnel entre en tenue de ville directement dans le couloir du bloc", "La SSPI est à l'étage au-dessus", "Des cartons s'entassent dans le couloir de transfert"];
      var S = ["Un local de stockage de capacité suffisante", "Un circuit sale qui évite les zones propres", "Une SSPI à proximité immédiate du bloc", "Un passage par les vestiaires, accès contrôlé"];
      var pa = ARCHI.paires({ g: n.g, gauche: D, droite: S, bon: [1, 3, 2, 0], xg: 20, wg: 330, xd: 400, wd: 260, y0: 70, h: 104, pas: 128, taille: 15,
        erreur: j.erreur, info: j.info, fond: n.fond,
        fin: function () { j.bravo("Chaque défaut a sa règle."); j.suite(); } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Un seul couloir", jouer: function (j, n) {
      ARCHI.vider(n.g);
      j.titre("Dans un bâtiment ancien, impossible de créer un second couloir. Comment séparer quand même le propre et le sale ?");
      j.choix([
        { html: "On ne peut rien faire : le bloc doit fermer", aide: "Le cours prévoit d'autres séparations que la séparation physique." },
        { html: "Combiner séparation temporelle et organisationnelle : horaires décalés, contenants fermés, règles de circulation", juste: true },
        { html: "Laisser circuler sans règle : le couloir est nettoyé le soir", aide: "Sans contrôle, c'est justement la situation à éviter : même circulation sans contrôle." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Quand le physique est impossible, le temporel et l'organisationnel prennent le relais.");
        j.expliquer("<p>La séparation peut être physique, temporelle ou organisationnelle ; la physique est généralement préférable <b>lorsque les contraintes du projet le permettent</b>. Sinon, on combine les deux autres.</p>");
        j.suite();
      } });
    } },
    { nom: "Le transfert vers la réanimation", jouer: function (j, n) {
      j.titre("Le trajet bloc → réanimation de ce bloc emprunte deux ascenseurs et traverse le hall. Que retiens-tu pour le futur projet ?");
      j.choix([
        { html: "Limiter la distance, les obstacles, les ascenseurs multiples et les croisements avec les flux publics", juste: true },
        { html: "Élargir le hall pour que le brancard passe mieux", aide: "Le problème n'est pas la largeur : c'est de croiser le public." },
        { html: "Mettre la réanimation au plus loin, pour la calmer", aide: "Le transfert doit être facilité, dans les deux sens." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Bloc → SSPI → réanimation, et retour, sans détour.");
        j.suite();
      } });
    } }
  ]
}));
