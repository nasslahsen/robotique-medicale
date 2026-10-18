/*
 * Pages de cours d'un module (modules/<id>/cours/) : barre du site avec « Passer aux exercices »,
 * ancres des sections, formules clés en carte, bas de page, page marquée lue quand on arrive en bas.
 * Ouverte dans le jeu (cadre, adresse ?dans=1) : ni barre ni bas de page, la section demandée est surlignée.
 * Sommaire (cours/index.html?sm=…) : la liste simple des pages du sous-module, pour relire.
 * L'ordre et les étapes viennent de module.js, via PLATEFORME.
 */
(function () {
  "use strict";

  var P = window.PLATEFORME, MID = P.courant, MOD = P.module(MID);
  var slug = (location.pathname.match(/([^/]+)\.html$/) || [])[1] || "";
  var integre = /[?&]dans=1/.test(location.search) || window.self !== window.top;
  var trouve = P.trouver(MID, "cours", slug), etape = trouve && trouve.etape;
  var chapitre = etape ? MOD.chapitres.filter(function (c) { return c.id === etape.chapitre; })[0] : null;
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  if (integre) document.documentElement.classList.add("integre");

  // Exercices de la même notion (étape suivante sur la carte) ; à défaut, l'étape suivante.
  var exos = etape ? trouve.liste[trouve.rang + 1] : null;
  if (exos && !(exos.type === "exos" && exos.id === slug)) exos = null;
  var apres = etape ? trouve.liste[trouve.rang + 1] || null : null;
  function boutonSuite(cls) {
    if (exos) return '<a class="' + cls + '" href="../jouer.html#' + encodeURIComponent(slug) + '">Passer aux exercices</a>';
    if (apres) return '<a class="' + cls + '" href="' + P.urlEtape(apres) + '">Étape suivante</a>';
    return "";
  }

  // Barre du haut
  var main = document.querySelector("main");
  if (!integre) {
    var barre = document.createElement("header");
    P.barre(barre, { sm: etape ? etape.sm : new URLSearchParams(location.search).get("sm") || undefined, chapitre: etape ? etape.chapitre : undefined,
      droite: etape ? boutonSuite("btn-barre") : "" });
    document.body.insertBefore(barre, document.body.firstChild);
  }
  if (etape && !integre) P.noterDernier(MID, "Cours : " + etape.titre, "modules/" + MID + "/cours/" + slug + ".html");

  // Chapitre en tête de page
  var etiquette = document.querySelector("[data-etiquette]");
  if (etiquette && chapitre) etiquette.textContent = "Chapitre " + chapitre.id + " · " + chapitre.titre + " · Cours";

  // Ancres des sections (h2, h3) : les liens « Revoir dans le cours » du jeu y mènent.
  var vus = {};
  [].forEach.call(document.querySelectorAll("main h2, main h3"), function (t) {
    if (t.id) return;
    var a = P.ancre(t.textContent);
    vus[a] = (vus[a] || 0) + 1;
    t.id = vus[a] > 1 ? a + "-" + vus[a] : a;
  });

  // Formules clés : regroupées dans une carte
  [].forEach.call(document.querySelectorAll("main > h2"), function (t) {
    if (t.textContent.trim() !== "Formules clés") return;
    var carte = document.createElement("div"), n = t.nextSibling;
    carte.className = "cles-carte";
    // nœuds texte compris : les formules ne sont pas encore rendues par KaTeX
    while (n && !/^(H2|NAV|SCRIPT)$/.test(n.nodeName)) { var suivant = n.nextSibling; carte.appendChild(n); n = suivant; }
    t.parentNode.insertBefore(carte, t.nextSibling);
  });

  // Bas de page : retour à la carte, et le bouton qui mène aux exercices de la notion
  if (main && etape && !integre) {
    var bas = document.createElement("nav");
    bas.className = "suite";
    bas.setAttribute("aria-label", "Suite du parcours");
    var ex = exos ? '<small>Exercices · ' + esc(exos.titre) + "</small>Passer aux exercices" : apres ? "<small>" + P.genre(apres) + " · " + esc(apres.titre) + "</small>Étape suivante" : "";
    bas.innerHTML = '<a class="retour" href="' + P.urlCarte(MID, etape.sm, etape.chapitre) + '"><small>Carte</small>Retour à la carte</a>' +
      (ex ? '<a class="aller" href="' + (exos ? "../jouer.html#" + encodeURIComponent(slug) : P.urlEtape(apres)) + '">' + ex + "</a>" : "");
    main.appendChild(bas);
    // Page lue : quand le bas de page apparaît à l'écran
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { P.marquerLu(MID, slug); obs.disconnect(); }
      }, { threshold: 0.5 });
      obs.observe(bas);
    } else P.marquerLu(MID, slug);
  }

  // Section demandée dans l'adresse (#ancre ou #ancre~k pour le k-ième bloc de la section) : défilement et surlignage.
  function viser() {
    var h = decodeURIComponent((location.hash || "").slice(1));
    if (!h) return;
    var parts = h.split("~"), t = document.getElementById(parts[0]);
    if (!t) return;
    var cibles = [t], n = t.nextElementSibling, k = 0, bloc = parts[1] !== undefined ? +parts[1] : -1;
    // la section : le titre et ses blocs jusqu'au titre suivant de même niveau ou plus haut
    var seuil = t.tagName === "H2" ? /^(H2|NAV)$/ : /^(H2|H3|NAV)$/;
    var blocs = [];
    while (n && !seuil.test(n.tagName)) { blocs.push(n); n = n.nextElementSibling; }
    if (bloc >= 0 && blocs[bloc]) { cibles = [blocs[bloc]]; k = 1; } else cibles = cibles.concat(blocs);
    document.querySelectorAll(".repere").forEach(function (x) { x.classList.remove("repere"); });
    cibles.forEach(function (x) { x.classList.add("repere"); });
    (k ? cibles[0] : t).scrollIntoView({ block: "start" });
  }
  // après KaTeX et les figures : la mise en page est stable
  window.addEventListener("load", function () { setTimeout(viser, 60); });
  window.addEventListener("hashchange", viser);

  // Sommaire « Tous les cours » : la liste des pages du sous-module, chapitre par chapitre
  var liste = document.querySelector("[data-parcours]");
  if (liste) {
    var sms = P.sousModules(MID).filter(function (s) { return s.chapitres.length; });
    var demande = new URLSearchParams(location.search).get("sm");
    var sm = sms.filter(function (s) { return s.id === demande; })[0] || sms.filter(function (s) { return s.id === P.smCourant(MID); })[0] || sms[0];
    var b = document.querySelector(".site-module");
    if (b) b.href = P.urlCarte(MID, sm.id);
    var h1 = document.querySelector("main h1");
    if (h1 && sm.titre) h1.insertAdjacentHTML("beforebegin", '<p class="etiquette">' + esc(sm.titre) + "</p>");
    var hp = "", pages = P.etapes(MID, sm.id).filter(function (x) { return x.type === "cours"; });
    sm.chapitres.forEach(function (ch) {
      var siennes = pages.filter(function (x) { return x.chapitre === ch.id; });
      if (!siennes.length) return;
      hp += '<h2 class="partie-titre">Chapitre ' + ch.id + " · " + esc(ch.titre) + '</h2><ol class="liste-cours">';
      siennes.forEach(function (x) {
        hp += '<li><a href="' + x.id + '.html"><span class="nom">' + esc(x.titreLong) + "</span>" + (x.fait ? '<span class="lu">lu</span>' : "") + "</a></li>";
      });
      hp += "</ol>";
    });
    liste.innerHTML = hp;
  }
})();
