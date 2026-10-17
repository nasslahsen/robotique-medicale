/* Essai B : atelier 3D en plein écran, missions, cadran, tableau de bord. */
(function () {
  "use strict";
  var DEG = E.DEG;
  var C = { x: "#e8364b", y: "#00a870", z: "#2f5bff", v: "#8a3ffc", acc: "#ff5a1f", encre: "#0b1530", doux: "#56607a" };
  var scene = document.getElementById("scene");
  var etat = { alpha: 0, az: 32, el: 24, fantome: null, flacon: false, aiguille: false, cibleV: false, verrou: false };
  var W = 0, H = 0, centre = [0, 0], ech = 1;
  var fc = function (x) { return E.tc(x, 3).replace("{,}", ",").replace("-", "\u2212"); };

  /* ---------------- Projection 3D ---------------- */
  function cam() {
    var a = etat.az * DEG, e = etat.el * DEG;
    return { r: [-Math.sin(a), Math.cos(a), 0], u: [-Math.cos(a) * Math.sin(e), -Math.sin(a) * Math.sin(e), Math.cos(e)], f: [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)] };
  }
  var K;
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function P(v) {
    var X = dot(v, K.r), Y = dot(v, K.u), d = dot(v, K.f), s = 9 / (9 - d);
    return [centre[0] + ech * s * X, centre[1] - ech * s * Y, d];
  }
  function tourne(M, v) { return E.mv(M, v); }
  function ajoute(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function fois(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function teinte(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return "rgb(" + Math.round(r * k) + "," + Math.round(g * k) + "," + Math.round(b * k) + ")";
  }
  var LUM = (function () { var l = [0.35, 0.45, 0.82], n = Math.hypot(l[0], l[1], l[2]); return [l[0] / n, l[1] / n, l[2] / n]; })();

  // Pavé : centre local c, demi-tailles h, dans le repère tourné M, posé en o
  function pave(liste, M, o, c, h, coul, op) {
    var S = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(function (s) {
      return ajoute(o, tourne(M, [c[0] + s[0] * h[0], c[1] + s[1] * h[1], c[2] + s[2] * h[2]]));
    });
    var F = [[[0, 1, 2, 3], [0, 0, -1]], [[4, 5, 6, 7], [0, 0, 1]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 3, 7, 6], [0, 1, 0]], [[1, 2, 6, 5], [1, 0, 0]], [[0, 3, 7, 4], [-1, 0, 0]]];
    F.forEach(function (f) {
      var n = tourne(M, f[1]); if (dot(n, K.f) <= 0.01) return;
      var pts = f[0].map(function (i) { return P(S[i]); });
      var d = pts.reduce(function (s, p) { return s + p[2]; }, 0) / 4;
      liste.push({ d: d, dessin: function (g) {
        E.s("polygon", { points: pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: teinte(coul, 0.62 + 0.38 * Math.max(0, dot(n, LUM))), stroke: C.encre, "stroke-width": 1.6, "stroke-linejoin": "round", opacity: op }, g);
      } });
    });
  }
  function cylindre(liste, o, r, h, coul, op) {
    var N = 28, bas = [], haut = [];
    for (var i = 0; i < N; i++) { var t = i / N * 2 * Math.PI; bas.push(ajoute(o, [r * Math.cos(t), r * Math.sin(t), 0])); haut.push(ajoute(o, [r * Math.cos(t), r * Math.sin(t), h])); }
    for (i = 0; i < N; i++) {
      var j = (i + 1) % N, tm = (i + 0.5) / N * 2 * Math.PI, n = [Math.cos(tm), Math.sin(tm), 0];
      if (dot(n, K.f) <= 0) continue;
      (function (q, n) {
        var d = q.reduce(function (s, p) { return s + p[2]; }, 0) / 4;
        liste.push({ d: d, dessin: function (g) { E.s("polygon", { points: q.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: teinte(coul, 0.62 + 0.38 * Math.max(0, dot(n, LUM))), stroke: teinte(coul, 0.62 + 0.38 * Math.max(0, dot(n, LUM))), "stroke-width": 0.8, opacity: op }, g); } });
      })([P(bas[i]), P(bas[j]), P(haut[j]), P(haut[i])], n);
    }
    var ph = haut.map(P), dh = ph.reduce(function (s, p) { return s + p[2]; }, 0) / N + 0.01;
    liste.push({ d: dh, dessin: function (g) {
      E.s("polygon", { points: ph.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: teinte(coul, 1), stroke: C.encre, "stroke-width": 1.6, opacity: op }, g);
    } });
  }
  function fleche3(liste, a, b, coul, ep, etiquette, op) {
    var pa = P(a), pb = P(b);
    liste.push({ d: (pa[2] + pb[2]) / 2 + 0.05, dessin: function (g) {
      var d = [pb[0] - pa[0], pb[1] - pa[1]], l = Math.hypot(d[0], d[1]); if (l < 4) return;
      var u = [d[0] / l, d[1] / l], t = 12 + ep * 2, w = 6 + ep, c = [pb[0] - u[0] * t, pb[1] - u[1] * t];
      E.s("line", { x1: pa[0], y1: pa[1], x2: c[0], y2: c[1], stroke: coul, "stroke-width": ep, "stroke-linecap": "round", opacity: op }, g);
      E.s("polygon", { points: [[pb[0], pb[1]], [c[0] - u[1] * w, c[1] + u[0] * w], [c[0] + u[1] * w, c[1] - u[0] * w]].map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: coul, opacity: op }, g);
      if (etiquette) {
        var e = E.s("text", { x: pb[0] + u[0] * 22, y: pb[1] + u[1] * 22, fill: coul, "font-size": 24, "font-weight": 700, "text-anchor": "middle", "dominant-baseline": "middle", "font-family": "Space Grotesk, sans-serif", "paint-order": "stroke", stroke: "#fff", "stroke-width": 6, opacity: op }, g);
        e.textContent = etiquette;
      }
    } });
  }
  function pince(liste, M, coul, op) {
    pave(liste, M, [0, 0, 0], [0.42, 0, 0.27], [0.58, 0.12, 0.08], coul, op);
    pave(liste, M, [0, 0, 0], [1.12, 0.1, 0.27], [0.13, 0.025, 0.06], coul, op);
    pave(liste, M, [0, 0, 0], [1.12, -0.1, 0.27], [0.13, 0.025, 0.06], coul, op);
  }

  /* ---------------- Dessin de la scène ---------------- */
  var tick = null;
  function dessiner() {
    if (tick) return;
    tick = requestAnimationFrame(function () { tick = null; dessinerMaintenant(); });
  }
  function dessinerMaintenant() {
    K = cam();
    E.vider(scene);
    var g = E.s("g", null, scene), liste = [];
    var a = etat.alpha * DEG, M = E.Rz(a);
    // sol : disque gradué comme un rapporteur
    var sol = []; for (var i = 0; i < 72; i++) { var t = i / 72 * 2 * Math.PI; sol.push(P([2.5 * Math.cos(t), 2.5 * Math.sin(t), 0])); }
    E.s("polygon", { points: sol.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: "#f5f7fc", stroke: "#dfe4ef", "stroke-width": 2 }, g);
    for (var d = -150; d <= 180; d += 30) {
      var r1 = d % 90 === 0 ? 2.25 : 2.35, q1 = P([r1 * Math.cos(d * DEG), r1 * Math.sin(d * DEG), 0]), q2 = P([2.5 * Math.cos(d * DEG), 2.5 * Math.sin(d * DEG), 0]);
      E.s("line", { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], stroke: "#c3cad9", "stroke-width": 2 }, g);
      var ql = P([2.75 * Math.cos(d * DEG), 2.75 * Math.sin(d * DEG), 0]);
      var tx = E.s("text", { x: ql[0], y: ql[1], "font-size": 14, fill: "#9aa3b8", "text-anchor": "middle", "dominant-baseline": "middle", "font-family": "JetBrains Mono, monospace" }, g);
      tx.textContent = String(d).replace("-", "\u2212") + "°";
    }
    // secteur de l'angle α
    if (Math.abs(etat.alpha) > 0.5) {
      var sect = [P([0, 0, 0])], n = Math.max(2, Math.ceil(Math.abs(etat.alpha) / 4));
      for (i = 0; i <= n; i++) { var tt = a * i / n; sect.push(P([0.9 * Math.cos(tt), 0.9 * Math.sin(tt), 0])); }
      E.s("polygon", { points: sect.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: "rgba(255,90,31,.16)", stroke: C.acc, "stroke-width": 2.5 }, g);
      var qa = P([1.08 * Math.cos(a / 2), 1.08 * Math.sin(a / 2), 0]);
      var ta = E.s("text", { x: qa[0], y: qa[1], "font-size": 24, "font-weight": 700, fill: C.acc, "text-anchor": "middle", "dominant-baseline": "middle", "font-family": "Space Grotesk, sans-serif" }, g); ta.textContent = "α";
    }
    // axes de R0 (fins) et de R1 (épais), au sol
    fleche3(liste, [0, 0, 0], [2.05, 0, 0], "#f2a3ad", 3.5, "x₀");
    fleche3(liste, [0, 0, 0], [0, 2.05, 0], "#8fd9bf", 3.5, "y₀");
    fleche3(liste, [0, 0, 0], [0, 0, 1.45], C.z, 4, "z₀ = z₁");
    fleche3(liste, [0, 0, 0], tourne(M, [1.55, 0, 0]), C.x, 6, "x₁");
    fleche3(liste, [0, 0, 0], tourne(M, [0, 1.3, 0]), C.y, 6, "y₁");
    // socle et pince
    cylindre(liste, [0, 0, 0], 0.3, 0.18, "#d6dbe7");
    if (etat.fantome !== null) pince(liste, E.Rz(etat.fantome * DEG), "#b9c0cf", 0.55);
    pince(liste, M, "#ffb38f");
    // flacon (mission 1)
    if (etat.flacon) {
      var pf = [1.6 * Math.cos(120 * DEG), 1.6 * Math.sin(120 * DEG), 0];
      cylindre(liste, pf, 0.16, 0.5, "#7fd3e6");
      cylindre(liste, ajoute(pf, [0, 0, 0.5]), 0.08, 0.12, "#2b3a5c");
    }
    // aiguille et cible (mission 5)
    if (etat.aiguille) {
      var V0 = tourne(M, [2, 1, 0]);
      fleche3(liste, tourne(M, [2, 0, 0]), V0, "rgba(0,168,112,.45)", 2.5);
      fleche3(liste, [0, 0, 0], tourne(M, [2, 0, 0]), "rgba(232,54,75,.45)", 2.5);
      fleche3(liste, [0, 0, 0.27], ajoute(V0, [0, 0, 0.27]), C.v, 5.5, "V");
    }
    if (etat.cibleV) {
      var pc = P([1.232, 1.866, 0.27]);
      liste.push({ d: pc[2], dessin: function (g) {
        E.s("circle", { cx: pc[0], cy: pc[1], r: 22, fill: "rgba(138,63,252,.14)", stroke: C.v, "stroke-width": 2.5, "stroke-dasharray": "5 5" }, g);
        E.s("circle", { cx: pc[0], cy: pc[1], r: 6, fill: C.v }, g);
      } });
    }
    liste.sort(function (p, q) { return p.d - q.d; }).forEach(function (o) { o.dessin(g); });
    document.getElementById("alpha").textContent = String(Math.round(etat.alpha)).replace("-", "\u2212") + "°";
    dessinerCadran();
    majMatrices();
  }

  function mesurer() {
    W = innerWidth; H = innerHeight;
    scene.setAttribute("viewBox", "0 0 " + W + " " + H);
    centre = [W * 0.6, 172 + (H - 172) * 0.4];
    ech = Math.min(W, H - 172) * 0.19;
    dessiner();
  }
  addEventListener("resize", mesurer);

  // tourner la vue en glissant sur le fond
  (function () {
    var dep = null;
    scene.addEventListener("pointerdown", function (e) { dep = [e.clientX, e.clientY, etat.az, etat.el, e.pointerId]; scene.setPointerCapture(e.pointerId); });
    scene.addEventListener("pointermove", function (e) {
      if (!dep || e.pointerId !== dep[4]) return;
      etat.az = dep[2] - (e.clientX - dep[0]) * 0.35;
      etat.el = Math.max(6, Math.min(75, dep[3] + (e.clientY - dep[1]) * 0.3));
      dessiner();
    });
    scene.addEventListener("pointerup", function () { dep = null; });
    scene.addEventListener("pointercancel", function () { dep = null; });
  })();

  /* ---------------- Cadran ---------------- */
  var bouton = document.getElementById("bouton"), cadran = document.getElementById("cadran");
  // Le cadran est vu de dessus avec la même orientation que la scène : son aiguille reste parallèle à la pince.
  function decalage() { var a = etat.az * DEG; return Math.atan2(-Math.cos(a), -Math.sin(a)) / DEG; }
  function dessinerCadran() {
    E.vider(bouton);
    var c = 118, th0 = decalage(), a = (etat.alpha + th0) * DEG, a0 = th0 * DEG;
    E.s("circle", { cx: c, cy: c, r: 112, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, bouton);
    for (var d = 0; d < 360; d += 15) {
      var long = d % 90 === 0, r0 = long ? 92 : 100;
      E.s("line", { x1: c + r0 * Math.cos(d * DEG), y1: c - r0 * Math.sin(d * DEG), x2: c + 108 * Math.cos(d * DEG), y2: c - 108 * Math.sin(d * DEG), stroke: long ? C.encre : "#b8bfce", "stroke-width": long ? 3 : 2 }, bouton);
    }
    // secteur α, depuis la direction de x₀
    if (Math.abs(etat.alpha) > 0.5) {
      var p0 = [c + 70 * Math.cos(a0), c - 70 * Math.sin(a0)], p1 = [c + 70 * Math.cos(a), c - 70 * Math.sin(a)];
      E.s("path", { d: "M" + c + " " + c + " L" + p0.join(" ") + " A70 70 0 " + (Math.abs(etat.alpha) > 180 ? 1 : 0) + " " + (etat.alpha > 0 ? 0 : 1) + " " + p1.join(" ") + " Z", fill: "rgba(255,90,31,.18)" }, bouton);
    }
    E.s("circle", { cx: c, cy: c, r: 64, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2.5 }, bouton);
    [["x₀", 0, "#e8364b"], ["y₀", 90, "#00a870"]].forEach(function (l) {
      var t = (th0 + l[1]) * DEG, q = [c + 40 * Math.cos(t), c - 40 * Math.sin(t)];
      E.s("line", { x1: c, y1: c, x2: c + 58 * Math.cos(t), y2: c - 58 * Math.sin(t), stroke: l[2], "stroke-width": 2, "stroke-dasharray": "3 4" }, bouton);
      var e = E.s("text", { x: q[0], y: q[1], fill: l[2], "font-size": 17, "font-weight": 700, "text-anchor": "middle", "dominant-baseline": "middle", "font-family": "Space Grotesk, sans-serif", "paint-order": "stroke", stroke: "#f3f5fa", "stroke-width": 5 }, bouton);
      e.textContent = l[0];
    });
    E.s("line", { x1: c, y1: c, x2: c + 84 * Math.cos(a), y2: c - 84 * Math.sin(a), stroke: C.acc, "stroke-width": 7, "stroke-linecap": "round" }, bouton);
    E.s("circle", { cx: c + 84 * Math.cos(a), cy: c - 84 * Math.sin(a), r: 16, fill: C.acc, stroke: C.encre, "stroke-width": 3 }, bouton);
    E.s("circle", { cx: c, cy: c, r: 9, fill: C.encre }, bouton);
  }
  E.glisser(bouton, bouton, function (p) {
    if (etat.verrou) return;
    var a = Math.round(E.angle360(Math.atan2(118 - p[1], p[0] - 118) / DEG - decalage()));
    if (a === 180 && etat.alpha < 0) a = -180;
    regler(a);
  }, function () { if (surRelache) surRelache(etat.alpha); });
  cadran.querySelectorAll(".fins button").forEach(function (b) {
    b.addEventListener("click", function () { if (!etat.verrou) { regler(E.angle360(Math.round(etat.alpha) + +b.dataset.d)); if (surRelache) surRelache(etat.alpha); } });
  });
  function regler(a) { etat.alpha = a; dessiner(); if (surAngle) surAngle(a); }
  function verrouiller(v) { etat.verrou = v; cadran.classList.toggle("verrou", v); }
  function animerAlpha(vers, duree, fin) {
    var de = etat.alpha;
    E.anime(duree || 700, function (e) { etat.alpha = de + (vers - de) * e; dessinerMaintenant(); }, function () { etat.alpha = vers; dessinerMaintenant(); if (fin) fin(); });
  }

  /* ---------------- Tableau de bord : matrices ---------------- */
  var zoneM = document.getElementById("matrices");
  var vue = { mode: "live", saisie: null, copie: null, choix: [], cible: null, marques: {} };
  var COULC = [C.x, C.y, C.z];
  function grille(nom, sous, valeurs, opts) {
    opts = opts || {};
    var h = '<div class="mat"><div class="nom">' + nom + (sous ? "<small>" + sous + "</small>" : "") + '</div><div class="grille">';
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
      var cls = "cel" + (opts.actif && opts.actif(i, j) ? " active" : "") + (opts.classe ? " " + (opts.classe(i, j) || "") : "");
      var coul = opts.couleur ? opts.couleur(i, j) : COULC[j];
      h += '<button type="button" class="' + cls + '" data-i="' + i + '" data-j="' + j + '" style="color:' + coul + '">' + valeurs(i, j) + "</button>";
    }
    return h + "</div></div>";
  }
  function majMatrices() {
    var R = E.Rz(etat.alpha * DEG), h = "";
    var live = function (i, j) { return fc(R[i][j]); };
    var nomR = "R<sup>0,1</sup>";
    if (vue.mode === "live") h = grille(nomR, "en direct", live);
    else if (vue.mode === "saisie") h = grille(nomR, "à compléter", function (i, j) { return j === 0 ? (vue.saisie[i] === null ? "?" : fc(vue.saisie[i])) : fc(R[i][j]); },
      { actif: function (i, j) { return j === 0 && !vue.fige; }, classe: function (i, j) { return vue.marques[i + "" + j]; } });
    else if (vue.mode === "copie") h = grille(nomR, "copie à corriger", function (i, j) { return fc(vue.copie[i][j]); },
      { actif: function () { return !vue.fige; }, classe: function (i, j) { return vue.marques[i + "" + j]; } });
    else if (vue.mode === "choix") h = grille(nomR, Math.round(etat.alpha) > 0 ? "à +30°" : "à " + String(Math.round(etat.alpha)).replace("-", "\u2212") + "°", live,
      { actif: function () { return !vue.fige; }, classe: function (i, j) { return vue.marques[i + "" + j] || (vue.choix.indexOf(i + "" + j) >= 0 ? "choisie" : ""); } });
    else if (vue.mode === "vecteur") {
      var V0 = E.mv(R, [2, 1, 0]);
      h = grille(nomR, "en direct", live) + '<span style="font-size:26px;font-weight:700">×</span><div class="vec">' + [2, 1, 0].map(function (x) { return "<span>" + x + "</span>"; }).join("") + '</div><span style="font-size:26px;font-weight:700">=</span><div class="mat"><div class="vec" id="v0">' + V0.map(function (x) { return "<span>" + fc(x) + "</span>"; }).join("") + "</div></div>";
    } else if (vue.mode === "cible") {
      var T = vue.cible;
      h = grille("Cible", "matrice donnée", function (i, j) { return fc(T[i][j]); }, { couleur: function () { return C.encre; } }) +
        grille(nomR, "ta pince", live, { classe: function (i, j) { return Math.abs(R[i][j] - T[i][j]) < 0.006 ? "bonne" : ""; } });
    }
    zoneM.innerHTML = h;
  }
  zoneM.addEventListener("click", function (ev) {
    var b = ev.target.closest(".cel.active"); if (!b || !surCellule) return;
    surCellule(+b.dataset.i, +b.dataset.j, b);
  });

  /* ---------------- Missions ---------------- */
  var carte = document.getElementById("carte"), debrief = document.getElementById("debrief"), points = document.getElementById("points");
  var surAngle = null, surRelache = null, surCellule = null, courante = 0, faites = [], atteinte = 0;
  var TAMPON = '<svg class="tampon" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26"/><path d="M15 27l7.5 7.5L38 19"/></svg>';
  function retour(ok, html) {
    var r = carte.querySelector(".retour"); r.className = "retour " + (ok ? "ok" : "ko"); r.innerHTML = html; E.rendre(r);
  }
  function onde(p) {
    var o = E.h("div", "onde", "", document.body); o.style.left = p[0] + "px"; o.style.top = p[1] + "px";
    setTimeout(function () { o.remove(); }, 1000);
  }
  function reussite(i, titre, corps) {
    surAngle = surRelache = surCellule = null; verrouiller(true);
    K = cam(); var bout = P(E.mv(E.Rz(etat.alpha * DEG), [1.2, 0, 0.27]));
    var r = scene.getBoundingClientRect(); onde([r.left + bout[0] * r.width / W, r.top + bout[1] * r.height / H]);
    var g = zoneM.querySelectorAll(".grille"); g.forEach(function (x) { x.classList.remove("flash"); void x.offsetWidth; x.classList.add("flash"); });
    if (faites.indexOf(i) < 0) faites.push(i);
    atteinte = Math.max(atteinte, i + 1); majPoints();
    setTimeout(function () {
      carte.classList.add("cache");
      debrief.innerHTML = '<div class="tete">' + TAMPON + "<h3>" + titre + '</h3></div><div class="corps">' + corps + '</div><div class="bas"></div>';
      E.rendre(debrief);
      var bas = debrief.querySelector(".bas");
      if (i + 1 < MISSIONS.length) { var b = E.h("button", "btn", "Mission suivante", bas); b.type = "button"; b.onclick = function () { aller(i + 1); }; }
      else { var b2 = E.h("button", "btn", "Rejouer depuis le début", bas); b2.type = "button"; b2.onclick = function () { aller(0); }; }
      var b3 = E.h("button", "btn blanc", "Rester sur la scène", bas); b3.type = "button";
      b3.onclick = function () { debrief.classList.remove("ouvert"); verrouiller(false); vue.mode = vue.mode === "cible" ? "cible" : "live"; dessiner(); };
      debrief.classList.add("ouvert");
    }, 650);
  }
  function carteHTML(i, titre, texte, actions) {
    carte.innerHTML = '<span class="etiq">MISSION ' + (i + 1) + " · " + MISSIONS[i].nom.toUpperCase() + "</span><h2>" + titre + "</h2><p>" + texte + '</p><div class="actions">' + (actions || "") + '</div><div class="retour"></div>';
    E.rendre(carte);
  }

  var MISSIONS = [
    { nom: "Viser", entrer: function () {
      Object.assign(etat, { fantome: null, flacon: true, aiguille: false, cibleV: false });
      vue.mode = "live"; verrouiller(false);
      carteHTML(0, "Tourne la pince vers le flacon.", "Utilise le cadran en bas à droite. Le tableau du haut affiche la matrice de la pince, en direct.");
      animerAlpha(0, 500);
      var fin = function (a) { if (E.ecartAngle(a, 120) < 2) { animerAlpha(120, 200); reussite(0, "Pince alignée sur le flacon", MISSIONS[0].debrief); } };
      surAngle = fin; surRelache = function (a) { if (E.ecartAngle(a, 120) < 4) fin(120); };
    }, debrief: '<div><p>Pendant que tu tournais, la première colonne suivait la pince. Elle donne la direction de \\(\\vec{x}_1\\), vue depuis \\(R_0\\).</p><p>Les trois colonnes sont les trois axes de la pince exprimés dans \\(R_0\\) : c\'est la matrice de rotation \\(R^{0,1}\\), notée aussi \\({}^0R_1\\), \\(R_{01}\\) ou \\(R^0_1\\).</p></div>' +
      '<div>\\[ [\\vec{x}_1]_{R_0} = \\begin{pmatrix} \\cos 120° \\\\ \\sin 120° \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} -0{,}5 \\\\ 0{,}866 \\\\ 0 \\end{pmatrix} \\]</div>' },

    { nom: "Lire", entrer: function () {
      Object.assign(etat, { fantome: null, flacon: false, aiguille: false, cibleV: false });
      verrouiller(true);
      animerAlpha(180, 900);
      vue.mode = "saisie"; vue.saisie = [null, null, null]; vue.marques = {}; vue.fige = false;
      carteHTML(1, "La pince est tournée de 180°. Remplis la première colonne.", "Touche une case de la colonne 1 pour faire défiler 1, 0, −1. Le cadran est bloqué.", '<button class="btn" type="button" id="valider" disabled>Valider</button>');
      var val = document.getElementById("valider");
      surCellule = function (i) {
        var cyc = [1, 0, -1], v = vue.saisie[i];
        vue.saisie[i] = v === null ? 1 : cyc[(cyc.indexOf(v) + 1) % 3]; delete vue.marques[i + "0"];
        val.disabled = vue.saisie.indexOf(null) >= 0; majMatrices();
      };
      val.onclick = function () {
        var juste = [-1, 0, 0], faux = 0;
        vue.saisie.forEach(function (v, i) { if (v !== juste[i]) { faux++; vue.marques[i + "0"] = "mauvaise"; } else vue.marques[i + "0"] = "bonne"; });
        majMatrices();
        if (faux) { retour(false, "Regarde la scène : à 180°, \\(\\vec{x}_1\\) pointe dans le sens opposé à \\(\\vec{x}_0\\)."); carte.classList.add("secoue"); setTimeout(function () { carte.classList.remove("secoue"); }, 400); return; }
        vue.fige = true; reussite(1, "Colonne lue sans calcul", MISSIONS[1].debrief);
      };
    }, debrief: '<div><p>La première colonne est \\([\\vec{x}_1]_{R_0}\\). À 180°, la pince pointe selon \\(-\\vec{x}_0\\) : \\((-1 ;\\ 0 ;\\ 0)\\). La formule du cours donne la même chose :</p></div>' +
      '<div>\\[ R_z(180°) = \\begin{pmatrix} \\cos 180° & -\\sin 180° & 0 \\\\ \\sin 180° & \\cos 180° & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} = \\begin{pmatrix} -1 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]</div>' },

    { nom: "Corriger", entrer: function () {
      Object.assign(etat, { fantome: null, flacon: false, aiguille: false, cibleV: false });
      verrouiller(true); animerAlpha(40, 900);
      var c = Math.cos(40 * DEG), s = Math.sin(40 * DEG);
      vue.mode = "copie"; vue.copie = [[c, -s, 0], [-s, c, 0], [0, 0, 1]]; vue.marques = {}; vue.fige = false;
      carteHTML(2, "Cette copie annonce \\(R_z(40°)\\). Une case est fausse : touche-la.", "La pince de la scène est à 40°. Compare chaque colonne avec l'axe qu'elle décrit.");
      surCellule = function (i, j, b) {
        if (i === 1 && j === 0) { vue.marques["10"] = "mauvaise"; vue.fige = true; majMatrices(); reussite(2, "Erreur trouvée", MISSIONS[2].debrief); return; }
        vue.marques[i + "" + j] = "bonne"; majMatrices();
        retour(false, "Cette case est juste. Vérifie le signe de chaque composante sur la scène.");
      };
    }, debrief: '<div><p>La colonne 1 est \\(\\vec{x}_1\\). À 40°, la pince pointe du côté de \\(+\\vec{y}_0\\) : sa composante sur \\(\\vec{y}_0\\) est \\(\\sin 40° = 0{,}643\\), positive.</p><p>Le signe moins ne va qu\'en haut de la colonne 2, dans \\(\\vec{y}_1\\).</p></div>' +
      '<div>\\[ R_z(\\alpha) = \\begin{pmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]</div>' },

    { nom: "Comparer", entrer: function () {
      Object.assign(etat, { fantome: -30, flacon: false, aiguille: false, cibleV: false });
      verrouiller(true); animerAlpha(30, 800);
      vue.mode = "choix"; vue.choix = []; vue.marques = {}; vue.fige = false;
      carteHTML(3, "La pince passe de +30° à −30°. Quelles cases changent de signe ?", "Prédis : touche les cases qui vont changer, puis valide. La pince grise montre la position à −30°.", '<button class="btn" type="button" id="valider" disabled>Valider</button>');
      var val = document.getElementById("valider");
      surCellule = function (i, j) {
        var k = i + "" + j, p = vue.choix.indexOf(k);
        if (p >= 0) vue.choix.splice(p, 1); else vue.choix.push(k);
        val.disabled = !vue.choix.length; majMatrices();
      };
      val.onclick = function () {
        vue.fige = true; val.disabled = true;
        var bon = ["01", "10"], juste = vue.choix.length === 2 && bon.every(function (k) { return vue.choix.indexOf(k) >= 0; });
        animerAlpha(-30, 1100, function () {
          vue.marques = {};
          bon.forEach(function (k) { vue.marques[k] = vue.choix.indexOf(k) >= 0 ? "bonne" : "mauvaise"; });
          vue.choix.forEach(function (k) { if (bon.indexOf(k) < 0) vue.marques[k] = "mauvaise"; });
          vue.choix = []; majMatrices();
          if (juste) { reussite(3, "Bonne prédiction", MISSIONS[3].debrief); return; }
          retour(false, "Pas tout à fait : les cases en vert sont celles qui ont changé de signe.");
          val.textContent = "Réessayer"; val.disabled = false;
          val.onclick = function () { MISSIONS[3].entrer(); };
        });
      };
    }, debrief: '<div><p>Seuls les sinus changent de signe, car \\(\\sin(-\\alpha) = -\\sin\\alpha\\) et \\(\\cos(-\\alpha) = \\cos\\alpha\\).</p><p>La pince a tourné dans l\'autre sens : \\(\\vec{x}_1\\) pointe maintenant du côté de \\(-\\vec{y}_0\\), d\'où le \\(-0{,}5\\) dans la colonne 1.</p></div>' +
      '<div>\\[ R_z(-30°) = \\begin{pmatrix} 0{,}866 & 0{,}5 & 0 \\\\ -0{,}5 & 0{,}866 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]</div>' },

    { nom: "Atteindre", entrer: function () {
      Object.assign(etat, { fantome: null, flacon: false, aiguille: true, cibleV: true });
      verrouiller(false); animerAlpha(-40, 700);
      vue.mode = "vecteur";
      carteHTML(4, "La pince tient une aiguille \\(V^1 = (2 ;\\ 1 ;\\ 0)\\). Tourne-la pour que la pointe touche la cible.", "L'aiguille est fixe dans la pince. Le tableau calcule \\(V^0 = R^{0,1}\\,V^1\\) en direct. La cible est en \\((1{,}232 ;\\ 1{,}866 ;\\ 0)\\).");
      var fin = function (a) { if (E.ecartAngle(a, 30) < 1.5) { animerAlpha(30, 200); reussite(4, "Cible atteinte à α = 30°", MISSIONS[4].debrief); } };
      surAngle = fin; surRelache = function (a) { if (E.ecartAngle(a, 30) < 3) fin(30); };
    }, debrief: '<div><p>Le tableau a fait ce calcul : 2 fois la colonne 1 plus 1 fois la colonne 2, puisque l\'aiguille fait 2 pas selon \\(\\vec{x}_1\\) et 1 pas selon \\(\\vec{y}_1\\).</p><p>Un vecteur fixe dans \\(R_1\\) se ramène dans \\(R_0\\) par \\(V^0 = R^{0,1}\\,V^1\\).</p></div>' +
      '<div>\\[ V^0 = \\begin{pmatrix} 0{,}866 \\times 2 - 0{,}5 \\times 1 \\\\ 0{,}5 \\times 2 + 0{,}866 \\times 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1{,}232 \\\\ 1{,}866 \\\\ 0 \\end{pmatrix} \\]</div>' },

    { nom: "Décoder", entrer: function () {
      Object.assign(etat, { fantome: null, flacon: false, aiguille: false, cibleV: false });
      verrouiller(false); animerAlpha(20, 600);
      vue.mode = "cible"; vue.cible = E.Rz(-70 * DEG);
      carteHTML(5, "Une autre pince a cette matrice. Retrouve son angle.", "Tourne le cadran jusqu'à ce que ta matrice soit identique à la cible. Lis d'abord la première colonne : elle dit où pointe \\(\\vec{x}_1\\).");
      var fin = function (a) { if (Math.round(a) === -70) reussite(5, "Matrice décodée : α = −70°", MISSIONS[5].debrief); };
      surAngle = fin; surRelache = fin;
    }, debrief: '<div><p>La première colonne \\((0{,}342 ;\\ -0{,}940 ;\\ 0)\\) a une composante négative sur \\(\\vec{y}_0\\) : la pince est tournée dans le sens horaire, de 70°.</p><p>À retenir : les colonnes de \\(R^{0,1}\\) sont les axes de \\(R_1\\) exprimés dans \\(R_0\\), et un vecteur fixe dans \\(R_1\\) donne \\(V^0 = R^{0,1}\\,V^1\\). Notations : \\(R^{i,j} = {}^iR_j = R_{ij} = R^i_j\\).</p></div>' +
      '<div>\\[ R_z(\\alpha) = \\begin{pmatrix} \\cos\\alpha & -\\sin\\alpha & 0 \\\\ \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\]</div>' }
  ];

  MISSIONS.forEach(function (m, i) {
    var b = E.h("button", "", String(i + 1), points); b.type = "button"; b.title = m.nom;
    b.addEventListener("click", function () { if (i <= atteinte) aller(i); });
  });
  function majPoints() {
    [].forEach.call(points.children, function (b, i) {
      b.className = (faites.indexOf(i) >= 0 ? "fait " : "") + (i === courante ? "courant" : "");
      b.disabled = i > atteinte;
    });
  }
  function aller(i) {
    surAngle = surRelache = surCellule = null;
    courante = i; atteinte = Math.max(atteinte, i);
    debrief.classList.remove("ouvert");
    carte.classList.add("cache");
    setTimeout(function () { MISSIONS[i].entrer(); majPoints(); dessiner(); carte.classList.remove("cache"); }, 250);
  }
  window.essaiB = { etat: etat, aller: aller, regler: regler };
  mesurer();
  aller(0);
})();
