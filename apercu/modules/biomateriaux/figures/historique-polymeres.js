(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  (function () {
    var f = R.figure("fig-frise", {
      largeur: 960, hauteur: 420, titre: "Frise des polymères (dates du cours)",
      essai: "<strong>Essaie</strong> : touche un événement de la frise. <strong>Observe</strong> : sa date, son auteur et le besoin auquel il répondait. Les bandes colorées marquent l'émergence (1920–1930) et la Seconde Guerre mondiale."
    });
    var g = R.el("g", null, f.svg), sel = 0, zone = R.h("div", null, "", f.direct);
    var EV = [
      { a: 1869, t: "celluloïd", d: "Frères Hyatt : nitration de la cellulose du bois avec du camphre, à chaud. But : remplacer l'ivoire des boules de billard, sous embargo pendant la guerre de Sécession." },
      { a: 1890, t: "pellicule", d: "Le celluloïd sert de support aux pellicules photographiques et aux films." },
      { a: 1907, t: "Bakélite", d: "Baekeland : phénol + formaldéhyde. Premier thermodurcissable complètement synthétique commercialisé ; production industrielle en 1910." },
      { a: 1935, t: "nylon", d: "Wallace Hume Carothers, Du Pont de Nemours. Première commercialisation : la brosse à dents à poils en nylon." },
      { a: 1953, t: "Staudinger", d: "Prix Nobel de chimie pour le concept de macromolécule (proposé au début du XXe siècle)." },
      { a: 1953, t: "Corvette", d: "« The plastic car » : résine polyester et fibres de verre, pièces fabriquées par laminage." },
      { a: 1953, t: "HDPE", d: "Polyéthylène haute densité (Ziegler, 1953), mis en forme par extrusion-soufflage : bouteilles, réservoirs d'essence." }
    ];
    function x(a) { return 70 + (a - 1860) / 100 * 820; }
    function dessin() {
      R.vider(g);
      R.el("rect", { x: x(1920), y: 190, width: x(1930) - x(1920), height: 40, fill: PLATEFORME.teinte(0.25) }, g);
      R.el("rect", { x: x(1939), y: 190, width: x(1945) - x(1939), height: 40, fill: "rgba(59,91,219,0.18)" }, g);
      T(g, "émergence", [x(1925), 252], { taille: 13, couleur: C.acc }); T(g, "2e guerre", [x(1942), 252], { taille: 13, couleur: C.z });
      R.fleche(g, [50, 210], [920, 210], { couleur: C.fonce, epaisseur: 3 });
      [1860, 1880, 1900, 1920, 1940, 1960].forEach(function (a) { R.ligne(g, [x(a), 200], [x(a), 220], { couleur: C.fonce, epaisseur: 2 }); T(g, String(a), [x(a), 280], { taille: 14, couleur: C.doux }); });
      EV.forEach(function (e, i) {
        var haut = i % 2 === 0, y = haut ? 110 - (i >= 4 ? (i - 4) * 0 : 0) : 330, on = i === sel;
        var xx = i >= 4 ? x(1953) + [-100, 0, 40][i - 4] : x(e.a);
        if (i >= 4) y = [110, 330, 110][i - 4];
        var b = R.el("g", { style: "cursor:pointer" }, g);
        R.ligne(b, [x(Math.floor(e.a)), 210], [xx, y < 210 ? y + 26 : y - 26], { couleur: on ? C.acc : C.gris, epaisseur: on ? 3 : 2 });
        R.el("rect", { x: xx - 62, y: y - 24, width: 124, height: 48, rx: 12, fill: on ? PLATEFORME.teinte(0.18) : "#fff", stroke: on ? C.acc : "#c6cbd8", "stroke-width": on ? 3 : 2 }, b);
        T(b, e.t, [xx, y - 6], { taille: 15, gras: true, halo: false });
        T(b, String(Math.floor(e.a)), [xx, y + 13], { taille: 13, couleur: C.doux, halo: false });
        R.point(g, [x(Math.floor(e.a)), 210], { r: 7, couleur: on ? C.acc : C.fonce });
        b.addEventListener("click", function () { sel = i; dessin(); });
      });
      zone.innerHTML = "<strong>" + Math.floor(EV[sel].a) + ", " + EV[sel].t + "</strong> : " + EV[sel].d;
    }
    dessin();
  })();
})();
