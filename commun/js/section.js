/*
 * Un chapitre sur une seule grande page qui défile (modules/<id>/<dossierChapitres>/cours/chapitre-<n>.html,
 * générée par outils/regrouper.js). Pas de bouton entre les sections : on lit d'un trait.
 * Après chaque notion, ses exercices en option (« Jouer ») : ils s'ouvrent par-dessus la page, qui reste à sa place ;
 * sinon on continue de défiler. En fin de chapitre : la révision et le défi final, en option, puis « Chapitre suivant ».
 * La barre montre la section où l'on est (« 2 / 4 ») ; une section est lue quand on passe sa fin ;
 * « Reprendre » rouvre la page à la section où l'on s'est arrêté.
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
    P.barre(barre, { carte: P.urlPlan(MID, ch.sm), droite: '<span class="rang-barre" aria-live="polite"></span>' });
    document.body.insertBefore(barre, document.body.firstChild);
    rang = barre.querySelector(".rang-barre");
  }
  var etiquette = document.querySelector("[data-etiquette]");
  if (etiquette) etiquette.textContent = "Chapitre " + ch.id;

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
        P.noterPlan(MID, ch.sm, ch.titre + " · " + s.titre, P.urlSection(MID, s.id).replace(P.racine, ""));
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

    // Exercices facultatifs : après chaque notion qui a un niveau ; la révision et le défi final en fin de chapitre
    var parId = {};
    ch.niveaux.forEach(function (n) { parId[n.id] = n; });
    function bloc(n, ou, avant) {
      var b = document.createElement("div");
      b.className = "jouer" + (n.boss ? " defi" : "");
      b.dataset.niveau = n.id;
      b.innerHTML = '<span><small>' + (n.boss ? "Défi final" : n.revision ? "Révision du chapitre" : "Exercices") + "</small>" + esc(n.titre) + "</span>" +
        '<button type="button" class="btn-jouer"></button>';
      b.querySelector("button").addEventListener("click", function () { ouvrir(n.id); });
      ou.insertBefore(b, avant || null);
      return b;
    }
    [].forEach.call(main.querySelectorAll("article.notion"), function (art) {
      var n = parId[art.id.replace(/^n-/, "")];
      if (n) bloc(n, art.parentNode, art.nextSibling);
    });
    var fin = document.createElement("section");
    fin.className = "fin-chapitre";
    fin.innerHTML = "<h2>Fin du chapitre</h2><p>Pour tout mélanger, si tu en as envie : la révision, puis le défi final.</p>";
    ch.niveaux.filter(function (n) { return n.revision || n.boss; }).forEach(function (n) { bloc(n, fin); });
    var sms = P.chapitresDe(MID, ch.sm), suiv = sms[sms.map(function (c) { return c.id; }).indexOf(ch.id) + 1];
    var bas = document.createElement("nav");
    bas.className = "fin-cours";
    bas.setAttribute("aria-label", "Suite");
    bas.innerHTML = suiv && suiv.sections.length
      ? '<a class="aller" href="' + P.urlChapitre(MID, suiv.id) + '"><small>Chapitre suivant</small>' + esc(suiv.titre) + "</a>"
      : '<a class="aller" href="' + P.urlPlan(MID, ch.sm) + '"><small>Dernier chapitre</small>Retour à la carte</a>';
    fin.appendChild(bas);
    main.appendChild(fin);
    function majBlocs() {
      var c = P.chapitre(MID, ch.id), fait = {};
      c.niveaux.forEach(function (n) { fait[n.id] = n.fait; });
      [].forEach.call(document.querySelectorAll(".jouer"), function (b) {
        b.classList.toggle("fait", !!fait[b.dataset.niveau]);
        b.querySelector("button").textContent = fait[b.dataset.niveau] ? "Rejouer" : "Jouer";
      });
    }
    majBlocs();

    // L'exercice s'ouvre par-dessus la page ; « Revenir au cours » le ferme et la page n'a pas bougé
    var fenetre = null;
    function ouvrir(nid) {
      if (!fenetre) {
        fenetre = document.createElement("div");
        fenetre.className = "fenetre-jeu";
        fenetre.innerHTML = '<iframe title="Exercices"></iframe>';
        document.body.appendChild(fenetre);
      }
      fenetre.querySelector("iframe").src = P.urlExercice(MID, nid);
      fenetre.classList.add("on");
      document.documentElement.classList.add("jeu-ouvert");
    }
    function fermer() {
      if (!fenetre) return;
      fenetre.classList.remove("on");
      document.documentElement.classList.remove("jeu-ouvert");
      fenetre.querySelector("iframe").src = "about:blank";
      majBlocs();
    }
    addEventListener("message", function (e) { if (e.data && e.data.s5 === "fermer-exercice") fermer(); });
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
