/* Niveau : métaux et alliages. Électrons libres, isotropie, caractéristiques générales, tige fémorale en titane. */
NIVEAU({
  id: "metaux",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "reseau", tension: false, dec: 0, angle: 0, libre: true };
    n.pl = D.plan(svg, [340, 320], 170); // repère du cercle (gestes des tests)
    var r = BIO.hasard(7), electrons = [];
    for (var k = 0; k < 3; k++) for (var q = 0; q < 6; q++) electrons.push([90 + q * 90 + r() * 60, 225 + k * 90 + (r() - 0.5) * 20]);
    for (k = 0; k < 4; k++) for (q = 0; q < 5; q++) if (r() < 0.6) electrons.push([164 + q * 88 + (r() - 0.5) * 20, 180 + k * 90 + (r() - 0.5) * 16]);
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "reseau") {
        // réseau d'ions positifs (cations) et électrons libres
        E.s("rect", { x: 60, y: 130, width: 560, height: 370, rx: 24, fill: "#eef0f5", stroke: "#c6cbd8", "stroke-width": 2 }, g);
        for (var i = 0; i < 6; i++) for (var jj = 0; jj < 4; jj++) {
          var c = [120 + i * 88, 180 + jj * 90];
          D.rond(g, c, 24, { fill: "#c9ced9", stroke: C.encre, ep: 2.5 });
          D.texte(g, "+", [c[0], c[1] + 1], { taille: 24, fond: false });
        }
        electrons.forEach(function (e) {
          var x = 60 + ((e[0] - 60 + n.dec) % 560 + 560) % 560;
          D.rond(g, [x, e[1]], 7, { fill: D.C.acc });
        });
        D.texte(g, "ion positif (cation)", [120, 540], { ancre: "start", taille: 17 });
        D.rond(g, [100, 540], 12, { fill: "#c9ced9", stroke: C.encre, ep: 2 });
        D.rond(g, [370, 540], 7, { fill: D.C.acc });
        D.texte(g, "électron libre (mobile)", [386, 540], { ancre: "start", taille: 17 });
        if (n.tension) {
          D.texte(g, "−", [40, 315], { taille: 34, coul: C.ko }); D.texte(g, "+", [640, 315], { taille: 34, coul: C.ok });
          D.fleche(g, [250, 100], [430, 100], D.C.acc, 5);
          D.texte(g, "les électrons se déplacent", [340, 72], { taille: 17, coul: D.C.acc });
        }
      } else if (n.mode === "isotrope") {
        var ctr = [340, 320];
        for (var a = 0; a < 360; a += 30) {
          var t = a * D.DEG;
          D.ligne(g, ctr, [ctr[0] + 200 * Math.cos(t), ctr[1] - 200 * Math.sin(t)], "#d9dde6", 2);
        }
        E.s("circle", { cx: ctr[0], cy: ctr[1], r: 170, fill: PLATEFORME.teinte(0.12), stroke: C.jeu, "stroke-width": 4 }, g);
        var t2 = n.angle * D.DEG, bout = [ctr[0] + 170 * Math.cos(t2), ctr[1] - 170 * Math.sin(t2)];
        D.fleche(g, ctr, bout, D.C.acc, 6);
        D.rond(g, ctr, 26, { fill: "#c9ced9", stroke: C.encre, ep: 3 });
        D.texte(g, "+", [ctr[0], ctr[1] + 1], { taille: 26, fond: false });
        D.texte(g, "force de liaison selon la direction", [340, 110], { taille: 18, coul: C.doux, gras: false });
        if (n.libre) D.poignee(g, bout, D.C.acc); else D.rond(g, bout, 9, { fill: D.C.acc, stroke: "#fff", ep: 3 });
        fig.chip(Math.round(n.angle) + "°");
      } else {
        // tige fémorale : deux matériaux, même volume
        fig.chip(null);
        [["Ti-6Al-4V", "#b8c0cc", 190], ["acier inox 17-7 PH", "#8e97a6", 490]].forEach(function (m) {
          var x = m[2];
          E.s("path", { d: "M" + (x - 30) + " 170 Q" + (x - 10) + " 130 " + (x + 40) + " 120 L" + (x + 60) + " 150 Q" + (x + 10) + " 170 " + (x + 18) + " 220 L" + (x + 6) + " 500 Q" + x + " 520 " + (x - 6) + " 500 L" + (x - 22) + " 220 Z", fill: m[1], stroke: C.encre, "stroke-width": 3 }, g);
          D.rond(g, [x + 64, 118], 34, { fill: "#f4f1ea", stroke: C.encre, ep: 3 });
          D.texte(g, m[0], [x + 10, 545], { taille: 18 });
        });
        D.texte(g, "deux tiges de même volume : 100 cm³", [340, 590], { taille: 18, coul: C.doux, gras: false });
      }
    };
    D.glisser(svg, {
      debut: function () { return n.mode === "isotrope" && n.libre; },
      bouge: function (p) { if (!n.libre) return; n.angle = E.angle360(Math.atan2(320 - p[1], p[0] - 340) / D.DEG); n.dessin(); if (n.surAngle) n.surAngle(n.angle); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Une tension", jouer: function (j, n) {
      j.fig.astuce("Ions positifs et électrons libres : la liaison métallique.");
      j.titre("On branche ce métal sur une pile. Lance la tension et regarde ce qui bouge.");
      var b = E.h("button", "btn bleu", "Appliquer une tension", j.el); b.type = "button";
      var lance = function () {
        if (n.tension) return;
        n.tension = true; b.remove();
        E.anime(1600, function (u) { n.dec = 220 * u; n.dessin(); });
        j.consigne("Pourquoi les métaux conduisent-ils l'électricité ?");
        j.choix([
          { html: "Les ions positifs se déplacent", aide: "Regarde la figure : les gros ions restent à leur place." },
          { html: "Des électrons mobiles circulent dans la structure", juste: true },
          { html: "La liaison est faible et se casse", aide: "La liaison métallique est forte ; rien ne casse ici." }
        ], { colonnes: 1, ok: function () {
          j.bravo("Conductivité = présence d'électrons mobiles dans la structure.");
          j.expliquer("<p>Les métaux sont surtout utilisés sous forme d'<b>alliages</b>. Leurs propriétés proviennent des <b>liaisons métalliques</b> : des ions positifs (cations) baignés d'électrons libres.</p>");
          j.suite();
        } });
      };
      b.addEventListener("click", lance);
      j.reponse(function () { lance(); });
    } },
    { nom: "Isotrope", jouer: function (j, n) {
      n.mode = "isotrope"; n.dessin();
      j.fig.astuce("Fais tourner la flèche autour de l'ion.");
      j.titre("Fais faire un demi-tour à la flèche, jusqu'à 180°. La force de la liaison change-t-elle avec la direction ?");
      n.surAngle = function (a) {
        if (Math.abs(Math.abs(a) - 180) > 6) return;
        n.surAngle = null; n.libre = false; n.angle = 180; n.dessin();
        j.consigne("Comment appelle-t-on une liaison qui agit de la même manière dans toutes les directions ?");
        j.choix([{ html: "Isotrope", juste: true }, { html: "Orientée", aide: "Une liaison orientée dépend de la direction ; ici le cercle a le même rayon partout." }, { html: "Faible", aide: "Faible ou forte parle de l'énergie, pas de la direction." }], { ok: function () {
          j.bravo("Isotrope : même force dans toutes les directions.");
          j.expliquer("<p>Liaison métallique = liaison <b>forte, uniforme et isotrope</b>, d'où une structure cristalline compacte et symétrique.</p>");
          j.suite();
        } });
      };
      j.reponse(function () { n.libre = true; if (n.surAngle) n.surAngle(180); });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "reseau"; n.tension = false; n.dec = 0; j.fig.chip(null); n.dessin();
      j.fig.astuce("");
      j.titre("Une fiche dit : « Les métaux sont opaques et brillants, conducteurs, à modules faibles, ductiles et/ou durs, résistants à la corrosion. » Quel mot est faux ?");
      j.choix([
        { html: "opaques et brillants", aide: "C'est bien une caractéristique des métaux : ils ne laissent pas passer la lumière et la réfléchissent." },
        { html: "modules faibles", juste: true },
        { html: "ductiles et/ou durs", aide: "Juste : on peut les étirer sans rupture, ou ils résistent à la pénétration." },
        { html: "résistants à la corrosion", aide: "C'est dans la liste du cours, surtout pour les alliages." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Les métaux ont des modules élevés.");
        j.expliquer("<p>Caractéristiques générales des métaux : <b>opaques et brillants</b>, conducteurs, <b>modules élevés</b>, ductiles et/ou durs, résistants à la corrosion. La diapo écrit « conducteurs / isolants » : les métaux sont conducteurs ; ce sont les céramiques et les polymères qui isolent.</p>");
        j.suite();
      } });
    } },
    { nom: "Ductile ou dur", jouer: function (j, n) {
      j.titre("Associe chaque mot à sa définition.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;font-size:18px">' +
        '<span>Qui peut être allongé, étendu, étiré sans se rompre</span><span class="trou" data-attendu="d" style="min-width:120px"></span>' +
        '<span>Qui résiste à la pression (pénétration)</span><span class="trou" data-attendu="u" style="min-width:120px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "u", html: "dur" }, { id: "f", html: "fragile" }, { id: "d", html: "ductile" }],
        aide: "Un fil de cuivre qu'on étire est l'image de l'un ; une pointe qui ne s'enfonce pas, de l'autre.",
        ok: function () {
          j.bravo("Ductile s'étire, dur résiste à la pénétration.");
          j.expliquer("<p>Sur la courbe de traction (chapitre 0), un métal ductile a un long domaine de déformation permanente avant la rupture. Un même métal peut être ductile et dur à la fois.</p>");
          j.suite();
        }
      });
    } },
    { nom: "La tige fémorale", jouer: function (j, n) {
      n.mode = "tige"; n.dessin();
      j.titre("Une tige de prothèse de hanche de 100 cm³. Masse en Ti-6Al-4V (4,43 g/cm³), puis en acier inoxydable 17-7 PH (7,87 g/cm³) ?");
      j.nombre({ avant: "m_{Ti},\\ m_{acier} =", apres: "\\text{g}", cases: [{ attendu: 443, tol: 1 }, { attendu: 787, tol: 1 }], ligne: true,
        aide: function () { return "m = ρ × V, avec V = 100 cm³."; },
        ok: function () {
          j.bravo("443 g contre 787 g.");
          j.expliquer("<p>Le titane allié est presque deux fois plus léger pour un module encore élevé (110 GPa contre 196 GPa, tableau du cours). Exemple ajouté, valeurs du tableau des renforts du cours.</p>");
          j.suite();
        } });
    } }
  ]
});
