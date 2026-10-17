/* Niveau : Von Neumann, Harvard, Super Harvard (Section I, diapositives 8 et 9). Un bus ou deux, cycles comptés, I/O Controller. */
NIVEAU({
  id: "von-neumann-harvard",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "vn", N: 4, t: 0, actif: null, etiq: false, surTouche: null, io: false };
    // déroulé, cycle par cycle (modèle simple, exemple ajouté) : chaque instruction est lue, puis lit une donnée
    n.vnCycles = function (N) { var l = []; for (var i = 1; i <= N; i++) l.push(["I" + i, null], ["D" + i, null]); return l.map(function (c) { return { a: c[0] }; }); };
    n.hCycles = function (N) { var l = []; for (var c = 0; c <= N; c++) l.push({ pm: c < N ? "I" + (c + 1) : null, dm: c > 0 ? "D" + c : null }); return l; };
    function fl(a, b, o) { return EMB.fleche(g, a, b, o); }
    function busCoul(on) { return on ? C.acc : C.encre; }
    function cellule(x, y, w, h, t, coul) {
      EMB.el("rect", { x: x, y: y, width: w, height: h, rx: 6, fill: t ? coul : "#fff", stroke: C.pale, "stroke-width": 1.5 }, g);
      if (t) EMB.texte(g, t, [x + w / 2, y + h / 2], { taille: 15, coul: "#fff", halo: false, mono: true });
    }
    n.dessin = function () {
      EMB.vider(g);
      var cyc = n.mode === "vn" ? n.vnCycles(n.N) : n.hCycles(n.N), cur = n.t > 0 ? cyc[n.t - 1] : null;
      if (n.mode === "vn") {
        EMB.texte(g, "Von Neumann", [340, 82], { taille: 22 });
        EMB.bloc(g, 60, 110, 170, 120, "CPU", { taille: 26, coul: C.ko });
        EMB.bloc(g, 450, 110, 170, 120, "Memory\nData and\ninstructions", { taille: 17 });
        var onA = !!cur, lab = cur ? cur.a : null;
        fl([230, 145], [450, 145], { ep: onA ? 5 : 3, coul: busCoul(onA) });
        fl([230, 200], [450, 200], { ep: onA ? 5 : 3, coul: busCoul(onA), double: true });
        EMB.texte(g, "Address bus", [340, 124], { taille: 15, gras: false });
        EMB.texte(g, "Data bus", [340, 224], { taille: 15, gras: false });
        if (lab) EMB.texte(g, lab, [340, 172], { taille: 18, coul: C.acc, mono: true });
      } else {
        var sh = n.mode === "sh";
        EMB.texte(g, sh ? "Super Harvard" : "Harvard", [340, 82], { taille: 22 });
        EMB.bloc(g, 20, 110, 160, 120, "Program\nMemory\ninstructions", { taille: 16 });
        EMB.bloc(g, 260, 110, 160, 120, sh ? "" : "CPU", { taille: 26, coul: C.ko });
        if (sh) { EMB.texte(g, "CPU", [340, 140], { taille: 24, coul: C.ko, halo: false }); EMB.bloc(g, 280, 168, 120, 46, "Instruction\ncache", { taille: 14, fill: C.clair }); }
        EMB.bloc(g, 500, 110, 160, 120, "Data Memory\nData only", { taille: 16 });
        var onP = cur && cur.pm, onD = cur && cur.dm;
        fl([260, 145], [180, 145], { ep: onP ? 5 : 3, coul: busCoul(onP) });
        fl([260, 200], [180, 200], { ep: onP ? 5 : 3, coul: busCoul(onP), double: true });
        fl([420, 145], [500, 145], { ep: onD ? 5 : 3, coul: busCoul(onD) });
        fl([420, 200], [500, 200], { ep: onD ? 5 : 3, coul: busCoul(onD), double: true });
        if (n.etiq) {
          EMB.texte(g, "PM Address bus", [220, 256], { taille: 13, gras: false });
          EMB.texte(g, "PM Data bus", [220, 276], { taille: 13, gras: false });
          EMB.texte(g, "DM Address bus", [460, 254], { taille: 13, gras: false });
          EMB.texte(g, "DM Data bus", [460, 274], { taille: 13, gras: false });
        }
        [[220, 125, "1"], [220, 220, "2"], [460, 125, "3"], [460, 220, "4"]].forEach(function (p) {
          EMB.el("circle", { cx: p[0], cy: p[1], r: 13, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
          EMB.texte(g, p[2], [p[0], p[1] + 1], { taille: 14, halo: false });
        });
        if (onP) EMB.texte(g, cur.pm, [220, 172], { taille: 17, coul: C.acc, mono: true });
        if (onD) EMB.texte(g, cur.dm, [460, 172], { taille: 17, coul: C.acc, mono: true });
        if (sh) {
          EMB.bloc(g, 500, 300, 160, 70, "I/O\nController", { taille: 17, actif: n.io });
          fl([580, 230], [580, 300], { ep: 3, double: true });
          fl([580, 370], [580, 420], { ep: 3, double: true });
          EMB.texte(g, "Data", [620, 400], { taille: 16, coul: C.ko });
        }
      }
      if (n.mode === "sh") return;
      // chronologie des bus
      var x0 = 120, y0 = 330, w = Math.min(60, 540 / Math.max(cyc.length, 1)), h = 40;
      EMB.texte(g, "cycles de bus", [x0, 304], { taille: 15, coul: C.doux, gras: false, ancre: "start" });
      if (n.mode === "vn") {
        EMB.texte(g, "bus", [x0 - 12, y0 + h / 2], { taille: 15, ancre: "end", gras: false });
        cyc.forEach(function (c, i) { cellule(x0 + i * w, y0, w - 4, h, i < n.t ? c.a : null, c.a.charAt(0) === "I" ? C.bleu : C.acc); });
      } else {
        EMB.texte(g, "PM", [x0 - 12, y0 + h / 2], { taille: 15, ancre: "end", gras: false });
        EMB.texte(g, "DM", [x0 - 12, y0 + h + 8 + h / 2], { taille: 15, ancre: "end", gras: false });
        cyc.forEach(function (c, i) {
          cellule(x0 + i * w, y0, w - 4, h, i < n.t ? c.pm : null, C.bleu);
          cellule(x0 + i * w, y0 + h + 8, w - 4, h, i < n.t ? c.dm : null, C.acc);
        });
      }
      if (n.t > 0) EMB.texte(g, n.t + " cycle" + (n.t > 1 ? "s" : ""), [340, 480], { taille: 26, coul: C.acc });
      EMB.texte(g, "I : lire une instruction    D : lire ou écrire une donnée", [340, 540], { taille: 15, coul: C.doux, gras: false });
    };
    n.jouer = function (fin) {
      var tot = (n.mode === "vn" ? n.vnCycles(n.N) : n.hCycles(n.N)).length;
      n.t = 0; n.dessin();
      var id = setInterval(function () { n.t++; n.dessin(); if (n.t >= tot) { clearInterval(id); if (fin) fin(); } }, 260);
      return id;
    };
    EMB.toucher(fig.svg, function () { return n.surTouche ? { io: [500, 300, 160, 70], dm: [500, 110, 160, 120], pm: [20, 110, 160, 120], cpu: [260, 110, 160, 120] } : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Un seul chemin", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Von Neumann : une seule mémoire pour les données et les instructions. Le CPU peut-il lire une instruction et une donnée en même temps ?");
      j.choix([
        { html: "Oui : il y a deux bus", aide: "Regarde ce que porte chaque bus : l'un l'adresse, l'autre la valeur. Instruction et donnée passent par le même Data bus." },
        { html: "Non : une seule mémoire, un seul Data bus", juste: true }
      ], { colonnes: 1, ok: function () {
        j.bravo("Instruction et donnée font la queue sur le même bus.");
        j.expliquer("<p><b>Architecture Von Neumann</b> : <i>Single Memory for both Data and Instructions</i>. Le CPU envoie une adresse sur l'<i>Address bus</i> et échange la valeur sur le <i>Data bus</i>. C'est simple, mais une seule chose passe à la fois.</p>");
        j.suite();
      } });
    } },
    { nom: "Compter en Von Neumann", jouer: function (j, n) {
      n.N = 4; n.t = 0; n.dessin();
      j.titre("Prédis : combien de cycles de bus en Von Neumann ?");
      j.consigne("Exemple ajouté : un programme de 4 instructions ; chacune est lue en mémoire, puis lit une donnée. Une lecture occupe le bus un cycle.");
      j.nombre({ avant: "\\text{cycles} =", cases: [{ attendu: 8, tol: 0 }], ligne: true,
        aide: function () { return "Chaque instruction demande deux passages sur l'unique bus : un pour l'instruction, un pour la donnée."; },
        ok: function () {
          var id = n.jouer(); j.nettoyer(function () { clearInterval(id); n.t = 8; });
          j.bravo("8 cycles : I1, D1, I2, D2… l'un après l'autre.");
          j.expliquer("\\[ \\text{Von Neumann : } 2N \\text{ cycles pour } N \\text{ instructions} \\]");
          j.suite();
        } });
    } },
    { nom: "Les quatre bus", jouer: function (j, n) {
      n.mode = "h"; n.t = 0; n.dessin();
      j.consigne("");
      j.titre("Harvard : deux mémoires. Nomme les quatre bus numérotés sur la figure.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 14px;align-items:center;font-size:18px"><b>1</b><span class="trou" data-attendu="pa"></span><b>2</b><span class="trou" data-attendu="pd"></span><b>3</b><span class="trou" data-attendu="da"></span><b>4</b><span class="trou" data-attendu="dd"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "dd", html: "DM Data bus" }, { id: "pa", html: "PM Address bus" }, { id: "da", html: "DM Address bus" }, { id: "pd", html: "PM Data bus" }],
        aide: "PM, c'est la Program Memory (à gauche), DM la Data Memory (à droite). La flèche simple porte l'adresse, la double flèche la donnée.",
        ok: function () {
          n.etiq = true; n.dessin();
          j.bravo("Un couple adresse et données pour chaque mémoire.");
          j.expliquer("<p><b>Architecture Harvard</b> : <i>Dual Memory, one for Data and an other for Instructions</i>. La Program Memory a son PM Address bus et son PM Data bus, la Data Memory son DM Address bus et son DM Data bus.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Compter en Harvard", jouer: function (j, n) {
      n.t = 0; n.dessin();
      j.titre("Même programme de 4 instructions, en Harvard. Pendant que la donnée de l'instruction 1 passe sur le DM Data bus, l'instruction 2 peut arriver sur le PM Data bus. Combien de cycles ?");
      j.nombre({ avant: "\\text{cycles} =", cases: [{ attendu: 5, tol: 0 }], ligne: true,
        aide: function () { return "Le premier cycle ne lit que I1. Ensuite, à chaque cycle, une instruction et une donnée passent ensemble. Le dernier cycle ne lit que D4."; },
        ok: function () {
          var id = n.jouer(); j.nettoyer(function () { clearInterval(id); n.t = 5; });
          j.bravo("5 cycles au lieu de 8.");
          j.expliquer("\\[ \\text{Harvard : } N + 1 \\text{ cycles} \\qquad \\text{Von Neumann : } 2N \\]<p>Les deux mémoires travaillent en même temps : c'est le « <i>High Speed</i> » du cours.</p>");
          j.suite();
        } });
    } },
    { nom: "Super Harvard", jouer: function (j, n) {
      n.mode = "sh"; n.t = 0; n.dessin();
      j.titre("Un holter doit faire entrer les échantillons ECG en mémoire pendant que le CPU calcule. Touche le bloc de la Super Harvard qui s'en charge.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "io") { j.erreur(k === "dm" ? "La Data Memory reçoit les échantillons, mais qui les fait entrer depuis l'extérieur ? Regarde sous elle." : "Cherche le bloc nouveau par rapport à la Harvard, celui qui échange des Data avec l'extérieur."); return; }
        fini = true; n.surTouche = null; n.io = true; n.dessin();
        j.bravo("L'I/O Controller remplit la Data Memory sans occuper le CPU.", [580, 335]);
        j.expliquer("<p><b>Super Harvard</b> : elle améliore la Harvard en ajoutant un <b>cache d'instructions</b> (<i>an Instruction cache</i>) et un <b>contrôleur d'entrées/sorties dédié</b> (<i>a Dedicated I/O Controller</i>), relié à la Data Memory.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("io"); });
    } },
    { nom: "Dix instructions", jouer: function (j, n) {
      n.mode = "h"; n.N = 10; n.t = 0; n.dessin();
      j.titre("Une boucle de filtrage fait 10 instructions, chacune avec une donnée. Combien de cycles en Von Neumann, puis en Harvard ?");
      j.nombre({ avant: "\\text{VN},\\ \\text{Harvard} :", cases: [{ attendu: 20, tol: 0 }, { attendu: 11, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Von Neumann : deux passages par instruction, \\(2N\\)." : "Harvard : \\(N + 1\\)."; },
        ok: function () {
          var id = n.jouer(); j.nettoyer(function () { clearInterval(id); });
          j.bravo("20 contre 11 : presque deux fois plus rapide.");
          j.suite();
        } });
    } }
  ]
});
