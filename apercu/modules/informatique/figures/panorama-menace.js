/* Figure : chronologie des attaques citées au cours, de 2017 à 2026. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-chronologie", {
    largeur: 960, hauteur: 520, titre: "Panorama de la menace cyber",
    essai: "<strong>Essaie</strong> : touche chaque attaque. <strong>Observe</strong> : les rançongiciels dominent, et la chaîne des tiers (prestataires, fabricants) revient sans cesse."
  });
  var g = A.s("g", null, f.svg), ch = -1;
  var I = [
    [2017.4, "NHS", "WannaCry, ver exploitant SMBv1 (EternalBlue). Plus de 80 structures, environ 19 000 rendez-vous annulés ; de l'imagerie sous Windows non corrigé atteinte."],
    [2019.85, "CHU de Rouen", "rançongiciel. Retour au papier pendant des semaines : premier cas français très médiatisé."],
    [2022.6, "CH Sud Francilien", "rançongiciel LockBit, rançon de 10 M$. Double extorsion : données publiées après le refus de payer."],
    [2024.1, "Change Healthcare", "rançongiciel ALPHV / BlackCat. Un prestataire de paiement unique paralyse des milliers de structures ; environ 190 millions de personnes concernées."],
    [2025.0, "Contec CMS8000", "avis de la CISA : backdoor dans le micrologiciel de moniteurs patients, données envoyées vers une adresse IP codée en dur. Importance des SBOM et des exigences d'achat."],
    [2025.3, "CNSS (Maroc)", "intrusion et fuite revendiquée par JabaRoot DZ : environ 2 millions de salariés concernés selon la presse (identité, coordonnées bancaires, salaires)."],
    [2026.5, "CH de Chaumont", "intrusion détectée. Bonne pratique : alerte, déconnexion immédiate d'Internet, coordination avec le GHT."],
    [2026.6, "Prestataire de Santé publique France", "piratage d'une plateforme externe : environ 80 000 données de contact exposées. La sous-traitance reste le maillon faible."]
  ];
  function X(a) { return 60 + (a - 2017) * 92; }
  function dessiner() {
    A.vider(g);
    A.s("line", { x1: 40, y1: 240, x2: 930, y2: 240, stroke: C.encre, "stroke-width": 4 }, g);
    for (var a = 2017; a <= 2026; a++) { A.s("line", { x1: X(a), y1: 232, x2: X(a), y2: 248, stroke: C.encre, "stroke-width": 3 }, g); A.texte(g, String(a), [X(a), 270], { taille: 14, mono: true, coul: C.doux }); }
    I.forEach(function (x, i) {
      var y = [60, 310, 60, 310, 130, 380, 60, 450][i], haut = y < 240, on = i === ch;
      A.s("line", { x1: X(x[0]), y1: 240, x2: X(x[0]), y2: haut ? y + 50 : y, stroke: on ? C.ko : C.trait, "stroke-width": 2.5 }, g);
      A.s("circle", { cx: X(x[0]), cy: 240, r: on ? 10 : 7, fill: on ? C.ko : "#fff", stroke: C.ko, "stroke-width": 3 }, g);
      var w = i === 7 ? 260 : 170, bx = Math.max(10, Math.min(950 - w, X(x[0]) - w / 2));
      A.boite(g, bx, y, w, 50, { titre: x[1], taille: 15, fond: on ? C.koPale : "#fff", bord: on ? C.ko : C.encre, ep: on ? 3.5 : 2, rx: 10 });
      A.cible(g, bx, y, w, 50, function () { ch = i; dessiner(); });
    });
    f.direct.innerHTML = ch >= 0 ? "<strong>" + I[ch][1] + "</strong> : " + I[ch][2] : "Touche une attaque de la frise.";
  }
  dessiner();
})();
