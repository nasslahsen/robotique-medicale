/* Maquettes : seulement les gestes d'interface (retourner une carte, répondre au quiz, bascules). Aucune logique réelle. */
(function () {
  "use strict";
  // Carte mémoire : toucher pour retourner, puis les trois boutons apparaissent
  document.querySelectorAll(".flip").forEach(function (c) {
    c.addEventListener("click", function () {
      c.classList.toggle("retournee");
      document.querySelectorAll("[data-apres-flip]").forEach(function (e) { e.style.visibility = c.classList.contains("retournee") ? "visible" : "hidden"; });
    });
  });
  document.querySelectorAll("[data-apres-flip]").forEach(function (e) { e.style.visibility = "hidden"; });
  // Quiz : toucher une réponse montre le retour
  document.querySelectorAll(".choix-q[data-quiz]").forEach(function (z) {
    z.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (z.dataset.fini) return; z.dataset.fini = "1";
        z.querySelectorAll("button").forEach(function (x) { if (x.hasAttribute("data-juste")) x.classList.add("bon"); });
        if (!b.hasAttribute("data-juste")) b.classList.add("faux");
        var r = document.getElementById(b.hasAttribute("data-juste") ? "retour-bon" : "retour-faux");
        if (r) { r.hidden = false; setTimeout(function () { r.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 50); }
        var c = document.getElementById("consigne-q"); if (c) c.hidden = true;
      });
    });
  });
  // Contrôles segmentés et bascules
  document.querySelectorAll(".segm").forEach(function (s) {
    s.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { s.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); }); });
  });
  document.querySelectorAll(".bascule-mq").forEach(function (b) { b.addEventListener("click", function () { b.classList.toggle("on"); }); });
  // Étiquettes « Ajouté » : toucher affiche l'explication
  document.querySelectorAll(".ajoute").forEach(function (a) {
    a.setAttribute("title", "Pas dans les diapositives : à vérifier");
    a.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); a.textContent = a.textContent.trim() === "Ajouté" ? "Pas dans les diapos, à vérifier" : "Ajouté"; });
  });
})();
