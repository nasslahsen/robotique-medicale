/* Niveau : DDL d'un solide et liaisons normalisées. Activer les mouvements permis, compter les DDL restants. */
NIVEAU({
  id: "liaisons",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [340, 360], ech: 125, az: 35, el: 24 });
    var I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    var n = { permis: [0, 0, 0, 0, 0, 0], t: 0, axeVis: true };
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle(), t = n.t, p = n.permis;
      var s = Math.sin(t), amp = 0.35, ang = 25;
      var T = [p[0] * amp * s, p[1] * amp * s, p[2] * amp * Math.abs(s)];
      var R = E.mm(E.mm(E.Rz(p[5] * ang * s * D.DEG), E.Ry(p[4] * ang * s * D.DEG)), E.Rx(p[3] * ang * s * D.DEG));
      if (n.helice) { T = [0.25 * s, 0, 0]; R = E.Rx(70 * s * D.DEG); }
      sc.pave(l, I, [0, 0, -0.15], [0, 0, 0], [1.3, 0.9, 0.12], "#d6dbe7");
      if (n.axeVis) sc.segment(l, [-1.8, 0, 0.32], [1.8, 0, 0.32], C.jeu, 2.5, "8 6");
      sc.pave(l, R, [T[0], T[1], 0.32 + T[2]], [0, 0, 0], [0.45, 0.3, 0.2], "#b39ddb");
      sc.repere(l, [T[0], T[1], 0.32 + T[2]], R, 0.8, ["x", "y", "z"], { ep: 3.5 });
      sc.dessiner(g, l);
      D.texte(g, "A (fixe)", [480, 470], { coul: C.doux, taille: 17 });
      var b = fig.bande(""); E.k(b, "\\text{DDL restants} = 6 - \\text{contraintes} = " + p.reduce(function (a, x) { return a + x; }, 0) + (n.helice ? "" : ""));
    };
    var anim = setInterval(function () { n.t += 0.05; n.dessin(); }, 50);
    n.sc = sc;
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: (function () {
    var NOMS = ["T_x", "T_y", "T_z", "R_x", "R_y", "R_z"];
    function defi(nom, attendu, titre, consigne, aideFn, expl) {
      return { nom: nom, jouer: function (j, n) {
        n.permis = [0, 0, 0, 0, 0, 0]; n.helice = false; n.dessin();
        j.fig.astuce("Le solide B bouge selon les mouvements que tu actives. Pointillés : l'axe x de la liaison.");
        j.titre(titre); j.consigne(consigne);
        var z = j.zone("", ""); z.style.cssText = "display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:6px 0 12px";
        var bts = NOMS.map(function (t, k) {
          var b = E.h("button", "", "", z); b.type = "button"; E.k(b, t);
          b.style.cssText = "height:58px;border:2px solid #e3e6ee;border-radius:14px;background:#fff;font-size:18px;cursor:pointer";
          b.addEventListener("click", function () { n.permis[k] = 1 - n.permis[k]; b.style.background = n.permis[k] ? "#e3f7ee" : "#fff"; b.style.borderColor = n.permis[k] ? "#12a26b" : "#e3e6ee"; n.dessin(); });
          return b;
        });
        var v = E.h("button", "btn bleu", "Vérifier", j.el); v.type = "button";
        v.addEventListener("click", function () {
          var bon = attendu.every(function (x, k) { return x === n.permis[k]; });
          if (!bon) { j.erreur(aideFn(n.permis)); return; }
          v.remove(); bts.forEach(function (b) { b.disabled = true; });
          j.bravo(nom + " : " + attendu.reduce(function (a, x) { return a + x; }, 0) + " mouvement(s) permis.");
          if (expl) j.expliquer(expl);
          j.suite();
        });
      } };
    }
    return [
      defi("Pivot", [0, 0, 0, 1, 0, 0], "Liaison pivot d'axe x entre A et B : active seulement les mouvements permis.", "\\(T\\) : translation, \\(R\\) : rotation, selon chaque axe.",
        function (p) { return p[3] ? "Une pivot autorise seulement la rotation autour de son axe : tout le reste est bloqué." : "Une pivot laisse tourner B autour de l'axe x."; },
        "<p>Un solide libre a 6 DDL : 3 translations \\((T_x, T_y, T_z)\\) et 3 rotations \\((R_x, R_y, R_z)\\) (roulis, tangage, lacet). Une liaison supprime des DDL :</p>\\[ \\text{DDL relatifs restants} = 6 - \\text{nombre de contraintes indépendantes} \\]<p>La pivot impose 5 contraintes : il reste \\(6 - 5 = 1\\).</p>"),
      defi("Glissière", [1, 0, 0, 0, 0, 0], "Liaison glissière d'axe x : active les mouvements permis.", "",
        function () { return "Une glissière laisse seulement B coulisser le long de son axe."; }, null),
      defi("Rotule", [0, 0, 0, 1, 1, 1], "Liaison rotule (comme une épaule) : active les mouvements permis.", "",
        function (p) { return p[0] || p[1] || p[2] ? "Une rotule ne laisse aucune translation : le centre reste fixe." : "Une rotule laisse tourner B dans toutes les directions."; }, null),
      { nom: "Compter", jouer: function (j, n) {
        n.permis = [1, 0, 0, 1, 0, 0]; n.dessin();
        j.fig.astuce("Liaison pivot glissant : B tourne et coulisse autour du même axe.");
        j.titre("Liaison pivot glissant d'axe x : combien de DDL relatifs restent ?");
        j.nombre({ avant: "6 - \\text{contraintes} =", cases: [{ attendu: 2, tol: 0 }], ligne: true, aide: function () { return "Regarde B bouger : une translation et une rotation, autour du même axe."; },
          ok: function () {
            j.bravo("2 : \\(T_x\\) et \\(R_x\\) (4 contraintes).");
            j.expliquer("<p>Environ 95 % des manipulateurs n'utilisent que deux liaisons à 1 DDL : la <b>pivot</b> (\\(q = \\theta\\)) et la <b>glissière</b> (\\(q = d\\)). Une commande simple (un actionneur, un paramètre) et une bonne rigidité. Les autres liaisons (rotule, ponctuelle) servent aux contacts, aux appuis, ou comme articulations passives des robots parallèles.</p>");
            j.suite();
          } });
      } }
    ];
  })()
});
