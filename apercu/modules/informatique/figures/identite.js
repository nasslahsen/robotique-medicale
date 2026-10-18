/* Figure : le processus de création / vérification d'une identité, rejoué sur quatre cas. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-bpmn", {
    largeur: 680, hauteur: 600, titre: "Processus de création / vérification d'une identité",
    essai: "<strong>Essaie</strong> : choisis un cas. <strong>Observe</strong> : le chemin suivi s'allume, jusqu'à son issue."
  });
  var CAS = [
    { n: "Fiche trouvée avec la CIN", ch: "haut", fin: "haut", d: "la recherche trouve une fiche avec la même CIN et les données concordent : on sélectionne l'identité." },
    { n: "CIN incohérente", ch: "incoherent", fin: "milieu", d: "la fiche trouvée avec cette CIN ne concorde pas : on crée une nouvelle identité (et on signale l'anomalie)." },
    { n: "Aucun résultat", ch: "milieu", fin: "milieu", d: "première venue : on crée une nouvelle identité, enregistrée dans le SI." },
    { n: "Homonymes, date connue", ch: "bas", fin: "bas", d: "plusieurs résultats sans CIN ; la date de naissance permet de choisir : identité choisie." },
    { n: "Homonymes, date inconnue", ch: "vigil", fin: "vigil", d: "plusieurs résultats sans CIN et pas de date de naissance : identitovigilance." }
  ];
  var g = A.s("g", null, f.svg), b = R.boutons(f.reglages), bts = [];
  function montrer(k) {
    A.vider(g);
    var fin = {}; if (k >= 0) fin[CAS[k].fin] = "ok";
    A.bpmnIdentite(g, { fin: fin, chemin: k >= 0 ? CAS[k].ch : null });
    bts.forEach(function (x, i) { x.classList.toggle("actif", i === k); });
    f.direct.innerHTML = k >= 0 ? "<strong>" + CAS[k].n + "</strong> : " + CAS[k].d : "Choisis un cas sous la figure.";
  }
  CAS.forEach(function (c, k) { bts.push(R.bouton(b, c.n, function () { montrer(k); })); });
  montrer(-1);
})();
