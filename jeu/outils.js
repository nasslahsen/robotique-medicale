/*
 * Outils partagés par le jeu et ses niveaux.
 * Maths, nombres à la française, SVG, glisser au doigt ou au stylet, KaTeX.
 */
window.E = (function () {
  "use strict";
  var DEG = Math.PI / 180;
  var NS = "http://www.w3.org/2000/svg";

  // Maths
  function Rz(a) { var c = Math.cos(a), s = Math.sin(a); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; }
  function mv(M, v) { return M.map(function (r) { return r[0] * v[0] + r[1] * v[1] + r[2] * v[2]; }); }
  function col(M, j) { return [M[0][j], M[1][j], M[2][j]]; }
  function angle360(a) { return ((a % 360) + 540) % 360 - 180; } // ramène dans ]-180 ; 180]
  function ecartAngle(a, b) { return Math.abs(angle360(a - b)); }

  // Nombres : texte (signe moins typographique) et KaTeX (virgule décimale)
  function zero(x, d) { return Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x; }
  function fmt(x, d) { d = d === undefined ? 2 : d; return zero(x, d).toFixed(d).replace(".", ",").replace("-", "−"); }
  function tn(x, d) { d = d === undefined ? 3 : d; return zero(x, d).toFixed(d).replace(".", "{,}"); }
  // version courte : enlève les zéros inutiles (0,500 -> 0,5 ; 1,000 -> 1)
  function tc(x, d) {
    d = d === undefined ? 3 : d;
    var s = zero(x, d).toFixed(d);
    if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    if (s === "-0") s = "0";
    return s.replace(".", "{,}");
  }
  function texMat(M, f, couleurs) {
    f = f || function (x) { return tc(x); };
    return "\\begin{pmatrix}" + M.map(function (r) {
      return r.map(function (x, j) { var t = f(x); return couleurs && couleurs[j] ? "\\color{" + couleurs[j] + "}{" + t + "}" : t; }).join(" & ");
    }).join(" \\\\ ") + "\\end{pmatrix}";
  }
  function texVec(v, f, couleur) {
    f = f || function (x) { return tc(x); };
    var c = "\\begin{pmatrix}" + v.map(f).join(" \\\\ ") + "\\end{pmatrix}";
    return couleur ? "\\color{" + couleur + "}{" + c + "}" : c;
  }

  // KaTeX
  function k(el, tex, bloc) { katex.render(tex, el, { displayMode: !!bloc, throwOnError: false, strict: "ignore" }); }
  function rendre(racine) {
    renderMathInElement(racine || document.body, {
      delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
      throwOnError: false, strict: "ignore"
    });
  }

  // SVG
  function s(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var a in attrs || {}) if (attrs[a] !== undefined && attrs[a] !== null) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function vider(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function point(svg, ev) {
    var p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
    var q = p.matrixTransform(svg.getScreenCTM().inverse());
    return [q.x, q.y];
  }
  // Glisser : un seul pointeur, doigt ou stylet. surDebut peut renvoyer false pour ignorer.
  function glisser(cible, svg, surBouge, surFin, surDebut) {
    cible.addEventListener("pointerdown", function (ev) {
      if (surDebut && surDebut(point(svg, ev), ev) === false) return;
      ev.preventDefault();
      var id = ev.pointerId;
      try { cible.setPointerCapture(id); } catch (e) { /* rien */ }
      surBouge(point(svg, ev), ev);
      function bouge(e) { if (e.pointerId === id) { e.preventDefault(); surBouge(point(svg, e), e); } }
      function fin(e) {
        if (e.pointerId !== id) return;
        cible.removeEventListener("pointermove", bouge); cible.removeEventListener("pointerup", fin); cible.removeEventListener("pointercancel", fin);
        if (surFin) surFin(point(svg, e), e);
      }
      cible.addEventListener("pointermove", bouge);
      cible.addEventListener("pointerup", fin);
      cible.addEventListener("pointercancel", fin);
    });
  }

  // Animation d'une valeur (ease in-out)
  function anime(duree, surPas, surFin) {
    var t0 = null;
    function f(t) {
      if (t0 === null) t0 = t;
      var u = Math.min(1, (t - t0) / duree), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      surPas(e);
      if (u < 1) requestAnimationFrame(f); else if (surFin) surFin();
    }
    requestAnimationFrame(f);
  }
  function h(tag, cls, html, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined && html !== null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }

  return {
    DEG: DEG, Rz: Rz, mv: mv, col: col, angle360: angle360, ecartAngle: ecartAngle,
    fmt: fmt, tn: tn, tc: tc, texMat: texMat, texVec: texVec, k: k, rendre: rendre,
    s: s, vider: vider, point: point, glisser: glisser, anime: anime, h: h
  };
})();
