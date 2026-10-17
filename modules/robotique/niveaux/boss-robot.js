/* Boss du chapitre 1 : remplir la fiche d'identité d'un robot (architecture, DDL, q, charge, cadence). */
NIVEAU({
  id: "boss-robot",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [330, 450], ech: 175, az: 30, el: 26 });
    var n = { t: 0, fiche: {} };
    var b = fig.bande("");
    n.dessin = function () {
      E.vider(g);
      var t = n.t, q1 = 25 + 30 * Math.sin(t * 0.7), q2 = 40 * Math.sin(t), q3 = 60 * Math.sin(t * 1.3), d4 = 0.25 + 0.2 * Math.sin(t * 0.9);
      var l = sc.nouvelle();
      sc.sol(l, 2.2);
      sc.cylindre(l, [0, 0, 0], 0.22, 1.1, "#9aa0ad");
      var a1 = q1 * D.DEG, a2 = (q1 + q2) * D.DEG, a3 = (q1 + q2 + q3) * D.DEG;
      var O1 = [0, 0, 1.15], O2 = [0.9 * Math.cos(a1), 0.9 * Math.sin(a1), 1.15], O3 = [O2[0] + 0.7 * Math.cos(a2), O2[1] + 0.7 * Math.sin(a2), 1.15];
      sc.segment(l, O1, O2, "#ff8a5c", 18); sc.segment(l, O2, O3, "#8b3fd9", 15);
      var bas = [O3[0], O3[1], 1.0 - d4 * 1.6];
      sc.segment(l, [O3[0], O3[1], 1.4], bas, "#5b6172", 7);
      sc.segment(l, [bas[0] - 0.14 * Math.cos(a3), bas[1] - 0.14 * Math.sin(a3), bas[2]], [bas[0] + 0.14 * Math.cos(a3), bas[1] + 0.14 * Math.sin(a3), bas[2]], C.jeu, 7);
      sc.point(l, O1, 9, "#fff"); sc.point(l, O2, 9, "#fff");
      sc.dessiner(g, l);
      var f = n.fiche, champ = function (k, v) { return "\\text{" + k + "} : " + (v || "\\,?\\,"); };
      E.k(b, champ("architecture", f.archi) + " \\quad " + champ("DDL", f.ddl) + " \\quad " + champ("q", f.q) + " \\quad " + champ("charge", f.charge) + " \\quad " + champ("cadence", f.cadence));
    };
    setInterval(function () { n.t += 0.04; n.dessin(); }, 50);
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Architecture", jouer: function (j, n) {
      j.fig.astuce("Un robot d'un laboratoire d'analyses, qui range des tubes. Tourne la vue.");
      j.titre("Remplis la fiche d'identité de ce robot. D'abord : quelle architecture ?");
      j.consigne("Boss : chaque erreur compte.");
      j.choix([{ html: "Cartésien", aide: "Un cartésien ne fait que des translations ; ici les deux bras tournent." }, { html: "SCARA", juste: true }, { html: "Delta", aide: "Un Delta a plusieurs bras fermés sur une nacelle ; ici une seule chaîne." }], { ok: function () {
        n.fiche.archi = "\\text{SCARA}"; n.dessin();
        j.bravo("SCARA : deux rotations horizontales et un axe vertical.");
        j.suite();
      } });
    } },
    { nom: "DDL", jouer: function (j, n) {
      j.fig.astuce("Compte les mouvements indépendants : les deux bras, la rotation de l'outil, la montée et la descente.");
      j.titre("Combien de degrés de liberté articulaires ?");
      j.nombre({ avant: "\\text{DDL} =", cases: [{ attendu: 4, tol: 0 }], ligne: true, aide: function () { return "Deux pivots pour les bras, un pivot pour l'outil, une glissière verticale."; },
        ok: function () { n.fiche.ddl = "4"; n.dessin(); j.bravo("4 DDL."); j.suite(); } });
    } },
    { nom: "Configuration", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Écris sa configuration articulaire \\(q\\) : trois pivots puis une glissière.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:4px;font-size:21px;flex-wrap:nowrap">\\(q = [\\)' + ["1", "2", "3", "4"].map(function (c, k) { return (k ? "," : "") + '<span class="trou" data-attendu="' + c + '" style="min-width:56px"></span>'; }).join("") + "\\(]^T\\)</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "4", tex: "d_4" }, { id: "2", tex: "\\theta_2" }, { id: "x", tex: "\\theta_4" }, { id: "1", tex: "\\theta_1" }, { id: "y", tex: "d_1" }, { id: "3", tex: "\\theta_3" }],
        aide: "Pivot : un angle \\(\\theta_i\\). Glissière : une distance \\(d_i\\). L'indice suit l'ordre depuis la base.",
        ok: function () { n.fiche.q = "[\\theta_1, \\theta_2, \\theta_3, d_4]^T"; n.dessin(); j.bravo("R-R-R-P."); j.suite(); }
      });
    } },
    { nom: "Charge", jouer: function (j, n) {
      j.titre("Il porte une pince de 0,8 kg, un portoir de 1,5 kg et un adaptateur de 0,2 kg. Sa charge utile est de 3 kg. Masse portée ?");
      j.nombre({ avant: "m =", apres: "\\text{kg}", cases: [{ attendu: 2.5, tol: 0.001 }], ligne: true, aide: function () { return "Effecteur + pièce + accessoires."; },
        ok: function () {
          j.consigne("Le robot convient-il ?");
          j.choix([{ html: "Oui", juste: true }, { html: "Non", aide: "Compare 2,5 kg à la charge utile de 3 kg." }], { colonnes: 2, ok: function () {
            n.fiche.charge = "2{,}5 \\le 3\\ \\text{kg}"; n.dessin();
            j.bravo("2,5 kg ≤ 3 kg : il convient.");
            j.suite();
          } });
        } });
    } },
    { nom: "Cadence", jouer: function (j, n) {
      j.titre("Un cycle : approche 0,4 s, prise 0,3 s, transfert 0,5 s, dépose 0,3 s. Temps de cycle et cadence ?");
      j.nombre({ avant: "T_{cycle},\\ N :", cases: [{ attendu: 1.5, tol: 0.001 }, { attendu: 2400, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Additionne les quatre durées." : "\\(N = 3600 / T_{cycle}\\)."; },
        ok: function () {
          n.fiche.cadence = "2400\\ \\text{cycles/h}"; n.dessin();
          j.bravo("1,5 s par cycle, 2400 cycles/h. La fiche est complète.");
          j.suite();
        } });
    } }
  ]
});
