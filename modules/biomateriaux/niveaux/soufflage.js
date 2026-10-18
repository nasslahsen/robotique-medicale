/* Niveau : injection-soufflage et extrusion-soufflage. Préforme gonflée, cycle par extrusion, indices au fond du contenant. */
NIVEAU({
  id: "soufflage",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), gz = E.s("g", null, fig.svg);
    var n = { mode: "inj", u: 0, ferme: 1, libre: false, surFond: null, choisi: null };
    var CX = 300;
    // contour gauche (de haut en bas) : préforme et bouteille, mêmes nombres de points
    var PRE = [[20, 150], [20, 180], [16, 200], [16, 250], [16, 300], [16, 350], [14, 372], [6, 384], [0, 386]];
    var BOU = [[20, 150], [20, 180], [60, 230], [86, 270], [88, 340], [88, 450], [86, 478], [60, 490], [0, 492]];
    var TUB = [[20, 150], [20, 180], [20, 230], [20, 270], [20, 340], [20, 430], [20, 470], [8, 486], [0, 490]];
    function mix(A, B, u) { return A.map(function (p, i) { return [p[0] + (B[i][0] - p[0]) * u, p[1] + (B[i][1] - p[1]) * u]; }); }
    function forme(pts, cx) {
      var g1 = pts.map(function (p) { return [cx - p[0], p[1]]; }), d1 = pts.slice().reverse().map(function (p) { return [cx + p[0], p[1]]; });
      return "M" + g1.concat(d1).map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") + " Z";
    }
    function moule(cx, ecart) {
      // deux demi-moules gris, empreinte de la bouteille en blanc
      E.s("rect", { x: cx - 160 - ecart, y: 140, width: 160, height: 370, rx: 8, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("rect", { x: cx + ecart, y: 140, width: 160, height: 370, rx: 8, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 3 }, g);
      if (ecart < 1) E.s("path", { d: forme(BOU, cx), fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      D.texte(g, "moule", [cx - 120 - ecart, 160], { taille: 15, coul: C.doux });
    }
    function fonds() {
      // deux fonds de flacon vus de dessous
      [["A", 190, "point"], ["B", 490, "ligne"]].forEach(function (f) {
        var c = [f[1], 330], sel = n.choisi === f[0];
        var gb = E.s("g", { style: "cursor:pointer" }, gz);
        D.rond(gb, c, 120, { fill: sel ? "rgba(229,72,77,0.12)" : "#f3f5fa", stroke: C.encre, ep: 3 });
        D.rond(gb, c, 92, { fill: "none", stroke: "#c6cbd8", ep: 2 });
        if (f[2] === "point") D.rond(gb, c, 9, { fill: C.jeu });
        else E.s("rect", { x: c[0] - 70, y: c[1] - 4, width: 140, height: 8, rx: 4, fill: C.jeu }, gb);
        D.texte(gb, "flacon " + f[0] + " vu de dessous", [c[0], 488], { taille: 17 });
        gb.addEventListener("click", function () { if (n.libre && n.surFond) n.surFond(f[0]); });
      });
    }
    n.dessin = function () {
      E.vider(g); E.vider(gz);
      if (n.mode === "fonds") { fonds(); return; }
      if (n.mode === "inj") {
        moule(CX, 0);
        // canne d'étirage qui descend avec le soufflage
        var bas = 300 + 170 * n.u;
        E.s("path", { d: forme(mix(PRE, BOU, n.u), CX), fill: PLATEFORME.teinte(0.35 + 0.2 * n.u), stroke: C.jeu, "stroke-width": 3 }, g);
        E.s("rect", { x: CX - 7, y: 100, width: 14, height: bas - 100, fill: "#e8b931", stroke: C.encre, "stroke-width": 2, opacity: 0.9 }, g);
        if (n.u > 0.02 && n.u < 1) [[-1, 260], [1, 330], [-1, 400]].forEach(function (a) { D.fleche(g, [CX + a[0] * 14, a[1]], [CX + a[0] * (14 + 50 * n.u), a[1] + 10], "#3b5bdb", 3); });
        D.texte(g, "canne d'étirage", [CX + 180, 112], { taille: 15, coul: C.doux, ancre: "start" });
        D.ligne(g, [CX + 175, 112], [CX + 12, 112], C.doux, 1.5);
        D.texte(g, n.u > 0.5 ? "bouteille" : "préforme", [CX + 180, 300], { taille: 16, coul: C.jeu, ancre: "start" });
        D.texte(g, "air comprimé", [CX + 180, 140], { taille: 15, coul: "#3b5bdb", ancre: "start" });
        return;
      }
      // extrusion-soufflage : tête d'extrusion, tube, moule qui se ferme
      E.s("rect", { x: CX - 60, y: 70, width: 120, height: 50, rx: 8, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 3 }, g);
      D.texte(g, "tête d'extrusion", [CX + 80, 92], { taille: 15, coul: C.doux, ancre: "start" });
      var ec = 90 * (1 - n.ferme);
      moule(CX, ec);
      var pts = n.ferme < 1 ? TUB.map(function (p) { return [p[0], p[1]]; }) : mix(TUB, BOU, n.u);
      var dTube = n.ferme < 1 ? "M" + (CX - 20) + " 120 L" + (CX - 20) + " 520 L" + (CX + 20) + " 520 L" + (CX + 20) + " 120 Z" : forme(pts, CX);
      E.s("path", { d: dTube, fill: PLATEFORME.teinte(0.35 + 0.2 * n.u), stroke: C.jeu, "stroke-width": 3 }, g);
      if (n.ferme >= 1) {
        // le bas du tube pincé par le moule : ligne de soudure
        E.s("rect", { x: CX - 22, y: 488 + 4 * n.u, width: 44, height: 7, rx: 3, fill: C.encre }, g);
        D.texte(g, "ligne de soudure", [CX + 120, 540], { taille: 15, coul: C.encre });
        D.ligne(g, [CX + 60, 532], [CX + 18, 496], C.encre, 1.5);
      }
      if (n.u > 0.02 && n.u < 1) [[-1, 260], [1, 330], [-1, 400]].forEach(function (a) { D.fleche(g, [CX, a[1]], [CX + a[0] * (14 + 50 * n.u), a[1] + 10], "#3b5bdb", 3); });
      D.texte(g, n.ferme < 1 ? "tube chaud" : n.u > 0.5 ? "flacon" : "tube enfermé", [CX + 180, 300], { taille: 16, coul: C.jeu, ancre: "start" });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Gonfler la préforme", jouer: function (j, n) {
      n.libre = true;
      j.fig.astuce("La préforme a été fabriquée par injection, puis chauffée.");
      j.titre("Injection-soufflage d'un flacon de sérum. Envoie l'air comprimé jusqu'à plaquer la matière contre les parois du moule.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.u = 1; n.dessin(); c.regler(100);
        j.bravo("La matière épouse l'empreinte du moule.", [300, 330]);
        j.expliquer("<p><b>Injection-soufflage</b> : on fabrique une préforme par injection ; on la chauffe et on y envoie un jet d'air comprimé qui la pousse contre les parois du moule. La canne d'étirage allonge la préforme pendant le soufflage. Bouteilles, flacons, réservoirs de carburants, contenants divers.</p>");
        j.suite();
      }
      var c = j.curseur({ nom: "air", min: 0, max: 100, pas: 5, val: 0, unite: " %", change: function (v) {
        if (!n.libre) return;
        n.u = v / 100; n.dessin();
        if (v >= 100) gagne();
      } });
      j.reponse(gagne);
    } },
    { nom: "Le cycle par extrusion", jouer: function (j, n) {
      n.mode = "ext"; n.ferme = 0; n.u = 0; n.dessin();
      j.fig.astuce("Ici, pas de préforme injectée : le tube sort d'une extrudeuse.");
      j.titre("Extrusion-soufflage : remets les étapes dans l'ordre.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        ["t", "m", "a", "o"].map(function (id, k) { return "<b>" + (k + 1) + '</b><span class="trou" data-attendu="' + id + '" style="justify-content:flex-start"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "Souffler l'air comprimé" }, { id: "o", html: "Ouvrir, sortir le flacon" }, { id: "t", html: "Extruder un tube" }, { id: "m", html: "Enfermer le tube chaud dans le moule" }],
        aide: "Le tube doit exister avant qu'on l'enferme, et on ne peut souffler que dans un moule fermé.",
        ok: function () {
          E.anime(700, function (u) { n.ferme = u; n.dessin(); }, function () {
            E.anime(900, function (u) { n.u = u; n.dessin(); }, function () {
              j.bravo("Tube, moule fermé, air, démoulage.");
              j.expliquer("<p><b>Extrusion-soufflage</b> : on fabrique un tube par extrusion ; on enferme ce tube chaud à l'intérieur d'un moule et on y envoie un jet d'air comprimé qui le pousse contre les parois. En se fermant, le moule pince le bas du tube.</p>");
              j.suite();
            });
          });
        }
      });
    } },
    { nom: "L'indice au fond", jouer: function (j, n) {
      n.mode = "fonds"; n.libre = true; n.dessin();
      j.fig.astuce("Retourne les flacons et regarde le fond.");
      j.titre("Deux flacons identiques de profil. Touche celui qui a été fabriqué par extrusion-soufflage.");
      function gagne() {
        n.libre = false; n.surFond = null; n.choisi = null; n.dessin();
        j.bravo("Le flacon B : une ligne de soudure au fond.", [490, 330]);
        j.expliquer("<p>Indice de l'extrusion-soufflage : une <b>ligne de soudure</b> au fond du contenant. Indice de l'injection-soufflage : un <b>point d'injection</b> au fond, laissé par la préforme injectée.</p>");
        j.suite();
      }
      n.surFond = function (f) {
        if (f === "B") { gagne(); return; }
        n.choisi = "A"; n.dessin();
        j.erreur("Un point au centre vient d'une préforme moulée par injection. Que laisse un tube pincé par un moule ?");
      };
      j.reponse(function () { if (n.surFond) gagne(); });
    } },
    { nom: "Pourquoi une ligne ?", jouer: function (j, n) {
      n.mode = "ext"; n.ferme = 1; n.u = 1; n.dessin();
      j.fig.astuce("");
      j.titre("D'où vient la ligne de soudure de l'extrusion-soufflage ?");
      j.choix([
        { html: "Le moule, en se fermant, pince et soude le bas du tube ouvert", juste: true },
        { html: "C'est la trace du seuil par lequel la matière est injectée", aide: "Un seuil laisse un point, pas une ligne. Et ici la matière arrive en tube, sans injection." },
        { html: "On la découpe après le démoulage", aide: "Rien n'est découpé au fond : regarde ce que fait le moule au bas du tube quand il se ferme." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le tube est ouvert aux deux bouts : le moule le ferme en bas.");
        j.expliquer("<p>La préforme de l'injection-soufflage est déjà fermée au fond (point d'injection) ; le tube extrudé ne l'est pas, d'où la soudure.</p>");
        j.suite();
      } });
    } },
    { nom: "Le HDPE", jouer: function (j, n) {
      j.titre("En 1953, le chimiste allemand Ziegler apporte le polyéthylène haute densité (HDPE). Quel procédé a-t-il fait décoller, pour les bouteilles et les réservoirs d'essence ?");
      j.choix([
        { html: "Le thermoformage", aide: "Le thermoformage donne des pièces minces, ouvertes, découpées au pourtour : ni bouteille ni réservoir fermé." },
        { html: "L'extrusion-soufflage", juste: true },
        { html: "La compression", aide: "La compression travaille surtout les thermodurcissables (plateaux) ; une bouteille est un contenant creux." }
      ], { ok: function () {
        j.bravo("L'extrusion-soufflage.");
        j.expliquer("<p>L'arrivée du HDPE (1953, Ziegler) a entraîné l'augmentation de l'utilisation de l'extrusion-soufflage pour les bouteilles et les réservoirs d'essence : des contenants creux et fermés.</p>");
        j.suite();
      } });
    } }
  ]
});
