/* Boss du chapitre 1 : un projet d'hôpital où le bloc est mal placé. Trouver les défauts, les rattacher au cours. */
NIVEAU(ARCHI.rejouable({
  id: "boss-hopital",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { trouves: {}, faux: -1, pl: { P: function (v) { return v; } } };
    // Points à examiner sur le plan : trois défauts, trois choix corrects
    n.PTS = [
      { id: "loin", c: [312, 384], defaut: true, nom: "Bloc loin des urgences et de la réanimation" },
      { id: "hall", c: [508, 322], defaut: true, nom: "Bloc ouvert sur le hall public" },
      { id: "steril", c: [540, 100], defaut: true, nom: "Stérilisation minuscule, à l'autre bout" },
      { id: "imagerie", c: [162, 254], defaut: false },
      { id: "admin", c: [590, 236], defaut: false },
      { id: "consult", c: [306, 96], defaut: false }
    ];
    n.dessin = function () {
      A.vider(g);
      fig.chip(Object.keys(n.trouves).length + " / 3");
      var Z = A.ZONES.publique;
      // hall public et circulation générale
      A.s("rect", { x: 200, y: 70, width: 70, height: 510, fill: Z.fond }, g);
      A.s("rect", { x: 200, y: 260, width: 460, height: 80, fill: Z.fond }, g);
      A.texte(g, "Hall public", [222, 420], { taille: 14, coul: C.doux, halo: false }).setAttribute("transform", "rotate(-90 222 420)");
      A.texte(g, "Circulation générale", [585, 300], { taille: 14, coul: C.doux, halo: false });
      A.boite(g, 24, 70, 166, 130, { titre: "Urgences" }); A.boite(g, 24, 230, 166, 140, { titre: "Imagerie" }); A.boite(g, 24, 400, 166, 180, { titre: "Réanimation" });
      A.boite(g, 280, 70, 230, 110, { titre: "Consultations" }); A.boite(g, 520, 160, 140, 90, { titre: "Administration", taille: 15 });
      A.boite(g, 280, 350, 380, 230, { fond: C.jeuPale, bord: C.jeu, ep: 3, titre: "Bloc opératoire", taille: 20 });
      A.boite(g, 570, 80, 56, 40, { fond: "#fff", rx: 6, ep: 2 }); A.texte(g, "Stérilisation", [598, 136], { taille: 13, coul: C.doux });
      // le bloc s'ouvre directement sur le hall
      A.s("line", { x1: 440, y1: 350, x2: 500, y2: 350, stroke: "#fff", "stroke-width": 8 }, g);
      A.chemin(g, [[190, 135], [252, 135], [252, 300], [470, 300], [470, 352]], { coul: C.v, ep: 3.5, tirets: "8 6" });
      n.PTS.forEach(function (p, i) {
        var t = n.trouves[p.id], f = n.faux === i;
        A.s("circle", { cx: p.c[0], cy: p.c[1], r: 22, fill: t ? C.ko : f ? "#fff" : "rgba(59,91,219,.12)", stroke: t ? "#fff" : f ? C.gris : C.acc, "stroke-width": 3 }, g);
        A.texte(g, t ? "!" : "?", p.c, { taille: 20, coul: t ? "#fff" : f ? C.gris : C.acc, halo: false, gras: 800 });
        A.cible(g, p.c[0] - 30, p.c[1] - 30, 60, 60, function () { if (n.surPoint) n.surPoint(i); });
      });
      A.texte(g, "trajet urgences → bloc", [370, 282], { taille: 14, coul: C.v });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Trois défauts", jouer: function (j, n) {
      j.titre("Ce projet d'hôpital place mal son bloc opératoire. Touche les trois défauts.");
      n.surPoint = function (i) {
        var p = n.PTS[i];
        if (n.trouves[p.id]) return;
        if (!p.defaut) { n.faux = i; n.dessin(); j.erreur("Ce point-là ne pose pas de problème. Pense à l'accès depuis les autres services, à la circulation générale et à la taille des locaux."); return; }
        n.trouves[p.id] = true; n.faux = -1; n.dessin();
        j.info(p.nom + ".");
        if (Object.keys(n.trouves).length === 3) {
          n.surPoint = null;
          j.bravo("Les trois défauts sont trouvés.");
          j.suite();
        }
      };
      j.reponse(function () { n.PTS.forEach(function (p, i) { if (p.defaut && n.surPoint) n.surPoint(i); }); });
    } },
    { nom: "Ce que dit le cours", jouer: function (j, n) {
      j.titre("Le bloc s'ouvre directement sur le hall public. Quelle exigence du cours n'est pas respectée ?");
      j.choix([
        { html: "Le bloc doit être facilement accessible", aide: "Il l'est, depuis le hall. Le problème est ailleurs." },
        { html: "Le bloc doit être suffisamment séparé des circulations générales de l'hôpital", juste: true },
        { html: "Chaque local doit répondre à une fonction précise", aide: "Le bloc a bien sa fonction. Regarde par où on y entre." }
      ], { colonnes: 1, ok: function () { j.bravo("Accessible, mais séparé des circulations générales."); j.suite(); } });
    } },
    { nom: "Le risque principal", jouer: function (j, n) {
      j.titre("Avec ce hall qui débouche sur le bloc, quel risque de la définition du bloc augmente le plus ?");
      j.choix([
        { html: "Les risques infectieux", juste: true },
        { html: "Les risques électriques", aide: "La circulation du public ne touche pas aux installations électriques." },
        { html: "Les risques incendie", aide: "Le hall ne change ni les gaz ni les équipements thermiques." }
      ], { colonnes: 3, ok: function () { j.bravo("Le public qui passe près des salles amène contamination et croisements de flux."); j.suite(); } });
    } },
    { nom: "La bonne méthode", jouer: function (j, n) {
      j.titre("L'architecte a dessiné ce plan seul, en partant des murs. Qu'aurait-il fallu faire ?");
      j.choix([
        { html: "Partir d'un programme fonctionnel et technique, avec architectes, ingénieurs, exploitants et prévention des infections", juste: true },
        { html: "Partir du même plan, mais agrandir le bloc", aide: "Agrandir ne règle ni la distance aux urgences ni l'ouverture sur le hall." },
        { html: "Faire valider le plan par les chirurgiens à la fin du chantier", aide: "À la fin du chantier, déplacer un bloc coûte une reconstruction." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Un programme d'abord, une équipe complète dès le départ.");
        j.expliquer("<p>Les trois défauts relèvent du même oubli : on a dessiné sans programme. Le programme aurait fixé la place du bloc (près des urgences, de la réanimation et de l'imagerie), son accès séparé, et la taille de la stérilisation qui le sert.</p>");
        j.suite();
      } });
    } }
  ]
}));
