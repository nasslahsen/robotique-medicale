/* Niveau : CISC et RISC (Section I, diapositive 10). Sigles, tableau de comparaison, multiplication en mémoire (exemple ajouté), taille du code, transistors. */
NIVEAU({
  id: "cisc-risc",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "table", vus: 0, pas: -1, prog: null };
    var LIGNES = [
      ["Emphasis on hardware", "Emphasis on software"],
      ["Includes multi-clock\ncomplex instructions", "Single-clock,\nreduced instruction only"],
      ["Memory-to-memory : « LOAD » and\n« STORE » incorporated in instructions", "Register to register : « LOAD » and\n« STORE » are independent instructions"],
      ["Small code sizes,\nhigh cycles per second", "Low cycles per second,\nlarge code sizes"],
      ["Transistors used for storing\ncomplex instructions", "Spends more transistors\non memory registers"]
    ];
    var RISC = ["LOAD A, 2:3", "LOAD B, 5:2", "PROD A, B", "STORE 2:3, A"];
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "table") {
        EMB.texte(g, "CISC", [180, 92], { taille: 24, coul: C.ko });
        EMB.texte(g, "RISC", [505, 92], { taille: 24, coul: C.ko });
        LIGNES.forEach(function (l, i) {
          var y = 118 + i * 92;
          [0, 1].forEach(function (c) {
            var x = c ? 345 : 20, vu = i < n.vus;
            EMB.el("rect", { x: x, y: y, width: 315, height: 80, rx: 12, fill: vu ? (c ? EMB.teinte(0.1) : "#fff") : C.fond, stroke: vu ? C.encre : C.pale, "stroke-width": 2, "stroke-dasharray": vu ? null : "6 6" }, g);
            EMB.texte(g, vu ? l[c] : "?", [x + 157, y + 40], { taille: vu ? 14.5 : 24, coul: vu ? C.encre : C.gris, gras: vu ? false : true, halo: false });
          });
        });
        return;
      }
      // multiplication de deux nombres en mémoire (exemple ajouté)
      var mem = { "2:3": n.m23, "5:2": 7 }, x0 = 70, y0 = 120, w = 58, h = 44;
      EMB.texte(g, "Mémoire", [x0 + 2 * w, 92], { taille: 18 });
      for (var r = 1; r <= 5; r++) {
        EMB.texte(g, String(r), [x0 - 18, y0 + (r - 1) * h + h / 2], { taille: 14, coul: C.doux, mono: true, halo: false });
        for (var c = 1; c <= 4; c++) {
          var k = r + ":" + c, v = mem[k], vise = n.vise && n.vise.indexOf(k) >= 0;
          EMB.el("rect", { x: x0 + (c - 1) * w, y: y0 + (r - 1) * h, width: w, height: h, fill: vise ? C.clair : v !== undefined ? "#fff" : C.fond, stroke: vise ? C.acc : C.pale, "stroke-width": vise ? 3 : 1.5 }, g);
          if (v !== undefined) EMB.texte(g, String(v), [x0 + (c - 0.5) * w, y0 + (r - 0.5) * h], { taille: 18, mono: true, halo: false });
        }
      }
      for (c = 1; c <= 4; c++) EMB.texte(g, String(c), [x0 + (c - 0.5) * w, y0 - 14], { taille: 14, coul: C.doux, mono: true, halo: false });
      EMB.texte(g, "Registres", [520, 92], { taille: 18 });
      [["A", n.rA], ["B", n.rB]].forEach(function (rg, i) {
        EMB.bloc(g, 440, 120 + i * 62, 50, 48, rg[0], { taille: 18, fill: C.fond });
        EMB.bloc(g, 495, 120 + i * 62, 130, 48, rg[1] === undefined ? "" : String(rg[1]), { taille: 20, mono: true });
      });
      EMB.texte(g, "CISC", [150, 375], { taille: 19, coul: C.ko });
      EMB.bloc(g, 40, 395, 230, 50, "MULT 2:3, 5:2", { taille: 17, mono: true, actif: n.prog === "cisc" && n.pas === 0 });
      EMB.texte(g, "RISC", [490, 375], { taille: 19, coul: C.ko });
      RISC.forEach(function (l, i) { EMB.bloc(g, 360, 395 + i * 48, 260, 42, l, { taille: 16, mono: true, actif: n.prog === "risc" && n.pas === i, rx: 6 }); });
    };
    // exécution pas à pas
    n.executer = function (prog, fin) {
      n.mode = "mult"; n.prog = prog; n.pas = -1; n.m23 = 6; n.rA = undefined; n.rB = undefined; n.vise = null; n.dessin();
      var etapes = prog === "cisc" ? [function () { n.vise = ["2:3", "5:2"]; n.m23 = 42; }] : [
        function () { n.vise = ["2:3"]; n.rA = 6; }, function () { n.vise = ["5:2"]; n.rB = 7; },
        function () { n.vise = null; n.rA = 42; }, function () { n.vise = ["2:3"]; n.m23 = 42; }];
      var k = 0, id = setInterval(function () {
        if (k >= etapes.length) { clearInterval(id); if (fin) fin(); return; }
        n.pas = k; etapes[k](); n.dessin(); k++;
      }, 700);
      return id;
    };
    n.m23 = 6;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les sigles", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Complète les deux sigles.");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.4">CISC : <span class="trou" data-attendu="c"></span> Instruction Set Computer<br>RISC : <span class="trou" data-attendu="r"></span> Instruction Set Computer</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "r", html: "Reduced" }, { id: "x", html: "Rapid" }, { id: "c", html: "Complex" }, { id: "y", html: "Compact" }],
        aide: "Le C du début de CISC et le R du début de RISC : un jeu d'instructions complexe, ou réduit.",
        ok: function () {
          j.bravo("Complex et Reduced.");
          j.expliquer("<p><b>CISC</b> : <i>Complex Instruction Set Computer</i>, un jeu d'instructions riche et complexe. <b>RISC</b> : <i>Reduced Instruction Set Computer</i>, un jeu d'instructions réduit et simple.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Trier", jouer: function (j, n) {
      j.titre("Range chaque propriété dans la bonne colonne du tableau du cours.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:16px;text-align:center"><b>CISC</b><b>RISC</b><span class="trou" data-attendu="c1"></span><span class="trou" data-attendu="r1"></span><span class="trou" data-attendu="c2"></span><span class="trou" data-attendu="r2"></span><span class="trou" data-attendu="c3"></span><span class="trou" data-attendu="r3"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "r2", html: "Single-clock, reduced instruction only" }, { id: "c1", html: "Emphasis on hardware" }, { id: "r3", html: "Register to register" }, { id: "c2", html: "Multi-clock complex instructions" }, { id: "r1", html: "Emphasis on software" }, { id: "c3", html: "Memory-to-memory" }],
        aide: "Une ligne par thème : l'accent (matériel ou logiciel), la durée des instructions, où se font les opérations (mémoire ou registres). Le CISC met la complexité dans le matériel.",
        ok: function () {
          n.vus = 3; n.dessin();
          j.bravo("Les trois premières lignes du tableau.");
          j.expliquer("<p>En CISC, une instruction peut prendre plusieurs cycles d'horloge et agir directement d'une case mémoire à une autre : « LOAD » et « STORE » sont incorporés dans l'instruction. En RISC, chaque instruction tient en un cycle et travaille de registre à registre ; « LOAD » et « STORE » sont des instructions à part.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Multiplier", jouer: function (j, n) {
      n.mode = "mult"; n.m23 = 6; n.rA = undefined; n.rB = undefined; n.prog = null; n.dessin();
      j.titre("Exemple ajouté : multiplier la valeur de la case 2:3 par celle de la case 5:2, et ranger le résultat en 2:3. Combien d'instructions en CISC ? Et en RISC ?");
      j.nombre({ avant: "\\text{CISC},\\ \\text{RISC} :", cases: [{ attendu: 1, tol: 0 }, { attendu: 4, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "En CISC, une seule instruction va chercher en mémoire, multiplie et range." : "En RISC, il faut charger chaque nombre dans un registre, multiplier, puis ranger : compte les lignes."; },
        ok: function () {
          var id = n.executer("risc"); j.nettoyer(function () { clearInterval(id); });
          j.bravo("1 instruction complexe contre 4 instructions simples. Regarde le RISC s'exécuter.");
          j.expliquer("<p>Le RISC ne touche la mémoire qu'avec LOAD et STORE ; PROD ne travaille que sur des registres. Le CISC fait tout avec MULT, mais cette instruction dure plusieurs cycles.</p>");
          j.suite();
        } });
    } },
    { nom: "Taille du code", jouer: function (j, n) {
      n.mode = "table"; n.vus = 3; n.dessin();
      j.titre("D'après ce que tu viens de voir, quel programme est le plus long en mémoire, et lequel demande le plus de cycles par instruction ?");
      j.choix([
        { html: "RISC : code plus long ; CISC : plus de cycles par instruction", juste: true },
        { html: "CISC : code plus long ; RISC : plus de cycles par instruction", aide: "Compte les lignes de l'exemple : 1 en CISC, 4 en RISC. Et une instruction RISC tient en un seul cycle." },
        { html: "Les deux sont pareils", aide: "Reprends l'exemple de la multiplication : le nombre d'instructions n'était pas le même." }
      ], { colonnes: 1, ok: function () {
        n.vus = 4; n.dessin();
        j.bravo("CISC : small code sizes, high cycles per second. RISC : low cycles per second, large code sizes.");
        j.suite();
      } });
    } },
    { nom: "L'erreur", jouer: function (j, n) {
      j.titre("Un camarade résume le tableau. Quelle phrase est fausse ?");
      j.choix([
        { html: "« Le RISC met l'accent sur le logiciel. »", aide: "C'est juste : <i>Emphasis on software</i>." },
        { html: "« Le RISC consacre ses transistors au stockage d'instructions complexes. »", juste: true },
        { html: "« En CISC, LOAD et STORE sont dans les instructions. »", aide: "C'est juste : <i>memory-to-memory</i>, LOAD et STORE incorporés." }
      ], { colonnes: 1, ok: function () {
        n.vus = 5; n.dessin();
        j.bravo("C'est le CISC qui stocke des instructions complexes ; le RISC met ses transistors dans les registres.");
        j.expliquer("<p>Dernière ligne du tableau : le CISC utilise ses transistors pour stocker des instructions complexes ; le RISC <i>spends more transistors on memory registers</i>. Les AVR et les ARM du cours sont des RISC.</p>");
        j.suite();
      } });
    } }
  ]
});
