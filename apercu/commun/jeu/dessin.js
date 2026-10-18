/*
 * Dessin des figures : plan 2D, scène 3D tournante, cadran, poignées.
 * Tout est en SVG ; les couleurs suivent CLAUDE.md (section Design).
 */
window.D = (function () {
  "use strict";
  var DEG = Math.PI / 180;
  var C = {
    x: "#e5484d", y: "#12a26b", z: "#3b5bdb", v: "#8b3fd9", acc: "#3b5bdb", jeu: window.PLATEFORME ? PLATEFORME.couleur() : "#D44C47",
    encre: "#15171f", doux: "#5b6172", gris: "#9aa0ad", pale: "#e3e6ee", ok: "#12a26b", ko: "#e5484d",
    xPale: "#f0a7a9", yPale: "#93d6b8", zPale: "#a9b8f0"
  };

  /* ---------- Primitives écran ---------- */
  function fleche(g, a, b, coul, ep, o) {
    o = o || {};
    var d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]);
    if (l < 2) return null;
    var u = [d[0] / l, d[1] / l], t = 9 + ep * 2.2, w = 5 + ep * 1.3, c = [b[0] - u[0] * t, b[1] - u[1] * t];
    var gr = E.s("g", { opacity: o.op }, g);
    E.s("line", { x1: a[0], y1: a[1], x2: c[0], y2: c[1], stroke: coul, "stroke-width": ep, "stroke-linecap": "round", "stroke-dasharray": o.tirets }, gr);
    E.s("polygon", { points: [b, [c[0] - u[1] * w, c[1] + u[0] * w], [c[0] + u[1] * w, c[1] - u[0] * w]].map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: coul }, gr);
    return gr;
  }
  function texte(g, t, p, o) {
    o = o || {};
    var e = E.s("text", {
      x: p[0], y: p[1], fill: o.coul || C.encre, "font-size": o.taille || 22, "font-weight": o.gras === false ? 500 : 700,
      "text-anchor": o.ancre || "middle", "dominant-baseline": "middle", opacity: o.op,
      "font-family": o.mono ? "JetBrains Mono, monospace" : "Inter, sans-serif", "font-style": o.italique ? "italic" : null
    }, g);
    e.textContent = t;
    if (o.fond !== false) { e.setAttribute("paint-order", "stroke"); e.setAttribute("stroke", o.fondCoul || "#fff"); e.setAttribute("stroke-width", 6); e.setAttribute("stroke-linejoin", "round"); }
    return e;
  }
  function ligne(g, a, b, coul, ep, tirets) {
    return E.s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: coul, "stroke-width": ep || 2, "stroke-dasharray": tirets, "stroke-linecap": "round" }, g);
  }
  function rond(g, p, r, o) {
    o = o || {};
    return E.s("circle", { cx: p[0], cy: p[1], r: r, fill: o.fill || C.encre, stroke: o.stroke, "stroke-width": o.ep, opacity: o.op, "stroke-dasharray": o.tirets }, g);
  }
  // poignée à saisir : halo qui respire + anneau
  function poignee(g, p, coul) {
    rond(g, p, 26, { fill: "rgba(59,91,219,.12)" }).setAttribute("class", "halo");
    rond(g, p, 13, { fill: "#fff", stroke: coul || C.acc, ep: 4 });
  }

  /* ---------- Plan 2D ---------- */
  // O : origine à l'écran, u : pixels par unité
  function plan(svg, O, u) {
    var pl = { svg: svg, O: O.slice(), u: u };
    pl.fond = E.s("g", null, svg); pl.fig = E.s("g", null, svg); pl.haut = E.s("g", null, svg);
    pl.P = function (v) { return [pl.O[0] + v[0] * pl.u, pl.O[1] - v[1] * pl.u]; };
    pl.U = function (p) { return [(p[0] - pl.O[0]) / pl.u, (pl.O[1] - p[1]) / pl.u, 0]; };
    pl.vider = function () { E.vider(pl.fond); E.vider(pl.fig); E.vider(pl.haut); };
    var vb = svg.viewBox.baseVal, W = vb && vb.width ? vb.width : 680, H = vb && vb.height ? vb.height : 600;
    // quadrillage : pas en unités ; axes facultatifs
    pl.grille = function (o) {
      o = o || {};
      var pas = (o.pas || 0.5) * pl.u;
      // le quadrillage déborde du cadre : la figure peut être plus large ou plus haute que la vue
      for (var k = -120; k <= 120; k++) {
        var x = pl.O[0] + k * pas, y = pl.O[1] - k * pas, fort = o.fort && k % o.fort === 0;
        if (x > -400 && x < W + 400) ligne(pl.fond, [x, -400], [x, H + 400], fort ? "#e4e8f0" : "#f1f3f7", 1.5);
        if (y > -400 && y < H + 400) ligne(pl.fond, [-400, y], [W + 400, y], fort ? "#e4e8f0" : "#f1f3f7", 1.5);
      }
    };
    pl.axes = function (o) {
      o = o || {};
      var lx = o.lx || [-1.5, 1.6], ly = o.ly || [-1.2, 1.6], noms = o.noms || ["x₀", "y₀"];
      fleche(pl.fond, pl.P([lx[0], 0]), pl.P([lx[1], 0]), o.coulX || C.xPale, 3);
      fleche(pl.fond, pl.P([0, ly[0]]), pl.P([0, ly[1]]), o.coulY || C.yPale, 3);
      texte(pl.fond, noms[0], [pl.P([lx[1], 0])[0], pl.P([lx[1], 0])[1] + 24], { coul: o.coulTxtX || C.x });
      texte(pl.fond, noms[1], [pl.P([0, ly[1]])[0] - 26, pl.P([0, ly[1]])[1]], { coul: o.coulTxtY || C.y });
    };
    pl.vec = function (g, a, b, coul, ep, nom, o) {
      o = o || {};
      var r = fleche(g, pl.P(a), pl.P(b), coul, ep || 4.5, o);
      if (nom) {
        var d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]) || 1, q = pl.P([b[0] + d[0] / l * 0.16, b[1] + d[1] / l * 0.16]);
        texte(g, nom, o.decal ? [q[0] + o.decal[0], q[1] + o.decal[1]] : q, { coul: coul, taille: o.taille || 23 });
      }
      return r;
    };
    // arc de rayon r (pixels) centré en c (unités), de a0 à a1 (degrés)
    pl.arc = function (g, c, r, a0, a1, coul, nom, o) {
      o = o || {};
      if (Math.abs(a1 - a0) < 0.5) return;
      var q = pl.P(c), p0 = [q[0] + r * Math.cos(a0 * DEG), q[1] - r * Math.sin(a0 * DEG)], p1 = [q[0] + r * Math.cos(a1 * DEG), q[1] - r * Math.sin(a1 * DEG)];
      E.s("path", { d: "M" + p0 + " A" + r + " " + r + " 0 " + (Math.abs(a1 - a0) > 180 ? 1 : 0) + " " + (a1 > a0 ? 0 : 1) + " " + p1, fill: o.fill || "none", stroke: coul, "stroke-width": o.ep || 2.5, "stroke-dasharray": o.tirets }, g);
      if (nom) { var am = (a0 + a1) / 2 * DEG, rl = r + (o.ecart || 24); texte(g, nom, [q[0] + rl * Math.cos(am), q[1] - rl * Math.sin(am)], { coul: coul, taille: o.taille || 20 }); }
    };
    pl.secteur = function (g, c, r, a0, a1, fill) {
      if (Math.abs(a1 - a0) < 0.5) return;
      var q = pl.P(c), p0 = [q[0] + r * Math.cos(a0 * DEG), q[1] - r * Math.sin(a0 * DEG)], p1 = [q[0] + r * Math.cos(a1 * DEG), q[1] - r * Math.sin(a1 * DEG)];
      E.s("path", { d: "M" + q + " L" + p0 + " A" + r + " " + r + " 0 " + (Math.abs(a1 - a0) > 180 ? 1 : 0) + " " + (a1 > a0 ? 0 : 1) + " " + p1 + " Z", fill: fill }, g);
    };
    pl.origine = function (g, nom) {
      var q = pl.P([0, 0]);
      rond(g, q, 9, { fill: "#fff", stroke: C.z, ep: 2.5 }); rond(g, q, 3, { fill: C.z });
      if (nom) texte(g, nom, [q[0] - 18, q[1] + 30], { coul: C.z, taille: 17, ancre: "end" });
    };
    return pl;
  }

  /* ---------- Glisser dans une figure ----------
     o.debut(p, ev) -> true pour prendre la main ; o.bouge(p, ev) ; o.fin(p, ev) */
  function glisser(svg, o) {
    E.glisser(svg, svg, function (p, ev) { if (o.bouge) o.bouge(p, ev); }, function (p, ev) { if (o.fin) o.fin(p, ev); }, function (p, ev) { return o.debut ? !!o.debut(p, ev) : true; });
  }

  /* ---------- Scène 3D ---------- */
  function scene(svg, o) {
    o = o || {};
    var sc = { az: o.az === undefined ? 32 : o.az, el: o.el === undefined ? 24 : o.el, centre: o.centre || [340, 330], ech: o.ech || 130, persp: o.persp || 9 };
    var K = null;
    function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
    function cam() {
      var a = sc.az * DEG, e = sc.el * DEG;
      K = { r: [-Math.sin(a), Math.cos(a), 0], u: [-Math.cos(a) * Math.sin(e), -Math.sin(a) * Math.sin(e), Math.cos(e)], f: [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)] };
    }
    cam();
    sc.P = function (v) {
      var X = dot(v, K.r), Y = dot(v, K.u), d = dot(v, K.f), s = sc.persp / (sc.persp - d);
      return [sc.centre[0] + sc.ech * s * X, sc.centre[1] - sc.ech * s * Y, d];
    };
    sc.vers = function () { return K.f; };
    var LUM = (function () { var l = [0.35, 0.45, 0.82], n = Math.hypot(l[0], l[1], l[2]); return [l[0] / n, l[1] / n, l[2] / n]; })();
    function teinte(hex, k) {
      var n = parseInt(hex.slice(1), 16);
      return "rgb(" + Math.round((n >> 16) * k) + "," + Math.round(((n >> 8) & 255) * k) + "," + Math.round((n & 255) * k) + ")";
    }
    function pts(l) { return l.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
    // Liste d'objets triés par profondeur, puis dessinés
    sc.nouvelle = function () { cam(); return []; };
    sc.dessiner = function (g, liste) { liste.sort(function (p, q) { return p.d - q.d; }).forEach(function (x) { x.f(g); }); };
    sc.fleche = function (liste, a, b, coul, ep, nom, op) {
      var pa = sc.P(a), pb = sc.P(b);
      liste.push({ d: (pa[2] + pb[2]) / 2 + 0.05, f: function (g) {
        fleche(g, pa, pb, coul, ep, { op: op });
        if (nom) {
          var d = [pb[0] - pa[0], pb[1] - pa[1]], l = Math.hypot(d[0], d[1]) || 1;
          texte(g, nom, [pb[0] + d[0] / l * 20, pb[1] + d[1] / l * 20], { coul: coul, taille: 22, op: op });
        }
      } });
    };
    sc.segment = function (liste, a, b, coul, ep, tirets) {
      var pa = sc.P(a), pb = sc.P(b);
      liste.push({ d: (pa[2] + pb[2]) / 2, f: function (g) { ligne(g, pa, pb, coul, ep, tirets); } });
    };
    sc.point = function (liste, a, r, coul, nom) {
      var p = sc.P(a);
      liste.push({ d: p[2] + 0.06, f: function (g) { rond(g, p, r, { fill: coul, stroke: "#fff", ep: 2 }); if (nom) texte(g, nom, [p[0] + 16, p[1] - 14], { coul: coul, taille: 20, ancre: "start" }); } });
    };
    sc.texte = function (liste, t, a, o) { var p = sc.P(a); liste.push({ d: p[2] + 0.1, f: function (g) { texte(g, t, p, o); } }); };
    sc.polygone = function (liste, l, fill, stroke, op) {
      var q = l.map(sc.P), d = q.reduce(function (s, p) { return s + p[2]; }, 0) / q.length;
      liste.push({ d: d - 0.02, f: function (g) { E.s("polygon", { points: pts(q), fill: fill, stroke: stroke || "none", "stroke-width": 1.5, opacity: op }, g); } });
    };
    // pavé : centre local c, demi-tailles h, repère M (matrice 3×3), origine o
    sc.pave = function (liste, M, org, c, h, coul, op) {
      var S = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(function (s) {
        var v = E.mv(M, [c[0] + s[0] * h[0], c[1] + s[1] * h[1], c[2] + s[2] * h[2]]);
        return [org[0] + v[0], org[1] + v[1], org[2] + v[2]];
      });
      [[[0, 1, 2, 3], [0, 0, -1]], [[4, 5, 6, 7], [0, 0, 1]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 3, 7, 6], [0, 1, 0]], [[1, 2, 6, 5], [1, 0, 0]], [[0, 3, 7, 4], [-1, 0, 0]]].forEach(function (f) {
        var n = E.mv(M, f[1]); if (dot(n, K.f) <= 0.01) return;
        var q = f[0].map(function (i) { return sc.P(S[i]); }), d = q.reduce(function (s, p) { return s + p[2]; }, 0) / 4;
        liste.push({ d: d, f: function (g) { E.s("polygon", { points: pts(q), fill: teinte(coul, 0.62 + 0.38 * Math.max(0, dot(n, LUM))), stroke: C.encre, "stroke-width": 1.4, "stroke-linejoin": "round", opacity: op }, g); } });
      });
    };
    sc.cylindre = function (liste, org, r, h, coul, op) {
      var N = 28, bas = [], haut = [];
      for (var i = 0; i < N; i++) { var t = i / N * 2 * Math.PI; bas.push([org[0] + r * Math.cos(t), org[1] + r * Math.sin(t), org[2]]); haut.push([org[0] + r * Math.cos(t), org[1] + r * Math.sin(t), org[2] + h]); }
      for (i = 0; i < N; i++) {
        var j = (i + 1) % N, tm = (i + 0.5) / N * 2 * Math.PI, n = [Math.cos(tm), Math.sin(tm), 0];
        if (dot(n, K.f) <= 0) continue;
        (function (q, n) {
          var d = q.reduce(function (s, p) { return s + p[2]; }, 0) / 4, c = teinte(coul, 0.62 + 0.38 * Math.max(0, dot(n, LUM)));
          liste.push({ d: d, f: function (g) { E.s("polygon", { points: pts(q), fill: c, stroke: c, "stroke-width": 0.8, opacity: op }, g); } });
        })([sc.P(bas[i]), sc.P(bas[j]), sc.P(haut[j]), sc.P(haut[i])], n);
      }
      var ph = haut.map(sc.P), dh = ph.reduce(function (s, p) { return s + p[2]; }, 0) / N + 0.01;
      liste.push({ d: dh, f: function (g) { E.s("polygon", { points: pts(ph), fill: teinte(coul, 1), stroke: C.encre, "stroke-width": 1.4, opacity: op }, g); } });
    };
    // repère : trois flèches depuis org, axes = colonnes de M
    sc.repere = function (liste, org, M, L, noms, o) {
      o = o || {};
      var cl = o.pale ? [C.xPale, C.yPale, C.zPale] : [C.x, C.y, C.z];
      for (var j = 0; j < 3; j++) {
        var c = E.col(M, j);
        sc.fleche(liste, org, [org[0] + c[0] * L, org[1] + c[1] * L, org[2] + c[2] * L], cl[j], o.ep || 4, noms ? noms[j] : null, o.op);
      }
    };
    sc.sol = function (liste, R, graduer) {
      var l = []; for (var i = 0; i < 72; i++) { var t = i / 72 * 2 * Math.PI; l.push([R * Math.cos(t), R * Math.sin(t), 0]); }
      var q = l.map(sc.P);
      liste.push({ d: -99, f: function (g) {
        E.s("polygon", { points: pts(q), fill: "#f5f7fc", stroke: "#dfe4ef", "stroke-width": 2 }, g);
        if (graduer) for (var d = -150; d <= 180; d += 30) {
          var a = sc.P([(R - 0.15) * Math.cos(d * DEG), (R - 0.15) * Math.sin(d * DEG), 0]), b = sc.P([R * Math.cos(d * DEG), R * Math.sin(d * DEG), 0]), t = sc.P([(R + 0.25) * Math.cos(d * DEG), (R + 0.25) * Math.sin(d * DEG), 0]);
          ligne(g, a, b, "#c3cad9", 2);
          // graduation trop près du bord du dessin : on ne l'écrit pas (elle serait coupée)
          // 0° et 90° : directions des axes x et y, déjà nommées
          if (d !== 0 && d !== 90 && t[0] > 22 && t[0] < 658 && t[1] > 12 && t[1] < 588) texte(g, String(d).replace("-", "−") + "°", t, { coul: "#9aa3b8", taille: 13, mono: true, gras: false });
        }
      } });
    };
    // tourner la vue : un doigt sur le fond (sauf si o.libre(p) dit non)
    sc.orbite = function (surChange, accepte) {
      var dep = null;
      svg.addEventListener("pointerdown", function (e) {
        if (accepte && !accepte(e)) return;
        dep = [e.clientX, e.clientY, sc.az, sc.el, e.pointerId];
        try { svg.setPointerCapture(e.pointerId); } catch (x) { /* rien */ }
      });
      svg.addEventListener("pointermove", function (e) {
        if (!dep || e.pointerId !== dep[4]) return;
        sc.az = dep[2] - (e.clientX - dep[0]) * 0.35;
        sc.el = Math.max(6, Math.min(80, dep[3] + (e.clientY - dep[1]) * 0.3));
        surChange();
      });
      var fin = function () { dep = null; };
      svg.addEventListener("pointerup", fin); svg.addEventListener("pointercancel", fin);
    };
    return sc;
  }

  /* ---------- Cadran ----------
     parent : élément HTML ; o.change(a) ; o.decalage() : angle à l'écran de la direction 0 */
  function cadran(parent, o) {
    o = o || {};
    var bloc = E.h("div", "cadran", "", parent);
    var svg = E.s("svg", { viewBox: "0 0 236 236", "aria-label": "Cadran" }, bloc);
    var fins = E.h("div", "fins", "", bloc);
    var cd = { valeur: 0, verrou: false };
    function dec() { return o.decalage ? o.decalage() : 0; }
    cd.dessiner = function () {
      E.vider(svg);
      var c = 118, th0 = dec(), a = (cd.valeur + th0) * DEG, a0 = th0 * DEG;
      rond(svg, [c, c], 112, { fill: "#fff", stroke: C.encre, ep: 3 });
      for (var d = 0; d < 360; d += 15) {
        var long = d % 90 === 0, r0 = long ? 92 : 100, t = (d + th0) * DEG;
        ligne(svg, [c + r0 * Math.cos(t), c - r0 * Math.sin(t)], [c + 108 * Math.cos(t), c - 108 * Math.sin(t)], long ? C.encre : "#b8bfce", long ? 3 : 2);
      }
      if (Math.abs(cd.valeur) > 0.5) {
        var p0 = [c + 70 * Math.cos(a0), c - 70 * Math.sin(a0)], p1 = [c + 70 * Math.cos(a), c - 70 * Math.sin(a)];
        E.s("path", { d: "M" + c + " " + c + " L" + p0.join(" ") + " A70 70 0 " + (Math.abs(cd.valeur) > 180 ? 1 : 0) + " " + (cd.valeur > 0 ? 0 : 1) + " " + p1.join(" ") + " Z", fill: PLATEFORME.teinte(.18) }, svg);
      }
      rond(svg, [c, c], 64, { fill: "#f3f5fa", stroke: C.encre, ep: 2.5 });
      if (o.reperes !== false) [["0°", 0, C.x], ["90°", 90, C.y]].forEach(function (l) {
        var t = (th0 + l[1]) * DEG;
        ligne(svg, [c, c], [c + 58 * Math.cos(t), c - 58 * Math.sin(t)], l[2], 2, "3 4");
        texte(svg, l[0], [c + 38 * Math.cos(t), c - 38 * Math.sin(t)], { coul: l[2], taille: 14, fondCoul: "#f3f5fa" });
      });
      ligne(svg, [c, c], [c + 84 * Math.cos(a), c - 84 * Math.sin(a)], C.jeu, 7);
      rond(svg, [c + 84 * Math.cos(a), c - 84 * Math.sin(a)], 16, { fill: C.jeu, stroke: C.encre, ep: 3 });
      rond(svg, [c, c], 9, { fill: C.encre });
    };
    cd.regler = function (v, silencieux) { cd.valeur = v; cd.dessiner(); if (!silencieux && o.change) o.change(v); };
    cd.verrouiller = function (v) { cd.verrou = v; bloc.classList.toggle("verrou", v); };
    E.glisser(svg, svg, function (p) {
      if (cd.verrou) return;
      var a = Math.round(E.angle360(Math.atan2(118 - p[1], p[0] - 118) / DEG - dec()));
      if (o.pas) a = Math.round(a / o.pas) * o.pas;
      cd.regler(a);
    }, function () { if (o.relache) o.relache(cd.valeur); });
    [-1, 1].forEach(function (s) {
      var b = E.h("button", "", (s < 0 ? "−" : "+") + (o.pas || 1) + "°", fins); b.type = "button";
      b.addEventListener("click", function () { if (cd.verrou) return; cd.regler(E.angle360(Math.round(cd.valeur) + s * (o.pas || 1))); if (o.relache) o.relache(cd.valeur); });
    });
    cd.dessiner();
    return cd;
  }

  return { C: C, DEG: DEG, fleche: fleche, texte: texte, ligne: ligne, rond: rond, poignee: poignee, plan: plan, glisser: glisser, scene: scene, cadran: cadran };
})();
