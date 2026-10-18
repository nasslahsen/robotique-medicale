/* Boss du chapitre 7 : l'atelier du dispositif médical. Associer six produits à leur procédé, justifier, ordonner, trouver l'erreur. */
NIVEAU({
  id: "boss-procedes",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { faits: {} };
    var M = function (a) { return PLATEFORME.teinte(a); };
    // atelier : un établi avec six produits ; une étiquette apparaît quand le produit est classé
    var PROD = [
      { id: "seringue", nom: "corps de seringue", c: [130, 200] }, { id: "tubulure", nom: "tubulure", c: [340, 200] }, { id: "flacon", nom: "flacon de sérum", c: [550, 200] },
      { id: "blister", nom: "blister", c: [130, 420] }, { id: "reservoir", nom: "réservoir d'eau", c: [340, 420] }, { id: "plateau", nom: "plateau phénolique", c: [550, 420] }
    ];
    function dessinProduit(id, c) {
      var x = c[0], y = c[1];
      if (id === "seringue") { E.s("rect", { x: x - 55, y: y - 13, width: 95, height: 26, rx: 4, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2.5 }, g); E.s("rect", { x: x - 64, y: y - 22, width: 9, height: 44, rx: 3, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2 }, g); E.s("path", { d: "M" + (x + 40) + " " + (y - 6) + " L" + (x + 60) + " " + (y - 3) + " L" + (x + 60) + " " + (y + 3) + " L" + (x + 40) + " " + (y + 6) + " Z", fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2 }, g); }
      else if (id === "tubulure") { E.s("path", { d: "M" + (x - 70) + " " + (y + 10) + " C" + (x - 30) + " " + (y - 40) + " " + (x + 30) + " " + (y + 40) + " " + (x + 70) + " " + (y - 10), fill: "none", stroke: C.encre, "stroke-width": 16, "stroke-linecap": "round" }, g); E.s("path", { d: "M" + (x - 70) + " " + (y + 10) + " C" + (x - 30) + " " + (y - 40) + " " + (x + 30) + " " + (y + 40) + " " + (x + 70) + " " + (y - 10), fill: "none", stroke: M(0.35), "stroke-width": 11, "stroke-linecap": "round" }, g); }
      else if (id === "flacon") E.s("path", { d: "M" + (x - 9) + " " + (y - 50) + " L" + (x + 9) + " " + (y - 50) + " L" + (x + 9) + " " + (y - 34) + " Q" + (x + 30) + " " + (y - 26) + " " + (x + 30) + " " + (y - 8) + " L" + (x + 30) + " " + (y + 40) + " L" + (x - 30) + " " + (y + 40) + " L" + (x - 30) + " " + (y - 8) + " Q" + (x - 30) + " " + (y - 26) + " " + (x - 9) + " " + (y - 34) + " Z", fill: M(0.3), stroke: C.encre, "stroke-width": 2.5 }, g);
      else if (id === "blister") { E.s("rect", { x: x - 62, y: y - 34, width: 124, height: 68, rx: 6, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2 }, g); for (var i = 0; i < 3; i++) for (var r = 0; r < 2; r++) E.s("rect", { x: x - 50 + i * 36, y: y - 26 + r * 28, width: 26, height: 22, rx: 9, fill: M(0.3), stroke: C.encre, "stroke-width": 1.8 }, g); }
      else if (id === "reservoir") { E.s("rect", { x: x - 60, y: y - 36, width: 120, height: 72, rx: 32, fill: M(0.4), stroke: C.encre, "stroke-width": 2.5 }, g); E.s("rect", { x: x - 10, y: y - 48, width: 20, height: 13, rx: 3, fill: M(0.6), stroke: C.encre, "stroke-width": 2 }, g); }
      else { E.s("path", { d: "M" + (x - 66) + " " + (y - 14) + " L" + (x + 66) + " " + (y - 14) + " L" + (x + 56) + " " + (y + 20) + " L" + (x - 56) + " " + (y + 20) + " Z", fill: "#7a5a43", stroke: C.encre, "stroke-width": 2.5, "stroke-linejoin": "round" }, g); }
    }
    n.dessin = function () {
      E.vider(g);
      PROD.forEach(function (p) {
        var fait = n.faits[p.id];
        E.s("rect", { x: p.c[0] - 98, y: p.c[1] - 90, width: 196, height: 190, rx: 18, fill: fait ? "rgba(18,162,107,0.08)" : "#fff", stroke: fait ? C.ok : "#d9dde6", "stroke-width": 3 }, g);
        D.texte(g, p.nom, [p.c[0], p.c[1] - 68], { taille: 16 });
        dessinProduit(p.id, [p.c[0], p.c[1] - 4]);
        if (fait) D.texte(g, fait, [p.c[0], p.c[1] + 72], { taille: 15, coul: C.jeu });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Six produits, six procédés", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("L'atelier d'un fabricant de dispositifs médicaux. Associe chaque produit à son procédé.");
      j.consigne("Boss : chaque erreur compte.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:center;font-size:16px">' +
        [["Corps de seringue", "i"], ["Tubulure", "e"], ["Flacon de sérum", "s"], ["Blister", "t"], ["Réservoir d'eau", "r"], ["Plateau phénolique", "c"]].map(function (q) { return "<span>" + q[0] + '</span><span class="trou" data-attendu="' + q[1] + '" style="min-height:52px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "r", html: "Rotomoulage" }, { id: "c", html: "Compression" }, { id: "e", html: "Extrusion" }, { id: "t", html: "Thermoformage" }, { id: "i", html: "Injection" }, { id: "s", html: "Soufflage" }],
        aide: "Pense à la forme : section constante, pièce finie avec un point, contenant fermé, feuille découpée, grand volume creux, thermodurcissable.",
        ok: function () {
          n.faits = { seringue: "injection", tubulure: "extrusion", flacon: "soufflage", blister: "thermoformage", reservoir: "rotomoulage", plateau: "compression" }; n.dessin();
          j.bravo("L'atelier est rangé.");
          j.expliquer("<p>Chaque procédé a sa forme de pièce : profilé continu (extrusion), pièce finie (injection), contenant creux fermé (soufflage), pièce mince ouverte (thermoformage), grande pièce creuse (rotomoulage), pièce thermodurcissable (compression).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Justifier", jouer: function (j, n) {
      j.titre("Le contrôle qualité reçoit un flacon de sérum. Quelle observation prouve qu'il a été fait par injection-soufflage ?");
      j.choix([
        { html: "Une ligne de soudure au fond", aide: "Cette ligne prouverait le contraire : un tube extrudé pincé par le moule." },
        { html: "Un point d'injection au fond", juste: true },
        { html: "Une découpe tout autour du goulot", aide: "Une découpe au pourtour signe le thermoformage d'une feuille." },
        { html: "Une bavure sur le côté", aide: "La bavure vient des rainures de débordement d'un moule de compression." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le point d'injection de la préforme.");
        j.suite();
      } });
    } },
    { nom: "Le cycle de la tubulure", jouer: function (j, n) {
      j.titre("Suis le trajet de la matière de la tubulure, du granulé au profilé.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        ["t", "v", "f", "l"].map(function (id, k) { return "<b>" + (k + 1) + '</b><span class="trou" data-attendu="' + id + '" style="justify-content:flex-start"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "f", html: "Fourreau chauffant : la matière fond" }, { id: "x", html: "Moule fermé : refroidissement" }, { id: "t", html: "Trémie : les granulés entrent" }, { id: "l", html: "Filière : la forme est donnée" }, { id: "v", html: "Vis sans fin : elle malaxe et pousse" }],
        aide: "Une extrudeuse n'a pas de moule fermé : la forme vient de l'orifice de sortie.",
        ok: function () { j.bravo("Trémie, vis, fourreau, filière."); j.suite(); }
      });
    } },
    { nom: "Trouver l'erreur", jouer: function (j, n) {
      j.titre("Un stagiaire décrit le réservoir d'eau. Quelle phrase est fausse ?");
      j.choix([
        { html: "La matière est introduite sous forme de poudre dans le moule.", aide: "Juste : le rotomoulage part d'une poudre." },
        { html: "Le moule chauffé tourne : la poudre se dépose sur la paroi.", aide: "Juste : c'est la rotation du moule chauffé." },
        { html: "On colle ensuite les deux moitiés du réservoir.", juste: true },
        { html: "Le cycle est assez long, la pièce peut être très grande.", aide: "Juste : c'est l'indice du rotomoulage." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le rotomoulage donne une pièce creuse sans soudure ni collage.");
        j.suite();
      } });
    } },
    { nom: "La bonne matière", jouer: function (j, n) {
      j.titre("Dernière commande : un blister en résine époxy durcie. Que réponds-tu au client ?");
      j.choix([
        { html: "D'accord, le thermoformage convient à toutes les matières", aide: "Le thermoformage chauffe une feuille pour la ramollir. Que fait une résine déjà réticulée quand on la chauffe ?" },
        { html: "Impossible tel quel : une époxy durcie ne se ramollit plus ; prenons un thermoplastique comme le PVC ou le PP", juste: true },
        { html: "Il faut seulement chauffer plus longtemps", aide: "Chauffer plus un thermodurcissable le dégrade, il ne se ramollit pas." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Bon diagnostic : procédé et matière vont ensemble.");
        j.expliquer("<p>Le TP le demande pour chaque procédé : le principe, le matériau adapté, un produit représentatif. Le procédé dépend de la forme de la pièce, mais aussi du comportement de la matière à la chaleur.</p>");
        j.suite();
      } });
    } }
  ]
});
