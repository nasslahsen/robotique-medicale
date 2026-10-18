/* Niveau : schémas cinématiques (plan ou spatial) et topologies (série, parallèle, arborescente, hybride). */
NIVEAU({
  id: "schemas-topologies",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [340, 380], ech: 120, az: 35, el: 24 });
    var n = { mode: "bras", spatial: true, t: 0, choisi: null, bon: null, surGraphe: null };
    var GRAPHES = [
      { nom: "a", n: [[0, 0], [1, 0], [2, 0], [3, 0]], l: [[0, 1], [1, 2], [2, 3]] },
      { nom: "b", n: [[0, 0], [1.5, 0.9], [1.5, -0.9], [3, 0]], l: [[0, 1], [0, 2], [1, 3], [2, 3]] },
      { nom: "c", n: [[1.5, 0], [0, 0.9], [0, -0.9], [3, 0.9], [3, -0.9]], l: [[0, 1], [0, 2], [0, 3], [0, 4]] },
      { nom: "d", n: [[0, 0], [1, 0.8], [1, -0.8], [2, 0], [3, 0]], l: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]] }
    ];
    n.graphes = GRAPHES;
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "bras") {
        var l = sc.nouvelle(), t1 = 30 + 25 * Math.sin(n.t), t2 = 35 * Math.sin(n.t * 1.3);
        sc.sol(l, 2.4);
        sc.cylindre(l, [0, 0, 0], 0.25, 0.4, "#9aa0ad");
        var R1 = E.Rz(t1 * D.DEG), O1 = [0, 0, 0.4], O2, P, z1;
        if (n.spatial) { O2 = [0, 0, 1.2]; z1 = E.mv(R1, [0, 1, 0]); P = E.mv(R1, [1.3 * Math.cos(t2 * D.DEG), 0, 1.2 + 1.3 * Math.sin(t2 * D.DEG)]); }
        else { O2 = E.mv(R1, [1.1, 0, 0.4]); O2[2] = 0.4; z1 = [0, 0, 1]; var a = (t1 + t2) * D.DEG; P = [O2[0] + 1 * Math.cos(a), O2[1] + 1 * Math.sin(a), 0.4]; }
        sc.segment(l, O1, O2, "#5e3a99", 12); sc.segment(l, O2, P, "#d0603a", 11);
        sc.segment(l, [0, 0, 0], [0, 0, 1.9], C.z, 3, "6 5"); sc.texte(l, "z₀", [0, 0, 2.05], { coul: C.z });
        sc.segment(l, [O2[0] - 0.6 * z1[0], O2[1] - 0.6 * z1[1], O2[2] - 0.6 * z1[2]], [O2[0] + 0.6 * z1[0], O2[1] + 0.6 * z1[1], O2[2] + 0.6 * z1[2]], C.x, 3, "6 5");
        sc.texte(l, "z₁", [O2[0] + 1.05 * z1[0], O2[1] + 1.05 * z1[1], O2[2] + 1.05 * z1[2]], { coul: C.x });
        sc.point(l, O1, 10, "#fff"); sc.point(l, O2, 10, "#fff"); sc.point(l, P, 9, C.jeu, "P");
        sc.dessiner(g, l);
      } else {
        GRAPHES.forEach(function (gr, k) {
          var ox = 60 + (k % 2) * 320, oy = 130 + Math.floor(k / 2) * 250, s = 70;
          var choisi = n.choisi === k, coul = choisi ? (n.bon === k ? C.ok : C.ko) : C.encre;
          E.s("rect", { x: ox - 30, y: oy - 95, width: 290, height: 200, rx: 18, fill: choisi ? (n.bon === k ? "#e3f7ee" : "#fdecec") : "#fafbfd", stroke: choisi ? coul : "#e3e6ee", "stroke-width": 2 }, g);
          D.texte(g, gr.nom, [ox - 6, oy - 70], { taille: 22, coul: coul });
          gr.l.forEach(function (e) { var a = gr.n[e[0]], b = gr.n[e[1]]; D.ligne(g, [ox + a[0] * s, oy - a[1] * s], [ox + b[0] * s, oy - b[1] * s], coul, 4); });
          gr.n.forEach(function (p, i) { D.rond(g, [ox + p[0] * s, oy - p[1] * s], 15, { fill: i === 0 ? "#9aa0ad" : "#fff", stroke: coul, ep: 3 }); });
          gr.zone = [ox - 30, oy - 95, 290, 200];
        });
      }
    };
    setInterval(function () { if (n.mode === "bras") { n.t += 0.05; n.dessin(); } }, 50);
    D.glisser(fig.svg, {
      debut: function (p) {
        if (n.mode !== "graphes" || !n.surGraphe) return false;
        GRAPHES.forEach(function (gr, k) { var z = gr.zone; if (p[0] > z[0] && p[0] < z[0] + z[2] && p[1] > z[1] && p[1] < z[1] + z[3]) n.surGraphe(k); });
        return false;
      }
    });
    sc.orbite(function () { if (n.mode === "bras") n.dessin(); }, function () { return n.mode === "bras"; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Plan ou spatial", jouer: function (j, n) {
      j.fig.astuce("Un bras à deux pivots en mouvement. Tourne la vue.");
      j.titre("Les axes des deux pivots sont \\(\\vec{z}_0\\) (vertical) et \\(\\vec{z}_1\\) (horizontal). Quel schéma faut-il ?");
      j.choix([{ html: "Un schéma plan", aide: "Plan : tous les axes de rotation parallèles à Z. Ici \\(\\vec{z}_1\\) est horizontal : P sort d'un plan unique." }, { html: "Un schéma spatial", juste: true }], { ok: function () {
        j.bravo("\\(\\vec{z}_0 \\perp \\vec{z}_1\\) : schéma spatial.");
        var bt = E.h("button", "btn clair", "Voir la version plane", j.el); bt.type = "button"; bt.style.marginRight = "12px";
        bt.addEventListener("click", function () { n.spatial = !n.spatial; bt.textContent = n.spatial ? "Voir la version plane" : "Voir la version spatiale"; });
        j.expliquer("<p>Un <b>schéma cinématique</b> ne garde que les axes des liaisons et les segments qui les relient. Il est <b>plan</b> quand tous les axes de rotation sont parallèles (\\(\\vec{z}_0 \\parallel \\vec{z}_1 \\parallel \\vec{Z}\\), comme le Quanser 2R du cours), <b>spatial</b> sinon (comme le Kinova Jaco, 6 pivots en série). C'est sur ce schéma qu'on place les repères pour calculer.</p>");
        j.suite();
      } });
    } },
    { nom: "Boucle", jouer: function (j, n) {
      n.mode = "graphes"; n.choisi = null; n.dessin();
      j.fig.astuce("Chaque rond est un solide (gris : la base), chaque trait une liaison.");
      j.titre("Touche le graphe d'un robot <b>parallèle</b> : sa plateforme est reliée à la base par plusieurs chaînes.");
      var fini = false, AIDE = { 0: "a : une seule chaîne, sans boucle ni embranchement (série).", 2: "c : des embranchements depuis un tronc, sans boucle (arborescente).", 3: "d : une boucle suivie d'une chaîne série (hybride)." };
      n.surGraphe = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = 1; n.dessin();
        if (k !== 1) { j.erreur(AIDE[k]); return; }
        fini = true; n.surGraphe = null;
        j.bravo("b : deux chaînes ferment une boucle.");
        j.expliquer("<p>Les quatre topologies du cours : <b>série</b> (chaîne ouverte, chaque solide relié à au plus deux autres, comme un bras 6R ou le ROSA ONE Brain), <b>parallèle</b> (au moins une boucle, comme le robot Delta, la plateforme de Stewart, le SurgiScope), <b>arborescente</b> (embranchements sans boucle, comme un humanoïde) et <b>hybride</b> (série et parallèle mélangés).</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surGraphe) n.surGraphe(1); });
    } },
    { nom: "Construire", jouer: function (j, n) {
      n.choisi = null; n.dessin();
      j.fig.astuce("");
      j.titre("Un robot SCARA : trois rotations, puis une translation verticale. Écris son schéma, de la base vers l'effecteur.");
      var z = j.zone("", '<div style="display:flex;gap:8px">' + ["R", "R", "R", "P"].map(function (c) { return '<span class="trou" data-attendu="' + c + '" style="min-width:64px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "P", html: "P" }, { id: "R", html: "R" }, { id: "R", html: "R" }, { id: "R", html: "R" }],
        aide: "R pour une rotation (pivot), P pour une translation (glissière), dans l'ordre depuis la base.",
        ok: function () {
          j.bravo("SCARA R-R-R-P : 4 DDL.");
          j.expliquer("<p>Méthode du cours : repérer chaque mouvement indépendant du robot réel, lui associer une liaison (R ou P) et son axe, puis relier les liaisons de la base vers l'effecteur. Cartésien : P-P-P. SCARA : R-R-R-P. Articulé : R-R-R-R-R.</p>");
          j.suite();
        }
      });
    } }
  ]
});
