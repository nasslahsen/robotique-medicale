/* Boss du chapitre 2 : une clinique refait son SI, du schéma directeur au choix du cloud. */
NIVEAU(SIS.rejouable({
  id: "boss-composants",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Le chantier de la clinique", jouer: function (j, n) {
      var A = SIS;
      j.titre("La clinique Al Amal lance son schéma directeur. Range chaque action dans sa phase.");
      var PH = ["Initialisation et cadrage", "Analyse critique de l'existant", "Axes stratégiques SI", "Élaboration du schéma directeur"];
      var cartes = [{ t: "Interroger chaque service sur ses logiciels actuels", bac: 1 }, { t: "Nommer un comité de pilotage", bac: 0 }, { t: "Planifier les projets des 4 ans à venir", bac: 3 }, { t: "Décider de partager le DPI avec les médecins de ville", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: PH.map(function (x, k) { return { t: "Phase " + (k + 1), sous: x }; }),
        pos: function (i) { return { x: 10, y: 14 + i * 146, w: 330, h: 130 }; },
        bacsPos: function (k) { return { x: 380, y: 14 + k * 146, w: 290, h: 130 }; },
        erreur: j.erreur, info: j.info,
        aide: function () { return "Cadrer, regarder l'existant, choisir où aller, puis organiser les projets."; },
        fin: function () { j.bravo("Existant, cadrage, élaboration, axes stratégiques."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Refaire tout le SIH", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["serveur", "engrenage"], titre: "Remplacer tout le SIH", sous: "cœur de la stratégie, plusieurs années de budget DSI" });
      SIS.vider(n.g);
      j.titre("Le comité veut remplacer tout le SIH. C'est le cœur de la stratégie, et cela coûtera plusieurs années de budget DSI. Que conseille le tableau du cours ?");
      j.choix([
        { html: "Développement spécifique, pour tout maîtriser", aide: "Pour un sujet stratégique mais énorme, le cours conseille autre chose que tout développer soi-même." },
        { html: "Investissement stratégique ou partenariat avec un éditeur de progiciel", juste: true },
        { html: "Progiciel économique", aide: "Ce choix vaut pour les petits sujets sans enjeu particulier." }
      ], { colonnes: 1, ok: function () { j.bravo("Stratégique et énorme : investissement stratégique ou partenariat avec un éditeur."); j.suite(); } });
    } },
    { nom: "Pas d'informaticien", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["nuage", "ecran"], titre: "Un DPI prêt à l'emploi", sous: "ouvert dans le navigateur, mis à jour par l'éditeur" });
      j.titre("La clinique n'a aucun informaticien. Elle veut un DPI prêt à l'emploi, ouvert dans le navigateur, mis à jour par l'éditeur. Quelle offre cloud ?");
      j.choix([
        { html: "IaaS", aide: "En IaaS, il faudrait installer et gérer soi-même le système, la base et le logiciel." },
        { html: "PaaS", aide: "En PaaS, il faudrait développer et déployer sa propre application." },
        { html: "SaaS", juste: true }
      ], { colonnes: 3, ok: function () { j.bravo("SaaS : on utilise le logiciel, le fournisseur gère tout le reste."); j.suite(); } });
    } },
    { nom: "Deux listes de médecins", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["base", "base"], titre: "Deux listes de médecins", sous: "une dans le RDV, une dans la facturation" });
      j.titre("Le logiciel de RDV et celui de facturation gardent chacun leur liste de médecins. Un médecin parti figure encore dans l'une. Que gagnerait-on avec une base de données unique ?");
      j.choix([
        { html: "La cohérence et une redondance minimale : une seule liste, juste partout", juste: true },
        { html: "Uniquement de la vitesse d'affichage", aide: "Le problème n'est pas la vitesse : ce sont deux copies qui se contredisent." },
        { html: "Rien : il suffit de mettre à jour les deux listes à la main", aide: "C'est justement ce qui a échoué. Pense aux avantages d'une base de données." }
      ], { colonnes: 1, ok: function () { j.bravo("Une donnée, un seul endroit : cohérence et redondance minimale."); j.suite(); } });
    } },
    { nom: "Qui dessine la cible ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["personne", "document"], titre: "Phase 3 : la cible du SI de la clinique" });
      j.titre("Dans la phase 3, il faut dessiner l'organisation cible du SI de la clinique et son évolution. Quel profil s'en charge ?");
      j.choix([
        { html: "Urbaniste ou architecte SI", juste: true },
        { html: "Technicien de maintenance", aide: "Le technicien fait tourner l'existant. On cherche un profil de conception et d'évolution du SI." },
        { html: "Scrum master", aide: "Le Scrum master anime une équipe projet, il ne dessine pas la cible du SI." }
      ], { colonnes: 1, ok: function () { j.bravo("Catégorie « conception, organisation et évolution des SI »."); j.suite(); } });
    } }
  ]
}));
