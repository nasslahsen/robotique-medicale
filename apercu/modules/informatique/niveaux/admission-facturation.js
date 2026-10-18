/* Niveau : circuit admission → facturation, risques par étape, dilemme rapidité / fiabilité (S3, diapos 11 et 12). */
NIVEAU(SIS.rejouable({
  id: "admission-facturation",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.ET = [["Ouverture du séjour et mouvements", "admission"], ["Couverture sociale et droits", "admission"], ["Production des actes et du séjour", "hospitalier"], ["Sortie et clôture", "hospitalier"], ["Facturation et recouvrement", "facturation"]];
    return n;
  },
  etapes: [
    { nom: "Le circuit", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Touche les cinq étapes du circuit admission → facturation, dans l'ordre.");
      var place = [3, 0, 4, 1, 2];
      var nd = n.ET.map(function (e, i) { var c = place[i]; return { t: e[0], sous: "service : " + e[1], x: c === 4 ? 185 : 20 + (c % 2) * 330, y: 40 + Math.floor(c / 2) * 180, w: 310, h: 110 }; });
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [0, 1, 2, 3, 4], coul: C.jeu, taille: 18,
        erreur: j.erreur,
        aide: function (i, att, k) { return ["On ouvre d'abord le séjour.", "On vérifie qui paie : AMO, organisme payeur.", "Pendant le séjour, on produit des actes.", "Le séjour se termine.", "On facture et on recouvre."][k]; },
        fin: function () { j.bravo("Ouverture → droits → actes → sortie → facturation."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Le risque de chaque étape", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque étape à son risque.");
      var p = A.paires({
        g: n.g, gauche: n.ET.map(function (e) { return e[0]; }),
        droite: ["Actes oubliés, sous-valorisation", "Rejets, impayés, délais", "Lit erroné, mouvement non saisi", "Actes exécutés après la sortie déclarée", "Droits erronés, rejet du dossier"],
        bon: [2, 4, 0, 3, 1],
        xg: 10, wg: 300, xd: 360, wd: 310, y0: 30, h: 96, pas: 112, taille: 16, tailleD: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Unité, lit, transferts, mutations.", "Vérification de l'AMO, organisme payeur.", "Saisie ou remontée des actes, consommables, DM facturables.", "Compte rendu de sortie, date de sortie médicale et administrative.", "Tarification, tiers payant, suivi des rejets."][i]; },
        fin: function () {
          j.bravo("Chaque étape a son risque, et beaucoup faussent aussi les statistiques (taux de rotation des lits, durée des séjours).");
          j.suite();
        }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Une erreur au départ", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["carte", "personne", "personne"], titre: "Deux « Mohamed Alaoui » dans la base", sous: "l'agent choisit le mauvais" });
      j.titre("À l'admission, l'agent choisit le mauvais « Mohamed Alaoui ». Jusqu'où l'erreur se paie-t-elle ?");
      j.choix([
        { html: "Seulement à l'admission : on corrige à la sortie", aide: "Pendant tout le séjour, les actes s'écrivent dans le mauvais dossier." },
        { html: "Durant toutes les étapes : actes refaits, séjour allongé, litige, facture rejetée", juste: true },
        { html: "Seulement à la facturation", aide: "La facture n'est que le dernier endroit où l'erreur se voit." }
      ], { colonnes: 1, ok: function () { j.bravo("Transverse : une erreur d'identité au départ se paie durant toute la prise en charge."); j.suite(); } });
    } },
    { nom: "Rapidité ou fiabilité ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Dilemme du cours : où placer le curseur entre rapidité et fiabilité de l'identité ? Range chaque situation.");
      var cartes = [{ t: "Patient stable, aux urgences, venu avec sa CIN", bac: 0 }, { t: "Polytraumatisé inconscient, sans papiers, en urgence vitale", bac: 1 }, { t: "Consultation programmée", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Favoriser la qualité", sous: "vérifier l'identité avant tout" }, { t: "Identité provisoire", sous: "procédure dédiée, régularisée ensuite" }],
        pos: function (i) { return { x: 14 + i * 222, y: 30, w: 208, h: 170 }; },
        bacsPos: function (k) { return { x: k ? 20 : 350, y: 320, w: 310, h: 200 }; },
        taille: 16,
        fond: function (g2) { A.fleche(g2, [60, 270], [620, 270], { ep: 6, double: true, coul: A.C.doux }); A.texte(g2, "Rapidité", [80, 300], { taille: 15, coul: A.C.doux, ancre: "start" }); A.texte(g2, "Fiabilité", [600, 300], { taille: 15, coul: A.C.doux, ancre: "end" }); },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return i === 1 ? "Chaque minute compte et l'identité est inconnue : le cours prévoit une procédure pour ce cas." : "Rien n'empêche de vérifier : le cours dit de favoriser la qualité des données."; },
        fin: function () {
          j.bravo("Qualité d'abord ; identité provisoire seulement en urgence totale.");
          j.expliquer("<p>Propositions du cours : il faut <b>favoriser la qualité des données à la rapidité</b> lors de l'admission ; en cas d'urgence totale, mettre en place une <b>procédure de gestion de l'identité provisoire</b>.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
