/* Révision du chapitre 6 : équipements, sécurité, normes, méthode, erreurs, dans des situations nouvelles. */
NIVEAU({
  id: "revision-conception",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.carte = function (titre, lignes, ic) {
      A.vider(g); fig.chip(null);
      A.boite(g, 60, 80, 560, 440, { fond: "#fff", bord: C.trait, ep: 2 });
      A.icone(g, ic, [340, 170], 80, C.jeu);
      A.texte(g, titre, [340, 260], { taille: 20, gras: 800, largeur: 500 });
      lignes.forEach(function (l, i) { A.texte(g, l, [340, 320 + i * 40], { taille: 16, coul: C.doux, largeur: 500 }); });
    };
    return n;
  },
  etapes: [
    { nom: "Quelle norme ?", jouer: function (j, n) {
      n.carte("Un appareil d'anesthésie neuf", ["Il faut vérifier sa sécurité de base", "et ses performances essentielles."], "ecran");
      j.titre("Quelle norme vise la sécurité de base et les performances essentielles de cet appareil électromédical ?");
      j.choix([
        { html: "IEC 60601-1", juste: true },
        { html: "IEC 60364-7-710", aide: "Celle-ci vise l'installation électrique du local, pas l'appareil." },
        { html: "EN 12464-1", aide: "Celle-ci vise l'éclairage." }
      ], { colonnes: 3, ok: function () { j.bravo("IEC 60601-1 pour l'appareil, IEC 60364-7-710 pour l'installation du local."); j.suite(); } });
    } },
    { nom: "Quelle étape ?", jouer: function (j, n) {
      n.carte("Une équipe a déjà choisi les matériaux des murs", ["mais n'a pas encore défini les locaux", "ni analysé les flux."], "boite");
      j.titre("Quel est le problème de méthode ?");
      j.choix([
        { html: "Elle saute le programme fonctionnel et l'analyse des flux, qui précèdent l'architecture", juste: true },
        { html: "Aucun : les matériaux d'abord, le reste suivra", aide: "Les matériaux appartiennent à l'étape 5, après besoins, programme, flux et zonage." },
        { html: "Elle aurait dû commencer par la validation", aide: "La validation est la dernière étape." }
      ], { colonnes: 1, ok: function () { j.bravo("Besoins, programme, flux, zonage, puis architecture."); j.suite(); } });
    } },
    { nom: "Sécurité du personnel", jouer: function (j, n) {
      n.carte("Une infirmière de bloc soulève chaque jour des boîtes lourdes", ["et porte des patients sur la table."], "personne");
      j.titre("Quel risque professionnel du cours est en cause ?");
      j.choix([
        { html: "La manutention manuelle", juste: true },
        { html: "Les rayonnements ionisants", aide: "Il n'y a pas d'imagerie dans cette situation." },
        { html: "Les agents biologiques", aide: "Le problème ici est le poids porté." }
      ], { colonnes: 3, ok: function () { j.bravo("Manutention manuelle : l'ergonomie et le stockage bien placé la réduisent."); j.suite(); } });
    } },
    { nom: "Valider avant d'ouvrir", jouer: function (j, n) {
      n.carte("Les gaz médicaux du nouveau bloc", ["Que vérifie-t-on avant ouverture ?"], "goutte");
      j.titre("Trouve l'intrus parmi les vérifications des gaz médicaux avant ouverture.");
      j.choix([
        { html: "Pression", aide: "Elle est dans la liste du cours." },
        { html: "Qualité et identification", aide: "Elles sont dans la liste du cours." },
        { html: "Rendu des couleurs", juste: true },
        { html: "Alarmes et étanchéité", aide: "Elles sont dans la liste du cours." }
      ], { colonnes: 2, ok: function () { j.bravo("Le rendu des couleurs concerne l'éclairage opératoire."); j.suite(); } });
    } },
    { nom: "Maintenance", jouer: function (j, n) {
      n.carte("Un équipement impossible à réparer sans démolir une cloison", [], "cle");
      j.titre("Complète la phrase du cours : « Un équipement qui ne peut pas être correctement maintenu est un équipement… »");
      j.choix([
        { html: "mal intégré architecturalement", juste: true },
        { html: "de mauvaise qualité", aide: "Le cours ne met pas en cause l'appareil, mais la façon dont le bâtiment l'accueille." },
        { html: "à remplacer immédiatement", aide: "Le problème est l'architecture autour de lui." }
      ], { colonnes: 1, ok: function () { j.bravo("Mal intégré architecturalement."); j.suite(); } });
    } }
  ]
});
