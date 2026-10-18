/* Boss du chapitre 1 : le système d'information de radiologie (SIR) vu sous tous les angles du chapitre. */
NIVEAU(SIS.rejouable({
  id: "boss-si",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.VUES = [
      { t: "Vue métier", coul: C.v, pale: C.vPale }, { t: "Vue fonctionnelle", coul: C.acc, pale: C.accPale },
      { t: "Vue application", coul: C.turq, pale: C.turqPale }, { t: "Vue technique", coul: C.brun, pale: C.brunPale }
    ];
    return n;
  },
  etapes: [
    { nom: "Le chemin d'une image", jouer: function (j, n) {
      j.titre("Une image de scanner traverse le SIR. Relie chaque moment à son verbe.");
      var p = SIS.paires({
        g: n.g, gauche: ["Le scanner acquiert les coupes", "Les images partent vers le serveur d'images", "Elles sont gardées 20 ans", "Le logiciel reconstruit une vue 3D", "Le chirurgien les ouvre au bloc"],
        droite: ["Stockage", "Diffusion", "Production", "Traitement", "Transport"],
        bon: [2, 4, 0, 3, 1],
        xg: 16, wg: 380, xd: 456, wd: 208, y0: 50, h: 84, pas: 104, taille: 16, tailleD: 18,
        erreur: j.erreur, info: j.info,
        aide: function () { return "Demande-toi ce qui arrive à l'image à ce moment : naît-elle, bouge-t-elle, dort-elle, change-t-elle, est-elle montrée ?"; },
        fin: function () { j.bravo("Production, transport, stockage, traitement, diffusion."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Les quatre vues du SIR", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque élément du service de radiologie dans sa vue.");
      var t = A.trier({
        g: n.g,
        cartes: [{ t: "Le manipulateur planifie, le radiologue valide", bac: 1 }, { t: "Le serveur d'images et ses disques", bac: 3 }, { t: "Demande d'examen → réalisation → compte rendu", bac: 0 }, { t: "Le logiciel de dictée du compte rendu", bac: 2 }],
        bacs: n.VUES.map(function (v) { return { t: v.t }; }),
        pos: A.grille(4, 2, 20, 30, 640, 96, 18),
        bacsPos: function (k) { return { x: 20 + (k % 2) * 330, y: 290 + Math.floor(k / 2) * 150, w: 310, h: 130 }; },
        couleurs: function (k) { return n.VUES[k]; },
        dessinBac: function (g2, k, faux) { var r = { x: 20 + (k % 2) * 330, y: 290 + Math.floor(k / 2) * 150 }, v = n.VUES[k]; A.boite(g2, r.x, r.y, 310, 130, { fond: faux ? A.C.koPale : v.pale, bord: faux ? A.C.ko : v.coul, ep: 3, titre: v.t, taille: 19, coul: v.coul }); },
        erreur: j.erreur, info: j.info,
        aide: function () { return "Processus (métier), organisation (fonctionnelle), composants logiciels (application), infrastructure (technique)."; },
        fin: function () { j.bravo("Organisation, infrastructure, processus, composant."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Trois étages", jouer: function (j, n) {
      var A = SIS;
      var COUL = [{ coul: A.C.turq, pale: A.C.turqPale }, { coul: A.C.acc, pale: A.C.accPale }, { coul: A.C.v, pale: A.C.vPale }];
      j.titre("Le scanner produit ces trois éléments. Range-les dans la pyramide.");
      var t = A.trier({
        g: n.g,
        cartes: [{ t: "Image du thorax de Mme Kabbaj, 12 mars, coupe 40", bac: 1 }, { t: "Une opacité de cette forme évoque une pneumonie", bac: 2 }, { t: "Valeurs de gris des pixels : 812, 790, 805...", bac: 0 }],
        bacs: [{ t: "Données" }, { t: "Informations" }, { t: "Connaissance" }],
        pos: function (i) { return { x: 20, y: 40 + i * 150, w: 300, h: 120 }; },
        bacsPos: function (k) { return { x: 360, y: 40 + (2 - k) * 150, w: 300, h: 120 }; },
        couleurs: function (k) { return COUL[k]; },
        dessinBac: function (g2, k, faux) { var c = COUL[k]; A.boite(g2, 360, 40 + (2 - k) * 150, 300, 120, { fond: faux ? A.C.koPale : c.pale, bord: faux ? A.C.ko : c.coul, ep: 3, titre: ["Données", "Informations", "Connaissance"][k], taille: 20, coul: c.coul }); },
        erreur: j.erreur, info: j.info,
        aide: function () { return "Fait brut sans sens, puis donnée organisée qui a un sens, puis interprétation qui sert à décider."; },
        fin: function () { j.bravo("Pixels : données. Image identifiée : information. Interprétation : connaissance."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le SIR, c'est le logiciel ?", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.boite(n.g, 60, 200, 560, 160, { titre: "« Notre SIR, c'est le logiciel qu'on a acheté. »", sous: "le chef du service de radiologie", taille: 24, fond: SIS.C.fond, bord: SIS.C.trait });
      j.titre("Le chef de service résume ainsi le SIR. Qu'oublie-t-il ?");
      j.choix([
        { html: "Rien : un SI est un logiciel", aide: "Relis la définition du SI : quatre sortes d'éléments, pas une seule." },
        { html: "Le personnel, le matériel et l'organisation qui produisent et font circuler l'information", juste: true },
        { html: "Seulement le serveur qui fait tourner le logiciel", aide: "Le serveur n'est qu'un morceau de ce qui manque. Et les manipulateurs, les radiologues, les procédures ?" }
      ], { colonnes: 1, ok: function () { j.bravo("Personnel, matériel, logiciel et organisation : les quatre font le SI."); j.suite(); } });
    } }
  ]
}));
