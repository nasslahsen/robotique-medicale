/* Niveau : choisir et reconnaître le procédé. Indices sur les pièces, noms anglais du TP, décrire un procédé. */
NIVEAU({
  id: "choisir-procede",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { libre: false, surPiece: null, choisie: null, juste: null };
    var M = function (a) { return PLATEFORME.teinte(a); };
    var PIECES = [
      { id: "tube", nom: "tubulure" }, { id: "seringue", nom: "corps de seringue" }, { id: "flacon", nom: "flacon" },
      { id: "citerne", nom: "citerne" }, { id: "blister", nom: "blister" }, { id: "botte", nom: "botte" }
    ];
    function icone(gr, id, c) {
      var x = c[0], y = c[1];
      if (id === "tube") {
        E.s("rect", { x: x - 70, y: y - 14, width: 130, height: 28, rx: 4, fill: M(0.45), stroke: C.encre, "stroke-width": 2.5 }, gr);
        E.s("ellipse", { cx: x + 60, cy: y, rx: 9, ry: 14, fill: M(0.7), stroke: C.encre, "stroke-width": 2.5 }, gr);
        E.s("ellipse", { cx: x + 60, cy: y, rx: 4, ry: 7, fill: "#fff" }, gr);
        D.texte(gr, "même section", [x, y + 36], { taille: 13, coul: C.doux, gras: false });
      } else if (id === "seringue") {
        E.s("rect", { x: x - 60, y: y - 16, width: 100, height: 32, rx: 4, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2.5 }, gr);
        for (var k = 1; k < 5; k++) D.ligne(gr, [x - 60 + k * 20, y - 16], [x - 60 + k * 20, y - 6], C.encre, 1.5);
        E.s("path", { d: "M" + (x + 40) + " " + (y - 8) + " L" + (x + 62) + " " + (y - 4) + " L" + (x + 62) + " " + (y + 4) + " L" + (x + 40) + " " + (y + 8) + " Z", fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2 }, gr);
        E.s("rect", { x: x - 70, y: y - 26, width: 10, height: 52, rx: 3, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2 }, gr);
        D.rond(gr, [x + 64, y], 4, { fill: C.jeu });
        D.texte(gr, "petit point", [x + 40, y + 36], { taille: 13, coul: C.doux, gras: false });
      } else if (id === "flacon") {
        E.s("path", { d: "M" + (x - 10) + " " + (y - 56) + " L" + (x + 10) + " " + (y - 56) + " L" + (x + 10) + " " + (y - 40) + " Q" + (x + 34) + " " + (y - 30) + " " + (x + 34) + " " + (y - 10) + " L" + (x + 34) + " " + (y + 44) + " L" + (x - 34) + " " + (y + 44) + " L" + (x - 34) + " " + (y - 10) + " Q" + (x - 34) + " " + (y - 30) + " " + (x - 10) + " " + (y - 40) + " Z", fill: M(0.3), stroke: C.encre, "stroke-width": 2.5 }, gr);
        D.rond(gr, [x + 60, y + 20], 24, { fill: "#f3f5fa", stroke: C.encre, ep: 2 });
        E.s("rect", { x: x + 44, y: y + 17, width: 32, height: 6, rx: 3, fill: C.jeu }, gr);
        D.texte(gr, "fond", [x + 60, y - 14], { taille: 13, coul: C.doux, gras: false });
      } else if (id === "citerne") {
        E.s("rect", { x: x - 66, y: y - 40, width: 132, height: 80, rx: 36, fill: M(0.4), stroke: C.encre, "stroke-width": 2.5 }, gr);
        E.s("rect", { x: x - 12, y: y - 52, width: 24, height: 14, rx: 3, fill: M(0.6), stroke: C.encre, "stroke-width": 2 }, gr);
        D.texte(gr, "creuse, sans soudure", [x, y + 56], { taille: 13, coul: C.doux, gras: false });
      } else if (id === "blister") {
        E.s("rect", { x: x - 70, y: y - 40, width: 140, height: 80, rx: 6, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2, "stroke-dasharray": "6 4" }, gr);
        for (var i = 0; i < 3; i++) for (var r = 0; r < 2; r++) E.s("rect", { x: x - 56 + i * 40, y: y - 30 + r * 34, width: 30, height: 26, rx: 10, fill: M(0.3), stroke: C.encre, "stroke-width": 2 }, gr);
        D.texte(gr, "découpe au pourtour", [x, y + 56], { taille: 13, coul: C.doux, gras: false });
      } else {
        E.s("path", { d: "M" + (x - 30) + " " + (y - 56) + " L" + (x + 10) + " " + (y - 56) + " L" + (x + 10) + " " + (y + 10) + " L" + (x + 52) + " " + (y + 18) + " L" + (x + 52) + " " + (y + 40) + " L" + (x - 30) + " " + (y + 40) + " Z", fill: "#5b6172", stroke: C.encre, "stroke-width": 2.5 }, gr);
        E.s("path", { d: "M" + (x - 40) + " " + (y + 40) + " L" + (x + 62) + " " + (y + 40) + " L" + (x + 62) + " " + (y + 46) + " L" + (x - 40) + " " + (y + 46) + " Z", fill: C.jeu }, gr);
        D.texte(gr, "bavure", [x + 70, y + 60], { taille: 13, coul: C.doux, gras: false });
      }
    }
    n.dessin = function () {
      E.vider(g);
      PIECES.forEach(function (p, k) {
        var c = [120 + (k % 3) * 220, 230 + Math.floor(k / 3) * 220];
        var gb = E.s("g", { style: "cursor:pointer" }, g);
        var etat = n.juste === p.id ? "ok" : n.choisie === p.id ? "ko" : "";
        E.s("rect", { x: c[0] - 100, y: c[1] - 92, width: 200, height: 196, rx: 18, fill: etat === "ok" ? "rgba(18,162,107,0.10)" : etat === "ko" ? "rgba(229,72,77,0.10)" : "#fff", stroke: etat === "ok" ? C.ok : etat === "ko" ? C.ko : "#d9dde6", "stroke-width": 3 }, gb);
        icone(gb, p.id, [c[0], c[1] - 4]);
        D.texte(gb, p.nom, [c[0], c[1] - 72], { taille: 16 });
        gb.addEventListener("click", function () { if (n.libre && n.surPiece) n.surPiece(p.id); });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La pièce extrudée", jouer: function (j, n) {
      n.libre = true; n.dessin();
      j.fig.astuce("Chaque pièce garde une trace de sa fabrication.");
      j.titre("Une de ces pièces a été extrudée. Touche-la.");
      var aides = { seringue: "Le petit point au bout est la trace d'un seuil d'injection.", flacon: "Une ligne au fond : un tube pincé par un moule de soufflage.", citerne: "Grande pièce creuse sans soudure : le moule a tourné.", blister: "Mince, avec une découpe au pourtour : une feuille formée sur un moule.", botte: "La collerette tout autour, c'est la bavure d'un moule de compression." };
      function gagne() {
        n.libre = false; n.surPiece = null; n.choisie = null; n.juste = "tube"; n.dessin();
        j.bravo("La tubulure : un profilé de même section, en continu.", [120, 230]);
        j.expliquer("<p>Indice de l'extrusion : un <b>profilé</b>, pièce ayant la même forme, produite en continu.</p>");
        j.suite();
      }
      n.surPiece = function (id) { if (id === "tube") { gagne(); return; } n.choisie = id; n.dessin(); j.erreur(aides[id]); };
      j.reponse(function () { if (n.surPiece) gagne(); });
    } },
    { nom: "La pièce comprimée", jouer: function (j, n) {
      n.juste = null; n.choisie = null; n.libre = true; n.dessin();
      j.fig.astuce("");
      j.titre("Laquelle est sortie d'un moule de compression ?");
      var aides = { tube: "La tubulure sort d'une filière, en continu.", seringue: "Le petit point au bout, c'est un seuil d'injection.", flacon: "La ligne au fond vient du soufflage d'un tube.", citerne: "Une pièce creuse fermée ne sort pas d'un moule qu'on presse.", blister: "La découpe au pourtour trahit le thermoformage." };
      function gagne() {
        n.libre = false; n.surPiece = null; n.choisie = null; n.juste = "botte"; n.dessin();
        j.bravo("La botte, avec sa bavure.", [560, 450]);
        j.expliquer("<p>En compression, l'excès de matière s'évacue entre les demi-moules : la pièce sort avec une <b>bavure</b>, comme les bottes en caoutchouc du cours.</p>");
        j.suite();
      }
      n.surPiece = function (id) { if (id === "botte") { gagne(); return; } n.choisie = id; n.dessin(); j.erreur(aides[id]); };
      j.reponse(function () { if (n.surPiece) gagne(); });
    } },
    { nom: "Les noms du TP", jouer: function (j, n) {
      n.juste = null; n.dessin();
      j.titre("Dans la vidéo du TP, les procédés ont leur nom anglais. Associe chaque nom à son nom français.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        [["Blow molding", "s"], ["Transfer molding", "t"], ["Rotational molding", "r"], ["Thermoforming", "f"]].map(function (q) { return "<b>" + q[0] + '</b><span class="trou" data-attendu="' + q[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "f", html: "Thermoformage" }, { id: "i", html: "Moulage par injection" }, { id: "s", html: "Extrusion soufflage" }, { id: "r", html: "Rotomoulage" }, { id: "t", html: "Transfert de résine" }],
        aide: "Blow : souffler. Transfer : transférer. Rotational : en rotation. Thermo-forming : former à chaud.",
        ok: function () {
          j.bravo("Bien associés.");
          j.expliquer("<p>Le tableau du TP : Extrusion = moulage par extrusion ; Injection molding = moulage par injection ; Blow molding = moulage par extrusion soufflage ; Compression molding = moulage par compression ; Transfer molding = moulage par transfert de résine ; Rotational molding = rotomoulage ; Thermoforming = thermoformage.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Décrire un procédé", jouer: function (j, n) {
      j.titre("Le TP demande, pour chaque procédé : le principe, un matériau adapté, un produit représentatif. Complète la fiche du moulage par injection.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        [["Principe", "p"], ["Matériau", "m"], ["Produit", "r"]].map(function (q) { return "<b>" + q[0] + '</b><span class="trou" data-attendu="' + q[1] + '" style="justify-content:flex-start"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "r", html: "Corps de seringue" }, { id: "x", html: "Feuille chaude plaquée sur un moule" }, { id: "m", html: "Thermoplastique" }, { id: "y", html: "Citerne de 1 000 L" }, { id: "p", html: "Matière ramollie, injectée dans un moule fermé" }],
        aide: "Une feuille plaquée, c'est le thermoformage ; une citerne, le rotomoulage. Garde ce qui décrit l'injection.",
        ok: function () {
          j.bravo("Fiche complète.");
          j.expliquer("<p>Même grille pour les autres procédés. Une dizaine de lignes par procédé suffisent, comme le demande le TP : principe, matériau, produit, et l'indice qui permet de le reconnaître.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Un cas nouveau", jouer: function (j, n) {
      j.titre("Un réservoir d'essence en polyéthylène haute densité, creux, avec une ligne de soudure au fond. Quel procédé ?");
      j.choix([
        { html: "Rotomoulage", aide: "Le rotomoulage donne des pièces creuses sans soudure. Ici, il y a une ligne au fond." },
        { html: "Extrusion-soufflage", juste: true },
        { html: "Injection-soufflage", aide: "L'injection-soufflage laisse un point d'injection au fond, pas une ligne." }
      ], { ok: function () {
        j.bravo("Extrusion-soufflage : la ligne de soudure le dit.");
        j.expliquer("<p>C'est l'exemple du cours : avec le HDPE (1953, Ziegler), l'extrusion-soufflage s'est développée pour les bouteilles et les réservoirs d'essence. Deux pièces creuses peuvent venir de procédés différents : c'est l'indice qui tranche.</p>");
        j.suite();
      } });
    } }
  ]
});
