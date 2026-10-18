/*
 * Module Architecture hospitalière : ordre des pages. Couleurs et statut : registre.js.
 * Le registre ne donne pas de sous-module pour ce module : les chapitres s'affichent directement.
 * Source : cours « Architecture hospitalière et contraintes d'installation d'un bloc opératoire ».
 * niveaux : pages du jeu, dans l'ordre (cours : true quand cours/<id>.html existe ;
 *           revision, boss : niveaux de fin de chapitre ; pret : niveau jouable).
 * cours : pages de cours, dans l'ordre du menu « Tous les concepts ».
 */
PLATEFORME.parcours("architecture", {
  chapitres: [
    { id: 1, titre: "L'hôpital et son bloc", sous: "Ce que l'architecture organise, les huit familles de contraintes, le bloc opératoire" },
    { id: 2, titre: "Zones et flux", sous: "Gradation des zones, cinq flux, séparation propre / sale, déchets, SSPI, réanimation, imagerie" },
    { id: 3, titre: "La salle d'opération", sous: "Surface et volume, sols, murs, plafond, portes, bloc hybride, ergonomie et acoustique" },
    { id: 4, titre: "L'air du bloc", sous: "Objectifs de la ventilation, pression, renouvellement, distribution, filtration" },
    { id: 5, titre: "Énergie, lumière, fluides et réseaux", sous: "Électricité, éclairage, fluides médicaux, réseaux, plafond technique" },
    { id: 6, titre: "Équipements, sécurité et méthode", sous: "Intégration biomédicale, sécurité, normes, méthode en dix étapes, erreurs à éviter" }
  ],
  niveaux: [
    { id: "architecture-hospitaliere", chapitre: 1, titre: "Ce que l'architecture organise", cours: true, pret: true },
    { id: "familles-contraintes", chapitre: 1, titre: "Les huit familles de contraintes", cours: true, pret: true },
    { id: "bloc-definition", chapitre: 1, titre: "Le bloc, une unité à part", cours: true, pret: true },
    { id: "revision-hopital", chapitre: 1, titre: "Révision : l'hôpital et son bloc", revision: true, pret: true },
    { id: "boss-hopital", chapitre: 1, titre: "Le bloc mal placé", boss: true, pret: true },

    { id: "zonage", chapitre: 2, titre: "Trois zones, du public au restreint", cours: true, pret: true },
    { id: "flux", chapitre: 2, titre: "Les cinq flux du bloc", cours: true, pret: true },
    { id: "separation-flux", chapitre: 2, titre: "Séparer le propre et le sale", cours: true, pret: true },
    { id: "dechets-stockage", chapitre: 2, titre: "Déchets et stockage", cours: true, pret: true },
    { id: "bloc-et-services", chapitre: 2, titre: "SSPI, réanimation, imagerie", cours: true, pret: true },
    { id: "revision-flux", chapitre: 2, titre: "Révision : zones et flux", revision: true, pret: true },
    { id: "boss-flux", chapitre: 2, titre: "Trace les circuits", boss: true, pret: true },

    { id: "salle-dimensions", chapitre: 3, titre: "Surface, dimensions et volume", cours: true, pret: true },
    { id: "surfaces", chapitre: 3, titre: "Sols, murs, plafond, portes", cours: true, pret: true },
    { id: "bloc-hybride", chapitre: 3, titre: "Bloc hybride et radioprotection", cours: true, pret: true },
    { id: "ergonomie-acoustique", chapitre: 3, titre: "Ergonomie et acoustique", cours: true, pret: true },
    { id: "revision-salle", chapitre: 3, titre: "Révision : la salle d'opération", revision: true, pret: true },
    { id: "boss-salle", chapitre: 3, titre: "Une salle pour l'angiographie", boss: true, pret: true },

    { id: "ventilation-objectifs", chapitre: 4, titre: "Pourquoi ventiler le bloc", cours: true, pret: true },
    { id: "pression-cascade", chapitre: 4, titre: "Pression positive et cascade", cours: true, pret: true },
    { id: "renouvellement-air", chapitre: 4, titre: "Renouvellement et distribution de l'air", cours: true, pret: true },
    { id: "filtration-ucv", chapitre: 4, titre: "Filtration et flux unidirectionnel", cours: true, pret: true },
    { id: "revision-air", chapitre: 4, titre: "Révision : l'air du bloc", revision: true, pret: true },
    { id: "boss-air", chapitre: 4, titre: "La salle qui aspire l'air du couloir", boss: true, pret: true },

    { id: "electricite", chapitre: 5, titre: "Électricité et sécurité électrique", cours: true, pret: true },
    { id: "eclairage", chapitre: 5, titre: "Éclairage et scialytique", cours: true, pret: true },
    { id: "fluides-medicaux", chapitre: 5, titre: "Fluides médicaux, vide, gaz anesthésiques", cours: true, pret: true },
    { id: "reseaux-plafond", chapitre: 5, titre: "Réseaux et plafond technique", cours: true, pret: true },
    { id: "revision-technique", chapitre: 5, titre: "Révision : énergie et fluides", revision: true, pret: true },
    { id: "boss-technique", chapitre: 5, titre: "Coupure de courant pendant l'intervention", boss: true, pret: true },

    { id: "integration-biomedicale", chapitre: 6, titre: "Intégrer les équipements biomédicaux", cours: true, pret: true },
    { id: "securite", chapitre: 6, titre: "Incendie, sécurité du patient et du personnel", cours: true, pret: true },
    { id: "normes", chapitre: 6, titre: "Normes et référentiels par domaine", cours: true, pret: true },
    { id: "methode-conception", chapitre: 6, titre: "Concevoir un bloc en dix étapes", cours: true, pret: true },
    { id: "ingenieur-erreurs", chapitre: 6, titre: "L'ingénieur biomédical et les erreurs à éviter", cours: true, pret: true },
    { id: "revision-conception", chapitre: 6, titre: "Révision : équipements, sécurité, méthode", revision: true, pret: true },
    { id: "boss-conception", chapitre: 6, titre: "Le dossier du nouveau bloc", boss: true, pret: true }
  ],
  cours: [
    { chapitre: 1, id: "architecture-hospitaliere", titre: "Ce que l'architecture hospitalière organise" },
    { chapitre: 1, id: "familles-contraintes", titre: "Les huit familles de contraintes et la synthèse" },
    { chapitre: 1, id: "bloc-definition", titre: "Le bloc opératoire : définition" },
    { chapitre: 2, id: "zonage", titre: "Gradation des zones" },
    { chapitre: 2, id: "flux", titre: "Maîtrise des flux" },
    { chapitre: 2, id: "separation-flux", titre: "Séparation des flux" },
    { chapitre: 2, id: "dechets-stockage", titre: "Gestion des déchets et local de stockage" },
    { chapitre: 2, id: "bloc-et-services", titre: "SSPI, réanimation et imagerie" },
    { chapitre: 3, id: "salle-dimensions", titre: "Salle d'opération : surface, dimensions, volume" },
    { chapitre: 3, id: "surfaces", titre: "Sols, murs, plafond et portes" },
    { chapitre: 3, id: "bloc-hybride", titre: "Bloc hybride et protection radiologique" },
    { chapitre: 3, id: "ergonomie-acoustique", titre: "Ergonomie et acoustique" },
    { chapitre: 4, id: "ventilation-objectifs", titre: "Objectifs de la ventilation, température et humidité" },
    { chapitre: 4, id: "pression-cascade", titre: "Pression positive et cascade de pression" },
    { chapitre: 4, id: "renouvellement-air", titre: "Renouvellement et distribution de l'air" },
    { chapitre: 4, id: "filtration-ucv", titre: "Filtration de l'air et flux unidirectionnel" },
    { chapitre: 5, id: "electricite", titre: "Électricité et sécurité électrique" },
    { chapitre: 5, id: "eclairage", titre: "Éclairage et scialytique" },
    { chapitre: 5, id: "fluides-medicaux", titre: "Fluides médicaux, vide et évacuation des gaz" },
    { chapitre: 5, id: "reseaux-plafond", titre: "Réseaux informatiques et plafond technique" },
    { chapitre: 6, id: "integration-biomedicale", titre: "Intégration biomédicale et maintenance" },
    { chapitre: 6, id: "securite", titre: "Incendie, sécurité du patient et du personnel" },
    { chapitre: 6, id: "normes", titre: "Normes et référentiels à connaître" },
    { chapitre: 6, id: "methode-conception", titre: "Méthode de conception et validation" },
    { chapitre: 6, id: "ingenieur-erreurs", titre: "Rôle de l'ingénieur biomédical et erreurs fréquentes" }
  ]
});
