/* Niveau : équipements informatiques, cloud, réseau actif / passif, filaire / sans fil (S1S2, diapos 31 et 32). */
NIVEAU(SIS.rejouable({
  id: "materiel-reseau",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    return n;
  },
  etapes: [
    { nom: "Le bon équipement", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours cite trois effets du choix du matériel. Relie chaque achat à l'effet qu'il vise.");
      var p = A.paires({
        g: n.g, gauche: ["Un serveur plus puissant pour les images de scanner", "Des tablettes au lit du patient", "Des lecteurs de codes-barres sur les tubes de prélèvement"],
        droite: ["Automatisation des processus", "Capacité de traitement et de stockage", "Aisance de manipulation"],
        bon: [1, 2, 0],
        xg: 10, wg: 380, xd: 450, wd: 220, y0: 80, h: 120, pas: 160, taille: 17, tailleD: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Les images de scanner pèsent lourd et demandent du calcul.", "L'infirmier saisit debout, au lit, sans retourner au poste.", "La machine lit l'étiquette à la place de l'humain."][i]; },
        fin: function () {
          j.bravo("Capacité, aisance, automatisation.");
          j.expliquer("<p>Le matériel comprend les serveurs (locaux ou cloud), les ordinateurs, les imprimantes et des équipements spécifiques pour traiter le texte, l'image ou la voix.</p>");
          j.suite();
        }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Le cloud en trois offres", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Le cours cite les serveurs cloud SaaS, PaaS, IaaS. Range chaque situation dans son offre.");
      j.consigne("Les définitions ne sont pas détaillées dans le cours : ce sont les définitions usuelles.");
      var cartes = [{ t: "Le DPI est loué et utilisé dans le navigateur ; l'éditeur gère tout", bac: 0 }, { t: "L'hôpital loue des machines virtuelles et y installe lui-même son SGBD", bac: 2 }, { t: "Les développeurs déposent leur application ; la plateforme gère système et base", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "SaaS", sous: "le logiciel comme service" }, { t: "PaaS", sous: "la plateforme comme service" }, { t: "IaaS", sous: "l'infrastructure comme service" }],
        pos: function (i) { return { x: 14 + i * 222, y: 30, w: 208, h: 190 }; },
        bacsPos: function (k) { return { x: 14 + k * 222, y: 330, w: 208, h: 200 }; },
        taille: 15, tailleBac: 22,
        fond: function (g2) { A.icone(g2, "nuage", [340, 275], 70, C.doux); },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["L'hôpital n'utilise que le logiciel fini.", "L'hôpital ne gère que les machines brutes : il installe le reste lui-même.", "L'hôpital apporte son code ; tout le reste est fourni."][i]; },
        fin: function () { j.bravo("Logiciel fini : SaaS. Plateforme : PaaS. Machines brutes : IaaS."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Actif ou passif ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le réseau se compose d'équipements actifs et passifs. Range chacun.");
      j.consigne("Actif : il est alimenté et traite le signal. Passif : il le transporte seulement.");
      var cartes = [{ t: "Switch", bac: 0 }, { t: "Câble Ethernet", bac: 1 }, { t: "Routeur", bac: 0 }, { t: "Fibre optique", bac: 1 }, { t: "Borne wifi", bac: 0 }, { t: "Prise murale RJ45", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Équipements actifs" }, { t: "Équipements passifs" }],
        pos: A.grille(6, 3, 14, 30, 652, 90, 16), bacsPos: function (k) { return { x: 20 + k * 330, y: 310, w: 310, h: 220 }; },
        taille: 19, tailleBac: 20,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Il se branche sur le courant et décide où envoyer les paquets." : "Il ne fait que conduire le signal."; },
        fin: function () { j.bravo("Actifs : switch, routeur, borne wifi. Passifs : câbles, fibre, prises."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le moniteur de transport", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.icone(n.g, "moniteur", [180, 280], 110); A.icone(n.g, "lit", [180, 400], 90, C.doux);
      A.fleche(n.g, [270, 340], [520, 340], { ep: 5, tirets: "12 8", coul: C.acc });
      A.icone(n.g, "serveur", [580, 330], 90);
      A.texte(n.g, "du service à l'imagerie", [395, 380], { taille: 16, coul: C.doux });
      j.titre("Un moniteur suit le patient sur son brancard, du service jusqu'à l'imagerie, et doit envoyer ses constantes en continu. Quelle liaison, et quel risque surveiller ?");
      j.choix([
        { html: "Filaire (Ethernet) : le débit est garanti", aide: "Un câble ne suit pas un brancard dans les couloirs." },
        { html: "Sans fil (wifi) : il faut surveiller la fiabilité du lien pendant le trajet", juste: true },
        { html: "Aucune : les constantes seront saisies à l'arrivée", aide: "Le cahier des charges demande un envoi en continu." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Sans fil, avec un œil sur la fiabilité du lien.");
        j.expliquer("<p>Le cours cite deux types de liaisons : <b>filaire</b> (Ethernet, fibre optique) et <b>sans fil</b> (Bluetooth, wifi). Le choix du réseau joue sur le <b>débit</b> de communication et la <b>fiabilité</b> des liens. Et il insiste : l'architecture réseau doit être sécurisée.</p>");
        j.suite();
      } });
    } }
  ]
}));
