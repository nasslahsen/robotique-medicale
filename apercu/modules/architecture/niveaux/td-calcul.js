/* Niveau : TD 1, partie IV. Salle de 180 m³, 20 renouvellements par heure retenus par l'exercice, débit mesuré 3 060 m³/h. */
NIVEAU(ARCHI.rejouable({
  id: "td-calcul",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { V: 180, Q: null, ach: null, pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      // salle et jauge d'ACH
      A.s("rect", { x: 40, y: 170, width: 300, height: 220, fill: "#f7f9fc", stroke: C.encre, "stroke-width": 4 }, g);
      A.texte(g, "V = 180 m³", [190, 280], { taille: 24, mono: true, gras: 800 });
      A.s("line", { x1: 80, y1: 176, x2: 300, y2: 176, stroke: C.acc, "stroke-width": 10 }, g);
      A.texte(g, n.Q ? "Q = " + String(n.Q).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " m³/h" : "Q = ?", [190, 140], { taille: 20, mono: true, coul: C.acc });
      var gx = 440, gy = 480, gh = 380, max = 30, y = function (v) { return gy - v / max * gh; };
      A.s("rect", { x: gx, y: gy - gh, width: 70, height: gh, rx: 8, fill: C.pale }, g);
      if (n.ach) A.s("rect", { x: gx, y: y(n.ach), width: 70, height: gy - y(n.ach), rx: 8, fill: n.ach < 20 ? C.ko : C.ok }, g);
      A.s("line", { x1: gx - 14, y1: y(20), x2: gx + 90, y2: y(20), stroke: C.encre, "stroke-width": 3, "stroke-dasharray": "7 5" }, g);
      A.texte(g, "20 ACH retenus", [gx + 98, y(20)], { taille: 16, ancre: "start" });
      A.texte(g, "(donnée de l'exercice)", [gx + 98, y(20) + 22], { taille: 13, ancre: "start", coul: C.doux });
      if (n.ach) A.texte(g, String(n.ach) + " ACH mesurés", [gx - 16, y(n.ach) + 4], { taille: 16, ancre: "end", coul: n.ach < 20 ? C.ko : C.ok });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le débit théorique", jouer: function (j, n) {
      j.titre("Une salle a un volume de 180 m³. Le programme de l'exercice retient 20 renouvellements d'air par heure. Quel débit faut-il souffler ?");
      j.consigne("Rappel du TD : ACH = débit volumique d'air (m³/h) ÷ volume du local (m³).");
      j.nombre({ avant: "Q =", apres: "\\text{m}^3/\\text{h}", cases: [{ attendu: 3600, tol: 0.5 }], ligne: true,
        aide: function () { return "Retourne la formule : débit = ACH × volume."; },
        ok: function () {
          n.Q = 3600; n.dessin();
          j.bravo("Q = 20 × 180 = 3 600 m³/h.");
          j.expliquer("\\[ Q = \\text{ACH} \\times V = 20 \\times 180 = 3\\,600\\ \\text{m}^3/\\text{h} \\]");
          j.suite();
        } });
    } },
    { nom: "Le taux mesuré", jouer: function (j, n) {
      j.titre("À la mesure, le débit vaut 3 060 m³/h. Quel taux de renouvellement obtient-on ?");
      j.nombre({ avant: "\\text{ACH} =", cases: [{ attendu: 17, tol: 0.01 }], ligne: true,
        aide: function () { return "Divise le débit mesuré par le volume : 3 060 ÷ 180."; },
        ok: function () {
          n.Q = 3060; n.ach = 17; n.dessin();
          j.bravo("3 060 ÷ 180 = 17 renouvellements par heure.");
          j.suite();
        } });
    } },
    { nom: "Conclure", jouer: function (j, n) {
      j.titre("17 ACH mesurés pour 20 retenus. Que conclus-tu ?");
      j.choix([
        { html: "C'est bon : 17 est au-dessus de 15", aide: "15 vient d'un autre référentiel. Ici, l'énoncé retient 20 : on compare à la valeur du programme." },
        { html: "L'installation n'atteint pas la valeur retenue : il faut vérifier (filtres, réglages, mesures) avant de conclure", juste: true },
        { html: "Il suffit de diminuer le volume de la salle", aide: "On ne rapetisse pas une salle construite : on cherche pourquoi le débit est trop faible." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Écart de 3 ACH, soit 540 m³/h manquants : une vérification s'impose.");
        j.expliquer("<p>Le débit manquant vaut \\(3\\,600 - 3\\,060 = 540\\) m³/h. Causes possibles à vérifier : filtres encrassés, registres mal réglés, ventilateur, mesure elle-même. Le TD rappelle que 20 ACH est une donnée de l'exercice, et non une prescription universelle.</p>");
        j.suite();
      } });
    } },
    { nom: "Les limites du calcul", jouer: function (j, n) {
      j.titre("Ce calcul d'ACH ne dit pas tout. Laquelle de ces informations n'est pas une limite citée par le TD ?");
      j.choix([
        { html: "La répartition de l'air dans la salle", aide: "C'est une limite citée : le même débit peut être mal réparti." },
        { html: "La couleur des bouches de soufflage", juste: true },
        { html: "La part d'air neuf et d'air recyclé", aide: "C'est une limite citée : l'ACH ne dit pas d'où vient l'air." },
        { html: "Les pressions entre locaux", aide: "C'est une limite citée : l'ACH ne dit pas dans quel sens l'air passe les portes." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Limites : répartition de l'air, filtration, pressions, air neuf / recyclé, qualité des mesures, référentiel.");
        j.suite();
      } });
    } }
  ]
}));
