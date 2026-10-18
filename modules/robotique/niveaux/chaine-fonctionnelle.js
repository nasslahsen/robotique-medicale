/* Niveau : chaîne fonctionnelle d'un axe. Ordre de la chaîne, les cinq constituants, compter les axes, ce qui fait la performance. */
NIVEAU({
  id: "chaine-fonctionnelle",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), M = window.MECA;
    var n = { mode: "axe", choisis: {}, surTouche: null, flux: -1, axes: false, defaut: null };
    var Y = 300;
    n.cibles = { energie: [52, Y + 70], actionneur: [150, Y], transmission: [270, Y], guidage: [470, Y - 46], structure: [606, 180] };

    function axe() {
      // source d'énergie : câble et prise
      E.s("path", { d: "M52 " + (Y + 110) + " C 52 " + (Y + 40) + ", 70 " + (Y + 30) + ", 92 " + (Y + 30), fill: "none", stroke: C.encre, "stroke-width": 5 }, g);
      E.s("rect", { x: 36, y: Y + 108, width: 32, height: 40, rx: 6, fill: "#5b6172" }, g);
      D.ligne(g, [44, Y + 148], [44, Y + 160], C.encre, 4); D.ligne(g, [60, Y + 148], [60, Y + 160], C.encre, 4);
      // actionneur : moteur
      E.s("rect", { x: 90, y: Y - 55, width: 120, height: 110, rx: 14, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
      for (var k = 0; k < 5; k++) D.ligne(g, [106 + k * 22, Y - 55], [106 + k * 22, Y + 55], "#9aa0ad", 2);
      // transmission : réducteur et arbre
      E.s("rect", { x: 214, y: Y - 62, width: 112, height: 124, rx: 14, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
      M.roue(g, [246, Y - 18], { m: 3, Z: 12, fill: "#fff", repere: false, trou: 4, rot: n.rot1 || 0 });
      M.roue(g, [246 + 3 * 36 / 2, Y + 12], { m: 3, Z: 24, fill: "#fff", repere: false, trou: 5, rot: Math.PI / 24 - (n.rot1 || 0) / 2 });
      M.arbre(g, 326, 640, Y, 13, { axe: false });
      M.traitAxe(g, [80, Y], [660, Y]);
      // guidage : palier avec deux roulements, en coupe
      var H = M.hachures(g, "#5b6172", { fond: "#fff" });
      E.s("rect", { x: 400, y: Y - 92, width: 140, height: 46, fill: H, stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 400, y: Y + 46, width: 140, height: 46, fill: H, stroke: C.encre, "stroke-width": 2 }, g);
      [428, 512].forEach(function (x) { M.roulement(g, x, Y - 13, 40, 33, { type: "billes" }); M.roulement(g, x, Y + 13, 40, 33, { type: "billes", sens: -1 }); });
      // structure : le bras fixé au bout de l'arbre
      E.s("rect", { x: 570, y: Y - 40, width: 70, height: 80, rx: 12, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("path", { d: "M582 " + (Y - 30) + " L592 70 L626 70 L628 " + (Y - 30) + " Z", fill: "#c6cbd8", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      D.ligne(g, [596, 70], [586, 34], C.encre, 7); D.ligne(g, [622, 70], [632, 34], C.encre, 7);
      if (n.flux >= 0) {
        // le mouvement circule de la source vers le bras
        var chemin = [[52, Y + 110], [92, Y + 30], [150, Y], [270, Y], [470, Y], [606, Y], [608, 60]];
        var t = n.flux * (chemin.length - 1), i = Math.min(chemin.length - 2, Math.floor(t)), u = t - i;
        for (var q = 0; q <= i; q++) D.ligne(g, chemin[q], q < i ? chemin[q + 1] : [chemin[i][0] + (chemin[i + 1][0] - chemin[i][0]) * u, chemin[i][1] + (chemin[i + 1][1] - chemin[i][1]) * u], D.C.jeu, 6);
      }
      Object.keys(n.choisis).forEach(function (k) {
        var c = n.cibles[k], ok = n.choisis[k];
        D.rond(g, c, 34, { fill: "none", stroke: ok ? C.ok : C.ko, ep: 4 });
        var pos = { energie: [c[0] + 40, c[1] + 4, "start"], actionneur: [c[0], c[1] + 76], transmission: [c[0], c[1] + 82], guidage: [c[0], c[1] - 60], structure: [c[0] - 44, c[1] + 6, "end"] }[k];
        D.texte(g, NOMS[k], [pos[0], pos[1]], { coul: ok ? C.ok : C.ko, taille: 17, ancre: pos[2] || "middle" });
      });
    }
    var NOMS = { energie: "source d'énergie", actionneur: "actionneur", transmission: "transmission", guidage: "guidage", structure: "structure" };

    function robot() {
      // bras à 5 axes de rotation, vu de côté ; flèches courbes sur chaque axe
      E.s("rect", { x: 150, y: 470, width: 260, height: 80, rx: 12, fill: "#5b6172" }, g);
      E.s("rect", { x: 230, y: 430, width: 100, height: 40, rx: 8, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      var p0 = [280, 400], p1 = [380, 210], p2 = [530, 260], p3 = [580, 330];
      D.ligne(g, [280, 430], p0, "#9aa0ad", 44);
      D.ligne(g, p0, p1, "#5b6172", 40); D.ligne(g, p1, p2, "#5b6172", 34); D.ligne(g, p2, p3, "#5b6172", 26);
      [p0, p1, p2].forEach(function (p) { D.rond(g, p, 30, { fill: "#9aa0ad", stroke: C.encre, ep: 3 }); D.rond(g, p, 12, { fill: "#fff", stroke: C.encre, ep: 2 }); });
      D.ligne(g, p3, [600, 362], C.encre, 8); D.ligne(g, p3, [612, 340], C.encre, 8);
      if (!n.axes) return;
      var A = D.C.jeu;
      function rot(c, r) { E.s("path", { d: "M" + (c[0] + r) + " " + c[1] + " A " + r + " " + r + " 0 1 1 " + c[0] + " " + (c[1] + r), fill: "none", stroke: A, "stroke-width": 5 }, g); D.fleche(g, [c[0] + 8, c[1] + r], [c[0] - 4, c[1] + r - 2], A, 5); }
      function ell(c, rx, ry) { E.s("ellipse", { cx: c[0], cy: c[1], rx: rx, ry: ry, fill: "none", stroke: A, "stroke-width": 5, "stroke-dasharray": "160 30" }, g); }
      ell([280, 462], 120, 26); rot(p0, 48); rot(p1, 46); rot(p2, 42); ell([596, 346], 34, 14);
      [[136, 430, "1"], [200, 372, "2"], [380, 140, "3"], [566, 200, "4"], [648, 346, "5"]].forEach(function (e) { D.texte(g, e[2], [e[0], e[1]], { coul: A, taille: 24 }); });
    }

    n.dessin = function () {
      E.vider(g);
      if (n.mode === "axe") axe(); else robot();
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche) return false;
        var best = null, dmin = 70;
        Object.keys(n.cibles).forEach(function (k) { var c = n.cibles[k], d = Math.hypot(p[0] - c[0], p[1] - c[1]); if (d < dmin) { dmin = d; best = k; } });
        if (best) n.surTouche(best);
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La chaîne", jouer: function (j, n) {
      j.fig.astuce("Un axe de robot vu en coupe : de gauche à droite.");
      j.titre("Le mouvement part du moteur et arrive au bras. Remets la chaîne dans l'ordre.");
      var fl = '<span style="font-size:22px;color:#9aa0ad">→</span>';
      var z = j.zone("", '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">' + ["moteur", "reduction", "transmission", "guidage", "bras"].map(function (c) { return '<span class="trou" data-attendu="' + c + '" style="min-width:118px"></span>'; }).join(fl) + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "guidage", html: "Guidage" }, { id: "moteur", html: "Moteur" }, { id: "bras", html: "Bras / effecteur" }, { id: "transmission", html: "Transmission" }, { id: "reduction", html: "Réduction" }],
        aide: "Suis la figure de gauche à droite : le moteur, puis ce qui ralentit, puis ce qui transmet, ce qui guide, et enfin ce qui bouge.",
        ok: function () {
          E.anime(1600, function (u) { n.flux = u; n.rot1 = u * 6; n.dessin(); });
          j.bravo("Moteur → Réduction → Transmission → Guidage → Bras / effecteur.");
          j.expliquer("<p>L'<b>architecture mécanique</b> d'un axe décrit l'organisation des composants qui produisent, transmettent et guident le mouvement jusqu'à l'organe mobile. La <b>chaîne fonctionnelle</b> enchaîne les fonctions entre actionneurs et mouvements utiles à la tâche.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Les constituants", jouer: function (j, n) {
      n.flux = -1; n.dessin();
      j.fig.astuce("Touche les parties de l'axe sur la figure.");
      var ordre = [["actionneur", "l'<b>actionneur</b> : ce qui crée le mouvement"], ["energie", "la <b>source d'énergie</b> qui l'alimente"], ["guidage", "le <b>guidage</b> : ce qui tient l'arbre en rotation"], ["transmission", "la <b>transmission</b> : réducteur et arbre"], ["structure", "la <b>structure</b> : la pièce rigide qui porte la charge"]];
      var k = 0;
      j.titre("Un axe associe cinq constituants. Touche-les un par un.");
      var consigne = j.consigne("");
      function poser() { consigne.innerHTML = "Touche " + ordre[k][1] + "."; }
      poser();
      var DIT = { energie: "la source d'énergie (le câble)", actionneur: "le moteur, l'actionneur", transmission: "la transmission", guidage: "le guidage (les roulements)", structure: "la structure (le bras)" };
      n.surTouche = function (id) {
        if (id === ordre[k][0]) {
          n.choisis[id] = true; n.dessin(); k++;
          if (k < ordre.length) { j.info("Oui. Suivant."); poser(); return; }
          n.surTouche = null; consigne.innerHTML = "";
          j.bravo("Énergie, actionneur, transmission, guidage, structure.");
          j.expliquer("<p>Un axe robotique associe une source d'énergie, un actionneur, une transmission, un guidage et une structure. Chacun a son rôle, et chacun peut dégrader la précision de l'axe.</p>");
          j.suite();
        } else {
          n.choisis[id] = false; n.dessin();
          setTimeout(function () { if (n.choisis[id] === false) { delete n.choisis[id]; n.dessin(); } }, 900);
          j.erreur("Ça, c'est " + DIT[id] + ".");
        }
      };
      j.reponse(function () { for (var q = 0; q < 6 && n.surTouche; q++) n.surTouche(ordre[k][0]); });
    } },
    { nom: "Compter les axes", jouer: function (j, n) {
      n.mode = "robot"; n.choisis = {}; n.axes = false; n.dessin();
      j.fig.astuce("Un bras de laboratoire fait de modules d'articulation et de pièces de liaison.");
      j.titre("Chaque module d'articulation est un axe : moteur, réducteur, guidage. Combien d'axes de rotation a ce bras ?");
      var bt = E.h("button", "btn clair", "Montrer les rotations", j.el); bt.type = "button";
      bt.addEventListener("click", function () { n.axes = !n.axes; n.dessin(); bt.textContent = n.axes ? "Cacher les rotations" : "Montrer les rotations"; });
      j.nombre({ avant: "\\text{axes} =", cases: [{ attendu: 5, tol: 0 }], ligne: true,
        aide: function () { return "Compte la rotation de la base sur elle-même et celle de l'outil sur lui-même, en plus des trois pivots visibles."; },
        ok: function () {
          bt.remove(); n.axes = true; n.dessin();
          j.bravo("5 axes : un bras à 5 degrés de liberté.");
          j.expliquer("<p>Un robot est une suite d'axes. Chacun reprend la même chaîne : moteur, réduction, transmission, guidage, puis le segment suivant. C'est cette chaîne, axe par axe, que le module étudie.</p>");
          j.suite();
        } });
    } },
    { nom: "Pourquoi ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le moteur de l'épaule est positionné au millième de tour près, pourtant la pince se décale d'un millimètre. Pourquoi ?");
      j.choix([{ html: "Les performances dépendent de toute la chaîne : jeu, rigidité, déformations, alignement…", juste: true }, { html: "Le moteur ne tourne pas assez vite", aide: "La vitesse ne change pas la position finale : regarde ce qu'il y a entre le moteur et la pince." }, { html: "Un millimètre est toujours négligeable", aide: "En médical, un millimètre au bout d'un instrument compte. Cherche d'où vient l'écart." }], { colonnes: 1, ok: function () {
        j.bravo("Un moteur précis ne suffit pas.");
        j.expliquer("<p>Les performances d'un robot dépendent de toute la chaîne mécanique : jeu, rigidité, frottement, rendement, déformations, défauts d'alignement et tolérances de montage. Chaque maillon ajoute son petit défaut.</p>");
        j.suite();
      } });
    } },
    { nom: "Quel maillon ?", jouer: function (j, n) {
      n.mode = "axe"; n.dessin();
      j.fig.astuce("Le défaut se voit à l'arrêt.");
      j.titre("Le bras s'arrête, puis la pince oscille quelques instants avant de se stabiliser. Quel défaut de la chaîne regarder d'abord ?");
      j.choix([{ html: "Le rendement", aide: "Le rendement dit quelle part de la puissance arrive en sortie ; il ne fait pas osciller une pièce à l'arrêt." }, { html: "La rigidité", juste: true }, { html: "La source d'énergie", aide: "Le moteur est arrêté : c'est la mécanique qui bouge encore." }], { colonnes: 3, ok: function () {
        j.bravo("Une chaîne souple se déforme et oscille.");
        j.expliquer("<p>Une rigidité faible laisse la structure et la transmission se déformer sous la charge : la pince s'écarte, puis oscille. Le niveau « Rigidité et jeu angulaire » chiffre cet effet.</p>");
        j.suite();
      } });
    } }
  ]
});
