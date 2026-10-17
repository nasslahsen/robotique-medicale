/* Maquettes : seulement les gestes d'interface. Aucune logique réelle, rien n'est enregistré. */
(function () {
  "use strict";
  var tous = function (s, f) { document.querySelectorAll(s).forEach(f); };

  // Carte mémoire : toucher pour retourner, les réponses n'apparaissent qu'ensuite
  var apres = document.querySelectorAll("[data-apres-flip]");
  apres.forEach(function (e) { e.style.visibility = "hidden"; });
  tous(".flip", function (c) {
    c.addEventListener("click", function () {
      c.classList.toggle("retournee");
      apres.forEach(function (e) { e.style.visibility = c.classList.contains("retournee") ? "visible" : "hidden"; });
    });
  });

  // Quiz : toucher une réponse montre le retour (#juste ou #faux dans l'adresse pour l'ouvrir déjà répondu)
  tous(".choix[data-quiz]", function (z) {
    var repondre = function (b) {
      if (z.classList.contains("fini")) return;
      z.classList.add("fini");
      z.querySelectorAll("button").forEach(function (x) { if (x.hasAttribute("data-juste")) x.classList.add("bon"); });
      var juste = b.hasAttribute("data-juste");
      if (!juste) b.classList.add("faux");
      var r = document.getElementById(juste ? "retour-juste" : "retour-faux");
      if (r) r.hidden = false;
      tous("[data-apres-quiz]", function (x) { x.hidden = false; });
    };
    z.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { repondre(b); }); });
    if (location.hash === "#juste") repondre(z.querySelector("[data-juste]"));
    if (location.hash === "#faux") repondre(z.querySelector("button:not([data-juste])"));
  });

  // Contrôles segmentés, bascules, puces de chapitres
  tous(".segm", function (s) {
    s.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { s.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); }); });
  });
  tous(".bascule", function (b) {
    b.addEventListener("click", function () {
      b.classList.toggle("on");
      var t = b.getAttribute("data-cible"); if (t) document.getElementById(t).hidden = !b.classList.contains("on");
    });
  });
  tous(".puces button", function (b) { b.addEventListener("click", function () { b.classList.toggle("off"); }); });
})();
