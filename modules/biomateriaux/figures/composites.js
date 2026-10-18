(function () {
  "use strict";
  var R = RM, C = R.C;
  function boite(g, x, y, w, h, txt, actif, coul) {
    R.el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 12, fill: actif ? (coul || PLATEFORME.teinte(0.18)) : "#fff", stroke: actif ? C.acc : "#c6cbd8", "stroke-width": actif ? 2.5 : 1.5 }, g);
    R.texte(g, txt, [x, y + 1], { italique: false, taille: 16, gras: actif });
  }

  /* ---------- Figure 1 : familles de matrices et de renforts ---------- */
  (function () {
    var f = R.figure("fig-familles", {
      largeur: 960, hauteur: 440,
      titre: "Familles de matrices et de renforts",
      essai: "<strong>Essaie</strong> : passe de « Matrices » à « Renforts », puis choisis un exemple de composite. " +
        "<strong>Observe</strong> : l'exemple allume sa matrice et son renfort dans les deux arbres du cours."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages), vue = "m";
    var bm = R.bouton(b, "Matrices", function () { vue = "m"; dessin(); }), br = R.bouton(b, "Renforts", function () { vue = "r"; dessin(); });
    var ex = R.choix(b, [["", "Exemple : aucun"], ["main", "Main prothétique carbone-époxy"], ["dent", "Composite dentaire (renfort minéral)"], ["gd", "Planche à voile polyester-verre"], ["casque", "Casque en aramide-résine"]], dessin);
    // allumés : [matrice, renfort]
    var EX = { main: ["thermodurcissables", "carbone"], dent: ["thermodurcissables", "céramiques"], gd: ["thermodurcissables", "verre"], casque: ["thermodurcissables", "aramides"] };
    var TXT = { main: "Matrice époxy (thermodurcissable) + fibres de carbone : composite à hautes performances.", dent: "Exemple ajouté : résine qui durcit dans la dent + charge minérale (verre ou céramique).", gd: "Résine polyester (thermodurcissable) + fibre de verre : le couple des composites de grande diffusion.", casque: "Exemple ajouté : tissu d'aramide (Kevlar) imprégné d'une résine thermodurcissable ; le cours montre un casque et un gilet en aramide." };
    function arbre(noeuds, liens, on) {
      liens.forEach(function (l) { R.ligne(g, [noeuds[l[0]][0], noeuds[l[0]][1] + 20], [noeuds[l[1]][0], noeuds[l[1]][1] - 20], { couleur: "#9aa0ad", epaisseur: 2 }); });
      Object.keys(noeuds).forEach(function (k) { var p = noeuds[k]; boite(g, p[0], p[1], p[2] || 170, 40, k, on.indexOf(k) >= 0); });
    }
    function dessin() {
      R.vider(g);
      bm.classList.toggle("actif", vue === "m"); br.classList.toggle("actif", vue === "r");
      var e = EX[ex.value] || [], on = [];
      if (vue === "m") {
        var N = { "Matrices": [480, 50, 160], "organiques": [250, 140, 160], "minérales": [720, 140, 160], "thermodurcissables": [100, 240, 180], "thermoplastique": [290, 240, 170], "élastomères": [470, 240, 150], "céramique": [640, 240, 140], "métalliques": [820, 240, 150], "borures": [520, 340, 120], "carbures": [660, 340, 120], "nitrures": [800, 340, 120] };
        if (e[0]) { on = ["Matrices", e[0]]; on.push(["thermodurcissables", "thermoplastique", "élastomères"].indexOf(e[0]) >= 0 ? "organiques" : "minérales"); }
        arbre(N, [["Matrices", "organiques"], ["Matrices", "minérales"], ["organiques", "thermodurcissables"], ["organiques", "thermoplastique"], ["organiques", "élastomères"], ["minérales", "céramique"], ["minérales", "métalliques"], ["céramique", "borures"], ["céramique", "carbures"], ["céramique", "nitrures"]], on);
      } else {
        var M = { "Renfort": [480, 40, 140], "Organiques": [200, 120, 150], "Inorganiques": [700, 120, 160], "polyesters": [110, 210, 130], "aramides": [290, 210, 130], "Minéraux": [560, 210, 140], "Végétaux": [830, 210, 140], "céramiques": [470, 300, 140], "métalliques ": [650, 300, 140], "bois": [770, 300, 90], "coton, papier, jute": [858, 380, 170], "verre": [360, 390, 100], "carbone": [480, 390, 110], "bore": [600, 390, 90] };
        if (e[1]) { on = ["Renfort", e[1]]; if (e[1] === "aramides") on.push("Organiques"); else on = on.concat(["Inorganiques", "Minéraux", "céramiques"]); }
        arbre(M, [["Renfort", "Organiques"], ["Renfort", "Inorganiques"], ["Organiques", "polyesters"], ["Organiques", "aramides"], ["Inorganiques", "Minéraux"], ["Inorganiques", "Végétaux"], ["Minéraux", "céramiques"], ["Minéraux", "métalliques "], ["Végétaux", "bois"], ["Végétaux", "coton, papier, jute"], ["céramiques", "verre"], ["céramiques", "carbone"], ["céramiques", "bore"]], on);
      }
      f.direct.innerHTML = TXT[ex.value] || "Arbres du cours : choisis un exemple pour voir où se placent sa matrice et son renfort.";
    }
    dessin();
  })();

  /* ---------- Figure 2 : formes du renfort ---------- */
  (function () {
    var f = R.figure("fig-tissu", {
      largeur: 960, hauteur: 360,
      titre: "Roving, mat et tissu",
      essai: "<strong>Essaie</strong> : touche chaque forme de renfort. " +
        "<strong>Observe</strong> : le roving garde les fibres parallèles, le mat les dispose au hasard avec un liant, le tissu croise fils de chaîne et fils de trame."
    });
    var g = R.el("g", null, f.svg), choisi = "tissu";
    var b = R.boutons(f.reglages), btn = {};
    [["roving", "Roving"], ["mat", "Mat"], ["tissu", "Tissu (taffetas)"]].forEach(function (o) { btn[o[0]] = R.bouton(b, o[1], function () { choisi = o[0]; dessin(); }); });
    var TXT = { roving: "Roving : assemblage de plusieurs fibres parallèles ; les rovings peuvent être tissés.", mat: "Mat : feuille de fibres coupées (ou continues) retenues ensemble par un liant ; épaisseur faible.", tissu: "Tissu : fils de chaîne (gris) et fils de trame (couleur) entrecroisés sur un métier à tisser ; armures satin, sergé, taffetas." };
    function dessin() {
      R.vider(g);
      Object.keys(btn).forEach(function (k) { btn[k].classList.toggle("actif", k === choisi); });
      var op = function (k) { return k === choisi ? 1 : 0.3; };
      var gr = R.el("g", { opacity: op("roving") }, g);
      for (var i = 0; i < 12; i++) R.ligne(gr, [40, 110 + i * 12], [280, 110 + i * 12], { couleur: C.acc, epaisseur: 6 });
      R.texte(gr, "roving", [160, 300], { italique: false, taille: 20, gras: true });
      gr = R.el("g", { opacity: op("mat") }, g);
      var r = BIO.hasard(5);
      for (i = 0; i < 70; i++) { var cx = 340 + r() * 240, cy = 90 + r() * 170, a = r() * Math.PI; R.ligne(gr, [cx, cy], [cx + 46 * Math.cos(a), cy + 46 * Math.sin(a)], { couleur: C.acc, epaisseur: 3.5 }); }
      R.texte(gr, "mat", [480, 300], { italique: false, taille: 20, gras: true });
      gr = R.el("g", { opacity: op("tissu") }, g);
      for (i = 0; i < 7; i++) R.el("rect", { x: 660 + i * 38, y: 80, width: 20, height: 190, fill: "#9aa0ad" }, gr);
      for (i = 0; i < 8; i++) R.el("rect", { x: 646, y: 92 + i * 22, width: 280, height: 12, fill: PLATEFORME.teinte(0.85) }, gr);
      for (i = 0; i < 7; i++) for (var m = 0; m < 8; m++) if ((i + m) % 2 === 0) R.el("rect", { x: 660 + i * 38, y: 90 + m * 22, width: 20, height: 16, fill: "#9aa0ad" }, gr);
      R.texte(gr, "tissu : chaîne et trame", [790, 300], { italique: false, taille: 20, gras: true });
      f.direct.innerHTML = TXT[choisi];
    }
    dessin();
  })();

  /* ---------- Figure 3 : module et module spécifique ---------- */
  (function () {
    var f = R.figure("fig-specifique", {
      largeur: 960, hauteur: 480,
      titre: "Module et module spécifique des matériaux du tableau du cours",
      essai: "<strong>Essaie</strong> : bascule entre « Module E » et « Module spécifique E/ρ ». " +
        "<strong>Observe</strong> : en module, l'acier et le carbone haut module font jeu égal ; rapportés à la masse, les métaux se tassent tous vers 25 et les composites carbone, bore et aramide passent devant."
    });
    var g = R.el("g", null, f.svg);
    var spec = R.bascule(R.boutons(f.reglages), "Module spécifique E/ρ", false, dessin);
    var L = [["acier SAE 1010", 7.87, 207, 0], ["Ti-6Al-4V", 4.43, 110, 0], ["alu 6061-T6", 2.70, 68.9, 0], ["INCO 718", 8.2, 207, 0], ["carbone HR-époxy UD", 1.55, 137.8, 1], ["carbone HM-époxy UD", 1.63, 215, 1], ["verre E-époxy UD", 1.85, 39.3, 1], ["Kevlar 49-époxy UD", 1.38, 75.8, 1], ["bore-alu 6061", 2.35, 220, 1], ["carbone-époxy quasi isotrope", 1.55, 45.5, 1]];
    function dessin() {
      R.vider(g);
      var s = spec.checked, max = s ? 140 : 230, x0 = 290, w = 560;
      R.texte(g, s ? "E / ρ (GPa par g/cm³)" : "E (GPa)", [x0 + w / 2, 22], { italique: false, taille: 17, gras: true });
      L.forEach(function (l, i) {
        var v = s ? l[2] / l[1] : l[2], y = 46 + i * 42;
        R.texte(g, l[0], [x0 - 12, y + 15], { italique: false, taille: 15, ancre: "end" });
        R.el("rect", { x: x0, y: y, width: v / max * w, height: 30, rx: 6, fill: l[3] ? C.acc : "#9aa0ad" }, g);
        R.texte(g, R.fmt(v, 1), [x0 + v / max * w + 10, y + 16], { italique: false, taille: 15, ancre: "start" });
      });
      f.direct.innerHTML = "Gris : métaux. Couleur : composites. " + (s ? "Rapportés à la masse, les métaux sont tous voisins de 25." : "Valeurs du tableau du cours.");
    }
    dessin();
  })();
})();
