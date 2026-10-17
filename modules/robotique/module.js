/*
 * Module Robotique médicale : ordre des pages. Couleurs, sous-modules et statut : registre.js.
 * chapitres[].sousModule : sous-module du registre auquel le chapitre appartient.
 * niveaux : pages du jeu, dans l'ordre (cours : true quand cours/<id>.html existe ;
 *           revision, boss : niveaux de fin de chapitre ; pret : niveau jouable).
 * cours : pages de cours, dans l'ordre du menu « Tous les concepts ».
 */
PLATEFORME.parcours("robotique", {
  chapitres: [
    { id: 0, titre: "Les bases", sous: "Angles, trigonométrie, vecteurs : tout ce qu'il faut avant le robot", sousModule: "bio" },
    { id: 1, titre: "Le robot et sa description", sous: "Anatomie, liaisons, architectures, performances", sousModule: "bio" },
    { id: 2, titre: "Repères et vecteurs dans l'espace", sous: "Coordonnées, produits, position d'un solide", sousModule: "bio" },
    { id: 3, titre: "Orientations", sous: "Matrices de rotation et angles d'Euler", sousModule: "bio" },
    { id: 4, titre: "Transformations", sous: "Changement de repère, matrices homogènes, bras 2R", sousModule: "bio" }
  ],
  niveaux: [
    { id: "angles", chapitre: 0, titre: "Degrés et radians", pret: true },
    { id: "cercle", chapitre: 0, titre: "Cosinus et sinus sur le cercle", pret: true },
    { id: "triangle", chapitre: 0, titre: "Le triangle rectangle", pret: true },
    { id: "signes", chapitre: 0, titre: "Quadrants, signes et angles remarquables", pret: true },
    { id: "vecteurs", chapitre: 0, titre: "Vecteurs : composantes et somme", pret: true },
    { id: "norme", chapitre: 0, titre: "Norme et vecteur unitaire", pret: true },
    { id: "matrice-vecteur", chapitre: 0, titre: "Matrice fois vecteur", pret: true },
    { id: "produit-matrices", chapitre: 0, titre: "Matrice fois matrice, transposée", pret: true },
    { id: "revision-bases", chapitre: 0, titre: "Révision : les bases", revision: true, pret: true },
    { id: "boss-bases", chapitre: 0, titre: "Le bras qui vise", boss: true, pret: true },

    { id: "robot-systeme", chapitre: 1, titre: "Le robot et le système robotisé", cours: true, pret: true },
    { id: "anatomie", chapitre: 1, titre: "Anatomie d'un robot", cours: true, pret: true },
    { id: "articulations-ddl", chapitre: 1, titre: "Articulations et DDL", cours: true, pret: true },
    { id: "liaisons", chapitre: 1, titre: "Liaisons normalisées", cours: true, pret: true },
    { id: "schemas-topologies", chapitre: 1, titre: "Schémas et topologies", cours: true, pret: true },
    { id: "architectures", chapitre: 1, titre: "Architectures et espace de travail", cours: true, pret: true },
    { id: "performances", chapitre: 1, titre: "Précision et temps de cycle", cours: true, pret: true },
    { id: "robotique-medicale", chapitre: 1, titre: "Spécificités du médical", cours: true, pret: true },
    { id: "revision-robot", chapitre: 1, titre: "Révision : le robot", revision: true, pret: true },
    { id: "boss-robot", chapitre: 1, titre: "Fiche d'identité d'un robot", boss: true, pret: true },

    { id: "repere", chapitre: 2, titre: "Repère et coordonnées", cours: true, pret: true },
    { id: "produit-scalaire", chapitre: 2, titre: "Produit scalaire", cours: true, pret: true },
    { id: "produit-vectoriel", chapitre: 2, titre: "Produit vectoriel", cours: true, pret: true },
    { id: "coordonnees-cylindriques", chapitre: 2, titre: "Coordonnées cylindriques", cours: true, pret: true },
    { id: "position-chasles", chapitre: 2, titre: "Position et relation de Chasles", cours: true, pret: true },
    { id: "revision-espace", chapitre: 2, titre: "Révision : l'espace", revision: true, pret: true },
    { id: "boss-espace", chapitre: 2, titre: "Où est l'instrument ?", boss: true, pret: true },

    { id: "matrice-rotation", chapitre: 3, titre: "Matrice de rotation", cours: true, pret: true },
    { id: "so3", chapitre: 3, titre: "Le groupe SO(3)", cours: true, pret: true },
    { id: "rotations-elementaires", chapitre: 3, titre: "Rotations élémentaires", cours: true, pret: true },
    { id: "angles-euler", chapitre: 3, titre: "Angles d'Euler", cours: true, pret: true },
    { id: "revision-orientations", chapitre: 3, titre: "Révision : les orientations", revision: true, pret: true },
    { id: "boss-orientations", chapitre: 3, titre: "Décode la pince", boss: true, pret: true },

    { id: "changement-repere", chapitre: 4, titre: "Changement de repère", cours: true, pret: true },
    { id: "matrice-homogene", chapitre: 4, titre: "Matrice homogène", cours: true, pret: true },
    { id: "composition", chapitre: 4, titre: "Composition des transformations", cours: true, pret: true },
    { id: "bras-2r", chapitre: 4, titre: "Le bras 2R", cours: true, pret: true },
    { id: "revision-transformations", chapitre: 4, titre: "Révision : les transformations", revision: true, pret: true },
    { id: "boss-transformations", chapitre: 4, titre: "Le bras 2R atteint la cible", boss: true, pret: true }
  ],
  cours: [
    { chapitre: 1, id: "robot-systeme", titre: "Le robot et le système robotisé" },
    { chapitre: 1, id: "anatomie", titre: "Anatomie d'un robot" },
    { chapitre: 1, id: "articulations-ddl", titre: "Articulations, DDL et configuration articulaire" },
    { chapitre: 1, id: "liaisons", titre: "DDL d'un solide et liaisons normalisées" },
    { chapitre: 1, id: "schemas-topologies", titre: "Schémas cinématiques et topologies" },
    { chapitre: 1, id: "architectures", titre: "Architectures et espace de travail" },
    { chapitre: 1, id: "performances", titre: "Précision, répétabilité et temps de cycle" },
    { chapitre: 1, id: "robotique-medicale", titre: "Spécificités de la robotique médicale" },
    { chapitre: 2, id: "repere", titre: "Repère et coordonnées cartésiennes" },
    { chapitre: 2, id: "produit-scalaire", titre: "Produit scalaire" },
    { chapitre: 2, id: "produit-vectoriel", titre: "Produit vectoriel" },
    { chapitre: 2, id: "coordonnees-cylindriques", titre: "Coordonnées polaires et cylindriques" },
    { chapitre: 2, id: "position-chasles", titre: "Position d'un solide et relation de Chasles" },
    { chapitre: 3, id: "matrice-rotation", titre: "Matrice de rotation" },
    { chapitre: 3, id: "so3", titre: "Propriétés : le groupe SO(3)" },
    { chapitre: 3, id: "rotations-elementaires", titre: "Rotations élémentaires" },
    { chapitre: 3, id: "angles-euler", titre: "Angles d'Euler" },
    { chapitre: 4, id: "changement-repere", titre: "Changement de repère" },
    { chapitre: 4, id: "matrice-homogene", titre: "Matrice homogène" },
    { chapitre: 4, id: "composition", titre: "Composition des transformations" },
    { chapitre: 4, id: "bras-2r", titre: "Modèle géométrique direct du bras 2R" }
  ]
});
