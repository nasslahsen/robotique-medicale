/* Niveau : LIS, circuit d'un examen biologique en trois phases, temps de traitement (TAT), risques (S3, diapos 13 et 14). */
NIVEAU(SIS.rejouable({
  id: "circuit-lis",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.PH = [{ t: "Pré-analytique", p: 60, coul: C.acc, pale: C.accPale }, { t: "Analytique", p: 25, coul: C.ok, pale: C.okPale }, { t: "Post-analytique", p: 15, coul: C.v, pale: C.vPale }];
    n.barre = function (g2, total) {
      var x = 20;
      n.PH.forEach(function (ph) {
        var w = 640 * ph.p / 100;
        A.s("rect", { x: x, y: 250, width: w, height: 70, fill: ph.coul }, g2);
        A.texte(g2, ph.t, [x + w / 2, 285], { taille: ph.p < 20 ? 14 : 18, coul: "#fff", halo: false, gras: 800, largeur: w - 6 });
        A.texte(g2, ph.p + " %", [x + w / 2, 350], { taille: 18, mono: true, gras: 700, coul: ph.coul });
        if (total) A.texte(g2, String(total * ph.p / 100).replace(".", ",") + " min", [x + w / 2, 390], { taille: 18, mono: true, gras: 700 });
        x += w;
      });
      A.texte(g2, "Répartition du temps de traitement (TAT)", [340, 220], { taille: 17, gras: 700 });
    };
    return n;
  },
  etapes: [
    { nom: "Trois phases", jouer: function (j, n) {
      var A = SIS;
      j.titre("Une NFS est demandée. Range chaque étape du circuit dans sa phase.");
      var cartes = [
        { t: "Prescription médicale", bac: 0 }, { t: "Chargement des automates", bac: 1 }, { t: "Validation biologique", bac: 2 },
        { t: "Prélèvement de l'échantillon", bac: 0 }, { t: "Contrôle qualité (CQI)", bac: 1 }, { t: "Diffusion des résultats (HL7)", bac: 2 },
        { t: "Acheminement et tri", bac: 0 }, { t: "Exécution des analyses", bac: 1 }, { t: "Archivage légal", bac: 2 },
        { t: "Centrifugation", bac: 0 }, { t: "Interfaçage bidirectionnel", bac: 1 }, { t: "Validation technique", bac: 2 }
      ];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.PH.map(function (p) { return { t: p.t }; }),
        pos: A.grille(12, 3, 10, 10, 660, 54, 8),
        bacsPos: function (k) { return { x: 10 + k * 222, y: 270, w: 214, h: 300 }; },
        couleurs: function (k) { return n.PH[k]; },
        dessinBac: function (g2, k, faux) { var p = n.PH[k]; A.boite(g2, 10 + k * 222, 270, 214, 300, { fond: faux ? A.C.koPale : p.pale, bord: faux ? A.C.ko : p.coul, ep: 3, titre: p.t, taille: 19, coul: p.coul }); },
        taille: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Tout ce qui se passe avant que l'automate touche le tube.", "Tout ce qui se passe dans et autour de l'automate.", "Tout ce qui se passe une fois le résultat produit."][b]; },
        fin: function () { j.bravo("Avant l'automate, dans l'automate, après l'automate."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le temps de la troponine", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.barre(n.g, 0);
      A.texte(n.g, "Exemple ajouté : TAT total de 90 min", [340, 120], { taille: 17, coul: A.C.doux });
      j.titre("Une troponine met 90 minutes entre la prescription et le résultat. D'après la répartition du cours, combien de minutes en phase pré-analytique ?");
      j.nombre({ cases: [{ attendu: 54, tol: 0.01 }], apres: "\\text{ min}", aide: function () { return "La phase pré-analytique prend 60 % du temps : 0,60 × 90."; }, ok: function () {
        A.vider(n.g); n.barre(n.g, 90);
        j.bravo("\\(0{,}60 \\times 90 = 54\\) min ; puis 22,5 min d'analytique et 13,5 min de post-analytique.");
        j.expliquer("<p>La phase <b>pré-analytique</b> est la plus longue, et c'est aussi le <b>principal gisement d'erreurs</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Les points de risque", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours liste quatre points de risque du LIS. Range chacun dans la phase où il naît.");
      var cartes = [{ t: "Prélèvement mal identifié", bac: 0 }, { t: "Valeur critique non communiquée", bac: 2 }, { t: "Résultat rendu sur le mauvais dossier", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.PH.map(function (p) { return { t: p.t }; }),
        pos: function (i) { return { x: 14 + i * 222, y: 30, w: 208, h: 150 }; },
        bacsPos: function (k) { return { x: 10 + k * 222, y: 270, w: 214, h: 250 }; },
        couleurs: function (k) { return n.PH[k]; },
        dessinBac: function (g2, k, faux) { var p = n.PH[k]; A.boite(g2, 10 + k * 222, 270, 214, 250, { fond: faux ? A.C.koPale : p.pale, bord: faux ? A.C.ko : p.coul, ep: 3, titre: p.t, taille: 19, coul: p.coul }); },
        taille: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["L'étiquette se pose au moment du prélèvement.", "Le résultat existe : c'est sa diffusion qui manque.", "Le résultat est juste mais part au mauvais endroit, à la diffusion."][i]; },
        fin: function () {
          j.bravo("Identification au prélèvement ; communication et rattachement à la diffusion.");
          j.expliquer("<p>Quatrième point de risque du cours : la <b>panne du LIS</b>, qui impose un mode dégradé papier, sur toutes les phases.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Biologie délocalisée", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.icone(n.g, "tube", [150, 240], 110); A.texte(n.g, "analyse au lit du patient, aux urgences", [340, 360], { taille: 18, gras: 700 });
      A.icone(n.g, "patient", [480, 240], 110, C.doux);
      j.titre("Cas d'étude du cours : le délai de rendu de la troponine. Qu'apporte une biologie délocalisée (analyse faite aux urgences), et quel nouveau risque crée-t-elle ?");
      j.consigne("Le cours pose la question ; voici la réponse attendue.");
      j.choix([
        { html: "Elle supprime l'acheminement et raccourcit la phase pré-analytique, mais la validation et la traçabilité du résultat (bon patient, remontée au LIS et au DPI) deviennent plus difficiles", juste: true },
        { html: "Elle supprime tout risque, puisque l'analyse est faite au lit", aide: "Qui valide le résultat, et comment arrive-t-il dans le dossier ?" },
        { html: "Elle allonge la phase analytique", aide: "Ce qui change surtout, c'est le trajet du tube avant l'analyse." }
      ], { colonnes: 1, ok: function () { j.bravo("Moins de temps de transport, plus d'exigence de validation et de traçabilité."); j.suite(); } });
    } }
  ]
}));
