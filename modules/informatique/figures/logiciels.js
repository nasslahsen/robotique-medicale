/* Figure : progiciel ou spécifique, selon l'enjeu et la taille du sujet. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-matrice", {
    largeur: 960, hauteur: 520, titre: "Progiciel ou spécifique",
    essai: "<strong>Essaie</strong> : touche chaque case. <strong>Observe</strong> : plus le sujet est normé, plus le progiciel s'impose ; plus il est stratégique, plus on développe ou on s'associe."
  });
  var X = [200, 453, 706, 940], Y = [140, 260, 380, 500];
  var LIG = ["Stratégique", "Normé", "Autre"], COL = [["Sujet énorme", "plusieurs années de budget DSI"], ["Gros sujet", "un an de budget DSI"], ["Petit sujet", "moins de 20 % du budget annuel DSI"]];
  var REG = [[0, 1, 1], [2, 2, 3], [2, 3, 3]];
  var Z = [
    { t: "Investissement stratégique ou partenariat avec un éditeur de progiciel", fond: C.encre, coul: "#fff", d: "un sujet stratégique et énorme : trop gros pour tout développer seul, trop important pour un simple achat." },
    { t: "Développement spécifique", fond: C.accPale, coul: C.acc, d: "ce qui fait la différence de l'établissement n'existe pas sur étagère : on le développe." },
    { t: "Progiciel", fond: C.vPale, coul: C.v, d: "dans un domaine normé (mêmes règles pour tous), un progiciel du marché les applique déjà." },
    { t: "Progiciel économique ou développement spécifique", fond: C.turqPale, coul: C.turq, d: "petit sujet sans enjeu particulier : la solution la moins coûteuse." }
  ];
  var g = A.s("g", null, f.svg), ch = null;
  function dessiner() {
    A.vider(g);
    COL.forEach(function (c, k) { A.boite(g, X[k] + 4, 30, X[k + 1] - X[k] - 8, 100, { titre: c[0], sous: c[1], taille: 18, ep: 0 }); });
    LIG.forEach(function (l, i) { A.texte(g, l, [100, (Y[i] + Y[i + 1]) / 2], { taille: 19, gras: 700, halo: false }); });
    REG.forEach(function (ligne, i) { ligne.forEach(function (r, k) {
      var z = Z[r], on = ch && ch[0] === i && ch[1] === k;
      A.s("rect", { x: X[k], y: Y[i], width: X[k + 1] - X[k], height: Y[i + 1] - Y[i], fill: z.fond, stroke: on ? C.jeu : "#fff", "stroke-width": on ? 7 : 3 }, g);
      A.texte(g, z.t, [(X[k] + X[k + 1]) / 2, (Y[i] + Y[i + 1]) / 2], { taille: r === 0 ? 15 : 17, gras: 700, coul: z.coul, halo: false, largeur: X[k + 1] - X[k] - 20 });
      A.cible(g, X[k], Y[i], X[k + 1] - X[k], Y[i + 1] - Y[i], function () { ch = [i, k]; dessiner(); });
    }); });
    f.direct.innerHTML = ch ? "<strong>" + LIG[ch[0]] + ", " + COL[ch[1]][0].toLowerCase() + "</strong> : " + Z[REG[ch[0]][ch[1]]].t.toLowerCase() + ". " + Z[REG[ch[0]][ch[1]]].d : "Touche une case du tableau.";
  }
  dessiner();
})();
