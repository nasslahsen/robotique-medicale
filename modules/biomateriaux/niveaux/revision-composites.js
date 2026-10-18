/* Révision du chapitre 6 : exercice d'entraînement du TD 1.6 (composite unidirectionnel polypropylène-verre). */
NIVEAU({
  id: "revision-composites",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { phi: null, s: null, ect: false };
    n.dessin = function () {
      E.vider(g);
      // éprouvette unidirectionnelle vue de côté
      var x0 = 110, y = 175, L = 460, h = 160;
      E.s("rect", { x: x0, y: y, width: L, height: h, rx: 10, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2.5 }, g);
      for (var k = 0; k < 10; k++) D.ligne(g, [x0 + 10, y + 14 + k * 14.6], [x0 + L - 10, y + 14 + k * 14.6], C.jeu, 4.5);
      D.texte(g, "polypropylène + fibres de verre", [x0 + L / 2, y - 26], { taille: 20 });
      if (!n.ect) {
        D.fleche(g, [x0 - 6, y + h / 2], [x0 - 80, y + h / 2], "#3b5bdb", 7);
        D.fleche(g, [x0 + L + 6, y + h / 2], [x0 + L + 80, y + h / 2], "#3b5bdb", 7);
        D.texte(g, "50 MPa", [x0 + L + 50, y + h / 2 - 28], { taille: 17, coul: "#3b5bdb" });
      } else {
        D.fleche(g, [x0 + L / 2, y + h + 6], [x0 + L / 2, y + h + 64], "#3b5bdb", 7);
        D.texte(g, "charge en travers", [x0 + L / 2 + 20, y + h + 40], { taille: 18, coul: "#3b5bdb", ancre: "start" });
      }
      // tableau des données
      var ty = 440;
      [["", "ρ (g/cm³)", "E (GPa)"], ["PP", "0,91", "1,8"], ["verre", "2,55", "75"], ["composite", "1,6", n.s ? E.fmt(n.s.E, 1) : "?"]].forEach(function (l, i) {
        l.forEach(function (c, k) { D.texte(g, c, [170 + k * 180, ty + i * 34], { taille: 20, gras: i === 0 || k === 0, mono: i > 0 && k > 0 }); });
      });
      D.ligne(g, [80, ty + 17], [620, ty + 17], C.pale, 2);
      fig.chip(n.phi ? "φf = " + E.fmt(n.phi, 3) : "TD 1.6, exercice d'entraînement");
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le taux de fibres", jouer: function (j, n) {
      j.fig.astuce("Énoncé barré sur la feuille de TD : il reste un très bon entraînement.");
      j.titre("La masse volumique du composite (1,6 g/cm³) suit la loi des mélanges. Trouve φf.");
      j.nombre({ avant: "\\phi_f =", cases: [{ attendu: 0.421, tol: 0.002 }], ligne: true,
        aide: function () { return "1,6 = 2,55 φf + 0,91 (1 − φf), donc φf = (1,6 − 0,91) / (2,55 − 0,91)."; },
        ok: function () { n.phi = 0.4207; n.dessin(); j.bravo("φf = 0,69 / 1,64 ≈ 0,421."); j.suite(); } });
    } },
    { nom: "Le module longitudinal", jouer: function (j, n) {
      j.titre("Calcule ECL.");
      j.nombre({ avant: "E_{CL} =", apres: "\\text{GPa}", cases: [{ attendu: 32.6, tol: 0.1 }], ligne: true,
        aide: function () { return "ECL = Ef φf + Em φm = 75 × 0,421 + 1,8 × 0,579."; },
        ok: function () { n.s = BIO.repartitionSousCharge(75, 1.8, 0.4207, 50); n.dessin(); j.bravo("31,6 + 1,0 ≈ 32,6 GPa."); j.suite(); } });
    } },
    { nom: "Les contraintes", jouer: function (j, n) {
      j.titre("Sous 50 MPa suivant les fibres, quelle contrainte dans le verre, puis dans le polypropylène ?");
      j.nombre({ avant: "\\sigma_{verre},\\ \\sigma_{PP} =", apres: "\\text{MPa}", cases: [{ attendu: 115, tol: 1 }, { attendu: 2.76, tol: 0.05 }], ligne: true,
        aide: function (k) { return "Même déformation ε = 50 / 32 600. Puis σ = E ε avec E en MPa (75 000 et 1 800)."; },
        ok: function () {
          j.bravo("ε ≈ 0,00153 : σverre ≈ 115 MPa, σPP ≈ 2,8 MPa.");
          j.expliquer("<p>Vérification : \\(115 \\times 0{,}421 + 2{,}8 \\times 0{,}579 \\approx 50\\) MPa. Les fibres, 42 % du volume, portent 97 % de l'effort.</p>");
          j.suite();
        } });
    } },
    { nom: "En travers", jouer: function (j, n) {
      n.ect = true; n.dessin();
      j.titre("Et si on charge en travers des fibres ? Calcule ECT.");
      j.nombre({ avant: "E_{CT} =", apres: "\\text{GPa}", cases: [{ attendu: 3.05, tol: 0.03 }], ligne: true,
        aide: function () { return "1/ECT = φf/Ef + φm/Em = 0,421/75 + 0,579/1,8."; },
        ok: function () { j.bravo("ECT ≈ 3,05 GPa, dix fois moins que ECL."); j.suite(); } });
    } },
    { nom: "Grande diffusion ?", jouer: function (j, n) {
      j.titre("Ce composite polypropylène-verre est-il plutôt de grande diffusion ou à hautes performances ?");
      j.choix([
        { html: "Grande diffusion : verre, matrice courante, coût de série", juste: true },
        { html: "Hautes performances, car il est renforcé", aide: "Tout composite est renforcé ; les HP utilisent souvent carbone ou aramide, avec un coût unitaire important." },
        { html: "Ni l'un ni l'autre", aide: "Le cours classe tous les composites dans ces deux familles." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Fibre de verre et polymère courant : grande diffusion, comme le couple polyester-verre.");
        j.suite();
      } });
    } }
  ]
});
