/* Niveau : fluides médicaux (diapo 40), vide médical (diapo 41), évacuation des gaz anesthésiques (diapo 42). */
NIVEAU(ARCHI.rejouable({
  id: "fluides-medicaux",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "fluides", prise: null, g: g, pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "prises") {
        // salle vue de dessus : table, machine d'anesthésie, bras plafonnier
        A.s("rect", { x: 30, y: 60, width: 620, height: 500, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.s("rect", { x: 300, y: 220, width: 80, height: 240, rx: 10, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
        A.texte(g, "Table opératoire", [340, 480], { taille: 15 });
        A.boite(g, 270, 100, 140, 70, { fond: C.vPale, bord: C.v, titre: "Machine d'anesthésie", taille: 14 });
        A.s("circle", { cx: 480, cy: 210, r: 34, fill: "none", stroke: C.doux, "stroke-width": 3, "stroke-dasharray": "6 5" }, g);
        A.texte(g, "bras plafonnier", [480, 260], { taille: 14, coul: C.doux });
        var P = { a: [480, 210], b: [60, 520], c: [620, 520] };
        ["a", "b", "c"].forEach(function (k) {
          var sel = n.prise === k, ok = sel && k === "a";
          A.s("circle", { cx: P[k][0], cy: P[k][1], r: 22, fill: sel ? (ok ? C.ok : C.ko) : "#fff", stroke: sel ? "#fff" : C.acc, "stroke-width": 3 }, g);
          A.texte(g, k.toUpperCase(), P[k], { taille: 17, coul: sel ? "#fff" : C.acc, halo: false, gras: 800 });
          A.cible(g, P[k][0] - 34, P[k][1] - 34, 68, 68, function () { if (n.surPrise) n.surPrise(k); });
        });
        if (n.prise === "a") A.s("path", { d: "M470 200 Q420 140 410 135", fill: "none", stroke: C.ok, "stroke-width": 4 }, g);
        if (n.prise === "b") A.s("path", { d: "M80 510 Q200 420 280 160", fill: "none", stroke: C.ko, "stroke-width": 4, "stroke-dasharray": "8 6" }, g);
        if (n.prise === "c") A.s("path", { d: "M600 510 Q500 400 410 160", fill: "none", stroke: C.ko, "stroke-width": 4, "stroke-dasharray": "8 6" }, g);
      } else if (n.mode === "vide") {
        A.boite(g, 250, 230, 180, 120, { fond: C.fond, bord: C.encre, titre: "Vide médical", taille: 20 });
      } else {
        // panneau de prises murales : une prise par fluide
        var F = [["O₂", "#12a26b"], ["Air médical", "#e8a317"], ["Vide médical", "#5b6172"], ["N₂O", "#3b5bdb"], ["Évacuation des gaz anesthésiques", "#b4233c"], ["Air instrumental", "#0f8a9d"]];
        A.texte(g, "Fluides d'un bloc opératoire", [340, 60], { taille: 18, gras: 800 });
        F.forEach(function (f, i) {
          var x = 40 + (i % 3) * 206, y = 100 + Math.floor(i / 3) * 210;
          A.boite(g, x, y, 186, 180, { fond: "#fff", bord: f[1], ep: 3 });
          A.s("circle", { cx: x + 93, cy: y + 66, r: 34, fill: "#fff", stroke: f[1], "stroke-width": 6 }, g);
          A.s("circle", { cx: x + 93, cy: y + 66, r: 10, fill: f[1] }, g);
          A.texte(g, f[0], [x + 93, y + 140], { taille: 15, largeur: 170, halo: false });
        });
        A.texte(g, "Couleurs choisies pour le schéma, pas celles d'une norme", [340, 560], { taille: 14, coul: C.doux });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "À quoi sert chaque fluide ?", jouer: function (j, n) {
      n.mode = "vide-paires"; ARCHI.vider(n.g);
      j.titre("Un bloc opératoire nécessite généralement plusieurs fluides. Relie chacun à son usage.");
      var F = ["O₂", "Vide médical", "Évacuation des gaz anesthésiques", "N₂O, parfois", "Air instrumental, éventuellement"];
      var U = ["Faire tourner certains instruments chirurgicaux", "Selon la politique d'anesthésie", "Aspiration chirurgicale et anesthésique", "Oxygéner le patient", "Limiter l'exposition de l'équipe aux agents anesthésiques"];
      var pa = ARCHI.paires({ g: n.g, gauche: F, droite: U, bon: [3, 2, 4, 1, 0], xg: 20, wg: 250, xd: 310, wd: 350, y0: 60, h: 88, pas: 106, taille: 16, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le gaz que respire le patient en plus de l'air.", "Il aspire.", "Il emporte ce qui s'échappe du circuit d'anesthésie.", "Le cours ne l'impose pas : il dépend d'un choix de l'équipe.", "C'est de l'air qui fait travailler un outil."][i]; },
        fin: function () {
          n.mode = "fluides"; n.dessin();
          j.bravo("O₂, air médical, vide médical, parfois N₂O, évacuation des gaz anesthésiques, éventuellement air instrumental.");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Où placer les prises ?", jouer: function (j, n) {
      n.mode = "prises"; n.prise = null; n.dessin();
      j.titre("La machine d'anesthésie a besoin d'O₂, d'air médical et de vide. Où places-tu ses prises ? Touche A, B ou C.");
      n.surPrise = function (k) {
        n.prise = k; n.dessin();
        if (k !== "a") { j.erreur("Le tuyau traverserait la salle et passerait au sol, dans les pieds de l'équipe."); return; }
        n.surPrise = null;
        j.bravo("Sur le bras plafonnier, à côté de la machine.");
        j.expliquer("<p>Les prises doivent être positionnées selon la <b>table opératoire</b>, la <b>machine d'anesthésie</b>, le <b>bras plafonnier</b> et les <b>équipements spécialisés</b>. Une prise mal placée crée des tuyaux au sol, un obstacle et un risque de débranchement.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surPrise) n.surPrise("a"); });
    } },
    { nom: "Le vide médical", jouer: function (j, n) {
      n.mode = "vide"; n.dessin();
      j.titre("Range ces éléments du vide médical : ses utilisations, et ce qu'il faut prévoir.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><b>Utilisations</b><b>À prévoir</b>' +
        '<span class="trou" data-attendu="u"></span><span class="trou" data-attendu="p"></span><span class="trou" data-attendu="u"></span><span class="trou" data-attendu="p"></span>' +
        '<span class="trou" data-attendu="u"></span><span class="trou" data-attendu="p"></span><span></span><span class="trou" data-attendu="p"></span></div>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "Alarmes" }, { id: "u", html: "Aspiration chirurgicale" }, { id: "p", html: "Source de secours" }, { id: "u", html: "Certains drainages" }, { id: "p", html: "Réseau et vannes" }, { id: "u", html: "Aspiration anesthésique" }, { id: "p", html: "Maintenance" }],
        aide: "Une utilisation, c'est un geste de soin. Ce qu'il faut prévoir, c'est l'installation qui le rend possible et sûr.",
        ok: function () {
          j.bravo("Trois utilisations, et une installation complète : réseau, vannes, alarmes, source de secours, maintenance.");
          j.expliquer("<p>Le vide médical sert à l'aspiration chirurgicale, à l'aspiration anesthésique et à certains dispositifs de drainage. Comme l'électricité, il lui faut une <b>source de secours</b> : une aspiration qui s'arrête pendant un saignement est un danger immédiat.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Les gaz anesthésiques", jouer: function (j, n) {
      j.titre("L'évacuation des gaz anesthésiques doit être étudiée dès la conception. Avec quels éléments ? Trouve l'intrus.");
      j.choix([
        { html: "Système d'évacuation et raccordements", aide: "Ils sont dans la liste du cours." },
        { html: "Débit et alarmes", aide: "Ils sont dans la liste du cours." },
        { html: "Couleur des tuyaux de la salle d'attente", juste: true },
        { html: "Maintenance", aide: "Elle est dans la liste du cours." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Système d'évacuation, raccordements, débit, alarmes, maintenance.");
        j.expliquer("<p>L'évacuation des gaz anesthésiques permet de <b>limiter l'exposition professionnelle aux agents anesthésiques</b>. Ne pas intégrer les fluides médicaux dès la conception fait partie des erreurs fréquentes du cours.</p>");
        j.suite();
      } });
    } }
  ]
}));
