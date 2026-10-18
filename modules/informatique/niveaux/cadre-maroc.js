/* Niveau : cadre réglementaire marocain (loi 05-20, DGSSI, maCERT, DNSSI, loi 09-08, CNDP) (cyber, diapos 13 et 14). */
NIVEAU(SIS.rejouable({
  id: "cadre-maroc",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Les devoirs du RSSI", jouer: function (j, n) {
      var A = SIS;
      j.titre("Un CHU fait partie des infrastructures d'importance vitale (IIV). D'après la loi 05-20, range chaque action : obligation du RSSI, ou pas ?");
      var cartes = [{ t: "Déclarer ses SI sensibles auprès de la DGSSI", bac: 0 }, { t: "Payer la rançon pour aller plus vite", bac: 1 }, { t: "Réaliser une cartographie des risques", bac: 0 }, { t: "Procéder à des audits de sécurité", bac: 0 }, { t: "Homologuer ses SIS", bac: 0 }, { t: "Héberger tous les serveurs à l'étranger", bac: 1 }, { t: "Faire accepter formellement les risques résiduels", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Obligation", sous: "loi 05-20, RSSI des IIV" }, { t: "Pas une obligation" }],
        pos: A.grille(7, 2, 14, 10, 652, 62, 10), bacsPos: function (k) { return { x: 20 + k * 330, y: 310, w: 310, h: 250 }; },
        taille: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 1 ? "La loi organise la protection et le contrôle ; ce geste n'en fait pas partie." : "La loi 05-20 en fait une obligation pour les RSSI des IIV."; },
        fin: function () {
          j.bravo("Déclarer, cartographier, auditer, homologuer, faire accepter les risques résiduels.");
          j.expliquer("<p>Au Maroc, les <b>infrastructures d'importance vitale</b> (IIV) sont des entités critiques dont l'indisponibilité impacterait gravement le pays. L'information de santé est une information sensible.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Qui prévoit quoi ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque texte ou acteur à ce qu'il prévoit.");
      var p = A.paires({
        g: n.g, gauche: ["Loi 05-20 (2020) et décret 2-21-406", "DGSSI", "maCERT", "DNSSI", "Loi 09-08 et CNDP"],
        droite: ["Centre national de veille et de réponse aux incidents", "Socle de mesures depuis 2014 : gouvernance, actifs, accès, réseaux, continuité", "Protection des données personnelles, transfert hors du Maroc encadré", "RSSI, politique de sécurité, audits par PASSI, déclaration des incidents", "Autorité nationale de cybersécurité (Défense nationale)"],
        bon: [3, 4, 0, 1, 2],
        xg: 10, wg: 230, xd: 270, wd: 400, y0: 20, h: 96, pas: 114, taille: 16, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["La loi sur la cybersécurité : règles pour les administrations et établissements publics.", "La Direction générale de la sécurité des systèmes d'information.", "Le CERT national : veille et réponse.", "La Directive nationale : un socle de mesures.", "La loi sur les données personnelles."][i]; },
        fin: function () { j.bravo("Loi 05-20, DGSSI, maCERT, DNSSI, loi 09-08."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Le cloud du fabricant", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["moniteur", "nuage"], titre: "Données des moniteurs vers un cloud en Europe", sous: "pour la maintenance" });
      SIS.vider(n.g);
      j.titre("Un fabricant de moniteurs veut copier les données des patients sur son cloud en Europe, pour la maintenance. Que dit le cours ?");
      j.choix([
        { html: "C'est un transfert interdit sauf sous des conditions qui demandent une qualification et une autorisation de la CNDP (loi 09-08)", juste: true },
        { html: "C'est libre : c'est pour la maintenance", aide: "Les données de santé sont des données sensibles : leur sortie du Maroc est encadrée." },
        { html: "Il suffit de prévenir le maCERT", aide: "Le maCERT gère les incidents. Pour les données personnelles, c'est une autre autorité." }
      ], { colonnes: 1, ok: function () { j.bravo("Loi 09-08 : transfert hors du Maroc encadré, autorisation de la CNDP."); j.suite(); } });
    } },
    { nom: "Qui appeler ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["serveur", "alerte"], titre: "Un rançongiciel paralyse un CHU" });
      j.titre("Incident grave : un rançongiciel paralyse un CHU. Qui est l'interlocuteur national, d'après le cours ?");
      j.choix([{ html: "La DGSSI et son maCERT", juste: true }, { html: "La CNDP", aide: "La CNDP protège les données personnelles ; l'interlocuteur en cas d'incident grave est un autre." }, { html: "Le fabricant du PACS seul", aide: "Il aidera, mais l'autorité nationale doit être alertée." }], { colonnes: 1, ok: function () { j.bravo("DGSSI et maCERT : ils mettent aussi à disposition des guides techniques."); j.suite(); } });
    } }
  ]
}));
