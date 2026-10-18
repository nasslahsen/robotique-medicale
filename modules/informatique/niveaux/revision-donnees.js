/* Révision du chapitre 4 : information de santé, CID, parcours, types, qualité, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-donnees",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Encore la norme", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque élément : information personnelle de santé, ou pas ?");
      var cartes = [{ t: "Le numéro d'immatriculation CNSS de M. Berrada", bac: 0 }, { t: "La liste des médicaments en stock à la pharmacie", bac: 1 }, { t: "Le compte rendu d'IRM de Mme Ziani", bac: 0 }, { t: "Le droit de M. Berrada à une prise en charge", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Oui" }, { t: "Non" }],
        pos: A.grille(4, 2, 20, 20, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 1 ? "Aucune personne identifiable ici." : "Un identifiant, un examen, une légitimité à recevoir des soins : la norme les inclut."; },
        fin: function () { j.bravo("Seul le stock de médicaments ne concerne personne en particulier."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le PACS en panne", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["serveur", "alerte"], titre: "PACS en panne avant une opération" });
      SIS.vider(n.g);
      j.titre("Le PACS est en panne : le neurochirurgien ne peut pas voir le scanner cérébral de son patient avant d'opérer. Quel critère est touché ?");
      j.choix([{ html: "Confidentialité", aide: "Personne n'a vu ce qu'il ne devait pas voir." }, { html: "Intégrité", aide: "Les images ne sont pas fausses : elles sont inaccessibles." }, { html: "Disponibilité", juste: true }], { colonnes: 3, ok: function () { j.bravo("Disponibilité : la donnée existe mais n'est pas accessible quand il le faut."); j.suite(); } });
    } },
    { nom: "Où la valeur s'est abîmée", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["moniteur", "base"], titre: "38,5 °C au lit, 385 dans l'entrepôt" });
      j.titre("Au lit, l'infirmier mesure 38,5 °C et le DPI affiche bien 38,5. Dans l'entrepôt, on lit 385. À quelle étape la valeur a-t-elle été abîmée ?");
      j.choix([
        { html: "À la mesure", aide: "La mesure et le DPI sont justes. Cherche plus loin dans la chaîne." },
        { html: "À l'ETL, en copiant la production vers l'entrepôt (la virgule décimale s'est perdue)", juste: true },
        { html: "À la décision du comité", aide: "Le comité arrive après l'entrepôt : l'erreur est déjà là." }
      ], { colonnes: 1, ok: function () { j.bravo("Juste dans le DPI, faux dans l'entrepôt : le passage entre les deux, l'ETL."); j.suite(); } });
    } },
    { nom: "Deux nouvelles anomalies", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range ces anomalies dans leur dimension de qualité.");
      var cartes = [{ t: "Taille = 17 m", bac: 1 }, { t: "Groupe sanguin noté « A+ », « A pos », « A positif »", bac: 2 }, { t: "Poids absent pour 30 patients", bac: 0 }, { t: "Téléphone = « pas de tél »", bac: 3 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Complétude" }, { t: "Exactitude" }, { t: "Cohérence" }, { t: "Validité (format)" }],
        pos: A.grille(4, 2, 20, 20, 640, 110, 18), bacsPos: function (k) { return { x: 14 + (k % 2) * 334, y: 300 + Math.floor(k / 2) * 140, w: 318, h: 124 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Est-ce réaliste ?", "Le même concept est-il codé de la même façon ?", "La valeur est-elle présente ?", "Le format attendu (des chiffres) est-il respecté ?"][i]; },
        fin: function () { j.bravo("Exactitude, cohérence, complétude, validité."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Quel type ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "base"], titre: "Une échelle de douleur de 0 à 10", sous: "cochée, puis stockée dans une colonne" });
      SIS.vider(n.g);
      j.titre("Une échelle de douleur est cochée de 0 à 10 dans un formulaire, puis stockée dans une colonne « douleur » de la base. Quel type de donnée ?");
      j.choix([{ html: "Structurée", juste: true }, { html: "Semi-structurée", aide: "Ce n'est pas un message d'échange : c'est une colonne fixe d'une base." }, { html: "Non structurée", aide: "La valeur a sa case dans une table : elle n'est pas noyée dans du texte libre." }], { colonnes: 3, ok: function () { j.bravo("Une colonne fixe dans une base : structurée."); j.suite(); } });
    } }
  ]
}));
