/*
 * Bibliothèque commune des figures : calculs (RM.m), mise en forme (RM.fmt, RM.tex),
 * dessin SVG 2D et 3D, curseurs, boutons et étapes.
 * Les fonctions de RM.m sont pures et testées par tests/math.test.js.
 */
(function (global) {
  "use strict";

  /* ================================================================ */
  /* Calculs                                                            */
  /* ================================================================ */

  var DEG = Math.PI / 180;

  function matMul(A, B) {
    if (A[0].length !== B.length) throw new Error("dimensions incompatibles");
    return A.map(function (ligne) {
      return B[0].map(function (_, j) {
        return ligne.reduce(function (s, a, k) { return s + a * B[k][j]; }, 0);
      });
    });
  }
  function matVec(A, v) { return A.map(function (l) { return l.reduce(function (s, a, j) { return s + a * v[j]; }, 0); }); }
  function transpose(A) { return A[0].map(function (_, j) { return A.map(function (l) { return l[j]; }); }); }
  function det2(A) { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
  function det3(R) {
    return R[0][0] * (R[1][1] * R[2][2] - R[1][2] * R[2][1])
         - R[0][1] * (R[1][0] * R[2][2] - R[1][2] * R[2][0])
         + R[0][2] * (R[1][0] * R[2][1] - R[1][1] * R[2][0]);
  }
  function identite(n) { var I = []; for (var i = 0; i < n; i++) { I.push([]); for (var j = 0; j < n; j++) I[i].push(i === j ? 1 : 0); } return I; }
  function dot(u, v) { var s = 0; for (var i = 0; i < u.length; i++) s += u[i] * v[i]; return s; }
  function cross(u, v) { return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; }
  function norme(u) { return Math.sqrt(dot(u, u)); }
  function add(u, v) { return u.map(function (x, i) { return x + v[i]; }); }
  function sub(u, v) { return u.map(function (x, i) { return x - v[i]; }); }
  function scale(u, k) { return u.map(function (x) { return x * k; }); }
  function colonne(M, j) { return M.map(function (l) { return l[j]; }); }

  // Rotations élémentaires, écrites comme dans le cours (chapitre 2, 3-4-2).
  function Rz(a) { var c = Math.cos(a), s = Math.sin(a); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; }
  function Ry(b) { var c = Math.cos(b), s = Math.sin(b); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]; }
  function Rx(g) { var c = Math.cos(g), s = Math.sin(g); return [[1, 0, 0], [0, c, -s], [0, s, c]]; }
  function Raxe(axe, t) { return axe === "x" ? Rx(t) : axe === "y" ? Ry(t) : Rz(t); }

  // Convention ZYX du cours : R^{(0,s)} = Rz(α) Ry(β) Rx(γ).
  function eulerZYX(a, b, g) { return matMul(matMul(Rz(a), Ry(b)), Rx(g)); }
  // Variante XYZ (exemple du téléphone) : ^0R_3 = Rx(φ) Ry(θ) Rz(ψ).
  function eulerXYZ(phi, theta, psi) { return matMul(matMul(Rx(phi), Ry(theta)), Rz(psi)); }

  // Matrice homogène T = [R p ; 0 0 0 1] et son inverse [Rᵀ -Rᵀp ; 0 1].
  function homog(R, p) {
    return [R[0].concat([p[0]]), R[1].concat([p[1]]), R[2].concat([p[2]]), [0, 0, 0, 1]];
  }
  function blocR(T) { return [T[0].slice(0, 3), T[1].slice(0, 3), T[2].slice(0, 3)]; }
  function blocP(T) { return [T[0][3], T[1][3], T[2][3]]; }
  function homogInv(T) {
    var Rt = transpose(blocR(T));
    return homog(Rt, scale(matVec(Rt, blocP(T)), -1));
  }
  function appliquer(T, p) { return matVec(T, p.concat([1])).slice(0, 3); }

  // Chaîne plane : repère R_i en bout du segment i-1, tourné de θ_i autour de z.
  // T^{0,1} = rot(θ1) (O0 = O1) ; T^{i-1,i} = rot(θi) translaté de l_{i-1} sur x_{i-1}.
  function chainePlane(thetas, longueurs) {
    var T = [], cumul = identite(4);
    for (var i = 0; i < thetas.length; i++) {
      var Ti = homog(Rz(thetas[i]), [i === 0 ? 0 : longueurs[i - 1], 0, 0]);
      cumul = matMul(cumul, Ti);
      T.push({ local: Ti, cumul: cumul });
    }
    var bout = appliquer(cumul, [longueurs[thetas.length - 1], 0, 0]);
    return { T: T, bout: bout };
  }

  // Bras plan à deux segments (exemple 3-2 du chapitre 2).
  function bras2R(t1, t2, l1, l2) {
    var c = chainePlane([t1, t2], [l1, l2]);
    return { T01: c.T[0].local, T12: c.T[1].local, T02: c.T[1].cumul, M: c.bout, O2: blocP(c.T[1].cumul) };
  }

  function versCylindrique(x, y, z) { return { r: Math.hypot(x, y), theta: Math.atan2(y, x), z: z }; }
  function versCartesien(r, t, z) { return { x: r * Math.cos(t), y: r * Math.sin(t), z: z }; }

  var m = {
    DEG: DEG, matMul: matMul, matVec: matVec, transpose: transpose, det2: det2, det3: det3, identite: identite,
    dot: dot, cross: cross, norme: norme, add: add, sub: sub, scale: scale, colonne: colonne,
    Rx: Rx, Ry: Ry, Rz: Rz, Raxe: Raxe, eulerZYX: eulerZYX, eulerXYZ: eulerXYZ,
    homog: homog, homogInv: homogInv, blocR: blocR, blocP: blocP, appliquer: appliquer,
    chainePlane: chainePlane, bras2R: bras2R, versCylindrique: versCylindrique, versCartesien: versCartesien
  };

  /* ================================================================ */
  /* Mise en forme des nombres (virgule décimale)                       */
  /* ================================================================ */

  function arrondi(x, d) { var k = Math.pow(10, d); var r = Math.round(x * k) / k; return Object.is(r, -0) || Math.abs(r) < 0.5 / k ? 0 : r; }
  // Texte HTML : virgule et vrai signe moins.
  function fmt(x, d) {
    if (d === undefined) d = 3;
    var s = arrondi(x, d).toFixed(d).replace(".", ",");
    return s.charAt(0) === "-" ? "−" + s.slice(1) : s;
  }
  // Nombre pour KaTeX : 0{,}866
  function tn(x, d) {
    if (d === undefined) d = 3;
    return arrondi(x, d).toFixed(d).replace(".", "{,}");
  }
  // Nombre court (sans zéros inutiles) pour KaTeX.
  function tc(x, d) {
    if (d === undefined) d = 3;
    var s = String(arrondi(x, d));
    return s.replace(".", "{,}");
  }
  function couleur(c, s) { return c ? "\\textcolor{" + c + "}{" + s + "}" : s; }
  // Matrice KaTeX. opts.couleursCol : couleur par colonne ; opts.cellule(i,j,txt) : retouche.
  function texMat(M, d, opts) {
    opts = opts || {};
    var lignes = M.map(function (l, i) {
      return l.map(function (v, j) {
        var t = typeof v === "string" ? v : tn(v, d);
        if (opts.cellule) t = opts.cellule(i, j, t);
        else if (opts.couleursCol && opts.couleursCol[j]) t = couleur(opts.couleursCol[j], t);
        return t;
      }).join(" & ");
    });
    return "\\begin{pmatrix}" + lignes.join(" \\\\ ") + "\\end{pmatrix}";
  }
  function texVec(v, d, c) { return texMat(v.map(function (x) { return [x]; }), d, { couleursCol: [c] }); }

  function rendre(el, tex, display) {
    if (!global.katex) { el.textContent = tex; return; }
    global.katex.render(tex, el, { displayMode: display !== false, throwOnError: false, strict: "ignore" });
  }

  /* ================================================================ */
  /* SVG                                                                */
  /* ================================================================ */

  var NS = "http://www.w3.org/2000/svg";
  var C = { x: "#e5484d", y: "#12a26b", z: "#3b5bdb", v: "#8b3fd9", acc: "#ff5a1f", gris: "#9aa0a6", fonce: "#15171f", doux: "#5b6172", trait: "#e3e6ee" };

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function vider(g) { while (g.firstChild) g.removeChild(g.firstChild); }

  var nFleche = 0;
  // Flèche de p0 à p1 (coordonnées écran).
  function fleche(g, p0, p1, o) {
    o = o || {};
    var col = o.couleur || C.fonce, w = o.epaisseur || 2.5;
    var dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy);
    if (L < 0.5) return null;
    var ux = dx / L, uy = dy / L, h = Math.min(o.tete || 13, L * 0.45), lw = h * 0.42;
    var bx = p1[0] - ux * h, by = p1[1] - uy * h;
    var grp = el("g", { opacity: o.opacite }, g);
    el("line", { x1: p0[0], y1: p0[1], x2: bx + ux * 0.5, y2: by + uy * 0.5, stroke: col, "stroke-width": w, "stroke-dasharray": o.tirets, "stroke-linecap": "round" }, grp);
    el("polygon", { points: [p1[0], p1[1], bx - uy * lw, by + ux * lw, bx + uy * lw, by - ux * lw].join(","), fill: col }, grp);
    return grp;
  }
  function ligne(g, p0, p1, o) {
    o = o || {};
    return el("line", { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: o.couleur || C.fonce, "stroke-width": o.epaisseur || 1.5, "stroke-dasharray": o.tirets, opacity: o.opacite, "stroke-linecap": "round" }, g);
  }
  function point(g, p, o) {
    o = o || {};
    return el("circle", { cx: p[0], cy: p[1], r: o.r || 5, fill: o.couleur || C.fonce, stroke: o.contour, "stroke-width": o.contour ? 2 : undefined }, g);
  }
  // Texte avec indice et exposant : texte(g, "x", p, {ind: "0"}).
  function texte(g, s, p, o) {
    o = o || {};
    var t = el("text", {
      x: p[0], y: p[1], fill: o.couleur || C.fonce, "font-size": o.taille || 20,
      "text-anchor": o.ancre || "middle", "dominant-baseline": "middle",
      "font-style": o.italique === false ? "normal" : "italic", "font-weight": o.gras ? 600 : undefined,
      opacity: o.opacite
    }, g);
    t.appendChild(document.createTextNode(s));
    if (o.ind !== undefined) {
      var ts = el("tspan", { "baseline-shift": "sub", "font-size": "72%", "font-style": "normal" }, t);
      ts.appendChild(document.createTextNode(o.ind));
    }
    if (o.exp !== undefined) {
      var te = el("tspan", { "baseline-shift": "super", "font-size": "68%", "font-style": "normal" }, t);
      te.appendChild(document.createTextNode(o.exp));
    }
    if (o.fond) {
      // fond blanc pour la lisibilité
      try {
        var b = t.getBBox();
        var r = el("rect", { x: b.x - 3, y: b.y - 1, width: b.width + 6, height: b.height + 2, fill: "#fff", opacity: 0.85, rx: 3 });
        g.insertBefore(r, t);
      } catch (e) { /* getBBox indisponible hors affichage */ }
    }
    return t;
  }
  // Arc d'angle entre les directions a0 et a1 (radians, sens trigo, repère écran y vers le bas).
  function arc(g, c, r, a0, a1, o) {
    o = o || {};
    var n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.08)), pts = [];
    for (var i = 0; i <= n; i++) { var a = a0 + (a1 - a0) * i / n; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); }
    return el("polyline", { points: pts.map(function (q) { return q.join(","); }).join(" "), fill: "none", stroke: o.couleur || C.fonce, "stroke-width": o.epaisseur || 1.5 }, g);
  }
  function polygone(g, pts, o) {
    o = o || {};
    return el("polygon", { points: pts.map(function (q) { return q.join(","); }).join(" "), fill: o.remplissage || "none", stroke: o.couleur, "stroke-width": o.epaisseur, opacity: o.opacite, "stroke-linejoin": "round" }, g);
  }

  // Repère plan : coordonnées monde (y vers le haut) -> écran.
  function plan(ox, oy, s) {
    return {
      ox: ox, oy: oy, s: s,
      p: function (v) { return [ox + s * v[0], oy - s * v[1]]; },
      inv: function (q) { return [(q[0] - ox) / s, (oy - q[1]) / s]; }
    };
  }

  // Dessine un repère plan (origine o, axes ex, ey en coordonnées monde).
  function repere2D(g, P, o, ex, ey, opt) {
    opt = opt || {};
    var L = opt.longueur || 1, c0 = P.p(o);
    var cx = opt.couleurX || C.x, cy = opt.couleurY || C.y;
    fleche(g, c0, P.p(add(o, scale(ex, L))), { couleur: cx, epaisseur: opt.epaisseur || 2.5, tirets: opt.tirets, opacite: opt.opacite });
    fleche(g, c0, P.p(add(o, scale(ey, L))), { couleur: cy, epaisseur: opt.epaisseur || 2.5, tirets: opt.tirets, opacite: opt.opacite });
    if (opt.noms !== false) {
      var ind = opt.indice === undefined ? "" : opt.indice;
      texte(g, opt.nomX || "x", P.p(add(o, scale(ex, L + 0.16 * (opt.ecartNom || 1)))), { couleur: cx, ind: ind, opacite: opt.opacite });
      texte(g, opt.nomY || "y", P.p(add(o, scale(ey, L + 0.16 * (opt.ecartNom || 1)))), { couleur: cy, ind: ind, opacite: opt.opacite });
    }
    if (opt.origine !== false) {
      el("circle", { cx: c0[0], cy: c0[1], r: 7, fill: "#fff", stroke: C.fonce, "stroke-width": 1.5, opacity: opt.opacite }, g);
      el("circle", { cx: c0[0], cy: c0[1], r: 2, fill: C.fonce, opacity: opt.opacite }, g);
    }
  }

  // Coordonnées d'un événement pointeur dans le repère du viewBox.
  function coordSVG(svg, ev) {
    var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    var q = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [q.x, q.y];
  }

  // Poignée déplaçable (cercle visible + zone de saisie élargie).
  function poignee(svg, g, p, onDeplace, o) {
    o = o || {};
    var grp = el("g", { "class": "poignee" }, g);
    el("circle", { cx: p[0], cy: p[1], r: 24, fill: "transparent" }, grp);
    el("circle", { cx: p[0], cy: p[1], r: o.r || 9, fill: o.couleur || C.acc, stroke: "#fff", "stroke-width": 2.5 }, grp);
    // Les écouteurs sont posés sur la fenêtre : la figure est redessinée pendant le glissement,
    // donc la poignée d'origine disparaît du document.
    grp.addEventListener("pointerdown", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var id = ev.pointerId;
      var bouge = function (e) { if (e.pointerId === id) { e.preventDefault(); onDeplace(coordSVG(svg, e)); } };
      var fin = function (e) {
        if (e.pointerId !== id) return;
        window.removeEventListener("pointermove", bouge); window.removeEventListener("pointerup", fin); window.removeEventListener("pointercancel", fin);
      };
      window.addEventListener("pointermove", bouge, { passive: false });
      window.addEventListener("pointerup", fin);
      window.addEventListener("pointercancel", fin);
    });
    return grp;
  }

  /* ================================================================ */
  /* Vue 3D (projection orthographique, axe z vers le haut)             */
  /* ================================================================ */

  function vue3D(cx, cy, echelle, az, elev) {
    var v = { cx: cx, cy: cy, s: echelle, az: az === undefined ? -55 * DEG : az, el: elev === undefined ? 22 * DEG : elev };
    v.p = function (q) {
      var ca = Math.cos(v.az), sa = Math.sin(v.az), ce = Math.cos(v.el), se = Math.sin(v.el);
      var x1 = ca * q[0] - sa * q[1], y1 = sa * q[0] + ca * q[1];
      var haut = -se * y1 + ce * q[2];
      return [v.cx + v.s * x1, v.cy - v.s * haut];
    };
    v.profondeur = function (q) {
      var ca = Math.cos(v.az), sa = Math.sin(v.az), ce = Math.cos(v.el), se = Math.sin(v.el);
      var y1 = sa * q[0] + ca * q[1];
      return ce * y1 + se * q[2];
    };
    return v;
  }

  // Repère 3D : colonnes de R comme axes, origine o.
  function repere3D(g, V, o, R, opt) {
    opt = opt || {};
    var L = opt.longueur || 1, c0 = V.p(o), noms = opt.noms || ["x", "y", "z"], cols = opt.couleurs || [C.x, C.y, C.z];
    for (var j = 0; j < 3; j++) {
      var a = colonne(R, j);
      fleche(g, c0, V.p(add(o, scale(a, L))), { couleur: cols[j], epaisseur: opt.epaisseur || 2.6, tirets: opt.tirets, opacite: opt.opacite });
      if (noms[j]) texte(g, noms[j], V.p(add(o, scale(a, L * 1.13 + 0.06))), { couleur: cols[j], ind: opt.indice, opacite: opt.opacite, taille: opt.taille });
    }
    if (opt.origine !== false) el("circle", { cx: c0[0], cy: c0[1], r: 3.5, fill: C.fonce, opacity: opt.opacite }, g);
  }

  // Pavé centré en c, demi-dimensions d, orienté par R. Faces remplies, triées par profondeur.
  function pave(g, V, c, d, R, o) {
    o = o || {};
    var s = [-1, 1], P = [];
    s.forEach(function (i) { s.forEach(function (j) { s.forEach(function (k) {
      P.push(add(c, matVec(R, [i * d[0], j * d[1], k * d[2]])));
    }); }); });
    // indices : 0(---) 1(--+) 2(-+-) 3(-++) 4(+--) 5(+-+) 6(++-) 7(+++)
    var faces = [
      { idx: [0, 1, 3, 2], n: [-1, 0, 0] }, { idx: [4, 6, 7, 5], n: [1, 0, 0] },
      { idx: [0, 4, 5, 1], n: [0, -1, 0] }, { idx: [2, 3, 7, 6], n: [0, 1, 0] },
      { idx: [0, 2, 6, 4], n: [0, 0, -1] }, { idx: [1, 5, 7, 3], n: [0, 0, 1] }
    ];
    var couleurs = o.faces || ["#f3d4d4", "#f3d4d4", "#d6ead7", "#d6ead7", "#d4e2f3", "#d4e2f3"];
    faces.forEach(function (f, i) {
      f.prof = f.idx.reduce(function (a, k) { return a + V.profondeur(P[k]); }, 0) / 4;
      f.coul = couleurs[i];
    });
    faces.sort(function (a, b) { return b.prof - a.prof; });
    faces.forEach(function (f) {
      polygone(g, f.idx.map(function (k) { return V.p(P[k]); }), { remplissage: f.coul, couleur: "#7c8594", epaisseur: 1, opacite: o.opacite === undefined ? 0.92 : o.opacite });
    });
  }

  // Rotation de la vue à la souris ; au doigt seulement si la bascule est cochée.
  function orbite(svg, V, redessiner, bascule) {
    var maj = function () { svg.style.touchAction = bascule && bascule.checked ? "none" : "pan-y"; };
    if (bascule) bascule.addEventListener("change", maj);
    maj();
    var dernier = null;
    svg.addEventListener("pointerdown", function (ev) {
      if (ev.target.closest && ev.target.closest(".poignee")) return;
      if (ev.pointerType === "touch" && !(bascule && bascule.checked)) return;
      dernier = coordSVG(svg, ev);
      svg.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    svg.addEventListener("pointermove", function (ev) {
      if (!dernier) return;
      var q = coordSVG(svg, ev);
      V.az -= (q[0] - dernier[0]) * 0.008;
      V.el = Math.max(-1.3, Math.min(1.3, V.el + (q[1] - dernier[1]) * 0.008));
      dernier = q;
      redessiner();
    });
    var fin = function () { dernier = null; };
    svg.addEventListener("pointerup", fin);
    svg.addEventListener("pointercancel", fin);
  }

  /* ================================================================ */
  /* Commandes                                                          */
  /* ================================================================ */

  function h(tag, attrs, html, parent) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
    if (html !== undefined) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }

  // Monte une figure dans <div class="fig" id="..."> : renvoie {svg, reglages, direct, essai}.
  function figure(id, o) {
    var racine = typeof id === "string" ? document.getElementById(id) : id;
    if (!racine) return null;
    racine.classList.add("fig");
    var svgs = [];
    (o.dessins || [{ l: o.largeur || 600, h: o.hauteur || 420, titre: o.titre }]).forEach(function (d) {
      var s = el("svg", { "class": "dessin", viewBox: "0 0 " + d.l + " " + d.h, role: "img", "aria-label": d.titre || o.titre || "Figure interactive" });
      racine.appendChild(s);
      svgs.push(s);
    });
    var reglages = h("div", { "class": "reglages" }, undefined, racine);
    var direct = h("div", { "class": "direct", "aria-live": "polite" }, undefined, racine);
    var essai = h("p", { "class": "essai" }, o.essai || "", racine);
    if (!o.essai) essai.style.display = "none";
    if (o.direct === false) direct.style.display = "none";
    return { racine: racine, svg: svgs[0], svgs: svgs, reglages: reglages, direct: direct, essai: essai };
  }

  function curseur(parent, o) {
    var lab = h("label", { "class": "curseur" }, undefined, parent);
    h("span", null, o.nom, lab);
    var inp = h("input", { type: "range", min: o.min, max: o.max, step: o.pas, value: o.val }, undefined, lab);
    var out = h("output", null, undefined, lab);
    var dec = o.dec !== undefined ? o.dec : (o.pas < 1 ? (o.pas < 0.1 ? 2 : 1) : 0);
    var ecouteurs = [];
    function affiche() { out.textContent = fmt(parseFloat(inp.value), dec) + (o.unite || ""); }
    inp.addEventListener("input", function () { affiche(); if (o.surChange) o.surChange(); ecouteurs.forEach(function (f) { f(); }); });
    affiche();
    return {
      get v() { return parseFloat(inp.value); },
      set: function (x) { inp.value = x; affiche(); },
      input: inp,
      surChange: function (f) { ecouteurs.push(f); }
    };
  }

  function boutons(parent) { return h("div", { "class": "boutons" }, undefined, parent); }
  function bouton(parent, txt, f) { var b = h("button", { type: "button" }, txt, parent); b.addEventListener("click", f); return b; }
  function bascule(parent, txt, coche, f) {
    var lab = h("label", { "class": "bascule" }, undefined, parent);
    var inp = h("input", { type: "checkbox" }, undefined, lab);
    inp.checked = !!coche;
    h("span", null, txt, lab);
    if (f) inp.addEventListener("change", f);
    return inp;
  }
  function choix(parent, options, f) {
    var s = h("select", null, options.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join(""), parent);
    if (f) s.addEventListener("change", f);
    return s;
  }
  // Bascule « faire tourner la vue au doigt » pour les vues 3D.
  function basculeOrbite(parent) {
    return bascule(parent, "Faire tourner la vue au doigt", false);
  }

  // Navigation pas à pas : n étapes (0 = départ).
  function etapes(parent, n, noms, surChange) {
    var b = boutons(parent);
    var prec = bouton(b, "Étape précédente", function () { aller(k - 1); });
    var suiv = bouton(b, "Étape suivante", function () { aller(k + 1); });
    bouton(b, "Recommencer", function () { aller(0); });
    var txt = h("span", { "class": "etape-texte" }, "", b);
    var k = 0;
    function aller(i) {
      k = Math.max(0, Math.min(n, i));
      prec.disabled = k === 0; suiv.disabled = k === n;
      txt.textContent = "Étape " + k + " sur " + n + (noms[k] ? " : " + noms[k] : "");
      surChange(k);
    }
    return { aller: aller, get k() { return k; } };
  }

  // Petite animation d'une valeur (pour rendre une étape visible).
  function animer(duree, f, fin) {
    var t0 = null;
    function pas(t) {
      if (t0 === null) t0 = t;
      var u = Math.min(1, (t - t0) / duree);
      f(u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
      if (u < 1) requestAnimationFrame(pas); else if (fin) fin();
    }
    requestAnimationFrame(pas);
  }

  // Rendu KaTeX du texte statique de la page.
  function rendrePage() {
    if (global.renderMathInElement) {
      global.renderMathInElement(document.body, {
        delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
        throwOnError: false, strict: "ignore",
        ignoredClasses: ["direct"]
      });
    }
  }

  var RM = {
    m: m, DEG: DEG, C: C, fmt: fmt, tn: tn, tc: tc, texMat: texMat, texVec: texVec, couleur: couleur, rendre: rendre,
    el: el, vider: vider, fleche: fleche, ligne: ligne, point: point, texte: texte, arc: arc, polygone: polygone,
    plan: plan, repere2D: repere2D, coordSVG: coordSVG, poignee: poignee,
    vue3D: vue3D, repere3D: repere3D, pave: pave, orbite: orbite,
    h: h, figure: figure, curseur: curseur, boutons: boutons, bouton: bouton, bascule: bascule, choix: choix,
    basculeOrbite: basculeOrbite, etapes: etapes, animer: animer, rendrePage: rendrePage
  };
  if (typeof module !== "undefined" && module.exports) module.exports = RM;
  global.RM = RM;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", rendrePage);
    else rendrePage();
  }
})(typeof window !== "undefined" ? window : globalThis);
