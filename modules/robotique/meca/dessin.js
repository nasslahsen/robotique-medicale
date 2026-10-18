/*
 * Dessins techniques du sous-module « Éléments mécaniques » : hachures de coupe, engrenages à développante,
 * couronne, crémaillère, demi-coupes de roulements, ressorts, vis, arbres, traits d'axe.
 * Chargé par jouer.html et par les pages de cours du sous-module, avant les figures (window.MECA).
 * Tout est en SVG, coordonnées écran (y vers le bas). Aucune couleur d'accent écrite en dur : elle est passée en option.
 */
window.MECA = (function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg", nPat = 0;
  var GRIS = { trait: "#15171f", piece: "#eef0f5", fonce: "#9aa0ad", moyen: "#c6cbd8", clair: "#f6f7fa", acier: "#dfe3ea" };

  function el(tag, a, p) {
    var e = document.createElementNS(NS, tag);
    for (var k in a || {}) if (a[k] !== undefined && a[k] !== null) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }
  function svgDe(g) { return g.ownerSVGElement || g; }
  function f1(x) { return (Math.round(x * 10) / 10).toString(); }
  function pts(l) { return l.map(function (p) { return f1(p[0]) + "," + f1(p[1]); }).join(" "); }

  // Motif de hachures (coupe) : renvoie "url(#...)". Un motif par couleur et par dessin.
  function hachures(g, coul, o) {
    o = o || {};
    var svg = svgDe(g), cle = "h-" + (coul || "#5b6172") + "-" + (o.pas || 9) + "-" + (o.angle || 45) + "-" + (o.fond || "none");
    svg.__motifs = svg.__motifs || {};
    if (svg.__motifs[cle]) return "url(#" + svg.__motifs[cle] + ")";
    var defs = svg.querySelector("defs") || el("defs", null, svg);
    if (defs.parentNode !== svg || svg.firstChild !== defs) svg.insertBefore(defs, svg.firstChild);
    var id = "meca-h" + (++nPat), pas = o.pas || 9;
    var p = el("pattern", { id: id, patternUnits: "userSpaceOnUse", width: pas, height: pas, patternTransform: "rotate(" + (o.angle || 45) + ")" }, defs);
    if (o.fond) el("rect", { x: 0, y: 0, width: pas, height: pas, fill: o.fond }, p);
    el("line", { x1: 0, y1: 0, x2: 0, y2: pas, stroke: coul || "#5b6172", "stroke-width": o.ep || 1.6 }, p);
    svg.__motifs[cle] = id;
    return "url(#" + id + ")";
  }

  // Trait d'axe (mixte) entre a et b
  function traitAxe(g, a, b, o) {
    o = o || {};
    return el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: o.coul || "#5b6172", "stroke-width": o.ep || 1.6, "stroke-dasharray": "18 5 3 5" }, g);
  }

  // Rectangle de pièce en coupe (hachuré) ou en vue (plein)
  function piece(g, x, y, w, h, o) {
    o = o || {};
    var fill = o.coupe === false ? (o.fond || GRIS.piece) : hachures(g, o.hach || "#5b6172", { fond: o.fond || "#fff", angle: o.angle, pas: o.pas });
    return el("rect", { x: x, y: y, width: w, height: h, rx: o.rx || 0, fill: fill, stroke: o.trait || GRIS.trait, "stroke-width": o.ep || 2, opacity: o.op }, g);
  }

  /* ---------- Engrenages ---------- */
  function inv(a) { return Math.tan(a) - a; }
  // Contour d'une roue dentée extérieure à développante de cercle.
  // c : centre ; o.m : module en pixels ; o.Z : nombre de dents ; o.rot : rotation (rad, sens trigo) ; o.alpha : angle de pression (20°)
  function contourRoue(c, o) {
    var m = o.m, Z = o.Z, al = (o.alpha || 20) * Math.PI / 180, rot = o.rot || 0;
    var rp = m * Z / 2, ra = rp + m, rf = Math.max(rp - 1.25 * m, m * 0.6), rb = rp * Math.cos(al);
    var psiP = Math.PI / (2 * Z) + inv(al);
    function psi(r) { return r <= rb ? psiP : psiP - inv(Math.acos(rb / r)); }
    function P(r, a) { return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]; }
    var r0 = Math.max(rb, rf), N = 7, l = [];
    for (var k = 0; k < Z; k++) {
      var t = rot + k * 2 * Math.PI / Z, i, r;
      // creux avant la dent, flanc montant, sommet, flanc descendant
      l.push(P(rf, t - psi(r0) - 0.35 * Math.PI / Z));
      if (rf < r0) l.push(P(rf, t - psi(r0)));
      for (i = 0; i <= N; i++) { r = r0 + (ra - r0) * i / N; l.push(P(r, t - Math.max(psi(r), 0.02 / Z))); }
      for (i = N; i >= 0; i--) { r = r0 + (ra - r0) * i / N; l.push(P(r, t + Math.max(psi(r), 0.02 / Z))); }
      if (rf < r0) l.push(P(rf, t + psi(r0)));
      l.push(P(rf, t + psi(r0) + 0.35 * Math.PI / Z));
    }
    return { pts: l, rp: rp, ra: ra, rf: rf, rb: rb };
  }
  // Roue dentée : o.fill, o.trait, o.trou (rayon d'alésage, px), o.primitif (cercle primitif en tirets), o.rayons
  function roue(g, c, o) {
    o = o || {};
    var r = contourRoue(c, o), gr = el("g", { opacity: o.op }, g);
    el("polygon", { points: pts(r.pts), fill: o.fill || GRIS.acier, stroke: o.trait || GRIS.trait, "stroke-width": o.ep || 2, "stroke-linejoin": "round" }, gr);
    if (o.toile !== false && r.rf > 40) el("circle", { cx: c[0], cy: c[1], r: r.rf * 0.72, fill: "none", stroke: o.trait || GRIS.trait, "stroke-width": 1.2, opacity: 0.35 }, gr);
    var trou = o.trou === undefined ? Math.max(5, Math.min(r.rf * 0.28, 26)) : o.trou;
    if (trou) el("circle", { cx: c[0], cy: c[1], r: trou, fill: "#fff", stroke: o.trait || GRIS.trait, "stroke-width": 2 }, gr);
    // repère de rotation : un petit trait sur la toile, pour voir tourner la roue
    if (o.repere !== false) {
      var a = o.rot || 0, q0 = [c[0] + (trou + 3) * Math.cos(a), c[1] - (trou + 3) * Math.sin(a)], q1 = [c[0] + r.rf * 0.62 * Math.cos(a), c[1] - r.rf * 0.62 * Math.sin(a)];
      el("line", { x1: q0[0], y1: q0[1], x2: q1[0], y2: q1[1], stroke: o.repereCoul || GRIS.trait, "stroke-width": 4, "stroke-linecap": "round" }, gr);
    }
    if (o.primitif) el("circle", { cx: c[0], cy: c[1], r: r.rp, fill: "none", stroke: o.primitif, "stroke-width": 2, "stroke-dasharray": "8 5" }, gr);
    r.g = gr;
    return r;
  }
  // Couronne (denture intérieure) : anneau dont les dents pointent vers le centre.
  function couronne(g, c, o) {
    o = o || {};
    var m = o.m, Z = o.Z, rot = o.rot || 0, rp = m * Z / 2, ri = rp - m, re = rp + 1.25 * m, ext = o.ext || re + 3 * m, l = [];
    var dp = Math.PI / Z; // demi-pas angulaire
    for (var k = 0; k < Z; k++) {
      var t = rot + k * 2 * Math.PI / Z;
      // creux (au rayon re) centré sur t, dent (au rayon ri) centrée sur t + dp
      l.push([re, t - 0.42 * dp], [re, t + 0.42 * dp], [ri, t + dp - 0.28 * dp], [ri, t + dp + 0.28 * dp]);
    }
    var P = function (q) { return [c[0] + q[0] * Math.cos(q[1]), c[1] - q[0] * Math.sin(q[1])]; };
    var d = "M" + pts([P([ext, 0])]).replace(" ", " L") + " A" + ext + " " + ext + " 0 1 0 " + f1(c[0] - ext) + " " + f1(c[1]) + " A" + ext + " " + ext + " 0 1 0 " + f1(c[0] + ext) + " " + f1(c[1]) + " Z ";
    d += "M" + l.map(P).map(function (p) { return f1(p[0]) + " " + f1(p[1]); }).join(" L") + " Z";
    var gr = el("g", { opacity: o.op }, g);
    el("path", { d: d, "fill-rule": "evenodd", fill: o.fill || GRIS.acier, stroke: o.trait || GRIS.trait, "stroke-width": o.ep || 2, "stroke-linejoin": "round" }, gr);
    if (o.primitif) el("circle", { cx: c[0], cy: c[1], r: rp, fill: "none", stroke: o.primitif, "stroke-width": 2, "stroke-dasharray": "8 5" }, gr);
    return { rp: rp, g: gr };
  }
  // Crémaillère horizontale : ligne primitive à y, dents vers le haut (o.sens = -1 : vers le bas), décalage dx (px)
  function cremaillere(g, x0, x1, y, o) {
    o = o || {};
    var m = o.m, p = Math.PI * m, s = o.sens || 1, dx = o.dx || 0, t = Math.tan(20 * Math.PI / 180), l = [];
    var haut = y - s * m, bas = y + s * 1.25 * m, fond = y + s * (1.25 * m + (o.epaisseur || 2.2 * m));
    var k0 = Math.floor((x0 - dx) / p) - 1, k1 = Math.ceil((x1 - dx) / p) + 1;
    l.push([x0, fond]);
    for (var k = k0; k <= k1; k++) {
      var xc = dx + k * p; // milieu d'une dent
      var demi = p / 4;
      [[xc - demi - 1.25 * m * t, bas], [xc - demi + m * t, haut], [xc + demi - m * t, haut], [xc + demi + 1.25 * m * t, bas]].forEach(function (q) {
        l.push([Math.max(x0, Math.min(x1, q[0])), q[1]]);
      });
    }
    l.push([x1, fond]);
    return el("polygon", { points: pts(l), fill: o.fill || GRIS.acier, stroke: o.trait || GRIS.trait, "stroke-width": o.ep || 2, "stroke-linejoin": "round" }, g);
  }

  /* ---------- Roulements en demi-coupe ----------
     Demi-coupe au-dessus de l'axe : x centre, yb = bord de l'alésage (côté arbre), l largeur, h hauteur radiale.
     o.sens = -1 dessine la demi-coupe symétrique sous l'axe (yb est alors le bord de l'alésage, la coupe descend).
     o.type : "billes" | "oblique" | "rouleaux" | "aiguilles" | "conique" | "rotule" | "butee"
     o.hach : couleur des hachures des bagues ; o.roulant : couleur de l'élément roulant ; o.surligne : partie mise en avant */
  function roulement(g, x, yb, l, h, o) {
    o = o || {};
    var s = o.sens || 1, gr = el("g", { transform: "translate(" + f1(x) + " " + f1(yb) + ") scale(1 " + (s > 0 ? -1 : 1) + ")" }, g);
    var H = hachures(g, o.hach || "#5b6172", { fond: "#fff" }), Hs = o.surligne ? hachures(g, o.surligneCoul || "#3b5bdb", { fond: "#fff" }) : H;
    var bague = Math.max(6, h * 0.3), type = o.type || "billes", tr = o.trait || GRIS.trait, rl = o.roulant || "#dfe3ea";
    var exL = o.surligne === "exterieure", inL = o.surligne === "interieure", elL = o.surligne === "element";
    function rect(xx, yy, w, hh, f) { return el("rect", { x: f1(xx), y: f1(yy), width: f1(w), height: f1(hh), fill: f, stroke: tr, "stroke-width": 2 }, gr); }
    if (type === "butee") {
      // bagues perpendiculaires à l'axe : rondelle arbre (à gauche, contre l'arbre) et rondelle logement (à droite)
      var e = Math.max(6, l * 0.28), rb = Math.min(h * 0.32, (l - 2 * e) * 0.5);
      rect(-l / 2, 0, e, h * 0.78, inL ? Hs : H);
      rect(l / 2 - e, h * 0.22, e, h * 0.78, exL ? Hs : H);
      el("circle", { cx: 0, cy: h / 2, r: f1(rb), fill: elL ? (o.surligneCoul || "#3b5bdb") : rl, stroke: tr, "stroke-width": 2 }, gr);
      return gr;
    }
    rect(-l / 2, 0, l, bague, inL ? Hs : H); // bague intérieure (côté arbre)
    rect(-l / 2, h - bague, l, bague, exL ? Hs : H); // bague extérieure
    var ym = h / 2, re = (h - 2 * bague) / 2 + bague * 0.35, f = elL ? (o.surligneCoul || "#3b5bdb") : rl;
    if (type === "billes" || type === "oblique" || type === "rotule") {
      // chemins : un creux dans chaque bague
      el("circle", { cx: 0, cy: f1(ym), r: f1(re), fill: f, stroke: tr, "stroke-width": 2 }, gr);
      if (type === "oblique") {
        var a = 30 * Math.PI / 180;
        el("line", { x1: f1(-re * 1.9 * Math.sin(a)), y1: f1(ym - re * 1.9 * Math.cos(a)), x2: f1(re * 1.9 * Math.sin(a)), y2: f1(ym + re * 1.9 * Math.cos(a)), stroke: tr, "stroke-width": 1.6, "stroke-dasharray": "6 4" }, gr);
      }
      if (type === "rotule") el("path", { d: "M" + f1(-l / 2) + " " + f1(h - bague) + " Q 0 " + f1(h - bague - re * 0.9) + " " + f1(l / 2) + " " + f1(h - bague), fill: "none", stroke: tr, "stroke-width": 1.6 }, gr);
    } else if (type === "rouleaux" || type === "aiguilles") {
      var rh = type === "aiguilles" ? (h - 2 * bague) * 0.62 : (h - 2 * bague) * 0.86, rw = type === "aiguilles" ? l * 0.78 : Math.min(l * 0.62, rh * 1.2);
      el("rect", { x: f1(-rw / 2), y: f1(ym - rh / 2), width: f1(rw), height: f1(rh), rx: 3, fill: f, stroke: tr, "stroke-width": 2 }, gr);
      el("line", { x1: f1(-rw / 2 + 4), y1: f1(ym), x2: f1(rw / 2 - 4), y2: f1(ym), stroke: tr, "stroke-width": 1, opacity: 0.4 }, gr);
    } else if (type === "conique") {
      var w1 = l * 0.5, hh = (h - 2 * bague) * 0.8, k = hh * 0.22;
      el("polygon", { points: pts([[-w1 / 2, ym - hh / 2 + k], [w1 / 2, ym - hh / 2 - k * 0.2], [w1 / 2, ym + hh / 2 + k * 0.2], [-w1 / 2, ym + hh / 2 - k]]), fill: f, stroke: tr, "stroke-width": 2, transform: "rotate(-14 0 " + f1(ym) + ")" }, gr);
    }
    return gr;
  }
  // Représentation simplifiée (carré et croix) d'un roulement : x, y centre, c côté
  function roulementSimplifie(g, x, y, c, o) {
    o = o || {};
    var gr = el("g", null, g), tr = o.trait || GRIS.trait;
    el("rect", { x: x - c / 2, y: y - c / 2, width: c, height: c, fill: o.fond || "#fff", stroke: tr, "stroke-width": 2 }, gr);
    var t = o.type || "billes", d = c * 0.32;
    if (t === "oblique") el("line", { x1: x - d, y1: y + d * 0.6, x2: x + d, y2: y - d * 0.6, stroke: tr, "stroke-width": 2.4 }, gr);
    else { el("line", { x1: x - d, y1: y, x2: x + d, y2: y, stroke: tr, "stroke-width": 2.4 }, gr); el("line", { x1: x, y1: y - d, x2: x, y2: y + d, stroke: tr, "stroke-width": 2.4 }, gr); }
    return gr;
  }

  /* ---------- Ressort, vis, arbre ---------- */
  // Ressort hélicoïdal vu de côté entre a et b (écran) ; o.spires, o.rayon (px), o.ep, o.coul, o.crochets (traction)
  function ressort(g, a, b, o) {
    o = o || {};
    var n = o.spires || 8, r = o.rayon || 22, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, u = [dx / L, dy / L], v = [-u[1], u[0]];
    var gr = el("g", null, g), coul = o.coul || "#5b6172", ep = o.ep || 4;
    var debut = o.crochets ? r * 1.4 : 0, fin = o.crochets ? L - r * 1.4 : L, pas = (fin - debut) / n;
    function P(t, w) { return [a[0] + u[0] * t + v[0] * w, a[1] + u[1] * t + v[1] * w]; }
    var arriere = [], avant = [];
    for (var k = 0; k < n; k++) {
      var t0 = debut + k * pas;
      arriere.push([P(t0, -r), P(t0 + pas * 0.5, r)]);
      avant.push([P(t0 + pas * 0.5, r), P(t0 + pas, -r)]);
    }
    arriere.forEach(function (s) { el("line", { x1: f1(s[0][0]), y1: f1(s[0][1]), x2: f1(s[1][0]), y2: f1(s[1][1]), stroke: coul, "stroke-width": ep, "stroke-linecap": "round", opacity: 0.45 }, gr); });
    avant.forEach(function (s) { el("line", { x1: f1(s[0][0]), y1: f1(s[0][1]), x2: f1(s[1][0]), y2: f1(s[1][1]), stroke: coul, "stroke-width": ep, "stroke-linecap": "round" }, gr); });
    if (o.crochets) {
      [[a, 1], [b, -1]].forEach(function (q) {
        var base = q[1] > 0 ? P(debut, -r) : P(fin, -r), bout = q[0];
        el("path", { d: "M" + f1(base[0]) + " " + f1(base[1]) + " Q " + f1(bout[0] + v[0] * r * 1.2) + " " + f1(bout[1] + v[1] * r * 1.2) + " " + f1(bout[0]) + " " + f1(bout[1]), fill: "none", stroke: coul, "stroke-width": ep, "stroke-linecap": "round" }, gr);
      });
    } else {
      // spires d'extrémité rapprochées (bases dressées)
      [[0, 1], [L, -1]].forEach(function (q) { var p0 = P(q[0], -r), p1 = P(q[0], r); el("line", { x1: f1(p0[0]), y1: f1(p0[1]), x2: f1(p1[0]), y2: f1(p1[1]), stroke: coul, "stroke-width": ep, "stroke-linecap": "round" }, gr); });
    }
    return gr;
  }
  // Vis à tête hexagonale vue de côté, axe vertical : x, yTete (dessus de la tête), d (diamètre, px), L (longueur sous tête, px)
  function vis(g, x, yTete, d, L, o) {
    o = o || {};
    var gr = el("g", null, g), tr = o.trait || GRIS.trait, f = o.fill || GRIS.acier, ht = d * 0.7, lt = d * 1.7;
    el("rect", { x: x - lt / 2, y: yTete, width: lt, height: ht, rx: 2, fill: f, stroke: tr, "stroke-width": 2 }, gr);
    el("line", { x1: x - lt / 6, y1: yTete, x2: x - lt / 6, y2: yTete + ht, stroke: tr, "stroke-width": 1.2 }, gr);
    el("line", { x1: x + lt / 6, y1: yTete, x2: x + lt / 6, y2: yTete + ht, stroke: tr, "stroke-width": 1.2 }, gr);
    el("rect", { x: x - d / 2, y: yTete + ht, width: d, height: L, fill: f, stroke: tr, "stroke-width": 2 }, gr);
    var filet = o.filet === undefined ? L * 0.6 : o.filet;
    for (var yy = yTete + ht + L - filet; yy < yTete + ht + L - 2; yy += Math.max(4, d * 0.18)) el("line", { x1: x - d / 2, y1: yy, x2: x + d / 2, y2: yy + d * 0.12, stroke: tr, "stroke-width": 1.1, opacity: 0.7 }, gr);
    return gr;
  }
  // Arbre vu de côté (non coupé) : de x0 à x1, axe à yc, rayon r (px) ; o.epaulements [{x, r}] optionnels
  function arbre(g, x0, x1, yc, r, o) {
    o = o || {};
    var gr = el("g", null, g);
    el("rect", { x: x0, y: yc - r, width: x1 - x0, height: 2 * r, fill: o.fill || "#e8edf5", stroke: o.trait || GRIS.trait, "stroke-width": 2 }, gr);
    if (o.axe !== false) traitAxe(gr, [x0 - 20, yc], [x1 + 20, yc]);
    return gr;
  }

  return { GRIS: GRIS, el: el, hachures: hachures, traitAxe: traitAxe, piece: piece, contourRoue: contourRoue, roue: roue, couronne: couronne, cremaillere: cremaillere, roulement: roulement, roulementSimplifie: roulementSimplifie, ressort: ressort, vis: vis, arbre: arbre };
})();
