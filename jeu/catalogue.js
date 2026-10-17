/*
 * Chapitres et niveaux, dans l'ordre du parcours.
 * cours : le niveau a une page de cours, concepts/<id>.html (onglet Cours).
 * revision, boss : niveaux de fin de chapitre. pret : niveau jouable.
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
  ]
};
