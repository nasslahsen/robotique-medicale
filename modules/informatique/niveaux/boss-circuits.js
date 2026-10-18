/* Boss du chapitre 6 : le patient de 22 h 40, sans papiers, suivi de l'admission à la facturation. */
NIVEAU(SIS.rejouable({
  id: "boss-circuits",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g, FINS: ["haut", "milieu", "bas", "vigil"] };
  },
  etapes: [
    { nom: "À l'admission", jouer: function (j, n) {
      var A = SIS, F = A.BPMN_FINS;
      j.titre("22 h 40. Pas de CIN. La recherche affiche deux « Mohamed Alaoui ». Le proche donne la date de naissance : elle correspond à l'un d'eux, et à son adresse. Touche l'issue.");
      var r = A.reperer({ g: n.g, zones: n.FINS.map(function (k) { var f = F[k]; return f.box ? { x: f.box[0], y: f.box[1], w: f.box[2], h: f.box[3], bon: false } : { x: f.c[0] - 34, y: f.c[1] - 26, w: 68, h: 70, bon: k === "bas" }; }),
        dessiner: function (g2, e) { var fin = {}; n.FINS.forEach(function (k, i) { if (e.trouve[i]) fin[k] = "ok"; else if (e.faux === i) fin[k] = "faux"; }); A.bpmnIdentite(g2, { fin: fin, chemin: e.trouve[2] ? "bas" : null }); },
        erreur: j.erreur, aide: function () { return "Plusieurs résultats sans CIN, et la date de naissance est cohérente avec une fiche."; },
        fin: function () { j.bravo("Plusieurs résultats sans CIN, cohérence avec la date de naissance : identité choisie."); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "La troponine", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.icone(n.g, "horloge", [340, 220], 120, C.acc);
      A.texte(n.g, "TAT = 120 min", [340, 340], { taille: 32, mono: true, gras: 800 });
      A.texte(n.g, "Exemple ajouté", [340, 400], { taille: 15, coul: C.doux });
      j.titre("Sa troponine met 120 minutes entre prescription et résultat. Combien de minutes la phase pré-analytique a-t-elle prises, d'après le cours ?");
      j.nombre({ cases: [{ attendu: 72, tol: 0.01 }], apres: "\\text{ min}", aide: function () { return "Pré-analytique : 60 % du TAT."; }, ok: function () { j.bravo("\\(0{,}60 \\times 120 = 72\\) min : c'est là qu'il faut gagner du temps."); j.suite(); } });
    } },
    { nom: "Le lendemain", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      var L = [["Champ", "Fiche choisie hier", "Avec la CIN du fils", "Score", "Poids"], ["Nom", "ALAOUI", "ALAOUI", "1,00", "8"], ["Prénom", "MOHAMED", "MOHAMMED", "0,90", "3"], ["Naissance", "12/05/1957", "12/05/1957", "1,00", "4"], ["Sexe", "M", "M", "1,00", "1"], ["Téléphone", "06 61 22 33 44", "06 61 22 33 44", "1,00", "2"], ["CIN", "(vide)", "AB123456", "0,00", "6"]];
      A.tableau(n.g, 10, 40, [110, 170, 170, 100, 110], 60, L, { taille: 15, tailleTete: 13, style: function (i, k) { return i > 0 && k === 3 && L[i][3] !== "1,00" ? { fond: C.koPale, bord: C.ko, ep: 2.5, mono: true, gras: 700 } : null; } });
      j.titre("Le lendemain, son fils apporte sa CIN. Le MPI compare la fiche d'hier avec la CIN. Calcule le score global (arrondi au centième).");
      j.nombre({ cases: [{ attendu: 0.74, tol: 0.006 }], avant: "\\text{score} \\approx", aide: function () { return "(8 + 0,9 × 3 + 4 + 1 + 2 + 0 × 6) / 24."; }, ok: function () {
        j.bravo("\\(17{,}7 / 24 \\approx 0{,}74\\) : revue manuelle.");
        j.texte("L'agent vérifie : c'est bien le même homme. Que fait-on des deux enregistrements ?");
        j.choix([{ html: "On les fusionne en un Golden Record", juste: true }, { html: "On garde les deux, au cas où", aide: "Deux dossiers pour une personne : c'est un doublon." }, { html: "On supprime celui d'hier avec tout son contenu", aide: "Le dossier d'hier contient sa troponine et son ECG : on ne les jette pas." }], { colonnes: 1, ok: function () { j.bravo("Fusion : une fiche pivot unique et consolidée."); j.suite(); } });
      } });
    } },
    { nom: "La facture rejetée", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["facture", "alerte"], titre: "Facture rejetée par la CNSS", sous: "droits jamais vérifiés" });
      j.titre("À la sortie, la CNSS rejette la facture : ses droits n'avaient jamais été vérifiés. Quelle étape du circuit a été sautée ?");
      j.choix([{ html: "Couverture sociale et droits", juste: true }, { html: "Production des actes", aide: "Les actes sont bien saisis. Le payeur n'a pas été vérifié." }, { html: "Sortie et clôture", aide: "La sortie a eu lieu. Le problème date de l'admission." }], { colonnes: 1, ok: function () { j.bravo("Vérification de l'AMO à l'admission : droits erronés, rejet du dossier."); j.suite(); } });
    } }
  ]
}));
