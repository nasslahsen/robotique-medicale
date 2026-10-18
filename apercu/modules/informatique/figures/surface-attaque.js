/* Figure : les trois surfaces d'attaque d'un hôpital, en anneau. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-surface", {
    largeur: 960, hauteur: 520, titre: "La surface d'attaque",
    essai: "<strong>Essaie</strong> : touche chaque secteur. <strong>Observe</strong> : chaque surface a ses propres portes d'entrée, et ses propres protections."
  });
  var g = A.s("g", null, f.svg), ch = -1, c = [330, 260];
  var S = [
    { t: "Physique", a0: -90, a1: 30, coul: C.turq, d: "locaux, intrusions sur site. À l'hôpital : un local technique laissé ouvert, un badge d'accès perdu.", ex: ["Local technique ouvert", "Badge perdu"] },
    { t: "Numérique", a0: 30, a1: 150, coul: C.encre, d: "tout ce qui peut être ciblé par une cyberattaque. À l'hôpital : le portail patient sur Internet, la télémaintenance d'un éditeur.", ex: ["Portail patient", "Télémaintenance"] },
    { t: "Humaine", a0: 150, a1: 270, coul: C.acc, d: "attaques par ingénierie sociale, chantage, etc. À l'hôpital : un faux technicien qui demande un mot de passe, une clé USB trouvée sur le parking.", ex: ["Faux technicien au téléphone", "Clé USB du parking"] }
  ];
  function pol(r, a) { var t = a * Math.PI / 180; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]; }
  function dessiner() {
    A.vider(g);
    S.forEach(function (s, i) {
      var on = i === ch, r1 = on ? 210 : 195, r0 = 95, p = [pol(r1, s.a0), pol(r1, s.a1), pol(r0, s.a1), pol(r0, s.a0)];
      var d = "M" + p[0].join(" ") + " A" + r1 + " " + r1 + " 0 0 1 " + p[1].join(" ") + " L" + p[2].join(" ") + " A" + r0 + " " + r0 + " 0 0 0 " + p[3].join(" ") + " Z";
      var path = A.s("path", { d: d, fill: s.coul, opacity: on ? 1 : 0.8, stroke: "#fff", "stroke-width": 4 }, g);
      var m = pol(150, (s.a0 + s.a1) / 2);
      A.texte(g, s.t, m, { taille: 20, coul: "#fff", halo: false, gras: 800 });
      A.toucher(path, function () { ch = i; dessiner(); });
      s.ex.forEach(function (e, k) { A.boite(g, 600, 40 + i * 160 + k * 66, 330, 56, { titre: e, taille: 16, fond: on ? "#fff" : C.fond, bord: on ? s.coul : C.trait, ep: on ? 3 : 1.5, rx: 10 }); });
    });
    A.texte(g, "Hôpital", c, { taille: 20, gras: 800 });
    f.direct.innerHTML = ch >= 0 ? "<strong>Surface d'attaque " + S[ch].t.toLowerCase() + "</strong> : " + S[ch].d : "La surface d'attaque est l'ensemble des points d'entrée (matériels, logiciels, humains) vulnérables qu'un attaquant peut exploiter. Touche un secteur.";
  }
  dessiner();
})();
