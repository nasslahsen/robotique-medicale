/*
 * Socle commun à toutes les pages : chemins, couleur du module, progression.
 * À charger dans le <head>, juste après registre.js, sur chaque page. La page d'un module porte
 * <html data-module="<id>"> : sa couleur d'accent est appliquée avant l'affichage.
 * Chaque module actif s'enregistre ensuite avec PLATEFORME.parcours(id, {...}) (fichier module.js).
 *
 * Progression (localStorage, clé "s5-progres") : { <module>: { niveaux: { <id>: { etoiles } }, tout, dernier: { chemin, titre } } }
 * Une page compte comme faite quand ses défis sont terminés (écran de résultats du niveau).
 */
(function () {
  "use strict";
  var CLE = "s5-progres";
  var script = document.currentScript;
  // racine du site : l'adresse de ce fichier sans « commun/js/plateforme.js »
  var racine = script ? script.src.replace(/commun\/js\/plateforme\.js(\?.*)?$/, "") : "";
  var parcours = {};

  function lireTout() { try { return JSON.parse(localStorage.getItem(CLE) || "{}") || {}; } catch (e) { return {}; } }
  function ecrireTout(p) { try { localStorage.setItem(CLE, JSON.stringify(p)); } catch (e) { /* stockage indisponible */ } }
  function etat(mid) { var p = lireTout(); return p[mid] || { niveaux: {} }; }
  function poser(mid, e) { var p = lireTout(); p[mid] = e; ecrireTout(p); }

  // Reprise des étoiles de l'ancien site (avant la plateforme), une seule fois.
  (function migrer() {
    try {
      if (localStorage.getItem("s5-migre")) return;
      var ancien = JSON.parse(localStorage.getItem("rm-progres") || "null");
      var e = etat("robotique");
      if (ancien) Object.keys(ancien).forEach(function (id) {
        var a = ancien[id] && ancien[id].etoiles || 0, b = e.niveaux[id] ? e.niveaux[id].etoiles : 0;
        e.niveaux[id] = { etoiles: Math.max(a, b) };
      });
      if (localStorage.getItem("rm-tout") === "1") e.tout = true;
      poser("robotique", e);
      localStorage.setItem("s5-migre", "1");
    } catch (err) { /* rien */ }
  })();

  function hexRgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }

  var P = window.PLATEFORME = {
    racine: racine,
    registre: window.REGISTRE,
    courant: document.documentElement.getAttribute("data-module"),
    // Fiche d'un module : entrée du registre, plus son parcours s'il est chargé.
    module: function (id) {
      var m = null;
      (window.REGISTRE.modules || []).forEach(function (x) { if (x.id === id) m = x; });
      // module pas encore inscrit au registre (modèle copié) : couleur neutre, pour pouvoir le prévisualiser
      if (!m && parcours[id]) m = { id: id, titre: parcours[id].titre || id, statut: "actif", couleur: "#5b6172", clair: "#eef0f5", texte: "#5b6172", sousModules: parcours[id].sousModules || [] };
      if (m && parcours[id]) for (var k in parcours[id]) m[k] = parcours[id][k];
      return m;
    },
    parcours: function (id, p) { parcours[id] = p; },
    couleur: function (id) { var m = P.module(id || P.courant); return m ? m.couleur : "#D44C47"; },
    clair: function (id) { var m = P.module(id || P.courant); return m ? m.clair : "#FFE2DD"; },
    // Couleur d'accent du module courant, avec transparence (pour les dessins SVG).
    teinte: function (a, id) {
      var m = P.module(id || P.courant), c = hexRgb(m ? m.couleur : "#D44C47");
      return "rgba(" + c.join(",") + "," + (a === undefined ? 1 : a) + ")";
    },
    // Niveaux comptés dans la progression : ceux qui sont jouables.
    pages: function (id) { var m = P.module(id); return m && m.niveaux ? m.niveaux.filter(function (n) { return n.pret; }) : []; },
    etoiles: function (mid, id) { var e = etat(mid); return e.niveaux[id] ? e.niveaux[id].etoiles || 0 : null; },
    marquer: function (mid, id, nb) {
      var e = etat(mid), av = e.niveaux[id] ? e.niveaux[id].etoiles || 0 : 0;
      e.niveaux[id] = { etoiles: Math.max(nb, av) }; poser(mid, e);
    },
    progression: function (mid) { var e = etat(mid); return e.niveaux; },
    compte: function (mid) {
      var e = etat(mid), pages = P.pages(mid);
      return { faits: pages.filter(function (n) { return e.niveaux[n.id]; }).length, total: pages.length };
    },
    effacer: function (mid) { var e = etat(mid); e.niveaux = {}; delete e.dernier; poser(mid, e); },
    tout: function (mid, v) { var e = etat(mid); if (v === undefined) return !!e.tout; e.tout = !!v; poser(mid, e); },
    // Dernière page ouverte dans un module (niveau ou page de cours), chemin relatif à la racine.
    noterDernier: function (mid, titre, chemin) {
      var e = etat(mid); e.dernier = { chemin: chemin || location.href.replace(racine, ""), titre: titre, quand: Date.now() }; poser(mid, e);
    },
    dernier: function (mid) { return etat(mid).dernier || null; },
    // Adresse du bouton « Continuer » : la dernière page, sinon le premier niveau pas encore fait.
    continuer: function (mid) {
      var d = P.dernier(mid);
      if (d) return { url: racine + d.chemin, titre: d.titre };
      var e = etat(mid), suivant = P.pages(mid).filter(function (n) { return !e.niveaux[n.id]; })[0];
      if (suivant) return { url: racine + "modules/" + mid + "/jouer.html#" + suivant.id, titre: suivant.titre };
      return { url: racine + "modules/" + mid + "/index.html", titre: "Parcours du module" };
    }
  };

  // Barre du site dans un module : retour au tableau de bord, nom du module, onglets Parcours et Cours.
  // onglet : "parcours", "cours" ou null ; droite : HTML ajouté à droite.
  P.barre = function (el, onglet, droite) {
    var m = P.module(P.courant), base = racine + "modules/" + P.courant + "/";
    var o = function (id, nom, href) { return '<a href="' + href + '"' + (onglet === id ? ' aria-current="page"' : "") + ">" + nom + "</a>"; };
    el.className = "site-barre";
    el.innerHTML = '<div class="site-barre-int">' +
      '<a class="site-retour" href="' + racine + 'index.html" aria-label="Tableau de bord">' + window.REGISTRE.semestre + "</a>" +
      '<span class="site-module"><i></i>' + m.titre + "</span>" +
      '<nav class="onglets" aria-label="Sections">' + o("parcours", "Parcours", base + "index.html") + o("cours", "Cours", base + "cours/index.html") + "</nav>" +
      '<div class="droite">' + (droite || "") + "</div></div>";
    return el;
  };

  // Couleur du module courant, appliquée avant l'affichage.
  var m = P.module(P.courant);
  if (m) {
    var s = document.documentElement.style;
    s.setProperty("--jeu", m.couleur); s.setProperty("--jeu-pale", m.clair); s.setProperty("--jeu-texte", m.texte || m.couleur);
  }
})();
