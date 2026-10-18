/* Niveau : nanomédecine. Échelle de 1 à 100 nm, objets nanométriques, prévention, diagnostic, traitement, bénéfices. */
NIVEAU({
  id: "nanomedecine",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    // règle logarithmique : de 0,1 nm (10^-1 nm) à 100 µm (10^5 nm)
    var X0 = 60, X1 = 620, Y = 330, L0 = -1, L1 = 5;
    var n = { lg: 3, libre: false, surTaille: null, voir: true };
    function X(lg) { return X0 + (lg - L0) / (L1 - L0) * (X1 - X0); }
    n.X = X;
    function taille(lg) { var v = Math.pow(10, lg); return v < 1000 ? (v < 10 ? E.fmt(v, 1) : Math.round(v)) + " nm" : (v < 10000 ? E.fmt(v / 1000, 1) : Math.round(v / 1000)) + " µm"; }
    var OBJ = [[Math.log10(0.3), "molécule d'eau", 1], [Math.log10(2), "ADN (largeur)", 2], [Math.log10(100), "virus", 1], [Math.log10(1000), "bactérie", 2], [Math.log10(7000), "globule rouge", 1], [Math.log10(20000), "cellule", 2]];
    n.dessin = function () {
      E.vider(g);
      D.texte(g, "Échelle des tailles (chaque graduation : × 10)", [340, 70], { taille: 20 });
      E.s("rect", { x: X(0), y: Y - 130, width: X(2) - X(0), height: 190, rx: 12, fill: PLATEFORME.teinte(0.14), stroke: C.jeu, "stroke-width": 2 }, g);
      D.texte(g, "nanotechnologies : 1 à 100 nm", [(X(0) + X(2)) / 2, Y - 108], { taille: 16, coul: C.jeu });
      D.ligne(g, [X0, Y], [X1, Y], C.encre, 4);
      for (var l = L0; l <= L1; l++) {
        D.ligne(g, [X(l), Y - 10], [X(l), Y + 10], C.encre, 3);
        D.texte(g, taille(l), [X(l), Y + 32], { taille: 15, mono: true, coul: C.doux });
      }
      if (n.voir) OBJ.forEach(function (o) {
        var x = X(o[0]), y = o[2] === 1 ? Y - 50 : Y - 82;
        D.ligne(g, [x, Y], [x, y + 10], C.gris, 2, "4 4");
        D.rond(g, [x, Y], 6, { fill: "#8b3fd9" });
        D.texte(g, o[1], [x, y], { taille: 15, coul: "#8b3fd9" });
      });
      if (n.voir) D.texte(g, "tailles d'objets : exemple ajouté, ordres de grandeur", [340, 500], { taille: 14, coul: C.doux, gras: false });
      var xm = X(n.lg);
      D.ligne(g, [xm, Y + 46], [xm, Y + 90], "#3b5bdb", 4);
      if (n.libre) D.poignee(g, [xm, Y + 110], "#3b5bdb"); else D.rond(g, [xm, Y + 110], 12, { fill: "#3b5bdb", stroke: "#fff", ep: 3 });
      fig.chip(taille(n.lg));
    };
    D.glisser(fig.svg, {
      debut: function (p) { return n.libre && p[1] > Y + 40; },
      bouge: function (p) { if (!n.libre) return; n.lg = Math.max(L0, Math.min(L1, L0 + (p[0] - X0) / (X1 - X0) * (L1 - L0))); n.dessin(); },
      fin: function () { if (n.libre && n.surTaille) n.surTaille(Math.pow(10, n.lg)); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Viser 50 nm", jouer: function (j, n) {
      n.libre = true; n.voir = false; n.dessin();
      j.fig.astuce("Fais glisser la poignée bleue sous la règle. L'échelle est logarithmique.");
      j.titre("Un agent de contraste fait de nanoparticules de 50 nm. Place la poignée sur 50 nm.");
      n.surTaille = function (v) {
        if (!n.libre) return;
        if (v < 35 || v > 70) { j.erreur(v < 35 ? "Trop petit : 50 nm se trouve entre les graduations 10 nm et 100 nm, plus près de 100 nm. Regarde la puce en haut à droite." : "Trop grand : 50 nm se trouve avant la graduation 100 nm."); return; }
        n.libre = false; n.lg = Math.log10(50); n.voir = true; n.dessin();
        j.bravo("50 nm : en plein dans la zone des nanotechnologies.");
        j.expliquer("<p>Au sens strict, les <b>nanotechnologies</b> touchent à l'échelle atomique, moléculaire ou macromoléculaire pour créer des structures, dispositifs et systèmes de 1 à 100 nanomètres. Elles concernent aussi des éléments micrométriques quand la miniaturisation leur donne de nouvelles propriétés.</p>");
        j.suite();
      };
      j.reponse(function () { n.lg = Math.log10(50); n.dessin(); n.surTaille(50); });
    } },
    { nom: "Hors de l'échelle", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Lequel de ces objets n'est pas nanométrique au sens strict ?");
      j.choix([{ html: "Une nanoparticule de 20 nm", aide: "20 nm est entre 1 et 100 nm." }, { html: "L'ADN, 2 nm de large", aide: "2 nm est dans la zone colorée." }, { html: "Un globule rouge, 7 µm", juste: true }], { colonnes: 1, ok: function () {
        j.bravo("7 µm = 7000 nm : bien au-delà de 100 nm.");
        j.suite();
      } });
    } },
    { nom: "Prévenir, diagnostiquer, traiter", jouer: function (j, n) {
      j.titre("Range ces applications de la nanomédecine.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:16px"><b>Prévention</b><b>Diagnostic</b><b>Traitement</b><span class="trou" data-attendu="p"></span><span class="trou" data-attendu="d"></span><span class="trou" data-attendu="t"></span><span class="trou" data-attendu="p"></span><span class="trou" data-attendu="d"></span><span class="trou" data-attendu="t"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "d", html: "Agent de contraste" }, { id: "t", html: "Ciblage d'un médicament" }, { id: "p", html: "Filtre de crème solaire" }, { id: "d", html: "Biocapteur" }, { id: "p", html: "Revêtement anti-infection" }, { id: "t", html: "Délivrance de gènes" }],
        aide: "Prévention : filtres cosmétiques dermiques, revêtements contre les infections. Diagnostic : bioessais, nanoarrays, biocapteurs, imagerie, agents de contraste. Traitement : ciblage, suivi, délivrance de médicaments ou de gènes.",
        ok: function () {
          j.bravo("Prévention, diagnostic in vitro et in vivo, traitement.");
          j.expliquer("<p>Les domaines médicaux concernés sont variés : chimiothérapie, radiothérapie, chirurgie, imagerie médicale (capteurs, IRM). Les nanomatériaux servent aussi à revêtir des implants et comme « outils théranostiques », à la fois pour le diagnostic et la thérapie.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Une de ces phrases sur les bénéfices de la nanomédecine est fausse. Laquelle ?");
      j.choix([
        { html: "Le seuil de détection est amélioré : les pathologies sont détectées plus tôt", aide: "C'est bien un bénéfice du cours. Cherche celle qui contredit le ciblage." },
        { html: "Les nanomatériaux obligent à augmenter les doses d'agents thérapeutiques", juste: true },
        { html: "La chirurgie est moins invasive et les effets secondaires diminuent", aide: "C'est un bénéfice cité par le cours." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Au contraire : un meilleur ciblage permet de diminuer les doses.");
        j.expliquer("<p>Bénéfices : diagnostic plus précis et moins coûteux, détection plus précoce, imagerie plus performante, ciblage plus efficace et plus spécifique, chirurgie moins invasive, effets secondaires réduits. Les spécialités concernées : oncologie, maladies métaboliques et infectieuses, cardiologie, hématologie, maladies neurodégénératives.</p>");
        j.suite();
      } });
    } }
  ]
});
