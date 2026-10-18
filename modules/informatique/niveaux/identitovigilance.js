/* Niveau : organisation de l'identitovigilance, acteurs, manipulations, indicateurs (S3, diapo 10). */
NIVEAU(SIS.rejouable({
  id: "identitovigilance",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.ACT = [
      { t: "Comité d'identitovigilance", sous: "gouvernance et politique" },
      { t: "Cellule d'identitovigilance", sous: "référent et gestionnaires" },
      { t: "Accueil et admissions", sous: "premier point de contact" },
      { t: "Services cliniques", sous: "soins, labo, imagerie, bloc" },
      { t: "DIM, DSI, biomédical", sous: "appui technique et données" }
    ];
    return n;
  },
  etapes: [
    { nom: "Qui fait quoi ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque tâche chez l'acteur de l'identitovigilance qui en a la charge.");
      var cartes = [
        { t: "Fixer la politique d'identification", bac: 0 }, { t: "Valider les fusions de dossiers", bac: 1 }, { t: "Rechercher avant de créer un dossier", bac: 2 },
        { t: "Poser le bracelet, étiqueter les prélèvements", bac: 3 }, { t: "Associer les DM au bon patient", bac: 4 }, { t: "Examiner le bilan annuel des incidents", bac: 0 },
        { t: "Faire dire son nom au patient", bac: 3 }, { t: "Traiter doublons et collisions", bac: 1 }
      ];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.ACT,
        pos: A.grille(8, 2, 10, 10, 660, 62, 8),
        bacsPos: function (k) { return { x: 10 + (k % 3) * 222, y: 300 + Math.floor(k / 3) * 150, w: 214, h: 136 }; },
        taille: 15, tailleBac: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["C'est une décision de gouvernance, au plus haut niveau.", "C'est le travail du référent et des gestionnaires qui corrigent les dossiers.", "Cela se fait au guichet, avant toute création.", "Cela se fait au lit du patient ou au prélèvement.", "C'est un réglage technique, côté équipements et données."][b]; },
        fin: function () { j.bravo("Comité : politique. Cellule : corrections. Accueil : recherche. Services : vérification au lit. DIM, DSI, biomédical : appui technique."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le taux de doublons", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 60, 120, 260, 160, { titre: "40 000", sous: "dossiers actifs", taille: 40, fond: C.fond, bord: C.trait });
      A.boite(n.g, 360, 120, 260, 160, { titre: "120", sous: "doublons détectés", taille: 40, fond: C.koPale, bord: C.ko });
      A.texte(n.g, "Exemple ajouté", [340, 330], { taille: 14, coul: C.doux });
      j.titre("Le premier indicateur du cours est le taux de doublons. La cellule en compte 120 sur 40 000 dossiers. Quel taux ?");
      j.nombre({ cases: [{ attendu: 0.3, tol: 0.001 }], apres: "\\%", aide: function () { return "120 / 40 000, puis × 100."; }, ok: function () {
        j.bravo("\\(120 / 40\\,000 = 0{,}003\\), soit 0,3 %.");
        j.suite();
      } });
    } },
    { nom: "48 heures", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["carte", "horloge"], titre: "Une identité provisoire", sous: "deux jours plus tard" });
      SIS.vider(n.g);
      j.titre("Second indicateur du cours : les identités provisoires non régularisées à 48 h. Que mesure-t-il ?");
      j.choix([
        { html: "Les patients admis sous identité provisoire (urgence) dont la vraie identité n'a pas été retrouvée deux jours après", juste: true },
        { html: "Le temps moyen d'attente au guichet d'admission", aide: "Il s'agit d'identités, pas de temps d'attente." },
        { html: "Le nombre de patients sortis en moins de 48 h", aide: "Le mot clé est « provisoire »." }
      ], { colonnes: 1, ok: function () { j.bravo("Une identité provisoire doit vite devenir définitive, sinon elle fabrique des doublons."); j.suite(); } });
    } },
    { nom: "Le rôle du biomédical", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.icone(n.g, "moniteur", [190, 260], 120); A.fleche(n.g, [270, 260], [410, 260], { ep: 5, coul: C.acc }); A.boite(n.g, 420, 210, 200, 100, { titre: "DPI", sous: "quel patient ?", taille: 26, fond: C.jeuPale, bord: C.jeu });
      j.titre("Un moniteur de réanimation envoie les constantes au DPI. Quelle manipulation d'identitovigilance revient au biomédical ?");
      j.choix([
        { html: "Associer le moniteur au bon patient, pour que ses données arrivent dans le bon dossier", juste: true },
        { html: "Faire dire son nom au patient avant chaque mesure", aide: "Ça, c'est le geste des services cliniques." },
        { html: "Fixer la politique d'identification de l'hôpital", aide: "C'est le rôle du comité." }
      ], { colonnes: 1, ok: function () { j.bravo("Associer les DM au bon patient, et paramétrer alertes et contrôles de saisie avec le DIM et la DSI."); j.suite(); } });
    } }
  ]
}));
