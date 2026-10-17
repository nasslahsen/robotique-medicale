/*
 * Tableau de bord : une carte par module du registre, avec ses sous-modules, sa couleur, sa progression
 * et un bouton « Continuer ». Les modules actifs chargent leur module.js pour compter leurs pages.
 */
(function () {
  "use strict";
  var P = window.PLATEFORME, R = window.REGISTRE;
  var actifs = R.modules.filter(function (m) { return m.statut === "actif"; });
  var reste = actifs.length;

  document.getElementById("semestre").textContent = R.semestre;
  if (!reste) afficher();
  actifs.forEach(function (m) {
    var s = document.createElement("script");
    s.src = P.racine + "modules/" + m.id + "/module.js";
    s.onload = s.onerror = function () { if (--reste === 0) afficher(); };
    document.body.appendChild(s);
  });

  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function afficher() {
    var faits = 0, total = 0, recent = null;
    actifs.forEach(function (m) {
      var c = P.compte(m.id), d = P.dernier(m.id);
      faits += c.faits; total += c.total;
      if (d && (!recent || (d.quand || 0) > (recent.d.quand || 0))) recent = { m: m, d: d };
    });
    document.getElementById("total-global").innerHTML = "<b>" + faits + " / " + total + "</b> pages terminées";

    // Bandeau « Reprendre » : le module ouvert en dernier
    var zr = document.getElementById("reprendre-module");
    if (recent) {
      var m = P.module(recent.m.id), c = P.compte(m.id), suite = P.continuer(m.id);
      zr.innerHTML = '<section class="reprendre-carte" style="--c:' + m.couleur + ";--cl:" + m.clair + ";--ct:" + m.texte + '">' +
        '<div class="rc-texte"><span class="rc-kicker">REPRENDRE · ' + esc(m.titre.toUpperCase()) + "</span>" +
        "<h1>" + esc(suite.titre) + "</h1>" + barre(c) + "</div>" +
        '<a class="btn-continuer grand" href="' + suite.url + '">Continuer</a></section>';
    } else {
      zr.innerHTML = '<section class="accueil"><h1>' + esc(R.semestre) + "</h1><p>Tous les modules du semestre, au même endroit. Choisis un module pour commencer.</p></section>";
    }

    // Cartes des modules
    var z = document.getElementById("modules"), h = "";
    R.modules.forEach(function (m0, i) {
      var m = P.module(m0.id), actif = m.statut === "actif";
      var sms = (m.sousModules || []).map(function (sm) {
        return '<span class="sm' + (sm.statut === "a-venir" ? " sm-vide" : "") + '">' + esc(sm.titre) + "</span>";
      }).join("");
      var bas;
      if (actif) {
        var c = P.compte(m.id), suite = P.continuer(m.id);
        bas = barre(c) + '<a class="btn-continuer" href="' + suite.url + '">Continuer</a>';
      } else {
        bas = '<span class="badge-avenir">À venir</span>';
      }
      h += '<article class="carte-module' + (actif ? "" : " avenir") + '" style="--c:' + m.couleur + ";--cl:" + m.clair + ";--ct:" + m.texte + '">' +
        '<span class="cm-num">MODULE ' + (i + 1) + "</span>" +
        (actif ? '<h3><a href="' + P.racine + "modules/" + m.id + '/index.html">' + esc(m.titre) + "</a></h3>" : "<h3>" + esc(m.titre) + "</h3>") +
        (sms ? '<div class="cm-sms">' + sms + "</div>" : '<div class="cm-sms"></div>') +
        '<div class="cm-bas">' + bas + "</div></article>";
    });
    z.innerHTML = h;
  }

  function barre(c) {
    var pc = c.total ? Math.round(100 * c.faits / c.total) : 0;
    return '<div class="progres"><div class="piste"><i style="width:' + pc + '%"></i></div><span><b>' + c.faits + " / " + c.total + "</b> pages</span></div>";
  }
})();
