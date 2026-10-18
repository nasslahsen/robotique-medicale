/* Niveau : bloc hybride (diapos 56 et 57) et protection radiologique (diapo 58). */
NIVEAU({
  id: "bloc-hybride",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "salle", poses: {}, trouves: {}, faux: -1, pl: { P: function (v) { return v; } } };
    // équipements à installer autour de la table (vue de dessus)
    n.EQ = [
      { id: "arceau", t: "Arceau", x: 180, y: 150, w: 120, h: 120 },
      { id: "angio", t: "Système d'angiographie", x: 420, y: 120, w: 150, h: 90 },
      { id: "anesth", t: "Anesthésie", x: 300, y: 70, w: 120, h: 60 },
      { id: "chir", t: "Équipements chirurgicaux", x: 130, y: 390, w: 150, h: 80 },
      { id: "ecrans", t: "Protection radiologique", x: 440, y: 400, w: 150, h: 70 }
    ];
    n.RX = [
      { id: "parois", c: [60, 300], nom: "Blindage des parois" }, { id: "porte", c: [340, 560], nom: "Portes" },
      { id: "vitre", c: [620, 220], nom: "Vitrages" }, { id: "source", c: [340, 280], nom: "Positionnement de la source" },
      { id: "voisin", c: [620, 440], nom: "Zones adjacentes" }, { id: "signal", c: [430, 560], nom: "Signalisation" },
      { id: "horloge", c: [180, 440], nom: "Horloge murale", decoy: true }, { id: "couleur", c: [500, 330], nom: "Couleur des murs", decoy: true }
    ];
    n.dessin = function () {
      A.vider(g);
      var Z = A.ZONES;
      if (n.mode === "salle") {
        var nb = Object.keys(n.poses).length;
        // salle conventionnelle (pointillés) et salle hybride
        A.s("rect", { x: 160, y: 140, width: 360, height: 320, fill: "none", stroke: C.gris, "stroke-width": 3, "stroke-dasharray": "10 8" }, g);
        A.texte(g, "salle conventionnelle", [340, 476], { taille: 14, coul: C.doux });
        if (nb === n.EQ.length) { A.s("rect", { x: 100, y: 50, width: 520, height: 450, fill: "none", stroke: C.ok, "stroke-width": 4 }, g); A.texte(g, "salle hybride", [360, 40], { taille: 15, coul: C.ok }); }
        A.s("rect", { x: 310, y: 210, width: 60, height: 180, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
        A.texte(g, "Table", [340, 300], { taille: 15, halo: false });
        n.EQ.forEach(function (e) {
          if (!n.poses[e.id]) return;
          if (e.id === "arceau") { A.s("path", { d: "M" + 270 + " 250 A75 75 0 0 1 410 250", fill: "none", stroke: C.v, "stroke-width": 14, "stroke-linecap": "round" }, g); A.texte(g, "Arceau", [340, 195], { taille: 15, coul: C.v }); return; }
          A.boite(g, e.x, e.y, e.w, e.h, { fond: C.vPale, bord: C.v, ep: 2.5, rx: 8, titre: e.t, taille: 14 });
        });
        // réserve d'équipements à poser
        var reste = n.EQ.filter(function (e) { return !n.poses[e.id]; });
        reste.forEach(function (e, i) {
          var x = 20 + i * 132;
          A.boite(g, x, 520, 124, 64, { fond: "#fff", bord: C.encre, ep: 2.5, rx: 10, titre: e.t, taille: 13 });
          A.cible(g, x, 520, 124, 64, function () { if (n.surPose) n.surPose(e.id); });
        });
        fig.chip(null);
      } else if (n.mode === "rx") {
        A.s("rect", { x: 60, y: 90, width: 560, height: 470, fill: Z.restreinte.fond, stroke: C.encre, "stroke-width": 9 }, g);
        A.texte(g, "Salle hybride", [180, 120], { taille: 17, halo: false });
        A.s("rect", { x: 615, y: 170, width: 10, height: 100, fill: "#bfe3ff", stroke: C.acc, "stroke-width": 2 }, g);
        A.texte(g, "Pupitre", [650, 150], { taille: 14, ancre: "end", coul: C.doux });
        A.s("rect", { x: 290, y: 555, width: 100, height: 10, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        A.s("rect", { x: 410, y: 545, width: 40, height: 14, rx: 4, fill: C.ko }, g);
        A.texte(g, "Bureau voisin", [610, 400], { taille: 14, ancre: "end", coul: C.doux });
        A.s("rect", { x: 310, y: 220, width: 60, height: 160, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2 }, g);
        A.icone(g, "radiation", [340, 330], 34, C.ko);
        n.RX.forEach(function (p, i) {
          var t = n.trouves[p.id];
          var f = n.faux === i;
          A.s("circle", { cx: p.c[0], cy: p.c[1], r: 21, fill: t ? C.ok : f ? C.koPale : "rgba(59,91,219,.12)", stroke: t ? "#fff" : f ? C.ko : C.acc, "stroke-width": 3 }, g);
          if (t) A.s("path", { d: "M" + (p.c[0] - 9) + " " + p.c[1] + " l6 7 l12 -14", fill: "none", stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round" }, g);
          else A.texte(g, "?", p.c, { taille: 18, coul: f ? C.ko : C.acc, halo: false, gras: 800 });
          A.texte(g, p.nom, [p.c[0] + (p.c[0] > 560 ? -8 : p.c[0] < 100 ? 8 : 0), p.c[1] + 36], { taille: 14, coul: t ? C.ok : C.doux, ancre: p.c[0] > 560 ? "end" : p.c[0] < 100 ? "start" : "middle" });
          A.cible(g, p.c[0] - 32, p.c[1] - 32, 64, 64, function () { if (n.surRx) n.surRx(i); });
        });
        fig.chip(null);
      } else {
        fig.chip(null);
        A.boite(g, 60, 200, 230, 120, { titre: "Chirurgie", fond: Z.restreinte.fond, bord: Z.restreinte.bord, taille: 22 });
        A.texte(g, "+", [340, 260], { taille: 40, gras: 800 });
        A.boite(g, 390, 200, 230, 120, { titre: n.defOk ? "Imagerie interventionnelle" : "?", fond: n.defOk ? C.vPale : C.fond, bord: n.defOk ? C.v : C.trait, taille: 20, tirets: n.defOk ? null : "8 6", coul: n.defOk ? C.encre : C.gris });
        A.texte(g, "= bloc hybride", [340, 380], { taille: 24, gras: 800, coul: C.jeu });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Ce qu'est un bloc hybride", jouer: function (j, n) {
      n.mode = "def"; n.dessin();
      j.titre("Un patient doit recevoir une prothèse aortique posée sous angiographie, avec possibilité de convertir en chirurgie ouverte. Quelle salle faut-il ?");
      j.choix([
        { html: "Chirurgie + imagerie interventionnelle : un bloc hybride", juste: true },
        { html: "Une salle de radiologie classique", aide: "On doit aussi pouvoir opérer à ciel ouvert, avec toute l'asepsie d'un bloc." },
        { html: "Une salle opératoire conventionnelle avec un appareil photo", aide: "Il faut une vraie imagerie interventionnelle, comme l'angiographie." }
      ], { colonnes: 1, ok: function () {
        n.defOk = true; n.dessin();
        j.bravo("Le bloc hybride combine chirurgie et imagerie interventionnelle.");
        j.expliquer("<p>Exemples du cours : angiographie, chirurgie vasculaire, chirurgie cardiaque, interventions complexes. Le cas ci-dessus est un exemple ajouté.</p>");
        j.suite();
      } });
    } },
    { nom: "Installer la salle", jouer: function (j, n) {
      n.mode = "salle"; n.dessin();
      j.titre("Installe les équipements de la salle hybride autour de la table. Touche-les un par un.");
      n.surPose = function (id) {
        if (n.poses[id]) return;
        n.poses[id] = true; n.dessin();
        if (Object.keys(n.poses).length < n.EQ.length) return;
        n.surPose = null;
        j.consigne("Compare avec le contour d'une salle conventionnelle. Que conclus-tu ?");
        j.choix([
          { html: "Le bloc hybride nécessite davantage d'espace", juste: true },
          { html: "Tout tient dans une salle conventionnelle", aide: "Regarde les équipements qui débordent du contour en pointillés." },
          { html: "Il suffit de supprimer l'anesthésie", aide: "L'anesthésie fait partie de la liste : on ne la supprime pas." }
        ], { colonnes: 1, ok: function () {
          j.bravo("Davantage d'espace pour l'arceau, l'angiographie, la table, l'anesthésie, les équipements chirurgicaux et la protection radiologique.");
          j.expliquer("<p>Le FGI prévoit pour les salles hybrides des exigences spécifiques d'espace, notamment les <b>dégagements autour de la table</b> et les <b>besoins d'installation et de maintenance</b>.</p>");
          j.suite();
        } });
      };
      j.reponse(function () { n.EQ.forEach(function (e) { if (n.surPose) n.surPose(e.id); }); });
    } },
    { nom: "Ce qu'il faut étudier", jouer: function (j, n) {
      n.mode = "rx"; n.dessin();
      j.titre("Un appareil RX est installé dans la salle. Touche les six points à étudier pour la protection radiologique, et seulement eux.");
      n.surRx = function (i) {
        var p = n.RX[i];
        if (n.trouves[p.id]) return;
        if (p.decoy) { n.faux = i; n.dessin(); j.erreur("Cet élément n'arrête ni ne laisse passer les rayons X. Pense à tout ce que les rayons peuvent traverser, et à qui se trouve derrière."); return; }
        n.trouves[p.id] = true; n.faux = -1; n.dessin();
        if (Object.keys(n.trouves).length < 6) return;
        n.surRx = null;
        j.bravo("Parois, portes, vitrages, source, zones adjacentes, signalisation.");
        j.expliquer("<p>Le cours liste : blindage des parois, portes, vitrages, plafond / plancher si nécessaire, positionnement de la source, zones adjacentes, signalisation, contrôle réglementaire.</p>");
        j.suite();
      };
      j.reponse(function () { n.RX.forEach(function (p, i) { if (!p.decoy && n.surRx) n.surRx(i); }); });
    } },
    { nom: "Quelle épaisseur ?", jouer: function (j, n) {
      j.titre("L'entreprise propose de poser partout la même épaisseur de plomb « standard ». Que réponds-tu ?");
      j.choix([
        { html: "D'accord, c'est plus simple et plus sûr", aide: "Plus simple, oui ; adapté, pas forcément : trop peu protège mal, trop coûte et alourdit." },
        { html: "La protection doit être calculée par une étude radiophysique / radioprotection", juste: true },
        { html: "Inutile, l'arceau est mobile", aide: "Mobile ou non, il émet des rayons X : il faut une étude." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Une étude, pas une épaisseur standard appliquée systématiquement.");
        j.expliquer("<p>L'étude tient compte de la source, de son positionnement, des zones adjacentes (un bureau occupé ou un local technique ne demandent pas la même protection) et aboutit à un contrôle réglementaire. Installer un équipement d'imagerie sans étude radiologique fait partie des dix erreurs du cours.</p>");
        j.suite();
      } });
    } }
  ]
});
