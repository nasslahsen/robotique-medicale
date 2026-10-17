/* Niveau : vecteurs du plan, composantes, somme bout à bout, multiplication par un nombre. */
NIVEAU({
  id: "vecteurs",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [250, 450], 62);
    var n = { objets: [], poignee: null, drapeau: null, surBouge: null, surRelache: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 1 });
      D.fleche(pl.fond, pl.P([-3.8, 0]), pl.P([6.6, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -2.4]), pl.P([0, 6.9]), "#c3c8d2", 2.5);
      for (var k = -3; k <= 6; k++) if (k) D.texte(pl.fond, String(k).replace("-", "−"), pl.P([k, -0.3]), { coul: C.gris, taille: 14, gras: false, mono: true });
      for (k = -2; k <= 6; k++) if (k) D.texte(pl.fond, String(k).replace("-", "−"), pl.P([-0.3, k]), { coul: C.gris, taille: 14, gras: false, mono: true });
      D.texte(pl.fond, "O", pl.P([-0.3, -0.3]), { coul: C.doux, taille: 18 });
      if (n.drapeau) {
        var q = pl.P(n.drapeau);
        D.ligne(pl.fond, q, [q[0], q[1] - 40], C.encre, 3);
        E.s("polygon", { points: [[q[0], q[1] - 40], [q[0] + 28, q[1] - 31], [q[0], q[1] - 22]].map(function (p) { return p.join(","); }).join(" "), fill: C.jeu }, pl.fond);
        D.rond(pl.fond, q, 6, { fill: C.encre });
      }
      n.objets.forEach(function (o) {
        if (o.pointille) D.ligne(pl.fig, pl.P(o.de), pl.P(o.a), o.coul, 3, "6 7");
        else pl.vec(pl.fig, o.de, o.a, o.coul, o.ep || 5, o.nom, { decal: o.decal, op: o.op });
      });
      if (n.poignee) D.poignee(pl.haut, pl.P(n.poignee), C.jeu);
      if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
    };
    D.glisser(fig.svg, {
      debut: function (p) { if (!n.poignee) return false; var q = pl.P(n.poignee); return Math.hypot(p[0] - q[0], p[1] - q[1]) < 70; },
      bouge: function (p) { var u = pl.U(p); n.poignee = n.bout = [Math.max(-3, Math.min(6, Math.round(u[0]))), Math.max(-2, Math.min(6, Math.round(u[1]))), 0]; if (n.surBouge) n.surBouge(); n.dessin(); },
      fin: function () { if (n.surRelache) n.surRelache(); }
    });
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Dessiner", jouer: function (j, n) {
      n.poignee = n.bout = [1, 0, 0];
      n.surBouge = function () { n.objets = [{ de: [0, 0], a: n.bout, coul: C(), nom: "u" }]; };
      function C() { return D.C.acc; }
      n.surBouge();
      n.bande = function () { return "\\vec{u} = (" + n.bout[0] + " \\,;\\ " + n.bout[1] + ")"; };
      n.dessin();
      j.fig.astuce("Fais glisser la pointe de la flèche.");
      j.titre("Dessine le vecteur \\(\\vec{u} = (3 \\,;\\ 2)\\).");
      j.consigne("Il part de O. Le premier nombre dit de combien il va vers la droite, le second de combien il monte.");
      var fini = false;
      n.surRelache = function () {
        if (fini) return;
        if (n.bout[0] === 3 && n.bout[1] === 2) {
          fini = true; n.poignee = null; n.objets[0].a = [3, 2, 0]; n.dessin();
          j.bravo("3 vers la droite, 2 vers le haut.", n.pl.P([3, 2]));
          j.expliquer("<p>Un vecteur, c'est un déplacement : une direction et une longueur. Ses <b>composantes</b> \\((3 \\,;\\ 2)\\) disent de combien il avance selon chaque axe.</p><p>Il ne dépend pas de son point de départ : la même flèche posée ailleurs est le même vecteur.</p>");
          j.suite();
        } else if (n.bout[0] === 2 && n.bout[1] === 3) j.info("Tu as échangé : le premier nombre va avec l'axe horizontal.");
      };
    } },
    { nom: "Somme", jouer: function (j, n) {
      n.drapeau = [3, 4, 0]; n.poignee = n.bout = [3, 1, 0];
      function maj() { n.objets = [{ de: [0, 0], a: [2, 1, 0], coul: D.C.acc, nom: "u" }, { de: [2, 1, 0], a: n.bout, coul: D.C.y, nom: "v" }]; }
      n.surBouge = maj; maj();
      n.bande = function () { return "\\vec{v} = (" + (n.bout[0] - 2) + " \\,;\\ " + (n.bout[1] - 1) + ") \\qquad \\vec{u} + \\vec{v} = (" + n.bout[0] + " \\,;\\ " + n.bout[1] + ")"; };
      n.dessin();
      j.fig.astuce("Le vecteur vert part du bout du bleu.");
      j.titre("\\(\\vec{u} = (2 \\,;\\ 1)\\) est posé. Règle \\(\\vec{v}\\) pour que \\(\\vec{u} + \\vec{v}\\) arrive au drapeau.");
      j.consigne("On met les vecteurs bout à bout : la somme va du départ du premier à l'arrivée du second.");
      var fini = false;
      n.surRelache = function () {
        if (fini || n.bout[0] !== 3 || n.bout[1] !== 4) return;
        fini = true; n.poignee = null;
        n.objets.push({ de: [0, 0], a: [3, 4, 0], coul: D.C.v, nom: "u + v", decal: [-26, 0] });
        n.dessin();
        j.bravo("\\(\\vec{v} = (1 \\,;\\ 3)\\).", n.pl.P([3, 4]));
        j.expliquer("<p>Pour additionner, on additionne composante par composante :</p>\\[ \\vec{u} + \\vec{v} = (2 + 1 \\,;\\ 1 + 3) = (3 \\,;\\ 4) \\]<p>C'est la relation de Chasles du cours : \\(\\overrightarrow{OA} + \\overrightarrow{AM} = \\overrightarrow{OM}\\).</p>");
        j.suite();
      };
    } },
    { nom: "Multiplier", jouer: function (j, n) {
      n.drapeau = null; n.poignee = null; n.surBouge = null; n.surRelache = null; n.bande = null;
      n.objets = [
        { de: [0, 0], a: [2, 1, 0], coul: D.C.acc, nom: "u" },
        { de: [-1, 5], a: [3, 7, 0], coul: D.C.encre, nom: "a", ep: 4 },
        { de: [5, 3], a: [1, 1, 0], coul: D.C.encre, nom: "b", ep: 4, decal: [-6, 22] },
        { de: [5, 6], a: [3, 5, 0], coul: D.C.encre, nom: "c", ep: 4, decal: [0, 22] }
      ];
      n.dessin();
      j.fig.astuce("");
      j.titre("Laquelle des flèches a, b, c est le vecteur \\(-2\\vec{u}\\) ?");
      j.consigne("\\(\\vec{u} = (2 \\,;\\ 1)\\), en bleu.");
      j.choix([
        { html: "a", aide: "a vaut \\((4 \\,;\\ 2)\\) : c'est \\(2\\vec{u}\\), dans le même sens que \\(\\vec{u}\\)." },
        { html: "b", juste: true },
        { html: "c", aide: "c vaut \\((-2 \\,;\\ -1)\\) : c'est \\(-\\vec{u}\\). Il faut deux fois plus long." }
      ], { ok: function () {
        j.bravo("b vaut \\((-4 \\,;\\ -2)\\).", n.pl.P([1, 1]));
        j.expliquer("<p>Multiplier par un nombre multiplie chaque composante. Un nombre négatif retourne le vecteur :</p>\\[ -2\\vec{u} = (-2 \\times 2 \\,;\\ -2 \\times 1) = (-4 \\,;\\ -2) \\]");
        j.suite();
      } });
    } },
    { nom: "Combiner", jouer: function (j, n) {
      var u = [1, 1], w = [-1, 1];
      n.drapeau = [0, 4, 0];
      var ca = { v: 1 }, cb = { v: 0 };
      function maj() {
        var A = [ca.v * u[0], ca.v * u[1], 0], B = [A[0] + cb.v * w[0], A[1] + cb.v * w[1], 0];
        n.objets = [{ de: [0, 0], a: [1, 1, 0], coul: D.C.acc, nom: "u", op: 0.35 }, { de: [0, 0], a: [-1, 1, 0], coul: D.C.y, nom: "w", op: 0.35 },
          { de: [0, 0], a: A, coul: D.C.acc, ep: 6 }, { de: A, a: B, coul: D.C.y, ep: 6 }];
        n.bande = function () { return ca.v + "\\,\\vec{u} + " + (cb.v < 0 ? "(" + cb.v + ")" : cb.v) + "\\,\\vec{w} = (" + B[0] + " \\,;\\ " + B[1] + ")"; };
        n.dessin();
        if (B[0] === 0 && B[1] === 4 && !fini) gagne();
      }
      var fini = false;
      function gagne() {
        fini = true;
        j.bravo("\\(2\\vec{u} + 2\\vec{w} = (0 \\,;\\ 4)\\).", n.pl.P([0, 4]));
        j.expliquer("<p>Avec deux vecteurs qui ne sont pas parallèles, on atteint n'importe quel point du plan : il suffit de trouver les bons nombres \\(a\\) et \\(b\\).</p><p>Garde cette idée : dans un repère tourné, les composantes d'un vecteur sont exactement ces nombres, comptés le long des axes du repère.</p>");
        j.suite();
      }
      j.fig.astuce("u et w en clair ; ta combinaison en épais.");
      j.titre("Atteins le drapeau avec \\(a\\,\\vec{u} + b\\,\\vec{w}\\).");
      j.consigne("\\(\\vec{u} = (1 \\,;\\ 1)\\) et \\(\\vec{w} = (-1 \\,;\\ 1)\\). Règle les deux nombres.");
      ca = j.curseur({ nom: "a", min: -3, max: 3, pas: 1, val: 1, change: maj });
      cb = j.curseur({ nom: "b", min: -3, max: 3, pas: 1, val: 0, change: maj });
      maj();
    } }
  ]
});
