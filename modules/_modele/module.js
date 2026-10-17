/*
 * MODÈLE de module : copier le dossier modules/_modele/ en modules/<id>/, remplacer "_modele" par <id>
 * ici et dans <html data-module="..."> de chaque page, puis inscrire le module dans registre.js.
 * Voir CLAUDE.md, section « Construire un module ».
 *
 * chapitres : dans l'ordre ; sousModule = id d'un sous-module du registre.
 * niveaux : pages du jeu dans l'ordre du parcours. cours: true si cours/<id>.html existe.
 *           Chaque chapitre finit par un niveau revision: true puis un niveau boss: true.
 * cours : pages de cours, dans l'ordre du menu « Tous les concepts ».
 */
PLATEFORME.parcours("_modele", {
  titre: "Module modèle",
  sousModules: [{ id: "sm1", titre: "Sous-module 1" }],
  chapitres: [
    { id: 1, titre: "Premier chapitre", sous: "Une ligne qui dit ce que couvre le chapitre", sousModule: "sm1" }
  ],
  niveaux: [
    { id: "exemple", chapitre: 1, titre: "Niveau exemple", cours: true, pret: true }
  ],
  cours: [
    { chapitre: 1, id: "exemple", titre: "Page de cours exemple" }
  ]
});
