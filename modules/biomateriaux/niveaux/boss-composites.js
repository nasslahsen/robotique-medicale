/* Boss du chapitre 6 : lame de prothèse de course en carbone-époxy (exemple ajouté). */
NIVEAU({
  id: "boss-composites",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { fiche: {} };
    n.dessin = function () {
      E.vider(g);
      // lame en forme de J
      E.s("path", { d: "M120 90 L150 90 L170 330 Q190 470 320 480 L470 480 Q520 478 520 450 L520 440 Q505 455 470 455 L320 455 Q215 448 196 330 L150 90 Z", fill: "#2f323b", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 104, y: 50, width: 64, height: 50, rx: 10, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      D.texte(g, "emboîture", [180, 70], { taille: 15, coul: C.doux, ancre: "start" });
      D.texte(g, "lame en carbone-époxy", [320, 520], { taille: 17 });
      // fiche
      E.s("rect", { x: 370, y: 70, width: 295, height: 330, rx: 18, fill: "#fff", stroke: "#d9dde6", "stroke-width": 2 }, g);
      D.texte(g, "Fiche du stratifié", [517, 102], { taille: 19 });
      D.texte(g, "Ef 230 · Em 3,5 GPa · φf 0,6", [517, 130], { taille: 15, coul: C.doux, gras: false });
      var f = n.fiche;
      [["ECL (UD)", f.el], ["ECT (UD)", f.et], ["plis", f.pl], ["Ko", f.ko], ["ECL stratifié", f.es], ["ρ", f.r]].forEach(function (l, i) {
        var y = 172 + i * 38;
        D.texte(g, l[0], [388, y], { taille: 16, ancre: "start" });
        D.texte(g, l[1] || "?", [650, y], { taille: l[0] === "plis" ? 14 : 16, ancre: "end", mono: true, coul: l[1] ? C.ok : C.gris });
      });
      fig.chip("exemple ajouté");
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Module le long des fibres", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Une lame de course pour amputé est en carbone (Ef = 230 GPa) et époxy (Em = 3,5 GPa), φf = 0,6. ECL d'un pli unidirectionnel ?");
      j.consigne("Boss : chaque erreur compte.");
      j.nombre({ avant: "E_{CL} =", apres: "\\text{GPa}", cases: [{ attendu: 139.4, tol: 0.2 }], ligne: true,
        aide: function () { return "Loi des mélanges du module longitudinal."; },
        ok: function () { n.fiche.el = "139,4 GPa"; n.dessin(); j.bravo("230 × 0,6 + 3,5 × 0,4 = 139,4 GPa."); j.suite(); } });
    } },
    { nom: "Module en travers", jouer: function (j, n) {
      j.titre("Et ECT du même pli ?");
      j.nombre({ avant: "E_{CT} =", apres: "\\text{GPa}", cases: [{ attendu: 8.55, tol: 0.05 }], ligne: true,
        aide: function () { return "Les inverses s'ajoutent, pondérés par les fractions volumiques."; },
        ok: function () { n.fiche.et = "8,55 GPa"; n.dessin(); j.bravo("1 / (0,6/230 + 0,4/3,5) ≈ 8,55 GPa."); j.suite(); } });
    } },
    { nom: "Orienter les plis", jouer: function (j, n) {
      j.titre("La lame fléchit surtout dans sa longueur, mais subit aussi un peu de torsion et de chocs de côté. Quel empilement ?");
      j.choix([
        { html: "Surtout des plis à 0°, quelques plis à ±45° et 90°", juste: true },
        { html: "Uniquement des plis à 0°", aide: "Le pli UD est très faible en travers (8,55 GPa) : la torsion et les chocs de côté le fendraient." },
        { html: "Orientation aléatoire dans le plan", aide: "Ko = 0,375 seulement dans la direction principale, alors qu'elle porte l'essentiel de l'effort." }
      ], { colonnes: 1, ok: function () { n.fiche.pl = "0°:70 ±45°:20 90°:10 %"; n.dessin(); j.bravo("On choisit 70 % à 0°, 10 % à +45°, 10 % à −45°, 10 % à 90°."); j.suite(); } });
    } },
    { nom: "Coefficient d'orientation", jouer: function (j, n) {
      j.titre("Calcule Ko pour 70 % à 0°, 10 % à +45°, 10 % à −45° et 10 % à 90°.");
      j.nombre({ avant: "K_o =", cases: [{ attendu: 0.75, tol: 0.002 }], ligne: true,
        aide: function () { return "Ko = Σ an cos⁴θn ; cos⁴ 45° = 0,25."; },
        ok: function () { n.fiche.ko = "0,75"; n.dessin(); j.bravo("0,7 + 0,1 × 0,25 × 2 + 0 = 0,75."); j.suite(); } });
    } },
    { nom: "Module du stratifié", jouer: function (j, n) {
      j.titre("Module dans la longueur de la lame ?");
      j.nombre({ avant: "E_{CL} =", apres: "\\text{GPa}", cases: [{ attendu: 104.9, tol: 0.2 }], ligne: true,
        aide: function () { return "ECL = Ko Ef φf + Em φm."; },
        ok: function () { n.fiche.es = "104,9 GPa"; n.dessin(); j.bravo("0,75 × 230 × 0,6 + 1,4 = 104,9 GPa."); j.suite(); } });
    } },
    { nom: "Comparer au titane", jouer: function (j, n) {
      j.titre("Avec ρf = 1,8 et ρm = 1,2 g/cm³, quelle masse volumique pour la lame ? Le Ti-6Al-4V (110 GPa) en a 4,43.");
      j.nombre({ avant: "\\rho =", apres: "\\text{g/cm}^3", cases: [{ attendu: 1.56, tol: 0.005 }], ligne: true,
        aide: function () { return "Moyenne pondérée par les fractions volumiques."; },
        ok: function () {
          n.fiche.r = "1,56 g/cm³"; n.dessin();
          j.bravo("1,8 × 0,6 + 1,2 × 0,4 = 1,56 g/cm³.");
          j.expliquer("<p>Module presque égal au titane (105 contre 110 GPa) pour une masse volumique près de trois fois plus faible : \\(E/\\rho \\approx 67\\) contre 25. C'est le raisonnement qui mène aux prothèses en carbone.</p>");
          j.suite();
        } });
    } }
  ]
});
