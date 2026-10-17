/* Niveau : Interrupt Matrix et GPIO_PINn_INT_TYPE (Section III, diapositives 17 et 19). */
NIVEAU({
  id: "interruptions",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var SIG = [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1];
    var TYPES = ["0 : désactivée", "1 : front montant", "2 : front descendant", "3 : tout front", "4 : niveau bas", "5 : niveau haut"];
    var x0 = 200, pas = 38, n = { mode: "types", choisi: null, bon: null, surTouche: null, voir: false, lit: null };
    function yl(k) { return 190 + k * 66; }
    n.zones = function () { var z = {}; TYPES.forEach(function (t, k) { z[k] = [10, yl(k) - 28, 660, 56]; }); return z; };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "types") {
        EMB.texte(g, "broche", [x0 - 14, 112], { taille: 16, ancre: "end", coul: C.doux });
        EMB.onde(g, x0, 90, pas, 44, SIG, { ep: 4, fronts: true });
        TYPES.forEach(function (t, k) {
          var y = yl(k), ch = n.choisi === k, coul = ch ? (k === n.bon ? C.ok : C.ko) : C.pale;
          EMB.el("rect", { x: 10, y: y - 28, width: 660, height: 56, rx: 12, fill: ch ? (k === n.bon ? "#e3f7ee" : "#fdecec") : "#fafbfd", stroke: coul, "stroke-width": ch ? 3 : 1.5 }, g);
          EMB.texte(g, t, [22, y], { taille: 16, ancre: "start", gras: k === n.lit ? true : "fin", halo: false });
          EMB.el("line", { x1: x0, y1: y, x2: x0 + pas * SIG.length, y2: y, stroke: C.pale, "stroke-width": 2 }, g);
          if (!n.voir && k !== n.lit) return;
          SIG.forEach(function (v, i) {
            if ((k === 4 && v === 0) || (k === 5 && v === 1)) EMB.el("rect", { x: x0 + i * pas, y: y - 12, width: pas, height: 24, fill: EMB.teinte(0.35) }, g);
            if (!i) return;
            var p = SIG[i - 1], monte = !p && v, desc = p && !v;
            if ((k === 1 && monte) || (k === 2 && desc) || (k === 3 && (monte || desc))) EMB.el("circle", { cx: x0 + i * pas, cy: y, r: 11, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
          });
        });
      } else {
        // la matrice d'interruptions (diapo 19)
        EMB.bloc(g, 250, 210, 180, 190, "Interrupt\nMatrix", { taille: 20, actif: n.voir });
        EMB.fleche(g, [20, 305], [250, 305], { ep: 3 });
        EMB.texte(g, "Peripheral\nInterrupt Source", [120, 270], { taille: 15 });
        [["PRO_CPU Peripheral Interrupt", 250], ["APP_CPU Peripheral Interrupt", 340]].forEach(function (s, i) {
          EMB.fleche(g, [430, s[1]], [660, s[1]], { ep: 3, coul: n.voir ? C.acc : C.encre });
          EMB.texte(g, s[0], [545, s[1] - 18], { taille: 14 });
        });
        [["PRO_CPU Peripheral Interrupt Configuration Register", 80, 410], ["PRO_CPU NMI Interrupt Mask", 110, 370], ["APP_CPU Peripheral Interrupt Configuration Register", 140, 330], ["APP_CPU NMI Interrupt Mask", 170, 290]].forEach(function (r) {
          EMB.el("polyline", { points: "20," + r[1] + " " + r[2] + "," + r[1] + " " + r[2] + ",204", fill: "none", stroke: C.encre, "stroke-width": 2 }, g);
          EMB.el("polygon", { points: (r[2] - 6) + ",198 " + (r[2] + 6) + ",198 " + r[2] + ",210", fill: C.encre }, g);
          EMB.texte(g, r[0], [24, r[1] - 11], { taille: 13, ancre: "start", gras: false });
        });
        [["PRO_CPU Peripheral Interrupt Source Status Register", 470, 390, 320], ["APP_CPU Peripheral Interrupt Source Status Register", 540, 300, 240]].forEach(function (r) {
          EMB.el("polyline", { points: r[2] + ",400 " + r[2] + "," + r[1] + " 660," + r[1], fill: "none", stroke: C.encre, "stroke-width": 2 }, g);
          EMB.el("polygon", { points: "660," + (r[1] - 6) + " 672," + r[1] + " 660," + (r[1] + 6), fill: C.encre }, g);
          EMB.texte(g, r[0], [r[3], r[1] + 18], { taille: 13, ancre: "start", gras: false });
        });
      }
    };
    EMB.toucher(fig.svg, function () { return n.mode === "types" && n.surTouche ? n.zones() : {}; }, function (k) { if (n.surTouche) n.surTouche(+k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le bouton", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un bouton tire la broche à 0 quand on appuie. On veut une interruption au moment de l'appui, une seule fois. Quelle valeur donner à GPIO_PINn_INT_TYPE ?");
      j.nombre({ avant: "\\text{INT\\_TYPE} =", cases: [{ attendu: 2, tol: 0 }], ligne: true,
        aide: function () { return "Appuyer fait passer la broche de 1 à 0. Cherche ce passage dans la liste à gauche."; },
        ok: function () {
          n.lit = 2; n.dessin();
          j.bravo("2 : front descendant. Un rond à chaque appui.", [500, 322]);
          j.expliquer("<p>Le champ <b>GPIO_PINn_INT_TYPE</b> choisit le déclenchement : 0 interruption désactivée, 1 front montant, 2 front descendant, 3 tout front, 4 niveau bas, 5 niveau haut.</p>");
          j.suite();
        } });
    } },
    { nom: "Chaque changement", jouer: function (j, n) {
      j.titre("Une sonde de débit envoie des impulsions ; tu veux compter chaque changement de la ligne. Touche le bon type sur la figure.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = 3; n.lit = k; n.dessin();
        if (k !== 3) { j.erreur(k === 0 ? "0 désactive l'interruption." : k < 3 ? "Ce type ne voit qu'un seul sens de changement : compte les ronds." : "Un type « niveau » réagit à un état, pas à un changement."); return; }
        fini = true; n.surTouche = null;
        j.bravo("3 : tout front, montant ou descendant.", [500, 388]);
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche(3); });
    } },
    { nom: "Front ou niveau", jouer: function (j, n) {
      n.choisi = null; n.voir = true; n.lit = null; n.dessin();
      j.titre("Compare les lignes 1 et 5. Une alarme reste à 1 tant que le défaut dure. Avec le type 5, que se passe-t-il pendant tout ce temps ?");
      j.choix([
        { html: "La demande d'interruption reste active tant que la ligne est haute", juste: true },
        { html: "Une seule interruption, au début", aide: "Ça, c'est le front montant (type 1) : un rond. Le type 5 colore toute la zone haute." },
        { html: "Rien : le type 5 est réservé au PRO_CPU", aide: "Les types valent pour toute broche ; regarde la bande colorée de la ligne 5." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Un niveau dure ; un front est un instant.");
        j.expliquer("<p>Avec un déclenchement sur <b>front</b> (1, 2, 3), l'interruption arrive au moment du changement. Avec un déclenchement sur <b>niveau</b> (4, 5), elle est demandée tant que la ligne garde ce niveau : le programme doit traiter la cause pour qu'elle cesse.</p>");
        j.suite();
      } });
    } },
    { nom: "Compter", jouer: function (j, n) {
      n.mode = "matrice"; n.voir = false; n.dessin();
      j.titre("PRO et APP ont chacun 32 interruptions. Combien sont des interruptions de périphériques pour un CPU ? Et pour les deux ensemble ?");
      j.nombre({ avant: "\\text{un CPU},\\ \\text{les deux} :", cases: [{ attendu: 26, tol: 0 }, { attendu: 52, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Le cours dit : 32 interruptions chacun, dont 26 de périphériques." : "Deux CPU, autant chacun."; },
        ok: function () { j.bravo("26 par CPU, 52 en tout."); j.suite(); } });
    } },
    { nom: "La matrice", jouer: function (j, n) {
      j.titre("À quoi sert l'Interrupt Matrix ?");
      j.choix([
        { html: "Elle attribue, indépendamment, chaque source d'interruption d'un périphérique aux interruptions périphériques des deux CPU", juste: true },
        { html: "Elle mélange les signaux des périphériques vers les broches", aide: "Ça, c'est la GPIO matrix. Ici, regarde les sorties : PRO_CPU et APP_CPU." },
        { html: "Elle compte le temps entre deux interruptions", aide: "Compter le temps est le rôle d'un timer." }
      ], { colonnes: 1, ok: function () {
        n.voir = true; n.dessin();
        j.bravo("Une source, routée vers PRO_CPU, APP_CPU ou les deux.");
        j.expliquer("<p>Chaque CPU a son registre de configuration et son masque NMI (interruption non masquable). La matrice fournit aussi, pour chaque CPU, un registre d'état des sources d'interruption.</p>");
        j.suite();
      } });
    } }
  ]
});
