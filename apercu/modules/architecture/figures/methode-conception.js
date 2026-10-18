/* Figure : la méthode en dix étapes, parcourue pas à pas ; la dernière ouvre la validation avant ouverture. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-methode", {
    largeur: 960, hauteur: 540, titre: "Concevoir un bloc en dix étapes",
    essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : chaque étape s'appuie sur les précédentes ; l'architecture n'arrive qu'à la cinquième."
  });
  var g = A.s("g", null, f.svg);
  var E = [["Analyse des besoins", "nombre de salles, spécialités, nombre d'interventions, horaires, types de chirurgie"], ["Programme fonctionnel", "définir tous les locaux : salles d'opération, SSPI, stérilisation, locaux du personnel"], ["Analyse des flux", "patients, personnel, propre, sale, déchets, matériel"], ["Zonage", "public, semi-restreint, restreint"], ["Architecture", "surfaces, dimensions, portes, circulations, matériaux"], ["CVC", "débit, filtration, pression, température, humidité, renouvellement"], ["Électricité", "puissance, alimentation normale, secours, UPS, sécurité"], ["Fluides médicaux", "O₂, air, vide, évacuation des gaz"], ["Implantation biomédicale", "définir les équipements et leurs contraintes"], ["Validation", "avant mise en service : CVC, électricité, gaz médicaux, biomédical, hygiène, sécurité, validation fonctionnelle"]];
  var zone = R.h("div", null, "", f.direct);
  function dessiner(k) {
    A.vider(g);
    E.forEach(function (e, i) {
      var col = i < 5 ? 0 : 1, row = i < 5 ? i : 9 - i, x = 40 + col * 460, y = 20 + row * 102, fait = i < k, cour = i === k - 1;
      A.boite(g, x, y, 420, 84, { fond: cour ? A.C.jeu : fait ? A.C.jeuPale : "#fff", bord: fait ? C.jeu : C.trait, ep: cour ? 3.5 : 2, titre: (i + 1) + ". " + e[0], taille: 18, coul: cour ? "#fff" : fait ? C.encre : C.gris });
      if (i < 9) {
        var a = i < 4 ? [x + 210, y + 86] : i === 4 ? [x + 422, y + 42] : [x + 210, y - 2];
        var b2 = i < 4 ? [x + 210, y + 100] : i === 4 ? [x + 458, y + 42] : [x + 210, y - 16];
        A.fleche(g, a, b2, { coul: i < k - 1 ? C.jeu : C.trait, ep: 4 });
      }
    });
    zone.innerHTML = k ? "<strong>" + k + ". " + E[k - 1][0] + "</strong> : " + E[k - 1][1] + "." : "Avance pour parcourir les dix étapes.";
  }
  var e = R.etapes(f.reglages, 10, [""].concat(E.map(function (x) { return x[0]; })), dessiner);
  e.aller(1);
})();
