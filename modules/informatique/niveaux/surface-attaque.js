/* Niveau : surface d'attaque physique, numérique, humaine (cyber, diapo 19). */
NIVEAU(SIS.rejouable({
  id: "surface-attaque",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Trois surfaces", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque point d'entrée de l'hôpital dans sa surface d'attaque.");
      var cartes = [{ t: "Local technique laissé ouvert", bac: 0 }, { t: "Portail patient sur Internet", bac: 1 }, { t: "Appel d'un faux technicien qui demande un mot de passe", bac: 2 }, { t: "Badge d'accès perdu", bac: 0 }, { t: "Télémaintenance d'un éditeur", bac: 1 }, { t: "Agent soumis à un chantage", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Physique", sous: "locaux, intrusions sur site" }, { t: "Numérique", sous: "tout ce qu'une cyberattaque peut cibler" }, { t: "Humaine", sous: "ingénierie sociale, chantage" }],
        pos: A.grille(6, 2, 20, 14, 640, 80, 12), bacsPos: function (k) { return { x: 14 + k * 222, y: 310, w: 208, h: 250 }; },
        taille: 16, tailleBac: 20,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["On entre physiquement dans les lieux.", "On passe par un système connecté.", "On manipule une personne."][b]; },
        fin: function () {
          j.bravo("Physique, numérique, humaine.");
          j.expliquer("<p>La <b>surface d'attaque</b> est l'ensemble des points d'entrée (matériels, logiciels, humains) vulnérables qu'un attaquant peut exploiter pour s'introduire dans un système ou voler des données.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Elle grandit ou elle rétrécit ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque décision : agrandit-elle ou réduit-elle la surface d'attaque ?");
      var cartes = [{ t: "Connecter dix nouveaux tiers en télémaintenance", bac: 0 }, { t: "Désactiver les services inutiles des serveurs", bac: 1 }, { t: "Ouvrir le wifi invité sur le réseau des DM", bac: 0 }, { t: "Former le personnel au phishing", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Agrandit" }, { t: "Réduit" }],
        pos: A.grille(4, 2, 20, 30, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "On ajoute des points d'entrée." : "On retire des points d'entrée, ou on les rend moins vulnérables."; },
        fin: function () { j.bravo("Tiers et ouvertures l'agrandissent ; durcissement et formation la réduisent."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La plus difficile à fermer", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "alerte"], titre: "Un courriel imite la DSI", sous: "il demande les mots de passe" });
      SIS.vider(n.g);
      j.titre("Un courriel imite parfaitement la DSI et demande aux soignants de « confirmer leur mot de passe ». Quelle surface est visée, et quelle mesure du cours la protège ?");
      j.choix([{ html: "La surface humaine, protégée par la sensibilisation", juste: true }, { html: "La surface physique, protégée par des badges", aide: "Personne n'entre dans les locaux." }, { html: "La surface numérique, protégée par un pare-feu", aide: "Le courriel passe le pare-feu : c'est la personne qui est trompée." }], { colonnes: 1, ok: function () { j.bravo("Humaine : veille et sensibilisation."); j.suite(); } });
    } }
  ]
}));
