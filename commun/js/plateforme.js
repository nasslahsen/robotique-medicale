/*
 * Socle commun à toutes les pages : chemins, couleur du module, progression, carte des étapes.
 * À charger dans le <head>, juste après registre.js, sur chaque page. La page d'un module porte
 * <html data-module="<id>"> : sa couleur d'accent est appliquée avant l'affichage.
 * Chaque module actif s'enregistre ensuite avec PLATEFORME.parcours(id, {...}) (fichier module.js).
 *
 * Progression (localStorage, clé "s5-progres", la même que le site publié : les étoiles sont partagées) :
 * { <module>: { niveaux: { <id>: { etoiles } }, lus: { <page de cours>: 1 }, dernier: { chemin, titre, quand } } }
 *
 * Carte d'un sous-module : chapitres dans l'ordre ; dans chaque chapitre, pour chaque notion,
 * l'étape « cours » (page cours/<id>.html) puis l'étape « exos » (niveau du même id) ;
 * en fin de chapitre, la révision puis le boss. Rien n'est verrouillé : l'ordre est conseillé.
 * Une étape cours est faite quand la page a été lue jusqu'en bas ; une étape exos quand le niveau est fini.
 *
 * Structure par chapitres (module.js avec sections, pages dans modules/<id>/<dossierChapitres>/) : voir plus bas,
 * « Chapitres ». Même stockage : sections lues dans e.sections, dernière page par sous-module dans e.plan.
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
  function etat(mid) { var p = lireTout(), e = p[mid] || {}; e.niveaux = e.niveaux || {}; e.lus = e.lus || {}; e.sections = e.sections || {}; e.plan = e.plan || {}; return e; }
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
      poser("robotique", e);
      localStorage.setItem("s5-migre", "1");
    } catch (err) { /* rien */ }
  })();

  function hexRgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }

  // Identifiant d'ancre d'un titre de section : même calcul pour les pages de cours et pour les liens du jeu.
  function ancre(t) {
    return String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "section";
  }

  var P = window.PLATEFORME = {
    racine: racine,
    registre: window.REGISTRE,
    courant: document.documentElement.getAttribute("data-module"),
    ancre: ancre,
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
    // Niveaux jouables.
    pages: function (id) { var m = P.module(id); return m && m.niveaux ? m.niveaux.filter(function (n) { return n.pret; }) : []; },
    etoiles: function (mid, id) { var e = etat(mid); return e.niveaux[id] ? e.niveaux[id].etoiles || 0 : null; },
    marquer: function (mid, id, nb) {
      var e = etat(mid), av = e.niveaux[id] ? e.niveaux[id].etoiles || 0 : 0;
      e.niveaux[id] = { etoiles: Math.max(nb, av) }; poser(mid, e);
    },
    progression: function (mid) { return etat(mid).niveaux; },
    // Pages de cours lues jusqu'en bas.
    lu: function (mid, id) { return !!etat(mid).lus[id]; },
    marquerLu: function (mid, id) { var e = etat(mid); if (e.lus[id]) return; e.lus[id] = 1; poser(mid, e); },
    effacer: function (mid) { var e = etat(mid); e.niveaux = {}; e.lus = {}; e.sections = {}; e.plan = {}; delete e.dernier; poser(mid, e); },
    // Dernière page ouverte dans un module (niveau ou page de cours), chemin relatif à la racine.
    noterDernier: function (mid, titre, chemin) {
      var e = etat(mid); e.dernier = { chemin: chemin || location.href.replace(racine, ""), titre: titre, quand: Date.now() }; poser(mid, e);
    },
    dernier: function (mid) { return etat(mid).dernier || null; }
  };

  /* ---------------- Carte : sous-modules, chapitres, étapes ---------------- */

  // Sous-modules d'un module qui ont des chapitres (un module sans sous-module en a un seul, sans titre).
  P.sousModules = function (mid) {
    var M = P.module(mid); if (!M || !M.chapitres) return [];
    var sms = (M.sousModules || []).length ? M.sousModules : [{ id: "", titre: "" }];
    return sms.map(function (sm) {
      return { id: sm.id, titre: sm.titre, statut: sm.statut, chapitres: M.chapitres.filter(function (ch) { return P.smDe(mid, ch.id) === sm.id; }) };
    });
  };
  // Sous-module d'un chapitre.
  P.smDe = function (mid, chapitre) {
    var M = P.module(mid), ch = (M.chapitres || []).filter(function (c) { return c.id === chapitre; })[0];
    if (!M.sousModules || !M.sousModules.length) return "";
    return ch && ch.sousModule || M.sousModules[0].id;
  };
  // Étapes d'un sous-module dans l'ordre de la carte (sm omis : tout le module, sous-module après sous-module).
  // Étape : { type: "cours" | "exos", id, titre, chapitre, sm, revision, boss, num, url (depuis la racine), fait, etoiles }
  P.etapes = function (mid, sm) {
    var M = P.module(mid), e = etat(mid), out = [];
    if (!M || !M.niveaux) return out;
    var titreCours = {};
    (M.cours || []).forEach(function (c) { titreCours[c.id] = c.titre; });
    P.sousModules(mid).forEach(function (s) {
      if (sm !== undefined && s.id !== sm) return;
      s.chapitres.forEach(function (ch) {
        var num = 0;
        M.niveaux.forEach(function (n) {
          if (n.chapitre !== ch.id || !n.pret) return;
          var fin = n.revision || n.boss;
          if (!fin) num++;
          if (n.cours) out.push({ type: "cours", id: n.id, titre: n.titre, titreLong: titreCours[n.id] || n.titre, chapitre: ch.id, sm: s.id, num: num,
            url: "modules/" + mid + "/cours/" + n.id + ".html", fait: !!e.lus[n.id] });
          out.push({ type: "exos", id: n.id, titre: n.titre, chapitre: ch.id, sm: s.id, num: fin ? 0 : num, revision: !!n.revision, boss: !!n.boss,
            avecCours: !!n.cours, url: "modules/" + mid + "/jouer.html#" + n.id, fait: !!e.niveaux[n.id], etoiles: e.niveaux[n.id] ? e.niveaux[n.id].etoiles || 0 : 0 });
        });
      });
    });
    return out;
  };
  // Position d'une étape dans la carte de son sous-module.
  P.trouver = function (mid, type, id) {
    var tout = P.etapes(mid);
    for (var i = 0; i < tout.length; i++) if (tout[i].type === type && tout[i].id === id) {
      var liste = tout.filter(function (x) { return x.sm === tout[i].sm; });
      return { etape: tout[i], liste: liste, rang: liste.indexOf(tout[i]) };
    }
    return null;
  };
  // Étape qui suit sur la carte (faite ou non), dans le même sous-module.
  P.apres = function (mid, type, id) {
    var t = P.trouver(mid, type, id);
    return t ? t.liste[t.rang + 1] || null : null;
  };
  // Sous-module où l'on en est : celui de la dernière page ouverte, sinon le premier qui a du contenu.
  P.smCourant = function (mid) {
    var d = P.dernier(mid), sms = P.sousModules(mid).filter(function (s) { return s.chapitres.length; });
    if (d && d.chemin) {
      var x = d.chemin.match(/cours\/([^/.#?]+)\.html/) || d.chemin.match(/jouer\.html#([^?&]+)/);
      if (x) {
        var t = P.trouver(mid, /cours\//.test(d.chemin) ? "cours" : "exos", decodeURIComponent(x[1]));
        if (t) return t.etape.sm;
      }
    }
    return sms.length ? sms[0].id : "";
  };
  // « Continuer » : la prochaine étape pas encore faite de la carte (sous-module donné, ou celui où l'on en est).
  P.continuer = function (mid, sm) {
    if (sm === undefined) sm = P.smCourant(mid);
    var liste = P.etapes(mid, sm), suivante = liste.filter(function (x) { return !x.fait; })[0];
    if (suivante) return { url: racine + suivante.url, titre: P.genre(suivante) + " : " + suivante.titre, phrase: P.phrase(suivante), etape: suivante };
    // sous-module terminé : le suivant qui a encore des étapes, sinon la carte
    var autre = P.sousModules(mid).filter(function (s) { return s.id !== sm && P.etapes(mid, s.id).some(function (x) { return !x.fait; }); })[0];
    if (autre) return P.continuer(mid, autre.id);
    return { url: P.urlCarte(mid, sm), titre: "Tout est fait. Revois la carte.", phrase: "la carte", etape: null };
  };
  // Nature d'une étape, pour les boutons : « Cours », « Exercices », « Révision », « Boss ».
  P.genre = function (x) { return x.type === "cours" ? "Cours" : x.boss ? "Boss" : x.revision ? "Révision" : "Exercices"; };
  P.phrase = function (x) {
    return (x.type === "cours" ? "le cours" : x.boss ? "le boss" : x.revision ? "la révision" : "les exercices") + " « " + x.titre + " »";
  };
  // Étapes faites / total du module (cours lus et niveaux finis).
  P.compte = function (mid, sm) {
    var l = P.etapes(mid, sm);
    return { faits: l.filter(function (x) { return x.fait; }).length, total: l.length };
  };
  P.urlCarte = function (mid, sm, chapitre) {
    return racine + "modules/" + mid + "/index.html" + (sm ? "?sm=" + encodeURIComponent(sm) : "") + (chapitre !== undefined ? "#ch" + chapitre : "");
  };
  P.urlEtape = function (x) { return x ? racine + x.url : null; };

  // Barre du site dans un module : retour au tableau de bord, nom du module (vers la carte), action à droite.
  // o : { sm, chapitre, droite (HTML) }
  P.barre = function (el, o) {
    o = o || {};
    var m = P.module(P.courant);
    el.className = "site-barre";
    el.innerHTML = '<div class="site-barre-int">' +
      '<a class="site-retour" href="' + racine + 'index.html" aria-label="Tableau de bord">' + window.REGISTRE.semestre + "</a>" +
      '<a class="site-module" href="' + (o.carte || P.urlCarte(P.courant, o.sm, o.chapitre)) + '"><i></i><span>' + m.titre + "</span></a>" +
      '<div class="droite">' + (o.droite || "") + "</div></div>";
    return el;
  };

  /* ---------------- Chapitres : plan, Cours en sections, S'entraîner ---------------- */
  // Un sous-module suit cette structure quand ses chapitres ont des sections (module.js, « sections »).
  // La carte n'a qu'un nœud par chapitre ; le chapitre est une grande page qui défile, les exercices y sont facultatifs.
  // Chapitre fait : toutes ses sections lues (une section l'est aussi quand toutes ses notions avaient été lues
  // sur l'ancienne carte). Les exercices faits sont gardés à part (exosFaits). Rien n'est verrouillé.

  P.avecChapitres = function (mid, sm) {
    var M = P.module(mid);
    return !!(M && M.sections && M.sections.some(function (s) { return P.smDe(mid, s.chapitre) === sm; }));
  };
  // Dossier des pages de la structure par chapitres, depuis la racine du site.
  P.dossierChapitres = function (mid) { var M = P.module(mid); return "modules/" + mid + "/" + (M.dossierChapitres ? M.dossierChapitres + "/" : ""); };
  P.sectionLue = function (mid, s) {
    var e = etat(mid);
    return !!e.sections[s.id] || s.notions.every(function (n) { return e.lus[n]; });
  };
  // Section lue : les pages de cours qu'elle réunit le sont aussi (l'ancienne carte reste juste).
  P.marquerSection = function (mid, sid) {
    var M = P.module(mid), s = (M.sections || []).filter(function (x) { return x.id === sid; })[0], e = etat(mid);
    if (!s) return;
    e.sections[sid] = 1; s.notions.forEach(function (n) { e.lus[n] = 1; }); poser(mid, e);
  };
  // Section qui contient une page de cours (notion).
  P.sectionDe = function (mid, notion) {
    return (P.module(mid).sections || []).filter(function (s) { return s.notions.indexOf(notion) >= 0; })[0] || null;
  };
  // Le cours d'un chapitre est une seule page (cours/chapitre-<n>.html) : une section y est une ancre (#s-<section>).
  P.pageCours = function (mid, sid) {
    var s = (P.module(mid).sections || []).filter(function (x) { return x.id === sid; })[0];
    return P.dossierChapitres(mid) + "cours/chapitre-" + (s ? s.chapitre : 0) + ".html";
  };
  P.urlSection = function (mid, sid, ancre) { return racine + P.pageCours(mid, sid) + "#" + (ancre || "s-" + sid); };
  P.urlChapitre = function (mid, ch) { return racine + P.dossierChapitres(mid) + "cours/chapitre-" + ch + ".html"; };
  P.urlPlan = function (mid, sm) { return racine + P.dossierChapitres(mid) + "index.html" + (sm ? "?sm=" + encodeURIComponent(sm) : ""); };
  // Un niveau ouvert depuis S'entraîner : jouer.html?plan=<dossier>#<niveau>.
  P.urlExercice = function (mid, nid) {
    var M = P.module(mid);
    return racine + "modules/" + mid + "/jouer.html?plan=" + encodeURIComponent(M.dossierChapitres || "") + "#" + nid;
  };
  // État d'un chapitre : sections (avec lue), niveaux (avec fait, etoiles), coursLu, exosFaits,
  // etat : "fait" (cours lu et exercices faits), "encours" (quelque chose de commencé) ou "" (rien).
  P.chapitre = function (mid, chid) {
    var M = P.module(mid), e = etat(mid);
    var ch = M.chapitres.filter(function (c) { return c.id === chid; })[0];
    if (!ch) return null;
    var sections = (M.sections || []).filter(function (s) { return s.chapitre === chid; }).map(function (s, k, l) {
      return { id: s.id, titre: s.titre, notions: s.notions, rang: k + 1, total: l.length, lue: P.sectionLue(mid, s) };
    });
    var niveaux = M.niveaux.filter(function (n) { return n.chapitre === chid && n.pret; }).map(function (n) {
      return { id: n.id, titre: n.titre, revision: !!n.revision, boss: !!n.boss, fait: !!e.niveaux[n.id], etoiles: e.niveaux[n.id] ? e.niveaux[n.id].etoiles || 0 : 0 };
    });
    var coursLu = sections.length > 0 && sections.every(function (s) { return s.lue; });
    var exosFaits = niveaux.length > 0 && niveaux.every(function (n) { return n.fait; });
    var commence = sections.some(function (s) { return s.lue || s.notions.some(function (n) { return e.lus[n]; }); }) ||
      niveaux.some(function (n) { return n.fait; });
    return { id: ch.id, titre: ch.titre, ligne: ch.ligne || ch.sous || "", avant: ch.avant || [], sm: P.smDe(mid, ch.id),
      sections: sections, niveaux: niveaux, coursLu: coursLu, exosFaits: exosFaits,
      etat: coursLu ? "fait" : commence ? "encours" : "" };
  };
  P.chapitresDe = function (mid, sm) {
    return P.module(mid).chapitres.filter(function (c) { return P.smDe(mid, c.id) === sm; }).map(function (c) { return P.chapitre(mid, c.id); });
  };
  // Dernière page ouverte dans la structure par chapitres (section ou exercice), par sous-module.
  P.noterPlan = function (mid, sm, titre, chemin) {
    var e = etat(mid); e.plan[sm] = { chemin: chemin, titre: titre, quand: Date.now() }; poser(mid, e);
    P.noterDernier(mid, titre, chemin);
  };
  // « Reprendre » : là où l'on s'est arrêté dans un chapitre ; sinon la première section pas lue. chapitre : le chapitre visé.
  P.reprendre = function (mid, sm) {
    var e = etat(mid), d = e.plan[sm], x;
    if (d && d.chemin && (x = d.chemin.match(/chapitre-(\d+)\.html/))) return { url: racine + d.chemin, titre: d.titre, deja: true, chapitre: +x[1] };
    var chs = P.chapitresDe(mid, sm);
    for (var i = 0; i < chs.length; i++) {
      var s = chs[i].sections.filter(function (y) { return !y.lue; })[0];
      if (s) return { url: P.urlSection(mid, s.id), titre: chs[i].titre + " · " + s.titre, deja: false, chapitre: chs[i].id };
    }
    return null;
  };

  // Couleur du module courant, appliquée avant l'affichage.
  var m = P.module(P.courant);
  if (m) {
    var s = document.documentElement.style;
    s.setProperty("--jeu", m.couleur); s.setProperty("--jeu-pale", m.clair); s.setProperty("--jeu-texte", m.texte || m.couleur);
  }
})();
