/* Figures : de la prescription au plan de soins et à la feuille de surveillance ; une pancarte numérique. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-plan", {
    largeur: 960, hauteur: 520, titre: "Prescription, plan de soins, feuille de surveillance",
    essai: "<strong>Essaie</strong> : touche chaque état de la prescription. <strong>Observe</strong> : le plan de soins suit la prescription, la feuille de surveillance garde ce qui a été fait et mesuré."
  });
  var E = [["Créée", "ajout de tâches", "une nouvelle prescription ajoute ses tâches au plan de soins."], ["Modifiée", "mise à jour", "les tâches existantes sont mises à jour (dose, horaire...)."], ["Interrompue", "suspension", "les tâches sont suspendues, sans être effacées : on reprendra."], ["Annulée", "retrait du plan", "les tâches sont retirées du plan de soins."]];
  var items = [{ x: 380, y: 20, w: 200, h: 70, t: "Prescription", coul: C.acc, pale: C.accPale, texte: "le point de départ : le plan de soins découle directement des prescriptions médicales.", taille: 20 }];
  E.forEach(function (e, k) { var st = A.BACS[(k + 1) % 5]; items.push({ x: 40 + k * 225, y: 150, w: 200, h: 90, t: e[0], sous: e[1], texte: e[2], coul: st.coul, pale: st.pale, taille: 20 }); });
  items.push({ x: 330, y: 300, w: 300, h: 80, t: "Plan de soins", sous: "tâches infirmières planifiées", coul: C.jeu, pale: C.jeuPale, texte: "la liste ordonnée des tâches, des soins techniques (pansements, injections, perfusions), des examens à programmer et des surveillances.", taille: 20 });
  items.push({ x: 330, y: 420, w: 300, h: 80, t: "Feuille de surveillance", sous: "constantes, actes réalisés", coul: C.ok, pale: C.okPale, texte: "la pancarte numérisée : recueil et visualisation des constantes (température, tension, fréquence cardiaque, saturation en oxygène) et des actes réalisés.", taille: 20 });
  A.explorer(f, items, { fond: function (g) {
    [0, 1, 2, 3].forEach(function (k) { A.s("line", { x1: 480, y1: 92, x2: 140 + k * 225, y2: 148, stroke: C.trait, "stroke-width": 3 }, g); A.s("line", { x1: 140 + k * 225, y1: 242, x2: 480, y2: 298, stroke: C.trait, "stroke-width": 3 }, g); });
    A.fleche(g, [480, 382], [480, 418], { ep: 4 });
  } });

  var f2 = R.figure("fig-pancarte", {
    largeur: 960, hauteur: 420, titre: "Une pancarte numérique",
    essai: "<strong>Essaie</strong> : déplace l'heure. <strong>Observe</strong> : la courbe montre d'un coup d'œil quand la température franchit 38 °C (exemple ajouté)."
  });
  var g = A.s("g", null, f2.svg);
  var H = [6, 8, 10, 12, 14, 16, 18, 20, 22], T = [36.9, 37.1, 37.4, 37.8, 38.3, 38.6, 38.1, 37.6, 37.2], FC = [78, 80, 84, 88, 96, 102, 94, 86, 82];
  function px(h) { return 110 + (h - 6) * 50; }
  function py(t) { return 340 - (t - 36.5) * 120; }
  var cu = R.curseur(f2.reglages, { nom: "Heure", min: 6, max: 22, pas: 2, val: 14, unite: " h" });
  function dessiner() {
    A.vider(g);
    [36.5, 37, 37.5, 38, 38.5, 39].forEach(function (t) { A.s("line", { x1: 90, y1: py(t), x2: 930, y2: py(t), stroke: t === 38 ? C.ko : C.trait, "stroke-width": t === 38 ? 2.5 : 1.5, "stroke-dasharray": t === 38 ? "8 6" : null }, g); A.texte(g, String(t).replace(".", ","), [55, py(t)], { taille: 15, mono: true, coul: C.doux, halo: false }); });
    H.forEach(function (h) { A.texte(g, h + " h", [px(h), 370], { taille: 15, mono: true, coul: C.doux, halo: false }); });
    A.s("polyline", { points: H.map(function (h, i) { return px(h) + "," + py(T[i]); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
    var i = H.indexOf(cu.v);
    H.forEach(function (h, k) { A.s("circle", { cx: px(h), cy: py(T[k]), r: k === i ? 11 : 6, fill: k === i ? C.acc : "#fff", stroke: C.acc, "stroke-width": 3 }, g); });
    A.s("line", { x1: px(cu.v), y1: 30, x2: px(cu.v), y2: 350, stroke: C.encre, "stroke-width": 2, "stroke-dasharray": "4 6" }, g);
    A.texte(g, "Température (°C)", [200, 20], { taille: 16, gras: 700 });
    f2.direct.innerHTML = "<strong>" + cu.v + " h</strong> : température " + String(T[i]).replace(".", ",") + " °C, fréquence cardiaque " + FC[i] + " /min" + (T[i] > 38 ? " : au-dessus de 38 °C." : ".");
  }
  cu.surChange(dessiner);
  dessiner();
})();
