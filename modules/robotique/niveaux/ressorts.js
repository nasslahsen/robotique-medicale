/* Niveau : ressorts. Comprimer pour viser un effort, raideur F = kx, ressort plus raide, compression ou traction, ressort de rappel d'un vérin. */
NIVEAU({
  id: "ressorts",
  init: function (fig) {
    var C = D.C, M = MECA, g = E.s("g", null, fig.svg);
    var n = { mode: "comp", x: 0, k: 1, libre: false, graphe: false, surX: null, piston: 1, cible: null };
    var Y0 = 170, BAS = 520, S = 8; // longueur libre : de Y0 à BAS ; 8 px par mm
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "comp") {
        var yP = Y0 + n.x * S, xs = n.graphe ? 190 : 300;
        E.s("rect", { x: xs - 120, y: BAS, width: 240, height: 26, fill: M.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2.5 }, g);
        M.ressort(g, [xs, BAS], [xs, yP + 14], { spires: 9, rayon: 46, ep: 6 });
        E.s("rect", { x: xs - 90, y: yP - 12, width: 180, height: 26, rx: 6, fill: n.libre ? "#e8edff" : "#dfe3ea", stroke: n.libre ? C.acc : C.encre, "stroke-width": 3 }, g);
        if (n.libre) D.poignee(g, [xs, yP], C.acc);
        if (n.x > 0.2) {
          D.ligne(g, [xs + 130, Y0], [xs + 130, yP], C.v, 3); D.ligne(g, [xs + 118, Y0], [xs + 142, Y0], C.v, 3);
          D.texte(g, "x", [xs + 150, (Y0 + yP) / 2], { coul: C.v, taille: 22, ancre: "start" });
          D.fleche(g, [xs, yP - 90], [xs, yP - 16], C.jeu, 5);
          D.texte(g, "F", [xs - 22, yP - 62], { coul: C.jeu, taille: 24 });
        }
        D.ligne(g, [xs - 110, Y0], [xs + 110, Y0], C.gris, 1.5, "6 5");
        D.texte(g, "longueur libre", [xs - 114, Y0 - 16], { taille: 15, coul: C.doux, gras: false, ancre: "start" });
        if (n.graphe) {
          // F(x) : une droite de pente k
          var gx = 400, gy = 470, sx = 9, sy = 4.5;
          D.fleche(g, [gx, gy], [gx + 250, gy], C.gris, 2.5); D.fleche(g, [gx, gy], [gx, gy - 300], C.gris, 2.5);
          D.texte(g, "x (mm)", [gx + 230, gy + 26], { taille: 16, coul: C.doux, gras: false });
          D.texte(g, "F (N)", [gx + 8, gy - 312], { taille: 16, coul: C.doux, gras: false, ancre: "start" });
          [10, 20].forEach(function (v) { D.texte(g, String(v), [gx + v * sx, gy + 22], { taille: 14, coul: C.doux, gras: false, mono: true }); });
          [20, 40, 60].forEach(function (v) { D.texte(g, String(v), [gx - 10, gy - v * sy], { taille: 14, coul: C.doux, gras: false, mono: true, ancre: "end" }); D.ligne(g, [gx, gy - v * sy], [gx + 240, gy - v * sy], C.pale, 1.5); });
          var xm = Math.min(25, 62 / n.k);
          if (n.k !== 1) D.ligne(g, [gx, gy], [gx + 25 * sx, gy - 25 * sy], "#c6cbd8", 3, "7 5");
          D.ligne(g, [gx, gy], [gx + xm * sx, gy - xm * n.k * sy], C.jeu, 4);
          D.rond(g, [gx + n.x * sx, gy - n.x * n.k * sy], 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
          D.texte(g, "k = " + E.fmt(n.k, 0) + " N/mm", [gx + xm * sx - 10, gy - xm * n.k * sy - 22], { coul: C.jeu, taille: 17, ancre: "end" });
        }
        fig.chip("x = " + E.fmt(n.x, 1) + " mm · F = " + (n.cache ? "?" : E.fmt(n.k * n.x, 1) + " N"));
      } else if (n.mode === "deux") {
        fig.chip(null);
        D.texte(g, "A", [70, 310], { taille: 34, coul: C.doux }); D.texte(g, "B", [370, 310], { taille: 34, coul: C.doux });
        M.ressort(g, [170, 480], [170, 140], { spires: 7, rayon: 52, ep: 7 });
        M.ressort(g, [480, 470], [480, 150], { spires: 20, rayon: 44, ep: 7 });
        [[480, 150, -1], [480, 470, 1]].forEach(function (q) { E.s("circle", { cx: q[0], cy: q[1] + q[2] * 30, r: 28, fill: "none", stroke: "#5b6172", "stroke-width": 7 }, g); });
        if (n.choix) { D.fleche(g, [480, 86], [480, 40], C.jeu, 5); D.fleche(g, [480, 534], [480, 580], C.jeu, 5); D.fleche(g, [170, 70 + 30], [170, 134], C.z, 5); D.fleche(g, [170, 560], [170, 490], C.z, 5); }
        D.texte(g, "bases dressées", [170, 520], { taille: 16, coul: C.doux, gras: false });
        D.texte(g, "crochets", [580, 300], { taille: 16, coul: C.doux, gras: false });
      } else {
        fig.chip(null);
        // vérin simple effet à ressort de rappel
        var yc = 300, xP;
        xP = 420 - 200 * (1 - n.piston);
        E.s("rect", { x: 80, y: yc - 100, width: 470, height: 200, rx: 10, fill: "#f6f7fa", stroke: C.encre, "stroke-width": 3 }, g);
        E.s("rect", { x: 92, y: yc - 88, width: xP - 92, height: 176, fill: n.piston > 0.5 ? "#dbe4ff" : "#f6f7fa" }, g);
        M.ressort(g, [xP + 24, yc], [538, yc], { spires: 9, rayon: 70, ep: 6, coul: "#c25b22" });
        E.s("rect", { x: xP, y: yc - 88, width: 24, height: 176, rx: 4, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("rect", { x: xP + 24, y: yc - 14, width: 640 - xP - 24 + 40, height: 28, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "piston", [xP + 12, yc - 120], { taille: 16, coul: C.doux, gras: false });
        D.texte(g, "tige", [610, yc - 34], { taille: 16, coul: C.doux, gras: false });
        if (n.air) { D.fleche(g, [20, yc], [96, yc], C.acc, 7); D.texte(g, "air", [40, yc - 28], { coul: C.acc, taille: 18 }); }
        else D.texte(g, "air coupé", [70, yc + 140], { coul: C.doux, taille: 17, gras: false, ancre: "start" });
      }
    };
    D.glisser(fig.svg, {
      debut: function (p) { if (!n.libre || n.mode !== "comp") return false; var xs = n.graphe ? 190 : 300; return Math.abs(p[0] - xs) < 130 && Math.abs(p[1] - (Y0 + n.x * S)) < 70; },
      bouge: function (p) {
        if (!n.libre) return;
        n.x = Math.max(0, Math.min(25, Math.round((p[1] - Y0) / S * 2) / 2)); n.dessin();
        if (n.surX) n.surX(n.x);
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Comprime", jouer: function (j, n) {
      n.libre = true; n.dessin();
      j.fig.astuce("Glisse le plateau vers le bas pour comprimer le ressort.");
      j.titre("Ce ressort de rappel a une raideur k = 1 N/mm. Comprime-le pour qu'il pousse avec 12 N.");
      n.surX = function (x) {
        if (Math.abs(x - 12) > 0.01) return;
        n.surX = null; n.libre = false; n.x = 12; n.dessin();
        j.bravo("12 mm de compression : 12 N.");
        j.expliquer("<p>Un <b>ressort</b> est un élément déformable : il emmagasine de l'énergie quand on le sollicite et restitue un effort en reprenant sa forme. Dans son domaine linéaire, l'effort est proportionnel à la déformation :</p>\\[ F = kx \\]<p>\\(k\\) est la raideur (N/m ou N/mm), \\(x\\) l'allongement ou la compression.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surX) n.surX(12); });
    } },
    { nom: "Raideur", jouer: function (j, n) {
      n.graphe = true; n.cache = true; n.dessin();
      j.fig.astuce("Le point rouge suit la droite F(x).");
      j.titre("Exemple du cours : un ressort doit varier de ΔF = 12 N quand il bouge de Δx = 12 mm. Quelle raideur faut-il ?");
      j.nombre({ avant: "k =", apres: "\\text{N/mm}", cases: [{ attendu: 1, tol: 0.001 }], ligne: true,
        aide: function () { return "\\(k = \\Delta F / \\Delta x\\) : divise l'effort par le déplacement."; },
        ok: function () { n.cache = false; n.dessin(); j.bravo("k = 1 N/mm : la pente de la droite."); j.suite(); } });
    } },
    { nom: "Plus raide", jouer: function (j, n) {
      n.k = 2; n.x = 0; n.cache = true; n.dessin();
      j.fig.astuce("Nouveau ressort, deux fois plus raide : la droite (rouge) monte plus vite que l'ancienne (tirets).");
      j.titre("Avec k = 2 N/mm, quel effort pour une compression de 15 mm ?");
      j.nombre({ avant: "F =", apres: "\\text{N}", cases: [{ attendu: 30, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(F = kx\\), avec \\(k\\) en N/mm et \\(x\\) en mm."; },
        ok: function () { n.x = 15; n.cache = false; n.dessin(); j.bravo("30 N."); j.suite(); } });
    } },
    { nom: "Traction", jouer: function (j, n) {
      n.mode = "deux"; n.dessin();
      j.fig.astuce("Deux ressorts cylindriques.");
      j.titre("Lequel est fait pour travailler en traction ?");
      j.choix([
        { html: "A", aide: "A a des bases dressées (planes) : on appuie dessus, il travaille en compression." },
        { html: "B", juste: true }
      ], { colonnes: 2, ok: function () {
        n.choix = true; n.dessin();
        j.bravo("B : ses crochets permettent de le tirer.");
        j.expliquer("<p>Ressort de compression : spires écartées, extrémités dressées pour bien appuyer. Ressort de traction : spires jointives, crochets aux bouts. Les deux se décrivent par le pas \\(P\\), le diamètre du fil \\(d\\), le diamètre de l'enroulement \\(D\\) et la longueur \\(L\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Rappel", jouer: function (j, n) {
      n.mode = "verin"; n.piston = 1; n.air = true; n.dessin();
      j.fig.astuce("Un vérin : l'air pousse le piston et comprime le ressort.");
      j.titre("On coupe l'air. Prédis : que fait le ressort ?");
      j.choix([
        { html: "Il ramène le piston et la tige en position de départ", juste: true },
        { html: "Rien : sans air, rien ne bouge", aide: "Le ressort est comprimé : il a emmagasiné de l'énergie, qu'il restitue." },
        { html: "Il pousse la tige encore plus loin", aide: "Regarde de quel côté du piston il est : il pousse le piston vers la gauche." }
      ], { colonnes: 1, ok: function () {
        n.air = false;
        E.anime(900, function (e) { n.piston = 1 - e; n.dessin(); });
        j.bravo("Le ressort de rappel ramène le piston.");
        j.expliquer("<p>Un ressort sert à assurer un rappel (ce vérin), maintenir un contact (le ressort de soupape garde la soupape contre son siège, la came agit avec un jeu de soupape), appliquer un effort ou absorber des chocs.</p>");
        j.suite();
      } });
    } }
  ]
});
