/* Niveau : la règle AAA (authentification, autorisation, traçabilité), sécurité offensive et dilemme de la défensive (cyber, diapo 12). */
NIVEAU(SIS.rejouable({
  id: "regle-aaa",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.AAA = [{ t: "Authentification", sous: "qui es-tu ?" }, { t: "Autorisation", sous: "qu'as-tu le droit de faire ?" }, { t: "Traçabilité", sous: "qu'as-tu fait ? (accounting)" }];
    return n;
  },
  etapes: [
    { nom: "Les trois A dans l'ordre", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Une infirmière ouvre le DPI à 7 h. Touche les trois A dans l'ordre où ils interviennent.");
      var nd = [
        { t: "Le DPI n'affiche que les patients de son service", x: 360, y: 60, w: 300, h: 120 },
        { t: "Le journal note : « Inf. Saadi a consulté le dossier 4471 à 07:12 »", x: 190, y: 400, w: 300, h: 120 },
        { t: "Elle passe son badge et tape son code", x: 20, y: 60, w: 300, h: 120 }
      ];
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [2, 0, 1], coul: C.jeu, taille: 17, erreur: j.erreur,
        aide: function (i, att, k) { return ["D'abord, le système doit savoir qui est là.", "Ensuite, il décide ce qu'elle a le droit de voir.", "Enfin, il garde la trace de ce qu'elle a fait."][k]; },
        fin: function () { j.bravo("Authentification → autorisation → traçabilité."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Chaque mesure son A", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque mesure de sécurité du DPI dans son A.");
      var cartes = [{ t: "Empreinte digitale à la connexion", bac: 0 }, { t: "Le stagiaire ne voit pas les résultats génétiques", bac: 1 }, { t: "Rapport mensuel des accès aux dossiers de personnalités", bac: 2 }, { t: "Carte professionnelle et code PIN", bac: 0 }, { t: "Le profil infirmier ne peut pas prescrire", bac: 1 }, { t: "Journal de qui a modifié une prescription", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.AAA,
        pos: A.grille(6, 2, 20, 14, 640, 80, 12), bacsPos: function (k) { return { x: 14 + k * 222, y: 310, w: 208, h: 250 }; },
        taille: 16, tailleBac: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Prouver qui l'on est.", "Limiter ce que l'on a le droit de faire.", "Garder la trace de ce qui a été fait."][b]; },
        fin: function () { j.bravo("Authentification, autorisation, traçabilité."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le dilemme de la défensive", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      for (var k = 0; k < 10; k++) { var x = 60 + (k % 5) * 120, y = 140 + Math.floor(k / 5) * 160; A.icone(n.g, k === 7 ? "ouvert" : "cadenas", [x, y], 70, k === 7 ? C.ko : C.ok); }
      A.texte(n.g, "le défenseur doit tout fermer", [340, 480], { taille: 18, gras: 700 });
      j.titre("Le défenseur doit fermer toutes les portes. Combien de portes ouvertes suffisent à l'attaquant ?");
      j.nombre({ cases: [{ attendu: 1 }], aide: function () { return "Regarde le cadenas rouge."; }, ok: function () {
        j.bravo("Une seule faille suffit à un attaquant.");
        j.expliquer("<p>C'est le <b>dilemme de la défensive</b> : impossible de faire 100 % de sécurité, et une seule faille suffit. D'où l'autre conseil du cours : savoir <b>agir comme un hacker</b> (sécurité offensive) pour trouver ses failles avant lui.</p>");
        j.suite();
      } });
    } },
    { nom: "Rigide ou ouvert ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["cadenas", "tube"], titre: "Bloquer toutes les clés USB ?", sous: "l'automate du labo en a besoin" });
      SIS.vider(n.g);
      j.titre("Le RSSI veut bloquer toutes les clés USB. Le labo répond qu'un automate ne livre ses données que par clé USB. Que montre ce conflit ?");
      j.choix([
        { html: "L'arbitrage difficile entre une sécurité rigide et l'ouverture du SI : il faut une solution qui protège sans bloquer le soin", juste: true },
        { html: "Le RSSI a toujours raison : la sécurité passe avant tout", aide: "Si le labo ne peut plus rendre ses résultats, c'est la disponibilité des soins qui en souffre." },
        { html: "Le labo a toujours raison : il faut tout ouvrir", aide: "Chaque ouverture est un risque de faille." }
      ], { colonnes: 1, ok: function () { j.bravo("Sécurité rigide ou ouverture du SI : un arbitrage, pas une évidence."); j.suite(); } });
    } }
  ]
}));
