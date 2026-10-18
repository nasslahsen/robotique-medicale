/* Niveau : processus de création / vérification d'une identité (BPMN) et définitions de l'identitovigilance (S3, diapos 6 et 7). */
NIVEAU(SIS.rejouable({
  id: "identite",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g };
    var F = A.BPMN_FINS;
    n.FINS = ["haut", "milieu", "bas", "vigil"];
    n.zones = function (bon) {
      return n.FINS.map(function (k) {
        var f = F[k];
        return f.box ? { x: f.box[0], y: f.box[1], w: f.box[2], h: f.box[3], bon: k === bon } : { x: f.c[0] - 34, y: f.c[1] - 26, w: 68, h: 70, bon: k === bon };
      });
    };
    n.cas = function (j, titre, bon, chemin, aide, bravo, expl) {
      j.titre(titre);
      var r = A.reperer({
        g: n.g, zones: n.zones(bon),
        dessiner: function (g2, e) {
          var fin = {};
          n.FINS.forEach(function (k, i) { if (e.trouve[i]) fin[k] = "ok"; else if (e.faux === i) fin[k] = "faux"; });
          A.bpmnIdentite(g2, { fin: fin, chemin: e.trouve.some(Boolean) ? chemin : null });
        },
        erreur: j.erreur, aide: aide,
        fin: function () { j.bravo(bravo); if (expl) j.expliquer(expl); j.suite(); }
      });
      j.reponse(function () { r.resoudre(); });
    };
    return n;
  },
  etapes: [
    { nom: "Avec sa CIN", jouer: function (j, n) {
      n.cas(j, "M. Alami présente sa CIN. La recherche trouve une fiche avec ce numéro, et le nom et la date de naissance concordent. Suis le processus et touche l'issue.", "haut", "haut",
        function () { return "La recherche a trouvé une fiche avec la CIN : prends la branche du haut, puis regarde si c'est cohérent."; },
        "Branche « résultats avec CIN », cohérence : identité choisie.",
        "<p>Le processus du cours a deux couloirs principaux : le <b>patient</b> se présente avec sa CIN au guichet de sa catégorie, l'<b>agent d'admission</b> recherche l'identité avant toute création.</p>");
    } },
    { nom: "Première venue", jouer: function (j, n) {
      n.cas(j, "Une patiente vient pour la première fois dans cet hôpital. La recherche ne trouve aucun résultat. Quelle issue ?", "milieu", "milieu",
        function () { return "Aucun résultat : prends la branche du milieu."; },
        "Aucun résultat : on crée une nouvelle identité, enregistrée dans la base du SI.");
    } },
    { nom: "Trois Fatima", jouer: function (j, n) {
      n.cas(j, "Sans CIN, la recherche affiche trois « Fatima Idrissi ». La patiente, confuse, ne sait pas donner sa date de naissance. Quelle issue ?", "vigil", "vigil",
        function (i) { return i === 2 ? "Pour choisir une identité, il faudrait vérifier la date de naissance. Or elle n'est pas renseignée." : "Plusieurs résultats sans CIN : prends la branche du bas, puis lis les conditions."; },
        "Date de naissance non renseignée : on passe la main à l'identitovigilance.",
        "<p>On ne choisit jamais une identité au hasard parmi plusieurs homonymes : le risque de <b>collision</b> est trop grand.</p>");
    } },
    { nom: "Les mots de l'identité", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque terme à sa définition.");
      var p = A.paires({
        g: n.g, gauche: ["Identitovigilance", "Doublon", "Collision", "MPI", "Appariement"],
        droite: ["Un même individu possède plusieurs dossiers", "Base centrale qui donne un identifiant unique et détecte les doublons", "Processus qui décide si deux enregistrements sont la même personne", "Surveillance et gestion des risques sur l'identification des patients", "Données de deux patients mélangées dans un seul dossier"],
        bon: [3, 0, 4, 1, 2],
        xg: 10, wg: 210, xd: 250, wd: 420, y0: 20, h: 96, pas: 114, taille: 18, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Une vigilance : on surveille un risque, tout au long du parcours.", "Une personne, deux dossiers.", "Deux personnes, un dossier.", "Master Patient Index.", "Record linkage : un algorithme compare."][i]; },
        fin: function () {
          j.bravo("Identitovigilance, doublon, collision, MPI, appariement.");
          j.expliquer("<p>Objectifs de l'identitovigilance : assurer le <b>bon soin au bon patient, au bon moment</b> ; sécuriser les données de santé et les échanges entre professionnels ; éviter les doublons et les confusions d'identité.</p>");
          j.suite();
        }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Le plus grave", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "personne", "personne"], titre: "Doublon ou collision ?" });
      SIS.vider(n.g);
      j.titre("Doublon ou collision : lequel le cours qualifie-t-il d'erreur grave, et pourquoi ?");
      j.choix([
        { html: "La collision : un médecin décide sur des données qui appartiennent à un autre patient", juste: true },
        { html: "Le doublon : il prend de la place dans la base", aide: "Le doublon disperse l'information, c'est gênant. Mais qu'arrive-t-il quand deux patients sont mélangés ?" }
      ], { colonnes: 1, ok: function () { j.bravo("La collision : groupe sanguin, allergies, résultats d'un autre patient dans le dossier."); j.suite(); } });
    } }
  ]
}));
