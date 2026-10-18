/* Niveau : ce qui rend un hôpital différent face à la cybersécurité (cyber, diapo 4). */
NIVEAU(SIS.rejouable({
  id: "hopital-different",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Caractéristique et conséquence (1)", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque caractéristique de l'hôpital à sa conséquence pour la sécurité.");
      var p = A.paires({
        g: n.g, gauche: ["Le retard n'est pas toléré quand une panne bloque une décision", "L'hôpital tourne 24 h / 24", "Les DM durent 10 à 15 ans", "Chaque service achète ses propres références"],
        droite: ["Des équipements sous des systèmes non supportés", "Inventaire incomplet, dizaines de prestataires", "Disponibilité et intégrité priment souvent sur la confidentialité", "Correctifs retardés, redémarrages difficiles à planifier"],
        bon: [2, 3, 0, 1],
        xg: 10, wg: 320, xd: 360, wd: 310, y0: 30, h: 120, pas: 140, taille: 16, tailleD: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Si une décision attend, le patient attend : qu'est-ce qui compte le plus ?", "Quand peut-on redémarrer un serveur qui ne s'arrête jamais ?", "Le système d'exploitation vieillit plus vite que l'appareil.", "Un parc très hétérogène."][i]; },
        fin: function () { j.bravo("Quatre traits de l'hôpital, quatre faiblesses."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Caractéristique et conséquence (2)", jouer: function (j, n) {
      var A = SIS;
      j.titre("Et les trois dernières.");
      var p = A.paires({
        g: n.g, gauche: ["Qualification des intervenants, responsabilité du fabricant", "De nombreux tiers sont connectés", "Les données de santé ne se « révoquent » pas"],
        droite: ["La surface d'attaque dépasse l'établissement", "Un vol a des conséquences durables : chantage, usurpation", "Pas d'antivirus ni de correctif sur un DM à sa guise"],
        bon: [2, 0, 1],
        xg: 10, wg: 320, xd: 360, wd: 310, y0: 60, h: 130, pas: 170, taille: 16, tailleD: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Qui a le droit de modifier le logiciel d'un DM ?", "Télémaintenance, éditeurs, hébergeurs, groupements sanitaires.", "Un dossier médical volé ne se change pas comme une carte bancaire."][i]; },
        fin: function () { j.bravo("Fabricant, tiers, données irrévocables."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "L'antivirus refusé", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["moniteur", "bouclier"], titre: "Un antivirus sur l'échographe ?", sous: "le fabricant refuse" });
      SIS.vider(n.g);
      j.titre("Le service veut installer un antivirus sur un échographe. Le fabricant refuse. A-t-il raison ?");
      j.choix([
        { html: "Oui : le DM est qualifié par le fabricant, qui en porte la responsabilité ; le modifier sans lui peut le dérégler", juste: true },
        { html: "Non : un antivirus ne peut jamais gêner", aide: "Un antivirus peut ralentir ou bloquer un logiciel qui pilote une mesure médicale." },
        { html: "Non : l'hôpital est propriétaire, il fait ce qu'il veut", aide: "Le cours parle d'exigence de qualification et de responsabilité du fabricant." }
      ], { colonnes: 1, ok: function () { j.bravo("On protège le DM autrement : isolement réseau, et en exigeant du fabricant ses correctifs."); j.suite(); } });
    } },
    { nom: "Carte bancaire ou dossier ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["carte", "document"], titre: "Carte bancaire volée, dossier médical volé" });
      j.titre("Une carte bancaire volée se fait opposer en cinq minutes. Pourquoi le vol d'un dossier médical est-il plus grave ?");
      j.choix([
        { html: "Un diagnostic ou un antécédent ne se change pas : la fuite sert longtemps au chantage, à l'usurpation, au phishing ciblé", juste: true },
        { html: "Parce qu'un dossier médical coûte plus cher à imprimer", aide: "Pense à ce qu'on peut faire, des années plus tard, avec un diagnostic volé." }
      ], { colonnes: 1, ok: function () { j.bravo("Les données de santé sont très recherchées et non modifiables."); j.suite(); } });
    } }
  ]
}));
