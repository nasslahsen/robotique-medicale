/* Niveau : le DPI, ses volets et ses échanges avec les modules du SIH (S1S2, diapo 54). */
NIVEAU(SIS.rejouable({
  id: "dpi-modules",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Deux côtés", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Sur le schéma du cours, le DPI échange d'un côté avec des modules médico-techniques, de l'autre avec des modules administratifs. Range chaque module.");
      var cartes = [{ t: "RIS", bac: 0 }, { t: "Admission", bac: 1 }, { t: "PACS", bac: 0 }, { t: "RDV", bac: 1 }, { t: "LIS", bac: 0 }, { t: "Cotation des prestations et facturation", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Médico-techniques", sous: "HL7, DICOM, SNOMED" }, { t: "Administratifs", sous: "NGAP, NABM, CIM-10" }],
        pos: A.grille(6, 3, 14, 20, 652, 90, 14), bacsPos: function (k) { return { x: k ? 470 : 10, y: 260, w: 200, h: 300 }; },
        fond: function (g2) { A.s("circle", { cx: 340, cy: 410, r: 90, fill: C.jeuPale, stroke: C.jeu, "stroke-width": 3 }, g2); A.texte(g2, "DPI", [340, 410], { taille: 28, gras: 800, halo: false }); A.fleche(g2, [212, 410], [248, 410], { ep: 4, double: true }); A.fleche(g2, [432, 410], [468, 410], { ep: 4, double: true }); },
        taille: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Ce module produit des examens : images ou analyses." : "Ce module organise ou facture le passage du patient."; },
        fin: function () {
          j.bravo("RIS, PACS, LIS d'un côté ; admission, RDV, facturation de l'autre.");
          j.expliquer("<p>Les échanges avec les modules médico-techniques s'appuient sur <b>HL7, DICOM, SNOMED</b> ; ceux avec l'administratif sur <b>NGAP, NABM, CIM-10</b>.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Les volets du DPI", jouer: function (j, n) {
      var A = SIS;
      j.titre("Autour de la synthèse, le DPI s'organise en volets. Relie chaque information à son volet.");
      var p = A.paires({
        g: n.g, gauche: ["Adresse et couverture sociale", "Compte rendu opératoire", "Transmissions infirmières", "Ordonnance validée par le pharmacien", "Courrier scanné du médecin traitant", "Aide à domicile à organiser"],
        droite: ["Volet paramédical", "Volet social", "Volet administratif", "Volet GED", "Volet médical", "Volet pharmaceutique"],
        bon: [2, 4, 0, 5, 3, 1],
        xg: 10, wg: 360, xd: 430, wd: 240, y0: 20, h: 84, pas: 96, taille: 16, tailleD: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Identité, couverture : l'administratif.", "Écrit par le chirurgien : médical.", "Écrites par les infirmiers : paramédical.", "Le médicament, côté pharmacie.", "Un document numérisé : gestion électronique des documents.", "La situation de vie du patient : social."][i]; },
        fin: function () { j.bravo("Administratif, médical, paramédical, pharmaceutique, GED, social, autour de la synthèse."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Le bon standard", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["serveur", "ecran"], titre: "Du PACS vers le DPI", sous: "les images d'un scanner" });
      SIS.vider(n.g);
      j.titre("Le PACS doit envoyer les images d'un scanner vers le DPI. Lequel des standards cités sur le schéma est fait pour les images médicales ?");
      j.choix([{ html: "DICOM", juste: true }, { html: "NGAP", aide: "La NGAP sert à coter des actes, côté facturation." }, { html: "CIM-10", aide: "La CIM-10 code les diagnostics." }], { colonnes: 3, ok: function () { j.bravo("DICOM : le standard des images médicales."); j.suite(); } });
    } }
  ]
}));
