/* Niveau : pression positive (diapo 28) et cascade de pression (diapo 29). L'air va de la pression la plus haute vers la plus basse. */
NIVEAU({
  id: "pression-cascade",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg), ga = A.s("g", null, fig.svg);
    var NIV = ["0", "+", "++"];
    var n = { p: [0, 0, 0], ouvert: false, u: 0, libre: true, pl: { P: function (v) { return v; } } };
    n.PIECES = [{ t: "Salle opératoire", x: 24, z: "restreinte" }, { t: "Préparation / zone intermédiaire", x: 244, z: "semi" }, { t: "Circulation", x: 464, z: "publique" }];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      n.PIECES.forEach(function (pc, i) {
        var Z = A.ZONES[pc.z];
        A.boite(g, pc.x, 150, 192, 300, { fond: Z.fond, bord: Z.bord, ep: 3, rx: 10 });
        A.texte(g, pc.t, [pc.x + 96, 190], { taille: 17, largeur: 170, halo: false });
        // niveau de pression, touchable
        A.boite(g, pc.x + 46, 290, 100, 70, { fond: "#fff", bord: C.encre, ep: 3, rx: 14, titre: NIV[n.p[i]], taille: 30, coul: C.encre });
        A.texte(g, "pression", [pc.x + 96, 380], { taille: 14, coul: C.doux, halo: false });
        if (n.reglable) A.cible(g, pc.x + 46, 290, 100, 70, function () { if (!n.libre) return; n.p[i] = (n.p[i] + 1) % 3; n.dessin(); });
      });
      // portes entre les pièces
      [216, 436].forEach(function (x) { A.s("rect", { x: x, y: 240, width: 28, height: 110, fill: n.ouvert ? "#fff" : "#c9d3e6", stroke: C.encre, "stroke-width": n.ouvert ? 0 : 2 }, g); });
      A.texte(g, n.ouvert ? "portes ouvertes" : "portes fermées", [340, 500], { taille: 16, coul: C.doux });
      n.fleches();
    };
    // flèches d'air à travers chaque porte ouverte, dans le sens des pressions
    n.fleches = function () {
      A.vider(ga);
      if (!n.ouvert) return;
      [[0, 1, 230], [1, 2, 450]].forEach(function (d) {
        var s = A.calc.sensAir(n.p[d[0]], n.p[d[1]]), x = d[2];
        if (n.u >= 1) {
          // état final : une flèche nette par porte (ou deux petites si l'air ne sait pas où aller)
          if (s === 0) { A.fleche(ga, [x - 30, 275], [x + 30, 275], { coul: C.gris, ep: 4 }); A.fleche(ga, [x + 30, 315], [x - 30, 315], { coul: C.gris, ep: 4 }); }
          else A.fleche(ga, [x - 46 * s, 295], [x + 46 * s, 295], { coul: C.acc, ep: 7 });
          return;
        }
        if (s === 0) { A.souffle(ga, [x - 40, 270], [x + 40, 270], n.u, { coul: C.gris, nb: 1 }); A.souffle(ga, [x + 40, 320], [x - 40, 320], n.u, { coul: C.gris, nb: 1 }); return; }
        A.souffle(ga, [x - 50 * s, 295], [x + 50 * s, 295], n.u, { coul: C.acc, nb: 3, ecart: 26 });
      });
    };
    n.ouvrir = function (fin) {
      n.ouvert = true; n.u = 0; n.dessin();
      A.animer(2600, function (u) { n.u = u; n.fleches(); }, fin);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Prédire le sens de l'air", jouer: function (j, n) {
      n.p = [1, 1, 0]; n.dessin();
      j.titre("La salle opératoire est en pression positive par rapport à ses voisines. Quand on ouvre la porte, dans quel sens va l'air ?");
      j.choix([
        { html: "Il sort de la salle", juste: true },
        { html: "Il entre dans la salle", aide: "L'air va toujours de la pression la plus haute vers la plus basse. Où la pression est-elle la plus haute ?" },
        { html: "Il ne bouge pas", aide: "Il y a une différence de pression : l'air se déplace." }
      ], { colonnes: 3, ok: function () {
        n.p = [2, 1, 0]; n.ouvrir();
        j.bravo("L'air sort de la salle plutôt qu'il n'y entre.");
        j.expliquer("<p>Une salle opératoire conventionnelle doit généralement être maintenue en <b>pression positive par rapport aux espaces adjacents</b>. Ainsi, lorsque la porte s'ouvre, l'air tend à sortir de la salle plutôt qu'à y entrer : l'air moins propre du couloir ne vient pas sur le patient. Le CDC indique que les salles d'opération doivent être en pression positive par rapport aux couloirs et espaces adjacents.</p>");
        j.suite();
      } });
    } },
    { nom: "Construire la cascade", jouer: function (j, n) {
      n.p = [0, 0, 0]; n.ouvert = false; n.reglable = true; n.libre = true; n.dessin();
      j.titre("Règle les pressions pour que l'air aille toujours du plus propre vers le moins propre. Touche un niveau pour le changer, puis ouvre les portes.");
      j.consigne("Trois niveaux possibles : 0, + et ++. Ce ne sont pas des valeurs : la cascade exacte se définit par le projet.");
      var bt = E.h("button", "btn bleu", "Ouvrir les portes", j.el); bt.type = "button";
      function gagner() {
        n.libre = false; bt.remove();
        n.ouvrir(function () {});
        j.bravo("Salle ++, préparation +, circulation 0 : l'air descend la cascade.");
        j.expliquer("<p>C'est l'exemple conceptuel du cours : la salle opératoire a la pression la plus forte, la préparation ou zone intermédiaire une pression moindre, la circulation est à 0. À chaque porte, l'air va de la zone la plus propre vers la moins propre.</p>");
        j.suite();
      }
      bt.addEventListener("click", function () {
        var p = n.p;
        if (!(p[0] > p[1] && p[1] > p[2])) {
          n.ouvrir();
          if (p[0] <= p[1]) j.erreur("Regarde la première porte : l'air ne sort pas de la salle. La salle doit avoir la pression la plus haute.");
          else j.erreur("Regarde la seconde porte : l'air de la circulation remonte vers la préparation. Il faut une marche de plus.");
          setTimeout(function () { if (n.libre) { n.ouvert = false; n.dessin(); } }, 2700);
          return;
        }
        gagner();
      });
      j.reponse(function () { n.p = [2, 1, 0]; gagner(); });
    } },
    { nom: "La cascade inversée", jouer: function (j, n) {
      n.reglable = false; n.p = [1, 2, 0]; n.ouvert = false; n.dessin();
      n.ouvrir();
      j.titre("Dans ce bloc, la préparation est en surpression par rapport à la salle. Que se passe-t-il à la porte de la salle ?");
      j.choix([
        { html: "L'air de la préparation entre dans la salle", juste: true },
        { html: "Rien, tant que la salle reste en pression positive par rapport à la circulation", aide: "La salle doit être en pression positive par rapport à tous les espaces adjacents, pas seulement la circulation." },
        { html: "L'air de la salle part vers la préparation", aide: "Regarde les flèches : l'air va de ++ vers +." }
      ], { colonnes: 1, ok: function () {
        j.bravo("L'air d'une zone moins propre entre dans la salle : la cascade est cassée.");
        j.suite();
      } });
    } },
    { nom: "Combien de pascals ?", jouer: function (j, n) {
      j.titre("Un étudiant demande : « Quel écart de pression exact faut-il entre la salle et la préparation ? » Que dit le cours ?");
      j.choix([
        { html: "Toujours la même valeur, partout dans le monde", aide: "Le cours insiste : pas de chiffre universel." },
        { html: "La cascade exacte doit être définie par le référentiel et le programme de ventilation du projet", juste: true },
        { html: "Aucun écart : il suffit que les portes soient fermées", aide: "Une porte s'ouvre forcément ; c'est l'écart de pression qui décide alors du sens de l'air." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le référentiel et le programme de ventilation du projet.");
        j.expliquer("<p>Même idée que pour le renouvellement d'air : on ne retient pas un chiffre isolé sans préciser le référentiel. Les portes à fermeture automatique, recommandées par la Healthcare Infection Society, servent à préserver cette cascade.</p>");
        j.suite();
      } });
    } }
  ]
});
