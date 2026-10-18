/* Niveau : les six dimensions de la qualité des données d'un SIH (S1S2, diapo 49). */
NIVEAU(SIS.rejouable({
  id: "qualite-donnees",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.WS = [70, 130, 80, 120, 230];
    n.LIGNES = [
      ["ID", "Sexe", "Âge", "Glycémie", "Date d'entrée"],
      ["P01", "F", "34", "1,02", "12/03/2026"],
      ["P02", "Masculin", "51", "0,95", "13/03/2026"],
      ["P03", "M", "250", "1,10", "13/03/2026"],
      ["P04", "F", "47", "", "14/03/2026"],
      ["P05", "M", "62", "1,30", "date inconnue"],
      ["P01", "F", "34", "1,02", "12/03/2026"]
    ];
    // anomalies : [ligne, colonne]
    n.ANOM = [[2, 1], [3, 2], [4, 3], [5, 4], [6, 0]];
    n.table = function (g2, etat) {
      var cases = A.tableau(g2, 20, 60, n.WS, 62, n.LIGNES, { taille: 18, tailleTete: 16, style: function (i, k) {
        var z = n.ZONES ? n.ZONES.findIndex(function (q) { return q.i === i && q.k === k; }) : -1;
        if (etat && z >= 0 && etat.trouve[z]) return { fond: C.koPale, bord: C.ko, ep: 3, gras: 700 };
        if (etat && z >= 0 && etat.faux === z) return { fond: C.fond, bord: C.gris };
        return i > 0 && k === 0 ? { mono: true } : null;
      } });
      n.CASES = cases;
      return cases;
    };
    n.ZONES = [];
    for (var i = 1; i < n.LIGNES.length; i++) for (var k = 0; k < 5; k++) {
      var x = 20 + n.WS.slice(0, k).reduce(function (a, b) { return a + b; }, 0);
      n.ZONES.push({ i: i, k: k, x: x, y: 60 + i * 62, w: n.WS[k], h: 62, bon: n.ANOM.some(function (q) { return q[0] === i && q[1] === k; }) });
    }
    return n;
  },
  etapes: [
    { nom: "Cinq anomalies", jouer: function (j, n) {
      var A = SIS;
      j.titre("Extrait d'un export du SIH avant une étude sur le diabète. Touche les cinq cases qui posent problème.");
      j.consigne("Pour une ligne en double, touche son identifiant.");
      var r = A.reperer({ g: n.g, zones: n.ZONES, dessiner: function (g2, e) { n.table(g2, e); A.texte(g2, "Exemple ajouté", [340, 540], { taille: 14, coul: A.C.doux }); },
        erreur: j.erreur, aide: function () { return "Cette case est correcte. Cherche une valeur absente, impossible, codée autrement, au mauvais format, ou une ligne répétée."; },
        fin: function () { j.bravo("Masculin, 250, la glycémie vide, « date inconnue », la ligne P01 répétée."); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Six dimensions", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque anomalie dans la dimension de la qualité qu'elle met en défaut.");
      var DIM = [["Complétude", "les valeurs sont-elles présentes ?"], ["Exactitude", "sont-elles réalistes ?"], ["Cohérence", "même codage partout ?"], ["Unicité", "des doublons ?"], ["Validité", "le format est-il respecté ?"], ["Actualité", "les données sont-elles à jour ?"]];
      var cartes = [{ t: "Sexe = « Masculin » à côté de « M »", bac: 2 }, { t: "Âge = 250", bac: 1 }, { t: "Glycémie vide", bac: 0 }, { t: "Date = « date inconnue »", bac: 4 }, { t: "P01 présent deux fois", bac: 3 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: DIM.map(function (d) { return { t: d[0], sous: d[1] }; }),
        pos: function (i) { return { x: 10, y: 14 + i * 116, w: 270, h: 100 }; },
        bacsPos: function (k) { return { x: 300 + (k % 2) * 188, y: 14 + Math.floor(k / 2) * 194, w: 178, h: 176 }; },
        couleurs: function (k) { return A.BACS[k % 5]; },
        taille: 16, tailleBac: 17,
        dessinBac: function (g2, k, faux) { var r = { x: 300 + (k % 2) * 188, y: 14 + Math.floor(k / 2) * 194 }, st = A.BACS[k % 5]; A.boite(g2, r.x, r.y, 178, 176, { fond: faux ? A.C.koPale : k === 5 ? A.C.fond : st.pale, bord: faux ? A.C.ko : k === 5 ? A.C.gris : st.coul, ep: 3, titre: DIM[k][0], sous: DIM[k][1], taille: 18, coul: k === 5 ? A.C.doux : st.coul }); },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le même concept est codé de deux façons.", "La valeur n'est pas réaliste.", "La valeur manque.", "Le format attendu (une date) n'est pas respecté.", "La même ligne existe deux fois."][i]; },
        fin: function () { j.bravo("Cohérence, exactitude, complétude, validité, unicité."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La sixième", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["document", "horloge"], titre: "Adresse et téléphone de 2019", sous: "dernière modification inconnue" });
      j.titre("Dernière dimension, que le tableau ne montrait pas : l'adresse et le téléphone de Mme Kettani datent de 2019, et on ne sait pas qui les a modifiés en dernier. Laquelle ?");
      j.choix([
        { html: "L'actualité", juste: true },
        { html: "L'unicité", aide: "Il n'y a pas de doublon ici : une seule fiche, mais ancienne." },
        { html: "L'exactitude", aide: "Les valeurs étaient peut-être justes en 2019. Le problème est leur âge." }
      ], { colonnes: 3, ok: function () {
        j.bravo("Actualité : dernière mise à jour du dossier, traçabilité des modifications.");
        j.expliquer("<p>Les six dimensions de la qualité des données d'un SIH : <b>complétude</b>, <b>exactitude / possibilité</b>, <b>cohérence</b>, <b>unicité</b>, <b>validité (format)</b>, <b>actualité</b>.</p>");
        j.suite();
      } });
    } }
  ]
}));
