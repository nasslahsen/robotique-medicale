/*
 * Dessins et gestes propres au module Informatique médicale, partagés par les niveaux (jouer.html) et les pages de cours.
 * Boîtes étiquetées, flèches, tableaux, pictogrammes (serveur, base, poste, cadenas...), et trois gestes au doigt :
 * relier deux à deux (paires), toucher dans l'ordre (trace), ranger dans des bacs (trier), repérer sur le dessin (reperer).
 * Indépendant de D (jeu) et de RM (cours) : chargé après eux, il marche dans les deux.
 * Les calculs (SIS.calc) sont purs et testés par tests/math.test.js.
 */
(function (global) {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var P = global.PLATEFORME;

  var C = {
    encre: "#15171f", doux: "#5b6172", gris: "#9aa0ad", pale: "#eef0f5", trait: "#e3e6ee", fond: "#f6f7fa",
    ok: "#12a26b", okPale: "#e3f7ee", ko: "#e5484d", koPale: "#fdecec", acc: "#3b5bdb", accPale: "#e8edff",
    v: "#8b3fd9", vPale: "#f1e8fc", turq: "#0f8a9d", turqPale: "#e2f4f6", brun: "#b4541a", brunPale: "#fbeee6",
    jeu: P ? P.couleur() : "#5b6172", jeuPale: P ? P.clair() : "#eef0f5", jeuTexte: "#5b6172"
  };
  if (P && P.module) { var mm = P.module(P.courant); if (mm && mm.texte) C.jeuTexte = mm.texte; }
  // Couleurs des bacs de tri (jamais la couleur d'accent écrite en dur)
  var BACS = [
    { coul: C.acc, pale: C.accPale }, { coul: C.v, pale: C.vPale }, { coul: C.turq, pale: C.turqPale },
    { coul: C.brun, pale: C.brunPale }, { coul: C.ok, pale: C.okPale }
  ];

  /* ---------- SVG de base ---------- */
  function s(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var a in attrs || {}) if (attrs[a] !== undefined && attrs[a] !== null) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function vider(e) { while (e.firstChild) e.removeChild(e.firstChild); }

  // Coupe un texte en lignes d'environ « largeur » pixels.
  function couper(t, largeur, taille) {
    if (!largeur) return String(t).split("\n");
    var max = Math.max(4, Math.floor(largeur / (taille * 0.53))), lignes = [];
    String(t).split("\n").forEach(function (par) {
      var l = "";
      par.split(" ").forEach(function (m) {
        if (!l) l = m;
        else if ((l + " " + m).length <= max) l += " " + m;
        else { lignes.push(l); l = m; }
      });
      lignes.push(l);
    });
    return lignes;
  }

  // Texte centré verticalement sur p, sur une ou plusieurs lignes, avec un halo blanc.
  function texte(g, t, p, o) {
    o = o || {};
    var taille = o.taille || 18, lh = (o.lh || 1.22) * taille, lignes = couper(t, o.largeur, taille);
    var e = s("text", {
      x: p[0], y: p[1], fill: o.coul || C.encre, "font-size": taille, "font-weight": o.gras === false ? 500 : o.gras || 600,
      "text-anchor": o.ancre || "middle", "font-family": o.mono ? "JetBrains Mono, monospace" : "Inter, sans-serif",
      "font-style": o.italique ? "italic" : null, opacity: o.op
    }, g);
    if (o.halo !== false) { e.setAttribute("paint-order", "stroke"); e.setAttribute("stroke", o.haloCoul || "#fff"); e.setAttribute("stroke-width", o.haloEp || 5); e.setAttribute("stroke-linejoin", "round"); }
    var y0 = p[1] - (lignes.length - 1) * lh / 2;
    lignes.forEach(function (l, i) {
      var ts = s("tspan", { x: p[0], y: y0 + i * lh, "dominant-baseline": "central" }, e);
      ts.textContent = l;
    });
    return e;
  }

  // Boîte arrondie avec un titre (et un sous-titre) centrés.
  function boite(g, x, y, w, h, o) {
    o = o || {};
    var gr = s("g", { opacity: o.op }, g);
    gr.rect = s("rect", { x: x, y: y, width: w, height: h, rx: o.rx === undefined ? 14 : o.rx, fill: o.fond || "#fff", stroke: o.bord || C.encre, "stroke-width": o.ep === undefined ? 2.5 : o.ep, "stroke-dasharray": o.tirets }, gr);
    var cx = x + w / 2, cy = y + h / 2, taille = o.taille || 17;
    if (o.titre && o.sous) {
      var ts = o.tailleSous || taille * 0.78, nT = couper(o.titre, w - 14, taille).length, nS = couper(o.sous, w - 14, ts).length;
      var hT = nT * taille * 1.22, hS = nS * ts * 1.22, haut = hT + hS + 4, y0 = cy - haut / 2;
      texte(gr, o.titre, [cx, y0 + hT / 2], { taille: taille, coul: o.coul, largeur: w - 14, halo: false, gras: o.gras || 700 });
      texte(gr, o.sous, [cx, y0 + hT + 4 + hS / 2], { taille: ts, coul: o.coulSous || C.doux, largeur: w - 14, halo: false, gras: 500 });
    } else if (o.titre) texte(gr, o.titre, [cx, cy], { taille: taille, coul: o.coul, largeur: w - 14, halo: false, gras: o.gras || 700, mono: o.mono });
    return gr;
  }

  function fleche(g, a, b, o) {
    o = o || {};
    var coul = o.coul || C.encre, ep = o.ep || 4, d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]);
    if (l < 2) return null;
    var u = [d[0] / l, d[1] / l], t = o.tete || 9 + ep * 1.8, w = t * 0.55, c = [b[0] - u[0] * t, b[1] - u[1] * t];
    var gr = s("g", { opacity: o.op }, g);
    s("line", { x1: a[0], y1: a[1], x2: c[0] + u[0], y2: c[1] + u[1], stroke: coul, "stroke-width": ep, "stroke-linecap": "round", "stroke-dasharray": o.tirets }, gr);
    s("polygon", { points: [b, [c[0] - u[1] * w, c[1] + u[0] * w], [c[0] + u[1] * w, c[1] - u[0] * w]].map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "), fill: coul }, gr);
    if (o.double) { var a2 = fleche(gr, b, a, { coul: coul, ep: ep, tete: o.tete }); }
    return gr;
  }

  // Chemin à travers plusieurs points, flèche au bout.
  function chemin(g, pts, o) {
    o = o || {};
    var gr = s("g", { opacity: o.op }, g), coul = o.coul || C.encre, ep = o.ep || 5;
    if (pts.length < 2) return gr;
    var d = "M" + pts.slice(0, -1).map(function (p) { return p[0] + " " + p[1]; }).join(" L");
    var a = pts[pts.length - 2], b = pts[pts.length - 1];
    s("path", { d: d + " L" + a[0] + " " + a[1], fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-dasharray": o.tirets }, gr);
    fleche(gr, a, b, { coul: coul, ep: ep, tirets: o.tirets });
    return gr;
  }

  // Zone tactile (doigt, stylet ou souris)
  function toucher(el, f) {
    el.style.cursor = "pointer";
    el.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    el.addEventListener("click", function (e) { e.stopPropagation(); f(e); });
    return el;
  }
  function cible(g, x, y, w, h, f) {
    var r = s("rect", { x: x, y: y, width: w, height: h, fill: "transparent" }, g);
    return toucher(r, f);
  }

  // Point où le segment du centre de la boîte b vers q sort de la boîte.
  function bord(b, q, marge) {
    var c = [b.x + b.w / 2, b.y + b.h / 2], d = [q[0] - c[0], q[1] - c[1]], m = marge || 6;
    var tx = d[0] ? (b.w / 2 + m) / Math.abs(d[0]) : Infinity, ty = d[1] ? (b.h / 2 + m) / Math.abs(d[1]) : Infinity, t = Math.min(tx, ty, 1);
    return [c[0] + d[0] * t, c[1] + d[1] * t];
  }
  function relier(g, a, b, o) {
    var ca = [a.x + a.w / 2, a.y + a.h / 2], cb = [b.x + b.w / 2, b.y + b.h / 2];
    return fleche(g, bord(a, cb), bord(b, ca, 4), o);
  }

  // Tableau : colonnes de largeurs ws, lignes de hauteur h ; la ligne 0 est l'en-tête. Renvoie les cases {x, y, w, h}.
  function tableau(g, x, y, ws, h, lignes, o) {
    o = o || {};
    var cases = [], W = ws.reduce(function (a, b) { return a + b; }, 0), hs = lignes.map(function (_, i) { return (o.hs && o.hs[i]) || h; });
    var yy = y;
    lignes.forEach(function (l, i) {
      var xx = x;
      cases.push([]);
      l.forEach(function (t, k) {
        var st = o.style ? o.style(i, k) || {} : {};
        s("rect", { x: xx, y: yy, width: ws[k], height: hs[i], fill: st.fond || (i === 0 ? C.pale : "#fff"), stroke: st.bord || C.trait, "stroke-width": st.ep || 1.5 }, g);
        texte(g, t, [xx + (o.gauche && k === 0 && i > 0 ? 10 : ws[k] / 2), yy + hs[i] / 2], { taille: i === 0 ? (o.tailleTete || o.taille || 15) : (o.taille || 15), gras: i === 0 ? 700 : st.gras || 500, coul: st.coul || C.encre, halo: false, largeur: ws[k] - 12, ancre: o.gauche && k === 0 && i > 0 ? "start" : "middle", mono: st.mono });
        cases[i].push({ x: xx, y: yy, w: ws[k], h: hs[i] });
        xx += ws[k];
      });
      yy += hs[i];
    });
    s("rect", { x: x, y: y, width: W, height: yy - y, fill: "none", stroke: C.encre, "stroke-width": 2, rx: 2 }, g);
    return cases;
  }

  /* ---------- Pictogrammes (traits épais, une couleur) ---------- */
  function icone(g, nom, c, sz, coul) {
    coul = coul || C.encre;
    var k = (sz || 40) / 40, gr = s("g", { transform: "translate(" + c[0] + " " + c[1] + ") scale(" + k + ")" }, g);
    var tr = { fill: "none", stroke: coul, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" };
    var pl = { fill: coul };
    function p(d, a) { return s("path", Object.assign({ d: d }, a || tr), gr); }
    switch (nom) {
      case "personne":
        s("circle", Object.assign({ cx: 0, cy: -11, r: 7 }, pl), gr); p("M-13 17 V8 Q-13 -1 0 -1 Q13 -1 13 8 V17 Z", pl); break;
      case "patient":
        p("M-18 6 H18 M-14 6 V14 M14 6 V14"); s("circle", Object.assign({ cx: -12, cy: -2, r: 5 }, pl), gr); p("M-6 -2 H16", Object.assign({}, tr, { "stroke-width": 7 })); break;
      case "serveur":
        p("M-14 -18 H14 V18 H-14 Z M-14 -6 H14 M-14 6 H14"); [-12, 0, 12].forEach(function (y) { s("circle", Object.assign({ cx: 8, cy: y, r: 2 }, pl), gr); }); break;
      case "base":
        p("M-14 -12 A14 5 0 0 0 14 -12 A14 5 0 0 0 -14 -12 V12 A14 5 0 0 0 14 12 V-12 M-14 0 A14 5 0 0 0 14 0"); break;
      case "ecran":
        p("M-17 -13 H17 V9 H-17 Z M-6 17 H6 M0 9 V17"); break;
      case "moniteur":
        p("M-17 -13 H17 V9 H-17 Z M-6 17 H6 M0 9 V17"); p("M-12 0 H-6 L-3 -7 L1 5 L4 -2 H12"); break;
      case "reseau":
        [[-12, 12], [12, 12], [0, -12]].forEach(function (q) { s("rect", Object.assign({ x: q[0] - 6, y: q[1] - 5, width: 12, height: 10, rx: 2 }, pl), gr); }); p("M0 -7 V3 M-12 7 V3 H12 V7"); break;
      case "cadenas":
        p("M-12 -2 H12 V17 H-12 Z M-8 -2 V-9 A8 8 0 0 1 8 -9 V-2"); s("circle", Object.assign({ cx: 0, cy: 7, r: 3 }, pl), gr); break;
      case "ouvert":
        p("M-12 -2 H12 V17 H-12 Z M-8 -2 V-9 A8 8 0 0 1 8 -9 V-6"); s("circle", Object.assign({ cx: 0, cy: 7, r: 3 }, pl), gr); break;
      case "bouclier":
        p("M0 -17 L14 -11 V0 Q14 12 0 18 Q-14 12 -14 0 V-11 Z M-6 0 L-1 5 L7 -5"); break;
      case "document":
        p("M-11 -17 H5 L12 -10 V17 H-11 Z M5 -17 V-10 H12 M-6 -3 H7 M-6 4 H7 M-6 11 H3"); break;
      case "tube":
        p("M-5 -17 V10 A5 5 0 0 0 5 10 V-17 M-8 -17 H8 M-5 0 H5"); break;
      case "radiation":
        s("circle", Object.assign({ cx: 0, cy: 0, r: 3.5 }, pl), gr);
        [0, 120, 240].forEach(function (a) { s("path", Object.assign({ d: "M-5.5 -6 L-9 -15 A17 17 0 0 1 9 -15 L5.5 -6 A8 8 0 0 0 -5.5 -6 Z", transform: "rotate(" + a + ")" }, pl), gr); }); break;
      case "pilule":
        p("M-13 7 L7 -13 A7 7 0 0 1 17 -3 L-3 17 A7 7 0 0 1 -13 7 Z M-3 -3 L7 7"); break;
      case "lit":
        p("M-18 12 V-10 M-18 2 H18 V12 M-18 -2 H-8"); s("circle", Object.assign({ cx: -12, cy: -7, r: 4 }, pl), gr); break;
      case "horloge":
        s("circle", { cx: 0, cy: 0, r: 16, fill: "none", stroke: coul, "stroke-width": 3 }, gr); p("M0 -9 V0 L7 5"); break;
      case "alerte":
        p("M0 -17 L17 14 H-17 Z M0 -5 V4"); s("circle", Object.assign({ cx: 0, cy: 9, r: 2 }, pl), gr); break;
      case "cle":
        p("M-14 14 L3 -3 M8 -16 A8 8 0 1 0 15 -9 L9 -9 L8 -15 Z"); break;
      case "nuage":
        p("M-12 12 H12 A8 8 0 0 0 12 -4 A11 11 0 0 0 -9 -6 A9 9 0 0 0 -12 12 Z"); break;
      case "carte": // pièce d'identité
        p("M-18 -12 H18 V12 H-18 Z M2 -4 H13 M2 3 H13"); s("circle", Object.assign({ cx: -8, cy: -3, r: 4 }, pl), gr); p("M-14 8 Q-8 2 -2 8"); break;
      case "facture":
        p("M-11 -17 H11 V17 L7 14 L3 17 L-1 14 L-5 17 L-11 14 Z M-6 -8 H6 M-6 -1 H6 M-6 6 H2"); break;
      case "pirate": // attaquant
        s("circle", Object.assign({ cx: 0, cy: -9, r: 8 }, pl), gr); p("M-14 17 V9 Q-14 1 0 1 Q14 1 14 9 V17 Z", pl); p("M-6 -10 H6", { fill: "none", stroke: "#fff", "stroke-width": 3, "stroke-linecap": "round" }); break;
      case "engrenage":
        s("circle", { cx: 0, cy: 0, r: 9, fill: "none", stroke: coul, "stroke-width": 3 }, gr);
        for (var i = 0; i < 8; i++) s("rect", Object.assign({ x: -3, y: -17, width: 6, height: 7, rx: 1, transform: "rotate(" + i * 45 + ")" }, pl), gr); break;
      case "pompe": // pompe à perfusion
        p("M-14 -16 H14 V16 H-14 Z M-8 -9 H8 V-1 H-8 Z M0 16 V20"); s("circle", Object.assign({ cx: -5, cy: 8, r: 2.5 }, pl), gr); s("circle", Object.assign({ cx: 5, cy: 8, r: 2.5 }, pl), gr); break;
      default:
        s("circle", { r: 14, fill: "none", stroke: coul, "stroke-width": 3 }, gr);
    }
    return gr;
  }

  /* ---------- Relier deux à deux : toucher un élément à gauche, puis son partenaire à droite ----------
     cfg : g, gauche [textes], droite [textes], bon [indice à droite pour chaque élément de gauche],
           xg, wg, xd, wd, y0, h, pas (ou pasD pour la colonne de droite), taille, erreur(msg), info(msg), fin(), aide(i, k) */
  function paires(cfg) {
    var lie = cfg.gauche.map(function () { return -1; }), sel = -1, faux = -1, fini = false;
    var p = { lie: lie };
    function yG(i) { return cfg.y0 + i * cfg.pas; }
    function yD(k) { return (cfg.y0D === undefined ? cfg.y0 : cfg.y0D) + k * (cfg.pasD || cfg.pas); }
    var hD = cfg.hD || cfg.h;
    p.dessiner = function () {
      var g = cfg.g; vider(g);
      if (cfg.fond) cfg.fond(g);
      cfg.gauche.forEach(function (t, i) {
        var ok = lie[i] >= 0, on = sel === i;
        boite(g, cfg.xg, yG(i), cfg.wg, cfg.h, { fond: on ? C.acc : ok ? C.accPale : "#fff", bord: on || ok ? C.acc : C.trait, ep: on ? 3.5 : 2.5, rx: 10, titre: t, taille: cfg.taille || 17, coul: on ? "#fff" : C.encre });
        cible(g, cfg.xg, yG(i), cfg.wg, cfg.h, function () { if (fini || lie[i] >= 0) return; sel = i; faux = -1; p.dessiner(); });
      });
      cfg.droite.forEach(function (t, k) {
        var i = lie.indexOf(k), ok = i >= 0;
        boite(g, cfg.xd, yD(k), cfg.wd, hD, { fond: faux === k ? C.koPale : ok ? C.okPale : "#fff", bord: faux === k ? C.ko : ok ? C.ok : C.trait, ep: 2.5, rx: 10, titre: t, taille: cfg.tailleD || cfg.taille || 16, gras: 500 });
        cible(g, cfg.xd, yD(k), cfg.wd, hD, function () { p.toucher(k); });
      });
      lie.forEach(function (k, i) {
        if (k < 0) return;
        s("line", { x1: cfg.xg + cfg.wg, y1: yG(i) + cfg.h / 2, x2: cfg.xd, y2: yD(k) + hD / 2, stroke: C.ok, "stroke-width": 3.5, "stroke-linecap": "round" }, cfg.g);
      });
    };
    p.toucher = function (k) {
      if (fini) return;
      if (lie.indexOf(k) >= 0) return;
      if (sel < 0) { if (cfg.info) cfg.info("Touche d'abord un élément à gauche."); return; }
      if (cfg.bon[sel] !== k) { faux = k; var i = sel; sel = -1; p.dessiner(); if (cfg.erreur) cfg.erreur(cfg.aide ? cfg.aide(i, k) : "Ces deux-là ne vont pas ensemble."); return; }
      lie[sel] = k; sel = -1; faux = -1; p.dessiner();
      if (lie.every(function (x) { return x >= 0; })) { fini = true; if (cfg.fin) cfg.fin(); }
    };
    p.resoudre = function () { lie.forEach(function (k, i) { if (k < 0 && !fini) { sel = i; p.toucher(cfg.bon[i]); } }); };
    p.dessiner();
    return p;
  }

  /* ---------- Toucher des étapes dans l'ordre ----------
     cfg : g, noeuds [{ t, sous?, x, y, w, h }], ordre [indices], coul, taille, erreur(msg), aide(i, attendu, k) -> msg, fin(), boucle, fleches */
  function trace(cfg) {
    var pris = [], fini = false, faux = -1, p = {};
    p.dessiner = function () {
      var g = cfg.g; vider(g);
      if (cfg.fond) cfg.fond(g);
      cfg.noeuds.forEach(function (nd, i) {
        var k = pris.indexOf(i), on = k >= 0;
        boite(g, nd.x, nd.y, nd.w, nd.h, { fond: faux === i ? C.koPale : on ? "#fff" : C.fond, bord: faux === i ? C.ko : on ? cfg.coul : C.trait, ep: on ? 3.5 : 2, rx: 12, titre: nd.t, sous: nd.sous, taille: cfg.taille || 16, coul: on ? C.encre : C.doux });
        if (on) {
          s("circle", { cx: nd.x + 4, cy: nd.y + 4, r: 14, fill: cfg.coul }, g);
          texte(g, String(k + 1), [nd.x + 4, nd.y + 4], { taille: 15, coul: "#fff", halo: false, gras: 800 });
        }
      });
      if (cfg.fleches !== false) for (var k = 1; k < pris.length; k++) relier(g, cfg.noeuds[pris[k - 1]], cfg.noeuds[pris[k]], { coul: cfg.coul, ep: 4.5 });
      if (fini && cfg.boucle) relier(g, cfg.noeuds[pris[pris.length - 1]], cfg.noeuds[pris[0]], { coul: cfg.coul, ep: 4.5, tirets: "10 7" });
      cfg.noeuds.forEach(function (nd, i) { cible(g, nd.x, nd.y, nd.w, nd.h, function () { p.toucher(i); }); });
    };
    p.toucher = function (i) {
      if (fini || pris.indexOf(i) >= 0) return;
      var attendu = cfg.ordre[pris.length];
      if (i !== attendu) { faux = i; p.dessiner(); if (cfg.erreur) cfg.erreur(cfg.aide ? cfg.aide(i, attendu, pris.length) : "Pas encore cette étape."); return; }
      faux = -1; pris.push(i);
      if (pris.length === cfg.ordre.length) fini = true;
      p.dessiner();
      if (fini && cfg.fin) cfg.fin();
    };
    p.resoudre = function () { while (!fini) p.toucher(cfg.ordre[pris.length]); };
    p.dessiner();
    return p;
  }

  /* ---------- Ranger dans des bacs : toucher une carte, puis le bac qui lui va ----------
     cfg : g, cartes [{ t, bac }], bacs [{ t, sous? }], pos(i) -> {x, y, w, h} pour chaque carte,
           bacsPos(k) -> {x, y, w, h} (zone à toucher), dessinBac(g, k, faux) pour un bac dessiné autrement,
           couleurs(k) -> {coul, pale} pour la pastille des cartes rangées, taille, tailleBac, erreur, info, aide(i, k), fin(), fond(g) */
  function trier(cfg) {
    var dans = cfg.cartes.map(function () { return -1; }), sel = -1, faux = -1, fini = false, p = { dans: dans };
    p.dessiner = function () {
      var g = cfg.g; vider(g);
      if (cfg.fond) cfg.fond(g);
      cfg.bacs.forEach(function (b, k) {
        var r = cfg.bacsPos(k), st = BACS[k % BACS.length];
        if (cfg.dessinBac) cfg.dessinBac(g, k, faux === k);
        else boite(g, r.x, r.y, r.w, r.h, { fond: faux === k ? C.koPale : st.pale, bord: faux === k ? C.ko : st.coul, ep: 3, rx: 12, titre: b.t, sous: b.sous, taille: cfg.tailleBac || 17, coul: st.coul });
        cible(g, r.x, r.y, r.w, r.h, function () { p.toucher(k); });
      });
      cfg.cartes.forEach(function (c, i) {
        var r = cfg.pos(i), k = dans[i], on = sel === i, st = k >= 0 ? (cfg.couleurs ? cfg.couleurs(k) : BACS[k % BACS.length]) : null;
        boite(g, r.x, r.y, r.w, r.h, { fond: on ? C.encre : st ? st.pale : "#fff", bord: on ? C.encre : st ? st.coul : C.trait, ep: on ? 3 : 2.5, rx: 10, titre: c.t, taille: cfg.taille || 17, coul: on ? "#fff" : C.encre, gras: 600 });
        if (st) s("circle", { cx: r.x + r.w - 2, cy: r.y + 2, r: 9, fill: st.coul, stroke: "#fff", "stroke-width": 2 }, g);
        cible(g, r.x, r.y, r.w, r.h, function () { if (fini || dans[i] >= 0) return; sel = i; faux = -1; p.dessiner(); });
      });
    };
    p.toucher = function (k) {
      if (fini) return;
      if (sel < 0) { if (cfg.info) cfg.info("Touche d'abord une carte, puis le bac qui lui correspond."); return; }
      var i = sel;
      if (cfg.cartes[i].bac !== k) { faux = k; sel = -1; p.dessiner(); if (cfg.erreur) cfg.erreur(cfg.aide ? cfg.aide(i, k) : "Pas dans ce bac."); return; }
      dans[i] = k; sel = -1; faux = -1; p.dessiner();
      if (dans.every(function (x) { return x >= 0; })) { fini = true; if (cfg.fin) cfg.fin(); }
    };
    p.resoudre = function () { cfg.cartes.forEach(function (c, i) { if (dans[i] < 0 && !fini) { sel = i; p.toucher(c.bac); } }); };
    p.dessiner();
    return p;
  }

  /* ---------- Repérer : toucher toutes les zones « bon », sans toucher les autres ----------
     cfg : g, zones [{ x, y, w, h, bon }], dessiner(g, etat) avec etat = { trouve: [bool], faux: indice },
           erreur, aide(i) -> msg, trouve(i) (appelé à chaque bonne zone), fin() */
  function reperer(cfg) {
    var etat = { trouve: cfg.zones.map(function () { return false; }), faux: -1 }, fini = false, p = { etat: etat };
    var nbBons = cfg.zones.filter(function (z) { return z.bon; }).length;
    p.dessiner = function () {
      var g = cfg.g; vider(g);
      cfg.dessiner(g, etat);
      cfg.zones.forEach(function (z, i) { cible(g, z.x, z.y, z.w, z.h, function () { p.toucher(i); }); });
    };
    p.toucher = function (i) {
      if (fini || etat.trouve[i]) return;
      var z = cfg.zones[i];
      if (!z.bon) { etat.faux = i; p.dessiner(); if (cfg.erreur) cfg.erreur(cfg.aide ? cfg.aide(i) : "Pas ici."); return; }
      etat.trouve[i] = true; etat.faux = -1; p.dessiner();
      if (cfg.trouve) cfg.trouve(i);
      if (etat.trouve.filter(Boolean).length === nbBons) { fini = true; if (cfg.fin) cfg.fin(); }
    };
    p.resoudre = function () { cfg.zones.forEach(function (z, i) { if (z.bon && !etat.trouve[i]) p.toucher(i); }); };
    p.dessiner();
    return p;
  }

  // Animation bornée dans le temps (jamais en boucle) : f(t) avec t de 0 à 1, puis fin().
  function animer(duree, f, fin) {
    var t0 = null, arret = false;
    function pas(t) {
      if (arret) return;
      if (t0 === null) t0 = t;
      var u = Math.min(1, (t - t0) / duree);
      f(u);
      if (u < 1) requestAnimationFrame(pas); else if (fin) fin();
    }
    requestAnimationFrame(pas);
    return { arreter: function () { arret = true; } };
  }

  /* ---------- Calculs (testés dans tests/math.test.js) ---------- */
  var calc = {
    // Appariement déterministe (S3, diapo 8) : même NOM + PRÉNOM + DATE_DE_NAISSANCE -> même patient
    deterministe: function (a, b) { return a.nom === b.nom && a.prenom === b.prenom && a.naissance === b.naissance; },
    // Appariement probabiliste (S3, diapo 8) : moyenne des scores partiels pondérés par l'importance de chaque champ
    scorePondere: function (scores, poids) {
      var sp = 0, sw = 0;
      scores.forEach(function (x, i) { sp += x * poids[i]; sw += poids[i]; });
      return sp / sw;
    },
    // Seuils de décision du cours : > 0,90 match automatique, entre 0,70 et 0,90 revue manuelle, < 0,70 pas de match
    decision: function (score) { return score > 0.90 ? "match" : score >= 0.70 ? "revue" : "non"; },
    // Normalisation (S3, diapo 9) : majuscules, sans accents, espaces réduits
    normaliser: function (t) {
      return String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
    },
    // Téléphone au format standard : 10 chiffres groupés par deux
    telephone: function (t) {
      var c = String(t).replace(/\D/g, "");
      if (c.indexOf("212") === 0 && c.length === 12) c = "0" + c.slice(3);
      return c.length === 10 ? c.replace(/(\d\d)(?=\d)/g, "$1 ") : null;
    },
    // Matrice des risques (cyber, diapo 21) : Risque = Probabilité × Impact, chacun noté de 1 à 4 (échelle ajoutée)
    risque: function (prob, impact) { return prob * impact; },
    niveauRisque: function (r) { return r >= 9 ? "élevé" : r >= 4 ? "moyen" : "faible"; },
    // Répartition du temps de traitement d'un examen de biologie (S3, diapo 13) : 60 %, 25 %, 15 %
    tat: function (total) { return [total * 0.60, total * 0.25, total * 0.15]; },
    // Chaîne de n passages qui transmettent chacun la donnée sans erreur avec la probabilité p (exemple ajouté)
    chaine: function (p, n) { return Math.pow(p, n); },
    // Âge en années révolues à une date
    age: function (naissance, date) {
      var a = date[0] - naissance[0];
      if (date[1] < naissance[1] || (date[1] === naissance[1] && date[2] < naissance[2])) a--;
      return a;
    }
  };


  /* ---------- Panorama des SIH au Maroc (S1S2, diapo 42) : carte schématique, une tuile par région ---------- */
  var EDITEURS = [
    { n: "Enova", coul: "#2f9e44", pale: "#e6f4ea" }, { n: "Sivsa", coul: "#d9480f", pale: "#fdece4" },
    { n: "Belmed", coul: "#8a5a2b", pale: "#f3ebe2" }, { n: "Dedalus", coul: "#1c7ed6", pale: "#e3f0fc" }
  ];
  // e : indice de l'éditeur ; tuiles placées du nord au sud, sans prétendre aux vraies frontières
  var REGIONS = [
    { n: "Tanger-Tétouan-Al Hoceima", e: 0, x: 250, y: 18, w: 170, h: 58 },
    { n: "Rabat-Salé-Kénitra", e: 3, x: 170, y: 84, w: 150, h: 58 },
    { n: "Fès-Meknès", e: 1, x: 328, y: 84, w: 150, h: 58 },
    { n: "Oriental", e: 1, x: 486, y: 84, w: 150, h: 122 },
    { n: "Casablanca-Settat", e: 1, x: 130, y: 150, w: 150, h: 58 },
    { n: "Béni Mellal-Khénifra", e: 0, x: 288, y: 150, w: 190, h: 58 },
    { n: "Marrakech-Safi", e: 1, x: 100, y: 216, w: 150, h: 58 },
    { n: "Drâa-Tafilalet", e: 2, x: 258, y: 216, w: 240, h: 72 },
    { n: "Souss-Massa", e: 0, x: 92, y: 282, w: 158, h: 58 },
    { n: "Guelmim-Oued Noun", e: 2, x: 62, y: 348, w: 170, h: 58 },
    { n: "Laâyoune-Sakia El Hamra", e: 0, x: 34, y: 414, w: 190, h: 70 },
    { n: "Dakhla-Oued Eddahab", e: 0, x: 14, y: 492, w: 190, h: 76 }
  ];
  // o : { cache (tuiles sans couleur), faux (indice d'une tuile à marquer en erreur), legende, compte (nombre de régions dans la légende), ok (indice à entourer) }
  function carteMaroc(g, o) {
    o = o || {};
    REGIONS.forEach(function (r, i) {
      var ed = EDITEURS[r.e], f = o.faux === i;
      boite(g, r.x, r.y, r.w, r.h, { fond: f ? C.koPale : o.cache ? "#fff" : ed.pale, bord: f ? C.ko : o.cache ? C.gris : ed.coul, ep: o.ok === i ? 5 : 2.5, rx: 10, titre: r.n, taille: 14, coul: C.encre, gras: 600 });
    });
    if (o.legende) EDITEURS.forEach(function (ed, k) {
      var y = 380 + k * 46;
      s("rect", { x: 450, y: y - 15, width: 30, height: 30, rx: 8, fill: ed.pale, stroke: ed.coul, "stroke-width": 3 }, g);
      texte(g, ed.n + (o.compte ? " (" + REGIONS.filter(function (r) { return r.e === k; }).length + ")" : ""), [494, y], { taille: 18, ancre: "start", gras: 700, coul: ed.coul, halo: false });
    });
  }


  /* ---------- Processus de création / vérification d'une identité (S3, diapo 6), dessiné en BPMN simplifié ----------
     o : { fin: { haut, milieu, bas, vigil } -> "ok" | "faux" pour colorer une issue, chemin: "haut" | "milieu" | "bas" | "vigil" | "sinon" | "incoherent" } */
  var BPMN_FINS = {
    haut: { c: [606, 170], t: "Identité choisie" }, milieu: { c: [606, 300], t: "Identité créée" },
    bas: { c: [606, 430], t: "Identité choisie" }, vigil: { box: [448, 470, 112, 54], t: "Identito-vigilance" }
  };
  function bpmnIdentite(g, o) {
    o = o || {};
    var fin = o.fin || {}, ch = o.chemin, T = 14;
    function coul(nom) { return ch === nom ? C.jeu : C.encre; }
    function ep(nom) { return ch === nom ? 5 : 2.5; }
    function losange(c) { s("polygon", { points: [[c[0], c[1] - 20], [c[0] + 20, c[1]], [c[0], c[1] + 20], [c[0] - 20, c[1]]].map(function (q) { return q.join(","); }).join(" "), fill: "#fff7d6", stroke: C.encre, "stroke-width": 2.5 }, g); texte(g, "X", c, { taille: 16, gras: 800, halo: false }); }
    function lab(t, p, anc) { texte(g, t, p, { taille: 12.5, coul: C.doux, ancre: anc || "start", gras: 600 }); }
    // couloirs
    s("rect", { x: 10, y: 20, width: 660, height: 570, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
    [[20, 120, "Patient"], [120, 540, "Agent d'admission"], [540, 590, "SI"]].forEach(function (l) {
      s("rect", { x: 10, y: l[0], width: 34, height: l[1] - l[0], fill: C.pale, stroke: C.encre, "stroke-width": 1.5 }, g);
      s("line", { x1: 44, y1: l[1], x2: 670, y2: l[1], stroke: C.trait, "stroke-width": 2 }, g);
      var t = texte(g, l[2], [27, (l[0] + l[1]) / 2], { taille: 13, gras: 700, halo: false });
      t.setAttribute("transform", "rotate(-90 27 " + (l[0] + l[1]) / 2 + ")");
    });
    // début
    s("circle", { cx: 75, cy: 62, r: 14, fill: C.okPale, stroke: C.ok, "stroke-width": 3 }, g); texte(g, "CIN", [75, 96], { taille: 13, gras: 700 });
    fleche(g, [91, 62], [106, 62], { ep: 2.5, tete: 10 });
    boite(g, 110, 34, 200, 58, { titre: "AC/1 Se présenter au guichet de sa catégorie", taille: 13, rx: 8, fond: C.accPale, bord: C.acc });
    fleche(g, [150, 94], [150, 266], { ep: 2.5, tete: 10 });
    boite(g, 52, 268, 140, 64, { titre: "AC/2 Rechercher l'identité du patient", taille: T, rx: 8, fond: C.accPale, bord: C.acc });
    fleche(g, [194, 300], [198, 300], { ep: 2.5, tete: 8 });
    losange([220, 300]);
    // trois branches
    chemin(g, [[220, 280], [220, 170], [250, 170]], { ep: ep("haut"), coul: coul("haut") }); lab("résultats avec CIN", [228, 232]);
    chemin(g, [[240, 300], [440, 300]], { ep: ep("milieu"), coul: coul("milieu") }); lab("aucun résultat", [330, 288], "middle");
    chemin(g, [[220, 320], [220, 430], [250, 430]], { ep: ep("bas") || ep("vigil"), coul: ch === "bas" || ch === "vigil" || ch === "sinon" ? C.jeu : C.encre }); lab("plusieurs résultats sans CIN", [228, 372]);
    boite(g, 252, 140, 140, 60, { titre: "Contrôler la cohérence via la CIN", taille: 13, rx: 8 });
    boite(g, 252, 400, 140, 60, { titre: "Contrôler la cohérence avec la date de naissance", taille: 12.5, rx: 8 });
    fleche(g, [394, 170], [398, 170], { ep: 2.5, tete: 8 }); losange([420, 170]);
    fleche(g, [394, 430], [398, 430], { ep: 2.5, tete: 8 }); losange([420, 430]);
    // issues de la branche CIN
    chemin(g, [[440, 170], [448, 170]], { ep: ep("haut"), coul: coul("haut") }); lab("cohérence", [444, 132]);
    boite(g, 450, 145, 104, 50, { titre: "Sélectionner l'identité", taille: 13, rx: 8 });
    chemin(g, [[420, 190], [420, 240], [480, 240], [480, 270]], { ep: ep("incoherent"), coul: coul("incoherent") }); lab("aucune cohérence", [428, 228]);
    // création
    boite(g, 442, 272, 112, 56, { titre: "Créer une nouvelle identité", taille: 13, rx: 8 });
    // issues de la branche date de naissance
    chemin(g, [[440, 430], [448, 430]], { ep: ep("bas"), coul: coul("bas") }); lab("cohérence", [444, 392]);
    boite(g, 450, 405, 104, 50, { titre: "Sélectionner l'identité", taille: 13, rx: 8 });
    chemin(g, [[420, 410], [420, 350], [500, 350], [500, 330]], { ep: ep("sinon"), coul: coul("sinon") }); lab("sinon", [428, 368]);
    chemin(g, [[420, 450], [420, 497], [448, 497]], { ep: ep("vigil"), coul: coul("vigil") }); lab("date non renseignée", [300, 512]);
    var fv = fin.vigil, bx = BPMN_FINS.vigil.box;
    boite(g, bx[0], bx[1], bx[2], bx[3], { titre: "Identito-vigilance", taille: 12, rx: 8, fond: fv === "ok" ? C.okPale : fv === "faux" ? C.fond : C.koPale, bord: fv === "ok" ? C.ok : C.ko, ep: fv === "ok" ? 4 : 2.5 });
    // fins
    [["haut", 170], ["milieu", 300], ["bas", 430]].forEach(function (f) {
      var c = BPMN_FINS[f[0]].c, st = fin[f[0]];
      fleche(g, [556, f[1]], [590, f[1]], { ep: 2.5, tete: 9 });
      s("circle", { cx: c[0], cy: c[1], r: 14, fill: st === "ok" ? C.ok : st === "faux" ? C.pale : C.koPale, stroke: st === "ok" ? C.ok : C.ko, "stroke-width": 4 }, g);
      texte(g, BPMN_FINS[f[0]].t, [c[0], c[1] + 30], { taille: 12.5, gras: 700, coul: st === "ok" ? C.ok : C.encre });
    });
    // base des identités
    s("polyline", { points: "524,330 524,344 656,344 656,548", fill: "none", stroke: C.doux, "stroke-width": 2, "stroke-dasharray": "3 4" }, g);
    icone(g, "base", [640, 566], 30, C.doux);
  }


  /* ---------- Figures des pages de cours (avec RM) ----------
     explorer : des boîtes à toucher ; chaque boîte touchée s'allume et son texte s'affiche sous la figure.
       f : figure RM (svg, direct), items [{ x, y, w, h, t, sous, texte, coul, pale, taille, haut (titre en haut de la boîte) }], o : { fond(g), devant(g, choisi), debut, taille } */
  function explorer(f, items, o) {
    o = o || {};
    var g = s("g", null, f.svg), choisi = o.debut === undefined ? -1 : o.debut;
    function dessiner() {
      vider(g);
      if (o.fond) o.fond(g, choisi);
      items.forEach(function (it, i) {
        var on = i === choisi, st = { coul: it.coul || C.acc, pale: it.pale || C.accPale };
        boite(g, it.x, it.y, it.w, it.h, { titre: it.haut ? null : it.t, sous: it.haut ? null : it.sous, taille: it.taille || o.taille || 18, tailleSous: it.tailleSous, fond: on ? st.pale : it.fond || "#fff", bord: on ? st.coul : it.bord || C.encre, ep: on ? 4.5 : 2.5, coul: on ? st.coul : C.encre, rx: it.rx });
        if (it.haut) texte(g, it.t, [it.x + it.w / 2, it.y + 34], { taille: it.taille || o.taille || 18, gras: 800, coul: on ? st.coul : C.encre, halo: false, largeur: it.w - 16 });
      });
      if (o.devant) o.devant(g, choisi);
      items.forEach(function (it, i) { cible(g, it.x, it.y, it.w, it.h, function () { choisi = i; dessiner(); }); });
      f.direct.innerHTML = choisi >= 0 ? "<strong>" + items[choisi].t + "</strong> : " + items[choisi].texte : (o.invite || "Touche un élément de la figure.");
    }
    dessiner();
    return { choisir: function (i) { choisi = i; dessiner(); }, g: g };
  }

  /* etapesFig : un chemin révélé étape par étape (boutons « Étape précédente / suivante »).
     f : figure RM, noeuds [{ x, y, w, h, t, sous }], textes [texte de chaque étape], o : { coul, fond(g, k), boucle, noms } */
  function etapesFig(f, noeuds, textes, o) {
    o = o || {};
    var g = s("g", null, f.svg), coul = o.coul || C.jeu, R = global.RM;
    function dessiner(k) {
      vider(g);
      if (o.fond) o.fond(g, k);
      for (var i = 1; i < Math.min(k, noeuds.length); i++) relier(g, noeuds[i - 1], noeuds[i], { coul: coul, ep: 4.5 });
      if (o.boucle && k >= noeuds.length) relier(g, noeuds[noeuds.length - 1], noeuds[0], { coul: coul, ep: 4.5, tirets: "10 7" });
      noeuds.forEach(function (nd, i) {
        var on = i < k, act = i === k - 1;
        boite(g, nd.x, nd.y, nd.w, nd.h, { titre: nd.t, sous: nd.sous, taille: nd.taille || o.taille || 18, tailleSous: nd.tailleSous, fond: act ? C.jeuPale : on ? "#fff" : C.fond, bord: on ? coul : C.trait, ep: act ? 4.5 : on ? 3 : 2, coul: on ? C.encre : C.gris });
        if (on) { s("circle", { cx: nd.x + 6, cy: nd.y + 6, r: 15, fill: coul }, g); texte(g, String(i + 1), [nd.x + 6, nd.y + 6], { taille: 15, coul: "#fff", halo: false, gras: 800 }); }
      });
      if (o.devant) o.devant(g, k);
      f.direct.innerHTML = k === 0 ? (o.depart || "Avance étape par étape.") : textes[k - 1];
    }
    var et = R.etapes(f.reglages, noeuds.length, [""].concat(o.noms || noeuds.map(function (nd) { return nd.t; })), dessiner);
    et.aller(o.debut === undefined ? 0 : o.debut);
    return et;
  }


  /* ---------- Scène d'une question : pictogrammes et légende de la situation, pour que la figure montre le cas posé ----------
     o : { icones: [noms], titre, sous } */
  function scene(g, o) {
    vider(g);
    s("rect", { x: 30, y: 110, width: 620, height: 380, rx: 28, fill: C.fond, stroke: C.trait, "stroke-width": 2 }, g);
    var ic = o.icones || [], nb = ic.length;
    ic.forEach(function (nom, i) { icone(g, nom, [340 + (i - (nb - 1) / 2) * 150, 225], 96, i === nb - 1 && o.alerte !== false && (nom === "alerte" || nom === "pirate") ? C.ko : C.encre); });
    texte(g, o.titre || "", [340, o.sous ? 355 : 375], { taille: 25, gras: 800, largeur: 540, halo: false });
    if (o.sous) texte(g, o.sous, [340, 430], { taille: 19, coul: C.doux, largeur: 540, halo: false, gras: 500 });
  }

  /* ---------- Rejouer une étape depuis l'écran de fin ----------
     Le moteur garde le même état n pour tout le niveau. Quand on rejoue la première étape, le niveau a déjà
     été mené à son état final : on relance init sur un dessin effacé pour que l'étape reparte de zéro.
     Usage dans un niveau : NIVEAU(SIS.rejouable({ id, init, etapes })). */
  function rejouable(def) {
    var fig, base = 0, vue = false, h = { cur: null, pl: { P: function (v) { return v; } } };
    function lancer() { h.cur = def.init(fig) || {}; if (h.cur.pl) h.pl = h.cur.pl; }
    return Object.assign({}, def, {
      init: function (f) { fig = f; base = f.svg.childNodes.length; lancer(); return h; },
      etapes: def.etapes.map(function (e, k) {
        return { nom: e.nom, jouer: function (j) {
          if (k === 0 && vue) { while (fig.svg.childNodes.length > base) fig.svg.removeChild(fig.svg.lastChild); lancer(); }
          if (k === 0) vue = true;
          e.jouer(j, h.cur);
        } };
      })
    });
  }

  // Grille de cartes : n cartes en « col » colonnes dans le rectangle [x, y, w] (hauteur h par carte, écart e)
  function grille(n, col, x, y, w, h, e) {
    var lw = (w - (col - 1) * e) / col;
    return function (i) { return { x: x + (i % col) * (lw + e), y: y + Math.floor(i / col) * (h + e), w: lw, h: h }; };
  }

  var A = { rejouable: rejouable, C: C, BACS: BACS, s: s, vider: vider, couper: couper, texte: texte, boite: boite, fleche: fleche, chemin: chemin, toucher: toucher, cible: cible, icone: icone, tableau: tableau, paires: paires, trace: trace, trier: trier, reperer: reperer, relier: relier, bord: bord, animer: animer, grille: grille, calc: calc, EDITEURS: EDITEURS, REGIONS: REGIONS, carteMaroc: carteMaroc, bpmnIdentite: bpmnIdentite, BPMN_FINS: BPMN_FINS, explorer: explorer, etapesFig: etapesFig, scene: scene };
  if (typeof module !== "undefined" && module.exports) module.exports = A;
  global.SIS = A;
})(typeof window !== "undefined" ? window : globalThis);
