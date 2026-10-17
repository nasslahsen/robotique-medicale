/*
 * Dessins propres au module Systèmes embarqués : blocs de schéma, bus, registres de bits, chronogrammes.
 * Chargé par jouer.html (après commun/jeu/dessin.js) et par les pages de cours (après commun/js/lib.js).
 * Tout est en SVG ; l'accent suit la couleur du module (PLATEFORME), jamais écrite en dur.
 */
window.EMB = (function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var P = window.PLATEFORME;
  var C = {
    encre: "#15171f", doux: "#5b6172", gris: "#9aa0ad", pale: "#e3e6ee", fond: "#f6f7fb",
    bleu: "#3b5bdb", ok: "#12a26b", ko: "#e5484d", v: "#8b3fd9", x: "#e5484d", y: "#12a26b", z: "#3b5bdb",
    acc: P ? P.couleur() : "#337EA9", clair: P ? P.clair() : "#D3E5EF"
  };
  function teinte(a) { return P ? P.teinte(a) : "rgba(51,126,169," + a + ")"; }

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs || {}) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function vider(g) { while (g.firstChild) g.removeChild(g.firstChild); }

  // Texte non italique, halo blanc ; « \n » coupe en plusieurs lignes centrées verticalement.
  function texte(g, t, p, o) {
    o = o || {};
    var lignes = String(t).split("\n"), taille = o.taille || 18, ecart = taille * 1.18;
    var e = el("text", {
      x: p[0], y: p[1] - (lignes.length - 1) * ecart / 2, fill: o.coul || C.encre, "font-size": taille,
      "font-weight": o.gras === false ? 500 : o.gras === "fin" ? 400 : 700, "text-anchor": o.ancre || "middle",
      "dominant-baseline": "middle", opacity: o.op,
      "font-family": o.mono ? "JetBrains Mono, monospace" : "Inter, sans-serif", "font-style": o.italique ? "italic" : "normal"
    }, g);
    lignes.forEach(function (l, i) {
      var ts = el("tspan", { x: p[0], dy: i ? ecart : 0 }, e);
      ts.textContent = l;
    });
    if (o.halo !== false) { e.setAttribute("paint-order", "stroke"); e.setAttribute("stroke", o.haloCoul || "#fff"); e.setAttribute("stroke-width", o.haloEp || 5); e.setAttribute("stroke-linejoin", "round"); }
    return e;
  }

  // Bloc de schéma : rectangle arrondi et étiquette centrée. o.actif : contour et fond à la couleur du module.
  function bloc(g, x, y, w, h, label, o) {
    o = o || {};
    var gr = el("g", { "data-id": o.id }, g);
    var fill = o.fill || (o.actif ? C.clair : "#fff"), stroke = o.stroke || (o.actif ? C.acc : C.encre);
    el("rect", { x: x, y: y, width: w, height: h, rx: o.rx === undefined ? 10 : o.rx, fill: fill, stroke: stroke, "stroke-width": o.ep || (o.actif ? 3.5 : 2.2), "stroke-dasharray": o.tirets, opacity: o.op }, gr);
    if (label) texte(gr, label, [x + w / 2, y + h / 2 + (o.dy || 0)], { taille: o.taille || 17, coul: o.coul || C.encre, gras: o.gras, mono: o.mono, halo: false, op: o.op });
    return gr;
  }

  // Flèche simple (ou double) entre deux points écran.
  function fleche(g, a, b, o) {
    o = o || {};
    var coul = o.coul || C.encre, ep = o.ep || 2.5, d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]);
    if (l < 2) return null;
    var u = [d[0] / l, d[1] / l], t = o.tete || 8 + ep * 1.6, w = t * 0.55;
    var gr = el("g", { opacity: o.op }, g);
    var a2 = o.double ? [a[0] + u[0] * t, a[1] + u[1] * t] : a, b2 = [b[0] - u[0] * t, b[1] - u[1] * t];
    el("line", { x1: a2[0], y1: a2[1], x2: b2[0], y2: b2[1], stroke: coul, "stroke-width": ep, "stroke-dasharray": o.tirets, "stroke-linecap": "butt" }, gr);
    function tete(p, s) {
      var c = [p[0] - s * u[0] * t, p[1] - s * u[1] * t];
      el("polygon", { points: [p, [c[0] - u[1] * w, c[1] + u[0] * w], [c[0] + u[1] * w, c[1] - u[0] * w]].map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "), fill: coul }, gr);
    }
    tete(b, 1); if (o.double) tete(a, -1);
    return gr;
  }

  // Bus : large flèche double, comme sur les schémas du cours.
  function bus(g, a, b, o) {
    o = o || {};
    var coul = o.coul || C.bleu, L = o.larg || 14, d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]);
    var u = [d[0] / l, d[1] / l], n = [-u[1], u[0]], t = o.tete || L * 1.3, W = L * 1.05;
    function q(p, s, k) { return [p[0] + u[0] * s + n[0] * k, p[1] + u[1] * s + n[1] * k]; }
    var pts = [a, q(a, t, W), q(a, t, L / 2), q(b, -t, L / 2), q(b, -t, W), b, q(b, -t, -W), q(b, -t, -L / 2), q(a, t, -L / 2), q(a, t, -W)];
    return el("polygon", { points: pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: coul, opacity: o.op, stroke: o.contour, "stroke-width": o.contour ? 1.5 : null }, g);
  }

  // Registre : une case par bit, le premier élément de « bits » est à gauche (MSB si o.indices décroît).
  // o.w, o.h : taille d'une case ; o.indices : tableau de numéros affichés au-dessus ; o.marques : {k: couleur}.
  function bits(g, x, y, valeurs, o) {
    o = o || {};
    var w = o.w || 40, h = o.h || 46, gr = el("g", null, g), marques = o.marques || {};
    valeurs.forEach(function (b, k) {
      var c = marques[k];
      el("rect", { x: x + k * w, y: y, width: w, height: h, fill: c ? c : (o.fill || "#fff"), stroke: C.encre, "stroke-width": 2 }, gr);
      if (b !== null && b !== undefined && b !== "") texte(gr, String(b), [x + k * w + w / 2, y + h / 2 + 1], { taille: o.taille || 22, mono: true, coul: c && o.texteBlanc ? "#fff" : (o.coul || C.encre), halo: false });
      if (o.indices) texte(gr, String(o.indices[k]), [x + k * w + w / 2, y - 13], { taille: 13, mono: true, coul: C.doux, gras: false, halo: false });
    });
    el("rect", { x: x, y: y, width: valeurs.length * w, height: h, fill: "none", stroke: C.encre, "stroke-width": 3 }, gr);
    return gr;
  }

  // Signal logique : un niveau (0 ou 1) par intervalle de largeur « pas », de y (niveau 1) à y + haut (niveau 0).
  // o.etiquettes[k] : texte centré dans l'intervalle k ; o.coul ; o.fronts : transitions inclinées (style chronogramme).
  function onde(g, x0, y, pas, haut, niveaux, o) {
    o = o || {};
    var gr = el("g", null, g), d = "", inc = o.fronts ? Math.min(6, pas / 6) : 0;
    niveaux.forEach(function (v, k) {
      var yy = v ? y : y + haut, xa = x0 + k * pas, prec = k ? niveaux[k - 1] : v;
      if (!k) d += "M" + xa + " " + yy;
      else if (prec !== v) d += " L" + (xa - inc / 2) + " " + (prec ? y : y + haut) + " L" + (xa + inc / 2) + " " + yy;
      d += " L" + (xa + pas) + " " + yy;
    });
    el("path", { d: d, fill: "none", stroke: o.coul || C.encre, "stroke-width": o.ep || 3, "stroke-linejoin": "round" }, gr);
    (o.etiquettes || []).forEach(function (t, k) {
      if (t) texte(gr, t, [x0 + k * pas + pas / 2, y + haut / 2], { taille: o.taille || 14, coul: o.coulTexte || C.doux, gras: false, mono: o.mono });
    });
    return gr;
  }
  // Horloge : n périodes, niveau haut sur la première moitié de chaque période.
  function horloge(g, x0, y, periode, haut, n, o) {
    var niv = [];
    for (var k = 0; k < n; k++) niv.push(1, 0);
    return onde(g, x0, y, periode / 2, haut, niv, o);
  }

  // Point d'un événement pointeur dans le repère du viewBox.
  function point(svg, ev) {
    var p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
    var q = p.matrixTransform(svg.getScreenCTM().inverse());
    return [q.x, q.y];
  }
  function dans(p, r, marge) { marge = marge || 0; return p[0] >= r[0] - marge && p[0] <= r[0] + r[2] + marge && p[1] >= r[1] - marge && p[1] <= r[1] + r[3] + marge; }
  // Toucher une zone : zones() renvoie {id: [x, y, w, h]} ; f(id) appelé pour la zone touchée (la plus petite si plusieurs).
  function toucher(svg, zones, f) {
    svg.addEventListener("pointerdown", function (ev) {
      var p = point(svg, ev), z = zones() || {}, best = null, aire = Infinity;
      Object.keys(z).forEach(function (id) { var r = z[id]; if (dans(p, r, 6) && r[2] * r[3] < aire) { aire = r[2] * r[3]; best = id; } });
      if (best !== null) f(best, p);
    });
  }
  // Zone tactile d'au moins 48 px autour d'un rectangle, pour les petits blocs.
  function zoneMin(r, min) {
    min = min || 48;
    var w = Math.max(r[2], min), h = Math.max(r[3], min);
    return [r[0] + r[2] / 2 - w / 2, r[1] + r[3] / 2 - h / 2, w, h];
  }

  /* ---------- Dessins du cours : pied diabétique, semelle à 16 capteurs (Section I, diapositives 22 et 23) ---------- */
  // contour de pied (plante), centré en (cx, cy), échelle s
  function pied(g, cx, cy, s, stade) {
    var P = function (x, y) { return (cx + x * s).toFixed(1) + " " + (cy + y * s).toFixed(1); };
    var d = "M" + P(0, -80) + " C" + P(40, -80) + " " + P(48, -30) + " " + P(42, 0) + " C" + P(36, 30) + " " + P(34, 50) + " " + P(30, 70) +
      " C" + P(24, 96) + " " + P(-24, 96) + " " + P(-28, 70) + " C" + P(-32, 40) + " " + P(-44, 0) + " " + P(-40, -40) + " C" + P(-38, -70) + " " + P(-30, -80) + " " + P(0, -80) + "Z";
    var peau = stade >= 5 ? "#5a3b2c" : "#fbe3d3";
    var gp = el("g", null, g);
    el("path", { d: d, fill: peau, stroke: C.encre, "stroke-width": 2.5 }, gp);
    if (stade === 4) el("path", { d: "M" + P(-40, -40) + " C" + P(-38, -70) + " " + P(-30, -80) + " " + P(0, -80) + " C" + P(40, -80) + " " + P(48, -30) + " " + P(42, -20) + " Z", fill: "#5a3b2c" }, gp);
    [[-28, -88, 9], [-11, -93, 8], [4, -92, 7], [18, -88, 6.5], [29, -81, 6]].forEach(function (o) {
      el("circle", { cx: cx + o[0] * s, cy: cy + o[1] * s, r: o[2] * s, fill: stade >= 4 ? "#5a3b2c" : peau, stroke: C.encre, "stroke-width": 2 }, gp);
    });
    if (stade >= 1 && stade <= 3) {
      var r = [0, 9, 13, 16][stade];
      el("circle", { cx: cx - 8 * s, cy: cy - 40 * s, r: r * s * 1.6, fill: "#f2a3a3", opacity: 0.85 }, gp);
      el("circle", { cx: cx - 8 * s, cy: cy - 40 * s, r: r * s * (stade === 1 ? 0.5 : 0.9), fill: stade >= 2 ? "#a12a2a" : "#e06d6d" }, gp);
      if (stade === 3) el("circle", { cx: cx - 8 * s, cy: cy - 40 * s, r: 4 * s, fill: "#f4e9c8" }, gp);
    }
  }
  // capteurs : 16 positions sur la semelle (en unités de la semelle)
  var CAPT = [[0, -72], [-18, -60], [18, -58], [-28, -38], [0, -40], [26, -34], [-30, -14], [-4, -14], [22, -10], [-24, 12], [16, 14], [-16, 36], [14, 38], [-10, 62], [12, 64], [0, 82]];
  function semelle(g, cx, cy, s, surbrillance) {
    var P = function (x, y) { return (cx + x * s).toFixed(1) + " " + (cy + y * s).toFixed(1); };
    var d = "M" + P(0, -95) + " C" + P(46, -95) + " " + P(52, -40) + " " + P(44, -5) + " C" + P(38, 25) + " " + P(36, 50) + " " + P(32, 75) +
      " C" + P(26, 104) + " " + P(-26, 104) + " " + P(-30, 75) + " C" + P(-34, 45) + " " + P(-48, 5) + " " + P(-44, -40) + " C" + P(-42, -80) + " " + P(-32, -95) + " " + P(0, -95) + "Z";
    el("path", { d: d, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
    CAPT.forEach(function (c, k) {
      var on = surbrillance && surbrillance.indexOf(k) >= 0;
      el("rect", { x: cx + c[0] * s - 9 * s, y: cy + c[1] * s - 4.2 * s, width: 18 * s, height: 8.4 * s, rx: 4.2 * s, fill: on ? C.ko : C.acc, transform: "rotate(-60 " + (cx + c[0] * s) + " " + (cy + c[1] * s) + ")" }, g);
    });
  }

  /* ---------- Blood Pressure Monitor (Section I, diapositive 25) ----------
     bpm(g, etat) dessine le schéma ; etat.allume[id] : contour rouge, etat.caches[id] : bloc masqué, etat.air : remplissage de la chambre (0 à 1).
     bpm(null) renvoie seulement les zones { B : blocs de la puce, EXT : éléments extérieurs }. */
  function bpm(g, n) {
    // blocs : [x, y, w, h, texte, famille]
    var B = {
      amp: [134, 74, 64, 44, "AMP", "amp"], pga: [212, 74, 64, 44, "PGA", "amp"], adc: [290, 74, 70, 44, "ADC", "conv"],
      filtre: [374, 66, 104, 60, "Signal\nFiltering", "filtre"],
      mcu: [300, 170, 104, 96, "MCU", "cpu"],
      dac: [140, 176, 80, 44, "DAC", "conv"], passe: [130, 244, 100, 56, "Band Pass\nFilter", "filtre"],
      power: [400, 16, 130, 44, "Power\nManagement", "sys"],
      capsense: [432, 150, 112, 40, "CapSense", "ui"], lcd: [432, 200, 112, 40, "LCD Driver", "ui"],
      ipod: [432, 250, 112, 40, "Made For iPod", "com"], usb: [432, 300, 112, 40, "USB", "com"],
      pwmM: [138, 336, 120, 52, "PWM Motor\nControl", "num"], pwmV: [290, 336, 120, 52, "PWM Valve\nControl", "num"]
    };
    var EXT = {
      capteur: [14, 66, 92, 92, "Pressure\nSensor"], hp: [14, 246, 92, 56, "Mono\nSpeaker"],
      toucher: [574, 140, 100, 56, "Touch\nSensing"], ecran: [574, 204, 100, 40, "LCD Display"],
      cable1: [574, 254, 100, 32, "câble"], cable2: [574, 304, 100, 32, "câble"], batterie: [584, 20, 90, 40, "Battery"],
      transistors: [138, 432, 272, 40, "Motor Driving Transistors"], chambre: [176, 500, 120, 46, "Air\nChamber"],
      pompe: [380, 500, 150, 46, "Rolling Pump"], valve: [186, 560, 100, 36, "Relay Valve"]
    };
    var FAM = { cpu: "#1f3a6b", conv: "#e07a2e", amp: "#f3b38a", filtre: "#22a35a", ui: "#4f8fd6", com: "#c02a8c", num: "#9a8a52", sys: "#b7a7d6" };
    if (!g) return { B: B, EXT: EXT };
    n = n || {}; n.allume = n.allume || {}; n.caches = n.caches || {};
    el("rect", { x: 120, y: 12, width: 440, height: 400, rx: 6, fill: "#eef3fa", stroke: "#7d9cc8", "stroke-width": 2.5 }, g);
    texte(g, "Programmable System on Chip", [250, 34], { taille: 14, coul: "#4a6a99", gras: true, halo: false });
    // liaisons
    var L = function (a, b, o) { fleche(g, a, b, Object.assign({ ep: 2.2, tete: 9 }, o || {})); };
    L([106, 96], [134, 96]); L([198, 96], [212, 96]); L([276, 96], [290, 96]); L([360, 96], [374, 96]);
    L([426, 126], [404, 200]); L([300, 196], [220, 196]); L([180, 220], [180, 244]); L([130, 272], [106, 272]);
    L([404, 190], [432, 170], { double: true }); L([404, 220], [432, 220]); L([404, 240], [432, 270]); L([404, 258], [432, 320]);
    L([544, 170], [574, 168], { double: true }); L([544, 220], [574, 224]); L([544, 270], [574, 270]); L([544, 320], [574, 320]);
    L([584, 38], [530, 38]);
    L([330, 266], [200, 336]); L([352, 266], [350, 336]);
    L([198, 388], [198, 432]); L([350, 388], [350, 432]);
    el("path", { d: "M156 472 V578 H170", fill: "none", stroke: C.encre, "stroke-width": 2.2 }, g); L([166, 578], [186, 578]); L([400, 472], [440, 500]);
    L([236, 546], [236, 560], { double: true });
    // tube de pression entre le brassard et le capteur
    el("path", { d: "M60 158 V522 H176", fill: "none", stroke: C.encre, "stroke-width": 8 }, g);
    el("path", { d: "M296 522 H380", fill: "none", stroke: C.encre, "stroke-width": 4 }, g);
    Object.keys(B).forEach(function (k) {
      var b = B[k], on = n.allume[k], cache = n.caches[k];
      el("rect", { x: b[0], y: b[1], width: b[2], height: b[3], rx: 5, fill: cache ? "#fff" : FAM[b[5]], stroke: on ? C.ko : cache ? C.gris : "none", "stroke-width": on ? 4 : 2, "stroke-dasharray": cache ? "6 4" : null }, g);
      texte(g, cache ? "?" : b[4], [b[0] + b[2] / 2, b[1] + b[3] / 2], { taille: cache ? 22 : 14, coul: cache ? C.gris : (b[5] === "amp" || b[5] === "sys" ? C.encre : "#fff"), halo: false, gras: true });
    });
    Object.keys(EXT).forEach(function (k) {
      var b = EXT[k], on = n.allume[k];
      bloc(g, b[0], b[1], b[2], b[3], k === "chambre" ? null : b[4], { taille: 14, fill: "#d9dce3", stroke: on ? C.ko : "#9aa0ad", ep: on ? 4 : 1.5, rx: k === "capteur" ? 46 : 6 });
    });
    // air dans la chambre, puis son nom par-dessus
    var ch = EXT.chambre;
    if (n.air > 0) el("rect", { x: ch[0] + 3, y: ch[1] + 3 + (ch[3] - 6) * (1 - n.air), width: ch[2] - 6, height: (ch[3] - 6) * n.air, rx: 4, fill: C.acc, opacity: 0.45 }, g);
    texte(g, ch[4], [ch[0] + ch[2] / 2, ch[1] + ch[3] / 2], { taille: 14, halo: false });
    return { B: B, EXT: EXT };
  }

  // Nombres
  function binaire(n, nb) { var s = (n >>> 0).toString(2); while (s.length < nb) s = "0" + s; return s; }
  function hexa(n, nb) { var s = (n >>> 0).toString(16).toUpperCase(); while (s.length < (nb || 1)) s = "0" + s; return s; }
  function virgule(x, d) { var s = (d === undefined ? String(x) : x.toFixed(d)).replace(".", ","); return s.charAt(0) === "-" ? "−" + s.slice(1) : s; }

  return {
    C: C, teinte: teinte, el: el, vider: vider, texte: texte, bloc: bloc, fleche: fleche, bus: bus, bits: bits,
    onde: onde, horloge: horloge, point: point, dans: dans, toucher: toucher, zoneMin: zoneMin,
    binaire: binaire, hexa: hexa, virgule: virgule, pied: pied, semelle: semelle, CAPTEURS: CAPT, bpm: bpm
  };
})();
