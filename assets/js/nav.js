/*
 * Liste ordonnée des concepts, barre du haut avec menu, boutons Précédent / Suivant.
 * Pour ajouter une page : créer concepts/<slug>.html et ajouter une ligne ci-dessous.
 */
(function () {
  "use strict";

  var PARTIES = [
    { titre: "Partie A : le robot et sa description" },
    { titre: "Partie B : description spatiale et transformations" }
  ];

  // pret : false pour une page pas encore écrite (affichée grisée dans le menu).
  var CONCEPTS = [
    { partie: 0, slug: "robot-systeme", titre: "Le robot et le système robotisé", pret: false },
    { partie: 0, slug: "anatomie", titre: "Anatomie d'un robot", pret: false },
    { partie: 0, slug: "articulations-ddl", titre: "Articulations, DDL et configuration articulaire", pret: false },
    { partie: 0, slug: "liaisons", titre: "DDL d'un solide et liaisons normalisées", pret: false },
    { partie: 0, slug: "schemas-topologies", titre: "Schémas cinématiques et topologies", pret: false },
    { partie: 0, slug: "architectures", titre: "Architectures et espace de travail", pret: false },
    { partie: 0, slug: "performances", titre: "Précision, répétabilité et temps de cycle", pret: false },
    { partie: 0, slug: "robotique-medicale", titre: "Spécificités de la robotique médicale", pret: false },
    { partie: 1, slug: "repere", titre: "Repère et coordonnées cartésiennes", pret: true },
    { partie: 1, slug: "produit-scalaire", titre: "Produit scalaire", pret: true },
    { partie: 1, slug: "produit-vectoriel", titre: "Produit vectoriel", pret: true },
    { partie: 1, slug: "coordonnees-cylindriques", titre: "Coordonnées polaires et cylindriques", pret: true },
    { partie: 1, slug: "position-chasles", titre: "Position d'un solide et relation de Chasles", pret: true },
    { partie: 1, slug: "matrice-rotation", titre: "Matrice de rotation", pret: true },
    { partie: 1, slug: "so3", titre: "Propriétés : le groupe SO(3)", pret: true },
    { partie: 1, slug: "rotations-elementaires", titre: "Rotations élémentaires", pret: true },
    { partie: 1, slug: "angles-euler", titre: "Angles d'Euler", pret: true },
    { partie: 1, slug: "changement-repere", titre: "Changement de repère", pret: true },
    { partie: 1, slug: "matrice-homogene", titre: "Matrice homogène", pret: true },
    { partie: 1, slug: "composition", titre: "Composition des transformations", pret: true },
    { partie: 1, slug: "bras-2r", titre: "Modèle géométrique direct du bras 2R", pret: true }
  ];

  var surPageConcept = /\/concepts\//.test(location.pathname);
  var racine = surPageConcept ? "../" : "";
  var slugCourant = (location.pathname.match(/([^/]+)\.html$/) || [])[1] || "";
  var indexCourant = CONCEPTS.findIndex(function (c) { return c.slug === slugCourant; });

  function url(c) { return racine + "concepts/" + c.slug + ".html"; }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function listeHTML(classeNum) {
    var h = "";
    PARTIES.forEach(function (p, ip) {
      h += "<h2>" + esc(p.titre) + "</h2><ol>";
      CONCEPTS.forEach(function (c, i) {
        if (c.partie !== ip) return;
        var num = '<span class="' + classeNum + '">' + (i + 1) + "</span>";
        if (c.pret) {
          h += '<li><a href="' + url(c) + '"' + (i === indexCourant ? ' class="courant" aria-current="page"' : "") + ">" + num + esc(c.titre) + "</a></li>";
        } else {
          h += "<li><span>" + num + esc(c.titre) + " (en préparation)</span></li>";
        }
      });
      h += "</ol>";
    });
    return h;
  }

  // Barre du haut
  var barre = document.createElement("header");
  barre.className = "barre";
  barre.innerHTML =
    '<div class="barre-int"><a class="titre" href="' + racine + 'index.html">Robotique médicale</a>' +
    '<button class="menu-bouton" type="button" aria-expanded="false" aria-controls="menu-concepts">Concepts</button></div>' +
    '<nav class="menu" id="menu-concepts" aria-label="Liste des concepts">' + listeHTML("num") + "</nav>";
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

  // Parcours sur l'accueil
  var parcours = document.querySelector("[data-parcours]");
  if (parcours) parcours.innerHTML = listeHTML("num").replace(/<ol>/g, '<ol class="parcours">');

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
      (suiv ? '<a class="suivant" href="' + url(suiv) + '"><small>Suivant</small>' + esc(suiv.titre) + "</a>" : '<a class="suivant" href="' + racine + 'index.html"><small>Fin du parcours</small>Retour à l\'accueil</a>');
    main.appendChild(bas);
  }

  window.RM_CONCEPTS = CONCEPTS;
})();
