/* Niveau : plan de soins numérique et pancarte (feuille de surveillance) (S1S2, diapo 55). */
NIVEAU(SIS.rejouable({
  id: "plan-soins",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    // Pancarte d'exemple : température relevée toutes les 2 heures (exemple ajouté)
    n.H = [6, 8, 10, 12, 14, 16, 18, 20, 22];
    n.T = [36.9, 37.1, 37.4, 37.8, 38.3, 38.6, 38.1, 37.6, 37.2];
    n.px = function (h) { return 90 + (h - 6) * 34; };
    n.py = function (t) { return 470 - (t - 36.5) * 150; };
    n.pancarte = function (g2, etat) {
      A.texte(g2, "Pancarte de Mme Ouazzani : température (°C)", [340, 50], { taille: 17, gras: 700 });
      [36.5, 37, 37.5, 38, 38.5, 39].forEach(function (t) {
        A.s("line", { x1: 80, y1: n.py(t), x2: 650, y2: n.py(t), stroke: t === 38 ? C.ko : C.trait, "stroke-width": t === 38 ? 2.5 : 1.5, "stroke-dasharray": t === 38 ? "8 6" : null }, g2);
        A.texte(g2, String(t).replace(".", ","), [50, n.py(t)], { taille: 14, mono: true, coul: C.doux, halo: false });
      });
      n.H.forEach(function (h) { A.texte(g2, h + " h", [n.px(h), 500], { taille: 14, mono: true, coul: C.doux, halo: false }); });
      A.s("polyline", { points: n.H.map(function (h, i) { return n.px(h) + "," + n.py(n.T[i]); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 4, "stroke-linejoin": "round" }, g2);
      n.H.forEach(function (h, i) {
        var ok = etat && etat.trouve[i], f = etat && etat.faux === i;
        A.s("circle", { cx: n.px(h), cy: n.py(n.T[i]), r: ok ? 12 : 8, fill: ok ? C.ok : f ? C.ko : "#fff", stroke: ok ? "#fff" : C.acc, "stroke-width": 3 }, g2);
      });
      A.texte(g2, "Exemple ajouté", [340, 560], { taille: 14, coul: C.doux });
    };
    return n;
  },
  etapes: [
    { nom: "Quand la prescription change", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le plan de soins découle des prescriptions. Relie chaque événement sur la prescription à son effet sur le plan de soins.");
      var p = A.paires({
        g: n.g, gauche: ["Prescription créée", "Prescription modifiée", "Prescription interrompue", "Prescription annulée"],
        droite: ["Suspension", "Retrait du plan", "Ajout de tâches", "Mise à jour"],
        bon: [2, 3, 0, 1],
        xg: 30, wg: 260, xd: 390, wd: 260, y0: 60, h: 100, pas: 130, taille: 18, tailleD: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Une nouvelle prescription crée de nouvelles tâches.", "Les tâches existantes changent.", "On arrête pour un temps, sans effacer.", "La prescription n'existe plus : ses tâches non plus."][i]; },
        fin: function () { j.bravo("Créée : ajout. Modifiée : mise à jour. Interrompue : suspension. Annulée : retrait."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Plan de soins ou pancarte ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque élément : tâche du plan de soins, ou relevé de la pancarte ?");
      var cartes = [{ t: "Pansement à refaire à 10 h", bac: 0 }, { t: "Température 38,2 °C à 14 h", bac: 1 }, { t: "Injection d'héparine à 20 h", bac: 0 }, { t: "SpO2 96 %", bac: 1 }, { t: "Bilan sanguin à programmer demain", bac: 0 }, { t: "Fréquence cardiaque 92 /min", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Plan de soins", sous: "tâches planifiées" }, { t: "Pancarte", sous: "constantes relevées" }],
        pos: A.grille(6, 2, 20, 20, 640, 80, 14), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 220 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "C'est quelque chose à faire, prévu à l'avance." : "C'est une mesure relevée sur le patient : une constante."; },
        fin: function () {
          j.bravo("Tâches à faire : plan de soins. Constantes mesurées : pancarte.");
          j.expliquer("<p>Le <b>plan de soins</b> contient la liste ordonnée des tâches, des soins techniques (pansements, injections, perfusions), des examens à programmer et des surveillances. La <b>pancarte</b> (feuille de surveillance), entièrement numérisée dans le DPI, recueille et affiche les constantes : température, tension artérielle, fréquence cardiaque, saturation en oxygène.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Lire la pancarte", jouer: function (j, n) {
      j.titre("Sur la pancarte numérique, touche le premier relevé où la température dépasse 38 °C.");
      var r = SIS.reperer({ g: n.g, zones: n.H.map(function (h, i) { return { x: n.px(h) - 17, y: n.py(n.T[i]) - 30, w: 34, h: 60, bon: i === 4 }; }), dessiner: n.pancarte,
        erreur: j.erreur, aide: function (i) { return n.T[i] < 38 ? "Ce point est sous la ligne rouge des 38 °C." : "Ce point dépasse bien 38 °C, mais un autre l'a fait plus tôt."; },
        fin: function () {
          j.bravo("14 h : 38,3 °C.", [n.px(14), n.py(38.3)]);
          j.expliquer("<p>C'est l'intérêt de la pancarte numérisée : les constantes deviennent une courbe qu'on lit d'un coup d'œil, et qu'un seuil peut surveiller.</p>");
          j.suite();
        } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "La perfusion arrêtée", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["pompe", "horloge"], titre: "Perfusion interrompue", sous: "le temps d'un examen" });
      SIS.vider(n.g);
      j.titre("Le médecin interrompt la perfusion le temps d'un examen. Que devient la tâche correspondante dans le plan de soins ?");
      j.choix([{ html: "Elle est suspendue", juste: true }, { html: "Elle est retirée du plan", aide: "Retirer, c'est pour une prescription annulée. Ici, on reprendra." }, { html: "Rien ne change", aide: "Le plan de soins découle directement des prescriptions : il suit leurs changements." }], { colonnes: 3, ok: function () { j.bravo("Interrompue : suspension."); j.suite(); } });
    } }
  ]
}));
