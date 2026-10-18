/* Figures : plan du bloc coloré par zones ; schéma fonctionnel général construit pas à pas. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C, Z = A.ZONES;

  /* ---------- Figure 1 : les trois zones sur un plan ---------- */
  (function () {
    var f = R.figure("fig-zones", {
      largeur: 960, hauteur: 540, titre: "Gradation des zones d'un bloc",
      essai: "<strong>Essaie</strong> : choisis une zone, ou touche une pièce. <strong>Observe</strong> : on passe toujours du public au semi-restreint avant d'entrer dans le restreint."
    });
    var g = A.s("g", null, f.svg), filtre = "toutes", sel = null;
    var P = [
      { t: "Circulation générale", x: 20, y: 16, w: 920, h: 54, z: "publique" },
      { t: "Accueil", x: 20, y: 80, w: 200, h: 120, z: "publique" }, { t: "Attente", x: 230, y: 80, w: 200, h: 120, z: "publique" },
      { t: "Vestiaires", x: 440, y: 80, w: 200, h: 120, z: null }, { t: "Transfert des patients", x: 650, y: 80, w: 290, h: 120, z: "semi" },
      { t: "Circulation du personnel", x: 20, y: 210, w: 920, h: 60, z: "semi" },
      { t: "Salle d'opération 1", x: 20, y: 280, w: 300, h: 130, z: "restreinte" }, { t: "Zone de préparation stérile", x: 330, y: 280, w: 300, h: 130, z: "restreinte" },
      { t: "Salle d'opération 2", x: 640, y: 280, w: 300, h: 130, z: "restreinte" },
      { t: "Locaux de préparation", x: 20, y: 420, w: 455, h: 104, z: "semi" }, { t: "Stockage", x: 485, y: 420, w: 455, h: 104, z: "semi" }
    ];
    var b = R.boutons(f.reglages), bts = {};
    [["toutes", "Toutes les zones"], ["publique", "Publique"], ["semi", "Semi-restreinte"], ["restreinte", "Restreinte"]].forEach(function (o) {
      bts[o[0]] = R.bouton(b, o[1], function () { filtre = o[0]; sel = null; dessiner(); });
    });
    var zone = R.h("div", null, "", f.direct);
    var TXT = { publique: "Zone publique : accueil, attente, circulation générale. Ouverte à tous.", semi: "Zone semi-restreinte : circulation du personnel, transfert des patients, locaux de préparation, stockage. Personnel en tenue.", restreinte: "Zone restreinte : salles d'opération, certaines zones de préparation stérile, espaces directement associés à l'intervention. Accessible depuis une zone semi-restreinte (FGI)." };
    function dessiner() {
      A.vider(g);
      Object.keys(bts).forEach(function (k) { bts[k].classList.toggle("actif", k === filtre); });
      P.forEach(function (p) {
        var st = p.z ? Z[p.z] : null, vis = filtre === "toutes" || p.z === filtre;
        if (!st) { A.boite(g, p.x, p.y, p.w, p.h, { fond: "#fff", bord: C.gris, ep: 2, rx: 6, tirets: "6 5", titre: p.t, sous: "passage du personnel", taille: 18, coul: C.doux }); return; }
        A.boite(g, p.x, p.y, p.w, p.h, { fond: vis ? st.fond : "#fff", bord: vis ? st.bord : C.trait, ep: sel === p ? 4.5 : 2.5, rx: 6, titre: p.t, sous: vis ? st.court : "", taille: 18, coul: vis ? C.encre : C.gris, coulSous: st.texte });
        A.cible(g, p.x, p.y, p.w, p.h, function () { sel = p; filtre = "toutes"; dessiner(); zone.innerHTML = "<strong>" + p.t + "</strong> : " + TXT[p.z]; });
      });
      [[170, 210, 280], [790, 210, 280]].forEach(function (q) { A.fleche(g, [q[0], q[1] + 12], [q[0], q[2] + 26], { coul: C.ok, ep: 5 }); });
      if (!sel) zone.innerHTML = filtre === "toutes" ? "Les flèches vertes : on entre en salle depuis la circulation du personnel, zone semi-restreinte." : TXT[filtre];
    }
    dessiner();
  })();

  /* ---------- Figure 2 : schéma fonctionnel général ---------- */
  (function () {
    var f = R.figure("fig-schema", {
      largeur: 960, hauteur: 540, titre: "Schéma fonctionnel général",
      essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : patients et personnel convergent vers les zones contrôlées ; la logistique a son propre chemin."
    });
    var g = A.s("g", null, f.svg);
    function bt(x, y, w, t, st, coul) { A.boite(g, x, y, w, 48, { fond: st ? st.fond : coul ? coul : "#fff", bord: st ? st.bord : coul ? coul : C.encre, ep: 2.5, rx: 10, titre: t, taille: 17, coul: coul ? "#fff" : C.encre }); }
    function dessiner(k) {
      A.vider(g);
      bt(370, 10, 220, "Bloc opératoire", null, A.C.jeu);
      [["Patients", 90, C.patient], ["Personnel", 370, C.personnel], ["Logistique", 650, C.propre]].forEach(function (p) { bt(p[1], 80, 220, p[0]); A.fleche(g, [480, 60], [p[1] + 110, 78], { coul: C.gris, ep: 2.5 }); });
      if (k >= 1) { bt(90, 150, 220, "Préparation"); A.fleche(g, [200, 130], [200, 148], { coul: C.patient, ep: 4 }); bt(370, 150, 220, "Vestiaires"); A.fleche(g, [480, 130], [480, 148], { coul: C.personnel, ep: 4 }); }
      if (k >= 2) { bt(650, 150, 220, "Réception"); A.fleche(g, [760, 130], [760, 148], { coul: C.propre, ep: 4 }); bt(650, 220, 220, "Stockage propre"); A.fleche(g, [760, 200], [760, 218], { coul: C.propre, ep: 4 }); }
      if (k >= 3) { A.chemin(g, [[200, 200], [200, 214], [330, 214], [330, 228]], { coul: C.patient, ep: 4 }); A.chemin(g, [[480, 200], [480, 214], [380, 214], [380, 228]], { coul: C.personnel, ep: 4 }); bt(240, 230, 220, "Zone semi-restreinte", Z.semi); A.fleche(g, [350, 280], [350, 298], { coul: C.gris, ep: 4 }); bt(240, 300, 220, "Zone restreinte", Z.restreinte); }
      if (k >= 4) [60, 260, 460].forEach(function (x, i) { A.fleche(g, [350, 350], [x + 70, 378], { coul: C.gris, ep: 3 }); bt(x, 380, 140, "Bloc " + (i + 1), Z.restreinte); A.fleche(g, [x + 70, 430], [350, 452], { coul: C.gris, ep: 3 }); });
      if (k >= 5) { bt(240, 454, 220, "Réveil / SSPI"); A.fleche(g, [460, 478], [540, 478], { coul: C.gris, ep: 3 }); bt(546, 454, 180, "Hospitalisation"); bt(740, 454, 180, "Réanimation"); }
    }
    var e = R.etapes(f.reglages, 5, ["", "patients et personnel", "logistique", "zones", "salles", "après l'intervention"], dessiner);
    e.aller(5);
  })();
})();
