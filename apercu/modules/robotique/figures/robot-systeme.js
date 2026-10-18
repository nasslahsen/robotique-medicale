(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  /* ---------- Figure 1 : une cellule robotisée, étape par étape ---------- */
  (function () {
    var f = R.figure("fig-cellule", {
      hauteur: 470,
      titre: "Cellule robotisée de pick and place",
      essai: "<strong>Essaie</strong> : clique sur « Étape suivante » pour dérouler un cycle complet, puis coche « Intrusion dans la cellule ». " +
        "<strong>Observe</strong> : chaque étape active surtout une des quatre actions (percevoir, traiter, décider, agir) et une chaîne ; en cas d'intrusion, la sécurité arrête le robot quelle que soit l'étape.",
      direct: false
    });
    var g = R.el("g", null, f.svg);
    var base = [300, 330], L1 = 125, L2 = 115;
    var pPrise = [150, 300], pDepose = [452, 300], pRepos = [300, 150];
    var ETAPES = [
      { nom: "position de départ", act: [], ch: [], cible: pRepos, piece: [40, 300], tenue: false, txt: "Le robot attend en position de repos." },
      { nom: "détection", act: [0], ch: [0], cible: pRepos, piece: [150, 300], tenue: false, txt: "Capteur / vision : la caméra détecte la pièce entrante." },
      { nom: "autorisation", act: [1, 2], ch: [0], cible: pRepos, piece: [150, 300], tenue: false, txt: "API / contrôleur : l'automate autorise le cycle." },
      { nom: "approche", act: [3], ch: [1, 2], cible: [150, 255], piece: [150, 300], tenue: false, txt: "Le robot se déplace vers la pièce." },
      { nom: "préhension", act: [3], ch: [1, 2], cible: [150, 290], piece: [150, 300], tenue: true, txt: "La pince saisit la pièce." },
      { nom: "déplacement", act: [3], ch: [1, 2], cible: [452, 255], piece: null, tenue: true, txt: "Le robot déplace la pièce selon la trajectoire programmée." },
      { nom: "dépose", act: [3], ch: [1, 2], cible: [452, 290], piece: [452, 300], tenue: false, txt: "La pièce est déposée sur le convoyeur de sortie." }
    ];
    var ACTIONS = ["Percevoir", "Traiter", "Décider", "Agir"], CHAINES = ["Information", "Énergie", "Action", "Sécurité"];
    var etat = { q: ik(pRepos), piece: [40, 300], tenue: false };
    var k = 0;
    var b = R.boutons(f.reglages);
    var intrusion = R.bascule(b, "Intrusion dans la cellule", false, function () { dessiner(); });
    var et = R.etapes(f.reglages, 6, ETAPES.map(function (e) { return e.nom; }), function (n) {
      var de = { q: etat.q.slice(), piece: etat.piece.slice() }, vers = ETAPES[n];
      var qv = ik(vers.cible);
      k = n;
      if (intrusion.checked) { dessiner(); return; }
      R.animer(650, function (u) {
        etat.q = [de.q[0] + (qv[0] - de.q[0]) * u, de.q[1] + (qv[1] - de.q[1]) * u];
        etat.tenue = vers.tenue;
        if (vers.piece && !vers.tenue) etat.piece = [de.piece[0] + (vers.piece[0] - de.piece[0]) * u, de.piece[1] + (vers.piece[1] - de.piece[1]) * u];
        dessiner();
      });
    });

    // Modèle géométrique inverse 2R (coude en haut), utilisé seulement pour animer le dessin.
    function ik(p) {
      var x = p[0] - base[0], y = base[1] - p[1];
      var c2 = (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2);
      c2 = Math.max(-1, Math.min(1, c2));
      var t2 = -Math.acos(c2);
      var t1 = Math.atan2(y, x) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));
      return [t1, t2];
    }
    function badge(x, y, w, txt, on, coul) {
      R.el("rect", { x: x, y: y, width: w, height: 32, rx: 10, fill: on ? coul : "#f6f7fa", stroke: on ? coul : "#e3e6ee", "stroke-width": 1.5 }, g);
      R.texte(g, txt, [x + w / 2, y + 17], { couleur: on ? "#fff" : C.doux, italique: false, taille: 15, gras: on, halo: false });
    }
    function dessiner() {
      if (!et) return;
      R.vider(g);
      var e = ETAPES[k], arret = intrusion.checked;
      // clôture et barrière immatérielle
      R.el("rect", { x: 20, y: 40, width: 560, height: 315, fill: "none", stroke: "#c6cbd8", "stroke-width": 1.5, "stroke-dasharray": "8 6", rx: 10 }, g);
      R.ligne(g, [20, 120], [20, 290], { couleur: arret ? C.x : C.acc, epaisseur: 6 });
      R.texte(g, arret ? "barrière franchie" : "barrière immatérielle", [92, 362], { couleur: arret ? C.x : C.doux, italique: false, taille: 13 });
      // convoyeurs
      R.el("rect", { x: 30, y: 310, width: 200, height: 18, rx: 9, fill: "#c6cbd8" }, g);
      R.el("rect", { x: 370, y: 310, width: 200, height: 18, rx: 9, fill: "#c6cbd8" }, g);
      R.texte(g, "convoyeur d'entrée", [130, 342], { couleur: C.doux, italique: false, taille: 13 });
      R.texte(g, "convoyeur de sortie", [470, 342], { couleur: C.doux, italique: false, taille: 13 });
      // caméra et automate
      var camOn = e.act.indexOf(0) >= 0 && !arret;
      R.el("rect", { x: 130, y: 56, width: 40, height: 26, rx: 5, fill: camOn ? C.z : "#9aa0ad" }, g);
      if (camOn) R.polygone(g, [[150, 82], [118, 296], [182, 296]], { remplissage: "rgba(59,91,219,0.12)" });
      R.texte(g, "caméra", [150, 50], { couleur: C.doux, italique: false, taille: 13 });
      var apiOn = (e.act.indexOf(1) >= 0) && !arret;
      R.el("rect", { x: 496, y: 60, width: 68, height: 84, rx: 8, fill: apiOn ? C.z : "#9aa0ad" }, g);
      R.texte(g, "API", [530, 102], { couleur: "#fff", italique: false, gras: true, taille: 17, halo: false });
      // robot
      var q = etat.q, p1 = [base[0] + L1 * Math.cos(q[0]), base[1] - L1 * Math.sin(q[0])];
      var p2 = [p1[0] + L2 * Math.cos(q[0] + q[1]), p1[1] - L2 * Math.sin(q[0] + q[1])];
      R.el("rect", { x: base[0] - 34, y: base[1], width: 68, height: 26, rx: 6, fill: "#5b6172" }, g);
      var coulBras = arret ? "#c6cbd8" : "#ff8a5c", coulAvant = arret ? "#c6cbd8" : "#8b3fd9";
      R.el("line", { x1: base[0], y1: base[1], x2: p1[0], y2: p1[1], stroke: coulBras, "stroke-width": 20, "stroke-linecap": "round" }, g);
      R.el("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: coulAvant, "stroke-width": 15, "stroke-linecap": "round" }, g);
      [base, p1].forEach(function (c) { R.el("circle", { cx: c[0], cy: c[1], r: 10, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g); });
      // pince
      var ouv = etat.tenue ? 7 : 13;
      R.ligne(g, [p2[0] - ouv, p2[1] - 2], [p2[0] - ouv, p2[1] + 14], { couleur: C.fonce, epaisseur: 4 });
      R.ligne(g, [p2[0] + ouv, p2[1] - 2], [p2[0] + ouv, p2[1] + 14], { couleur: C.fonce, epaisseur: 4 });
      R.ligne(g, [p2[0] - ouv, p2[1] - 2], [p2[0] + ouv, p2[1] - 2], { couleur: C.fonce, epaisseur: 4 });
      // pièce
      var pc = etat.tenue ? [p2[0], p2[1] + 12] : etat.piece;
      R.el("rect", { x: pc[0] - 12, y: pc[1] - 12, width: 24, height: 24, rx: 4, fill: C.z, stroke: "#fff", "stroke-width": 2 }, g);
      // badges
      R.texte(g, "Actions", [48, 392], { italique: false, couleur: C.doux, taille: 13, ancre: "start" });
      ACTIONS.forEach(function (a, i) { badge(110 + i * 120, 377, 110, a, !arret && e.act.indexOf(i) >= 0, C.z); });
      R.texte(g, "Chaînes", [48, 436], { italique: false, couleur: C.doux, taille: 13, ancre: "start" });
      CHAINES.forEach(function (a, i) { badge(110 + i * 120, 421, 110, a, arret ? i === 3 : e.ch.indexOf(i) >= 0, i === 3 ? C.x : C.y); });
      R.texte(g, arret ? "Arrêt : la sécurité stoppe le robot." : e.txt, [300, 22], { italique: false, taille: 16, couleur: arret ? C.x : C.fonce, gras: arret });
    }
    et.aller(0);
  })();

  /* ---------- Figure 2 : classer un robot selon les cinq critères ---------- */
  (function () {
    var f = R.figure("fig-classes", {
      hauteur: 380,
      titre: "Classement d'un robot selon les cinq critères",
      essai: "<strong>Essaie</strong> : choisis un robot avec les boutons. <strong>Observe</strong> : il se range dans une case par critère, et deux robots très différents peuvent partager plusieurs cases. Le classement des exemples est une proposition pour s'entraîner ; « sans objet » signifie que le critère ne s'applique pas vraiment (pas de bras).",
      direct: false
    });
    var g = R.el("g", null, f.svg);
    var CRIT = [
      ["Mobilité", ["Fixe", "Mobile", "Hybride"]],
      ["Architecture", ["Série", "Parallèle", "Hybride"]],
      ["Interaction", ["Conventionnel", "Cobot", "Service"]],
      ["Autonomie", ["1 Téléopéré", "2 Programmé", "3 Adaptatif", "4 Autonome"]],
      ["Domaine", ["Industriel", "Service pro.", "Service perso.", "Médical", "Militaire", "Spatial, sous-marin"]]
    ];
    var ROBOTS = [
      ["Robot Delta (pick and place)", [0, 1, 0, 1, 0]],
      ["Cobot à six axes", [0, 0, 1, 2, 0]],
      ["Robot chirurgical téléopéré", [0, 0, 2, 0, 3]],
      ["Manipulateur mobile", [2, 0, 1, 2, 0]],
      ["AGV / AMR logistique", [1, -1, 2, 3, 1]],
      ["Robot aspirateur", [1, -1, 2, 3, 2]],
      ["Robot sous-marin (ROV)", [1, -1, -1, 0, 5]]
    ];
    var choisi = 0, btns = [];
    var b = R.boutons(f.reglages);
    ROBOTS.forEach(function (r, i) {
      btns.push(R.bouton(b, r[0], function () { choisi = i; btns.forEach(function (x, j) { x.classList.toggle("actif", j === i); }); dessiner(); }));
    });
    btns[0].classList.add("actif");
    function dessiner() {
      R.vider(g);
      var sel = ROBOTS[choisi][1];
      R.texte(g, ROBOTS[choisi][0], [300, 24], { italique: false, gras: true, taille: 18 });
      // au plus quatre cases par ligne : les six domaines tiennent sur deux lignes
      var y = 52;
      CRIT.forEach(function (c, i) {
        var parLigne = Math.min(4, Math.ceil(c[1].length / Math.ceil(c[1].length / 4)));
        var lignes = Math.ceil(c[1].length / parLigne);
        R.texte(g, c[0], [10, y + 19], { italique: false, ancre: "start", taille: 15, couleur: C.doux });
        if (sel[i] === -1) R.texte(g, "sans objet", [10, y + 40], { italique: false, ancre: "start", couleur: C.acc, taille: 13 });
        var w = (476 - (parLigne - 1) * 6) / parLigne;
        c[1].forEach(function (cat, j) {
          var on = sel[i] === j, x = 116 + (j % parLigne) * (w + 6), yy = y + Math.floor(j / parLigne) * 42;
          R.el("rect", { x: x, y: yy, width: w, height: 36, rx: 10, fill: on ? C.z : "#f6f7fa", stroke: on ? C.z : "#e3e6ee", "stroke-width": 1.5 }, g);
          R.texte(g, cat, [x + w / 2, yy + 19], { italique: false, taille: 14, couleur: on ? "#fff" : C.doux, gras: on, halo: false });
        });
        y += lignes * 42 + 12;
      });
    }
    dessiner();
  })();
})();
