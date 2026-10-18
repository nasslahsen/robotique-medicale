/* Boss du chapitre 7 : TD 1, partie V. Construire le schéma fonctionnel d'un bloc de taille moyenne et justifier ses choix. */
NIVEAU({
  id: "boss-td",
  init: function (fig) {
    var A = ARCHI, C = A.C, Z = A.ZONES, g = A.s("g", null, fig.svg);
    var ORDRE = [null, "publique", "semi", "restreinte"];
    var n = { libre: true, faux: {}, g: g, pl: { P: function (v) { return v; } } };
    n.P = [
      { t: "Accueil", x: 20, y: 40, w: 200, h: 110, z: "publique" }, { t: "Vestiaires", x: 240, y: 40, w: 200, h: 110, z: null },
      { t: "Préparation des patients", x: 460, y: 40, w: 200, h: 110, z: "semi" }, { t: "Couloir du bloc", x: 20, y: 170, w: 640, h: 70, z: "semi" },
      { t: "Salle d'opération", x: 20, y: 260, w: 300, h: 160, z: "restreinte" }, { t: "Stockage", x: 340, y: 260, w: 150, h: 160, z: "semi" },
      { t: "SSPI", x: 510, y: 260, w: 150, h: 160, z: "semi" }
    ];
    n.P.forEach(function (p) { p.choix = null; });
    n.plan = function () {
      A.vider(g); fig.chip(null);
      n.P.forEach(function (p, i) {
        if (!p.z) { A.boite(g, p.x, p.y, p.w, p.h, { fond: "#fff", bord: C.gris, ep: 2, rx: 6, tirets: "6 5", titre: p.t, sous: "passage", taille: 17, coul: C.doux }); return; }
        var st = p.choix ? Z[p.choix] : null;
        A.boite(g, p.x, p.y, p.w, p.h, { fond: st ? st.fond : "#fff", bord: n.faux[i] ? C.ko : st ? st.bord : C.gris, ep: n.faux[i] ? 4 : 2.5, rx: 6, titre: p.t, sous: st ? st.court : "à classer", taille: 17, coulSous: st ? st.texte : C.gris });
        A.cible(g, p.x, p.y, p.w, p.h, function () { if (!n.libre) return; p.choix = ORDRE[(ORDRE.indexOf(p.choix) + 1) % 4]; delete n.faux[i]; n.plan(); });
      });
      A.texte(g, "Bloc de taille moyenne (exemple ajouté)", [340, 470], { taille: 15, coul: C.doux });
    };
    n.plan();
    return n;
  },
  etapes: [
    { nom: "Les zones", jouer: function (j, n) {
      j.titre("Premier livrable du groupe : le schéma des zones. Classe chaque local.");
      var bt = E.h("button", "btn bleu", "Vérifier", j.el); bt.type = "button";
      function gagner() { n.libre = false; bt.remove(); n.plan(); j.bravo("Zones et accès contrôlés en place."); j.suite(); }
      bt.addEventListener("click", function () {
        var faux = 0;
        n.P.forEach(function (p, i) { if (p.z && p.choix !== p.z) { n.faux[i] = true; faux++; } });
        n.plan();
        if (faux) { j.erreur(faux + " local(aux) mal classé(s), bord rouge."); return; }
        gagner();
      });
      j.reponse(function () { n.P.forEach(function (p) { p.choix = p.z; }); n.faux = {}; gagner(); });
    } },
    { nom: "Le parcours patient", jouer: function (j, n) {
      j.titre("Deuxième livrable : le flux patient. Touche les étapes dans l'ordre, de l'hospitalisation à la sortie du bloc.");
      var nd = [{ t: "Salle d'opération", x: 380, y: 60, w: 260, h: 90 }, { t: "Réanimation ou hospitalisation", x: 40, y: 440, w: 260, h: 90 }, { t: "Hospitalisation", x: 40, y: 60, w: 260, h: 90 }, { t: "SSPI", x: 380, y: 300, w: 260, h: 90 }, { t: "Préparation", x: 40, y: 250, w: 260, h: 90 }];
      var t = ARCHI.trace({ g: n.g, noeuds: nd, ordre: [2, 4, 0, 3, 1], coul: ARCHI.C.patient, taille: 18, erreur: j.erreur,
        fin: function () { j.bravo("Hospitalisation → préparation → salle → SSPI → réanimation ou hospitalisation."); j.suite(); } });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Les besoins techniques", jouer: function (j, n) {
      ARCHI.vider(n.g);
      j.titre("Troisième livrable : les besoins techniques de la salle. Lequel n'a rien à faire dans cette liste ?");
      j.choix([
        { html: "Ventilation et électricité secourue", aide: "Ils sont demandés par le TD." },
        { html: "Équipotentialité et fluides médicaux", aide: "Ils sont demandés par le TD." },
        { html: "Informatique et sécurité incendie", aide: "Ils sont demandés par le TD." },
        { html: "Décoration murale", juste: true }
      ], { colonnes: 2, ok: function () { j.bravo("Ventilation, électricité secourue, équipotentialité, fluides médicaux, informatique, sécurité incendie."); j.suite(); } });
    } },
    { nom: "Norme, recommandation ou réglementation ?", jouer: function (j, n) {
      j.titre("Dernier livrable : justifier les choix en distinguant les sources. Range chaque référence.");
      var res = j.zone("", "");
      var S = [["IEC 60364-7-710 pour l'installation électrique", "n"], ["Plus de 22 ACH en conception (HIS 2026)", "r"], ["Règlement de sécurité incendie du pays", "l"], ["ISO 7396-1 pour les gaz médicaux", "n"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 220px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "r", html: "Recommandation professionnelle" }, { id: "n", html: "Norme applicable" }, { id: "l", html: "Exigence réglementaire locale" }, { id: "n", html: "Norme applicable" }],
        aide: "Une norme porte un numéro IEC ou ISO ; une recommandation vient d'une société savante (HIS) ; la réglementation locale dépend du pays.",
        ok: function () {
          j.bravo("Normes, recommandation, réglementation locale : trois statuts à ne pas confondre.");
          j.expliquer("<p>Consigne du TD : distinguer les exigences réglementaires locales, les normes applicables et les recommandations professionnelles, et préciser pour toute valeur le référentiel et le contexte d'application. Le dossier doit aussi contenir un plan de maintenance préventive et une check-list de validation avant ouverture.</p>");
          j.suite();
        }
      });
    } }
  ]
});
