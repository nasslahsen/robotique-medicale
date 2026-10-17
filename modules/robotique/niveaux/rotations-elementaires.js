/* Niveau : rotations élémentaires Rx, Ry, Rz, axe conservé, signe de Ry, ordre des rotations. */
NIVEAU({
  id: "rotations-elementaires",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [340, 370], ech: 120, az: 30, el: 22 });
    var n = { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], fantome: null, outil: true, trace: null };
    var b = fig.bande(null);
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle(), I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      sc.sol(l, 2.4);
      sc.repere(l, [0, 0, 0], I, 1.9, ["x₀", "y₀", "z₀"], { pale: true, ep: 2.5 });
      if (n.outil) sc.pave(l, n.R, [0, 0, 0], [0.45, 0, 0], [0.6, 0.18, 0.1], "#ffb38f");
      if (n.fantome) sc.repere(l, [0, 0, 0], n.fantome, 1.35, null, { ep: 3, op: 0.35 });
      sc.repere(l, [0, 0, 0], n.R, 1.45, ["xₛ", "yₛ", "zₛ"], { ep: 5 });
      if (n.trace) sc.segment(l, n.trace[0], n.trace[1], D.C.jeu, 3, "4 5");
      sc.dessiner(g, l);
      if (n.bande) E.k(fig.bande(""), n.bande()); else fig.bande(null);
    };
    n.animer = function (versR, ms, fin) {
      // interpolation par angle autour d'un axe fixe donné (n.axe, n.angle)
      var ax = n.anim;
      E.anime(ms || 900, function (e) { n.R = E.mm(ax.base, ax.f(ax.angle * e * D.DEG)); n.dessin(); }, function () { n.R = E.mm(ax.base, ax.f(ax.angle * D.DEG)); n.dessin(); if (fin) fin(); });
    };
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Quel axe ?", jouer: function (j, n) {
      j.fig.astuce("Glisse un doigt pour tourner la vue. Bouton : rejouer la rotation.");
      j.titre("L'outil vient de tourner de 40° autour d'un seul axe de \\(R_0\\). Lequel ?");
      j.consigne("Un des trois axes n'a pas bougé : c'est l'axe de rotation.");
      function jouer() { n.R = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; n.anim = { base: n.R, f: E.Ry, angle: 40 }; n.animer(); }
      jouer();
      var rej = E.h("button", "btn clair", "Rejouer la rotation", j.el); rej.type = "button"; rej.style.margin = "0 0 12px"; rej.addEventListener("click", jouer);
      j.choix([
        { html: "Autour de x", aide: "Regarde \\(\\vec{x}_s\\) : il a quitté le sol, donc ce n'est pas l'axe conservé." },
        { html: "Autour de y", juste: true },
        { html: "Autour de z", aide: "Regarde \\(\\vec{z}_s\\) : il penche, donc ce n'est pas l'axe conservé." }
      ], { ok: function () {
        rej.remove();
        n.bande = function () { return "R_y(\\beta) = \\begin{pmatrix} \\cos\\beta & 0 & \\sin\\beta \\\\ 0 & \\color{#12a26b}{1} & 0 \\\\ -\\sin\\beta & 0 & \\cos\\beta \\end{pmatrix}"; }; n.dessin();
        j.bravo("\\(\\vec{y}_s = \\vec{y}_0\\) : l'axe y est conservé.");
        j.expliquer("<p>Dans une rotation élémentaire, l'axe conservé est sa propre image : sa colonne (et sa ligne) vaut \\((0 \\,;\\ 1 \\,;\\ 0)\\) au bon endroit. Les trois matrices du cours :</p>\\[ R_x(\\gamma) = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & \\cos\\gamma & -\\sin\\gamma \\\\ 0 & \\sin\\gamma & \\cos\\gamma \\end{pmatrix} \\quad R_y(\\beta) = \\begin{pmatrix} \\cos\\beta & 0 & \\sin\\beta \\\\ 0 & 1 & 0 \\\\ -\\sin\\beta & 0 & \\cos\\beta \\end{pmatrix} \\]\\[ R_z(\\alpha) = \\begin{pmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]");
        j.suite();
      } });
    } },
    { nom: "Le signe de Ry", jouer: function (j, n) {
      n.R = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; n.anim = { base: n.R, f: E.Ry, angle: 30 }; n.animer(700);
      n.trace = [[1.45, 0, 0], [1.45 * Math.cos(30 * D.DEG), 0, -1.45 * Math.sin(30 * D.DEG)]];
      n.bande = function () { return "\\text{après } R_y(30°) : \\quad \\vec{x}_s = (" + E.tn(Math.cos(30 * D.DEG), 3) + " \\,;\\ 0 \\,;\\ " + E.tn(-Math.sin(30 * D.DEG), 3) + ")"; };
      j.fig.astuce("Rotation de +30° autour de y : regarde où va xₛ.");
      j.titre("Pour une rotation positive autour de y, \\(\\vec{x}_s\\) descend. Complète la première colonne de \\(R_y(\\beta)\\).");
      j.consigne("Glisse chaque terme à sa place.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:10px;font-size:20px">\\(R_y(\\beta) =\\)<div style="display:grid;grid-template-columns:repeat(3,auto);gap:8px 14px;align-items:center;padding:8px 12px;border-left:3px solid #15171f;border-right:3px solid #15171f;border-radius:10px">' +
        '<span class="trou" data-attendu="c"></span><span>\\(0\\)</span><span>\\(\\sin\\beta\\)</span>' +
        '<span>\\(0\\)</span><span>\\(1\\)</span><span>\\(0\\)</span>' +
        '<span class="trou" data-attendu="m"></span><span>\\(0\\)</span><span>\\(\\cos\\beta\\)</span></div></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", tex: "-\\sin\\beta" }, { id: "c", tex: "\\cos\\beta" }],
        aide: "La colonne 1, c'est \\(\\vec{x}_s\\) : il garde une grande composante sur \\(\\vec{x}_0\\) et une petite composante négative sur \\(\\vec{z}_0\\).",
        ok: function () {
          j.bravo("Le signe moins est en bas à gauche.");
          j.expliquer("<p>L'ordre cyclique des axes est \\(x \\to y \\to z \\to x\\). Autour de \\(y\\), le plan qui tourne va de \\(z\\) vers \\(x\\) : le « premier » axe est \\(z\\), et le signe moins se retrouve sur la ligne de \\(z\\). C'est pour ça que \\(R_y\\) ne ressemble pas tout à fait à \\(R_x\\) et \\(R_z\\).</p>");
          j.suite();
        }
      });
    } },
    { nom: "L'ordre compte", jouer: function (j, n) {
      n.trace = null; n.bande = null;
      var I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      n.R = I; n.anim = { base: I, f: E.Rz, angle: 90 };
      n.animer(800, function () { n.anim = { base: E.Rz(90 * D.DEG), f: E.Rx, angle: 90 }; n.animer(800); });
      j.fig.astuce("D'abord 90° autour de z₀, puis 90° autour du nouvel axe xₛ.");
      j.titre("90° autour de z, puis 90° autour du nouvel axe x. Où pointe \\(\\vec{x}_s\\) à la fin ?");
      j.choix([{ tex: "\\vec{x}_0", aide: "Après le premier quart de tour, \\(\\vec{x}_s\\) pointe déjà selon \\(\\vec{y}_0\\), et la rotation autour de lui ne le bouge plus." }, { tex: "\\vec{y}_0", juste: true }, { tex: "\\vec{z}_0", aide: "Ça, c'est le résultat dans l'autre ordre (x d'abord, puis z)." }], { ok: function () {
        n.bande = function () { return "R_z(90°)\\,R_x(90°) = \\begin{pmatrix} 0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{pmatrix} \\qquad R_x(90°)\\,R_z(90°) = \\begin{pmatrix} 0 & -1 & 0 \\\\ 0 & 0 & -1 \\\\ 1 & 0 & 0 \\end{pmatrix}"; };
        n.fantome = E.mm(E.Rx(90 * D.DEG), E.Rz(90 * D.DEG)); n.dessin();
        j.bravo("\\(\\vec{x}_s = \\vec{y}_0\\) : la première colonne vaut \\((0 \\,;\\ 1 \\,;\\ 0)\\).");
        j.expliquer("<p>Dans l'autre ordre (en pâle sur la figure), on obtient \\(\\vec{x}_s = \\vec{z}_0\\) : une orientation différente. Le produit de matrices n'est pas commutatif, \\(AB \\neq BA\\) : <b>l'ordre des rotations compte</b>.</p>");
        j.suite();
      } });
    } }
  ]
});
