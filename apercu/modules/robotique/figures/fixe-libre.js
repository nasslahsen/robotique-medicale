(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 1 : dilatation et palier libre ---------- */
  (function () {
    var f = R.figure("fig-dilatation", {
      largeur: 960, hauteur: 540,
      titre: "Un arbre qui chauffe entre deux roulements",
      essai: "<strong>Essaie</strong> : choisis un montage, puis fais monter la température. " +
        "<strong>Observe</strong> : en fixe-libre, le roulement libre glisse et l'arbre s'allonge sans effort ; en fixe-fixe, l'arbre est bloqué et charge les roulements. Les blocs noirs sont les arrêts axiaux des bagues ; la dilatation est très agrandie."
    });
    var g = R.el("g", null, f.svg);
    var CAS = {
      arbre: { nom: "Arbre tournant", tenus: { Gi: 1, Ge: 1, Di: 1, De: 0 }, txt: "arbre tournant, charge de direction fixe : bagues intérieures tenues, une bague extérieure coulissante" },
      logement: { nom: "Logement tournant", tenus: { Gi: 1, Ge: 1, Di: 0, De: 1 }, txt: "logement tournant, charge de direction fixe : bagues extérieures tenues, une bague intérieure coulissante" },
      bloque: { nom: "Fixe-fixe (à éviter)", tenus: { Gi: 1, Ge: 1, Di: 1, De: 1 }, txt: "les quatre bagues tenues : la dilatation est empêchée" }
    };
    var cas = "arbre", b = R.boutons(f.reglages), bt = {};
    Object.keys(CAS).forEach(function (k) { bt[k] = R.bouton(b, CAS[k].nom, function () { cas = k; dessiner(); }); });
    var cT = R.curseur(f.reglages, { nom: "Échauffement", min: 0, max: 60, pas: 1, val: 0, unite: " °C", surChange: dessiner });
    var info = R.h("p", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      Object.keys(bt).forEach(function (k) { bt[k].classList.toggle("actif", k === cas); });
      var t = CAS[cas].tenus, bloque = t.Di && t.De, d = bloque ? 0 : cT.v * 0.8, yc = 270, r = 46, h = 96, l = 90, bg = 28, xs = { G: 260, D: 680 };
      var dec = { G: 0, D: t.Di && !t.De ? d : 0 }, H = MECA.hachures(g, "#9aa0ad", { fond: "#fff" });
      [-1, 1].forEach(function (s) { R.el("rect", { x: 140, y: s < 0 ? yc - r - h - 50 : yc + r + h, width: 680, height: 50, fill: H, stroke: C.fonce, "stroke-width": 2 }, g); });
      var chaud = cT.v / 60;
      R.el("rect", { x: 70, y: yc - r, width: 800 + d, height: 2 * r, fill: chaud > 0 ? (bloque ? "rgb(" + Math.round(232 + 20 * chaud) + "," + Math.round(237 - 60 * chaud) + "," + Math.round(245 - 60 * chaud) + ")" : "rgb(" + Math.round(232 + 20 * chaud) + "," + Math.round(237 - 20 * chaud) + "," + Math.round(245 - 50 * chaud) + ")") : "#e8edf5", stroke: C.fonce, "stroke-width": 2 }, g);
      MECA.traitAxe(g, [50, yc], [910, yc]);
      ["G", "D"].forEach(function (k) {
        var x = xs[k] + dec[k];
        [1, -1].forEach(function (s) {
          MECA.roulement(g, x, yc - s * r, l, h, { type: "billes", sens: s });
          [["e", s > 0 ? yc - r - h : yc + r + h - bg, xs[k]], ["i", s > 0 ? yc - r - bg : yc + r, x]].forEach(function (q) {
            if (!t[k + q[0]]) return;
            [-1, 1].forEach(function (c) { R.el("rect", { x: q[2] + c * (l / 2 + 5) - 5, y: q[1], width: 10, height: bg, fill: C.fonce }, g); });
          });
        });
        R.texte(g, k === "G" ? "palier fixe" : "palier libre", [xs[k], 500], { italique: false, gras: true, taille: 19, couleur: k === "G" || !bloque ? C.fonce : C.x });
      });
      if (bloque && cT.v > 0) {
        var e = 4 + cT.v * 0.1;
        R.fleche(g, [xs.D + 150, yc], [xs.D + 60, yc], { couleur: C.x, epaisseur: e }); R.fleche(g, [xs.G - 150, yc], [xs.G - 60, yc], { couleur: C.x, epaisseur: e });
        R.texte(g, "efforts axiaux parasites", [470, 30], { italique: false, gras: true, couleur: C.x, taille: 20 });
      } else if (cT.v > 0) R.texte(g, "l'arbre s'allonge librement", [470, 30], { italique: false, gras: true, couleur: C.y, taille: 20 });
      if (!bloque) R.texte(g, "jeu ≈ 0,1", [xs.D, t.De ? yc + r + h + 76 : yc - r - h - 70], { italique: false, couleur: C.doux, taille: 16 });
      info.textContent = CAS[cas].txt + ".";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : réglage du jeu d'un montage à rouleaux coniques ---------- */
  (function () {
    var f = R.figure("fig-coniques", {
      largeur: 960, hauteur: 500,
      titre: "Logement tournant, arbre fixe, rouleaux coniques",
      essai: "<strong>Essaie</strong> : touche une pièce du dispositif de réglage. " +
        "<strong>Observe</strong> : l'écrou règle le jeu, la rondelle frein l'empêche de se desserrer, la rondelle plate répartit la pression sur la bague intérieure."
    });
    var g = R.el("g", null, f.svg);
    var P = {
      plate: ["rondelle plate", "interposée entre la rondelle frein et la bague intérieure, pour une pression de contact uniforme ; immobilisée en rotation par une languette qui se loge dans une rainure de l'arbre"],
      frein: ["rondelle frein", "une languette repliée dans une encoche de l'écrou empêche le desserrage"],
      ecrou: ["écrou à encoches", "vissé sur l'arbre, il pousse la bague intérieure : c'est lui qui règle le jeu de fonctionnement, de façon simple et précise"],
      roulements: ["rouleaux coniques", "deux roulements montés en opposition, cônes de même sommet sur l'axe ; la cuvette (bague extérieure) est séparable"],
      logement: ["logement tournant", "il tourne autour de l'arbre fixe et tient les bagues extérieures ; des encoches permettent l'extraction des bagues"]
    };
    var choisi = "ecrou", info = R.h("p", null, "", f.direct);
    function zone(id, x, y, w, hh) { var z = R.el("rect", { x: x, y: y, width: w, height: hh, fill: "transparent", style: "cursor:pointer" }, g); z.addEventListener("click", function () { choisi = id; dessiner(); }); }
    function dessiner() {
      R.vider(g);
      var yc = 250, r = 44, h = 92, l = 96, H = MECA.hachures(g, choisi === "logement" ? "#3b5bdb" : "#9aa0ad", { fond: "#fff" });
      [-1, 1].forEach(function (s) { R.el("rect", { x: 170, y: s < 0 ? yc - r - h - 44 : yc + r + h, width: 470, height: 44, fill: H, stroke: C.fonce, "stroke-width": 2 }, g); });
      R.el("rect", { x: 60, y: yc - r, width: 820, height: 2 * r, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2 }, g);
      R.texte(g, "arbre fixe", [110, yc - 18], { italique: false, couleur: C.doux, taille: 16 });
      MECA.traitAxe(g, [40, yc], [920, yc]);
      [[260, -1], [560, 1]].forEach(function (bb) {
        var gg = R.el("g", { transform: bb[1] < 0 ? "translate(" + 2 * bb[0] + " 0) scale(-1 1)" : null }, g);
        [1, -1].forEach(function (s) { MECA.roulement(gg, bb[0], yc - s * r, l, h, { type: "conique", sens: s, surligne: choisi === "roulements" ? "element" : null }); });
      });
      var Q = [["plate", 610, 12, "#dfe3ea"], ["frein", 624, 10, "#c6cbd8"], ["ecrou", 636, 46, "#9aa0ad"]];
      Q.forEach(function (q) {
        [1, -1].forEach(function (s) { R.el("rect", { x: q[1], y: s > 0 ? yc - r - 56 : yc + r, width: q[2], height: 56, fill: choisi === q[0] ? PLATEFORME.teinte(0.7) : q[3], stroke: C.fonce, "stroke-width": 2 }, g); });
      });
      // étiquettes, au-dessus, en escalier
      [["plate", 616, 50], ["frein", 629, 85], ["ecrou", 659, 120]].forEach(function (q) {
        R.ligne(g, [q[1], yc - r - 56], [q[1], q[2]], { couleur: C.fonce });
        R.ligne(g, [q[1], q[2]], [710, q[2]], { couleur: C.fonce });
        R.texte(g, P[q[0]][0], [716, q[2]], { italique: false, ancre: "start", gras: choisi === q[0], couleur: choisi === q[0] ? C.acc : C.fonce, taille: 18 });
        zone(q[0], 700, q[2] - 16, 230, 32);
      });
      zone("plate", 606, yc - r - 56, 18, 56); zone("frein", 622, yc - r - 56, 14, 56); zone("ecrou", 636, yc - r - 56, 46, 56);
      zone("roulements", 200, yc - r - h, 420, h); zone("logement", 170, yc - r - h - 44, 430, 44);
      R.texte(g, "rouleaux coniques en opposition", [410, 470], { italique: false, couleur: choisi === "roulements" ? C.acc : C.doux, taille: 17 });
      R.texte(g, "logement tournant", [200, 30], { italique: false, couleur: choisi === "logement" ? C.acc : C.doux, taille: 17 });
      info.innerHTML = "<b>" + P[choisi][0] + "</b> : " + P[choisi][1] + ".";
    }
    dessiner();
  })();
})();
