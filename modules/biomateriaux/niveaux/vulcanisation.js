/* Niveau : la vulcanisation. Poser des ponts, trois systèmes, effet du taux de soufre, noir de carbone, temps de vulcanisation et réversion. */
NIVEAU({
  id: "vulcanisation",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "ponts", ponts: [], libre: true, sMontre: null, zone: null };
    // trois chaînes et six emplacements de pont entre deux chaînes voisines
    function yCh(c, x) { return 210 + c * 120 + 26 * Math.sin(x / 45 + c * 2.1); }
    n.sites = [[150, 0], [330, 0], [520, 0], [220, 1], [420, 1], [580, 1]].map(function (s) { return { x: s[0], c: s[1], y1: yCh(s[1], s[0]), y2: yCh(s[1] + 1, s[0]) }; });
    // modèle qualitatif des courbes du cours (0, 2, 10, 30 % de soufre)
    n.courbe = function (T, s) { return s === 0 ? BIO.logModule(T, { Tg: -60, Tl: 30 }) : BIO.logModule(T, { Tg: -60 + 3.4 * s, caout: 6 + 0.025 * s, Tl: Infinity }); };
    var X0 = 100, X1 = 620, Y0 = 470, Y1 = 140;
    function px(T) { return X0 + (T + 120) / 270 * (X1 - X0); }
    function py(l) { return Y0 - (l - 3) / 7 * (Y0 - Y1); }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "ponts") {
        for (var c = 0; c < 3; c++) {
          var pts = []; for (var x = 50; x <= 630; x += 15) pts.push([x, yCh(c, x)]);
          E.s("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: C.encre, "stroke-width": 3.5, "stroke-linecap": "round" }, g);
        }
        n.sites.forEach(function (s, i) {
          if (n.ponts.indexOf(i) >= 0) {
            D.ligne(g, [s.x, s.y1], [s.x, s.y2], C.jeu, 6);
            D.texte(g, "S–S", [s.x + 26, (s.y1 + s.y2) / 2], { taille: 16, coul: C.jeu, ancre: "start" });
          } else if (n.libre) {
            D.ligne(g, [s.x, s.y1 + 8], [s.x, s.y2 - 8], "#c6cbd8", 2.5, "4 6");
            D.rond(g, [s.x, (s.y1 + s.y2) / 2], 14, { fill: "#fff", stroke: C.acc, ep: 3 });
          }
        });
        D.texte(g, "élastomère insaturé + soufre", [340, 140], { taille: 19, coul: C.doux });
        fig.chip("ponts : " + n.ponts.length + " / 3");
      } else if (n.mode === "courbes") {
        fig.chip(null);
        D.fleche(g, [X0, Y0], [X1 + 20, Y0], C.encre, 3); D.fleche(g, [X0, Y0], [X0, Y1 - 30], C.encre, 3);
        D.texte(g, "T (°C)", [X1 + 4, Y0 + 34], { taille: 16 }); D.texte(g, "log G (Pa)", [X0 + 8, Y1 - 44], { taille: 16, ancre: "start" });
        [-100, -50, 0, 50, 100].forEach(function (t) { D.ligne(g, [px(t), Y0], [px(t), Y0 + 8], C.encre, 2); D.texte(g, String(t).replace("-", "−"), [px(t), Y0 + 24], { taille: 15, gras: false, mono: true }); });
        [9, 8, 7, 6].forEach(function (l) { D.texte(g, String(l), [X0 - 14, py(l)], { taille: 15, ancre: "end", gras: false, mono: true }); D.ligne(g, [X0 - 6, py(l)], [X0, py(l)], C.encre, 2); });
        var taux = n.noir ? [0, 2] : n.sMontre === null ? [0] : [0, 2, 10, 30];
        taux.forEach(function (s, k) {
          var pts = []; for (var T = -120; T <= 140; T += 2) pts.push([px(T), py(n.courbe(T, s))]);
          var fort = s === n.sMontre || (n.sMontre === null && s === 0);
          E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: fort ? C.jeu : PLATEFORME.teinte(0.45), "stroke-width": fort ? 5 : 3.5 }, g);
          var Tl = s === 0 ? 20 : Math.min(120, -60 + 3.4 * s + 70);
          D.texte(g, s + " %", [px(Tl), py(n.courbe(Tl, s)) - 18], { taille: 16, coul: C.jeu });
        });
        if (n.noir) {
          var pts2 = []; for (var T2 = -120; T2 <= 140; T2 += 2) pts2.push([px(T2), py(BIO.logModule(T2, { Tg: -60 + 3.4 * 2, caout: 6.6, Tl: Infinity }))]);
          E.s("polyline", { points: pts2.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.encre, "stroke-width": 4, "stroke-dasharray": "10 6" }, g);
          D.texte(g, "2 % + noir de carbone", [px(70), py(7.3)], { taille: 16 });
        }
      } else {
        fig.chip(null);
        // module en fonction du temps de cuisson
        var ox = 90, oy = 450;
        D.fleche(g, [ox, oy], [630, oy], C.encre, 3); D.fleche(g, [ox, oy], [ox, 120], C.encre, 3);
        D.texte(g, "temps", [610, oy + 28], { taille: 16 }); D.texte(g, "module", [ox + 8, 110], { taille: 16, ancre: "start" });
        n.zones = [[110, 290, "montee"], [290, 460, "plateau"], [460, 620, "reversion"]];
        n.zones.forEach(function (z) { if (n.zone === z[2]) E.s("rect", { x: z[0], y: 130, width: z[1] - z[0], height: oy - 130, fill: PLATEFORME.teinte(0.14) }, g); });
        E.s("path", { d: "M110 430 C170 428 200 230 290 200 L460 198 C520 202 560 250 620 280", fill: "none", stroke: C.jeu, "stroke-width": 5 }, g);
        [290, 460].forEach(function (x) { D.ligne(g, [x, 140], [x, oy], C.gris, 2, "6 5"); });
        D.texte(g, "1", [200, 480], { taille: 20, coul: C.acc }); D.texte(g, "2", [375, 480], { taille: 20, coul: C.acc }); D.texte(g, "3", [540, 480], { taille: 20, coul: C.acc });
        D.texte(g, "caoutchouc naturel", [400, 160], { taille: 17, coul: C.doux });
      }
    };
    fig.svg.addEventListener("click", function (ev) {
      if (!n.libre) return;
      var p = E.point(fig.svg, ev);
      if (n.mode === "ponts") n.sites.forEach(function (s, i) { if (n.ponts.indexOf(i) < 0 && Math.abs(p[0] - s.x) < 34 && p[1] > s.y1 && p[1] < s.y2 && n.ponts.length < 3) { n.ponts.push(i); n.dessin(); if (n.surPont) n.surPont(); } });
      if (n.mode === "cuisson" && n.zones) n.zones.forEach(function (z) { if (p[0] >= z[0] && p[0] < z[1] && p[1] > 130 && p[1] < 460) { n.zone = z[2]; n.dessin(); if (n.surZone) n.surZone(z[2]); } });
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Poser les ponts", jouer: function (j, n) {
      j.fig.astuce("Touche les cercles pour relier deux chaînes.");
      j.titre("Au-dessus de Tg, ces chaînes linéaires glissent comme un liquide très visqueux. Pose trois ponts de soufre pour les lier.");
      n.surPont = function () {
        if (n.ponts.length < 3) return;
        n.surPont = null; n.libre = false; n.dessin();
        j.bravo("Un réseau : les chaînes ne peuvent plus glisser.");
        j.expliquer("<p>Les élastomères bruts ne sont pas des matériaux prêts à l'emploi. La <b>vulcanisation</b> consiste à réaliser une <b>réticulation chimique</b> (établissement de liaisons covalentes) entre les chaînes du polymère. Le principal système pour les caoutchoucs est le système au soufre.</p>");
        j.suite();
      };
      j.reponse(function () { for (var i = 0; n.ponts.length < 3; i++) if (n.ponts.indexOf(i) < 0) n.ponts.push(i); if (n.surPont) n.surPont(); });
    } },
    { nom: "Trois systèmes", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Trois façons de vulcaniser. Associe chaque système au pont qu'il forme.");
      var L = [["Soufre (élastomère insaturé)", "s"], ["Peroxyde organique", "p"], ["Oxydes MgO/ZnO (élastomère halogéné)", "o"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:170px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "o", html: "ponts éther C–O–C" }, { id: "s", html: "ponts disulfure" }, { id: "p", html: "ponts C–C" }],
        aide: "Le nom du pont rappelle l'atome qui relie : le soufre fait des ponts S–S, l'oxygène des ponts éther.",
        ok: function () {
          j.bravo("Disulfure, C–C, éther.");
          j.expliquer("<p>Le soufre forme des ponts disulfure entre les chaînes d'un élastomère <b>insaturé</b> (qui a des doubles liaisons). Le peroxyde forme des ponts C–C. Les oxydes métalliques MgO/ZnO forment des ponts éther entre les chaînes d'un élastomère <b>halogéné</b>.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Plus de soufre", jouer: function (j, n) {
      n.mode = "courbes"; n.sMontre = null; n.dessin();
      j.fig.astuce("Courbe du caoutchouc sans soufre (0 %).");
      j.titre("Prédis : en passant de 0 à 30 % de soufre, que deviennent les courbes ?");
      j.choix([
        { html: "Tg et le module augmentent, le plateau caoutchouteux reste", juste: true },
        { html: "Le plateau caoutchouteux disparaît", aide: "Les ponts bloquent l'écoulement : ils allongent le plateau au lieu de le supprimer." },
        { html: "Tg diminue", aide: "Des chaînes reliées bougent moins facilement : il faut plus chaud pour les libérer." }
      ], { colonnes: 1, ok: function () {
        n.sMontre = 30; n.dessin();
        j.bravo("Tg et E augmentent, le plateau reste.");
        j.expliquer("<p>Les agents de réticulation augmentent \\(T_g\\) sans faire disparaître le plateau caoutchouteux (E et \\(T_g\\) augmentent). À une température donnée au-dessus de \\(T_g\\), le module augmente avec le pourcentage de soufre. Sans soufre, la courbe finit par chuter : le caoutchouc brut s'écoule.</p>");
        j.suite();
      } });
    } },
    { nom: "Noir de carbone", jouer: function (j, n) {
      j.fig.astuce("Le pointillé : même caoutchouc à 2 % de soufre, avec du noir de carbone.");
      n.noir = true; n.sMontre = 2; n.dessin();
      j.titre("On veut un caoutchouc plus rigide sans déplacer Tg. Qu'ajoute-t-on ?");
      j.choix([
        { html: "Plus de soufre", aide: "Le soufre déplace aussi Tg vers la droite : compare les courbes 2 % et 10 %." },
        { html: "Du noir de carbone", juste: true },
        { html: "Un antioxydant", aide: "L'antioxydant est un stabilisant : il protège, il ne rigidifie pas." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Noir de carbone : E augmente, Tg constant.");
        j.expliquer("<p>Trois familles d'additifs pour un caoutchouc : les <b>agents de réticulation</b> (E et \\(T_g\\) augmentent), les <b>renforts</b> comme le noir de carbone (E augmente, \\(T_g\\) constant), les <b>stabilisants</b> comme les antioxydants.</p>");
        j.suite();
      } });
    } },
    { nom: "La réversion", jouer: function (j, n) {
      n.mode = "cuisson"; n.noir = false; n.zone = null; n.libre = true; n.dessin();
      j.fig.astuce("Module du mélange pendant la cuisson.");
      j.titre("Touche la zone où le module baisse après son maximum : la réversion.");
      n.surZone = function (z) {
        if (z !== "reversion") { j.erreur(z === "montee" ? "Ici le module monte : c'est le temps de vulcanisation." : "Ici le module reste à son maximum : c'est le temps de plateau."); return; }
        n.surZone = null; n.libre = false;
        j.bravo("Zone 3 : la réversion.");
        j.expliquer("<p>Le <b>temps de vulcanisation</b> va du moment où le module commence à augmenter à celui où il atteint son maximum (zone 1). Le <b>temps de plateau</b> est celui où il reste presque constant (zone 2). Une diminution ensuite, surtout avec les mélanges à base de caoutchouc naturel, s'appelle la <b>réversion</b>.</p>");
        j.suite();
      };
      j.reponse(function () { n.zone = "reversion"; n.dessin(); if (n.surZone) n.surZone("reversion"); });
    } }
  ]
});
