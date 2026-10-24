/*
 * Structure par chapitres : le plan d'un sous-module (index.html?sm=…) et l'écran d'un chapitre (chapitre.html?ch=…).
 * Plan : tous les chapitres sur un écran, reliés par des flèches (chapitres[].avant dans module.js) ; l'état se lit au style :
 * fond pâle = fait, contour coloré = commencé, gris = pas commencé. Un seul bouton « Reprendre ». Rien n'est verrouillé.
 * Chapitre : deux cartes séparées, Cours (une page qui défile, en 3 à 5 sections) et S'entraîner (exercices, révision, défi final).
 */
(function () {
  "use strict";
  var P = window.PLATEFORME, MID = P.courant, MOD = P.module(MID);
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function el(tag, cls, html, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  var NS = "http://www.w3.org/2000/svg";
  function s(tag, att, parent) { var e = document.createElementNS(NS, tag); for (var k in att) e.setAttribute(k, att[k]); if (parent) parent.appendChild(e); return e; }
  var q = new URLSearchParams(location.search);

  if (document.body.classList.contains("plan-chapitres")) plan(); else chapitre();

  /* ---------------- Plan du sous-module ---------------- */
  function plan() {
    var sms = P.sousModules(MID).filter(function (x) { return x.chapitres.length; });
    var sm = sms.filter(function (x) { return x.id === q.get("sm") && P.avecChapitres(MID, x.id); })[0] ||
      sms.filter(function (x) { return P.avecChapitres(MID, x.id); })[0];
    document.title = sm.titre + " · " + REGISTRE.semestre;
    P.barre(document.getElementById("barre"), { carte: P.urlPlan(MID, sm.id) });

    // Choix du sous-module : un interrupteur simple (un sous-module sans cette structure garde sa carte)
    var tete = document.getElementById("entete"), h = "";
    if (P.sousModules(MID).length > 1) {
      h += '<nav class="choix-sm" aria-label="Sous-modules">' + P.sousModules(MID).map(function (x) {
        if (!x.chapitres.length) return '<span class="vide">' + esc(x.titre) + "</span>";
        var url = P.avecChapitres(MID, x.id) ? P.urlPlan(MID, x.id) : P.urlCarte(MID, x.id);
        return '<a href="' + url + '"' + (x.id === sm.id ? ' aria-current="page"' : "") + ">" + esc(x.titre) + "</a>";
      }).join("") + "</nav>";
    } else h += "<h1>" + esc(sm.titre || MOD.titre) + "</h1>";
    tete.innerHTML = h;

    // Nœuds : colonne = profondeur dans le graphe des prérequis ; hauteur = moyenne de celles des prérequis
    var chs = P.chapitresDe(MID, sm.id), parId = {};
    chs.forEach(function (c) { parId[c.id] = c; });
    function profondeur(c) {
      if (c.p !== undefined) return c.p;
      c.p = 0;
      c.avant.forEach(function (a) { if (parId[a]) c.p = Math.max(c.p, profondeur(parId[a]) + 1); });
      return c.p;
    }
    chs.forEach(profondeur);
    var nbCol = Math.max.apply(null, chs.map(function (c) { return c.p; })) + 1, cols = [];
    for (var k = 0; k < nbCol; k++) cols.push(chs.filter(function (c) { return c.p === k; }));
    cols.forEach(function (col) {
      col.forEach(function (c) {
        var ys = c.avant.filter(function (a) { return parId[a]; }).map(function (a) { return parId[a].y; });
        c.y = ys.length ? ys.reduce(function (a, b) { return a + b; }, 0) / ys.length : 0.5;
      });
      if (col.length > 1) {
        col.sort(function (a, b) { return a.y - b.y || a.id - b.id; });
        col.forEach(function (c, i) { c.y = 0.2 + 0.6 * i / (col.length - 1); });
      }
    });

    var zone = document.getElementById("plan"), svg = s("svg", { class: "fleches", "aria-hidden": "true" }, zone);
    var defs = s("defs", {}, svg), mk = s("marker", { id: "pointe", viewBox: "0 0 12 12", refX: 10, refY: 6, markerWidth: 12, markerHeight: 12, markerUnits: "userSpaceOnUse", orient: "auto" }, defs);
    s("path", { d: "M1 1 L11 6 L1 11 z", fill: "#b9bfcb" }, mk);
    chs.forEach(function (c) {
      var a = el("a", "noeud-chapitre" + (c.etat ? " " + c.etat : ""), "<b>" + esc(c.titre) + "</b><span>" + esc(c.ligne) + "</span>", zone);
      a.href = P.urlChapitre(MID, c.id);
      a.dataset.chapitre = c.id;
      a.setAttribute("aria-label", "Chapitre " + c.id + " : " + c.titre + (c.etat === "fait" ? " (fait)" : c.etat === "encours" ? " (commencé)" : ""));
      a.style.left = (100 * (c.p + 0.5) / nbCol) + "%";
      a.style.top = (100 * c.y) + "%";
      a.style.width = "min(260px, calc(" + (100 / nbCol).toFixed(3) + "% - 36px))";
      c.el = a;
    });
    function fleches() {
      [].slice.call(svg.querySelectorAll("path.f")).forEach(function (p) { p.remove(); });
      var b0 = zone.getBoundingClientRect();
      chs.forEach(function (c) {
        c.avant.forEach(function (aid) {
          var a = parId[aid]; if (!a) return;
          var ra = a.el.getBoundingClientRect(), rc = c.el.getBoundingClientRect();
          var x1 = ra.right - b0.left + 6, y1 = ra.top + ra.height / 2 - b0.top, x2 = rc.left - b0.left - 8, y2 = rc.top + rc.height / 2 - b0.top;
          var m = (x2 - x1) / 2;
          s("path", { class: "f", d: "M" + x1 + " " + y1 + " C" + (x1 + m) + " " + y1 + " " + (x2 - m) + " " + y2 + " " + x2 + " " + y2,
            fill: "none", stroke: "#c3c8d2", "stroke-width": 3, "stroke-linecap": "round", "marker-end": "url(#pointe)" }, svg);
        });
      });
    }
    requestAnimationFrame(fleches);
    addEventListener("resize", fleches);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fleches);

    // Un seul bouton : reprendre là où l'on s'est arrêté
    var r = P.reprendre(MID, sm.id), pied = document.getElementById("reprendre");
    if (r) pied.innerHTML = '<a class="btn reprendre" href="' + r.url + '">' + (r.deja ? "Reprendre" : "Commencer") + "<small>" + esc(r.titre) + "</small></a>";
    else pied.innerHTML = '<p class="tout-fait">Tout le sous-module est fait.</p>';
  }

  /* ---------------- Écran d'un chapitre ---------------- */
  function chapitre() {
    var c = P.chapitre(MID, +q.get("ch"));
    if (!c || !c.sections.length) { location.replace(P.urlPlan(MID)); return; }
    document.title = c.titre + " · " + MOD.titre;
    P.barre(document.getElementById("barre"), { carte: P.urlPlan(MID, c.sm), droite: '<a class="btn-barre clair" href="' + P.urlPlan(MID, c.sm) + '">Plan des chapitres</a>' });
    document.getElementById("entete").innerHTML = '<span class="surtitre">Chapitre ' + c.id + "</span><h1>" + esc(c.titre) + "</h1><p>" + esc(c.ligne) + "</p>";

    // Cours : les sections dans l'ordre ; le bouton ouvre la première pas lue
    var aLire = c.sections.filter(function (x) { return !x.lue; })[0];
    var lib = !aLire ? "Relire le cours" : c.sections.some(function (x) { return x.lue; }) ? "Reprendre la lecture" : "Lire le cours";
    var cours = document.getElementById("cours");
    cours.innerHTML = '<div class="carte-tete"><h2>Cours</h2><a class="btn" href="' + P.urlSection(MID, (aLire || c.sections[0]).id) + '">' + lib + "</a></div>" +
      '<ol class="liste">' + c.sections.map(function (x) {
        return '<li><a class="' + (x.lue ? "fait" : "") + '" href="' + P.urlSection(MID, x.id) + '"><i>' + x.rang + "</i><span>" + esc(x.titre) + "</span></a></li>";
      }).join("") + "</ol>";

    // S'entraîner : exercices dans l'ordre, puis la révision et le défi final ; le bouton ouvre le premier pas fait
    var aFaire = c.niveaux.filter(function (x) { return !x.fait; })[0];
    var lib2 = !aFaire ? "Recommencer" : c.niveaux.some(function (x) { return x.fait; }) ? "Continuer" : "Commencer";
    var ent = document.getElementById("entrainer"), num = 0;
    ent.innerHTML = '<div class="carte-tete"><h2>S\'entraîner</h2><a class="btn clair" href="' + P.urlExercice(MID, (aFaire || c.niveaux[0]).id) + '">' + lib2 + "</a></div>" +
      '<ol class="liste' + (c.niveaux.length > 10 ? ' deux-col" style="grid-template-rows: repeat(' + Math.ceil(c.niveaux.length / 2) + ', auto)' : "") + '">' + c.niveaux.map(function (x) {
        var marque = x.boss ? "Défi" : x.revision ? "Rév." : ++num;
        return '<li><a class="' + (x.fait ? "fait" : "") + (x.boss || x.revision ? " fin" : "") + '" href="' + P.urlExercice(MID, x.id) + '"><i>' + marque + "</i><span>" +
          esc(x.boss ? "Défi final : " + x.titre : x.titre) + "</span></a></li>";
      }).join("") + "</ol>";
    if (location.hash === "#entrainer") ent.classList.add("vise");
  }
})();
