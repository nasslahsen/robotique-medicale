/* Niveau : scénario d'attaque par rançongiciel et analyse du scénario (cyber, diapos 2 et 3). */
NIVEAU(SIS.rejouable({
  id: "scenario-rancon",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.SERV = ["Urgences", "Imagerie", "Laboratoire", "Biomédical", "RSSI"];
    return n;
  },
  etapes: [
    { nom: "13 h 45", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Lundi, 13 h 45 : tous les postes affichent une demande de rançon. Les urgences restent ouvertes, le scanner fonctionne, mais le PACS est inaccessible et le labo ne peut plus transmettre. Range chaque partie de l'hôpital.");
      var cartes = [{ t: "Administratif : postes chiffrés", bac: 0 }, { t: "Imagerie : le scanner fonctionne", bac: 1 }, { t: "Serveurs, PACS : indisponibles", bac: 0 }, { t: "Laboratoire : envoi des résultats bloqué", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Compromis / indisponible" }, { t: "Fonctionnement dégradé" }],
        pos: A.grille(4, 2, 20, 30, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        couleurs: function (k) { return k ? { coul: "#b07d14", pale: "#fbf1d9" } : { coul: C.ko, pale: C.koPale }; },
        dessinBac: function (g2, k, faux) { var st = k ? { coul: "#b07d14", pale: "#fbf1d9" } : { coul: C.ko, pale: C.koPale }; A.boite(g2, 20 + k * 330, 330, 310, 210, { fond: faux ? C.fond : st.pale, bord: faux ? C.gris : st.coul, ep: 3, titre: ["Compromis / indisponible", "Fonctionnement dégradé"][k], taille: 20, coul: st.coul }); },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Plus rien ne marche ici : c'est touché." : "Ça marche encore en partie : on travaille autrement."; },
        fin: function () { j.bravo("Administratif et serveurs compromis ; imagerie et labo en mode dégradé."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "L'heure qui suit", jouer: function (j, n) {
      var A = SIS;
      j.titre("Que fait chaque service dans l'heure qui suit ? Range chaque action.");
      var cartes = [
        { t: "Bascule papier", bac: 0 }, { t: "Isoler le scanner", bac: 1 }, { t: "Résultats sur papier", bac: 2 }, { t: "Isoler le réseau", bac: 3 }, { t: "Alerter la DGSSI", bac: 4 },
        { t: "Tri des urgences", bac: 0 }, { t: "Stocker les images en local", bac: 1 }, { t: "Contacter la DSI", bac: 2 }, { t: "Repérer les DM", bac: 3 }, { t: "Isoler le SI", bac: 4 }
      ];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.SERV.map(function (x) { return { t: x }; }),
        pos: A.grille(10, 2, 14, 10, 652, 46, 8),
        bacsPos: function (k) { return { x: 8 + k * 134, y: 300, w: 128, h: 270 }; },
        taille: 16, tailleBac: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Les urgences restent ouvertes : elles continuent sans informatique et trient les patients.", "Le scanner marche mais doit être protégé ; ses images ne peuvent plus partir au PACS.", "Le labo ne peut plus envoyer : il trouve un autre moyen et prévient l'informatique.", "Le biomédical s'occupe des dispositifs médicaux et de leur réseau.", "Le RSSI pilote la sécurité et prévient l'autorité nationale."][b]; },
        fin: function () {
          j.bravo("Chaque service a son geste, et tous vont dans le même sens : continuer les soins, isoler, alerter.");
          j.expliquer("<p>Réponse du cours : <b>urgences</b> : bascule papier, tri ; <b>imagerie</b> : isoler le scanner, stocker en local ; <b>laboratoire</b> : résultats papier, contacter la DSI ; <b>biomédical</b> : isoler le réseau, repérer les DM ; <b>RSSI</b> : alerter la DGSSI, isoler le SI.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Pourquoi isoler ce qui marche ?", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.icone(n.g, "serveur", [150, 260], 110, C.ko); A.texte(n.g, "PACS chiffré", [150, 350], { taille: 18, coul: C.ko, gras: 700 });
      A.s("line", { x1: 220, y1: 260, x2: 440, y2: 260, stroke: C.doux, "stroke-width": 6, "stroke-dasharray": "14 10" }, n.g);
      A.icone(n.g, "radiation", [520, 260], 110, C.ok); A.texte(n.g, "scanner encore sain", [520, 350], { taille: 18, coul: C.ok, gras: 700 });
      j.titre("Le scanner fonctionne. Pourquoi l'imagerie l'isole-t-elle quand même du réseau ?");
      j.choix([
        { html: "Pour que le rançongiciel ne l'atteigne pas par le réseau, et continuer à faire des examens en gardant les images en local", juste: true },
        { html: "Parce qu'un scanner isolé fonctionne plus vite", aide: "Ce n'est pas une question de vitesse. Qu'est-ce qui circule par le réseau en ce moment ?" },
        { html: "Pour pouvoir payer la rançon plus facilement", aide: "Le cours ne parle jamais de payer. Il s'agit de protéger ce qui marche encore." }
      ], { colonnes: 1, ok: function () { j.bravo("Protéger ce qui marche encore, et garder les soins possibles."); j.suite(); } });
    } }
  ]
}));
