/* Niveau : logiciels système et métiers, progiciel ou spécifique, qualité logicielle (S1S2, diapos 24 à 26). */
NIVEAU(SIS.rejouable({
  id: "logiciels",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    // Matrice « progiciel ou spécifique » : lignes (enjeu), colonnes (taille du sujet)
    n.X = [150, 327, 504, 680]; n.Y = [180, 300, 420, 540];
    n.LIG = ["Stratégique", "Normé", "Autre"];
    n.COL = [["Sujet énorme", "plusieurs années de budget DSI"], ["Gros sujet", "un an de budget DSI"], ["Petit sujet", "moins de 20 % du budget annuel DSI"]];
    // région de chaque case (ligne, colonne)
    n.REG = [[0, 1, 1], [2, 2, 3], [2, 3, 3]];
    n.ZONES_REG = [
      { t: "Investissement stratégique ou partenariat avec un éditeur de progiciel", fond: C.encre, coul: "#fff" },
      { t: "Développement spécifique", fond: C.accPale, bord: C.acc, coul: C.acc },
      { t: "Progiciel", fond: C.vPale, bord: C.v, coul: C.v },
      { t: "Progiciel économique ou développement spécifique", fond: C.turqPale, bord: C.turq, coul: C.turq }
    ];
    n.matrice = function (g2, etat, bon) {
      n.COL.forEach(function (c, k) { A.boite(g2, n.X[k] + 4, 70, n.X[k + 1] - n.X[k] - 8, 100, { titre: c[0], sous: c[1], taille: 17, ep: 0, fond: "#fff" }); });
      n.LIG.forEach(function (l, i) { A.texte(g2, l, [76, (n.Y[i] + n.Y[i + 1]) / 2], { taille: 18, gras: 700, halo: false }); });
      n.REG.forEach(function (ligne, i) { ligne.forEach(function (r, k) {
        var z = n.ZONES_REG[r], f = etat && etat.faux === i * 3 + k, ok = etat && etat.trouve[i * 3 + k];
        A.s("rect", { x: n.X[k], y: n.Y[i], width: n.X[k + 1] - n.X[k], height: n.Y[i + 1] - n.Y[i], fill: f ? C.koPale : z.fond, stroke: "#fff", "stroke-width": 3 }, g2);
        if (ok) A.s("rect", { x: n.X[k] + 4, y: n.Y[i] + 4, width: n.X[k + 1] - n.X[k] - 8, height: n.Y[i + 1] - n.Y[i] - 8, fill: "none", stroke: C.ok, "stroke-width": 6, rx: 6 }, g2);
      }); });
      // textes des régions, une fois par région, sur leur case principale
      [[0, 0, 0, 1], [1, 0, 1, 2], [2, 1, 0, 2], [3, 2, 1, 2]].forEach(function (q) {
        var z = n.ZONES_REG[q[0]], i = q[1], k0 = q[2], k1 = q[3];
        A.texte(g2, z.t, [(n.X[k0] + n.X[k1 + 1]) / 2, (n.Y[i] + n.Y[i + 1]) / 2], { taille: q[0] === 0 ? 14 : 17, gras: 700, coul: z.coul, halo: false, largeur: n.X[k1 + 1] - n.X[k0] - 16 });
      });
      A.texte(g2, "Progiciel", [(n.X[0] + n.X[1]) / 2, (n.Y[2] + n.Y[3]) / 2], { taille: 17, gras: 700, coul: C.v, halo: false });
      A.texte(g2, n.ZONES_REG[3].t, [(n.X[2] + n.X[3]) / 2, (n.Y[1] + n.Y[2]) / 2], { taille: 14, gras: 700, coul: C.turq, halo: false, largeur: n.X[3] - n.X[2] - 16 });
    };
    n.cas = function (j, titre, bonne, aide, bravo, expl) {
      j.titre(titre);
      var zones = [];
      for (var i = 0; i < 3; i++) for (var k = 0; k < 3; k++) zones.push({ x: n.X[k], y: n.Y[i], w: n.X[k + 1] - n.X[k], h: n.Y[i + 1] - n.Y[i], bon: i * 3 + k === bonne });
      var r = A.reperer({ g: n.g, zones: zones, dessiner: function (g2, e) { n.matrice(g2, e); }, erreur: j.erreur, aide: aide,
        fin: function () { j.bravo(bravo); if (expl) j.expliquer(expl); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    };
    return n;
  },
  etapes: [
    { nom: "Système ou métier ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque logiciel de l'hôpital : logiciel système, ou logiciel d'application métier ?");
      var cartes = [{ t: "Linux", bac: 0 }, { t: "ERP SAP pour les achats", bac: 1 }, { t: "Hyperviseur VMware", bac: 0 }, { t: "CRM pour les relations patients", bac: 1 }, { t: "NTFS (système de fichiers)", bac: 0 }, { t: "DPI développé en Java", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Logiciels système", sous: "font tourner la machine" }, { t: "Applications métiers", sous: "servent le travail de l'hôpital" }],
        pos: A.grille(6, 2, 20, 20, 640, 80, 14),
        bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 220 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Ce logiciel ne sert aucun métier en particulier : il fait fonctionner l'ordinateur ou ses disques." : "Ce logiciel sert directement une activité de l'hôpital (achats, patients, soins)."; },
        fin: function () {
          j.bravo("Système : Linux, VMware, NTFS. Métier : ERP, CRM, développement spécifique.");
          j.expliquer("<p>Un <b>ERP</b> (Enterprise Resource Planning) est un progiciel de gestion intégré (PGI), comme SAP ou odoo. Un <b>CRM</b> gère la relation client. Le <b>développement spécifique</b> (Java, C#, PHP, .NET) est écrit pour l'organisation elle-même.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La paie", jouer: function (j, n) {
      n.cas(j, "La paie du personnel suit des règles légales identiques partout : le domaine est normé. Le projet coûte environ un an de budget DSI. Touche la case du tableau qui convient.", 4,
        function (i) { var l = Math.floor(i / 3), k = i % 3; return l !== 1 ? "Regarde d'abord la ligne : la paie est un domaine normé." : "La bonne ligne. Maintenant la colonne : un an de budget DSI."; },
        "Normé et gros sujet : progiciel.",
        "<p>Dans un domaine normé, tout le monde a les mêmes règles : un <b>progiciel</b> du marché les applique déjà. Le redévelopper coûterait cher pour rien.</p>");
    } },
    { nom: "L'outil maison", jouer: function (j, n) {
      n.cas(j, "L'hôpital veut un outil d'orientation des patients propre à sa stratégie, qui ne coûtera que 10 % du budget annuel de la DSI. Touche la case.", 2,
        function (i) { var l = Math.floor(i / 3), k = i % 3; return l !== 0 ? "L'outil est propre à la stratégie de l'hôpital : quelle ligne ?" : "10 % du budget annuel : c'est moins de 20 %. Quelle colonne ?"; },
        "Stratégique et petit sujet : développement spécifique.",
        "<p>Ce qui fait la différence stratégique de l'hôpital n'existe pas sur étagère : on le développe. Quand le sujet devient énorme, le cours conseille plutôt un investissement stratégique ou un partenariat avec un éditeur.</p>");
    } },
    { nom: "Critères de qualité", jouer: function (j, n) {
      var A = SIS;
      j.titre("Cinq plaintes sur un logiciel en développement. Relie chacune au critère de qualité qu'elle met en défaut.");
      var p = A.paires({
        g: n.g, gauche: ["Le service a besoin des séjours ambulatoires : le logiciel ne les gère pas", "Les écrans sont si confus que les infirmières se trompent de case", "Ajouter un nouveau service oblige à tout reprogrammer", "Corriger un bug prend des mois : le code est illisible", "Un utilisateur voit les dossiers d'un autre service"],
        droite: ["Ergonomie", "Sécurité d'usage", "Maintenabilité", "Conformité aux besoins", "Flexibilité"],
        bon: [3, 0, 4, 2, 1],
        xg: 10, wg: 400, xd: 470, wd: 200, y0: 30, h: 100, pas: 112, taille: 15, tailleD: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le logiciel ne fait pas ce qu'on attend de lui.", "Facilité d'emploi.", "Capacité à s'adapter à un changement.", "Facilité à corriger et faire évoluer le code.", "Intégrité, confidentialité, disponibilité."][i]; },
        fin: function () {
          j.bravo("Conformité, ergonomie, flexibilité, maintenabilité, sécurité d'usage.");
          j.expliquer("<p>La <b>sécurité d'usage</b> regroupe l'intégrité, la confidentialité et la disponibilité : les trois critères qu'on retrouvera pour les données de santé et en cybersécurité.</p>");
          j.suite();
        }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Le cycle qualité", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      var P = { aq: [470, 160], dev: [210, 300], t: [470, 440] };
      A.s("circle", { cx: P.aq[0], cy: P.aq[1], r: 80, fill: C.jeuPale, stroke: C.jeu, "stroke-width": 3 }, n.g); A.texte(n.g, "Assurance qualité", P.aq, { taille: 17, gras: 700, largeur: 130 });
      A.s("circle", { cx: P.dev[0], cy: P.dev[1], r: 80, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, n.g); A.texte(n.g, "Dévelop-pement", P.dev, { taille: 17, gras: 700, largeur: 120 });
      A.s("circle", { cx: P.t[0], cy: P.t[1], r: 80, fill: C.jeuPale, stroke: C.jeu, "stroke-width": 3 }, n.g); A.texte(n.g, "Tests", P.t, { taille: 17, gras: 700 });
      A.fleche(n.g, [395, 205], [285, 262], { ep: 4 }); A.texte(n.g, "améliore", [320, 205], { taille: 15, coul: C.doux });
      A.fleche(n.g, [285, 340], [395, 400], { ep: 4 }); A.texte(n.g, "alimente", [320, 400], { taille: 15, coul: C.doux });
      A.fleche(n.g, [470, 358], [470, 242], { ep: 4 }); A.texte(n.g, "?", [500, 300], { taille: 26, gras: 800, coul: C.acc });
      j.titre("Les tests trouvent un défaut dans le module de prescription. Dans le cycle du cours, que font-ils de ce constat ?");
      j.choix([
        { html: "Ils le rapportent à l'assurance qualité", juste: true },
        { html: "Ils le corrigent eux-mêmes dans le code", aide: "Suis les flèches : les tests ne pointent pas vers le développement." },
        { html: "Ils l'ignorent tant que le logiciel démarre", aide: "Un défaut trouvé doit remonter quelque part pour être corrigé." }
      ], { colonnes: 1, ok: function () { j.bravo("Tests → rapporte → assurance qualité → améliore → développement → alimente → tests."); j.suite(); } });
    } }
  ]
}));
