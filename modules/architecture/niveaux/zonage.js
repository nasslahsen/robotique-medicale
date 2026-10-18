/* Niveau : gradation des niveaux de propreté et de contrôle des accès (diapo 10), schéma fonctionnel général (diapo 11). */
NIVEAU({
  id: "zonage",
  init: function (fig) {
    var A = ARCHI, C = A.C, Z = A.ZONES, g = A.s("g", null, fig.svg);
    var n = { mode: "plan", libre: true, faux: {}, pl: { P: function (v) { return v; } } };
    var ORDRE = [null, "publique", "semi", "restreinte"];
    // Plan simplifié d'un bloc : chaque pièce a sa zone d'après le cours (null = passage, non coloré)
    n.PIECES = [
      { t: "Circulation générale", x: 20, y: 56, w: 640, h: 50, z: "publique" },
      { t: "Accueil", x: 20, y: 116, w: 150, h: 104, z: "publique" },
      { t: "Attente", x: 180, y: 116, w: 140, h: 104, z: "publique" },
      { t: "Vestiaires", x: 330, y: 116, w: 140, h: 104, z: null, sas: true },
      { t: "Transfert des patients", x: 480, y: 116, w: 180, h: 104, z: "semi" },
      { t: "Circulation du personnel", x: 20, y: 230, w: 640, h: 56, z: "semi" },
      { t: "Salle d'opération 1", x: 20, y: 296, w: 230, h: 150, z: "restreinte" },
      { t: "Zone de préparation stérile", x: 260, y: 296, w: 160, h: 150, z: "restreinte" },
      { t: "Salle d'opération 2", x: 430, y: 296, w: 230, h: 150, z: "restreinte" },
      { t: "Locaux de préparation", x: 20, y: 456, w: 310, h: 124, z: "semi" },
      { t: "Stockage", x: 340, y: 456, w: 320, h: 124, z: "semi" }
    ];
    n.PIECES.forEach(function (p) { p.choix = null; });
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "plan" || n.mode === "portes") {
        n.PIECES.forEach(function (p, i) {
          var z = n.mode === "portes" ? p.z : p.choix, st = z ? Z[z] : null;
          if (p.sas) {
            A.boite(g, p.x, p.y, p.w, p.h, { fond: "#fff", bord: C.gris, ep: 2, rx: 6, tirets: "6 5", titre: p.t, sous: "passage du personnel", taille: 17, coul: C.doux });
            return;
          }
          A.boite(g, p.x, p.y, p.w, p.h, { fond: st ? st.fond : "#fff", bord: n.faux[i] ? C.ko : st ? st.bord : C.gris, ep: n.faux[i] ? 4 : 2.5, rx: 6, titre: p.t, sous: st ? st.court : "à classer", taille: 17, coul: C.encre, coulSous: st ? st.texte : C.gris });
          if (n.mode === "plan") A.cible(g, p.x, p.y, p.w, p.h, function () {
            if (!n.libre) return;
            p.choix = ORDRE[(ORDRE.indexOf(p.choix) + 1) % ORDRE.length]; delete n.faux[i]; n.dessin();
          });
        });
        if (n.mode === "portes") {
          // accès de la salle 1 : depuis la circulation du personnel (semi-restreinte)
          A.s("line", { x1: 100, y1: 296, x2: 160, y2: 296, stroke: "#fff", "stroke-width": 7 }, g);
          A.fleche(g, [130, 262], [130, 330], { coul: C.ok, ep: 5 });
          A.s("line", { x1: 520, y1: 296, x2: 580, y2: 296, stroke: "#fff", "stroke-width": 7 }, g);
          A.fleche(g, [550, 262], [550, 330], { coul: C.ok, ep: 5 });
        }
      } else {
        // schéma fonctionnel général (diapo 11)
        var b = function (x, y, w, t, st, vide) {
          A.boite(g, x, y, w, 50, { fond: vide ? C.fond : st ? st.fond : "#fff", bord: vide ? C.trait : st ? st.bord : C.encre, ep: 2.5, rx: 10, titre: vide ? "?" : t, taille: 16, coul: vide ? C.gris : C.encre, tirets: vide ? "7 6" : null });
        };
        var ok = n.schemaOk;
        A.boite(g, 230, 30, 220, 50, { fond: C.jeu, bord: C.jeu, rx: 10, titre: "Bloc opératoire", taille: 17, coul: "#fff" });
        b(30, 110, 180, "Patients"); b(250, 110, 180, "Personnel"); b(470, 110, 180, "Logistique");
        [120, 340, 560].forEach(function (x) { A.fleche(g, [340, 82], [x, 108], { coul: C.gris, ep: 3 }); });
        b(30, 190, 180, "Préparation", null, !ok); b(250, 190, 180, "Vestiaires", null, !ok); b(470, 190, 180, "Réception", null, !ok);
        b(470, 270, 180, "Stockage propre", null, !ok);
        A.fleche(g, [120, 162], [120, 188], { coul: C.patient, ep: 3.5 }); A.fleche(g, [340, 162], [340, 188], { coul: C.personnel, ep: 3.5 }); A.fleche(g, [560, 162], [560, 188], { coul: C.propre, ep: 3.5 }); A.fleche(g, [560, 242], [560, 268], { coul: C.propre, ep: 3.5 });
        A.chemin(g, [[120, 242], [120, 256], [230, 256], [230, 272]], { coul: C.patient, ep: 3.5 }); A.chemin(g, [[340, 242], [340, 256], [260, 256], [260, 272]], { coul: C.personnel, ep: 3.5 });
        b(130, 274, 230, "Zone semi-restreinte", Z.semi);
        A.fleche(g, [245, 326], [245, 352], { coul: C.gris, ep: 3.5 });
        b(130, 354, 230, "Zone restreinte", Z.restreinte);
        [70, 245, 420].forEach(function (x, i) { A.fleche(g, [245, 406], [x + 30, 432], { coul: C.gris, ep: 3 }); b(x - 30, 434, 120, "Salle " + (i + 1), Z.restreinte); });
        [30, 245, 450].forEach(function (x) { A.fleche(g, [x + 60, 486], [300, 512], { coul: C.gris, ep: 3 }); });
        b(210, 514, 180, "Réveil / SSPI", null, !ok);
        A.texte(g, "puis hospitalisation ou réanimation", [530, 539], { taille: 15, coul: C.doux });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Colorier les zones", jouer: function (j, n) {
      j.titre("Plus on s'approche de la table d'opération, plus la propreté et le contrôle des accès augmentent. Classe chaque pièce du plan.");
      j.consigne("Touche une pièce pour changer sa zone : publique, semi-restreinte, restreinte. Les vestiaires sont un passage.");
      var bt = E.h("button", "btn bleu", "Vérifier", j.el); bt.type = "button";
      function gagner() {
        n.libre = false; bt.remove(); n.dessin();
        j.bravo("Trois zones, du public au restreint.");
        j.expliquer("<p>Le principe fondamental est la <b>gradation des niveaux de propreté et de contrôle des accès</b>. Zone publique : accueil, attente, circulation générale. Zone semi-restreinte : circulation du personnel, transfert des patients, locaux de préparation, stockage. Zone restreinte : salles d'opération, certaines zones de préparation stérile, espaces directement associés à l'intervention.</p>");
        j.suite();
      }
      bt.addEventListener("click", function () {
        var faux = 0;
        n.PIECES.forEach(function (p, i) { if (p.sas) return; if (p.choix !== p.z) { n.faux[i] = true; faux++; } });
        n.dessin();
        if (faux) { j.erreur(faux + (faux > 1 ? " pièces sont mal classées" : " pièce est mal classée") + " (bord rouge). Demande-toi qui peut y entrer : le public, le personnel en tenue, ou seulement l'équipe de l'intervention ?"); return; }
        gagner();
      });
      j.reponse(function () { n.PIECES.forEach(function (p) { p.choix = p.z; }); n.faux = {}; gagner(); });
    } },
    { nom: "Entrer dans la salle", jouer: function (j, n) {
      n.mode = "portes"; n.dessin();
      j.titre("D'après le FGI, depuis quelle zone accède-t-on à la salle d'opération ?");
      j.choix([
        { html: "Depuis la circulation générale, pour aller vite", aide: "On ne passe pas du public au restreint d'un coup : la gradation impose une étape." },
        { html: "Depuis une zone semi-restreinte", juste: true },
        { html: "Depuis une autre salle d'opération", aide: "Chaque salle est restreinte : on n'en traverse pas une pour aller dans l'autre." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La salle est une zone restreinte accessible depuis une zone semi-restreinte.");
        j.expliquer("<p>Le FGI classe la salle d'opération comme zone restreinte, accessible depuis une zone semi-restreinte, et exige des surfaces adaptées au nettoyage et à la désinfection. Sur le plan, les portes des salles s'ouvrent sur la circulation du personnel.</p>");
        j.suite();
      } });
    } },
    { nom: "Ce qui augmente", jouer: function (j, n) {
      j.titre("Du public au restreint, qu'est-ce qui augmente, d'après le principe du cours ?");
      j.choix([
        { html: "La taille des pièces", aide: "Une zone de préparation stérile peut être petite. Ce n'est pas la surface qui est graduée." },
        { html: "Le niveau de propreté et le contrôle des accès", juste: true },
        { html: "Le nombre de personnes présentes", aide: "C'est plutôt l'inverse : moins on est nombreux à entrer, mieux c'est. Qu'est-ce qu'on contrôle à chaque passage ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("Propreté et contrôle des accès, ensemble.");
        j.suite();
      } });
    } },
    { nom: "Le schéma fonctionnel", jouer: function (j, n) {
      n.mode = "schema"; n.schemaOk = false; n.dessin();
      j.titre("Complète le schéma fonctionnel général du bloc.");
      var L = [["Patients →", "p"], ["Personnel →", "v"], ["Logistique →", "r"], ["Réception →", "s"], ["Après les salles →", "w"]];
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center">' + L.map(function (x) { return "<b>" + x[0] + '</b><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "Stockage propre" }, { id: "w", html: "Réveil / SSPI" }, { id: "p", html: "Préparation" }, { id: "r", html: "Réception" }, { id: "v", html: "Vestiaires" }],
        aide: "Le patient est d'abord préparé, le personnel se change, la logistique est reçue puis stockée, et après la salle vient le réveil.",
        ok: function () {
          n.schemaOk = true; n.dessin();
          j.bravo("Patients et personnel convergent vers la zone semi-restreinte, puis la zone restreinte.");
          j.expliquer("<p>Le patient passe par la <b>préparation</b>, le personnel par les <b>vestiaires</b> ; tous deux entrent dans la zone semi-restreinte puis la zone restreinte, où sont les salles. Après l'intervention : réveil (SSPI), puis hospitalisation ou réanimation. La logistique a son propre chemin : réception, puis stockage propre.</p>");
          j.suite();
        }
      });
    } }
  ]
});
