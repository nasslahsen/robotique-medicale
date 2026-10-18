/* Niveau : base de données, avantages, SGBD (LDD, LMD, LCD, intégrité, disponibilité), modélisation (S1S2, diapos 28 et 29). */
NIVEAU(SIS.rejouable({
  id: "donnees-sgbd",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Quatre fichiers Excel", jouer: function (j, n) {
      var A = SIS;
      j.titre("Avant la base de données, chaque service gardait son propre fichier Excel des patients. Relie chaque problème à l'avantage de la base de données qui le règle.");
      var p = A.paires({
        g: n.g, gauche: ["La même adresse est saisie dans quatre fichiers", "Deux fichiers donnent deux dates de naissance pour le même patient", "Un seul agent à la fois peut ouvrir le fichier", "Changer de logiciel de facturation oblige à tout ressaisir"],
        droite: ["Cohérence", "Redondance minimale", "Indépendance des applications", "Accès simultané par plusieurs utilisateurs"],
        bon: [1, 0, 3, 2],
        xg: 10, wg: 380, xd: 450, wd: 220, y0: 40, h: 110, pas: 136, taille: 16, tailleD: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le problème est la répétition de la même donnée.", "Le problème est une contradiction entre deux copies.", "Le problème est l'accès d'une seule personne à la fois.", "Le problème est que les données sont prisonnières d'un logiciel."][i]; },
        fin: function () {
          j.bravo("Redondance minimale, cohérence, accès simultané, indépendance.");
          j.expliquer("<p>Une <b>base de données</b> est une collection de données structurées, enregistrée sur la mémoire de stockage, accessible simultanément par plusieurs utilisateurs. Avantages : indépendance des logiciels d'applications, cohérence, redondance minimale, accessibilité simultanée.</p>");
          j.suite();
        }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Trois langages", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le SGBD reçoit ces commandes. Range chacune dans son langage.");
      var cartes = [{ t: "CREATE TABLE patient", bac: 0 }, { t: "INSERT un nouveau séjour", bac: 1 }, { t: "GRANT lecture à l'infirmière", bac: 2 }, { t: "ALTER TABLE patient", bac: 0 }, { t: "UPDATE l'adresse", bac: 1 }, { t: "DENY accès au stagiaire", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "LDD", sous: "définition des bases et des objets" }, { t: "LMD", sous: "manipulation des données" }, { t: "LCD", sous: "contrôle d'accès aux données" }],
        pos: A.grille(6, 2, 20, 20, 640, 74, 14),
        bacsPos: function (k) { return { x: 14 + k * 222, y: 300, w: 208, h: 240 }; },
        taille: 17, tailleBac: 22,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Cette commande crée ou modifie la structure, pas son contenu." : cartes[i].bac === 1 ? "Cette commande touche aux lignes de données elles-mêmes." : "Cette commande donne ou refuse un droit."; },
        fin: function () { j.bravo("LDD : CREATE, ALTER. LMD : INSERT, UPDATE. LCD : GRANT, DENY."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Intégrité ou disponibilité ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Deux situations. Range chacune dans la mission du SGBD qui la gère.");
      var cartes = [{ t: "Deux infirmières modifient la même prescription au même instant", bac: 0 }, { t: "Le disque du serveur principal lâche : on bascule sur la copie", bac: 1 }, { t: "Une date de sortie avant la date d'entrée est refusée", bac: 0 }, { t: "La sauvegarde de la nuit permet de tout restaurer", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Intégrité", sous: "contraintes, verrous" }, { t: "Disponibilité", sous: "réplication, backup" }],
        pos: A.grille(4, 2, 20, 20, 640, 110, 18),
        bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Il s'agit de garder des données justes et cohérentes : contrainte ou verrou." : "Il s'agit de garder les données accessibles malgré la panne : copie ou sauvegarde."; },
        fin: function () {
          j.bravo("Verrou et contrainte : intégrité. Réplication et sauvegarde : disponibilité.");
          j.expliquer("<p>Un <b>SGBD</b> (système de gestion de base de données) crée et fait vivre les bases. Il assure la définition (LDD), la manipulation (LMD), le contrôle d'accès (LCD), l'intégrité et la disponibilité. Exemples : Oracle, SQL Server, MySQL, PostgreSQL.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Avant de créer la base", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "base"], titre: "Patients, séjours, examens et leurs liens", sous: "avant le premier CREATE TABLE" });
      SIS.vider(n.g);
      j.titre("Avant d'écrire le moindre CREATE TABLE, l'équipe dessine les patients, séjours et examens et leurs liens. Quelles méthodes de modélisation cite le cours ?");
      j.choix([
        { html: "UML et Merise", juste: true },
        { html: "LDD et LMD", aide: "Ce sont des langages du SGBD. On cherche des méthodes pour concevoir avant de coder." },
        { html: "ERP et CRM", aide: "Ce sont des familles de logiciels métiers." }
      ], { colonnes: 1, ok: function () { j.bravo("UML ou Merise, pour modéliser avant de créer."); j.suite(); } });
    } }
  ]
}));
