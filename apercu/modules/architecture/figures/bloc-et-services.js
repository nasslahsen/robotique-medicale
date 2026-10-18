/* Figure : trois implantations de SSPI, réanimation et imagerie autour du bloc ; comparer les transferts. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C, Z = A.ZONES;
  var f = R.figure("fig-services", {
    largeur: 960, hauteur: 540, titre: "Le bloc et ses voisins",
    essai: "<strong>Essaie</strong> : compare les trois projets. <strong>Observe</strong> : les défauts que le cours demande de limiter (distance, obstacles, ascenseurs multiples, croisements avec le public) s'affichent en rouge. Projets d'exemple ajoutés."
  });
  var g = A.s("g", null, f.svg), choix = "bon";
  var b = R.boutons(f.reglages), bts = {};
  [["bon", "Projet 1"], ["loin", "Projet 2"], ["public", "Projet 3"]].forEach(function (o) { bts[o[0]] = R.bouton(b, o[1], function () { choix = o[0]; dessiner(); }); });
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    Object.keys(bts).forEach(function (k) { bts[k].classList.toggle("actif", k === choix); });
    var bloc = { x: 340, y: 180, w: 280, h: 180 };
    A.boite(g, bloc.x, bloc.y, bloc.w, bloc.h, { fond: Z.restreinte.fond, bord: Z.restreinte.bord, ep: 3, titre: "Bloc opératoire", taille: 22 });
    var L = choix === "bon" ? { sspi: { x: 660, y: 200, w: 160, h: 140 }, rea: { x: 660, y: 390, w: 200, h: 110 }, img: { x: 100, y: 200, w: 200, h: 140 } }
      : choix === "loin" ? { sspi: { x: 660, y: 200, w: 160, h: 140 }, rea: { x: 760, y: 20, w: 180, h: 100 }, img: { x: 20, y: 420, w: 200, h: 100 } }
      : { sspi: { x: 380, y: 400, w: 200, h: 110 }, rea: { x: 760, y: 400, w: 180, h: 110 }, img: { x: 100, y: 200, w: 200, h: 140 } };
    A.boite(g, L.sspi.x, L.sspi.y, L.sspi.w, L.sspi.h, { titre: "SSPI", fond: Z.semi.fond, bord: Z.semi.bord, taille: 20 });
    A.boite(g, L.rea.x, L.rea.y, L.rea.w, L.rea.h, { titre: "Réanimation", taille: 20 });
    A.boite(g, L.img.x, L.img.y, L.img.w, L.img.h, { titre: "Imagerie", fond: C.vPale, bord: C.v, taille: 20 });
    var defauts = [];
    if (choix === "public") {
      A.boite(g, 620, 360, 120, 170, { fond: Z.publique.fond, bord: Z.publique.bord, titre: "Hall public", taille: 15 });
      defauts.push("le trajet SSPI → réanimation traverse le hall public");
    }
    if (choix === "loin") {
      A.boite(g, 660, 20, 80, 100, { fond: "#fff", bord: C.gris, titre: "Ascenseur", taille: 13 });
      A.boite(g, 240, 440, 80, 80, { fond: "#fff", bord: C.gris, titre: "Ascenseur", taille: 13 });
      defauts.push("la réanimation est à un autre étage : distance et ascenseur", "l'imagerie aussi : second ascenseur sur le parcours d'un polytraumatisé");
    }
    function lien(a, bb, mauvais) { A.relier(g, a, bb, { coul: mauvais ? C.ko : C.ok, ep: 5, tirets: mauvais ? "10 7" : null }); }
    lien(L.img, bloc, choix === "loin");
    lien(bloc, L.sspi, false);
    lien(L.sspi, L.rea, choix !== "bon");
    zone.innerHTML = defauts.length ? "Défauts : " + defauts.join(" ; ") + "." : "Projet 1 : SSPI à proximité immédiate du bloc, réanimation et imagerie voisines, aucun croisement avec le public. Les transferts bloc → SSPI → réanimation et réanimation → bloc sont courts.";
  }
  dessiner();
})();
