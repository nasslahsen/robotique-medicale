/* Niveau : parcours d'une donnée de santé, de la mesure à la décision (S1S2, diapo 46). */
NIVEAU(SIS.rejouable({
  id: "parcours-donnee",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.ETAPES = [["Mesure", "lit du patient"], ["Saisie DPI", ""], ["HL7", "message"], ["Base de données", "production"], ["ETL", "entrepôt"], ["Analyse", "interprétation"], ["Décision", "comité médical"]];
    return n;
  },
  etapes: [
    { nom: "De la mesure à la décision", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("La tension de M. Alaoui finira dans une décision du comité médical. Touche les étapes de son parcours, dans l'ordre.");
      var place = [5, 0, 3, 6, 1, 4, 2]; // case de chaque étape dans une grille 3 × 3
      var nd = n.ETAPES.map(function (e, i) { var c = place[i]; return { t: e[0], sous: e[1] || null, x: 20 + (c % 3) * 222, y: 40 + Math.floor(c / 3) * 180, w: 196, h: 100 }; });
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [0, 1, 2, 3, 4, 5, 6], coul: C.jeu, taille: 19,
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "Tout part d'une mesure au lit du patient." : ["", "Une fois mesurée, la valeur est saisie quelque part.", "Pour quitter le DPI, elle part dans un message standard.", "Le message est enregistré dans la base de production.", "Pour l'analyse, on l'extrait et on la charge dans l'entrepôt.", "Dans l'entrepôt, on l'analyse.", "L'analyse sert à décider."][k]; },
        fin: function () {
          j.bravo("Mesure → saisie DPI → HL7 → base de production → ETL → analyse → décision.");
          j.expliquer("<p>La donnée traverse <b>6 à 7 systèmes</b> : chaque passage est un risque d'erreur. L'<b>ETL</b> (extraction, transformation, chargement) copie les données de la production vers l'entrepôt.</p>");
          j.suite();
        } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Chaque passage compte", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.texte(n.g, "Exemple ajouté", [340, 40], { taille: 15, coul: C.doux });
      n.ETAPES.forEach(function (e, i) {
        var x = 20 + i * 92;
        A.boite(n.g, x, 120, 84, 84, { titre: e[0], taille: 13 });
        if (i) A.texte(n.g, "99 %", [x - 4, 240], { taille: 15, mono: true, coul: C.acc, gras: 700 });
      });
      A.texte(n.g, "probabilité qu'un passage transmette la valeur sans erreur", [340, 290], { taille: 16, coul: C.doux, largeur: 520 });
      j.titre("Supposons que chacun des 6 passages entre deux étapes transmet la valeur juste 99 fois sur 100. Quelle chance a-t-elle d'arriver intacte à la décision ?");
      j.nombre({ cases: [{ attendu: 94.1, tol: 0.15 }], apres: "\\%", aide: function () { return "Il faut réussir le premier passage ET le deuxième ET... : multiplie 0,99 six fois."; }, ok: function () {
        A.texte(n.g, "0,99⁶ ≈ 0,941", [340, 400], { taille: 30, mono: true, gras: 700 });
        A.texte(n.g, "≈ 6 valeurs sur 100 abîmées en route", [340, 460], { taille: 19, coul: C.ko, gras: 700 });
        j.bravo("\\(0{,}99^6 \\approx 0{,}941\\) : environ 94 %.");
        j.expliquer("<p>Même avec des passages fiables à 99 %, la chaîne perd environ 6 % des valeurs. C'est pour cela que le cours dit : chaque passage est un risque d'erreur.</p>");
        j.suite();
      } });
    } },
    { nom: "Le doute scientifique", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 90, 150, 500, 220, { titre: "Durée moyenne de séjour en cardiologie", sous: "mars 2026", fond: C.fond, bord: C.trait, taille: 20 });
      A.texte(n.g, "0 jour", [340, 320], { taille: 54, gras: 800, mono: true, coul: C.ko });
      j.titre("Le tableau de bord affiche une durée moyenne de séjour de 0 jour en cardiologie. Que fait un bon analyste hospitalier ?");
      j.choix([
        { html: "Il présente le chiffre au comité : c'est ce que dit l'entrepôt", aide: "Un séjour de 0 jour en cardiologie en moyenne : est-ce plausible ?" },
        { html: "Il doute, et remonte la chaîne pour trouver l'étape où la donnée a été abîmée", juste: true },
        { html: "Il remplace le chiffre par celui du mois dernier", aide: "On ne maquille pas une donnée : on cherche d'où vient l'erreur." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Première qualité de l'analyste hospitalier : le doute scientifique.");
        j.expliquer("<p>Une date de sortie mal convertie à l'ETL, un champ vide traité comme zéro : l'erreur peut venir de n'importe quel passage. On la cherche à la source.</p>");
        j.suite();
      } });
    } }
  ]
}));
