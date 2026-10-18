/* Niveau : panorama des SIH au Maroc, éditeur par région (S1S2, diapo 42). Carte schématique : une tuile par région. */
NIVEAU(SIS.rejouable({
  id: "sih-maroc",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.ED = SIS.EDITEURS;
    n.carte = function (g2, cache, faux) { SIS.carteMaroc(g2, { cache: cache, faux: faux, legende: !cache }); };
    return n;
  },
  etapes: [
    { nom: "Combien d'éditeurs ?", jouer: function (j, n) {
      SIS.vider(n.g); n.carte(n.g, false);
      j.titre("Cette carte schématique reprend celle du cours : chaque région et l'éditeur de son SIH. Combien d'éditeurs se partagent les douze régions ?");
      j.nombre({ cases: [{ attendu: 4 }], apres: "\\text{ éditeurs}", aide: function () { return "Compte les couleurs de la légende."; }, ok: function () {
        j.bravo("Quatre : Enova, Sivsa, Belmed, Dedalus.");
        j.suite();
      } });
    } },
    { nom: "Le plus répandu", jouer: function (j, n) {
      j.titre("Quel éditeur équipe le plus de régions ?");
      j.choix([
        { html: "Enova", juste: true },
        { html: "Sivsa", aide: "Compte les régions rouges, puis les vertes." },
        { html: "Belmed", aide: "Belmed n'a que deux régions." },
        { html: "Dedalus", aide: "Dedalus n'a qu'une région." }
      ], { colonnes: 2, ok: function () { j.bravo("Enova : cinq régions, dont tout le sud."); j.suite(); } });
    } },
    { nom: "Retrouver la région", jouer: function (j, n) {
      var A = SIS, cible = A.REGIONS.findIndex(function (r) { return r.n === "Rabat-Salé-Kénitra"; });
      j.titre("Une seule région est équipée par Dedalus. Touche-la.");
      var r = A.reperer({ g: n.g, zones: A.REGIONS.map(function (rg, i) { return { x: rg.x, y: rg.y, w: rg.w, h: rg.h, bon: i === cible }; }),
        dessiner: function (g2, e) { n.carte(g2, false, e.faux); },
        erreur: j.erreur, aide: function () { return "Cherche la seule tuile bleue."; },
        fin: function () { j.bravo("Rabat-Salé-Kénitra."); j.suite(); } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Le patient transféré", jouer: function (j, n) {
      SIS.vider(n.g); n.carte(n.g, false);
      j.titre("Un patient est soigné à Fès (Sivsa), puis transféré à Rabat (Dedalus). Quel défi cette carte révèle-t-elle ?");
      j.choix([
        { html: "Faire échanger des SIH d'éditeurs différents : l'interopérabilité", juste: true },
        { html: "Aucun : tous les SIH du pays sont le même logiciel", aide: "Regarde les couleurs de Fès-Meknès et de Rabat-Salé-Kénitra." },
        { html: "Il faut ressaisir le dossier à la main, c'est inévitable", aide: "Le cours montre justement des plateformes d'échange (HL7, FHIR...) pour éviter cela." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Quatre éditeurs : il faut des standards d'échange communs.");
        j.expliquer("<p>C'est tout l'enjeu de la partie 2 du cours (architectures techniques et interopérabilité des SIH / SIS), et du dossier patient partagé national qu'on verra au chapitre 5.</p>");
        j.suite();
      } });
    } }
  ]
}));
