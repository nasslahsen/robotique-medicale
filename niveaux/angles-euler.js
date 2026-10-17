/* Niveau : angles d'Euler ZYX du cours (téléphone), singularité, formule, convention XYZ. */
NIVEAU({
  id: "angles-euler",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [330, 350], ech: 125, az: 32, el: 24 });
    var I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    var n = { base: I, f: E.Rz, ang: 0, noms: ["x", "y", "z"], idx: "", cadran: null, bande: null };
    n.R = function () { return E.mm(n.base, n.f(n.ang * D.DEG)); };
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle(), R = n.R();
      sc.sol(l, 2.4);
      sc.repere(l, [0, 0, 0], I, 1.9, ["x₀", "y₀", "z₀"], { pale: true, ep: 2.5 });
      // téléphone : long selon x, large selon y, écran sur la face +z
      sc.pave(l, R, [0, 0, 0], [0, 0, 0], [0.75, 0.38, 0.05], "#d9dde6");
      sc.pave(l, R, [0, 0, 0], [0.02, 0, 0.052], [0.66, 0.32, 0.004], "#2b3a5c");
      sc.repere(l, [0, 0, 0], R, 1.4, n.noms.map(function (s) { return s + n.idx; }), { ep: 5 });
      sc.dessiner(g, l);
      if (n.bande) E.k(fig.bande(""), n.bande()); else fig.bande(null);
      if (n.cadran) n.cadran.dessiner();
    };
    n.animer = function (vers, ms, fin) { var de = n.ang; E.anime(ms || 800, function (e) { n.ang = de + (vers - de) * e; n.dessin(); }, function () { n.ang = vers; n.dessin(); if (fin) fin(); }); };
    n.figer = function (idx) { n.base = n.R(); n.ang = 0; n.idx = idx; };
    n.sc = sc;
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Lacet", jouer: function (j, n) {
      n.f = E.Rz; n.idx = "₁";
      n.bande = function () { return "R^{(0,1)} = R_z(\\alpha) = " + E.texMat(E.Rz(n.ang * D.DEG)); };
      j.fig.astuce("Le téléphone est à plat, écran vers le plafond. Tourne la vue avec un doigt.");
      var fini = false;
      n.cadran = D.cadran(j.fig.coin, { pas: 5, decalage: function () { var a = n.sc.az * D.DEG; return Math.atan2(-Math.cos(a), -Math.sin(a)) / D.DEG; },
        change: function (v) { n.ang = v; n.dessin(); }, relache: function (v) { if (!fini && v === -90) gagne(); } });
      j.nettoyer(function () { j.fig.coin.innerHTML = ""; n.cadran = null; });
      n.dessin();
      j.titre("Exemple du cours. Lacet : fais tourner le téléphone de 90° vers la droite, à plat.");
      j.consigne("Utilise le cadran : il est vu de dessus, comme la scène. Vers la droite, c'est le sens horaire.");
      function gagne() {
        fini = true; n.cadran.verrouiller(true);
        j.bravo("\\(\\alpha = -90°\\), autour de \\(\\vec{z}_0\\).");
        j.expliquer("<p>Sens horaire vu de dessus : l'angle est négatif. Cette première rotation donne \\(R_1\\), avec \\(\\vec{z}_1 = \\vec{z}_0\\) :</p>\\[ R_z(-90°) = \\begin{pmatrix} 0 & 1 & 0 \\\\ -1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]");
        j.suite();
      }
    } },
    { nom: "Tangage", jouer: function (j, n) {
      n.ang = -90; n.figer("₂"); n.f = E.Ry;
      n.bande = function () { return "R^{(0,2)} = R_z(-90°)\\,R_y(\\beta) = " + E.texMat(n.R()); };
      var fini = false;
      n.cadran = D.cadran(j.fig.coin, { pas: 5, reperes: false, change: function (v) { n.ang = v; n.dessin(); }, relache: function (v) { if (!fini && v === 90) gagne(); } });
      j.nettoyer(function () { j.fig.coin.innerHTML = ""; n.cadran = null; });
      n.dessin();
      j.fig.astuce("Le cadran règle β, autour du nouvel axe y₁.");
      j.titre("Tangage : relève le téléphone de \\(\\beta = +90°\\) autour du nouvel axe \\(\\vec{y}_1\\).");
      j.consigne("Les rotations se font en axes mobiles : autour de l'axe y du téléphone, pas de \\(\\vec{y}_0\\).");
      function gagne() {
        fini = true; n.cadran.verrouiller(true);
        j.bravo("Le téléphone est vertical.");
        var q = j.zone("", "<h2 style='margin-top:14px'>Où pointe maintenant \\(\\vec{x}_2\\) ?</h2><p class='consigne'>Lis la première colonne de \\(R^{(0,2)}\\) sous la figure.</p>"); j.rendre(q);
        j.choix([{ tex: "\\vec{z}_0", aide: "La première colonne vaut \\((0 \\,;\\ 0 \\,;\\ -1)\\) : attention au signe." }, { tex: "-\\vec{z}_0", juste: true }, { tex: "\\vec{y}_0", aide: "Ça, c'est \\(\\vec{x}_1\\), avant le tangage." }], { ok: function () {
          j.bravo("\\(\\vec{x}_2 = -\\vec{z}_0\\) : il pointe vers le sol.");
          j.expliquer("\\[ R^{(0,2)} = R_z(-90°)\\,R_y(90°) = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & -1 \\\\ -1 & 0 & 0 \\end{pmatrix} \\]<p>(La diapositive nomme ces deux angles \\(\\psi\\) et \\(\\theta\\) ; dans les matrices de la convention ZYX, ce sont \\(\\alpha\\) et \\(\\beta\\).)</p>");
          j.suite();
        } });
      }
    } },
    { nom: "Singularité", jouer: function (j, n) {
      n.ang = 90; n.figer("ₛ"); n.f = E.Rx;
      n.bande = function () { return "R^{(0,s)} = R_z(-90°)\\,R_y(90°)\\,R_x(\\gamma)"; };
      n.dessin();
      j.fig.astuce("Fais varier γ et regarde le téléphone tourner.");
      j.titre("Roulis : fais varier \\(\\gamma\\) autour de \\(\\vec{x}_2\\). À quel mouvement ressemble-t-il ?");
      j.curseur({ nom: "γ", min: -90, max: 90, pas: 5, val: 0, unite: "°", change: function (v) { n.ang = v; n.dessin(); } });
      j.choix([{ html: "À un lacet", juste: true }, { html: "À un tangage", aide: "Le téléphone tourne autour d'un axe vertical, pas d'un axe horizontal." }, { html: "Il ne bouge pas", aide: "Bouge le curseur γ : le téléphone tourne bien." }], { ok: function () {
        j.bravo("Le roulis tourne autour de la verticale, comme le lacet.");
        j.expliquer("<p>Comme \\(\\vec{x}_2 = -\\vec{z}_0\\), le roulis et le lacet tournent autour du même axe : ils produisent le même effet. On perd un degré de liberté dans la description : c'est la <b>singularité</b> des angles d'Euler. En ZYX, elle arrive quand l'angle du milieu vaut \\(\\beta = \\pm 90°\\).</p>");
        j.suite();
      } });
    } },
    { nom: "La formule", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Range les trois rotations dans l'ordre de la formule ZYX du cours.");
      j.consigne("Lacet α autour de Z, puis tangage β autour du nouvel Y, puis roulis γ autour du nouvel X.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:8px;font-size:21px;flex-wrap:wrap">\\(R^{(0,s)} =\\)' + [0, 1, 2].map(function (k) { return '<span class="trou" data-attendu="' + "zyx"[k] + '" style="min-width:96px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "x", tex: "R_x(\\gamma)" }, { id: "z", tex: "R_z(\\alpha)" }, { id: "y", tex: "R_y(\\beta)" }],
        aide: "Chaque nouvelle rotation est décrite dans le repère obtenu juste avant : on multiplie à droite, dans l'ordre où on tourne.",
        ok: function () {
          j.bravo("\\(R^{(0,s)} = R_z(\\alpha)\\,R_y(\\beta)\\,R_x(\\gamma)\\).");
          j.expliquer("<p>Comme une chaîne de maillons : \\(R^{(0,1)}\\,R^{(1,2)}\\,R^{(2,s)}\\). Cette convention ZYX (angles RPY) est celle de ROS, de MATLAB Robotics Toolbox, de KUKA et d'ABB.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Convention XYZ", jouer: function (j, n) {
      var I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      n.base = I; n.ang = 0; n.f = E.Rx; n.idx = "";
      var etapes = [[E.Rx, 90, "₁", "\\varphi = +90° \\text{ autour de } \\vec{x}_0"], [E.Ry, 90, "₂", "\\theta = +90° \\text{ autour de } \\vec{y}_1"], [E.Rz, -90, "₃", "\\psi = -90° \\text{ autour de } \\vec{z}_2"]], k = 0;
      n.bande = function () { return "{}^0R_3 = R_x(\\varphi)\\,R_y(\\theta)\\,R_z(\\psi)" + (k > 0 ? "\\qquad \\text{fait : } " + etapes[k - 1][3] : ""); };
      n.dessin();
      j.fig.astuce("Avance rotation par rotation.");
      j.titre("Le téléphone du cours en convention XYZ. Fais les trois rotations, puis dis où regarde l'écran (\\(\\vec{z}_3\\)).");
      var bt = E.h("button", "btn bleu", "Rotation 1 : φ = +90° autour de x", j.el); bt.type = "button"; bt.style.marginBottom = "12px";
      bt.addEventListener("click", function () {
        if (k >= 3) return;
        var e = etapes[k]; if (k > 0) n.figer(etapes[k - 1][2]);
        n.f = e[0]; bt.disabled = true;
        n.animer(e[1], 900, function () {
          n.idx = e[2]; k++; n.dessin(); bt.disabled = false;
          if (k < 3) bt.textContent = ["", "Rotation 2 : θ = +90° autour du nouvel y", "Rotation 3 : ψ = −90° autour du nouvel z"][k];
          else { bt.remove(); poser(); }
        });
      });
      function poser() {
        j.choix([{ tex: "\\vec{x}_0", juste: true }, { tex: "-\\vec{y}_0", aide: "Ça, c'était après la première rotation : \\(\\vec{z}_1 = -\\vec{y}_0\\)." }, { tex: "\\vec{z}_0", aide: "L'écran ne regarde plus le plafond. Suis l'axe bleu." }], { ok: function () {
          j.bravo("\\(\\vec{z}_3 = \\vec{x}_0\\), et \\(\\vec{x}_3 = -\\vec{z}_0\\), \\(\\vec{y}_3 = \\vec{y}_0\\).");
          j.expliquer("<p>Même méthode qu'en ZYX, avec un autre ordre d'axes : \\({}^0R_3 = R_x(\\varphi)\\,R_y(\\theta)\\,R_z(\\psi)\\), toujours en axes mobiles. À \\(\\theta = 90°\\), \\(\\vec{z}_2 = \\vec{x}_0\\) : là aussi, c'est une singularité.</p>");
          j.suite();
        } });
      }
    } }
  ]
});
