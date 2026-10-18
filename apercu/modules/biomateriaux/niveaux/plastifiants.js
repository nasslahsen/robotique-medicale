/* Niveau : plastifier un polymère. Molécules de plastifiant entre les chaînes, rigidité et Tv qui baissent, PVC rigide et plastifié, température de fragilité. */
NIVEAU({
  id: "plastifiants",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "chaines", c: 0, libre: true };
    // modèle illustratif : Tv du PVC de 90 °C (0 %) vers −40 °C (50 %) ; module à 20 °C lu sur la courbe
    n.Tv = function (c) { return 90 - 2.6 * c; };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "chaines") {
        var ecart = 60 + 1.4 * n.c;
        for (var k = 0; k < 4; k++) {
          var y0 = 300 + (k - 1.5) * ecart, pts = [];
          for (var x = 70; x <= 610; x += 18) pts.push([x, y0 + 12 * Math.sin(x / 30 + k)]);
          E.s("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: C.encre, "stroke-width": 3.5, "stroke-linecap": "round" }, g);
          // interactions entre chaînes voisines : d'autant moins nombreuses que le plastifiant écarte les chaînes
          if (k < 3) for (var x2 = 100; x2 < 600; x2 += 50) {
            var tient = (x2 * 7 + k * 13) % 100 >= n.c * 2;
            if (tient) D.ligne(g, [x2, y0 + 12 * Math.sin(x2 / 30 + k) + 6], [x2, y0 + ecart + 12 * Math.sin(x2 / 30 + k + 1) - 6], "#c6cbd8", 2.5, "3 5");
          }
        }
        var r = BIO.hasard(5), nb = Math.round(n.c * 0.9);
        for (var i = 0; i < nb; i++) D.rond(g, [80 + 520 * r(), 300 + (r() - 0.5) * 2.9 * ecart], 11, { fill: C.jeu, stroke: "#fff", ep: 2 });
        fig.chip("plastifiant : " + n.c + " %");
      } else {
        fig.chip(null);
        // échelle de température de fragilité
        D.fleche(g, [80, 330], [620, 330], C.encre, 4);
        for (var t = -80; t <= 40; t += 20) { var x3 = 100 + (t + 80) / 120 * 480; D.ligne(g, [x3, 322], [x3, 338], C.encre, 2); D.texte(g, String(t).replace("-", "−") + " °C", [x3, 362], { taille: 15, mono: true, gras: false }); }
        function xt(t) { return 100 + (t + 80) / 120 * 480; }
        E.s("rect", { x: xt(-60), y: 210, width: xt(-5) - xt(-60), height: 40, rx: 10, fill: PLATEFORME.teinte(0.3), stroke: C.jeu, "stroke-width": 2 }, g);
        D.texte(g, "PVC plastifié", [(xt(-60) + xt(-5)) / 2, 190], { taille: 18, coul: C.jeu });
        D.rond(g, [xt(0), 230], 12, { fill: C.encre, stroke: "#fff", ep: 3 });
        D.texte(g, "PVC rigide", [xt(0) + 20, 190], { taille: 18, ancre: "start" });
        if (n.poche) {
          D.ligne(g, [xt(-18), 260], [xt(-18), 420], C.acc, 3, "8 6");
          D.texte(g, "congélateur −18 °C", [xt(-18), 440], { taille: 17, coul: C.acc });
        }
        D.texte(g, "température de fragilité", [350, 500], { taille: 17, coul: C.doux, gras: false });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Glisser entre les chaînes", jouer: function (j, n) {
      j.fig.astuce("Les pointillés : interactions entre chaînes, qui assurent la cohésion.");
      j.titre("Ajoute du plastifiant jusqu'à 40 %. Que deviennent les interactions entre chaînes ?");
      var fait = false;
      var c = j.curseur({ nom: "plastifiant", min: 0, max: 50, pas: 5, val: 0, unite: " %", change: function (v) { if (fait) return; n.c = v; n.dessin(); if (v >= 40) { fait = true; q(); } } });
      function q() {
        c.input.disabled = true;
        j.choix([
          { html: "Elles sont en partie détruites : les chaînes s'écartent", juste: true },
          { html: "Elles deviennent plus fortes", aide: "Compte les pointillés avant et après : il y en a moins." },
          { html: "Les chaînes se lient chimiquement", aide: "Aucun pont n'apparaît : les petites molécules se glissent entre les chaînes." }
        ], { colonnes: 1, ok: function () {
          j.bravo("Le matériau devient souple.");
          j.expliquer("<p>Un <b>plastifiant</b> est un solvant lourd qui, incorporé aux polymères, détruit partiellement les interactions entre chaînes responsables de la cohésion mécanique et transforme un matériau initialement rigide en matériau souple, flexible.</p>");
          j.suite();
        } });
      }
      j.reponse(function () { c.regler(40); n.c = 40; n.dessin(); if (!fait) { fait = true; q(); } });
    } },
    { nom: "Trois grandeurs", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Quand la concentration en plastifiant augmente, que deviennent ces trois grandeurs ?");
      var L = [["Rigidité", "b"], ["Température de transition vitreuse", "b"], ["Limite conventionnelle de flexibilité", "b"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:120px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "h", html: "augmente" }, { id: "b", html: "diminue" }, { id: "b", html: "diminue" }, { id: "s", html: "ne change pas" }, { id: "b", html: "diminue" }],
        aide: "Des chaînes moins liées bougent plus tôt, à plus basse température, et plient plus facilement.",
        ok: function () {
          j.bravo("Les trois diminuent.");
          j.expliquer("<p>La rigidité diminue avec la concentration en plastifiant, de même que la température de transition vitreuse et la limite conventionnelle de flexibilité. Ce dernier critère est caractéristique de l'effet plastifiant.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Abaisser Tv", jouer: function (j, n) {
      n.mode = "chaines"; n.dessin();
      j.titre("Le PVC a une Tv de 90 °C : rigide à l'ambiante. Pour en faire une tubulure souple, que fais-tu ?");
      j.choix([
        { html: "J'ajoute des fibres de verre", aide: "Les fibres rigidifient : c'est l'inverse." },
        { html: "J'ajoute un plastifiant pour descendre Tv sous l'ambiante", juste: true },
        { html: "Je le chauffe à 100 °C une fois pour toutes", aide: "Refroidi, il redevient rigide : sa Tv n'a pas changé." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Plastifiant : c'est la réponse du TD 1.5 c.");
        j.expliquer("<p>C'est ainsi que l'on obtient le PVC souple des tubulures et des poches médicales. Sous \\(T_v\\) on est vitreux, au-dessus on est souple : abaisser \\(T_v\\) sous l'ambiante rend le PVC flexible.</p>");
        j.suite();
      } });
    } },
    { nom: "Température de fragilité", jouer: function (j, n) {
      n.mode = "fragilite"; n.poche = false; n.dessin();
      j.titre("Le PVC rigide devient fragile dès 0 °C. Le PVC plastifié entre −5 et −60 °C selon le plastifiant. De combien de degrés au plus le plastifiant abaisse-t-il la température de fragilité ?");
      j.nombre({ avant: "\\Delta T =", apres: "°\\text{C}", cases: [{ attendu: 60, tol: 0 }], ligne: true,
        aide: function () { return "Écart entre 0 °C et la valeur la plus basse du PVC plastifié."; },
        ok: function () {
          j.bravo("Jusqu'à 60 °C plus bas.");
          j.expliquer("<p>Exemple du cours : PVC rigide non plastifié, température de fragilité 0 °C ; PVC plastifié, −5 à −60 °C selon la nature et la concentration du plastifiant.</p>");
          j.suite();
        } });
    } },
    { nom: "Au congélateur", jouer: function (j, n) {
      n.poche = true; n.dessin();
      j.titre("Une poche en PVC doit passer au congélateur à −18 °C sans casser. Que peux-tu dire ?");
      j.choix([
        { html: "Le PVC rigide convient", aide: "−18 °C est sous sa température de fragilité de 0 °C." },
        { html: "Il faut un PVC plastifié dont la température de fragilité est sous −18 °C", juste: true },
        { html: "Tout PVC plastifié convient", aide: "La plage va de −5 à −60 °C : à −5 °C, la poche casserait encore." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Il faut choisir la nature et la dose du plastifiant.");
        j.expliquer("<p>Exemple ajouté. La plage −5 à −60 °C montre que la nature et la concentration du plastifiant décident de la tenue au froid.</p>");
        j.suite();
      } });
    } }
  ]
});
