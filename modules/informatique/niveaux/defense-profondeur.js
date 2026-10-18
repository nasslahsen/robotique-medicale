/* Niveau : contexte et enjeux, rien n'est sécurisé à 100 %, défense en profondeur (cyber, diapo 10). */
NIVEAU(SIS.rejouable({
  id: "defense-profondeur",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, nb: 1 };
    // couches concentriques autour des données ; chaque couche a une faille (ouverture) à un angle différent
    n.R = [250, 185, 120];
    n.FAILLE = [180, 60, 300];
    n.couches = function (g2, nb) {
      var c = [340, 300];
      for (var k = 0; k < nb; k++) {
        var r = n.R[k], a = n.FAILLE[k] * Math.PI / 180, d = 0.2;
        var p1 = [c[0] + r * Math.cos(a + d), c[1] + r * Math.sin(a + d)], p2 = [c[0] + r * Math.cos(a - d + 2 * Math.PI), c[1] + r * Math.sin(a - d + 2 * Math.PI)];
        A.s("path", { d: "M" + p1[0] + " " + p1[1] + " A" + r + " " + r + " 0 1 1 " + p2[0] + " " + p2[1], fill: "none", stroke: A.BACS[k].coul, "stroke-width": 16, "stroke-linecap": "round", opacity: 0.85 }, g2);
        var m = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
        A.texte(g2, "faille " + (k + 1), [m[0], m[1] - 18], { taille: 13, coul: C.ko, gras: 700 });
      }
      A.s("circle", { cx: c[0], cy: c[1], r: 46, fill: C.ko }, g2);
      A.texte(g2, "Données des patients", c, { taille: 13, coul: "#fff", halo: false, gras: 800, largeur: 80 });
      // chemin de l'attaque : passe par chaque faille, contourne entre les couches
      var pts = [[20, 300]];
      for (var k2 = 0; k2 < nb; k2++) {
        var ra = n.R[k2] + 18, rb = n.R[k2] - 18, a2 = n.FAILLE[k2] * Math.PI / 180;
        if (k2 > 0) { var a1 = n.FAILLE[k2 - 1] * Math.PI / 180; for (var t = 1; t <= 8; t++) { var aa = a1 + (a2 - a1 + (a2 < a1 ? 2 * Math.PI : 0)) * t / 8; pts.push([c[0] + ra * Math.cos(aa), c[1] + ra * Math.sin(aa)]); } }
        pts.push([c[0] + ra * Math.cos(a2), c[1] + ra * Math.sin(a2)]); pts.push([c[0] + rb * Math.cos(a2), c[1] + rb * Math.sin(a2)]);
      }
      pts.push([c[0] + 48 * Math.cos(n.FAILLE[nb - 1] * Math.PI / 180), c[1] + 48 * Math.sin(n.FAILLE[nb - 1] * Math.PI / 180)]);
      A.chemin(g2, pts, { coul: "#b07d14", ep: 4, tirets: "12 6" });
      A.icone(g2, "pirate", [40, 260], 44, C.encre);
    };
    return n;
  },
  etapes: [
    { nom: "Une couche", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.couches(n.g, 1);
      j.titre("Une seule couche de protection entoure les données, avec une faille. Combien de failles l'attaquant doit-il exploiter pour atteindre les données ?");
      j.nombre({ cases: [{ attendu: 1 }], aide: function () { return "Suis le trait pointillé : combien de fois traverse-t-il une couche ?"; }, ok: function () { j.bravo("Une seule faille suffit à un attaquant."); j.suite(); } });
    } },
    { nom: "Trois couches", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.couches(n.g, 3);
      j.titre("On ajoute deux couches, chacune avec sa propre faille, à un autre endroit. Combien de failles l'attaquant doit-il maintenant trouver et exploiter ?");
      j.nombre({ cases: [{ attendu: 3 }], aide: function () { return "Une faille par couche traversée."; }, ok: function () {
        j.bravo("Trois failles, à trois endroits différents : plus de travail, plus de temps pour le repérer.");
        j.expliquer("<p>C'est la <b>défense en profondeur</b> : de la <b>sécurité en couches</b>. Aucune couche n'est parfaite, mais l'attaquant doit toutes les franchir.</p>");
        j.suite();
      } });
    } },
    { nom: "Trois piliers", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours donne trois piliers à la défense en profondeur. Range chaque mesure.");
      var cartes = [{ t: "Désactiver SMBv1 et les services inutiles des serveurs", bac: 1 }, { t: "Former les secrétaires à repérer un courriel piégé", bac: 2 }, { t: "Pare-feu, puis réseau séparé pour les DM, puis contrôle d'accès au DPI", bac: 0 }, { t: "Suivre les alertes du maCERT sur les nouvelles failles", bac: 2 }, { t: "Retirer les comptes par défaut d'un échographe", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Sécurité en couches" }, { t: "Durcissement" }, { t: "Veille et sensibilisation" }],
        pos: function (i) { return { x: 10, y: 14 + i * 116, w: 380, h: 100 }; },
        bacsPos: function (k) { return { x: 420, y: 14 + k * 194, w: 250, h: 176 }; },
        taille: 16, tailleBac: 19,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Plusieurs barrières empilées.", "Réduire ce qui peut être attaqué sur une machine.", "Se tenir informé, et former les gens."][b]; },
        fin: function () { j.bravo("Couches, durcissement, veille et sensibilisation."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le mythe", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.boite(n.g, 60, 200, 560, 150, { titre: "« Notre DPI a un mot de passe et un pare-feu : il est sûr. »", taille: 22, fond: SIS.C.fond, bord: SIS.C.trait });
      j.titre("Que répond le cours à cette phrase ?");
      j.choix([
        { html: "C'est le mythe de la sécurité : rien n'est sécurisé à 100 %, il faut plusieurs couches et se préparer à l'incident", juste: true },
        { html: "C'est vrai : deux protections suffisent", aide: "Une seule faille suffit à l'attaquant. Combien de couches faut-il ?" },
        { html: "C'est vrai si le mot de passe est long", aide: "Un bon mot de passe aide, mais aucune mesure seule ne rend sûr à 100 %." }
      ], { colonnes: 1, ok: function () { j.bravo("Rien n'est sécurisé à 100 %."); j.suite(); } });
    } }
  ]
}));
