/* Niveau : I2C, deux fils partagés (Section II, diapositives 15 et 16). Résistances de tirage, sorties qui tirent à 0, niveau dominant 0 et récessif 1, tableau Bus / Clock. */
NIVEAU({
  id: "i2c",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var DEV = [["MCU", 30], ["Capteur de\ntempérature", 245], ["EEPROM\nsérie", 460]], W = 190, YSDA = 200, YSCL = 240;
    var n = { tire: [false, false, false], surTouche: null };
    n.niveau = function () { return n.tire.some(function (t) { return t; }) ? 0 : 1; };
    n.dessin = function () {
      EMB.vider(g);
      var v = n.niveau(), cSDA = n.cache ? C.encre : v ? C.acc : C.ko;
      // alimentation et résistances de tirage
      EMB.el("line", { x1: 400, y1: 96, x2: 640, y2: 96, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "+VDD", [640, 76], { taille: 16, ancre: "end" });
      [[470, YSDA], [540, YSCL]].forEach(function (r) {
        EMB.el("line", { x1: r[0], y1: 96, x2: r[0], y2: 120, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("rect", { x: r[0] - 9, y: 120, width: 18, height: 44, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("line", { x1: r[0], y1: 164, x2: r[0], y2: r[1], stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("circle", { cx: r[0], cy: r[1], r: 5, fill: C.encre }, g);
        EMB.texte(g, "RP", [r[0] + 28, 142], { taille: 15 });
      });
      EMB.texte(g, "PULL-UP RESISTORS", [400, 126], { taille: 12, coul: C.doux, ancre: "end", gras: false });
      // lignes
      EMB.el("line", { x1: 20, y1: YSDA, x2: 660, y2: YSDA, stroke: cSDA, "stroke-width": 5 }, g);
      EMB.el("line", { x1: 20, y1: YSCL, x2: 660, y2: YSCL, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "SDA = " + (n.cache ? "?" : v), [20, YSDA - 22], { taille: 20, ancre: "start", coul: cSDA, mono: true });
      EMB.texte(g, "SCL", [20, YSCL + 20], { taille: 15, ancre: "start", coul: C.doux });
      DEV.forEach(function (d, k) {
        var x = d[1], t = n.tire[k], xs = x + 130, xc = x + 50;
        EMB.bloc(g, x, 290, W, 270, "", { actif: t, tirets: "7 6" });
        EMB.texte(g, d[0], [x + W / 2, 520], { taille: 16 });
        // SCL : entrée seule ici
        EMB.el("line", { x1: xc, y1: YSCL, x2: xc, y2: 330, stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("circle", { cx: xc, cy: YSCL, r: 4, fill: C.encre }, g);
        EMB.texte(g, "SCLK", [xc, 348], { taille: 12, halo: false });
        // SDA : sortie qui tire à la masse
        EMB.el("line", { x1: xs, y1: YSDA, x2: xs, y2: 360, stroke: cSDA, "stroke-width": 3 }, g);
        EMB.el("circle", { cx: xs, cy: YSDA, r: 5, fill: cSDA }, g);
        EMB.el("circle", { cx: xs, cy: 360, r: 5, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("line", { x1: xs, y1: 420, x2: xs, y2: 450, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("circle", { cx: xs, cy: 420, r: 5, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        [[-16, 450], [-10, 457], [-4, 464]].forEach(function (m) { EMB.el("line", { x1: xs + m[0], y1: m[1], x2: xs - m[0], y2: m[1], stroke: C.encre, "stroke-width": 2.5 }, g); });
        if (t) EMB.el("line", { x1: xs, y1: 360, x2: xs, y2: 420, stroke: C.ko, "stroke-width": 4 }, g);
        else EMB.el("line", { x1: xs, y1: 360, x2: xs + 30, y2: 410, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.texte(g, t ? "tire à 0" : "relâche", [xs - 14, 392], { taille: 14, ancre: "end", coul: t ? C.ko : C.doux, gras: !!t });
        EMB.texte(g, "DATA OUT", [xs, 486], { taille: 11, halo: false, coul: C.doux });
      });
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var z = {}; DEV.forEach(function (d, k) { z[k] = [d[1], 290, W, 270]; }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(+k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Tirer à 0", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Trois circuits partagent la ligne SDA. Touche un circuit pour fermer ou ouvrir sa sortie. Mets SDA à 0.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.tire[k] = !n.tire[k]; n.dessin();
        if (n.niveau() === 0) {
          fini = true; n.surTouche = null;
          j.bravo("Un seul circuit suffit à mettre toute la ligne à 0.", [340, 200]);
          j.expliquer("<p>Chaque sortie I2C est un transistor qui ne sait que relier la ligne à la masse (drain ouvert). Il ne pousse jamais la ligne à 1 : il « tire à 0 » ou il « relâche ».</p>");
          j.suite();
        }
      };
      j.reponse(function () { if (n.surTouche) n.surTouche(1); });
    } },
    { nom: "Prédire", jouer: function (j, n) {
      n.tire = [false, true, false]; n.cache = true; n.dessin();
      j.titre("Le MCU et l'EEPROM relâchent, le capteur tire à 0. Que vaut SDA ?");
      j.choix([
        { html: "0", juste: true },
        { html: "1", aide: "Deux circuits sur trois relâchent, mais il suffit d'un qui tire pour relier la ligne à la masse." },
        { html: "Indéterminé : il y a un conflit", aide: "Aucun circuit ne pousse à 1 : il n'y a donc jamais de conflit. Celui qui tire gagne." }
      ], { colonnes: 3, ok: function () {
        n.cache = false; n.dessin();
        j.bravo("SDA = 0 : le 0 domine.");
        j.expliquer("<p>Le cours : <b>le niveau logique dominant est le 0, le niveau récessif est le 1</b>. La ligne est à 1 seulement si tous les circuits relâchent : c'est un ET câblé.</p>");
        j.suite();
      } });
    } },
    { nom: "Revenir à 1", jouer: function (j, n) {
      n.tire = [true, false, true]; n.dessin();
      j.titre("Le MCU et l'EEPROM tirent la ligne. Remets SDA à 1.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.tire[k] = !n.tire[k]; n.dessin();
        if (n.tire[k]) j.info("Ce circuit tire maintenant la ligne : ça ne l'aide pas à remonter.");
        if (n.niveau() === 1) {
          fini = true; n.surTouche = null;
          j.bravo("Tout le monde relâche : SDA remonte à 1.", [340, 200]);
          j.suite();
        }
      };
      j.reponse(function () { n.tire = [false, false, true]; if (n.surTouche) n.surTouche(2); });
    } },
    { nom: "Qui met le 1 ?", jouer: function (j, n) {
      j.titre("Quand aucun circuit ne tire, qu'est-ce qui met la ligne à 1 ?");
      j.choix([
        { html: "Les résistances de tirage RP reliées à +VDD", juste: true },
        { html: "Le maître, qui pousse la ligne à 1", aide: "Les sorties ne savent que relier à la masse. Regarde en haut de la figure, entre +VDD et les lignes." },
        { html: "Rien : la ligne reste flottante", aide: "Regarde les deux résistances RP en haut de la figure." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Les résistances de tirage (<i>pull-up resistors</i>).");
        j.expliquer("<p>L'<b>I2C</b> (<i>Inter-Integrated Communication</i>) sert à interconnecter des circuits dans une carte électronique. Architecture : maître, multi-maître, esclave, avec 2 fils : <b>SDA</b> (<i>serial data line</i>) et <b>SCL</b> (<i>serial clock line</i>). Sur le bus : convertisseurs A/D ou D/A, contrôleurs de LED, capteurs de température, EEPROM série, microcontrôleurs, et des ponts vers SPI, UART ou USB.</p>");
        j.suite();
      } });
    } },
    { nom: "Le tableau", jouer: function (j, n) {
      j.titre("Le cours donne ce tableau. Dans chaque ligne, par combien faut-il multiplier le débit (Bus) pour obtenir l'horloge (Clock) ?");
      j.zone("", '<div class="tableau"><table style="font-size:17px;border-collapse:collapse"><tr><th style="padding:4px 14px">Bus</th><th style="padding:4px 14px">Clock</th></tr><tr><td style="padding:4px 14px">50 kbps</td><td style="padding:4px 14px">800 kHz</td></tr><tr><td style="padding:4px 14px">100 kbps</td><td style="padding:4px 14px">1,6 MHz</td></tr><tr><td style="padding:4px 14px">400 kbps</td><td style="padding:4px 14px">6,4 MHz</td></tr><tr><td style="padding:4px 14px">1000 kbps</td><td style="padding:4px 14px">16 MHz</td></tr></table></div>');
      j.nombre({ avant: "\\text{Clock} = k \\times \\text{Bus},\\ k =", cases: [{ attendu: 16, tol: 0 }], ligne: true,
        aide: function () { return "Prends la première ligne : \\(800 / 50\\)."; },
        ok: function () {
          j.bravo("16 dans chaque ligne du tableau.");
          j.suite();
        } });
    } }
  ]
});
