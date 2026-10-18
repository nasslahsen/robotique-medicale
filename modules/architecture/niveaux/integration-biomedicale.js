/* Niveau : intégration biomédicale (diapos 44 et 45), problème des équipements (diapos 46 et 47), maintenance et accessibilité (diapo 48). */
NIVEAU(ARCHI.rejouable({
  id: "integration-biomedicale",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "equipements", trouves: {}, faux: -1, g: g, pl: { P: function (v) { return v; } } };
    n.EQ = ["Table opératoire", "Scialytique", "Respirateur d'anesthésie", "Moniteur multiparamétrique", "Bistouri électrique", "Aspirateur", "Pousse-seringues", "Défibrillateur", "Colonne vidéo", "Endoscopie", "Échographe", "Microscope", "Robot chirurgical", "Arceau mobile"];
    n.PB = [
      { id: "filtre", c: [272, 105], ok: true, nom: "filtre sans trappe d'accès" }, { id: "tableau", c: [468, 305], ok: true, nom: "tableau électrique muré derrière un placard fixe" },
      { id: "vanne", c: [110, 380], ok: true, nom: "vannes de gaz sans accès" }, { id: "porte", c: [340, 540], ok: true, nom: "porte trop étroite pour sortir une pièce" },
      { id: "prise", c: [450, 210], ok: false }, { id: "lampe", c: [398, 240], ok: false }
    ];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "maintenance") {
        A.s("rect", { x: 30, y: 60, width: 620, height: 460, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.s("rect", { x: 30, y: 60, width: 620, height: 90, fill: C.fond }, g);
        A.s("line", { x1: 30, y1: 150, x2: 650, y2: 150, stroke: C.encre, "stroke-width": 4 }, g);
        A.boite(g, 90, 80, 150, 50, { fond: "#fff", bord: C.acc, ep: 2.5, rx: 6, titre: "Filtre", taille: 14 });
        A.texte(g, "Faux plafond fixe", [600, 170], { taille: 13, coul: C.doux, ancre: "end" });
        A.boite(g, 500, 230, 140, 150, { fond: "#e3e6ee", bord: C.encre, ep: 3, rx: 4, titre: "Placard fixe", taille: 14 });
        A.s("rect", { x: 36, y: 330, width: 50, height: 90, fill: "#f1e8dc", stroke: "#b8a07a", "stroke-width": 2 }, g);
        A.texte(g, "Gaine murée", [36, 440], { taille: 13, coul: C.doux, ancre: "start" });
        A.s("rect", { x: 420, y: 150, width: 60, height: 30, rx: 6, fill: "#fff", stroke: C.ok, "stroke-width": 2.5 }, g);
        A.icone(g, "lampe", [340, 220], 60, C.doux);
        A.s("rect", { x: 300, y: 300, width: 80, height: 160, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2 }, g);
        A.s("rect", { x: 310, y: 514, width: 60, height: 12, fill: "#fff" }, g);
        n.PB.forEach(function (p, i) {
          var t = n.trouves[p.id], f = n.faux === i;
          A.s("circle", { cx: p.c[0], cy: p.c[1], r: 22, fill: t ? C.ko : f ? "#fff" : "rgba(59,91,219,.12)", stroke: t ? "#fff" : f ? C.gris : C.acc, "stroke-width": 3 }, g);
          A.texte(g, t ? "!" : "?", p.c, { taille: 20, coul: t ? "#fff" : f ? C.gris : C.acc, halo: false, gras: 800 });
          A.cible(g, p.c[0] - 32, p.c[1] - 32, 64, 64, function () { if (n.surPb) n.surPb(i); });
        });
      } else {
        A.texte(g, "Quelques équipements du bloc (liste du cours)", [340, 50], { taille: 16, coul: C.doux });
        n.EQ.forEach(function (e, i) {
          var x = 24 + (i % 3) * 214, y = 76 + Math.floor(i / 3) * 100, robot = i === 12 && n.mode === "robot";
          A.boite(g, x, y, 200, 84, { fond: robot ? C.jeuPale : "#fff", bord: robot ? C.jeu : C.trait, ep: robot ? 3.5 : 2, titre: e, taille: 16 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La fiche d'un équipement", jouer: function (j, n) {
      n.mode = "robot"; n.dessin();
      j.titre("L'architecte doit travailler avec l'ingénieur biomédical dès la conception. Pour le robot chirurgical, relie chaque information à la caractéristique qu'elle décrit.");
      var res = j.zone("", "");
      var S = [["Il pèse plusieurs centaines de kilos.", "p"], ["Ses bras ont besoin d'un espace libre autour de la table.", "d"], ["Il dégage de la chaleur dans la salle.", "t"], ["Il se connecte à la colonne vidéo et au réseau.", "i"], ["Le technicien doit pouvoir ouvrir ses capots.", "m"], ["Il demande une prise et une puissance dédiées.", "a"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 190px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "i", html: "Interfaces" }, { id: "p", html: "Poids" }, { id: "m", html: "Maintenance" }, { id: "a", html: "Alimentation" }, { id: "d", html: "Dégagements" }, { id: "t", html: "Besoins thermiques" }],
        aide: "Poids : le plancher. Dégagements : l'espace autour. Thermique : la chaleur. Interfaces : les connexions. Alimentation : l'énergie. Maintenance : l'accès du technicien.",
        ok: function () {
          j.bravo("Dimensions, poids, alimentation, dégagements, besoins thermiques, interfaces, contraintes de maintenance.");
          j.expliquer("<p>Chaque équipement possède ces caractéristiques : il faut donc réaliser un <b>plan d'implantation biomédical</b>. Le robot est un exemple ; la même fiche vaut pour la table, le scialytique, le respirateur d'anesthésie, le moniteur, le bistouri électrique, l'aspirateur, les pousse-seringues, le défibrillateur, la colonne vidéo, l'endoscopie, l'échographe, le microscope, l'arceau mobile.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi un plan d'implantation ?", jouer: function (j, n) {
      n.mode = "equipements"; n.dessin();
      j.titre("Pourquoi faire un plan d'implantation biomédical avant de construire la salle ?");
      j.choix([
        { html: "Pour que la salle, le plafond et les réseaux soient dimensionnés pour les vrais équipements", juste: true },
        { html: "Pour choisir les couleurs des appareils", aide: "Le plan sert à placer et à alimenter, pas à décorer." },
        { html: "Il ne sert à rien : on place les appareils à la livraison", aide: "Construire la salle avant de connaître les équipements est l'erreur n° 1 du cours." }
      ], { colonnes: 1, ok: function () { j.bravo("On connaît les équipements avant de construire."); j.suite(); } });
    } },
    { nom: "Accès de maintenance", jouer: function (j, n) {
      n.mode = "maintenance"; n.dessin();
      j.titre("Le jour de la réception, tout fonctionne. Mais cette salle rendra la maintenance difficile. Touche les quatre défauts.");
      n.surPb = function (i) {
        var p = n.PB[i];
        if (n.trouves[p.id]) return;
        if (!p.ok) { n.faux = i; n.dessin(); j.erreur("Cet élément est accessible. Cherche ce qu'un technicien ne pourra pas atteindre, ouvrir ou faire passer."); return; }
        n.trouves[p.id] = true; n.faux = -1; n.dessin();
        j.info(p.nom.charAt(0).toUpperCase() + p.nom.slice(1) + ".");
        if (Object.keys(n.trouves).length < 4) return;
        n.surPb = null;
        j.bravo("Filtres, tableaux électriques, vannes, cheminement des pièces : rien n'est accessible.");
        j.expliquer("<p>Un équipement peut fonctionner le jour de la réception mais devenir difficile à maintenir si l'architecture n'a pas prévu : l'accès aux filtres, aux tableaux électriques, aux vannes, aux réseaux, le démontage des équipements, le cheminement des pièces de rechange. <b>Un équipement qui ne peut pas être correctement maintenu est un équipement mal intégré architecturalement.</b></p>");
        j.suite();
      };
      j.reponse(function () { n.PB.forEach(function (p, i) { if (p.ok && n.surPb) n.surPb(i); }); });
    } },
    { nom: "Six mois plus tard", jouer: function (j, n) {
      j.titre("Six mois après l'ouverture, le moteur d'un bras plafonnier tombe en panne. La pièce neuve ne passe ni par la porte technique ni par la trappe. Quel point n'a pas été prévu ?");
      j.choix([
        { html: "Le cheminement des pièces de rechange", juste: true },
        { html: "L'éclairage général", aide: "La lumière n'empêche pas une pièce de passer." },
        { html: "Le tri des déchets", aide: "Rien à voir : le problème est le passage d'une pièce." }
      ], { colonnes: 1, ok: function () { j.bravo("Et donc le démontage de l'équipement, lui aussi à prévoir."); j.suite(); } });
    } }
  ]
}));
