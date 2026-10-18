/* Figure : une menace devient une attaque en passant par les vulnérabilités du bien (figure du cours, redessinée). */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-attaque", {
    largeur: 960, hauteur: 540, titre: "Menace, vulnérabilité, attaque",
    essai: "<strong>Essaie</strong> : montre l'attaque, puis touche les ouvertures et les menaces. <strong>Observe</strong> : la menace 1 bute sur un mur, la menace 2 passe par une vulnérabilité de chaque anneau."
  });
  var g = A.s("g", null, f.svg), c = [620, 280], R0 = [230, 165, 100], OUV = [200, 125, 250], voir = false, ch = "";
  function pol(r, a) { var t = a * Math.PI / 180; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]; }
  var TX = {
    m1: "Menace 1 : elle bute sur un anneau sans ouverture à cet endroit. Sans vulnérabilité exploitable, la menace reste une menace : pas d'attaque.",
    m2: "Menace 2 : elle exploite une vulnérabilité de chaque anneau : l'attaque atteint le bien. Une attaque est la concrétisation d'une menace, et nécessite l'exploitation d'une vulnérabilité.",
    v: "Vulnérabilité : faiblesse au niveau d'un bien (conception, réalisation, installation, configuration ou utilisation). Exemples : OS non patché, mot de passe faible.",
    bien: "Le bien, ou actif informationnel, que la sécurité protège."
  };
  function dessiner() {
    A.vider(g);
    R0.forEach(function (r, k) {
      var a = OUV[k], d = 8, p1 = pol(r, a + d), p2 = pol(r, a - d + 360);
      A.s("path", { d: "M" + p1[0] + " " + p1[1] + " A" + r + " " + r + " 0 1 1 " + p2[0] + " " + p2[1], fill: "none", stroke: C.ok, "stroke-width": 28, opacity: 0.3 }, g);
      var q = pol(r + 30, a);
      A.texte(g, "vulnérabilité " + (k + 1), q, { taille: 14, coul: C.ko, gras: 700 });
      A.cible(g, q[0] - 50, q[1] - 30, 100, 60, function () { ch = "v"; dessiner(); });
    });
    A.s("circle", { cx: c[0], cy: c[1], r: 46, fill: C.ko }, g); A.texte(g, "bien", c, { taille: 18, coul: "#fff", halo: false, gras: 800 });
    A.cible(g, c[0] - 46, c[1] - 46, 92, 92, function () { ch = "bien"; dessiner(); });
    if (voir) {
      var a, p2 = [[20, pol(260, 200)[1]], pol(260, 200), pol(200, 200)];
      for (a = 192; a >= 125; a -= 8) p2.push(pol(200, a));
      p2.push(pol(200, 125)); p2.push(pol(135, 125));
      for (a = 133; a <= 250; a += 8) p2.push(pol(135, a));
      p2.push(pol(135, 250)); p2.push(pol(56, 250));
      A.chemin(g, p2, { coul: "#b07d14", ep: 4, tirets: "12 6" });
      var bute = [c[0] - Math.sqrt(230 * 230 - 60 * 60) - 18, c[1] + 60];
      A.chemin(g, [[20, c[1] + 60], bute], { coul: C.encre, ep: 4, tirets: "12 6" });
      A.texte(g, "×", [bute[0] + 6, bute[1]], { taille: 34, gras: 800, coul: C.ko });
    }
    A.texte(g, "Menace 1", [80, c[1] + 36], { taille: 17, gras: 800 }); A.cible(g, 20, c[1] + 16, 130, 40, function () { ch = "m1"; dessiner(); });
    A.texte(g, "Menace 2", [80, pol(260, 200)[1] - 26], { taille: 17, gras: 800, coul: "#b07d14" }); A.cible(g, 20, pol(260, 200)[1] - 46, 130, 40, function () { ch = "m2"; dessiner(); });
    f.direct.innerHTML = ch ? TX[ch] : "Touche une menace, une vulnérabilité ou le bien.";
  }
  var b = R.boutons(f.reglages), bt = R.bouton(b, "Montrer les attaques", function () { voir = !voir; bt.classList.toggle("actif", voir); dessiner(); });
  dessiner();
})();
