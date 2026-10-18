/* Niveau : formulation des élastomères et caoutchoucs de synthèse. Ingrédients, noir de carbone, élastomère saturé, Buna et polyisoprène, réticulables. */
NIVEAU({
  id: "formulation",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "recette", poses: {} };
    var ING = [["gomme", "élastomère brut", "#e9d8b4"], ["charge", "charges", "#d6dbe6"], ["plast", "plastifiant", "#cfe7f7"], ["acc", "accélérateur", "#fde2c8"], ["noir", "noir de carbone", "#3a3d46"], ["prot", "additifs de protection", "#d8f0e2"]];
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "recette") {
        // un mélangeur : chaque ingrédient posé remplit une part du bol
        E.s("path", { d: "M150 230 L530 230 L480 500 L200 500 Z", fill: "#fff", stroke: C.encre, "stroke-width": 4 }, g);
        var h = 0;
        ING.forEach(function (it) {
          if (!n.poses[it[0]] && it[0] !== "gomme") return;
          var e = it[0] === "gomme" ? 80 : 30, y = 500 - h - e;
          var k1 = (y - 230) / 270, k2 = (y + e - 230) / 270;
          E.s("path", { d: "M" + (150 + 50 * k1) + " " + y + " L" + (530 - 50 * k1) + " " + y + " L" + (530 - 50 * k2) + " " + (y + e) + " L" + (150 + 50 * k2) + " " + (y + e) + " Z", fill: it[2], stroke: C.encre, "stroke-width": 1.5 }, g);
          D.texte(g, it[1], [340, y + e / 2], { taille: 16, coul: it[0] === "noir" ? "#fff" : C.encre, fond: it[0] !== "noir" });
          h += e;
        });
        D.texte(g, "formulation : un caoutchouc pour une application définie", [340, 190], { taille: 18 });
      } else if (n.mode === "noir") {
        // agrégat de nanoparticules de noir de carbone, au centre de quatre rôles
        var r = BIO.hasard(7);
        for (var i = 0; i < 26; i++) { var a = r() * 6.28, d = 60 * Math.sqrt(r()); D.rond(g, [340 + d * Math.cos(a), 300 + d * Math.sin(a)], 14 + 6 * r(), { fill: "#2f323a", stroke: "#15171f", ep: 1.5 }); }
        D.texte(g, "noir de carbone : nanoconstituant", [340, 160], { taille: 19 });
        [[150, 230], [530, 230], [150, 400], [530, 400]].forEach(function (p, k) {
          E.s("rect", { x: p[0] - 95, y: p[1] - 28, width: 190, height: 56, rx: 16, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2.5, "stroke-dasharray": "6 5" }, g);
          D.texte(g, n.roles ? ["pigment", "renfort", "stabilisant", "conducteur"][k] : "?", p, { taille: n.roles ? 18 : 22, coul: n.roles ? C.jeu : C.gris });
        });
      } else {
        // frise des caoutchoucs de synthèse
        D.ligne(g, [80, 320], [600, 320], C.encre, 4);
        [[170, "1935"], [400, "après 1945"]].forEach(function (p) { D.rond(g, [p[0], 320], 12, { fill: C.jeu, stroke: "#fff", ep: 3 }); D.texte(g, p[1], [p[0], 356], { taille: 18, mono: true }); });
        D.texte(g, "Allemagne", [170, 280], { taille: 17, coul: C.doux });
        D.texte(g, "États-Unis", [400, 280], { taille: 17, coul: C.doux });
        // motif isoprène
        var y = 470;
        E.s("path", { d: "M120 " + y + " l40 -30 l40 30 l40 -30 l40 30 l40 -30 l40 30 l40 -30 l40 30 l40 -30 l40 30", fill: "none", stroke: C.encre, "stroke-width": 3.5 }, g);
        D.texte(g, "polyisoprène : constituant principal du caoutchouc naturel et synthétique", [340, 520], { taille: 15, coul: C.doux, gras: false });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La recette", jouer: function (j, n) {
      j.fig.astuce("Un caoutchouc se formule comme une recette.");
      j.titre("On formule un caoutchouc. Associe chaque ingrédient à son rôle.");
      var L = [["Charges", "c"], ["Plastifiant", "p"], ["Accélérateur", "a"], ["Additifs divers", "d"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:240px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "vulcanisation plus rapide" }, { id: "d", html: "mise en œuvre, protection" }, { id: "c", html: "renfort, rigidité" }, { id: "p", html: "souplesse" }],
        aide: "L'accélérateur agit sur la vulcanisation ; le plastifiant assouplit ; les additifs divers protègent (dioxygène, ozone, chaleur, flamme, UV) ou facilitent la mise en œuvre.",
        ok: function () {
          n.poses = { charge: 1, plast: 1, acc: 1, prot: 1 }; n.dessin();
          j.bravo("Le mélange est prêt.");
          j.expliquer("<p>La <b>formulation</b> d'un élastomère donne un caoutchouc pour une application définie : charges, plastifiant(s), accélérateur(s) de vulcanisation, additifs divers (pour faciliter la mise en œuvre, pour protéger contre le dioxygène, l'ozone, la chaleur, la flamme, les UV).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Multifonction", jouer: function (j, n) {
      n.mode = "noir"; n.dessin();
      j.fig.astuce("");
      j.titre("Le noir de carbone a quatre rôles dans un élastomère. Lequel de ces rôles n'en fait pas partie ?");
      j.choix([
        { html: "Pigment", aide: "C'est lui qui rend les pneus noirs : c'est bien un rôle." },
        { html: "Charge de renforcement", aide: "Rôle principal : il renforce les propriétés mécaniques." },
        { html: "Stabilisant", aide: "Il protège du vieillissement ultraviolet : c'est un stabilisant." },
        { html: "Plastifiant", juste: true },
        { html: "Conducteur électrique", aide: "Vrai : il sert à fabriquer des plastiques conducteurs." }
      ], { colonnes: 1, ok: function () {
        n.poses.noir = 1; n.roles = true; n.dessin();
        j.bravo("Il renforce : c'est le contraire d'un plastifiant.");
        j.expliquer("<p>Le noir de carbone est un <b>nanoconstituant multifonction</b> : pigment, charge de renforcement des propriétés mécaniques des élastomères, stabilisant, conducteur électrique.</p>");
        j.suite();
      } });
    } },
    { nom: "Un élastomère saturé", jouer: function (j, n) {
      n.mode = "recette"; n.dessin();
      j.fig.astuce("Saturé : la chaîne n'a plus de doubles liaisons.");
      j.titre("Ta gomme est un élastomère saturé. Avec quoi la vulcaniser ?");
      j.choix([
        { html: "Au soufre", aide: "Le soufre forme ses ponts sur un élastomère insaturé, qui a des doubles liaisons." },
        { html: "Au peroxyde organique", juste: true },
        { html: "Impossible de la vulcaniser", aide: "Le cours dit que presque tous les élastomères acceptent une autre voie que le soufre." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Peroxyde : ponts C–C.");
        j.expliquer("<p>Les élastomères <b>saturés</b> ne sont pas vulcanisables au soufre. Pratiquement tous les élastomères peuvent être vulcanisés au peroxyde organique.</p>");
        j.suite();
      } });
    } },
    { nom: "Caoutchoucs de synthèse", jouer: function (j, n) {
      n.mode = "frise"; n.dessin();
      j.fig.astuce("");
      j.titre("Complète l'histoire des caoutchoucs de synthèse.");
      var z = j.zone("", '<p style="line-height:2.4">En 1935, des chimistes allemands synthétisent les caoutchoucs <span class="trou" data-attendu="b" style="min-width:120px"></span>. Après la deuxième guerre mondiale, aux États-Unis, on synthétise un polymère de l\'<span class="trou" data-attendu="i" style="min-width:120px"></span> identique au caoutchouc naturel. Aujourd\'hui, ce polyisoprène de synthèse fait <span class="trou" data-attendu="p" style="min-width:110px"></span> de la production mondiale de caoutchouc.</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "3,1 %" }, { id: "b", html: "Buna" }, { id: "x", html: "62 %" }, { id: "i", html: "isoprène" }, { id: "y", html: "styrène" }],
        aide: "Le caoutchouc naturel est du polyisoprène. Le polyisoprène de synthèse ne représente qu'une petite part de la production.",
        ok: function () {
          j.bravo("Buna, isoprène, 3,1 %.");
          j.expliquer("<p>Le polyisoprène est le constituant principal du caoutchouc naturel et synthétique. Exemple d'usage des Buna : un joint pour écrou.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Réticulables", jouer: function (j, n) {
      j.titre("Le cours liste les principaux caoutchoucs « réticulables ». Lequel n'en est pas un ?");
      j.choix([
        { html: "SBR (styrène-butadiène)", aide: "Il est dans la liste du cours." },
        { html: "NBR (nitrile)", aide: "Il est dans la liste du cours." },
        { html: "Polystyrène", juste: true },
        { html: "Silicones", aide: "Les silicones sont des élastomères minéraux, dans la liste." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Le polystyrène est un plastomère, pas un caoutchouc.");
        j.expliquer("<p>Principaux caoutchoucs réticulables : caoutchouc naturel (NR), styrène-butadiène (SBR), butyle, polychloroprène (CR), nitrile (NBR), EPDM, silicones.</p>");
        j.suite();
      } });
    } }
  ]
});
