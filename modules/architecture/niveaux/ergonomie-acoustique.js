/* Niveau : acoustique (diapo 59) et ergonomie (diapo 60). */
NIVEAU({
  id: "ergonomie-acoustique",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "equipe", resp: null, trouves: {}, faux: -1, g: g, pl: { P: function (v) { return v; } } };
    n.PB = [
      { id: "cable", c: [470, 470], ok: true, nom: "câble au sol" }, { id: "chariot", c: [78, 265], ok: true, nom: "obstacle dans le passage" },
      { id: "ecran", c: [595, 192], ok: true, nom: "mauvaise visibilité" }, { id: "instr", c: [522, 530], ok: true, nom: "déplacements excessifs" },
      { id: "lampe", c: [340, 260], ok: false }, { id: "anesth", c: [340, 110], ok: false }
    ];
    // salle vue de dessus : la tête du patient en haut
    n.salle = function (o) {
      A.s("rect", { x: 30, y: 40, width: 620, height: 540, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
      A.s("rect", { x: 300, y: 170, width: 80, height: 260, rx: 10, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
      A.s("circle", { cx: 340, cy: 200, r: 18, fill: "#f6c2b0" }, g);
      A.s("rect", { x: 316, y: 222, width: 48, height: 180, rx: 18, fill: "#cfe0f7" }, g);
      A.icone(g, "personne", [240, 300], 46, C.personnel); A.texte(g, "Chirurgien", [240, 338], { taille: 14, coul: C.personnel });
      A.icone(g, "personne", [340, 110], 46, C.v); A.texte(g, "Anesthésie", [400, 100], { taille: 14, coul: C.v, ancre: "start" });
      A.icone(g, "personne", [440, 330], 46, C.ok); A.texte(g, "Instrumentiste", [440, 368], { taille: 14, coul: C.ok });
      if (o.instrPres) { A.boite(g, 480, 380, 100, 60, { fond: "#fff", bord: C.ok, ep: 2.5, rx: 6, titre: "Instruments", taille: 13 }); }
    };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "equipe") {
        n.salle({ instrPres: true });
        var P = { a: [200, 120], b: [340, 520], c: [560, 230] };
        ["a", "b", "c"].forEach(function (k) {
          var sel = n.resp === k, ok = sel && k === "a";
          A.boite(g, P[k][0] - 60, P[k][1] - 36, 120, 72, { fond: sel ? (ok ? C.okPale : C.koPale) : "#fff", bord: sel ? (ok ? C.ok : C.ko) : C.gris, tirets: sel ? null : "8 6", ep: 3, rx: 10, titre: sel ? "Respirateur" : k.toUpperCase(), taille: sel ? 15 : 24, coul: sel ? C.encre : C.gris });
          A.cible(g, P[k][0] - 60, P[k][1] - 36, 120, 72, function () { if (n.surResp) n.surResp(k); });
        });
        if (n.resp === "a") A.s("path", { d: "M260 120 Q300 120 330 192", fill: "none", stroke: C.v, "stroke-width": 3, "stroke-dasharray": "6 5" }, g);
        if (n.resp === "b") A.s("path", { d: "M340 484 Q300 470 260 330 Q250 260 330 196", fill: "none", stroke: C.ko, "stroke-width": 3, "stroke-dasharray": "6 5" }, g);
        if (n.resp === "c") A.s("path", { d: "M500 230 Q420 160 350 196", fill: "none", stroke: C.ko, "stroke-width": 3, "stroke-dasharray": "6 5" }, g);
      } else if (n.mode === "pieges") {
        n.salle({});
        // câble qui traverse le passage, chariot au milieu, écran derrière le chirurgien, table d'instruments loin
        A.s("path", { d: "M640 470 C560 500 420 440 330 470 C260 490 160 460 40 480", fill: "none", stroke: C.encre, "stroke-width": 4 }, g);
        A.s("rect", { x: 110, y: 240, width: 80, height: 50, rx: 6, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 2.5 }, g);
        A.s("rect", { x: 560, y: 110, width: 70, height: 46, rx: 4, fill: C.encre }, g);
        A.s("rect", { x: 555, y: 500, width: 85, height: 60, rx: 6, fill: "#fff", stroke: C.ok, "stroke-width": 2.5 }, g);
        A.texte(g, "Instruments", [597, 530], { taille: 12, halo: false });
        n.PB.forEach(function (p, i) {
          var t = n.trouves[p.id], f = n.faux === i;
          A.s("circle", { cx: p.c[0], cy: p.c[1], r: 22, fill: t ? C.ko : f ? "#fff" : "rgba(59,91,219,.12)", stroke: t ? "#fff" : f ? C.gris : C.acc, "stroke-width": 3 }, g);
          A.texte(g, t ? "!" : "?", p.c, { taille: 20, coul: t ? "#fff" : f ? C.gris : C.acc, halo: false, gras: 800 });
          if (t) A.texte(g, p.nom, [Math.max(p.c[0], 110), p.c[1] + (p.id === "instr" ? -34 : 36)], { taille: 14, coul: C.ko, ancre: p.c[0] > 500 ? "end" : "middle" });
          A.cible(g, p.c[0] - 32, p.c[1] - 32, 64, 64, function () { if (n.surPb) n.surPb(i); });
        });
      } else {
        // sources de bruit
        [["Ventilation", "air"], ["Alarmes", "bruit"], ["Équipements", "ecran"], ["Portes", "porte"], ["Chariots", "boite"], ["Conversations", "equipe"]].forEach(function (s, i) {
          var x = 40 + (i % 3) * 210, y = 80 + Math.floor(i / 3) * 150;
          A.boite(g, x, y, 180, 120, { fond: "#fff", bord: C.trait, ep: 2 });
          A.icone(g, s[1], [x + 90, y + 46], 42, C.doux);
          A.texte(g, s[0], [x + 90, y + 96], { taille: 16, halo: false });
        });
        A.texte(g, "D'où vient le bruit au bloc", [340, 40], { taille: 17, coul: C.doux });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le respirateur", jouer: function (j, n) {
      j.titre("L'architecture doit suivre les mouvements réels de l'équipe. Où places-tu le respirateur ? Touche A, B ou C.");
      n.surResp = function (k) {
        n.resp = k; n.dessin();
        if (k === "b") { j.erreur("Aux pieds du patient, le tuyau traverse toute la salle et passe dans le champ du chirurgien."); return; }
        if (k === "c") { j.erreur("De l'autre côté, il gêne l'instrumentiste et s'éloigne de l'anesthésiste qui le surveille."); return; }
        n.surResp = null;
        j.bravo("À la tête du patient, à portée de l'anesthésiste.");
        j.expliquer("<p>Le cours décrit les mouvements réels de l'équipe : le chirurgien travaille sur le patient ; autour du patient, l'anesthésie (avec le respirateur), la table, l'instrumentiste (avec les instruments). Chaque équipement se place à côté de celui qui l'utilise.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surResp) n.surResp("a"); });
    } },
    { nom: "Les pièges de la salle", jouer: function (j, n) {
      n.mode = "pieges"; n.dessin();
      j.titre("Cette salle cumule quatre défauts d'ergonomie. Touche-les.");
      n.surPb = function (i) {
        var p = n.PB[i];
        if (n.trouves[p.id]) return;
        if (!p.ok) { n.faux = i; n.dessin(); j.erreur("Ici, rien à reprocher. Cherche ce qui fait trébucher, gêne le passage, cache la vue ou oblige à marcher."); return; }
        n.trouves[p.id] = true; n.faux = -1; n.dessin();
        if (Object.keys(n.trouves).length < 4) return;
        n.surPb = null;
        j.bravo("Câble au sol, obstacle, mauvaise visibilité, déplacements excessifs.");
        j.expliquer("<p>L'objectif est d'éviter les <b>croisements inutiles</b>, les <b>câbles au sol</b>, les <b>obstacles</b>, les <b>déplacements excessifs</b> et la <b>mauvaise visibilité</b>. Dans le tableau de synthèse : ergonomie, exigence « circulation adaptée », risque « fatigue / accidents ».</p>");
        j.suite();
      };
      j.reponse(function () { n.PB.forEach(function (p, i) { if (p.ok && n.surPb) n.surPb(i); }); });
    } },
    { nom: "La conséquence du bruit", jouer: function (j, n) {
      n.mode = "bruit"; n.dessin();
      j.titre("Ventilation, alarmes, équipements, portes, chariots, conversations : que provoque une mauvaise acoustique, d'après le cours ?");
      j.choix([
        { html: "Elle augmente la fatigue du personnel", juste: true },
        { html: "Elle augmente le risque incendie", aide: "Le bruit ne met pas le feu. Pense à l'équipe qui travaille des heures dedans." },
        { html: "Rien, l'équipe s'habitue", aide: "C'est justement ce que le cours conteste." }
      ], { colonnes: 1, ok: function () { j.bravo("Une mauvaise acoustique augmente la fatigue du personnel."); j.suite(); } });
    } },
    { nom: "Une solution par source", jouer: function (j, n) {
      j.titre("Relie chaque source de bruit à la mesure que le cours demande de prévoir.");
      var S = ["Le souffle des bouches d'air", "Une porte qui claque à chaque passage", "Un appareil qui fait vibrer le sol", "Le bruit du couloir voisin"];
      var P = ["Isolation acoustique", "Équipements CVC correctement dimensionnés", "Portes adaptées", "Limitation des vibrations"];
      var pa = ARCHI.paires({ g: n.g, gauche: S, droite: P, bon: [1, 2, 3, 0], xg: 20, wg: 300, xd: 380, wd: 280, y0: 80, h: 96, pas: 124, taille: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le bruit vient du système de ventilation lui-même.", "Le bruit vient de la porte.", "Le bruit se transmet par la structure.", "Le bruit vient d'ailleurs et traverse les parois."][i]; },
        fin: function () {
          j.bravo("CVC bien dimensionné, portes adaptées, vibrations limitées, isolation.");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } }
  ]
});
