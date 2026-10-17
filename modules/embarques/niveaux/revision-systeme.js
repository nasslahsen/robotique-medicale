/* Révision du chapitre 1 : définition, conception, couches, schéma bloc, sur des appareils nouveaux (exemples ajoutés). */
NIVEAU({
  id: "revision-systeme",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "gluco", allume: {}, surTouche: null, chaine: false };
    var COUCHES = [["app", "Application Code"], ["drv", "Device Drivers (API)"], ["rtos", "RTOS / Embedded OS"], ["hal", "Hardware abstraction layer(s)"], ["boot", "Boot"], ["hw", "Hardware"]];
    n.COUCHES = COUCHES;
    n.zone = function (k) { return [150, 70 + k * 80, 380, 70]; };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "gluco") {
        // glucomètre connecté : boîtier, écran, bandelette, antenne
        EMB.el("rect", { x: 200, y: 110, width: 280, height: 400, rx: 50, fill: "#fff", stroke: C.encre, "stroke-width": 4 }, g);
        EMB.el("rect", { x: 235, y: 160, width: 210, height: 130, rx: 10, fill: "#eef3f7", stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.texte(g, "5,4", [320, 222], { taille: 54, mono: true, halo: false });
        EMB.texte(g, "mmol/L", [400, 260], { taille: 16, mono: true, halo: false, gras: false });
        EMB.el("rect", { x: 305, y: 510, width: 70, height: 70, fill: C.clair, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("circle", { cx: 340, cy: 556, r: 9, fill: C.ko }, g);
        [0, 1].forEach(function (k) { EMB.el("circle", { cx: 280 + k * 120, cy: 380, r: 30, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g); });
        [0, 1, 2].forEach(function (k) { EMB.el("path", { d: "M" + (520 + k * 16) + " " + (150 - k * 16) + " a" + (30 + k * 16) + " " + (30 + k * 16) + " 0 0 1 0 " + (60 + k * 32), fill: "none", stroke: C.acc, "stroke-width": 4 }, g); });
        EMB.texte(g, "Glucomètre connecté", [340, 70], { taille: 22 });
      } else if (n.mode === "pile") {
        COUCHES.forEach(function (c, k) {
          var r = n.zone(k), on = n.allume[c[0]];
          EMB.el("rect", { x: r[0], y: r[1], width: r[2], height: r[3], rx: c[0] === "hw" ? 4 : 0, fill: on ? C.clair : c[0] === "hw" ? "#4f7fc8" : "#eef6ea", stroke: on ? C.acc : C.encre, "stroke-width": on ? 3.5 : 2 }, g);
          EMB.texte(g, c[1], [r[0] + r[2] / 2, r[1] + r[3] / 2], { taille: 19, coul: c[0] === "hw" && !on ? "#fff" : C.encre, halo: false });
        });
      } else {
        // thermomètre auriculaire : schéma bloc à compléter
        var B = [[20, "Capteur\ninfrarouge"], [140, "?"], [260, "?"], [380, "MCU"], [500, "?"]];
        B.forEach(function (b, k) {
          var txt = b[1] === "?" && n.chaine ? ["", "AMP", "ADC", "", "LCD Driver"][k] : b[1];
          EMB.bloc(g, b[0] + 10, 250, 100, 90, txt, { taille: 17, actif: n.chaine && b[1] === "?", tirets: b[1] === "?" && !n.chaine ? "6 5" : null, coul: txt === "?" ? C.gris : C.encre });
          if (k < 4) EMB.fleche(g, [b[0] + 110, 295], [b[0] + 130, 295], { ep: 2.5 });
        });
        EMB.bloc(g, 540, 400, 100, 70, "Écran", { taille: 17, fill: "#d9dce3" });
        EMB.fleche(g, [560, 340], [580, 400], { ep: 2.5 });
        EMB.texte(g, "Thermomètre auriculaire", [340, 190], { taille: 20 });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (n.mode !== "pile" || !n.surTouche) return {};
      var z = {}; COUCHES.forEach(function (c, k) { z[c[0]] = n.zone(k); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Un appareil nouveau", jouer: function (j, n) {
      j.fig.astuce("Exemple ajouté.");
      j.titre("Un glucomètre connecté lit une bandelette, affiche la glycémie et l'envoie au téléphone. Pourquoi est-ce un système embarqué ?");
      j.choix([
        { html: "Parce qu'il est connecté au téléphone", aide: "Être connecté ne suffit pas, et un système embarqué peut ne pas l'être. Pense aux trois critères du cours." },
        { html: "Parce qu'il a un microprocesseur qui commande directement son matériel, pour une seule fonction", juste: true },
        { html: "Parce qu'il a un écran", aide: "La semelle n'a pas d'écran et c'est pourtant un système embarqué." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Microprocesseur, commande directe du matériel, fonction précise.");
        j.suite();
      } });
    } },
    { nom: "Le bug au démarrage", jouer: function (j, n) {
      n.mode = "pile"; n.allume = {}; n.dessin();
      j.fig.astuce("");
      j.titre("Un oxymètre se fige dès la mise sous tension : les horloges ne sont jamais configurées, rien d'autre ne démarre. Touche la couche à corriger.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "boot") { j.erreur(k === "hw" ? "Le matériel est peut-être sain : ce sont les routines qui le préparent qui ne finissent pas." : "Cette couche démarre après la configuration des horloges. Cherche ce qui s'exécute en tout premier."); return; }
        fini = true; n.surTouche = null; n.allume = { boot: true }; n.dessin();
        j.bravo("Les routines d'initialisation (Boot).", [340, 425]);
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("boot"); });
    } },
    { nom: "Quelle exigence ?", jouer: function (j, n) {
      j.titre("Le fabricant d'un défibrillateur doit montrer, par des essais documentés, que le choc part toujours quand il le faut. De quelle exigence s'agit-il ?");
      j.choix([
        { html: "<i>Cost</i>", aide: "Il ne s'agit pas d'argent." },
        { html: "<i>Verification</i>", juste: true },
        { html: "<i>Responsiveness (time)</i>", aide: "Il ne s'agit pas d'un délai, mais de prouver que le système fait ce qu'il doit." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Prouver que le système fait ce qu'il doit : la vérification.");
        j.suite();
      } });
    } },
    { nom: "Le schéma bloc", jouer: function (j, n) {
      n.mode = "chaine"; n.chaine = false; n.dessin();
      j.fig.astuce("Exemple ajouté.");
      j.titre("Complète le schéma bloc du thermomètre, comme pour le tensiomètre.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:17px">capteur → <span class="trou" data-attendu="amp"></span>→<span class="trou" data-attendu="adc"></span>→ MCU →<span class="trou" data-attendu="lcd"></span>→ écran</div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "dac", html: "DAC" }, { id: "lcd", html: "LCD Driver" }, { id: "adc", html: "ADC" }, { id: "amp", html: "AMP" }],
        aide: "Un signal de capteur est d'abord amplifié, puis converti en nombres. Pour l'écran, le MCU passe par un pilote. Le DAC sert à sortir une tension, pas ici.",
        ok: function () {
          n.chaine = true; n.dessin();
          j.bravo("Amplifier, convertir, calculer, afficher.");
          j.suite();
        }
      });
    } },
    { nom: "Controller ou computer", jouer: function (j, n) {
      n.mode = "gluco"; n.dessin();
      j.fig.astuce("");
      j.titre("Dans un ordinateur de bord d'ambulance, un petit microprocesseur programmable ne gère que le clavier et l'alimentation, sans passer par le processeur principal. C'est…");
      j.choix([
        { html: "un <i>embedded controller</i>", juste: true },
        { html: "un <i>embedded computer system</i>", aide: "Il commande des composants d'un ordinateur, indépendamment du processeur principal : relis la définition de l'<i>embedded controller</i>." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Un <i>embedded controller</i>.");
        j.suite();
      } });
    } }
  ]
});
