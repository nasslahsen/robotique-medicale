/* Niveau : les timers de l'ESP32 (Section III, diapositive 26). Prescaler 16 bits, compteur 64 bits, alarme, rechargement. */
NIVEAU({
  id: "timer",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { P: 80, A: 2000, recharge: false, descend: false, montre: false };
    n.dessin = function () {
      EMB.vider(g);
      // chaîne : horloge, prescaler, compteur, alarme
      EMB.bloc(g, 20, 80, 130, 70, "Horloge\n80 MHz", { taille: 16, fill: C.fond });
      EMB.bloc(g, 190, 80, 140, 70, "Prescaler\n÷ " + n.P, { taille: 16, actif: true });
      EMB.bloc(g, 370, 80, 140, 70, "Compteur\n64 bits", { taille: 16, actif: true });
      EMB.bloc(g, 550, 80, 110, 70, "Alarme\n= " + n.A, { taille: 16 });
      EMB.fleche(g, [150, 115], [190, 115], { ep: 2.5 }); EMB.fleche(g, [330, 115], [370, 115], { ep: 2.5 }); EMB.fleche(g, [510, 115], [550, 115], { ep: 2.5 });
      EMB.texte(g, n.descend ? "décompte" : "compte", [440, 172], { taille: 14, coul: C.doux, gras: false });
      if (n.montre) EMB.texte(g, "un tic = " + EMB.virgule(n.P / 80, 3).replace(/,?0+$/, "") + " µs", [260, 172], { taille: 14, coul: C.acc });
      // courbe du compteur dans le temps (8 ms)
      var x0 = 80, x1 = 640, yb = 520, yh = 250, T = 8000, tic = n.P / 80, max = Math.max(n.A * 1.6, 1);
      function X(t) { return x0 + t / T * (x1 - x0); }
      function Y(v) { return yb - Math.min(v, max) / max * (yb - yh); }
      EMB.el("line", { x1: x0, y1: yb, x2: x1, y2: yb, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: x0, y1: yb, x2: x0, y2: yh - 20, stroke: C.encre, "stroke-width": 2.5 }, g);
      for (var ms = 0; ms <= 8; ms += 2) EMB.texte(g, ms + " ms", [X(ms * 1000), yb + 20], { taille: 14, mono: true, gras: false });
      EMB.texte(g, "compteur", [x0 + 8, yh - 22], { taille: 15, coul: C.doux, ancre: "start" });
      EMB.el("line", { x1: x0, y1: Y(n.A), x2: x1, y2: Y(n.A), stroke: C.v, "stroke-width": 2.5, "stroke-dasharray": "8 6" }, g);
      EMB.texte(g, "alarme", [x1, Y(n.A) - 14], { taille: 14, coul: C.v, ancre: "end" });
      var sortie = null, d = "", alarmes = [], depart = n.descend ? n.A : 0, v = depart, t = 0, pas = 20;
      d = "M" + X(0) + " " + Y(v);
      for (t = pas; t <= T; t += pas) {
        v += (n.descend ? -1 : 1) * pas / tic;
        var atteint = n.descend ? v <= 0 : v >= n.A;
        if (atteint && (n.recharge || !alarmes.length)) {
          alarmes.push(t);
          if (n.recharge) { d += " L" + X(t) + " " + Y(n.descend ? 0 : n.A); v = depart; }
        }
        if (n.descend && v < 0) v = 0;
        if (v > max) { var tm = t - (v - max) * tic; d += " L" + X(tm) + " " + Y(max); sortie = [X(tm), Y(max)]; break; }
        d += " L" + X(t) + " " + Y(v);
      }
      EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 3.5, "stroke-linejoin": "round" }, g);
      if (sortie) { EMB.fleche(g, [sortie[0] - 8, sortie[1] + 14], [sortie[0] + 5, sortie[1] - 8], { coul: C.acc, ep: 3.5 }); EMB.texte(g, "continue", [sortie[0] + 14, sortie[1] + 4], { taille: 14, coul: C.acc, ancre: "start" }); }
      alarmes.forEach(function (ta) { EMB.el("circle", { cx: X(ta), cy: yb, r: 8, fill: C.v }, g); });
      EMB.texte(g, alarmes.length + " interruption" + (alarmes.length > 1 ? "s" : "") + " en 8 ms", [360, 570], { taille: 17, coul: C.v });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La fiche", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Complète la fiche des timers de l'ESP32.");
      var z = j.zone("", '<div style="font-size:17px;line-height:2.5">Quatre timers de <span class="trou" data-attendu="64"></span> bits, avec un prescaler de <span class="trou" data-attendu="16"></span> bits qui divise l\'horloge de 2 à <span class="trou" data-attendu="65536"></span>.</div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "16", html: "16" }, { id: "255", html: "255" }, { id: "65536", html: "65536" }, { id: "32", html: "32" }, { id: "64", html: "64" }],
        aide: "Compteur 64 bits, prescaler 16 bits ; 16 bits permettent \\(2^{16} = 65536\\) valeurs.",
        ok: function () {
          j.bravo("64 bits, prescaler 16 bits, de 2 à 65536.");
          j.expliquer("<p>Chaque timer est un compteur montant ou descendant de 64 bits, à rechargement automatique, précédé d'un <b>prescaler</b> : un diviseur de fréquence qui ralentit l'horloge avant le compteur.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Un tic", jouer: function (j, n) {
      j.titre("Exemple ajouté : l'horloge des timers vaut 80 MHz et le prescaler 80. Combien dure un tic du compteur, en microsecondes ?");
      j.nombre({ avant: "T_{tic} =", apres: "\\mu\\text{s}", cases: [{ attendu: 80 / 80, tol: 0.001 }], ligne: true,
        aide: function () { return "\\(T_{tic} = \\text{prescaler} / f\\). 80 MHz font 80 tics par microseconde avant division."; },
        ok: function () {
          n.montre = true; n.dessin();
          j.bravo("\\(80 / 80\\ \\text{MHz} = 1\\ \\mu\\text{s}\\).");
          j.expliquer("<p>Le cours ne donne pas l'horloge d'entrée : 80 MHz est l'horloge APB par défaut de l'ESP32. \\[ T_{tic} = \\frac{\\text{prescaler}}{f_{horloge}} \\]</p>");
          j.suite();
        } });
    } },
    { nom: "L'ECG", jouer: function (j, n) {
      j.titre("Tu veux lire un ECG à 500 Hz, donc une interruption toutes les 2 ms. Avec un tic de 1 µs, quelle valeur d'alarme ?");
      j.nombre({ avant: "\\text{alarme} =", cases: [{ attendu: 2000 / 1, tol: 0 }], ligne: true,
        aide: function () { return "2 ms = 2000 µs : combien de tics de 1 µs ?"; },
        ok: function () { n.A = 2000; n.dessin(); j.bravo("2000 tics de 1 µs = 2 ms."); j.suite(); } });
    } },
    { nom: "Recharger", jouer: function (j, n) {
      n.recharge = false; n.dessin();
      j.titre("Regarde la courbe : une seule interruption, puis le compteur continue. Quelle fonction du timer donne une interruption toutes les 2 ms ?");
      j.choix([
        { html: "Le rechargement automatique à l'alarme (auto-reload)", juste: true },
        { html: "L'arrêt du compteur (halt)", aide: "Arrêté, le compteur ne compte plus : plus aucune alarme." },
        { html: "Un prescaler plus grand", aide: "Le prescaler change la pente, pas le fait que le compteur reparte de zéro." }
      ], { colonnes: 1, ok: function () {
        n.recharge = true; n.dessin();
        j.bravo("Auto-reload : à chaque alarme, le compteur repart. Quatre interruptions en 8 ms.");
        j.expliquer("<p>Les timers ont aussi : arrêt et reprise du compteur, rechargement instantané commandé par le logiciel, génération d'interruptions sur niveau ou sur front.</p>");
        j.suite();
      } });
    } },
    { nom: "Le plus vite", jouer: function (j, n) {
      j.titre("Le prescaler le plus petit vaut 2. Avec l'horloge de 80 MHz, quelle est la fréquence de comptage la plus haute, en MHz ?");
      j.nombre({ avant: "f_{max} =", apres: "\\text{MHz}", cases: [{ attendu: 80 / 2, tol: 0 }], ligne: true,
        aide: function () { return "Le prescaler divise la fréquence : 80 / 2."; },
        ok: function () { n.P = 2; n.A = 80000; n.dessin(); j.bravo("40 MHz : un tic toutes les 25 ns."); j.suite(); } });
    } },
    { nom: "Compte à rebours", jouer: function (j, n) {
      n.P = 80; n.A = 2000; n.dessin();
      j.titre("Un pousse-seringue affiche le temps restant. Le timer peut-il compter à l'envers ?");
      j.choix([{ html: "Oui : le compteur se configure en incrémentation ou en décrémentation", juste: true }, { html: "Non : un timer ne fait que monter", aide: "Relis la fiche : « configurable up/down time-base counter »." }], { colonnes: 1, ok: function () {
        n.descend = true; n.dessin();
        j.bravo("Up ou down : il compte ou décompte.");
        j.suite();
      } });
    } }
  ]
});
