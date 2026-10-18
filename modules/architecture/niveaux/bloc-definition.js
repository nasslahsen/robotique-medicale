/* Niveau : le bloc opératoire, définition et exigences (diapo 9), schéma global et idée centrale (diapos 75 et 76). */
NIVEAU({
  id: "bloc-definition",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "concentre", liens: [], choisi: -1, pl: { P: function (v) { return v; } } };
    n.ELEM = ["Patients à risque", "Actes invasifs", "Personnel nombreux", "Équipements biomédicaux complexes", "Médicaments et produits stériles", "Gaz médicaux", "Dispositifs électriques", "Systèmes de ventilation"];
    n.RISQ = ["Risques infectieux", "Risques électriques", "Risques incendie"];
    n.PIL = [["Fonctionnel", ["Flux", "Zonage"]], ["Technique", ["CVC", "Électricité", "Gaz médicaux", "Informatique"]], ["Sécurité", ["Incendie", "Évacuation", "Radioprotection"]]];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "concentre") {
        A.texte(g, "Ce que le bloc concentre", [190, 60], { taille: 17, coul: C.doux });
        A.texte(g, "Les risques", [545, 60], { taille: 17, coul: C.doux });
        n.ELEM.forEach(function (e, i) {
          var y = 82 + i * 62, sel = n.choisi === i, lie = n.liens.some(function (l) { return l[0] === i; });
          A.boite(g, 24, y, 330, 52, { fond: sel ? C.jeuPale : "#fff", bord: lie || sel ? C.jeu : C.trait, ep: lie || sel ? 3 : 2, rx: 10, titre: e, taille: 16, gras: 600 });
          A.cible(g, 24, y, 330, 52, function () { if (n.surElem) n.surElem(i); });
        });
        n.RISQ.forEach(function (r, k) {
          var y = 130 + k * 150, actif = n.risque === k, fait = n.liens.some(function (l) { return l[1] === k; });
          A.boite(g, 440, y, 216, 80, { fond: fait ? C.koPale : actif ? "#fff" : C.fond, bord: fait || actif ? C.ko : C.trait, ep: actif ? 3.5 : 2, titre: r, taille: 17, coul: fait || actif ? C.ko : C.gris });
        });
        n.liens.forEach(function (l) { A.fleche(g, [356, 108 + l[0] * 62], [438, 170 + l[1] * 150], { coul: C.ko, ep: 3.5 }); });
      } else if (n.mode === "projets") {
        [["Projet A", "Un plan d'architecte", 30], ["Projet B", "Un programme fonctionnel et technique", 350]].forEach(function (p, i) {
          var x = p[2], sel = n.projet === i;
          A.boite(g, x, 80, 300, 470, { fond: sel ? C.jeuPale : "#fff", bord: sel ? C.jeu : C.trait, ep: sel ? 3.5 : 2 });
          A.texte(g, p[0], [x + 150, 112], { taille: 22, gras: 800, halo: false });
          A.texte(g, p[1], [x + 150, 150], { taille: 16, coul: C.doux, largeur: 260, halo: false });
          if (i === 0) {
            // des murs, des portes, rien d'autre
            A.s("rect", { x: x + 40, y: 200, width: 220, height: 300, fill: "none", stroke: C.encre, "stroke-width": 6 }, g);
            A.s("line", { x1: x + 40, y1: 350, x2: x + 260, y2: 350, stroke: C.encre, "stroke-width": 4 }, g);
            A.s("line", { x1: x + 150, y1: 200, x2: x + 150, y2: 350, stroke: C.encre, "stroke-width": 4 }, g);
            [[x + 80, 350], [x + 190, 350], [x + 130, 500]].forEach(function (q) { A.s("line", { x1: q[0], y1: q[1], x2: q[0] + 34, y2: q[1], stroke: "#fff", "stroke-width": 8 }, g); });
            A.texte(g, "Salle", [x + 95, 275], { taille: 15, coul: C.doux, halo: false }); A.texte(g, "Salle", [x + 205, 275], { taille: 15, coul: C.doux, halo: false });
          } else {
            ["Activités et nombre de salles", "Flux patients, personnel, propre, sale", "Ventilation (CVC)", "Électricité et secours", "Fluides médicaux", "Équipements biomédicaux", "Plan des locaux"].forEach(function (t, k) {
              A.boite(g, x + 24, 192 + k * 49, 252, 40, { rx: 8, ep: 2, bord: C.trait, titre: t, taille: 14, gras: 600 });
            });
          }
          A.cible(g, x, 80, 300, 470, function () { if (n.surProjet) n.surProjet(i); });
        });
      } else {
        // schéma global à retenir
        var y0 = 70;
        n.PIL.forEach(function (p, i) {
          var x = 24 + i * 214, on = n.pilOk;
          A.boite(g, x, y0, 200, 150, { fond: on ? C.jeuPale : C.fond, bord: on ? C.jeu : C.trait, ep: 2 });
          A.texte(g, p[0], [x + 100, y0 + 24], { taille: 18, gras: 800, halo: false });
          if (on) A.texte(g, p[1].join(", "), [x + 100, y0 + 88], { taille: 15, largeur: 180, halo: false, coul: C.doux });
          A.fleche(g, [x + 100, y0 + 152], [340, y0 + 200], { coul: C.gris, ep: 3 });
        });
        A.boite(g, 200, y0 + 204, 280, 56, { fond: C.jeu, bord: C.jeu, titre: "Bloc opératoire", coul: "#fff", taille: 20 });
        A.fleche(g, [340, y0 + 262], [340, y0 + 290], { coul: C.gris, ep: 3 });
        A.boite(g, 60, y0 + 294, 560, 64, { fond: "#fff", bord: C.trait, titre: "Salle opératoire : patient, personnel, matériel", taille: 17 });
        A.fleche(g, [340, y0 + 360], [340, y0 + 388], { coul: C.gris, ep: 3 });
        A.boite(g, 60, y0 + 392, 560, 56, { fond: "#fff", bord: C.trait, titre: "Hygiène, sécurité, biomédical", taille: 17 });
        A.fleche(g, [340, y0 + 450], [340, y0 + 478], { coul: C.gris, ep: 3 });
        A.boite(g, 130, y0 + 482, 420, 56, { fond: C.encre, bord: C.encre, titre: "Qualité et continuité des soins", coul: "#fff", taille: 18 });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La définition", jouer: function (j, n) {
      j.titre("Complète la définition du bloc opératoire donnée au cours.");
      var z = j.zone("", '<p style="font-size:20px;line-height:2.4">Le bloc opératoire est une unité fonctionnelle <span class="trou" data-attendu="a"></span> destinée à réaliser des <span class="trou" data-attendu="b"></span> dans un <span class="trou" data-attendu="c"></span>.</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "environnement maîtrisé" }, { id: "x", html: "polyvalente" }, { id: "b", html: "interventions chirurgicales" }, { id: "y", html: "environnement ouvert" }, { id: "a", html: "hautement spécialisée" }, { id: "z", html: "consultations" }],
        aide: "Le bloc ne fait qu'une chose, la chirurgie, et il le fait dans un milieu dont on contrôle tout : air, surfaces, accès.",
        ok: function () {
          j.bravo("Une unité hautement spécialisée, des interventions chirurgicales, un environnement maîtrisé.");
          j.expliquer("<p>« Environnement maîtrisé » résume tout le cours : on maîtrise qui entre (zones), ce qui circule (flux), l'air (ventilation), l'énergie (électricité de secours), les gaz, les surfaces.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Des risques concentrés", jouer: function (j, n) {
      j.titre("Le bloc concentre aussi trois risques. Pour chacun, touche ce qui le crée.");
      var k = 0, BON = [[0, 1], [6], [5]], p = j.zone("consigne", "");
      function poser() { n.risque = k; n.dessin(); p.innerHTML = "<b>" + n.RISQ[k] + "</b> : d'où viennent-ils surtout ?"; }
      poser();
      n.surElem = function (i) {
        if (k > 2) return;
        if (BON[k].indexOf(i) < 0) {
          n.choisi = i; n.dessin();
          j.erreur(k === 0 ? "Le risque infectieux naît là où l'on ouvre le corps, chez un patient fragile." : k === 1 ? "Cherche ce qui est branché sur le secteur, sur un patient anesthésié." : "Pense à ce qui entretient une flamme : un gaz du bloc le fait très bien.");
          return;
        }
        n.choisi = -1; n.liens.push([i, k]); k++;
        if (k < 3) { j.info("Oui. Risque suivant."); poser(); return; }
        n.risque = -1; n.dessin(); n.surElem = null;
        j.bravo("Actes invasifs, dispositifs électriques, gaz médicaux.");
        j.expliquer("<p>Le bloc concentre des patients à risque, des actes invasifs, un personnel nombreux, des équipements biomédicaux complexes, des médicaments et produits stériles, des gaz médicaux, des dispositifs électriques, des systèmes de ventilation, et donc des risques infectieux, électriques et incendie. L'oxygène, par exemple, est cité au cours parmi les risques incendie.</p>");
        j.suite();
      };
      j.reponse(function () { while (n.surElem && k < 3) n.surElem(BON[k][0]); });
    } },
    { nom: "Programme ou plan ?", jouer: function (j, n) {
      n.mode = "projets"; n.projet = -1; n.dessin();
      j.titre("Deux équipes démarrent la conception d'un bloc. Laquelle part dans le bon sens ? Touche son projet.");
      n.surProjet = function (i) {
        if (i === 0) { n.projet = 0; n.dessin(); j.erreur("Un plan dit où sont les murs, pas ce qui doit se passer dans les salles ni ce qu'elles doivent alimenter."); return; }
        n.projet = 1; n.dessin(); n.surProjet = null;
        j.bravo("On part du programme fonctionnel et technique.");
        j.consigne("Pourquoi ?");
        j.choix([
          { html: "Parce que le plan n'a pas d'importance", aide: "Le plan reste indispensable : il vient après, pour traduire le programme." },
          { html: "Parce que les activités, les flux et les réseaux décident de la surface, du volume et de la place des locaux", juste: true },
          { html: "Parce qu'un programme coûte moins cher qu'un plan", aide: "Le cours ne parle pas de coût ici : il parle de ce qui décide de la forme du bloc." }
        ], { colonnes: 1, ok: function () {
          j.bravo("Le besoin d'abord, la forme ensuite.");
          j.expliquer("<p>Le cours le dit ainsi : la conception doit être réalisée à partir d'un <b>programme fonctionnel et technique</b>, et non simplement à partir d'un plan architectural. Tu retrouveras cet ordre dans la méthode en dix étapes : besoins, programme, flux, zonage, puis architecture.</p>");
          j.suite();
        } });
      };
      j.reponse(function () { if (n.surProjet) n.surProjet(1); });
    } },
    { nom: "Le schéma global", jouer: function (j, n) {
      n.mode = "global"; n.pilOk = false; n.dessin();
      j.titre("Le schéma global du cours repose sur trois piliers. Range chaque élément sous son pilier.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"><b>Fonctionnel</b><b>Technique</b><b>Sécurité</b>' +
        '<span class="trou" data-attendu="f"></span><span class="trou" data-attendu="t"></span><span class="trou" data-attendu="s"></span>' +
        '<span class="trou" data-attendu="f"></span><span class="trou" data-attendu="t"></span><span class="trou" data-attendu="s"></span>' +
        '<span></span><span class="trou" data-attendu="t"></span><span class="trou" data-attendu="s"></span><span></span><span class="trou" data-attendu="t"></span><span></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "t", html: "CVC" }, { id: "s", html: "Incendie" }, { id: "f", html: "Flux" }, { id: "t", html: "Électricité" }, { id: "s", html: "Radioprotection" }, { id: "f", html: "Zonage" }, { id: "t", html: "Gaz médicaux" }, { id: "s", html: "Évacuation" }, { id: "t", html: "Informatique" }],
        aide: "Fonctionnel : comment on circule et où. Technique : les réseaux qui alimentent. Sécurité : ce qui protège d'un danger.",
        ok: function () {
          n.pilOk = true; n.dessin();
          j.bravo("Fonctionnel, technique, sécurité convergent vers le bloc.");
          j.expliquer("<p>Les trois piliers se rejoignent dans le bloc, puis dans la salle opératoire (patient, personnel, matériel), sous les exigences d'hygiène, de sécurité et de biomédical. Le but final : la <b>qualité et la continuité des soins</b>.</p>");
          j.suite();
        }
      });
    } },
    { nom: "L'idée centrale", jouer: function (j, n) {
      j.titre("Un étudiant résume le cours : « Un bloc performant, c'est une salle bien équipée. » Que lui réponds-tu ?");
      j.choix([
        { html: "C'est juste : l'équipement fait la performance", aide: "Un robot dernier cri dans une salle sans secours électrique ni accès de maintenance ne sert à rien." },
        { html: "C'est incomplet : c'est un système intégré associant architecture, flux, ventilation, électricité, fluides médicaux, équipements biomédicaux, hygiène, sécurité et maintenance", juste: true },
        { html: "C'est faux : seule l'architecture compte", aide: "Le cours insiste sur l'inverse : aucun métier ne suffit seul." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Un système intégré, pas seulement une salle équipée.");
        j.expliquer("<p>C'est l'idée centrale du cours : un bloc opératoire performant n'est pas seulement une salle équipée ; c'est un système intégré associant architecture, flux, ventilation, électricité, fluides médicaux, équipements biomédicaux, hygiène, sécurité et maintenance.</p>");
        j.suite();
      } });
    } }
  ]
});
