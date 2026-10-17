/*
 * Pages de cours d'un module (modules/<id>/cours/) : barre du site, menu « Tous les concepts »,
 * sommaire, bouton « Jouer le niveau », formules clés en carte, Précédent / Suivant.
 * La liste et l'ordre des pages viennent du module.js du module (champ cours), via PLATEFORME.
 */
(function () {
  "use strict";

  var P = window.PLATEFORME, MID = P.courant, MOD = P.module(MID);
  var PARTIES = MOD.chapitres.filter(function (ch) { return MOD.cours.some(function (c) { return c.chapitre === ch.id; }); })
    .map(function (ch) { return { id: ch.id, titre: "Chapitre " + ch.id + " : " + ch.titre.charAt(0).toLowerCase() + ch.titre.slice(1) }; });
  var CONCEPTS = MOD.cours.map(function (c) { return { partie: PARTIES.findIndex(function (p) { return p.id === c.chapitre; }), slug: c.id, titre: c.titre, pret: true }; });
  var slugCourant = (location.pathname.match(/([^/]+)\.html$/) || [])[1] || "";
  var indexCourant = CONCEPTS.findIndex(function (c) { return c.slug === slugCourant; });
  var aNiveau = function (slug) { return (MOD.niveaux || []).some(function (n) { return n.id === slug && n.pret; }); };
  if (indexCourant >= 0) P.noterDernier(MID, "Cours : " + CONCEPTS[indexCourant].titre);

  function url(c) { return c.slug + ".html"; }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function listeHTML(classeNum) {
    var h = "";
    PARTIES.forEach(function (p, ip) {
      h += '<div class="menu-partie"><h2>' + esc(p.titre) + "</h2><ol>";
      CONCEPTS.forEach(function (c, i) {
        if (c.partie !== ip) return;
        var num = '<span class="' + classeNum + '">' + (i + 1) + "</span>";
        h += '<li><a href="' + url(c) + '"' + (i === indexCourant ? ' class="courant" aria-current="page"' : "") + ">" + num + esc(c.titre) + "</a></li>";
      });
      h += "</ol></div>";
    });
    return h;
  }

  // Barre du haut
  var barre = document.createElement("header");
  P.barre(barre, "cours", '<button class="menu-bouton" type="button" aria-expanded="false" aria-controls="menu-concepts">Tous les concepts</button>');
  barre.insertAdjacentHTML("beforeend", '<nav class="menu" id="menu-concepts" aria-label="Liste des concepts">' + listeHTML("num") + "</nav>");
  document.body.insertBefore(barre, document.body.firstChild);
  var bouton = barre.querySelector(".menu-bouton");
  var menu = barre.querySelector(".menu");
  bouton.addEventListener("click", function () {
    var ouvert = menu.classList.toggle("ouvert");
    bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("ouvert")) { menu.classList.remove("ouvert"); bouton.setAttribute("aria-expanded", "false"); }
  });

  // Numéro et partie en tête de page
  var etiquette = document.querySelector("[data-etiquette]");
  if (etiquette && indexCourant >= 0) {
    etiquette.textContent = "Concept " + (indexCourant + 1) + " sur " + CONCEPTS.length + " · " + PARTIES[CONCEPTS[indexCourant].partie].titre;
  }

  // Parcours sur le sommaire : une carte par concept
  var parcours = document.querySelector("[data-parcours]");
  if (parcours) {
    var hp = "";
    PARTIES.forEach(function (p, ip) {
      hp += '<h3 class="partie-titre">' + esc(p.titre) + '</h3><ol class="parcours-cartes">';
      CONCEPTS.forEach(function (c, i) {
        if (c.partie === ip && c.pret) hp += '<li><a href="' + url(c) + '"><span class="num">' + (i < 9 ? "0" : "") + (i + 1) + '</span><span class="nom">' + esc(c.titre) + "</span></a></li>";
      });
      hp += "</ol>";
    });
    parcours.innerHTML = hp;
  }

  // Lien vers le niveau du jeu qui porte le même nom, avec ses étoiles
  function etoiles(slug) { return P.etoiles(MID, slug); }
  var chapeau = document.querySelector(".chapeau");
  if (chapeau && indexCourant >= 0 && aNiveau(slugCourant)) {
    var nb = etoiles(slugCourant), z = document.createElement("div");
    z.className = "jouer";
    z.innerHTML = '<a class="btn-jeu" href="../jouer.html#' + slugCourant + '">Jouer le niveau</a><span class="etoiles-page">' +
      (nb === null ? "Pas encore joué" : nb + " étoile" + (nb > 1 ? "s" : "") + " sur 3") + "</span>";
    chapeau.parentNode.insertBefore(z, chapeau.nextSibling);
  }

  // Formules clés : regroupées dans une carte
  [].forEach.call(document.querySelectorAll("main > h2"), function (t) {
    if (t.textContent.trim() !== "Formules clés") return;
    var carte = document.createElement("div"), n = t.nextSibling;
    carte.className = "cles-carte";
    // nœuds texte compris : les formules ne sont pas encore rendues par KaTeX
    while (n && !/^(H2|NAV|SCRIPT)$/.test(n.nodeName)) { var suivant = n.nextSibling; carte.appendChild(n); n = suivant; }
    t.parentNode.insertBefore(carte, t.nextSibling);
  });

  // Précédent / Suivant (seulement entre pages prêtes)
  var main = document.querySelector("main");
  if (main && indexCourant >= 0) {
    var prec = null, suiv = null, i;
    for (i = indexCourant - 1; i >= 0; i--) if (CONCEPTS[i].pret) { prec = CONCEPTS[i]; break; }
    for (i = indexCourant + 1; i < CONCEPTS.length; i++) if (CONCEPTS[i].pret) { suiv = CONCEPTS[i]; break; }
    var bas = document.createElement("nav");
    bas.className = "suite";
    bas.setAttribute("aria-label", "Concept précédent et suivant");
    bas.innerHTML =
      (prec ? '<a class="precedent" href="' + url(prec) + '"><small>Précédent</small>' + esc(prec.titre) + "</a>" : '<span class="vide"></span>') +
      (aNiveau(slugCourant) ? '<a class="jeu" href="../jouer.html#' + slugCourant + '"><small>S\'entraîner</small>Jouer</a>' : "") +
      (suiv ? '<a class="suivant" href="' + url(suiv) + '"><small>Suivant</small>' + esc(suiv.titre) + "</a>" : '<a class="suivant" href="../index.html"><small>Fin du cours</small>Parcours du module</a>');
    main.appendChild(bas);
  }

})();
