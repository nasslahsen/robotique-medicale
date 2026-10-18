/* Niveau : maturité des processus (5 niveaux) et cartographie des processus (S1S2, diapos 15, 17, 18). */
NIVEAU(SIS.rejouable({
  id: "maturite-cartographie",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.NIV = [["Initial", "processus aléatoire"], ["Géré", "planifié, exécuté et évalué"], ["Défini", "organisé et maîtrisé"], ["Quantifié", "mesuré et contrôlé"], ["Optimisé", "stable et flexible"]];
    n.marche = function (k) { return { x: 14 + k * 118, y: 530 - k * 62, w: 180, h: 58 }; };
    n.MACRO = [
      { t: "Management / pilotage", sous: "macroprocessus de management stratégique" },
      { t: "Opérationnels / métier", sous: "en lien direct avec le patient" },
      { t: "Supports", sous: "au service des autres" }
    ];
    return n;
  },
  etapes: [
    { nom: "L'escalier de la maturité", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Le laboratoire étalonne ses automates. Place chaque situation sur sa marche de maturité.");
      j.consigne("Touche une situation, puis une marche.");
      var cartes = [
        { t: "Mesure mensuelle de la dérive des automates, comparée à une cible", bac: 3 },
        { t: "Chaque technicien étalonne à sa façon, quand il y pense", bac: 0 },
        { t: "Les mesures servent à améliorer ; le processus s'adapte vite à un nouvel automate", bac: 4 },
        { t: "Étalonnage planifié chaque lundi, réalisé puis vérifié", bac: 1 },
        { t: "Une procédure écrite, la même pour tout le labo, organise l'étalonnage", bac: 2 }
      ];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.NIV.map(function (x) { return { t: x[0] }; }),
        pos: function (i) { return i < 3 ? { x: 10 + i * 222, y: 8, w: 214, h: 112 } : { x: 10 + (i - 3) * 222, y: 128, w: 214, h: 112 }; },
        bacsPos: n.marche, taille: 15,
        dessinBac: function (g2, k, faux) {
          var r = n.marche(k), st = A.BACS[k];
          A.boite(g2, r.x, r.y, r.w, r.h, { fond: faux ? C.koPale : st.pale, bord: faux ? C.ko : st.coul, ep: 3, rx: 10, titre: (k + 1) + "  " + n.NIV[k][0], sous: n.NIV[k][1], taille: 17, coul: st.coul, tailleSous: 12.5 });
        },
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["On mesure et on contrôle avec des chiffres : c'est l'avant-dernière marche.", "Rien n'est prévu, chacun fait au hasard : la première marche.", "Le processus est déjà mesuré ; il devient en plus stable et flexible : tout en haut.", "C'est planifié, fait et évalué, mais pas encore commun à tout le labo.", "Le processus est organisé et maîtrisé par une règle commune, pas encore mesuré."][i] || ("Marche " + (b + 1)); },
        fin: function () {
          j.bravo("Initial, géré, défini, quantifié, optimisé.");
          j.expliquer("<p>Les cinq niveaux de <b>maturité des processus</b> du cours : 1 initial (aléatoire), 2 géré (planifié, exécuté et évalué), 3 défini (organisé et maîtrisé), 4 quantifié (mesuré et contrôlé), 5 optimisé (stable et flexible).</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Trois macroprocessus", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("La cartographie des processus d'un hôpital tient en trois macroprocessus. Range chaque processus.");
      var cartes = [{ t: "Politique qualité et sécurité", bac: 0 }, { t: "Décision thérapeutique", bac: 1 }, { t: "Diagnostic de biologie", bac: 2 }, { t: "Maintenance", bac: 2 }, { t: "Accueil", bac: 1 }, { t: "Politique de recherche", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.MACRO,
        pos: function (i) { return { x: 10, y: 20 + i * 96, w: 220, h: 82 }; },
        bacsPos: function (k) { return { x: 252, y: 20 + k * 196, w: 418, h: 176 }; },
        tailleBac: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return b === 0 ? "C'est une politique : la direction fixe un cap pour tout l'hôpital." : b === 1 ? "C'est une étape vécue directement par le patient dans son parcours de soins." : "Le patient ne la voit pas directement : elle sert les étapes du parcours de soins."; },
        fin: function () {
          j.bravo("Management : les politiques. Opérationnels : le parcours du patient. Supports : biologie, maintenance...");
          j.expliquer("<p>La <b>cartographie des processus</b> représente tous les processus liés entre eux par des liens logiques d'informations, de matière ou de production. Elle donne une vue d'ensemble de l'activité et se compose souvent de trois macroprocessus : management / pilotage, opérationnel / métier, support.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le parcours opérationnel", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Les macroprocessus opérationnels suivent le patient. Touche-les dans l'ordre du cours.");
      var noms = ["Surveillance", "Décision thérapeutique", "Accueil", "Mise en œuvre du traitement", "Démarche diagnostique"];
      var pl = [[470, 400], [40, 400], [40, 120], [255, 400], [255, 120]];
      var nd = noms.map(function (t, i) { return { t: t, x: pl[i][0], y: pl[i][1], w: 180, h: 90 }; });
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [2, 4, 1, 3, 0], coul: C.jeu, taille: 17,
        fond: function (g2) { A.icone(g2, "patient", [560, 165], 70, C.doux); A.texte(g2, "le patient", [560, 220], { taille: 15, coul: C.doux }); },
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "Le patient arrive : par où passe-t-il d'abord ?" : "Pense au médecin : d'abord chercher, puis décider, puis traiter, puis surveiller."; },
        fin: function () { j.bravo("Accueil → démarche diagnostique → décision thérapeutique → mise en œuvre du traitement → surveillance."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "La biologie, un support ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["tube", "patient"], titre: "Le diagnostic de biologie", sous: "rangé parmi les processus support" });
      j.titre("Dans la cartographie du cours, le diagnostic de biologie est un processus support. Pourquoi ?");
      j.choix([
        { html: "Parce qu'il est moins important que les autres", aide: "Le cours ne classe pas par importance. Regarde le lien avec le patient." },
        { html: "Parce qu'il sert la démarche diagnostique sans être lui-même une étape du parcours vécue par le patient", juste: true },
        { html: "Parce qu'il relève de la direction générale", aide: "La direction relève du management. La biologie fournit un service aux soignants." }
      ], { colonnes: 1, ok: function () { j.bravo("Les supports rendent service aux processus opérationnels."); j.suite(); } });
    } }
  ]
}));
