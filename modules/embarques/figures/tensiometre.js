(function () {
  "use strict";
  var R = RM;

  // Le schéma du tensiomètre (EMB.bpm) est dessiné dans un repère 680 × 600 : on le place dans un groupe.
  function schema(svg) { return EMB.el("g", { transform: "translate(140, 0)" }, svg); }

  /* ---------- Figure 1 : les chemins du schéma ---------- */
  (function () {
    var f = R.figure("fig-bpm", {
      largeur: 960, hauteur: 600,
      titre: "Blood Pressure Monitor sur Programmable System on Chip",
      essai: "<strong>Essaie</strong> : touche un chemin. <strong>Observe</strong> : la mesure entre par la gauche et monte vers le MCU ; les commandes partent du MCU vers les actionneurs, en passant par un bloc de la puce (PWM, DAC, pilote) avant de sortir."
    });
    var g = schema(f.svg);
    var CH = {
      mesure: { nom: "Mesure", b: ["capteur", "amp", "pga", "adc", "filtre", "mcu"], t: "Pressure Sensor, AMP, PGA, ADC, Signal Filtering, MCU : la pression devient un nombre." },
      gonfle: { nom: "Gonflage", b: ["mcu", "pwmM", "transistors", "pompe", "chambre"], t: "Le MCU commande la pompe par un PWM et des transistors de puissance : la chambre à air se remplit." },
      degonfle: { nom: "Dégonflage", b: ["mcu", "pwmV", "valve", "chambre"], t: "Un second PWM commande la valve, qui laisse sortir l'air de la chambre." },
      son: { nom: "Son", b: ["mcu", "dac", "passe", "hp"], t: "Le DAC transforme des nombres en tension ; le filtre passe-bande la met en forme pour le haut-parleur." },
      ihm: { nom: "Interface", b: ["toucher", "capsense", "mcu", "lcd", "ecran"], t: "CapSense lit le doigt ou la touche ; le LCD Driver commande l'écran." },
      com: { nom: "Communication", b: ["mcu", "ipod", "usb", "cable1", "cable2"], t: "La mesure peut sortir vers un autre appareil : Made For iPod, USB." },
      energie: { nom: "Énergie", b: ["batterie", "power"], t: "La batterie alimente la puce à travers le bloc Power Management." }
    };
    var etat = { allume: {}, air: 0.4 }, b = R.boutons(f.reglages), btn = {}, zone = R.h("p", null, "Touche un chemin.", f.direct);
    Object.keys(CH).forEach(function (k) {
      btn[k] = R.bouton(b, CH[k].nom, function () {
        etat.allume = {}; CH[k].b.forEach(function (x) { etat.allume[x] = true; });
        Object.keys(btn).forEach(function (x) { btn[x].classList.toggle("actif", x === k); });
        zone.textContent = CH[k].t; dessiner();
      });
    });
    function dessiner() { EMB.vider(g); EMB.bpm(g, etat); }
    dessiner();
  })();

  /* ---------- Figure 2 : un cycle de mesure ---------- */
  (function () {
    var f = R.figure("fig-cycle", {
      largeur: 960, hauteur: 600,
      titre: "Un cycle de mesure (exemple ajouté)",
      essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : la chambre à air se remplit au gonflage puis se vide lentement pendant la mesure ; à chaque étape, ce sont d'autres blocs de la même puce qui travaillent."
    });
    var g = schema(f.svg);
    var ET = [
      { b: [], air: 0, t: "Repos : la chambre à air est vide." },
      { b: ["toucher", "capsense", "mcu"], air: 0, t: "Appui sur la touche : CapSense prévient le MCU." },
      { b: ["mcu", "pwmM", "transistors", "pompe", "chambre"], air: 1, t: "Gonflage : le PWM du moteur fait tourner la pompe." },
      { b: ["mcu", "pwmV", "valve", "chambre", "capteur", "amp", "pga", "adc", "filtre"], air: 0.35, t: "Dégonflage et mesure : la valve laisse sortir l'air pendant que la chaîne de mesure suit la pression." },
      { b: ["mcu", "lcd", "ecran"], air: 0, t: "Affichage : le résultat part vers l'écran par le LCD Driver." },
      { b: ["mcu", "dac", "passe", "hp"], air: 0, t: "Bip : le DAC et le filtre passe-bande pilotent le haut-parleur." }
    ];
    var etat = { allume: {}, air: 0 }, zone = R.h("p", null, "", f.direct), avant = 0;
    var et = R.etapes(f.reglages, 5, ["repos", "appui", "gonflage", "dégonflage et mesure", "affichage", "bip"], function (k) {
      var e = ET[k], a0 = etat.air;
      etat.allume = {}; e.b.forEach(function (x) { etat.allume[x] = true; });
      zone.textContent = e.t;
      R.animer(500, function (u) { etat.air = a0 + (e.air - a0) * u; EMB.vider(g); EMB.bpm(g, etat); });
      avant = k;
    });
    et.aller(0);
  })();
})();
