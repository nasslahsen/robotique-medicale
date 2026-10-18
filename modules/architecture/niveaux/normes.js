/* Niveau : principales normes et référentiels à connaître (diapos 63 à 65), présentés par domaine. */
NIVEAU({
  id: "normes",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.etagere = function () {
      A.vider(g); fig.chip(null);
      var D = [["Architecture / conception", "FGI Guidelines"], ["Ventilation", "ASHRAE 170, HTM 03-01"], ["Électricité", "IEC 60364-7-710"], ["Éclairage", "EN 12464-1"], ["Fluides médicaux", "ISO 7396-1"], ["Équipements électriques médicaux", "IEC 60601-1"], ["Stérilisation", "ISO 17665, 11135, 11140, 11607"]];
      D.forEach(function (d, i) {
        var y = 50 + i * 76;
        A.boite(g, 24, y, 250, 64, { fond: C.jeuPale, bord: C.jeu, rx: 10, titre: d[0], taille: 15 });
        A.boite(g, 290, y, 366, 64, { fond: "#fff", bord: C.trait, rx: 10, titre: d[1], taille: 15, gras: 600 });
      });
    };
    return n;
  },
  etapes: [
    { nom: "Une norme « bloc » ?", jouer: function (j, n) {
      n.etagere();
      j.titre("Un camarade cherche « la norme du bloc opératoire ». Que lui réponds-tu ?");
      j.choix([
        { html: "Il n'y en a pas une seule : on présente les normes par domaine", juste: true },
        { html: "C'est l'ISO 7396-1", aide: "Elle ne couvre que les gaz médicaux et le vide." },
        { html: "C'est le FGI, qui règle tout", aide: "Le FGI renvoie lui-même à d'autres normes, par exemple pour la ventilation." }
      ], { colonnes: 1, ok: function () { j.bravo("Une norme par domaine, comme sur la figure."); j.suite(); } });
    } },
    { nom: "Conception, ventilation, électricité", jouer: function (j, n) {
      j.titre("Relie chaque référentiel à son domaine.");
      var N = ["FGI Guidelines", "ASHRAE 170", "HTM 03-01", "IEC 60364-7-710"];
      var Dm = ["Installations électriques des locaux médicaux", "Ventilation des établissements de santé au Royaume-Uni", "Conception des établissements de santé", "Ventilation des établissements de santé"];
      var pa = ARCHI.paires({ g: n.g, gauche: N, droite: Dm, bon: [2, 3, 1, 0], xg: 20, wg: 230, xd: 300, wd: 360, y0: 80, h: 96, pas: 124, taille: 17, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["FGI : Facility Guidelines Institute, la conception.", "ASHRAE : l'association américaine du chauffage, de la réfrigération et de la climatisation.", "HTM : Health Technical Memorandum, au Royaume-Uni.", "IEC 60364 : les installations électriques ; partie 7-710 : les locaux médicaux."][i]; },
        fin: function () {
          j.bravo("Conception, ventilation, ventilation au Royaume-Uni, électricité des locaux médicaux.");
          j.expliquer("<p>Le FGI renvoie notamment à <b>ANSI/ASHRAE/ASHE 170</b> pour les exigences de ventilation des espaces de soins. S'y ajoutent les référentiels nationaux de construction hospitalière, les exigences locales de sécurité incendie, les recommandations de l'OMS et les recommandations professionnelles de prévention des infections, et les normes électriques nationales associées.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Lumière, gaz, appareils", jouer: function (j, n) {
      j.titre("Relie chaque norme à ce qu'elle couvre.");
      var N = ["EN 12464-1", "ISO 7396-1", "IEC 60601-1"];
      var Dm = ["Sécurité de base et performances essentielles des équipements électromédicaux", "Éclairage des lieux de travail intérieurs", "Systèmes de distribution de gaz médicaux et de vide"];
      var pa = ARCHI.paires({ g: n.g, gauche: N, droite: Dm, bon: [1, 2, 0], xg: 20, wg: 220, xd: 290, wd: 370, y0: 120, h: 110, pas: 140, taille: 18, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["EN 12464 : la lumière au poste de travail.", "ISO 7396 : les réseaux de gaz et de vide.", "IEC 60601 : les appareils électromédicaux eux-mêmes."][i]; },
        fin: function () { j.bravo("Éclairage, fluides médicaux, équipements électromédicaux."); j.suite(); } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "La stérilisation", jouer: function (j, n) {
      j.titre("Quatre séries de normes encadrent la stérilisation. Relie chacune à son objet.");
      var N = ["Série ISO 17665", "Série ISO 11135", "Série ISO 11140", "Série ISO 11607"];
      var Dm = ["Indicateurs chimiques", "Emballages des dispositifs médicaux stérilisés terminalement", "Stérilisation à la chaleur humide", "Oxyde d'éthylène"];
      var pa = ARCHI.paires({ g: n.g, gauche: N, droite: Dm, bon: [2, 3, 0, 1], xg: 20, wg: 230, xd: 300, wd: 360, y0: 80, h: 96, pas: 124, taille: 17, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function () { return "Dans l'ordre du cours : chaleur humide, oxyde d'éthylène, indicateurs chimiques, emballages."; },
        fin: function () {
          n.etagere();
          j.bravo("Chaleur humide, oxyde d'éthylène, indicateurs chimiques, emballages.");
          j.expliquer("<p>La chaleur humide, c'est la stérilisation à la vapeur d'eau, la plus courante à l'hôpital ; l'oxyde d'éthylène sert aux dispositifs qui ne supportent pas la chaleur. Les numéros restent à apprendre tels quels.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } }
  ]
});
