/* Niveau : TD 1, cas 2. Température et humidité non maîtrisées ; démarche de diagnostic proposée à partir du cours. */
NIVEAU(ARCHI.rejouable({
  id: "td-cas-air",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { coches: {}, g: g, pl: { P: function (v) { return v; } } };
    n.courbes = function () {
      A.vider(g); fig.chip(null);
      A.texte(g, "Relevés de la salle sur plusieurs jours (exemple ajouté)", [340, 40], { taille: 16, coul: C.doux });
      [["Température", 80, C.ko], ["Humidité", 320, C.acc]].forEach(function (c, k) {
        A.s("rect", { x: 60, y: c[1], width: 580, height: 200, fill: "#fff", stroke: C.trait, "stroke-width": 2 }, g);
        A.s("rect", { x: 60, y: c[1] + 70, width: 580, height: 60, fill: C.okPale }, g);
        A.texte(g, c[0], [70, c[1] + 20], { taille: 15, ancre: "start" });
        A.texte(g, "plage du référentiel", [630, c[1] + 100], { taille: 13, ancre: "end", coul: C.ok });
        var d = "", gr = 7 + k * 13;
        for (var i = 0; i <= 58; i++) { gr = (gr * 9301 + 49297) % 233280; var y = c[1] + 100 + Math.sin(i / 4 + k) * 60 + (gr / 233280 - 0.5) * 30; d += (i ? " L" : "M") + (60 + i * 10) + " " + y.toFixed(1); }
        A.s("path", { d: d, fill: "none", stroke: c[2], "stroke-width": 3 }, g);
      });
    };
    n.courbes();
    return n;
  },
  etapes: [
    { nom: "« La climatisation fonctionne »", jouer: function (j, n) {
      j.titre("La température et l'humidité fluctuent depuis plusieurs jours. Le service technique répond : « La climatisation fonctionne. » Pourquoi est-ce insuffisant ?");
      j.choix([
        { html: "Parce que ce constat ne dit rien des valeurs mesurées, des pressions, des débits ni de la filtration : la ventilation n'est pas une simple climatisation", juste: true },
        { html: "C'est suffisant : si elle fonctionne, l'air est bon", aide: "Elle peut tourner et pourtant laisser dériver l'humidité, la pression ou le débit." },
        { html: "Parce qu'il faudrait la remplacer par un modèle plus puissant", aide: "Avant de remplacer, on mesure et on diagnostique." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Il faut des relevés et un rapport de qualification, pas une impression.");
        j.expliquer("<p>Erreur n° 10 du cours : considérer la ventilation comme un simple problème de climatisation. Ses objectifs vont bien au-delà de la température : contamination particulaire, gaz anesthésiques, humidité, gradients de pression, confort, prévention des infections.</p>");
        j.suite();
      } });
    } },
    { nom: "La démarche de diagnostic", jouer: function (j, n) {
      j.titre("Range les étapes du diagnostic dans un ordre logique.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center">' + [1, 2, 3, 4].map(function (k) { return "<b>" + k + '</b><span class="trou" data-attendu="e' + k + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "e3", html: "Contrôler filtres et régulation" }, { id: "e1", html: "Mesurer température, humidité, alarmes" }, { id: "e4", html: "Consulter l'historique de maintenance" }, { id: "e2", html: "Mesurer pression différentielle et débits / ACH selon le référentiel" }],
        aide: "On constate d'abord (mesures), puis on vérifie l'air (pression, débits), puis on cherche la cause (filtres, régulation), et on remonte l'historique.",
        ok: function () {
          j.bravo("Mesurer, vérifier l'air, chercher la cause, remonter l'historique.");
          j.expliquer("<p>Ce sont les points que le TD demande d'examiner : mesures, alarmes, pression différentielle, débits / ACH selon le référentiel, filtres, régulation et historique de maintenance. L'ordre proposé ici est une méthode de travail, pas un ordre imposé.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Qui associer ?", jouer: function (j, n) {
      j.titre("Qui associer à l'analyse ?");
      j.choix([
        { html: "Le service technique seul", aide: "Le risque touche aussi l'hygiène, les équipements et l'activité opératoire." },
        { html: "Service technique, équipe de prévention des infections, ingénieur biomédical et responsables du bloc", juste: true },
        { html: "Personne : on attend que ça se stabilise", aide: "Une dérive non expliquée de la qualité de l'air ne s'attend pas : elle s'analyse." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Une analyse à plusieurs métiers, documentée.");
        j.expliquer("<p>À documenter (proposition) : les relevés datés, les alarmes, les mesures de pression et de débit avec le référentiel utilisé, l'état des filtres, les interventions de maintenance, les décisions prises et leurs auteurs.</p>");
        j.suite();
      } });
    } },
    { nom: "Reprendre l'activité ?", jouer: function (j, n) {
      j.titre("Quel critère doit être rempli avant d'autoriser la reprise d'activité ?");
      j.choix([
        { html: "Les mesures (température, humidité, pression, débits) sont revenues dans les valeurs du référentiel et les alarmes sont fonctionnelles", juste: true },
        { html: "L'équipe ne se plaint plus", aide: "Le confort compte, mais il ne prouve pas la qualité de l'air." },
        { html: "Le climatiseur a été redémarré", aide: "Redémarrer n'est pas valider : il faut des mesures conformes." }
      ], { colonnes: 1, ok: function () { j.bravo("Une reprise se valide sur des mesures conformes au référentiel."); j.suite(); } });
    } }
  ]
}));
