/* Niveau : SPI avec plusieurs esclaves (Section II, diapositives 8 et 14). Une ligne SS par esclave, active à 0 ; SCK, MOSI, MISO partagés. */
NIVEAU({
  id: "spi-esclaves",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var NOMS = ["Mémoire", "Afficheur", "Capteur de\ntempérature", "Moteur\npas-à-pas"], XS = [16, 182, 348, 514], W = 150;
    var n = { ss: [1, 1, 1, 1], surTouche: null, conflit: false };
    function ssTexte(x, y, coul) {
      EMB.texte(g, "SS", [x, y], { taille: 15, coul: coul || C.encre, halo: false });
      EMB.el("line", { x1: x - 10, y1: y - 11, x2: x + 10, y2: y - 11, stroke: coul || C.encre, "stroke-width": 1.8 }, g);
    }
    n.dessin = function () {
      EMB.vider(g);
      var lignes = [["SCK", 262], ["MOSI", 288], ["MISO", 314]];
      lignes.forEach(function (l) {
        var actif = l[0] === "MISO" && n.conflit;
        EMB.el("line", { x1: 60, y1: l[1], x2: 640, y2: l[1], stroke: actif ? C.ko : C.encre, "stroke-width": actif ? 4 : 2.5 }, g);
        XS.forEach(function (x) { var c = x + (l[0] === "SCK" ? 30 : l[0] === "MOSI" ? 60 : 110); EMB.el("line", { x1: c, y1: 210, x2: c, y2: l[1], stroke: actif ? C.ko : C.encre, "stroke-width": 2 }, g); EMB.el("circle", { cx: c, cy: l[1], r: 4, fill: C.encre }, g); });
      });
      XS.forEach(function (x, k) {
        var sel = n.ss[k] === 0;
        EMB.bloc(g, x, 90, W, 120, "", { actif: sel });
        EMB.texte(g, NOMS[k], [x + W / 2, 140], { taille: 16, halo: false });
        EMB.texte(g, "Esclave " + (k + 1), [x + W / 2, 108], { taille: 13, coul: C.doux, halo: false, gras: false });
        EMB.texte(g, "SCK", [x + 30, 196], { taille: 11, halo: false }); EMB.texte(g, "MOSI", [x + 62, 196], { taille: 11, halo: false }); EMB.texte(g, "MISO", [x + 112, 196], { taille: 11, halo: false });
        ssTexte(x + W - 22, 178, sel ? C.acc : C.encre);
        EMB.bloc(g, x + 18, 64, W - 36, 30, "SS = " + n.ss[k], { taille: 15, mono: true, fill: sel ? C.acc : "#fff", coul: sel ? "#fff" : C.encre, stroke: sel ? C.acc : C.encre, rx: 6 });
        EMB.el("line", { x1: x + 51, y1: 69, x2: x + 69, y2: 69, stroke: sel ? "#fff" : C.encre, "stroke-width": 1.6 }, g);
        // ligne SS depuis un port du maître
        var y = 420 + k * 30, xs = x + W - 6;
        EMB.el("polyline", { points: [[300, y], [xs, y], [xs, 210]].join(" "), fill: "none", stroke: sel ? C.acc : C.gris, "stroke-width": sel ? 4 : 2.5 }, g);
      });
      EMB.bloc(g, 40, 360, 260, 200, "", { fill: C.fond });
      EMB.texte(g, "Master Device", [140, 470], { taille: 19, halo: false });
      EMB.texte(g, "Ports", [276, 470], { taille: 14, coul: C.doux, halo: false });
      lignes.forEach(function (l, i) { EMB.el("line", { x1: 60 + i * 26, y1: l[1], x2: 60 + i * 26, y2: 360, stroke: C.encre, "stroke-width": 2.5 }, g); });
      EMB.texte(g, "SCK MOSI MISO", [110, 384], { taille: 12, halo: false });
      ssTexte(80, 536); EMB.texte(g, "5 V", [16, 536], { taille: 15, ancre: "start" });
      EMB.fleche(g, [40, 548], [62, 548], { ep: 2 });
      if (n.conflit) EMB.texte(g, "deux sorties sur MISO", [470, 340], { taille: 17, coul: C.ko });
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var z = {}; XS.forEach(function (x, k) { z[k] = [x, 60, W, 150]; }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(+k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Sélectionner", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le maître veut lire le capteur de température. Touche les esclaves pour basculer leur ligne SS (active à 0).");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.ss[k] = 1 - n.ss[k]; n.dessin();
        if (n.ss.filter(function (v) { return v === 0; }).length > 1 || (n.ss[k] === 0 && k !== 2)) {
          j.erreur("Avec SS = 0, l'esclave " + (k + 1) + " écouterait aussi. Seul le capteur de température doit être sélectionné.");
          setTimeout(function () { n.ss[k] = 1; n.dessin(); }, 700);
          return;
        }
        if (n.ss.join("") === "1101") {
          fini = true; n.surTouche = null;
          j.bravo("SS du capteur à 0, les trois autres à 1.", [423, 150]);
          j.expliquer("<p>Dans l'<b>architecture multi esclaves</b>, SCK, MOSI et MISO sont partagés par tous les esclaves. Chaque esclave a sa propre ligne \\(\\overline{SS}\\) (<i>slave select</i>), tirée par un port du maître. La barre dit qu'elle est active à l'état bas : l'esclave dont \\(\\overline{SS} = 0\\) répond, les autres ignorent l'horloge.</p>");
          j.suite();
        }
      };
      j.reponse(function () { n.ss = [1, 1, 1, 1]; if (n.surTouche) n.surTouche(2); });
    } },
    { nom: "Deux à la fois", jouer: function (j, n) {
      n.ss = [0, 1, 0, 1]; n.dessin();
      j.titre("Erreur de programme : la mémoire et le capteur ont tous les deux SS = 0. Que se passe-t-il sur MISO ?");
      j.choix([
        { html: "Deux esclaves pilotent le même fil : les données se mélangent", juste: true },
        { html: "Le maître reçoit les deux octets l'un après l'autre", aide: "Il n'y a qu'un fil MISO et une seule horloge : les deux esclaves sortent leurs bits en même temps." },
        { html: "Rien : MISO n'est pas partagé", aide: "Regarde la figure : MISO relie les quatre esclaves au maître." }
      ], { colonnes: 1, ok: function () {
        n.conflit = true; n.dessin();
        j.bravo("Conflit sur MISO : on ne sélectionne qu'un esclave à la fois.");
        j.suite();
      } });
    } },
    { nom: "Compter les fils", jouer: function (j, n) {
      n.conflit = false; n.ss = [1, 1, 1, 1]; n.dessin();
      j.titre("Combien de fils entre le maître et ses 4 esclaves (sans la masse) ? Et avec 10 esclaves ?");
      j.nombre({ avant: "4 \\text{ esclaves},\\ 10 \\text{ esclaves} :", cases: [{ attendu: 7, tol: 0 }, { attendu: 13, tol: 0 }], ligne: true,
        aide: function () { return "Trois fils partagés (SCK, MOSI, MISO), plus une ligne \\(\\overline{SS}\\) par esclave."; },
        ok: function () {
          j.bravo("3 + 4 = 7 et 3 + 10 = 13.");
          j.expliquer("\\[ N_{fils} = 3 + N_{esclaves} \\]<p>Chaque esclave de plus coûte une broche de port au maître.</p>");
          j.suite();
        } });
    } },
    { nom: "SS du maître", jouer: function (j, n) {
      j.titre("Sur le schéma du cours, l'entrée \\(\\overline{SS}\\) du maître est reliée à 5 V. Pourquoi ?");
      j.choix([
        { html: "Pour qu'il ne soit jamais sélectionné comme esclave et reste maître", juste: true },
        { html: "Pour alimenter les esclaves", aide: "\\(\\overline{SS}\\) est une entrée de sélection, pas une alimentation. Un 1 sur \\(\\overline{SS}\\) veut dire « pas sélectionné »." },
        { html: "Pour accélérer l'horloge", aide: "L'horloge vient de SCK. Que veut dire \\(\\overline{SS} = 1\\) pour un composant SPI ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("\\(\\overline{SS} = 1\\) en permanence : le maître n'est jamais esclave.");
        j.suite();
      } });
    } },
    { nom: "Changer d'esclave", jouer: function (j, n) {
      n.ss = [1, 1, 0, 1]; n.dessin();
      j.titre("La température est lue. Il faut maintenant l'écrire dans la mémoire. Règle les lignes SS sur la figure.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.ss[k] = 1 - n.ss[k]; n.dessin();
        if (n.ss.filter(function (v) { return v === 0; }).length > 1) {
          j.erreur("Deux esclaves sélectionnés à la fois. Libère d'abord celui qui ne doit plus parler.");
          setTimeout(function () { n.ss[k] = 1; n.dessin(); }, 700);
          return;
        }
        if (n.ss[k] === 0 && k !== 0) { j.erreur("C'est la mémoire qu'il faut sélectionner."); setTimeout(function () { n.ss[k] = 1; n.dessin(); }, 700); return; }
        if (n.ss.join("") === "0111") {
          fini = true; n.surTouche = null;
          j.bravo("Capteur libéré, mémoire sélectionnée.", [91, 150]);
          j.suite();
        }
      };
      j.reponse(function () { n.ss = [1, 1, 1, 1]; if (n.surTouche) n.surTouche(0); });
    } }
  ]
});
