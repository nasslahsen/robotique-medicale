/* Niveau : exemple 2, Blood Pressure Monitor (Section I, diapositive 25). Chaîne de mesure, commande de la pompe et de la valve, sortie son, interface, Programmable System on Chip. */
NIVEAU({
  id: "tensiometre",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { allume: {}, caches: {}, surTouche: null, air: 0 };
    var Z = EMB.bpm(null);
    var B = Z.B, EXT = Z.EXT;
    n.B = B; n.EXT = EXT;
    n.dessin = function () { EMB.vider(g); EMB.bpm(g, n); };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var z = {}; Object.keys(B).forEach(function (k) { z[k] = EMB.zoneMin(B[k].slice(0, 4), 44); }); Object.keys(EXT).forEach(function (k) { z[k] = EXT[k].slice(0, 4); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La chaîne de mesure", jouer: function (j, n) {
      n.caches = { amp: true, pga: true, adc: true, filtre: true }; n.dessin();
      j.fig.astuce("");
      j.titre("Le capteur de pression donne une tension très faible. Remets dans l'ordre les quatre blocs qui la mènent jusqu'au MCU.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:17px">capteur → <span class="trou" data-attendu="amp"></span>→<span class="trou" data-attendu="pga"></span>→<span class="trou" data-attendu="adc"></span>→<span class="trou" data-attendu="f"></span>→ MCU</div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "adc", html: "ADC" }, { id: "f", html: "Signal Filtering" }, { id: "amp", html: "AMP" }, { id: "pga", html: "PGA" }],
        aide: "On amplifie d'abord (deux amplificateurs), puis on convertit en nombres, puis on filtre les nombres avant de les donner au MCU.",
        ok: function () {
          n.caches = {}; n.allume = { amp: true, pga: true, adc: true, filtre: true }; n.dessin();
          j.bravo("AMP, PGA, ADC, puis filtrage numérique.");
          j.expliquer("<p>Le signal analogique est amplifié (<b>AMP</b>), puis ajusté par un amplificateur à gain programmable (<b>PGA</b>, <i>Programmable Gain Amplifier</i>), converti en nombres par l'<b>ADC</b>, filtré (<i>Signal Filtering</i>) et lu par le <b>MCU</b>.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi un PGA ?", jouer: function (j, n) {
      n.allume = { pga: true, adc: true }; n.dessin();
      j.titre("Pourquoi placer un amplificateur à gain programmable juste avant l'ADC ?");
      j.choix([
        { html: "Pour que le signal occupe bien toute la plage d'entrée de l'ADC, quel que soit le patient", juste: true },
        { html: "Pour convertir le signal en nombres", aide: "Convertir en nombres, c'est le rôle de l'ADC, juste après." },
        { html: "Pour alimenter le capteur", aide: "L'alimentation vient du bloc Power Management et de la batterie." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Un gain réglé par le programme adapte l'amplitude à l'ADC.");
        j.expliquer("<p>Un signal trop petit n'utilise que quelques niveaux de l'ADC : la mesure est grossière. Un signal trop grand sature. Le MCU règle le gain du PGA pour rester entre les deux.</p>");
        j.suite();
      } });
    } },
    { nom: "Gonfler le brassard", jouer: function (j, n) {
      n.allume = {}; n.air = 0; n.dessin();
      j.fig.astuce("");
      j.titre("Pour gonfler le brassard, le MCU doit faire tourner la pompe. Quel bloc de la puce commande-t-il ?");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "pwmM") { j.erreur(k === "pwmV" ? "Celui-ci commande la valve, qui laisse sortir l'air. Suis l'autre flèche vers la pompe." : k === "pompe" || k === "transistors" ? "Ce bloc est hors de la puce. Remonte les flèches jusqu'au bloc de la puce qui le commande." : "Suis la flèche qui arrive à la pompe (Rolling Pump) et remonte-la."); return; }
        fini = true; n.surTouche = null; n.allume = { pwmM: true, transistors: true, pompe: true };
        E.anime(1200, function (u) { n.air = u; n.dessin(); });
        j.bravo("PWM Motor Control, puis les transistors de puissance, puis la pompe.", [198, 362]);
        j.expliquer("<p>La puce ne fournit pas assez de courant pour un moteur : le bloc <b>PWM</b> envoie des impulsions aux <b>Motor Driving Transistors</b>, qui alimentent la pompe (<i>Rolling Pump</i>). Un second bloc PWM commande la valve (<i>Relay Valve</i>) qui dégonfle la chambre à air.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("pwmM"); });
    } },
    { nom: "Le bip", jouer: function (j, n) {
      n.allume = {}; n.dessin();
      j.fig.astuce("");
      j.titre("La mesure est finie : l'appareil émet un son. Touche le bloc qui transforme les nombres du MCU en tension pour le haut-parleur.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "dac") { j.erreur(k === "passe" ? "Ce filtre lisse un signal déjà analogique. Remonte d'un bloc vers le MCU." : k === "adc" ? "L'ADC fait l'inverse : de la tension vers les nombres." : "Pars du haut-parleur (Mono Speaker) et remonte les flèches."); return; }
        fini = true; n.surTouche = null; n.allume = { dac: true, passe: true, hp: true }; n.dessin();
        j.bravo("Le DAC, puis un filtre passe-bande, puis le haut-parleur.", [180, 198]);
        j.expliquer("<p>L'<b>ADC</b> va de l'analogique au numérique ; le <b>DAC</b> fait le chemin inverse. Le filtre passe-bande (<i>Band Pass Filter</i>) ne garde que les fréquences audibles utiles.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("dac"); });
    } },
    { nom: "La légende", jouer: function (j, n) {
      n.allume = {}; n.dessin();
      j.fig.astuce("");
      j.titre("Les couleurs du schéma suivent sa légende. Range chaque bloc dans sa famille.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><b>CapSense</b><span class="trou" data-attendu="ui"></span><b>USB</b><span class="trou" data-attendu="com"></span><b>PWM</b><span class="trou" data-attendu="num"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "num", html: "<i>Digital Functions</i>" }, { id: "ui", html: "<i>User Interface</i>" }, { id: "com", html: "<i>Communication</i>" }],
        aide: "CapSense lit le doigt de l'utilisateur. USB échange des données avec un autre appareil. PWM est une fonction numérique.",
        ok: function () {
          j.bravo("Interface utilisateur, communication, fonctions numériques.");
          j.expliquer("<p>La légende du cours classe les blocs : <i>CPU, ADC/DAC, Amplifier/Comparator, Filters, User Interface, Communication, Digital Functions, Memory, System</i>.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Dans la puce ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Tout ce qui est dans le grand cadre est intégré dans un seul circuit, le <i>Programmable System on Chip</i>. Lequel de ces éléments n'y est pas ?");
      j.choix([
        { html: "L'ADC", aide: "L'ADC est dans le cadre, entre le PGA et le filtrage." },
        { html: "La pompe (<i>Rolling Pump</i>)", juste: true },
        { html: "Le pilote de l'écran (<i>LCD Driver</i>)", aide: "Le pilote est dans la puce ; c'est l'écran lui-même qui est dehors." }
      ], { colonnes: 1, ok: function () {
        n.allume = { pompe: true }; n.dessin();
        j.bravo("La pompe est un organe de puissance, hors de la puce.");
        j.expliquer("<p>Un <b>système sur puce</b> regroupe le processeur et ses périphériques (amplificateurs, convertisseurs, filtres, PWM, interfaces) dans un seul circuit. Restent dehors : le capteur, les actionneurs (pompe, valve), l'écran, le haut-parleur et la batterie.</p>");
        j.suite();
      } });
    } }
  ]
});
