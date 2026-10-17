/* Essai A : parcours en étapes, figure à gauche, défi à droite. */
(function () {
  "use strict";
  var DEG = E.DEG, svg = document.getElementById("fig");
  var COUL = { x: "#e5484d", y: "#12a26b", z: "#3b5bdb", v: "#8b3fd9", acc: "#3b5bdb", gris: "#9aa0ad", pale: "#e3e6ee" };
  var O = [320, 350];
  var etat = {
    alpha: 0, u: 170, glisse: true, cible: false, proj1: false, proj2: false, y1: true,
    grilleR1: false, pin: null, chemin: 0, cellule: null, colonneVue: false, hud: "rien"
  };
  var fc = function (x) { return E.tc(x, 3).replace("{,}", ",").replace("-", "\u2212"); };
  var P = function (v) { return [O[0] + v[0] * etat.u, O[1] - v[1] * etat.u]; };

  /* ---------------- Dessin ---------------- */
  var gFond = E.s("g", null, svg), gFig = E.s("g", null, svg), gHaut = E.s("g", null, svg);
  function fleche(g, a, b, coul, ep, o) {
    o = o || {};
    var d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]);
    if (l < 2) return;
    var u = [d[0] / l, d[1] / l], t = 9 + ep * 2.2, w = 5 + ep * 1.3, c = [b[0] - u[0] * t, b[1] - u[1] * t];
    E.s("line", { x1: a[0], y1: a[1], x2: c[0], y2: c[1], stroke: coul, "stroke-width": ep, "stroke-linecap": "round", opacity: o.op }, g);
    E.s("polygon", { points: [b, [c[0] - u[1] * w, c[1] + u[0] * w], [c[0] + u[1] * w, c[1] - u[0] * w]].map(function (p) { return p.join(","); }).join(" "), fill: coul, opacity: o.op }, g);
  }
  function texte(g, t, p, o) {
    o = o || {};
    var e = E.s("text", { x: p[0], y: p[1], fill: o.coul || "#15171f", "font-size": o.taille || 22, "font-weight": o.gras ? 700 : 500, "text-anchor": o.ancre || "middle", "dominant-baseline": "middle", "font-family": o.titre ? "Bricolage Grotesque, Inter, sans-serif" : "Inter, sans-serif", opacity: o.op }, g);
    e.textContent = t;
    if (o.fond) { e.setAttribute("paint-order", "stroke"); e.setAttribute("stroke", "#fff"); e.setAttribute("stroke-width", 6); e.setAttribute("stroke-linejoin", "round"); }
    return e;
  }
  function pointille(g, a, b, coul) { E.s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: coul, "stroke-width": 2, "stroke-dasharray": "5 6" }, g); }

  function dessiner() {
    E.vider(gFond); E.vider(gFig); E.vider(gHaut);
    var a = etat.alpha * DEG, R = E.Rz(a), x1 = E.col(R, 0), y1 = E.col(R, 1);
    // quadrillage de R0
    for (var i = -4; i <= 4; i++) {
      var px = O[0] + i * etat.u * 0.5, py = O[1] - i * etat.u * 0.5;
      if (px > 0 && px < 680) E.s("line", { x1: px, y1: 0, x2: px, y2: 600, stroke: "#f1f3f7", "stroke-width": 1.5 }, gFond);
      if (py > 0 && py < 600) E.s("line", { x1: 0, y1: py, x2: 680, y2: py, stroke: "#f1f3f7", "stroke-width": 1.5 }, gFond);
    }
    // grille de R1 (étape 5)
    if (etat.grilleR1) {
      for (var k = -1; k <= 3; k++) {
        E.s("line", seg(m(x1, k), y1, -1.2, 3.2), gFond);
        E.s("line", seg(m(y1, k), x1, -1.2, 3.2), gFond);
      }
    }
    // cercle unité
    if (etat.u > 120) E.s("circle", { cx: O[0], cy: O[1], r: etat.u, fill: "none", stroke: "#dfe3ec", "stroke-width": 2, "stroke-dasharray": "3 7" }, gFond);
    // axes de R0
    fleche(gFond, P([-1.55, 0]), P([1.62, 0]), "#f0a7a9", 3);
    fleche(gFond, P([0, -1.25]), P([0, 1.62]), "#93d6b8", 3);
    texte(gFond, "x₀", m2(P([1.62, 0]), [0, 24]), { coul: COUL.x, gras: true });
    texte(gFond, "y₀", m2(P([0, 1.62]), [-26, 0]), { coul: COUL.y, gras: true });

    // cible (étape 1)
    if (etat.cible) {
      var c = P([1.35 * Math.cos(60 * DEG), 1.35 * Math.sin(60 * DEG)]);
      E.s("circle", { cx: c[0], cy: c[1], r: 30, fill: "#ffe3e6", class: "pulse" }, gFond);
      E.s("circle", { cx: c[0], cy: c[1], r: 16, fill: "#ff8a95" }, gFond);
      E.s("circle", { cx: c[0], cy: c[1], r: 5, fill: "#fff" }, gFond);
      texte(gFond, "tumeur", m2(c, [52, -18]), { coul: "#c2394a", taille: 17, gras: true });
    }
    // arc de l'angle
    if (Math.abs(etat.alpha) > 2) {
      var r = 0.3 * etat.u, a0 = P([0.3, 0]), a1 = [O[0] + r * Math.cos(a), O[1] - r * Math.sin(a)];
      E.s("path", { d: "M" + a0 + " A" + r + " " + r + " 0 0 " + (etat.alpha > 0 ? 0 : 1) + " " + a1, fill: "none", stroke: COUL.acc, "stroke-width": 2.5 }, gFig);
      var am = a / 2, rl = r + 26;
      texte(gFig, "α", [O[0] + rl * Math.cos(am), O[1] - rl * Math.sin(am)], { coul: COUL.acc, taille: 22, gras: true });
    }
    // projections
    if (etat.proj1) projections(x1, COUL.x, "cos α", "sin α");
    if (etat.proj2) projections(y1, COUL.y, "−sin α", "cos α");
    // instrument
    var queue = P(m(x1, -0.28)), pointe = P(x1);
    E.s("line", { x1: queue[0], y1: queue[1], x2: P(m(x1, 0.82))[0], y2: P(m(x1, 0.82))[1], stroke: "#e4e7ef", "stroke-width": 26, "stroke-linecap": "round" }, gFig);
    if (etat.y1) fleche(gFig, O, P(y1), COUL.y, 4.5);
    fleche(gFig, O, pointe, COUL.x, 5);
    if (etat.y1) texte(gFig, "y₁", P(m(y1, 1.17)), { coul: COUL.y, gras: true, taille: 24, fond: true });
    E.s("circle", { cx: O[0], cy: O[1], r: 10, fill: "#fff", stroke: COUL.z, "stroke-width": 3 }, gFig);
    E.s("circle", { cx: O[0], cy: O[1], r: 3.5, fill: COUL.z }, gFig);
    texte(gFig, "z₀ = z₁", m2(O, [-18, 36]), { coul: COUL.z, taille: 17, ancre: "end", fond: true, gras: true });
    // cellule choisie (étape 6) : les deux axes du produit scalaire
    if (etat.cellule) dessinerCellule(R);
    // chemin de V (étape 5)
    if (etat.chemin > 0) {
      var t1 = Math.min(1, etat.chemin), t2 = Math.max(0, Math.min(1, etat.chemin - 1)), t3 = Math.max(0, Math.min(1, etat.chemin - 2));
      var bout1 = m(x1, 2 * t1);
      fleche(gHaut, O, P(bout1), COUL.x, 5);
      if (t1 >= 1) texte(gHaut, "2 x₁", m2(P(m(x1, 1.45)), [16, 22]), { coul: COUL.x, gras: true, taille: 20, fond: true });
      if (t2 > 0) { fleche(gHaut, P(bout1), P(ad(bout1, m(y1, t2))), COUL.y, 5); }
      if (t2 >= 1) texte(gHaut, "1 y₁", P(ad(bout1, m(y1, 0.5))), { coul: COUL.y, gras: true, taille: 20, fond: true, ancre: "start" });
      if (t3 > 0) {
        var V0 = E.mv(R, [2, 1, 0]);
        fleche(gHaut, O, P(m(V0, t3)), COUL.v, 5.5, { op: Math.min(1, t3 * 1.5) });
        if (t3 >= 1) texte(gHaut, "V", m2(P(V0), [22, -14]), { coul: COUL.v, gras: true, taille: 24, fond: true });
      }
    }
    // prédiction
    if (etat.pin) {
      var q = P(etat.pin);
      E.s("circle", { cx: q[0], cy: q[1], r: 28, fill: "transparent" }, gHaut).classList.add("prise");
      E.s("circle", { cx: q[0], cy: q[1], r: 13, fill: "#fff", stroke: COUL.encre || "#15171f", "stroke-width": 3 }, gHaut);
      E.s("line", { x1: q[0] - 6, y1: q[1], x2: q[0] + 6, y2: q[1], stroke: "#15171f", "stroke-width": 2.5 }, gHaut);
      E.s("line", { x1: q[0], y1: q[1] - 6, x2: q[0], y2: q[1] + 6, stroke: "#15171f", "stroke-width": 2.5 }, gHaut);
      texte(gHaut, "ta prédiction", m2(q, [0, 34]), { taille: 15, coul: "#5b6172", fond: true });
    }
    texte(gFig, "x₁", P(m(x1, 1.17)), { coul: COUL.x, gras: true, taille: 24, fond: true });
    // poignée
    if (etat.glisse) {
      E.s("circle", { cx: pointe[0], cy: pointe[1], r: 26, fill: "rgba(59,91,219,.12)", class: "halo" }, gHaut);
      E.s("circle", { cx: pointe[0], cy: pointe[1], r: 13, fill: "#fff", stroke: COUL.acc, "stroke-width": 4 }, gHaut);
    }
    document.getElementById("angle").textContent = "α = " + String(Math.round(etat.alpha)).replace("-", "\u2212") + "°";
    majHud();
  }
  function projections(v, coul, nx, ny) {
    var p = P(v), fx = P([v[0], 0]), fy = P([0, v[1]]);
    pointille(gFig, p, fx, coul); pointille(gFig, p, fy, coul);
    E.s("circle", { cx: fx[0], cy: fx[1], r: 5, fill: coul }, gFig);
    E.s("circle", { cx: fy[0], cy: fy[1], r: 5, fill: coul }, gFig);
    texte(gFig, nx + " = " + fc(v[0]), m2(fx, [0, v[1] >= 0 ? 24 : -24]), { coul: coul, taille: 16, gras: true, fond: true });
    texte(gFig, ny + " = " + fc(v[1]), m2(fy, [v[0] >= 0 ? -12 : 12, 0]), { coul: coul, taille: 16, gras: true, fond: true, ancre: v[0] >= 0 ? "end" : "start" });
  }
  function dessinerCellule(R) {
    var i = etat.cellule[0], j = etat.cellule[1];
    var axes0 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], axes1 = [E.col(R, 0), E.col(R, 1), E.col(R, 2)];
    var cl = [COUL.x, COUL.y, COUL.z];
    if (i < 2) fleche(gHaut, O, P(axes0[i]), cl[i], 7, { op: 0.55 });
    if (j < 2) fleche(gHaut, O, P(axes1[j]), cl[j], 7);
    if (i < 2 && j < 2) {
      var a0 = Math.atan2(axes0[i][1], axes0[i][0]), a1 = Math.atan2(axes1[j][1], axes1[j][0]), r = 0.55 * etat.u;
      var d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      var s0 = [O[0] + r * Math.cos(a0), O[1] - r * Math.sin(a0)], s1 = [O[0] + r * Math.cos(a0 + d), O[1] - r * Math.sin(a0 + d)];
      E.s("path", { d: "M" + s0 + " A" + r + " " + r + " 0 0 " + (d > 0 ? 0 : 1) + " " + s1, fill: "none", stroke: "#15171f", "stroke-width": 2.5, "stroke-dasharray": "4 5" }, gHaut);
      var am = a0 + d / 2;
      texte(gHaut, Math.round(Math.abs(d) / DEG) + "°", [O[0] + (r + 24) * Math.cos(am), O[1] - (r + 24) * Math.sin(am)], { taille: 17, gras: true, fond: true });
    }
  }
  function m(v, k) { return [v[0] * k, v[1] * k, (v[2] || 0) * k]; }
  function ad(a, b) { return [a[0] + b[0], a[1] + b[1], 0]; }
  function m2(p, d) { return [p[0] + d[0], p[1] + d[1]]; }
  function seg(depart, dir, t0, t1) {
    var a = P(ad(depart, m(dir, t0))), b = P(ad(depart, m(dir, t1)));
    return { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#e9dcfb", "stroke-width": 1.6 };
  }

  /* ---------------- Matrice en haut à droite ---------------- */
  var hud = document.getElementById("hud");
  function majHud() {
    if (etat.hud === "rien") { hud.classList.add("cache"); hud.textContent = "La matrice se construira ici."; return; }
    hud.classList.remove("cache");
    var R = E.Rz(etat.alpha * DEG);
    if (etat.hud === "colonnes") {
      var html = '<div style="font-size:14px;color:#5b6172;margin-right:16px">Vecteurs<br>trouvés</div><div style="display:flex;gap:18px">';
      [["x₁", 0, "x"], ["y₁", 1, "y"], ["z₁", 2, "z"]].forEach(function (a) {
        if (a[1] === 1 && !etat.proj2) return;
        if (a[1] === 2 && !etat.proj2) return;
        html += '<div style="text-align:center;color:' + COUL[a[2]] + ';font-weight:600">' + a[0] + '<div style="font-weight:500;line-height:1.35">' + E.col(R, a[1]).map(fc).join("<br>") + "</div></div>";
      });
      hud.innerHTML = html + "</div>";
      return;
    }
    var cl = [COUL.x, COUL.y, COUL.z];
    var t = '<div style="display:flex;align-items:center;gap:10px"><span class="titre" style="font-size:22px;font-weight:700">R<sup>0,1</sup> =</span><div style="display:grid;grid-template-columns:repeat(3,auto);gap:2px 4px;border-left:2.5px solid #15171f;border-right:2.5px solid #15171f;border-radius:9px;padding:4px 6px">';
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
      var grise = etat.hud === "colonne1" && j !== 0, choisi = etat.cellule && etat.cellule[0] === i && etat.cellule[1] === j;
      t += '<button data-i="' + i + '" data-j="' + j + '" style="min-width:74px;height:46px;border:0;border-radius:10px;font:600 19px Inter,sans-serif;cursor:pointer;color:' + (grise ? "#c3c7d1" : cl[j]) + ';background:' + (choisi ? "#ffe066" : (etat.hud === "colonne1" && j === 0 ? "#fdecec" : "transparent")) + '">' + fc(R[i][j]) + "</button>";
    }
    hud.innerHTML = t + "</div></div>";
  }
  hud.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b || !surCellule) return;
    surCellule(+b.dataset.i, +b.dataset.j);
  });
  var surCellule = null;

  /* ---------------- Glisser ---------------- */
  var surAngle = null, surRelache = null, surTape = null, mode = null;
  E.glisser(svg, svg, function (p) {
    if (mode === "rot") {
      var a = Math.round(Math.atan2(O[1] - p[1], p[0] - O[0]) / DEG);
      etat.alpha = a; dessiner(); if (surAngle) surAngle(a);
    } else if (mode === "pin") {
      etat.pin = [(p[0] - O[0]) / etat.u, (O[1] - p[1]) / etat.u, 0]; dessiner(); if (surTape) surTape();
    }
  }, function () { if (mode === "rot" && surRelache) surRelache(etat.alpha); mode = null; }, function (p) {
    if (etat.glisse) {
      var t = P(E.col(E.Rz(etat.alpha * DEG), 0));
      if (Math.hypot(p[0] - t[0], p[1] - t[1]) < 60) { mode = "rot"; return true; }
    }
    if (surTape) { mode = "pin"; return true; }
    return false;
  });

  function animerAlpha(vers, duree, fin) {
    var de = etat.alpha;
    E.anime(duree || 700, function (e) { etat.alpha = de + (vers - de) * e; dessiner(); }, function () { etat.alpha = vers; dessiner(); if (fin) fin(); });
  }
  function animerEchelle(vers, fin) {
    var de = etat.u;
    E.anime(700, function (e) { etat.u = de + (vers - de) * e; dessiner(); }, fin);
  }

  /* ---------------- Étapes ---------------- */
  var panneau = document.getElementById("panneau"), astuce = document.getElementById("astuce");
  var courante = -1, fini = [], atteinte = 0;
  var COCHE = '<svg class="coche" viewBox="0 0 30 30"><circle cx="15" cy="15" r="15"/><path d="M8.5 15.5l4.3 4.2 8.7-9"/></svg>';
  function msg(el, ok, html) {
    el.className = "retour-msg " + (ok ? "ok" : "ko");
    el.innerHTML = (ok ? COCHE : "") + "<span>" + html + "</span>";
    E.rendre(el);
  }
  function montrer(el) { el.classList.add("vu"); E.rendre(el); requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("on"); }); }); setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 200); }
  function reussi(i) { if (fini.indexOf(i) < 0) fini.push(i); atteinte = Math.max(atteinte, i + 1); majProgres(); }
  function bouton(parent, txt, cls, f) { var b = E.h("button", cls, txt, parent); b.type = "button"; b.addEventListener("click", f); return b; }

  var ETAPES = [
    { nom: "Viser", construire: function (el) {
      el.innerHTML = '<div class="kicker">Étape 1 sur 6</div><h2>Le robot doit pointer son instrument vers la tumeur. Fais-le tourner.</h2>' +
        '<p class="consigne">Fais glisser la pointe ronde de l\'instrument jusqu\'à la cible.</p><div class="retour-msg"></div>' +
        '<div class="explique"><p>Pour décrire cette orientation depuis le repère fixe \\(R_0\\), il suffit de dire où pointe l\'axe \\(\\vec{x}_1\\) de l\'instrument. Ses projections sur \\(\\vec{x}_0\\) et \\(\\vec{y}_0\\) se lisent sur la figure :</p>' +
        '\\[ [\\vec{x}_1]_{R_0} = \\begin{pmatrix} \\cos\\alpha \\\\ \\sin\\alpha \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 0{,}5 \\\\ 0{,}866 \\\\ 0 \\end{pmatrix} \\]' +
        '<p>Tu viens de trouver la première colonne de la matrice.</p></div>';
      var r = el.querySelector(".retour-msg"), ex = el.querySelector(".explique");
      Object.assign(etat, { alpha: 0, u: 170, glisse: true, cible: true, proj1: false, proj2: false, y1: false, grilleR1: false, pin: null, chemin: 0, cellule: null, hud: "rien" });
      astuce.textContent = "Vue de dessus : l'axe z₀ sort de l'écran.";
      var gagne = fini.indexOf(0) >= 0;
      function victoire() {
        gagne = true; etat.glisse = false; etat.cible = true;
        animerAlpha(60, 350, function () {
          etat.proj1 = true; etat.hud = "colonnes"; dessiner();
          msg(r, true, "Visé. L'instrument a tourné de α = 60° autour de z₀.");
          montrer(ex); bouton(ex, "Continuer", "continuer", function () { aller(1); }); reussi(0);
        });
      }
      surAngle = function (a) { if (!gagne && E.ecartAngle(a, 60) < 3) victoire(); };
      surRelache = function (a) { if (!gagne && E.ecartAngle(a, 60) < 7) victoire(); };
      if (gagne) { etat.alpha = 60; victoire(); }
    } },

    { nom: "Prédire", construire: function (el) {
      el.innerHTML = '<div class="kicker">Étape 2 sur 6</div><h2>Où pointe l\'axe \\(\\vec{y}_1\\), vu depuis \\(R_0\\) ?</h2>' +
        '<p class="consigne">Il est perpendiculaire à \\(\\vec{x}_1\\). Choisis avant de voir ses projections.</p>' +
        '<div class="choix"></div><div class="retour-msg"></div>' +
        '<div class="explique"><p>\\(\\vec{y}_1\\) est \\(\\vec{x}_1\\) tourné de 90° de plus :</p>' +
        '\\[ [\\vec{y}_1]_{R_0} = \\begin{pmatrix} -\\sin\\alpha \\\\ \\cos\\alpha \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} -0{,}866 \\\\ 0{,}5 \\\\ 0 \\end{pmatrix} \\]' +
        '<p>La rotation se fait autour de \\(\\vec{z}_0\\), donc \\(\\vec{z}_1 = \\vec{z}_0\\) ne bouge pas : \\([\\vec{z}_1]_{R_0} = (0 ;\\ 0 ;\\ 1)\\).</p></div>';
      Object.assign(etat, { alpha: 60, u: 170, glisse: false, cible: false, proj1: true, proj2: false, y1: true, grilleR1: false, pin: null, chemin: 0, cellule: null, hud: "colonnes" });
      astuce.textContent = "";
      var r = el.querySelector(".retour-msg"), ex = el.querySelector(".explique"), ch = el.querySelector(".choix");
      var OPTIONS = [
        [[0.866, 0.5, 0], "Ce vecteur pointe vers le haut à droite, presque comme \\(\\vec{x}_0\\). Sur la figure, \\(\\vec{y}_1\\) part vers la gauche : sa composante sur \\(\\vec{x}_0\\) est négative."],
        [[-0.866, 0.5, 0], null],
        [[0.5, -0.866, 0], "Ce vecteur pointe vers le bas. Regarde la figure : \\(\\vec{y}_1\\) pointe vers le haut à gauche."]
      ];
      OPTIONS.forEach(function (o) {
        var b = bouton(ch, "", "", function () {
          if (o[1]) { b.classList.add("faux", "secoue"); setTimeout(function () { b.classList.remove("secoue"); }, 400); msg(r, false, o[1]); return; }
          ch.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
          b.classList.add("bon"); msg(r, true, "Exact.");
          etat.proj2 = true; dessiner(); montrer(ex);
          bouton(ex, "Continuer", "continuer", function () { aller(2); }); reussi(1);
        });
        E.k(b, E.texVec(o[0], function (x) { return E.tc(x); }));
      });
    } },

    { nom: "Construire", construire: function (el) {
      el.innerHTML = '<div class="kicker">Étape 3 sur 6</div><h2>Range les trois axes dans la matrice \\(R^{0,1}\\).</h2>' +
        '<p class="consigne">Une colonne par axe de l\'instrument. Glisse chaque vecteur dans une case, ou touche-le pour le poser dans la prochaine case libre.</p>' +
        '<div class="atelier"><span class="titre" style="font-size:26px;font-weight:700">\\(R^{0,1} =\\)</span><div class="crochet"><div class="case"></div><div class="case"></div><div class="case"></div></div></div>' +
        '<div class="reserve"></div><button class="verifier" type="button" disabled>Vérifier</button><div class="retour-msg"></div>' +
        '<div class="explique"><p>C\'est la matrice de rotation : ses colonnes sont les axes de \\(R_1\\) exprimés dans \\(R_0\\). Pour une rotation d\'angle α autour de \\(\\vec{z}_0\\) :</p>' +
        '\\[ R^{0,1} = R_z(\\alpha) = \\begin{pmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]' +
        '<p>Le cours l\'écrit aussi \\({}^0R_1\\), \\(R_{01}\\) ou \\(R^0_1\\) : c\'est le même objet.</p></div>';
      Object.assign(etat, { alpha: 60, u: 170, glisse: false, cible: false, proj1: false, proj2: false, y1: true, grilleR1: false, pin: null, chemin: 0, cellule: null, hud: "colonnes" });
      E.rendre(el);
      var R = E.Rz(60 * DEG), cases = [].slice.call(el.querySelectorAll(".case")), reserve = el.querySelector(".reserve");
      var verif = el.querySelector(".verifier"), r = el.querySelector(".retour-msg"), ex = el.querySelector(".explique");
      var place = [null, null, null], chips = [];
      [2, 0, 1].forEach(function (j) {
        var c = E.h("div", "chip " + "xyz"[j], "", reserve);
        c.dataset.j = j;
        E.h("span", "nom", ["x₁", "y₁", "z₁"][j], c).style.color = [COUL.x, COUL.y, COUL.z][j];
        var v = E.h("span", "", "", c); E.k(v, E.texVec(E.col(R, j)));
        chips.push(c);
        brancherChip(c);
      });
      function poser(c, k) {
        var ancien = place.indexOf(c); if (ancien >= 0) place[ancien] = null;
        if (k === null) { reserve.appendChild(c); }
        else { if (place[k]) reserve.appendChild(place[k]); place[k] = c; cases[k].appendChild(c); }
        cases.forEach(function (x) { x.classList.remove("faux"); });
        verif.disabled = place.some(function (x) { return !x; });
      }
      function brancherChip(c) {
        c.addEventListener("pointerdown", function (ev) {
          if (c.dataset.bloque) return;
          ev.preventDefault();
          var id = ev.pointerId, x0 = ev.clientX, y0 = ev.clientY, bouge = false, vol = null, cible = null;
          var bb = c.getBoundingClientRect();
          function survol(e) {
            cases.forEach(function (x) { x.classList.remove("survol"); });
            cible = null;
            cases.forEach(function (x, k) { var b = x.getBoundingClientRect(); if (e.clientX > b.left - 10 && e.clientX < b.right + 10 && e.clientY > b.top - 10 && e.clientY < b.bottom + 10) { cible = k; x.classList.add("survol"); } });
          }
          function mv(e) {
            if (e.pointerId !== id) return;
            if (!bouge && Math.hypot(e.clientX - x0, e.clientY - y0) > 8) {
              bouge = true; vol = c.cloneNode(true); vol.classList.add("vol"); document.body.appendChild(vol); c.classList.add("fantome");
            }
            if (vol) { vol.style.left = (e.clientX - bb.width / 2) + "px"; vol.style.top = (e.clientY - bb.height / 2) + "px"; survol(e); }
          }
          function fin(e) {
            if (e.pointerId !== id) return;
            window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", fin); window.removeEventListener("pointercancel", fin);
            cases.forEach(function (x) { x.classList.remove("survol"); });
            c.classList.remove("fantome");
            if (vol) { vol.remove(); if (cible !== null) poser(c, cible); else poser(c, null); }
            else { var libre = place.indexOf(null); if (place.indexOf(c) >= 0) poser(c, null); else if (libre >= 0) poser(c, libre); }
          }
          window.addEventListener("pointermove", mv); window.addEventListener("pointerup", fin); window.addEventListener("pointercancel", fin);
        });
      }
      verif.addEventListener("click", function () {
        var faux = [];
        place.forEach(function (c, k) { if (+c.dataset.j !== k) faux.push(k); });
        if (faux.length) {
          faux.forEach(function (k) { cases[k].classList.add("faux", "secoue"); });
          setTimeout(function () { faux.forEach(function (k) { cases[k].classList.remove("secoue"); poser(place[k], null); }); }, 650);
          msg(r, false, "La colonne \\(j\\) contient le \\(j\\)-ième axe du repère qui a tourné : \\(\\vec{x}_1\\), puis \\(\\vec{y}_1\\), puis \\(\\vec{z}_1\\).");
          return;
        }
        verif.style.display = "none"; reserve.style.display = "none";
        cases.forEach(function (x) { x.classList.add("bon"); x.firstChild.dataset.bloque = 1; });
        msg(r, true, "Bien rangé.");
        etat.hud = "matrice"; dessiner(); montrer(ex);
        bouton(ex, "Continuer", "continuer", function () { aller(3); }); reussi(2);
      });
    } },

    { nom: "Trouver", construire: function (el) {
      el.innerHTML = '<div class="kicker">Étape 4 sur 6</div><h2>Trouve α pour que la première colonne vaille \\((0 ;\\ 1 ;\\ 0)\\).</h2>' +
        '<p class="consigne">Tourne l\'instrument en regardant la matrice, sous la figure.</p><div class="retour-msg"></div>' +
        '<div class="explique"><p>La première colonne est \\([\\vec{x}_1]_{R_0}\\). Elle vaut \\((0 ;\\ 1 ;\\ 0)\\) quand \\(\\vec{x}_1\\) pointe exactement selon \\(\\vec{y}_0\\) :</p>' +
        '\\[ R_z(90°) = \\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]' +
        '<p>Et la deuxième colonne, \\((-1 ;\\ 0 ;\\ 0)\\) : \\(\\vec{y}_1\\) pointe alors selon \\(-\\vec{x}_0\\). Vérifie sur la figure.</p></div>';
      Object.assign(etat, { u: 170, glisse: true, cible: false, proj1: false, proj2: false, y1: true, grilleR1: false, pin: null, chemin: 0, cellule: null, hud: "colonne1" });
      astuce.textContent = "La colonne surlignée est celle de x₁.";
      var r = el.querySelector(".retour-msg"), ex = el.querySelector(".explique"), gagne = false;
      animerAlpha(20, 500);
      function victoire() {
        gagne = true; etat.glisse = false;
        animerAlpha(90, 300, function () {
          msg(r, true, "Trouvé : α = 90°."); montrer(ex);
          bouton(ex, "Continuer", "continuer", function () { aller(4); }); reussi(3);
        });
      }
      surAngle = function (a) {
        if (gagne) return;
        if (E.ecartAngle(a, -90) < 4) msg(r, false, "Presque : là, \\(\\vec{x}_1\\) pointe selon \\(-\\vec{y}_0\\), la colonne vaut \\((0 ;\\ -1 ;\\ 0)\\).");
        else r.innerHTML = "";
        if (E.ecartAngle(a, 90) < 2) victoire();
      };
      surRelache = function (a) { if (!gagne && E.ecartAngle(a, 90) < 6) victoire(); };
    } },

    { nom: "Appliquer", construire: function (el) {
      el.innerHTML = '<div class="kicker">Étape 5 sur 6</div><h2>L\'instrument tient une aiguille, fixe dans \\(R_1\\) : \\(V^1 = (2 ;\\ 1 ;\\ 0)\\). Où arrive sa pointe ?</h2>' +
        '<p class="consigne">Ici α = 30°. La grille violette est celle de \\(R_1\\). Touche la figure là où tu penses que se trouve la pointe, puis vérifie.</p>' +
        '<button class="verifier" type="button" disabled>Vérifier</button><div class="retour-msg"></div>' +
        '<div class="explique"><p>La pointe est à 2 pas selon \\(\\vec{x}_1\\) et 1 pas selon \\(\\vec{y}_1\\). Dans \\(R_0\\), c\'est 2 fois la première colonne plus 1 fois la deuxième : c\'est exactement le produit de la matrice par le vecteur.</p>' +
        '\\[ \\begin{aligned} V^0 = R^{0,1}\\,V^1 &= 2\\begin{pmatrix} 0{,}866 \\\\ 0{,}5 \\\\ 0 \\end{pmatrix} + 1\\begin{pmatrix} -0{,}5 \\\\ 0{,}866 \\\\ 0 \\end{pmatrix} \\\\[4pt] &= \\begin{pmatrix} 1{,}232 \\\\ 1{,}866 \\\\ 0 \\end{pmatrix} \\end{aligned} \\]' +
        '<p>Ligne par ligne : \\(0{,}866 \\times 2 + (-0{,}5) \\times 1 = 1{,}232\\) et \\(0{,}5 \\times 2 + 0{,}866 \\times 1 = 1{,}866\\).</p></div>';
      Object.assign(etat, { glisse: false, cible: false, proj1: false, proj2: false, y1: true, grilleR1: true, pin: null, chemin: 0, cellule: null, hud: "matrice" });
      astuce.textContent = "";
      var verif = el.querySelector(".verifier"), r = el.querySelector(".retour-msg"), ex = el.querySelector(".explique");
      animerAlpha(30, 600); animerEchelle(100);
      surTape = function () { verif.disabled = false; };
      verif.addEventListener("click", function () {
        verif.style.display = "none"; surTape = null;
        var V0 = E.mv(E.Rz(30 * DEG), [2, 1, 0]), d = Math.hypot(etat.pin[0] - V0[0], etat.pin[1] - V0[1]);
        E.anime(2400, function (e) { etat.chemin = 3 * e; dessiner(); }, function () {
          if (d < 0.3) msg(r, true, "Très bien : ta prédiction est à " + fc(d) + " de la pointe.");
          else msg(r, false, "Ta prédiction est à " + fc(d) + " de la pointe. Suis le chemin : 2 pas selon \\(\\vec{x}_1\\), puis 1 pas selon \\(\\vec{y}_1\\).");
          montrer(ex); bouton(ex, "Continuer", "continuer", function () { aller(5); }); reussi(4);
        });
      });
    } },

    { nom: "Bilan", construire: function (el) {
      el.innerHTML = '<div class="kicker">Étape 6 sur 6</div><h2>Chaque case est un produit scalaire. Laquelle vaut \\(\\vec{x}_0 \\cdot \\vec{y}_1\\) ?</h2>' +
        '<p class="consigne">Touche une case de la matrice, sur la figure. Les deux axes concernés s\'allument.</p><div class="retour-msg"></div><div class="direct" style="font-size:20px;min-height:40px"></div>' +
        '<div class="explique"><p>La ligne donne l\'axe de \\(R_0\\), la colonne l\'axe de \\(R_1\\) : \\(r_{ij}\\) est le produit scalaire de l\'axe \\(i\\) de \\(R_0\\) par l\'axe \\(j\\) de \\(R_1\\). Ici \\(r_{12} = \\vec{x}_0 \\cdot \\vec{y}_1 = -\\sin\\alpha\\).</p>' +
        '<ul class="recap"><li>Colonnes de \\(R^{0,1}\\) : les axes de \\(R_1\\) exprimés dans \\(R_0\\).</li>' +
        '<li>\\(R_z(\\alpha) = \\begin{pmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}\\)</li>' +
        '<li>Un vecteur fixe dans \\(R_1\\) : \\(V^0 = R^{0,1}\\,V^1\\).</li>' +
        '<li>Notations : \\(R^{i,j} = {}^iR_j = R_{ij} = R^i_j\\).</li></ul>' +
        '<p>Continue d\'explorer : tourne l\'instrument et touche d\'autres cases.</p></div>';
      Object.assign(etat, { u: 170, glisse: true, cible: false, proj1: false, proj2: false, y1: true, grilleR1: false, pin: null, chemin: 0, cellule: null, hud: "matrice" });
      animerAlpha(40, 600);
      var r = el.querySelector(".retour-msg"), ex = el.querySelector(".explique"), dir = el.querySelector(".direct"), gagne = false;
      var A0 = ["\\vec{x}_0", "\\vec{y}_0", "\\vec{z}_0"], A1 = ["\\vec{x}_1", "\\vec{y}_1", "\\vec{z}_1"];
      var F = [["\\cos\\alpha", "-\\sin\\alpha", "0"], ["\\sin\\alpha", "\\cos\\alpha", "0"], ["0", "0", "1"]];
      function ecrire() {
        if (!etat.cellule) return;
        var i = etat.cellule[0], j = etat.cellule[1], R = E.Rz(etat.alpha * DEG);
        E.k(dir, "r_{" + (i + 1) + (j + 1) + "} = " + A0[i] + " \\cdot " + A1[j] + " = " + F[i][j] + " = " + E.tc(R[i][j]));
      }
      surCellule = function (i, j) {
        etat.cellule = [i, j]; dessiner(); ecrire();
        if (gagne) return;
        if (i === 0 && j === 1) {
          gagne = true; msg(r, true, "C'est \\(r_{12}\\) : ligne 1 pour \\(\\vec{x}_0\\), colonne 2 pour \\(\\vec{y}_1\\).");
          montrer(ex); reussi(5);
          bouton(ex, "Recommencer le parcours", "secondaire", function () { aller(0); });
        } else msg(r, false, "Cette case relie " + "\\(" + A0[i] + "\\)" + " et " + "\\(" + A1[j] + "\\)" + ". Cherche la ligne de \\(\\vec{x}_0\\) et la colonne de \\(\\vec{y}_1\\).");
      };
      surAngle = function () { ecrire(); };
    } }
  ];

  var nav = document.querySelector(".progres");
  ETAPES.forEach(function (e, i) {
    var b = E.h("button", "", '<span class="piste"><i></i></span><small>' + (i + 1) + ". " + e.nom + "</small>", nav);
    b.type = "button"; b.addEventListener("click", function () { if (i <= atteinte) aller(i); });
  });
  function majProgres() {
    [].forEach.call(nav.children, function (b, i) {
      b.className = (fini.indexOf(i) >= 0 ? "fait " : "") + (i === courante ? "courant" : "");
      b.disabled = i > atteinte;
    });
  }

  function aller(i) {
    surAngle = surRelache = surTape = surCellule = null;
    var ancien = panneau.querySelector(".etape:not(.sortie)");
    if (ancien) { ancien.classList.add("sortie"); setTimeout(function () { ancien.remove(); }, 450); }
    var el = E.h("div", "etape entree", "", panneau);
    courante = i; atteinte = Math.max(atteinte, i);
    ETAPES[i].construire(el);
    E.rendre(el);
    majProgres(); dessiner();
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove("entree"); }); });
  }
  window.essaiA = { etat: etat, aller: aller };
  aller(0);
})();
