/* Niveau : cycle de vie d'une attaque, cyber kill chain du cours (cyber, diapo 20). Noms des phases en anglais, comme sur la diapositive. */
NIVEAU(SIS.rejouable({
  id: "kill-chain",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.PH = [["Reconnaissance", "repérage"], ["Intrusion", "entrée"], ["Exploitation", "abus des failles"], ["Privilege escalation", "élévation de privilèges"], ["Lateral movement", "déplacement latéral"], ["Obfuscation", "anti-forensique"], ["Denial of service", "déni de service"], ["Exfiltration", "vol de données"]];
    n.pos = function (k) { var a = -Math.PI / 2 + k * Math.PI / 4; return { x: 340 + 235 * Math.cos(a) - 88, y: 305 + 225 * Math.sin(a) - 34, w: 176, h: 68 }; };
    return n;
  },
  etapes: [
    { nom: "Le cycle", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Touche les huit phases d'une attaque dans l'ordre du cycle du cours.");
      var place = [5, 2, 7, 0, 3, 6, 1, 4];
      var nd = n.PH.map(function (p, i) { var r = n.pos(place[i]); return { t: p[0], sous: p[1], x: r.x, y: r.y, w: r.w, h: r.h }; });
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [0, 1, 2, 3, 4, 5, 6, 7], coul: C.ko, taille: 16, fleches: true,
        fond: function (g2) { A.texte(g2, "Cyber kill chain", [340, 305], { taille: 20, gras: 800, coul: C.doux }); },
        erreur: j.erreur,
        aide: function (i, att, k) { return ["D'abord, l'attaquant étudie sa cible.", "Il entre.", "Il exploite les failles trouvées.", "Il gagne plus de droits.", "Il se déplace vers d'autres machines.", "Il efface ses traces.", "Il rend des services indisponibles.", "Il emporte les données."][k]; },
        fin: function () { j.bravo("Reconnaissance → intrusion → exploitation → élévation de privilèges → mouvement latéral → obfuscation → déni de service → exfiltration."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Les signaux", jouer: function (j, n) {
      var A = SIS;
      j.titre("Chaque phase laisse un signal que la défense peut repérer. Relie chaque signal à sa phase.");
      var p = A.paires({
        g: n.g, gauche: ["Outils de scan du réseau détectés", "Changements de permissions sur des comptes", "Verrouillages de comptes inhabituels", "Activité de masquage détectée", "Activité suspecte dans une boîte mail"],
        droite: ["Lateral movement", "Exfiltration", "Reconnaissance", "Obfuscation", "Privilege escalation"],
        bon: [2, 4, 0, 3, 1],
        xg: 10, wg: 360, xd: 420, wd: 250, y0: 30, h: 96, pas: 112, taille: 16, tailleD: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["On scanne pour repérer les failles.", "Gagner des droits laisse des traces dans les permissions.", "Des comptes volés sont essayés sur d'autres machines.", "On cache sa présence.", "Des données sortent par la messagerie."][i]; },
        fin: function () { j.bravo("Chaque phase a son signal : plus on le voit tôt, mieux c'est."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Couper tôt", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["reseau", "pirate"], titre: "Un scan du réseau repéré" });
      SIS.vider(n.g);
      j.titre("L'équipe sécurité de l'hôpital repère un scan de son réseau. À quelle phase est l'attaquant, et pourquoi est-ce une bonne nouvelle ?");
      j.choix([{ html: "Reconnaissance : l'attaque n'a encore rien abîmé, on peut la couper au tout début", juste: true }, { html: "Exfiltration : les données sont déjà parties", aide: "Un scan, c'est le tout début du cycle." }, { html: "Denial of service : tout est arrêté", aide: "Rien n'est encore arrêté : il cherche des failles." }], { colonnes: 1, ok: function () { j.bravo("Plus on coupe tôt dans la chaîne, moins il y a de dégâts."); j.suite(); } });
    } }
  ]
}));
