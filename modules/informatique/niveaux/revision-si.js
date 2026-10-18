/* Révision du chapitre 1 : DM et logiciel, DIKW, système, SI et vues, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-si",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g, fig: fig };
  },
  etapes: [
    { nom: "L'oxymètre", jouer: function (j, n) {
      var A = SIS;
      j.titre("Un oxymètre de pouls se pince au doigt. Range chaque élément : matériel ou logiciel ?");
      var t = A.trier({
        g: n.g,
        cartes: [{ t: "Pince avec LED et photodétecteur", bac: 0 }, { t: "Calcul de la SpO2 à partir de la lumière absorbée", bac: 1 }, { t: "Mesure brute de la lumière reçue", bac: 0 }, { t: "Alarme quand la SpO2 passe sous le seuil", bac: 1 }],
        bacs: [{ t: "DM (matériel)", sous: "le corps" }, { t: "Software", sous: "l'intelligence" }],
        pos: A.grille(4, 2, 30, 60, 620, 110, 22), bacsPos: function (k) { return { x: 30 + k * 325, y: 400, w: 295, h: 150 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return i % 2 === 0 ? "Physique et acquisition de la donnée brute : c'est le corps du système." : "Calculer, décider de prévenir : c'est l'intelligence du système."; },
        fin: function () { j.bravo("Capteur et mesure brute : le DM. Calcul et alarme : le logiciel."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Quel étage ?", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 40, 180, 600, 200, { titre: "« Sur cette IRM du genou de M. Idrissi, l'aspect du ligament signe une rupture : il faut l'opérer. »", taille: 21, fond: C.fond, bord: C.trait, gras: 600 });
      j.titre("Le radiologue écrit cette phrase. À quel étage de la pyramide DIKW se place-t-elle ?");
      j.choix([
        { html: "Données", aide: "Une donnée est un fait brut, sans sens. Cette phrase interprète et conclut." },
        { html: "Informations", aide: "Une information est une donnée organisée. Ici, on va plus loin : on interprète pour décider." },
        { html: "Connaissance", juste: true }
      ], { colonnes: 3, ok: function () { j.bravo("Connaissance : des informations interprétées par l'intelligence du radiologue."); j.suite(); } });
    } },
    { nom: "Pas un système", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["document", "engrenage"], titre: "Système ou pas ?" });
      j.titre("Lequel de ces exemples n'est pas un système au sens du cours ?");
      j.choix([
        { html: "Le circuit du médicament : prescription, dispensation, administration", aide: "Des éléments reliés, organisés, avec un but : soigner. C'est un système." },
        { html: "Une pile de comptes rendus en vrac, sans classement ni destinataire", juste: true },
        { html: "Le réseau des laboratoires d'une région qui partagent leurs résultats", aide: "Des éléments en interaction, organisés autour d'un but : c'est un système." }
      ], { colonnes: 1, ok: function () { j.bravo("Sans organisation ni but : c'est le désordre, le contraire d'un système."); j.suite(); } });
    } },
    { nom: "Quelle vue ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["reseau", "ecran"], titre: "Du wifi dans tous les services" });
      j.titre("La direction décide d'installer un réseau wifi dans tous les services. Dans quelle vue du SI se place ce chantier ?");
      j.choix([
        { html: "Vue métier", aide: "La vue métier décrit les processus. Le wifi n'est pas une activité de soin." },
        { html: "Vue fonctionnelle", aide: "La vue fonctionnelle décrit l'organisation. Le wifi est un équipement." },
        { html: "Vue application", aide: "La vue application décrit les composants logiciels." },
        { html: "Vue technique", juste: true }
      ], { colonnes: 2, ok: function () { j.bravo("Vue technique : l'infrastructure."); j.suite(); } });
    } },
    { nom: "L'hôpital de 1980", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "personne"], titre: "1980 : dossiers papier, fiches, courrier", sous: "aucun ordinateur" });
      j.titre("En 1980, cet hôpital n'avait aucun ordinateur : dossiers papier, fiches, courrier interne. Avait-il un système d'information ?");
      j.choix([
        { html: "Oui : du personnel, une organisation et des supports qui produisaient, stockaient et diffusaient l'information", juste: true },
        { html: "Non : un SI suppose des ordinateurs", aide: "Relis la définition : personnel, matériel, logiciel et organisation. Le système informatique n'est qu'une partie." }
      ], { colonnes: 1, ok: function () { j.bravo("Un SI peut exister sans informatique : c'est l'informatisation qui l'outille."); j.suite(); } });
    } }
  ]
}));
