/* Niveau : définition d'un système embarqué (Section I, diapositives 3 et 4). Reconnaître, construire la définition, contraintes, embedded controller et embedded computer system. */
NIVEAU({
  id: "definition",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "objets", choisi: null, bon: null, surTouche: null, montre: {} };
    var CARTES = {
      semelle: [30, 40, 300, 255, "Semelle connectée"],
      tensio: [350, 40, 300, 255, "Tensiomètre"],
      pc: [30, 315, 300, 255, "Ordinateur de bureau"],
      pousse: [350, 315, 300, 255, "Pousse-seringue"]
    };
    n.CARTES = CARTES;
    function semelle(x, y) {
      var d = "M" + (x + 150) + " " + (y + 20) + " C" + (x + 205) + " " + (y + 20) + " " + (x + 215) + " " + (y + 80) + " " + (x + 205) + " " + (y + 120) +
        " C" + (x + 195) + " " + (y + 160) + " " + (x + 190) + " " + (y + 175) + " " + (x + 186) + " " + (y + 190) +
        " C" + (x + 180) + " " + (y + 212) + " " + (x + 120) + " " + (y + 212) + " " + (x + 115) + " " + (y + 190) +
        " C" + (x + 110) + " " + (y + 160) + " " + (x + 95) + " " + (y + 120) + " " + (x + 98) + " " + (y + 80) +
        " C" + (x + 100) + " " + (y + 40) + " " + (x + 115) + " " + (y + 20) + " " + (x + 150) + " " + (y + 20) + "Z";
      EMB.el("path", { d: d, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      [[150, 50], [130, 75], [172, 75], [125, 105], [160, 110], [150, 150], [150, 185]].forEach(function (p) { EMB.el("ellipse", { cx: x + p[0], cy: y + p[1], rx: 9, ry: 6, fill: C.acc }, g); });
      EMB.bloc(g, x + 225, y + 120, 52, 40, "µC", { taille: 16, rx: 6 });
      EMB.el("line", { x1: x + 192, y1: y + 140, x2: x + 225, y2: y + 140, stroke: C.encre, "stroke-width": 2.5 }, g);
    }
    function tensio(x, y) {
      EMB.el("rect", { x: x + 40, y: y + 40, width: 90, height: 150, rx: 26, fill: C.clair, stroke: C.encre, "stroke-width": 3 }, g);
      EMB.el("path", { d: "M" + (x + 130) + " " + (y + 115) + " C" + (x + 170) + " " + (y + 115) + " " + (x + 160) + " " + (y + 160) + " " + (x + 185) + " " + (y + 160), fill: "none", stroke: C.encre, "stroke-width": 4 }, g);
      EMB.el("rect", { x: x + 180, y: y + 70, width: 90, height: 120, rx: 12, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.el("rect", { x: x + 192, y: y + 84, width: 66, height: 46, rx: 4, fill: "#eef3f7", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "120/80", [x + 225, y + 107], { taille: 15, mono: true, halo: false });
      EMB.el("circle", { cx: x + 225, cy: y + 160, r: 12, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
    }
    function pc(x, y) {
      EMB.el("rect", { x: x + 60, y: y + 30, width: 180, height: 120, rx: 8, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.el("rect", { x: x + 72, y: y + 42, width: 156, height: 96, rx: 3, fill: "#eef0f5" }, g);
      [[84, 56, 70], [84, 74, 110], [84, 92, 90], [84, 110, 120]].forEach(function (l) { EMB.el("rect", { x: x + l[0], y: y + l[1], width: l[2], height: 8, rx: 3, fill: "#c6cbd8" }, g); });
      EMB.el("rect", { x: x + 135, y: y + 150, width: 30, height: 22, fill: C.gris }, g);
      EMB.el("rect", { x: x + 100, y: y + 172, width: 100, height: 8, rx: 3, fill: C.gris }, g);
      EMB.el("rect", { x: x + 55, y: y + 188, width: 190, height: 22, rx: 5, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
    }
    function pousse(x, y) {
      EMB.el("rect", { x: x + 30, y: y + 110, width: 240, height: 90, rx: 12, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.el("rect", { x: x + 45, y: y + 125, width: 70, height: 40, rx: 4, fill: "#eef3f7", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "5 mL/h", [x + 80, y + 145], { taille: 13, mono: true, halo: false });
      EMB.el("rect", { x: x + 70, y: y + 62, width: 150, height: 34, rx: 6, fill: C.clair, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("rect", { x: x + 220, y: y + 72, width: 30, height: 14, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.el("line", { x1: x + 30, y1: y + 79, x2: x + 70, y2: y + 79, stroke: C.encre, "stroke-width": 5 }, g);
      EMB.el("rect", { x: x + 20, y: y + 60, width: 12, height: 38, rx: 3, fill: C.encre }, g);
      EMB.el("line", { x1: x + 250, y1: y + 79, x2: x + 285, y2: y + 50, stroke: C.encre, "stroke-width": 3 }, g);
      [0, 1, 2].forEach(function (k) { EMB.el("circle", { cx: x + 150 + k * 32, cy: y + 168, r: 10, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g); });
    }
    var DESSINS = { semelle: semelle, tensio: tensio, pc: pc, pousse: pousse };

    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "objets") {
        Object.keys(CARTES).forEach(function (k) {
          var c = CARTES[k], ch = n.choisi === k, coul = ch ? (k === n.bon ? C.ok : C.ko) : C.pale;
          EMB.el("rect", { x: c[0], y: c[1], width: c[2], height: c[3], rx: 18, fill: ch ? (k === n.bon ? "#e3f7ee" : "#fdecec") : "#fafbfd", stroke: coul, "stroke-width": ch ? 3 : 2 }, g);
          DESSINS[k](c[0], c[1]);
          EMB.texte(g, c[4], [c[0] + c[2] / 2, c[1] + c[3] - 26], { taille: 19 });
          if (n.montre[k]) EMB.texte(g, n.montre[k], [c[0] + c[2] / 2, c[1] + 20], { taille: 15, coul: n.montre[k] === "généraliste" ? C.ko : C.ok });
        });
      } else if (n.mode === "systeme") {
        // le système embarqué : matériel et logiciel, autonome, dédié, ressources limitées
        EMB.el("rect", { x: 70, y: 70, width: 540, height: 360, rx: 26, fill: EMB.teinte(0.07), stroke: C.acc, "stroke-width": 3 }, g);
        EMB.texte(g, "Système embarqué", [340, 100], { taille: 24, coul: C.acc });
        EMB.bloc(g, 110, 140, 210, 170, "Matériel\n(électronique)\n\ncapteurs, µC,\nalimentation", { taille: 18, actif: n.montre.materiel });
        EMB.bloc(g, 360, 140, 210, 170, "Logiciel\n(informatique)\n\nprogramme\ndédié", { taille: 18, actif: n.montre.logiciel });
        EMB.texte(g, "+", [340, 225], { taille: 40, coul: C.doux, halo: false });
        EMB.bloc(g, 170, 340, 340, 56, "une tâche bien précise", { taille: 19, fill: "#fff", stroke: C.acc, coul: C.acc });
        // contraintes
        EMB.bloc(g, 70, 470, 250, 80, "Consommation\nélectrique", { taille: 18, actif: n.montre.energie, tirets: n.montre.energie ? null : "7 6" });
        EMB.bloc(g, 360, 470, 250, 80, "Espace\ndes circuits", { taille: 18, actif: n.montre.espace, tirets: n.montre.espace ? null : "7 6" });
        EMB.texte(g, "ressources limitées", [340, 575], { taille: 16, coul: C.doux, gras: false });
      } else {
        // embedded controller (dans un ordinateur) et embedded computer system (dans un système plus grand)
        EMB.el("rect", { x: 20, y: 40, width: 310, height: 520, rx: 20, fill: "#fafbfd", stroke: C.pale, "stroke-width": 2 }, g);
        EMB.texte(g, "Ordinateur portable", [175, 72], { taille: 19 });
        EMB.bloc(g, 60, 110, 230, 80, "Processeur\nprincipal", { taille: 18 });
        EMB.bloc(g, 60, 280, 230, 80, "A", { taille: 30, actif: n.montre.A });
        EMB.texte(g, "indépendant", [175, 235], { taille: 15, coul: C.doux, gras: false });
        EMB.el("line", { x1: 175, y1: 190, x2: 175, y2: 280, stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "5 6" }, g);
        [["clavier", 34], ["batterie", 131], ["ventilateur", 228]].forEach(function (b) {
          EMB.bloc(g, b[1], 450, 88, 50, b[0], { taille: 13, fill: C.fond });
          EMB.fleche(g, [175, 360], [b[1] + 44, 450], { coul: C.encre, ep: 2 });
        });
        EMB.el("rect", { x: 350, y: 40, width: 310, height: 520, rx: 20, fill: "#fafbfd", stroke: C.pale, "stroke-width": 2 }, g);
        EMB.texte(g, "Échographe", [505, 72], { taille: 19 });
        EMB.bloc(g, 380, 110, 120, 70, "Sonde", { taille: 17, fill: C.fond });
        EMB.bloc(g, 520, 110, 120, 70, "Écran", { taille: 17, fill: C.fond });
        EMB.bloc(g, 395, 260, 230, 90, "B", { taille: 30, actif: n.montre.B });
        EMB.bloc(g, 380, 440, 120, 70, "Clavier", { taille: 17, fill: C.fond });
        EMB.bloc(g, 520, 440, 120, 70, "Chariot", { taille: 17, fill: C.fond });
        EMB.fleche(g, [440, 180], [470, 260], { ep: 2 }); EMB.fleche(g, [550, 260], [580, 180], { ep: 2 });
        EMB.fleche(g, [440, 440], [470, 350], { ep: 2 });
        if (n.montre.B) EMB.texte(g, "forme l'image", [510, 238], { taille: 15, coul: C.doux, gras: false });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (n.mode !== "objets" || !n.surTouche) return {};
      var z = {}; Object.keys(CARTES).forEach(function (k) { z[k] = CARTES[k].slice(0, 4); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "L'intrus", jouer: function (j, n) {
      j.fig.astuce("Touche une carte.");
      j.titre("Trois de ces appareils sont des systèmes embarqués. Touche celui qui n'en est pas un.");
      var fini = false, AIDE = {
        semelle: "La semelle ne fait qu'une chose : mesurer les appuis du pied et les transmettre. Elle est dédiée.",
        tensio: "Le tensiomètre ne fait qu'une chose : mesurer la pression artérielle. Il est dédié.",
        pousse: "Le pousse-seringue ne fait qu'une chose : pousser le piston à un débit réglé. Il est dédié."
      };
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "pc"; n.dessin();
        if (k !== "pc") { j.erreur(AIDE[k]); return; }
        fini = true; n.surTouche = null;
        n.montre = { semelle: "dédié", tensio: "dédié", pousse: "dédié", pc: "généraliste" }; n.dessin();
        j.bravo("L'ordinateur de bureau est généraliste : il fait tout ce qu'on lui installe.", [180, 440]);
        j.expliquer("<p>Un <b>système embarqué</b> (<i>embedded system</i>) est un système électronique et informatique autonome qui est dédié à une tâche bien précise. L'ordinateur de bureau, lui, n'est dédié à aucune tâche.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("pc"); });
    } },
    { nom: "La définition", jouer: function (j, n) {
      n.mode = "systeme"; n.montre = {}; n.dessin();
      j.fig.astuce("");
      j.titre("Complète la définition du cours.");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.4">Un système <span class="trou" data-attendu="e"></span> et <span class="trou" data-attendu="i"></span> <span class="trou" data-attendu="a"></span> qui est dédié à <span class="trou" data-attendu="t"></span>.</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "t", html: "une tâche bien précise" }, { id: "a", html: "autonome" }, { id: "p", html: "toutes les tâches" }, { id: "e", html: "électronique" }, { id: "i", html: "informatique" }],
        aide: "Deux mots pour le matériel et le logiciel, un mot pour « il fonctionne seul », puis ce à quoi il sert.",
        ok: function () {
          n.montre = { materiel: true, logiciel: true }; n.dessin();
          j.bravo("Électronique et informatique, autonome, dédié à une tâche bien précise.");
          j.expliquer("<p>Le terme « système embarqué » désigne aussi bien le <b>matériel</b> que le <b>logiciel</b> utilisé : la carte seule, sans son programme, ne fait rien.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Ressources limitées", jouer: function (j, n) {
      j.titre("La semelle vit sur un petit accumulateur et doit tenir dans une chaussure. Quelles ressources sont limitées ?");
      j.choix([
        { html: "La consommation électrique et l'espace des circuits", juste: true },
        { html: "La vitesse du Wi-Fi et la taille de l'écran", aide: "La semelle n'a pas d'écran. Pense à ce qui est rare dans une chaussure : la place et l'énergie." },
        { html: "Rien : un système embarqué a toutes les ressources d'un ordinateur", aide: "Relis la situation : un petit accumulateur, une chaussure." }
      ], { colonnes: 1, ok: function () {
        n.montre = { materiel: true, logiciel: true, energie: true, espace: true }; n.dessin();
        j.bravo("Énergie et place : les deux contraintes du cours.");
        j.expliquer("<p>Un système embarqué a des <b>ressources limitées</b> : consommation électrique, espace des circuits. C'est pour cela qu'on choisit des microcontrôleurs sobres plutôt que des processeurs d'ordinateur.</p>");
        j.suite();
      } });
    } },
    { nom: "Trois critères", jouer: function (j, n) {
      j.titre("Le cours donne aussi trois critères en anglais. Lequel n'en fait pas partie ?");
      j.choix([
        { html: "<i>includes a microprocessor</i>", aide: "Celui-ci en fait partie : il y a toujours un microprocesseur." },
        { html: "<i>involves the immediate control of hardware</i>", aide: "Celui-ci en fait partie : le programme agit directement sur le matériel." },
        { html: "<i>runs any application the user installs</i>", juste: true },
        { html: "<i>is limited to performing a specific function</i>", aide: "Celui-ci en fait partie : c'est le « dédié à une tâche bien précise »." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Faire tourner n'importe quelle application, c'est un ordinateur généraliste.");
        j.expliquer("<p><i>An embedded system includes a microprocessor, involves the immediate control of hardware, is limited to performing a specific function.</i></p>");
        j.suite();
      } });
    } },
    { nom: "Controller ou computer", jouer: function (j, n) {
      n.mode = "deux"; n.montre = {}; n.dessin();
      j.fig.astuce("A : gère clavier, batterie et ventilateur. B : forme l'image dans un échographe.");
      j.titre("Place chaque terme sur sa figure.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:19px"><b>A</b><span class="trou" data-attendu="c"></span><b>B</b><span class="trou" data-attendu="s"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "<i>Embedded computer system</i>" }, { id: "c", html: "<i>Embedded controller</i>" }],
        aide: "A est un microprocesseur dédié, indépendant du processeur principal. B est un calculateur qui fait partie d'un système plus grand.",
        ok: function () {
          n.montre = { A: true, B: true }; n.dessin();
          j.bravo("A : <i>embedded controller</i>. B : <i>embedded computer system</i>.");
          j.expliquer("<p><b><i>Embedded controller</i></b> : <i>a programmable microprocessor that has a dedicated function to control specific components of the computer architecture independent of the main processor.</i></p><p><b><i>Embedded computer system</i></b> : <i>a computer system that is part of a larger system and performs some of the requirements of that system.</i></p>");
          j.suite();
        }
      });
    } }
  ]
});
