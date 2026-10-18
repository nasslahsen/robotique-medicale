/* Niveau : historique des polymères. Frise des dates du cours, celluloïd, Bakélite, nylon, Staudinger, HDPE. */
NIVEAU({
  id: "historique-polymeres",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var EV = [
      { a: 1869, t: "celluloïd", d: "frères Hyatt" },
      { a: 1890, t: "pellicule photo", d: "films" },
      { a: 1907, t: "Bakélite", d: "Baekeland" },
      { a: 1935, t: "nylon", d: "Carothers, Du Pont" },
      { a: 1953, t: "Nobel de Staudinger", d: "Corvette, HDPE" }
    ];
    var n = { vus: 0, surligne: null };
    var A0 = 1860, A1 = 1960, X0 = 70, X1 = 610;
    function x(a) { return X0 + (a - A0) / (A1 - A0) * (X1 - X0); }
    n.dessin = function () {
      E.vider(g);
      // bande de la période d'émergence et de la guerre
      E.s("rect", { x: x(1920), y: 300, width: x(1930) - x(1920), height: 30, fill: PLATEFORME.teinte(0.25) }, g);
      D.ligne(g, [x(1925), 330], [x(1925), 528], C.jeu, 1.5, "3 4");
      D.texte(g, "émergence 1920–1930", [x(1925) - 6, 545], { taille: 15, coul: C.jeu, ancre: "end" });
      E.s("rect", { x: x(1939), y: 300, width: x(1945) - x(1939), height: 30, fill: "rgba(59,91,219,0.18)" }, g);
      D.ligne(g, [x(1942), 330], [x(1942), 553], "#3b5bdb", 1.5, "3 4");
      D.texte(g, "2e guerre mondiale", [x(1942) + 6, 570], { taille: 15, coul: "#3b5bdb", ancre: "start" });
      D.fleche(g, [X0 - 10, 315], [X1 + 30, 315], C.encre, 4);
      [1860, 1880, 1900, 1920, 1940, 1960].forEach(function (a) { D.ligne(g, [x(a), 305], [x(a), 325], C.encre, 2); D.texte(g, String(a), [x(a), 343], { taille: 14, mono: true, gras: false, coul: C.doux }); });
      EV.forEach(function (e, i) {
        if (i >= n.vus) return;
        var haut = i % 2 === 0, y = haut ? 200 : 440, p = [x(e.a), 315];
        D.ligne(g, p, [p[0], haut ? y + 34 : y - 34], n.surligne === i ? D.C.acc : C.gris, 2.5);
        D.rond(g, p, 9, { fill: n.surligne === i ? D.C.acc : C.jeu, stroke: "#fff", ep: 2 });
        D.texte(g, String(e.a), [p[0], y - 28], { taille: 18, mono: true });
        D.texte(g, e.t, [p[0], y], { taille: 17 });
        D.texte(g, e.d, [p[0], y + 22], { taille: 14, coul: C.doux, gras: false });
      });
    };
    n.EV = EV;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Dans l'ordre", jouer: function (j, n) {
      j.fig.astuce("La frise se remplit au fil du niveau.");
      j.titre("Range ces quatre plastiques dans l'ordre de leur apparition.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center;font-size:18px">' +
        ["1869", "1907", "1935", "1953"].map(function (a, i) { return "<b>" + a + '</b><span class="trou" data-attendu="' + i + '" style="min-width:260px;min-height:50px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "2", html: "nylon (brosse à dents)" }, { id: "0", html: "celluloïd" }, { id: "3", html: "Corvette en polyester et fibres de verre" }, { id: "1", html: "Bakélite" }],
        aide: "Le celluloïd est un dérivé de la cellulose, au XIXe siècle ; la Bakélite précède la Première Guerre mondiale ; la voiture « plastique » vient après la Seconde.",
        ok: function () {
          n.vus = 5; n.dessin();
          j.bravo("Celluloïd, Bakélite, nylon, Corvette.");
          j.expliquer("<p>Les polymères ne datent pas d'hier, mais leur réelle émergence se situe vers 1920–1930, avec un fort développement à partir de la Seconde Guerre mondiale.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le celluloïd", jouer: function (j, n) {
      n.surligne = 0; n.dessin();
      j.titre("1869 : les frères Hyatt inventent le celluloïd (nitration de la cellulose du bois, avec du camphre, à chaud). Quel besoin cherchaient-ils à combler ?");
      j.choix([
        { html: "Remplacer l'ivoire des boules de billard, sous embargo pendant la guerre de Sécession", juste: true },
        { html: "Fabriquer des pneus", aide: "Les pneus viennent du caoutchouc (chapitre 4)." },
        { html: "Isoler les câbles électriques", aide: "Pense à la matière rare qu'on voulait imiter à l'époque : une matière animale." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le premier plastique remplace l'ivoire.");
        j.expliquer("<p>En 1890, le celluloïd sert aussi de support aux pellicules photographiques et aux films.</p>");
        j.suite();
      } });
    } },
    { nom: "La Bakélite", jouer: function (j, n) {
      n.surligne = 2; n.dessin();
      j.titre("1907 : Baekeland crée la Bakélite à partir de phénol et de formaldéhyde. Pourquoi est-elle une étape ?");
      j.choix([
        { html: "C'est le premier thermodurcissable complètement synthétique commercialisé", juste: true },
        { html: "C'est le premier polymère naturel", aide: "Elle est entièrement synthétique, faite de phénol et de formaldéhyde." },
        { html: "C'est le premier élastomère", aide: "La Bakélite est dure et ne se ramollit pas : quelle famille du chapitre ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("Premier thermodurcissable entièrement synthétique.");
        j.expliquer("<p>Production industrielle dès 1910 : radios, téléphones, fers, dominos, boutons, et même une lampe médicale (Osram Theratherm, 1960).</p>");
        j.suite();
      } });
    } },
    { nom: "Le nylon", jouer: function (j, n) {
      n.surligne = 3; n.dessin();
      j.titre("1935 : Wallace Hume Carothers (Du Pont de Nemours) invente le nylon. Quelle fut sa première commercialisation ?");
      j.choix([
        { html: "Une brosse à dents à poils en nylon", juste: true },
        { html: "Une seringue", aide: "Pense à un objet de salle de bain de tous les jours." },
        { html: "Une carrosserie de voiture", aide: "La carrosserie plastique, c'est la Corvette, en polyester." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La brosse à dents.");
        j.expliquer("<p>Deux nylons sont cités : nylon 66 et nylon 6. On les retrouve ensuite dans l'automobile.</p>");
        j.suite();
      } });
    } },
    { nom: "1953", jouer: function (j, n) {
      n.surligne = 4; n.dessin();
      j.titre("Trois événements de 1953 : associe chacun à sa description.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:17px">' +
        '<span>Concept de macromolécule (début du XXe siècle), prix Nobel de chimie</span><span class="trou" data-attendu="s" style="min-width:150px"></span>' +
        '<span>« The plastic car » en résine polyester et fibres de verre</span><span class="trou" data-attendu="c" style="min-width:150px"></span>' +
        '<span>HDPE, mis en forme par extrusion-soufflage (bouteilles, réservoirs)</span><span class="trou" data-attendu="z" style="min-width:150px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "z", html: "Ziegler" }, { id: "s", html: "Staudinger" }, { id: "c", html: "Corvette" }],
        aide: "Staudinger est le chimiste de la macromolécule ; Ziegler celui du polyéthylène haute densité ; la Corvette est une voiture.",
        ok: function () {
          j.bravo("Staudinger, Corvette, Ziegler.");
          j.expliquer("<p>La Corvette est fabriquée par laminage (hand lay-up). Aujourd'hui, les polymères sont utilisés presque partout : automobile, laboratoire, poches de perfusion, inhalateurs.</p>");
          j.suite();
        }
      });
    } }
  ]
});
