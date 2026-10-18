/* Boss du chapitre 10 : analyse de risque du PACS, du vocabulaire à la mesure. */
NIVEAU(SIS.rejouable({
  id: "boss-risque",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Le vocabulaire du PACS", jouer: function (j, n) {
      var A = SIS;
      j.titre("Analyse de risque du PACS. Range chaque élément dans la bonne case.");
      var cartes = [{ t: "Un groupe de rançongiciel qui vise les hôpitaux", bac: 0 }, { t: "Le serveur PACS sous Windows non corrigé", bac: 1 }, { t: "Images inaccessibles pendant trois jours", bac: 2 }, { t: "Un seul serveur PACS, sans secours", bac: 3 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Menace" }, { t: "Vulnérabilité" }, { t: "Incident" }, { t: "SPOF" }],
        pos: function (i) { return { x: 10, y: 14 + i * 146, w: 340, h: 130 }; },
        bacsPos: function (k) { return { x: 380, y: 14 + k * 146, w: 290, h: 130 }; },
        taille: 16, tailleBac: 22,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["La cause potentielle, qui veut nuire.", "La faiblesse du bien.", "Ce qui arrive quand l'attaque réussit : la disponibilité est compromise.", "Un maillon unique dont la panne arrête tout."][i]; },
        fin: function () { j.bravo("Menace, vulnérabilité, incident, SPOF."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Chiffrer avant, après", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 40, 120, 280, 200, { titre: "Avant", sous: "probable (3), impact majeur (4)", taille: 26, fond: C.koPale, bord: C.ko });
      A.boite(n.g, 360, 120, 280, 200, { titre: "Après", sous: "second serveur répliqué, sauvegardes hors ligne : impact modéré (2)", taille: 26, fond: C.okPale, bord: C.ok });
      A.texte(n.g, "notes de 1 à 4 : exemple ajouté", [340, 380], { taille: 14, coul: C.doux });
      j.titre("Calcule le risque avant, puis après les mesures (la probabilité ne change pas).");
      j.nombre({ cases: [{ attendu: 12 }, { attendu: 6 }], ligne: true, avant: "R_{\\text{avant}},\\ R_{\\text{après}} :", aide: function (k) { return k === 0 ? "3 × 4." : "3 × 2."; }, ok: function () { j.bravo("De 12 à 6 : on a réduit l'impact, en supprimant le SPOF."); j.suite(); } });
    } },
    { nom: "Où couper ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["ecran", "pirate"], titre: "Droits d'administrateur obtenus", sous: "sur un poste de radiologie" });
      SIS.vider(n.g);
      j.titre("L'attaquant vient d'obtenir des droits d'administrateur sur un poste de radiologie. Quelle sera sa prochaine phase, celle qu'il faut empêcher maintenant ?");
      j.choix([{ html: "Lateral movement, vers le serveur PACS", juste: true }, { html: "Reconnaissance", aide: "Elle est déjà passée : il est dans le réseau, avec des droits." }, { html: "Intrusion", aide: "Il est déjà entré." }], { colonnes: 1, ok: function () { j.bravo("Après l'élévation de privilèges vient le déplacement latéral : segmenter le réseau le freine."); j.suite(); } });
    } },
    { nom: "L'incident", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["serveur", "alerte"], titre: "Le PACS tombe" });
      j.titre("Malgré tout, le PACS tombe. En plus de la prise en charge retardée, quels risques le cours associe-t-il à un incident ?");
      j.choix([{ html: "Financiers, juridiques et de réputation", juste: true }, { html: "Seulement techniques", aide: "Le cours en cite trois, qui dépassent la technique." }, { html: "Aucun si les images reviennent", aide: "Coût de remise en état, obligations légales, confiance des patients : tout cela reste." }], { colonnes: 1, ok: function () { j.bravo("Financiers, juridiques, réputation."); j.suite(); } });
    } }
  ]
}));
