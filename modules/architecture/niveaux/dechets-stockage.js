/* Niveau : gestion des déchets (diapo 51) et local de stockage (diapo 52). Tri à la source, circuit, capacités, problèmes à éviter. */
NIVEAU(ARCHI.rejouable({
  id: "dechets-stockage",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "tri", objet: 0, faux: -1, route: null, g: g, pl: { P: function (v) { return v; } } };
    // Cinq filières du cours
    n.FIL = [
      { t: "DASRI", c: "#e8a317", ic: "bouclier" }, { t: "Assimilables aux déchets ménagers", c: "#5b6172", ic: "poubelle" },
      { t: "Objets piquants / coupants", c: "#8b3fd9", ic: "instrument" }, { t: "Déchets anatomiques (selon réglementation)", c: "#e5484d", ic: "boite" },
      { t: "Déchets chimiques éventuels", c: "#0f8a9d", ic: "goutte" }
    ];
    // Objets à trier (exemples ajoutés) et leur filière
    n.OBJ = [
      { t: "Compresse imbibée de sang", f: 0 }, { t: "Aiguille de suture usagée", f: 2 },
      { t: "Emballage papier d'un set, non souillé", f: 1 }, { t: "Pièce opératoire d'amputation", f: 3 },
      { t: "Reste de formol, fixateur de prélèvements", f: 4 }
    ];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "tri") {
        var o = n.OBJ[n.objet];
        if (o) {
          A.boite(g, 140, 50, 400, 100, { fond: "#fff", bord: C.encre, ep: 3, titre: o.t, taille: 20 });
          A.texte(g, "objet " + (n.objet + 1) + " / " + n.OBJ.length, [340, 172], { taille: 15, coul: C.doux });
        } else A.texte(g, "Tout est trié à la source", [340, 100], { taille: 22, coul: C.ok, gras: 800 });
        n.FIL.forEach(function (f, i) {
          var x = 20 + (i % 3) * 220, y = i < 3 ? 210 : 400, w = 200, h = 170, faux = n.faux === i;
          if (i >= 3) x += 110;
          // bac : corps et couvercle
          A.s("path", { d: "M" + (x + 20) + " " + (y + 40) + " H" + (x + w - 20) + " L" + (x + w - 32) + " " + (y + h) + " H" + (x + 32) + " Z", fill: faux ? C.koPale : "#fff", stroke: faux ? C.ko : f.c, "stroke-width": 3.5, "stroke-linejoin": "round" }, g);
          A.s("rect", { x: x + 10, y: y + 22, width: w - 20, height: 18, rx: 6, fill: f.c }, g);
          A.icone(g, f.ic, [x + w / 2, y + 72], 32, f.c);
          A.texte(g, f.t, [x + w / 2, y + 124], { taille: 15, largeur: w - 50, halo: false });
          A.cible(g, x, y, w, h, function () { if (n.surBac) n.surBac(i); });
        });
      } else if (n.mode === "circuit") {
        var Z = A.ZONES;
        A.boite(g, 20, 60, 200, 150, { titre: "Salle d'opération", fond: Z.restreinte.fond, bord: Z.restreinte.bord });
        A.boite(g, 250, 60, 180, 150, { titre: "Stockage stérile", fond: C.okPale, bord: C.propre });
        A.boite(g, 460, 60, 200, 150, { titre: "Local déchets", fond: "#fbeee6", bord: C.sale });
        A.s("rect", { x: 20, y: 230, width: 640, height: 70, rx: 8, fill: Z.semi.fond, stroke: Z.semi.bord, "stroke-width": 2 }, g);
        A.texte(g, "Circulation du personnel", [470, 250], { taille: 15, coul: Z.semi.texte, halo: false });
        A.s("rect", { x: 20, y: 330, width: 640, height: 70, rx: 8, fill: "#fbeee6", stroke: C.sale, "stroke-width": 2 }, g);
        A.texte(g, "Circuit sale dédié", [470, 350], { taille: 15, coul: C.sale, halo: false });
        var R = {
          a: [[222, 96], [458, 96]],
          b: [[120, 212], [120, 276], [560, 276], [560, 212]],
          c: [[90, 212], [90, 376], [600, 376], [600, 212]]
        };
        ["a", "b", "c"].forEach(function (k, i) {
          var sel = n.route === k, ok = sel && k === "c";
          A.chemin(g, R[k], { coul: ok ? C.ok : sel ? C.ko : [C.gris, C.gris, C.gris][i], ep: sel ? 6 : 3.5, tirets: sel ? null : "9 7" });
          var lab = k === "a" ? [340, 96] : k === "b" ? [240, 276] : [240, 376];
          A.s("circle", { cx: lab[0], cy: lab[1], r: 20, fill: sel ? (ok ? C.ok : C.ko) : "#fff", stroke: sel ? "#fff" : C.encre, "stroke-width": 3 }, g);
          A.texte(g, k.toUpperCase(), [lab[0], lab[1]], { taille: 17, coul: sel ? "#fff" : C.encre, halo: false, gras: 800 });
          A.cible(g, lab[0] - 35, lab[1] - 32, 70, 64, function () { if (n.surRoute) n.surRoute(k); });
        });
        A.icone(g, "poubelle", [60, 180], 30, C.sale);
        A.texte(g, "Touche A, B ou C", [340, 450], { taille: 16, coul: C.doux });
      } else {
        // local de stockage : quatre situations
        A.texte(g, "Quatre situations dans le local de stockage", [340, 40], { taille: 17, coul: C.doux });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Trier à la source", jouer: function (j, n) {
      j.titre("Les déchets doivent être triés à la source, au bloc. Mets chaque objet dans sa filière.");
      j.consigne("Touche le bon bac sur la figure. Les objets sont des exemples ajoutés.");
      n.surBac = function (i) {
        var o = n.OBJ[n.objet];
        if (!o) return;
        if (i !== o.f) {
          n.faux = i; n.dessin();
          j.erreur(["Est-il contaminé par du sang ou un liquide biologique ?", "Ce déchet ne présente aucun risque particulier : où vont les déchets ordinaires ?", "Peut-il percer ou couper ?", "Est-ce une partie du corps ?", "Est-ce un produit chimique ?"][o.f]);
          return;
        }
        n.faux = -1; n.objet++; n.dessin();
        if (n.objet < n.OBJ.length) { j.info("Bien. Objet suivant."); return; }
        n.surBac = null;
        j.bravo("Cinq filières, cinq bons bacs.");
        j.expliquer("<p>Le cours cite les <b>DASRI</b> (déchets d'activités de soins à risques infectieux), les déchets assimilables aux déchets ménagers, les objets piquants / coupants, les déchets anatomiques selon la réglementation et les déchets chimiques éventuels. Trier à la source, c'est trier là où le déchet est produit : chaque filière a ensuite son circuit.</p>");
        j.suite();
      };
      j.reponse(function () { while (n.surBac && n.OBJ[n.objet]) n.surBac(n.OBJ[n.objet].f); });
    } },
    { nom: "Le circuit des déchets", jouer: function (j, n) {
      n.mode = "circuit"; n.route = null; n.dessin();
      j.titre("Le sac DASRI doit rejoindre le local déchets. Quel trajet choisis-tu ?");
      n.surRoute = function (k) {
        n.route = k; n.dessin();
        if (k === "a") { j.erreur("Ce trajet traverse le stockage stérile : le contaminé croiserait le flux le plus propre."); return; }
        if (k === "b") { j.erreur("Possible, mais il emprunte la circulation du personnel, celle du propre et des patients. Il existe un circuit dédié."); return; }
        n.surRoute = null;
        j.bravo("Le circuit sale dédié : aucun croisement avec le propre.");
        j.expliquer("<p>Le circuit des déchets doit être organisé afin d'<b>éviter que les déchets contaminés ne croisent les flux propres</b>. C'est la même règle que pour le flux sale : il ne traverse pas inutilement les zones propres.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surRoute) n.surRoute("c"); });
    } },
    { nom: "Quatre problèmes de stockage", jouer: function (j, n) {
      n.mode = "stockage"; n.dessin();
      j.titre("Le stockage doit être organisé pour éviter quatre problèmes. Relie chaque situation au problème qu'elle montre.");
      var S = ["Des cartons de livraison encore sales posés sur les étagères de matériel stérile", "Des chariots garés dans le couloir faute de place", "Plus aucun champ opératoire à 10 h, le programme est arrêté", "Des étagères pleines au point que les boîtes tombent"];
      var P = ["Obstruction des circulations", "Surcharge", "Contamination", "Rupture de stock"];
      var pa = ARCHI.paires({ g: n.g, gauche: S, droite: P, bon: [2, 0, 3, 1], xg: 20, wg: 380, xd: 450, wd: 210, y0: 70, h: 104, pas: 128, taille: 15, tailleD: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Que risque un objet stérile au contact d'un carton venu de l'extérieur ?", "Que devient un couloir encombré pour un brancard ?", "Que s'est-il passé dans le stock ?", "Le local reçoit-il plus que ce qu'il peut contenir ?"][i]; },
        fin: function () {
          j.bravo("Contamination, obstruction, rupture de stock, surcharge.");
          j.expliquer("<p>Le cours demande d'éviter : <b>surcharge</b>, <b>obstruction des circulations</b>, <b>contamination</b>, <b>rupture de stock</b>. Un couloir encombré est aussi un problème d'ergonomie et de sécurité : il gêne l'évacuation.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Ce qu'il faut stocker", jouer: function (j, n) {
      j.titre("Le bloc doit avoir des capacités de stockage suffisantes. Laquelle de ces catégories n'est pas dans la liste du cours ?");
      j.choix([
        { html: "Dispositifs médicaux stériles", aide: "Ils sont dans la liste : ce sont eux qu'on protège le plus." },
        { html: "Champs opératoires", aide: "Ils sont dans la liste : il en faut à chaque intervention." },
        { html: "Archives administratives", juste: true },
        { html: "Équipements de secours", aide: "Ils sont dans la liste : ils doivent être à portée immédiate." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Les archives n'ont rien à faire dans le stockage du bloc.");
        j.expliquer("<p>Capacités suffisantes pour : dispositifs médicaux stériles, consommables, champs opératoires, médicaments, produits d'anesthésie, équipements de secours.</p>");
        j.suite();
      } });
    } }
  ]
}));
