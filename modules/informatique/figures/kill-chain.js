/* Figure : la cyber kill chain du cours, huit phases et leurs signaux de détection. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-killchain", {
    largeur: 960, hauteur: 560, titre: "Cyber kill chain",
    essai: "<strong>Essaie</strong> : touche chaque phase. <strong>Observe</strong> : chaque phase laisse un signal ; plus tôt on le voit, plus tôt on coupe la chaîne."
  });
  var P = [
    ["Reconnaissance", "repérage", "des outils scannent le réseau et cherchent des vulnérabilités. Signal : reconnaissance tools detected."],
    ["Intrusion", "entrée", "un rançongiciel, un malware ou un cryptolocker est présent ; le système est attaqué. Signal : crypto intrusion activity."],
    ["Exploitation", "abus des failles", "des outils d'exploitation abusent des vulnérabilités du système. Signal : exploitation tools detected."],
    ["Privilege escalation", "élévation de privilèges", "tentatives d'extraire des identifiants et d'élever les permissions. Signal : permission changes on OU."],
    ["Lateral movement", "déplacement latéral", "des identifiants compromis servent à passer d'un système à l'autre. Signal : unusual lockout behaviors."],
    ["Obfuscation", "anti-forensics", "l'attaquant cache sa présence et masque son activité. Signal : masking activity detected."],
    ["Denial of service", "déni de service", "le réseau et l'infrastructure sont ciblés ; les ressources deviennent indisponibles. Signal : GPO deleted."],
    ["Exfiltration", "vol de données", "tentatives non autorisées d'accéder aux données : une exfiltration est en cours. Signal : suspicious mailbox activity."]
  ];
  var it = P.map(function (p, k) { var a = -Math.PI / 2 + k * Math.PI / 4, cx = 480 + 330 * Math.cos(a), cy = 280 + 220 * Math.sin(a); return { x: cx - 105, y: cy - 38, w: 210, h: 76, t: (k + 1) + ". " + p[0], sous: p[1], texte: p[2], coul: C.ko, pale: C.koPale, taille: 17 }; });
  A.explorer(f, it, { fond: function (g) {
    A.s("ellipse", { cx: 480, cy: 280, rx: 330, ry: 220, fill: "none", stroke: C.trait, "stroke-width": 6 }, g);
    for (var k = 0; k < 8; k++) { var a = -Math.PI / 2 + (k + 0.5) * Math.PI / 4; var p = [480 + 330 * Math.cos(a), 280 + 220 * Math.sin(a)], t = [-Math.sin(a) * 330, Math.cos(a) * 220], l = Math.hypot(t[0], t[1]); A.fleche(g, [p[0] - t[0] / l * 12, p[1] - t[1] / l * 12], [p[0] + t[0] / l * 12, p[1] + t[1] / l * 12], { ep: 5, coul: C.gris, tete: 18 }); }
    A.texte(g, "Cyber kill chain", [480, 270], { taille: 24, gras: 800, coul: C.doux });
    A.texte(g, "schéma Varonis du cours", [480, 302], { taille: 14, coul: C.gris });
  } });
})();
