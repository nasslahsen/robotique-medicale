/*
 * Le cours d'un chapitre sur une seule page qui défile (modules/<id>/<dossierChapitres>/cours/chapitre-<n>.html,
 * générée par outils/regrouper.js). Pas de bouton entre les sections : on lit d'un trait.
 * La barre montre la section où l'on est (« 2 / 4 ») ; une section est lue quand on passe sa fin ;
 * « Reprendre » rouvre la page à la section où l'on s'est arrêté. En bas : « Terminer le cours » et, en option, S'entraîner.
 * Ancres : s-<section>, n-<notion>, et <notion>-<titre> (même calcul que les anciennes pages, notion par notion),
 * pour que « Revoir dans le cours » vise le même passage. Ouverte dans le jeu (?dans=1) : ni barre ni bas de page.
 */
(function () {
  "use strict";
  var P = window.PLATEFORME, MID = P.courant, MOD = P.module(MID);
  var main = document.querySelector("main"), chid = +main.getAttribute("data-chapitre");
  var integre = /[?&]dans=1/.test(location.search) || window.self !== window.top;
  var ch = P.chapitre(MID, chid);
  var parties = [].slice.call(main.querySelectorAll("section.partie"));
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  if (integre) document.documentElement.classList.add("integre");
  document.title = ch.titre + " · " + MOD.titre;

  var rang = null;
  if (!integre) {
    var barre = document.createElement("header");
    P.barre(barre, { carte: P.urlPlan(MID, ch.sm),
      droite: '<span class="rang-barre" aria-live="polite"></span><a class="btn-barre clair" href="' + P.urlChapitre(MID, ch.id) + '">Chapitre ' + ch.id + "</a>" });
    document.body.insertBefore(barre, document.body.firstChild);
    rang = barre.querySelector(".rang-barre");
  }
  var etiquette = document.querySelector("[data-etiquette]");
  if (etiquette) etiquette.textContent = "Chapitre " + ch.id + " · Cours";

  // Ancres : celles des anciennes pages, préfixées par la notion (h4 = ancien h2, h5 = ancien h3)
  [].forEach.call(main.querySelectorAll("article.notion"), function (art) {
    var nid = art.id.replace(/^n-/, ""), vus = {};
    [].forEach.call(art.querySelectorAll("h4, h5"), function (t) {
      var a = P.ancre(t.textContent);
      vus[a] = (vus[a] || 0) + 1;
      t.id = nid + "-" + (vus[a] > 1 ? a + "-" + vus[a] : a);
    });
    // Formules clés : regroupées dans une carte, comme sur les anciennes pages
    [].forEach.call(art.querySelectorAll("h4"), function (t) {
      if (t.textContent.trim() !== "Formules clés") return;
      var carte = document.createElement("div"), n = t.nextSibling;
      carte.className = "cles-carte";
      while (n && !/^(H3|H4|NAV|SCRIPT)$/.test(n.nodeName)) { var suivant = n.nextSibling; carte.appendChild(n); n = suivant; }
      t.parentNode.insertBefore(carte, t.nextSibling);
    });
  });

  if (!integre) {
    // Section en cours de lecture : celle dont le titre est passé sous la barre en dernier
    var courante = null, attente = null;
    function suivre() {
      var haut = 140, c = parties[0];
      parties.forEach(function (p) { if (p.getBoundingClientRect().top < haut) c = p; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) c = parties[parties.length - 1];
      if (c === courante) return;
      courante = c;
      var k = parties.indexOf(c), s = ch.sections[k];
      rang.textContent = (k + 1) + " / " + parties.length;
      clearTimeout(attente);
      attente = setTimeout(function () {
        P.noterPlan(MID, ch.sm, "Cours : " + s.titre, P.urlSection(MID, s.id).replace(P.racine, ""));
      }, 800);
    }
    addEventListener("scroll", suivre, { passive: true });
    addEventListener("load", suivre);
    suivre();

    // Section lue : quand sa fin apparaît à l'écran
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { P.marquerSection(MID, e.target.getAttribute("data-section")); obs.unobserve(e.target); } });
      });
      [].forEach.call(main.querySelectorAll(".fin-partie"), function (f) { obs.observe(f); });
    }

    // Bas de page : fin du cours, et l'option S'entraîner
    var bas = document.createElement("nav");
    bas.className = "fin-cours";
    bas.setAttribute("aria-label", "Fin du cours");
    bas.innerHTML = '<a class="aller" href="' + P.urlChapitre(MID, ch.id) + '"><small>Fin du cours</small>Terminer le cours</a>' +
      '<p class="option-entrainer">Envie de vérifier ce que tu as compris ? <a href="' + P.urlChapitre(MID, ch.id) + '#entrainer">S\'entraîner sur ce chapitre</a></p>';
    main.appendChild(bas);
  }

  // Passage demandé (#ancre ou #ancre~k pour le k-ième bloc) : défilement ; surlignage sauf pour une section entière.
  function viser() {
    var h = decodeURIComponent((location.hash || "").slice(1));
    if (!h) return;
    var parts = h.split("~"), t = document.getElementById(parts[0]);
    if (!t) return;
    document.querySelectorAll(".repere").forEach(function (x) { x.classList.remove("repere"); });
    if (t.tagName === "SECTION") { t.scrollIntoView({ block: "start" }); return; }
    if (t.tagName === "ARTICLE") t = t.querySelector("h3");
    // les blocs d'un titre : jusqu'au titre suivant de même niveau ou plus haut, dans la notion (comme sur les anciennes pages)
    var seuil = t.tagName === "H5" ? /^(H3|H4|H5)$/ : t.tagName === "H4" ? /^(H3|H4)$/ : /^H3$/;
    var cibles = [t], n = t.nextElementSibling, bloc = parts[1] !== undefined ? +parts[1] : -1, blocs = [];
    while (n && !seuil.test(n.tagName)) { blocs.push(n); n = n.nextElementSibling; }
    var k = bloc >= 0 && blocs[bloc];
    cibles = k ? [blocs[bloc]] : cibles.concat(blocs);
    cibles.forEach(function (x) { x.classList.add("repere"); });
    if (k) cibles[0].scrollIntoView({ block: "center" }); else t.scrollIntoView({ block: "start" });
  }
  window.addEventListener("load", function () { setTimeout(viser, 60); });
  window.addEventListener("hashchange", viser);
})();
