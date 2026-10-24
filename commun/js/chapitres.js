/*
 * Structure par chapitres : la carte d'un sous-module (index.html?sm=…), dans le style de la carte habituelle,
 * avec un seul nœud par chapitre (rond numéroté, titre, une ligne). Fait en vert, chapitre où l'on en est en bleu.
 * Un nœud ouvre la page du chapitre (cours/chapitre-<n>.html), où les exercices sont facultatifs. Un seul bouton : Reprendre.
 * Rien n'est verrouillé.
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

  var demande = new URLSearchParams(location.search).get("sm");
  var sms = P.sousModules(MID).filter(function (x) { return x.chapitres.length && P.avecChapitres(MID, x.id); });
  var sm = sms.filter(function (x) { return x.id === demande; })[0] || sms[0];
  document.title = sm.titre + " · " + REGISTRE.semestre;
  P.barre(document.getElementById("barre"), { carte: P.urlPlan(MID, sm.id) });

  // En-tête : choix du sous-module (un sous-module sans cette structure garde sa carte), titre, un seul bouton
  var r = P.reprendre(MID, sm.id), h = "";
  if (P.sousModules(MID).length > 1) {
    h += '<nav class="choix-sm" aria-label="Sous-modules">' + P.sousModules(MID).map(function (x) {
      if (!x.chapitres.length) return '<span class="sm-vide">' + esc(x.titre) + "</span>";
      var url = P.avecChapitres(MID, x.id) ? P.urlPlan(MID, x.id) : P.urlCarte(MID, x.id);
      return '<a href="' + url + '"' + (x.id === sm.id ? ' aria-current="page"' : "") + ">" + esc(x.titre) + "</a>";
    }).join("") + "</nav>";
  }
  h += '<div class="entete-ligne"><div class="entete-titre"><h1>' + esc(sm.titre || MOD.titre) + "</h1></div>" +
    (r ? '<a class="btn reprendre" href="' + r.url + '">' + (r.deja ? "Reprendre" : "Commencer") + "<small>" + esc(r.titre) + "</small></a>"
      : '<span class="tout-fait">Tout le cours est lu.</span>') + "</div>";
  document.getElementById("entete").innerHTML = h;

  // Les chapitres, en rangées de trois, reliés par le chemin pointillé
  var zone = document.getElementById("chapitres");
  var chemin = el("div", "chemin", "", zone), trace = s("svg", { class: "trace" }, chemin), grille = el("div", "unites", "", chemin);
  P.chapitresDe(MID, sm.id).forEach(function (c) {
    if (!c.sections.length) return;
    var u = el("div", "unite", "", grille);
    var a = el("a", "noeud-exos noeud-chapitre" + (c.etat === "fait" ? " fait" : r && r.chapitre === c.id ? " suivant" : ""), '<span class="forme">' + c.id + "</span>", u);
    a.href = P.urlChapitre(MID, c.id);
    a.setAttribute("aria-label", "Chapitre " + c.id + " : " + c.titre + (c.etat === "fait" ? " (lu)" : ""));
    el("div", "nomn", esc(c.titre) + "<small>" + esc(c.ligne) + "</small>", u);
  });

  // Chemin : d'un nœud au suivant dans une rangée ; d'une rangée à la suivante par l'espace libre sous les noms
  function relier() {
    while (trace.firstChild) trace.removeChild(trace.firstChild);
    var b0 = chemin.getBoundingClientRect();
    var pts = [].map.call(chemin.querySelectorAll(".unite"), function (u) {
      var f = u.querySelector(".forme").getBoundingClientRect(), n = u.getBoundingClientRect();
      return { g: [f.left - b0.left, f.top + f.height / 2 - b0.top], d: [f.right - b0.left, f.top + f.height / 2 - b0.top], bas: n.bottom - b0.top, haut: n.top - b0.top,
        gauche: n.left - b0.left, droite: n.right - b0.left };
    });
    var d = "";
    for (var k = 1; k < pts.length; k++) {
      var p = pts[k - 1], q = pts[k];
      if (Math.abs(p.haut - q.haut) < 4) { d += " M" + p.d + " L" + q.g; continue; }
      var y = p.bas + 26;
      d += " M" + p.d + " L" + [p.droite - 10, p.d[1]] + " L" + [p.droite - 10, y] + " L" + [q.gauche + 10, y] + " L" + [q.gauche + 10, q.g[1]] + " L" + q.g;
    }
    if (d) s("path", { d: d, fill: "none", stroke: "#d9dde6", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": "1 15" }, trace);
  }
  requestAnimationFrame(relier);
  addEventListener("resize", relier);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relier);
})();
