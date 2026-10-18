/* Niveau : les grands composants d'un SIH et leurs rôles (S1S2, diapo 39). */
NIVEAU(SIS.rejouable({
  id: "composants-sih",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Composants et rôles", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque grand composant du SIH à son rôle.");
      var p = A.paires({
        g: n.g,
        gauche: ["DPI", "Gestion médico-administrative", "Plateaux médico-techniques", "Plateforme d'intégration", "Bases de données, SGBD", "Entrepôt de données", "Portail / BI"],
        droite: ["Transport des messages entre applications (HL7)", "Tableaux de bord et indicateurs", "Saisie des données du patient", "Stockage des données", "RDV, admission, séjour, facturation", "Consolider les données pour l'analyse", "Réaliser les prescriptions (biologie, radiologie...)"],
        bon: [2, 4, 6, 0, 3, 5, 1],
        xg: 10, wg: 250, xd: 300, wd: 370, y0: 14, h: 72, pas: 82, taille: 16, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le dossier du patient : on y saisit ce qui le concerne.", "Tout ce qui organise et facture le passage du patient.", "Biologie, radiologie, pharmacie : ils exécutent ce que le médecin demande.", "Elle fait circuler les messages entre logiciels.", "C'est là que les données sont gardées.", "On y rassemble les données pour les analyser.", "C'est la vitrine des chiffres pour la direction."][i]; },
        fin: function () { j.bravo("Sept composants, sept rôles."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Le résultat perdu", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 20, 220, 170, 110, { titre: "LIS", sous: "laboratoire", taille: 22 });
      A.boite(n.g, 255, 220, 170, 110, { titre: "?", taille: 30, tirets: "8 6", fond: C.fond });
      A.boite(n.g, 490, 220, 170, 110, { titre: "DPI", sous: "service de cardiologie", taille: 22 });
      A.fleche(n.g, [192, 275], [252, 275], { ep: 4 }); A.fleche(n.g, [427, 275], [487, 275], { ep: 4, coul: C.ko, tirets: "8 6" });
      A.texte(n.g, "le résultat validé n'arrive pas", [460, 380], { taille: 17, coul: C.ko, gras: 700 });
      j.titre("Le labo a validé une troponine, mais le résultat n'apparaît pas dans le DPI du service. Quel composant faut-il vérifier en premier ?");
      j.choix([
        { html: "La plateforme d'intégration qui transporte les messages HL7", juste: true },
        { html: "Le portail BI", aide: "Le portail affiche des indicateurs : il n'est pas sur le chemin d'un résultat vers le DPI." },
        { html: "L'entrepôt de données", aide: "L'entrepôt sert à l'analyse, après coup. Le résultat doit passer d'une application à l'autre." }
      ], { colonnes: 1, ok: function () { j.bravo("C'est elle qui fait passer le message du LIS au DPI."); j.suite(); } });
    } },
    { nom: "Analyser sans ralentir", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["base", "ecran"], titre: "Cinq ans de séjours à analyser", sous: "sans ralentir le DPI des soignants" });
      j.titre("La direction veut analyser cinq ans de séjours, sans ralentir le DPI que les soignants utilisent. Où faire cette analyse ?");
      j.choix([
        { html: "Directement dans la base de production du DPI", aide: "Les requêtes lourdes ralentiraient l'outil des soignants." },
        { html: "Dans l'entrepôt de données, qui consolide les données pour l'analyse et le pilotage", juste: true },
        { html: "Dans la plateforme d'intégration", aide: "La plateforme transporte des messages, elle ne garde pas l'historique pour l'analyse." }
      ], { colonnes: 1, ok: function () { j.bravo("L'entrepôt (DataWareHouse) : consolidation pour l'analyse et le pilotage."); j.suite(); } });
    } },
    { nom: "Les nomenclatures", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le tableau du cours cite plusieurs nomenclatures. Range chacune dans le composant où elle sert.");
      var cartes = [{ t: "CIM-10 (diagnostics)", bac: 0 }, { t: "NGAP", bac: 1 }, { t: "NABM", bac: 1 }, { t: "TNR", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "DPI", sous: "saisie : diagnostics, paramètres, évolution" }, { t: "Gestion médico-administrative", sous: "cotation des actes et facturation" }],
        pos: A.grille(4, 4, 14, 60, 652, 100, 12), bacsPos: function (k) { return { x: 20 + k * 330, y: 290, w: 310, h: 240 }; },
        taille: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return i === 0 ? "Elle code les maladies : c'est une donnée médicale saisie dans le dossier." : "Elle sert à coter un acte pour le facturer."; },
        fin: function () { j.bravo("CIM-10 dans le DPI ; NGAP, NABM, TNR pour la cotation et la facturation."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
