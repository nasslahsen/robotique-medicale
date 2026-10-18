/* Niveau : implant, prothèse, organe artificiel, bioprothèse, greffe (autogreffe, allogreffe, xénogreffe). */
NIVEAU({
  id: "vocabulaire",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { cas: "auto", nom: null };
    function humain(x, y, coul, nom) {
      D.rond(g, [x, y - 120], 34, { fill: coul, stroke: C.encre, ep: 3 });
      E.s("path", { d: "M" + (x - 60) + " " + (y + 40) + " Q" + (x - 60) + " " + (y - 76) + " " + x + " " + (y - 76) + " Q" + (x + 60) + " " + (y - 76) + " " + (x + 60) + " " + (y + 40) + " Z", fill: coul, stroke: C.encre, "stroke-width": 3 }, g);
      if (nom) D.texte(g, nom, [x, y + 72], { taille: 18 });
    }
    function cochon(x, y) {
      E.s("ellipse", { cx: x, cy: y - 40, rx: 86, ry: 56, fill: "#f7c6cf", stroke: C.encre, "stroke-width": 3 }, g);
      D.rond(g, [x - 92, y - 52], 30, { fill: "#f7c6cf", stroke: C.encre, ep: 3 });
      E.s("ellipse", { cx: x - 118, cy: y - 48, rx: 12, ry: 15, fill: "#f2a9b6", stroke: C.encre, "stroke-width": 2.5 }, g);
      [-50, -20, 30, 60].forEach(function (d) { D.ligne(g, [x + d, y + 6], [x + d, y + 36], C.encre, 6); });
      D.texte(g, "porc", [x, y + 72], { taille: 18 });
    }
    n.dessin = function () {
      E.vider(g);
      var c = n.cas, peau = "#ffe6da", autre = "#f6dcc4";
      if (c === "auto") {
        humain(340, 330, peau, "même personne");
        E.s("path", { d: "M380 360 C520 380 520 160 362 200", fill: "none", stroke: C.jeu, "stroke-width": 5 }, g);
        D.fleche(g, [372, 196], [356, 204], C.jeu, 5);
        D.rond(g, [372, 352], 10, { fill: C.jeu }); D.rond(g, [346, 202], 10, { fill: C.jeu });
        D.texte(g, "os prélevé sur la hanche", [470, 470], { taille: 16, coul: C.doux, gras: false });
        D.texte(g, "greffé dans la mâchoire", [470, 150], { taille: 16, coul: C.doux, gras: false });
      } else if (c === "allo") {
        humain(170, 330, peau, "donneur"); humain(510, 330, autre, "receveur");
        D.fleche(g, [250, 270], [430, 270], C.jeu, 6);
        D.texte(g, "même espèce, génétiquement distincts", [340, 470], { taille: 17, coul: C.doux, gras: false });
      } else if (c === "bio") {
        cochon(170, 340); humain(520, 330, peau, "receveur");
        D.fleche(g, [270, 260], [440, 260], C.jeu, 6);
        D.rond(g, [355, 210], 30, { fill: "#fff", stroke: C.encre, ep: 3 });
        [90, 210, 330].forEach(function (a) { var t = a * D.DEG; D.ligne(g, [355, 210], [355 + 30 * Math.cos(t), 210 - 30 * Math.sin(t)], C.encre, 3); });
        D.texte(g, "valve cardiaque traitée, non vivante", [355, 158], { taille: 16, coul: C.doux, gras: false });
      } else {
        // vue d'ensemble : un corps avec ses dispositifs
        humain(340, 380, peau, null);
        var pts = [[340, 255, "lentille intra-oculaire"], [322, 330, "implant contraceptif"], [365, 345, "valve cardiaque"]];
        pts.forEach(function (p, k) { D.rond(g, [p[0], p[1]], 9, { fill: C.jeu, stroke: "#fff", ep: 2 }); D.ligne(g, [p[0], p[1]], [k === 1 ? 210 : 470, 120 + k * 80], C.gris, 2); D.texte(g, p[2], [k === 1 ? 200 : 480, 120 + k * 80], { taille: 16, ancre: k === 1 ? "end" : "start" }); });
      }
      if (n.nom) D.texte(g, n.nom, [340, 60], { taille: 26, coul: C.jeu });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Autogreffe", jouer: function (j, n) {
      j.fig.astuce("Le donneur et le receveur sont la même personne.");
      j.titre("On prélève de l'os sur la hanche d'une patiente pour reconstruire sa mâchoire. Comment s'appelle cette greffe ?");
      j.choix([{ html: "Autogreffe", juste: true }, { html: "Allogreffe", aide: "L'allogreffe passe d'une personne à une autre. Ici, combien de personnes ?" }, { html: "Xénogreffe", aide: "La xénogreffe vient d'une autre espèce." }], { ok: function () {
        n.nom = "autogreffe"; n.dessin();
        j.bravo("Autogreffe : donneur et receveur sont la même personne.");
        j.expliquer("<p><b>Greffe</b> : ensemble de cellules vivantes, de tissus vivants ou d'organes vivants insérés chirurgicalement dans un corps pour remplacer une partie endommagée ou un défaut d'un organe, transférés d'un site donneur vers un site receveur.</p>");
        j.suite();
      } });
    } },
    { nom: "Allogreffe", jouer: function (j, n) {
      n.cas = "allo"; n.nom = null; n.dessin();
      j.fig.astuce("");
      j.titre("Un frère donne un rein à sa sœur. Et cette fois ?");
      j.choix([{ html: "Autogreffe", aide: "Deux personnes différentes : ce n'est plus la même personne." }, { html: "Allogreffe", juste: true }, { html: "Xénogreffe", aide: "Frère et sœur sont de la même espèce." }], { ok: function () {
        n.nom = "allogreffe"; n.dessin();
        j.bravo("Allogreffe : même espèce, génétiquement distincts.");
        j.suite();
      } });
    } },
    { nom: "Le piège de la valve porcine", jouer: function (j, n) {
      n.cas = "bio"; n.nom = null; n.dessin();
      j.titre("On remplace une valve cardiaque par une valve de porc traitée, qui n'est plus vivante. Xénogreffe ?");
      j.choix([
        { html: "Oui : le donneur est d'une autre espèce", aide: "Une greffe transfère des cellules, tissus ou organes vivants. Que dit l'énoncé sur la valve ?" },
        { html: "Non : c'est une bioprothèse, un tissu non vivant traité venant d'un donneur", juste: true },
        { html: "Non : c'est une autogreffe", aide: "Le porc n'est pas la patiente." }
      ], { colonnes: 1, ok: function () {
        n.nom = "bioprothèse"; n.dessin();
        j.bravo("Bioprothèse : le tissu est traité, il n'est plus vivant.");
        j.expliquer("<p><b>Bioprothèse</b> : prothèse implantable totalement ou substantiellement constituée d'un tissu non vivant « traité », obtenu auprès d'un donneur. La <b>xénogreffe</b>, elle, transfère du vivant entre deux espèces différentes.</p>");
        j.suite();
      } });
    } },
    { nom: "Les mots du domaine", jouer: function (j, n) {
      n.cas = "vue"; n.nom = null; n.dessin();
      j.titre("Associe chaque définition à son mot.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;font-size:16px"><span>DM d\'un ou plusieurs biomatériaux, introduit dans le corps pour remplacer un organe, assurer une fonction ou traiter une maladie</span><span class="trou" data-attendu="imp"></span><span>Implanté pour suppléer un organe manquant ou restaurer une fonction déficiente</span><span class="trou" data-attendu="pro"></span><span>Remplace une partie ou toutes les fonctions d\'un organe</span><span class="trou" data-attendu="oa"></span><span>Biomatériaux associés à des cellules vivantes</span><span class="trou" data-attendu="hyb"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "hyb", html: "organe artificiel hybride" }, { id: "imp", html: "implant" }, { id: "oa", html: "organe artificiel" }, { id: "pro", html: "prothèse" }],
        aide: "Le mot « hybride » signale des cellules vivantes. La prothèse supplée un organe manquant. L'implant est le terme le plus large : un DM introduit dans le corps.",
        ok: function () {
          j.bravo("Quatre mots, quatre nuances.");
          j.expliquer("<p>L'<b>organe artificiel hybride</b> vise un nouvel « organe fonctionnel » : les cellules vivantes doivent se différencier pour former un nouveau « tissu fonctionnel ». Un <b>organe</b> est une partie du corps qui remplit des fonctions particulières.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Temporaire ou permanent", jouer: function (j, n) {
      j.titre("Un implant peut être temporaire ou permanent. Range ces trois implants.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:17px"><b>Temporaire</b><b>Permanent</b><span class="trou" data-attendu="t"></span><span class="trou" data-attendu="p"></span><span></span><span class="trou" data-attendu="p"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "Lentille intra-oculaire" }, { id: "t", html: "Implant contraceptif" }, { id: "p", html: "Implant dentaire" }],
        aide: "Lequel est retiré au bout d'un certain temps, par choix ?",
        ok: function () {
          j.bravo("L'implant contraceptif est temporaire ; dentaire et intra-oculaire sont permanents.");
          j.expliquer("<p>Un implant peut être placé à l'intérieur du corps, sous la peau (implant sous-cutané) ou sous une surface épithéliale.</p>");
          j.suite();
        }
      });
    } }
  ]
});
