/* Niveau : position centrale d'un DPP au sein d'un SIS, projet de portail national de santé (S1S2, diapo 56). */
NIVEAU(SIS.rejouable({
  id: "dpp-national",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.B = {
      pub: { t: "SIH publics", sous: "Hosix, Enova, DxCare, Bilmedical", x: 20, y: 20, w: 310, h: 90 },
      priv: { t: "SI du secteur privé", sous: "cliniques, cabinets", x: 350, y: 20, w: 310, h: 90 },
      plat: { t: "Plateforme d'échange santé", sous: "HL7, HL7 FHIR, HL7 CDA, IHE, XDS, DICOM ISO 12052", x: 20, y: 150, w: 640, h: 90 },
      ident: { t: "Serveur d'identification du patient", sous: "carte nationale d'identité électronique", x: 20, y: 280, w: 300, h: 100 },
      dpp: { t: "Base de consolidation santé", sous: "dossier patient partagé", x: 360, y: 280, w: 300, h: 100 },
      port: { t: "Portail patient, portail professionnel, systèmes BI", x: 20, y: 420, w: 640, h: 70 },
      user: { t: "Citoyen, médecin privé, MSPS", x: 120, y: 520, w: 440, h: 60 }
    };
    n.CLES = ["pub", "priv", "plat", "ident", "dpp", "port", "user"];
    n.schema = function (g2, etat) {
      [["pub", "plat"], ["priv", "plat"], ["plat", "ident"], ["plat", "dpp"], ["ident", "port"], ["dpp", "port"], ["port", "user"]].forEach(function (l) { A.relier(g2, n.B[l[0]], n.B[l[1]], { ep: 3, coul: C.doux, double: true }); });
      n.CLES.forEach(function (k, i) {
        var b = n.B[k], ok = etat && etat.trouve[i], f = etat && etat.faux === i;
        A.boite(g2, b.x, b.y, b.w, b.h, { titre: b.t, sous: b.sous, taille: 17, tailleSous: 13, fond: ok ? C.jeuPale : f ? C.koPale : k === "plat" ? C.accPale : "#fff", bord: ok ? C.jeu : f ? C.ko : k === "plat" ? C.acc : C.encre, ep: ok ? 4 : 2.5 });
      });
    };
    return n;
  },
  etapes: [
    { nom: "Le compte rendu de la clinique", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Une clinique privée produit un compte rendu. Touche, dans l'ordre, les étapes qui l'amènent jusqu'au patient, chez lui.");
      var nd = n.CLES.filter(function (k) { return k !== "ident"; }).map(function (k) { var b = n.B[k]; return { t: b.t, sous: b.sous, x: b.x, y: b.y, w: b.w, h: b.h }; });
      // nd : pub, priv, plat, dpp, port, user
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [1, 2, 3, 4, 5], coul: C.jeu, taille: 17, fleches: true,
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "Le compte rendu naît dans le SI de la clinique." : ["", "Pour sortir de la clinique, il passe par l'échange commun.", "Il est consolidé dans le dossier partagé.", "On le consulte à travers un portail.", "Au bout : le citoyen."][k]; },
        fin: function () { j.bravo("SI privé → plateforme d'échange → DPP → portail patient → citoyen."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Le bon patient", jouer: function (j, n) {
      j.titre("Deux dossiers arrivent : l'un du CHU, l'autre d'une clinique. Touche le composant qui garantit qu'ils concernent bien la même personne.");
      var r = SIS.reperer({ g: n.g, zones: n.CLES.map(function (k) { var b = n.B[k]; return { x: b.x, y: b.y, w: b.w, h: b.h, bon: k === "ident" }; }), dessiner: n.schema,
        erreur: j.erreur, aide: function () { return "Cherche le composant relié à la carte d'identité."; },
        fin: function () { j.bravo("Le serveur d'identification, appuyé sur la carte nationale d'identité électronique."); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Les images", jouer: function (j, n) {
      j.titre("Sur la plateforme d'échange, quel standard porte les images médicales ?");
      j.choix([{ html: "DICOM ISO 12052", juste: true }, { html: "HL7 FHIR", aide: "FHIR transporte des ressources (observations, patients...), pas les images elles-mêmes." }, { html: "XDS", aide: "XDS sert au partage de documents. Le standard des images est un autre." }], { colonnes: 3, ok: function () { j.bravo("DICOM (ISO 12052) pour l'imagerie."); j.suite(); } });
    } },
    { nom: "Pourquoi au centre ?", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["base", "ecran", "personne"], titre: "Le DPP dans le portail national" });
      j.titre("Pourquoi le cours parle-t-il de la position centrale du DPP au sein d'un SIS ?");
      j.choix([
        { html: "Il rassemble les données des établissements publics et privés, et les rend accessibles au citoyen, aux médecins et au ministère", juste: true },
        { html: "Il remplace tous les SIH des hôpitaux", aide: "Les SIH restent en place en haut du schéma : le DPP les relie." },
        { html: "Il ne sert qu'à facturer les actes", aide: "Le DPP consolide le dossier médical, pas la facturation." }
      ], { colonnes: 1, ok: function () { j.bravo("Il relie tous les producteurs et tous les utilisateurs de l'information de santé."); j.suite(); } });
    } }
  ]
}));
