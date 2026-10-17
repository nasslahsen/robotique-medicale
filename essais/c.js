/* Essai C : cahier à petits carreaux, réponses au stylet ou au doigt. */
(function () {
  "use strict";
  var DEG = E.DEG, svg = document.getElementById("dessin");
  var C = { x: "#d6372b", y: "#1d8a52", z: "#1f4bd8", v: "#7b3fc8", bleu: "#1f4bd8", rouge: "#d6372b", vert: "#1d8a52", encre: "#1c2233", carreau: "#e6edf8", fort: "#cfdaee" };
  var vue = { O: [320, 360], u: 200 };
  var fc = function (x, d) { return E.tc(x, d === undefined ? 3 : d).replace("{,}", ",").replace("-", "\u2212"); };
  var P = function (v) { return [vue.O[0] + v[0] * vue.u, vue.O[1] - v[1] * vue.u]; };
  var U = function (p) { return [(p[0] - vue.O[0]) / vue.u, (vue.O[1] - p[1]) / vue.u, 0]; };
  var gFond = E.s("g", null, svg), gFig = E.s("g", null, svg), gEncre = E.s("g", null, svg), gHaut = E.s("g", null, svg);

  /* ---------------- Dessin ---------------- */
  function main(g, t, p, o) {
    o = o || {};
    var e = E.s("text", { x: p[0], y: p[1], fill: o.coul || C.bleu, "font-size": o.taille || 30, "font-weight": 700, "font-family": "Caveat, cursive", "text-anchor": o.ancre || "middle", "dominant-baseline": "middle", "paint-order": "stroke", stroke: "#fff", "stroke-width": 7, "stroke-linejoin": "round" }, g);
    e.textContent = t; return e;
  }
  function fleche(g, a, b, coul, ep, o) {
    o = o || {};
    var d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]); if (l < 3) return null;
    var u = [d[0] / l, d[1] / l], t = 14 + ep, w = 7 + ep * 0.6, c = [b[0] - u[0] * t * 0.6, b[1] - u[1] * t * 0.6];
    var gr = E.s("g", { opacity: o.op }, g);
    var ligne = E.s("path", { d: "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " L" + b[0].toFixed(1) + " " + b[1].toFixed(1), stroke: coul, "stroke-width": ep, "stroke-linecap": "round", fill: "none", "stroke-dasharray": o.tirets }, gr);
    E.s("path", { d: "M" + (b[0] - u[0] * t - u[1] * w).toFixed(1) + " " + (b[1] - u[1] * t + u[0] * w).toFixed(1) + " L" + b[0].toFixed(1) + " " + b[1].toFixed(1) + " L" + (b[0] - u[0] * t + u[1] * w).toFixed(1) + " " + (b[1] - u[1] * t - u[0] * w).toFixed(1), stroke: coul, "stroke-width": ep, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }, gr);
    if (o.trace) { // tracé progressif, comme à la main
      var L = l + 2 * t;
      gr.querySelectorAll("path").forEach(function (p) { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.transition = "stroke-dashoffset " + (o.trace) + "ms ease-out"; });
      requestAnimationFrame(function () { requestAnimationFrame(function () { gr.querySelectorAll("path").forEach(function (p) { p.style.strokeDashoffset = 0; }); }); });
    }
    return gr;
  }
  function cadre() {
    E.vider(gFond);
    var pas = vue.u / 10;
    // le quadrillage déborde du cadre pour remplir toute la page, quelle que soit sa forme
    for (var k = -80; k <= 80; k++) {
      var x = vue.O[0] + k * pas, y = vue.O[1] - k * pas, fort = k % 5 === 0;
      if (x >= -300 && x <= 940) E.s("line", { x1: x, y1: -400, x2: x, y2: 1040, stroke: fort ? C.fort : C.carreau, "stroke-width": fort ? 1.4 : 1 }, gFond);
      if (y >= -400 && y <= 1040) E.s("line", { x1: -300, y1: y, x2: 940, y2: y, stroke: fort ? C.fort : C.carreau, "stroke-width": fort ? 1.4 : 1 }, gFond);
    }
    var ax = Math.min(1.45, (630 - vue.O[0]) / vue.u), ay = Math.min(1.45, (vue.O[1] - 20) / vue.u);
    fleche(gFond, P([-Math.min(1.3, (vue.O[0] - 12) / vue.u), 0]), P([ax, 0]), "#e9a39c", 3);
    fleche(gFond, P([0, -Math.min(1.1, (620 - vue.O[1]) / vue.u)]), P([0, ay]), "#8fc9a9", 3);
    main(gFond, "x₀", [P([ax, 0])[0] - 8, P([ax, 0])[1] + 26], { coul: C.x, taille: 30 });
    main(gFond, "y₀", [P([0, ay])[0] - 26, P([0, ay])[1] + 8], { coul: C.y, taille: 30 });
    E.s("circle", { cx: vue.O[0], cy: vue.O[1], r: 8, fill: "#fff", stroke: C.z, "stroke-width": 2.5 }, gFond);
    E.s("circle", { cx: vue.O[0], cy: vue.O[1], r: 2.8, fill: C.z }, gFond);
    main(gFond, "O", [vue.O[0] - 22, vue.O[1] + 24], { coul: C.encre, taille: 28 });
  }
  function axes1(g, alpha, o) {
    o = o || {};
    var R = E.Rz(alpha * DEG), x1 = E.col(R, 0), y1 = E.col(R, 1), L = o.longueur || 1;
    if (o.x !== false) { fleche(g, P([0, 0]), P(fois(x1, L)), C.x, 4.5, { trace: o.trace }); main(g, "x₁", P(fois(x1, L + 0.14)), { coul: C.x }); }
    if (o.y) { fleche(g, P([0, 0]), P(fois(y1, L)), C.y, 4.5, { trace: o.trace }); main(g, "y₁", P(fois(y1, L + 0.14)), { coul: C.y }); }
  }
  function projections(g, v, coul, nx, ny) {
    var p = P(v), fx = P([v[0], 0]), fy = P([0, v[1]]);
    E.s("line", { x1: p[0], y1: p[1], x2: fx[0], y2: fx[1], stroke: coul, "stroke-width": 2.2, "stroke-dasharray": "6 6" }, g);
    E.s("line", { x1: p[0], y1: p[1], x2: fy[0], y2: fy[1], stroke: coul, "stroke-width": 2.2, "stroke-dasharray": "6 6" }, g);
    main(g, nx, [fx[0], fx[1] + (v[1] >= 0 ? 26 : -26)], { coul: coul, taille: 26 });
    main(g, ny, [fy[0] + (v[0] >= 0 ? -14 : 14), fy[1]], { coul: coul, taille: 26, ancre: v[0] >= 0 ? "end" : "start" });
  }
  function croix(g, p, coul, txt) {
    var q = P(p);
    E.s("path", { d: "M" + (q[0] - 11) + " " + (q[1] - 11) + " L" + (q[0] + 11) + " " + (q[1] + 11) + " M" + (q[0] + 11) + " " + (q[1] - 11) + " L" + (q[0] - 11) + " " + (q[1] + 11), stroke: coul, "stroke-width": 4, "stroke-linecap": "round", fill: "none" }, g);
    if (txt) main(g, txt, [q[0] + 18, q[1] - 22], { coul: coul, taille: 26, ancre: "start" });
  }
  function fois(v, k) { return [v[0] * k, v[1] * k, 0]; }
  function plus(a, b) { return [a[0] + b[0], a[1] + b[1], 0]; }
  function arc(g, a0, a1, r, coul, label) {
    var p0 = [vue.O[0] + r * Math.cos(a0 * DEG), vue.O[1] - r * Math.sin(a0 * DEG)], p1 = [vue.O[0] + r * Math.cos(a1 * DEG), vue.O[1] - r * Math.sin(a1 * DEG)];
    E.s("path", { d: "M" + p0 + " A" + r + " " + r + " 0 " + (Math.abs(a1 - a0) > 180 ? 1 : 0) + " " + (a1 > a0 ? 0 : 1) + " " + p1, stroke: coul, "stroke-width": 2.5, fill: "none" }, g);
    if (label) { var am = (a0 + a1) / 2 * DEG; main(g, label, [vue.O[0] + (r + 26) * Math.cos(am), vue.O[1] - (r + 26) * Math.sin(am)], { coul: coul, taille: 26 }); }
  }

  /* ---------------- Stylet : traits, croix ---------------- */
  var mode = null, trait = null, points = [], surTrait = null, surCroix = null, surRot = null;
  E.glisser(svg, svg, function (p, ev) {
    if (mode === "trait") {
      points.push(p);
      var w = ev.pointerType === "pen" && ev.pressure ? 2.5 + ev.pressure * 4 : 4.5;
      trait.setAttribute("stroke-width", w.toFixed(1));
      trait.setAttribute("d", points.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" "));
    } else if (mode === "croix") { if (surCroix) surCroix(U(p)); }
    else if (mode === "rot") { if (surRot) surRot(Math.round(Math.atan2(vue.O[1] - p[1], p[0] - vue.O[0]) / DEG)); }
  }, function () {
    if (mode === "trait" && surTrait && points.length > 1) surTrait(U(points[0]), U(points[points.length - 1]), trait);
  }, function () {
    if (mode === "trait") { points = []; trait = E.s("path", { fill: "none", stroke: C.bleu, "stroke-width": 4.5, "stroke-linecap": "round", "stroke-linejoin": "round" }, gEncre); return true; }
    return mode === "croix" || mode === "rot";
  });

  /* ---------------- Page de droite ---------------- */
  var contenu = document.getElementById("contenu"), droite = document.getElementById("droite"), outils = document.getElementById("outils"), legende = document.getElementById("legende");
  function note(parent, html, cls) { var n = E.h("div", "main-note apparait " + (cls || ""), html, parent); E.rendre(n); return n; }
  function bouton(parent, txt, cls, f) { var b = E.h("button", cls, txt, parent); b.type = "button"; b.addEventListener("click", f); return b; }
  function suite(parent, i) {
    if (i + 1 < PAGES.length) bouton(parent, "Page suivante", "suite apparait", function () { aller(i + 1); });
    else bouton(parent, "Revenir à la première page", "suite apparait", function () { aller(0); });
  }
  function expliquer(html) {
    var ex = E.h("div", "explique apparait", html, contenu); E.rendre(ex);
    setTimeout(function () { ex.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 100);
    return ex;
  }
  var fini = [], atteinte = 0, courante = -1;
  function reussi(i) { if (fini.indexOf(i) < 0) fini.push(i); atteinte = Math.max(atteinte, i + 1); majOnglets(); }

  /* ---------------- Pages ---------------- */
  var PAGES = [
    { nom: "Dessiner", ouvrir: function () {
      vue.O = [250, 400]; vue.u = 240; cadre();
      legende.textContent = "1 carreau = 0,1";
      contenu.innerHTML = '<span class="num">1</span><h2>Le robot tourne son instrument de 50° autour de \\(\\vec{z}_0\\). Dessine son axe \\(\\vec{x}_1\\).</h2>' +
        '<p class="consigne">Au stylet ou au doigt, trace une flèche qui part de O, sur la page de gauche. L\'axe \\(\\vec{z}_0\\) sort de la feuille.</p>';
      mode = "trait";
      var essais = 0;
      bouton(outils, "Effacer", "outil", function () { E.vider(gEncre); });
      surTrait = function (s, e) {
        var d = [e[0] - s[0], e[1] - s[1]], l = Math.hypot(d[0], d[1]);
        var ancien = contenu.querySelector(".main-note:not(.vert)"); if (ancien) ancien.remove();
        if (Math.hypot(s[0], s[1]) > 0.3) { note(contenu, "Pars de O, là où les axes se croisent.", "rouge"); return; }
        if (l < 0.4) { note(contenu, "Trace un trait plus long.", "rouge"); return; }
        var a = Math.round(Math.atan2(d[1], d[0]) / DEG), ec = E.ecartAngle(a, 50);
        essais++;
        if (ec > 8) {
          note(contenu, "Ton trait fait " + a + "°, il manque " + (a < 50 ? "un peu de rotation" : "moins de rotation") + ". " + (essais > 1 ? "50°, c'est un peu plus que la moitié d'un angle droit." : "Efface et recommence."), "rouge");
          return;
        }
        mode = null; surTrait = null;
        note(contenu, "Ton trait : " + a + "°, écart " + ec + "°. Bien vu.", "vert");
        axes1(gFig, 50, { trace: 700 });
        setTimeout(function () {
          var v = E.col(E.Rz(50 * DEG), 0);
          projections(gFig, v, C.x, "cos 50°", "sin 50°");
          arc(gFig, 0, 50, 0.32 * vue.u, C.bleu, "50°");
        }, 700);
        var ex = expliquer('<p>Le vrai \\(\\vec{x}_1\\) est tracé en rouge. Ses projections sur \\(\\vec{x}_0\\) et \\(\\vec{y}_0\\) sont \\(\\cos 50°\\) et \\(\\sin 50°\\) : ce sont ses coordonnées dans \\(R_0\\).</p>' +
          '\\[ [\\vec{x}_1]_{R_0} = \\begin{pmatrix} \\cos 50° \\\\ \\sin 50° \\\\ 0 \\end{pmatrix} \\]');
        suite(ex, 0); reussi(0);
      };
    } },

    { nom: "Calculer", ouvrir: function () {
      vue.O = [250, 400]; vue.u = 240; cadre();
      legende.textContent = "1 carreau = 0,1";
      var v = E.col(E.Rz(50 * DEG), 0);
      axes1(gFig, 50, {}); projections(gFig, v, C.x, "cos 50°", "sin 50°"); arc(gFig, 0, 50, 0.32 * vue.u, C.bleu, "50°");
      contenu.innerHTML = '<span class="num">2</span><h2>Écris la première colonne de \\(R^{0,1}\\).</h2>' +
        '<p class="consigne">Lis les projections sur le quadrillage (un carreau vaut 0,1) ou calcule-les. Deux décimales suffisent.</p>' +
        '<div class="colonne"><span>\\([\\vec{x}_1]_{R_0} =\\)</span><div class="cases"><div class="saisie" data-k="0"></div><div class="saisie" data-k="1"></div><div class="saisie" data-k="2"></div></div></div><div class="clavier"></div>';
      E.rendre(contenu);
      var cases = [].slice.call(contenu.querySelectorAll(".saisie")), val = ["", "", ""], active = 0;
      function maj() { cases.forEach(function (c, k) { c.textContent = val[k].replace("-", "\u2212") || " "; c.classList.toggle("active", k === active); }); }
      cases.forEach(function (c, k) { c.addEventListener("click", function () { active = k; maj(); }); });
      var clav = contenu.querySelector(".clavier");
      ["7", "8", "9", "−", "4", "5", "6", ",", "1", "2", "3", "0"].forEach(function (t) {
        bouton(clav, t, "touche", function () {
          var s = val[active];
          if (t === "−") s = s.charAt(0) === "-" ? s.slice(1) : "-" + s;
          else if (t === ",") { if (s.indexOf(",") < 0) s = (s === "" || s === "-" ? s + "0" : s) + ","; }
          else if (s.replace(/[-,]/g, "").length < 4) s += t;
          val[active] = s; cases[active].classList.remove("bon", "faux"); maj();
        });
      });
      bouton(clav, "Effacer", "touche large", function () { val[active] = ""; cases[active].classList.remove("bon", "faux"); maj(); });
      var ok = bouton(clav, "Vérifier", "touche large ok", verifier);
      maj();
      var AIDE = ["La projection sur \\(\\vec{x}_0\\) fait un peu plus de 6 carreaux.", "La projection sur \\(\\vec{y}_0\\) fait presque 8 carreaux.", "\\(\\vec{x}_1\\) reste dans le plan de la feuille : sa composante sur \\(\\vec{z}_0\\) est nulle."];
      function verifier() {
        var faux = [];
        val.forEach(function (s, k) {
          var x = parseFloat(s.replace(",", "."));
          var bon = s !== "" && !isNaN(x) && Math.abs(x - v[k]) < 0.015;
          cases[k].classList.toggle("bon", bon); cases[k].classList.toggle("faux", !bon);
          if (!bon) faux.push(k);
        });
        var ancien = contenu.querySelector(".main-note"); if (ancien) ancien.remove();
        if (faux.length) {
          var n = note(contenu, AIDE[faux[0]], "rouge"); clav.parentNode.insertBefore(n, clav.nextSibling);
          setTimeout(function () { n.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 50);
          contenu.querySelector(".colonne").classList.add("secoue"); setTimeout(function () { contenu.querySelector(".colonne").classList.remove("secoue"); }, 400);
          return;
        }
        clav.style.display = "none";
        note(contenu, "C'est bien \\((\\cos 50° ;\\ \\sin 50° ;\\ 0)\\).", "vert");
        axes1(gFig, 50, { x: false, y: true, trace: 600 });
        var ex = expliquer('<p>Même raisonnement pour \\(\\vec{y}_1\\), tourné de 90° de plus, et pour \\(\\vec{z}_1 = \\vec{z}_0\\). Les trois colonnes forment la matrice de rotation :</p>' +
          '\\[ \\begin{aligned} R^{0,1} = R_z(50°) &= \\begin{pmatrix} \\cos 50° & -\\sin 50° & 0 \\\\ \\sin 50° & \\cos 50° & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\\\[4pt] &= \\begin{pmatrix} 0{,}643 & -0{,}766 & 0 \\\\ 0{,}766 & 0{,}643 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\end{aligned} \\]' +
          '<p>Notations du cours : \\(R^{0,1} = {}^0R_1 = R_{01} = R^0_1\\).</p>');
        suite(ex, 1); reussi(1);
      }
    } },

    { nom: "Corriger", ouvrir: function () {
      vue.O = [150, 520]; vue.u = 150; cadre();
      legende.textContent = "1 carreau = 0,1";
      var R = E.Rz(30 * DEG), V0 = E.mv(R, [2, 1, 0]), faux = [2.232, 1.866, 0];
      axes1(gFig, 30, { y: true, longueur: 0.8 });
      fleche(gFig, P([0, 0]), P(V0), C.v, 4.5); main(gFig, "aiguille V", plus(P(V0), [-4, -26]), { coul: C.v, taille: 26, ancre: "end" });
      var gC = E.s("g", null, gFig); croix(gC, faux, C.rouge, "point de la copie");
      contenu.innerHTML = '<span class="num">3</span><h2>Une copie à corriger.</h2>' +
        '<p class="consigne">α = 30° et une aiguille fixe dans \\(R_1\\) : \\(V^1 = (2 ;\\ 1 ;\\ 0)\\). Sur la figure, le point de la copie ne tombe pas sur la pointe. Touche la première ligne fausse.</p><div class="copie"></div>';
      E.rendre(contenu);
      var LIGNES = [
        ["colonnes de \\(R^{0,1}\\) : (0,866 ; 0,5 ; 0), (−0,5 ; 0,866 ; 0), (0 ; 0 ; 1)", "juste"],
        ["\\(V^0 = R^{0,1}\\,V^1\\)", "juste"],
        ["x = 0,866 × 2 + 0,5 × 1 = 2,232", "erreur"],
        ["y = 0,5 × 2 + 0,866 × 1 = 1,866", "juste"],
        ["donc \\(V^0\\) = (2,232 ; 1,866 ; 0)", "consequence"]
      ];
      var copie = contenu.querySelector(".copie"), trouve = false;
      LIGNES.forEach(function (l, k) {
        var d = E.h("div", "ligne", '<span class="numero">' + (k + 1) + '</span><span class="txt">' + l[0] + '</span><span class="barre"></span>', copie);
        d.addEventListener("click", function () {
          if (trouve) return;
          var ancien = contenu.querySelector(".main-note"); if (ancien) ancien.remove();
          if (l[1] === "juste") { d.classList.add("juste"); note(contenu, "Cette ligne est juste.", "vert"); return; }
          if (l[1] === "consequence") { note(contenu, "Elle est fausse, mais l'erreur vient d'une ligne plus haut.", "rouge"); return; }
          trouve = true; d.classList.add("erreur");
          var corr = E.h("div", "correction apparait", "x = 0,866 × 2 + (−0,5) × 1 = 1,232", null);
          copie.insertBefore(corr, d.nextSibling);
          // la croix rejoint la pointe
          E.anime(900, function (e) { E.vider(gC); croix(gC, [faux[0] + (V0[0] - faux[0]) * e, faux[1], 0], e < 1 ? C.rouge : C.vert, e < 1 ? "" : "corrigé"); });
          var ex = expliquer('<p>La première ligne de la matrice est \\((0{,}866 ;\\ -0{,}5 ;\\ 0)\\) : le signe moins vient de \\(\\vec{y}_1\\), qui pointe un peu vers \\(-\\vec{x}_0\\). Chaque composante de \\(V^0\\) est une ligne de la matrice multipliée par \\(V^1\\).</p>' +
            '\\[ \\begin{aligned} V^0 = R^{0,1}\\,V^1 &= \\begin{pmatrix} 0{,}866 \\times 2 + (-0{,}5) \\times 1 \\\\ 0{,}5 \\times 2 + 0{,}866 \\times 1 \\\\ 0 \\end{pmatrix} \\\\[4pt] &= \\begin{pmatrix} 1{,}232 \\\\ 1{,}866 \\\\ 0 \\end{pmatrix} \\end{aligned} \\]');
          suite(ex, 2); reussi(2);
        });
      });
      E.rendre(copie);
    } },

    { nom: "Prédire", ouvrir: function () {
      vue.O = [400, 400]; vue.u = 170; cadre();
      legende.textContent = "1 carreau = 0,1";
      axes1(gFig, 120, { y: true });
      arc(gFig, 0, 120, 0.3 * vue.u, C.bleu, "120°");
      contenu.innerHTML = '<span class="num">4</span><h2>Prédis au crayon : où arrive \\(V\\) ?</h2>' +
        '<p class="consigne">α = 120° et \\(V^1 = (1 ;\\ 1 ;\\ 0)\\), fixe dans \\(R_1\\). Marque d\'une croix la pointe de \\(V\\) sur la page de gauche, puis vérifie.</p>';
      E.rendre(contenu);
      var pin = null, gP = E.s("g", null, gHaut);
      mode = "croix";
      var verif = bouton(contenu, "Vérifier", "suite", function () {
        if (!pin) return; mode = null; verif.remove();
        var R = E.Rz(120 * DEG), x1 = E.col(R, 0), y1 = E.col(R, 1), V0 = E.mv(R, [1, 1, 0]);
        fleche(gHaut, P([0, 0]), P(x1), C.x, 3, { tirets: "8 7" });
        setTimeout(function () { fleche(gHaut, P(x1), P(V0), C.y, 3.5, { trace: 500 }); }, 300);
        setTimeout(function () { fleche(gHaut, P([0, 0]), P(V0), C.v, 5, { trace: 600 }); main(gHaut, "V", plus(P(V0), [-26, -18]), { coul: C.v }); }, 850);
        var d = Math.hypot(pin[0] - V0[0], pin[1] - V0[1]);
        setTimeout(function () {
          note(contenu, d < 0.25 ? "Ta croix est à " + fc(d, 2) + " de la pointe. Très bien." : "Ta croix est à " + fc(d, 2) + " de la pointe : suis les flèches, un pas selon x₁ puis un pas selon y₁.", d < 0.25 ? "vert" : "rouge");
          var ex = expliquer('<p>\\(V^1 = (1 ;\\ 1 ;\\ 0)\\) veut dire un pas selon \\(\\vec{x}_1\\) et un pas selon \\(\\vec{y}_1\\). Dans \\(R_0\\), c\'est la somme des deux premières colonnes de la matrice :</p>' +
            '\\[ \\begin{aligned} V^0 = R^{0,1}\\,V^1 &= \\begin{pmatrix} \\cos 120° \\\\ \\sin 120° \\\\ 0 \\end{pmatrix} + \\begin{pmatrix} -\\sin 120° \\\\ \\cos 120° \\\\ 0 \\end{pmatrix} \\\\[4pt] &= \\begin{pmatrix} -0{,}5 - 0{,}866 \\\\ 0{,}866 - 0{,}5 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} -1{,}366 \\\\ 0{,}366 \\\\ 0 \\end{pmatrix} \\end{aligned} \\]');
          suite(ex, 3); reussi(3);
        }, 1500);
      });
      verif.disabled = true;
      surCroix = function (p) { pin = p; E.vider(gP); croix(gP, p, C.bleu, "ma prédiction"); verif.disabled = false; };
    } },

    { nom: "Fiche", ouvrir: function () {
      vue.O = [250, 400]; vue.u = 220; cadre();
      legende.textContent = "Fais glisser la pointe de x₁";
      var alpha = 35, choisi = null;
      function figure() {
        E.vider(gFig);
        axes1(gFig, alpha, { y: true });
        arc(gFig, 0, alpha, 0.28 * vue.u, C.bleu, "α");
        var t = P(E.col(E.Rz(alpha * DEG), 0));
        E.s("circle", { cx: t[0], cy: t[1], r: 14, fill: "rgba(31,75,216,.12)", stroke: C.bleu, "stroke-width": 2.5 }, gFig);
        if (choisi) {
          var i = choisi[0], j = choisi[1], A0 = [[1, 0, 0], [0, 1, 0]], R = E.Rz(alpha * DEG), cl = [C.x, C.y];
          if (i < 2) fleche(gFig, P([0, 0]), P(fois(A0[i], 1.2)), cl[i], 8, { op: 0.35 });
          if (j < 2) fleche(gFig, P([0, 0]), P(fois(E.col(R, j), 1.2)), cl[j], 8, { op: 0.35 });
        }
      }
      figure();
      mode = "rot"; surRot = function (a) { alpha = a; figure(); majValeurs(); };
      contenu.innerHTML = '<span class="num">5</span><h2>Ta fiche : que cache chaque post-it ?</h2>' +
        '<p class="consigne">Chaque case de \\(R^{0,1}\\) est le produit scalaire d\'un axe de \\(R_0\\) (sa ligne) par un axe de \\(R_1\\) (sa colonne). Devine, puis soulève le papier.</p><div class="fiche"></div>';
      E.rendre(contenu);
      var A0 = ["\\vec{x}_0", "\\vec{y}_0", "\\vec{z}_0"], A1 = ["\\vec{x}_1", "\\vec{y}_1", "\\vec{z}_1"];
      var F = [["\\cos\\alpha", "-\\sin\\alpha", "0"], ["\\sin\\alpha", "\\cos\\alpha", "0"], ["0", "0", "1"]];
      var fiche = contenu.querySelector(".fiche"), ouverts = 0, cases = [];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) (function (i, j) {
        var b = E.h("button", "postit", "r" + (i + 1) + (j + 1), fiche); b.type = "button"; cases.push([b, i, j]);
        b.addEventListener("click", function () {
          choisi = [i, j]; figure();
          if (b.classList.contains("ouvert")) return;
          b.classList.add("ouvert"); ouverts++; majValeurs();
          if (ouverts === 9) fin();
        });
      })(i, j);
      function majValeurs() {
        var R = E.Rz(alpha * DEG);
        cases.forEach(function (c) {
          if (!c[0].classList.contains("ouvert")) return;
          var f = F[c[1]][c[2]], bas = f.length > 1 ? f + " = " + E.tc(R[c[1]][c[2]], 2) : f;
          E.k(c[0], "\\begin{gathered}" + A0[c[1]] + "\\cdot" + A1[c[2]] + "\\\\ = " + bas + "\\end{gathered}");
        });
      }
      function fin() {
        var ex = expliquer('<div class="main-note">À retenir</div><p>Les colonnes de \\(R^{0,1}\\) sont les axes de \\(R_1\\) écrits dans \\(R_0\\). Pour une rotation α autour de \\(\\vec{z}_0\\), c\'est \\(R_z(\\alpha)\\).</p>' +
          '<p>Un vecteur fixe dans \\(R_1\\) s\'écrit dans \\(R_0\\) par \\(V^0 = R^{0,1}\\,V^1\\).</p><p>Notations : \\(R^{i,j} = {}^iR_j = R_{ij} = R^i_j\\).</p>');
        suite(ex, 4); reussi(4);
      }
    } }
  ];

  var onglets = document.getElementById("onglets");
  PAGES.forEach(function (p, i) {
    var b = E.h("button", "", "<span>" + (i + 1) + "</span>" + p.nom, onglets); b.type = "button";
    b.addEventListener("click", function () { if (i <= atteinte) aller(i); });
  });
  function majOnglets() {
    [].forEach.call(onglets.children, function (b, i) {
      b.className = (fini.indexOf(i) >= 0 ? "fait " : "") + (i === courante ? "courant" : "");
      b.disabled = i > atteinte;
    });
  }
  function aller(i) {
    var premier = courante < 0;
    courante = i; atteinte = Math.max(atteinte, i); majOnglets();
    function remplir() {
      mode = null; surTrait = surCroix = surRot = null;
      E.vider(gFig); E.vider(gEncre); E.vider(gHaut); E.vider(outils);
      PAGES[i].ouvrir();
      E.rendre(contenu);
      contenu.scrollTop = 0;
    }
    if (premier) { remplir(); return; }
    droite.classList.add("tourne");
    setTimeout(function () {
      remplir();
      droite.classList.add("revient"); droite.classList.remove("tourne");
      void droite.offsetWidth;
      droite.classList.remove("revient");
    }, 380);
  }
  window.essaiC = { aller: aller, vue: vue };
  aller(0);
})();
