/*
 * Carte d'un sous-module (modules/<id>/index.html?sm=<sous-module>) : une seule carte, dans l'ordre d'apprentissage.
 * Chapitre après chapitre : pour chaque notion, l'étape Cours (nœud livre) puis l'étape Exercices (nœud rond),
 * puis la révision du chapitre et le boss. Rien n'est verrouillé. Les étapes viennent de PLATEFORME.etapes.
 */
(function () {
  "use strict";
  var P = window.PLATEFORME, MID = P.courant, MOD = P.module(MID);
  var ETOILE = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8z" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var LIVRE = '<svg class="livre" viewBox="0 0 40 32" aria-hidden="true"><path d="M20 6.5C16 3.6 10 3 4 4.2v22c6-1.2 12-.6 16 2.3 4-2.9 10-3.5 16-2.3v-22C30 3 24 3.6 20 6.5z"/><path d="M20 6.5v22"/></svg>';
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  var sms = P.sousModules(MID);
  var demande = new URLSearchParams(location.search).get("sm");
  var SM = sms.some(function (s) { return s.id === demande && s.chapitres.length; }) ? demande : P.smCourant(MID);
  var sm = sms.filter(function (s) { return s.id === SM; })[0] || sms[0];
  var etapes = P.etapes(MID, sm.id);
  var suite = P.continuer(MID, sm.id), cible = suite.etape;
  var cpt = P.compte(MID, sm.id);

  document.title = (sm.titre || MOD.titre) + " · " + REGISTRE.semestre;
  P.barre(document.getElementById("barre"), { sm: sm.id });

  // En-tête : sous-module (et choix de l'autre sous-module), avancement, Continuer, lien discret « Tous les cours »
  var ent = document.getElementById("entete"), h = "";
  if (sms.length > 1) {
    h += '<nav class="choix-sm" aria-label="Sous-modules">' + sms.map(function (s) {
      if (!s.chapitres.length) return '<span class="sm-vide">' + esc(s.titre) + " <small>à venir</small></span>";
      return '<a href="index.html?sm=' + encodeURIComponent(s.id) + '"' + (s.id === sm.id ? ' aria-current="page"' : "") + ">" + esc(s.titre) + "</a>";
    }).join("") + "</nav>";
  }
  h += '<div class="entete-ligne"><div class="entete-titre"><h1>' + esc(sm.titre || MOD.titre) + "</h1>" +
    "<p>Lis le cours, puis fais les exercices de la même notion. À la fin de chaque chapitre : une révision, puis le boss. L'ordre est conseillé, rien n'est bloqué.</p></div>" +
    '<div class="total"><b>' + cpt.faits + " / " + cpt.total + "</b><small>étapes faites</small></div></div>" +
    '<div class="entete-actions">' +
    (cible ? '<a class="btn" id="continuer" href="' + suite.url + '">' + (cpt.faits ? "Continuer" : "Commencer") + " : " + esc(suite.phrase) + "</a>" : '<span class="tout-fait">Toutes les étapes sont faites.</span>') +
    '<a class="lien-cours" href="cours/index.html' + (sm.id ? "?sm=" + encodeURIComponent(sm.id) : "") + '">Tous les cours</a></div>';
  ent.innerHTML = h;

  // Chapitres : la carte se dessine en rangées de trois unités (une notion = cours + exercices)
  var zone = document.getElementById("chapitres"), numero = 0;
  sm.chapitres.forEach(function (ch) {
    var siennes = etapes.filter(function (x) { return x.chapitre === ch.id; });
    if (!siennes.length) return;
    var sec = E.h("section", "chapitre", "", zone); sec.id = "ch" + ch.id;
    E.h("header", "", '<span class="num">CHAPITRE ' + ch.id + "</span><h2>" + esc(ch.titre) + "</h2>" + (ch.sous ? "<p>" + esc(ch.sous) + "</p>" : ""), sec);
    var chemin = E.h("div", "chemin", "", sec);
    var trace = E.s("svg", { class: "trace" }, chemin);
    var grille = E.h("div", "unites", "", chemin), fin = null;
    // regroupe : cours + exercices de la même notion ; révision et boss à part, sur leur rangée
    var unites = [];
    siennes.forEach(function (x) {
      if (x.revision || x.boss) { if (!fin) fin = E.h("div", "unites fin-chapitre", "", chemin); unites.push({ fin: true, etapes: [x] }); return; }
      var der = unites[unites.length - 1];
      if (x.type === "exos" && der && !der.fin && der.etapes.length === 1 && der.etapes[0].type === "cours" && der.etapes[0].id === x.id) der.etapes.push(x);
      else unites.push({ etapes: [x] });
    });
    unites.forEach(function (u) {
      var x0 = u.etapes[0];
      var el = E.h("div", "unite" + (u.fin ? " finale" : ""), "", u.fin ? fin : grille);
      var rang = E.h("div", "paire", "", el);
      if (!u.fin) numero++;
      u.etapes.forEach(function (x, k) {
        if (k) E.h("span", "lien-paire", "", rang);
        rang.appendChild(noeud(x, numero));
      });
      var titre = x0.titre;
      E.h("div", "nomn", esc(titre), el);
      var ex = u.etapes.filter(function (x) { return x.type === "exos"; })[0];
      if (ex && ex.fait) {
        var hs = "";
        for (var s = 0; s < 3; s++) hs += '<span class="' + (s < ex.etoiles ? "pleine" : "vide") + '">' + ETOILE + "</span>";
        E.h("div", "mini", hs, el);
      }
    });
    function relier() { dessinerChemin(chemin, trace); }
    requestAnimationFrame(relier);
    addEventListener("resize", relier);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relier);
  });
  if (!sm.chapitres.length) E.h("div", "a-venir-carte", "Ce sous-module arrivera avec ses cours.", zone);

  function noeud(x, num) {
    var etat = x.fait ? " fait" : cible && x.type === cible.type && x.id === cible.id ? " suivant" : "";
    var a = document.createElement("a");
    a.href = P.racine + x.url;
    a.dataset.etape = x.type + ":" + x.id;
    if (x.type === "cours") {
      a.className = "noeud-cours" + etat;
      a.setAttribute("aria-label", "Cours : " + x.titre + (x.fait ? " (lu)" : ""));
      a.innerHTML = '<span class="forme">' + LIVRE + "</span>";
    } else if (x.boss) {
      a.className = "noeud-exos boss" + etat;
      a.setAttribute("aria-label", "Boss : " + x.titre);
      a.innerHTML = '<span class="forme"><span>BOSS</span></span>';
    } else if (x.revision) {
      a.className = "noeud-exos revision" + etat;
      a.setAttribute("aria-label", "Révision du chapitre : " + x.titre);
      a.innerHTML = '<span class="forme"><span>RÉV</span></span>';
    } else {
      a.className = "noeud-exos" + etat;
      a.setAttribute("aria-label", "Exercices : " + x.titre);
      a.innerHTML = '<span class="forme">' + num + "</span>";
    }
    return a;
  }

  // Chemin pointillé : d'un nœud au suivant dans une rangée ; d'une rangée à la suivante par l'espace libre entre elles.
  function dessinerChemin(chemin, trace) {
    E.vider(trace);
    var b0 = chemin.getBoundingClientRect();
    var formes = [].slice.call(chemin.querySelectorAll(".unite"));
    var pts = formes.map(function (u) {
      var f = u.querySelectorAll(".forme"), a = f[0].getBoundingClientRect(), b = f[f.length - 1].getBoundingClientRect(), n = u.getBoundingClientRect();
      var t = u.querySelector(".nomn").getBoundingClientRect();
      return { g: [a.left - b0.left, a.top + a.height / 2 - b0.top], d: [b.right - b0.left, b.top + b.height / 2 - b0.top], bas: n.bottom - b0.top,
        gauche: Math.min(a.left, t.left) - b0.left, droite: Math.max(b.right, t.right) - b0.left, haut: n.top - b0.top };
    });
    var d = "";
    for (var k = 1; k < pts.length; k++) {
      var p = pts[k - 1], q = pts[k];
      if (Math.abs(p.haut - q.haut) < 4) { d += " M" + p.d + " L" + q.g; continue; }
      // rangée suivante : longer le côté du dernier nœud, passer dans l'espace libre sous la rangée (sous les noms),
      // revenir vers le premier nœud de la rangée suivante et y entrer par la gauche
      var x0 = Math.max(p.d[0], p.droite) + 22, xg = Math.min(q.g[0], q.gauche) - 22, y = Math.max(p.bas + 14, p.d[1] + 70);
      d += " " + coins([p.d, [x0, p.d[1]], [x0, y], [xg, y], [xg, q.g[1]], q.g], 18);
    }
    if (d) E.s("path", { d: d, fill: "none", stroke: "#d9dde6", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": "1 15" }, trace);
  }

  // Ligne brisée à coins arrondis (rayon r) passant par les points donnés.
  function coins(pts, r) {
    var d = "M" + pts[0];
    for (var i = 1; i < pts.length - 1; i++) {
      var a = pts[i - 1], b = pts[i], c = pts[i + 1];
      var l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]), k = Math.min(r, l1 / 2, l2 / 2);
      if (k < 1) { d += " L" + b; continue; }
      var e1 = [b[0] - (b[0] - a[0]) / l1 * k, b[1] - (b[1] - a[1]) / l1 * k], e2 = [b[0] + (c[0] - b[0]) / l2 * k, b[1] + (c[1] - b[1]) / l2 * k];
      d += " L" + e1 + " Q" + b + " " + e2;
    }
    return d + " L" + pts[pts.length - 1];
  }

  document.getElementById("effacer").addEventListener("click", function () {
    if (!confirm("Effacer toutes tes étoiles et ta progression dans ce module ?")) return;
    P.effacer(MID);
    location.reload();
  });
  if (location.hash) { var c = document.querySelector(location.hash); if (c) c.scrollIntoView(); }
})();
