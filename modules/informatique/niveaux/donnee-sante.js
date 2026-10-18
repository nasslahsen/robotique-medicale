/* Niveau : information personnelle de santé (ISO 27799) et critères de qualité CID (S1S2, diapos 44 et 45). */
NIVEAU(SIS.rejouable({
  id: "donnee-sante",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    // Triangle CID : trois côtés, l'information personnelle de santé au centre
    n.COTES = [
      { t: "Confidentialité", coul: C.ok, pale: C.okPale, a: [160, 560], b: [340, 250] },
      { t: "Intégrité", coul: C.turq, pale: C.turqPale, a: [340, 250], b: [520, 560] },
      { t: "Disponibilité", coul: C.ko, pale: C.koPale, a: [520, 560], b: [160, 560] }
    ];
    n.triangle = function (g2, k, faux) {
      var c = n.COTES[k], m = [(c.a[0] + c.b[0]) / 2, (c.a[1] + c.b[1]) / 2];
      A.s("line", { x1: c.a[0], y1: c.a[1], x2: c.b[0], y2: c.b[1], stroke: faux ? C.ko : c.coul, "stroke-width": 26, "stroke-linecap": "round", opacity: faux ? 0.5 : 0.9 }, g2);
      var off = k === 2 ? [0, 38] : k === 0 ? [-80, -10] : [80, -10];
      A.texte(g2, c.t, [m[0] + off[0], m[1] + off[1]], { taille: 19, gras: 800, coul: c.coul });
      if (k === 2) A.texte(g2, "Information personnelle de santé", [340, 465], { taille: 16, gras: 700, largeur: 170, halo: false });
    };
    n.zoneCote = function (k) { return [{ x: 70, y: 330, w: 190, h: 230 }, { x: 420, y: 330, w: 190, h: 230 }, { x: 160, y: 545, w: 360, h: 55 }][k]; };
    return n;
  },
  etapes: [
    { nom: "Information de santé ou pas ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("D'après la norme ISO 27799 citée au cours, range chaque élément : est-ce une information personnelle de santé ?");
      var cartes = [{ t: "Le numéro de dossier attribué à Mme Tazi", bac: 0 }, { t: "Le paiement de la consultation de M. Amrani", bac: 0 }, { t: "Le taux moyen d'occupation des lits en mars", bac: 1 }, { t: "Le résultat d'une prise de sang de Mme Tazi", bac: 0 }, { t: "Le médecin qui soigne M. Amrani", bac: 0 }, { t: "Les horaires d'ouverture de la cafétéria", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Oui", sous: "information personnelle de santé" }, { t: "Non" }],
        pos: A.grille(6, 2, 20, 20, 640, 84, 14), bacsPos: function (k) { return { x: 20 + k * 330, y: 340, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 1 ? "Peut-on relier cet élément à une personne identifiable et à sa santé ou ses soins ?" : "La norme inclut aussi le numéro qui identifie la personne, les paiements, les tests, et le professionnel qui la soigne."; },
        fin: function () {
          j.bravo("Tout ce qui touche une personne identifiable et ses soins en fait partie, même un numéro ou un paiement.");
          j.expliquer("<p>Une <b>information personnelle de santé</b> est une information relative à la santé physique ou mentale d'une personne identifiable. Elle inclut l'inscription pour les soins, les paiements et la légitimité à recevoir des soins, un numéro ou symbole qui identifie l'individu, toute information consignée lors des soins, les résultats de tests ou d'examens, et l'identification du professionnel qui la soigne (extrait de la norme ISO 27799).</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le triangle", jouer: function (j, n) {
      var A = SIS;
      j.titre("Trois incidents dans un hôpital. Range chacun sur le côté du triangle qu'il attaque.");
      var cartes = [{ t: "Le potassium de M. Lahlou passe de 3,5 à 5,3 par erreur de saisie", bac: 1 }, { t: "Un agent curieux ouvre le dossier d'une célébrité", bac: 0 }, { t: "Le DPI est inaccessible pendant deux heures", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.COTES.map(function (c) { return { t: c.t }; }),
        pos: function (i) { return { x: 14 + i * 222, y: 14, w: 208, h: 180 }; },
        bacsPos: n.zoneCote, dessinBac: n.triangle,
        couleurs: function (k) { return n.COTES[k]; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["La donnée est devenue fausse.", "La donnée a été vue par quelqu'un qui n'avait pas à la voir.", "La donnée existe, juste, mais personne ne peut y accéder."][i]; },
        fin: function () {
          j.bravo("Intégrité, confidentialité, disponibilité.");
          j.expliquer("<p>Les trois critères de qualité de l'information personnelle de santé : <b>confidentialité</b>, <b>intégrité</b>, <b>disponibilité</b>. Le cours ajoute la maintenabilité, l'évolutivité, la traçabilité.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Pourquoi c'est grave", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["tube", "alerte"], titre: "Potassium : 3,5 saisi 5,3", sous: "une valeur fausse mais plausible" });
      j.titre("Le cours insiste : l'information personnelle de santé impacte la décision médicale. Que risque-t-on avec le potassium à 5,3 au lieu de 3,5 ?");
      j.choix([
        { html: "Un traitement donné pour une hyperkaliémie qui n'existe pas, et un vrai manque de potassium non corrigé", juste: true },
        { html: "Rien : le médecin verra tout de suite l'erreur", aide: "5,3 est une valeur plausible : rien ne la signale comme fausse." },
        { html: "Seulement un problème de facturation", aide: "Le potassium guide un traitement. Pense à la décision médicale." }
      ], { colonnes: 1, ok: function () { j.bravo("Une donnée fausse mais plausible mène à une mauvaise décision."); j.suite(); } });
    } },
    { nom: "Les autres critères", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "horloge"], titre: "Une prescription modifiée la nuit", sous: "qui, et quand ?" });
      SIS.vider(n.g);
      j.titre("Une prescription a été modifiée la nuit. Le médecin veut savoir qui l'a changée, et quand. Quel critère du cours répond à ce besoin ?");
      j.choix([
        { html: "La maintenabilité", aide: "La maintenabilité concerne la facilité à faire évoluer et corriger le système." },
        { html: "L'évolutivité", aide: "L'évolutivité concerne la capacité à grandir et à changer." },
        { html: "La traçabilité", juste: true }
      ], { colonnes: 3, ok: function () { j.bravo("La traçabilité garde qui a fait quoi, et quand."); j.suite(); } });
    } }
  ]
}));
