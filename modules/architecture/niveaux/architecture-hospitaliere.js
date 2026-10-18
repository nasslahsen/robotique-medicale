/* Niveau : ce que l'architecture hospitalière organise (diapos 2 à 7). Douze éléments, objectif général, équipe de conception, place du bloc. */
NIVEAU({
  id: "architecture-hospitaliere",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "tuiles", trouves: {}, libre: true, place: null, pl: { P: function (v) { return v; } } };
    // Les douze éléments du cours (diapos 2 et 3) et trois intrus
    n.TUILES = [
      { t: "Les patients", ic: "patient", ok: true }, { t: "Les professionnels de santé", ic: "personne", ok: true },
      { t: "Le tarif des consultations", ic: "boite", ok: false, aide: "Le tarif est une décision de gestion : aucun mur, aucune gaine ne l'organise." },
      { t: "Les flux propres et sales", ic: "poubelle", ok: true }, { t: "Les équipements médicaux", ic: "ecran", ok: true },
      { t: "Les fluides médicaux", ic: "goutte", ok: true }, { t: "L'électricité et les systèmes de secours", ic: "eclair", ok: true },
      { t: "Le diagnostic du médecin", ic: "personne", ok: false, aide: "Le diagnostic est un acte médical. L'architecture prépare le local, pas la décision." },
      { t: "La ventilation et la qualité de l'air", ic: "air", ok: true }, { t: "Les déchets", ic: "poubelle", ok: true },
      { t: "La logistique", ic: "boite", ok: true }, { t: "La sécurité incendie", ic: "feu", ok: true },
      { t: "Le planning des gardes", ic: "equipe", ok: false, aide: "Le planning est une organisation du personnel, pas une contrainte de construction." },
      { t: "La maintenance", ic: "cle", ok: true }, { t: "L'hygiène et la prévention des infections", ic: "bouclier", ok: true }
    ];
    // Plan d'hôpital simplifié : services et emplacements possibles du bloc
    n.SERVICES = [
      { t: "Urgences", x: 30, y: 150, w: 170, h: 120 }, { t: "Réanimation", x: 30, y: 290, w: 170, h: 120 },
      { t: "Imagerie", x: 30, y: 430, w: 170, h: 130 }, { t: "Consultations", x: 480, y: 150, w: 170, h: 120 },
      { t: "Administration", x: 480, y: 430, w: 170, h: 130 }
    ];
    n.EMPL = [
      { id: "a", x: 230, y: 290, w: 160, h: 130, juste: true },
      { id: "b", x: 405, y: 160, w: 60, h: 140, aide: "Ici, le bloc serait au milieu du hall : proche de tout, mais traversé par la circulation générale de l'hôpital." },
      { id: "c", x: 480, y: 290, w: 170, h: 120, aide: "Trop loin des urgences, de la réanimation et de l'imagerie : chaque transfert traverserait tout l'hôpital." }
    ];
    n.dessin = function () {
      A.vider(g);
      if (n.mode === "tuiles") {
        n.TUILES.forEach(function (t, i) {
          var x = 20 + (i % 3) * 220, y = 74 + Math.floor(i / 3) * 104, f = n.trouves[i];
          var b = A.boite(g, x, y, 200, 92, { fond: f ? C.jeuPale : "#fff", bord: f ? C.jeu : C.trait, ep: f ? 3 : 2 });
          A.icone(b, t.ic, [x + 30, y + 46], 32, f ? C.jeu : C.doux);
          A.texte(b, t.t, [x + 122, y + 46], { taille: 16, largeur: 140, halo: false, coul: f ? C.encre : C.doux });
          A.cible(g, x, y, 200, 92, function () { if (n.surTuile) n.surTuile(i); });
        });
        fig.chip(Object.keys(n.trouves).length + " / 12");
      } else if (n.mode === "objectif") {
        fig.chip(null);
        A.texte(g, "Un environnement qui permet", [340, 90], { taille: 22, gras: 700 });
        [["Le bon soin", "personne"], ["au bon endroit", "lit"], ["dans des conditions sûres", "bouclier"], ["avec des flux maîtrisés", "air"], ["une continuité de fonctionnement", "eclair"]].forEach(function (e, i) {
          var y = 130 + i * 90, ok = n.nObjectif > i;
          A.boite(g, 90, y, 500, 70, { fond: ok ? C.jeuPale : "#fff", bord: ok ? C.jeu : C.trait, tirets: ok ? null : "8 6" });
          A.icone(g, e[1], [134, y + 35], 34, ok ? C.jeu : C.gris);
          A.texte(g, ok ? e[0] : "?", [370, y + 35], { taille: 21, coul: ok ? C.encre : C.gris, halo: false });
          if (i < 4) A.texte(g, "+", [340, y + 80], { taille: 26, coul: C.doux });
        });
      } else if (n.mode === "equipe") {
        fig.chip(null);
        A.boite(g, 230, 250, 220, 100, { fond: C.jeuPale, bord: C.jeu, titre: "Conception de l'établissement", taille: 19 });
        [["Architectes", "boite", [130, 130]], ["Ingénieurs", "cle", [550, 130]], ["Exploitants", "equipe", [130, 470]], ["Prévention des infections", "bouclier", [550, 470]]].forEach(function (e, i) {
          var on = n.nEquipe > i;
          A.fleche(g, e[2], [e[2][0] < 340 ? 250 : 430, e[2][1] < 300 ? 262 : 338], { coul: on ? C.jeu : C.pale, ep: 4 });
          A.boite(g, e[2][0] - 105, e[2][1] - 50, 210, 100, { fond: "#fff", bord: on ? C.jeu : C.trait, ep: on ? 3 : 2 });
          A.icone(g, e[1], [e[2][0], e[2][1] - 16], 34, on ? C.jeu : C.gris);
          A.texte(g, e[0], [e[2][0], e[2][1] + 24], { taille: 16, largeur: 190, halo: false, coul: on ? C.encre : C.gris });
        });
      } else {
        fig.chip(null);
        // plan simplifié : hall public au centre, services autour
        A.boite(g, 20, 70, 640, 40, { fond: A.ZONES.publique.fond, bord: A.ZONES.publique.bord, ep: 2, rx: 8, titre: "Entrée publique et hall", taille: 15, coul: C.doux });
        A.s("rect", { x: 405, y: 120, width: 60, height: 460, fill: A.ZONES.publique.fond }, g);
        A.texte(g, "Circulation générale", [435, 360], { taille: 14, coul: C.doux, halo: false }).setAttribute("transform", "rotate(-90 435 360)");
        n.SERVICES.forEach(function (sv) { A.boite(g, sv.x, sv.y, sv.w, sv.h, { titre: sv.t, fond: "#fff", bord: C.encre, taille: 17 }); });
        n.EMPL.forEach(function (e) {
          var choisi = n.place === e.id;
          if (e.id === "b") return;
          A.boite(g, e.x, e.y, e.w, e.h, { fond: choisi ? C.jeuPale : "#fff", bord: choisi ? C.jeu : C.gris, tirets: choisi ? null : "9 7", ep: choisi ? 3.5 : 2.5, titre: choisi ? "Bloc opératoire" : e.id.toUpperCase(), taille: choisi ? 17 : 26, coul: choisi ? C.encre : C.gris });
          A.cible(g, e.x, e.y, e.w, e.h, function () { if (n.surPlace) n.surPlace(e); });
        });
        var b = n.EMPL[1], choisiB = n.place === "b";
        A.s("circle", { cx: b.x + 30, cy: b.y + 70, r: 34, fill: choisiB ? C.jeuPale : "#fff", stroke: choisiB ? C.jeu : C.gris, "stroke-width": 2.5, "stroke-dasharray": choisiB ? null : "9 7" }, g);
        A.texte(g, choisiB ? "Bloc" : "B", [b.x + 30, b.y + 70], { taille: choisiB ? 15 : 26, coul: choisiB ? C.encre : C.gris, halo: false });
        A.cible(g, b.x - 10, b.y + 30, 80, 80, function () { if (n.surPlace) n.surPlace(b); });
        if (n.sterile) {
          A.boite(g, 610, 535, 44, 28, { fond: C.koPale, bord: C.ko, ep: 2.5, rx: 6 });
          A.texte(g, "Stérilisation", [585, 548], { taille: 14, ancre: "end", coul: C.ko });
        }
        if (n.place === "a") {
          [[200, 210, 245, 300], [200, 350, 230, 355], [200, 490, 245, 410]].forEach(function (f) { A.fleche(g, [f[0], f[1]], [f[2], f[3]], { coul: C.jeu, ep: 5 }); });
        }
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Ce que l'architecture organise", jouer: function (j, n) {
      j.titre("Un hôpital, ce n'est pas que des locaux de soins. Touche tout ce que son architecture doit organiser.");
      j.consigne("Douze éléments à trouver. Trois intrus se cachent dans la grille.");
      var fini = false;
      n.surTuile = function (i) {
        var t = n.TUILES[i];
        if (fini || n.trouves[i]) return;
        if (!t.ok) { j.erreur(t.aide); return; }
        n.trouves[i] = true; n.dessin();
        if (Object.keys(n.trouves).length === 12) {
          fini = true; n.surTuile = null;
          j.bravo("Les douze, sans les intrus.");
          j.expliquer("<p>L'architecture hospitalière organise <b>simultanément</b> les personnes (patients, professionnels de santé), les flux propres et sales, les équipements, les fluides médicaux, l'électricité et les secours, la ventilation, les déchets, la logistique, la sécurité incendie, la maintenance, l'hygiène et la prévention des infections. Un oubli dans une seule de ces couches se paie pendant toute la vie du bâtiment.</p>");
          j.suite();
        }
      };
      j.reponse(function () { n.TUILES.forEach(function (t, i) { if (t.ok && !n.trouves[i] && n.surTuile) n.surTuile(i); }); });
    } },
    { nom: "L'objectif général", jouer: function (j, n) {
      n.mode = "objectif"; n.nObjectif = 0; n.dessin();
      j.titre("Recompose l'objectif général de l'architecture hospitalière, dans l'ordre du cours.");
      var z = j.zone("", '<div style="display:grid;gap:8px">' + [1, 2, 3, 4, 5].map(function (k) { return '<div style="display:flex;align-items:center;gap:10px"><b class="mono">' + k + '</b><span class="trou" style="flex:1" data-attendu="o' + k + '"></span></div>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "o4", html: "avec des flux maîtrisés" }, { id: "o1", html: "Le bon soin" }, { id: "x", html: "au moindre coût" }, { id: "o5", html: "une continuité de fonctionnement" }, { id: "o3", html: "dans des conditions sûres" }, { id: "o2", html: "au bon endroit" }],
        aide: "Le cours part du soin, puis du lieu, de la sécurité, des flux, et finit par la continuité. Le coût n'y figure pas.",
        ok: function () {
          n.nObjectif = 5; n.dessin();
          j.bravo("Le bon soin + au bon endroit + dans des conditions sûres + avec des flux maîtrisés + une continuité de fonctionnement.");
          j.expliquer("<p>Chaque terme renvoie à une partie du cours : le bon endroit, c'est la place des locaux ; les conditions sûres, l'hygiène et la sécurité ; les flux maîtrisés, la séparation propre / sale ; la continuité, l'électricité de secours et la maintenance.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Qui conçoit ?", jouer: function (j, n) {
      n.mode = "equipe"; n.nEquipe = 0; n.dessin();
      j.titre("D'après l'OMS, qui doit être associé à la conception d'un établissement de santé ?");
      j.choix([
        { html: "Les architectes, seuls : c'est un bâtiment", aide: "Un bâtiment de soins se construit autour des réseaux, des équipements et du risque infectieux : un seul métier ne peut pas tout voir." },
        { html: "Architectes, ingénieurs, exploitants et professionnels de la prévention des infections", juste: true },
        { html: "Architectes et ingénieurs, puis les soignants à la réception", aide: "À la réception, il est trop tard pour déplacer un mur. Cherche qui doit être là dès la conception." }
      ], { colonnes: 1, ok: function () {
        n.nEquipe = 4; n.dessin();
        j.bravo("Quatre métiers, dès la conception.");
        j.expliquer("<p>L'OMS souligne que la conception des établissements de santé doit associer architectes, ingénieurs, exploitants et professionnels de la prévention des infections. Tu retrouveras cette idée à la fin du cours : l'équipe de prévention des infections et l'ingénieur biomédical interviennent avant la construction.</p>");
        j.suite();
      } });
    } },
    { nom: "Placer le bloc", jouer: function (j, n) {
      n.mode = "plan"; n.place = null; n.dessin();
      j.fig.astuce("");
      j.titre("Chaque local répond à une fonction et doit être bien placé. Où mets-tu le bloc opératoire ?");
      j.consigne("Touche l'emplacement A, B ou C sur le plan.");
      n.surPlace = function (e) {
        if (!n.libre) return;
        if (!e.juste) { n.place = e.id; n.dessin(); j.erreur(e.aide); return; }
        n.libre = false; n.place = e.id; n.surPlace = null; n.dessin();
        j.bravo("Près des urgences, de la réanimation et de l'imagerie, hors de la circulation générale.", [310, 355]);
        j.expliquer("<p>Le cours donne cet exemple de <b>fonctionnalité</b> : le bloc doit être facilement accessible depuis les urgences, la réanimation et l'imagerie, mais suffisamment séparé des circulations générales de l'hôpital. Il faut éviter les locaux sous-dimensionnés ou mal positionnés par rapport aux autres fonctions.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surPlace) n.surPlace(n.EMPL[0]); });
    } },
    { nom: "Une fonction, une taille, une place", jouer: function (j, n) {
      n.mode = "plan"; n.place = "a"; n.sterile = true; n.dessin();
      j.titre("Sur ce plan, la stérilisation qui sert le bloc tient dans un placard, au fond de l'administration. Quel est le défaut ?");
      j.choix([
        { html: "Aucun : la fonction a bien son local", aide: "Avoir un local ne suffit pas : regarde sa taille et la distance jusqu'au bloc." },
        { html: "Le local est sous-dimensionné et mal positionné par rapport au bloc qu'il sert", juste: true },
        { html: "La stérilisation devrait être dans le hall public, pour être accessible", aide: "Le hall public est la zone la moins maîtrisée de l'hôpital : ce n'est pas la place des instruments." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Trop petit et trop loin : deux défauts que le cours demande d'éviter.");
        j.expliquer("<p>Chaque local répond à une fonction précise : consultation, diagnostic, traitement, chirurgie, hospitalisation, stérilisation, stockage, maintenance, administration. Mais une fonction ne suffit pas : il faut aussi la <b>bonne surface</b> et la <b>bonne position</b> par rapport aux autres fonctions.</p>");
        j.suite();
      } });
    } }
  ]
});
