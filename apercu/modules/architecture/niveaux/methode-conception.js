/* Niveau : méthode de conception en dix étapes (diapos 67 à 69), validation technique avant ouverture (diapo 70). */
NIVEAU(ARCHI.rejouable({
  id: "methode-conception",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.ETAPES = ["Analyse des besoins", "Programme fonctionnel", "Analyse des flux", "Zonage", "Architecture", "CVC", "Électricité", "Fluides médicaux", "Implantation biomédicale", "Validation"];
    // emplacements dispersés (deux colonnes de cinq), pour que l'ordre ne se lise pas sur la figure
    var PLACE = [6, 2, 9, 0, 4, 7, 1, 8, 3, 5];
    n.noeuds = n.ETAPES.map(function (t, i) { var k = PLACE[i]; return { t: t, x: 30 + (k % 2) * 330, y: 50 + Math.floor(k / 2) * 106, w: 290, h: 74 }; });
    n.validation = function () {
      A.vider(g); fig.chip(null);
      var V = [["CVC", "#7cb7d8"], ["Électricité", "#f0a85a"], ["Gaz médicaux", "#7fc8a0"], ["Biomédical", "#b59ad8"], ["Hygiène", "#e88ea4"]];
      A.texte(g, "Validation technique avant ouverture", [340, 50], { taille: 18, gras: 800 });
      V.forEach(function (v, i) {
        A.boite(g, 20 + i * 130, 90, 120, 60, { fond: v[1], bord: v[1], rx: 10, titre: v[0], taille: 15 });
        A.s("rect", { x: 20 + i * 130, y: 160, width: 120, height: 380, rx: 10, fill: "#fff", stroke: v[1], "stroke-width": 2.5 }, g);
      });
      (n.verifs || []).forEach(function (v) {
        A.texte(g, v[0], [80 + v[1] * 130, 190 + v[2] * 44], { taille: 13, largeur: 110, halo: false });
      });
    };
    return n;
  },
  etapes: [
    { nom: "Les dix étapes", jouer: function (j, n) {
      j.titre("La conception d'un bloc suit dix étapes. Touche-les dans l'ordre.");
      j.consigne("Indice : on part du besoin, on finit par la validation.");
      var t = ARCHI.trace({ g: n.g, noeuds: n.noeuds, ordre: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], coul: ARCHI.C.jeu, taille: 17,
        erreur: j.erreur,
        aide: function (i, att, k) {
          if (k === 0) return "Avant tout dessin, on mesure le besoin : nombre de salles, spécialités, interventions.";
          if (k < 4) return "Après le besoin : définir les locaux, analyser les flux, puis zoner. Les réseaux viennent après l'architecture.";
          if (k === 4) return "Une fois le zonage fait, on peut dessiner : surfaces, dimensions, portes.";
          if (k < 8) return "Les réseaux techniques : l'air d'abord, puis l'électricité, puis les fluides médicaux.";
          return "Il reste à placer les équipements, puis à tout vérifier.";
        },
        fin: function () {
          // remise en ordre : première colonne de haut en bas, seconde de bas en haut
          n.noeuds.forEach(function (nd, i) { nd.x = 30 + (i < 5 ? 0 : 330); nd.y = 50 + (i < 5 ? i : 9 - i) * 106; });
          t.dessiner();
          j.bravo("Besoins, programme, flux, zonage, architecture, CVC, électricité, fluides, implantation biomédicale, validation.");
          j.expliquer("<p>Cet ordre résume tout le cours : le programme fonctionnel et technique avant le plan, les flux avant les murs, les réseaux avant de fermer les plafonds, les équipements définis avant la mise en service.</p>");
          j.suite();
        } });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Ce que contient chaque étape", jouer: function (j, n) {
      ARCHI.vider(n.g);
      j.titre("Relie chaque étape à son contenu.");
      var E1 = ["Analyse des besoins", "Programme fonctionnel", "Zonage", "CVC", "Implantation biomédicale"];
      var Ct = ["Public, semi-restreint, restreint", "Définir les équipements et leurs contraintes", "Nombre de salles, spécialités, interventions, horaires", "Débit, filtration, pression, température, humidité, renouvellement", "Définir tous les locaux"];
      var pa = ARCHI.paires({ g: n.g, gauche: E1, droite: Ct, bon: [2, 4, 0, 3, 1], xg: 20, wg: 240, xd: 300, wd: 360, y0: 60, h: 92, pas: 106, taille: 16, tailleD: 15,
        erreur: j.erreur, info: j.info,
        fin: function () { j.bravo("Chaque étape a son contenu précis."); j.suite(); } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Les travaux sont finis", jouer: function (j, n) {
      n.verifs = []; n.validation();
      j.titre("Les travaux sont terminés. Le bloc peut-il ouvrir ? Range d'abord ces vérifications dans leur domaine.");
      var res = j.zone("", "");
      var S = [["Pression différentielle", "cvc"], ["Équipotentialité", "elec"], ["Étanchéité", "gaz"], ["Essais de sécurité", "bio"], ["Procédures", "hyg"], ["Alimentation de secours", "elec"], ["Identification des prises", "gaz"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 160px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "gaz", html: "Gaz médicaux" }, { id: "elec", html: "Électricité" }, { id: "hyg", html: "Hygiène" }, { id: "cvc", html: "CVC" }, { id: "bio", html: "Biomédical" }, { id: "elec", html: "Électricité" }, { id: "gaz", html: "Gaz médicaux" }],
        aide: "La pression d'air relève de la CVC ; l'équipotentialité et le secours, de l'électricité ; l'étanchéité et l'identification, des gaz ; les essais de sécurité, du biomédical ; les procédures, de l'hygiène.",
        ok: function () {
          var col = { cvc: 0, elec: 1, gaz: 2, bio: 3, hyg: 4 }, k = [0, 0, 0, 0, 0];
          n.verifs = S.map(function (x) { var c = col[x[1]]; return [x[0], c, k[c]++]; });
          n.validation();
          j.bravo("Il faut tout vérifier avant d'ouvrir.");
          j.expliquer("<p>Un bloc ne doit pas être considéré comme prêt simplement parce que les travaux sont terminés. Il faut vérifier notamment : <b>CVC</b> (température, humidité, débits, renouvellement d'air, pression différentielle, filtration, alarmes), <b>électricité</b> (continuité, terre, équipotentialité, alimentation de secours, essais des circuits), <b>gaz médicaux</b> (pression, qualité, identification, alarmes, étanchéité), <b>biomédical</b> (réception, conformité, essais de sécurité, intégration, formation), <b>hygiène</b> (surfaces, nettoyage, flux, procédures, validation).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Qui impliquer, et quand ?", jouer: function (j, n) {
      j.titre("Sur quoi les recommandations professionnelles récentes insistent-elles particulièrement ?");
      j.choix([
        { html: "Impliquer l'équipe de prévention des infections dès la conception, et valider avant la première utilisation", juste: true },
        { html: "Appeler l'équipe d'hygiène après le premier incident", aide: "Trop tard : le cours parle de la conception." },
        { html: "Ouvrir d'abord, valider pendant la première année", aide: "La validation vient avant la première utilisation." }
      ], { colonnes: 1, ok: function () { j.bravo("Dès la conception, et validation avant la première utilisation."); j.suite(); } });
    } }
  ]
}));
