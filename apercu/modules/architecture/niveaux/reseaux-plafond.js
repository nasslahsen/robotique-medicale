/* Niveau : réseaux informatiques (diapo 43) et plafond technique (diapo 49). */
NIVEAU(ARCHI.rejouable({
  id: "reseaux-plafond",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "reseau", poses: {}, faux: -1, g: g, pl: { P: function (v) { return v; } } };
    // éléments proposés pour le plafond technique (diapo 49) et deux intrus
    n.ELEM = [
      { t: "Ventilation", ok: true, c: C.acc }, { t: "Gaines", ok: true, c: C.acc }, { t: "Réseaux électriques", ok: true, c: C.ko },
      { t: "Armoire de stockage", ok: false }, { t: "Réseaux informatiques", ok: true, c: C.v }, { t: "Gaz médicaux", ok: true, c: C.ok },
      { t: "Évacuation", ok: true, c: C.sale }, { t: "Éclairage", ok: true, c: "#e8a317" }, { t: "Table opératoire", ok: false }, { t: "Supports des équipements", ok: true, c: C.encre }
    ];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "plafond") {
        // coupe : dalle, espace technique, faux plafond, salle
        A.s("rect", { x: 20, y: 40, width: 640, height: 24, fill: "#9aa0ad" }, g);
        A.s("rect", { x: 20, y: 64, width: 640, height: 200, fill: C.fond }, g);
        A.s("line", { x1: 20, y1: 264, x2: 660, y2: 264, stroke: C.encre, "stroke-width": 5 }, g);
        A.texte(g, "Plafond technique", [600, 250], { taille: 14, coul: C.doux, ancre: "end" });
        var poses = n.ELEM.filter(function (e, i) { return n.poses[i]; });
        poses.forEach(function (e, k) {
          var x = 30 + (k % 4) * 158, y = 76 + Math.floor(k / 4) * 60;
          A.boite(g, x, y, 148, 50, { fond: "#fff", bord: e.c, ep: 3, rx: 8, titre: e.t, taille: 13 });
        });
        // éléments à placer
        n.ELEM.forEach(function (e, i) {
          if (n.poses[i]) return;
          var k = n.ELEM.slice(0, i).filter(function (x, m) { return !n.poses[m]; }).length;
          var x = 24 + (k % 3) * 214, y = 300 + Math.floor(k / 3) * 74, f = n.faux === i;
          A.boite(g, x, y, 200, 60, { fond: f ? C.koPale : "#fff", bord: f ? C.ko : C.encre, ep: 2.5, rx: 12, titre: e.t, taille: 15 });
          A.cible(g, x, y, 200, 60, function () { if (n.surElem) n.surElem(i); });
        });
      } else {
        // bloc relié : quatre besoins autour d'un serveur
        A.boite(g, 240, 250, 200, 100, { fond: C.vPale, bord: C.v, titre: "Réseau informatique du bloc", taille: 16 });
        [["Dossier patient informatisé", 40, 80], ["PACS", 470, 80], ["Traçabilité", 40, 440], ["Vidéo et téléconsultation", 470, 440]].forEach(function (b) {
          A.boite(g, b[1], b[2], 170, 80, { titre: b[0], taille: 15 });
          A.fleche(g, [b[1] + 85, b[2] + (b[2] < 300 ? 82 : -2)], [340, b[2] < 300 ? 246 : 354], { coul: C.v, ep: 3 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le bloc connecté", jouer: function (j, n) {
      j.titre("Le bloc opératoire moderne nécessite aussi des réseaux. Relie chaque système à ce qu'il fait.");
      var S = ["Dossier patient informatisé", "PACS", "RIS", "Système de traçabilité", "Téléconsultation"];
      var R = ["Suivre le parcours des dispositifs médicaux", "Obtenir l'avis d'un spécialiste à distance", "Archiver et transmettre les images médicales", "Gérer l'activité du service de radiologie", "Consulter l'histoire médicale du patient"];
      var pa = ARCHI.paires({ g: n.g, gauche: S, droite: R, bon: [4, 2, 3, 0, 1], xg: 20, wg: 230, xd: 290, wd: 370, y0: 60, h: 88, pas: 106, taille: 16, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le dossier contient l'histoire médicale.", "PACS : système d'archivage et de communication des images.", "RIS : système d'information de radiologie.", "Tracer, c'est suivre un objet de bout en bout.", "« Télé » : à distance."][i]; },
        fin: function () {
          n.mode = "reseau"; n.dessin();
          j.bravo("Dossier, images, radiologie, traçabilité, avis à distance.");
          j.expliquer("<p>Le cours liste : réseau informatique, dossier patient informatisé, PACS, RIS, système de traçabilité, vidéo, téléconsultation, intégration des équipements biomédicaux. Les définitions de PACS et RIS sont ajoutées ici pour comprendre.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Ce qu'il faut prévoir", jouer: function (j, n) {
      j.titre("Pour ces réseaux, le cours dit : il faut prévoir quatre choses. Complète.");
      var res = j.zone("", "");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.5"><span class="trou" data-attendu="a"></span> + <span class="trou" data-attendu="b"></span> + <span class="trou" data-attendu="c"></span> + <span class="trou" data-attendu="d"></span></p>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "disponibilité" }, { id: "x", html: "publicité" }, { id: "a", html: "données" }, { id: "d", html: "maintenance" }, { id: "b", html: "cybersécurité" }],
        aide: "Dans l'ordre du cours : ce qui circule, ce qui le protège, ce qui le rend toujours accessible, ce qui le fait durer.",
        ok: function () {
          j.bravo("Données + cybersécurité + disponibilité + maintenance.");
          j.expliquer("<p>Dans le tableau de synthèse, l'informatique a pour exigence <b>disponibilité + sécurité</b>, sinon <b>perte de données</b>.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Remplir le plafond technique", jouer: function (j, n) {
      n.mode = "plafond"; n.poses = {}; n.faux = -1; n.dessin();
      j.titre("Touche tout ce que le plafond technique doit intégrer. Deux éléments n'y ont pas leur place.");
      var reste = n.ELEM.filter(function (e) { return e.ok; }).length;
      n.surElem = function (i) {
        var e = n.ELEM[i];
        if (n.poses[i]) return;
        if (!e.ok) { n.faux = i; n.dessin(); j.erreur("Cet élément reste dans la salle ou ailleurs : le plafond technique porte les réseaux et les supports."); return; }
        n.poses[i] = true; n.faux = -1; reste--; n.dessin();
        if (reste) return;
        n.surElem = null;
        j.bravo("Huit éléments intégrés au plafond technique.");
        j.suite();
      };
      j.reponse(function () { n.ELEM.forEach(function (e, i) { if (e.ok && n.surElem) n.surElem(i); }); });
    } },
    { nom: "Qui coordonne ?", jouer: function (j, n) {
      j.titre("Le plafond technique réunit tous ces réseaux. Quelle coordination le cours demande-t-il ?");
      j.choix([
        { html: "L'électricien seul, car il passe en premier", aide: "Chaque réseau a son métier : il faut qu'ils se parlent." },
        { html: "Architecture + CVC + électricité + fluides médicaux + biomédical", juste: true },
        { html: "Aucune : chacun prend la place qui reste", aide: "C'est ainsi qu'on finit avec une gaine qui passe là où devait aller le bras plafonnier." }
      ], { colonnes: 1, ok: function () { j.bravo("Cinq métiers autour d'un même plafond."); j.suite(); } });
    } }
  ]
}));
