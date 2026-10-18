/* Révision du chapitre 8 : défense en profondeur, CID, AAA, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-principes",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Trois incidents, trois critères", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque incident dans le A qui aurait dû l'empêcher ou le révéler.");
      var cartes = [{ t: "Un agent consulte le dossier de son voisin, sans que personne ne le sache jamais", bac: 2 }, { t: "Un ancien interne se connecte encore avec son compte six mois après son départ", bac: 0 }, { t: "Une secrétaire modifie une prescription : son profil le lui permettait", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Authentification" }, { t: "Autorisation" }, { t: "Traçabilité" }],
        pos: function (i) { return { x: 14 + i * 222, y: 20, w: 208, h: 220 }; },
        bacsPos: function (k) { return { x: 14 + k * 222, y: 320, w: 208, h: 220 }; },
        taille: 15, tailleBac: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Personne ne le sait : qu'est-ce qui manque pour le savoir ?", "Le compte aurait dû être désactivé : qui es-tu, encore ?", "Elle avait le droit : ce sont les droits qui sont mal réglés."][i]; },
        fin: function () { j.bravo("Traçabilité absente, authentification non mise à jour, autorisation trop large."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le pousse-seringue", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["pompe", "pirate"], titre: "Un débit modifié à distance", sous: "sans aucune alarme" });
      SIS.vider(n.g);
      j.titre("Un pirate modifie à distance le débit d'un pousse-seringue connecté, sans alarme. Quel critère, et pourquoi est-ce le pire scénario ?");
      j.choix([{ html: "L'intégrité : une erreur de soins souvent non détectable", juste: true }, { html: "La confidentialité : le débit est un secret", aide: "Personne ne lit une donnée secrète : on la change." }, { html: "La disponibilité : la pompe s'arrête", aide: "La pompe continue, mais avec une mauvaise valeur." }], { colonnes: 1, ok: function () { j.bravo("Intégrité, et rien ne le signale."); j.suite(); } });
    } },
    { nom: "Durcir", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["moniteur", "cadenas"], titre: "Compte « admin / admin » retiré", sous: "ports inutiles fermés" });
      j.titre("Le biomédical retire d'un échographe le compte « admin / admin » laissé par défaut, et ferme les ports inutiles. Quel pilier de la défense en profondeur ?");
      j.choix([{ html: "Le durcissement", juste: true }, { html: "La veille", aide: "La veille, c'est se tenir informé. Ici on réduit ce qui peut être attaqué." }, { html: "La sensibilisation", aide: "Personne n'est formé ici : on modifie la machine." }], { colonnes: 3, ok: function () { j.bravo("Durcissement : moins de portes à défendre."); j.suite(); } });
    } },
    { nom: "Penser comme l'attaquant", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["pirate", "bouclier"], titre: "Une équipe payée pour attaquer", sous: "avec l'accord de l'hôpital" });
      j.titre("L'hôpital paie une équipe pour tenter de pénétrer son réseau, avec son accord, avant les vrais pirates. Comment le cours appelle-t-il cette démarche ?");
      j.choix([{ html: "Agir comme un hacker : la sécurité offensive", juste: true }, { html: "Le dilemme de la défensive", aide: "Le dilemme est le problème ; on cherche le nom de cette réponse." }, { html: "La traçabilité", aide: "La traçabilité garde la trace des actions." }], { colonnes: 1, ok: function () { j.bravo("Sécurité offensive : trouver ses failles avant l'attaquant."); j.suite(); } });
    } }
  ]
}));
