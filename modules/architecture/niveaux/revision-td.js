/* Révision du chapitre 7 : les idées du TD 1 dans des situations nouvelles. */
NIVEAU({
  id: "revision-td",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.salle = function (V, Q) {
      A.vider(g); fig.chip(null);
      A.s("rect", { x: 160, y: 160, width: 360, height: 240, fill: "#f7f9fc", stroke: C.encre, "stroke-width": 4 }, g);
      A.texte(g, "V = " + V + " m³", [340, 280], { taille: 24, mono: true, gras: 800 });
      A.texte(g, Q, [340, 120], { taille: 20, mono: true, coul: C.acc });
      A.texte(g, "exemple ajouté", [340, 440], { taille: 14, coul: C.doux });
    };
    n.salle(150, "ACH visé : 24");
    return n;
  },
  etapes: [
    { nom: "Un autre débit", jouer: function (j, n) {
      j.titre("Une salle de 150 m³ doit, dans un exercice, atteindre 24 renouvellements par heure. Quel débit faut-il ?");
      j.nombre({ avant: "Q =", apres: "\\text{m}^3/\\text{h}", cases: [{ attendu: 3600, tol: 0.5 }], ligne: true,
        aide: function () { return "Q = ACH × V."; },
        ok: function () { j.bravo("24 × 150 = 3 600 m³/h."); j.suite(); } });
    } },
    { nom: "Un autre taux", jouer: function (j, n) {
      n.salle(150, "débit mesuré : 3 900 m³/h");
      j.titre("Le débit mesuré est de 3 900 m³/h. Quel taux obtient-on ?");
      j.nombre({ avant: "\\text{ACH} =", cases: [{ attendu: 26, tol: 0.01 }], ligne: true,
        aide: function () { return "ACH = débit ÷ volume = 3 900 ÷ 150."; },
        ok: function () {
          j.consigne("La salle est-elle forcément bien ventilée ?");
          j.choix([
            { html: "Pas forcément : l'ACH ne dit rien de la répartition, de la filtration, des pressions ni de l'air neuf", juste: true },
            { html: "Oui, l'ACH dépasse la valeur visée", aide: "Un bon débit peut être mal réparti ou mal filtré." }
          ], { colonnes: 1, ok: function () { j.bravo("26 ACH, mais il faut encore vérifier le reste."); j.suite(); } });
        } });
    } },
    { nom: "Un HEPA partout ?", jouer: function (j, n) {
      ARCHI.vider(n.g);
      j.titre("Un collègue affirme qu'un filtre HEPA remplace le contrôle de la pression. Que réponds-tu ?");
      j.choix([
        { html: "Faux : filtration et pression sont deux exigences distinctes de la ventilation", juste: true },
        { html: "Vrai : un air filtré n'a plus besoin de pression", aide: "La pression décide du sens de l'air entre locaux ; le filtre ne fait pas ça." }
      ], { colonnes: 1, ok: function () { j.bravo("Ventilation : filtration + pression + renouvellement."); j.suite(); } });
    } },
    { nom: "Le circuit sale", jouer: function (j, n) {
      j.titre("Dans un nouveau bloc, le chariot d'instruments souillés passe par l'arsenal stérile « parce que c'est plus court ». Quel risque, et quelle mesure ?");
      j.choix([
        { html: "Contamination ; un circuit sale qui évite les zones propres, physiquement séparé si possible", juste: true },
        { html: "Aucun risque si le chariot roule vite", aide: "La vitesse ne supprime pas le croisement." },
        { html: "Un risque de bruit ; des roues silencieuses", aide: "Le vrai risque est le croisement propre / sale." }
      ], { colonnes: 1, ok: function () { j.bravo("Le circuit sale ne doit pas traverser inutilement les zones propres."); j.suite(); } });
    } }
  ]
});
