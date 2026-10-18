/* Boss du chapitre 7 : le moniteur qui envoie des données vers une adresse codée en dur (cas Contec CMS8000 du cours). */
NIVEAU(SIS.rejouable({
  id: "boss-menace",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.reseau = function (g2, etat) {
      A.boite(g2, 20, 30, 640, 330, { fond: C.fond, bord: C.trait, rx: 20 });
      A.texte(g2, "Réseau de la réanimation", [340, 56], { taille: 16, coul: C.doux, gras: 700 });
      [0, 1, 2].forEach(function (k) { A.icone(g2, "moniteur", [100 + k * 140, 150], 70); A.texte(g2, "Moniteur " + (k + 1), [100 + k * 140, 205], { taille: 14 }); A.s("line", { x1: 100 + k * 140, y1: 225, x2: 100 + k * 140, y2: 270, stroke: C.encre, "stroke-width": 3 }, g2); });
      A.s("line", { x1: 100, y1: 270, x2: 560, y2: 270, stroke: C.encre, "stroke-width": 3 }, g2);
      A.icone(g2, "serveur", [560, 150], 70); A.texte(g2, "Centrale de surveillance", [560, 205], { taille: 14, largeur: 150 }); A.s("line", { x1: 560, y1: 225, x2: 560, y2: 270, stroke: C.encre, "stroke-width": 3 }, g2);
      A.icone(g2, "reseau", [340, 310], 50);
      A.s("line", { x1: 340, y1: 335, x2: 340, y2: 420, stroke: C.encre, "stroke-width": 3 }, g2);
      A.boite(g2, 230, 420, 220, 70, { titre: "Internet", taille: 20 });
      if (etat >= 1) A.chemin(g2, [[240, 160], [300, 160], [300, 380], [430, 380], [430, 520], [520, 520]], { coul: C.ko, ep: 4, tirets: "10 7" });
      A.boite(g2, 520, 495, 150, 60, { titre: "Adresse IP codée en dur", taille: 14, fond: C.koPale, bord: C.ko });
      if (etat >= 2) { A.s("line", { x1: 280, y1: 330, x2: 320, y2: 300, stroke: C.ok, "stroke-width": 10, "stroke-linecap": "round" }, g2); A.texte(g2, "coupé", [356, 312], { taille: 16, coul: C.ok, gras: 800 }); }
    };
    return n;
  },
  etapes: [
    { nom: "Le moniteur bavard", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.reseau(n.g, 0);
      j.titre("Un avis de la CISA signale que des moniteurs patients envoient des données vers une adresse IP codée en dur. Ton hôpital en a trois en réanimation. Quel est le problème ?");
      j.choix([
        { html: "Une porte dérobée (backdoor) cachée dans le micrologiciel, qui fait sortir des données de patients", juste: true },
        { html: "Une simple panne d'écran", aide: "Les moniteurs fonctionnent ; c'est ce qu'ils envoient qui pose problème." },
        { html: "Un manque de papier dans l'imprimante de la centrale", aide: "Relis l'avis : une adresse IP codée en dur, dans le logiciel de l'appareil." }
      ], { colonnes: 1, ok: function () { A.vider(n.g); n.reseau(n.g, 1); j.bravo("Une backdoor dans le micrologiciel : les données partent vers l'extérieur."); j.suite(); } });
    } },
    { nom: "Couper la fuite", jouer: function (j, n) {
      var A = SIS;
      j.titre("Les moniteurs doivent continuer à surveiller les patients. Quelle première mesure prends-tu, comme le biomédical du scénario ?");
      j.choix([
        { html: "Débrancher les moniteurs des patients", aide: "La disponibilité du monitorage est vitale : on ne coupe pas la surveillance." },
        { html: "Isoler le réseau des moniteurs d'Internet, en gardant la liaison avec la centrale", juste: true },
        { html: "Installer un antivirus sur les moniteurs", aide: "On n'installe rien sur un DM à sa guise : responsabilité du fabricant." }
      ], { colonnes: 1, ok: function () { A.vider(n.g); n.reseau(n.g, 2); j.bravo("La surveillance continue, la fuite est coupée."); j.suite(); } });
    } },
    { nom: "Les prochains achats", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["moniteur", "document"], titre: "Prochain appel d'offres de moniteurs" });
      j.titre("Quel enseignement le cours tire-t-il de ce cas pour les prochains achats de DM ?");
      j.choix([
        { html: "Exiger la nomenclature logicielle (SBOM) et des exigences de cybersécurité dans le cahier des charges", juste: true },
        { html: "N'acheter que des DM non connectés", aide: "Le cours ne dit pas de renoncer aux DM connectés." },
        { html: "Choisir le moins cher", aide: "Le prix ne dit rien de ce qui tourne dans le micrologiciel." }
      ], { colonnes: 1, ok: function () { j.bravo("SBOM et exigences d'achat."); j.suite(); } });
    } },
    { nom: "Pourquoi ici plus qu'ailleurs ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque particularité de l'hôpital selon qu'elle aggrave, ou non, ce cas de moniteur.");
      var cartes = [{ t: "Les DM durent 10 à 15 ans", bac: 0 }, { t: "Les données de santé sont recherchées et non modifiables", bac: 0 }, { t: "On ne patche pas un DM à sa guise", bac: 0 }, { t: "La cafétéria accepte la carte bancaire", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Aggrave le cas" }, { t: "Sans rapport" }],
        pos: A.grille(4, 2, 20, 30, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return i === 3 ? "Quel lien avec un moniteur qui envoie des données ?" : "Cette particularité rend la faille plus longue à corriger ou la fuite plus grave."; },
        fin: function () { j.bravo("Longévité, données irrévocables, dépendance au fabricant : tout aggrave."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
