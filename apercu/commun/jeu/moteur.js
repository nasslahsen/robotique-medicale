/*
 * Moteur des niveaux : étapes, retours, étoiles, sauvegarde, écran de fin.
 * Un niveau appelle NIVEAU({ id, init(fig), etapes: [{ nom, jouer(j) }] }).
 * Fin du niveau : le bouton principal mène à l'étape suivante de la carte (PLATEFORME.apres).
 */
(function () {
  "use strict";
  // Le module courant (<html data-module>) donne la liste des niveaux ; la progression passe par PLATEFORME.
  var P = window.PLATEFORME, MID = P.courant, MOD = P.module(MID);
  var COCHE = '<svg class="coche" viewBox="0 0 30 30"><circle cx="15" cy="15" r="15"/><path d="M8.5 15.5l4.3 4.2 8.7-9"/></svg>';
  var ETOILE = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8z" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  window.JEU = {
    ETOILE: ETOILE,
    etoiles: function (erreurs) { return erreurs === 0 ? 3 : erreurs <= 2 ? 2 : 1; },
  };

  window.NIVEAU = function (def) {
    var liste = MOD.niveaux, rang = liste.findIndex(function (n) { return n.id === def.id; }), info = liste[rang] || { titre: def.id, chapitre: 0 };
    document.title = info.titre + " · " + MOD.titre;
    P.noterDernier(MID, info.titre);
    var nom = document.getElementById("nom-niveau"), ici = P.trouver(MID, "exos", def.id);
    nom.innerHTML = "<small>" + (info.boss ? "BOSS · " : info.revision ? "RÉVISION · " : "EXERCICES · ") + "CHAPITRE " + info.chapitre + "</small><h1>" + info.titre + "</h1>";
    var lienCarte = document.querySelector(".barre .carte-lien");
    if (lienCarte) lienCarte.href = P.urlCarte(MID, ici ? ici.etape.sm : undefined, info.chapitre);
    // lien vers la page de cours de la même notion, à côté du lien Carte
    if (info.cours) {
      var lc = document.createElement("a");
      lc.className = "carte-lien"; lc.href = "cours/" + info.id + ".html"; lc.textContent = "Cours";
      nom.parentNode.insertBefore(lc, nom);
    }

    // figure
    var figEl = document.getElementById("figure"), svg = document.getElementById("fig");
    var fig = {
      svg: svg, el: figEl,
      bande: function (html) {
        var b = document.getElementById("bande");
        if (html === null || html === undefined) { b.classList.remove("on"); figEl.classList.remove("avec-bande"); return b; }
        b.classList.add("on"); figEl.classList.add("avec-bande");
        if (html !== true) b.innerHTML = html;
        return b;
      },
      chip: function (t) { var c = document.getElementById("chip"); c.classList.toggle("on", t !== null && t !== undefined); if (t !== null && t !== undefined) c.textContent = t; },
      astuce: function (t) { document.getElementById("astuce").textContent = t || ""; },
      coin: document.getElementById("coin")
    };
    var n = def.init ? def.init(fig) || {} : {};

    // segments
    var seg = document.getElementById("segments");
    def.etapes.forEach(function () { E.h("span", "", "<i></i>", seg); });
    var panneau = document.getElementById("panneau"), courante = -1, erreurs = 0, nettoyages = [];
    // État de chaque étape : "resolue" (trouvée seule), "revelee" (réponse vue) ou "passee" ; rejeu : étape rejouée depuis l'écran de fin
    var etats = [], rejeu = false;

    function majSegments() { [].forEach.call(seg.children, function (s, i) { s.className = i < courante ? "fait" : i === courante ? "courant" : ""; }); }

    function aller(i) {
      nettoyages.forEach(function (f) { try { f(); } catch (e) { /* rien */ } }); nettoyages = [];
      if (i >= def.etapes.length) { fin(); return; }
      courante = i; majSegments();
      var ancien = panneau.querySelector(".etape:not(.sortie)");
      if (ancien) { ancien.classList.add("sortie"); setTimeout(function () { ancien.remove(); }, 450); }
      var el = E.h("div", "etape entree", "", panneau);
      E.h("span", "kicker" + (info.boss ? " boss" : ""), (info.boss ? "BOSS · " : "") + "ÉTAPE " + (i + 1) + " / " + def.etapes.length, el);
      var j = contexte(el, i);
      def.etapes[i].jouer(j, n);
      aideQuestion(el, i, j);
      E.rendre(el);
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove("entree"); }); });
    }

    // « Voir la réponse » et « Passer », sous la question, tant que l'étape n'est pas finie
    function aideQuestion(el, i, j) {
      var z = E.h("div", "aide-q", "", el);
      var bR = E.h("button", "", "Voir la réponse", z); bR.type = "button";
      var bP = E.h("button", "", "Passer", z); bP.type = "button";
      bR.addEventListener("click", function () { j.reveler(); });
      bP.addEventListener("click", function () {
        if (!etats[i]) etats[i] = "passee";
        z.remove(); apres(i);
      });
      // la ligne reste en dernier ; elle disparaît quand l'étape propose « Continuer »
      var obs = new MutationObserver(function () {
        if (el.querySelector(".btn.suite")) { z.remove(); obs.disconnect(); return; }
        if (el.lastElementChild !== z) el.appendChild(z);
      });
      obs.observe(el, { childList: true });
      nettoyages.push(function () { obs.disconnect(); });
    }

    // Après une étape : la suivante, ou l'écran de fin si l'étape était rejouée depuis cet écran
    function apres(i) { if (rejeu) fin(); else aller(i + 1); }

    function contexte(el, i) {
      var msg = null, j = { el: el, fig: fig, n: n, etape: i }, revelation = false;
      // Résolveurs : chaque question sait donner sa bonne réponse (choix, nombres, jetons automatiquement ;
      // un geste sur la figure l'enregistre avec j.reponse(fonction qui réussit l'étape)).
      var resolveurs = [];
      j.reponse = function (f) { var r = { faire: f, fait: false }; resolveurs.push(r); return r; };
      j.reveler = function () {
        if (revelation) return;
        etats[i] = "revelee"; revelation = true;
        var z = el.querySelector(".aide-q"); if (z) z.style.visibility = "hidden";
        var attente = 0;
        (function pas() {
          if (courante !== i || el.querySelector(".btn.suite")) { revelation = false; if (courante === i) lienCours(el, i, el.querySelector(".retour-msg")); return; }
          var r = resolveurs.filter(function (x) { return !x.fait; }).pop();
          if (r) { r.fait = true; attente = 0; r.faire(); setTimeout(pas, 450); return; }
          // une question peut apparaître après une petite animation : on attend un peu
          if ((attente += 250) < 5000) { setTimeout(pas, 250); return; }
          revelation = false;
          if (z) z.style.visibility = "";
          j.info("Cette question n'a pas de réponse toute prête : passe-la.");
        })();
      };
      function ligneMsg() { if (!msg || !msg.parentNode) msg = E.h("div", "retour-msg", "", el); return msg; }
      j.titre = function (html) { var h = E.h("h2", "", html, el); E.rendre(h); return h; };
      j.consigne = function (html) { var p = E.h("p", "consigne", html, el); E.rendre(p); return p; };
      j.texte = function (html) { var p = E.h("p", "", html, el); E.rendre(p); return p; };
      j.zone = function (cls, html) { var z = E.h("div", cls || "", html || "", el); E.rendre(z); return z; };
      j.rendre = E.rendre;
      j.nettoyer = function (f) { nettoyages.push(f); };
      j.erreur = function (html) {
        if (revelation) return;
        erreurs++;
        var m = ligneMsg(); m.className = "retour-msg ko"; m.innerHTML = "<span>" + html + "</span>"; E.rendre(m);
        m.classList.remove("secoue"); void m.offsetWidth; m.classList.add("secoue");
        lienCours(el, i, m);
      };
      j.info = function (html) { var m = ligneMsg(); m.className = "retour-msg info"; m.innerHTML = "<span>" + html + "</span>"; E.rendre(m); };
      j.efface = function () { if (msg) { msg.innerHTML = ""; msg.className = "retour-msg"; } };
      j.bravo = function (html, point) {
        // réponse montrée : on donne la réponse, sans féliciter
        if (etats[i] === "revelee") { var mr = ligneMsg(); mr.className = "retour-msg info"; mr.innerHTML = "<span>Réponse : " + (html || "") + "</span>"; E.rendre(mr); lienCours(el, i, mr); return; }
        var m = ligneMsg(); m.className = "retour-msg ok"; m.innerHTML = COCHE + "<span>" + (html || "Bravo.") + "</span>"; E.rendre(m);
        var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
        var p = point ? [r.left + point[0] / vb.width * r.width, r.top + point[1] / vb.height * r.height] : [r.left + r.width / 2, r.top + r.height / 2];
        var o = E.h("div", "onde", "", document.body); o.style.left = p[0] + "px"; o.style.top = p[1] + "px";
        setTimeout(function () { o.remove(); }, 1000);
      };
      j.expliquer = function (html) {
        var x = E.h("div", "explique", html, el); E.rendre(x);
        setTimeout(function () { x.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 250);
        return x;
      };
      j.suite = function (label, parent) {
        var b = E.h("button", "btn suite", rejeu ? "Revenir au bilan" : label || (i + 1 < def.etapes.length ? "Continuer" : "Terminer le niveau"), parent || el); b.type = "button";
        b.addEventListener("click", function () { b.disabled = true; if (!etats[i]) etats[i] = "resolue"; apres(i); });
        setTimeout(function () { b.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 400);
        return b;
      };
      // Choix : [{ html | tex, juste, aide }] ; cfg.ok(bouton), cfg.colonnes
      j.choix = function (opts, cfg) {
        cfg = cfg || {};
        var z = E.h("div", "choix", "", el); z.style.setProperty("--col", cfg.colonnes || Math.min(3, opts.length));
        var bonne = null, r = j.reponse(function () { if (bonne) bonne.click(); });
        opts.forEach(function (o) {
          var b = E.h("button", "", "", z); b.type = "button";
          if (o.juste) bonne = b;
          if (o.tex) E.k(b, o.tex); else { b.innerHTML = o.html; E.rendre(b); }
          b.addEventListener("click", function () {
            if (o.juste) {
              r.fait = true;
              z.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
              b.classList.add("bon");
              if (cfg.ok) cfg.ok(b);
            } else {
              b.classList.add("faux"); b.classList.remove("secoue"); void b.offsetWidth; b.classList.add("secoue");
              j.erreur(o.aide || "Pas tout à fait. Regarde la figure.");
            }
          });
        });
        return z;
      };
      // Nombres : cfg.cases = [{ attendu, tol }], cfg.avant (KaTeX), cfg.ligne, cfg.colonnes (cases en grille), cfg.ok(), cfg.aide(k)
      j.nombre = function (cfg) {
        var bloc = E.h("div", "nombres", "", el);
        if (cfg.avant) E.k(E.h("span", "", "", bloc), cfg.avant);
        var cs = E.h("div", "cases" + (cfg.ligne ? " ligne" : ""), "", bloc);
        if (cfg.colonnes) cs.style.cssText = "display:grid;grid-template-columns:repeat(" + cfg.colonnes + ", minmax(0, 112px));gap:8px";
        if (cfg.apres) E.k(E.h("span", "", "", bloc), cfg.apres);
        var val = cfg.cases.map(function () { return ""; }), active = 0;
        var cases = cfg.cases.map(function (c, k) { var d = E.h("div", "saisie", "", cs); d.addEventListener("click", function () { active = k; maj(); }); return d; });
        function maj() { cases.forEach(function (c, k) { c.textContent = val[k].replace("-", "−") || " "; c.classList.toggle("active", k === active); }); }
        var clav = E.h("div", "clavier", "", el);
        ["7", "8", "9", "−", "4", "5", "6", ",", "1", "2", "3", "0"].forEach(function (t) {
          var b = E.h("button", "touche", t, clav); b.type = "button";
          b.addEventListener("click", function () {
            var s = val[active];
            if (t === "−") s = s.charAt(0) === "-" ? s.slice(1) : "-" + s;
            else if (t === ",") { if (s.indexOf(",") < 0) s = (s === "" || s === "-" ? s + "0" : s) + ","; }
            else if (s.replace(/[-,]/g, "").length < 5) s += t;
            val[active] = s; cases[active].classList.remove("bon", "faux"); maj();
          });
        });
        var bE = E.h("button", "touche large", "Effacer", clav); bE.type = "button";
        bE.addEventListener("click", function () { val[active] = ""; cases[active].classList.remove("bon", "faux"); maj(); });
        var bV = E.h("button", "touche large ok", "Vérifier", clav); bV.type = "button";
        var r = j.reponse(function () {
          cfg.cases.forEach(function (c, k) { val[k] = String(c.attendu).replace(".", ","); });
          maj(); bV.click();
        });
        bV.addEventListener("click", function () {
          var faux = [];
          cfg.cases.forEach(function (c, k) {
            var x = parseFloat(val[k].replace(",", ".")), bon = val[k] !== "" && !isNaN(x) && Math.abs(x - c.attendu) <= (c.tol === undefined ? 0.005 : c.tol);
            cases[k].classList.toggle("bon", bon); cases[k].classList.toggle("faux", !bon);
            if (!bon) faux.push(k);
          });
          if (faux.length) { j.erreur(cfg.aide ? cfg.aide(faux[0], val) : "Une valeur ne va pas : elle est en rouge."); return; }
          r.fait = true; clav.style.display = "none";
          if (cfg.ok) cfg.ok();
        });
        maj();
        return bloc;
      };
      // Jetons à glisser dans des trous : cfg.jetons [{ id, html|tex }], cfg.trous (éléments .trou avec data-attendu), cfg.ok()
      j.jetons = function (cfg) {
        var reserve = E.h("div", "jetons", "", cfg.reserve || el);
        var trous = cfg.trous, place = trous.map(function () { return null; });
        var bVerif = E.h("button", "btn bleu", "Vérifier", el); bVerif.type = "button"; bVerif.disabled = true;
        var siens = [], r = j.reponse(function () {
          place.forEach(function (t) { if (t) poser(t, null); });
          trous.forEach(function (x, k) {
            var t = siens.filter(function (y) { return y.dataset.id === x.dataset.attendu && place.indexOf(y) < 0; })[0];
            if (t) poser(t, k);
          });
          bVerif.disabled = false; bVerif.click();
        });
        function poser(t, k) {
          var a = place.indexOf(t); if (a >= 0) place[a] = null;
          if (k === null) reserve.appendChild(t);
          else { if (place[k]) reserve.appendChild(place[k]); place[k] = t; trous[k].appendChild(t); }
          trous.forEach(function (x) { x.classList.remove("faux"); });
          bVerif.disabled = place.some(function (x) { return !x; });
        }
        cfg.jetons.forEach(function (o) {
          var t = E.h("div", "jeton", "", reserve); t.dataset.id = o.id;
          siens.push(t);
          if (o.tex) E.k(t, o.tex); else { t.innerHTML = o.html; E.rendre(t); }
          t.addEventListener("pointerdown", function (ev) {
            if (t.dataset.bloque) return;
            ev.preventDefault();
            var id = ev.pointerId, x0 = ev.clientX, y0 = ev.clientY, vol = null, cible = null, bb = t.getBoundingClientRect();
            function mv(e) {
              if (e.pointerId !== id) return;
              if (!vol && Math.hypot(e.clientX - x0, e.clientY - y0) > 8) { vol = t.cloneNode(true); vol.classList.add("vol"); document.body.appendChild(vol); t.classList.add("fantome"); }
              if (!vol) return;
              vol.style.left = (e.clientX - bb.width / 2) + "px"; vol.style.top = (e.clientY - bb.height / 2) + "px";
              cible = null;
              trous.forEach(function (x, k) { var b = x.getBoundingClientRect(), dans = e.clientX > b.left - 12 && e.clientX < b.right + 12 && e.clientY > b.top - 12 && e.clientY < b.bottom + 12; x.classList.toggle("survol", dans); if (dans) cible = k; });
            }
            function fin(e) {
              if (e.pointerId !== id) return;
              window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", fin); window.removeEventListener("pointercancel", fin);
              trous.forEach(function (x) { x.classList.remove("survol"); }); t.classList.remove("fantome");
              if (vol) { vol.remove(); poser(t, cible); }
              else { var libre = place.indexOf(null); if (place.indexOf(t) >= 0) poser(t, null); else if (libre >= 0) poser(t, libre); }
            }
            window.addEventListener("pointermove", mv); window.addEventListener("pointerup", fin); window.addEventListener("pointercancel", fin);
          });
        });
        bVerif.addEventListener("click", function () {
          var faux = [];
          place.forEach(function (t, k) { if (t.dataset.id !== trous[k].dataset.attendu) faux.push(k); });
          if (faux.length) {
            faux.forEach(function (k) { trous[k].classList.add("faux"); });
            setTimeout(function () { faux.forEach(function (k) { poser(place[k], null); }); }, 700);
            j.erreur(cfg.aide || "Les cases en rouge ne sont pas à leur place.");
            return;
          }
          r.fait = true; bVerif.remove(); reserve.remove();
          trous.forEach(function (x) { x.classList.add("bon"); x.firstChild.dataset.bloque = 1; });
          if (cfg.ok) cfg.ok();
        });
        return reserve;
      };
      // Curseur : cfg { nom, min, max, pas, val, unite, dec, change(v) }
      j.curseur = function (cfg, parent) {
        var z = E.h("div", "curseur", "", parent || el);
        E.h("label", "", cfg.nom, z);
        var inp = E.h("input", "", null, z); inp.type = "range"; inp.min = cfg.min; inp.max = cfg.max; inp.step = cfg.pas || 1; inp.value = cfg.val;
        var out = E.h("output", "", "", z);
        var c = { input: inp, v: +cfg.val };
        function maj() { c.v = +inp.value; out.textContent = E.fmt(c.v, cfg.dec || 0) + (cfg.unite || ""); }
        inp.addEventListener("input", function () { maj(); if (cfg.change) cfg.change(c.v); });
        c.regler = function (v) { inp.value = v; maj(); };
        maj();
        return c;
      };
      return j;
    }

    function fin() {
      nettoyages.forEach(function (f) { try { f(); } catch (e) { /* rien */ } }); nettoyages = [];
      var ancien = panneau.querySelector(".etape:not(.sortie)"); if (ancien) ancien.remove();
      courante = def.etapes.length; majSegments(); rejeu = false;
      // une question passée ou dont on a vu la réponse ne compte pas : au plus une étoile, aucune si rien n'a été trouvé
      var restantes = [], trouvees = 0;
      def.etapes.forEach(function (e, k) { if (etats[k] === "resolue") trouvees++; else restantes.push(k); });
      var nb = !restantes.length ? JEU.etoiles(erreurs) : trouvees ? 1 : 0;
      if (nb) P.marquer(MID, def.id, nb);
      // l'étape suivante sur la carte : le cours de la notion suivante, ou la révision, ou le boss
      var suivant = P.apres(MID, "exos", def.id);
      if (suivant) P.noterDernier(MID, P.genre(suivant) + " : " + suivant.titre, suivant.url);
      var r = document.getElementById("resultat");
      var et = ""; for (var s = 0; s < 3; s++) et += '<span class="' + (s < nb ? "pleine" : "vide") + '">' + ETOILE + "</span>";
      var texte = restantes.length
        ? (restantes.length > 1 ? restantes.length + " questions passées ou vues : elles ne comptent pas pour les étoiles. Réessaie-les." : "Une question passée ou vue : elle ne compte pas pour les étoiles. Réessaie-la.")
        : erreurs === 0 ? "Aucune erreur. Parfait." : erreurs + (erreurs > 1 ? " erreurs" : " erreur") + ". Rejoue sans erreur pour avoir les trois étoiles.";
      r.innerHTML = '<div class="carte"><span class="kicker' + (info.boss ? " boss" : "") + '">' + (info.boss && !restantes.length ? "BOSS VAINCU" : "NIVEAU TERMINÉ") + '</span><div class="etoiles">' + et + "</div><h2>" + info.titre + "</h2><p>" +
        texte + '</p><div class="a-revoir"></div><div class="actions"></div></div>';
      var liste2 = r.querySelector(".a-revoir");
      restantes.forEach(function (k) {
        var l = E.h("div", "", '<span><b>Étape ' + (k + 1) + "</b> · " + def.etapes[k].nom + "<small>" + (etats[k] === "revelee" ? "réponse vue" : "passée") + "</small></span>", liste2);
        var b = E.h("button", "btn clair", "Réessayer", l); b.type = "button";
        b.addEventListener("click", function () { r.classList.remove("on"); rejeu = true; etats[k] = undefined; aller(k); });
      });
      var act = r.querySelector(".actions");
      var b1 = null;
      if (suivant) {
        var lib = suivant.type === "cours" ? "Cours suivant" : suivant.boss ? "Le boss du chapitre" : suivant.revision ? "Révision du chapitre" : "Exercices suivants";
        b1 = E.h("a", "btn btn-suivant", lib + "<small>" + suivant.titre + "</small>", act); b1.href = P.urlEtape(suivant);
      }
      var b2 = E.h("a", "btn clair", "Rejouer", act); b2.href = "jouer.html#" + def.id; b2.addEventListener("click", function (e) { e.preventDefault(); location.reload(); });
      var b3 = E.h("a", "btn clair", "Carte", act); b3.href = P.urlCarte(MID, ici ? ici.etape.sm : undefined, info.chapitre);
      [b2, b3].forEach(function (b) { b.style.cssText = "display:inline-flex;align-items:center;text-decoration:none"; });
      r.classList.add("on");
    }

    // « Revoir dans le cours » : après une erreur ou une réponse vue, un lien vers la partie du cours qui l'explique.
    // La correspondance étape → section vient de liens-cours.js (généré par tests/navigateur/liens.js) ;
    // à défaut, la page de cours de la notion. Le cours s'ouvre par-dessus l'exercice, qui reste en l'état.
    function lienCours(el, i, apresEl) {
      if (el.querySelector(".revoir")) return;
      var L = (window.LIENS_COURS || {})[def.id], c = L && L[i];
      if (!c && info.cours) c = [info.id, "", ""];
      if (!c) return;
      var page = (MOD.cours || []).filter(function (x) { return x.id === c[0]; })[0];
      var titre = (page ? page.titre : c[0]) + (c[2] ? " · " + c[2] : "");
      var a = E.h("a", "revoir", "<span>Revoir dans le cours</span><b>" + titre + "</b>", el);
      a.href = "cours/" + c[0] + ".html" + (c[1] ? "#" + c[1] : "");
      if (apresEl && apresEl.nextSibling) el.insertBefore(a, apresEl.nextSibling);
      a.addEventListener("click", function (e) { e.preventDefault(); ouvrirCours(c[0], c[1], page ? page.titre : ""); });
    }
    function ouvrirCours(page, ancre, titre) {
      var f = document.getElementById("fenetre-cours");
      if (!f) {
        f = E.h("div", "fenetre-cours", '<div class="fc-carte"><div class="fc-tete"><span></span><button type="button" class="btn">Revenir à l\'exercice</button></div><iframe title="Cours"></iframe></div>', document.body);
        f.id = "fenetre-cours";
        f.querySelector("button").addEventListener("click", function () { f.classList.remove("on"); });
        f.addEventListener("click", function (e) { if (e.target === f) f.classList.remove("on"); });
      }
      f.querySelector(".fc-tete span").textContent = titre;
      var fr = f.querySelector("iframe"), url = "cours/" + page + ".html?dans=1" + (ancre ? "#" + ancre : "");
      if (fr.getAttribute("src") !== url) fr.setAttribute("src", url);
      f.classList.add("on");
    }

    window.essaiJeu = { aller: aller, n: n, erreurs: function () { return erreurs; } };
    aller(0);
  };

  // charge le niveau demandé dans l'adresse (#id)
  addEventListener("hashchange", function () { location.reload(); });
  var premier = (MOD.niveaux || []).filter(function (n) { return n.pret; })[0];
  var id = (location.hash || "").slice(1) || (premier ? premier.id : "");
  var l = document.createElement("script");
  l.src = "liens-cours.js";
  l.onload = l.onerror = function () {
    var s = document.createElement("script");
    s.src = "niveaux/" + encodeURIComponent(id) + ".js";
    s.onerror = function () { location.replace("index.html"); };
    document.body.appendChild(s);
  };
  document.body.appendChild(l);
})();
