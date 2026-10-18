/* Niveau : les huit familles de contraintes (diapo 8) et le tableau de synthèse (diapo 66). */
NIVEAU({
  id: "familles-contraintes",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "familles", vus: 0, choisi: -1, g: g, pl: { P: function (v) { return v; } } };
    n.FAM = [
      ["Fonctionnel", "Organisation des activités"], ["Architectural", "Surfaces, volumes, circulations"],
      ["Hygiène", "Séparation propre / sale"], ["Technique", "Électricité, CVC, fluides médicaux"],
      ["Biomédical", "Installation et maintenance des équipements"], ["Sécurité", "Incendie, évacuation, risques techniques"],
      ["Logistique", "Approvisionnement, déchets, linge"], ["Réglementaire", "Normes et prescriptions applicables"]
    ];
    // Lignes du tableau de synthèse utilisées au niveau
    n.SYN = [["Ventilation", "Filtration + pression + renouvellement", "Infection"], ["Électricité", "Continuité + sécurité", "Arrêt équipement"],
      ["Eau", "Qualité + continuité", "Risque sanitaire"], ["Incendie", "Compartimentage + évacuation", "Catastrophe"],
      ["Maintenance", "Accessibilité technique", "Indisponibilité"], ["Ergonomie", "Circulation adaptée", "Fatigue / accidents"]];
    n.ERR = [["Architecture", "Organisation fonctionnelle", "Dysfonctionnement"], ["Flux", "Séparation propre / sale", "Contamination"],
      ["Gaz médicaux", "Visibilité adaptée", "Risque patient"], ["Sols / murs", "Surfaces lavables", "Contamination"]];
    function ligne(y, h, cols, o) {
      o = o || {};
      var xs = o.xs || [24, 200, 470, 656];
      cols.forEach(function (t, k) {
        A.boite(g, xs[k], y, xs[k + 1] - xs[k] - 8, h, { fond: o.fonds ? o.fonds[k] : "#fff", bord: o.bords ? o.bords[k] : C.trait, ep: 2, rx: 10, titre: t, taille: o.taille || 16, gras: k === 0 ? 700 : 500, coul: o.coul ? o.coul[k] : C.encre });
      });
    }
    n.dessin = function () {
      if (n.mode === "vide") return;
      A.vider(g);
      if (n.mode === "familles") {
        fig.chip(null);
        A.texte(g, "Domaine", [120, 52], { taille: 15, coul: C.doux });
        A.texte(g, "Principales contraintes", [440, 52], { taille: 15, coul: C.doux });
        n.FAM.forEach(function (f, i) {
          var y = 72 + i * 64, on = n.vus > i || n.mode2, sel = n.choisi === i;
          A.boite(g, 24, y, 192, 54, { fond: sel ? C.jeu : C.jeuPale, bord: C.jeu, ep: sel ? 3.5 : 2, rx: 10, titre: f[0], taille: 17, coul: sel ? "#fff" : C.encre });
          A.boite(g, 228, y, 428, 54, { fond: on ? "#fff" : C.fond, bord: on ? C.jeu : C.trait, ep: 2, rx: 10, titre: on ? f[1] : "?", taille: 16, gras: 500, coul: on ? C.encre : C.gris, tirets: on ? null : "7 6" });
          A.cible(g, 24, y, 632, 54, function () { if (n.surFam) n.surFam(i); });
        });
      } else if (n.mode === "synthese") {
        fig.chip(null);
        A.texte(g, "Domaine", [110, 70], { taille: 15, coul: C.doux }); A.texte(g, "Exigence principale", [333, 70], { taille: 15, coul: C.doux }); A.texte(g, "Risque si mauvaise conception", [560, 70], { taille: 15, coul: C.doux, largeur: 190 });
        n.SYN.forEach(function (r, i) {
          var on = n.synOk;
          ligne(100 + i * 78, 66, [r[0], r[1], on ? r[2] : "?"], { xs: [24, 200, 470, 656], fonds: ["#fff", "#fff", on ? C.koPale : C.fond], bords: [C.trait, C.trait, on ? C.ko : C.trait], coul: [C.encre, C.encre, on ? C.ko : C.gris] });
        });
      } else {
        fig.chip(null);
        A.texte(g, "Fiche d'un étudiant", [340, 90], { taille: 20, gras: 700 });
        A.texte(g, "Domaine", [110, 140], { taille: 15, coul: C.doux }); A.texte(g, "Exigence principale", [333, 140], { taille: 15, coul: C.doux }); A.texte(g, "Risque", [560, 140], { taille: 15, coul: C.doux });
        n.ERR.forEach(function (r, i) {
          var y = 170 + i * 92, faux = n.erreurVue === i, corrige = n.corrige && i === 2;
          ligne(y, 76, [r[0], corrige ? "Disponibilité + sécurité" : r[1], r[2]], { fonds: faux || corrige ? [C.koPale, corrige ? C.okPale : C.koPale, C.koPale] : null, bords: corrige ? [C.ok, C.ok, C.ok] : faux ? [C.ko, C.ko, C.ko] : null });
          A.cible(g, 24, y, 632, 76, function () { if (n.surLigne) n.surLigne(i); });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Huit familles", jouer: function (j, n) {
      n.mode = "vide"; n.dessin();
      j.titre("Le cours classe les contraintes d'un hôpital en huit familles. Relie chaque domaine à ses principales contraintes.");
      j.consigne("Touche un domaine à gauche, puis ses contraintes à droite.");
      var melange = [3, 6, 0, 5, 2, 7, 1, 4];
      var pa = ARCHI.paires({ g: n.g, gauche: n.FAM.map(function (f) { return f[0]; }), droite: melange.map(function (i) { return n.FAM[i][1]; }),
        bon: n.FAM.map(function (f, i) { return melange.indexOf(i); }), xg: 20, wg: 176, xd: 250, wd: 410, y0: 66, h: 56, pas: 66, taille: 17, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Fonctionnel : comment les activités s'organisent.", "Architectural : ce qui se mesure en mètres et en mètres cubes.", "Hygiène : ce qui doit rester séparé.", "Technique : les réseaux qui alimentent le bloc.", "Biomédical : les équipements, de l'installation à la maintenance.", "Sécurité : les dangers et la façon d'en sortir.", "Logistique : ce qui arrive et ce qui repart.", "Réglementaire : ce qui est imposé par les textes."][i]; },
        fin: function () {
          n.mode = "familles"; n.vus = 8; n.dessin();
          j.bravo("Les huit familles sont en place.");
          j.expliquer("<p>Ces huit familles se recoupent : une porte touche l'architectural (passage du brancard), l'hygiène (nettoyage) et la ventilation (pression). Concevoir, c'est les tenir toutes en même temps.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Quelle famille ?", jouer: function (j, n) {
      n.mode = "familles"; n.vus = 8; n.dessin();
      var S = [
        { t: "Le groupe électrogène n'a jamais été raccordé aux prises de la salle.", i: 3 },
        { t: "Le bras plafonnier ne peut pas être démonté : aucun accès n'a été prévu pour le technicien.", i: 4 },
        { t: "Le chariot de linge et les cartons de consommables arrivent par la même porte que le patient, sans organisation.", i: 6 }
      ], k = 0;
      j.titre("Trois problèmes rencontrés sur un chantier. Touche, sur la figure, la famille de contraintes concernée.");
      var p = j.zone("consigne", "");
      function poser() { p.innerHTML = "<b>Problème " + (k + 1) + " / 3</b> : " + S[k].t; }
      poser();
      n.surFam = function (i) {
        if (k >= S.length) return;
        if (i !== S[k].i) { n.choisi = i; n.dessin(); j.erreur("Pas cette famille. Lis la colonne de droite : laquelle parle de " + (k === 0 ? "l'électricité ?" : k === 1 ? "la maintenance des équipements ?" : "l'approvisionnement et du linge ?")); return; }
        n.choisi = i; n.dessin(); k++;
        if (k < S.length) { j.info("Oui. Problème suivant."); poser(); return; }
        n.surFam = null;
        j.bravo("Technique, biomédical, logistique.");
        j.expliquer("<p>Un même chantier mélange les familles : l'électricité relève de la technique, l'accès aux équipements du biomédical, l'approvisionnement et le linge de la logistique. Le troisième problème touche aussi l'hygiène, puisque les flux se croisent.</p>");
        j.suite();
      };
      j.reponse(function () { while (n.surFam && k < S.length) n.surFam(S[k].i); });
    } },
    { nom: "Le risque", jouer: function (j, n) {
      n.mode = "vide"; n.surFam = null; n.dessin();
      j.titre("Prédis le risque si chaque domaine est mal conçu. Relie le domaine et son exigence au risque du tableau de synthèse.");
      var melange = [4, 0, 5, 2, 1, 3];
      var pa = ARCHI.paires({ g: n.g, gauche: n.SYN.map(function (r) { return r[0] + " : " + r[1].toLowerCase(); }), droite: melange.map(function (i) { return n.SYN[i][2]; }),
        bon: n.SYN.map(function (r, i) { return melange.indexOf(i); }), xg: 20, wg: 380, xd: 460, wd: 200, y0: 76, h: 66, pas: 82, taille: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return "Lis l'exigence : que se passe-t-il pour le patient ou le bloc si elle manque ? " + ["Un air mal filtré transporte des germes.", "Sans continuité, l'appareil s'arrête.", "Une eau de mauvaise qualité menace la santé.", "Un feu non compartimenté s'étend.", "Un équipement inaccessible n'est plus réparé.", "Une mauvaise circulation fatigue et fait trébucher."][i]; },
        fin: function () {
          n.mode = "synthese"; n.synOk = true; n.dessin();
          j.bravo("Chaque exigence protège contre un risque précis.");
          j.expliquer("<p>Le tableau de synthèse compte quatorze domaines : architecture, flux, ventilation, électricité, gaz médicaux, eau, éclairage, sols et murs, déchets, incendie, biomédical, informatique, maintenance, ergonomie. Pour chacun : une exigence principale et le risque si elle est mal conçue. L'eau n'apparaît que là : qualité + continuité, sinon risque sanitaire.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "erreur"; n.erreurVue = -1; n.dessin();
      j.titre("Un étudiant a recopié quatre lignes du tableau de synthèse. Touche la ligne fausse.");
      n.surLigne = function (i) {
        if (n.corrige) return;
        if (i !== 2) { j.erreur("Cette ligne est juste. Cherche une exigence qui ne correspond pas à son domaine."); return; }
        n.erreurVue = 2; n.dessin(); n.surLigne = null;
        j.consigne("Quelle est la bonne exigence principale pour les gaz médicaux ?");
        j.choix([
          { html: "Disponibilité + sécurité", juste: true },
          { html: "Surfaces lavables", aide: "C'est l'exigence des sols et des murs." },
          { html: "Compartimentage + évacuation", aide: "C'est l'exigence de l'incendie." }
        ], { colonnes: 1, ok: function () {
          n.corrige = true; n.dessin();
          j.bravo("Gaz médicaux : disponibilité + sécurité, sinon risque patient.");
          j.expliquer("<p>« Visibilité adaptée » est l'exigence de l'éclairage (risque : erreur opératoire). Le gaz doit être là quand on en a besoin, et le bon gaz à la bonne prise.</p>");
          j.suite();
        } });
      };
      j.reponse(function () { if (n.surLigne) n.surLigne(2); });
    } }
  ]
});
