/* Figure : un export avec cinq anomalies ; chaque dimension de la qualité éclaire la sienne. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-qualite", {
    largeur: 960, hauteur: 520, titre: "Les six dimensions de la qualité des données",
    essai: "<strong>Essaie</strong> : touche une dimension. <strong>Observe</strong> : la case en défaut s'allume dans l'export (exemple ajouté)."
  });
  var g = A.s("g", null, f.svg), ch = -1;
  var L = [["ID", "Sexe", "Âge", "Glycémie", "Entrée"], ["P01", "F", "34", "1,02", "12/03/2026"], ["P02", "Masculin", "51", "0,95", "13/03/2026"], ["P03", "M", "250", "1,10", "13/03/2026"], ["P04", "F", "47", "", "14/03/2026"], ["P05", "M", "62", "1,30", "date inconnue"], ["P01", "F", "34", "1,02", "12/03/2026"]];
  var D = [
    { t: "Complétude", q: "les valeurs sont-elles présentes ?", c: [[4, 3]], d: "la glycémie de P04 manque." },
    { t: "Exactitude", q: "sont-elles réalistes ?", c: [[3, 2]], d: "un âge de 250 ans est impossible." },
    { t: "Cohérence", q: "même codage partout ?", c: [[2, 1]], d: "« Masculin » au milieu des « M » et « F »." },
    { t: "Unicité", q: "des doublons ?", c: [[1, 0], [6, 0]], d: "P01 apparaît deux fois." },
    { t: "Validité", q: "le format est-il respecté ?", c: [[5, 4]], d: "« date inconnue » n'est pas une date." },
    { t: "Actualité", q: "les données sont-elles à jour ?", c: [], d: "rien dans ce tableau ne dit quand chaque ligne a été mise à jour : il faut la date de dernière mise à jour et la traçabilité des modifications." }
  ];
  function dessiner() {
    A.vider(g);
    var on = ch >= 0 ? D[ch].c : [];
    A.tableau(g, 20, 40, [70, 110, 70, 100, 150], 60, L, { taille: 17, tailleTete: 15, style: function (i, k) { return on.some(function (q) { return q[0] === i && q[1] === k; }) ? { fond: C.koPale, bord: C.ko, ep: 4, gras: 800 } : null; } });
    D.forEach(function (d, k) {
      var x = 540 + (k % 2) * 205, y = 40 + Math.floor(k / 2) * 150, st = A.BACS[k % 5], act = k === ch;
      A.boite(g, x, y, 198, 135, { titre: d.t, sous: d.q, taille: 19, fond: act ? st.pale : "#fff", bord: act ? st.coul : C.encre, ep: act ? 4.5 : 2.5, coul: act ? st.coul : C.encre });
      A.cible(g, x, y, 198, 135, function () { ch = k; dessiner(); });
    });
    f.direct.innerHTML = ch >= 0 ? "<strong>" + D[ch].t + "</strong> : " + D[ch].d : "Touche une dimension.";
  }
  dessiner();
})();
