/* Niveau : ingénierie tissulaire et médecine régénérative. Implant permanent contre échafaudage qui se dégrade, triade, porosité, marché. */
NIVEAU({
  id: "ingenierie-tissulaire",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { t: 0, triade: false };
    var OS = "#f3ead8", BORD = "#b9a77f";
    function panneau(x0, titre, it) {
      D.texte(g, titre, [x0 + 140, 60], { taille: 19 });
      // os avec un défaut rectangulaire au milieu
      E.s("rect", { x: x0, y: 120, width: 280, height: 360, rx: 26, fill: OS, stroke: BORD, "stroke-width": 3 }, g);
      var dx = x0 + 60, dy = 220, dl = 160, dh = 160, t = n.t / 100;
      E.s("rect", { x: dx, y: dy, width: dl, height: dh, fill: "#fff6f0", stroke: BORD, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
      if (!it) {
        E.s("rect", { x: dx + 6, y: dy + 6, width: dl - 12, height: dh - 12, rx: 8, fill: "#b8c0cc", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "implant", [dx + dl / 2, dy + dh / 2 - 12], { taille: 17 });
        D.texte(g, "non dégradable", [dx + dl / 2, dy + dh / 2 + 12], { taille: 15, gras: false });
        if (t > 0.85) D.texte(g, "il reste jusqu'à ce qu'il ne fonctionne plus", [x0 + 140, 520], { taille: 15, coul: C.doux, gras: false });
      } else {
        // tissu neuf qui pousse depuis les bords
        var e = t * dl / 2;
        if (e > 0.5) {
          E.s("path", { d: "M" + dx + " " + dy + " h" + dl + " v" + dh + " h" + (-dl) + " Z M" + (dx + e) + " " + (dy + e) + " v" + (dh - 2 * e) + " h" + (dl - 2 * e) + " v" + (-(dh - 2 * e)) + " Z", fill: "#e9d6ae", "fill-rule": "evenodd" }, g);
        }
        // échafaudage poreux qui disparaît
        var op = Math.max(0, 1 - t * 1.05);
        if (op > 0.02) for (var i = 0; i < 5; i++) for (var k = 0; k < 5; k++) {
          var cx = dx + 16 + i * 32, cy = dy + 16 + k * 32;
          E.s("circle", { cx: cx, cy: cy, r: 12, fill: "none", stroke: D.C.jeu, "stroke-width": 4, opacity: op }, g);
        }
        // cellules
        if (n.triade) for (var c = 0; c < 9; c++) { var a = c * 0.7; D.rond(g, [dx + dl / 2 + 55 * Math.cos(a) * (1 - t * 0.3), dy + dh / 2 + 55 * Math.sin(a) * (1 - t * 0.3)], 6, { fill: "#8b3fd9" }); }
        if (t > 0.95) D.texte(g, "défaut comblé par un tissu naturel", [x0 + 140, 520], { taille: 15, coul: C.ok });
      }
    }
    n.dessin = function () {
      E.vider(g);
      panneau(30, "Biomatériau classique", false);
      panneau(370, "Ingénierie tissulaire", true);
      fig.chip("temps : " + Math.round(n.t) + " %");
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Deux approches", jouer: function (j, n) {
      j.fig.astuce("À droite, les anneaux colorés sont l'échafaudage poreux.");
      j.titre("Même défaut osseux, deux approches. Fais avancer le temps jusqu'à ce que l'un des deux défauts soit comblé par un tissu naturel.");
      var fait = false;
      function gagne() {
        if (fait) return; fait = true; c.regler(100); n.t = 100; n.dessin();
        j.bravo("À droite, l'échafaudage a disparu et le tissu a pris sa place.");
        j.expliquer("<p>Biomatériau classique : l'organe déficient est remplacé par un matériau <b>non dégradable</b>, implanté à long terme jusqu'à ce qu'il ne fonctionne plus, se brise ou provoque des dommages. <b>Ingénierie tissulaire</b> : une « construction active » se dégrade pendant qu'un nouveau tissu fonctionnel se régénère ; le matériau, détecté comme corps étranger, est (bio)éliminé et remplacé par un tissu naturel.</p>");
        j.suite();
      }
      var c = j.curseur({ nom: "temps", min: 0, max: 100, pas: 1, val: 0, unite: " %", change: function (v) { if (fait) return; n.t = v; n.dessin(); if (v >= 97) gagne(); } });
      j.reponse(gagne);
    } },
    { nom: "Les trois composants", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("La construction active de l'ingénierie tissulaire a trois composants. Lesquels ?");
      var z = j.zone("", '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:20px"><span class="trou" data-attendu="e"></span>+<span class="trou" data-attendu="c"></span>+<span class="trou" data-attendu="f"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "cellules vivantes" }, { id: "x", html: "tige en titane" }, { id: "f", html: "facteurs bioactifs" }, { id: "e", html: "échafaudage biodégradable" }, { id: "y", html: "antibiotique" }],
        aide: "Il faut un support qui disparaît, du vivant qui construit le tissu, et des signaux qui le guident. Le titane ne se dégrade pas.",
        ok: function () {
          n.triade = true; n.t = 30; n.dessin();
          j.bravo("Échafaudage biodégradable + cellules vivantes + facteurs bioactifs.");
          j.expliquer("<p>Le succès n'est pas garanti : il dépend de la nature, de l'architecture et des propriétés mécaniques de l'échafaudage, de la taille du défaut et de la nature du tissu à remplacer. Les cellules (violettes) peuvent être autologues ou non, différenciées ou progénitrices, et doivent garder leur phénotype.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Un organe très vascularisé", jouer: function (j, n) {
      j.titre("On veut régénérer un tissu très vascularisé. Comment doit être l'échafaudage ?");
      j.choix([
        { html: "Plus dense et lisse, pour mieux résister", aide: "Les vaisseaux et les cellules doivent pouvoir entrer dans le support." },
        { html: "Avec un volume poreux et une surface spécifique plus élevés", juste: true },
        { html: "Peu importe, seule la chimie compte", aide: "La porosité (taille, répartition, diamètre des interconnexions) joue un rôle majeur." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Plus la vascularisation est importante, plus le volume poreux et la surface spécifique sont élevés.");
        j.expliquer("<p>L'échafaudage idéal permet l'adhésion, la croissance, la différenciation et la colonisation des cellules : c'est généralement un biomatériau <b>poreux</b>. Comptent aussi la rugosité, la chimie et l'énergie de surface, la classe de matériau (polymère ou céramique), la dégradation et ses produits.</p>");
        j.suite();
      } });
    } },
    { nom: "Dehors ou dedans", jouer: function (j, n) {
      j.titre("On les confond souvent. Quelle est la principale différence entre ingénierie tissulaire et médecine régénérative ?");
      j.choix([
        { html: "L'ingénierie tissulaire étudie la croissance des tissus à l'extérieur du corps ; la médecine régénérative répare des tissus à l'intérieur du corps", juste: true },
        { html: "L'ingénierie tissulaire n'utilise pas de cellules", aide: "Les cellules vivantes sont un de ses trois composants." },
        { html: "La médecine régénérative ne concerne que les os", aide: "Elle vise cellules, tissus et organes en général." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Dehors pour l'une, dedans pour l'autre.");
        j.expliquer("<p>La <b>médecine régénérative</b>, branche de la recherche translationnelle en ingénierie tissulaire et biologie moléculaire, utilise les mécanismes de réparation propres à l'organisme. L'ingénierie tissulaire a deux voies : générer in vitro un tissu fonctionnel avant implantation, ou implanter in vivo un greffon immature cultivé in vitro qui finit sa maturation in situ.</p>");
        j.suite();
      } });
    } },
    { nom: "Un marché qui grimpe", jouer: function (j, n) {
      j.titre("Le marché mondial de l'ingénierie tissulaire et de la médecine régénérative passerait de 32 milliards de dollars en 2018 à 135 milliards en 2024. Quel taux de croissance annuel moyen, en % ?");
      j.nombre({ avant: "t \\approx", apres: "\\%", cases: [{ attendu: Math.round(BIO.croissanceAnnuelle(32, 135, 6) * 100), tol: 1 }], ligne: true,
        aide: function () { return "Six années de 2018 à 2024 : \\(135 = 32\\,(1+t)^6\\), donc \\(t = (135/32)^{1/6} - 1\\)."; },
        ok: function () {
          j.bravo("Environ 27 % par an : le taux de 2013–2015 se maintient.");
          j.expliquer("<p>Le cours donne 27 milliards de dollars en 2015 et 27 % par an entre 2013 et 2015. L'Europe et l'Amérique pesaient 83 % du marché en 2014 (80 % en 2019). Le vieillissement de la population et l'augmentation de l'espérance de vie tirent cette croissance.</p>");
          j.suite();
        } });
    } }
  ]
});
