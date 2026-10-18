/* Niveau : définition du système d'information, exemples, SI et système informatique, vues (S1S2, diapos 9 et 10). */
NIVEAU(SIS.rejouable({
  id: "systeme-information",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.VUES = [
      { t: "Vue métier", sous: "processus", coul: C.v, pale: C.vPale },
      { t: "Vue fonctionnelle", sous: "organisation", coul: C.acc, pale: C.accPale },
      { t: "Vue application", sous: "composants", coul: C.turq, pale: C.turqPale },
      { t: "Vue technique", sous: "infrastructure", coul: C.brun, pale: C.brunPale }
    ];
    n.plan = function (g2, k, faux, plein) {
      var v = n.VUES[k], y = 70 + k * 125, x = 300;
      A.s("polygon", { points: [[x + 40, y], [x + 360, y], [x + 320, y + 95], [x, y + 95]].map(function (p) { return p.join(","); }).join(" "), fill: faux ? C.koPale : v.pale, stroke: faux ? C.ko : v.coul, "stroke-width": 3 }, g2);
      A.texte(g2, v.t, [x + 180, y + 36], { taille: 19, gras: 800, coul: v.coul, halo: false });
      A.texte(g2, v.sous, [x + 180, y + 64], { taille: 15, coul: C.doux, halo: false, gras: 500 });
    };
    return n;
  },
  etapes: [
    { nom: "Ce que fait un SI", jouer: function (j, n) {
      j.titre("Un résultat de glycémie traverse le SI de l'hôpital. Relie chaque action au verbe de la définition du cours.");
      j.consigne("Touche une action, puis son verbe.");
      var p = SIS.paires({
        g: n.g, gauche: ["L'automate du labo mesure la glycémie", "Le résultat est enregistré sur le serveur", "Le message part du labo vers le service", "Le médecin le lit sur l'écran du service", "Le logiciel trace la courbe sur 7 jours", "Le résultat est classé, corrigé, archivé"],
        droite: ["Traitement", "Diffusion", "Production", "Transport", "Gestion", "Stockage"],
        bon: [2, 5, 3, 1, 0, 4],
        xg: 16, wg: 360, xd: 456, wd: 208, y0: 40, h: 76, pas: 92, taille: 15, tailleD: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Avant cette étape, la donnée n'existait pas encore.", "La donnée est mise en mémoire durable.", "La donnée se déplace d'un endroit à un autre.", "La donnée est mise à disposition de ceux qui en ont besoin.", "On calcule quelque chose de nouveau à partir de la donnée.", "On organise et on tient à jour la donnée dans le temps."][i]; },
        fin: function () {
          j.bravo("Production, stockage, transport, diffusion, traitement, gestion.");
          j.expliquer("<p>Le <b>système d'information</b> est l'ensemble des éléments (personnel, matériel, logiciel et organisation) participant à la production, la gestion, au traitement, au stockage, au transport et à la diffusion de l'information au sein d'une organisation, d'un établissement ou d'un groupe.</p>");
          j.suite();
        }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "SI ou système informatique ?", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 30, 60, 620, 480, { fond: C.jeuPale, bord: C.jeu, ep: 3, rx: 22 });
      A.texte(n.g, "Système d'information", [340, 92], { taille: 20, gras: 800, coul: C.encre, halo: false });
      A.boite(n.g, 330, 140, 290, 250, { fond: "#fff", bord: C.encre, tirets: "10 7", rx: 16 });
      A.texte(n.g, "Système informatique", [475, 170], { taille: 17, gras: 700, halo: false });
      A.icone(n.g, "serveur", [420, 260], 64, C.ko); A.icone(n.g, "ecran", [540, 260], 64, C.ko);
      A.texte(n.g, "en panne", [475, 340], { taille: 17, coul: C.ko, gras: 700, halo: false });
      A.icone(n.g, "personne", [120, 200], 54); A.icone(n.g, "document", [220, 200], 54);
      A.texte(n.g, "constantes sur papier", [170, 270], { taille: 15, coul: C.doux, halo: false, largeur: 220 });
      A.icone(n.g, "personne", [120, 400], 54); A.texte(n.g, "transmission orale", [190, 470], { taille: 15, coul: C.doux, halo: false });
      j.titre("Le serveur tombe en panne. Les infirmières notent les constantes sur papier et le cadre les transmet par téléphone. Le système d'information existe-t-il encore ?");
      j.choix([
        { html: "Oui : seul le système informatique est arrêté, le SI continue avec des tâches manuelles", juste: true },
        { html: "Non : sans ordinateur, il n'y a plus de système d'information", aide: "Relis la définition : le SI comprend aussi le personnel et l'organisation. L'information est-elle encore produite et transmise ?" },
        { html: "Les deux mots veulent dire la même chose", aide: "Regarde la figure : le système informatique n'est qu'une partie du SI." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le SI continue, en mode manuel.");
        j.expliquer("<p>Le <b>système informatique</b> (matériel, logiciels, réseaux) n'est qu'une partie du SI. Le cours distingue les SI <b>automatisés</b> et <b>informatisés</b> : dans un SI informatisé, certaines tâches restent manuelles.</p>");
        j.suite();
      } });
    } },
    { nom: "Des SI partout", jouer: function (j, n) {
      j.titre("Le cours cite plusieurs SI. Relie chaque sigle à son domaine.");
      var p = SIS.paires({
        g: n.g, gauche: ["SIH", "SIG", "SIR", "SIL", "WMS"], droite: ["Laboratoires", "Logistique", "Hospitalier", "Radiologie", "Géographique"],
        bon: [2, 4, 3, 0, 1],
        xg: 60, wg: 180, xd: 360, wd: 260, y0: 60, h: 80, pas: 100, taille: 22, tailleD: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["H comme...", "G comme...", "R comme...", "L comme...", "WMS : Warehouse Management System, la gestion d'un entrepôt."][i]; },
        fin: function () { j.bravo("SIH hospitalier, SIG géographique, SIR radiologie, SIL laboratoires, WMS logistique."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Les vues d'un SI", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le schéma du cours décrit le SI en couches, de la stratégie à la technologie. Range chaque élément de l'hôpital dans sa vue.");
      var cartes = [{ t: "Le module RDV et le DPI", bac: 2 }, { t: "Le processus « admettre un patient »", bac: 0 }, { t: "Les serveurs et le réseau", bac: 3 }, { t: "Qui fait quoi dans quel service", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.VUES.map(function (v) { return { t: v.t }; }),
        pos: function (i) { return { x: 14, y: 70 + i * 125, w: 260, h: 95 }; },
        bacsPos: function (k) { return { x: 300, y: 70 + k * 125, w: 360, h: 95 }; },
        dessinBac: function (g2, k, faux) { n.plan(g2, k, faux); if (k === 0) { A.texte(g2, "Stratégie", [480, 40], { taille: 16, coul: A.C.doux, gras: 700 }); A.fleche(g2, [480, 52], [480, 68], { ep: 3 }); A.texte(g2, "Technologie", [480, 585], { taille: 16, coul: A.C.doux, gras: 700 }); } },
        couleurs: function (k) { return { coul: n.VUES[k].coul, pale: n.VUES[k].pale }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Ce sont des briques logicielles : des composants.", "C'est une suite d'activités du métier de l'hôpital.", "C'est l'infrastructure physique.", "C'est l'organisation du travail."][i]; },
        fin: function () { j.bravo("Métier : processus. Fonctionnelle : organisation. Application : composants. Technique : infrastructure."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La partie informatique", jouer: function (j, n) {
      j.titre("Sur le schéma du cours, deux vues sont regroupées sous le nom « vue système informatique ». Lesquelles ?");
      j.choix([
        { html: "Vue métier et vue fonctionnelle", aide: "Processus et organisation existent même sans ordinateur. Cherche les deux vues les plus proches de la technologie." },
        { html: "Vue application et vue technique", juste: true },
        { html: "Vue fonctionnelle et vue application", aide: "L'organisation n'est pas de l'informatique. Prends les deux couches du bas." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Application (composants) + technique (infrastructure) = vue système informatique.");
        j.expliquer("<p>Le schéma ajoute deux éléments transversaux : la <b>vue information</b> (les données, qui traversent toutes les couches) et les <b>référentiels</b> (standards et normes, charte d'urbanisme).</p>");
        j.suite();
      } });
    } }
  ]
}));
