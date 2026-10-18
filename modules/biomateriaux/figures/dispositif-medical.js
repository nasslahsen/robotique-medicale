(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Arbre de décision : DM ou médicament ---------- */
  (function () {
    var f = R.figure("fig-arbre", {
      largeur: 960, hauteur: 460, titre: "Dispositif médical ou médicament",
      essai: "<strong>Essaie</strong> : choisis un produit dans la liste. <strong>Observe</strong> : seul le mode d'action principal décide ; un logiciel peut être un DM, un liquide peut être un médicament ou passer dans un DM."
    });
    var PROD = [
      ["seringue", "Seringue", "dm", "mécanique : pousse un liquide", "traitement d'une maladie"],
      ["insuline", "Insuline", "met", "métabolisme", null],
      ["vaccin", "Vaccin", "imm", "immunologique", null],
      ["antibiotique", "Comprimé d'antibiotique", "pha", "pharmacologique", null],
      ["logiciel", "Logiciel d'aide au diagnostic", "dm", "traitement d'informations", "diagnostic d'une maladie"],
      ["valve", "Valve cardiaque", "dm", "mécanique : laisse passer le sang dans un seul sens", "remplacement de l'anatomie"],
      ["fauteuil", "Fauteuil roulant", "dm", "mécanique", "compensation d'un handicap"],
      ["pansement", "Pansement", "dm", "barrière mécanique, absorption", "traitement d'une blessure"]
    ];
    var b = R.boutons(f.reglages);
    var sel = R.choix(b, PROD.map(function (p) { return [p[0], p[1]]; }), dessin);
    var g = R.el("g", null, f.svg);
    function boite(x, y, l, h, lignes, act, coul) {
      R.el("rect", { x: x - l / 2, y: y - h / 2, width: l, height: h, rx: 18, fill: act ? (coul || PLATEFORME.teinte(0.18)) : "#fff", stroke: act ? C.acc : "#c6cbd8", "stroke-width": act ? 3.5 : 2.5 }, g);
      lignes.forEach(function (t, k) { R.texte(g, t, [x, y + (k - (lignes.length - 1) / 2) * 24], { italique: false, gras: k === 0, taille: 18, halo: false }); });
    }
    function dessin() {
      R.vider(g);
      var p = PROD.filter(function (x) { return x[0] === sel.value; })[0], dm = p[2] === "dm";
      boite(480, 50, 420, 60, [p[1], "usage à des fins médicales"], true, "#f3f5fa");
      R.fleche(g, [480, 80], [480, 120], { couleur: C.fonce, epaisseur: 3 });
      boite(480, 180, 620, 110, ["Mode d'action principal voulu", "pharmacologique, immunologique", "ou par métabolisme ?"], true, "#f3f5fa");
      R.fleche(g, [330, 235], [210, 320], { couleur: dm ? "#c6cbd8" : C.acc, epaisseur: dm ? 3 : 5 });
      R.fleche(g, [630, 235], [750, 320], { couleur: dm ? C.acc : "#c6cbd8", epaisseur: dm ? 5 : 3 });
      R.texte(g, "oui", [250, 268], { italique: false, couleur: C.doux, taille: 18 });
      R.texte(g, "non", [712, 268], { italique: false, couleur: C.doux, taille: 18 });
      boite(200, 380, 300, 100, ["Médicament", dm ? "" : "voie : " + p[3]], !dm);
      boite(760, 380, 300, 100, ["Dispositif médical", dm ? "finalité : " + p[4] : ""], dm);
      f.direct.innerHTML = "<p><strong>" + p[1] + "</strong> : action principale " + p[3] + ". " + (dm ? "C'est un <strong>dispositif médical</strong>." : "C'est un <strong>médicament</strong>, même s'il peut être administré avec un DM.") + "</p>";
    }
    dessin();
  })();
})();
