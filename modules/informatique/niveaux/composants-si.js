/* Niveau : les cinq composants d'un SI (S1S2, diapos 12, 23, 27, 30, 33). */
NIVEAU(SIS.rejouable({
  id: "composants-si",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.NOMS = ["Organisation", "Logiciels", "Données", "Matériel", "Personnels"];
    // pentagone autour du système d'information, dans l'ordre du cours (organisation en haut, puis sens horaire)
    n.pos = function (k) { var a = -Math.PI / 2 + k * 2 * Math.PI / 5; return [340 + 175 * Math.cos(a), 395 + 160 * Math.sin(a)]; };
    n.centre = function (g2) {
      n.NOMS.forEach(function (_, k) { var p = n.pos(k); A.s("line", { x1: 340, y1: 395, x2: p[0], y2: p[1], stroke: C.trait, "stroke-width": 3 }, g2); });
      A.s("circle", { cx: 340, cy: 395, r: 66, fill: C.jeu, stroke: "#fff", "stroke-width": 3 }, g2);
      A.texte(g2, "Système d'information", [340, 395], { taille: 16, coul: "#fff", halo: false, gras: 800, largeur: 110 });
    };
    n.bac = function (g2, k, faux) {
      var p = n.pos(k), st = A.BACS[k];
      A.s("ellipse", { cx: p[0], cy: p[1], rx: 92, ry: 42, fill: faux ? C.koPale : st.pale, stroke: faux ? C.ko : st.coul, "stroke-width": 3 }, g2);
      A.texte(g2, n.NOMS[k], p, { taille: 18, gras: 800, coul: st.coul, halo: false });
    };
    return n;
  },
  etapes: [
    { nom: "Cinq composants", jouer: function (j, n) {
      var A = SIS;
      j.titre("Dans un service de pédiatrie, range chaque élément dans le composant du SI qu'il représente.");
      j.consigne("Touche une carte, puis un composant.");
      var cartes = [{ t: "L'infirmière et le pédiatre", bac: 4 }, { t: "Les courbes de poids des enfants", bac: 2 }, { t: "Le DPI et Windows", bac: 1 }, { t: "Le circuit de la prescription", bac: 0 }, { t: "Les postes et l'imprimante", bac: 3 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.NOMS.map(function (x) { return { t: x }; }),
        pos: A.grille(5, 3, 14, 14, 652, 70, 12),
        bacsPos: function (k) { var p = n.pos(k); return { x: p[0] - 92, y: p[1] - 42, w: 184, h: 84 }; },
        fond: n.centre, dessinBac: n.bac, taille: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Ce sont des personnes.", "C'est ce que le SI garde et fait circuler.", "Ce sont des programmes.", "C'est une façon d'organiser le travail.", "Ce sont des équipements physiques."][i]; },
        fin: function () {
          j.bravo("Organisation, logiciels, données, matériel, personnels.");
          j.expliquer("<p>Le cours décrit un SI par <b>cinq composants</b> reliés au même centre. Chacun a ses choix et ses risques : la suite du chapitre les prend un par un.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le meilleur logiciel ne suffit pas", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g); n.centre(n.g);
      n.NOMS.forEach(function (_, k) { n.bac(n.g, k, false); });
      [1, 3].forEach(function (k) { var p = n.pos(k); A.s("circle", { cx: p[0] + 80, cy: p[1] - 34, r: 15, fill: C.ok }, n.g); A.s("path", { d: "M" + (p[0] + 73) + " " + (p[1] - 34) + " l5 5 l9 -10", fill: "none", stroke: "#fff", "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" }, n.g); });
      j.titre("Une clinique achète un excellent logiciel et des serveurs neufs. Six mois plus tard, personne ne s'en sert vraiment : aucune formation, et rien n'a été décidé sur qui saisit quoi. Quels composants ont été oubliés ?");
      j.choix([
        { html: "Les données et le matériel", aide: "Le matériel est neuf. Relis la fin : formation, et qui saisit quoi." },
        { html: "Les personnels et l'organisation", juste: true },
        { html: "Les logiciels et les données", aide: "Le logiciel est excellent. Le problème vient des personnes et des règles de travail." }
      ], { colonnes: 1, ok: function () { j.bravo("Personnels (formation) et organisation (qui fait quoi)."); j.suite(); } });
    } },
    { nom: "L'intrus", jouer: function (j, n) {
      j.titre("Lequel n'est pas l'un des cinq composants d'un SI dans le cours ?");
      j.choix([
        { html: "Organisation", aide: "Organisation est le premier composant du cours : processus, procédures, workflow." },
        { html: "Données", aide: "Les données sont l'un des cinq : base de données, SGBD." },
        { html: "Budget", juste: true },
        { html: "Personnels", aide: "Les personnels sont l'un des cinq : acteurs internes et externes." }
      ], { colonnes: 2, ok: function () { j.bravo("Le budget compte, mais ce n'est pas un composant du SI dans le cours."); j.suite(); } });
    } }
  ]
}));
