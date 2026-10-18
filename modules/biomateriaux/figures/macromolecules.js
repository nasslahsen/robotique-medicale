(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }
  // chaîne ondulée le long d'un segment ; renvoie une fonction qui donne un point de la chaîne
  function ondule(gr, a, b, amp, fr, ph, coul, ep) {
    var pts = [], L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    function P(s) { var o = amp * Math.sin(s * fr * Math.PI * 2 + ph); return [a[0] + u[0] * s * L - u[1] * o, a[1] + u[1] * s * L + u[0] * o]; }
    for (var t = 0; t <= 40; t++) pts.push(P(t / 40));
    R.el("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: coul || C.fonce, "stroke-width": ep || 3, "stroke-linecap": "round" }, gr);
    return P;
  }

  /* ---------- Carte du chapitre 3 ---------- */
  (function () {
    var f = R.figure("fig-carte", {
      largeur: 960, hauteur: 300, titre: "Carte du chapitre : de la chaîne aux états du polymère",
      essai: "<strong>Essaie</strong> : touche une étape. <strong>Observe</strong> : la question à laquelle répond chaque page du chapitre."
    });
    var g = R.el("g", null, f.svg), sel = 0, zone = R.h("div", null, "", f.direct);
    var E = [["forme", "linéaire, ramifiée, réseau ?"], ["masse", "chaînes courtes ou longues ?"], ["amorphe", "vitreux ou caoutchouteux ?"], ["semi-cristallin", "des cristaux ?"], ["taux X", "combien de cristaux ?"], ["histoire", "d'où viennent-ils ?"]];
    function dessin() {
      R.vider(g);
      E.forEach(function (e, i) {
        var x = 20 + i * 155, on = i === sel, b = R.el("g", { style: "cursor:pointer" }, g);
        if (i) R.fleche(g, [x - 14, 120], [x - 2, 120], { couleur: C.gris, epaisseur: 2.5, tete: 9 });
        R.el("rect", { x: x, y: 70, width: 140, height: 100, rx: 18, fill: on ? PLATEFORME.teinte(0.18) : "#fff", stroke: on ? C.acc : "#c6cbd8", "stroke-width": on ? 4 : 2 }, b);
        T(b, String(i + 1), [x + 70, 105], { taille: 24, gras: true, couleur: on ? C.acc : C.gris, halo: false });
        T(b, e[0], [x + 70, 142], { taille: 16, gras: true, halo: false });
        b.addEventListener("click", function () { sel = i; dessin(); });
      });
      T(g, E[sel][1], [480, 230], { taille: 22, gras: true });
      zone.innerHTML = "Page " + (sel + 1) + " : <strong>" + E[sel][0] + "</strong>, " + E[sel][1];
    }
    dessin();
  })();

  /* ---------- Structures et comportement à la chaleur ---------- */
  (function () {
    var f = R.figure("fig-structures", {
      largeur: 960, hauteur: 500, titre: "Trois structures de macromolécules chauffées",
      essai: "<strong>Essaie</strong> : choisis une structure, puis monte la température. <strong>Observe</strong> : les chaînes libres d'un thermoplastique glissent et la pièce ramollit ; un réseau à mailles serrées ne bouge pas puis se dégrade ; un réseau à mailles larges reste élastique. Comportements qualitatifs."
    });
    var g = R.el("g", null, f.svg), b = R.boutons(f.reglages), type = "lin";
    var TYP = [["lin", "Thermoplastique (linéaire)"], ["ram", "Thermoplastique (ramifié)"], ["large", "Élastomère (mailles larges)"], ["serre", "Thermodurcissable (mailles serrées)"]], bts = {};
    TYP.forEach(function (t) { bts[t[0]] = R.bouton(b, t[1], function () { type = t[0]; dessin(); }); });
    var cT = R.curseur(f.reglages, { nom: "Température", min: 20, max: 280, pas: 5, val: 20, unite: " °C", surChange: dessin }), zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      Object.keys(bts).forEach(function (k) { bts[k].classList.toggle("actif", k === type); });
      var t = cT.v, thermo = type === "lin" || type === "ram", mou = thermo ? Math.max(0, Math.min(1, (t - 120) / 80)) : 0, brun = type === "serre" ? Math.max(0, Math.min(1, (t - 200) / 60)) : 0;
      // gros plan des chaînes
      R.el("rect", { x: 30, y: 40, width: 440, height: 400, rx: 22, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2 }, g);
      var lignes = [];
      for (var k = 0; k < 6; k++) {
        var dx = thermo ? mou * 40 * Math.sin(k * 1.7) : 0;
        lignes.push(ondule(g, [60 + dx, 80 + k * 64], [440 + dx, 80 + k * 64 + (thermo ? mou * 20 * Math.cos(k) : 0)], 12 * (1 - 0.5 * mou), 2.2 + 0.25 * k, k, brun ? "rgb(" + Math.round(21 + 100 * brun) + ",23,31)" : C.fonce, 3));
      }
      if (type === "ram") lignes.forEach(function (P, k) { [0.25, 0.6, 0.85].forEach(function (s) { var p = P(s); R.ligne(g, p, [p[0] + 14, p[1] - 22], { couleur: C.fonce, epaisseur: 3 }); }); });
      if (type === "large" || type === "serre") {
        var pos = type === "large" ? [0.3, 0.75] : [0.1, 0.25, 0.4, 0.55, 0.7, 0.85];
        for (k = 0; k < 5; k++) pos.forEach(function (s) { var s2 = s + (k % 2 ? 0.05 : 0); R.ligne(g, lignes[k](s2), lignes[k + 1](s2), { couleur: C.acc, epaisseur: 4 }); });
      }
      // la pièce
      var h = 200 * (1 - 0.6 * mou), w = 220 + 120 * mou;
      R.el("rect", { x: 720 - w / 2, y: 400 - h, width: w, height: h, rx: 18 + 40 * mou, fill: brun ? "rgb(" + Math.round(225 - 120 * brun) + "," + Math.round(214 - 130 * brun) + "," + Math.round(190 - 140 * brun) + ")" : PLATEFORME.teinte(0.35), stroke: C.fonce, "stroke-width": 3 }, g);
      R.ligne(g, [540, 402], [900, 402], { couleur: C.gris, epaisseur: 4 });
      T(g, "la pièce moulée", [720, 440], { taille: 17, gras: true });
      var txt = thermo ? (mou > 0 ? "les chaînes glissent : la pièce ramollit, on peut la remouler" : "rigide à température ambiante") : type === "large" ? "les ponts retiennent les chaînes : la pièce reste élastique" : (brun > 0 ? "aucun ramollissement : la pièce se dégrade" : "rien ne bouge : réseau rigide");
      zone.innerHTML = "<strong>" + TYP.filter(function (x) { return x[0] === type; })[0][1] + "</strong> à " + t + " °C : " + txt + ".";
    }
    dessin();
  })();
})();
