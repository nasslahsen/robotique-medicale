/* Niveau : architecture fonctionnelle d'un SIH moderne et SIH déployé dans les centres hospitaliers publics (S1S2, diapos 40 et 41). */
NIVEAU(SIS.rejouable({
  id: "architecture-sih",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.COUCHES = [{ t: "Présentation" }, { t: "Métiers" }, { t: "Données" }, { t: "Interop. interne" }, { t: "Interop. externe" }];
    // Schéma du SIH public : le DPP au centre, les modules autour
    n.MODS = [
      { t: "Admission, GIH, RDV", x: 40, y: 150, w: 150, h: 80 }, { t: "Module médecin", x: 210, y: 60, w: 130, h: 70 }, { t: "Module infirmier", x: 360, y: 60, w: 130, h: 70 },
      { t: "Facturation, recouvrement, caisse", x: 490, y: 150, w: 170, h: 80 }, { t: "LIS", x: 60, y: 400, w: 120, h: 70 }, { t: "RIS", x: 210, y: 430, w: 120, h: 70 },
      { t: "Pharmacie", x: 360, y: 430, w: 130, h: 70 }, { t: "Bloc...", x: 510, y: 400, w: 120, h: 70 }
    ];
    n.DPP = { x: 265, y: 230, w: 150, h: 110 };
    n.schema = function (g2, etat) {
      A.s("rect", { x: 20, y: 40, width: 660 - 20, height: 480, rx: 30, fill: C.fond, stroke: C.trait, "stroke-width": 2 }, g2);
      n.MODS.forEach(function (m) { A.fleche(g2, A.bord(m, [340, 285]), A.bord(n.DPP, [m.x + m.w / 2, m.y + m.h / 2], 4), { ep: 2.5, coul: C.doux, tirets: "5 5", double: true }); });
      n.MODS.forEach(function (m, i) { var f = etat && etat.faux === i + 1; A.boite(g2, m.x, m.y, m.w, m.h, { titre: m.t, taille: 15, fond: f ? C.koPale : "#fff", bord: f ? C.ko : C.encre }); });
      var ok = etat && etat.trouve[0];
      A.boite(g2, n.DPP.x, n.DPP.y, n.DPP.w, n.DPP.h, { titre: "DPP", sous: ok ? "dossier patient partagé" : null, taille: 28, fond: ok ? C.jeuPale : "#fff", bord: ok ? C.jeu : C.encre, ep: ok ? 4 : 2.5, tailleSous: 14 });
    };
    return n;
  },
  etapes: [
    { nom: "Les couches", jouer: function (j, n) {
      var A = SIS;
      j.titre("L'architecture fonctionnelle d'un SIH moderne s'organise en couches. Range chaque élément.");
      var cartes = [{ t: "Module RDV", bac: 0 }, { t: "Moteur d'aide à la prescription", bac: 1 }, { t: "Images", bac: 2 }, { t: "HL7 V2 entre modules", bac: 3 }, { t: "DPI national, télémédecine", bac: 4 }, { t: "Pharmacovigilance", bac: 1 }, { t: "Référentiels", bac: 2 }, { t: "Module consultation", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.COUCHES,
        pos: A.grille(8, 2, 14, 10, 652, 62, 10),
        bacsPos: function (k) { return { x: 8 + k * 134, y: 300, w: 128, h: 270 }; },
        taille: 16, tailleBac: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["C'est un écran que l'utilisateur ouvre : la couche visible.", "C'est de la logique médicale : des règles qui calculent ou alertent.", "C'est ce qui est stocké.", "Échange entre modules d'un même hôpital.", "Échange avec l'extérieur de l'hôpital."][b]; },
        fin: function () {
          j.bravo("Présentation, métiers, données, interopérabilité interne et externe.");
          j.expliquer("<p><b>Présentation</b> : modules RDV, consultation, biologie. <b>Métiers</b> : logique médicale (pharmacovigilance, hémovigilance), moteur d'aide à la prescription, gestion des protocoles et gestes de soins. <b>Données</b> : données structurées, documents, images, référentiels. <b>Interopérabilité interne</b> : intra-modules (HL7 V2, MWL). <b>Externe</b> : DPI national, télémédecine, identité, partenaires.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le centre du SIH public", jouer: function (j, n) {
      j.titre("Voici le SIH déployé dans les centres hospitaliers publics. Touche le composant au centre, avec lequel tous les modules échangent.");
      var zones = [{ x: n.DPP.x, y: n.DPP.y, w: n.DPP.w, h: n.DPP.h, bon: true }].concat(n.MODS.map(function (m) { return { x: m.x, y: m.y, w: m.w, h: m.h }; }));
      var r = SIS.reperer({ g: n.g, zones: zones, dessiner: n.schema, erreur: j.erreur,
        aide: function () { return "Suis les flèches : elles partent toutes des modules vers un même point."; },
        fin: function () {
          j.bravo("Le DPP, au centre de tous les échanges.", [340, 285]);
          j.expliquer("<p>Admission (GIH, RDV), modules médecin et infirmier, facturation, LIS, RIS, pharmacie, bloc : tous alimentent et consultent le <b>dossier patient partagé</b>.</p>");
          j.suite();
        } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Avec l'extérieur", jouer: function (j, n) {
      j.titre("Sur le même schéma, la CNSS est reliée deux fois au SIH. Pour quoi faire ?");
      j.choix([
        { html: "Vérifier l'éligibilité du patient à l'admission, et recouvrer les factures par voie digitale", juste: true },
        { html: "Envoyer les images de radiologie et les résultats de biologie", aide: "La CNSS est un organisme payeur, pas un service de soins." },
        { html: "Héberger le DPP de l'hôpital", aide: "Le DPP est au centre du SIH. La CNSS intervient à l'entrée (droits) et à la sortie (factures)." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Éligibilité à l'admission, recouvrement digital des factures.");
        j.expliquer("<p>Le schéma montre aussi l'<b>identification et l'authentification du patient</b> à l'admission (carte d'identité, lecture NFC). C'est de l'interopérabilité externe.</p>");
        j.suite();
      } });
    } },
    { nom: "Interne ou externe ?", jouer: function (j, n) {
      var A = SIS;
      SIS.vider(n.g);
      j.titre("Range chaque échange : interopérabilité interne ou externe ?");
      var cartes = [{ t: "Le RIS envoie la liste de travail au scanner (MWL)", bac: 0 }, { t: "Le compte rendu part vers le DPI national", bac: 1 }, { t: "Le LIS envoie un résultat au DPI (HL7 V2)", bac: 0 }, { t: "Une téléconsultation avec un CHU d'une autre ville", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Interne", sous: "intra-modules hospitaliers" }, { t: "Externe", sous: "hors de l'hôpital" }],
        pos: A.grille(4, 2, 20, 20, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Les deux applications sont dans le même hôpital." : "L'information sort de l'hôpital."; },
        fin: function () { j.bravo("Interne : MWL, HL7 V2 entre modules. Externe : DPI national, télémédecine."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
