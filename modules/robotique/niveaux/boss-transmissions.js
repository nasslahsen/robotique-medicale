/* Boss du chapitre 8 : le réducteur à deux étages d'une articulation de robot chirurgical, du moteur à l'instrument. */
NIVEAU({
  id: "boss-transmissions",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { val: {}, alerte: false };
    var Z = { 1: 14, 2: 56, 3: 15, 4: 45 }, k = 3.1; // schéma : diamètre en px par dent
    n.dessin = function () {
      E.vider(g);
      // schéma cinématique : arbres horizontaux, roues en traits verticaux (longueur = diamètre)
      var yA = 130, yB = yA + k * (Z[1] + Z[2]) / 2, yC = yB + k * (Z[3] + Z[4]) / 2, xr1 = 230, xr3 = 400;
      E.s("rect", { x: 40, y: yA - 40, width: 120, height: 80, rx: 12, fill: "#5b6172", stroke: C.encre, "stroke-width": 2 }, g);
      D.texte(g, "moteur", [100, yA], { coul: "#fff", fondCoul: "#5b6172", taille: 17 });
      function arbre(x0, x1, y, coul) { D.ligne(g, [x0, y], [x1, y], coul || C.encre, 5); }
      function roueS(x, y, z, coul, nom, haut) {
        var r = k * z / 2;
        D.ligne(g, [x, y - r], [x, y + r], coul, 7);
        D.ligne(g, [x - 10, y - r], [x + 10, y - r], coul, 4); D.ligne(g, [x - 10, y + r], [x + 10, y + r], coul, 4);
        D.texte(g, nom + " (Z = " + z + ")", [x + 16, haut ? y - r + 4 : y + r - 4], { taille: 15, mono: true, ancre: "start", coul: coul });
      }
      arbre(160, xr1 + 30, yA);
      arbre(xr1 - 30, xr3 + 30, yB);
      arbre(xr3 - 30, 640, yC, C.jeu);
      roueS(xr1, yA, Z[1], "#3b5bdb", "1", true);
      roueS(xr1, yB, Z[2], "#3b5bdb", "2", false);
      roueS(xr3, yB, Z[3], "#12a26b", "3", true);
      roueS(xr3, yC, Z[4], "#12a26b", "4", false);
      if (n.alerte) E.s("rect", { x: xr1 - 40, y: yA - 30, width: 80, height: yB - yA + 100, rx: 14, fill: "none", stroke: C.ko, "stroke-width": 4, "stroke-dasharray": "8 6" }, g);
      D.texte(g, "vers l'instrument", [640, yC + 28], { taille: 16, coul: C.jeu, ancre: "end" });
      // valeurs trouvées, sur chaque arbre
      var v = n.val, lig = [];
      lig.push(["arbre moteur", "6000 tr/min", v.Cm ? E.fmt(v.Cm, 4) + " N·m" : "C = ?", "60 W"]);
      lig.push(["arbre de sortie", v.ns ? v.ns + " tr/min" : "n = ?", v.Cs ? E.fmt(v.Cs, 3) + " N·m" : "C = ?", v.Ps ? E.fmt(v.Ps, 1) + " W" : "P = ?"]);
      E.s("rect", { x: 40, y: 440, width: 600, height: 120, rx: 14, fill: "#fafbfd", stroke: C.pale, "stroke-width": 2 }, g);
      lig.forEach(function (l, i) {
        var y = 478 + i * 46;
        D.texte(g, l[0], [60, y], { taille: 16, ancre: "start", coul: C.doux, gras: false });
        [l[1], l[2], l[3]].forEach(function (t, c) { D.texte(g, t, [300 + c * 120, y], { taille: 17, mono: true, coul: t.indexOf("?") >= 0 ? "#9aa0ad" : C.encre }); });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Couple moteur", jouer: function (j, n) {
      j.fig.astuce("Réducteur à deux étages d'une articulation de robot chirurgical (exemple ajouté).");
      j.titre("Le moteur fournit 60 W à 6000 tr/min. Couple moteur ?");
      j.nombre({ avant: "C_m =", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 0.0955, tol: 0.0005 }], ligne: true,
        aide: function () { return "Regarde la relation entre puissance, couple et vitesse en tr/min."; },
        ok: function () { n.val.Cm = 0.09549; n.dessin(); j.bravo("0,0955 N·m."); j.suite(); } });
    } },
    { nom: "Vitesse de sortie", jouer: function (j, n) {
      j.titre("À quelle vitesse tourne l'arbre de sortie ?");
      j.nombre({ avant: "n_s =", apres: "\\text{tr/min}", cases: [{ attendu: 500, tol: 0.5 }], ligne: true,
        aide: function () { return "Lis les nombres de dents sur le schéma : deux étages, menantes 1 et 3, menées 2 et 4."; },
        ok: function () {
          n.val.ns = 500; n.dessin();
          j.bravo("\\(R_{4/1} = \\dfrac{14 \\times 15}{56 \\times 45} = \\dfrac{1}{12}\\) : 500 tr/min.");
          j.suite();
        } });
    } },
    { nom: "Couple de sortie", jouer: function (j, n) {
      j.titre("Rendement de 0,95 par étage. Rendement global et couple sur l'arbre de sortie ?");
      j.nombre({ avant: "\\eta_{tot},\\ C_s :", cases: [{ attendu: 0.9025, tol: 0.0006 }, { attendu: 1.034, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "Pense à ce que deviennent les rendements quand les étages s'enchaînent." : "Formule (4.7) : quel rapport attend-elle, \\(n_s/n_e\\) ou \\(n_e/n_s\\) ?"; },
        ok: function () {
          n.val.Cs = 1.0342; n.dessin();
          j.bravo("\\(C_s \\simeq 0{,}0955 \\times 12 \\times 0{,}9025 \\approx 1{,}03\\) N·m.");
          j.suite();
        } });
    } },
    { nom: "Puissance de sortie", jouer: function (j, n) {
      j.titre("Quelle puissance arrive à l'instrument ?");
      j.nombre({ avant: "P_s =", apres: "\\text{W}", cases: [{ attendu: 54.15, tol: 0.15 }], ligne: true,
        aide: function () { return "Deux chemins : \\(C_s\\,\\omega_s\\), ou la puissance du moteur et le rendement global."; },
        ok: function () {
          n.val.Ps = 54.15; n.dessin();
          j.bravo("54,15 W : \\(\\eta_{tot} \\times 60\\) W. Le reste chauffe le réducteur.");
          j.expliquer("<p>Le réducteur échange de la vitesse contre du couple ; la puissance, elle, ne fait que diminuer avec les pertes.</p>");
          j.suite();
        } });
    } },
    { nom: "Arbre de sortie", jouer: function (j, n) {
      j.fig.astuce("Exemple ajouté : R_pg = 30 N/mm² est une valeur supposée.");
      j.titre("Arbre de sortie plein, \\(R_{pg} = 30\\) N/mm². Diamètre minimal ?");
      j.nombre({ avant: "d >", apres: "\\text{mm}", cases: [{ attendu: 5.6, tol: 0.03 }], ligne: true,
        aide: function () { return "Attention aux unités de \\(M_t\\) dans la condition de résistance en torsion."; },
        ok: function () { j.bravo("5,60 mm : \\(M_t = 1034\\) N·mm."); j.suite(); } });
    } },
    { nom: "Le défaut caché", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un des deux étages ne respecte pas le nombre minimal de dents du cours. Lequel ?");
      j.choix([
        { html: "Le premier : un pignon de 14 dents n'engrène qu'avec 13 à 26 dents, pas 56", juste: true },
        { html: "Le second : un pignon de 15 dents ne peut pas mener 45 dents", aide: "Relis la colonne \\(Z_A = 15\\) du tableau : 13 à 45." },
        { html: "Aucun : les deux pignons ont plus de 13 dents", aide: "13 dents est le minimum absolu ; le tableau limite aussi la roue en face." }
      ], { colonnes: 1, ok: function () {
        n.alerte = true; n.dessin();
        j.bravo("Il y aurait interférence au premier étage.");
        j.expliquer("<p>Avec \\(Z_A = 16\\), la roue peut aller de 13 à 101 dents : un premier étage 16/64 garde le rapport 1/4 sans interférence.</p>");
        j.suite();
      } });
    } }
  ]
});
