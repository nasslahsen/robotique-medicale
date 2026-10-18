/* Boss du chapitre 3 : concevoir une salle hybride pour l'angiographie (surface, volume, portes, radioprotection, ergonomie). */
NIVEAU({
  id: "boss-salle",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { l: null, ecran: null, pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      var u = 56, L = 8.4, l = n.l || 5.6, w = L * u, h = l * u, x0 = 340 - w / 2, y0 = 320 - h / 2;
      A.s("rect", { x: x0, y: y0, width: w, height: h, fill: n.l ? C.okPale : "#fff", stroke: C.encre, "stroke-width": 6 }, g);
      A.texte(g, "8,40 m (trame du bâtiment)", [340, y0 - 20], { taille: 16, mono: true });
      A.texte(g, n.l ? String(n.l.toFixed(2)).replace(".", ",") + " m" : "largeur ?", [x0 + 10, 320], { taille: 16, mono: true, ancre: "start" });
      A.s("rect", { x: 310, y: 230, width: 60, height: 180, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
      A.s("path", { d: "M270 280 A70 70 0 0 1 410 280", fill: "none", stroke: C.v, "stroke-width": 12, "stroke-linecap": "round" }, g);
      A.icone(g, "personne", [250, 340], 40, C.personnel);
      if (n.ecran) {
        var P = { a: [250, 230], b: [430, 330], c: [140, 330] }[n.ecran];
        A.s("rect", { x: P[0] - 40, y: P[1] - 22, width: 80, height: 44, rx: 4, fill: C.encre }, g);
      }
      A.texte(g, "Salle hybride d'angiographie (exemple ajouté)", [340, 580], { taille: 15, coul: C.doux });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La largeur minimale", jouer: function (j, n) {
      j.titre("La trame du bâtiment impose 8,40 m de longueur libre. Quelle largeur libre minimale faut-il, au centimètre près, pour respecter le FGI 2022 ?");
      j.nombre({ avant: "\\ell_{\\min} =", apres: "\\text{m}", cases: [{ attendu: 6.64, tol: 0.005 }], ligne: true,
        aide: function (k, v) { var x = parseFloat(String(v[0]).replace(",", ".")); return x < 6.635 ? "Avec cette largeur, 8,40 × largeur reste sous 55,74 m². Divise 55,74 par 8,40 et arrondis au centimètre supérieur." : "Divise 55,74 par 8,40 et arrondis au centimètre supérieur : pas plus."; },
        ok: function () {
          n.l = 6.64; n.dessin();
          j.bravo("55,74 / 8,40 = 6,636 : il faut 6,64 m, qui dépasse aussi les 6,10 m.");
          j.suite();
        } });
    } },
    { nom: "Au-dessus du plafond", jouer: function (j, n) {
      j.titre("Lequel de ces éléments n'a pas sa place dans l'espace technique au-dessus du plafond ?");
      j.choix([
        { html: "Les gaines de ventilation", aide: "Elles y vont : la ventilation fait partie de ce que le volume doit loger." },
        { html: "Les supports des bras plafonniers", aide: "Ils y vont : les bras sont suspendus au plafond." },
        { html: "Le pupitre de commande de l'angiographie", juste: true },
        { html: "Les chemins de câbles", aide: "Ils y vont, avec les réseaux médicaux." }
      ], { colonnes: 2, ok: function () { j.bravo("Le pupitre est un poste de travail, pas un réseau."); j.suite(); } });
    } },
    { nom: "La porte", jouer: function (j, n) {
      j.titre("Quelle porte prévois-tu entre la salle et la zone semi-restreinte ?");
      j.choix([
        { html: "Battante à poignée, étroite pour limiter les fuites d'air", aide: "Trop étroite, le lit et l'arceau ne passent pas ; une poignée se touche avec les mains." },
        { html: "Coulissante, automatique, à commande sans contact et fermeture automatique, assez large pour le brancard et les équipements", juste: true },
        { html: "Pas de porte : un rideau plombé suffit", aide: "Sans porte, ni cascade de pression ni protection radiologique fiable." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Large, sans contact, à fermeture automatique.");
        j.expliquer("<p>Cette porte coche tout : passage du brancard et des équipements, nettoyage facile, cascade de pression préservée. Comme la salle a des rayons X, la porte entre aussi dans l'étude de radioprotection.</p>");
        j.suite();
      } });
    } },
    { nom: "Le voisin", jouer: function (j, n) {
      j.titre("Le local voisin est un bureau occupé toute la journée. Comment en tient-on compte ?");
      j.choix([
        { html: "On n'en tient pas compte : seule la salle est concernée", aide: "Les zones adjacentes font partie de ce qu'il faut étudier." },
        { html: "L'étude radiophysique / radioprotection intègre les zones adjacentes pour calculer la protection", juste: true },
        { html: "On double l'épaisseur standard partout", aide: "Le cours refuse l'épaisseur standard : la protection se calcule." }
      ], { colonnes: 1, ok: function () { j.bravo("La protection se calcule, zones adjacentes comprises."); j.suite(); } });
    } },
    { nom: "Les écrans", jouer: function (j, n) {
      j.titre("Où places-tu les écrans d'angiographie ? Touche une position.");
      var P = [["a", 250, 230], ["b", 430, 330], ["c", 140, 330]], cibles = [];
      j.consigne("A : face au chirurgien, au-dessus de la table. B : de l'autre côté de la table, derrière l'arceau. C : dans le dos du chirurgien.");
      var gg = ARCHI.s("g", null, j.fig.svg);
      function poser() {
        ARCHI.vider(gg);
        P.forEach(function (p) {
          if (n.ecran === p[0]) return;
          ARCHI.s("circle", { cx: p[1], cy: p[2], r: 24, fill: "#fff", stroke: ARCHI.C.acc, "stroke-width": 3 }, gg);
          ARCHI.texte(gg, p[0].toUpperCase(), [p[1], p[2]], { taille: 18, coul: ARCHI.C.acc, halo: false, gras: 800 });
          ARCHI.cible(gg, p[1] - 34, p[2] - 34, 68, 68, function () { choisir(p[0]); });
        });
      }
      function choisir(k) {
        n.ecran = k; n.dessin(); poser();
        if (k === "b") { j.erreur("L'arceau et l'équipe se trouvent entre le chirurgien et l'écran : mauvaise visibilité."); return; }
        if (k === "c") { j.erreur("Le chirurgien devrait se retourner à chaque image : mauvaise visibilité, gestes inutiles."); return; }
        ARCHI.vider(gg);
        j.bravo("Dans l'axe du regard du chirurgien.");
        j.expliquer("<p>Ce boss a mobilisé tout le chapitre : surface et dimension minimale de la salle hybride, volume technique, portes, protection radiologique calculée, ergonomie. Chaque choix se justifie par un besoin de l'équipe ou du patient.</p>");
        j.suite();
      }
      poser();
      j.nettoyer(function () { ARCHI.vider(gg); });
      j.reponse(function () { choisir("a"); });
    } }
  ]
});
