/* Niveau : définition du SIH et apports de sa mise en œuvre (S1S2, diapos 37 et 38). */
NIVEAU(SIS.rejouable({
  id: "sih",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.MODS = [["Admission et facturation", 40, 70], ["Imagerie", 250, 70], ["Bloc opératoire", 460, 70], ["DPI", 40, 300], ["Laboratoires", 250, 300], ["Pharmacie", 460, 300]];
    n.modules = function (g2, liens) {
      if (liens) n.MODS.forEach(function (a, i) { n.MODS.forEach(function (b, k) { if (k > i) A.s("line", { x1: a[1] + 90, y1: a[2] + 60, x2: b[1] + 90, y2: b[2] + 60, stroke: C.jeu, "stroke-width": 3, opacity: 0.55 }, g2); }); });
      n.MODS.forEach(function (m) { A.boite(g2, m[1], m[2], 180, 120, { titre: m[0], taille: 18, fond: "#fff" }); });
    };
    return n;
  },
  etapes: [
    { nom: "Médical et administratif", jouer: function (j, n) {
      var A = SIS;
      j.titre("Un SIH gère l'ensemble des informations d'un hôpital. Range chaque information : médicale ou administrative ?");
      var cartes = [{ t: "Diagnostic d'entrée", bac: 0 }, { t: "Facture du séjour", bac: 1 }, { t: "Résultat de la NFS", bac: 0 }, { t: "Rendez-vous de consultation", bac: 1 }, { t: "Ordonnance de sortie", bac: 0 }, { t: "Transfert du lit 12 au lit 30", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Informations médicales" }, { t: "Informations administratives" }],
        pos: A.grille(6, 2, 20, 20, 640, 80, 14), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 220 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Cette information parle de la santé du patient et des soins." : "Cette information sert à organiser ou à payer le séjour."; },
        fin: function () {
          j.bravo("Le SIH porte les deux : le médical et l'administratif.");
          j.expliquer("<p>Un <b>système d'information hospitalier</b> est un SI destiné à faciliter la gestion de l'ensemble des informations médicales et administratives d'un hôpital.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Des modules en interaction", jouer: function (j, n) {
      SIS.vider(n.g); n.modules(n.g, false);
      SIS.texte(n.g, "aucun échange entre les logiciels", [340, 510], { taille: 18, coul: SIS.C.ko, gras: 700 });
      j.titre("Dans cet hôpital, la pharmacie, le labo, l'imagerie ont chacun leur logiciel, mais aucun n'échange avec les autres. Est-ce un SIH au sens du cours ?");
      j.choix([
        { html: "Oui : il y a bien des modules pour chaque activité", aide: "Relis la définition : les modules doivent être en interaction pour rassembler l'information." },
        { html: "Non : il manque l'interaction entre les modules", juste: true }
      ], { colonnes: 1, ok: function () {
        SIS.vider(n.g); n.modules(n.g, true);
        j.bravo("Sans interaction, ce ne sont que des logiciels isolés.");
        j.expliquer("<p>L'architecture logicielle d'un SIH se compose d'un <b>ensemble de modules et solutions en interaction</b> ayant pour objectif de <b>rassembler</b>, <b>traiter</b> et <b>fournir</b> les informations nécessaires à son activité.</p>");
        j.suite();
      } });
    } },
    { nom: "Six apports", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le SIH est en place depuis un an. Relie chaque constat à l'apport du cours qu'il illustre.");
      var p = A.paires({
        g: n.g,
        gauche: ["Le directeur suit chaque matin le taux d'occupation des lits", "Le patient ne répète plus son histoire à chaque service", "Une alerte d'allergie bloque une prescription dangereuse", "Moins d'examens refaits en double", "Les infirmiers perdent moins de temps à chercher les résultats", "Le labo envoie ses résultats directement au service"],
        droite: ["Optimisation des coûts", "Échange informatisé entre services", "Pilotage des indicateurs", "Satisfaction des patients", "Qualité et sécurité des soins", "Satisfaction des professionnels"],
        bon: [2, 3, 4, 0, 5, 1],
        xg: 10, wg: 400, xd: 450, wd: 220, y0: 20, h: 84, pas: 96, taille: 15, tailleD: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Un chiffre suivi par la direction : c'est piloter.", "Qui est content ici ?", "On évite une erreur de soin.", "On dépense moins.", "Qui gagne du temps ici ?", "Ce sont deux services qui échangent des données."][i]; },
        fin: function () {
          j.bravo("Pilotage, patients, sécurité, coûts, professionnels, échanges.");
          j.expliquer("<p>Les apports du cours : pilotage des indicateurs de l'hôpital ; satisfaction des patients ; qualité et sécurité des soins, respect des réglementations ; optimisation des coûts, maîtrise des dépenses ; satisfaction des professionnels, des partenaires et réseaux de soins ; échange informatisé des données entre services, partage de l'information.</p>");
          j.suite();
        }
      });
      j.reponse(function () { p.resoudre(); });
    } }
  ]
}));
