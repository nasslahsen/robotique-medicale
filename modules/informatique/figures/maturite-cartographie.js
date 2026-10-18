/* Figures : l'escalier de la maturité des processus ; la cartographie des processus d'un hôpital. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-maturite", {
    largeur: 960, hauteur: 460, titre: "Maturité des processus",
    essai: "<strong>Essaie</strong> : touche chaque marche. <strong>Observe</strong> : on ne saute pas de marche ; mesurer (4) suppose d'abord une règle commune (3)."
  });
  var NIV = [
    ["1 Initial", "processus aléatoire", "chacun fait à sa façon, quand il y pense. Exemple : chaque technicien étalonne l'automate quand il y pense."],
    ["2 Géré", "planifié, exécuté et évalué", "le processus est planifié, fait et vérifié. Exemple : l'étalonnage est prévu chaque lundi, fait puis vérifié."],
    ["3 Défini", "organisé et maîtrisé", "une règle commune, écrite, s'applique à tous. Exemple : une procédure d'étalonnage unique pour tout le laboratoire."],
    ["4 Quantifié", "mesuré et contrôlé", "on mesure le processus et on le compare à une cible. Exemple : la dérive mensuelle des automates est suivie."],
    ["5 Optimisé", "stable et flexible", "les mesures servent à améliorer ; le processus s'adapte vite. Exemple : un nouvel automate est intégré sans désordre."]
  ];
  A.explorer(f, NIV.map(function (x, k) { var st = A.BACS[k]; return { x: 30 + k * 170, y: 360 - k * 75, w: 220, h: 70, t: x[0], sous: x[1], texte: x[2], coul: st.coul, pale: st.pale, taille: 19, tailleSous: 13 }; }), {
    fond: function (g) { A.fleche(g, [948, 440], [948, 40], { ep: 4, coul: C.doux }); A.texte(g, "maturité", [905, 22], { taille: 15, coul: C.doux, gras: 700 }); }
  });

  var f2 = R.figure("fig-cartographie", {
    largeur: 960, hauteur: 540, titre: "Cartographie des processus d'un hôpital",
    essai: "<strong>Essaie</strong> : touche chaque bande. <strong>Observe</strong> : seuls les processus opérationnels sont vécus directement par le patient."
  });
  var g = A.s("g", null, f2.svg), ch = -1;
  var B = [
    { t: "Macroprocessus de management stratégique", y: 20, h: 130, coul: C.v, pale: C.vPale, p: ["Politique de recherche", "Politique d'enseignement", "Politique médicale", "Politique sociale", "Politique qualité et sécurité"], d: "le pilotage : la direction fixe les politiques qui orientent tout l'hôpital." },
    { t: "Macroprocessus opérationnels, en lien direct avec le patient", y: 180, h: 150, coul: C.jeu, pale: C.jeuPale, p: ["Accueil", "Démarche diagnostique", "Décision thérapeutique", "Mise en œuvre du traitement", "Surveillance"], d: "le métier : le parcours du patient, de l'accueil à la surveillance." },
    { t: "Macroprocessus supports", y: 360, h: 170, coul: C.turq, pale: C.turqPale, p: ["Diagnostic de biologie", "Imagerie", "Médicaments", "Radiophysique", "RH", "Maintenance", "Hôtellerie", "Facturation", "Qualité", "Sécurité"], d: "les services qui rendent possibles les processus opérationnels : biologie, imagerie, médicaments, maintenance, facturation..." }
  ];
  function dessiner() {
    A.vider(g);
    B.forEach(function (b, k) {
      var on = k === ch;
      A.s("rect", { x: 20, y: b.y, width: 920, height: b.h, rx: 18, fill: on ? b.pale : "#fff", stroke: b.coul, "stroke-width": on ? 4 : 2.5 }, g);
      A.texte(g, b.t, [480, b.y + 22], { taille: 16, gras: 800, coul: b.coul, halo: false });
      var nb = b.p.length, par = nb > 5 ? 5 : nb, w = (880 - (par - 1) * 10) / par;
      b.p.forEach(function (p, i) {
        var x = 40 + (i % par) * (w + 10), y = b.y + 42 + Math.floor(i / par) * 62;
        if (k === 1) {
          A.s("polygon", { points: [[x, y], [x + w - 20, y], [x + w, y + 35], [x + w - 20, y + 70], [x, y + 70], [x + 18, y + 35]].map(function (q) { return q.join(","); }).join(" "), fill: "#fff", stroke: b.coul, "stroke-width": 2 }, g);
          A.texte(g, p, [x + w / 2, y + 35], { taille: 14, halo: false, largeur: w - 40 });
        } else A.boite(g, x, y, w, 52, { titre: p, taille: 14, gras: 600, ep: 1.5, bord: b.coul, rx: 8 });
      });
      A.cible(g, 20, b.y, 920, b.h, function () { ch = k; dessiner(); });
    });
    f2.direct.innerHTML = ch >= 0 ? "<strong>" + B[ch].t + "</strong> : " + B[ch].d : "Touche une bande.";
  }
  dessiner();
})();
