/* Niveau : panorama de la menace cyber, chiffres, tendances, incidents marquants (cyber, diapos 6 à 8). */
NIVEAU(SIS.rejouable({
  id: "panorama-menace",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Ce que chaque attaque a appris", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque incident du cours à son enseignement.");
      var p = A.paires({
        g: n.g, gauche: ["NHS, mai 2017 : WannaCry", "CH Sud Francilien, août 2022 : LockBit", "Change Healthcare, fév. 2024", "Moniteurs Contec CMS8000, janv. 2025", "CH de Chaumont, juil. 2026"],
        droite: ["Un prestataire de paiement unique paralyse des milliers de structures", "Alerte, déconnexion d'Internet et coordination avec le GHT limitent l'impact", "De l'imagerie sous Windows non corrigé atteinte ; 19 000 rendez-vous annulés", "Backdoor dans le micrologiciel : importance des SBOM et des exigences d'achat", "Double extorsion : données publiées après le refus de payer"],
        bon: [2, 4, 0, 3, 1],
        xg: 10, wg: 250, xd: 290, wd: 380, y0: 20, h: 96, pas: 114, taille: 15, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Un ver qui exploite SMBv1 sur des Windows non corrigés.", "Une rançon de 10 M$ refusée : que font les attaquants des données ?", "Un seul prestataire, environ 190 millions de personnes concernées.", "L'appareil envoyait des données vers une adresse IP codée en dur.", "Une intrusion détectée, bien gérée."][i]; },
        fin: function () { j.bravo("Cinq attaques, cinq leçons."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Les chiffres", jouer: function (j, n) {
      var A = SIS;
      j.titre("2025 marque un point de bascule. Relie chaque chiffre du cours à ce qu'il mesure.");
      var p = A.paires({
        g: n.g, gauche: ["4,4 M$", "12 000 Md$", "97 %", "× 2"],
        droite: ["Nombre d'attaques depuis 2023", "Coût moyen d'une fuite de données (IBM, 2025)", "Organisations ayant rapporté un incident lié à l'IA ou à son manque de contrôle (IBM, 2025)", "Coût mondial de la cybercriminalité en 2025"],
        bon: [1, 3, 2, 0],
        xg: 20, wg: 180, xd: 250, wd: 410, y0: 40, h: 110, pas: 136, taille: 26, tailleD: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Des millions : à l'échelle d'une seule organisation touchée.", "Des milliers de milliards : à l'échelle du monde.", "Un pourcentage d'organisations.", "Un multiplicateur dans le temps."][i]; },
        fin: function () { j.bravo("Et le secteur le plus touché, d'après le cours : la santé. Plus 25 % de rançongiciels en un an."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Trois tendances", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque fait dans la tendance du cours qu'il illustre.");
      var cartes = [{ t: "Phishing et deepfakes produits par IA générative", bac: 0 }, { t: "Failles zero-day en hausse", bac: 1 }, { t: "Riposte après l'arrestation du fondateur de Telegram", bac: 2 }, { t: "IA agentique", bac: 0 }, { t: "Panne mondiale CrowdStrike", bac: 1 }, { t: "Alliances entre rançongiciels et hacktivistes", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "L'IA sur le devant de la scène" }, { t: "Année difficile pour les éditeurs" }, { t: "Le cybercrime devient politique" }],
        pos: A.grille(6, 2, 20, 14, 640, 80, 12), bacsPos: function (k) { return { x: 14 + k * 222, y: 310, w: 208, h: 250 }; },
        taille: 16, tailleBac: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Ça parle d'intelligence artificielle.", "Ça parle des failles et des incidents des éditeurs de logiciels.", "Ça parle de groupes criminels et d'États."][b]; },
        fin: function () { j.bravo("IA, éditeurs, politique."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le maillon faible", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["reseau", "alerte"], titre: "Change Healthcare (2024), Santé publique France (2026)", sous: "deux attaques de prestataires" });
      j.titre("Change Healthcare (2024) et le prestataire de Santé publique France (2026) racontent la même chose. Laquelle ?");
      j.choix([
        { html: "La chaîne de prestataires et de sous-traitants est un maillon faible : un tiers touché atteint de nombreux établissements", juste: true },
        { html: "Seuls les grands hôpitaux sont attaqués", aide: "Dans ces deux cas, ce n'est même pas un hôpital qui a été attaqué en premier." },
        { html: "Payer la rançon règle le problème", aide: "Le cours ne recommande jamais de payer, et rien ne dit que cela marche." }
      ], { colonnes: 1, ok: function () { j.bravo("La sous-traitance reste le maillon faible."); j.suite(); } });
    } }
  ]
}));
