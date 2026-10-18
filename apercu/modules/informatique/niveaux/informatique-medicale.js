/* Niveau : dualité DM / logiciel et définition de l'informatique médicale (S1S2, diapos 5 et 6). */
NIVEAU(SIS.rejouable({
  id: "informatique-medicale",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    // Les trois cercles de l'informatique médicale
    n.CERCLES = [
      { c: [340, 220], nom: "La médecine / biologie", coul: C.turq, t: [340, 62] },
      { c: [256, 365], nom: "L'informatique", coul: C.v, t: [172, 420] },
      { c: [424, 365], nom: "Les mathématiques / statistiques", coul: C.acc, t: [512, 420] }
    ];
    n.venn = function (g2, etat) {
      fig.chip(null);
      
      n.CERCLES.forEach(function (c) { A.s("circle", { cx: c.c[0], cy: c.c[1], r: 140, fill: c.coul, "fill-opacity": 0.13, stroke: c.coul, "stroke-width": 3 }, g2); });
      n.CERCLES.forEach(function (c) { A.texte(g2, c.nom, c.t, { taille: 17, coul: c.coul, gras: 700, largeur: 170 }); });
      if (etat.faux >= 0) { var z = n.ZONES[etat.faux]; A.s("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: 12, fill: C.koPale, stroke: C.ko, "stroke-width": 2.5, "fill-opacity": 0.7 }, g2); }
      if (etat.trouve[0]) {
        A.s("circle", { cx: 340, cy: 317, r: 36, fill: C.jeu, stroke: "#fff", "stroke-width": 3 }, g2);
        A.texte(g2, "Informatique médicale", [340, 565], { taille: 22, gras: 800, coul: C.encre });
        A.fleche(g2, [340, 545], [340, 360], { coul: C.encre, ep: 3 });
      }
    };
    n.ZONES = [
      { x: 310, y: 287, w: 60, h: 60, bon: true },
      { x: 300, y: 115, w: 80, h: 70 }, { x: 140, y: 440, w: 90, h: 70 }, { x: 450, y: 440, w: 90, h: 70 },
      { x: 252, y: 240, w: 45, h: 45 }, { x: 383, y: 240, w: 45, h: 45 }, { x: 318, y: 400, w: 45, h: 45 }
    ];
    return n;
  },
  etapes: [
    { nom: "Le corps et l'intelligence", jouer: function (j, n) {
      var A = SIS;
      j.titre("Un électrocardiographe enregistre le cœur d'un patient. Range chaque élément du côté du matériel ou du logiciel.");
      j.consigne("Touche une carte, puis le bac qui lui va.");
      var t = A.trier({
        g: n.g,
        cartes: [
          { t: "Électrodes et capteurs posés sur la peau", bac: 0 }, { t: "Filtrer le bruit sur le tracé", bac: 1 },
          { t: "Acquisition du signal brut", bac: 0 }, { t: "Signaler un trouble du rythme au médecin", bac: 1 }
        ],
        bacs: [{ t: "Le DM (matériel)", sous: "le corps du système" }, { t: "Le software", sous: "l'intelligence du système" }],
        pos: A.grille(4, 2, 30, 60, 620, 100, 22),
        bacsPos: function (k) { return { x: 30 + k * 325, y: 400, w: 295, h: 150 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return [0, 2].indexOf(i) >= 0 ? "Ce qui touche le patient et capte la grandeur physique, c'est la partie physique du système." : "Transformer le signal ou aider à décider, c'est du calcul : le rôle du logiciel."; },
        fin: function () {
          j.bravo("Capteurs et acquisition : le DM. Traitement du signal et aide à la décision : le logiciel.");
          j.expliquer("<p>Le cours parle de <b>dualité DM / software</b>. Le DM est le corps du système : la physique, les capteurs, l'acquisition de la donnée brute. Le logiciel est son intelligence : le traitement du signal et l'aide à la décision médicale.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le pont", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.boite(n.g, 30, 200, 230, 160, { titre: "DM", sous: "capteurs, acquisition", fond: SIS.C.turqPale, bord: SIS.C.turq, taille: 24 });
      SIS.boite(n.g, 420, 200, 230, 160, { titre: "Software", sous: "traitement, aide à la décision", fond: SIS.C.vPale, bord: SIS.C.v, taille: 24 });
      SIS.s("rect", { x: 270, y: 262, width: 140, height: 36, rx: 8, fill: "#fff", stroke: SIS.C.encre, "stroke-width": 2.5, "stroke-dasharray": "8 6" }, n.g);
      SIS.texte(n.g, "?", [340, 280], { taille: 28, gras: 800 });
      j.titre("Le capteur est bon, l'algorithme aussi, mais ils ne se comprennent pas. Qui, d'après le cours, fait le pont entre les deux ?");
      j.choix([
        { html: "L'ingénieur biomédical", juste: true },
        { html: "Le médecin prescripteur", aide: "Le médecin utilise le résultat. Le cours désigne un métier qui connaît à la fois l'appareil et le logiciel." },
        { html: "Le fabricant du capteur seul", aide: "Le fabricant connaît son capteur. Il faut quelqu'un qui relie le matériel au logiciel dans l'hôpital." }
      ], { colonnes: 1, ok: function () {
        SIS.vider(n.g);
        SIS.boite(n.g, 30, 200, 230, 160, { titre: "DM", sous: "capteurs, acquisition", fond: SIS.C.turqPale, bord: SIS.C.turq, taille: 24 });
        SIS.boite(n.g, 420, 200, 230, 160, { titre: "Software", sous: "traitement, aide à la décision", fond: SIS.C.vPale, bord: SIS.C.v, taille: 24 });
        SIS.boite(n.g, 250, 250, 180, 60, { titre: "Ingénieur biomédical", fond: SIS.C.jeuPale, bord: SIS.C.jeu, taille: 16 });
        j.bravo("L'ingénieur biomédical est le pont entre les deux.");
        j.suite();
      } });
    } },
    { nom: "Trois disciplines", jouer: function (j, n) {
      j.titre("L'informatique médicale naît de trois disciplines. Touche, sur la figure, la zone qui la représente.");
      var r = SIS.reperer({
        g: n.g, zones: n.ZONES, dessiner: n.venn,
        erreur: j.erreur,
        aide: function (i) { return i <= 3 ? "Cette zone n'appartient qu'à une discipline. Cherche la zone commune aux trois cercles." : "Ici, seulement deux cercles se croisent. Il en faut trois."; },
        fin: function () {
          j.bravo("Le cœur commun aux trois cercles.", [340, 317]);
          j.expliquer("<p>L'<b>informatique médicale</b> est à l'intersection de la médecine / biologie, de l'informatique et des mathématiques / statistiques. Il faut les trois : la question médicale, l'outil pour traiter la donnée, et les statistiques pour savoir si un résultat est fiable.</p>");
          j.suite();
        }
      });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Le cercle manquant", jouer: function (j, n) {
      j.titre("Une équipe réunit des cardiologues et des développeurs. Leur algorithme trouve un lien entre un médicament et les chutes, mais personne ne sait dire si ce lien est dû au hasard. Quel cercle leur manque ?");
      j.choix([
        { html: "La médecine / biologie", aide: "Les cardiologues sont là. Qui sait dire si un résultat chiffré est dû au hasard ?" },
        { html: "L'informatique", aide: "Les développeurs sont là. Le doute porte sur la valeur du résultat, pas sur le programme." },
        { html: "Les mathématiques / statistiques", juste: true }
      ], { colonnes: 1, ok: function () { j.bravo("Les statistiques disent si un lien observé est significatif."); j.suite(); } });
    } },
    { nom: "Réactive ou prédictive", jouer: function (j, n) {
      j.titre("Un logiciel parcourt les dossiers de l'hôpital et repère les patients qui risquent une insuffisance cardiaque, avant les premiers symptômes. Quel changement décrit le cours ?");
      j.choix([
        { html: "La médecine passe d'une science réactive à une science prédictive", juste: true },
        { html: "La médecine passe d'une science prédictive à une science réactive", aide: "Avant les symptômes : on anticipe au lieu de réagir. Dans quel sens va le changement ?" },
        { html: "Le médecin n'a plus besoin d'examiner le patient", aide: "Le cours ne dit pas cela. Il parle de ce que l'informatique change dans la façon de soigner : réagir ou anticiper." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Réactive → prédictive.");
        j.expliquer("<p>Phrase clé du cours : <b>l'informatique transforme la médecine d'une science réactive à une science prédictive</b>. On soigne la maladie déclarée, mais on peut aussi anticiper grâce aux données accumulées.</p>");
        j.suite();
      } });
    } }
  ]
}));
