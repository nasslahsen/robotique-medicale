/* Figures : salle conventionnelle et salle hybride superposées ; points à étudier pour la protection radiologique. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;

  /* ---------- Figure 1 : ce qui entre dans une salle hybride ---------- */
  (function () {
    var f = R.figure("fig-hybride", {
      largeur: 960, hauteur: 540, titre: "Salle conventionnelle et salle hybride",
      essai: "<strong>Essaie</strong> : ajoute les équipements un à un. <strong>Observe</strong> : ils sortent du contour d'une salle conventionnelle ; la salle hybride doit être plus grande."
    });
    var g = A.s("g", null, f.svg);
    var EQ = [["Arceau", 0], ["Système d'angiographie", 1], ["Anesthésie", 2], ["Équipements chirurgicaux", 3], ["Protection radiologique", 4]];
    var b = R.boutons(f.reglages), on = { 0: true, 1: true, 2: true, 3: true, 4: true }, bts = [];
    EQ.forEach(function (e) { bts.push(R.bouton(b, e[0], function () { on[e[1]] = !on[e[1]]; dessiner(); })); });
    R.bouton(b, "Tout", function () { EQ.forEach(function (e) { on[e[1]] = true; }); dessiner(); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      A.vider(g);
      bts.forEach(function (bt, i) { bt.classList.toggle("actif", !!on[i]); });
      var n = Object.keys(on).filter(function (k) { return on[k]; }).length;
      if (n === 5) { A.s("rect", { x: 130, y: 20, width: 700, height: 500, fill: "none", stroke: C.ok, "stroke-width": 4 }, g); A.texte(g, "salle hybride", [480, 36], { taille: 16, coul: C.ok }); }
      A.s("rect", { x: 280, y: 110, width: 400, height: 320, fill: "none", stroke: C.gris, "stroke-width": 3, "stroke-dasharray": "10 8" }, g);
      A.texte(g, "contour d'une salle conventionnelle", [480, 446], { taille: 15, coul: C.doux });
      A.s("rect", { x: 450, y: 180, width: 60, height: 180, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
      A.texte(g, "Table", [480, 270], { taille: 15, halo: false });
      if (on[0]) { A.s("path", { d: "M395 230 A85 85 0 0 1 565 230", fill: "none", stroke: C.v, "stroke-width": 16, "stroke-linecap": "round" }, g); A.texte(g, "Arceau", [480, 132], { taille: 15, coul: C.v }); }
      if (on[1]) A.boite(g, 640, 120, 170, 110, { fond: C.vPale, bord: C.v, titre: "Système d'angiographie", taille: 15 });
      if (on[2]) A.boite(g, 400, 50, 160, 60, { fond: C.vPale, bord: C.v, titre: "Anesthésie", taille: 15 });
      if (on[3]) A.boite(g, 150, 330, 190, 90, { fond: C.vPale, bord: C.v, titre: "Équipements chirurgicaux", taille: 15 });
      if (on[4]) A.boite(g, 640, 330, 170, 90, { fond: C.vPale, bord: C.v, titre: "Protection radiologique", taille: 15 });
      zone.innerHTML = n === 5 ? "Tous les équipements sont là : ils débordent du contour conventionnel. Le FGI prévoit des exigences spécifiques d'espace (dégagements autour de la table, installation, maintenance)." : "Ajoute les équipements cités par le cours.";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : radioprotection ---------- */
  (function () {
    var f = R.figure("fig-radio", {
      largeur: 960, hauteur: 540, titre: "Ce qu'il faut étudier pour la radioprotection",
      essai: "<strong>Essaie</strong> : touche chaque point numéroté. <strong>Observe</strong> : les rayons X peuvent traverser tout ce qui entoure la salle ; l'étude décide de la protection de chacun."
    });
    var g = A.s("g", null, f.svg), sel = 0;
    var P = [[[170, 270], "Blindage des parois", "les parois qui séparent la salle des autres locaux."], [[480, 500], "Portes", "elles doivent protéger autant que le mur qu'elles interrompent."], [[800, 160], "Vitrages", "la vitre du pupitre de commande, d'où l'équipe regarde."], [[480, 60], "Plafond / plancher si nécessaire", "si des locaux occupés sont au-dessus ou au-dessous."], [[480, 270], "Positionnement de la source", "l'endroit d'où partent les rayons change les zones exposées."], [[860, 400], "Zones adjacentes", "un bureau occupé ne se protège pas comme un local technique."], [[620, 500], "Signalisation", "un voyant et des panneaux avertissent quand l'appareil émet."], [[300, 500], "Contrôle réglementaire", "la protection construite est vérifiée."]];
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      A.vider(g);
      A.s("rect", { x: 200, y: 90, width: 560, height: 380, fill: A.ZONES.restreinte.fond, stroke: C.encre, "stroke-width": 10 }, g);
      A.texte(g, "Salle hybride", [300, 120], { taille: 17, halo: false });
      A.s("rect", { x: 755, y: 130, width: 10, height: 90, fill: "#bfe3ff", stroke: C.acc, "stroke-width": 2 }, g);
      A.boite(g, 790, 90, 150, 60, { titre: "Pupitre", taille: 15 });
      A.boite(g, 790, 320, 150, 60, { titre: "Bureau voisin", taille: 15 });
      A.s("rect", { x: 450, y: 180, width: 60, height: 180, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2 }, g);
      A.s("rect", { x: 430, y: 464, width: 100, height: 12, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      P.forEach(function (p, i) {
        var on = sel === i;
        A.s("circle", { cx: p[0][0], cy: p[0][1], r: 22, fill: on ? C.jeu : "#fff", stroke: on ? "#fff" : C.jeu, "stroke-width": 3 }, g);
        A.texte(g, String(i + 1), p[0], { taille: 18, coul: on ? "#fff" : C.jeu, halo: false, gras: 800 });
        A.cible(g, p[0][0] - 32, p[0][1] - 32, 64, 64, function () { sel = i; dessiner(); });
      });
      zone.innerHTML = "<strong>" + (sel + 1) + ". " + P[sel][1] + "</strong> : " + P[sel][2] + " La protection est calculée par une étude radiophysique / radioprotection, pas par une épaisseur standard.";
    }
    dessiner();
  })();
})();
