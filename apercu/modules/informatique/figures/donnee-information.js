/* Figure : la pyramide données, informations, connaissance, avec un exemple par étage. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-pyramide", {
    largeur: 960, hauteur: 540, titre: "Données, informations, connaissance",
    essai: "<strong>Essaie</strong> : touche chaque étage, puis change d'exemple. <strong>Observe</strong> : chaque étage ajoute quelque chose à celui du dessous : un sens, puis une interprétation."
  });
  var EX = [
    { nom: "Tension", d: "122", i: "Tension systolique de M. Alaoui ce matin : 122 mmHg", k: "122 mmHg est une valeur normale : pas de traitement à changer" },
    { nom: "Glycémie", d: "1,85", i: "Glycémie à jeun de Mme Bennani : 1,85 g/L", k: "Une glycémie à jeun élevée et répétée fait suspecter un diabète" },
    { nom: "Imagerie", d: "Valeurs de gris des pixels", i: "IRM du genou de M. Idrissi, 3 mars", k: "Cet aspect du ligament signe une rupture : il faut opérer" }
  ];
  var ex = 0, choisi = -1, g = A.s("g", null, f.svg);
  var ET = [
    { t: "Connaissance", y: 70, l: 400, coul: C.v, pale: C.vPale, def: "informations mémorisées et interprétées : une étape de la transformation de l'information par l'intelligence." },
    { t: "Informations", y: 220, l: 580, coul: C.acc, pale: C.accPale, def: "données organisées auxquelles on donne un sens." },
    { t: "Données", y: 370, l: 760, coul: C.turq, pale: C.turqPale, def: "éléments factuels neutres et objectifs, explicites et stockés." }
  ];
  function dessiner() {
    A.vider(g);
    ET.forEach(function (e, k) {
      var x = 390, haut = e.l - 180, on = choisi === k;
      A.s("polygon", { points: [[x - haut / 2, e.y], [x + haut / 2, e.y], [x + e.l / 2, e.y + 140], [x - e.l / 2, e.y + 140]].map(function (p) { return p.join(","); }).join(" "), fill: on ? e.pale : "#fff", stroke: e.coul, "stroke-width": on ? 5 : 3 }, g);
      A.texte(g, e.t, [x, e.y + 34], { taille: 22, gras: 800, coul: e.coul, halo: false });
      var v = [EX[ex].k, EX[ex].i, EX[ex].d][k];
      A.texte(g, "« " + v + " »", [x, e.y + 92], { taille: 15, halo: false, largeur: haut + 20, gras: 500 });
      A.cible(g, x - e.l / 2 + 60, e.y, e.l - 120, 140, function () { choisi = k; dessiner(); });
    });
    A.texte(g, "Wisdom (sagesse)", [390, 40], { taille: 15, coul: C.gris, gras: 700 });
    A.texte(g, "Modèle DIKW", [860, 80], { taille: 20, gras: 800 });
    [["Data", "données"], ["Information", "informations"], ["Knowledge", "connaissance"], ["Wisdom", "sagesse"]].forEach(function (x, i) {
      A.texte(g, x[0] + " : " + x[1], [860, 130 + i * 34], { taille: 15, coul: i === 3 ? C.gris : C.encre });
    });
    f.direct.innerHTML = choisi >= 0 ? "<strong>" + ET[choisi].t + "</strong> : " + ET[choisi].def : "Touche un étage de la pyramide.";
  }
  var b = R.boutons(f.reglages), bts = EX.map(function (e, i) { return R.bouton(b, e.nom, function () { ex = i; bts.forEach(function (x, k) { x.classList.toggle("actif", k === i); }); dessiner(); }); });
  bts[0].classList.add("actif");
  dessiner();
})();
