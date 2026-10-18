/* Figures : les douze couches que l'architecture organise, et la place du bloc dans l'hôpital. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;

  /* ---------- Figure 1 : douze couches, à toucher ---------- */
  (function () {
    var f = R.figure("fig-couches", {
      largeur: 960, hauteur: 540, titre: "Ce que l'architecture hospitalière organise",
      essai: "<strong>Essaie</strong> : touche une case. <strong>Observe</strong> : chaque élément demande de la place, un chemin ou un réseau, qu'il faut prévoir avant de construire."
    });
    var g = A.s("g", null, f.svg), sel = -1;
    var COL = [["Les personnes", C.personnel], ["Ce qui circule", C.sale], ["Ce qui alimente", C.acc], ["Ce qui protège et fait durer", C.ok]];
    var T = [
      [0, "Les patients", "patient", "Des circulations, des locaux d'attente, de préparation, de soin, adaptés au brancard et au lit."],
      [0, "Les professionnels de santé", "personne", "Vestiaires, circulations contrôlées, postes de travail ergonomiques, locaux de repos."],
      [1, "Les flux propres et sales", "poubelle", "Des chemins qui ne se croisent pas : le propre ne rencontre pas le sale."],
      [1, "Les déchets", "poubelle", "Tri à la source, locaux de stockage, circuit qui évite les zones propres."],
      [1, "La logistique", "boite", "Réception, stockage, approvisionnement, linge : des accès et des surfaces dédiés."],
      [2, "Les équipements médicaux", "ecran", "Surface, poids, alimentation, dégagements, interfaces : un plan d'implantation."],
      [2, "Les fluides médicaux", "goutte", "Réseaux d'oxygène, d'air, de vide, prises placées là où les appareils les utilisent."],
      [2, "L'électricité et les systèmes de secours", "eclair", "Alimentation normale, de sécurité et de secours, équipements critiques identifiés."],
      [2, "La ventilation et la qualité de l'air", "air", "Gaines, centrales, pression entre locaux, volume technique au-dessus des plafonds."],
      [3, "La sécurité incendie", "feu", "Compartimentage, évacuation, signalisation, accès pompiers, matériaux adaptés."],
      [3, "La maintenance", "cle", "Accès aux filtres, tableaux, vannes, réseaux ; cheminement des pièces de rechange."],
      [3, "L'hygiène et la prévention des infections", "bouclier", "Surfaces lavables, zonage, séparation des flux, équipe d'hygiène dès la conception."]
    ];
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      A.vider(g);
      COL.forEach(function (c, k) {
        var x = 16 + k * 236;
        A.texte(g, c[0], [x + 110, 28], { taille: 17, coul: c[1], gras: 800 });
        var siens = T.filter(function (t) { return t[0] === k; });
        siens.forEach(function (t, m) {
          var i = T.indexOf(t), y = 52 + m * 120, on = sel === i;
          A.boite(g, x, y, 220, 108, { fond: on ? A.C.jeuPale : "#fff", bord: on ? C.jeu : C.trait, ep: on ? 3.5 : 2 });
          A.icone(g, t[2], [x + 36, y + 54], 36, c[1]);
          A.texte(g, t[1], [x + 132, y + 54], { taille: 17, largeur: 150, halo: false });
          A.cible(g, x, y, 220, 108, function () { sel = i; dessiner(); });
        });
      });
      zone.innerHTML = sel < 0 ? "Touche une case pour voir ce qu'elle impose au bâtiment." : "<strong>" + T[sel][1] + "</strong> : " + T[sel][3];
    }
    dessiner();
  })();

  /* ---------- Figure 2 : où placer le bloc ? ---------- */
  (function () {
    var f = R.figure("fig-place", {
      largeur: 960, hauteur: 540, titre: "Placer le bloc dans l'hôpital",
      essai: "<strong>Essaie</strong> : choisis l'emplacement A, B ou C. <strong>Observe</strong> : seul A est à la fois proche des urgences, de la réanimation et de l'imagerie, et séparé de la circulation générale."
    });
    var g = A.s("g", null, f.svg), choix = "a";
    var b = R.boutons(f.reglages), bts = {};
    ["a", "b", "c"].forEach(function (k) { bts[k] = R.bouton(b, "Emplacement " + k.toUpperCase(), function () { choix = k; dessiner(); }); });
    var zone = R.h("div", null, "", f.direct);
    var MSG = {
      a: "Accessible depuis les urgences, la réanimation et l'imagerie, et à l'écart du hall : les deux conditions du cours sont remplies.",
      b: "Au milieu du hall : très accessible, mais traversé par la circulation générale de l'hôpital. Le bloc n'est plus séparé.",
      c: "Séparé du public, mais loin des urgences, de la réanimation et de l'imagerie : chaque transfert traverse l'hôpital."
    };
    function dessiner() {
      A.vider(g);
      Object.keys(bts).forEach(function (k) { bts[k].classList.toggle("actif", k === choix); });
      var Z = A.ZONES.publique;
      A.boite(g, 20, 20, 920, 50, { fond: Z.fond, bord: Z.bord, ep: 2, rx: 8, titre: "Entrée publique et hall", taille: 17, coul: C.doux });
      A.s("rect", { x: 560, y: 80, width: 90, height: 440, fill: Z.fond }, g);
      A.texte(g, "Circulation générale", [605, 470], { taille: 15, coul: C.doux, halo: false });
      [["Urgences", 20, 90], ["Réanimation", 20, 250], ["Imagerie", 20, 410]].forEach(function (s) { A.boite(g, s[1], s[2], 220, 120, { titre: s[0], taille: 19 }); });
      [["Consultations", 690, 90], ["Administration", 690, 400]].forEach(function (s) { A.boite(g, s[1], s[2], 250, 120, { titre: s[0], taille: 19 }); });
      var P = { a: [280, 230, 230, 150], b: [565, 200, 80, 140], c: [690, 240, 250, 130] };
      ["a", "b", "c"].forEach(function (k) {
        var p = P[k], on = choix === k, bon = k === "a";
        A.boite(g, p[0], p[1], p[2], p[3], { fond: on ? (bon ? C.okPale : C.koPale) : "#fff", bord: on ? (bon ? C.ok : C.ko) : C.gris, ep: on ? 4 : 2.5, tirets: on ? null : "9 7", titre: on ? "Bloc" : k.toUpperCase(), taille: on ? 20 : 28, coul: on ? C.encre : C.gris });
      });
      var cible = P[choix], c = [cible[0] + cible[2] / 2, cible[1] + cible[3] / 2];
      [[240, 150], [240, 310], [240, 470]].forEach(function (q) { A.fleche(g, q, A.bord({ x: cible[0], y: cible[1], w: cible[2], h: cible[3] }, q, 4), { coul: choix === "a" ? C.ok : C.gris, ep: 4, tirets: choix === "a" ? null : "8 6" }); });
      if (choix === "b") A.fleche(g, [605, 72], [605, 196], { coul: C.ko, ep: 5 });
      zone.innerHTML = MSG[choix];
    }
    dessiner();
  })();
})();
