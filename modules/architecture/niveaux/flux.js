/* Niveau : maîtrise des flux (diapos 12 à 16). Patient, personnel, propre, sale, dispositifs médicaux. */
NIVEAU(ARCHI.rejouable({
  id: "flux",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    // grille de 3 × 3 emplacements, pour disperser les étapes d'un flux
    n.CASE = [];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) n.CASE.push({ x: 24 + c * 220, y: 90 + r * 170, w: 192, h: 84 });
    n.noeuds = function (liste) { return liste.map(function (e) { var k = n.CASE[e[1]]; return { t: e[0], x: k.x, y: k.y, w: k.w, h: k.h }; }); };
    n.legende = function (t, coul) { fig.chip(null); A.texte(g, t, [340, 50], { taille: 18, coul: coul, gras: 800 }); };
    n.personnel = function () {
      A.vider(g);
      var Z = A.ZONES, xs = [[30, "Circulation générale", Z.publique], [190, "Vestiaires", null], [350, "Zone semi-restreinte", Z.semi], [510, "Zone restreinte", Z.restreinte]];
      xs.forEach(function (x, i) {
        A.boite(g, x[0], 220, 140, 150, { fond: x[2] ? x[2].fond : "#fff", bord: x[2] ? x[2].bord : C.gris, tirets: x[2] ? null : "6 5", rx: 10, titre: x[1], taille: 16 });
        if (i > 0) A.fleche(g, [x[0] - 22, 295], [x[0] + 2, 295], { coul: n.persoOk ? C.personnel : C.trait, ep: 5 });
      });
      A.icone(g, "personne", [100, 170], 46, C.personnel);
      if (n.persoOk) {
        A.chemin(g, [[100, 400], [100, 450], [580, 450], [580, 400]], { coul: C.personnel, ep: 5, relais: true });
        [[330, 295], [490, 295]].forEach(function (q) { A.s("rect", { x: q[0] - 10, y: q[1] - 30, width: 20, height: 60, rx: 4, fill: C.encre }, g); });
        A.texte(g, "accès contrôlés", [410, 500], { taille: 16, coul: C.encre });
      }
    };
    return n;
  },
  etapes: [
    { nom: "Le flux patient", jouer: function (j, n) {
      j.titre("Le patient quitte sa chambre pour être opéré. Touche les étapes de son parcours, dans l'ordre.");
      j.consigne("Une case n'appartient pas à ce flux.");
      var nd = n.noeuds([["Préparation", 7], ["SSPI", 2], ["Réanimation / hospitalisation", 6], ["Hospitalisation", 5], ["Transfert", 3], ["Hall public", 8], ["Salle d'opération", 1]]);
      var t = ARCHI.trace({ g: n.g, noeuds: nd, ordre: [3, 0, 4, 6, 1, 2], coul: ARCHI.C.patient,
        fond: function () { n.legende("Flux patient", ARCHI.C.patient); },
        erreur: j.erreur,
        aide: function (i, att, k) { return i === 5 ? "Le patient ne repasse pas par le hall public : son transfert reste dans les circulations du bloc." : k === 0 ? "Le parcours part de là où le patient est hospitalisé." : "Pas encore. Suis le patient : il est préparé, transféré, opéré, surveillé au réveil, puis il quitte le bloc."; },
        fin: function () {
          j.bravo("Hospitalisation, préparation, transfert, salle, SSPI, puis réanimation ou hospitalisation.");
          j.expliquer("<p>Le transfert doit être organisé afin de <b>limiter les croisements inutiles</b> : le brancard ne doit pas couper le chemin du sale ou du public.</p>");
          j.suite();
        } });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le flux personnel", jouer: function (j, n) {
      n.persoOk = false; n.personnel(); n.legende("Flux personnel", ARCHI.C.personnel);
      j.titre("Une infirmière arrive en tenue de ville par la circulation générale. Par où entre-t-elle dans la zone semi-restreinte ?");
      j.choix([
        { html: "Directement, par la porte la plus proche", aide: "En tenue de ville, elle amènerait l'extérieur dans une zone où la propreté augmente." },
        { html: "Par les vestiaires", juste: true },
        { html: "Par la zone restreinte", aide: "La zone restreinte est la dernière étape, pas un passage vers la semi-restreinte." }
      ], { colonnes: 1, ok: function () {
        n.persoOk = true; n.personnel(); n.legende("Flux personnel", ARCHI.C.personnel);
        j.bravo("Vestiaires → zone semi-restreinte → zone restreinte.");
        j.expliquer("<p>Le flux personnel suit la gradation : vestiaires, zone semi-restreinte, zone restreinte. Le cours ajoute : <b>l'accès doit être contrôlé</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Le flux propre", jouer: function (j, n) {
      j.titre("Un carton de champs opératoires stériles arrive au bloc. Touche son trajet jusqu'à la salle.");
      var nd = n.noeuds([["Salle d'opération", 5], ["Local déchets", 1], ["Réception", 6], ["Préparation", 2], ["Stockage propre", 3]]);
      var t = ARCHI.trace({ g: n.g, noeuds: nd, ordre: [2, 4, 3, 0], coul: ARCHI.C.propre,
        fond: function () { n.legende("Flux propre", ARCHI.C.propre); },
        erreur: j.erreur,
        aide: function (i, att, k) { return i === 1 ? "Le local déchets appartient au circuit sale : le propre ne doit jamais y passer." : k === 0 ? "Tout ce qui entre au bloc commence par être reçu." : "Avant d'aller en salle, le matériel est rangé puis préparé."; },
        fin: function () {
          j.bravo("Réception → stockage propre → préparation → salle d'opération.");
          j.suite();
        } });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le flux sale", jouer: function (j, n) {
      j.titre("L'intervention est finie : compresses souillées et instruments utilisés doivent sortir. Touche leur trajet.");
      var nd = n.noeuds([["Circuit sale", 8], ["Stockage propre", 4], ["Salle d'opération", 0], ["Évacuation des déchets et instruments souillés", 1]]);
      var t = ARCHI.trace({ g: n.g, noeuds: nd, ordre: [2, 3, 0], coul: ARCHI.C.sale,
        fond: function () { n.legende("Flux sale", ARCHI.C.sale); },
        erreur: j.erreur,
        aide: function (i, att, k) { return i === 1 ? "Le circuit sale ne doit pas traverser inutilement les zones propres." : k === 0 ? "Le sale naît là où l'on opère." : "D'abord on évacue, ensuite on rejoint le circuit dédié."; },
        fin: function () {
          j.bravo("Salle → évacuation des déchets et instruments souillés → circuit sale.");
          j.expliquer("<p>Le circuit sale <b>ne doit pas traverser inutilement les zones propres</b>. C'est pour cela que la case « Stockage propre » refusait ton passage.</p>");
          j.suite();
        } });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le flux des dispositifs médicaux", jouer: function (j, n) {
      j.titre("Une boîte d'instruments chirurgicaux sert à chaque intervention. Touche son cycle complet.");
      var cx = 340, cy = 330, R = 210, noms = ["Instruments souillés", "Stérilisation centrale", "Utilisation", "Stockage stérile", "Bloc"];
      var pos = [4, 0, 2, 1, 3]; // place de chaque étape sur le cercle
      var nd = noms.map(function (t, i) { var a = -Math.PI / 2 + pos[i] * 2 * Math.PI / 5; return { t: t, x: cx + R * Math.cos(a) - 95, y: cy + R * Math.sin(a) - 38, w: 190, h: 76 }; });
      var t = ARCHI.trace({ g: n.g, noeuds: nd, ordre: [1, 3, 4, 2, 0], coul: ARCHI.C.dm, boucle: true,
        fond: function () { n.legende("Flux des dispositifs médicaux", ARCHI.C.dm); },
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "Une boîte prête à servir sort d'abord de la stérilisation." : "Suis la vie de la boîte : rangée stérile, montée au bloc, utilisée, puis souillée."; },
        fin: function () {
          j.bravo("Stérilisation centrale → stockage stérile → bloc → utilisation → instruments souillés → stérilisation.");
          j.expliquer("<p>C'est le seul flux qui forme une <b>boucle</b> : les instruments souillés repartent en stérilisation. Le cours demande une attention particulière à ce flux : un instrument souillé qui croise un instrument stérile annule tout le travail de la stérilisation.</p>");
          j.suite();
        } });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
