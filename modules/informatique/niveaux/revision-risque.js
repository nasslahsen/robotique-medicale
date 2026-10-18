/* Révision du chapitre 10 : menace, vulnérabilité, surface, kill chain, risque, SPOF, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-risque",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Le micrologiciel ancien", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["moniteur", "horloge"], titre: "Un micrologiciel de 2019" });
      SIS.vider(n.g);
      j.titre("Le micrologiciel d'un échographe n'a pas été mis à jour depuis 2019. Menace, vulnérabilité ou incident ?");
      j.choix([{ html: "Menace", aide: "Rien ne cherche à nuire ici : c'est un défaut du bien." }, { html: "Vulnérabilité", juste: true }, { html: "Incident", aide: "Rien ne s'est encore produit." }], { colonnes: 3, ok: function () { j.bravo("Une faiblesse du bien : vulnérabilité."); j.suite(); } });
    } },
    { nom: "La clé du parking", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["personne", "alerte"], titre: "Une clé USB trouvée sur le parking" });
      j.titre("Un agent trouve une clé USB sur le parking et la branche par curiosité sur son poste. Quelle surface d'attaque a été exploitée ?");
      j.choix([{ html: "Humaine", juste: true }, { html: "Physique", aide: "Personne n'est entré dans les locaux : c'est l'agent qui a fait entrer la clé." }, { html: "Numérique seulement", aide: "Le point d'entrée, c'est la curiosité de l'agent." }], { colonnes: 3, ok: function () { j.bravo("La curiosité humaine : ingénierie sociale."); j.suite(); } });
    } },
    { nom: "D'une machine à l'autre", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["serveur", "serveur", "pirate"], titre: "Du labo au PACS, puis au DPI" });
      j.titre("Avec les identifiants volés d'un administrateur, l'attaquant passe du serveur du labo au PACS, puis au DPI. Quelle phase de la kill chain ?");
      j.choix([{ html: "Lateral movement", juste: true }, { html: "Reconnaissance", aide: "Il est déjà dans le réseau." }, { html: "Exfiltration", aide: "Il ne sort pas encore de données : il se déplace." }], { colonnes: 3, ok: function () { j.bravo("Déplacement latéral, avec des identifiants compromis."); j.suite(); } });
    } },
    { nom: "Deux risques", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["alerte", "alerte"], titre: "Risque A : improbable, majeur", sous: "Risque B : probable, modéré" });
      j.titre("Risque A : improbable (2), impact majeur (4). Risque B : probable (3), impact modéré (2). Lequel est le plus élevé ?");
      j.choix([{ html: "A : 8 contre 6", juste: true }, { html: "B : il est plus probable", aide: "Calcule les produits : 2 × 4 et 3 × 2." }, { html: "Égaux", aide: "8 et 6 ne sont pas égaux." }], { colonnes: 1, ok: function () { j.bravo("A = 8, B = 6."); j.suite(); } });
    } },
    { nom: "Le lien unique", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["reseau", "alerte"], titre: "Une seule fibre entre deux sites" });
      j.titre("Les deux sites du CHU ne sont reliés que par une seule fibre optique. Si elle est coupée, plus aucun échange. Qu'est-ce que c'est, et à quel niveau ?");
      j.choix([{ html: "Un SPOF matériel (hardware)", juste: true }, { html: "Un SPOF humain", aide: "Aucune personne n'est en cause ici." }, { html: "Ce n'est pas un SPOF", aide: "Sa panne arrête tous les échanges : c'est la définition." }], { colonnes: 1, ok: function () { j.bravo("SPOF matériel : il faut un second lien."); j.suite(); } });
    } }
  ]
}));
