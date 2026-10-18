/* Niveau : SSPI (diapo 53), relation bloc – réanimation (diapo 54), relation bloc – imagerie (diapo 55). */
NIVEAU(ARCHI.rejouable({
  id: "bloc-et-services",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "surveillance", g: g, route: null, sspi: null, pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      var Z = A.ZONES;
      if (n.mode === "place") {
        A.texte(g, "Niveau 1", [40, 70], { taille: 15, coul: C.doux, ancre: "start" });
        A.boite(g, 30, 90, 380, 200, { titre: "Bloc opératoire", fond: Z.restreinte.fond, bord: Z.restreinte.bord, taille: 20 });
        A.boite(g, 430, 90, 220, 200, { titre: n.sspi === "a" ? "SSPI" : "A", fond: n.sspi === "a" ? C.okPale : "#fff", bord: n.sspi === "a" ? C.ok : C.gris, tirets: n.sspi === "a" ? null : "9 7", taille: n.sspi === "a" ? 20 : 30, coul: n.sspi === "a" ? C.encre : C.gris });
        A.cible(g, 430, 90, 220, 200, function () { if (n.surSspi) n.surSspi("a"); });
        A.s("line", { x1: 20, y1: 330, x2: 660, y2: 330, stroke: C.encre, "stroke-width": 3 }, g);
        A.texte(g, "Niveau 2", [40, 360], { taille: 15, coul: C.doux, ancre: "start" });
        A.boite(g, 30, 380, 380, 200, { titre: "Hospitalisation", taille: 20 });
        A.boite(g, 430, 380, 220, 200, { titre: n.sspi === "b" ? "SSPI" : "B", fond: n.sspi === "b" ? C.koPale : "#fff", bord: n.sspi === "b" ? C.ko : C.gris, tirets: n.sspi === "b" ? null : "9 7", taille: n.sspi === "b" ? 20 : 30, coul: n.sspi === "b" ? C.encre : C.gris });
        A.cible(g, 430, 380, 220, 200, function () { if (n.surSspi) n.surSspi("b"); });
        if (n.sspi === "a") A.fleche(g, [412, 190], [428, 190], { coul: C.ok, ep: 6 });
      } else if (n.mode === "routes") {
        A.boite(g, 24, 70, 210, 140, { titre: "Bloc opératoire", fond: Z.restreinte.fond, bord: Z.restreinte.bord, taille: 18 });
        A.boite(g, 24, 250, 210, 90, { titre: "SSPI", fond: Z.semi.fond, bord: Z.semi.bord });
        A.boite(g, 446, 440, 210, 140, { titre: "Réanimation", taille: 18 });
        A.boite(g, 300, 70, 180, 120, { titre: "Hall public", fond: Z.publique.fond, bord: Z.publique.bord });
        A.boite(g, 540, 130, 116, 90, { titre: "Ascenseur", sous: "étage −1", taille: 15, fond: "#fff", bord: C.gris });
        A.boite(g, 540, 250, 116, 90, { titre: "Ascenseur", sous: "retour", taille: 15, fond: "#fff", bord: C.gris });
        A.fleche(g, [129, 212], [129, 248], { coul: C.encre, ep: 4 });
        var R = {
          a: [[234, 300], [300, 300], [390, 192], [390, 300], [550, 438]],
          b: [[234, 315], [520, 315], [540, 220], [600, 222], [600, 248], [600, 342], [560, 438]],
          c: [[129, 342], [129, 510], [444, 510]]
        };
        ["a", "b", "c"].forEach(function (k) {
          var sel = n.route === k, ok = sel && k === "c";
          A.chemin(g, R[k], { coul: ok ? C.ok : sel ? C.ko : C.gris, ep: sel ? 6 : 3.5, tirets: sel ? null : "9 7" });
        });
        [["a", [340, 250]], ["b", [470, 330]], ["c", [290, 510]]].forEach(function (l) {
          var sel = n.route === l[0];
          A.s("circle", { cx: l[1][0], cy: l[1][1], r: 21, fill: sel ? (l[0] === "c" ? C.ok : C.ko) : "#fff", stroke: sel ? "#fff" : C.encre, "stroke-width": 3 }, g);
          A.texte(g, l[0].toUpperCase(), l[1], { taille: 17, coul: sel ? "#fff" : C.encre, halo: false, gras: 800 });
          A.cible(g, l[1][0] - 34, l[1][1] - 34, 68, 68, function () { if (n.surRoute) n.surRoute(l[0]); });
        });
      } else if (n.mode === "imagerie") {
        var L = ["Bloc opératoire", "Imagerie", "Réanimation", "SSPI"], cs = [Z.restreinte.bord, C.v, C.encre, Z.semi.bord];
        A.texte(g, "Un enchaînement possible (cours)", [340, 70], { taille: 17, coul: C.doux });
        L.forEach(function (t, i) {
          A.boite(g, 200, 100 + i * 120, 280, 76, { titre: t, bord: cs[i], ep: 3, taille: 19 });
          if (i < 3) A.fleche(g, [340, 178 + i * 120], [340, 218 + i * 120], { coul: C.gris, ep: 4 });
        });
      } else {
        // moniteur de SSPI : quatre signes
        A.boite(g, 60, 60, 560, 110, { fond: C.encre, bord: C.encre, rx: 18 });
        A.s("path", { d: "M90 115 H200 L220 80 L240 150 L260 100 L275 115 H360 L380 85 L400 140 L415 115 H590", fill: "none", stroke: "#3ddc97", "stroke-width": 4, "stroke-linejoin": "round" }, g);
        A.texte(g, "SSPI : salle de surveillance post-interventionnelle", [340, 200], { taille: 17, coul: C.doux });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Ce que surveille la SSPI", jouer: function (j, n) {
      j.titre("Au réveil, l'équipe de SSPI observe quatre signes chez un patient. Relie chaque signe à la surveillance qui le repère.");
      var S = ["Il respire lentement, saturation en baisse", "Sa tension chute, son pouls s'accélère", "Il est confus et ne répond pas aux questions", "Il grimace et se plaint de son ventre"];
      var P = ["Gestion de la douleur", "Surveillance respiratoire", "Surveillance neurologique", "Surveillance cardiovasculaire"];
      var pa = ARCHI.paires({ g: n.g, gauche: S, droite: P, bon: [1, 3, 2, 0], xg: 20, wg: 360, xd: 430, wd: 230, y0: 228, h: 76, pas: 92, taille: 15,
        erreur: j.erreur, info: j.info, fond: function () { n.dessin(); },
        aide: function (i) { return ["La saturation et le rythme de la respiration.", "Le cœur et les vaisseaux.", "Le cerveau, la conscience.", "Ce que le patient ressent."][i]; },
        fin: function () {
          j.bravo("Respiratoire, cardiovasculaire, neurologique, douleur.");
          j.expliquer("<p>La <b>salle de surveillance post-interventionnelle (SSPI)</b> est une composante essentielle du bloc. Elle permet la surveillance respiratoire, cardiovasculaire, neurologique, la gestion de la douleur et la surveillance après anesthésie.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Où placer la SSPI ?", jouer: function (j, n) {
      n.mode = "place"; n.dessin();
      j.titre("Où places-tu la SSPI ? Touche A ou B.");
      n.surSspi = function (k) {
        n.sspi = k; n.dessin();
        if (k === "b") { j.erreur("Le patient qui se réveille d'une anesthésie ferait un trajet d'étage en ascenseur : trop loin, trop risqué."); return; }
        n.surSspi = null;
        j.bravo("Juste à côté du bloc.", [540, 190]);
        j.expliquer("<p>La SSPI doit être située à <b>proximité immédiate du bloc</b> et disposer des équipements nécessaires à la surveillance et à la prise en charge des patients.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surSspi) n.surSspi("a"); });
    } },
    { nom: "Vers la réanimation", jouer: function (j, n) {
      n.mode = "routes"; n.route = null; n.dessin();
      j.titre("Un patient doit aller du bloc à la réanimation, en passant par la SSPI. Trois trajets sont possibles : lequel respecte le cours ?");
      n.surRoute = function (k) {
        n.route = k; n.dessin();
        if (k === "a") { j.erreur("Ce trajet coupe le hall public : il croise les flux publics."); return; }
        if (k === "b") { j.erreur("Ce trajet enchaîne deux ascenseurs : le cours demande de limiter les ascenseurs multiples."); return; }
        n.surRoute = null;
        j.bravo("Court, direct, sans ascenseur ni public.");
        j.expliquer("<p>L'architecture doit faciliter le transfert <b>bloc → SSPI → réanimation</b>, et inversement <b>réanimation → bloc</b>. Il faut limiter la distance, les obstacles, les ascenseurs multiples et les croisements avec les flux publics.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surRoute) n.surRoute("c"); });
    } },
    { nom: "Et l'imagerie ?", jouer: function (j, n) {
      n.mode = "imagerie"; n.dessin();
      j.titre("Pour laquelle de ces situations la relation bloc – imagerie est-elle particulièrement importante, d'après le cours ?");
      j.choix([
        { html: "Un polytraumatisé à opérer en urgence", juste: true },
        { html: "Une consultation de suivi à six mois", aide: "Une consultation ne se fait pas au bloc. Cherche une situation chirurgicale où l'image guide le geste ou le bilan." },
        { html: "Un repas servi en hospitalisation", aide: "Rien à voir avec le bloc. Cherche une activité chirurgicale." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La traumatologie en fait partie.");
        j.expliquer("<p>La relation bloc – imagerie est particulièrement importante pour la <b>traumatologie</b>, la <b>neurochirurgie</b>, la <b>chirurgie vasculaire</b>, la <b>chirurgie hybride</b> et les <b>interventions guidées par l'image</b>. Le cours montre un enchaînement possible : bloc opératoire, imagerie, réanimation, SSPI.</p>");
        j.suite();
      } });
    } }
  ]
}));
