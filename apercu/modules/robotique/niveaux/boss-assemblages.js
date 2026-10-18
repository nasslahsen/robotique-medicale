/* Boss du chapitre 6 : monter la roue dentée d'une articulation de robot sur l'arbre moteur (exemple ajouté). */
NIVEAU({
  id: "boss-assemblages",
  init: function (fig) {
    var C = D.C, M = MECA, g = E.s("g", null, fig.svg);
    var n = { mode: "roue", poses: {}, L: null, insert: false, x: 0 };
    var GR = "#5b6172";
    function coupe(x, y, w, h, angle, coul) { return E.s("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, coul || GR, { fond: "#fff", angle: angle }), stroke: C.encre, "stroke-width": 2.5 }, g); }
    function plein(x, y, w, h, rx, f, tr) { return E.s("rect", { x: x, y: y, width: w, height: h, rx: rx || 0, fill: f || "#dfe3ea", stroke: tr || C.encre, "stroke-width": tr ? 3.5 : 2.5 }, g); }
    function filets(x, y0, y1, w) { for (var y = y0; y < y1; y += 8) D.ligne(g, [x, y], [x + w, y + 4], C.encre, 1.1); }
    function txt(t, p, a, c) { D.texte(g, t, p, { taille: 17, coul: c || C.doux, gras: !!c, ancre: a || "middle" }); }
    n.dessin = function () {
      E.vider(g);
      var yc = 320;
      if (n.mode === "roue") {
        plein(20, 180, 140, 280, 12); txt("moteur", [90, 320]);
        M.arbre(g, 160, 290, yc, 64); M.arbre(g, 290, 640, yc, 46);
        coupe(290, yc - 190, 130, 144, 45); coupe(290, yc + 46, 130, 144, -45);
        [yc - 204, yc + 190].forEach(function (y0) { for (var x = 296; x < 416; x += 20) plein(x, y0, 12, 14, 0, "#dfe3ea"); });
        txt("roue dentée", [430, yc - 165], "start");
        var p = n.poses;
        if (p.clavette) { plein(305, yc - 58, 100, 24, 0, "#d5f2e5", C.ok); }
        if (p.anneau) [[426, yc - 50, 32], [426, yc + 18, 32]].forEach(function (r) { plein(r[0], r[1], 12, r[2], 2, "#d5f2e5", C.ok); });
        if (p.epaulement) { D.ligne(g, [290, yc - 64], [290, yc + 64], C.ok, 6); }
        E.s("rect", { x: 426, y: yc - 46, width: 12, height: 6, fill: "#fff", stroke: C.encre, "stroke-width": 1.4 }, g);
        E.s("rect", { x: 426, y: yc + 40, width: 12, height: 6, fill: "#fff", stroke: C.encre, "stroke-width": 1.4 }, g);
        txt("gorge", [470, yc + 76], "start");
        D.ligne(g, [440, yc + 46], [466, yc + 70], C.doux, 1.5);
        txt("d = 14 mm", [560, yc - 64]);
        if (n.L) txt("clavette b = 5, L = " + n.L + " mm", [340, 560], "middle", C.jeu);
      } else if (n.mode === "couvercle") {
        coupe(80, 250, 520, 220, -45, n.insert ? GR : "#8b3fd9");
        coupe(80, 200, 520, 50, 45);
        [200, 480].forEach(function (x) {
          E.s("rect", { x: x - 16, y: 200, width: 32, height: 50, fill: "#fff" }, g);
          E.s("rect", { x: x - 12, y: 250, width: 24, height: 80, fill: "#fff" }, g);
          if (n.insert) plein(x - 20, 250, 40, 84, 3, "#d5f2e5", C.ok);
          plein(x - 11, 186, 22, 140); filets(x - 11, 260, 322, 22); plein(x - 26, 160, 52, 28, 5);
        });
        txt("couvercle", [340, 225]); txt("carter en polymère imprimé en 3D", [340, 500]);
        D.texte(g, "4 vis M4", [340, 140], { taille: 22, coul: C.jeu });
      } else {
        // frein à ressort : un patin pressé sur un disque
        coupe(60, 120, 560, 40, 45); // bâti
        M.ressort(g, [340, 160], [340, 300 - 0], { spires: 7, rayon: 40, ep: 6 });
        plein(240, 300, 200, 34, 6, "#ffe9c7"); txt("patin", [340, 318]);
        plein(120, 334, 440, 30, 6); txt("disque du frein", [340, 392]);
        D.fleche(g, [470, 200], [470, 296], C.jeu, 6);
        if (n.Ftxt) D.texte(g, n.Ftxt, [490, 240], { coul: C.jeu, taille: 22, ancre: "start" });
        txt("ressort comprimé de " + (n.xtxt || "6") + " mm", [340, 470]);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le montage", jouer: function (j, n) {
      j.fig.astuce("Exemple ajouté : la roue dentée d'une articulation de robot, sur l'arbre du moteur.");
      j.titre("Choisis l'élément qui assure chaque fonction de cette liaison.");
      var lignes = [["clavette", "transmettre le couple"], ["epaulement", "positionner la roue le long de l'arbre"], ["anneau", "la maintenir axialement, démontable"]];
      var z = j.zone("", lignes.map(function (l) { return '<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><span class="trou" data-attendu="' + l[0] + '" style="min-width:200px;min-height:54px"></span><span style="font-size:16px">' + l[1] + "</span></div>"; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "anneau", html: "anneau élastique" }, { id: "ressort", html: "ressort" }, { id: "clavette", html: "clavette" }, { id: "rondelle", html: "rondelle frein" }, { id: "epaulement", html: "épaulement" }],
        aide: "Repense aux cinq fonctions d'une liaison et aux éléments du cours.",
        ok: function () {
          n.poses = { clavette: true, anneau: true, epaulement: true }; n.dessin();
          j.bravo("Clavette, épaulement, anneau élastique.");
          j.suite();
        }
      });
    } },
    { nom: "Effort sur la clavette", jouer: function (j, n) {
      j.fig.astuce("Le moteur fournit C = 9 N·m à l'arbre de 14 mm.");
      j.titre("Quelle force tangentielle s'exerce sur la clavette ?");
      j.nombre({ avant: "F_t \\approx", apres: "\\text{N}", cases: [{ attendu: 1285.7, tol: 3 }], ligne: true,
        aide: function () { return "Regarde le diamètre de l'arbre, en mètres."; },
        ok: function () { j.bravo("Ft = 2 × 9 / 0,014 ≈ 1286 N."); j.suite(); } });
    } },
    { nom: "Longueur de clavette", jouer: function (j, n) {
      j.fig.astuce("Hypothèse de l'exercice : on n'accepte pas plus de 20 MPa de cisaillement moyen.");
      j.titre("Avec b = 5 mm, quelle est la clavette la plus courte qui convient ?");
      var L = [10, 12, 16, 25];
      j.choix(L.map(function (l) {
        var tau = 1285.7 / (5 * l);
        return { html: "L = " + l + " mm", juste: l === 16, aide: tau > 20 ? "Calcule τ pour cette longueur et compare à 20 MPa." : "Elle convient, mais une plus courte convient aussi." };
      }), { colonnes: 2, ok: function () {
        n.L = 16; n.dessin();
        j.bravo("L = 16 mm : τ ≃ 1286 / (5 × 16) ≈ 16,1 MPa. Avec 12 mm, 21,4 MPa : trop.");
        j.suite();
      } });
    } },
    { nom: "Le couvercle", jouer: function (j, n) {
      n.mode = "couvercle"; n.dessin();
      j.fig.astuce("Le couvercle de l'articulation est fixé par quatre vis M4.");
      j.titre("Chaque vis doit donner une précharge de 2 kN, avec K = 0,20. Quel couple de serrage ?");
      j.nombre({ avant: "T \\simeq", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 1.6, tol: 0.01 }], ligne: true,
        aide: function () { return "Regarde le diamètre nominal de la vis."; },
        ok: function () {
          j.info("T ≃ 0,20 × 2000 × 0,004 = 1,6 N·m.");
          j.consigne("Le carter est imprimé en 3D et le couvercle sera démonté à chaque maintenance. Que prévoir ?");
          j.choix([
            { html: "Des inserts filetés métalliques dans le carter", juste: true },
            { html: "Un couple de serrage plus élevé", aide: "Regarde quelle pièce porte le filetage." },
            { html: "Des goupilles à la place des vis", aide: "Il faut toujours serrer : les goupilles ne serrent pas." }
          ], { colonnes: 1, ok: function () {
            n.insert = true; n.dessin();
            j.bravo("Inserts filetés : le taraudage du polymère ne s'use plus.");
            j.suite();
          } });
        } });
    } },
    { nom: "Le frein", jouer: function (j, n) {
      n.mode = "frein"; n.Ftxt = "18 N"; n.xtxt = "6"; n.dessin();
      j.fig.astuce("Un frein de sécurité : le ressort presse le patin sur le disque quand le courant est coupé.");
      j.titre("Le ressort doit presser avec 18 N quand il est comprimé de 6 mm. Quelle raideur ? Et quel effort s'il est comprimé de 10 mm ?");
      j.nombre({ avant: "k,\\ F :", cases: [{ attendu: 3, tol: 0.01 }, { attendu: 30, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "Domaine linéaire : une seule formule relie F, k et x." : "Garde la même raideur."; },
        ok: function () { n.Ftxt = "30 N"; n.xtxt = "10"; n.dessin(); j.bravo("k = 3 N/mm, puis F = 3 × 10 = 30 N."); j.suite(); } });
    } }
  ]
});
