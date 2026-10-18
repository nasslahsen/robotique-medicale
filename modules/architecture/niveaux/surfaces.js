/* Niveau : sols (diapo 22), murs (diapos 23 et 24), plafond (diapo 25), portes (diapo 26). */
NIVEAU({
  id: "surfaces",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "trois", sol: null, trouves: {}, faux: -1, porte: 0, g: g, pl: { P: function (v) { return v; } } };
    n.DEF = [
      { id: "joint", c: [150, 250], ok: true, nom: "joint ouvert" }, { id: "angle", c: [612, 470], ok: true, nom: "angle difficile à nettoyer" },
      { id: "poreux", c: [430, 200], ok: true, nom: "surface poreuse" }, { id: "deco", c: [540, 150], ok: true, nom: "élément décoratif inutile" },
      { id: "prise", c: [300, 400], ok: false }, { id: "lisse", c: [150, 420], ok: false }
    ];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "sols") {
        [["A", "Carrelage à joints", "joints ouverts entre les carreaux"], ["B", "Revêtement continu", "soudé, antidérapant, plinthe intégrée"], ["C", "Parquet verni", "bois, rainures entre les lames"]].forEach(function (e, i) {
          var x = 24 + i * 214, sel = n.sol === i, bon = sel && i === 1;
          A.boite(g, x, 70, 200, 470, { fond: "#fff", bord: sel ? (bon ? C.ok : C.ko) : C.trait, ep: sel ? 4 : 2 });
          A.texte(g, e[0], [x + 100, 104], { taille: 26, gras: 800, halo: false });
          // échantillon
          if (i === 0) for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) A.s("rect", { x: x + 22 + c * 54, y: 140 + r * 54, width: 48, height: 48, fill: "#e9edf3", stroke: "#b8bfce", "stroke-width": 1.5 }, g);
          if (i === 1) { A.s("rect", { x: x + 22, y: 140, width: 156, height: 210, rx: 4, fill: "#dfe8f2" }, g); A.s("path", { d: "M" + (x + 22) + " 350 Q" + (x + 22) + " 380 " + (x + 52) + " 380 H" + (x + 178), fill: "none", stroke: "#9fb4cc", "stroke-width": 10 }, g); }
          if (i === 2) for (var k = 0; k < 6; k++) A.s("rect", { x: x + 22, y: 140 + k * 35, width: 156, height: 30, fill: "#e8c99a", stroke: "#b8935e", "stroke-width": 1.5 }, g);
          A.texte(g, e[1], [x + 100, 420], { taille: 17, largeur: 180, halo: false });
          A.texte(g, e[2], [x + 100, 475], { taille: 14, largeur: 180, coul: C.doux, halo: false, gras: 500 });
          A.cible(g, x, 70, 200, 470, function () { if (n.surSol) n.surSol(i); });
        });
      } else if (n.mode === "murs") {
        // élévation d'un mur de salle
        A.s("rect", { x: 40, y: 70, width: 600, height: 440, fill: "#f4f6fa", stroke: C.encre, "stroke-width": 4 }, g);
        A.s("rect", { x: 40, y: 500, width: 600, height: 50, fill: "#dfe3ea" }, g);
        // panneaux lisses, dont un joint ouvert
        A.s("line", { x1: 240, y1: 70, x2: 240, y2: 500, stroke: "#c7cdd8", "stroke-width": 2 }, g);
        A.s("rect", { x: 140, y: 200, width: 18, height: 110, fill: "#5b6172" }, g);
        // zone poreuse : enduit brut
        for (var i = 0, gr = 11; i < 80; i++) { gr = (gr * 9301 + 49297) % 233280; var px = gr / 233280; gr = (gr * 9301 + 49297) % 233280; A.s("circle", { cx: 358 + px * 144, cy: 146 + gr / 233280 * 112, r: 3, fill: "#b9aa8f" }, g); }
        A.s("rect", { x: 352, y: 140, width: 156, height: 124, fill: "none", stroke: "#b9aa8f", "stroke-width": 2 }, g);
        // cadre décoratif mouluré
        A.s("rect", { x: 510, y: 110, width: 110, height: 80, fill: "none", stroke: "#8a6d3b", "stroke-width": 7 }, g);
        A.s("rect", { x: 525, y: 125, width: 80, height: 50, fill: "#e8d9b5" }, g);
        // angle vif avec recoin
        A.s("path", { d: "M580 500 L640 440 L640 500 Z", fill: "#c9ced8" }, g);
        // prise étanche et panneau lisse
        A.s("rect", { x: 280, y: 380, width: 40, height: 40, rx: 6, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
        n.DEF.forEach(function (p, i) {
          var t = n.trouves[p.id], f = n.faux === i;
          A.s("circle", { cx: p.c[0], cy: p.c[1], r: 22, fill: t ? C.ko : f ? "#fff" : "rgba(59,91,219,.12)", stroke: t ? "#fff" : f ? C.gris : C.acc, "stroke-width": 3 }, g);
          A.texte(g, t ? "!" : "?", p.c, { taille: 20, coul: t ? "#fff" : f ? C.gris : C.acc, halo: false, gras: 800 });
          if (t) A.texte(g, p.nom, [p.c[0] + (p.c[0] > 560 ? 20 : 0), p.c[1] + 36], { taille: 14, coul: C.ko, ancre: p.c[0] > 560 ? "end" : "middle" });
          A.cible(g, p.c[0] - 32, p.c[1] - 32, 64, 64, function () { if (n.surDef) n.surDef(i); });
        });
      } else if (n.mode === "porte") {
        // salle en surpression, porte entre la salle et le couloir
        A.boite(g, 30, 90, 330, 420, { fond: A.ZONES.restreinte.fond, bord: A.ZONES.restreinte.bord, titre: "", ep: 3 });
        A.texte(g, "Salle d'opération", [195, 120], { taille: 18, halo: false });
        A.texte(g, "pression +", [195, 150], { taille: 16, coul: C.ko, halo: false });
        A.boite(g, 400, 90, 250, 420, { fond: A.ZONES.semi.fond, bord: A.ZONES.semi.bord, titre: "", ep: 3 });
        A.texte(g, "Couloir", [525, 120], { taille: 18, halo: false });
        A.texte(g, "pression plus basse", [525, 150], { taille: 16, coul: C.acc, halo: false });
        var ouv = n.porte;
        A.s("rect", { x: 360, y: 240, width: 40, height: 120, fill: "#fff" }, g);
        A.s("rect", { x: 362, y: 240 - ouv * 110, width: 36, height: 120, rx: 4, fill: "#c9d3e6", stroke: C.encre, "stroke-width": 2.5 }, g);
        if (ouv > 0.3) for (var k = 0; k < 4; k++) A.fleche(g, [300, 260 + k * 28], [460 + k * 6, 260 + k * 28], { coul: C.acc, ep: 3.5 });
        A.texte(g, ouv > 0.3 ? "porte ouverte : l'air sort de la salle" : "porte fermée", [340, 550], { taille: 17, coul: ouv > 0.3 ? C.acc : C.doux });
      } else {
        // trois surfaces : sol, murs, plafond, vue en coupe
        A.s("path", { d: "M60 120 H620 M60 120 V500 M620 120 V500 M60 500 H620", fill: "none", stroke: C.encre, "stroke-width": 6 }, g);
        A.texte(g, "Plafond", [340, 96], { taille: 18, gras: 800 }); A.texte(g, "Sol", [340, 528], { taille: 18, gras: 800 }); A.texte(g, "Mur", [90, 310], { taille: 18, gras: 800, ancre: "start" });
        A.icone(g, "lampe", [340, 170], 70, C.doux);
        A.icone(g, "table", [340, 440], 120, C.doux);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Sol, mur ou plafond ?", jouer: function (j, n) {
      j.titre("Chaque surface a ses exigences. Range ces propriétés.");
      var S = [["Antidérapant", "s"], ["Compatible avec les équipements plafonniers", "p"], ["Non poreux, sans fissures", "m"], ["Adapté au déplacement des équipements", "s"], ["Conçu pour éviter l'accumulation de poussières", "p"], ["Lisse et facile à entretenir", "m"]];
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 150px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "Plafond" }, { id: "s", html: "Sol" }, { id: "m", html: "Murs" }, { id: "s", html: "Sol" }, { id: "m", html: "Murs" }, { id: "p", html: "Plafond" }],
        aide: "On marche et on roule sur le sol ; les équipements sont suspendus au plafond, d'où tombe la poussière ; les murs se lavent.",
        ok: function () { j.bravo("Sol, plafond, murs : chacun ses exigences."); j.suite(); }
      });
    } },
    { nom: "Choisir un sol", jouer: function (j, n) {
      n.mode = "sols"; n.dessin();
      j.titre("Trois revêtements sont proposés pour la salle. Touche celui que tu retiens.");
      n.surSol = function (i) {
        n.sol = i; n.dessin();
        if (i === 0) { j.erreur("Les joints ouverts sont des fissures qui retiennent les contaminants : le cours demande des assemblages qui les limitent."); return; }
        if (i === 2) { j.erreur("Le bois est poreux et ses rainures retiennent les salissures ; il supporte mal l'eau et les désinfectants."); return; }
        n.surSol = null;
        j.bravo("Continu, antidérapant, plinthe intégrée.", [338, 300]);
        j.expliquer("<p>Le sol doit être <b>résistant</b>, <b>antidérapant</b>, <b>imperméable</b>, <b>facilement nettoyable</b>, <b>compatible avec les produits désinfectants</b>, <b>résistant aux chocs</b> et <b>adapté au déplacement des équipements</b>. Les assemblages doivent limiter les fissures et les zones qui retiennent les contaminants. Le FGI recommande des revêtements résistants et nettoyables et des plinthes intégrées dans les zones opératoires.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surSol) n.surSol(1); });
    } },
    { nom: "Les défauts du mur", jouer: function (j, n) {
      n.mode = "murs"; n.dessin();
      j.titre("Ce mur de salle a quatre défauts que le cours demande de limiter. Touche-les.");
      n.surDef = function (i) {
        var p = n.DEF[i];
        if (n.trouves[p.id]) return;
        if (!p.ok) { n.faux = i; n.dessin(); j.erreur("Ici, rien à reprocher : la surface est lisse et étanche. Cherche ce qui retient la saleté ou empêche de nettoyer."); return; }
        n.trouves[p.id] = true; n.faux = -1; n.dessin();
        if (Object.keys(n.trouves).length < 4) { j.info("Oui : " + p.nom + "."); return; }
        n.surDef = null;
        j.bravo("Joint ouvert, surface poreuse, élément décoratif, angle difficile à nettoyer.");
        j.expliquer("<p>Les murs doivent être lisses, lavables, résistants aux désinfectants, non poreux, sans fissures, faciles à entretenir. Il faut limiter les joints ouverts, les angles difficiles à nettoyer, les surfaces poreuses et les éléments décoratifs inutiles.</p>");
        j.suite();
      };
      j.reponse(function () { n.DEF.forEach(function (p, i) { if (p.ok && n.surDef) n.surDef(i); }); });
    } },
    { nom: "Le plafond", jouer: function (j, n) {
      n.mode = "trois"; n.dessin();
      j.titre("L'électricien veut percer le plafond de la salle pour passer un câble, puis laisser l'ouverture telle quelle. Que réponds-tu ?");
      j.choix([
        { html: "D'accord, c'est au-dessus du champ opératoire, ça ne gêne personne", aide: "Une ouverture non étanchée laisse tomber la poussière juste au-dessus du patient." },
        { html: "Les ouvertures techniques doivent être correctement intégrées et étanchées", juste: true },
        { html: "Il faut un faux plafond à dalles ajourées pour aérer", aide: "Le plafond doit être étanche et conçu pour éviter l'accumulation de poussières." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Ouvertures intégrées et étanchées.");
        j.expliquer("<p>Le plafond est particulièrement important. Il doit être <b>étanche</b>, <b>nettoyable</b>, <b>résistant aux produits de désinfection</b>, <b>conçu pour éviter l'accumulation de poussières</b> et <b>compatible avec les équipements plafonniers</b>. Le FGI précise les exigences relatives aux plafonds monolithiques et aux ouvertures d'accès dans les salles d'opération.</p>");
        j.suite();
      } });
    } },
    { nom: "La porte", jouer: function (j, n) {
      n.mode = "porte"; n.porte = 0; n.dessin();
      j.titre("Ouvre la porte de la salle et observe l'air. Puis choisis le type de porte.");
      var vu = false;
      j.curseur({ nom: "Ouverture", min: 0, max: 100, pas: 5, val: 0, unite: " %", change: function (v) { n.porte = v / 100; n.dessin(); if (v >= 50 && !vu) { vu = true; poser(); } } });
      function poser() {
        j.consigne("Pourquoi les recommandations de la Healthcare Infection Society insistent-elles sur des portes à fermeture automatique entre les zones ?");
        j.choix([
          { html: "Pour préserver la cascade de pression", juste: true },
          { html: "Pour économiser le chauffage", aide: "Ce n'est pas l'argument du cours. Regarde ce que fait l'air quand la porte reste ouverte." },
          { html: "Pour empêcher les patients de sortir", aide: "Regarde la figure : c'est l'air qui s'échappe tant que la porte reste ouverte." }
        ], { colonnes: 1, ok: function () {
          j.bravo("Une porte qui reste ouverte, c'est une pression qui s'effondre.");
          j.expliquer("<p>Les portes doivent permettre le passage du patient sur brancard et des équipements, offrir une ouverture suffisamment large et se nettoyer facilement. Dans les blocs modernes, on privilégie souvent les portes <b>automatiques</b>, <b>coulissantes</b>, à <b>commande sans contact</b> : on ne touche pas la poignée avec des gants stériles.</p>");
          j.suite();
        } });
      }
      j.reponse(function () { if (!vu) { vu = true; n.porte = 0.6; n.dessin(); poser(); } });
    } }
  ]
});
