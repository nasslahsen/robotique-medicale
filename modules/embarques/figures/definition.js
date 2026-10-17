(function () {
  "use strict";
  var R = RM, C = EMB.C;

  // coche et croix dessinées (pas de caractère spécial)
  function coche(g, p, ok) {
    EMB.el("circle", { cx: p[0], cy: p[1], r: 17, fill: ok ? C.ok : C.ko }, g);
    if (ok) EMB.el("path", { d: "M" + (p[0] - 8) + " " + p[1] + " l6 6 l11 -12", fill: "none", stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    else EMB.el("path", { d: "M" + (p[0] - 7) + " " + (p[1] - 7) + " l14 14 M" + (p[0] + 7) + " " + (p[1] - 7) + " l-14 14", stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round" }, g);
  }

  /* ---------- Figure 1 : les trois critères, appareil par appareil ---------- */
  (function () {
    var f = R.figure("fig-criteres", {
      largeur: 960, hauteur: 470,
      titre: "Est-ce un système embarqué ?",
      essai: "<strong>Essaie</strong> : choisis un appareil avec les boutons. <strong>Observe</strong> : un système embarqué coche les trois critères du cours ; l'ordinateur de bureau a bien un microprocesseur, mais il n'est dédié à aucune tâche.",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    var APP = [
      { nom: "Semelle connectée", tache: "mesurer les appuis du pied\net les transmettre par radio", c: [1, 1, 1], res: "accumulateur, place d'une chaussure" },
      { nom: "Tensiomètre", tache: "mesurer la pression artérielle", c: [1, 1, 1], res: "piles, boîtier tenu dans la main" },
      { nom: "Pousse-seringue", tache: "pousser le piston\nà un débit réglé", c: [1, 1, 1], res: "batterie de secours, boîtier compact" },
      { nom: "Ordinateur de bureau", tache: "tout ce qu'on y installe", c: [1, 0, 0], res: "branché au secteur, grand boîtier" }
    ];
    var CRIT = ["includes a microprocessor", "involves the immediate control of hardware", "is limited to performing a specific function"];
    var k = 0, b = R.boutons(f.reglages), btns = [];
    APP.forEach(function (a, i) { btns.push(R.bouton(b, a.nom, function () { k = i; dessiner(); })); });
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === k); });
      var a = APP[k], tous = a.c.every(function (x) { return x; });
      EMB.el("rect", { x: 20, y: 20, width: 330, height: 430, rx: 22, fill: C.fond, stroke: C.pale, "stroke-width": 2 }, g);
      EMB.texte(g, a.nom, [185, 70], { taille: 26 });
      EMB.texte(g, "Sa tâche", [185, 140], { taille: 16, coul: C.doux, gras: false });
      EMB.texte(g, a.tache, [185, 190], { taille: 20, gras: false });
      EMB.texte(g, "Ses ressources", [185, 290], { taille: 16, coul: C.doux, gras: false });
      EMB.texte(g, a.res.replace(", ", ",\n"), [185, 335], { taille: 18, gras: false });
      CRIT.forEach(function (t, i) {
        var y = 40 + i * 104;
        EMB.el("rect", { x: 380, y: y, width: 560, height: 84, rx: 16, fill: "#fff", stroke: a.c[i] ? C.ok : C.ko, "stroke-width": 2.5 }, g);
        coche(g, [418, y + 42], a.c[i]);
        EMB.texte(g, t, [450, y + 42], { taille: 20, ancre: "start", italique: true, gras: false });
      });
      EMB.el("rect", { x: 380, y: 366, width: 560, height: 84, rx: 16, fill: tous ? C.acc : "#eef0f5", stroke: "none" }, g);
      EMB.texte(g, tous ? "Système embarqué" : "Pas un système embarqué : il est généraliste", [660, 408], { taille: tous ? 26 : 21, coul: tous ? "#fff" : C.doux, halo: false });
    }
    dessiner();
  })();

  /* ---------- Figure 2 : embedded controller et embedded computer system ---------- */
  (function () {
    var f = R.figure("fig-termes", {
      largeur: 960, hauteur: 440,
      titre: "Deux termes voisins",
      essai: "<strong>Essaie</strong> : touche un des deux boutons. <strong>Observe</strong> : l'<i>embedded controller</i> travaille à côté du processeur principal d'un ordinateur ; l'<i>embedded computer system</i> est une partie d'un appareil plus grand."
    });
    var g = EMB.el("g", null, f.svg), choix = 0, b = R.boutons(f.reglages);
    var b1 = R.bouton(b, "Embedded controller", function () { choix = 1; dessiner(); });
    var b2 = R.bouton(b, "Embedded computer system", function () { choix = 2; dessiner(); });
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      b1.classList.toggle("actif", choix === 1); b2.classList.toggle("actif", choix === 2);
      EMB.el("rect", { x: 20, y: 20, width: 440, height: 400, rx: 20, fill: "#fafbfd", stroke: choix === 1 ? C.acc : C.pale, "stroke-width": choix === 1 ? 3 : 2 }, g);
      EMB.texte(g, "Ordinateur portable", [240, 52], { taille: 20 });
      EMB.bloc(g, 50, 80, 170, 80, "Processeur\nprincipal", { taille: 18 });
      EMB.bloc(g, 260, 80, 170, 80, "Embedded\ncontroller", { taille: 18, actif: choix === 1, mono: false });
      EMB.texte(g, "indépendant", [240, 186], { taille: 15, coul: C.doux, gras: false });
      [["clavier", 60], ["batterie", 190], ["ventilateur", 320]].forEach(function (d) {
        EMB.bloc(g, d[1], 300, 110, 56, d[0], { taille: 16, fill: C.fond });
        EMB.fleche(g, [345, 160], [d[1] + 55, 300], { ep: 2.2, coul: choix === 1 ? C.acc : C.encre });
      });
      EMB.el("rect", { x: 500, y: 20, width: 440, height: 400, rx: 20, fill: "#fafbfd", stroke: choix === 2 ? C.acc : C.pale, "stroke-width": choix === 2 ? 3 : 2 }, g);
      EMB.texte(g, "Échographe (système plus grand)", [720, 52], { taille: 20 });
      EMB.bloc(g, 530, 90, 160, 70, "Sonde", { taille: 18, fill: C.fond });
      EMB.bloc(g, 750, 90, 160, 70, "Écran", { taille: 18, fill: C.fond });
      EMB.bloc(g, 600, 205, 240, 90, "Embedded\ncomputer system", { taille: 18, actif: choix === 2 });
      EMB.bloc(g, 530, 335, 160, 60, "Clavier", { taille: 18, fill: C.fond });
      EMB.bloc(g, 750, 335, 160, 60, "Chariot", { taille: 18, fill: C.fond });
      EMB.fleche(g, [610, 160], [650, 205], { ep: 2.2 }); EMB.fleche(g, [790, 205], [830, 160], { ep: 2.2 }); EMB.fleche(g, [610, 335], [650, 295], { ep: 2.2 });
      zone.innerHTML = choix === 1 ? "<i>A programmable microprocessor that has a dedicated function to control specific components of the computer architecture independent of the main processor.</i>"
        : choix === 2 ? "<i>A computer system that is part of a larger system and performs some of the requirements of that system.</i>" : "Touche un des deux termes.";
    }
    dessiner();
  })();
})();
