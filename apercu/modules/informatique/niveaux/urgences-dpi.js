/* Niveau : prise en charge d'un patient aux urgences, le DPI mis à jour en continu (S1S2, diapo 57). */
NIVEAU(SIS.rejouable({
  id: "urgences-dpi",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.ET = [["Accueil", "identité, motif"], ["Triage", "score de tri (IOA)"], ["Consultation urgence", "examen médical initial"], ["Explorations", "résultats bio / imagerie"], ["Salle d'observation", "surveillance, réévaluation"], ["Sortie", "domicile ou hospitalisation"]];
    return n;
  },
  etapes: [
    { nom: "Le parcours aux urgences", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Un patient arrive aux urgences. Touche les étapes de sa prise en charge, dans l'ordre.");
      var place = [3, 0, 4, 1, 5, 2];
      var nd = n.ET.map(function (e, i) { var c = place[i]; return { t: e[0], sous: e[1], x: 20 + (c % 2) * 330, y: 40 + Math.floor(c / 2) * 180, w: 310, h: 110 }; });
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [0, 1, 2, 3, 4, 5], coul: C.jeu, taille: 19,
        erreur: j.erreur,
        aide: function (i, att, k) { return ["On commence par connaître le patient : qui est-il, pourquoi vient-il ?", "Avant le médecin, on évalue l'urgence.", "Le médecin fait l'examen initial.", "Il demande des examens.", "En attendant la décision, on surveille et on réévalue.", "Enfin, le patient part : chez lui ou dans un service."][k]; },
        fin: function () { j.bravo("Accueil → triage → consultation → explorations → observation → sortie."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Quand le DPI est-il rempli ?", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      n.ET.forEach(function (e, i) {
        A.boite(n.g, 20, 30 + i * 92, 280, 76, { titre: e[0], sous: e[1], taille: 17 });
        A.fleche(n.g, [304, 68 + i * 92], [430, 68 + i * 92], { ep: 3, coul: C.doux });
      });
      A.boite(n.g, 440, 30, 220, 538, { titre: "DPI", sous: "?", fond: C.jeuPale, bord: C.jeu, ep: 3, taille: 30 });
      j.titre("Sur le schéma du cours, chaque étape envoie une flèche vers le DPI. Que montre-t-il ?");
      j.choix([
        { html: "Le DPI est mis à jour en continu, à chaque étape", juste: true },
        { html: "Le DPI est rempli une seule fois, à la sortie", aide: "Il y a une flèche par étape, pas seulement à la sortie." },
        { html: "Le DPI n'est rempli que par le médecin", aide: "Accueil, triage, observation : d'autres acteurs écrivent aussi." }
      ], { colonnes: 1, ok: function () { j.bravo("Mis à jour en continu."); j.suite(); } });
    } },
    { nom: "Qui a écrit quoi ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Ces lignes du DPI ont été écrites pendant la prise en charge. Range chacune sous son étape.");
      var cartes = [{ t: "Motif : douleur thoracique", bac: 0 }, { t: "Score de tri : 2", bac: 1 }, { t: "Troponine : 45 ng/L", bac: 3 }, { t: "Réévaluation à H+6 : douleur disparue", bac: 4 }, { t: "Retour à domicile", bac: 5 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.ET.map(function (e) { return { t: e[0] }; }),
        pos: function (i) { return { x: 10, y: 14 + i * 116, w: 300, h: 100 }; },
        bacsPos: function (k) { return { x: 340, y: 14 + k * 96, w: 330, h: 82 }; },
        couleurs: function (k) { return A.BACS[k % 5]; },
        dessinBac: function (g2, k, faux) { var st = A.BACS[k % 5]; A.boite(g2, 340, 14 + k * 96, 330, 82, { fond: faux ? A.C.koPale : st.pale, bord: faux ? A.C.ko : st.coul, ep: 3, titre: n.ET[k][0], taille: 18, coul: st.coul }); },
        taille: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le motif se recueille dès l'arrivée.", "Le score se donne au triage.", "Un résultat de biologie vient des explorations.", "La réévaluation se fait en observation.", "C'est la décision de fin."][i]; },
        fin: function () { j.bravo("Accueil, triage, explorations, observation, sortie."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
