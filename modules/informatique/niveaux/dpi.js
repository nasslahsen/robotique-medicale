/* Niveau : DPI, DSI / DMI, dossier communiquant, DPP, DSN (S1S2, diapo 51). */
NIVEAU(SIS.rejouable({
  id: "dpi",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    // Portées : un hôpital, plusieurs établissements, le pays
    n.portees = function (g2, etape) {
      A.s("rect", { x: 20, y: 40, width: 640, height: 520, rx: 28, fill: C.fond, stroke: etape >= 3 ? C.v : C.trait, "stroke-width": 3 }, g2);
      A.texte(g2, "DSN : portée nationale", [340, 70], { taille: 18, gras: 800, coul: etape >= 3 ? C.v : C.gris });
      A.s("rect", { x: 50, y: 100, width: 580, height: 400, rx: 22, fill: "#fff", stroke: etape >= 2 ? C.acc : C.trait, "stroke-width": 3 }, g2);
      A.texte(g2, "DPP : plusieurs acteurs, plusieurs établissements", [340, 128], { taille: 17, gras: 800, coul: etape >= 2 ? C.acc : C.gris });
      [[80, "Hôpital A"], [360, "Clinique B"]].forEach(function (h, i) {
        A.s("rect", { x: h[0], y: 160, width: 240, height: 300, rx: 16, fill: i === 0 ? C.jeuPale : "#fff", stroke: i === 0 ? C.jeu : C.trait, "stroke-width": 3 }, g2);
        A.texte(g2, h[1], [h[0] + 120, 186], { taille: 16, gras: 700, coul: C.doux });
      });
      A.boite(g2, 100, 210, 200, 110, { titre: "DPI", sous: "dont dossier de soins et dossier médical (DSI / DMI)", taille: 22, tailleSous: 13 });
      A.boite(g2, 100, 350, 90, 60, { titre: "LIS", taille: 16 });
      if (etape >= 1) A.fleche(g2, [192, 380], [250, 324], { ep: 4, coul: C.ok });
      if (etape >= 1) A.texte(g2, "dossier communiquant", [230, 432], { taille: 14, coul: C.ok, gras: 700 });
      A.boite(g2, 380, 230, 200, 100, { titre: "Dossier de la clinique", taille: 16 });
      if (etape >= 2) A.fleche(g2, [302, 265], [378, 280], { ep: 4, coul: C.acc, double: true });
      if (etape >= 3) { A.icone(g2, "personne", [120, 530], 40, C.v); A.texte(g2, "médecin de ville, vaccination...", [340, 530], { taille: 15, coul: C.v, gras: 600 }); }
    };
    return n;
  },
  etapes: [
    { nom: "Cinq mots", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours définit cinq dossiers. Relie chaque sigle à sa définition.");
      var p = A.paires({
        g: n.g, gauche: ["DPI", "DSI / DMI", "Dossier communiquant", "DPP", "DSN"],
        droite: ["Un DPI qui échange avec d'autres systèmes de l'hôpital", "Un DPI de portée nationale : profil de santé complet", "Dossier informatique des données médicales des patients, et le logiciel pour y accéder", "Dossier accessible par plusieurs acteurs, dans plusieurs établissements", "Dossier de soins et dossier médical, parties du DPI"],
        bon: [2, 4, 0, 3, 1],
        xg: 10, wg: 200, xd: 250, wd: 420, y0: 20, h: 96, pas: 114, taille: 18, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Dossier Patient Informatisé : la base de tout.", "Ce sont des morceaux du DPI.", "Il « communique » à l'intérieur de l'hôpital.", "Le P final veut dire Partagé.", "Le N veut dire national."][i]; },
        fin: function () { j.bravo("DPI, DSI / DMI, communiquant, partagé, national."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "De l'hôpital au pays", jouer: function (j, n) {
      var A = SIS;
      var etape = 0;
      A.vider(n.g); n.portees(n.g, etape);
      j.titre("Trois situations, trois dossiers. Commence : le LIS envoie le résultat d'une NFS directement dans le DPI du service. Quel dossier est-ce ?");
      function q1() {
        j.choix([{ html: "Un dossier communiquant", juste: true }, { html: "Un DPP", aide: "Tout se passe dans un seul hôpital, entre ses propres systèmes." }, { html: "Un DSN", aide: "Rien ne sort de l'hôpital." }], { colonnes: 3, ok: function () {
          etape = 1; A.vider(n.g); n.portees(n.g, etape);
          j.texte("Ensuite : le cardiologue de la clinique B ouvre le dossier constitué à l'hôpital A.");
          j.choix([{ html: "Un dossier communiquant", aide: "Ici, deux établissements différents accèdent au même dossier." }, { html: "Un DPP", juste: true }, { html: "Un DSI", aide: "Le DSI est le dossier de soins, une partie du DPI." }], { colonnes: 3, ok: function () {
            etape = 2; A.vider(n.g); n.portees(n.g, etape);
            j.texte("Enfin : le dossier rassemble aussi les passages chez le médecin de ville et les vaccinations, partout dans le pays.");
            j.choix([{ html: "Un DPP", aide: "La portée dépasse quelques établissements : elle est nationale, avec le profil de santé complet." }, { html: "Un DSN", juste: true }], { colonnes: 2, ok: function () {
              etape = 3; A.vider(n.g); n.portees(n.g, etape);
              j.bravo("Communiquant dans l'hôpital, partagé entre établissements, national pour tout le parcours.");
              j.suite();
            } });
          } });
        } });
      }
      // « Voir la réponse » résout les trois questions en chaîne : chaque choix enregistre sa bonne réponse
      q1();
    } },
    { nom: "Dossier et logiciel", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.boite(n.g, 60, 200, 560, 160, { titre: "« Le DPI ne répond plus, je n'arrive pas à me connecter. »", sous: "une infirmière, à 7 h", taille: 22, fond: SIS.C.fond, bord: SIS.C.trait });
      j.titre("Dans cette phrase, que désigne le mot DPI ?");
      j.choix([
        { html: "Le logiciel dans lequel les agents accèdent aux dossiers des patients", juste: true },
        { html: "Le dossier papier rangé dans le service", aide: "On ne se connecte pas à un dossier papier." },
        { html: "Le dossier de soins numériques national", aide: "Ce serait le DSN. L'infirmière parle de l'outil de son hôpital." }
      ], { colonnes: 1, ok: function () { j.bravo("Le terme DPI désigne aussi le logiciel."); j.suite(); } });
    } }
  ]
}));
