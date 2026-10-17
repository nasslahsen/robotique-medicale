/* Niveau : architectures et espace de travail. Balayer un SCARA, familles de robots, charge utile, sériel ou parallèle. */
NIVEAU({
  id: "architectures",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [340, 310], 160), g = E.s("g", null, fig.svg);
    var n = { mode: "scara", q: [30, 60], L: [0.8, 0.6], traces: [], anneau: false, masses: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider(); E.vider(g);
      if (n.mode === "scara") {
        pl.grille({ pas: 0.2, fort: 5 });
        n.traces.forEach(function (p) { D.rond(pl.fond, pl.P(p), 3.5, { fill: "rgba(59,91,219,.45)" }); });
        if (n.anneau) [0.2, 1.4].forEach(function (r) { E.s("circle", { cx: pl.O[0], cy: pl.O[1], r: r * pl.u, fill: "none", stroke: C.jeu, "stroke-width": 3, "stroke-dasharray": "8 6" }, pl.fond); });
        var a1 = n.q[0] * D.DEG, a2 = (n.q[0] + n.q[1]) * D.DEG;
        var p1 = [n.L[0] * Math.cos(a1), n.L[0] * Math.sin(a1)], p2 = [p1[0] + n.L[1] * Math.cos(a2), p1[1] + n.L[1] * Math.sin(a2)];
        D.ligne(pl.fig, pl.P([0, 0]), pl.P(p1), "#ff8a5c", 18); D.ligne(pl.fig, pl.P(p1), pl.P(p2), "#8b3fd9", 15);
        D.rond(pl.haut, pl.P([0, 0]), 16, { fill: "#9aa0ad", stroke: C.encre, ep: 3 });
        D.rond(pl.haut, pl.P(p1), 12, { fill: "#fff", stroke: C.encre, ep: 3 });
        D.rond(pl.haut, pl.P(p2), 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
        n.bout = p2;
        E.k(b, "\\text{vue de dessus} \\qquad \\ell_1 = 0{,}8 \\qquad \\ell_2 = 0{,}6 \\qquad r = " + E.tn(Math.hypot(p2[0], p2[1]), 2));
      } else if (n.mode === "formes") {
        b.innerHTML = "";
        var pos = [[180, 170], [500, 170], [180, 430], [500, 430]];
        pos.forEach(function (p, k) { D.texte(g, "abcd"[k], [p[0] - 120, p[1] + 95], { taille: 24, coul: C.doux }); });
        var a = pos[0]; // parallélépipède
        E.s("polygon", { points: [[a[0] - 80, a[1] - 20], [a[0] + 30, a[1] - 20], [a[0] + 80, a[1] - 60], [a[0] - 30, a[1] - 60]].join(" "), fill: "#c5d2fb", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("polygon", { points: [[a[0] - 80, a[1] - 20], [a[0] + 30, a[1] - 20], [a[0] + 30, a[1] + 70], [a[0] - 80, a[1] + 70]].join(" "), fill: "#dfe6fd", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("polygon", { points: [[a[0] + 30, a[1] - 20], [a[0] + 80, a[1] - 60], [a[0] + 80, a[1] + 30], [a[0] + 30, a[1] + 70]].join(" "), fill: "#a9b8f0", stroke: C.encre, "stroke-width": 2 }, g);
        a = pos[1]; // cylindre
        E.s("path", { d: "M" + (a[0] - 80) + " " + (a[1] - 50) + " L" + (a[0] - 80) + " " + (a[1] + 60) + " A80 24 0 0 0 " + (a[0] + 80) + " " + (a[1] + 60) + " L" + (a[0] + 80) + " " + (a[1] - 50), fill: "#dfe6fd", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("ellipse", { cx: a[0], cy: a[1] - 50, rx: 80, ry: 24, fill: "#c5d2fb", stroke: C.encre, "stroke-width": 2 }, g);
        a = pos[2]; // sphère
        E.s("circle", { cx: a[0], cy: a[1], r: 80, fill: "#dfe6fd", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("ellipse", { cx: a[0], cy: a[1], rx: 80, ry: 24, fill: "none", stroke: C.encre, "stroke-width": 1.5, "stroke-dasharray": "6 5" }, g);
        a = pos[3]; // forme complexe
        E.s("path", { d: "M" + (a[0] - 90) + " " + (a[1] + 20) + " C" + (a[0] - 100) + " " + (a[1] - 80) + " " + (a[0] + 10) + " " + (a[1] - 100) + " " + (a[0] + 50) + " " + (a[1] - 50) + " C" + (a[0] + 110) + " " + (a[1] - 30) + " " + (a[0] + 90) + " " + (a[1] + 60) + " " + (a[0] + 30) + " " + (a[1] + 70) + " C" + (a[0] - 10) + " " + (a[1] + 80) + " " + (a[0] - 20) + " " + (a[1] + 20) + " " + (a[0] - 90) + " " + (a[1] + 20) + " Z", fill: "#dfe6fd", stroke: C.encre, "stroke-width": 2 }, g);
      } else if (n.mode === "charge") {
        var x0 = 260, y0 = 520, kg = 95, y = y0, cl = ["#9aa0ad", "#ff8a5c", "#8b3fd9"], noms = ["pince", "pièce", "adaptateur"];
        E.s("rect", { x: 160, y: y0, width: 360, height: 10, fill: "#d9dde6" }, g);
        (n.masses || []).forEach(function (m, k) {
          var h = m * kg; y -= h;
          E.s("rect", { x: x0, y: y, width: 160, height: h, rx: 6, fill: cl[k], stroke: "#fff", "stroke-width": 3 }, g);
          D.texte(g, noms[k] + " " + E.fmt(m, 1) + " kg", [x0 + 180, y + h / 2], { ancre: "start", taille: 18 });
        });
        var yl = y0 - 3 * kg;
        D.ligne(g, [180, yl], [500, yl], C.ko, 3, "10 6");
        D.texte(g, "charge utile 3 kg", [250, yl - 16], { coul: C.ko, taille: 17, ancre: "end" });
        b.innerHTML = "";
      } else {
        b.innerHTML = "";
        D.texte(g, "a", [70, 150], { taille: 24, coul: C.doux }); D.texte(g, "b", [380, 150], { taille: 24, coul: C.doux });
        // a : chaîne série
        var s = [[180, 500], [150, 360], [260, 260], [300, 170]];
        E.s("rect", { x: 130, y: 500, width: 100, height: 26, rx: 6, fill: "#9aa0ad" }, g);
        for (var i = 0; i < 3; i++) D.ligne(g, s[i], s[i + 1], ["#ff8a5c", "#8b3fd9", "#3b5bdb"][i], 16);
        s.slice(0, 3).forEach(function (p) { D.rond(g, p, 12, { fill: "#fff", stroke: C.encre, ep: 3 }); });
        D.rond(g, s[3], 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
        // b : Delta, trois bras de la base vers la nacelle
        E.s("rect", { x: 400, y: 110, width: 240, height: 26, rx: 6, fill: "#9aa0ad" }, g);
        var nac = [520, 420];
        [[430, 136, 400, 280], [520, 136, 560, 270], [610, 136, 640, 280]].forEach(function (c) {
          D.ligne(g, [c[0], c[1]], [c[2], c[3]], "#ff8a5c", 12);
          D.ligne(g, [c[2], c[3]], [nac[0] + (c[0] - 520) / 3, nac[1]], "#8b3fd9", 6);
          D.rond(g, [c[0], c[1]], 11, { fill: "#fff", stroke: C.encre, ep: 3 });
        });
        E.s("rect", { x: nac[0] - 40, y: nac[1] - 6, width: 80, height: 16, rx: 5, fill: C.jeu }, g);
        D.texte(g, "moteurs fixés à la base", [520, 90], { taille: 15, coul: C.doux });
      }
    };
    n.ajoute = function () {
      var p = n.bout, dernier = n.traces[n.traces.length - 1];
      if (!dernier || Math.hypot(p[0] - dernier[0], p[1] - dernier[1]) > 0.04) n.traces.push([p[0], p[1]]);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Balayer", jouer: function (j, n) {
      j.fig.astuce("Un SCARA vu de dessus. Chaque position atteinte par l'outil laisse un point.");
      j.titre("Fais tourner les deux pivots dans tous les sens. Quelle forme dessinent les points ?");
      var c = [0, 1].map(function (i) { return j.curseur({ nom: "θ" + "₁₂"[i], min: -180, max: 180, pas: 5, val: n.q[i], unite: "°", change: function (v) { n.q[i] = v; n.dessin(); n.ajoute(); n.dessin(); } }); });
      var bt = E.h("button", "btn clair", "Tout balayer", j.el); bt.type = "button";
      bt.addEventListener("click", function () {
        for (var a = -180; a < 180; a += 15) for (var q2 = -180; q2 <= 180; q2 += 12) {
          var a1 = a * D.DEG, a2 = (a + q2) * D.DEG;
          n.traces.push([0.8 * Math.cos(a1) + 0.6 * Math.cos(a2), 0.8 * Math.sin(a1) + 0.6 * Math.sin(a2)]);
        }
        n.dessin();
      });
      j.choix([{ html: "Un disque plein", aide: "Regarde près de la base : l'outil peut-il venir au centre, avec \\(\\ell_1 = 0{,}8 \\neq \\ell_2 = 0{,}6\\) ?" }, { html: "Un anneau", juste: true }, { html: "Un carré", aide: "Deux rotations : la frontière est faite de cercles." }], { ok: function () {
        c.forEach(function (x) { x.input.disabled = true; }); bt.remove();
        j.bravo("Un anneau : le trou au centre vient de \\(\\ell_1 \\neq \\ell_2\\).");
        j.suite();
      } });
    } },
    { nom: "Les rayons", jouer: function (j, n) {
      j.fig.astuce("Bras tendu : l'outil est au plus loin. Bras replié : au plus près.");
      j.titre("Calcule les rayons de l'anneau, intérieur puis extérieur (en m).");
      j.nombre({ avant: "r_{min} = \\lvert \\ell_1 - \\ell_2 \\rvert,\\ r_{max} = \\ell_1 + \\ell_2 :", cases: [{ attendu: 0.2, tol: 0.001 }, { attendu: 1.4, tol: 0.001 }], ligne: true,
        aide: function (k) { return k === 0 ? "Bras replié : \\(0{,}8 - 0{,}6\\)." : "Bras tendu : \\(0{,}8 + 0{,}6\\)."; },
        ok: function () {
          n.anneau = true; n.dessin();
          j.bravo("Entre 0,2 m et 1,4 m.");
          j.expliquer("<p>L'<b>espace de travail</b> est l'ensemble des positions que l'effecteur peut atteindre, pour au moins une configuration des articulations, dans le respect des limites articulaires. Il dépend de l'architecture, de la longueur des segments, des limites articulaires, des obstacles et de l'orientation imposée. La glissière verticale du SCARA donne son épaisseur à l'anneau.</p>");
          j.suite();
        } });
    } },
    { nom: "Familles", jouer: function (j, n) {
      n.mode = "formes"; n.dessin();
      j.fig.astuce("Quatre formes d'espace de travail, idéalisées.");
      j.titre("Associe chaque robot sériel à la forme de son espace de travail.");
      var lignes = [["c", "Cartésien (PPP)"], ["y", "Cylindrique"], ["s", "Sphérique (polaire)"], ["a", "Articulé"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' + [["a", "c"], ["b", "y"], ["c", "s"], ["d", "a"]].map(function (x) { return "<b>" + x[0] + "</b>" + '<span class="trou" data-attendu="' + x[1] + '" style="min-width:200px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [lignes[3], lignes[1], lignes[0], lignes[2]].map(function (l) { return { id: l[0], html: l[1] }; }),
        aide: "Trois translations donnent une boîte ; une rotation autour de Z et deux translations, un cylindre ; des rotations et une translation radiale, une sphère.",
        ok: function () {
          j.bravo("Boîte, cylindre, sphère, forme complexe.");
          j.expliquer("<p>L'<b>architecture cinématique</b> (disposition des liaisons et des axes) fixe le volume de travail, la dextérité et les performances. Cartésien : déplacements selon X, Y, Z. Cylindrique : rotation autour de Z, translations verticale et radiale. Sphérique : rotations et translation radiale. SCARA : deux rotations horizontales et une translation verticale. Articulé : comme un bras humain.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Charge utile", jouer: function (j, n) {
      n.mode = "charge"; n.masses = []; n.dessin();
      j.fig.astuce("La ligne rouge : la charge utile du robot.");
      j.titre("Le robot porte une pince de 1,2 kg, une pièce de 2,5 kg et un adaptateur de 0,3 kg. Quelle masse doit-il porter ?");
      j.nombre({ avant: "m =", apres: "\\text{kg}", cases: [{ attendu: 4, tol: 0.001 }], ligne: true,
        aide: function () { return "On compte tout ce qui est au bout du bras : effecteur + pièce + accessoires."; },
        ok: function () {
          n.masses = [1.2, 2.5, 0.3]; n.dessin();
          j.info("4,0 kg. Regarde la ligne rouge.");
          j.consigne("Un robot de charge utile 3 kg convient-il ?");
          j.choix([{ html: "Oui, la pièce pèse moins de 3 kg", aide: "La pièce seule ne suffit pas : le robot porte aussi la pince et l'adaptateur." }, { html: "Non", juste: true }], { ok: function () {
            j.bravo("Non : 4,0 kg > 3 kg.");
            j.expliquer("<p>La <b>charge utile</b> est la masse maximale que le robot peut transporter avec son effecteur tout en conservant ses performances spécifiées. On la compare à la masse totale : effecteur + pièce + accessoires.</p>");
            j.suite();
          } });
        } });
    } },
    { nom: "Sériel ou parallèle", jouer: function (j, n) {
      n.mode = "deux"; n.dessin();
      j.fig.astuce("a : chaîne ouverte. b : robot Delta, trois bras fermés sur la nacelle.");
      j.titre("Il faut saisir de petites pièces très vite et très précisément, dans une zone réduite. Quelle architecture choisir ?");
      j.choix([{ html: "a, sériel", aide: "Un sériel offre une grande enveloppe et la polyvalence, mais ses moteurs sont portés par le bras : plus d'inertie." }, { html: "b, parallèle", juste: true }], { ok: function () {
        j.bravo("Le parallèle : précis, rigide et rapide.");
        j.expliquer("<p><b>Sériels</b> : grande enveloppe de travail, dextérité, polyvalence, programmation plus simple, coût souvent inférieur. <b>Parallèles</b> : très grande précision et répétabilité, rigidité, vitesse et accélération élevées, moins d'inertie mobile car les actionneurs sont fixés à la base. Le choix dépend de l'application : précision, charge, vitesse, espace de travail, coût.</p>");
        j.suite();
      } });
    } }
  ]
});
