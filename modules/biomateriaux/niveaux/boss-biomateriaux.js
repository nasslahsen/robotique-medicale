/* Boss du chapitre 1 : le dossier d'un stent biorésorbable (DM ou médicament, classe, génération, mise sur le marché, projection). */
NIVEAU({
  id: "boss-biomateriaux",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { res: 0, fiche: {} };
    var b = fig.bande("");
    n.dessin = function () {
      E.vider(g);
      D.texte(g, "Artère coronaire et stent biorésorbable", [340, 60], { taille: 20 });
      // paroi de l'artère
      E.s("path", { d: "M40 190 Q340 150 640 190 L640 230 Q340 190 40 230 Z", fill: "#f6c2b0", stroke: "#d98c74", "stroke-width": 2.5 }, g);
      E.s("path", { d: "M40 410 Q340 450 640 410 L640 370 Q340 410 40 370 Z", fill: "#f6c2b0", stroke: "#d98c74", "stroke-width": 2.5 }, g);
      E.s("path", { d: "M40 230 Q340 190 640 230 L640 370 Q340 410 40 370 Z", fill: "#fde9e4" }, g);
      // maillage du stent, qui s'efface quand il se résorbe
      var op = 1 - n.res / 100;
      if (op > 0.03) for (var i = 0; i < 9; i++) {
        var x = 150 + i * 42;
        E.s("path", { d: "M" + x + " 222 L" + (x + 21) + " 300 L" + x + " 378 M" + (x + 42) + " 222 L" + (x + 21) + " 300 L" + (x + 42) + " 378", fill: "none", stroke: D.C.jeu, "stroke-width": 5, "stroke-linejoin": "round", opacity: op }, g);
      }
      for (var k = 0; k < 6; k++) D.rond(g, [110 + k * 90, 300 + (k % 2 ? 22 : -22)], 9, { fill: "#e5484d", opacity: 0.8 });
      D.texte(g, n.res ? "résorption : " + n.res + " %" : "le stent maintient l'artère ouverte", [340, 480], { taille: 17, coul: C.doux, gras: false });
      var f = n.fiche, champ = function (k, v) { return "\\text{" + k + "} : " + (v || "\\,?\\,"); };
      E.k(b, champ("statut", f.statut) + " \\quad " + champ("classe", f.classe) + " \\quad " + champ("génération", f.gen) + " \\quad " + champ("marché", f.marche));
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Statut", jouer: function (j, n) {
      j.fig.astuce("Un stent en polymère qui maintient l'artère ouverte puis se résorbe en quelques années.");
      j.titre("Tu montes le dossier de ce stent biorésorbable (sans médicament). D'abord : est-ce un dispositif médical ?");
      j.consigne("Boss : chaque erreur compte.");
      j.choix([
        { html: "Oui : il agit mécaniquement, en soutenant la paroi", juste: true },
        { html: "Non : il disparaît, donc c'est un médicament", aide: "Le critère n'est pas la durée de vie, mais le mode d'action principal." },
        { html: "Non : un polymère ne peut pas être un DM", aide: "La matière ne décide pas du statut." }
      ], { colonnes: 1, ok: function () {
        n.fiche.statut = "\\text{DM}"; n.dessin();
        j.bravo("DM : action principale mécanique.");
        j.suite();
      } });
    } },
    { nom: "Classe", jouer: function (j, n) {
      j.titre("Quelle classe, et pour quelles raisons ?");
      j.choix([
        { html: "IIb : invasif à usage prolongé", aide: "Il y a deux raisons qui le font monter encore d'une classe. Où est-il posé ? Que devient-il ?" },
        { html: "III : au contact du système circulatoire central, et il se dégrade dans le corps", juste: true },
        { html: "IIa : il ne reste pas à vie", aide: "Un dispositif biodégradable subit des modifications chimiques dans le corps : c'est un critère de la classe la plus haute." }
      ], { colonnes: 1, ok: function () {
        n.fiche.classe = "\\text{III}"; n.dessin();
        j.bravo("Classe III, pour deux raisons.");
        j.suite();
      } });
    } },
    { nom: "Génération", jouer: function (j, n) {
      j.titre("Le cours rattache les structures biodégradables, conçues pour disparaître, à quelle génération de biomatériaux ?");
      j.choix([{ html: "1re", aide: "La 1re génération, c'est le bois, le verre, l'or, sans contrôle de la réponse de l'hôte." }, { html: "2e", aide: "La 2e génération exploite des métaux, céramiques et polymères classiques." }, { html: "3e", juste: true }], { ok: function () {
        n.fiche.gen = "3^{e}"; n.res = 60; n.dessin();
        j.bravo("3e génération : nouveaux matériaux, surfaces modifiées, structures biodégradables, nanomatériaux.");
        j.suite();
      } });
    } },
    { nom: "Mise sur le marché", jouer: function (j, n) {
      j.titre("Complète le plan de mise sur le marché.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;font-size:17px"><span>Avant toute vente (classe III)</span><span class="trou" data-attendu="e"></span><span>Pour vendre en Europe</span><span class="trou" data-attendu="ce"></span><span>Pour vendre aux États-Unis</span><span class="trou" data-attendu="fda"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "fda", html: "approbation de la FDA" }, { id: "x", html: "aucune démarche" }, { id: "ce", html: "marquage CE" }, { id: "e", html: "évaluations précliniques et cliniques" }],
        aide: "Classe III : approbation préalable et évaluations. CE pour l'Europe, FDA pour les États-Unis.",
        ok: function () {
          n.fiche.marche = "\\text{CE, FDA}"; n.res = 100; n.dessin();
          j.bravo("Dossier complet.");
          j.suite();
        }
      });
    } },
    { nom: "Le marché en 2027", jouer: function (j, n) {
      j.titre("Exemple ajouté : si le marché des biomatériaux (43,50 milliards de dollars en 2023) croît de 7 % par an, combien vaudra-t-il en 2027 ?");
      j.nombre({ avant: "V_{2027} \\approx", apres: "\\text{ milliards de } \\$", cases: [{ attendu: Math.round(BIO.projection(43.5, 0.07, 4) * 10) / 10, tol: 0.5 }], ligne: true,
        aide: function () { return "Chaque année, la valeur est multipliée par 1,07. De 2023 à 2027 : combien d'années ?"; },
        ok: function () {
          j.bravo("Environ 57 milliards de dollars, sur la route des 69,86 de 2030.");
          j.expliquer("<p>Le dossier d'un dispositif médical réunit tout le chapitre : le statut (DM ou médicament), la classe de risque, le vocabulaire et la génération du biomatériau, puis les approbations du marché de destination.</p>");
          j.suite();
        } });
    } }
  ]
});
