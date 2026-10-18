/* Boss du chapitre 5 : le moniteur de perfusion. Tous les périphériques dans un même appareil, sans aide avant le premier essai. */
NIVEAU({
  id: "boss-peripheriques",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var BLOCS = {
      gouttes: [30, 100, 190, 70, "Capteur\nde gouttes", 250, 250],
      timer: [30, 245, 190, 70, "Timer\n(tic de 1 µs)", 250, 300],
      pression: [30, 390, 190, 70, "Capteur de\npression", 250, 350],
      buzzer: [460, 100, 190, 70, "Buzzer\nd'alarme", 430, 250],
      wifi: [460, 245, 190, 70, "Wi-Fi vers\nla centrale", 430, 300],
      wdt: [460, 390, 190, 70, "Chien de garde", 430, 350]
    };
    var n = { actif: null, notes: {} };
    n.dessin = function () {
      EMB.vider(g);
      EMB.bloc(g, 250, 200, 180, 200, "ESP32", { taille: 26, actif: true });
      // poche et tubulure, en bas
      EMB.el("rect", { x: 300, y: 470, width: 80, height: 60, rx: 14, fill: C.clair, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "poche", [340, 500], { taille: 14, halo: false });
      EMB.el("line", { x1: 340, y1: 530, x2: 340, y2: 580, stroke: C.encre, "stroke-width": 3 }, g);
      EMB.texte(g, "Moniteur de perfusion", [340, 445], { taille: 18, coul: C.doux });
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
    { nom: "Compter les gouttes", jouer: function (j, n) {
      j.fig.astuce("");
      n.actif = "gouttes"; n.dessin();
      j.titre("Chaque goutte coupe un faisceau : la sortie du capteur passe de 0 à 1 puis revient à 0. Il faut une interruption par goutte, ni plus ni moins. Quel type ?");
      j.choix([
        { html: "3 : tout front", aide: "Chaque goutte fait deux fronts, montant puis descendant : tu compterais chaque goutte deux fois." },
        { html: "1 : front montant", juste: true },
        { html: "5 : niveau haut", aide: "Un niveau redemande l'interruption tant que la sortie reste à 1 : plusieurs demandes pour une seule goutte." }
      ], { colonnes: 1, ok: function () { n.notes.gouttes = "INT_TYPE = 1"; n.dessin(); j.bravo("Un front montant par goutte (le front descendant marcherait aussi)."); j.suite(); } });
    } },
    { nom: "Le débit", jouer: function (j, n) {
      n.actif = "timer"; n.dessin();
      j.titre("Le timer, à 1 µs par tic, compte 2 000 000 tics entre deux gouttes. Combien de gouttes par minute ?");
      j.nombre({ avant: "\\text{gouttes/min} =", cases: [{ attendu: 60 / (2000000 * 1e-6), tol: 0 }], ligne: true,
        aide: function () { return "2 000 000 tics de 1 µs font 2 s entre deux gouttes. Combien de fois 2 s dans 60 s ?"; },
        ok: function () { n.notes.timer = "2 s, 30 gouttes/min"; n.dessin(); j.bravo("Une goutte toutes les 2 s : 30 gouttes/min."); j.suite(); } });
    } },
    { nom: "La broche de pression", jouer: function (j, n) {
      n.actif = "pression"; n.dessin();
      j.titre("Le capteur de pression (analogique) détecte une occlusion. L'appareil envoie ses données en Wi-Fi. Sur quelle broche le brancher ?");
      j.choix([
        { html: "GPIO 27", aide: "GPIO 27 est ADC2_CH7 : inutilisable avec le Wi-Fi." },
        { html: "GPIO 33", juste: true },
        { html: "GPIO 13", aide: "GPIO 13 est ADC2_CH4 : inutilisable avec le Wi-Fi." }
      ], { ok: function () { n.notes.pression = "GPIO 33 = ADC1_CH5"; n.dessin(); j.bravo("GPIO 33 est ADC1_CH5."); j.suite(); } });
    } },
    { nom: "Le seuil", jouer: function (j, n) {
      j.titre("L'occlusion est déclarée au-dessus de 2,64 V. Quel seuil ADC_OUT le programme doit-il comparer (12 bits) ?");
      j.nombre({ avant: "ADC\\_OUT_{seuil} =", cases: [{ attendu: 4095 * 2.64 / 3.3, tol: 1 }], ligne: true,
        aide: function () { return "\\(4095 \\times 2{,}64 / 3{,}3\\)."; },
        ok: function () { n.notes.pression = "seuil 3276"; n.dessin(); j.bravo("\\(4095 \\times 2{,}64 / 3{,}3 = 3276\\)."); j.suite(); } });
    } },
    { nom: "L'alarme", jouer: function (j, n) {
      n.actif = "buzzer"; n.dessin();
      j.titre("Le buzzer sonne à 2 kHz, rapport cyclique 50 %. Combien de microsecondes la broche reste-t-elle à 1 à chaque période ?");
      j.nombre({ avant: "t_{haut} =", apres: "\\mu\\text{s}", cases: [{ attendu: 0.5 * 1e6 / 2000, tol: 0 }], ligne: true,
        aide: function () { return "La période vaut \\(1 / 2000\\) s = 500 µs ; la moitié reste à 1."; },
        ok: function () { n.notes.buzzer = "T = 500 µs, haut 250 µs"; n.dessin(); j.bravo("Période 500 µs, état haut 250 µs."); j.suite(); } });
    } },
    { nom: "Le blocage", jouer: function (j, n) {
      n.actif = "wdt"; n.dessin();
      j.titre("Un soir, le calcul du débit se bloque et l'alarme ne se déclenche plus. Quelle protection aurait remis l'appareil en route ?");
      j.choix([
        { html: "Un watchdog (MWDT) remis à zéro dans la boucle principale, qui redémarre la puce s'il n'est plus nourri", juste: true },
        { html: "Un watchdog remis à zéro dans l'interruption du capteur de gouttes", aide: "Les gouttes continuent de tomber : l'interruption nourrirait le chien alors que le calcul est bloqué." },
        { html: "Passer l'ADC en 9 bits pour aller plus vite", aide: "La vitesse de conversion ne débloque pas un programme arrêté." }
      ], { colonnes: 1, ok: function () {
        n.notes.wdt = "MWDT dans la boucle"; n.dessin();
        j.bravo("Le chien de garde récupère la faute imprévue.");
        j.expliquer("<p>Un seul appareil a mobilisé tout le chapitre : une interruption sur front, un timer, l'ADC1 à cause du Wi-Fi, un seuil calculé avec ADC_OUT, un PWM et un chien de garde.</p>");
        j.suite();
      } });
    } }
  ]
});
