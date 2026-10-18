/* Révision du chapitre 5 : les périphériques de l'ESP32 dans un thermomètre connecté (situations nouvelles). */
NIVEAU({
  id: "revision-peripheriques",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var BLOCS = {
      bouton: [30, 110, 190, 70, "Bouton d'appel", 250, 260],
      sonde: [30, 250, 190, 70, "Thermistance", 250, 300],
      pad: [30, 400, 190, 70, "Bouton sur\nGPIO 34", 250, 340],
      buzzer: [460, 110, 190, 70, "Buzzer", 430, 260],
      wifi: [460, 250, 190, 70, "Wi-Fi vers\nle poste infirmier", 430, 300],
      ref: [460, 400, 190, 70, "Référence\nanalogique", 430, 340]
    };
    var n = { actif: null, notes: {} };
    n.dessin = function () {
      EMB.vider(g);
      EMB.bloc(g, 250, 210, 180, 180, "ESP32", { taille: 26, actif: true });
      EMB.texte(g, "Thermomètre connecté", [340, 540], { taille: 20, coul: C.doux });
      Object.keys(BLOCS).forEach(function (k) {
        var b = BLOCS[k], a = n.actif === k, gauche = b[0] < 250, bord = gauche ? [b[0] + b[2], b[1] + b[3] / 2] : [b[0], b[1] + b[3] / 2];
        EMB.el("line", { x1: bord[0], y1: bord[1], x2: b[5], y2: b[6], stroke: a ? C.acc : C.gris, "stroke-width": a ? 4 : 2 }, g);
        EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: 16, actif: a, op: n.actif && !a ? 0.45 : 1 });
        if (n.notes[k]) EMB.texte(g, n.notes[k], [b[0] + b[2] / 2, b[1] + b[3] + 18], { taille: 14, mono: true, coul: C.acc });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le bouton d'appel", jouer: function (j, n) {
      j.fig.astuce("");
      n.actif = "bouton"; n.dessin();
      j.titre("Le bouton d'appel tire la broche à 1 quand le patient appuie (pull-down au repos). Une seule interruption par appui : quelle valeur de GPIO_PINn_INT_TYPE ?");
      j.nombre({ avant: "\\text{INT\\_TYPE} =", cases: [{ attendu: 1, tol: 0 }], ligne: true,
        aide: function () { return "Au repos 0, appuyé 1 : le passage de 0 à 1 est un front… montant ou descendant ?"; },
        ok: function () { n.notes.bouton = "INT_TYPE = 1"; n.dessin(); j.bravo("1 : front montant."); j.suite(); } });
    } },
    { nom: "La thermistance", jouer: function (j, n) {
      n.actif = "sonde"; n.dessin();
      j.titre("La thermistance donne ADC_OUT = 1638 en 12 bits. Quelle tension mesure l'ADC ?");
      j.nombre({ avant: "ADC\\_IN =", apres: "\\text{V}", cases: [{ attendu: 1638 * 3.3 / 4095, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(ADC\\_IN = ADC\\_OUT \\times 3{,}3 / 4095\\)."; },
        ok: function () { n.notes.sonde = "1,32 V"; n.dessin(); j.bravo("\\(1638 \\times 3{,}3 / 4095 \\approx 1{,}32\\) V."); j.suite(); } });
    } },
    { nom: "Le Wi-Fi", jouer: function (j, n) {
      n.actif = "wifi"; n.dessin();
      j.titre("La thermistance est branchée sur GPIO 4. Dès que le Wi-Fi démarre, la mesure ne marche plus. Pourquoi, et que faire ?");
      j.choix([
        { html: "GPIO 4 est ADC2_CH0 : avec le Wi-Fi, il faut passer sur un canal de l'ADC1 (GPIO 32 à 39)", juste: true },
        { html: "Le Wi-Fi prend toute la tension : il faut une meilleure alimentation", aide: "C'est une règle du convertisseur, pas un problème d'alimentation. Regarde à quel ADC appartient GPIO 4." },
        { html: "GPIO 4 est une entrée seulement", aide: "Les entrées seulement sont 34, 35, 36 et 39. Et une entrée suffit pour mesurer." }
      ], { colonnes: 1, ok: function () { n.notes.sonde = "ADC1"; n.dessin(); j.bravo("ADC2 et Wi-Fi ne vont pas ensemble."); j.suite(); } });
    } },
    { nom: "Le buzzer", jouer: function (j, n) {
      n.actif = "buzzer"; n.dessin();
      j.titre("Un collègue a mis le buzzer, piloté en PWM, sur GPIO 36. Il reste muet. Quelle est l'erreur ?");
      j.choix([
        { html: "GPIO 36 est une entrée seulement : elle ne peut pas générer de PWM", juste: true },
        { html: "Le PWM n'a que 4 canaux, tous pris", aide: "Le contrôleur LED PWM a 16 canaux. Regarde plutôt la broche." },
        { html: "Le rapport cyclique doit être de 100 %", aide: "À 100 %, la broche resterait à 1 : pas de son. Le problème est la broche." }
      ], { colonnes: 1, ok: function () { n.notes.buzzer = "PWM, pas GPIO 34 à 39"; n.dessin(); j.bravo("Il faut une broche capable de sortie."); j.suite(); } });
    } },
    { nom: "Le tirage", jouer: function (j, n) {
      n.actif = "pad"; n.dessin();
      j.titre("Un second bouton est sur GPIO 34, vers la masse. Pour qu'il lise 1 au repos, que faut-il ?");
      j.choix([
        { html: "Une résistance de pull-up externe vers 3,3 V", juste: true },
        { html: "Activer WPU dans le pad", aide: "Les GPIO 34 à 39 n'ont pas de pull-up ni de pull-down internes." },
        { html: "Mettre OE à 1", aide: "OE ferait de la broche une sortie ; GPIO 34 ne peut pas l'être." }
      ], { colonnes: 1, ok: function () { n.notes.pad = "pull-up externe"; n.dessin(); j.bravo("Pas de tirage interne sur 34 à 39 : on le met dehors."); j.suite(); } });
    } },
    { nom: "La référence", jouer: function (j, n) {
      n.actif = "ref"; n.dessin();
      j.titre("Le capteur a besoin d'une tension de référence de 1,65 V, fournie par le DAC (VDD3P3_RTC = 3,3 V). Quelle valeur de PDACn_DAC, sans arrondir ?");
      j.nombre({ avant: "PDACn\\_DAC =", cases: [{ attendu: 1.65 * 255 / 3.3, tol: 0.01 }], ligne: true,
        aide: function () { return "Isole PDACn_DAC : \\(PDACn\\_DAC = 255 \\times DACn\\_OUT / VDD3P3\\_RTC\\)."; },
        ok: function () { n.notes.ref = "127 ou 128"; n.dessin(); j.bravo("127,5 : il faudra choisir 127 ou 128, à environ 6 mV près."); j.suite(); } });
    } }
  ]
});
