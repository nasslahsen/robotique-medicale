/* Niveau : montage fixe-libre. Dilatation de l'arbre, bague coulissante, arbre ou logement tournant, réglage du jeu. */
NIVEAU({
  id: "fixe-libre",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    // tenus : bagues maintenues axialement. G / D : roulement gauche / droit ; i / e : bague intérieure / extérieure
    var n = { tenus: { Gi: true, Ge: true, Di: true, De: true }, dil: 0, choisi: null, surTouche: null, libre: true, legende: "" };
    var yc = 320, r = 42, h = 84, l = 74, xs = { G: 180, D: 500 }, bague = 25;
    n.cibles = {};
    function coniques() {
      // arbre fixe, logement tournant, deux roulements à rouleaux coniques en opposition, réglage à droite
      var H = MECA.hachures(g, "#9aa0ad", { fond: "#fff" });
      [-1, 1].forEach(function (s) { E.s("rect", { x: 120, y: s < 0 ? yc - r - h - 40 : yc + r + h, width: 360, height: 40, fill: H, stroke: C.encre, "stroke-width": 2 }, g); });
      E.s("rect", { x: 60, y: yc - r, width: 560, height: 2 * r, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2 }, g);
      MECA.traitAxe(g, [40, yc], [650, yc]);
      [[190, -1], [410, 1]].forEach(function (b) {
        var gg = E.s("g", { transform: b[1] < 0 ? "translate(" + 2 * b[0] + " 0) scale(-1 1)" : null }, g);
        [1, -1].forEach(function (s) { MECA.roulement(gg, b[0], yc - s * r, l, h, { type: "conique", sens: s }); });
      });
      // rondelle plate, rondelle frein, écrou à encoches (côté droit, en coupe)
      var pieces = [[452, 10, "#dfe3ea", "rondelle plate", 132], [466, 8, "#c6cbd8", "rondelle frein", 96], [478, 36, "#9aa0ad", "écrou à encoches", 60]];
      pieces.forEach(function (q) {
        [1, -1].forEach(function (s) { E.s("rect", { x: q[0], y: s > 0 ? yc - r - 50 : yc + r, width: q[1], height: 50, fill: q[2], stroke: C.encre, "stroke-width": 2 }, g); });
        D.ligne(g, [q[0] + q[1] / 2, yc - r - 50], [q[0] + q[1] / 2, q[4]], C.encre, 1.5);
        D.texte(g, q[3], [q[0] + q[1] / 2 - 8, q[4]], { taille: 18, ancre: "end" });
      });
      D.texte(g, "logement tournant, arbre fixe", [340, 548], { taille: 20, coul: C.doux });
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "coniques") { coniques(); return; }
      var t = n.tenus, cote = !(t.Gi && t.Ge) ? "G" : !(t.Di && t.De) ? "D" : null, bloque = !cote, d = bloque ? 0 : n.dil * 30; // px de dilatation (très agrandie)
      // l'arbre s'allonge vers le palier libre ; ce roulement suit l'arbre si sa bague intérieure est tenue sur l'arbre
      var dec = { G: cote === "G" && t.Gi ? -d : 0, D: cote === "D" && t.Di ? d : 0 };
      var H = MECA.hachures(g, "#9aa0ad", { fond: "#fff" });
      // logement
      [-1, 1].forEach(function (s) {
        var y0 = s < 0 ? yc - r - h - 46 : yc + r + h;
        E.s("rect", { x: 80, y: y0, width: 520, height: 46, fill: H, stroke: C.encre, "stroke-width": 2 }, g);
      });
      // arbre (il s'allonge vers la droite à partir du palier gauche)
      var chaud = n.dil > 0;
      E.s("rect", { x: 60 - (cote === "G" ? d : 0), y: yc - r, width: 560 + d, height: 2 * r, fill: chaud ? (bloque ? "#fbd4d5" : "#ffe9d6") : "#e8edf5", stroke: C.encre, "stroke-width": 2 }, g);
      MECA.traitAxe(g, [40, yc], [650, yc]);
      ["G", "D"].forEach(function (k) {
        var x = xs[k] + dec[k];
        [1, -1].forEach(function (s) {
          MECA.roulement(g, x, yc - s * r, l, h, { type: "billes", sens: s, surligne: n.choisi && n.choisi[0] === k ? (n.choisi[1] === "e" ? "exterieure" : "interieure") : null, surligneCoul: n.choisiOk ? C.ok : C.ko });
          // arrêts axiaux : petits blocs noirs contre les faces des bagues tenues
          [["e", s > 0 ? yc - r - h : yc + r + h - bague, xs[k]], ["i", s > 0 ? yc - r - bague : yc + r, x]].forEach(function (b) {
            if (!t[k + b[0]]) return;
            var bx = b[0] === "e" ? xs[k] : x;
            [-1, 1].forEach(function (c) { E.s("rect", { x: bx + c * (l / 2 + 4) - 4, y: b[1], width: 8, height: bague, fill: C.encre }, g); });
          });
        });
        n.cibles[k + "e"] = [x, yc - r - h + bague / 2]; n.cibles[k + "i"] = [x, yc - r - bague / 2];
      });
      // bague coulissante : jeu visible
      ["G", "D"].forEach(function (k) {
        ["e", "i"].forEach(function (b) {
          if (t[k + b]) return;
          var x = xs[k] + dec[k];
          if (b === "e") D.texte(g, "coulissante", [x, yc - r - h - 64], { taille: 18, coul: C.ok });
          else D.texte(g, "bague intérieure coulissante", [x, yc + 2], { taille: 16, coul: C.ok });
        });
      });
      if (n.dil > 0) {
        if (bloque) {
          D.fleche(g, [xs.D + 120, yc], [xs.D + 50, yc], C.ko, 7); D.fleche(g, [xs.G - 120, yc], [xs.G - 50, yc], C.ko, 7);
          D.texte(g, "l'arbre ne peut pas s'allonger : efforts axiaux parasites", [340, 572], { taille: 19, coul: C.ko });
        } else D.texte(g, "l'arbre s'allonge librement (dilatation agrandie)", [340, 572], { taille: 19, coul: C.ok });
      }
      if (n.legende) D.texte(g, n.legende, [340, 90], { taille: 21, coul: C.doux });
    };
    n.chauffer = function (fin) { E.anime(1200, function (e) { n.dil = e; n.dessin(); }, fin); };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche) return false;
        var best = null, dm = 40;
        Object.keys(n.cibles).forEach(function (k) {
          var c = n.cibles[k], sym = [c[0], 2 * yc - c[1]];
          [c, sym].forEach(function (q) { var dd = Math.hypot(p[0] - q[0], p[1] - q[1]); if (dd < dm) { dm = dd; best = k; } });
        });
        if (best) n.surTouche(best);
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Il chauffe", jouer: function (j, n) {
      n.legende = "toutes les bagues sont tenues axialement"; n.dessin();
      j.fig.astuce("Les blocs noirs : arrêts axiaux des bagues.");
      j.titre("Le moteur chauffe l'arbre, qui s'allonge. Toutes les bagues sont tenues. Que se passe-t-il ?");
      j.choix([
        { html: "L'arbre ne peut pas s'allonger : il est sur-contraint, des efforts axiaux parasites chargent les roulements", juste: true },
        { html: "Rien, les roulements tournent toujours", aide: "Ils tournent, mais regarde les arrêts : rien ne laisse l'arbre s'allonger entre les deux roulements." },
        { html: "L'arbre se raccourcit", aide: "Un métal qui chauffe se dilate : il s'allonge." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Montage hyperstatique : la dilatation est empêchée.");
        n.chauffer(function () { j.suite(); });
      } });
    } },
    { nom: "Libérer", jouer: function (j, n) {
      n.dil = 0; n.legende = "arbre tournant, charge de direction fixe"; n.tenus = { Gi: true, Ge: true, Di: true, De: true }; n.dessin();
      j.fig.astuce("Touche une bague sur la figure.");
      j.titre("L'arbre tourne. Ses deux bagues intérieures restent tenues. Touche la bague à rendre coulissante pour laisser l'arbre s'allonger.");
      n.libre = true;
      n.surTouche = function (k) {
        if (!n.libre) return;
        n.choisi = k; n.choisiOk = k[1] === "e";
        if (!n.choisiOk) { n.dessin(); j.erreur("Les bagues intérieures tournent avec l'arbre : elles restent tenues. Cherche une bague extérieure."); setTimeout(function () { if (n.libre) { n.choisi = null; n.dessin(); } }, 900); return; }
        n.libre = false; n.surTouche = null;
        n.tenus = { Gi: true, Ge: true, Di: true, De: true }; n.tenus[k] = false;
        n.dessin();
        j.bravo("Une bague extérieure coulissante : ce roulement devient le palier libre.");
        n.chauffer(function () {
          j.expliquer("<p>Un montage <b>fixe-libre</b> définit axialement l'arbre sans le sur-contraindre lors des variations thermiques. Le palier fixe assure le positionnement axial ; le palier libre permet le déplacement axial relatif nécessaire à la dilatation. Ici, les deux bagues intérieures sont maintenues latéralement et un roulement a sa bague extérieure coulissante (jeu ≈ 0,1).</p>");
          j.suite();
        });
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("De"); });
    } },
    { nom: "Logement tournant", jouer: function (j, n) {
      n.dil = 0; n.choisi = null; n.legende = "logement tournant, charge de direction fixe"; n.tenus = { Gi: true, Ge: true, Di: true, De: true }; n.dessin();
      j.fig.astuce("Cette fois, c'est le logement qui tourne autour de l'arbre.");
      j.titre("À l'inverse, c'est le logement qui tourne. Quelles bagues sont maintenues axialement ?");
      j.choix([
        { html: "Les deux bagues extérieures, et une bague intérieure coulisse", juste: true },
        { html: "Les deux bagues intérieures, et une bague extérieure coulisse", aide: "Ça, c'est le cas de l'arbre tournant. Ici, ce sont les bagues qui tournent avec le logement qu'on tient." },
        { html: "Les quatre bagues", aide: "On retomberait sur le montage sur-contraint du début." }
      ], { colonnes: 1, ok: function () {
        n.tenus = { Gi: true, Ge: true, Di: false, De: true }; n.dessin();
        j.bravo("Bagues extérieures tenues, une bague intérieure coulissante.");
        n.chauffer(function () {
          j.expliquer("<p>Le maintien axial de la bague intérieure du roulement fixe peut se faire par écrou à encoches et rondelle frein : il assure une excellente sécurité.</p>");
          j.suite();
        });
      } });
    } },
    { nom: "Pourquoi un fixe ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Pourquoi ne pas rendre les deux roulements libres, pour être tranquille avec la dilatation ?");
      j.choix([
        { html: "Il faut un palier fixe pour positionner l'arbre axialement", juste: true },
        { html: "Deux paliers libres coûteraient plus cher", aide: "Le coût n'est pas la raison : imagine une charge axiale sur l'arbre." },
        { html: "La dilatation serait alors empêchée", aide: "Au contraire, rien ne la gênerait. Mais qu'est-ce qui tiendrait l'arbre dans l'axe ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("Sans palier fixe, l'arbre se déplacerait le long de son axe.");
        j.suite();
      } });
    } },
    { nom: "Rouleaux coniques", jouer: function (j, n) {
      j.fig.astuce("");
      n.mode = "coniques"; n.dessin();
      j.titre("Montage à rouleaux coniques, logement tournant, arbre fixe. Associe chaque pièce à son rôle.");
      var L = [["écrou à encoches", "jeu"], ["rondelle frein", "frein"], ["rondelle plate", "pression"]];
      var z = j.zone("", L.map(function (x) { return '<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><span style="width:160px;font-size:17px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '" style="flex:1"></span></div>'; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "pression", html: "pression de contact uniforme" }, { id: "jeu", html: "règle le jeu de fonctionnement" }, { id: "frein", html: "empêche le desserrage de l'écrou" }],
        aide: "L'écrou se visse pour rapprocher les bagues ; la rondelle frein bloque l'écrou ; la rondelle plate répartit l'appui sur la bague.",
        ok: function () {
          j.bravo("Réglage simple et précis du jeu.");
          j.expliquer("<p>Le réglage du jeu de fonctionnement est obtenu par un écrou à encoches et une rondelle frein. Une rondelle plate, interposée entre la rondelle frein et la bague intérieure, donne une pression de contact uniforme ; elle est immobilisée en rotation par une languette logée dans une rainure de l'arbre.</p>");
          j.suite();
        }
      });
    } }
  ]
});
