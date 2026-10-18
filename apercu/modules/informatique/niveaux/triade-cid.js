/* Niveau : triangle d'or CIA / CID, exemples et conséquences pour le patient (cyber, diapo 11). */
NIVEAU(SIS.rejouable({
  id: "triade-cid",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.CR = [{ t: "Confidentialité", coul: C.ko, pale: C.koPale }, { t: "Intégrité", coul: C.ok, pale: C.okPale }, { t: "Disponibilité", coul: C.v, pale: C.vPale }];
    n.POS = [{ x: 14, y: 320, w: 200, h: 140 }, { x: 240, y: 260, w: 200, h: 140 }, { x: 466, y: 320, w: 200, h: 140 }];
    n.fond = function (g2) {
      A.s("circle", { cx: 340, cy: 520, r: 66, fill: C.acc }, g2);
      A.texte(g2, "Données des patients = sécurité du patient", [340, 520], { taille: 13, coul: "#fff", halo: false, gras: 800, largeur: 110 });
    };
    return n;
  },
  etapes: [
    { nom: "Quel côté est touché ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Six incidents. Range chacun dans le critère qu'il attaque.");
      var cartes = [{ t: "Un résultat de labo modifié", bac: 1 }, { t: "Le PACS en panne", bac: 2 }, { t: "Une analyse génétique divulguée", bac: 0 }, { t: "Une posologie changée dans la base", bac: 1 }, { t: "Le monitorage coupé", bac: 2 }, { t: "Des images de patients sur un forum", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.CR,
        pos: A.grille(6, 3, 14, 14, 652, 90, 12), bacsPos: function (k) { return n.POS[k]; },
        fond: n.fond,
        couleurs: function (k) { return n.CR[k]; },
        dessinBac: function (g2, k, faux) { var r = n.POS[k], c = n.CR[k]; A.boite(g2, r.x, r.y, r.w, r.h, { fond: faux ? A.C.fond : c.pale, bord: faux ? A.C.gris : c.coul, ep: 3, titre: c.t, taille: 20, coul: c.coul }); A.fleche(g2, [r.x + r.w / 2, r.y + r.h + 4], [340 + (k - 1) * 46, 470], { ep: 3, coul: c.coul }); },
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Quelqu'un voit ce qu'il ne devait pas voir.", "La donnée est devenue fausse.", "La donnée ou le service n'est plus accessible."][b]; },
        fin: function () { j.bravo("Confidentialité, intégrité, disponibilité."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Les conséquences", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque critère à sa conséquence pour le patient, d'après le cours.");
      var p = A.paires({
        g: n.g, gauche: ["Confidentialité", "Intégrité", "Disponibilité"], droite: ["Retard de prise en charge", "Atteinte à la vie privée", "Erreur de soins"],
        bon: [1, 2, 0], xg: 40, wg: 240, xd: 380, wd: 260, y0: 80, h: 110, pas: 160, taille: 20, tailleD: 19,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Des données vues par d'autres.", "Des données fausses qu'on croit justes.", "Des données absentes au moment où il faut décider."][i]; },
        fin: function () { j.bravo("Vie privée, erreur de soins, retard de prise en charge."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "La plus sournoise", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["tube", "alerte"], titre: "Une donnée fausse mais plausible" });
      j.titre("Le cours note que l'erreur de soins par atteinte à l'intégrité est « souvent non détectable ». Pourquoi est-ce si dangereux ?");
      j.choix([
        { html: "Une donnée fausse mais plausible ressemble à une vraie : on soigne sur une erreur sans le savoir", juste: true },
        { html: "Parce qu'elle fait tomber le réseau", aide: "Ce serait la disponibilité. L'intégrité touche la justesse de la donnée." },
        { html: "Parce qu'elle est publiée sur Internet", aide: "Ce serait la confidentialité." }
      ], { colonnes: 1, ok: function () { j.bravo("Une panne se voit ; une valeur fausse plausible, non."); j.suite(); } });
    } },
    { nom: "La priorité de l'hôpital", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["lit", "horloge"], titre: "À l'hôpital, qu'est-ce qui prime ?" });
      j.titre("À l'hôpital, le cours dit que deux critères priment souvent sur le troisième. Lesquels ?");
      j.choix([
        { html: "Disponibilité et intégrité, avant la confidentialité", juste: true },
        { html: "Confidentialité et intégrité, avant la disponibilité", aide: "Le retard n'est pas toléré quand une panne bloque une décision médicale." },
        { html: "Confidentialité et disponibilité, avant l'intégrité", aide: "Une donnée fausse mène à une erreur de soins : l'intégrité compte énormément." }
      ], { colonnes: 1, ok: function () { j.bravo("Disponibilité et intégrité priment souvent : le patient ne peut pas attendre, et une donnée fausse le met en danger."); j.suite(); } });
    } }
  ]
}));
