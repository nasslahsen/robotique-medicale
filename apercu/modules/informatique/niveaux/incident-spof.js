/* Niveau : incident de sécurité et point de défaillance unique (SPOF) (cyber, diapos 23 et 24). */
NIVEAU(SIS.rejouable({
  id: "incident-spof",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.B = {
      p0: { x: 20, y: 30, w: 140, h: 70, t: "Poste 1" }, p1: { x: 185, y: 30, w: 140, h: 70, t: "Poste 2" }, p2: { x: 350, y: 30, w: 140, h: 70, t: "Poste 3" }, p3: { x: 515, y: 30, w: 140, h: 70, t: "Poste 4" },
      sw: { x: 240, y: 160, w: 200, h: 70, t: "Switch central (un seul)" },
      sa: { x: 80, y: 290, w: 200, h: 70, t: "Serveur DPI A" }, sb: { x: 400, y: 290, w: 200, h: 70, t: "Serveur DPI B (secours)" },
      db: { x: 210, y: 410, w: 260, h: 70, t: "Base de données : une seule instance, sans réplication" },
      ond: { x: 20, y: 520, w: 260, h: 64, t: "Deux onduleurs" }, karim: { x: 300, y: 520, w: 360, h: 64, t: "Karim, seul à connaître le mot de passe administrateur" }
    };
    n.CLES = ["p0", "p1", "p2", "p3", "sw", "sa", "sb", "db", "ond", "karim"];
    n.BONS = ["sw", "db", "karim"];
    n.reseau = function (g2, etat) {
      ["p0", "p1", "p2", "p3"].forEach(function (k) { A.relier(g2, n.B[k], n.B.sw, { ep: 2.5, coul: C.doux }); });
      ["sa", "sb"].forEach(function (k) { A.relier(g2, n.B.sw, n.B[k], { ep: 2.5, coul: C.doux }); A.relier(g2, n.B[k], n.B.db, { ep: 2.5, coul: C.doux }); });
      n.CLES.forEach(function (k, i) {
        var b = n.B[k], ok = etat && etat.trouve[i], f = etat && etat.faux === i;
        A.boite(g2, b.x, b.y, b.w, b.h, { titre: b.t, taille: 15, fond: ok ? C.koPale : f ? C.fond : "#fff", bord: ok ? C.ko : f ? C.gris : C.encre, ep: ok ? 4 : 2.5 });
      });
    };
    return n;
  },
  etapes: [
    { nom: "Événement ou incident ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Tout incident est un événement de cybersécurité, mais pas l'inverse. Range chaque situation.");
      var cartes = [{ t: "L'antivirus bloque une pièce jointe piégée", bac: 0 }, { t: "Le PACS est chiffré par un rançongiciel", bac: 1 }, { t: "Une connexion échoue une fois, mot de passe mal tapé", bac: 0 }, { t: "Fuite de dossiers de patients", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Événement seulement", sous: "rien n'est compromis" }, { t: "Incident de sécurité", sous: "la CID est compromise" }],
        pos: A.grille(4, 2, 20, 30, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Il s'est passé quelque chose, mais la confidentialité, l'intégrité et la disponibilité sont intactes." : "Ici, la CID est compromise et le fonctionnement normal perturbé."; },
        fin: function () {
          j.bravo("Un incident compromet la CID et perturbe le fonctionnement normal.");
          j.expliquer("<p>Un <b>incident de sécurité</b> est un événement malveillant ou accidentel qui compromet la CID des données et des SI, perturbe le fonctionnement normal, et entraîne des risques financiers, juridiques et de réputation.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Trois risques", jouer: function (j, n) {
      var A = SIS;
      j.titre("Après une fuite de données, relie chaque conséquence au type de risque qu'elle représente.");
      var p = A.paires({
        g: n.g, gauche: ["Remise en état du SI et pertes d'activité", "Poursuites pour défaut de protection des données", "Des patients vont se faire soigner ailleurs"],
        droite: ["Réputation", "Financier", "Juridique"],
        bon: [1, 2, 0], xg: 20, wg: 380, xd: 460, wd: 200, y0: 80, h: 120, pas: 160, taille: 17, tailleD: 20,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Ça coûte de l'argent.", "Ça passe devant un juge ou une autorité.", "Ça touche la confiance."][i]; },
        fin: function () { j.bravo("Financier, juridique, réputation."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Trouver les SPOF", jouer: function (j, n) {
      var A = SIS;
      j.titre("Sur ce SI d'exemple, touche les trois points de défaillance unique : ceux dont la panne arrêterait tout.");
      var r = A.reperer({ g: n.g, zones: n.CLES.map(function (k) { var b = n.B[k]; return { x: b.x, y: b.y, w: b.w, h: b.h, bon: n.BONS.indexOf(k) >= 0 }; }), dessiner: n.reseau,
        erreur: j.erreur, aide: function (i) { var k = n.CLES[i]; return k.charAt(0) === "p" ? "Si ce poste tombe, les trois autres continuent." : k === "sa" || k === "sb" ? "Il y a deux serveurs : l'un remplace l'autre." : "Il y a deux onduleurs : l'un prend le relais de l'autre."; },
        fin: function () { j.bravo("Le switch unique, la base sans réplication, et Karim."); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Trois niveaux", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours place les SPOF à trois niveaux. Range les trois que tu as trouvés.");
      var cartes = [{ t: "Switch central unique", bac: 0 }, { t: "Instance unique du SGBD, sans réplication", bac: 1 }, { t: "Karim, seul à connaître le mot de passe", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Hardware" }, { t: "Logiciel" }, { t: "Humain" }],
        pos: function (i) { return { x: 14 + i * 222, y: 30, w: 208, h: 180 }; },
        bacsPos: function (k) { return { x: 14 + k * 222, y: 320, w: 208, h: 200 }; },
        taille: 16, tailleBac: 22,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Un équipement physique.", "Un programme.", "Une personne."][i]; },
        fin: function () {
          j.bravo("Matériel, logiciel, humain.");
          j.expliquer("<p>Un <b>SPOF</b> (single point of failure), ou <b>point de défaillance unique</b>, est un maillon faible du SI qui, en cas de défaillance, peut entraîner une interruption majeure. On le supprime par la redondance : deux switchs, une base répliquée, un mot de passe partagé de façon sûre.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
