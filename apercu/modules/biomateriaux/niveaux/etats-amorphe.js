/* Niveau : états d'un polymère amorphe. Zones de la courbe log E – T, plateau caoutchouteux, état vitreux, relaxation, deux polymères à 20 °C. */
NIVEAU({
  id: "etats-amorphe",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "courbe", T: 20, libre: true, numeros: true, t: 0 };
    n.pl = D.plan(svg, [0, 0], 1); // coordonnées du dessin pour les tests ([x, −y])
    var O = [100, 460], W = 530, H = 320, TMIN = 0, TMAX = 260, LMIN = 2.5, LMAX = 10;
    var P = { Tg: 100, Tl: 190, larg: 6 };
    function px(T) { return O[0] + (T - TMIN) / (TMAX - TMIN) * W; }
    function py(l) { return O[1] - (l - LMIN) / (LMAX - LMIN) * H; }
    n.px = px;
    n.zone = function () { return BIO.zoneAmorphe(n.T, P.Tg, P.Tl, P.larg); };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "courbe") {
        D.fleche(g, O, [O[0] + W + 20, O[1]], C.encre, 3); D.fleche(g, O, [O[0], O[1] - H - 30], C.encre, 3);
        D.texte(g, "log Er (Pa)", [O[0] + 10, O[1] - H - 34], { ancre: "start", taille: 17 });
        D.texte(g, "T (°C)", [O[0] + W + 4, O[1] + 34], { taille: 17 });
        [0, 100, 200].forEach(function (T) { D.ligne(g, [px(T), O[1]], [px(T), O[1] + 8], C.encre, 2); D.texte(g, String(T), [px(T), O[1] + 26], { taille: 15, mono: true, gras: false }); });
        [3, 6, 9].forEach(function (l) { D.ligne(g, [O[0] - 8, py(l)], [O[0], py(l)], C.encre, 2); D.texte(g, String(l), [O[0] - 22, py(l)], { taille: 15, mono: true, gras: false }); });
        var pts = [];
        for (var T = TMIN; T <= TMAX; T += 2) pts.push([px(T), py(BIO.logModule(T, P))]);
        E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5, "stroke-linejoin": "round" }, g);
        if (n.numeros) [[0, 9.9], [1, 82], [2, 112], [3, 178], [4, 202], [5, 245]].forEach(function (z) {
          var T = z[0] === 0 ? 16 : z[1], l = BIO.logModule(T, P), lab = String(z[0]);
          if (z[0] === 0) lab = "0";
          D.rond(g, [px(T), py(l) - 26], 15, { fill: "#fff", stroke: C.encre, ep: 2 });
          D.texte(g, lab, [px(T), py(l) - 25], { taille: 16, fond: false });
        });
        D.texte(g, "Tg", [px(P.Tg), O[1] + 50], { taille: 17, coul: C.doux });
        // température courante
        var xt = px(n.T), lt = BIO.logModule(n.T, P);
        D.ligne(g, [xt, py(LMAX)], [xt, O[1]], D.C.acc, 2.5, "6 5");
        D.rond(g, [xt, py(lt)], 8, { fill: D.C.acc, stroke: "#fff", ep: 2 });
        if (n.libre) D.poignee(g, [xt, O[1]], D.C.acc); else D.rond(g, [xt, O[1]], 9, { fill: D.C.acc, stroke: "#fff", ep: 3 });
        fig.chip("T = " + Math.round(n.T) + " °C");
      } else {
        fig.chip(null);
        // relaxation : à gauche la pelote étirée, à droite σ(t)
        var a = Math.min(1, n.t), etir = n.t > 0 ? 1 - 0.75 * Math.max(0, n.t - 0.2) / 0.8 : 0;
        E.s("rect", { x: 40, y: 170, width: 250, height: 260, rx: 18, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2 }, g);
        for (var k = 0; k < 4; k++) {
          var pts2 = [];
          for (var s = 0; s <= 40; s++) {
            var u = s / 40, x = 70 + u * 190, y = 220 + k * 55 + (1 - etir) * 22 * Math.sin(u * 9 + k * 1.7) + (1 - etir) * 10 * Math.sin(u * 23 + k);
            pts2.push([165 + (x - 165) * (0.65 + 0.35 * etir), y]);
          }
          E.s("path", { d: BIO.cheminLisse(pts2), fill: "none", stroke: C.encre, "stroke-width": 3, "stroke-linecap": "round" }, g);
        }
        D.texte(g, n.t <= 0 ? "pelote au repos" : n.t < 0.3 ? "chaînes étirées" : "les chaînes se réarrangent", [165, 460], { taille: 17 });
        var Q = [340, 430];
        D.fleche(g, Q, [640, 430], C.encre, 3); D.fleche(g, Q, [340, 160], C.encre, 3);
        D.texte(g, "σ", [325, 170], { taille: 22 }); D.texte(g, "t", [635, 455], { taille: 22 });
        if (n.t > 0) {
          var q = [];
          for (var t = 0; t <= a; t += 0.02) q.push([Q[0] + 10 + t * 270, Q[1] - 230 * Math.exp(-t * 3) - 20]);
          E.s("polyline", { points: q.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5 }, g);
        }
        D.texte(g, "déformation maintenue", [490, 130], { taille: 16, coul: C.doux });
      }
    };
    D.glisser(svg, {
      debut: function (p) { return n.mode === "courbe" && n.libre && p[1] > O[1] - 60; },
      bouge: function (p) { if (!n.libre) return; n.T = Math.max(TMIN, Math.min(TMAX, TMIN + (p[0] - O[0]) / W * (TMAX - TMIN))); n.dessin(); },
      fin: function () { if (n.surLache) n.surLache(n.zone()); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Nommer les zones", jouer: function (j, n) {
      j.fig.astuce("Courbe du module de relaxation d'un polymère amorphe (allure du cours).");
      j.titre("Place le nom de chaque zone de la courbe.");
      var noms = ["0-1", "1-2", "2-3", "3-4", "5"];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:center;font-size:17px">' + noms.map(function (k, i) { return "<b>" + k + '</b><span class="trou" data-attendu="' + i + '" style="min-width:260px;min-height:50px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "2", html: "plateau caoutchouteux" }, { id: "4", html: "état liquide" }, { id: "0", html: "état vitreux" }, { id: "3", html: "transition caoutchouc-liquide" }, { id: "1", html: "chute du module à Tg" }],
        aide: "Le module part haut (vitreux), chute à Tg, reste sur un plateau, chute encore vers l'écoulement, puis c'est liquide.",
        ok: function () {
          j.bravo("Vitreux, Tg, plateau, transition, liquide.");
          j.expliquer("<p>0-1 : <b>état vitreux</b>. 1-2 : réduction importante du module, c'est la <b>transition vitreuse</b> (Tg). 2-3 : <b>plateau caoutchouteux</b>, le mouvement de longues sections de chaînes devient possible. 3-4 : transition caoutchouc-liquide. 5 : état liquide.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Sur le plateau", jouer: function (j, n) {
      j.fig.astuce("Glisse la poignée sur l'axe des températures.");
      j.titre("Amène le polymère sur son plateau caoutchouteux.");
      n.surLache = function (zo) {
        if (zo !== "2-3") { j.erreur(zo === "0-1" || zo === "1-2" ? "Trop froid : tu es encore à l'état vitreux ou dans la chute. Va au-delà de Tg." : "Trop chaud : le polymère commence à couler. Reviens sur la partie plate."); return; }
        n.surLache = null; n.libre = false; n.dessin();
        j.bravo("Plateau caoutchouteux : module d'environ 1 MPa.");
        j.expliquer("<p>Sur le plateau, le polymère est souple sans couler : les chaînes bougent par longues sections, mais l'enchevêtrement physique les retient (pour un polymère non réticulé).</p>");
        j.suite();
      };
      j.reponse(function () { n.libre = true; n.T = 140; n.dessin(); if (n.surLache) n.surLache("2-3"); });
    } },
    { nom: "À l'état vitreux", jouer: function (j, n) {
      n.T = 30; n.dessin();
      j.fig.astuce("");
      j.titre("À 30 °C, ce polymère est vitreux. Quand on le déforme un peu, qu'est-ce qui change à l'échelle des atomes ?");
      j.choix([
        { html: "La distance entre les atomes augmente", juste: true },
        { html: "Les chaînes glissent sur de longues distances", aide: "Ça, c'est au-dessus de Tg, sur le plateau caoutchouteux." },
        { html: "Les chaînes cassent", aide: "Une petite déformation élastique ne casse rien." }
      ], { colonnes: 1, ok: function () {
        j.bravo("État vitreux : déformation = augmentation de la distance entre atomes.");
        j.suite();
      } });
    } },
    { nom: "La relaxation", jouer: function (j, n) {
      n.mode = "relax"; n.t = 0; n.dessin();
      j.titre("On étire le polymère amorphe puis on maintient la déformation. Lance l'essai et observe la contrainte.");
      var b = E.h("button", "btn bleu", "Étirer et maintenir", j.el); b.type = "button";
      var lance = function () {
        if (n.t > 0) return;
        b.remove();
        E.anime(2000, function (u) { n.t = Math.max(0.01, u); n.dessin(); });
        j.consigne("Pourquoi la contrainte diminue-t-elle avec le temps ?");
        j.choix([
          { html: "Les chaînes se désenchevêtrent et se réenchevêtrent pour revenir vers l'équilibre", juste: true },
          { html: "Les liaisons covalentes cassent une à une", aide: "Aucune chaîne n'est rompue : elles se réarrangent." },
          { html: "Le polymère cristallise", aide: "Un polymère amorphe ne devient pas cristallin en étant tiré quelques secondes." }
        ], { colonnes: 1, ok: function () {
          j.bravo("C'est la relaxation de contrainte.");
          j.expliquer("<p>Après la déformation, les chaînes veulent retourner à l'équilibre : c'est la <b>relaxation</b>, par désenchevêtrement et réenchevêtrement. Le temps nécessaire varie avec la longueur des chaînes : plus elles sont longues, plus c'est lent.</p>");
          j.suite();
        } });
      };
      b.addEventListener("click", lance);
      j.reponse(function () { lance(); });
    } },
    { nom: "Deux polymères à 20 °C", jouer: function (j, n) {
      j.titre("Polystyrène (Tv ≈ 100 °C) et caoutchouc naturel (Tv ≈ −60 °C), tous deux amorphes. Dans quel état sont-ils à 20 °C ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;font-size:18px">polystyrène <span class="trou" data-attendu="v" style="min-width:180px"></span>caoutchouc naturel <span class="trou" data-attendu="c" style="min-width:180px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "caoutchouteux" }, { id: "l", html: "liquide" }, { id: "v", html: "vitreux" }],
        aide: "Compare 20 °C à Tv : en dessous, vitreux ; au-dessus, la chute est passée.",
        ok: function () {
          j.bravo("Polystyrène vitreux, caoutchouc naturel caoutchouteux.");
          j.expliquer("<p>La même courbe, décalée en température : c'est la position de Tv par rapport à l'ambiante qui décide de l'état d'usage (chapitre 4).</p>");
          j.suite();
        }
      });
    } }
  ]
});
