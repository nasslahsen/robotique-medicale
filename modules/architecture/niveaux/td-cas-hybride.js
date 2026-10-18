/* Niveau : TD 1, cas 3. Projet de salle hybride sans étude de radioprotection, sans accès de maintenance, sans validation de la charge du plafond. */
NIVEAU({
  id: "td-cas-hybride",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { pris: {}, faux: -1, bras: 0, g: g, pl: { P: function (v) { return v; } } };
    n.ET = [
      { t: "Étude de radioprotection", ok: true }, { t: "Validation de la charge du plafond", ok: true }, { t: "Plan d'implantation biomédical", ok: true },
      { t: "Accès de maintenance", ok: true }, { t: "Choix de la couleur des murs", ok: false }, { t: "Étude CVC (débits, pression)", ok: true },
      { t: "Bilan électrique et alimentations secourues", ok: true }, { t: "Décoration du hall d'accueil", ok: false }
    ];
    n.dessin = function () {
      A.vider(g); fig.chip(null);
      if (n.mode === "bras") {
        // vue de dessus : course du bras plafonnier et rotation de l'arceau
        A.s("rect", { x: 40, y: 40, width: 600, height: 520, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.s("rect", { x: 310, y: 190, width: 60, height: 220, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2 }, g);
        A.s("circle", { cx: 340, cy: 300, r: 150, fill: "rgba(139,63,217,.08)", stroke: C.v, "stroke-width": 3, "stroke-dasharray": "8 6" }, g);
        A.texte(g, "rotation de l'arceau", [340, 470], { taille: 15, coul: C.v });
        var a = n.bras * Math.PI / 180, p = [160 + 170 * Math.cos(a), 140 + 170 * Math.sin(a)];
        A.s("circle", { cx: 160, cy: 140, r: 12, fill: C.encre }, g);
        A.s("line", { x1: 160, y1: 140, x2: p[0], y2: p[1], stroke: C.encre, "stroke-width": 8, "stroke-linecap": "round" }, g);
        var dedans = Math.hypot(p[0] - 340, p[1] - 300) < 150;
        A.s("circle", { cx: p[0], cy: p[1], r: 22, fill: dedans ? C.ko : C.ok, stroke: "#fff", "stroke-width": 3 }, g);
        A.texte(g, "bras plafonnier", [160, 110], { taille: 15 });
        A.texte(g, dedans ? "collision possible" : "hors de la zone de l'arceau", [340, 520], { taille: 17, coul: dedans ? C.ko : C.ok, gras: 800 });
        return;
      }
      A.texte(g, "Études préalables du projet", [340, 44], { taille: 18, gras: 800 });
      n.ET.forEach(function (e, i) {
        var x = 30 + (i % 2) * 320, y = 74 + Math.floor(i / 2) * 120, on = n.pris[i], f = n.faux === i;
        A.boite(g, x, y, 300, 100, { fond: on ? C.okPale : f ? C.koPale : "#fff", bord: on ? C.ok : f ? C.ko : C.trait, ep: on ? 3 : 2, titre: e.t, taille: 17 });
        A.cible(g, x, y, 300, 100, function () { if (n.surEt) n.surEt(i); });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les études préalables", jouer: function (j, n) {
      j.titre("Le projet prévoit angiographie, table, bras plafonniers, respirateur et monitorage, mais aucune étude de radioprotection, aucun accès de maintenance, aucune validation de la charge du plafond. Touche les études préalables nécessaires.");
      var reste = n.ET.filter(function (e) { return e.ok; }).length;
      n.surEt = function (i) {
        if (n.pris[i]) return;
        if (!n.ET[i].ok) { n.faux = i; n.dessin(); j.erreur("Cette étude ne change rien à la sécurité ni au fonctionnement de la salle hybride."); return; }
        n.pris[i] = true; n.faux = -1; reste--; n.dessin();
        if (reste) return;
        n.surEt = null;
        j.bravo("Six études préalables.");
        j.expliquer("<p>Radioprotection (étude radiophysique), charge du plafond (bras plafonniers, éventuellement imagerie suspendue), implantation biomédicale (dimensions, poids, dégagements, interfaces), accès de maintenance, CVC, électricité. Liste proposée à partir du cours ; le TD n'en donne pas le corrigé.</p>");
        j.suite();
      };
      j.reponse(function () { n.ET.forEach(function (e, i) { if (e.ok && n.surEt) n.surEt(i); }); });
    } },
    { nom: "Les interfaces", jouer: function (j, n) {
      ARCHI.vider(n.g);
      j.titre("Relie chaque interface à ce qu'elle doit coordonner.");
      var D = ["Structure ↔ biomédical", "CVC ↔ imagerie", "Électricité ↔ biomédical", "Informatique ↔ imagerie", "Fluides médicaux ↔ anesthésie"];
      var X = ["Prises d'O₂, d'air et de vide au bon endroit", "Charge du plafond pour les bras", "Images vers le PACS et les écrans", "Chaleur dégagée par l'angiographe", "Puissance et alimentation secourue des appareils"];
      var pa = ARCHI.paires({ g: n.g, gauche: D, droite: X, bon: [1, 3, 4, 2, 0], xg: 20, wg: 270, xd: 330, wd: 330, y0: 60, h: 88, pas: 106, taille: 16, tailleD: 15,
        erreur: j.erreur, info: j.info,
        fin: function () { j.bravo("Cinq interfaces à coordonner dès la conception."); j.suite(); } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Bras plafonnier et arceau", jouer: function (j, n) {
      n.mode = "bras"; n.bras = 30; n.libre = true; n.dessin();
      j.titre("Le bras plafonnier et l'arceau se partagent l'espace au-dessus de la table. Oriente le bras hors de la zone de rotation de l'arceau.");
      var c = j.curseur({ nom: "Bras", min: -30, max: 120, pas: 5, val: 30, unite: "°", change: function (v) {
        if (!n.libre) return;
        n.bras = v; n.dessin();
        var p = [160 + 170 * Math.cos(v * Math.PI / 180), 140 + 170 * Math.sin(v * Math.PI / 180)];
        if (Math.hypot(p[0] - 340, p[1] - 300) >= 150) fini();
      } });
      function fini() {
        n.libre = false;
        j.bravo("Plus de collision possible avec l'arceau.");
        j.expliquer("<p>Risques d'une mauvaise coordination : collision entre bras et arceau, positions d'imagerie impossibles, câbles et tuyaux tirés, plafond non dimensionné pour la charge. D'où une étude commune de l'implantation, avec le fournisseur d'imagerie et l'ingénieur biomédical.</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(100); n.bras = 100; n.dessin(); fini(); });
    } },
    { nom: "La réception technique", jouer: function (j, n) {
      j.titre("À la réception technique de la salle hybride, laquelle de ces vérifications est superflue ?");
      j.choix([
        { html: "Contrôle réglementaire de la radioprotection", aide: "Elle est indispensable : la salle émet des rayons X." },
        { html: "Essais de sécurité et conformité des équipements", aide: "Point biomédical de la validation." },
        { html: "Pression différentielle, débits et alarmes CVC", aide: "Point CVC de la validation." },
        { html: "Mesure de la couleur exacte du sol", juste: true }
      ], { colonnes: 2, ok: function () { j.bravo("La couleur du sol n'est pas un critère de réception technique."); j.suite(); } });
    } }
  ]
});
