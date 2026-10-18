/* Révision du chapitre 2 : les cinq composants, maturité, SGBD, progiciel ou spécifique, workflow, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-composants",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "La radiologie en cinq composants", jouer: function (j, n) {
      var A = SIS;
      j.titre("Service de radiologie : range chaque élément dans son composant du SI.");
      var noms = ["Organisation", "Logiciels", "Données", "Matériel", "Personnels"];
      var cartes = [{ t: "Double vérification de l'identité avant l'examen", bac: 0 }, { t: "Fibre optique entre deux bâtiments", bac: 3 }, { t: "Comptes rendus d'imagerie", bac: 2 }, { t: "Le data analyst", bac: 4 }, { t: "L'hyperviseur des serveurs", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: noms.map(function (x) { return { t: x }; }),
        pos: function (i) { return { x: 10, y: 14 + i * 116, w: 380, h: 100 }; },
        bacsPos: function (k) { return { x: 430, y: 14 + k * 116, w: 240, h: 100 }; },
        taille: 17, tailleBac: 19,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["C'est une règle de travail.", "C'est un support physique du réseau.", "C'est ce que le SI garde.", "C'est une personne.", "C'est un logiciel système."][i]; },
        fin: function () { j.bravo("Organisation, matériel, données, personnel, logiciel."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La check-list du bloc", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["document", "personne"], titre: "La check-list du bloc", sous: "une procédure commune, rien n'est mesuré" });
      j.titre("Au bloc, tout le monde applique la check-list selon une procédure écrite commune. Mais personne ne mesure combien de fois elle est vraiment remplie. Quel niveau de maturité ?");
      j.choix([
        { html: "1 Initial", aide: "Il y a une procédure commune : ce n'est plus aléatoire." },
        { html: "2 Géré", aide: "C'est plus que planifié : c'est organisé et maîtrisé par une règle commune." },
        { html: "3 Défini", juste: true },
        { html: "4 Quantifié", aide: "Quantifié veut dire mesuré et contrôlé. Ici, personne ne mesure." }
      ], { colonnes: 2, ok: function () { j.bravo("Défini : organisé et maîtrisé. Pour monter à 4, il faudrait mesurer."); j.suite(); } });
    } },
    { nom: "Le stagiaire", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["personne", "base"], titre: "Fin de stage", sous: "il ne doit plus lire les dossiers" });
      j.titre("Le stage d'un étudiant se termine : il ne doit plus lire les dossiers. Quelle commande, et de quel langage du SGBD ?");
      j.choix([
        { html: "DENY, langage de contrôle d'accès (LCD)", juste: true },
        { html: "ALTER, langage de définition (LDD)", aide: "ALTER modifie la structure d'une table, pas les droits d'une personne." },
        { html: "UPDATE, langage de manipulation (LMD)", aide: "UPDATE modifie des données. Ici on retire un droit." }
      ], { colonnes: 1, ok: function () { j.bravo("DENY, dans le LCD."); j.suite(); } });
    } },
    { nom: "Le linge", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["engrenage", "document"], titre: "Gestion des stocks de linge", sous: "ni stratégique, ni normée, petit budget" });
      j.titre("La gestion des stocks de linge n'est ni stratégique ni normée, et coûte peu. Que conseille le tableau du cours ?");
      j.choix([
        { html: "Investissement stratégique ou partenariat avec un éditeur", aide: "Cette case est réservée aux sujets stratégiques et énormes." },
        { html: "Progiciel économique ou développement spécifique", juste: true },
        { html: "Développement spécifique obligatoire", aide: "Le développement spécifique seul est conseillé pour les sujets stratégiques." }
      ], { colonnes: 1, ok: function () { j.bravo("Ligne « autre », petit sujet : progiciel économique ou développement spécifique."); j.suite(); } });
    } },
    { nom: "Workflow ou procédure ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["horloge", "personne"], titre: "8 h prélever, 9 h acheminer, 10 h valider" });
      j.titre("Un document dit : « à 8 h l'infirmier prélève, à 9 h le coursier achemine les tubes, à 10 h le biologiste valide ». Qu'est-ce que c'est ?");
      j.choix([
        { html: "Un workflow : il dit qui fait quoi et quand", juste: true },
        { html: "Une procédure : il dit comment faire un geste", aide: "Le document ne détaille aucun geste : il répartit les tâches entre acteurs, dans le temps." },
        { html: "Une cartographie des processus", aide: "Une cartographie montre tous les processus de l'hôpital et leurs liens, pas un enchaînement horaire." }
      ], { colonnes: 1, ok: function () { j.bravo("Qui fait quoi et quand : un workflow."); j.suite(); } });
    } }
  ]
}));
