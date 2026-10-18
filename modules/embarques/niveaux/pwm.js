/* Niveau : PWM de l'ESP32 (Section III, diapositive 28). 16 canaux, fréquence, rapport cyclique, canal, GPIO. */
NIVEAU({
  id: "pwm",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { r: 50, moy: false, periode: null };
    n.dessin = function () {
      EMB.vider(g);
      var x0 = 90, L = 480, P = L / 3, yH = 200, yB = 400, r = n.r / 100;
      EMB.texte(g, "3,3 V", [x0 - 12, yH], { taille: 15, ancre: "end", mono: true, gras: false });
      EMB.texte(g, "0 V", [x0 - 12, yB], { taille: 15, ancre: "end", mono: true, gras: false });
      EMB.el("line", { x1: x0, y1: yB, x2: x0 + L, y2: yB, stroke: C.pale, "stroke-width": 2 }, g);
      var d = "M" + x0 + " " + yB;
      for (var k = 0; k < 3; k++) {
        var a = x0 + k * P, b = a + r * P;
        if (r > 0) d += " L" + a + " " + yH + " L" + b + " " + yH;
        d += " L" + b + " " + yB + " L" + (a + P) + " " + yB;
        if (r > 0 && r < 1) EMB.el("rect", { x: a, y: yH, width: r * P, height: yB - yH, fill: EMB.teinte(0.12) }, g);
      }
      EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 4, "stroke-linejoin": "round" }, g);
      // une période et la largeur d'impulsion
      EMB.fleche(g, [x0, 450], [x0 + P, 450], { double: true, ep: 2 });
      EMB.texte(g, n.periode ? "T = " + n.periode : "période T", [x0 + P / 2, 474], { taille: 15, coul: C.doux });
      if (r > 0.08) { EMB.fleche(g, [x0, 170], [x0 + r * P, 170], { double: true, ep: 2, coul: C.acc }); EMB.texte(g, "état haut", [x0 + r * P / 2, 150], { taille: 14, coul: C.acc }); }
      EMB.texte(g, "rapport cyclique = " + n.r + " %", [380, 110], { taille: 22 });
      if (n.moy) {
        var ym = yB - r * (yB - yH);
        EMB.el("line", { x1: x0, y1: ym, x2: x0 + L, y2: ym, stroke: C.v, "stroke-width": 3, "stroke-dasharray": "10 6" }, g);
        EMB.texte(g, "moyenne\n" + EMB.virgule(r * 3.3, 3) + " V", [x0 + L + 8, ym], { taille: 16, coul: C.v, ancre: "start" });
      }
      // la LED dont la luminosité suit la moyenne
      EMB.el("circle", { cx: 340, cy: 540, r: 30, fill: "rgba(255, 196, 0," + (0.1 + 0.9 * r).toFixed(2) + ")", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "LED", [395, 540], { taille: 15, ancre: "start", coul: C.doux });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Doser la lumière", jouer: function (j, n) {
      j.fig.astuce("");
      n.moy = true; n.dessin();
      j.titre("La LED d'un oxymètre doit recevoir en moyenne 0,99 V. Règle le rapport cyclique.");
      var fini = false;
      function tester(v) {
        if (fini) return;
        n.r = v; n.dessin();
        if (Math.abs(v / 100 * 3.3 - 0.99) < 0.001) {
          fini = true;
          j.bravo("30 % de 3,3 V = 0,99 V.");
          j.expliquer("<p>La broche ne sort que 0 ou 3,3 V. En la mettant à 1 pendant une fraction de chaque période, le <b>rapport cyclique</b>, on règle la valeur moyenne : \\[ V_{moy} = \\text{rapport cyclique} \\times 3{,}3\\ \\text{V} \\] C'est la modulation de largeur d'impulsion, <b>PWM</b> (<i>Pulse Width Modulation</i>).</p>");
          j.suite();
        }
      }
      var cur = j.curseur({ nom: "Rapport cyclique", min: 0, max: 100, pas: 5, val: 50, unite: " %", change: tester });
      j.reponse(function () { cur.regler(30); tester(30); });
    } },
    { nom: "La moyenne", jouer: function (j, n) {
      n.r = 75; n.moy = false; n.dessin();
      j.titre("Rapport cyclique de 75 %. Quelle tension moyenne reçoit la LED ?");
      j.nombre({ avant: "V_{moy} =", apres: "\\text{V}", cases: [{ attendu: 0.75 * 3.3, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(V_{moy} = 0{,}75 \\times 3{,}3\\) V."; },
        ok: function () { n.moy = true; n.dessin(); j.bravo("\\(0{,}75 \\times 3{,}3 = 2{,}475\\) V."); j.suite(); } });
    } },
    { nom: "La broche", jouer: function (j, n) {
      j.titre("Sur laquelle de ces broches est-il impossible de générer un PWM ?");
      j.choix([{ html: "GPIO 2", aide: "GPIO 2 peut être une sortie, donc faire du PWM." }, { html: "GPIO 35", juste: true }, { html: "GPIO 25", aide: "GPIO 25 peut être une sortie (c'est aussi DAC1)." }], { ok: function () {
        j.bravo("GPIO 35 est une entrée seulement.");
        j.expliquer("<p>Toutes les broches qui peuvent servir de sortie peuvent servir de broche PWM. Les GPIO 34 à 39, entrées seulement, ne peuvent pas générer de PWM.</p>");
        j.suite();
      } });
    } },
    { nom: "Les réglages", jouer: function (j, n) {
      j.titre("Pour régler un PWM dans le code, il faut quatre paramètres. Place chacun.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:center;font-size:16px">' +
        '<span>combien de périodes par seconde</span><span class="trou" data-attendu="f"></span>' +
        '<span>fraction de la période à l\'état haut</span><span class="trou" data-attendu="r"></span>' +
        '<span>lequel des 16 générateurs</span><span class="trou" data-attendu="c"></span>' +
        '<span>sur quelle broche sort le signal</span><span class="trou" data-attendu="g"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "canal" }, { id: "g", html: "GPIO" }, { id: "f", html: "fréquence" }, { id: "r", html: "rapport cyclique" }],
        aide: "Fréquence : par seconde. Rapport cyclique : la fraction. Canal : le générateur. GPIO : la broche.",
        ok: function () { j.bravo("Fréquence, rapport cyclique, canal, GPIO."); j.suite(); }
      });
    } },
    { nom: "Les canaux", jouer: function (j, n) {
      j.titre("Combien de canaux indépendants a le contrôleur LED PWM de l'ESP32 ?");
      j.nombre({ cases: [{ attendu: 16, tol: 0 }], ligne: true,
        aide: function () { return "Autant que de canaux LED PWM dans les spécifications : jusqu'à 16."; },
        ok: function () {
          j.bravo("16 canaux, chacun avec ses propres réglages.");
          j.expliquer("<p>Les 16 canaux du contrôleur <b>LED PWM</b> sont indépendants : chacun peut avoir sa fréquence et son rapport cyclique. L'ESP32 a aussi un PWM moteur (<i>Motor PWM</i>).</p>");
          j.suite();
        } });
    } },
    { nom: "La fréquence", jouer: function (j, n) {
      n.periode = "0,5 ms"; n.dessin();
      j.titre("La période du signal vaut 0,5 ms. Quelle fréquence faut-il écrire dans le code, en hertz ?");
      j.nombre({ avant: "f =", apres: "\\text{Hz}", cases: [{ attendu: 1 / 0.0005, tol: 0 }], ligne: true,
        aide: function () { return "\\(f = 1 / T\\), avec \\(T = 0{,}0005\\) s."; },
        ok: function () { j.bravo("\\(1 / 0{,}0005 = 2000\\) Hz."); j.suite(); } });
    } }
  ]
});
