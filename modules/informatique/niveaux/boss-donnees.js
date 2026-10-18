/* Boss du chapitre 4 : préparer un export pour le comité médical, du fichier CSV aux anomalies. */
NIVEAU(SIS.rejouable({
  id: "boss-donnees",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.WS = [80, 110, 120, 140, 180];
    n.LIGNES = [
      ["ID", "Sexe", "Poids (kg)", "TA syst.", "Sortie"],
      ["A12", "F", "64", "128", "02/04/2026"],
      ["A13", "M", "−5", "135", "03/04/2026"],
      ["A14", "H", "81", "", "03/04/2026"],
      ["A15", "F", "70", "122", "2026-04-05"],
      ["A16", "M", "77", "0", "06/04/2026"]
    ];
    n.ANOM = [[2, 2], [3, 1], [3, 3], [4, 4], [5, 3]];
    n.ZONES = [];
    for (var i = 1; i < n.LIGNES.length; i++) for (var k = 0; k < 5; k++) {
      var x = 20 + n.WS.slice(0, k).reduce(function (a, b) { return a + b; }, 0);
      n.ZONES.push({ i: i, k: k, x: x, y: 80 + i * 70, w: n.WS[k], h: 70, bon: n.ANOM.some(function (q) { return q[0] === i && q[1] === k; }) });
    }
    n.table = function (g2, etat) {
      A.tableau(g2, 20, 80, n.WS, 70, n.LIGNES, { taille: 19, tailleTete: 16, style: function (i, k) {
        var z = n.ZONES.findIndex(function (q) { return q.i === i && q.k === k; });
        if (etat && z >= 0 && etat.trouve[z]) return { fond: C.koPale, bord: C.ko, ep: 3, gras: 700 };
        return null;
      } });
      A.texte(g2, "Exemple ajouté. Le reste du fichier code le sexe en F / M et les dates en JJ/MM/AAAA.", [340, 540], { taille: 15, coul: C.doux, largeur: 600 });
    };
    return n;
  },
  etapes: [
    { nom: "Le fichier reçu", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 40, 160, 600, 80, { titre: "A13;M;72,5;135;03/04/2026", taille: 28, mono: true, fond: C.fond, bord: C.trait });
      A.texte(n.g, "séparateur ;   virgule décimale", [340, 280], { taille: 17, coul: C.doux });
      j.titre("Le comité veut une étude des patients hypertendus. L'export CSV arrive. L'outil d'analyse coupe à chaque virgule. Combien de colonnes lit-il dans cette ligne, au lieu des 5 attendues ?");
      j.nombre({ cases: [{ attendu: 2 }], apres: "\\text{ colonnes}", aide: function () { return "Compte les virgules : chacune ajoute une colonne."; }, ok: function () {
        j.bravo("Deux colonnes : il faut régler le séparateur sur « ; » avant toute analyse.");
        j.suite();
      } });
    } },
    { nom: "Cinq anomalies", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le fichier est relu avec le bon séparateur. Touche les cinq cases qui posent problème.");
      var r = A.reperer({ g: n.g, zones: n.ZONES, dessiner: n.table, erreur: j.erreur,
        aide: function () { return "Cette case est correcte. Cherche une valeur impossible, absente, codée autrement ou au mauvais format."; },
        fin: function () { j.bravo("−5 kg, « H », la tension vide, la date au format inversé, la tension à 0."); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Les nommer", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque anomalie dans sa dimension.");
      var cartes = [{ t: "Poids = −5 kg", bac: 1 }, { t: "Sexe = « H » au lieu de « M »", bac: 2 }, { t: "TA systolique vide", bac: 0 }, { t: "Sortie = « 2026-04-05 »", bac: 3 }, { t: "TA systolique = 0", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Complétude" }, { t: "Exactitude" }, { t: "Cohérence" }, { t: "Validité (format)" }],
        pos: function (i) { return { x: 10, y: 14 + i * 116, w: 300, h: 100 }; },
        bacsPos: function (k) { return { x: 340, y: 14 + k * 146, w: 330, h: 128 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Un poids peut-il être négatif ?", "Le même concept est codé autrement que dans le reste du fichier.", "La valeur manque.", "Le format des dates du fichier n'est pas respecté.", "Une tension à 0 chez un patient vivant est-elle réaliste ?"][i]; },
        fin: function () { j.bravo("Exactitude, cohérence, complétude, validité, exactitude."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La décision du comité", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "alerte"], titre: "Un export avec cinq anomalies", sous: "le comité décide demain" });
      SIS.vider(n.g);
      j.titre("Le comité doit décider demain d'un nouveau protocole pour l'hypertension. Que fais-tu de ce fichier ?");
      j.choix([
        { html: "Je supprime les lignes douteuses et je présente les moyennes sans rien dire", aide: "Supprimer en silence change l'étude : le comité doit savoir sur quoi il décide." },
        { html: "Je signale les anomalies, je les fais corriger à la source dans le DPI, puis je relance l'export", juste: true },
        { html: "Je présente le fichier tel quel : l'entrepôt fait foi", aide: "Une tension à 0 et un poids négatif dans une étude sur la tension : le doute s'impose." }
      ], { colonnes: 1, ok: function () { j.bravo("Doute scientifique, puis correction à la source : l'information de santé impacte la décision médicale."); j.suite(); } });
    } }
  ]
}));
