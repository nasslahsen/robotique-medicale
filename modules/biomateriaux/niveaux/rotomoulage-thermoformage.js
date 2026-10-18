/* Niveau : rotomoulage et thermoformage. Pièce creuse sans soudure, choix du produit, aspiration, cycle en cinq temps, matière, blister. */
NIVEAU({
  id: "rotomoulage-thermoformage",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "roto", a: 0, p: 0, k: 1, aspi: 0, libre: false };
    var JAUNE = "#e8b931";
    function resistance(y, x0, x1) {
      var d = "M" + x0 + " " + y;
      for (var x = x0; x < x1; x += 20) d += " q5 -14 10 0 q5 14 10 0";
      E.s("path", { d: d, fill: "none", stroke: "#e5484d", "stroke-width": 3 }, g);
    }
    function roto() {
      var c = [340, 330], R = 130;
      resistance(150, 180, 500); resistance(512, 180, 500);
      D.texte(g, "moule chauffé", [340, 128], { taille: 15, coul: C.doux });
      var pts = [];
      for (var i = 0; i < 6; i++) { var t = (i * 60 + 30 + n.a) * Math.PI / 180; pts.push([c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)]); }
      var dp = "M" + pts.map(function (q) { return q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" L") + " Z";
      E.s("path", { d: dp, fill: "#fff", stroke: "#5b6172", "stroke-width": 16, "stroke-linejoin": "round" }, g);
      // couche de matière fondue sur la paroi
      if (n.p > 0) {
        var pi = pts.map(function (q) { return [c[0] + (q[0] - c[0]) * 0.9, c[1] + (q[1] - c[1]) * 0.9]; });
        E.s("path", { d: "M" + pi.map(function (q) { return q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" L") + " Z", fill: "none", stroke: PLATEFORME.teinte(0.8), "stroke-width": 22 * n.p, "stroke-linejoin": "round" }, g);
      }
      // poudre restante, toujours en bas (pesanteur)
      var reste = 1 - n.p;
      if (reste > 0.02) {
        var rr = BIO.hasard(7);
        for (var k = 0; k < Math.round(70 * reste); k++) D.rond(g, [c[0] + (rr() - 0.5) * 150 * Math.sqrt(reste), c[1] + 92 - rr() * 40 * reste], 4, { fill: PLATEFORME.teinte(0.55) });
      }
      // flèches de rotation sur deux axes
      E.s("path", { d: "M560 270 A40 40 0 1 1 560 350", fill: "none", stroke: "#3b5bdb", "stroke-width": 4 }, g);
      D.fleche(g, [566, 345], [552, 352], "#3b5bdb", 4);
      E.s("path", { d: "M300 560 A40 14 0 1 0 380 560", fill: "none", stroke: "#3b5bdb", "stroke-width": 4 }, g);
      D.texte(g, "rotation sur deux axes", [580, 395], { taille: 15, coul: "#3b5bdb" });
      D.texte(g, n.p > 0.95 ? "pièce creuse, d'un seul tenant" : "poudre", [340, 330], { taille: 16, coul: C.jeu });
    }
    function thermo() {
      var k = n.k, monte = k >= 2 && k < 5 ? 1 : 0, cy = 262;
      // table, platine, moule
      var dy = monte ? 0 : 150;
      E.s("rect", { x: 120, y: 470, width: 440, height: 20, fill: "#5b6172" }, g);
      D.texte(g, "table", [590, 480], { taille: 15, coul: C.doux, ancre: "start" });
      E.s("rect", { x: 300, y: cy + dy, width: 80, height: 470 - cy - dy, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 210, y: cy + dy, width: 260, height: 14, rx: 3, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      D.texte(g, "platine", [490, cy + dy + 8], { taille: 15, coul: C.doux, ancre: "start" });
      var top = cy - 110 + dy;
      E.s("path", { d: "M235 " + (cy + dy) + " L285 " + top + " L395 " + top + " L445 " + (cy + dy) + " Z", fill: "#dfe3ec", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      D.texte(g, "moule", [340, top + 50], { taille: 16, coul: C.doux });
      // pompe à vide
      E.s("path", { d: "M340 470 L340 540 L500 540", fill: "none", stroke: "#3b5bdb", "stroke-width": 4, "stroke-dasharray": k === 3 || k === 4 ? "8 6" : null }, g);
      E.s("rect", { x: 500, y: 520, width: 90, height: 40, rx: 8, fill: "#fff", stroke: "#3b5bdb", "stroke-width": 3 }, g);
      D.texte(g, "pompe à vide", [545, 540], { taille: 14, coul: "#3b5bdb" });
      // feuille tenue par le cadre
      var s = k >= 3 ? 1 : n.aspi, f;
      if (k === 1 || (k === 2 && s === 0 && !monte)) f = "M160 " + cy + " L520 " + cy;
      else if (k === 5) f = "M160 " + cy + " L235 " + cy + " L285 " + (cy - 110) + " L395 " + (cy - 110) + " L445 " + cy + " L520 " + cy;
      else {
        // de la tente (feuille posée sur le moule) à la feuille plaquée
        var xa = 160 + (235 - 160) * s, xb = 520 - (520 - 445) * s;
        f = "M160 " + cy + " L" + xa + " " + cy + " L285 " + (cy - 110) + " L395 " + (cy - 110) + " L" + xb + " " + cy + " L520 " + cy;
      }
      E.s("path", { d: f, fill: "none", stroke: C.jeu, "stroke-width": 7, "stroke-linejoin": "round" }, g);
      [150, 520].forEach(function (x) { E.s("rect", { x: x - 6, y: cy - 14, width: 22, height: 28, fill: "#5b6172" }, g); });
      if (k === 1) {
        E.s("rect", { x: 170, y: cy - 70, width: 340, height: 16, rx: 6, fill: JAUNE }, g);
        E.s("rect", { x: 170, y: cy + 54, width: 340, height: 16, rx: 6, fill: JAUNE }, g);
        D.texte(g, "chauffage", [340, cy - 92], { taille: 16, coul: "#a07c10" });
      }
      if (k === 3 || (k === 2 && n.aspi > 0 && n.aspi < 1)) [270, 410].forEach(function (x) { D.fleche(g, [x, cy - 50], [x + (x < 340 ? -14 : 14), cy - 8], "#3b5bdb", 3); });
      if (k === 4) [[260, 120], [420, 120]].forEach(function (q) { D.rond(g, q, 22, { fill: "#fff", stroke: "#3b5bdb", ep: 3 }); D.ligne(g, [q[0] - 14, q[1]], [q[0] + 14, q[1]], "#3b5bdb", 3); D.fleche(g, [q[0], q[1] + 26], [q[0], q[1] + 60], "#3b5bdb", 3); });
      if (k === 5) { D.texte(g, "découpe au pourtour", [340, cy - 140], { taille: 15, coul: C.encre }); [228, 452].forEach(function (x) { D.ligne(g, [x, cy - 22], [x, cy + 22], C.encre, 2, "5 4"); }); }
      var noms = ["", "1 chauffage", "2 montée du moule", "3 aspiration", "4 refroidissement", "5 démoulage"];
      fig.chip(noms[k]);
    }
    n.dessin = function () { E.vider(g); if (n.mode === "roto") { fig.chip(null); roto(); } else thermo(); };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Prédire le rotomoulage", jouer: function (j, n) {
      j.fig.astuce("De la poudre de plastique dans un moule fermé et chauffé.");
      j.titre("On fait tourner ce moule chauffé dans tous les sens. Prédis la pièce obtenue.");
      j.choix([
        { html: "Une pièce pleine", aide: "La poudre fond au contact de la paroi chaude et s'y colle en couche : le centre reste vide." },
        { html: "Une pièce creuse, sans soudure ni collage", juste: true },
        { html: "Deux demi-coques qu'il faudra coller", aide: "La poudre se dépose partout sur la paroi en même temps : la pièce se forme d'un seul tenant." }
      ], { colonnes: 1, ok: function () {
        E.anime(2200, function (u) { n.a = 360 * u * 1.5; n.p = u; n.dessin(); }, function () {
          j.bravo("Creuse, d'un seul tenant.", [340, 330]);
          j.expliquer("<p><b>Rotomoulage</b> : moulage qui se fait en insérant la matière plastique sous forme de poudre dans un moule ; en faisant faire des rotations au moule chauffé, on obtient des pièces creuses sans soudure ni collage.</p>");
          j.suite();
        });
      } });
    } },
    { nom: "Le bon produit", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Pour lequel de ces produits le rotomoulage est-il le bon choix ?");
      j.choix([
        { html: "Une citerne de stockage de 1 000 L", juste: true },
        { html: "Un million de bouchons par jour", aide: "Le cycle de rotomoulage est assez long : pour des petites pièces en très grande série, il n'est pas rentable." },
        { html: "Un film pour sacs de congélation", aide: "Un film mince en continu sort d'une extrusion-gonflage, pas d'un moule fermé." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Une grande pièce creuse.");
        j.expliquer("<p>Indice du rotomoulage : une pièce creuse de toute dimension, avec un temps de cycle assez long (rentabilité). Exemples du cours : citernes, kayaks, réservoirs, planche à voile.</p>");
        j.suite();
      } });
    } },
    { nom: "Aspirer", jouer: function (j, n) {
      n.mode = "thermo"; n.k = 2; n.aspi = 0; n.libre = true; n.dessin();
      j.fig.astuce("Thermoformage d'un blister : la feuille chaude, ramollie, est posée sur le moule.");
      j.titre("Retire l'air entre le moule et la feuille jusqu'à ce qu'elle épouse le moule.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.aspi = 1; n.k = 3; n.dessin(); c.regler(100);
        j.bravo("La feuille est plaquée sur le moule.", [340, 200]);
        j.expliquer("<p><b>Thermoformage</b> : en chauffant la feuille de plastique, celle-ci se ramollit ; on applique cette feuille encore chaude sur le moule ; on retire l'air contenu entre le moule et la feuille.</p>");
        j.suite();
      }
      var c = j.curseur({ nom: "pompe à vide", min: 0, max: 100, pas: 5, val: 0, unite: " %", change: function (v) {
        if (!n.libre) return;
        n.aspi = v / 100; n.dessin();
        if (v >= 100) gagne();
      } });
      j.reponse(gagne);
    } },
    { nom: "Le cycle en cinq temps", jouer: function (j, n) {
      n.k = 5; n.dessin();
      j.fig.astuce("");
      j.titre("Remets dans l'ordre le déroulement d'un cycle de thermoformage.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        ["c", "m", "a", "r", "d"].map(function (id, k) { return "<b>" + (k + 1) + '</b><span class="trou" data-attendu="' + id + '" style="justify-content:flex-start"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "Aspiration" }, { id: "d", html: "Démoulage" }, { id: "c", html: "Chauffage" }, { id: "r", html: "Refroidissement" }, { id: "m", html: "Montée du moule" }],
        aide: "La feuille doit être molle avant de toucher le moule, plaquée avant de refroidir, et dure avant de quitter le moule.",
        ok: function () {
          var k = 0;
          (function pas() { k++; n.k = k; n.dessin(); if (k < 5) setTimeout(pas, 450); else {
            j.bravo("Chauffage, montée du moule, aspiration, refroidissement, démoulage.");
            j.expliquer("<p>Après le démoulage, on découpe la pièce au pourtour. Indice du thermoformage : pièce plutôt mince, à coins arrondis, avec moins de finition, et l'on aperçoit la découpe au pourtour.</p>");
            j.suite();
          } })();
        }
      });
    } },
    { nom: "La matière", jouer: function (j, n) {
      j.titre("Le cours cite PS, PE, PP, PC, ABS, PVC, PMMA et SB pour le thermoformage. Pourquoi pas une résine époxy durcie ?");
      j.choix([
        { html: "Une fois durcie, elle ne se ramollit plus à la chaleur : la feuille ne pourrait pas être formée", juste: true },
        { html: "Elle est trop légère", aide: "La légèreté n'empêche rien. Regarde la première étape du cycle : que doit faire la feuille quand on la chauffe ?" },
        { html: "Elle est trop transparente", aide: "Le PMMA et le PC de la liste sont transparents. Le problème vient du comportement à la chaleur." }
      ], { colonnes: 1, ok: function () {
        j.bravo("L'époxy est un thermodurcissable.");
        j.expliquer("<p>Toute la liste du cours est faite de thermoplastiques : ils se ramollissent quand on les chauffe. Un thermodurcissable durci se dégrade au lieu de se ramollir.</p>");
        j.suite();
      } });
    } },
    { nom: "Le blister", jouer: function (j, n) {
      j.titre("Un blister de comprimés : mince, alvéoles à coins arrondis, bord découpé tout autour. Quel procédé ?");
      j.choix([
        { html: "Rotomoulage", aide: "Le rotomoulage donne des pièces creuses fermées, d'un seul tenant." },
        { html: "Thermoformage", juste: true },
        { html: "Injection", aide: "Une pièce injectée est épaisse, finie, avec un petit point d'injection ; ici on voit une découpe au pourtour." }
      ], { ok: function () {
        j.bravo("Thermoformage : on voit la découpe au pourtour.");
        j.expliquer("<p>Exemples du cours : barquettes alimentaires, coques de bateaux, enseignes publicitaires. Exemple ajouté : les blisters de médicaments sont thermoformés de la même façon.</p>");
        j.suite();
      } });
    } }
  ]
});
