/* Niveau : filtration de l'air (diapos 32 et 33), flux unidirectionnel / UCV (diapo 34). */
NIVEAU(ARCHI.rejouable({
  id: "filtration-ucv",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg), ga = A.s("g", null, fig.svg);
    var n = { mode: "gaine", u: 0, choix: null, g: g, pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g); A.vider(ga);
      fig.chip(null);
      if (n.mode === "ucv") {
        [["Salle conventionnelle", 24, false], ["Salle avec UCV", 356, true]].forEach(function (e) {
          var x = e[1], w = 300, sel = n.choix === (e[2] ? 1 : 0);
          A.s("rect", { x: x, y: 80, width: w, height: 400, rx: 10, fill: "#fff", stroke: sel ? (e[2] ? C.ok : C.ko) : C.encre, "stroke-width": sel ? 5 : 3 }, g);
          A.s("rect", { x: x, y: 80, width: w, height: 24, fill: "#d9e2ef" }, g);
          A.texte(g, "Plafond", [x + w / 2, 92], { taille: 13, halo: false });
          if (e[2]) A.s("rect", { x: x + 80, y: 104, width: 140, height: 300, fill: "#eaf1ff", stroke: C.acc, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
          A.s("rect", { x: x + 110, y: 380, width: 80, height: 14, fill: C.doux }, g);
          A.s("circle", { cx: x + 120, cy: 372, r: 9, fill: "#f6c2b0" }, g);
          A.texte(g, e[0], [x + w / 2, 512], { taille: 18, gras: 800 });
          A.texte(g, e[2] ? "air très propre descendant sur la zone opératoire" : "air filtré propre, extraction basse", [x + w / 2, 548], { taille: 14, coul: C.doux, largeur: 280 });
          A.cible(g, x, 80, w, 480, function () { if (n.surSalle) n.surSalle(e[2] ? 1 : 0); });
        });
        n.fleches();
      } else {
        // gaine de traitement d'air : quatre emplacements
        A.s("rect", { x: 30, y: 260, width: 620, height: 90, rx: 10, fill: C.fond, stroke: C.encre, "stroke-width": 3 }, g);
        A.texte(g, "air neuf", [40, 236], { taille: 15, coul: C.doux, ancre: "start" });
        A.texte(g, "vers la salle", [640, 236], { taille: 15, coul: C.doux, ancre: "end" });
        A.fleche(g, [40, 305], [90, 305], { coul: C.ok, ep: 5 }); A.fleche(g, [590, 305], [646, 305], { coul: C.acc, ep: 5 });
        (n.etages || []).forEach(function (t, i) {
          var x = 110 + i * 160;
          A.s("rect", { x: x, y: 268, width: 120, height: 74, rx: 6, fill: "#fff", stroke: t ? C.acc : C.gris, "stroke-width": 3, "stroke-dasharray": t ? null : "7 6" }, g);
          for (var k = 0; k < 7; k++) A.s("line", { x1: x + 12 + k * 16, y1: 274, x2: x + 12 + k * 16, y2: 336, stroke: t ? C.acc : C.pale, "stroke-width": t ? 1 + i : 1 }, g);
          A.texte(g, t || "?", [x + 60, 380], { taille: 15, largeur: 150, coul: t ? C.encre : C.gris });
        });
        A.texte(g, "Centrale de traitement d'air", [340, 180], { taille: 18, gras: 800 });
      }
    };
    n.fleches = function () {
      A.vider(ga);
      if (n.choix === null) return;
      var x = n.choix ? 356 : 24;
      if (n.u >= 1) {
        if (n.choix) [x + 100, x + 150, x + 200].forEach(function (q) { A.fleche(ga, [q, 120], [q, 350], { coul: C.acc, ep: 4 }); });
        else [x + 60, x + 150, x + 240].forEach(function (q) { A.fleche(ga, [q, 120], [q + (q - x - 150) * 0.4, 320], { coul: C.acc, ep: 4 }); });
        return;
      }
      if (n.choix) [x + 100, x + 150, x + 200].forEach(function (q) { A.souffle(ga, [q, 110], [q, 360], n.u, { nb: 1, vitesse: 3 }); });
      else [x + 60, x + 150, x + 240].forEach(function (q) { A.souffle(ga, [q, 110], [q + (q - x - 150) * 0.4, 330], n.u, { nb: 1 }); });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les étages de filtration", jouer: function (j, n) {
      n.etages = [null, null, null]; n.dessin();
      j.titre("Place les étages de filtration dans la centrale, dans l'ordre où l'air les traverse.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center"><b>1</b><span class="trou" data-attendu="p"></span><b>2</b><span class="trou" data-attendu="f"></span><b>3</b><span class="trou" data-attendu="h"></span></div>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "h", html: "HEPA, éventuellement, selon l'application" }, { id: "p", html: "Préfiltration" }, { id: "f", html: "Filtration fine" }],
        aide: "On arrête d'abord les grosses particules, pour protéger les filtres suivants, de plus en plus fins.",
        ok: function () {
          n.etages = ["Préfiltration", "Filtration fine", "HEPA (selon l'application)"]; n.dessin();
          j.bravo("Préfiltration, filtration fine, éventuellement HEPA.");
          j.expliquer("<p>La filtration dépend du <b>système CVC</b>, du <b>niveau de risque</b>, du <b>référentiel</b> et du <b>type de chirurgie</b>. La préfiltration protège les filtres plus fins, qui s'encrasseraient vite sans elle.</p>");
          j.suite();
        }
      });
    } },
    { nom: "HEPA obligatoire ?", jouer: function (j, n) {
      j.titre("Une affirmation circule : « Toute salle opératoire doit obligatoirement avoir un HEPA. » Vrai ?");
      j.choix([
        { html: "Vrai, dans tous les cas", aide: "Le cours la présente justement comme une erreur pédagogique fréquente." },
        { html: "Pas universellement exact : pour les salles conventionnelles, le HEPA n'est pas indispensable si la qualité d'air requise est obtenue avec une filtration appropriée", juste: true },
        { html: "Faux : le HEPA est interdit au bloc", aide: "Il n'est pas interdit : il est prévu « éventuellement, selon l'application »." }
      ], { colonnes: 1, ok: function () {
        j.bravo("C'est ce qu'indiquent les recommandations 2026 de la Healthcare Infection Society.");
        j.suite();
      } });
    } },
    { nom: "Le flux unidirectionnel", jouer: function (j, n) {
      n.mode = "ucv"; n.choix = null; n.dessin();
      j.titre("Une prothèse totale de hanche va être posée : chirurgie orthopédique avec implant, à haut risque. Quelle salle le cours associe-t-il à ce cas ? Touche-la.");
      n.surSalle = function (k) {
        n.choix = k; n.u = 0; n.dessin();
        ARCHI.animer(2400, function (u) { n.u = u; n.fleches(); });
        if (k === 0) { j.erreur("Pour certaines interventions à haut risque, comme certaines chirurgies orthopédiques avec implants, le cours cite un système plus poussé."); return; }
        n.surSalle = null;
        j.bravo("Une ultraclean ventilation (UCV) : flux unidirectionnel d'air très propre sur la zone opératoire.");
        j.expliquer("<p>Avec un flux unidirectionnel, l'air très propre descend d'un bloc sur le patient et la zone de chirurgie, puis est repris par l'extraction basse.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surSalle) n.surSalle(1); });
    } },
    { nom: "Partout ?", jouer: function (j, n) {
      j.titre("Faut-il équiper toutes les salles d'un flux laminaire pour prévenir les infections du site opératoire ?");
      j.choix([
        { html: "Oui, c'est la solution universelle", aide: "Le cours met en garde contre cette présentation." },
        { html: "Non : les preuves et les indications varient selon les types d'interventions", juste: true },
        { html: "Non, le flux laminaire augmente toujours les infections", aide: "Le cours ne dit pas cela : il dit que les preuves varient selon les interventions." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Ni universel, ni inutile : selon l'intervention.");
        j.expliquer("<p>Il ne faut pas présenter le flux laminaire comme une solution universelle de prévention des infections du site opératoire. Les recommandations internationales ont souligné que les preuves et indications varient selon les types d'interventions.</p>");
        j.suite();
      } });
    } }
  ]
}));
