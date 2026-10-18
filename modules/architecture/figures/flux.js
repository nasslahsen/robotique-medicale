/* Figure : plan d'un bloc et ses cinq flux ; un bouton par flux. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C, Z = A.ZONES;
  var f = R.figure("fig-flux", {
    largeur: 960, hauteur: 540, titre: "Les cinq flux du bloc",
    essai: "<strong>Essaie</strong> : affiche un flux, puis tous. <strong>Observe</strong> : chaque flux a son chemin ; le propre (vert) et le sale (marron) ne partagent aucun couloir."
  });
  var g = A.s("g", null, f.svg), choix = "tous";
  // pièces d'un bloc d'exemple (plan ajouté pour l'illustration)
  var P = {
    hosp: { t: "Hospitalisation", x: 20, y: 20, w: 180, h: 70 }, vest: { t: "Vestiaires", x: 220, y: 20, w: 170, h: 70 },
    rec: { t: "Réception", x: 760, y: 20, w: 180, h: 70 }, ster: { t: "Stérilisation centrale", x: 540, y: 20, w: 200, h: 70 },
    prep: { t: "Préparation patient", x: 20, y: 140, w: 180, h: 80 }, couloir: { t: "Circulation du personnel (semi-restreinte)", x: 220, y: 140, w: 300, h: 80, z: "semi" },
    stock: { t: "Stockage propre / stérile", x: 760, y: 140, w: 180, h: 80, z: "semi" }, prepst: { t: "Préparation stérile", x: 540, y: 140, w: 200, h: 80, z: "restreinte" },
    salle: { t: "Salle d'opération", x: 300, y: 260, w: 360, h: 140, z: "restreinte" },
    sspi: { t: "SSPI", x: 20, y: 300, w: 180, h: 100 }, rea: { t: "Réanimation", x: 20, y: 440, w: 180, h: 80 },
    sale: { t: "Circuit sale, évacuation", x: 300, y: 450, w: 640, h: 70 }
  };
  function c(k, dx, dy) { var p = P[k]; return [p.x + p.w / 2 + (dx || 0), p.y + p.h / 2 + (dy || 0)]; }
  var FL = {
    patient: { coul: C.patient, nom: "Patient", pts: [c("hosp"), c("prep"), [110, 250], [300, 300]], suite: [[300, 360], c("sspi", 90, 10)], fin: [c("sspi", 0, 50), c("rea", 0, -40)], txt: "Hospitalisation → préparation → transfert → salle d'opération → SSPI → réanimation / hospitalisation." },
    personnel: { coul: C.personnel, nom: "Personnel", pts: [c("vest"), c("couloir", -60, -40), c("couloir", -60, 0), [420, 258]], txt: "Vestiaires → zone semi-restreinte → zone restreinte ; l'accès est contrôlé." },
    propre: { coul: C.propre, nom: "Propre", pts: [c("rec"), c("stock", 30, -40), c("stock", 0, 30), c("prepst", 40, 30), [600, 258]], txt: "Réception → stockage propre → préparation → salle d'opération." },
    sale: { coul: C.sale, nom: "Sale", pts: [[560, 402], [560, 448]], txt: "Salle d'opération → évacuation des déchets et instruments souillés → circuit sale, sans traverser les zones propres." },
    dm: { coul: C.dm, nom: "Dispositifs médicaux", pts: [c("ster", -40, 0), c("stock", -40, -40)], retour: [[880, 448], [880, 240], [940, 240], [940, 100], [700, 92]], txt: "Stérilisation centrale → stockage stérile → bloc → utilisation → instruments souillés → retour en stérilisation (boucle)." }
  };
  var b = R.boutons(f.reglages), bts = {};
  ["tous", "patient", "personnel", "propre", "sale", "dm"].forEach(function (k) { bts[k] = R.bouton(b, k === "tous" ? "Tous" : FL[k].nom, function () { choix = k; dessiner(); }); });
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    Object.keys(bts).forEach(function (k) { bts[k].classList.toggle("actif", k === choix); });
    Object.keys(P).forEach(function (k) {
      var p = P[k], st = p.z ? Z[p.z] : null;
      A.boite(g, p.x, p.y, p.w, p.h, { fond: st ? st.fond : k === "sale" ? "#fbeee6" : "#fff", bord: st ? st.bord : k === "sale" ? C.sale : C.encre, ep: 2.5, rx: 8, titre: p.t, taille: 16 });
    });
    Object.keys(FL).forEach(function (k) {
      if (choix !== "tous" && choix !== k) return;
      var fl = FL[k], op = 1;
      A.chemin(g, fl.pts, { coul: fl.coul, ep: 5, op: op });
      if (fl.suite) A.chemin(g, fl.suite, { coul: fl.coul, ep: 5 });
      if (fl.fin) A.chemin(g, fl.fin, { coul: fl.coul, ep: 5 });
      if (fl.retour) A.chemin(g, fl.retour, { coul: fl.coul, ep: 4, tirets: "10 7" });
    });
    zone.innerHTML = choix === "tous" ? "Les cinq flux ensemble : patient (violet), personnel (bleu), propre (vert), sale (marron), dispositifs médicaux (turquoise, la boucle en pointillés est le retour des instruments souillés). Plan d'exemple ajouté." : "<strong>Flux " + FL[choix].nom.toLowerCase() + "</strong> : " + FL[choix].txt;
  }
  dessiner();
})();
