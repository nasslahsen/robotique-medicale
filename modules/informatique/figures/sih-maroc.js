/* Figure : carte schématique des régions du Maroc et éditeur du SIH public de chaque région (diapo 42 du cours). */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-carte", {
    largeur: 960, hauteur: 630, titre: "Panorama des SIH au Maroc",
    essai: "<strong>Essaie</strong> : touche une région, puis un éditeur de la légende. <strong>Observe</strong> : le sud est presque entièrement chez un seul éditeur, le centre est partagé."
  });
  var g = A.s("g", null, f.svg), ch = -1, ed = -1;
  g.setAttribute("transform", "translate(105 2) scale(1.1)");
  function dessiner() {
    A.vider(g);
    A.carteMaroc(g, { legende: true, compte: true, ok: ch });
    if (ed >= 0) A.REGIONS.forEach(function (r) { if (r.e !== ed) A.s("rect", { x: r.x, y: r.y, width: r.w, height: r.h, rx: 10, fill: "#fff", opacity: 0.75 }, g); });
    A.REGIONS.forEach(function (r, i) { A.cible(g, r.x, r.y, r.w, r.h, function () { ch = i; ed = -1; dessiner(); }); });
    A.EDITEURS.forEach(function (e, k) { A.cible(g, 440, 380 + k * 46 - 22, 220, 44, function () { ed = k; ch = -1; dessiner(); }); });
    if (ch >= 0) f.direct.innerHTML = "<strong>" + A.REGIONS[ch].n + "</strong> : SIH public équipé par " + A.EDITEURS[A.REGIONS[ch].e].n + ".";
    else if (ed >= 0) f.direct.innerHTML = "<strong>" + A.EDITEURS[ed].n + "</strong> : " + A.REGIONS.filter(function (r) { return r.e === ed; }).map(function (r) { return r.n; }).join(", ") + ".";
    else f.direct.innerHTML = "Touche une région ou un éditeur.";
  }
  dessiner();
})();
