/* Niveau : engrenages. Pignon, roue, couronne, crémaillère ; axes parallèles, concourants, gauches ; types ; pourquoi un réducteur. */
NIVEAU({
  id: "engrenages",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "vocab", choisis: {}, surTouche: null, paire: null };
    var M = MECA, PALE = PLATEFORME.teinte(0.22);
    // dessins schématiques des trois positions d'axes et des quatre types
    function axe(a, b) { M.traitAxe(g, a, b, { coul: "#3b5bdb", ep: 2.4 }); }
    function cone(sommet, dir, L0, L1, r0, r1, fill) {
      // tronc de cône vu de côté, axe dans la direction dir depuis le sommet, de la distance L0 à L1
      var u = dir, v = [-u[1], u[0]], P = function (L, r) { return [sommet[0] + u[0] * L + v[0] * r, sommet[1] + u[1] * L + v[1] * r]; };
      var l = [P(L0, r0), P(L1, r1), P(L1, -r1), P(L0, -r0)];
      E.s("polygon", { points: l.map(function (p) { return p.join(","); }).join(" "), fill: fill, stroke: C.encre, "stroke-width": 2 }, g);
      for (var k = 1; k < 6; k++) { var f = k / 6, a = [l[0][0] + (l[1][0] - l[0][0]) * f, l[0][1] + (l[1][1] - l[0][1]) * f], b = [l[3][0] + (l[2][0] - l[3][0]) * f, l[3][1] + (l[2][1] - l[3][1]) * f]; D.ligne(g, a, b, C.encre, 1, null); }
    }
    function faceDents(x, y, w, h, pente, fill, chevron) {
      E.s("rect", { x: x, y: y, width: w, height: h, rx: 4, fill: fill, stroke: C.encre, "stroke-width": 2 }, g);
      for (var k = 0; k <= 9; k++) {
        var xx = x + 6 + (w - 12) * k / 9;
        if (chevron) { D.ligne(g, [xx - pente / 2, y], [xx, y + h / 2], C.encre, 1.6); D.ligne(g, [xx, y + h / 2], [xx - pente / 2, y + h], C.encre, 1.6); }
        else D.ligne(g, [xx - pente / 2, y + 2], [xx + pente / 2, y + h - 2], C.encre, 1.6);
      }
    }
    function vis(x0, x1, y, r) {
      E.s("rect", { x: x0, y: y - r, width: x1 - x0, height: 2 * r, rx: 8, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2 }, g);
      for (var x = x0 + 10; x < x1 - 4; x += 16) D.ligne(g, [x, y - r + 2], [x + 10, y + r - 2], C.encre, 2);
    }
    n.dessin = function () {
      E.vider(g);
      var cl = function (k) { return n.choisis[k] === true ? "#e3f7ee" : n.choisis[k] === false ? "#fdecec" : null; };
      if (n.mode === "vocab") {
        M.roue(g, [175, 170], { m: 7, Z: 30, fill: cl("roue") || "#dfe3ea" });
        M.roue(g, [175 + 7 * 21, 170], { m: 7, Z: 12, rot: Math.PI / 12 + Math.PI, fill: cl("pignon") || PALE });
        M.couronne(g, [530, 175], { m: 5, Z: 36, rot: -Math.PI / 2, fill: cl("couronne") || "#dfe3ea" });
        M.roue(g, [530, 235], { m: 5, Z: 12, rot: -Math.PI / 2, fill: cl("pignon") || PALE });
        M.cremaillere(g, 70, 610, 505, { m: 8, dx: 340 + 4 * Math.PI, fill: cl("cremaillere") || "#dfe3ea" });
        M.roue(g, [340, 505 - 56], { m: 8, Z: 14, rot: -Math.PI / 2, fill: cl("pignon") || PALE });
        n.cibles = { roue: [[175, 170], 0, 95], pignonA: [[322, 170], 0, 46], couronne: [[530, 175], 86, 125], pignonB: [[530, 235], 0, 34], pignonC: [[340, 449], 0, 62], cremaillere: [[340, 535], 0, 0] };
      } else if (n.mode === "axes") {
        [["A", 115], ["B", 340], ["C", 565]].forEach(function (l) {
          var ch = n.paire === l[0];
          E.s("rect", { x: l[1] - 105, y: 120, width: 210, height: 380, rx: 20, fill: ch ? "#e3f7ee" : "#fafbfd", stroke: ch ? C.ok : C.pale, "stroke-width": 2 }, g);
          D.texte(g, l[0], [l[1], 150], { taille: 28, coul: C.doux });
        });
        // A : deux roues, axes parallèles (vue de côté)
        axe([40, 255], [190, 255]); axe([40, 385], [190, 385]);
        E.s("rect", { x: 85, y: 190, width: 60, height: 130, rx: 4, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 85, y: 320, width: 60, height: 130, rx: 4, fill: PALE, stroke: C.encre, "stroke-width": 2 }, g);
        // B : roues coniques, axes concourants
        var S = [400, 250];
        axe([250, 250], [420, 250]); axe([400, 470], [400, 230]);
        cone(S, [-1, 0], 40, 110, 22, 64, "#dfe3ea");
        cone(S, [0, 1], 40, 110, 22, 64, PALE);
        D.rond(g, S, 6, { fill: "#3b5bdb" });
        // C : roue et vis sans fin, axes gauches
        M.roue(g, [565, 290], { m: 5, Z: 26, fill: "#dfe3ea", trou: 12 });
        D.rond(g, [565, 290], 5, { fill: "#3b5bdb" });
        vis(480, 650, 382, 20);
        axe([470, 382], [660, 382]);
        D.texte(g, "axe de la roue : vers toi", [565, 470], { taille: 14, coul: "#3b5bdb", gras: false });
      } else if (n.mode === "types") {
        D.texte(g, "a", [70, 110], { taille: 26, coul: C.doux }); faceDents(110, 90, 200, 70, 0, "#dfe3ea");
        D.texte(g, "b", [370, 110], { taille: 26, coul: C.doux }); faceDents(410, 90, 200, 70, 22, "#dfe3ea");
        D.texte(g, "c", [70, 320], { taille: 26, coul: C.doux });
        cone([270, 300], [-1, 0], 30, 120, 18, 70, "#dfe3ea"); cone([270, 300], [0, 1], 30, 120, 18, 70, PALE);
        D.texte(g, "d", [370, 320], { taille: 26, coul: C.doux });
        M.roue(g, [530, 330], { m: 4, Z: 30, fill: "#dfe3ea", trou: 10 }); vis(430, 640, 412, 16);
        D.texte(g, "dents parallèles à l'axe", [210, 190], { taille: 15, coul: C.doux, gras: false });
        D.texte(g, "dents inclinées", [510, 190], { taille: 15, coul: C.doux, gras: false });
      } else if (n.mode === "robot") {
        M.roue(g, [250, 300], { m: 6, Z: 12, fill: PALE });
        M.roue(g, [250 + 6 * 30, 300], { m: 6, Z: 48, rot: Math.PI / 48 + Math.PI, fill: "#dfe3ea" });
        E.s("rect", { x: 60, y: 260, width: 120, height: 80, rx: 12, fill: "#5b6172", stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "moteur", [120, 300], { coul: "#fff", fondCoul: "#5b6172", taille: 17 });
        D.texte(g, "vers l'instrument", [430, 512], { taille: 17, coul: C.doux, gras: false });
        D.texte(g, "Z = 12", [250, 360], { taille: 16, mono: true });
        D.texte(g, "Z = 48", [430, 478], { taille: 16, mono: true });
      } else if (n.mode === "boite") {
        [["A", 190, 12, 30], ["B", 490, 30, 12]].forEach(function (l) {
          var ch = n.paire === l[0], m = 5, a = m * (l[2] + l[3]) / 2;
          E.s("rect", { x: l[1] - 140, y: 70, width: 280, height: 460, rx: 20, fill: ch ? (l[0] === "A" ? "#e3f7ee" : "#fdecec") : "#fafbfd", stroke: ch ? (l[0] === "A" ? C.ok : C.ko) : C.pale, "stroke-width": 2 }, g);
          D.texte(g, l[0], [l[1] - 110, 100], { taille: 26, coul: C.doux });
          M.roue(g, [l[1], 140 + m * l[2] / 2 + 20], { m: m, Z: l[2], rot: -Math.PI / 2, fill: PALE, trou: 8 });
          M.roue(g, [l[1], 140 + m * l[2] / 2 + 20 + a], { m: m, Z: l[3], rot: Math.PI / 2 + Math.PI / l[3], fill: "#dfe3ea", trou: 8 });
          D.texte(g, "menante", [l[1] + 110, 160], { taille: 15, coul: C.doux, gras: false, ancre: "end" });
          D.texte(g, "menée", [l[1] + 110, 505], { taille: 15, coul: C.doux, gras: false, ancre: "end" });
        });
      }
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche) return false;
        if (n.mode === "vocab") {
          var best = null;
          Object.keys(n.cibles).forEach(function (k) {
            var c = n.cibles[k], d = Math.hypot(p[0] - c[0][0], p[1] - c[0][1]);
            if (k === "cremaillere") { if (p[1] > 500 && p[1] < 570 && Math.abs(p[0] - 340) > 50) best = k; return; }
            if (d >= c[1] && d <= c[2] && !best) best = k;
          });
          // un pignon est aussi touché quand on est sur lui, même au bord de la roue voisine
          if (best) n.surTouche(best.indexOf("pignon") === 0 ? "pignon" : best);
        } else {
          var x = p[0];
          n.surTouche(n.mode === "boite" ? (x < 340 ? "A" : "B") : (x < 228 ? "A" : x < 453 ? "B" : "C"));
        }
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Vocabulaire", jouer: function (j, n) {
      j.fig.astuce("Touche les pièces sur la figure.");
      var ordre = [["couronne", "la <b>couronne</b> : ses dents sont sur sa face intérieure"], ["cremaillere", "la <b>crémaillère</b> : une barre droite munie de dents"], ["roue", "la <b>roue</b> qui engrène avec un pignon (en haut à gauche)"], ["pignon", "un <b>pignon</b> : la petite roue dentée d'un engrenage"]];
      var NOMS = { couronne: "la couronne", cremaillere: "la crémaillère", roue: "la roue", pignon: "un pignon" };
      var k = 0, cons;
      j.titre("Dans le réducteur d'une articulation, plusieurs roues dentées travaillent ensemble : une combinaison d'engrenages s'appelle un train d'engrenages. Repère ses pièces.");
      cons = j.consigne("");
      function poser() { cons.innerHTML = "Touche " + ordre[k][1] + "."; }
      poser();
      n.surTouche = function (id) {
        if (id === ordre[k][0]) {
          n.choisis[id] = true; n.dessin(); k++;
          if (k < ordre.length) { j.info("Oui."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          j.bravo("Pignon, roue, couronne, crémaillère.");
          j.expliquer("<p>Dans un engrenage pignon-roue extérieur, la <b>roue</b> est généralement la plus grande des deux. La <b>couronne</b> engrène avec un pignon placé à l'intérieur. Avec la <b>crémaillère</b>, la rotation du pignon devient un déplacement rectiligne, ou inversement.</p>");
          j.suite();
        } else {
          n.choisis[id] = false; n.dessin();
          setTimeout(function () { if (n.choisis[id] === false) { delete n.choisis[id]; n.dessin(); } }, 900);
          j.erreur("Ça, c'est " + NOMS[id] + ".");
        }
      };
      j.reponse(function () { for (var s = 0; s < 6 && n.surTouche; s++) n.surTouche(ordre[k][0]); });
      j.nettoyer(function () { n.surTouche = null; });
    } },
    { nom: "Position des axes", jouer: function (j, n) {
      n.mode = "axes"; n.dessin();
      j.fig.astuce("Les axes sont en traits mixtes bleus.");
      j.titre("Classe chaque engrenage selon la position relative de ses axes.");
      var z = j.zone("", ["A", "B", "C"].map(function (l, i) { return '<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><b style="width:24px">' + l + '</b><span class="trou" data-attendu="' + ["par", "conc", "gau"][i] + '" style="min-width:200px"></span></div>'; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "gau", html: "gauches" }, { id: "par", html: "parallèles" }, { id: "conc", html: "concourants" }],
        aide: "Parallèles : les axes ne se coupent jamais et sont dans un même plan. Concourants : ils se coupent. Gauches : ils ne sont pas dans un même plan.",
        ok: function () {
          j.bravo("A parallèles, B concourants, C gauches.");
          j.expliquer("<p>Suivant la position relative des axes des roues, on distingue les engrenages <b>parallèles</b>, <b>concourants</b> et <b>gauches</b> (les axes ne sont pas dans un même plan).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Types", jouer: function (j, n) {
      n.mode = "types"; n.dessin();
      j.fig.astuce("Quatre types d'engrenages.");
      j.titre("Associe chaque type à ce qu'il apporte.");
      var T = [["a · denture droite", "droit"], ["b · denture hélicoïdale", "heli"], ["c · coniques", "conique"], ["d · roue et vis sans fin", "vis"]];
      var z = j.zone("", T.map(function (t) { return '<div style="display:flex;align-items:center;gap:10px;margin:6px 0"><span style="width:190px;font-size:16px">' + t[0] + '</span><span class="trou" data-attendu="' + t[1] + '" style="flex:1;min-height:56px"></span></div>'; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "vis", html: "grand rapport, souvent irréversible" }, { id: "conique", html: "arbres qui se croisent" }, { id: "heli", html: "plus progressif et silencieux" }, { id: "droit", html: "dents parallèles à l'axe" }],
        aide: "Regarde les dessins : les dents inclinées entrent en prise peu à peu ; les cônes relient des axes qui se coupent ; une vis fait beaucoup de tours pour une dent de roue.",
        ok: function () {
          j.bravo("Les quatre types sont rangés.");
          j.expliquer("<p>La roue et vis sans fin relie deux arbres non concourants et perpendiculaires : la vis doit faire un tour entier pour avancer la roue d'une dent, d'où le grand rapport de réduction. Le système est souvent <b>irréversible</b> : la roue ne peut pas entraîner la vis.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi ?", jouer: function (j, n) {
      n.mode = "robot"; n.dessin();
      j.fig.astuce("Un réducteur dans une articulation de robot chirurgical.");
      j.titre("Pourquoi les articulations d'un robot chirurgical contiennent-elles des réducteurs à engrenages ?");
      j.choix([
        { html: "Pour adapter la rotation rapide du moteur en un mouvement plus lent, précis et suffisamment puissant", juste: true },
        { html: "Pour que l'instrument tourne plus vite que le moteur", aide: "Regarde les tailles : le petit pignon du moteur entraîne une grande roue. La sortie tourne moins vite." },
        { html: "Pour augmenter la puissance fournie par le moteur", aide: "Un engrenage transmet la puissance, il n'en crée pas : avec les pertes, elle diminue même un peu." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Plus lent, plus précis, plus de couple.");
        j.expliquer("<p>Un <b>engrenage</b> est un mécanisme composé de deux roues dentées en prise, qui transmet un mouvement de rotation et une puissance entre des arbres, selon un rapport de vitesse constant.</p>");
        j.suite();
      } });
    } },
    { nom: "La côte", jouer: function (j, n) {
      n.mode = "boite"; n.paire = null; n.dessin();
      j.fig.astuce("Deux couples de roues d'une boîte de vitesses. Touche A ou B.");
      j.titre("Pour démarrer ou monter une côte, quel couple de roues sélectionner ?");
      var fini = false;
      function gagne() {
        fini = true; n.surTouche = null; n.paire = "A"; n.dessin();
        j.bravo("A : la roue menée tourne moins vite et donne plus de couple.");
        j.expliquer("<p>Dans le cours, un rapport faible (sortie lente devant l'entrée) favorise le couple pour démarrer ou monter une côte ; un rapport important favorise une vitesse plus élevée. Ici le rapport est vitesse de sortie sur vitesse d'entrée : 12/30 = 0,4 pour A et 30/12 = 2,5 pour B.</p>");
        j.suite();
      }
      n.surTouche = function (p) {
        if (fini) return;
        if (p === "A") { gagne(); return; }
        n.paire = "B"; n.dessin(); j.erreur("Avec B, la grande roue entraîne la petite : la sortie tourne plus vite, avec moins de couple.");
      };
      j.reponse(function () { if (!fini) gagne(); });
      j.nettoyer(function () { n.surTouche = null; });
    } }
  ]
});
