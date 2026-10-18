/* Niveau : les chiens de garde de l'ESP32 (Section III, diapositive 27). MWDT, RWDT, récupération d'une faute imprévue. */
NIVEAU({
  id: "watchdog",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var BLOCS = [["lire le capteur", 100, 120], ["calculer le débit", 240, 250], ["commander la pompe", 100, 380], ["nourrir le chien", 240, 505]];
    var n = { etat: "normal", c: 0.25, courant: 3, anim: false };
    n.dessin = function () {
      EMB.vider(g);
      EMB.texte(g, "boucle du programme", [220, 72], { taille: 16, coul: C.doux, gras: false });
      BLOCS.forEach(function (b, i) {
        var actif = i === n.courant && n.etat !== "reset", bloque = n.etat === "bloque" && i === 1;
        EMB.bloc(g, b[1] - 50, b[2] - 30, 220, 60, b[0], { taille: 17, actif: actif && !bloque, stroke: bloque ? C.ko : null, fill: bloque ? "#fdecec" : null });
        var s = BLOCS[(i + 1) % 4];
        if (i < 3) EMB.fleche(g, [b[1] + 60, b[2] + 30], [s[1] + 60, s[2] - 30], { ep: 2.5, coul: n.etat === "bloque" ? C.gris : C.encre });
      });
      EMB.el("polyline", { points: "300,535 300,570 25,570 25,120 40,120", fill: "none", stroke: n.etat === "bloque" ? C.gris : C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [38, 120], [50, 120], { ep: 2.5, coul: n.etat === "bloque" ? C.gris : C.encre });
      if (n.etat === "bloque") {
        EMB.el("path", { d: "M410 235 C 460 210, 460 290, 410 265", fill: "none", stroke: C.ko, "stroke-width": 3 }, g);
        EMB.fleche(g, [420, 262], [410, 265], { coul: C.ko, ep: 3 });
        EMB.texte(g, "bloqué", [440, 205], { taille: 15, coul: C.ko });
      }
      // le chien de garde : un compteur qui monte et qu'on remet à zéro
      var x = 540, yb = 480, yh = 140, h = (yb - yh) * Math.min(1, n.c);
      EMB.texte(g, "chien de garde", [x + 50, 100], { taille: 17 });
      EMB.el("rect", { x: x, y: yh, width: 100, height: yb - yh, rx: 10, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("rect", { x: x + 4, y: yb - h, width: 92, height: Math.max(0, h - 4), rx: 7, fill: n.c >= 1 ? C.ko : C.acc }, g);
      EMB.el("line", { x1: x - 14, y1: yh, x2: x + 114, y2: yh, stroke: C.ko, "stroke-width": 3, "stroke-dasharray": "8 5" }, g);
      EMB.texte(g, "limite", [x + 50, yh - 16], { taille: 15, coul: C.ko });
      if (n.etat === "reset") {
        EMB.el("rect", { x: 430, y: 510, width: 240, height: 56, rx: 14, fill: C.ko }, g);
        EMB.texte(g, "Redémarrage de la puce", [550, 538], { taille: 17, coul: "#fff", halo: false });
      } else EMB.texte(g, n.etat === "bloque" ? "personne ne le nourrit" : "remis à zéro à chaque tour", [x + 40, 530], { taille: 15, coul: C.doux, gras: false, ancre: "middle" });
    };
    // animation courte, lancée par un geste, qui s'arrête seule
    n.bloquer = function (fin) {
      if (n.anim || n.etat !== "normal") return;
      n.anim = true; n.etat = "bloque"; n.courant = 1;
      E.anime(1800, function (u) { n.c = 0.25 + 0.75 * u; n.dessin(); }, function () {
        n.c = 1; n.etat = "reset"; n.dessin();
        setTimeout(function () { n.etat = "normal"; n.courant = 0; n.c = 0.05; n.anim = false; n.dessin(); if (fin) fin(); }, 900);
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le blocage", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le moniteur tourne normalement : à chaque tour, il nourrit le chien de garde. Simule une faute imprévue.");
      var b = E.h("button", "btn clair", "Bloquer le programme", j.el); b.type = "button";
      var lance = false;
      function go() {
        if (lance) return; lance = true; b.disabled = true;
        n.bloquer(function () {
          b.remove();
          j.texte("Que s'est-il passé ?");
          j.choix([
            { html: "Le compteur a atteint sa limite et le chien de garde a redémarré la puce", juste: true },
            { html: "Le chien de garde a corrigé le calcul bloqué", aide: "Il ne sait rien du calcul : il voit seulement qu'on ne le nourrit plus." },
            { html: "Rien : la pompe garde sa dernière commande", aide: "Regarde la fin de l'animation : le bandeau rouge." }
          ], { colonnes: 1, ok: function () {
            j.bravo("Plus nourri, le chien de garde arrive au bout et relance tout.");
            j.expliquer("<p>Un <b>chien de garde</b> (<i>watchdog timer</i>, WDT) est un compteur que le programme doit remettre à zéro régulièrement. S'il ne l'est plus, c'est que le programme a quitté sa séquence normale : le WDT déclenche alors une action de récupération, comme un redémarrage.</p>");
            j.suite();
          } });
        });
      }
      b.addEventListener("click", go);
      j.reponse(go);
    } },
    { nom: "Combien", jouer: function (j, n) {
      j.titre("Combien de chiens de garde l'ESP32 possède-t-il ?");
      j.nombre({ cases: [{ attendu: 2 + 1, tol: 0 }], ligne: true,
        aide: function () { return "Un dans chacun des deux modules timer, plus un dans le module RTC."; },
        ok: function () { j.bravo("Trois watchdog timers."); j.suite(); } });
    } },
    { nom: "Leurs noms", jouer: function (j, n) {
      j.titre("Place chaque chien de garde là où il se trouve.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px 12px;align-items:center;font-size:17px"><span>Un dans chacun des deux modules timer</span><span class="trou" data-attendu="m"></span><span>Un dans le module RTC</span><span class="trou" data-attendu="r"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "r", html: "RWDT" }, { id: "m", html: "MWDT" }],
        aide: "R comme RTC, M comme Main System.",
        ok: function () {
          j.bravo("MWDT : Main System Watchdog Timer. RWDT : RTC Watchdog Timer.");
          j.suite();
        }
      });
    } },
    { nom: "L'erreur", jouer: function (j, n) {
      j.titre("Une étudiante écrit : « Le watchdog empêche les bugs du programme. » Qu'est-ce qui ne va pas ?");
      j.choix([
        { html: "Il n'empêche rien : il sert à récupérer après une faute imprévue", juste: true },
        { html: "Rien, la phrase est juste", aide: "Le bug a déjà eu lieu quand le watchdog agit. Relis son rôle : récupérer." },
        { html: "Le watchdog ne sert qu'au Wi-Fi", aide: "Il surveille tout le programme, pas une fonction." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Il récupère d'une faute imprévue (<i>unforeseen fault</i>).");
        j.expliquer("<p>Le cours : ces watchdog timers servent à récupérer d'une faute imprévue qui fait abandonner au programme d'application sa séquence normale.</p>");
        j.suite();
      } });
    } },
    { nom: "Où nourrir", jouer: function (j, n) {
      j.titre("Où placer la remise à zéro du chien de garde pour qu'il détecte vraiment un blocage de la boucle principale ?");
      j.choix([
        { html: "Dans la boucle principale, une fois par tour", juste: true },
        { html: "Dans une interruption de timer qui arrive toutes les millisecondes", aide: "Si la boucle principale se bloque, l'interruption continue d'arriver et nourrit le chien : il ne verrait rien." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le chien doit dépendre du travail qu'il surveille.");
        j.suite();
      } });
    } }
  ]
});
