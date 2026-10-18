/* Boss du chapitre 4 : une salle en dépression aspire l'air du couloir. Diagnostiquer, régler soufflage et extraction, justifier. */
NIVEAU({
  id: "boss-air",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg), ga = A.s("g", null, fig.svg);
    var n = { s: 2000, e: 2400, u: 0, ouvert: true, libre: true, V: A.calc.volume(7, 6, 3), pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g);
      var Z = A.ZONES, sens = A.calc.sensAir(n.s, n.e);
      A.boite(g, 24, 120, 400, 380, { fond: Z.restreinte.fond, bord: Z.restreinte.bord, ep: 3 });
      A.texte(g, "Salle (126 m³)", [224, 150], { taille: 18, halo: false });
      A.boite(g, 470, 120, 186, 380, { fond: Z.semi.fond, bord: Z.semi.bord, ep: 3 });
      A.texte(g, "Couloir", [563, 150], { taille: 18, halo: false });
      // soufflage au plafond, extraction en bas
      A.s("line", { x1: 120, y1: 126, x2: 330, y2: 126, stroke: C.acc, "stroke-width": 10 }, g);
      A.texte(g, "soufflage " + n.s + " m³/h", [224, 186], { taille: 15, coul: C.acc, halo: false });
      A.s("line", { x1: 32, y1: 420, x2: 32, y2: 490, stroke: C.gris, "stroke-width": 10 }, g);
      A.texte(g, "extraction " + n.e + " m³/h", [48, 470], { taille: 15, coul: C.doux, ancre: "start", halo: false });
      A.s("rect", { x: 418, y: 250, width: 58, height: 110, fill: n.ouvert ? "#fff" : "#c9d3e6" }, g);
      A.texte(g, sens > 0 ? "salle en surpression" : sens < 0 ? "salle en dépression" : "pas d'écart de pression", [224, 540], { taille: 18, gras: 800, coul: sens > 0 ? C.ok : C.ko });
      fig.chip(E.fmt(A.calc.ach(n.s, n.V), 1) + " ACH");
      n.fleches();
    };
    n.fleches = function () {
      A.vider(ga);
      if (!n.ouvert) return;
      var sens = A.calc.sensAir(n.s, n.e);
      if (n.u >= 1) { if (sens) A.fleche(ga, sens > 0 ? [400, 305] : [500, 305], sens > 0 ? [500, 305] : [400, 305], { coul: sens > 0 ? C.ok : C.ko, ep: 7 }); return; }
      if (sens > 0) A.souffle(ga, [400, 305], [500, 305], n.u, { nb: 3, coul: C.ok });
      else if (sens < 0) A.souffle(ga, [500, 305], [400, 305], n.u, { nb: 3, coul: C.ko });
    };
    n.anim = function () { A.animer(2600, function (u) { n.u = u; n.fleches(); }); };
    n.dessin(); n.anim();
    return n;
  },
  etapes: [
    { nom: "Le diagnostic", jouer: function (j, n) {
      j.titre("Dans cette salle, on extrait plus d'air qu'on n'en souffle. Que se passe-t-il quand la porte s'ouvre ?");
      j.consigne("Modèle simplifié : la salle est en surpression quand on y souffle plus d'air qu'on n'en extrait.");
      j.choix([
        { html: "La salle est en dépression : l'air du couloir entre dans la salle", juste: true },
        { html: "Rien : la salle est ventilée, donc protégée", aide: "Ventilée ne veut pas dire en surpression. Compare soufflage et extraction." },
        { html: "L'air sort de la salle", aide: "Il en sortirait si elle était en surpression. Regarde les flèches." }
      ], { colonnes: 1, ok: function () { j.bravo("La cascade est inversée : l'air moins propre vient sur le patient."); j.suite(); } });
    } },
    { nom: "Le réglage", jouer: function (j, n) {
      j.titre("Règle soufflage et extraction : la salle doit être en surpression et viser plus de 22 ACH (HIS 2026).");
      var cS = j.curseur({ nom: "Soufflage", min: 1500, max: 3500, pas: 50, val: n.s, unite: " m³/h", change: function (v) { if (!n.libre) return; n.s = v; n.dessin(); } });
      var cE = j.curseur({ nom: "Extraction", min: 1500, max: 3500, pas: 50, val: n.e, unite: " m³/h", change: function (v) { if (!n.libre) return; n.e = v; n.dessin(); } });
      var bt = E.h("button", "btn bleu", "Ouvrir la porte", j.el); bt.type = "button";
      function gagner() {
        n.libre = false; bt.remove(); n.dessin(); n.anim();
        j.bravo("Surpression et plus de 22 ACH : l'air sort de la salle.");
        j.suite();
      }
      bt.addEventListener("click", function () {
        n.dessin(); n.anim();
        if (n.s <= n.e) { j.erreur("L'air entre encore (ou ne sort pas) : le soufflage doit dépasser l'extraction."); return; }
        if (ARCHI.calc.ach(n.s, n.V) <= 22) { j.erreur("Surpression obtenue, mais " + E.fmt(ARCHI.calc.ach(n.s, n.V), 1) + " ACH : il faut un soufflage supérieur à 22 × 126 = 2 772 m³/h."); return; }
        gagner();
      });
      j.reponse(function () { n.s = 3000; n.e = 2600; cS.regler(3000); cE.regler(2600); gagner(); });
    } },
    { nom: "La porte calée", jouer: function (j, n) {
      j.titre("Malgré le bon réglage, l'équipe cale souvent la porte ouverte. Quelle mesure le cours cite-t-il ?");
      j.choix([
        { html: "Des portes à fermeture automatique entre les zones, pour préserver la cascade de pression", juste: true },
        { html: "Augmenter encore l'extraction", aide: "Plus d'extraction réduirait la surpression : c'est l'inverse de ce qu'on veut." },
        { html: "Retirer la porte", aide: "Sans porte, la cascade de pression ne tient plus." }
      ], { colonnes: 1, ok: function () { j.bravo("Recommandation de la Healthcare Infection Society."); j.suite(); } });
    } },
    { nom: "Les maux de tête", jouer: function (j, n) {
      j.titre("En fin de journée, l'équipe d'anesthésie se plaint de maux de tête. Quel objectif de la ventilation est peut-être mal rempli ?");
      j.choix([
        { html: "Évacuer les gaz anesthésiques", juste: true },
        { html: "Maintenir l'humidité", aide: "L'humidité joue sur la condensation et le confort, pas sur l'exposition aux agents anesthésiques." },
        { html: "Contrôler la contamination particulaire", aide: "Les particules menacent surtout la plaie, pas la tête de l'équipe." }
      ], { colonnes: 1, ok: function () {
        j.bravo("L'évacuation des gaz anesthésiques limite l'exposition professionnelle.");
        j.expliquer("<p>Le chapitre suivant détaille le système d'évacuation des gaz anesthésiques, prévu dès la conception avec ses raccordements, son débit, ses alarmes et sa maintenance.</p>");
        j.suite();
      } });
    } },
    { nom: "Écrire le rapport", jouer: function (j, n) {
      j.titre("Dans ton rapport, comment écris-tu le renouvellement d'air visé ?");
      j.choix([
        { html: "« 22 ACH », sans autre précision", aide: "Un chiffre isolé, sans référentiel : c'est ce que le cours demande d'éviter." },
        { html: "« Plus de 22 ACH, selon les recommandations 2026 de la HIS ; le CDC mentionne environ 15 ACH pour les systèmes conventionnels »", juste: true },
        { html: "« Le plus possible »", aide: "Il faut une valeur, rattachée à son référentiel." }
      ], { colonnes: 1, ok: function () { j.bravo("Un chiffre, toujours avec son référentiel."); j.suite(); } });
    } }
  ]
});
