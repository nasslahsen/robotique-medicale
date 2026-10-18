/* Figure : les modules du SIH, isolés ou en interaction. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-modules", {
    largeur: 960, hauteur: 500, titre: "Des modules en interaction",
    essai: "<strong>Essaie</strong> : active l'interaction, puis touche un module. <strong>Observe</strong> : sans liens, chaque module garde son information pour lui."
  });
  var lie = false, ch = -1, g = A.s("g", null, f.svg);
  var M = [
    { t: "Admission et facturation", x: 40, y: 50, d: "identité, séjour, mouvements, facturation." },
    { t: "Imagerie", x: 370, y: 50, d: "demandes, examens, comptes rendus, images." },
    { t: "Bloc opératoire", x: 700, y: 50, d: "programmation et déroulement des interventions." },
    { t: "DPI", x: 40, y: 320, d: "le dossier patient : il rassemble ce que produisent les autres modules." },
    { t: "Laboratoires", x: 370, y: 320, d: "demandes et résultats d'analyses." },
    { t: "Pharmacie", x: 700, y: 320, d: "prescriptions, dispensation, stocks." }
  ];
  function dessiner() {
    A.vider(g);
    if (lie) M.forEach(function (a, i) { M.forEach(function (b, k) { if (k > i) A.s("line", { x1: a.x + 110, y1: a.y + 65, x2: b.x + 110, y2: b.y + 65, stroke: C.jeu, "stroke-width": 3, opacity: 0.6 }, g); }); });
    M.forEach(function (m, i) {
      A.boite(g, m.x, m.y, 220, 130, { titre: m.t, taille: 21, fond: i === ch ? C.jeuPale : "#fff", bord: i === ch ? C.jeu : C.encre, ep: i === ch ? 4 : 2.5 });
      A.cible(g, m.x, m.y, 220, 130, function () { ch = i; dessiner(); });
    });
    var t = ch >= 0 ? "<strong>" + M[ch].t + "</strong> : " + M[ch].d + " " : "";
    f.direct.innerHTML = t + (lie ? "Les modules échangent : l'information est rassemblée, traitée et fournie là où il faut. C'est un SIH." : "Aucun échange : chaque module est une île. Ce n'est pas encore un SIH au sens du cours.");
  }
  var b = R.boutons(f.reglages), bt = R.bouton(b, "Activer l'interaction", function () { lie = !lie; bt.textContent = lie ? "Couper l'interaction" : "Activer l'interaction"; bt.classList.toggle("actif", lie); dessiner(); });
  dessiner();
})();
