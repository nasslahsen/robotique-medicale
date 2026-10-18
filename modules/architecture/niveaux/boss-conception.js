/* Boss du chapitre 6 et du cours : monter le dossier d'un nouveau bloc, de la première étape à l'idée centrale. */
NIVEAU({
  id: "boss-conception",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.dossier = function (coche) {
      A.vider(g); fig.chip(null);
      A.boite(g, 60, 50, 560, 500, { fond: "#fff", bord: C.encre, ep: 3 });
      A.texte(g, "Dossier : nouveau bloc de 4 salles dont 1 hybride", [340, 90], { taille: 18, gras: 800, largeur: 500 });
      A.texte(g, "(exemple ajouté)", [340, 122], { taille: 14, coul: C.doux });
      ["Méthode", "Exigences par domaine", "Salle hybride", "Équipe de conception", "Idée centrale"].forEach(function (t, i) {
        var y = 160 + i * 74, ok = coche > i;
        A.s("rect", { x: 110, y: y, width: 40, height: 40, rx: 8, fill: ok ? C.ok : "#fff", stroke: ok ? C.ok : C.gris, "stroke-width": 3 }, g);
        if (ok) A.s("path", { d: "M" + (118) + " " + (y + 20) + " l8 9 l16 -18", fill: "none", stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round" }, g);
        A.texte(g, t, [170, y + 20], { taille: 18, ancre: "start", coul: ok ? C.encre : C.doux });
      });
    };
    n.dossier(0);
    return n;
  },
  etapes: [
    { nom: "Par où commencer ?", jouer: function (j, n) {
      j.titre("On te confie un nouveau bloc de quatre salles, dont une hybride. Par quoi commences-tu ?");
      j.choix([
        { html: "Dessiner les salles pour montrer quelque chose vite", aide: "Construire avant de connaître le besoin et les équipements : c'est l'erreur n° 1." },
        { html: "Analyser les besoins : nombre de salles, spécialités, interventions, horaires, types de chirurgie", juste: true },
        { html: "Choisir les équipements d'imagerie", aide: "Les équipements viennent avec l'implantation biomédicale, après l'analyse des besoins." }
      ], { colonnes: 1, ok: function () { n.dossier(1); j.bravo("Étape 1 : analyse des besoins."); j.suite(); } });
    } },
    { nom: "Les exigences", jouer: function (j, n) {
      j.titre("Pour la note de synthèse, relie chaque domaine à son exigence principale.");
      var D = ["Ventilation", "Électricité", "Déchets", "Biomédical", "Maintenance", "Sols / murs"];
      var X = ["Accessibilité technique", "Surfaces lavables", "Filtration + pression + renouvellement", "Implantation adaptée", "Continuité + sécurité", "Circuit maîtrisé"];
      var pa = ARCHI.paires({ g: n.g, gauche: D, droite: X, bon: [2, 4, 5, 3, 0, 1], xg: 30, wg: 220, xd: 300, wd: 350, y0: 50, h: 76, pas: 90, taille: 17, tailleD: 15,
        erreur: j.erreur, info: j.info,
        fin: function () { n.dossier(2); j.bravo("Six exigences du tableau de synthèse."); j.suite(); } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "La salle hybride", jouer: function (j, n) {
      j.titre("La salle hybride a 9,00 m de longueur libre. Quelle largeur libre minimale, au centimètre près, pour respecter le FGI 2022 ?");
      j.nombre({ avant: "\\ell_{\\min} =", apres: "\\text{m}", cases: [{ attendu: 6.20, tol: 0.005 }], ligne: true,
        aide: function () { return "55,74 ÷ 9 = 6,193… : arrondis au centimètre supérieur, puis vérifie aussi la dimension minimale de 6,10 m."; },
        ok: function () { n.dossier(3); j.bravo("6,20 m : la surface atteint 55,80 m² et la largeur dépasse 6,10 m."); j.suite(); } });
    } },
    { nom: "L'équipe", jouer: function (j, n) {
      j.titre("Qui réunis-tu autour de la table dès la conception ?");
      j.choix([
        { html: "L'architecte et l'entreprise de travaux", aide: "Il manque les ingénieurs, l'exploitant, la prévention des infections et l'ingénieur biomédical." },
        { html: "Architectes, ingénieurs (dont l'ingénieur biomédical), exploitants et équipe de prévention des infections", juste: true },
        { html: "Les chirurgiens seuls, puisque c'est leur bloc", aide: "Ils sont précieux pour le besoin, mais ne peuvent pas porter la ventilation, l'électricité ou les gaz." }
      ], { colonnes: 1, ok: function () { n.dossier(4); j.bravo("C'est l'équipe que demandent l'OMS et les recommandations récentes."); j.suite(); } });
    } },
    { nom: "L'idée centrale", jouer: function (j, n) {
      j.titre("Termine le dossier par l'idée centrale du cours.");
      var res = j.zone("", "");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.6">Un bloc opératoire performant n\'est pas seulement <span class="trou" data-attendu="a"></span> : c\'est <span class="trou" data-attendu="b"></span> associant architecture, flux, ventilation, électricité, fluides médicaux, équipements biomédicaux, hygiène, sécurité et <span class="trou" data-attendu="c"></span>.</p>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "b", html: "un système intégré" }, { id: "x", html: "un bâtiment neuf" }, { id: "c", html: "maintenance" }, { id: "a", html: "une salle équipée" }, { id: "y", html: "décoration" }],
        aide: "Ce n'est pas seulement une salle avec du matériel : c'est un ensemble qui fonctionne ensemble, et qu'on doit pouvoir entretenir.",
        ok: function () {
          n.dossier(5);
          j.bravo("Un système intégré. Dossier complet.");
          j.expliquer("<p>Fonctionnel (flux, zonage), technique (CVC, électricité, gaz médicaux, informatique) et sécurité (incendie, évacuation, radioprotection) convergent vers le bloc, puis vers la salle (patient, personnel, matériel), sous les exigences d'hygiène, de sécurité et de biomédical : <b>qualité et continuité des soins</b>.</p>");
          j.suite();
        }
      });
    } }
  ]
});
