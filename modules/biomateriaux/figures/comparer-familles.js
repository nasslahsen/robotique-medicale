(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Choisir la famille selon les exigences ---------- */
  (function () {
    var f = R.figure("fig-choisir", {
      largeur: 960, hauteur: 400, titre: "Quelle famille pour quelles exigences ?",
      essai: "<strong>Essaie</strong> : coche les exigences d'une pièce (par exemple « isolant », « très dur », « tient à 1000 °C »). <strong>Observe</strong> : les familles qui ne conviennent pas s'éteignent, avec la raison."
    });
    var g = R.el("g", null, f.svg), b = R.boutons(f.reglages), zone = R.h("div", null, "", f.direct);
    var EX = [["cond", "Conduit le courant"], ["isol", "Isolant"], ["dur", "Très dur, résiste à l'abrasion"], ["duct", "Se déforme sans casser"], ["chaud", "Tient à 1000 °C"], ["leger", "Souple et facile à mouler"]];
    var FAM = [
      { n: "Métaux et alliages", c: "#8e97a6", ok: { cond: 1, dur: 1, duct: 1, chaud: 1 }, ex: "tige de hanche", p: ["électrons libres", "conduit, ductile", "modules élevés"] },
      { n: "Céramiques", c: "#b08d4f", ok: { isol: 1, dur: 1, chaud: 1 }, ex: "tête fémorale", p: ["ioniques et covalentes", "dure, fragile", "réfractaire, isolante"] },
      { n: "Polymères organiques", c: C.acc, ok: { isol: 1, duct: 1, leger: 1 }, ex: "seringue, insert", p: ["chaînes covalentes", "souple, légère", "isolante, < 200 °C"] }
    ];
    var POURQUOI = { cond: "pas d'électrons libres", isol: "électrons libres : conduit", dur: "trop mou", duct: "fragile, casse net", chaud: "rien d'intéressant au-delà de 200 °C", leger: "ni souple ni facile à mouler" };
    var cases = {};
    EX.forEach(function (e) { cases[e[0]] = R.bascule(b, e[1], false, dessin); });
    function dessin() {
      R.vider(g);
      var demandes = EX.filter(function (e) { return cases[e[0]].checked; }).map(function (e) { return e[0]; });
      var restent = [];
      FAM.forEach(function (F, i) {
        var x = 30 + i * 310, manque = demandes.filter(function (d) { return !F.ok[d]; }), ok = !manque.length;
        if (ok) restent.push(F.n);
        R.el("rect", { x: x, y: 60, width: 280, height: 260, rx: 22, fill: ok ? "#fff" : "#f3f4f7", stroke: ok ? F.c : "#d9dde6", "stroke-width": ok ? 5 : 2 }, g);
        T(g, F.n, [x + 140, 100], { taille: 20, gras: true, couleur: ok ? C.fonce : "#9aa0ad" });
        T(g, F.ex, [x + 140, 130], { taille: 15, couleur: ok ? C.doux : "#b8bdc8" });
        if (ok) { F.p.forEach(function (t, k) { T(g, t, [x + 140, 180 + k * 30], { taille: 15, couleur: C.doux }); }); if (demandes.length) T(g, "convient", [x + 140, 290], { taille: 22, gras: true, couleur: C.y }); }
        else manque.slice(0, 3).forEach(function (m, k) { T(g, POURQUOI[m], [x + 140, 190 + k * 32], { taille: 15, couleur: C.x }); });
      });
      zone.innerHTML = !demandes.length ? "Coche une ou plusieurs exigences." : restent.length ? "Famille(s) possible(s) : <strong>" + restent.join(", ") + "</strong>." : "Aucune famille seule ne convient : c'est le moment de penser à un <strong>composite</strong> (chapitre 6).";
    }
    dessin();
  })();

  /* ---------- Frise de l'importance relative des matériaux ---------- */
  (function () {
    var f = R.figure("fig-frise", {
      largeur: 960, hauteur: 480, titre: "Importance relative des familles de matériaux, de 10 000 av. J.-C. à 2020 (allure)",
      essai: "<strong>Essaie</strong> : déplace la date. <strong>Observe</strong> : quelle famille domine, et la période correspondante. Les dates sont régulièrement espacées comme sur la diapo, pas proportionnelles au temps."
    });
    var g = R.el("g", null, f.svg), D = ["−10000", "−5000", "0", "1000", "1500", "1800", "1900", "1940", "1960", "1980", "1990", "2000", "2010", "2020"];
    var cD = R.curseur(f.reglages, { nom: "Date (repère)", min: 0, max: D.length - 1, pas: 1, val: 8, surChange: dessin }), zone = R.h("div", null, "", f.direct);
    var FAM = [
      { n: "métaux", c: "#8e97a6", v: [0.05, 0.2, 0.45, 0.5, 0.55, 0.7, 0.8, 0.85, 0.88, 0.75, 0.65, 0.55, 0.5, 0.45] },
      { n: "polymères et élastomères", c: C.acc, v: [0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.06, 0.15, 0.22, 0.3, 0.38, 0.45] },
      { n: "composites", c: "#12a26b", v: [0.25, 0.25, 0.2, 0.18, 0.15, 0.12, 0.08, 0.05, 0.04, 0.08, 0.13, 0.18, 0.24, 0.3] },
      { n: "céramiques et verres", c: "#b08d4f", v: [0.3, 0.3, 0.25, 0.22, 0.2, 0.17, 0.12, 0.08, 0.06, 0.1, 0.15, 0.2, 0.25, 0.3] }
    ];
    function texte(i) {
      if (i <= 2) return "Matériaux naturels et premiers métaux : bois, peaux, fibres, colles, paille et brique, pierre, silex, poterie, or, cuivre, puis bronze et fer.";
      if (i <= 8) return "Les métaux montent jusqu'aux années 1960 (fonte, aciers, puis alliages) ; les autres familles reculent en importance relative.";
      return "Depuis 1960, polymères (nylon, PE, PMMA, PC, PS, PP, époxys), composites (GFRP, CFRP, Kevlar-FRP) et céramiques techniques (Al₂O₃, Si₃N₄, PSZ) progressent.";
    }
    var X0 = 90, X1 = 900, Y0 = 400, H = 300, dx = (X1 - X0) / (D.length - 1);
    function dessin() {
      R.vider(g);
      R.fleche(g, [X0, Y0], [X1 + 30, Y0], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, [X0, Y0], [X0, Y0 - H - 30], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "importance relative", [X0 + 10, Y0 - H - 34], { taille: 15, gras: true, ancre: "start" });
      D.forEach(function (d, i) { R.ligne(g, [X0 + i * dx, Y0], [X0 + i * dx, Y0 + 7], { couleur: C.fonce, epaisseur: 2 }); T(g, d, [X0 + i * dx, Y0 + 24 + (i % 2) * 16], { taille: 13, couleur: C.doux }); });
      FAM.forEach(function (F, k) {
        R.el("polyline", { points: F.v.map(function (v, i) { return [X0 + i * dx, Y0 - v * H].join(","); }).join(" "), fill: "none", stroke: F.c, "stroke-width": 5, "stroke-linejoin": "round" }, g);
        R.el("rect", { x: 420 + (k % 2) * 230, y: 40 + Math.floor(k / 2) * 28, width: 24, height: 8, rx: 3, fill: F.c }, g);
        T(g, F.n, [452 + (k % 2) * 230, 45 + Math.floor(k / 2) * 28], { taille: 14, ancre: "start" });
      });
      var i = cD.v, xd = X0 + i * dx;
      R.ligne(g, [xd, Y0 - H - 10], [xd, Y0], { couleur: C.z, epaisseur: 3, tirets: "6 5" });
      var top = FAM.slice().sort(function (a, b) { return b.v[i] - a.v[i]; })[0];
      zone.innerHTML = "<strong>" + D[i] + "</strong> : famille dominante, " + top.n + ". " + texte(i);
    }
    dessin();
  })();
})();
