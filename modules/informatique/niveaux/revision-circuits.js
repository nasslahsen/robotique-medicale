/* Révision du chapitre 6 : identité, appariement, LIS, PIS, admission → facturation, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-circuits",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g, FINS: ["haut", "milieu", "bas", "vigil"] };
    return n;
  },
  etapes: [
    { nom: "La CIN qui ne colle pas", jouer: function (j, n) {
      var A = SIS, F = A.BPMN_FINS;
      j.titre("Mme Rami présente sa CIN. La recherche trouve une fiche avec ce numéro, mais au nom d'un autre patient, né en 1950. Touche l'issue.");
      var r = A.reperer({ g: n.g, zones: n.FINS.map(function (k) { var f = F[k]; return f.box ? { x: f.box[0], y: f.box[1], w: f.box[2], h: f.box[3], bon: false } : { x: f.c[0] - 34, y: f.c[1] - 26, w: 68, h: 70, bon: k === "milieu" }; }),
        dessiner: function (g2, e) { var fin = {}; n.FINS.forEach(function (k, i) { if (e.trouve[i]) fin[k] = "ok"; else if (e.faux === i) fin[k] = "faux"; }); A.bpmnIdentite(g2, { fin: fin, chemin: e.trouve[1] ? "incoherent" : null }); },
        erreur: j.erreur, aide: function () { return "Branche du haut, puis la porte « aucune cohérence » : où mène-t-elle ?"; },
        fin: function () { j.bravo("Aucune cohérence avec la CIN : on crée une nouvelle identité, et on signale l'anomalie."); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Un nouveau score", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      var L = [["Champ", "Score partiel", "Poids"], ["Nom", "0,50", "8"], ["Prénom", "1,00", "3"], ["Naissance", "1,00", "4"], ["Sexe", "1,00", "1"], ["Téléphone", "0,00", "2"], ["CIN", "1,00", "6"]];
      A.tableau(n.g, 120, 40, [160, 160, 120], 56, L, { taille: 18, style: function (i, k) { return i > 0 && k === 1 && L[i][1] !== "1,00" ? { fond: C.koPale, bord: C.ko, ep: 2.5, mono: true, gras: 700 } : i > 0 && k > 0 ? { mono: true } : null; } });
      A.texte(n.g, "Mêmes poids que dans le niveau précédent (exemple ajouté)", [340, 460], { taille: 15, coul: C.doux });
      j.titre("Nom à moitié ressemblant, téléphone différent, le reste identique. Calcule le score global, puis décide.");
      j.nombre({ cases: [{ attendu: 0.75, tol: 0.005 }], avant: "\\text{score} =", aide: function () { return "(0,5 × 8 + 3 + 4 + 1 + 0 × 2 + 6) / 24."; }, ok: function () {
        j.bravo("\\(18 / 24 = 0{,}75\\).");
        j.choix([{ html: "MATCH", aide: "0,75 n'est pas au-dessus de 0,90." }, { html: "REVUE MANUELLE", juste: true }, { html: "PAS DE MATCH", aide: "0,75 est au-dessus de 0,70." }], { colonnes: 3, ok: function () { j.bravo("Entre 0,70 et 0,90 : l'agent d'admission vérifie."); j.suite(); } });
      } });
    } },
    { nom: "Le tube hémolysé", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["tube", "horloge"], titre: "Un tube oublié dans un couloir" });
      SIS.vider(n.g);
      j.titre("Un tube arrive hémolysé au labo parce qu'il a attendu trop longtemps dans un couloir. Dans quelle phase est née l'erreur ?");
      j.choix([{ html: "Pré-analytique", juste: true }, { html: "Analytique", aide: "L'automate n'y est pour rien : le tube était abîmé avant." }, { html: "Post-analytique", aide: "Le résultat n'existe pas encore." }], { colonnes: 3, ok: function () { j.bravo("Acheminement : pré-analytique, le principal gisement d'erreurs."); j.suite(); } });
    } },
    { nom: "La trentième alerte", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["pilule", "alerte"], titre: "La trentième alerte de la journée" });
      j.titre("Un médecin valide sans la lire une alerte d'interaction, la trentième de la journée. Quel risque du PIS est-ce ?");
      j.choix([{ html: "La fatigue d'alerte", juste: true }, { html: "Une erreur de dispensation", aide: "On est encore à la prescription, avant la pharmacie." }, { html: "Une radiovigilance", aide: "La radiovigilance concerne l'imagerie." }], { colonnes: 1, ok: function () { j.bravo("Trop d'alertes tuent l'alerte : c'est la fatigue d'alerte."); j.suite(); } });
    } },
    { nom: "L'acte fantôme", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "facture"], titre: "Une échographie dans le compte rendu", sous: "mais pas dans les actes saisis" });
      j.titre("Le compte rendu de sortie parle d'une échographie qui n'apparaît pas dans les actes saisis. À quelle étape du circuit admission → facturation est ce risque ?");
      j.choix([{ html: "Ouverture du séjour", aide: "Le séjour est déjà ouvert depuis longtemps." }, { html: "Sortie et clôture : discordance entre acte et compte rendu", juste: true }, { html: "Couverture sociale", aide: "Les droits du patient ne sont pas en cause." }], { colonnes: 1, ok: function () { j.bravo("Sortie et clôture : on compare les actes et le compte rendu."); j.suite(); } });
    } }
  ]
}));
