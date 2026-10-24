/*
 * Une section du cours d'un chapitre (modules/<id>/<dossierChapitres>/cours/<section>.html, générée par outils/regrouper.js).
 * Barre du site (retour au chapitre), « Chapitre N · titre · 2 / 4 » en tête, Précédent / Suivant en bas.
 * Après la dernière section : « Terminer le cours » (retour au chapitre) et, en option, « S'entraîner sur ce chapitre ».
 * La section est lue quand on arrive en bas. Ancres : <notion>-<titre> (même calcul que les anciennes pages, notion par notion),
 * pour que « Revoir dans le cours » vise le même passage. Ouverte dans le jeu (?dans=1) : ni barre ni bas de page.
 */
(function () {
  "use strict";
  var P = window.PLATEFORME, MID = P.courant, MOD = P.module(MID);
  var main = document.querySelector("main"), sid = main.getAttribute("data-section");
  var integre = /[?&]dans=1/.test(location.search) || window.self !== window.top;
  var s0 = MOD.sections.filter(function (s) { return s.id === sid; })[0];
  var ch = P.chapitre(MID, s0.chapitre), sec = ch.sections.filter(function (s) { return s.id === sid; })[0];
  var prec = ch.sections[sec.rang - 2], suiv = ch.sections[sec.rang];
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  if (integre) document.documentElement.classList.add("integre");
  document.title = sec.titre + " · " + MOD.titre;

  if (!integre) {
    var barre = document.createElement("header");
    P.barre(barre, { carte: P.urlPlan(MID, ch.sm), droite: '<a class="btn-barre clair" href="' + P.urlChapitre(MID, ch.id) + '">Chapitre ' + ch.id + "</a>" });
    document.body.insertBefore(barre, document.body.firstChild);
    P.noterPlan(MID, ch.sm, "Cours : " + sec.titre, P.dossierChapitres(MID) + "cours/" + sid + ".html");
  }
  var etiquette = document.querySelector("[data-etiquette]");
  if (etiquette) etiquette.innerHTML = "Chapitre " + ch.id + " · " + esc(ch.titre) + '<span class="rang">' + sec.rang + " / " + sec.total + "</span>";

  // Ancres : celles des anciennes pages, préfixées par la notion (h3 = ancien h2, h4 = ancien h3)
  [].forEach.call(main.querySelectorAll("article.notion"), function (art) {
    var nid = art.id.replace(/^n-/, ""), vus = {};
    [].forEach.call(art.querySelectorAll("h3, h4"), function (t) {
      var a = P.ancre(t.textContent);
      vus[a] = (vus[a] || 0) + 1;
      t.id = nid + "-" + (vus[a] > 1 ? a + "-" + vus[a] : a);
    });
    // Formules clés : regroupées dans une carte, comme sur les anciennes pages
    [].forEach.call(art.querySelectorAll("h3"), function (t) {
      if (t.textContent.trim() !== "Formules clés") return;
      var carte = document.createElement("div"), n = t.nextSibling;
      carte.className = "cles-carte";
      while (n && !/^(H2|H3|NAV|SCRIPT)$/.test(n.nodeName)) { var suivant = n.nextSibling; carte.appendChild(n); n = suivant; }
      t.parentNode.insertBefore(carte, t.nextSibling);
    });
  });

  // Bas de page : Précédent, 2 / 4, Suivant ; après la dernière section, la fin du cours et l'option S'entraîner
  if (!integre) {
    var bas = document.createElement("nav");
    bas.className = "suite-section";
    bas.setAttribute("aria-label", "Sections du chapitre");
    var g = prec ? '<a class="retour" href="' + P.urlSection(MID, prec.id) + '"><small>Précédent</small>' + esc(prec.titre) + "</a>"
      : '<a class="retour" href="' + P.urlChapitre(MID, ch.id) + '"><small>Chapitre ' + ch.id + "</small>Retour au chapitre</a>";
    var d = suiv ? '<a class="aller" href="' + P.urlSection(MID, suiv.id) + '"><small>Suivant</small>' + esc(suiv.titre) + "</a>"
      : '<a class="aller" href="' + P.urlChapitre(MID, ch.id) + '"><small>Fin du cours</small>Terminer le cours</a>';
    bas.innerHTML = g + '<span class="rang">' + sec.rang + " / " + sec.total + "</span>" + d;
    main.appendChild(bas);
    if (!suiv) {
      var opt = document.createElement("p");
      opt.className = "option-entrainer";
      opt.innerHTML = 'Envie de vérifier ce que tu as compris ? <a href="' + P.urlChapitre(MID, ch.id) + '#entrainer">S\'entraîner sur ce chapitre</a>';
      main.appendChild(opt);
    }
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { P.marquerSection(MID, sid); obs.disconnect(); }
      }, { threshold: 0.5 });
      obs.observe(bas);
    } else P.marquerSection(MID, sid);
  }

  // Passage demandé (#ancre ou #ancre~k pour le k-ième bloc) : défilement et surlignage, comme sur les anciennes pages.
  function viser() {
    var h = decodeURIComponent((location.hash || "").slice(1));
    if (!h) return;
    var parts = h.split("~"), t = document.getElementById(parts[0]);
    if (!t) return;
    if (t.tagName === "ARTICLE") t = t.querySelector("h2");
    var seuil = t.tagName === "H4" ? /^(H2|H3|H4|NAV)$/ : t.tagName === "H3" ? /^(H2|H3|NAV)$/ : /^(NAV)$/;
    var cibles = [t], n = t.nextElementSibling, bloc = parts[1] !== undefined ? +parts[1] : -1, blocs = [];
    while (n && !seuil.test(n.tagName)) { blocs.push(n); n = n.nextElementSibling; }
    var k = bloc >= 0 && blocs[bloc];
    cibles = k ? [blocs[bloc]] : cibles.concat(blocs);
    document.querySelectorAll(".repere").forEach(function (x) { x.classList.remove("repere"); });
    cibles.forEach(function (x) { x.classList.add("repere"); });
    if (k) cibles[0].scrollIntoView({ block: "center" }); else t.scrollIntoView({ block: "start" });
  }
  window.addEventListener("load", function () { setTimeout(viser, 60); });
  window.addEventListener("hashchange", viser);
})();
