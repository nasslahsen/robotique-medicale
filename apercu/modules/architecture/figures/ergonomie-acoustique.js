/* Figure : l'équipe autour de la table ; comparer une salle mal pensée et une salle ergonomique, avec les sources de bruit. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-ergonomie", {
    largeur: 960, hauteur: 540, titre: "Mouvements de l'équipe et bruit",
    essai: "<strong>Essaie</strong> : compare les deux salles, puis active les sources de bruit. <strong>Observe</strong> : dans la salle ergonomique, chaque appareil est à côté de celui qui l'utilise et rien ne traîne au sol. Salles d'exemple ajoutées."
  });
  var g = A.s("g", null, f.svg), bonne = false;
  var b = R.boutons(f.reglages);
  var b1 = R.bouton(b, "Salle mal pensée", function () { bonne = false; dessiner(); });
  var b2 = R.bouton(b, "Salle ergonomique", function () { bonne = true; dessiner(); });
  var bBruit = R.bascule(b, "Sources de bruit", false, dessiner);
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    b1.classList.toggle("actif", !bonne); b2.classList.toggle("actif", bonne);
    A.s("rect", { x: 140, y: 20, width: 680, height: 500, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
    A.s("rect", { x: 440, y: 160, width: 80, height: 240, rx: 10, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
    A.s("circle", { cx: 480, cy: 190, r: 16, fill: "#f6c2b0" }, g);
    A.s("rect", { x: 458, y: 210, width: 44, height: 170, rx: 16, fill: "#cfe0f7" }, g);
    A.icone(g, "personne", [380, 290], 44, C.personnel); A.texte(g, "Chirurgien", [380, 330], { taille: 14, coul: C.personnel });
    A.icone(g, "personne", [480, 100], 44, C.v); A.texte(g, "Anesthésie", [540, 92], { taille: 14, coul: C.v, ancre: "start" });
    A.icone(g, "personne", [590, 300], 44, C.ok); A.texte(g, "Instrumentiste", [590, 340], { taille: 14, coul: C.ok });
    var pb = [];
    if (bonne) {
      A.boite(g, 340, 60, 90, 60, { fond: C.vPale, bord: C.v, rx: 8, ep: 2, titre: "Respirateur", taille: 13 });
      A.boite(g, 620, 360, 110, 60, { fond: C.okPale, bord: C.ok, rx: 8, ep: 2, titre: "Instruments", taille: 13 });
      A.s("rect", { x: 560, y: 190, width: 90, height: 50, rx: 4, fill: C.encre }, g); A.texte(g, "écran", [605, 215], { taille: 13, coul: "#fff", halo: false });
      A.s("circle", { cx: 610, cy: 150, r: 26, fill: "none", stroke: C.doux, "stroke-width": 3, "stroke-dasharray": "5 4" }, g); A.texte(g, "bras plafonnier", [650, 120], { taille: 13, coul: C.doux, ancre: "start" });
    } else {
      A.boite(g, 660, 440, 100, 60, { fond: C.vPale, bord: C.v, rx: 8, ep: 2, titre: "Respirateur", taille: 13 });
      A.s("path", { d: "M660 470 C560 480 400 420 300 470 C240 500 200 480 160 470", fill: "none", stroke: C.encre, "stroke-width": 4 }, g);
      A.s("path", { d: "M700 440 Q620 200 500 190", fill: "none", stroke: C.ko, "stroke-width": 3, "stroke-dasharray": "6 5" }, g);
      A.boite(g, 160, 40, 110, 60, { fond: C.okPale, bord: C.ok, rx: 8, ep: 2, titre: "Instruments", taille: 13 });
      A.s("rect", { x: 220, y: 240, width: 70, height: 50, rx: 6, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 2 }, g);
      A.s("rect", { x: 200, y: 330, width: 90, height: 50, rx: 4, fill: C.encre }, g); A.texte(g, "écran", [245, 355], { taille: 13, coul: "#fff", halo: false });
      [[230, 470, "câbles au sol"], [255, 225, "obstacle"], [245, 400, "écran dans le dos du chirurgien"], [215, 120, "déplacements excessifs"], [690, 300, "tuyau qui traverse la salle"]].forEach(function (t) { A.texte(g, t[2], [t[0], t[1]], { taille: 14, coul: C.ko }); });
      pb = ["câbles au sol", "obstacle", "mauvaise visibilité", "déplacements excessifs", "croisements inutiles"];
    }
    if (bBruit.checked) {
      [["air", [200, 60], "ventilation"], ["bruit", [760, 60], "alarmes"], ["ecran", [760, 260], "équipements"], ["porte", [820, 480], "portes"], ["boite", [180, 420], "chariots"], ["equipe", [880, 180], "conversations"]].forEach(function (s) {
        A.icone(g, s[0], s[1], 34, "#c46a00"); A.texte(g, s[2], [s[1][0], s[1][1] + 30], { taille: 13, coul: "#c46a00" });
      });
    }
    zone.innerHTML = (bonne ? "Respirateur à la tête près de l'anesthésiste, instruments près de l'instrumentiste, écran dans l'axe du regard, prises et fluides sur bras plafonnier : rien au sol." : "<span class=\"alerte\">Défauts :</span> " + pb.join(", ") + ".") + (bBruit.checked ? " Sources de bruit : ventilation, alarmes, équipements, portes, chariots, conversations ; une mauvaise acoustique augmente la fatigue du personnel." : "");
  }
  dessiner();
})();
