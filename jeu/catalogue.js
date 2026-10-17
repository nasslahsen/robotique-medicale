/*
 * Chapitres et niveaux, dans l'ordre du parcours.
 * ancien : page de l'ancienne version, proposée tant que le niveau n'est pas prêt.
 */
window.CATALOGUE = {
  chapitres: [
    { id: 0, titre: "Les bases", sous: "Angles, trigonométrie, vecteurs : tout ce qu'il faut avant le robot" },
    { id: 1, titre: "Le robot et sa description", sous: "Anatomie, liaisons, architectures, performances" },
    { id: 2, titre: "Repères et vecteurs dans l'espace", sous: "Coordonnées, produits, position d'un solide" },
    { id: 3, titre: "Orientations", sous: "Matrices de rotation et angles d'Euler" },
    { id: 4, titre: "Transformations", sous: "Changement de repère, matrices homogènes, bras 2R" }
  ],
  niveaux: [
    { id: "angles", chapitre: 0, titre: "Degrés et radians", pret: true },
    { id: "cercle", chapitre: 0, titre: "Cosinus et sinus sur le cercle", pret: true },
    { id: "triangle", chapitre: 0, titre: "Le triangle rectangle", pret: true },
    { id: "signes", chapitre: 0, titre: "Quadrants, signes et angles remarquables", pret: true },
    { id: "vecteurs", chapitre: 0, titre: "Vecteurs : composantes et somme", pret: true },
    { id: "norme", chapitre: 0, titre: "Norme et vecteur unitaire", pret: true },
    { id: "matrice-vecteur", chapitre: 0, titre: "Matrice fois vecteur", pret: true },
    { id: "boss-bases", chapitre: 0, titre: "Le bras qui vise", boss: true, pret: true },

    { id: "robot-systeme", chapitre: 1, titre: "Le robot et le système robotisé", ancien: "robot-systeme" },
    { id: "anatomie", chapitre: 1, titre: "Anatomie d'un robot", ancien: "anatomie" },
    { id: "articulations-ddl", chapitre: 1, titre: "Articulations et DDL", ancien: "articulations-ddl" },
    { id: "liaisons", chapitre: 1, titre: "Liaisons normalisées", ancien: "liaisons" },
    { id: "schemas-topologies", chapitre: 1, titre: "Schémas et topologies", ancien: "schemas-topologies" },
    { id: "architectures", chapitre: 1, titre: "Architectures et espace de travail", ancien: "architectures" },
    { id: "performances", chapitre: 1, titre: "Précision et temps de cycle", ancien: "performances" },
    { id: "robotique-medicale", chapitre: 1, titre: "Spécificités du médical", ancien: "robotique-medicale" },
    { id: "boss-robot", chapitre: 1, titre: "Fiche d'identité d'un robot", boss: true },

    { id: "repere", chapitre: 2, titre: "Repère et coordonnées", ancien: "repere" },
    { id: "produit-scalaire", chapitre: 2, titre: "Produit scalaire", ancien: "produit-scalaire" },
    { id: "produit-vectoriel", chapitre: 2, titre: "Produit vectoriel", ancien: "produit-vectoriel" },
    { id: "coordonnees-cylindriques", chapitre: 2, titre: "Coordonnées cylindriques", ancien: "coordonnees-cylindriques" },
    { id: "position-chasles", chapitre: 2, titre: "Position et relation de Chasles", ancien: "position-chasles" },
    { id: "boss-espace", chapitre: 2, titre: "Où est l'instrument ?", boss: true },

    { id: "matrice-rotation", chapitre: 3, titre: "Matrice de rotation", pret: true },
    { id: "so3", chapitre: 3, titre: "Le groupe SO(3)", ancien: "so3" },
    { id: "rotations-elementaires", chapitre: 3, titre: "Rotations élémentaires", ancien: "rotations-elementaires" },
    { id: "angles-euler", chapitre: 3, titre: "Angles d'Euler", ancien: "angles-euler" },
    { id: "boss-orientations", chapitre: 3, titre: "Décode la pince", boss: true },

    { id: "changement-repere", chapitre: 4, titre: "Changement de repère", ancien: "changement-repere" },
    { id: "matrice-homogene", chapitre: 4, titre: "Matrice homogène", ancien: "matrice-homogene" },
    { id: "composition", chapitre: 4, titre: "Composition des transformations", ancien: "composition" },
    { id: "bras-2r", chapitre: 4, titre: "Le bras 2R", ancien: "bras-2r" },
    { id: "boss-transformations", chapitre: 4, titre: "Le bras 2R atteint la cible", boss: true }
  ]
};
