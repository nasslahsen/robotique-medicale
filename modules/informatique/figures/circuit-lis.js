/* Figures : les trois phases du circuit d'un examen biologique ; répartition du temps de traitement (TAT). */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-phases", {
    largeur: 960, hauteur: 460, titre: "LIS : circuit d'un examen biologique",
    essai: "<strong>Essaie</strong> : touche chaque phase. <strong>Observe</strong> : la phase pré-analytique, la plus longue, est le principal gisement d'erreurs."
  });
  var PH = [
    { t: "Pré-analytique", p: 60, coul: C.acc, pale: C.accPale, e: ["Prescription médicale", "Prélèvement échantillon", "Acheminement et tri", "Préparation (centrifugation)"], d: "avant l'automate : prescrire, prélever, étiqueter, transporter, préparer. Points de risque : prélèvement mal identifié." },
    { t: "Analytique", p: 25, coul: C.ok, pale: C.okPale, e: ["Chargement automates", "Exécution analyses", "Contrôle qualité (CQI)", "Interfaçage bidirectionnel"], d: "dans l'automate : il reçoit la demande du LIS et lui renvoie le résultat (interfaçage bidirectionnel), sous contrôle qualité interne." },
    { t: "Post-analytique", p: 15, coul: C.v, pale: C.vPale, e: ["Validation technique", "Validation biologique", "Diffusion résultats (HL7)", "Archivage légal"], d: "après l'automate : valider, diffuser, archiver. Points de risque : valeur critique non communiquée, résultat rendu sur le mauvais dossier." }
  ];
  var items = PH.map(function (p, k) { return { x: 20 + k * 310, y: 20, w: 300, h: 420, t: p.t + "  " + p.p + " %", texte: p.d, coul: p.coul, pale: p.pale, taille: 20, haut: true }; });
  A.explorer(f, items, { devant: function (g) {
    PH.forEach(function (p, k) { p.e.forEach(function (e, i) { A.boite(g, 40 + k * 310, 80 + i * 86, 260, 70, { titre: e, taille: 16, gras: 600, ep: 1.5, bord: p.coul, rx: 10 }); }); });
  } });

  var f2 = R.figure("fig-tat", {
    largeur: 960, hauteur: 220, titre: "Répartition du temps de traitement",
    essai: "<strong>Essaie</strong> : change le TAT total. <strong>Observe</strong> : les proportions restent 60, 25, 15 % (exemple de durée ajouté)."
  });
  var g = A.s("g", null, f2.svg);
  var ct = R.curseur(f2.reglages, { nom: "TAT total", min: 30, max: 240, pas: 10, val: 90, unite: " min" });
  function dessiner() {
    A.vider(g);
    var x = 20, T = A.calc.tat(ct.v);
    PH.forEach(function (p, k) {
      var w = 920 * p.p / 100;
      A.s("rect", { x: x, y: 40, width: w, height: 80, fill: p.coul }, g);
      A.texte(g, p.t, [x + w / 2, 80], { taille: k === 2 ? 15 : 19, coul: "#fff", halo: false, gras: 800, largeur: w - 8 });
      A.texte(g, p.p + " %  ·  " + String(Math.round(T[k] * 10) / 10).replace(".", ",") + " min", [x + w / 2, 150], { taille: 17, mono: true, gras: 700, coul: p.coul });
      x += w;
    });
    f2.direct.innerHTML = "Pré-analytique : 0,60 × " + ct.v + " = " + String(Math.round(T[0] * 10) / 10).replace(".", ",") + " min.";
  }
  ct.surChange(dessiner);
  dessiner();
})();
