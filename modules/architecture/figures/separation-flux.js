/* Figure : un couloir, trois flux ; comparer « même circulation sans contrôle » aux trois types de séparation. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-separation", {
    largeur: 960, hauteur: 540, titre: "Séparer le propre et le sale",
    essai: "<strong>Essaie</strong> : passe d'un mode à l'autre ; en séparation temporelle, déplace l'heure. <strong>Observe</strong> : le point de croisement rouge disparaît, par des murs, par des horaires ou par des règles."
  });
  var g = A.s("g", null, f.svg), mode = "aucune";
  var b = R.boutons(f.reglages), bts = {};
  [["aucune", "Sans contrôle"], ["physique", "Physique"], ["temporelle", "Temporelle"], ["orga", "Organisationnelle"]].forEach(function (o) { bts[o[0]] = R.bouton(b, o[1], function () { mode = o[0]; dessiner(); }); });
  var heure = R.curseur(f.reglages, { nom: "Heure", min: 7, max: 20, pas: 1, val: 10, unite: " h", surChange: function () { if (mode === "temporelle") dessiner(); } });
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    Object.keys(bts).forEach(function (k) { bts[k].classList.toggle("actif", k === mode); });
    A.boite(g, 20, 40, 200, 100, { titre: "Stockage propre", fond: C.okPale, bord: C.propre });
    A.boite(g, 20, 200, 200, 100, { titre: "Patient (transfert)", fond: C.vPale, bord: C.patient });
    A.boite(g, 740, 40, 200, 160, { titre: "Salle d'opération", fond: A.ZONES.restreinte.fond, bord: A.ZONES.restreinte.bord });
    A.boite(g, 740, 330, 200, 100, { titre: "Local sale", fond: "#fbeee6", bord: C.sale });
    var deux = mode === "physique";
    A.s("rect", { x: 240, y: 70, width: 480, height: 200, rx: 12, fill: C.fond, stroke: C.trait, "stroke-width": 2 }, g);
    A.texte(g, deux ? "Couloir propre" : "Couloir unique", [480, 250], { taille: 16, coul: C.doux });
    if (deux) { A.s("rect", { x: 240, y: 300, width: 480, height: 110, rx: 12, fill: "#fbeee6", stroke: C.sale, "stroke-width": 2.5 }, g); A.texte(g, "Couloir sale", [480, 390], { taille: 16, coul: C.sale }); }
    A.chemin(g, [[222, 90], [300, 90], [300, 150], [738, 100]], { coul: C.propre, ep: 6 });
    A.chemin(g, [[222, 250], [340, 250], [340, 190], [738, 150]], { coul: C.patient, ep: 6 });
    var h = heure.v, saleDansCouloir = mode === "aucune" || mode === "orga" || (mode === "temporelle" && h >= 18);
    var propreActif = !(mode === "temporelle" && h >= 18);
    if (mode === "physique") A.chemin(g, [[840, 202], [840, 260], [680, 260], [680, 355], [738, 380]], { coul: C.sale, ep: 6 });
    else if (saleDansCouloir) A.chemin(g, [[738, 180], [560, 200], [560, 290], [738, 360]], { coul: C.sale, ep: 6, tirets: mode === "orga" ? null : "12 7" });
    if (mode === "orga") { A.s("rect", { x: 540, y: 225, width: 44, height: 30, rx: 5, fill: "#fff", stroke: C.sale, "stroke-width": 3 }, g); A.texte(g, "bac fermé", [606, 240], { taille: 14, coul: C.sale, ancre: "start" }); }
    if (mode === "aucune") { A.s("circle", { cx: 560, cy: 170, r: 34, fill: "none", stroke: C.ko, "stroke-width": 5 }, g); A.texte(g, "croisement sans contrôle", [560, 120], { taille: 16, coul: C.ko }); }
    if (mode === "temporelle") {
      A.texte(g, propreActif ? "programme opératoire : le sale attend" : "fin de programme : le sale sort", [480, 470], { taille: 18, coul: propreActif ? C.propre : C.sale });
      A.s("rect", { x: 240, y: 500, width: 480, height: 14, rx: 7, fill: C.pale }, g);
      A.s("rect", { x: 240 + (18 - 7) / 13 * 480, y: 500, width: (20 - 18) / 13 * 480 + 4, height: 14, rx: 7, fill: C.sale }, g);
      A.s("circle", { cx: 240 + (h - 7) / 13 * 480, cy: 507, r: 11, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
    }
    var T = {
      aucune: "Propre, patient et sale dans le même couloir, sans règle : c'est la situation que le cours demande d'éviter.",
      physique: "Séparation physique : un couloir sale distinct. Le sale ne traverse plus les zones propres. C'est la solution préférée quand le projet le permet.",
      temporelle: "Séparation temporelle : même couloir, mais pas en même temps. Ici, le sale ne sort qu'après 18 h (horaire d'exemple).",
      orga: "Séparation organisationnelle : même couloir, mais le sale circule en contenant fermé, selon des règles. Elle dépend du respect des règles par chacun."
    };
    zone.innerHTML = T[mode];
  }
  dessiner();
})();
