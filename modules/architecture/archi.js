/*
 * Dessins propres au module Architecture hospitalière, partagés par les niveaux (jouer.html) et les pages de cours.
 * Boîtes étiquetées, flèches, chemins, pictogrammes de bloc opératoire, couleurs des zones et des flux, petits calculs.
 * Indépendant de D (jeu) et de RM (cours) : chargé après eux, il marche dans les deux.
 * Les calculs (ARCHI.calc) sont purs et testés par tests/math.test.js.
 */
(function (global) {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var P = global.PLATEFORME;

  var C = {
    encre: "#15171f", doux: "#5b6172", gris: "#9aa0ad", pale: "#eef0f5", trait: "#e3e6ee", fond: "#f6f7fa",
    ok: "#12a26b", okPale: "#e3f7ee", ko: "#e5484d", koPale: "#fdecec", acc: "#3b5bdb", accPale: "#e8edff",
    v: "#8b3fd9", vPale: "#f1e8fc",
    jeu: P ? P.couleur() : "#448361", jeuPale: P ? P.clair() : "#DBEDDB",
    // flux du bloc
    patient: "#8b3fd9", personnel: "#3b5bdb", propre: "#12a26b", sale: "#b4541a", dm: "#0f8a9d", public: "#9aa0ad"
  };
  // Gradation des zones : du public au restreint
  var ZONES = {
    publique: { nom: "Zone publique", court: "publique", fond: "#f1f3f7", bord: "#8a909c", texte: "#5b6172" },
    semi: { nom: "Zone semi-restreinte", court: "semi-restreinte", fond: "#e8edff", bord: "#3b5bdb", texte: "#2f4ab8" },
    restreinte: { nom: "Zone restreinte", court: "restreinte", fond: "#fdecec", bord: "#e5484d", texte: "#c4363b" }
  };

  /* ---------- SVG de base ---------- */
  function s(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var a in attrs || {}) if (attrs[a] !== undefined && attrs[a] !== null) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function vider(e) { while (e.firstChild) e.removeChild(e.firstChild); }

  // Coupe un texte en lignes d'environ « largeur » pixels (largeur moyenne d'un caractère : 0,55 × taille).
  function couper(t, largeur, taille) {
    if (!largeur) return String(t).split("\n");
    var max = Math.max(4, Math.floor(largeur / (taille * 0.5))), lignes = [];
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

  // Texte centré verticalement sur p, sur une ou plusieurs lignes, avec un halo blanc pour rester lisible.
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
      // titre et sous-titre empilés, centrés ensemble, même sur plusieurs lignes
      var ts = taille * 0.78, nT = couper(o.titre, w - 14, taille).length, nS = couper(o.sous, w - 14, ts).length;
      var hT = nT * taille * 1.22, hS = nS * ts * 1.22, haut = hT + hS + 4, y0 = cy - haut / 2;
      texte(gr, o.titre, [cx, y0 + hT / 2], { taille: taille, coul: o.coul, largeur: w - 14, halo: false, gras: o.gras || 700 });
      texte(gr, o.sous, [cx, y0 + hT + 4 + hS / 2], { taille: ts, coul: o.coulSous || C.doux, largeur: w - 14, halo: false, gras: 500 });
    } else if (o.titre) texte(gr, o.titre, [cx, cy], { taille: taille, coul: o.coul, largeur: w - 14, halo: false, gras: o.gras || 700 });
    return gr;
  }

  function fleche(g, a, b, o) {
    o = o || {};
    var coul = o.coul || C.encre, ep = o.ep || 4, d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]);
    if (l < 2) return null;
    var u = [d[0] / l, d[1] / l], t = o.tete || 9 + ep * 1.8, w = (o.tete || 9 + ep * 1.8) * 0.55, c = [b[0] - u[0] * t, b[1] - u[1] * t];
    var gr = s("g", { opacity: o.op }, g);
    s("line", { x1: a[0], y1: a[1], x2: c[0] + u[0], y2: c[1] + u[1], stroke: coul, "stroke-width": ep, "stroke-linecap": "round", "stroke-dasharray": o.tirets }, gr);
    s("polygon", { points: [b, [c[0] - u[1] * w, c[1] + u[0] * w], [c[0] + u[1] * w, c[1] - u[0] * w]].map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "), fill: coul }, gr);
    return gr;
  }

  // Chemin à travers plusieurs points, flèche au bout (et petites flèches à mi-segment si o.relais).
  function chemin(g, pts, o) {
    o = o || {};
    var gr = s("g", { opacity: o.op }, g), coul = o.coul || C.encre, ep = o.ep || 5;
    if (pts.length < 2) return gr;
    var d = "M" + pts.slice(0, -1).map(function (p) { return p[0] + " " + p[1]; }).join(" L");
    var a = pts[pts.length - 2], b = pts[pts.length - 1];
    s("path", { d: d + " L" + a[0] + " " + a[1], fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-dasharray": o.tirets }, gr);
    fleche(gr, a, b, { coul: coul, ep: ep, tirets: o.tirets });
    if (o.relais) for (var i = 0; i < pts.length - 2; i++) {
      var p = pts[i], q = pts[i + 1], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (L > 50) fleche(gr, [m[0] - (q[0] - p[0]) / L * 8, m[1] - (q[1] - p[1]) / L * 8], [m[0] + (q[0] - p[0]) / L * 10, m[1] + (q[1] - p[1]) / L * 10], { coul: coul, ep: ep, tete: 16 });
    }
    return gr;
  }

  // Zone tactile : un geste « toucher » (doigt, stylet ou souris), avec une cible d'au moins 48 px.
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

  /* ---------- Pictogrammes (traits épais, une couleur) ---------- */
  // nom, centre c, taille sz (côté du carré), couleur
  function icone(g, nom, c, sz, coul) {
    coul = coul || C.encre;
    var k = (sz || 40) / 40, gr = s("g", { transform: "translate(" + c[0] + " " + c[1] + ") scale(" + k + ")" }, g);
    var tr = { fill: "none", stroke: coul, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" };
    var pl = { fill: coul };
    function p(d, a) { return s("path", Object.assign({ d: d }, a || tr), gr); }
    switch (nom) {
      case "patient": // brancard avec un patient allongé
        p("M-18 6 H18 M-14 6 V14 M14 6 V14"); s("circle", Object.assign({ cx: -12, cy: -2, r: 5 }, pl), gr); p("M-6 -2 H16", Object.assign({}, tr, { "stroke-width": 7 })); break;
      case "personne": // soignant
        s("circle", Object.assign({ cx: 0, cy: -11, r: 7 }, pl), gr); p("M-13 17 V8 Q-13 -1 0 -1 Q13 -1 13 8 V17 Z", pl); break;
      case "equipe":
        [[-11, 2], [11, 2], [0, -2]].forEach(function (q, i) { s("circle", Object.assign({ cx: q[0], cy: q[1] - 10, r: 5.5 }, pl), gr); p("M" + (q[0] - 9) + " " + (q[1] + 15) + " V" + (q[1] + 6) + " Q" + (q[0] - 9) + " " + (q[1] - 2) + " " + q[0] + " " + (q[1] - 2) + " Q" + (q[0] + 9) + " " + (q[1] - 2) + " " + (q[0] + 9) + " " + (q[1] + 6) + " V" + (q[1] + 15) + " Z", Object.assign({}, pl, { stroke: "#fff", "stroke-width": i === 2 ? 2 : 0 })); }); break;
      case "boite": // carton, logistique
        p("M-15 -6 L0 -14 L15 -6 V12 L0 18 L-15 12 Z M-15 -6 L0 2 L15 -6 M0 2 V18"); break;
      case "poubelle":
        p("M-12 -8 H12 L10 16 H-10 Z M-15 -12 H15 M-5 -12 V-16 H5 V-12 M-4 -2 V11 M4 -2 V11"); break;
      case "instrument": // ciseaux et pince stylisés
        s("circle", { cx: -10, cy: 10, r: 5, fill: "none", stroke: coul, "stroke-width": 3 }, gr); s("circle", { cx: 2, cy: 12, r: 5, fill: "none", stroke: coul, "stroke-width": 3 }, gr); p("M-7 6 L12 -16 M-1 8 L4 -16"); break;
      case "eclair":
        p("M3 -18 L-10 3 H0 L-4 18 L10 -4 H0 Z", pl); break;
      case "goutte":
        p("M0 -17 Q13 0 13 6 A13 13 0 0 1 -13 6 Q-13 0 0 -17 Z"); break;
      case "air": // trois lignes de souffle
        p("M-16 -8 H8 A5 5 0 1 0 3 -13 M-16 0 H14 A5 5 0 1 1 9 5 M-16 8 H4"); break;
      case "porte":
        p("M-11 17 V-17 H11 V17 M-15 17 H15"); s("circle", Object.assign({ cx: 6, cy: 1, r: 2.4 }, pl), gr); break;
      case "lampe": // scialytique vu de face
        p("M0 -18 V-8 M-16 -2 A16 10 0 0 1 16 -2 Z", Object.assign({}, tr, { fill: coul, "fill-opacity": .15 })); p("M-8 6 L-12 16 M0 6 V17 M8 6 L12 16"); break;
      case "ecran":
        p("M-17 -13 H17 V9 H-17 Z M-6 17 H6 M0 9 V17"); p("M-12 0 H-6 L-3 -7 L1 5 L4 -2 H12"); break;
      case "feu":
        p("M0 18 C-12 18 -15 8 -11 0 C-8 -6 -5 -8 -4 -16 C2 -11 4 -6 3 -1 C6 -3 7 -6 7 -8 C13 -1 14 8 9 13 C7 16 4 18 0 18 Z"); break;
      case "cle": // maintenance
        p("M-14 14 L3 -3 M8 -16 A8 8 0 1 0 15 -9 L9 -9 L8 -15 Z"); break;
      case "bouclier":
        p("M0 -17 L14 -11 V0 Q14 12 0 18 Q-14 12 -14 0 V-11 Z M-6 0 L-1 5 L7 -5"); break;
      case "radiation":
        s("circle", Object.assign({ cx: 0, cy: 0, r: 3.5 }, pl), gr);
        [0, 120, 240].forEach(function (a) { s("path", Object.assign({ d: "M-5.5 -6 L-9 -15 A17 17 0 0 1 9 -15 L5.5 -6 A8 8 0 0 0 -5.5 -6 Z", transform: "rotate(" + a + ")" }, pl), gr); }); break;
      case "thermo":
        p("M-3 6 V-14 A3 3 0 0 1 3 -14 V6 A7 7 0 1 1 -3 6 Z"); s("circle", Object.assign({ cx: 0, cy: 11, r: 3.5 }, pl), gr); break;
      case "reseau":
        [[-12, 12], [12, 12], [0, -12]].forEach(function (q) { s("rect", Object.assign({ x: q[0] - 6, y: q[1] - 5, width: 12, height: 10, rx: 2 }, pl), gr); }); p("M0 -7 V3 M-12 7 V3 H12 V7"); break;
      case "table": // table opératoire vue de côté
        p("M-18 -4 H18 M0 -4 V12 M-10 16 H10"); break;
      case "lit":
        p("M-18 12 V-10 M-18 2 H18 V12 M-18 -2 H-8"); s("circle", Object.assign({ cx: -12, cy: -7, r: 4 }, pl), gr); break;
      case "bruit":
        p("M-16 -5 H-9 L-1 -12 V12 L-9 5 H-16 Z", Object.assign({}, tr, { fill: coul })); p("M5 -6 Q9 0 5 6 M10 -11 Q17 0 10 11"); break;
      default:
        s("circle", { r: 14, fill: "none", stroke: coul, "stroke-width": 3 }, gr);
    }
    return gr;
  }


  /* ---------- Appariement sur la figure : toucher un élément à gauche, puis son partenaire à droite ----------
     cfg : g, gauche [textes], droite [textes], bon [indice à droite pour chaque élément de gauche],
           xg, wg, xd, wd, y0, h, pas, taille, erreur(msg), info(msg), fin(), aide(i, k) -> message */
  function paires(cfg) {
    var lie = cfg.gauche.map(function () { return -1; }), sel = -1, faux = -1, fini = false;
    var p = { lie: lie };
    function yG(i) { return cfg.y0 + i * cfg.pas; }
    p.dessiner = function () {
      var g = cfg.g; vider(g);
      if (cfg.fond) cfg.fond(g);
      cfg.gauche.forEach(function (t, i) {
        var ok = lie[i] >= 0, on = sel === i;
        boite(g, cfg.xg, yG(i), cfg.wg, cfg.h, { fond: on ? C.jeu : ok ? C.jeuPale : "#fff", bord: on || ok ? C.jeu : C.trait, ep: on ? 3.5 : 2.5, rx: 10, titre: t, taille: cfg.taille || 16, coul: on ? "#fff" : C.encre });
        cible(g, cfg.xg, yG(i), cfg.wg, cfg.h, function () { if (fini || lie[i] >= 0) return; sel = i; faux = -1; p.dessiner(); });
      });
      cfg.droite.forEach(function (t, k) {
        var i = lie.indexOf(k), ok = i >= 0;
        boite(g, cfg.xd, yG(k), cfg.wd, cfg.h, { fond: faux === k ? C.koPale : ok ? C.okPale : "#fff", bord: faux === k ? C.ko : ok ? C.ok : C.trait, ep: 2.5, rx: 10, titre: t, taille: cfg.tailleD || cfg.taille || 16, gras: 500 });
        cible(g, cfg.xd, yG(k), cfg.wd, cfg.h, function () { p.toucher(k); });
      });
      lie.forEach(function (k, i) {
        if (k < 0) return;
        s("line", { x1: cfg.xg + cfg.wg, y1: yG(i) + cfg.h / 2, x2: cfg.xd, y2: yG(k) + cfg.h / 2, stroke: C.ok, "stroke-width": 3.5, "stroke-linecap": "round" }, cfg.g);
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
    // pour « Voir la réponse » : relie tout ce qui reste
    p.resoudre = function () { lie.forEach(function (k, i) { if (k < 0 && !fini) { sel = i; p.toucher(cfg.bon[i]); } }); };
    p.dessiner();
    return p;
  }


  // Point où le segment du centre de la boîte b vers q sort de la boîte (pour que les flèches partent du bord).
  function bord(b, q, marge) {
    var c = [b.x + b.w / 2, b.y + b.h / 2], d = [q[0] - c[0], q[1] - c[1]], m = marge || 6;
    var tx = d[0] ? (b.w / 2 + m) / Math.abs(d[0]) : Infinity, ty = d[1] ? (b.h / 2 + m) / Math.abs(d[1]) : Infinity, t = Math.min(tx, ty, 1);
    return [c[0] + d[0] * t, c[1] + d[1] * t];
  }
  function relier(g, a, b, o) {
    var ca = [a.x + a.w / 2, a.y + a.h / 2], cb = [b.x + b.w / 2, b.y + b.h / 2];
    return fleche(g, bord(a, cb), bord(b, ca, 4), o);
  }

  /* ---------- Tracer un flux : toucher les étapes dans l'ordre ----------
     cfg : g, noeuds [{ t, x, y, w, h }], ordre [indices], coul, taille, erreur(msg), aide(i, attendu) -> msg, fin(), boucle */
  function trace(cfg) {
    var pris = [], fini = false, faux = -1, p = {};
    p.dessiner = function () {
      var g = cfg.g; vider(g);
      if (cfg.fond) cfg.fond(g);
      cfg.noeuds.forEach(function (nd, i) {
        var k = pris.indexOf(i), on = k >= 0;
        boite(g, nd.x, nd.y, nd.w, nd.h, { fond: faux === i ? C.koPale : on ? "#fff" : C.fond, bord: faux === i ? C.ko : on ? cfg.coul : C.trait, ep: on ? 3.5 : 2, rx: 12, titre: nd.t, taille: cfg.taille || 16, coul: on ? C.encre : C.doux });
        if (on) {
          s("circle", { cx: nd.x + 4, cy: nd.y + 4, r: 13, fill: cfg.coul }, g);
          texte(g, String(k + 1), [nd.x + 4, nd.y + 4], { taille: 14, coul: "#fff", halo: false, gras: 800 });
        }
        cible(g, nd.x, nd.y, nd.w, nd.h, function () { p.toucher(i); });
      });
      for (var k = 1; k < pris.length; k++) relier(g, cfg.noeuds[pris[k - 1]], cfg.noeuds[pris[k]], { coul: cfg.coul, ep: 5 });
      if (fini && cfg.boucle) relier(g, cfg.noeuds[pris[pris.length - 1]], cfg.noeuds[pris[0]], { coul: cfg.coul, ep: 5, tirets: "10 7" });
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

  // Petites flèches d'air qui avancent le long d'une direction (u de 0 à 1) : sens de l'air entre deux pièces.
  function souffle(g, a, b, u, o) {
    o = o || {};
    var nb = o.nb || 4, ec = o.ecart || 26, d = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(d[0], d[1]), v = [d[0] / L, d[1] / L], perp = [-v[1], v[0]];
    for (var k = 0; k < nb; k++) {
      var off = (k - (nb - 1) / 2) * ec, ph = ((u * (o.vitesse || 2.5)) + k * 0.37) % 1;
      var c = [a[0] + d[0] * ph + perp[0] * off, a[1] + d[1] * ph + perp[1] * off];
      fleche(g, [c[0] - v[0] * 14, c[1] - v[1] * 14], [c[0] + v[0] * 14, c[1] + v[1] * 14], { coul: o.coul || C.acc, ep: 3, tete: 11, op: Math.sin(Math.PI * ph) });
    }
  }

  /* ---------- Calculs (testés dans tests/math.test.js) ---------- */
  var calc = {
    // volume d'une salle (m³)
    volume: function (L, l, h) { return L * l * h; },
    // renouvellements d'air par heure : débit d'air soufflé (m³/h) divisé par le volume de la salle (m³)
    ach: function (debit, volume) { return debit / volume; },
    // débit nécessaire pour atteindre n renouvellements par heure
    debitPour: function (n, volume) { return n * volume; },
    // salle hybride (FGI 2022, cité au cours) : surface libre ≥ 55,74 m² et dimension libre ≥ 6,10 m
    hybrideOk: function (L, l) { return L * l >= 55.74 - 1e-9 && Math.min(L, l) >= 6.10 - 1e-9; },
    // sens de l'air à travers une porte ouverte : de la pression la plus haute vers la plus basse
    sensAir: function (pA, pB) { return pA > pB ? 1 : pA < pB ? -1 : 0; },
    // scialytique (modèle plan) : part des foyers xs (à la hauteur yS) qui éclairent le point xf du champ (hauteur yF)
    // sans être cachés par l'obstacle [o1 ; o2] placé à la hauteur yO (tête et mains de l'équipe)
    lumiere: function (xs, xf, g) {
      var vus = xs.filter(function (x) { var xo = x + (xf - x) * (g.yO - g.yS) / (g.yF - g.yS); return xo < g.o1 || xo > g.o2; }).length;
      return vus / xs.length;
    },
    // positions de k foyers répartis sur un écartement e autour de c
    foyers: function (k, e, c) { var r = []; for (var i = 0; i < k; i++) r.push(k === 1 ? c : c - e + 2 * e * i / (k - 1)); return r; },
    // conversion pied carré, pied -> m², m
    pi2VersM2: function (x) { return x * 0.09290304; },
    piVersM: function (x) { return x * 0.3048; }
  };


  /* ---------- Rejouer une étape depuis l'écran de fin ----------
     Le moteur garde le même état n pour tout le niveau. Quand on rejoue la première étape, le niveau a déjà
     été mené à son état final : on relance init sur un dessin effacé pour que l'étape reparte de zéro.
     Usage dans un niveau : NIVEAU(ARCHI.rejouable({ id, init, etapes })). */
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

  var A = { rejouable: rejouable, C: C, ZONES: ZONES, s: s, vider: vider, couper: couper, texte: texte, boite: boite, fleche: fleche, chemin: chemin, toucher: toucher, cible: cible, icone: icone, paires: paires, trace: trace, relier: relier, bord: bord, animer: animer, souffle: souffle, calc: calc };
  if (typeof module !== "undefined" && module.exports) module.exports = A;
  global.ARCHI = A;
})(typeof window !== "undefined" ? window : globalThis);
