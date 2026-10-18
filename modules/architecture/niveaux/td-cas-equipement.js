/* Niveau : TD 1, cas 4. Respirateur d'anesthésie indisponible ; mesures proposées à partir du cours (le TD ne donne pas de corrigé). */
NIVEAU(ARCHI.rejouable({
  id: "td-cas-equipement",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.dessin = function (etat) {
      A.vider(g); fig.chip(null);
      [["Salle 1", true], ["Salle 2", false], ["Salle 3", true]].forEach(function (s, i) {
        var x = 30 + i * 214, ok = s[1];
        A.boite(g, x, 80, 194, 220, { fond: ok ? "#fff" : C.koPale, bord: ok ? C.ok : C.ko, ep: 3 });
        A.texte(g, s[0], [x + 97, 108], { taille: 19, gras: 800, halo: false });
        A.icone(g, "air", [x + 97, 180], 60, ok ? C.ok : C.ko);
        A.texte(g, ok ? "respirateur disponible" : "respirateur indisponible", [x + 97, 250], { taille: 14, largeur: 180, coul: ok ? C.ok : C.ko, halo: false });
      });
      A.texte(g, "Programme du jour : urgences et interventions programmées (exemple ajouté)", [340, 340], { taille: 15, coul: C.doux, largeur: 600 });
      if (etat === "plan") {
        [["Urgence", 1, C.ko], ["Programmée", 3, C.acc], ["Programmée", 1, C.acc], ["Programmée reportée", null, C.gris]].forEach(function (p, k) {
          A.boite(g, 60 + k * 150, 390, 140, 70, { fond: "#fff", bord: p[2], titre: p[0], sous: p[1] ? "salle " + p[1] : "plus tard", taille: 15 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le premier réflexe", jouer: function (j, n) {
      j.titre("Le respirateur d'anesthésie de la salle 2 est indisponible, délai de réparation inconnu. Que fais-tu d'abord ?");
      j.choix([
        { html: "Retirer la salle 2 du programme tant qu'aucun respirateur conforme n'y est installé, et réorganiser l'activité", juste: true },
        { html: "Opérer quand même en salle 2 en surveillant de près", aide: "Le respirateur est un équipement critique : sans lui, on ne peut pas ventiler un patient anesthésié." },
        { html: "Annuler toutes les interventions du bloc", aide: "Deux salles restent fonctionnelles : on réorganise plutôt qu'on arrête tout." }
      ], { colonnes: 1, ok: function () { j.bravo("La sécurité du patient d'abord, la continuité ensuite."); j.suite(); } });
    } },
    { nom: "Réorganiser le programme", jouer: function (j, n) {
      n.dessin("plan");
      j.titre("Comment répartir le programme entre les salles 1 et 3 ?");
      j.choix([
        { html: "Priorité aux urgences, puis aux interventions programmées selon la place, en reportant ce qui peut l'être", juste: true },
        { html: "Dans l'ordre d'arrivée des demandes", aide: "Une urgence ne peut pas attendre son tour." },
        { html: "Toutes les interventions programmées d'abord, les urgences ensuite", aide: "C'est l'inverse : l'urgence passe en premier." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Urgences d'abord ; report des interventions qui le permettent.");
        j.expliquer("<p>Autres mesures proposées : chercher un respirateur de remplacement conforme, tracer la panne et la demande d'intervention dans la GMAO, informer les équipes, suivre le délai avec le fournisseur.</p>");
        j.suite();
      } });
    } },
    { nom: "Avant la remise en service", jouer: function (j, n) {
      n.dessin();
      j.titre("Le respirateur revient de réparation. Quelle information n'est pas nécessaire avant de le remettre en service ?");
      j.choix([
        { html: "Le rapport d'intervention et les pièces changées", aide: "Il est nécessaire : il dit ce qui a été fait." },
        { html: "Les essais de sécurité et de performance après réparation", aide: "Ils sont nécessaires : on vérifie avant d'utiliser sur un patient." },
        { html: "La vérification des raccordements aux gaz médicaux et à l'alimentation", aide: "Elle est nécessaire : le respirateur dépend des deux." },
        { html: "La couleur du chariot du respirateur", juste: true }
      ], { colonnes: 2, ok: function () {
        j.bravo("Rapport, essais, raccordements, puis enregistrement dans la GMAO.");
        j.expliquer("<p>On retrouve les responsabilités de l'ingénieur biomédical : vérification des alimentations et des gaz médicaux, réception technique, sécurité électrique, maintenance, GMAO, gestion du cycle de vie.</p>");
        j.suite();
      } });
    } }
  ]
}));
