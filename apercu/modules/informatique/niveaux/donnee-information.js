/* Niveau : système, information, modèle DIKW (S1S2, diapos 7 et 8). */
NIVEAU(SIS.rejouable({
  id: "donnee-information",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    // Pyramide : trois couches (connaissance en haut), dessinées en trapèzes
    n.COUCHES = [
      { t: "Connaissance", y: 330, h: 80, l: 170, coul: C.v, pale: C.vPale },
      { t: "Informations", y: 420, h: 80, l: 330, coul: C.acc, pale: C.accPale },
      { t: "Données", y: 510, h: 80, l: 490, coul: C.turq, pale: C.turqPale }
    ];
    n.pyramide = function (g2, faux) {
      n.COUCHES.forEach(function (c, k) {
        var haut = c.l - 60, x = 340;
        A.s("polygon", { points: [[x - haut / 2, c.y], [x + haut / 2, c.y], [x + c.l / 2, c.y + c.h], [x - c.l / 2, c.y + c.h]].map(function (p) { return p.join(","); }).join(" "), fill: faux === k ? C.koPale : c.pale, stroke: faux === k ? C.ko : c.coul, "stroke-width": 3 }, g2);
        A.texte(g2, c.t, [x, c.y + c.h / 2], { taille: 19, gras: 800, coul: c.coul, halo: false });
      });
    };
    return n;
  },
  etapes: [
    { nom: "Qu'est-ce qu'un système ?", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      // une équipe de garde : éléments reliés autour d'un but
      var P = [[170, 170], [510, 170], [170, 430], [510, 430]], noms = ["Médecin", "Infirmière", "Brancardier", "Laboratoire"];
      P.forEach(function (p, i) { P.forEach(function (q, k) { if (k > i) A.s("line", { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: C.trait, "stroke-width": 3 }, n.g); }); });
      A.boite(n.g, 250, 255, 180, 90, { titre: "But", sous: "soigner le patient", fond: C.jeuPale, bord: C.jeu, taille: 20 });
      P.forEach(function (p, i) { A.s("circle", { cx: p[0], cy: p[1], r: 50, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, n.g); A.texte(n.g, noms[i], p, { taille: 15, gras: 700 }); });
      j.titre("Une équipe de garde aux urgences forme un système. Complète la définition du cours.");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.4">Un système est un « ensemble d\'éléments en <span class="trou" data-attendu="i"></span>, <span class="trou" data-attendu="o"></span> en fonction d\'un <span class="trou" data-attendu="b"></span> ».</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "b", html: "but" }, { id: "x", html: "désordre" }, { id: "i", html: "interaction dynamique" }, { id: "o", html: "organisé" }],
        aide: "Regarde la figure : des éléments reliés entre eux, tournés vers un même objectif. Le désordre est le contraire d'un système.",
        ok: function () {
          j.bravo("Un ensemble d'éléments en interaction dynamique, organisé en fonction d'un but.");
          j.expliquer("<p>Le contraire d'un système, d'après le cours : le <b>désordre</b>, la confusion. Les mêmes personnes sans organisation ni but commun ne forment pas un système.</p>");
          j.suite();
        }
      });
    } },
    { nom: "La pyramide", jouer: function (j, n) {
      var A = SIS;
      j.titre("Un infirmier relève une tension au lit de M. Alaoui. Range chaque élément à son étage de la pyramide.");
      j.consigne("Touche une carte, puis l'étage.");
      var cartes = [
        { t: "122", bac: 2 }, { t: "Tension systolique de M. Alaoui ce matin : 122 mmHg", bac: 1 },
        { t: "1,85", bac: 2 }, { t: "Glycémie à jeun de Mme Bennani : 1,85 g/L", bac: 1 },
        { t: "Une glycémie à jeun élevée et répétée fait suspecter un diabète", bac: 0 }, { t: "08:15", bac: 2 }
      ];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: n.COUCHES.map(function (c) { return { t: c.t }; }),
        pos: A.grille(6, 2, 20, 20, 640, 84, 14),
        bacsPos: function (k) { var c = n.COUCHES[k]; return { x: 340 - c.l / 2, y: c.y, w: c.l, h: c.h }; },
        dessinBac: function (g2, k, faux) { if (k === 0) n.pyramide(g2, -1); if (faux) n.pyramide(g2, k); },
        couleurs: function (k) { return { coul: n.COUCHES[k].coul, pale: n.COUCHES[k].pale }; },
        erreur: j.erreur, info: j.info,
        aide: function (i, k) {
          var b = cartes[i].bac;
          return b === 2 ? "Seul, cet élément n'a pas de sens : on ne sait ni de qui, ni de quoi il parle. C'est un fait brut." :
            b === 1 ? "Ici, le fait est organisé : on sait de quel patient et de quelle mesure il s'agit. Mais rien n'est encore interprété." :
            "Cette phrase interprète des informations et sert à décider : c'est l'étage du dessus.";
        },
        fin: function () {
          j.bravo("Données brutes en bas, informations au milieu, connaissance en haut.");
          j.expliquer("<p><b>Données</b> : éléments factuels neutres et objectifs, explicites et stockés. <b>Informations</b> : données organisées auxquelles on donne un sens. <b>Connaissance</b> : informations mémorisées et interprétées, une étape de la transformation de l'information par l'intelligence.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le W de DIKW", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["base", "document", "personne"], titre: "Data, Information, Knowledge, Wisdom" });
      j.titre("Le cours appelle cette pyramide le modèle DIKW : Data, Information, Knowledge, Wisdom. À quoi correspond Knowledge ?");
      j.choix([
        { html: "Données", aide: "Data correspond aux données. Suis l'ordre des lettres : D, I, K, W." },
        { html: "Informations", aide: "Information est déjà un mot du modèle. Knowledge est la lettre suivante." },
        { html: "Connaissance", juste: true }
      ], { colonnes: 3, ok: function () {
        j.bravo("Knowledge = connaissance.");
        j.expliquer("<p>Le W, <b>Wisdom</b> (sagesse), est le niveau au-dessus de la connaissance dans le modèle DIKW. La pyramide du cours s'arrête à la connaissance.</p>");
        j.suite();
      } });
    } },
    { nom: "Deux sens du mot", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.boite(n.g, 40, 120, 600, 150, { titre: "« Le patient a reçu une information sur les effets secondaires de son traitement. »", taille: 20, fond: SIS.C.fond, bord: SIS.C.trait, gras: 600 });
      SIS.boite(n.g, 40, 330, 600, 150, { titre: "« Ce soir, les infos parlent d'une épidémie de grippe. »", taille: 20, fond: SIS.C.fond, bord: SIS.C.trait, gras: 600 });
      SIS.texte(n.g, "1", [40, 120], { taille: 22, gras: 800, coul: SIS.C.acc }); SIS.texte(n.g, "2", [40, 330], { taille: 22, gras: 800, coul: SIS.C.acc });
      j.titre("Le cours donne deux sens au mot « information ». Quel sens a-t-il dans la phrase 1 ?");
      j.choix([
        { html: "Sens 1 : un renseignement, une explication sur quelque chose", juste: true },
        { html: "Sens 2 : l'actualité diffusée par les médias", aide: "L'actualité des médias, c'est la phrase 2. Dans la phrase 1, on explique quelque chose au patient." }
      ], { colonnes: 1, ok: function () { j.bravo("Phrase 1 : sens 1. Phrase 2 : sens 2, l'actualité (familier : « les infos »)."); j.suite(); } });
    } }
  ]
}));
