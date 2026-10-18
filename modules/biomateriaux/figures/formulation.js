(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Figure 1 : la recette d'un caoutchouc ---------- */
  (function () {
    var f = R.figure("fig-recette", {
      largeur: 960, hauteur: 460, titre: "Formulation d'un caoutchouc",
      essai: "<strong>Essaie</strong> : choisis l'élastomère (insaturé ou saturé), puis ajoute ou retire chaque ingrédient. <strong>Observe</strong> : chaque ingrédient a son rôle ; pour un élastomère saturé, le soufre ne marche pas, il faut un peroxyde."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var sat = R.bascule(b, "Élastomère saturé", false, dessin);
    var I = [
      ["vulc", "agent de vulcanisation", "#fde68a", "relie les chaînes (soufre ou peroxyde)"],
      ["acc", "accélérateur", "#fde2c8", "vulcanisation plus rapide"],
      ["charge", "charges", "#d6dbe6", "renfort, volume"],
      ["plast", "plastifiant", "#cfe7f7", "souplesse, mise en œuvre"],
      ["noir", "noir de carbone", "#3a3d46", "pigment, renfort, stabilisant, conducteur"],
      ["prot", "protection", "#d8f0e2", "contre dioxygène, ozone, chaleur, flamme, UV"]
    ];
    var on = { vulc: true, acc: true, charge: false, plast: false, noir: true, prot: true };
    var b2 = R.boutons(f.reglages);
    var bt = I.map(function (it) { return R.bouton(b2, it[1], function () { on[it[0]] = !on[it[0]]; dessin(); }); });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      bt.forEach(function (x, i) { x.classList.toggle("actif", on[I[i][0]]); });
      // bol de mélange, couches empilées
      R.el("path", { d: "M80 80 L440 80 L400 420 L120 420 Z", fill: "#fff", stroke: C.fonce, "stroke-width": 4 }, g);
      var h = 0, liste = [["gomme", "élastomère " + (sat.checked ? "saturé" : "insaturé"), "#e9d8b4"]].concat(I.filter(function (it) { return on[it[0]]; }));
      liste.forEach(function (it, k) {
        var e = k === 0 ? 100 : 40, y = 420 - h - e, k1 = (y - 80) / 340, k2 = (y + e - 80) / 340;
        R.el("path", { d: "M" + (80 + 40 * k1) + " " + y + " L" + (440 - 40 * k1) + " " + y + " L" + (440 - 40 * k2) + " " + (y + e) + " L" + (80 + 40 * k2) + " " + (y + e) + " Z", fill: it[2], stroke: C.fonce, "stroke-width": 1.5 }, g);
        var nom = it[0] === "vulc" ? (sat.checked ? "peroxyde organique" : "soufre") : it[1];
        T(g, nom, [260, y + e / 2], { taille: 16, gras: true, couleur: it[0] === "noir" ? "#fff" : C.fonce, halo: it[0] !== "noir" });
        if (k > 0) T(g, it[3], [480, y + e / 2], { taille: 15, couleur: C.doux, ancre: "start" });
        h += e;
      });
      var manque = [];
      if (!on.vulc) manque.push("aucun agent de vulcanisation : les chaînes ne sont pas reliées, le caoutchouc coulera");
      if (!on.prot) manque.push("sans protection, il vieillira vite (dioxygène, ozone, UV)");
      zone.innerHTML = (sat.checked ? "Élastomère saturé : il n'est pas vulcanisable au soufre ; on utilise un peroxyde organique (ponts C–C). " : "Élastomère insaturé : le soufre forme des ponts disulfure. ") + (manque.length ? "Attention : " + manque.join(" ; ") + "." : "Formulation complète pour une application définie.");
    }
    dessin();
  })();

  /* ---------- Figure 2 : caoutchoucs de synthèse ---------- */
  (function () {
    var f = R.figure("fig-frise", {
      largeur: 960, hauteur: 340, titre: "Caoutchoucs naturel et de synthèse",
      essai: "<strong>Essaie</strong> : avance dans la frise avec les boutons d'étape. <strong>Observe</strong> : le polyisoprène est la même molécule dans le caoutchouc naturel et dans son équivalent de synthèse."
    });
    var g = R.el("g", null, f.svg);
    var E = [
      ["latex de l'hévéa", "caoutchouc naturel (NR) : polyisoprène"],
      ["1935", "Allemagne : caoutchoucs Buna (joint en Buna pour écrou)"],
      ["après 1945", "États-Unis : polyisoprène de synthèse, identique au NR"],
      ["aujourd'hui", "polyisoprène de synthèse : 3,1 % de la production mondiale"]
    ];
    var zone = R.h("div", null, "", f.direct);
    var et = R.etapes(f.reglages, 3, ["caoutchouc naturel", "Buna", "polyisoprène de synthèse", "part du synthétique"], dessin);
    function dessin(k) {
      R.vider(g);
      R.ligne(g, [80, 140], [880, 140], { epaisseur: 4 });
      E.forEach(function (e, i) {
        var x = 140 + i * 230, actif = i <= k;
        R.point(g, [x, 140], { r: 13, couleur: actif ? C.acc : "#d9dde6", contour: "#fff" });
        T(g, e[0], [x, 100], { taille: 17, gras: true, couleur: actif ? C.fonce : C.gris });
      });
      // motif isoprène en zigzag, avec un CH3 sur un carbone sur quatre
      var x0 = 150, y0 = 260;
      var d = "M" + x0 + " " + y0;
      for (var i = 0; i < 16; i++) d += " l40 " + (i % 2 ? 30 : -30);
      R.el("path", { d: d, fill: "none", stroke: C.fonce, "stroke-width": 3.5 }, g);
      for (var m = 0; m < 4; m++) R.ligne(g, [x0 + 40 + m * 160, y0 - 30], [x0 + 40 + m * 160, y0 - 62], { couleur: C.acc, epaisseur: 3.5 });
      T(g, "CH₃", [x0 + 40, y0 - 78], { taille: 15, couleur: C.acc });
      zone.innerHTML = "<strong>" + E[k][0] + "</strong> : " + E[k][1] + ".";
    }
    et.aller(0);
  })();
})();
