/*
 * Registre central des modules du semestre.
 * Le tableau de bord, les pages d'accueil des modules, les menus et les boutons Précédent / Suivant
 * sont générés à partir d'ici et du fichier modules/<id>/module.js de chaque module actif
 * (qui donne l'ordre des pages). Pour ajouter un module : voir CLAUDE.md.
 *
 * couleur : couleur forte (accents, barres, bandeaux). clair : couleur claire (étiquettes des sous-modules).
 * texte : même teinte assombrie, pour le petit texte et les boutons sur fond blanc (contraste lisible).
 * statut : "actif" (dossier modules/<id>/ prêt) ou "a-venir" (carte visible mais pas cliquable).
 * sousModules[].statut : "a-venir" pour un sous-module sans contenu encore.
 */
window.REGISTRE = {
  semestre: "Semestre 5",
  modules: [
    {
      id: "robotique", titre: "Robotique médicale", statut: "actif",
      couleur: "#D44C47", clair: "#FFE2DD", texte: "#CB4844",
      sousModules: [
        { id: "bio", titre: "Robotique biomédicale" },
        { id: "meca", titre: "Éléments mécaniques en robotique", statut: "a-venir" }
      ]
    },
    {
      id: "biomateriaux", titre: "Biomatériaux, biomécanique et prothèses", statut: "a-venir",
      couleur: "#9065B0", clair: "#E8DEEE", texte: "#8D62AC",
      sousModules: [
        { id: "biomecanique", titre: "Biomécanique et prothèses" },
        { id: "biomateriaux", titre: "Biomatériaux et biocompatibilité" }
      ]
    },
    {
      id: "embarques", titre: "Systèmes embarqués et instrumentation biomédicale intelligente", statut: "a-venir",
      couleur: "#337EA9", clair: "#D3E5EF", texte: "#317BA5",
      sousModules: [
        { id: "embarques", titre: "Systèmes embarqués" },
        { id: "instrumentation", titre: "Instrumentation connectée et intelligence des objets connectés" }
      ]
    },
    {
      id: "informatique", titre: "Informatique médicale", statut: "a-venir",
      couleur: "#CB912F", clair: "#FDECC8", texte: "#9A6E23",
      sousModules: [
        { id: "sis", titre: "Systèmes d'informations de santé" },
        { id: "securite", titre: "Sécurité des réseaux informatiques hospitaliers" }
      ]
    },
    {
      id: "architecture", titre: "Architecture hospitalière, contraintes d'installation et exigences réglementaires", statut: "actif",
      couleur: "#448361", clair: "#DBEDDB", texte: "#448361",
      sousModules: []
    },
    {
      id: "laboratoire", titre: "Technologies de laboratoire d'analyses médicales", statut: "a-venir",
      couleur: "#D9730D", clair: "#FADEC9", texte: "#B6600A",
      sousModules: []
    },
    {
      id: "langues", titre: "Langues étrangères 5", statut: "a-venir",
      couleur: "#C14C8A", clair: "#F5E0E9", texte: "#BD4A87",
      sousModules: [
        { id: "francais", titre: "Français" },
        { id: "anglais", titre: "Anglais" }
      ]
    }
  ]
};
