/* Révision du chapitre 7 : scénario, spécificités de l'hôpital, panorama, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-menace",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Le correctif attendu", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["serveur", "horloge"], titre: "Un correctif urgent, un vendredi", sous: "le serveur du DPI ne s'arrête jamais" });
      j.titre("Un correctif urgent de Windows sort un vendredi. Le serveur du DPI ne peut pas être redémarré avant dix jours. Quelle particularité de l'hôpital est en cause ?");
      j.choix([{ html: "Il fonctionne 24 h / 24 : les fenêtres de maintenance sont trop serrées", juste: true }, { html: "Les données de santé sont recherchées", aide: "C'est vrai, mais ça n'explique pas le retard du correctif." }, { html: "Chaque service achète ses références", aide: "Le problème ici est le moment du redémarrage." }], { colonnes: 1, ok: function () { j.bravo("Correctifs retardés, redémarrages difficiles à planifier."); j.suite(); } });
    } },
    { nom: "Le laboratoire bloqué", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["tube", "alerte"], titre: "Le LIS ne transmet plus" });
      j.titre("Pendant une attaque, le LIS ne transmet plus. Que fait le laboratoire, d'après l'analyse du scénario ?");
      j.choix([{ html: "Résultats sur papier, et il contacte la DSI", juste: true }, { html: "Il arrête toutes les analyses jusqu'au retour du réseau", aide: "Les urgences restent ouvertes : elles ont besoin des résultats." }, { html: "Il paie la rançon", aide: "Ce n'est pas au laboratoire de décider, et le cours ne le propose pas." }], { colonnes: 1, ok: function () { j.bravo("Mode dégradé papier, et alerte de l'informatique."); j.suite(); } });
    } },
    { nom: "Quel incident ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "horloge"], titre: "Des semaines de retour au papier" });
      j.titre("Quel incident du cours a d'abord été le « premier cas français très médiatisé », avec des semaines de retour au papier ?");
      j.choix([{ html: "CHU de Rouen, 2019", juste: true }, { html: "NHS, 2017", aide: "Le NHS est au Royaume-Uni." }, { html: "CNSS, 2025", aide: "La CNSS est au Maroc, et c'était une fuite de données." }], { colonnes: 1, ok: function () { j.bravo("CHU de Rouen, novembre 2019."); j.suite(); } });
    } },
    { nom: "Le télémainteneur", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["cle", "reseau"], titre: "Un télémainteneur relié à 40 hôpitaux" });
      j.titre("Un prestataire de télémaintenance accède à distance à 40 hôpitaux. Il se fait pirater. Quelle phrase du cours décrit ce risque ?");
      j.choix([{ html: "La surface d'attaque dépasse largement le périmètre de l'établissement", juste: true }, { html: "La disponibilité prime sur la confidentialité", aide: "Il s'agit ici de tiers connectés." }, { html: "Les DM tournent sur des systèmes qui vieillissent", aide: "Le problème est le tiers connecté, pas l'âge de l'appareil." }], { colonnes: 1, ok: function () { j.bravo("Nombreux tiers connectés : la surface d'attaque déborde l'hôpital."); j.suite(); } });
    } }
  ]
}));
