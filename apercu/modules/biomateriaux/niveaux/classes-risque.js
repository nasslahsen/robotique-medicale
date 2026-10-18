/* Niveau : classes de risque des dispositifs médicaux (I, IIa, IIb, III). Escalier du risque, critères, exigences, marquage CE. */
NIVEAU({
  id: "classes-risque",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var CLASSES = ["I", "IIa", "IIb", "III"], RISQUE = ["faible", "moyen", "élevé", "le plus élevé"];
    var n = { objet: null, pose: null, faux: null, libre: false, surTape: null, tests: false };
    function marche(k) { return { x: 50 + k * 150, y: 470 - (k + 1) * 85, l: 150, h: (k + 1) * 85 }; }
    n.dessin = function () {
      E.vider(g);
      D.texte(g, "risque pour le patient", [70, 60], { ancre: "start", taille: 17, coul: C.doux });
      D.fleche(g, [60, 500], [640, 120], C.pale, 5);
      for (var k = 0; k < 4; k++) {
        var m = marche(k), act = n.pose === k, fx = n.faux === k;
        E.s("rect", { x: m.x, y: m.y, width: m.l - 6, height: m.h, rx: 12, fill: act ? PLATEFORME.teinte(0.35) : fx ? "#fde3e4" : PLATEFORME.teinte(0.07 + k * 0.07), stroke: act ? C.jeu : fx ? C.ko : "#c6cbd8", "stroke-width": act || fx ? 3.5 : 2 }, g);
        D.texte(g, CLASSES[k], [m.x + m.l / 2 - 3, m.y + 34], { taille: 30, mono: true });
        D.texte(g, RISQUE[k], [m.x + m.l / 2 - 3, m.y + 66], { taille: 15, coul: C.doux, gras: false });
        if (n.tests) for (var t = 0; t <= k; t++) D.rond(g, [m.x + 28 + t * 30, m.y + m.h - 26], 9, { fill: C.ok });
      }
      if (n.tests) D.texte(g, "pastilles vertes : nombre de tests avant approbation", [340, 520], { taille: 15, coul: C.ok, gras: false });
      if (n.objet) {
        var p = n.pose !== null ? marche(n.pose) : null, cx = Math.min(550, p ? p.x + p.l / 2 - 3 : 340), cy = p ? p.y - 34 : 110;
        E.s("rect", { x: cx - 120, y: cy - 22, width: 240, height: 44, rx: 22, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, n.objet, [cx, cy], { taille: 17 });
      }
    };
    fig.svg.addEventListener("click", function (ev) {
      if (!n.libre || !n.surTape) return;
      var q = E.point(fig.svg, ev);
      for (var k = 0; k < 4; k++) { var m = marche(k); if (q[0] >= m.x && q[0] <= m.x + m.l && q[1] >= m.y - 60 && q[1] <= m.y + m.h) { n.surTape(k); return; } }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La lentille", jouer: function (j, n) {
      n.objet = "lentille de contact"; n.libre = true; n.dessin();
      j.fig.astuce("Touche la marche de l'escalier qui correspond à la classe.");
      j.titre("Une lentille de contact est invasive (elle est posée sur l'œil) mais pour une courte durée. Dans quelle classe la ranges-tu ?");
      n.surTape = function (k) {
        if (!n.libre) return;
        if (k !== 1) {
          n.faux = k; n.dessin();
          j.erreur(k === 0 ? "La classe I regroupe les DM non invasifs, ou invasifs de courte durée au contact de la peau. La lentille va plus loin." : k === 2 ? "La classe IIb concerne un usage prolongé. Ici, la durée est courte." : "La classe III vise le cœur, le système circulatoire ou nerveux central, ou un effet biologique.");
          return;
        }
        n.libre = false; n.faux = null; n.pose = 1; n.dessin();
        j.bravo("Classe IIa : invasif, de courte durée.");
        j.expliquer("<p>La classification se fonde sur le <b>degré de risque</b> pour le patient, avec trois critères : le caractère invasif, la durée du contact, la partie du corps concernée. Plus la classe est élevée, plus le risque est grand, et plus il y a de tests avant l'approbation.</p>");
        j.suite();
      };
      j.reponse(function () { n.surTape(1); });
    } },
    { nom: "Quatre dispositifs", jouer: function (j, n) {
      n.objet = null; n.pose = null; n.faux = null; n.dessin();
      j.fig.astuce("");
      j.titre("Range ces quatre dispositifs dans leur classe.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;font-size:18px"><b>I</b><span class="trou" data-attendu="1"></span><b>IIa</b><span class="trou" data-attendu="2a"></span><b>IIb</b><span class="trou" data-attendu="2b"></span><b>III</b><span class="trou" data-attendu="3"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "2b", html: "Matériel d'hémodialyse" }, { id: "3", html: "Stent" }, { id: "1", html: "Bas de contention" }, { id: "2a", html: "Couronne dentaire" }],
        aide: "Non invasif : classe I. Invasif court : IIa. Invasif prolongé : IIb. Au contact du système circulatoire central : III.",
        ok: function () {
          j.bravo("Bas de contention I, couronne IIa, hémodialyse IIb, stent III.");
          j.expliquer("<p>Exemples du cours. <b>Classe I</b> : fauteuils roulants, bas de contention, bandages, pansements chirurgicaux réutilisables, instruments, scalpels. <b>IIa</b> : lentilles de contact, échographes, agrafes cutanées, couronnes dentaires, poches de sang. <b>IIb</b> : implants chirurgicaux, matériel d'hémodialyse, pompes à perfusion. <b>III</b> : stent, prothèse de hanche, administrateur de médicaments, dispositif biodégradable.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi la classe III ?", jouer: function (j, n) {
      n.objet = "vis osseuse biodégradable"; n.pose = 3; n.dessin();
      j.titre("Une vis qui se dissout dans l'os est classée III. Pourquoi, alors qu'elle n'est pas au contact du cœur ?");
      j.choix([
        { html: "Parce qu'elle subit des modifications chimiques dans le corps", juste: true },
        { html: "Parce qu'elle est petite", aide: "La taille n'est pas un critère. Regarde ce qui arrive à la vis une fois posée." },
        { html: "Parce qu'elle est en métal", aide: "Une vis biodégradable n'est justement pas un métal classique. Le critère porte sur ce qu'elle devient dans le corps." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Dispositif biodégradable : classe III.");
        j.expliquer("<p>La <b>classe III</b> réunit les dispositifs invasifs, de court ou long terme, au contact du cœur, du système circulatoire central (SCC) ou du système nerveux central (SNC), les dispositifs ayant un effet biologique (administrateur de médicaments) et ceux qui subissent des modifications chimiques dans le corps (dispositif biodégradable).</p>");
        j.suite();
      } });
    } },
    { nom: "Plus de risque, plus de tests", jouer: function (j, n) {
      n.objet = null; n.pose = null; n.tests = true; n.dessin();
      j.titre("Que demande en plus un dispositif de classe III avant sa commercialisation ?");
      j.choix([
        { html: "Rien de plus qu'un pansement", aide: "Plus la classe est élevée, plus le nombre de tests est élevé : regarde les pastilles." },
        { html: "Une approbation préalable, des évaluations précliniques et cliniques", juste: true },
        { html: "Seulement une notice en français", aide: "C'est le risque pour le patient qui fixe les exigences, pas la langue." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Approbation préalable, évaluations précliniques et cliniques.");
        j.suite();
      } });
    } },
    { nom: "Les règles", jouer: function (j, n) {
      j.titre("En complément des quatre classes, combien de règles aident les fabricants à déterminer le degré de risque de leur dispositif ?");
      j.nombre({ avant: "\\text{règles} :", cases: [{ attendu: 18, tol: 0 }], ligne: true,
        aide: function () { return "Relis la fin du paragraphe sur les classes : ce nombre complète les quatre classes pour aider les fabricants."; },
        ok: function () {
          j.bravo("Dix-huit règles.");
          j.expliquer("<p>En Europe, les détails sont dans la Directive 93/42/CEE (classes de l'article R5211-7 du Code de la santé publique, plus la classe des DM actifs) ; la sécurité est assurée par le <b>marquage CE</b> sous le contrôle des agences nationales. Aux États-Unis, les critères sont définis par la FDA.</p>");
          j.suite();
        } });
    } }
  ]
});
