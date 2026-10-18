/* Figure : coupe du plafond technique ; afficher chaque réseau, puis voir ce qui arrive sans coordination. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-plafond", {
    largeur: 960, hauteur: 540, titre: "Le plafond technique",
    essai: "<strong>Essaie</strong> : active les couches une à une, puis désactive « Coordination ». <strong>Observe</strong> : sans coordination entre architecture, CVC, électricité, fluides médicaux et biomédical, une gaine occupe la place du support d'un bras plafonnier."
  });
  var g = A.s("g", null, f.svg);
  var L = [["Ventilation et gaines", C.acc, 40, 330, 110], ["Réseaux électriques", C.ko, 390, 170, 40], ["Réseaux informatiques", C.v, 390, 170, 40], ["Gaz médicaux et évacuation", C.ok, 580, 170, 40], ["Éclairage", "#e8a317", 580, 170, 40], ["Supports des équipements", C.encre, 770, 150, 110]];
  var b = R.boutons(f.reglages), on = L.map(function () { return true; }), bts = [];
  L.forEach(function (l, i) { bts.push(R.bouton(b, l[0], function () { on[i] = !on[i]; dessiner(); })); });
  var b2 = R.boutons(f.reglages);
  var bCo = R.bascule(b2, "Coordination", true, dessiner);
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    bts.forEach(function (bt, i) { bt.classList.toggle("actif", on[i]); });
    A.s("rect", { x: 20, y: 20, width: 920, height: 26, fill: "#9aa0ad" }, g);
    A.s("rect", { x: 20, y: 46, width: 920, height: 190, fill: C.fond }, g);
    A.s("line", { x1: 20, y1: 236, x2: 940, y2: 236, stroke: C.encre, "stroke-width": 5 }, g);
    A.texte(g, "plafond technique", [790, 256], { taille: 14, coul: C.doux, ancre: "end" });
    L.forEach(function (l, i) {
      if (!on[i]) return;
      var x = l[2], y = 230 - l[4] - (i === 2 || i === 4 ? 50 : 0), w = l[3];
      if (!bCo.checked && i === 0) x = 600;
      A.s("rect", { x: x, y: y, width: w, height: l[4], rx: 6, fill: "#fff", stroke: l[1], "stroke-width": 3, opacity: 0.95 }, g);
      A.texte(g, l[0], [x + w / 2, y + l[4] / 2], { taille: 14, largeur: w - 10, halo: false });
    });
    // salle : bras plafonnier et scialytique accrochés aux supports
    A.s("line", { x1: 845, y1: 236, x2: 845, y2: 330, stroke: C.encre, "stroke-width": 7 }, g);
    A.s("rect", { x: 820, y: 330, width: 50, height: 90, rx: 6, fill: C.vPale, stroke: C.v, "stroke-width": 3 }, g);
    A.texte(g, "bras plafonnier", [845, 440], { taille: 14 });
    A.s("line", { x1: 480, y1: 236, x2: 480, y2: 320, stroke: C.encre, "stroke-width": 6 }, g);
    A.s("path", { d: "M430 345 A50 26 0 0 1 530 345 Z", fill: "#ffe9a8", stroke: C.encre, "stroke-width": 2.5 }, g);
    A.s("rect", { x: 380, y: 470, width: 200, height: 16, fill: C.doux }, g);
    var conflit = !bCo.checked && on[0] && on[5];
    if (conflit) { A.s("rect", { x: 596, y: 110, width: 340, height: 124, fill: "none", stroke: C.ko, "stroke-width": 4, "stroke-dasharray": "8 6" }, g); A.texte(g, "conflit : la gaine passe là où doit aller le support", [700, 280], { taille: 16, coul: C.ko }); }
    zone.innerHTML = conflit ? "<span class=\"alerte\">Sans coordination :</span> la gaine de ventilation occupe la place du support du bras plafonnier." : "Coordination : architecture + CVC + électricité + fluides médicaux + biomédical. Le plafond technique intègre ventilation, gaines, réseaux électriques et informatiques, gaz médicaux, évacuation, éclairage, supports des équipements.";
  }
  dessiner();
})();
