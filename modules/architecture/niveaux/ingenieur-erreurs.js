/* Niveau : rôle de l'ingénieur biomédical (diapos 71 et 72), erreurs fréquentes à éviter (diapos 73 et 74). */
NIVEAU(ARCHI.rejouable({
  id: "ingenieur-erreurs",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, quand: null, pl: { P: function (v) { return v; } } };
    n.PH = [["Conception", "plans, programme"], ["Chantier", "murs, réseaux"], ["Réception", "essais, livraison"], ["Exploitation", "années de service"]];
    n.frise = function () {
      A.vider(g); fig.chip(null);
      A.s("line", { x1: 40, y1: 300, x2: 640, y2: 300, stroke: C.encre, "stroke-width": 5 }, g);
      A.fleche(g, [600, 300], [652, 300], { coul: C.encre, ep: 5 });
      n.PH.forEach(function (p, i) {
        var x = 100 + i * 160, sel = n.quand === i, ok = sel && i === 0;
        A.s("circle", { cx: x, cy: 300, r: 26, fill: sel ? (ok ? C.ok : C.ko) : "#fff", stroke: sel ? "#fff" : C.encre, "stroke-width": 4 }, g);
        A.texte(g, p[0], [x, 360], { taille: 18, gras: 800 });
        A.texte(g, p[1], [x, 390], { taille: 14, coul: C.doux });
        A.cible(g, x - 60, 250, 120, 160, function () { if (n.surQuand) n.surQuand(i); });
      });
      A.icone(g, "personne", [100, 220], 50, C.jeu);
      A.texte(g, "Ingénieur biomédical", [100, 170], { taille: 15, coul: C.jeu });
    };
    n.frise();
    return n;
  },
  etapes: [
    { nom: "Quand intervenir ?", jouer: function (j, n) {
      j.titre("À quel moment l'ingénieur biomédical doit-il entrer dans le projet ? Touche la phase.");
      n.surQuand = function (i) {
        n.quand = i; n.frise();
        if (i !== 0) { j.erreur(i === 1 ? "Pendant le chantier, les murs et les réseaux sont déjà décidés." : "À la réception, on ne fait plus que constater. Le cours dit « avant la construction »."); return; }
        n.surQuand = null;
        j.bravo("Avant la construction, et non seulement lors de la réception des équipements.");
        j.suite();
      };
      j.reponse(function () { if (n.surQuand) n.surQuand(0); });
    } },
    { nom: "Ses responsabilités", jouer: function (j, n) {
      j.titre("Range ces responsabilités de l'ingénieur biomédical selon le moment où elles pèsent le plus.");
      j.consigne("Regroupement ajouté pour s'y retrouver ; la liste est celle du cours.");
      var res = j.zone("", "");
      var S = [["Définition des besoins biomédicaux", "c"], ["Rédaction des spécifications techniques", "c"], ["Définition des interfaces", "c"], ["Réception technique", "r"], ["Formation", "r"], ["GMAO", "e"], ["Gestion du cycle de vie", "e"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 170px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "e", html: "Exploitation" }, { id: "c", html: "Conception" }, { id: "r", html: "Réception" }, { id: "c", html: "Conception" }, { id: "e", html: "Exploitation" }, { id: "c", html: "Conception" }, { id: "r", html: "Réception" }],
        aide: "Définir et spécifier se fait avant de construire ; réceptionner et former, à la livraison ; la GMAO et le cycle de vie, pendant les années de service.",
        ok: function () {
          j.bravo("De la conception à la fin de vie des équipements.");
          j.expliquer("<p>Ses responsabilités comprennent : définition des besoins biomédicaux, rédaction des spécifications techniques, implantation des équipements, définition des interfaces, vérification des alimentations, vérification des gaz médicaux, analyse des contraintes CVC, accessibilité pour maintenance, réception technique, sécurité électrique, formation, maintenance, GMAO (gestion de la maintenance assistée par ordinateur), gestion du cycle de vie.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Cinq erreurs reconnues", jouer: function (j, n) {
      ARCHI.vider(n.g);
      j.titre("Cinq projets, cinq erreurs fréquentes du cours. Relie chaque situation à son erreur.");
      var S = ["La salle est livrée ; on découvre ensuite que l'arceau prévu n'y tourne pas", "Le plafond est fermé ; impossible d'atteindre les vannes", "Les sacs DASRI passent devant l'arsenal stérile", "La colonne vidéo bloque le passage de l'instrumentiste", "Les prises d'O₂ sont ajoutées en saillie après coup"];
      var Er = ["Positionner les équipements sans tenir compte des flux du personnel", "Ne pas intégrer les fluides médicaux dès la conception", "Construire la salle avant de connaître les équipements", "Mélanger les flux propres et sales", "Ne pas prévoir les accès de maintenance"];
      var pa = ARCHI.paires({ g: n.g, gauche: S, droite: Er, bon: [2, 4, 3, 0, 1], xg: 20, wg: 330, xd: 380, wd: 280, y0: 50, h: 96, pas: 108, taille: 14, tailleD: 14,
        erreur: j.erreur, info: j.info,
        fin: function () { j.bravo("Erreurs 1, 3, 4, 5 et 9 de la liste du cours."); j.suite(); } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Les cinq autres", jouer: function (j, n) {
      j.titre("Laquelle de ces affirmations n'est pas une erreur, mais une bonne pratique du cours ?");
      j.choix([
        { html: "Prévoir uniquement la surface de la salle", aide: "C'est l'erreur 2 : il faut aussi le volume technique." },
        { html: "Installer un équipement d'imagerie sans étude radiologique", aide: "C'est l'erreur 6." },
        { html: "Identifier les équipements critiques et prévoir l'alimentation de secours", juste: true },
        { html: "Considérer la ventilation comme un simple problème de climatisation", aide: "C'est l'erreur 10." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Les erreurs 7 et 8 sont justement de sous-dimensionner l'électricité et d'oublier le secours.");
        j.expliquer("<p>Les dix erreurs : 1 construire la salle avant de connaître les équipements ; 2 prévoir uniquement la surface et oublier le volume technique ; 3 ne pas prévoir les accès de maintenance ; 4 mélanger les flux propres et sales ; 5 positionner les équipements sans tenir compte des flux du personnel ; 6 installer un équipement d'imagerie sans étude radiologique ; 7 sous-dimensionner l'électricité ; 8 oublier l'alimentation de secours ; 9 ne pas intégrer les fluides médicaux dès la conception ; 10 considérer la ventilation comme un simple problème de climatisation.</p>");
        j.suite();
      } });
    } }
  ]
}));
