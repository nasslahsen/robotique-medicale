(function () {
  "use strict";
  var R = RM, C = R.C;
  var T = function (a) { return PLATEFORME.teinte(a); };
  function txt(g, s, p, o) { o = o || {}; o.italique = false; o.gras = o.gras === undefined ? true : o.gras; return R.texte(g, s, p, o); }

  /* ---------- Figure : la presse à injecter, cycle pas à pas ---------- */
  var f = R.figure("fig-injection", {
    largeur: 960, hauteur: 520, titre: "Presse d'injection : unité d'injection et moule à deux empreintes",
    essai: "<strong>Essaie</strong> : avance dans le cycle avec les étapes, puis règle la course de la vis à l'étape « injection ». <strong>Observe</strong> : la matière remplit d'abord la carotte, puis les canaux, puis les empreintes par les seuils ; une course trop courte laisse une pièce incomplète."
  });
  var g = R.el("g", null, f.svg), k = 0;
  var noms = ["moule fermé, matière froide", "chauffer et ramollir dans le cylindre", "doser : la vis tourne et recule", "injecter : la vis avance comme un piston", "refroidir dans le moule fermé", "ouvrir et éjecter les pièces"];
  var course = R.curseur(f.reglages, { nom: "Course de la vis (étape 3)", min: 0, max: 100, pas: 1, val: 100, unite: " %" });
  course.surChange(dessiner);
  var et = R.etapes(f.reglages, 5, noms, function (n) { k = n; dessiner(); });
  var X0 = 420;
  function dessiner() {
    R.vider(g);
    var r = k < 3 ? 0 : k === 3 ? course.v / 100 : 1;
    var chaud = k >= 1, dose = k >= 2;
    // trémie
    R.el("path", { d: "M690 30 L790 30 L765 110 L715 110 Z", fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 3, "stroke-linejoin": "round" }, g);
    for (var i = 0; i < 10; i++) R.el("circle", { cx: 706 + (i % 5) * 16 + (i > 4 ? 8 : 0), cy: 48 + (i > 4 ? 16 : 0), r: 6, fill: T(0.55), stroke: C.fonce, "stroke-width": 1 }, g);
    txt(g, "trémie", [740, 16], { taille: 16, couleur: C.doux });
    // cylindre et colliers chauffants
    R.el("rect", { x: 470, y: 110, width: 380, height: 76, rx: 6, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 3 }, g);
    [560, 640, 720, 800].forEach(function (x) { R.el("rect", { x: x - 22, y: 98, width: 44, height: 100, rx: 5, fill: chaud ? "rgba(229,72,77,0.26)" : "rgba(229,72,77,0.08)", stroke: "#e5484d", "stroke-width": 2 }, g); });
    txt(g, "cylindre chauffé", [680, 222], { taille: 16, couleur: chaud ? "#c03a3e" : C.doux });
    // matière dosée devant la vis
    var avance = k === 3 ? 90 * r : k >= 4 ? 90 : 0, recul = dose && k < 3 ? 0 : 0;
    var dosage = dose ? 90 - avance : 0;
    if (dosage > 0) R.el("rect", { x: 474, y: 116, width: dosage, height: 64, fill: T(0.75) }, g);
    var xv = 474 + (dose ? 90 : 0) - avance + recul;
    R.el("rect", { x: xv, y: 138, width: 846 - xv, height: 20, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
    for (var x = xv + 14; x < 836; x += 28) R.ligne(g, [x, 180], [x + 16, 116], { couleur: C.fonce, epaisseur: 4 });
    R.el("rect", { x: 850, y: 104, width: 70, height: 88, rx: 10, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
    txt(g, "vis-piston", [885, 222], { taille: 16, couleur: C.doux });
    if (k === 2) R.fleche(g, [520, 74], [600, 74], { couleur: "#3b5bdb", epaisseur: 4 });
    if (k === 3) R.fleche(g, [600, 74], [520, 74], { couleur: "#3b5bdb", epaisseur: 4 });
    if (k === 2 || k === 3) txt(g, k === 2 ? "la vis tourne et recule" : "la vis pousse (pression P)", [560, 50], { taille: 15, couleur: "#3b5bdb" });
    // buse
    R.el("path", { d: "M470 132 L" + (X0 - 6) + " 132 L" + (X0 - 6) + " 240 L" + (X0 + 6) + " 240 L" + (X0 + 6) + " 164 L470 164 Z", fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
    txt(g, "buse", [440, 116], { taille: 16, couleur: C.doux });
    // moule
    var ouvert = k === 5 ? 70 : 0;
    R.el("rect", { x: 140, y: 240, width: 560, height: 110, rx: 6, fill: "#dfe3ec", stroke: C.fonce, "stroke-width": 3 }, g);
    R.el("rect", { x: 140, y: 350 + ouvert, width: 560, height: 100, rx: 6, fill: "#cfd5e1", stroke: C.fonce, "stroke-width": 3 }, g);
    var pr = function (a, b) { return Math.max(0, Math.min(1, (r - a) / (b - a))); };
    var fCar = pr(0, 0.2), fCan = pr(0.2, 0.45), fEmp = pr(0.5, 1);
    var mat = k >= 4 ? T(0.95) : T(0.75);
    var dy = k === 5 ? 40 : 0; // pièces et carotte sortent avec l'ouverture
    var vide = k === 5 ? "none" : "#fff", trait = k === 5 ? "none" : C.fonce;
    R.el("rect", { x: X0 - 10, y: 240, width: 20, height: 110, fill: vide, stroke: trait, "stroke-width": 2 }, g);
    if (fCar > 0) R.el("rect", { x: X0 - 9, y: 241 + dy, width: 18, height: 108 * fCar, fill: mat }, g);
    [-1, 1].forEach(function (s) {
      R.el("rect", { x: s < 0 ? 270 : X0, y: 340, width: 150, height: 20, fill: vide, stroke: trait, "stroke-width": 2 }, g);
      if (fCan > 0) R.el("rect", { x: s < 0 ? X0 - 150 * fCan : X0, y: 341 + dy, width: 150 * fCan, height: 18, fill: mat }, g);
    });
    [210, 630].forEach(function (cx) {
      var d = "M" + (cx - 58) + " 326 L" + (cx + 58) + " 326 L" + (cx + 50) + " 384 L" + (cx - 50) + " 384 Z";
      R.el("path", { d: d, fill: vide, stroke: trait, "stroke-width": 2.5 }, g);
      if (fEmp > 0) {
        R.el("clipPath", { id: "cl" + cx }, g).appendChild(R.el("rect", { x: cx - 60, y: 384 - 58 * fEmp, width: 120, height: 58 * fEmp }));
        R.el("path", { d: d, fill: mat, stroke: k === 5 ? C.fonce : "none", "stroke-width": 2, "clip-path": "url(#cl" + cx + ")", transform: "translate(0," + dy + ")" }, g);
      }
      var sx = cx < X0 ? 266 : 574;
      R.el("rect", { x: sx - 6, y: 344 + dy, width: 12, height: 12, fill: fCan >= 1 ? mat : vide, stroke: trait, "stroke-width": 1.5 }, g);
      var de = k === 5 ? -30 : 0;
      [cx - 34, cx + 22].forEach(function (ex) { R.el("rect", { x: ex, y: 390 + ouvert + de, width: 12, height: 120 - ouvert - de, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2 }, g); });
    });
    if (k < 5) {
      txt(g, "carotte", [X0 + 18, 290], { taille: 16, couleur: C.doux, ancre: "start" });
      txt(g, "canaux", [345, 378], { taille: 16, couleur: C.doux });
      txt(g, "seuil", [266, 306], { taille: 16, couleur: C.doux });
      txt(g, "empreinte", [190, 306], { taille: 16, couleur: C.doux, ancre: "end" });
    }
    txt(g, "éjecteurs", [790, 470], { taille: 16, couleur: C.doux });
    txt(g, "moule", [100, 270], { taille: 16, couleur: C.doux, ancre: "end" });
    if (k === 4) txt(g, "refroidissement", [420, 420], { taille: 17, couleur: "#3b5bdb" });
    if (k === 5) ["pièces", "éjectées avec", "carotte et", "canaux"].forEach(function (l, i) { txt(g, l, [132, 372 + i * 20], { taille: 15, couleur: C.acc, ancre: "end" }); });
    var rempli = Math.round(100 * fEmp);
    f.direct.innerHTML = "Étape " + k + " : " + noms[k] + "." + (k === 3 ? " Remplissage des empreintes : <strong>" + rempli + " %</strong>" + (rempli < 100 ? " (pièce incomplète si on s'arrête là)." : ".") : "");
  }
  et.aller(0);
})();
