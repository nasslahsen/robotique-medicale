/*
 * Widgets interactifs du site (JavaScript sans dépendance).
 * Chaque widget se monte sur un <div class="widget" data-widget="nom"></div>.
 * Les fonctions mathématiques pures sont regroupées dans RM.math pour être testées (tests/test_math.js).
 */
(function (global) {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Mathématiques                                                        */
  /* ------------------------------------------------------------------ */

  var DEG = Math.PI / 180;

  function matMul(A, B) {
    var n = A.length, m = B[0].length, k = B.length, C = [];
    if (A[0].length !== k) throw new Error("dimensions incompatibles");
    for (var i = 0; i < n; i++) {
      C.push([]);
      for (var j = 0; j < m; j++) {
        var s = 0;
        for (var l = 0; l < k; l++) s += A[i][l] * B[l][j];
        C[i].push(s);
      }
    }
    return C;
  }

  function transpose(A) {
    return A[0].map(function (_, j) { return A.map(function (row) { return row[j]; }); });
  }

  function matVec(A, v) {
    return A.map(function (row) { return row.reduce(function (s, a, j) { return s + a * v[j]; }, 0); });
  }

  function det3(R) {
    return R[0][0] * (R[1][1] * R[2][2] - R[1][2] * R[2][1])
         - R[0][1] * (R[1][0] * R[2][2] - R[1][2] * R[2][0])
         + R[0][2] * (R[1][0] * R[2][1] - R[1][1] * R[2][0]);
  }

  // Rotations élémentaires, telles qu'écrites dans le cours (chapitre 2, 3-4-2).
  function Rz(a) { var c = Math.cos(a), s = Math.sin(a); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; }
  function Ry(b) { var c = Math.cos(b), s = Math.sin(b); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]; }
  function Rx(g) { var c = Math.cos(g), s = Math.sin(g); return [[1, 0, 0], [0, c, -s], [0, s, c]]; }

  // R^{0,s} = Rz(α) Ry(β) Rx(γ) (convention ZYX, axes mobiles).
  function eulerZYX(a, b, g) { return matMul(matMul(Rz(a), Ry(b)), Rx(g)); }
  // Variante XYZ du cours : Rx(γ) Ry(β) Rz(α).
  function eulerXYZ(a, b, g) { return matMul(matMul(Rx(g), Ry(b)), Rz(a)); }

  // T = [R p ; 0 0 0 1]
  function homog(R, p) {
    return [
      [R[0][0], R[0][1], R[0][2], p[0]],
      [R[1][0], R[1][1], R[1][2], p[1]],
      [R[2][0], R[2][1], R[2][2], p[2]],
      [0, 0, 0, 1]
    ];
  }

  // Bras plan à deux segments (chapitre 2, partie 3, exemple 3-2).
  function bras2R(t1, t2, l1, l2) {
    var T01 = homog(Rz(t1), [0, 0, 0]);          // O0 = O1
    var T12 = homog(Rz(t2), [l1, 0, 0]);         // O2 en bout du segment 1, dans R1
    var T02 = matMul(T01, T12);
    var M = matVec(T02, [l2, 0, 0, 1]);          // M en bout du segment 2 : M^2 = (l2, 0, 0)
    var O2 = matVec(T01, [l1, 0, 0, 1]);
    return { T01: T01, T12: T12, T02: T02, M: M.slice(0, 3), O2: O2.slice(0, 3) };
  }

  function cross(u, v) {
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  }
  function dot(u, v) { return u[0] * v[0] + u[1] * v[1] + u[2] * v[2]; }

  function versCylindrique(x, y, z) {
    return { r: Math.sqrt(x * x + y * y), theta: Math.atan2(y, x), z: z };
  }
  function versCartesien(r, theta, z) {
    return { x: r * Math.cos(theta), y: r * Math.sin(theta), z: z };
  }

  var math = {
    DEG: DEG, matMul: matMul, transpose: transpose, matVec: matVec, det3: det3,
    Rx: Rx, Ry: Ry, Rz: Rz, eulerZYX: eulerZYX, eulerXYZ: eulerXYZ, homog: homog,
    bras2R: bras2R, cross: cross, dot: dot,
    versCylindrique: versCylindrique, versCartesien: versCartesien
  };

  var RM = { math: math };
  if (typeof module !== "undefined" && module.exports) module.exports = RM;
  global.RM = RM;
  if (typeof document === "undefined") return;

  /* ------------------------------------------------------------------ */
  /* Outils d'affichage                                                   */
  /* ------------------------------------------------------------------ */

  // Nombre au format français : virgule décimale, vrai signe moins.
  function fmt(x, d) {
    if (d === undefined) d = 3;
    if (Math.abs(x) < 0.5 * Math.pow(10, -d)) x = 0;
    var s = x.toFixed(d).replace(".", ",");
    return s.charAt(0) === "-" ? "−" + s.slice(1) : s;
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function cadre(root, titre) {
    root.innerHTML = "";
    root.appendChild(el("p", { "class": "w-titre" }, titre));
    var corps = el("div", { "class": "w-corps" });
    root.appendChild(corps);
    return corps;
  }

  // Curseur avec étiquette et valeur affichée.
  function curseur(parent, label, min, max, pas, val, unite, onInput) {
    var lab = el("label", { "class": "curseur" });
    var span = el("span", null, label);
    var inp = el("input", { type: "range", min: min, max: max, step: pas, value: val });
    var out = el("output");
    var dec = pas < 1 ? (pas < 0.1 ? 2 : 1) : 0;
    function maj() { out.textContent = fmt(parseFloat(inp.value), dec) + (unite || ""); }
    inp.addEventListener("input", function () { maj(); onInput(); });
    lab.appendChild(span); lab.appendChild(inp); lab.appendChild(out);
    parent.appendChild(lab);
    maj();
    return { get: function () { return parseFloat(inp.value); },
             set: function (v) { inp.value = v; maj(); } };
  }

  function toile(parent, w, h) {
    var c = el("canvas");
    var dpr = window.devicePixelRatio || 1;
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + "px";
    c.style.aspectRatio = w + " / " + h;
    var ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    parent.appendChild(c);
    return { c: c, ctx: ctx, w: w, h: h };
  }

  // Coordonnées du pointeur dans le repère logique de la toile.
  function pointeur(t, ev) {
    var r = t.c.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * t.w / r.width, y: (ev.clientY - r.top) * t.h / r.height };
  }

  function fleche(ctx, x0, y0, x1, y1, couleur, epaisseur, tirets) {
    var a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 1) return;
    var h = Math.min(9, L * 0.35);
    ctx.save();
    ctx.strokeStyle = couleur; ctx.fillStyle = couleur;
    ctx.lineWidth = epaisseur || 2;
    if (tirets) ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(x0, y0);
    ctx.lineTo(x1 - h * 0.8 * Math.cos(a), y1 - h * 0.8 * Math.sin(a)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - h * Math.cos(a - 0.4), y1 - h * Math.sin(a - 0.4));
    ctx.lineTo(x1 - h * Math.cos(a + 0.4), y1 - h * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function texte(ctx, s, x, y, couleur, taille, align) {
    ctx.save();
    ctx.fillStyle = couleur || "#1d2330";
    ctx.font = (taille || 13) + "px 'Source Sans 3', sans-serif";
    ctx.textAlign = align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(s, x, y);
    ctx.restore();
  }

  function effacer(t) { t.ctx.clearRect(0, 0, t.w, t.h); }

  // Matrice HTML à valeurs numériques.
  function matHTML(M, d) {
    var n = M[0].length;
    var h = '<span class="mat" style="grid-template-columns: repeat(' + n + ', auto)">';
    M.forEach(function (row) { row.forEach(function (v) { h += "<span>" + fmt(v, d === undefined ? 3 : d) + "</span>"; }); });
    return h + "</span>";
  }

  function vecHTML(v, d) { return matHTML(v.map(function (x) { return [x]; }), d); }

  var C = { x: "#c0392b", y: "#1e8449", z: "#2f4fa8", alt: "#7d3c98", gris: "#9aa1ad", texte: "#1d2330", doux: "#e9ecf2" };

  /* ------------------------------------------------------------------ */
  /* Widgets                                                              */
  /* ------------------------------------------------------------------ */

  var W = {};

  /* Cours 3 : produits scalaires, vectoriels et projections entre R1 et R2 */
  W["deux-reperes"] = function (root) {
    var corps = cadre(root, "Deux repères R<sub>1</sub> et R<sub>2</sub> en rotation d'un angle α autour de z<sub>1</sub> = z<sub>2</sub>");
    var t = toile(corps, 320, 300);
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var a = curseur(p, "Angle α", -180, 180, 1, 30, "°", dessiner);
    var sortie = el("div"); p.appendChild(sortie);
    p.appendChild(el("p", { "class": "w-note" }, "Les vecteurs des deux repères sont unitaires : chaque produit scalaire vaut le cosinus de l'angle entre les deux axes. z<sub>1</sub> = z<sub>2</sub> sort de l'écran, vers vous."));

    function dessiner() {
      var al = a.get() * DEG, ca = Math.cos(al), sa = Math.sin(al);
      var ctx = t.ctx, O = { x: 160, y: 160 }, L = 110;
      effacer(t);
      // z vers l'observateur
      ctx.strokeStyle = C.texte; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(O.x, O.y, 7, 0, 2 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(O.x, O.y, 2, 0, 2 * Math.PI); ctx.fill();
      fleche(ctx, O.x, O.y, O.x + L, O.y, C.z, 2); texte(ctx, "x₁", O.x + L + 6, O.y + 12, C.z, 14);
      fleche(ctx, O.x, O.y, O.x, O.y - L, C.z, 2); texte(ctx, "y₁", O.x + 8, O.y - L, C.z, 14);
      fleche(ctx, O.x, O.y, O.x + L * ca, O.y - L * sa, C.alt, 2);
      texte(ctx, "x₂", O.x + (L + 14) * ca, O.y - (L + 14) * sa, C.alt, 14, "center");
      fleche(ctx, O.x, O.y, O.x - L * sa, O.y - L * ca, C.alt, 2);
      texte(ctx, "y₂", O.x - (L + 14) * sa, O.y - (L + 14) * ca, C.alt, 14, "center");
      // arc α entre x1 et x2
      ctx.strokeStyle = C.texte; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(O.x, O.y, 40, 0, -al, al > 0); ctx.stroke();
      texte(ctx, "α", O.x + 50 * Math.cos(al / 2), O.y - 50 * Math.sin(al / 2), C.texte, 14, "center");

      var c = fmt(ca), s = fmt(sa), ms = fmt(-sa), mc = fmt(-ca);
      sortie.innerHTML =
        '<table class="w-tab"><tr><th>Produit scalaire</th><th>Expression</th><th>Valeur</th></tr>' +
        "<tr><td>x₁ · y₁, z₂ · x₁, z₂ · y₁, x₂ · z₁</td><td>0</td><td class='num'>0</td></tr>" +
        "<tr><td>x₁ · x₂ = y₁ · y₂</td><td>cos α</td><td class='num'>" + c + "</td></tr>" +
        "<tr><td>y₁ · x₂</td><td>cos(π/2 − α) = sin α</td><td class='num'>" + s + "</td></tr>" +
        "<tr><td>x₁ · y₂ = y₂ · x₁</td><td>cos(π/2 + α) = −sin α</td><td class='num'>" + ms + "</td></tr></table>" +
        '<table class="w-tab"><tr><th>Produit vectoriel</th><th>Résultat</th></tr>' +
        "<tr><td>x₁ ∧ x₂ = y₁ ∧ y₂</td><td>sin α z₁ = " + s + " z₁</td></tr>" +
        "<tr><td>x₁ ∧ y₂</td><td>cos α z₁ = " + c + " z₁</td></tr>" +
        "<tr><td>y₁ ∧ x₂ = y₂ ∧ x₁</td><td>−cos α z₁ = " + mc + " z₁</td></tr>" +
        "<tr><td>x₂ ∧ x₁ = y₂ ∧ y₁</td><td>−sin α z₁ = " + ms + " z₁</td></tr>" +
        "<tr><td>z₂ ∧ x₁ ; z₂ ∧ y₁ ; x₂ ∧ z₁</td><td>y₁ ; −x₁ ; −y₂</td></tr></table>" +
        '<table class="w-tab"><tr><th>Projection</th><th>Composantes</th></tr>' +
        "<tr><td>[x₂]<sub>R₁</sub></td><td>(" + c + " ; " + s + " ; 0)</td></tr>" +
        "<tr><td>[y₂]<sub>R₁</sub></td><td>(" + ms + " ; " + c + " ; 0)</td></tr>" +
        "<tr><td>[x₁]<sub>R₂</sub></td><td>(" + c + " ; " + ms + " ; 0)</td></tr>" +
        "<tr><td>[y₁]<sub>R₂</sub></td><td>(" + s + " ; " + c + " ; 0)</td></tr></table>";
    }
    dessiner();
  };

  /* Cours 3 : règle d'or du produit matriciel */
  W["produit-matriciel"] = function (root) {
    var corps = cadre(root, "Produit matriciel A × B : dimensions et calcul d'un élément");
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var ligne = el("div", { "class": "w-ligne" });
    ligne.innerHTML = 'A : [<input type="number" min="1" max="4" value="3" data-k="m"> × <input type="number" min="1" max="4" value="2" data-k="n">] &nbsp; ' +
      'B : [<input type="number" min="1" max="4" value="2" data-k="n2"> × <input type="number" min="1" max="4" value="4" data-k="p">]';
    p.appendChild(ligne);
    var verdict = el("p", { "class": "w-ligne" }); p.appendChild(verdict);
    var grilles = el("div", { "class": "mat-bloc" }); p.appendChild(grilles);
    var formule = el("p", { "class": "w-ligne" }); p.appendChild(formule);
    p.appendChild(el("p", { "class": "w-note" }, "Cliquez sur un élément du résultat pour voir la ligne de A et la colonne de B qui le donnent."));
    var sel = { i: 0, k: 0 };

    function val(k) { return Math.max(1, Math.min(4, parseInt(ligne.querySelector('[data-k="' + k + '"]').value, 10) || 1)); }

    function grille(nom, lignes, cols, cellule, surligne, cliquable) {
      var h = '<span class="mat-nom">' + nom + "</span>";
      h += '<span class="mat" style="grid-template-columns: repeat(' + cols + ', auto)">';
      for (var i = 0; i < lignes; i++) for (var j = 0; j < cols; j++) {
        var st = surligne(i, j) ? ' style="background:#e8ecf8;font-weight:600"' : "";
        var dc = cliquable ? ' data-i="' + i + '" data-j="' + j + '" ' : "";
        h += "<span" + st + dc + (cliquable ? ' role="button" tabindex="0"' : "") + ">" + cellule(i, j) + "</span>";
      }
      return h + "</span>";
    }

    function maj() {
      var m = val("m"), n = val("n"), n2 = val("n2"), pp = val("p");
      if (n !== n2) {
        verdict.innerHTML = '<span class="w-alerte">Impossible</span> : A a ' + n + " colonne(s) mais B a " + n2 + " ligne(s). Il faut nombre de colonnes de A = nombre de lignes de B.";
        grilles.innerHTML = ""; formule.innerHTML = ""; return;
      }
      if (sel.i >= m) sel.i = 0;
      if (sel.k >= pp) sel.k = 0;
      verdict.innerHTML = "Possible : [" + m + " × " + n + "] × [" + n + " × " + pp + "] donne une matrice [" + m + " × " + pp + "].";
      grilles.innerHTML =
        grille("A", m, n, function (i, j) { return "a<sub>" + (i + 1) + (j + 1) + "</sub>"; }, function (i) { return i === sel.i; }) +
        grille("B", n, pp, function (i, j) { return "b<sub>" + (i + 1) + (j + 1) + "</sub>"; }, function (i, j) { return j === sel.k; }) +
        "<span>=</span>" +
        grille("C", m, pp, function (i, j) { return "c<sub>" + (i + 1) + (j + 1) + "</sub>"; }, function (i, j) { return i === sel.i && j === sel.k; }, true);
      var terms = [];
      for (var j = 0; j < n; j++) terms.push("a<sub>" + (sel.i + 1) + (j + 1) + "</sub> b<sub>" + (j + 1) + (sel.k + 1) + "</sub>");
      formule.innerHTML = "c<sub>" + (sel.i + 1) + (sel.k + 1) + "</sub> = " + terms.join(" + ");
      grilles.querySelectorAll("[data-i]").forEach(function (s) {
        function choisir() { sel.i = +s.getAttribute("data-i"); sel.k = +s.getAttribute("data-j"); maj(); }
        s.addEventListener("click", choisir);
        s.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choisir(); } });
        s.style.cursor = "pointer";
      });
    }
    ligne.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", maj); });
    maj();
  };

  /* Cours 4.2 : rotation plane d'un repère et changement de repère V^0 = R^{0,1} V^1 */
  W["rotation-2d"] = function (root) {
    var corps = cadre(root, "Rotation d'un repère autour de z : R<sup>0,1</sup> = R<sub>z</sub>(α) et V<sup>0</sup> = R<sup>0,1</sup> V<sup>1</sup>");
    var t = toile(corps, 320, 300);
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var a = curseur(p, "Angle α", -180, 180, 1, 30, "°", dessiner);
    var vx = curseur(p, "V<sup>1</sup> sur x₁", -1, 1, 0.05, 0.8, "", dessiner);
    var vy = curseur(p, "V<sup>1</sup> sur y₁", -1, 1, 0.05, 0.3, "", dessiner);
    var sortie = el("div"); p.appendChild(sortie);
    p.appendChild(el("p", { "class": "w-note" }, "Le vecteur V est fixe dans R<sub>1</sub> (il tourne avec le repère). Ses composantes dans R<sub>0</sub> s'obtiennent en multipliant par R<sup>0,1</sup>."));

    function dessiner() {
      var al = a.get() * DEG, ctx = t.ctx, O = { x: 160, y: 160 }, L = 115;
      var R = Rz(al), V1 = [vx.get(), vy.get(), 0], V0 = matVec(R, V1);
      effacer(t);
      fleche(ctx, O.x, O.y, O.x + L, O.y, C.gris, 1.5); texte(ctx, "x₀", O.x + L + 4, O.y + 12, C.gris, 14);
      fleche(ctx, O.x, O.y, O.x, O.y - L, C.gris, 1.5); texte(ctx, "y₀", O.x + 8, O.y - L, C.gris, 14);
      fleche(ctx, O.x, O.y, O.x + L * R[0][0], O.y - L * R[1][0], C.x, 2);
      texte(ctx, "x₁", O.x + (L + 14) * R[0][0], O.y - (L + 14) * R[1][0], C.x, 14, "center");
      fleche(ctx, O.x, O.y, O.x + L * R[0][1], O.y - L * R[1][1], C.y, 2);
      texte(ctx, "y₁", O.x + (L + 14) * R[0][1], O.y - (L + 14) * R[1][1], C.y, 14, "center");
      ctx.strokeStyle = C.texte; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(O.x, O.y, 34, 0, -al, al > 0); ctx.stroke();
      texte(ctx, "α", O.x + 44 * Math.cos(al / 2), O.y - 44 * Math.sin(al / 2), C.texte, 14, "center");
      fleche(ctx, O.x, O.y, O.x + L * V0[0], O.y - L * V0[1], C.alt, 2.5);
      texte(ctx, "V", O.x + L * V0[0] + 10, O.y - L * V0[1] - 8, C.alt, 15);
      // projections de V sur x0 et y0
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = C.gris; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(O.x + L * V0[0], O.y - L * V0[1]); ctx.lineTo(O.x + L * V0[0], O.y);
      ctx.moveTo(O.x + L * V0[0], O.y - L * V0[1]); ctx.lineTo(O.x, O.y - L * V0[1]); ctx.stroke(); ctx.restore();

      sortie.innerHTML =
        '<div class="mat-bloc"><span class="mat-nom">R<sup>0,1</sup> =</span>' + matHTML(R) + "</div>" +
        '<div class="mat-bloc"><span class="mat-nom">V<sup>0</sup> =</span>' + matHTML(R) + vecHTML(V1, 2) + "=" + vecHTML(V0) + "</div>" +
        '<p class="w-ligne">Colonne 1 = [x₁]<sub>R₀</sub>, colonne 2 = [y₁]<sub>R₀</sub>, colonne 3 = [z₁]<sub>R₀</sub>. ' +
        "det = " + fmt(det3(R)) + "</p>";
    }
    dessiner();
  };

  /* Cours 4.2 : coordonnées cartésiennes, polaires et cylindriques */
  W["coordonnees"] = function (root) {
    var corps = cadre(root, "Un même point en coordonnées cartésiennes et cylindriques (déplacez le point)");
    var t = toile(corps, 320, 300);
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var zc = curseur(p, "Hauteur z", -1, 1, 0.05, 0.4, "", dessiner);
    var sortie = el("div"); p.appendChild(sortie);
    p.appendChild(el("p", { "class": "w-note" }, "La toile montre le plan (X, Y) vu de dessus : c'est la projection Q du point P. θ est mesuré depuis X, positif dans le sens trigonométrique, et calculé avec atan2(y, x)."));
    var O = { x: 160, y: 150 }, ech = 110, P = { x: 0.6, y: 0.45 }, glisse = false;

    function dessiner() {
      var ctx = t.ctx, cyl = versCylindrique(P.x, P.y, zc.get());
      effacer(t);
      ctx.strokeStyle = C.doux; ctx.lineWidth = 1;
      for (var k = -1; k <= 1; k += 0.5) {
        ctx.beginPath(); ctx.moveTo(O.x + k * ech, 20); ctx.lineTo(O.x + k * ech, 285); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, O.y - k * ech); ctx.lineTo(295, O.y - k * ech); ctx.stroke();
      }
      fleche(ctx, 25, O.y, 305, O.y, C.gris, 1.2); texte(ctx, "X", 300, O.y + 12, C.gris, 13);
      fleche(ctx, O.x, 290, O.x, 12, C.gris, 1.2); texte(ctx, "Y", O.x + 8, 16, C.gris, 13);
      var Qx = O.x + P.x * ech, Qy = O.y - P.y * ech;
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = C.gris;
      ctx.beginPath(); ctx.moveTo(Qx, Qy); ctx.lineTo(Qx, O.y); ctx.moveTo(Qx, Qy); ctx.lineTo(O.x, Qy); ctx.stroke(); ctx.restore();
      fleche(ctx, O.x, O.y, Qx, Qy, C.z, 2);
      ctx.strokeStyle = C.texte; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(O.x, O.y, 30, 0, -cyl.theta, cyl.theta > 0); ctx.stroke();
      texte(ctx, "θ", O.x + 40 * Math.cos(cyl.theta / 2), O.y - 40 * Math.sin(cyl.theta / 2), C.texte, 14, "center");
      ctx.fillStyle = C.alt; ctx.beginPath(); ctx.arc(Qx, Qy, 6, 0, 2 * Math.PI); ctx.fill();
      texte(ctx, "Q", Qx + 9, Qy - 9, C.alt, 14);
      texte(ctx, "r", (O.x + Qx) / 2 - 10, (O.y + Qy) / 2 - 8, C.z, 14);
      var back = versCartesien(cyl.r, cyl.theta, cyl.z);
      sortie.innerHTML =
        '<table class="w-tab"><tr><th>Cartésien</th><th>Cylindrique</th></tr>' +
        "<tr><td>x = " + fmt(P.x, 2) + "</td><td>r = √(x² + y²) = " + fmt(cyl.r) + "</td></tr>" +
        "<tr><td>y = " + fmt(P.y, 2) + "</td><td>θ = atan2(y, x) = " + fmt(cyl.theta / DEG, 1) + "° (" + fmt(cyl.theta) + " rad)</td></tr>" +
        "<tr><td>z = " + fmt(cyl.z, 2) + "</td><td>z = " + fmt(cyl.z, 2) + "</td></tr></table>" +
        '<p class="w-ligne">Retour : x = r cos θ = ' + fmt(back.x) + " ; y = r sin θ = " + fmt(back.y) + "</p>" +
        '<p class="w-ligne">En polaire (plan X, Y seul) : P(r, θ) = (' + fmt(cyl.r) + " ; " + fmt(cyl.theta / DEG, 1) + "°)</p>";
    }
    function deplacer(ev) {
      var q = pointeur(t, ev);
      P.x = Math.max(-1.2, Math.min(1.2, Math.round((q.x - O.x) / ech * 20) / 20));
      P.y = Math.max(-1.2, Math.min(1.2, Math.round((O.y - q.y) / ech * 20) / 20));
      dessiner();
    }
    t.c.addEventListener("pointerdown", function (ev) { glisse = true; t.c.setPointerCapture(ev.pointerId); deplacer(ev); });
    t.c.addEventListener("pointermove", function (ev) { if (glisse) deplacer(ev); });
    t.c.addEventListener("pointerup", function () { glisse = false; });
    dessiner();
  };

  /* Cours 4.2 : angles d'Euler ZYX en 3D */
  W["euler"] = function (root) {
    var corps = cadre(root, "Angles d'Euler : R<sup>0,s</sup> = R<sub>z</sub>(α) R<sub>y</sub>(β) R<sub>x</sub>(γ)");
    var t = toile(corps, 340, 320);
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var a = curseur(p, "α (lacet, z)", -180, 180, 1, 30, "°", dessiner);
    var b = curseur(p, "β (tangage, y)", -90, 90, 1, 20, "°", dessiner);
    var g = curseur(p, "γ (roulis, x)", -180, 180, 1, 0, "°", dessiner);
    var choix = el("div", { "class": "w-ligne" });
    choix.innerHTML = 'Ordre : <select><option value="zyx">ZYX : Rz(α) Ry(β) Rx(γ)</option><option value="xyz">XYZ : Rx(γ) Ry(β) Rz(α)</option></select> ' +
      '<button type="button" data-k="raz">Remise à zéro</button> <button type="button" data-k="sing">β = 90°</button>';
    p.appendChild(choix);
    var sortie = el("div"); p.appendChild(sortie);
    p.appendChild(el("p", { "class": "w-note" }, "En gris : le repère fixe R<sub>0</sub>. En couleur : le repère R<sub>s</sub> lié au solide (x rouge, y vert, z bleu). Faites glisser la vue pour tourner la caméra."));
    var sel = choix.querySelector("select");
    sel.addEventListener("change", dessiner);
    choix.querySelector('[data-k="raz"]').addEventListener("click", function () { a.set(0); b.set(0); g.set(0); dessiner(); });
    choix.querySelector('[data-k="sing"]').addEventListener("click", function () { b.set(90); dessiner(); });

    var cam = { az: -50 * DEG, el: 22 * DEG }, glisse = null;
    function proj(v) {
      // Vue : rotation de la caméra autour de z0 puis inclinaison, z0 vers le haut de l'écran.
      var ca = Math.cos(cam.az), sa = Math.sin(cam.az), ce = Math.cos(cam.el), se = Math.sin(cam.el);
      var x1 = ca * v[0] - sa * v[1], y1 = sa * v[0] + ca * v[1];
      var depth = ce * y1 + se * v[2];
      var up = -se * y1 + ce * v[2];
      return { x: 170 + 105 * x1, y: 170 - 105 * up, d: depth };
    }
    var boite = [];
    [-1, 1].forEach(function (i) { [-1, 1].forEach(function (j) { [-1, 1].forEach(function (k) { boite.push([0.55 * i, 0.3 * j, 0.08 * k]); }); }); });
    var aretes = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];

    function dessiner() {
      var al = a.get() * DEG, be = b.get() * DEG, ga = g.get() * DEG;
      var R = sel.value === "zyx" ? eulerZYX(al, be, ga) : eulerXYZ(al, be, ga);
      var ctx = t.ctx, O = proj([0, 0, 0]);
      effacer(t);
      [[1, 0, 0, "x₀"], [0, 1, 0, "y₀"], [0, 0, 1, "z₀"]].forEach(function (e) {
        var q = proj([1.25 * e[0], 1.25 * e[1], 1.25 * e[2]]);
        fleche(ctx, O.x, O.y, q.x, q.y, C.gris, 1.2, true);
        texte(ctx, e[3], q.x + 6, q.y - 6, C.gris, 13);
      });
      var pts = boite.map(function (v) { return proj(matVec(R, v)); });
      ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 1;
      aretes.forEach(function (e) { ctx.beginPath(); ctx.moveTo(pts[e[0]].x, pts[e[0]].y); ctx.lineTo(pts[e[1]].x, pts[e[1]].y); ctx.stroke(); });
      [[0, C.x, "xₛ"], [1, C.y, "yₛ"], [2, C.z, "zₛ"]].forEach(function (e) {
        var col = [R[0][e[0]], R[1][e[0]], R[2][e[0]]], q = proj([col[0], col[1], col[2]]);
        fleche(ctx, O.x, O.y, q.x, q.y, e[1], 2.5);
        texte(ctx, e[2], q.x + 6, q.y - 8, e[1], 14);
      });
      var RtR = matMul(transpose(R), R), err = 0;
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) err = Math.max(err, Math.abs(RtR[i][j] - (i === j ? 1 : 0)));
      var h = '<div class="mat-bloc"><span class="mat-nom">R<sup>0,s</sup> =</span>' + matHTML(R) + "</div>" +
        '<p class="w-ligne">Colonnes : [x<sub>s</sub>]<sub>R₀</sub>, [y<sub>s</sub>]<sub>R₀</sub>, [z<sub>s</sub>]<sub>R₀</sub>. ' +
        "det R = " + fmt(det3(R)) + " ; écart max de RᵀR à I : " + fmt(err, 6) + "</p>";
      if (Math.abs(Math.cos(be)) < 1e-6) {
        h += '<p class="w-ligne w-alerte">β = ±90° : le premier et le dernier axe de rotation sont alignés. ' +
          "Faire varier α ou γ produit alors le même type de mouvement (singularité de la représentation).</p>";
      }
      sortie.innerHTML = h;
    }
    t.c.addEventListener("pointerdown", function (ev) { glisse = pointeur(t, ev); t.c.setPointerCapture(ev.pointerId); });
    t.c.addEventListener("pointermove", function (ev) {
      if (!glisse) return;
      var q = pointeur(t, ev);
      cam.az -= (q.x - glisse.x) * 0.01;
      cam.el = Math.max(-1.2, Math.min(1.2, cam.el + (q.y - glisse.y) * 0.01));
      glisse = q; dessiner();
    });
    t.c.addEventListener("pointerup", function () { glisse = null; });
    dessiner();
  };

  /* Cours 4.3 : l'ordre compte (tourner puis avancer / avancer puis tourner) */
  W["ordre"] = function (root) {
    var corps = cadre(root, "L'ordre compte : Rot(z, α) · Trans(x, d) n'est pas Trans(x, d) · Rot(z, α)");
    var t = toile(corps, 320, 280);
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var a = curseur(p, "Angle α", -180, 180, 5, 60, "°", dessiner);
    var d = curseur(p, "Distance d", 0, 1, 0.05, 0.8, "", dessiner);
    var sortie = el("div"); p.appendChild(sortie);
    p.appendChild(el("p", { "class": "w-note" }, "Chaque nouveau mouvement est écrit dans le repère obtenu juste avant (multiplication à droite), comme dans T<sup>0,n</sup> = T<sup>0,1</sup> T<sup>1,2</sup> … T<sup>n−1,n</sup>."));

    function dessiner() {
      var al = a.get() * DEG, dd = d.get(), ctx = t.ctx, O = { x: 110, y: 190 }, ech = 140;
      var Rot = homog(Rz(al), [0, 0, 0]), Tr = homog(Rz(0), [dd, 0, 0]);
      var A = matMul(Rot, Tr), B = matMul(Tr, Rot);
      effacer(t);
      fleche(ctx, O.x, O.y, O.x + 60, O.y, C.gris, 1.2); texte(ctx, "x₀", O.x + 62, O.y + 12, C.gris, 13);
      fleche(ctx, O.x, O.y, O.x, O.y - 60, C.gris, 1.2); texte(ctx, "y₀", O.x + 6, O.y - 64, C.gris, 13);
      function rep(T, coul, nom) {
        var px = O.x + ech * T[0][3], py = O.y - ech * T[1][3];
        fleche(ctx, px, py, px + 45 * T[0][0], py - 45 * T[1][0], coul, 2.2);
        fleche(ctx, px, py, px + 45 * T[0][1], py - 45 * T[1][1], coul, 1.2);
        ctx.fillStyle = coul; ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.fill();
        texte(ctx, nom, px + 8, py + 14, coul, 13);
      }
      rep(A, C.z, "A");
      rep(B, C.x, "B");
      sortie.innerHTML =
        '<p class="w-ligne"><span class="cz">A = Rot · Trans</span> : tourner de α, puis avancer de d sur le <em>nouvel</em> axe x.</p>' +
        '<div class="mat-bloc">' + matHTML(A) + "</div>" +
        '<p class="w-ligne"><span class="cx">B = Trans · Rot</span> : avancer de d sur x₀, puis tourner de α sur place.</p>' +
        '<div class="mat-bloc">' + matHTML(B) + "</div>" +
        '<p class="w-ligne">Même orientation (bloc 3 × 3 identique), positions différentes : (' + fmt(A[0][3]) + " ; " + fmt(A[1][3]) + ") contre (" + fmt(B[0][3]) + " ; " + fmt(B[1][3]) + ").</p>";
    }
    dessiner();
  };

  /* Cours 4.3 : bras plan à deux segments */
  W["bras-2r"] = function (root) {
    var corps = cadre(root, "Bras plan à deux segments : T<sup>0,2</sup> = T<sup>0,1</sup> T<sup>1,2</sup>");
    var t = toile(corps, 340, 320);
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var t1 = curseur(p, "θ₁", -180, 180, 1, 30, "°", dessiner);
    var t2 = curseur(p, "θ₂", -180, 180, 1, 45, "°", dessiner);
    var l1 = curseur(p, "l₁ [m]", 0.1, 1, 0.05, 0.4, "", dessiner);
    var l2 = curseur(p, "l₂ [m]", 0.1, 1, 0.05, 0.3, "", dessiner);
    var opt = el("div", { "class": "w-ligne" });
    opt.innerHTML = '<label><input type="checkbox" data-k="ws"> Espace de travail (θ₁, θ₂ libres sur 360°)</label> &nbsp; <label><input type="checkbox" data-k="rep" checked> Repères</label>';
    p.appendChild(opt);
    var sortie = el("div"); corps.appendChild(sortie);
    sortie.style.flexBasis = "100%";
    opt.querySelectorAll("input").forEach(function (i) { i.addEventListener("change", dessiner); });

    function dessiner() {
      var q1 = t1.get() * DEG, q2 = t2.get() * DEG, L1 = l1.get(), L2 = l2.get();
      var r = bras2R(q1, q2, L1, L2), ctx = t.ctx, O = { x: 170, y: 170 }, ech;
      ech = Math.min(140 / (L1 + L2), 140);
      function X(v) { return O.x + ech * v[0]; }
      function Y(v) { return O.y - ech * v[1]; }
      effacer(t);
      if (opt.querySelector('[data-k="ws"]').checked) {
        ctx.fillStyle = "rgba(47,79,168,0.10)";
        ctx.beginPath(); ctx.arc(O.x, O.y, ech * (L1 + L2), 0, 2 * Math.PI);
        ctx.arc(O.x, O.y, ech * Math.abs(L1 - L2), 0, 2 * Math.PI, true); ctx.fill();
        ctx.strokeStyle = "rgba(47,79,168,0.45)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(O.x, O.y, ech * (L1 + L2), 0, 2 * Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.arc(O.x, O.y, ech * Math.abs(L1 - L2), 0, 2 * Math.PI); ctx.stroke();
        ctx.setLineDash([]);
      }
      fleche(ctx, 20, O.y, 330, O.y, C.gris, 1); texte(ctx, "x₀", 322, O.y + 12, C.gris, 13);
      fleche(ctx, O.x, 315, O.x, 12, C.gris, 1); texte(ctx, "y₀", O.x + 6, 14, C.gris, 13);
      // segments
      ctx.lineCap = "round";
      ctx.strokeStyle = "#1f7a7a"; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(X(r.O2), Y(r.O2)); ctx.stroke();
      ctx.strokeStyle = C.alt; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(X(r.O2), Y(r.O2)); ctx.lineTo(X(r.M), Y(r.M)); ctx.stroke();
      ctx.lineCap = "butt";
      [[O.x, O.y], [X(r.O2), Y(r.O2)]].forEach(function (c) {
        ctx.fillStyle = "#fff"; ctx.strokeStyle = C.texte; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(c[0], c[1], 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      });
      ctx.fillStyle = C.texte; ctx.beginPath(); ctx.arc(X(r.M), Y(r.M), 4, 0, 2 * Math.PI); ctx.fill();
      texte(ctx, "M", X(r.M) + 8, Y(r.M) - 10, C.texte, 14);
      texte(ctx, "O₂", X(r.O2) + 8, Y(r.O2) + 14, C.texte, 13);
      texte(ctx, "O₀ = O₁", O.x + 8, O.y + 16, C.texte, 13);
      if (opt.querySelector('[data-k="rep"]').checked) {
        var T02 = r.T02, T01 = r.T01, s = 38;
        fleche(ctx, O.x, O.y, O.x + s * T01[0][0], O.y - s * T01[1][0], C.x, 1.6);
        fleche(ctx, O.x, O.y, O.x + s * T01[0][1], O.y - s * T01[1][1], C.y, 1.6);
        texte(ctx, "x₁", O.x + (s + 10) * T01[0][0], O.y - (s + 10) * T01[1][0], C.x, 12, "center");
        texte(ctx, "y₁", O.x + (s + 10) * T01[0][1], O.y - (s + 10) * T01[1][1], C.y, 12, "center");
        var ox = X(r.O2), oy = Y(r.O2);
        fleche(ctx, ox, oy, ox + s * T02[0][0], oy - s * T02[1][0], C.x, 1.6);
        fleche(ctx, ox, oy, ox + s * T02[0][1], oy - s * T02[1][1], C.y, 1.6);
        texte(ctx, "x₂", ox + (s + 10) * T02[0][0], oy - (s + 10) * T02[1][0], C.x, 12, "center");
        texte(ctx, "y₂", ox + (s + 10) * T02[0][1], oy - (s + 10) * T02[1][1], C.y, 12, "center");
      }
      var xm = L1 * Math.cos(q1) + L2 * Math.cos(q1 + q2), ym = L1 * Math.sin(q1) + L2 * Math.sin(q1 + q2);
      sortie.innerHTML =
        '<div class="mat-bloc"><span class="mat-nom">T<sup>0,1</sup> =</span>' + matHTML(r.T01) +
        '<span class="mat-nom">T<sup>1,2</sup> =</span>' + matHTML(r.T12) + "</div>" +
        '<div class="mat-bloc"><span class="mat-nom">T<sup>0,2</sup> = T<sup>0,1</sup> T<sup>1,2</sup> =</span>' + matHTML(r.T02) + "</div>" +
        '<p class="w-ligne">O₀M<sup>0</sup> = T<sup>0,2</sup> (l₂ ; 0 ; 0 ; 1)<sup>T</sup> : ' +
        "x<sub>M</sub> = " + fmt(r.M[0]) + " m, y<sub>M</sub> = " + fmt(r.M[1]) + " m</p>" +
        '<p class="w-ligne">Formule directe : x<sub>M</sub> = l₁ cos θ₁ + l₂ cos(θ₁ + θ₂) = ' + fmt(xm) +
        " ; y<sub>M</sub> = l₁ sin θ₁ + l₂ sin(θ₁ + θ₂) = " + fmt(ym) + "</p>" +
        '<p class="w-ligne">Orientation de l\'organe terminal : θ₁ + θ₂ = ' + fmt((q1 + q2) / DEG, 0) + "°. Distance OM = " +
        fmt(Math.hypot(r.M[0], r.M[1])) + " m (entre |l₁ − l₂| = " + fmt(Math.abs(L1 - L2), 2) + " et l₁ + l₂ = " + fmt(L1 + L2, 2) + ").</p>";
    }
    dessiner();
  };

  /* Cours 2 : précision et répétabilité */
  W["precision"] = function (root) {
    var corps = cadre(root, "Précision et répétabilité : cinq essais vers le point demandé P");
    var t = toile(corps, 300, 260);
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var choix = el("div", { "class": "w-ligne" });
    choix.innerHTML = '<select>' +
      '<option value="A">Cas A : précis et répétable</option>' +
      '<option value="B">Cas B : répétable mais peu précis</option>' +
      '<option value="C">Cas C : précis en moyenne, peu répétable</option>' +
      '<option value="D">Cas D : ni précis ni répétable</option></select> <button type="button">Relancer</button>';
    p.appendChild(choix);
    var sortie = el("div"); p.appendChild(sortie);
    p.appendChild(el("p", { "class": "w-note" }, "Illustration : les positions sont tirées au hasard. L'écart de la position moyenne à P renseigne sur la précision ; la dispersion autour de la moyenne renseigne sur la répétabilité. Unités arbitraires."));
    var sel = choix.querySelector("select"), pts = [];
    var cas = { A: { dx: 0.3, dy: -0.2, s: 0.4 }, B: { dx: 4.5, dy: -1.5, s: 0.4 }, C: { dx: 0.2, dy: 0.3, s: 2.6 }, D: { dx: 4.5, dy: 2.5, s: 2.6 } };
    function gauss() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function tirer() {
      var c = cas[sel.value]; pts = [];
      for (var i = 0; i < 5; i++) pts.push({ x: c.dx + c.s * gauss(), y: c.dy + c.s * gauss() });
      dessiner();
    }
    function dessiner() {
      var ctx = t.ctx, O = { x: 120, y: 130 }, ech = 16;
      effacer(t);
      ctx.strokeStyle = C.doux; ctx.lineWidth = 1;
      for (var k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(O.x, O.y, k * 2 * ech, 0, 2 * Math.PI); ctx.stroke(); }
      ctx.fillStyle = C.z; ctx.beginPath(); ctx.arc(O.x, O.y, 6, 0, 2 * Math.PI); ctx.fill();
      texte(ctx, "P", O.x - 16, O.y - 12, C.z, 14);
      var mx = 0, my = 0;
      pts.forEach(function (q) { mx += q.x / pts.length; my += q.y / pts.length; });
      var disp = 0;
      pts.forEach(function (q) {
        disp = Math.max(disp, Math.hypot(q.x - mx, q.y - my));
        ctx.fillStyle = C.x; ctx.fillRect(O.x + ech * q.x - 4, O.y - ech * q.y - 4, 8, 8);
      });
      ctx.strokeStyle = C.texte; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(O.x + ech * mx - 6, O.y - ech * my); ctx.lineTo(O.x + ech * mx + 6, O.y - ech * my);
      ctx.moveTo(O.x + ech * mx, O.y - ech * my - 6); ctx.lineTo(O.x + ech * mx, O.y - ech * my + 6); ctx.stroke();
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = C.gris;
      ctx.beginPath(); ctx.arc(O.x + ech * mx, O.y - ech * my, ech * disp, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
      sortie.innerHTML =
        '<p class="w-ligne">Écart de la position moyenne (croix) à P : <strong>' + fmt(Math.hypot(mx, my), 2) + "</strong></p>" +
        '<p class="w-ligne">Rayon de dispersion autour de la moyenne (cercle pointillé) : <strong>' + fmt(disp, 2) + "</strong></p>";
    }
    sel.addEventListener("change", tirer);
    choix.querySelector("button").addEventListener("click", tirer);
    tirer();
  };

  /* Cours 2 : temps de cycle et cadence */
  W["temps-cycle"] = function (root) {
    var corps = cadre(root, "Temps de cycle et cadence théorique d'un robot pick and place");
    var p = el("div", { "class": "w-panneau" }); corps.appendChild(p);
    var etapes = [["Approche", 0.30, true], ["Prise", 0.20, false], ["Transfert", 0.55, true], ["Dépose", 0.15, false], ["Retour", 0.45, true], ["Synchronisation", 0.35, false]];
    var tab = el("table", { "class": "w-tab" });
    tab.innerHTML = "<tr><th>Étape</th><th>Durée [s]</th><th>Type</th><th>Avec k [s]</th></tr>" +
      etapes.map(function (e, i) {
        return "<tr><td>" + e[0] + '</td><td><input type="text" inputmode="decimal" value="' + fmt(e[1], 2) + '" data-i="' + i + '" aria-label="Durée ' + e[0] + ' en secondes"></td><td>' +
          (e[2] ? "mouvement" : "temps fixe") + '</td><td class="num" data-o="' + i + '"></td></tr>';
      }).join("");
    p.appendChild(tab);
    var k = curseur(p, "Vitesse × k", 0.5, 3, 0.1, 1, "", maj);
    var sortie = el("div"); p.appendChild(sortie);
    p.appendChild(el("p", { "class": "w-note" }, "Multiplier la vitesse par k divise les durées de mouvement par k ; les temps de prise, de dépose et de synchronisation ne changent pas."));
    function maj() {
      var tot = 0, tot1 = 0, kk = k.get();
      etapes.forEach(function (e, i) {
        var v = parseFloat(tab.querySelector('[data-i="' + i + '"]').value.replace(",", ".")) || 0;
        var vk = e[2] ? v / kk : v;
        tot1 += v; tot += vk;
        tab.querySelector('[data-o="' + i + '"]').textContent = fmt(vk, 2);
      });
      sortie.innerHTML =
        '<p class="w-ligne">T<sub>cycle</sub> (vitesse initiale) = ' + fmt(tot1, 2) + " s/cycle, N = 3600 / T<sub>cycle</sub> = " + fmt(tot1 > 0 ? 3600 / tot1 : 0, 0) + " cycles/h</p>" +
        '<p class="w-ligne"><strong>T<sub>cycle</sub> = ' + fmt(tot, 2) + " s/cycle</strong>, N = " + fmt(tot > 0 ? 3600 / tot : 0, 0) +
        " cycles/h, soit " + fmt(tot > 0 ? 60 / tot : 0, 1) + " cycles/min</p>";
    }
    tab.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", maj); });
    maj();
  };

  function monter() {
    document.querySelectorAll(".widget[data-widget]").forEach(function (root) {
      var f = W[root.getAttribute("data-widget")];
      if (!f || root.getAttribute("data-monte")) return;
      root.setAttribute("data-monte", "1");
      try { f(root); } catch (e) { root.textContent = "Erreur du widget : " + e.message; }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", monter);
  else monter();
})(typeof window !== "undefined" ? window : globalThis);
