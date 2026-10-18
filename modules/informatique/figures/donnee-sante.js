/* Figure : le triangle confidentialité, intégrité, disponibilité autour de l'information personnelle de santé. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-triangle", {
    largeur: 960, hauteur: 520, titre: "Critères de qualité de l'information personnelle de santé",
    essai: "<strong>Essaie</strong> : touche chaque côté. <strong>Observe</strong> : chaque critère attaqué mène à une conséquence différente pour la décision médicale."
  });
  var g = A.s("g", null, f.svg), ch = -1;
  var S = [[480, 40], [760, 430], [200, 430]];
  var K = [
    { t: "Confidentialité", a: 2, b: 0, coul: C.ok, d: "seules les personnes autorisées voient l'information. Atteinte : un agent curieux ouvre le dossier d'une célébrité." },
    { t: "Intégrité", a: 0, b: 1, coul: C.turq, d: "l'information est juste et complète. Atteinte : un potassium 3,5 devient 5,3 par erreur de saisie. C'est la plus dangereuse pour la décision médicale." },
    { t: "Disponibilité", a: 1, b: 2, coul: C.ko, d: "l'information est accessible quand il faut. Atteinte : le DPI est inaccessible pendant deux heures." }
  ];
  function dessiner() {
    A.vider(g);
    K.forEach(function (k, i) {
      var a = S[k.a], b = S[k.b], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], on = i === ch;
      A.s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: k.coul, "stroke-width": on ? 40 : 28, "stroke-linecap": "round", opacity: on ? 1 : 0.75 }, g);
      var off = i === 2 ? [0, 44] : i === 0 ? [-100, 0] : [100, 0];
      A.texte(g, k.t, [m[0] + off[0], m[1] + off[1]], { taille: 22, gras: 800, coul: k.coul });
      var z = i === 2 ? { x: 200, y: 400, w: 560, h: 110 } : { x: Math.min(a[0], b[0]) + 20, y: Math.min(a[1], b[1]) + 60, w: Math.abs(a[0] - b[0]) - 40, h: Math.abs(a[1] - b[1]) - 120 };
      A.cible(g, z.x, z.y, z.w, z.h, function () { ch = i; dessiner(); });
    });
    A.texte(g, "Information personnelle de santé", [480, 300], { taille: 19, gras: 800, largeur: 220 });
    A.texte(g, "+ maintenabilité, évolutivité, traçabilité...", [480, 370], { taille: 15, coul: C.doux });
    f.direct.innerHTML = ch >= 0 ? "<strong>" + K[ch].t + "</strong> : " + K[ch].d : "Touche un côté du triangle. L'information personnelle de santé impacte la décision médicale.";
  }
  dessiner();
})();
