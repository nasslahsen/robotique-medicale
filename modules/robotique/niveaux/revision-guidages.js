/* Révision du chapitre 7 : raideur d'une table, choix d'un roulement, L10 d'une centrifugeuse, angle de contact, dilatation, précharge. */
NIVEAU({
  id: "revision-guidages",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "table" };
    var H = function () { return MECA.hachures(g, "#5b6172", { fond: "#fff" }); };
    function table() {
      // table d'examen sur deux chariots, rail au sol
      E.s("rect", { x: 70, y: 420, width: 540, height: 40, fill: H(), stroke: C.encre, "stroke-width": 2 }, g);
      [180, 470].forEach(function (x) { E.s("rect", { x: x - 60, y: 372, width: 120, height: 48, rx: 8, fill: "#ffe9e2", stroke: C.encre, "stroke-width": 2 }, g); });
      E.s("rect", { x: 80, y: 330, width: 520, height: 42, rx: 8, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2.5 }, g);
      // patient allongé
      D.rond(g, [150, 300], 28, { fill: "#f3d2bf", stroke: C.encre, ep: 2 });
      E.s("rect", { x: 182, y: 282, width: 360, height: 48, rx: 22, fill: "#b8c4e8", stroke: C.encre, "stroke-width": 2 }, g);
      D.fleche(g, [340, 140], [340, 276], C.x, 7); D.texte(g, "F = 900 N", [356, 170], { coul: C.x, taille: 22, ancre: "start" });
      D.texte(g, "δ = 0,3 mm", [340, 500], { coul: C.v, taille: 22 });
      D.texte(g, "rail", [96, 482], { taille: 17, coul: C.doux, ancre: "start" });
    }
    function centrifugeuse() {
      // rotor vertical, roulement en bas : charge axiale (poids) et radiale (balourd)
      var x = 340;
      E.s("rect", { x: 140, y: 150, width: 400, height: 50, rx: 12, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2.5 }, g);
      [190, 270, 410, 490].forEach(function (t) { E.s("rect", { x: t - 12, y: 120, width: 24, height: 40, rx: 6, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g); });
      E.s("rect", { x: x - 22, y: 200, width: 44, height: 300, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2 }, g);
      MECA.traitAxe(g, [x, 100], [x, 540]);
      [[-1, x - 22], [1, x + 22]].forEach(function (s) {
        var gg = E.s("g", { transform: "translate(" + s[1] + " 420) rotate(" + (s[0] > 0 ? 90 : -90) + ")" }, g);
        MECA.roulement(gg, 0, 0, 70, 60, { type: "billes" });
      });
      E.s("rect", { x: 220, y: 500, width: 240, height: 40, fill: H(), stroke: C.encre, "stroke-width": 2 }, g);
      D.fleche(g, [x, 250], [x, 330], C.x, 7); D.texte(g, "axiale (poids)", [x + 16, 270], { coul: C.x, taille: 19, ancre: "start" });
      D.fleche(g, [180, 300], [x - 28, 300], C.x, 7); D.texte(g, "radiale (balourd)", [70, 270], { coul: C.x, taille: 19, ancre: "start" });
      D.texte(g, "5000 tr/min", [560, 90], { taille: 20, coul: C.doux, ancre: "end" });
    }
    function contact() {
      var c = [340, 300], a = 40;
      [1, -1].forEach(function (s) {
        var gg = E.s("g", { transform: "rotate(" + (-a) + " " + c[0] + " " + c[1] + ")" }, g);
        E.s("rect", { x: c[0] - 110, y: s > 0 ? c[1] - 122 : c[1] + 64, width: 220, height: 58, fill: H(), stroke: C.encre, "stroke-width": 2.5 }, gg);
      });
      D.rond(g, c, 64, { fill: "#cfd5df", stroke: C.encre, ep: 2.5 });
      var u = [Math.sin(a * D.DEG), -Math.cos(a * D.DEG)];
      D.ligne(g, [c[0] + u[0] * 190, c[1] + u[1] * 190], [c[0] - u[0] * 190, c[1] - u[1] * 190], C.v, 3, "10 6");
      D.ligne(g, [c[0], c[1] - 210], [c[0], c[1] + 200], C.gris, 2, "4 6");
      D.texte(g, "α = 40°", [470, 90], { coul: C.jeu, taille: 26 });
      MECA.traitAxe(g, [60, 560], [620, 560]);
    }
    function autoclave() {
      E.s("rect", { x: 40, y: 150, width: 600, height: 300, rx: 20, fill: "#fff1e6", stroke: "#e8945a", "stroke-width": 3 }, g);
      D.texte(g, "stérilisation : l'appareil chauffe", [340, 120], { taille: 20, coul: "#b8601e" });
      MECA.arbre(g, 80, 600, 300, 30);
      [150, 530].forEach(function (x) { [1, -1].forEach(function (s) { MECA.roulement(g, x, 300 - s * 30, 60, 60, { type: "billes", sens: s }); }); });
      D.texte(g, "?", [150, 196], { taille: 30, coul: C.acc }); D.texte(g, "?", [530, 196], { taille: 30, coul: C.acc });
      D.texte(g, "arbre long", [340, 360], { taille: 18, coul: C.doux });
    }
    function poignet() {
      // poignet de robot chirurgical : l'instrument bouge sous un petit effort
      E.s("rect", { x: 330, y: 220, width: 260, height: 160, rx: 20, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.texte(g, "poignet", [460, 410], { taille: 19, coul: C.doux });
      D.ligne(g, [330, 300], [80, 300], C.encre, 10);
      D.ligne(g, [330, 300], [80, 330], C.ko, 4, "8 6");
      D.fleche(g, [100, 230], [100, 290], C.x, 6); D.texte(g, "petit effort", [116, 236], { coul: C.x, taille: 19, ancre: "start" });
      D.texte(g, "l'instrument bouge de quelques centièmes", [340, 480], { taille: 19, coul: C.ko });
    }
    n.dessin = function () {
      E.vider(g);
      ({ table: table, centrifugeuse: centrifugeuse, contact: contact, autoclave: autoclave, poignet: poignet })[n.mode]();
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La table", jouer: function (j, n) {
      j.fig.astuce("Exemple ajouté : une table d'examen sur rail.");
      j.titre("Un patient de 900 N s'allonge : la table descend de 0,3 mm sur ses guidages. Quelle raideur ?");
      j.nombre({ avant: "k =", apres: "\\text{N/mm}", cases: [{ attendu: 3000, tol: 0.5 }], ligne: true,
        aide: function () { return "\\(k = F/\\delta\\), avec \\(\\delta\\) en mm."; },
        ok: function () { j.bravo("k = 3000 N/mm."); j.suite(); } });
    } },
    { nom: "La centrifugeuse", jouer: function (j, n) {
      n.mode = "centrifugeuse"; n.dessin();
      j.fig.astuce("Exemple ajouté : centrifugeuse de laboratoire.");
      j.titre("Le roulement du rotor reçoit une charge axiale (le poids) et une charge radiale (le balourd), à grande vitesse. Quel type ?");
      j.choix([
        { html: "Rigide à billes, une rangée", juste: true },
        { html: "Rouleaux cylindriques", aide: "Ils ne supportent aucune charge axiale : regarde la flèche verticale." },
        { html: "Butée à billes", aide: "Une butée ne prend pas la charge radiale et n'accepte pas d'aussi grandes vitesses." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Charges combinées : le rigide à billes, type très employé.");
        j.suite();
      } });
    } },
    { nom: "Sa durée", jouer: function (j, n) {
      j.titre("Ce roulement à billes : C = 10 kN, P = 2 kN, n = 5000 tr/min. Durée en millions de tours, puis en heures ?");
      j.nombre({ avant: "L_{10},\\ L_{10h} :", cases: [{ attendu: 125, tol: 0.05 }, { attendu: 125e6 / (60 * 5000), tol: 0.5 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\((C/P)^3\\) avec \\(C/P = 5\\)." : "\\(L_{10h} = 10^6 L_{10} / (60\\,n)\\)."; },
        ok: function () { j.bravo("125 millions de tours, environ 417 h : la grande vitesse use vite les heures."); j.suite(); } });
    } },
    { nom: "Radial ou butée ?", jouer: function (j, n) {
      n.mode = "contact"; n.dessin();
      j.fig.astuce("");
      j.titre("Un roulement a un angle de contact de 40°. Dans quel groupe est-il ?");
      j.choix([
        { html: "Roulement radial", juste: true },
        { html: "Butée", aide: "Compare 40° à la limite de 45°." }
      ], { colonnes: 2, ok: function () {
        j.bravo("40° ≤ 45° : radial, à contact oblique, il reprend aussi de l'axial.");
        j.suite();
      } });
    } },
    { nom: "Stérilisation", jouer: function (j, n) {
      n.mode = "autoclave"; n.dessin();
      j.fig.astuce("");
      j.titre("Cet appareil est chauffé à chaque cycle de stérilisation. Comment monter les deux roulements de son arbre long ?");
      j.choix([
        { html: "Un palier fixe et un palier libre", juste: true },
        { html: "Deux paliers fixes, pour qu'il ne bouge pas", aide: "L'arbre s'allonge en chauffant : deux paliers fixes l'en empêchent." },
        { html: "Deux paliers libres", aide: "Plus rien ne positionnerait l'arbre axialement." }
      ], { colonnes: 1, ok: function () { j.bravo("Fixe-libre : positionné, mais libre de se dilater."); j.suite(); } });
    } },
    { nom: "Le poignet bouge", jouer: function (j, n) {
      n.mode = "poignet"; n.dessin();
      j.fig.astuce("");
      j.titre("Sous un petit effort, l'instrument bouge de quelques centièmes de millimètre. D'où cela peut-il venir, et quel remède ?");
      j.choix([
        { html: "Du jeu dans les roulements : on les précharge", juste: true },
        { html: "D'une durée L₁₀ trop faible : on prend un roulement plus gros", aide: "La durée de vie ne dit rien du déplacement sous charge. Pense au jeu et à la rigidité." },
        { html: "De la dilatation : on monte deux paliers fixes", aide: "La dilatation est lente et thermique ; ici le mouvement apparaît sous un petit effort." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La précharge supprime le jeu et augmente la rigidité.");
        j.suite();
      } });
    } }
  ]
});
