/* Niveau : séparation des flux (diapos 17 et 18). Schéma idéal, croisement à éviter, séparation physique, temporelle, organisationnelle. */
NIVEAU(ARCHI.rejouable({
  id: "separation-flux",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "croise", saleB: false, chaineOk: false, libre: true, pl: { P: function (v) { return v; } } };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "croise" || n.mode === "couloirs") {
        var deux = n.mode === "couloirs";
        // salles à gauche, sorties à droite
        A.boite(g, 20, 70, 150, 90, { titre: "Stockage propre", fond: C.okPale, bord: C.propre });
        A.boite(g, 20, 210, 150, 90, { titre: "Patient (transfert)", fond: C.vPale, bord: C.patient });
        A.boite(g, 510, 70, 150, 90, { titre: "Salle d'opération", fond: A.ZONES.restreinte.fond, bord: A.ZONES.restreinte.bord });
        A.boite(g, 510, 210, 150, 90, { titre: "Local sale", fond: "#fbeee6", bord: C.sale });
        // couloir commun
        A.s("rect", { x: 190, y: 120, width: 300, height: 130, rx: 10, fill: C.fond, stroke: C.trait, "stroke-width": 2 }, g);
        A.texte(g, deux ? "Couloir A" : "Même circulation, sans contrôle", [318, 236], { taille: 15, coul: C.doux });
        A.chemin(g, [[170, 115], [230, 115], [230, 175], [508, 120]], { coul: C.propre, ep: 5 });
        A.chemin(g, [[170, 255], [260, 255], [260, 200], [508, 140]], { coul: C.patient, ep: 5 });
        if (!n.saleB) {
          A.chemin(g, [[510, 140], [440, 200], [440, 240], [508, 255]], { coul: C.sale, ep: 5, tirets: "10 6" });
          A.s("circle", { cx: 420, cy: 190, r: 30, fill: "none", stroke: C.ko, "stroke-width": 4 }, g);
          A.texte(g, "croisement", [420, 236], { taille: 15, coul: C.ko });
        }
        if (deux) {
          A.s("rect", { x: 190, y: 360, width: 470, height: 110, rx: 10, fill: n.saleB ? "#fbeee6" : "#fff", stroke: n.saleB ? C.sale : C.gris, "stroke-width": n.saleB ? 3 : 2, "stroke-dasharray": n.saleB ? null : "8 6" }, g);
          A.texte(g, n.saleB ? "Couloir B : circuit sale" : "Couloir B, libre", [425, 385], { taille: 16, coul: n.saleB ? C.sale : C.doux });
          if (n.saleB) A.chemin(g, [[585, 162], [585, 190], [640, 190], [640, 420], [585, 420], [585, 302]], { coul: C.sale, ep: 5, relais: true });
          A.cible(g, 190, 360, 470, 110, function () { if (n.surCouloir) n.surCouloir(); });
        }
        A.s("rect", { x: 20, y: 500, width: 640, height: 84, rx: 12, fill: "#fff", stroke: C.trait, "stroke-width": 2 }, g);
        [["Flux propre", C.propre], ["Patient", C.patient], ["Flux sale", C.sale]].forEach(function (l, i) {
          A.s("line", { x1: 50 + i * 210, y1: 542, x2: 100 + i * 210, y2: 542, stroke: l[1], "stroke-width": 6, "stroke-linecap": "round" }, g);
          A.texte(g, l[0], [110 + i * 210, 542], { taille: 16, ancre: "start", halo: false });
        });
      } else {
        // schéma idéal (diapo 17)
        var L = [["Réception", C.propre], ["Stockage", C.propre], ["Préparation", C.propre], ["Salle opératoire", C.propre], ["Utilisation", C.v], ["Décontamination", C.sale], ["Stérilisation", C.sale]];
        A.texte(g, "Flux propre", [119, 66], { taille: 18, coul: C.propre, gras: 800 });
        A.texte(g, "Flux sale", [561, 160], { taille: 18, coul: C.sale, gras: 800 });
        L.forEach(function (e, i) {
          var x = i < 4 ? 24 : i === 4 ? 245 : 466, y = i < 4 ? 90 + i * 110 : i === 4 ? 420 : i === 5 ? 340 : 200;
          var cache = !n.chaineOk && (i === 1 || i === 2 || i === 5 || i === 6);
          A.boite(g, x, y, 190, 70, { fond: cache ? C.fond : "#fff", bord: cache ? C.trait : e[1], ep: 3, tirets: cache ? "7 6" : null, titre: cache ? "?" : e[0], coul: cache ? C.gris : C.encre });
        });
        for (var i = 0; i < 3; i++) A.fleche(g, [119, 162 + i * 110], [119, 198 + i * 110], { coul: C.propre, ep: 4 });
        A.fleche(g, [216, 455], [243, 455], { coul: C.v, ep: 4 });
        A.chemin(g, [[437, 455], [561, 455], [561, 413]], { coul: C.sale, ep: 4 });
        A.fleche(g, [561, 338], [561, 273], { coul: C.sale, ep: 4 });
        A.texte(g, "après utilisation", [500, 478], { taille: 14, coul: C.sale });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le croisement", jouer: function (j, n) {
      j.titre("Sur ce plan, le propre, le patient et le sale empruntent le même couloir, sans contrôle. Quel est le risque principal ?");
      j.choix([
        { html: "La contamination : le sale croise le propre et le patient", juste: true },
        { html: "Aucun, si chacun passe vite", aide: "La vitesse ne change rien : un sac souillé qui frôle un chariot stérile suffit." },
        { html: "Un couloir trop large", aide: "La largeur n'est pas en cause. Regarde le cercle rouge." }
      ], { colonnes: 1, ok: function () {
        j.bravo("C'est exactement la situation que le cours demande d'éviter.");
        j.expliquer("<p>Il faut éviter que le propre, le patient et le sale partagent la <b>même circulation sans contrôle</b>. Le tableau de synthèse donne l'exigence des flux : séparation propre / sale, sinon contamination.</p>");
        j.suite();
      } });
    } },
    { nom: "Séparer", jouer: function (j, n) {
      n.mode = "couloirs"; n.dessin();
      j.titre("Le projet dispose d'un second couloir. Touche-le pour y faire passer le flux sale.");
      n.surCouloir = function () {
        if (!n.libre) return;
        n.libre = false; n.saleB = true; n.surCouloir = null; n.dessin();
        j.bravo("Plus de croisement : le sale a son propre couloir.", [425, 415]);
        j.expliquer("<p>Deux couloirs distincts : c'est une <b>séparation physique</b>. Le sale ne traverse plus les zones propres.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surCouloir) n.surCouloir(); });
    } },
    { nom: "Trois façons de séparer", jouer: function (j, n) {
      j.titre("Le cours cite trois types de séparation. Range chaque solution.");
      var S = [["Deux couloirs distincts, un pour le propre, un pour le sale.", "p"], ["Le sale ne sort qu'après la dernière intervention de la journée.", "t"], ["Un seul couloir, mais chariots fermés et règles de circulation strictes.", "o"]];
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 220px;gap:10px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "o", html: "Organisationnelle" }, { id: "p", html: "Physique" }, { id: "t", html: "Temporelle" }],
        aide: "Physique : des murs. Temporelle : des horaires. Organisationnelle : des règles et du matériel.",
        ok: function () {
          j.bravo("Physique, temporelle, organisationnelle.");
          j.suite();
        }
      });
    } },
    { nom: "Laquelle préférer ?", jouer: function (j, n) {
      j.titre("Les trois sont possibles. Laquelle le cours juge-t-il généralement préférable ?");
      j.choix([
        { html: "La séparation physique, lorsque les contraintes du projet le permettent", juste: true },
        { html: "La séparation temporelle, toujours", aide: "Elle dépend d'un horaire respecté chaque jour : une urgence la casse." },
        { html: "L'organisationnelle, car elle ne coûte rien", aide: "Elle repose sur le respect des règles par chacun : c'est la plus fragile." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La physique, quand le projet le permet.");
        j.expliquer("<p>Une séparation physique ne dépend ni d'un horaire ni du respect d'une consigne : le mur sépare tout le temps. Quand la place manque, on combine séparation temporelle et organisationnelle.</p>");
        j.suite();
      } });
    } },
    { nom: "Le schéma idéal", jouer: function (j, n) {
      n.mode = "chaine"; n.dessin();
      j.titre("Complète le schéma idéal du cours : le propre descend vers la salle, le sale repart vers la stérilisation.");
      var res = j.zone("", "");
      var z = j.zone("", '<p style="font-size:18px;line-height:2.5">Réception → <span class="trou" data-attendu="a"></span> → <span class="trou" data-attendu="b"></span> → salle opératoire → utilisation → flux sale → <span class="trou" data-attendu="c"></span> → <span class="trou" data-attendu="d"></span></p>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "d", html: "stérilisation" }, { id: "b", html: "préparation" }, { id: "x", html: "stockage propre du bloc" }, { id: "c", html: "décontamination" }, { id: "a", html: "stockage" }],
        aide: "Côté propre : on range avant de préparer. Côté sale : on décontamine avant de stériliser.",
        ok: function () {
          n.chaineOk = true; n.dessin();
          j.bravo("Réception → stockage → préparation → salle → utilisation → flux sale → décontamination → stérilisation.");
          j.expliquer("<p>Le schéma va dans un seul sens : jamais de retour du sale vers le propre. Ce qui a servi ne redevient propre qu'après décontamination puis stérilisation.</p>");
          j.suite();
        }
      });
    } }
  ]
}));
