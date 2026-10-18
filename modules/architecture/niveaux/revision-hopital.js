/* Révision du chapitre 1 : architecture hospitalière, familles de contraintes, définition du bloc, dans des situations nouvelles. */
NIVEAU(ARCHI.rejouable({
  id: "revision-hopital",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "vf", pris: {}, pl: { P: function (v) { return v; } } };
    n.AFF = [
      { t: "L'architecture hospitalière organise aussi les déchets et la maintenance.", v: true },
      { t: "Le bloc doit être placé au cœur de la circulation générale, pour être accessible.", v: false, aide: "Accessible depuis les urgences, la réanimation et l'imagerie, oui ; mais séparé des circulations générales." },
      { t: "Le bloc concentre des risques infectieux, électriques et incendie.", v: true },
      { t: "Un bon plan architectural suffit pour concevoir un bloc.", v: false, aide: "Le cours exige un programme fonctionnel et technique, pas seulement un plan." },
      { t: "Selon l'OMS, les exploitants doivent être associés à la conception.", v: true },
      { t: "La famille « logistique » couvre l'approvisionnement, les déchets et le linge.", v: true }
    ];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "vf") {
        n.AFF.forEach(function (a, i) {
          var x = 24 + (i % 2) * 320, y = 70 + Math.floor(i / 2) * 170, on = n.pris[i];
          A.boite(g, x, y, 312, 150, { fond: on ? C.okPale : "#fff", bord: on ? C.ok : C.trait, ep: on ? 3 : 2 });
          A.texte(g, a.t, [x + 156, y + 75], { taille: 16, largeur: 280, halo: false, gras: 500 });
          A.cible(g, x, y, 312, 150, function () { if (n.surAff) n.surAff(i); });
        });
      } else {
        // un bloc en panne : tableau électrique éteint
        A.boite(g, 60, 90, 560, 420, { fond: C.fond, bord: C.trait });
        A.icone(g, "lampe", [340, 170], 90, C.gris);
        A.icone(g, "table", [340, 330], 160, C.doux);
        A.boite(g, 470, 380, 120, 100, { fond: "#fff", bord: C.ko, ep: 3 });
        A.icone(g, "eclair", [530, 420], 40, C.ko);
        A.texte(g, "groupe à l'arrêt", [530, 462], { taille: 14, coul: C.ko, halo: false });
        A.texte(g, "Coupure du réseau principal", [340, 550], { taille: 18, coul: C.ko });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Vrai ou faux", jouer: function (j, n) {
      j.titre("Touche toutes les affirmations justes, et seulement elles.");
      var reste = n.AFF.filter(function (a) { return a.v; }).length;
      n.surAff = function (i) {
        var a = n.AFF[i];
        if (n.pris[i] || !reste) return;
        if (!a.v) { j.erreur(a.aide); return; }
        n.pris[i] = true; reste--; n.dessin();
        if (!reste) {
          n.surAff = null;
          j.bravo("Quatre affirmations justes.");
          j.expliquer("<p>Les deux fausses reprennent les pièges du chapitre : le bloc doit être accessible mais séparé de la circulation générale, et on le conçoit à partir d'un programme fonctionnel et technique.</p>");
          j.suite();
        }
      };
      j.reponse(function () { n.AFF.forEach(function (a, i) { if (a.v && !n.pris[i] && n.surAff) n.surAff(i); }); });
    } },
    { nom: "Classer des situations", jouer: function (j, n) {
      j.titre("Quatre situations nouvelles. Range chacune dans sa famille de contraintes.");
      var S = [["Le local de stérilisation n'est relié au bloc par aucun circuit propre distinct du sale.", "h"], ["La norme électrique du pays impose une surveillance particulière des locaux médicaux.", "r"], ["L'issue de secours du bloc donne sur un escalier encombré.", "s"], ["La salle prévue est trop basse pour les bras plafonniers.", "a"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 190px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "Sécurité" }, { id: "a", html: "Architectural" }, { id: "r", html: "Réglementaire" }, { id: "h", html: "Hygiène" }],
        aide: "Hygiène : propre / sale. Réglementaire : normes. Sécurité : incendie, évacuation. Architectural : surfaces, volumes, circulations.",
        ok: function () {
          j.bravo("Hygiène, réglementaire, sécurité, architectural.");
          j.expliquer("<p>La hauteur de la salle est une contrainte <b>architecturale</b> (volumes), mais elle touche aussi le biomédical (bras plafonniers) : les familles se recoupent, d'où la coordination demandée tout au long du cours.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le risque oublié", jouer: function (j, n) {
      j.titre("Dans un projet, l'informatique du bloc a été pensée sans redondance ni sécurité. D'après le tableau de synthèse, quel risque court-on ?");
      j.choix([
        { html: "Perte de données", juste: true },
        { html: "Catastrophe", aide: "C'est le risque associé à l'incendie." },
        { html: "Contamination", aide: "C'est le risque des flux et des surfaces." }
      ], { colonnes: 3, ok: function () {
        j.bravo("Informatique : disponibilité + sécurité, sinon perte de données.");
        j.suite();
      } });
    } },
    { nom: "L'objectif général en défaut", jouer: function (j, n) {
      n.mode = "panne"; n.dessin();
      j.titre("Pendant une intervention, le réseau électrique tombe et le groupe électrogène ne démarre pas. Quel terme de l'objectif général n'est plus garanti ?");
      j.choix([
        { html: "Au bon endroit", aide: "Le patient est toujours dans la bonne salle. Cherche ce qui permet de continuer à fonctionner." },
        { html: "Une continuité de fonctionnement", juste: true },
        { html: "Avec des flux maîtrisés", aide: "Les flux ne changent pas avec la panne. C'est le fonctionnement lui-même qui s'arrête." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La continuité de fonctionnement.");
        j.expliquer("<p>Le bon soin + au bon endroit + dans des conditions sûres + avec des flux maîtrisés + une continuité de fonctionnement. L'électricité de secours sert ce dernier terme : tu la verras au chapitre 5.</p>");
        j.suite();
      } });
    } }
  ]
}));
