/* Niveau : appariement déterministe et probabiliste, seuils de décision, pipeline de qualité des données patient (S3, diapos 8 et 9).
   Les poids des champs ne sont pas donnés au cours : ceux-ci sont ajoutés pour l'exemple, et redonnent le score global de 0,95 du cours. */
NIVEAU(SIS.rejouable({
  id: "appariement",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.CH = [["Nom", "BENJELLOUN", "BENJELLOUNE"], ["Prénom", "Ahmed", "Ahmed"], ["Naissance", "01/01/1975", "01/01/1975"], ["Sexe", "M", "M"], ["Téléphone", "06 66 66 44 44", "06 66 66 44 44"], ["CIN", "A111111", "A111111"]];
    n.POIDS = [8, 3, 4, 1, 2, 6];
    n.sc = [0.85, 1, 1, 1, 1, 1];
    n.fmt = function (x, d) { return x.toFixed(d === undefined ? 2 : d).replace(".", ","); };
    n.dessin = function (g2) {
      var lignes = [["Champ", "Valeur A", "Valeur B", "Score partiel", "Poids"]].concat(n.CH.map(function (c, i) { return [c[0], c[1], c[2], n.fmt(n.sc[i]), String(n.POIDS[i])]; }));
      A.tableau(g2, 10, 14, [110, 160, 170, 120, 100], 50, lignes, { taille: 15, tailleTete: 14, style: function (i, k) {
        if (i > 0 && k === 3 && n.sc[i - 1] < 1) return { fond: C.koPale, bord: C.ko, ep: 2.5, gras: 700, mono: true };
        if (i > 0 && (k === 3 || k === 4)) return { mono: true };
        if (i === 1 && k === 2) return { coul: C.ko, gras: 700 };
        return null;
      } });
      A.texte(g2, "Poids : exemple ajouté (le cours ne les donne pas)", [340, 380], { taille: 13, coul: C.doux });
      var s = A.calc.scorePondere(n.sc, n.POIDS), x0 = 40, x1 = 640, X = function (v) { return x0 + (x1 - x0) * v; };
      [[0, 0.70, C.ko, C.koPale, "pas de match"], [0.70, 0.90, "#b07d14", "#fbf1d9", "revue manuelle"], [0.90, 1, C.ok, C.okPale, "match"]].forEach(function (z) {
        A.s("rect", { x: X(z[0]), y: 430, width: X(z[1]) - X(z[0]), height: 44, fill: z[3], stroke: z[2], "stroke-width": 2 }, g2);
        A.texte(g2, z[4], [(X(z[0]) + X(z[1])) / 2, 500], { taille: 14, coul: z[2], gras: 700 });
      });
      [0.70, 0.90].forEach(function (v) { A.texte(g2, n.fmt(v), [X(v), 418], { taille: 14, mono: true, coul: C.doux }); });
      if (n.montrer) {
        A.s("line", { x1: X(s), y1: 422, x2: X(s), y2: 482, stroke: C.encre, "stroke-width": 5 }, g2);
        A.texte(g2, "score global : " + n.fmt(s, 3), [Math.min(500, Math.max(160, X(s))), 548], { taille: 20, mono: true, gras: 800 });
      }
    };
    return n;
  },
  etapes: [
    { nom: "Déterministe", jouer: function (j, n) {
      var A = SIS;
      j.titre("Règle déterministe du cours : même NOM + PRÉNOM + DATE_DE_NAISSANCE → même patient. Range chaque paire d'enregistrements.");
      var cartes = [
        { t: "BENJELLOUN / AHMED / 15/03/1978\nBENJELLOUN / AHMED / 15/03/1978", bac: 0 },
        { t: "BENJELLOUN / AHMED / 15/03/1978\nBENJELLOUNE / AHMED / 15/03/1978", bac: 1 },
        { t: "EL AMRANI / SARA / 02/07/1990\nEL AMRANI / SARA / 07/02/1990", bac: 1 }
      ];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "MATCH" }, { t: "PAS DE MATCH" }],
        pos: function (i) { return { x: 20, y: 14 + i * 116, w: 640, h: 100 }; },
        bacsPos: function (k) { return { x: 20 + k * 330, y: 390, w: 310, h: 170 }; },
        taille: 17, tailleBac: 22,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return i === 0 ? "Compare les trois champs lettre à lettre : tout est identique ?" : "Compare lettre à lettre : un seul caractère qui diffère suffit à faire échouer la règle."; },
        fin: function () {
          j.bravo("Seule la première paire passe. Une faute de frappe ou une date inversée, et la règle échoue.");
          j.expliquer("<p>C'est la faiblesse de l'<b>appariement déterministe</b> : il ne tolère aucune erreur de saisie. Le même patient, mal saisi, devient un doublon.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le score pondéré", jouer: function (j, n) {
      n.sc = [0.85, 1, 1, 1, 1, 1]; n.montrer = false;
      SIS.vider(n.g); n.dessin(n.g);
      j.titre("Appariement probabiliste : chaque champ a un score partiel, pondéré par son importance. Calcule le score global de cet exemple du cours.");
      j.consigne("Score global = somme des (score partiel × poids) divisée par la somme des poids.");
      j.nombre({ cases: [{ attendu: 0.95, tol: 0.005 }], avant: "\\text{score} =", aide: function () { return "Somme des poids : 8 + 3 + 4 + 1 + 2 + 6 = 24. Numérateur : 0,85 × 8 + 3 + 4 + 1 + 2 + 6."; }, ok: function () {
        n.montrer = true; SIS.vider(n.g); n.dessin(n.g);
        j.bravo("\\((0{,}85 \\times 8 + 16) / 24 = 22{,}8 / 24 = 0{,}95\\) : match automatique.");
        j.expliquer("<p>Seuils de décision du cours : score &gt; 0,90 → MATCH automatique ; entre 0,70 et 0,90 → REVUE MANUELLE (l'agent d'admission vérifie) ; score &lt; 0,70 → PAS DE MATCH. La diapositive écrit « 0,85 % » et « 0,95 % » : il s'agit de 0,85 et 0,95 (85 % et 95 %).</p>");
        j.suite();
      } });
    } },
    { nom: "Le nom de plus en plus faux", jouer: function (j, n) {
      n.sc = [0.85, 1, 1, 1, 1, 1]; n.montrer = true;
      SIS.vider(n.g); n.dessin(n.g);
      j.titre("Le nom est de plus en plus mal saisi. Fais glisser son score partiel : à partir de quelle valeur l'appariement n'est-il plus automatique ?");
      var cur = j.curseur({ nom: "Score partiel du nom", min: 0, max: 1, pas: 0.05, val: 0.85, dec: 2, change: function (v) { n.sc[0] = v; SIS.vider(n.g); n.dessin(n.g); } });
      j.nombre({ cases: [{ attendu: 0.7, tol: 0.001 }], avant: "\\text{nom} \\le", aide: function () { return "Le score global vaut (8 × nom + 16) / 24. Cherche quand il tombe à 0,90 : il faut alors être strictement au-dessus pour le match."; }, ok: function () {
        n.sc[0] = 0.7; cur.regler(0.7); SIS.vider(n.g); n.dessin(n.g);
        j.bravo("Nom à 0,70 : score global = 0,90, plus strictement au-dessus : revue manuelle.");
        j.suite();
      } });
    } },
    { nom: "La CIN diffère", jouer: function (j, n) {
      n.sc = [1, 1, 1, 1, 1, 0]; n.montrer = false;
      SIS.vider(n.g); n.dessin(n.g);
      j.titre("Cette fois, tout est identique sauf la CIN (score partiel 0). Que décide l'algorithme ?");
      j.choix([
        { html: "MATCH automatique", aide: "Calcule : (24 − 6) / 24. Est-ce au-dessus de 0,90 ?" },
        { html: "REVUE MANUELLE", juste: true },
        { html: "PAS DE MATCH", aide: "Calcule : (24 − 6) / 24. Est-ce sous 0,70 ?" }
      ], { colonnes: 1, ok: function () {
        n.montrer = true; SIS.vider(n.g); n.dessin(n.g);
        j.bravo("18 / 24 = 0,75 : l'agent d'admission vérifie.");
        j.expliquer("<p>C'est l'intérêt du probabiliste : pas de verdict brutal sur un seul champ. Un champ très important qui diffère fait douter, et l'humain tranche.</p>");
        j.suite();
      } });
    } },
    { nom: "Le pipeline", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Pipeline de qualité des données patient : touche ses quatre étapes dans l'ordre.");
      var nd = [
        { t: "Appariement (MPI)", sous: "comparaison, score, décision", x: 350, y: 330, w: 310, h: 110 },
        { t: "Normalisation", sous: "majuscules, accents, format du numéro", x: 350, y: 60, w: 310, h: 110 },
        { t: "Capture", sous: "saisie libre à l'admission", x: 20, y: 330, w: 310, h: 110 },
        { t: "Contrôle", sous: "date cohérente ? téléphone valide ? CIN valide ?", x: 20, y: 60, w: 310, h: 110 }
      ];
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [2, 1, 3, 0], coul: C.jeu, taille: 19,
        erreur: j.erreur,
        aide: function (i, att, k) { return ["Tout commence par la saisie.", "Avant de contrôler, on met les données sous une forme standard.", "On vérifie que chaque valeur est plausible.", "Enfin, on compare avec la base existante."][k]; },
        fin: function () {
          j.bravo("Capture → normalisation → contrôle → appariement.");
          j.expliquer("<p>Trois issues : <b>doublon détecté</b> → fusion ; <b>nouveau patient</b> → création ; <b>revue manuelle</b> → l'opérateur décide. Le <b>Golden Record</b> (fiche pivot) est la version unique et consolidée des données d'un patient, issue de la fusion des doublons détectés.</p>");
          j.suite();
        } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Normaliser", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 40, 140, 600, 120, { titre: "« Benjelloun  éva »   tél. +212 6 66 66 44 44", taille: 24, mono: true, fond: C.fond, bord: C.trait });
      A.texte(n.g, "saisie libre à l'admission", [340, 290], { taille: 16, coul: C.doux });
      j.titre("Voici une saisie libre. Que donne l'étape de normalisation du pipeline ?");
      j.choix([
        { html: "BENJELLOUN EVA, 06 66 66 44 44", juste: true },
        { html: "Benjelloun Éva, +212 6 66 66 44 44", aide: "La normalisation met en majuscules et retire les accents." },
        { html: "BENJELLOUN ÉVA, 666664444", aide: "Les accents sont supprimés, et le numéro prend un format standard." }
      ], { colonnes: 1, ok: function () { j.bravo("Majuscules, sans accents, espaces réduits, numéro au format standard."); j.suite(); } });
    } }
  ]
}));
