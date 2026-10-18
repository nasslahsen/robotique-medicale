/* Boss du chapitre 5 : une coupure de courant pendant une intervention. Rejouer la séquence, trouver ce qui a manqué. */
NIVEAU({
  id: "boss-technique",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, etat: { resp: true, lampe: false, asp: false, ecran: true }, pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g);
      fig.chip("coupure du réseau : t + 5 s");
      A.texte(g, "Salle 2, pendant une cholécystectomie (exemple ajouté)", [340, 60], { taille: 15, coul: C.doux });
      [["Respirateur", "air", "resp"], ["Éclairage opératoire", "lampe", "lampe"], ["Aspiration (vide médical)", "goutte", "asp"], ["Moniteur", "ecran", "ecran"]].forEach(function (e, i) {
        var x = 40 + (i % 2) * 320, y = 100 + Math.floor(i / 2) * 230, on = n.etat[e[2]];
        A.boite(g, x, y, 280, 200, { fond: on ? "#fff" : C.koPale, bord: on ? C.ok : C.ko, ep: 3 });
        A.icone(g, e[1], [x + 140, y + 74], 64, on ? C.ok : C.ko);
        A.texte(g, e[0], [x + 140, y + 146], { taille: 17, halo: false });
        A.texte(g, on ? "fonctionne" : "arrêté", [x + 140, y + 176], { taille: 15, coul: on ? C.ok : C.ko, halo: false });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La séquence", jouer: function (j, n) {
      j.titre("Le réseau principal vient de tomber. Remets les événements dans l'ordre, tels qu'ils doivent se dérouler dans un bloc bien conçu.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center"><b>1</b><span class="trou" data-attendu="a"></span><b>2</b><span class="trou" data-attendu="b"></span><b>3</b><span class="trou" data-attendu="c"></span><b>4</b><span class="trou" data-attendu="d"></span></div>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "Le groupe électrogène démarre" }, { id: "a", html: "Coupure du réseau principal" }, { id: "d", html: "L'alimentation de sécurité reprend" }, { id: "b", html: "L'onduleur alimente les équipements critiques" }],
        aide: "L'onduleur réagit sans coupure ; le groupe met un moment à démarrer, puis fournit l'alimentation de sécurité.",
        ok: function () { j.bravo("Coupure, onduleur, démarrage du groupe, alimentation de sécurité."); j.suite(); }
      });
    } },
    { nom: "La lumière s'éteint", jouer: function (j, n) {
      j.titre("Ici, l'éclairage opératoire s'est éteint dix secondes. Quel est le défaut de conception ?");
      j.choix([
        { html: "L'éclairage opératoire n'a pas été identifié comme équipement critique et n'est pas secouru sans coupure", juste: true },
        { html: "Le scialytique n'avait qu'un foyer", aide: "Le nombre de foyers joue sur l'ombre, pas sur la coupure." },
        { html: "La salle était trop grande", aide: "La surface n'explique pas une coupure d'alimentation." }
      ], { colonnes: 1, ok: function () { j.bravo("Les équipements critiques doivent être identifiés."); j.suite(); } });
    } },
    { nom: "L'aspiration s'arrête", jouer: function (j, n) {
      j.titre("L'aspiration chirurgicale s'est arrêtée aussi. Qu'a-t-on oublié de prévoir pour le vide médical ?");
      j.choix([
        { html: "Une source de secours (et des alarmes)", juste: true },
        { html: "Un filtre HEPA", aide: "Le HEPA concerne l'air soufflé, pas le réseau de vide." },
        { html: "Une prise de N₂O", aide: "Le N₂O est un gaz d'anesthésie, sans rapport avec l'aspiration." }
      ], { colonnes: 1, ok: function () { j.bravo("Vide médical : réseau, vannes, alarmes, source de secours, maintenance."); j.suite(); } });
    } },
    { nom: "La validation oubliée", jouer: function (j, n) {
      j.titre("Ces défauts auraient dû être vus avant l'ouverture du bloc. Quel essai électrique de la validation technique les aurait révélés ?");
      j.choix([
        { html: "L'essai de l'alimentation de secours et des circuits", juste: true },
        { html: "La mesure de l'humidité", aide: "C'est un essai CVC, pas électrique." },
        { html: "La formation des utilisateurs", aide: "Utile, mais c'est un point biomédical, pas un essai électrique." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Électricité : continuité, terre, équipotentialité, alimentation de secours, essais des circuits.");
        j.expliquer("<p>Un bloc n'est pas prêt simplement parce que les travaux sont terminés : la validation technique avant ouverture vérifie la CVC, l'électricité, les gaz médicaux, le biomédical et l'hygiène. Tu la verras au chapitre 6.</p>");
        j.suite();
      } });
    } },
    { nom: "Le bilan des risques", jouer: function (j, n) {
      ARCHI.vider(n.g); j.fig.chip(null);
      j.titre("Pour le rapport d'incident, relie chaque domaine au risque que donne le tableau de synthèse.");
      var pa = ARCHI.paires({ g: n.g, gauche: ["Électricité", "Gaz médicaux", "Éclairage", "Informatique"], droite: ["Erreur opératoire", "Perte de données", "Arrêt équipement", "Risque patient"],
        bon: [2, 3, 0, 1], xg: 40, wg: 240, xd: 380, wd: 260, y0: 90, h: 90, pas: 120, taille: 17,
        erreur: j.erreur, info: j.info,
        fin: function () { j.bravo("Arrêt équipement, risque patient, erreur opératoire, perte de données."); j.suite(); } });
      j.reponse(function () { pa.resoudre(); });
    } }
  ]
});
