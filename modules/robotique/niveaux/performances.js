/* Niveau : précision, répétabilité, temps de cycle et cadence. */
NIVEAU({
  id: "performances",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "cibles", choisi: null, surCible: null, durees: null, vitesse: 1, total: false };
    // cinq pièces posées par cas, en mm autour de P (échelle : 1 mm = 22 px)
    var CAS = {
      A: [[0.2, 0.1], [-0.3, 0.2], [0.1, -0.3], [-0.1, -0.1], [0.3, 0.3]],
      B: [[2.0, 1.1], [2.2, 0.8], [1.8, 0.9], [2.1, 1.3], [1.9, 1.0]],
      C: [[1.6, 0.9], [-1.4, 1.2], [0.4, -1.7], [-1.2, -1.0], [0.7, 0.6]],
      D: [[2.6, -1.8], [0.8, -3.0], [3.1, 0.2], [1.2, -0.6], [2.9, -2.6]]
    };
    var POS = { A: [180, 160], B: [500, 160], C: [180, 430], D: [500, 430] };
    var NOMS = ["approche", "prise", "transfert", "dépose", "retour", "synchro"], MOUV = [true, false, true, false, true, false];
    n.POS = POS;
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "cibles") {
        Object.keys(CAS).forEach(function (k) {
          var c = POS[k], ch = n.choisi === k, coul = ch ? (k === n.bon ? C.ok : C.ko) : C.pale;
          E.s("rect", { x: c[0] - 145, y: c[1] - 120, width: 290, height: 240, rx: 18, fill: ch ? (k === n.bon ? "#e3f7ee" : "#fdecec") : "#fafbfd", stroke: coul, "stroke-width": 2 }, g);
          [90, 60, 30].forEach(function (r, i) { E.s("circle", { cx: c[0], cy: c[1], r: r, fill: ["#fff", "#f1f3f8", "#fff"][i], stroke: "#c6cbd8", "stroke-width": 1.5 }, g); });
          D.ligne(g, [c[0] - 8, c[1]], [c[0] + 8, c[1]], C.encre, 2); D.ligne(g, [c[0], c[1] - 8], [c[0], c[1] + 8], C.encre, 2);
          D.texte(g, "P", [c[0] - 14, c[1] + 18], { taille: 14, coul: C.doux });
          CAS[k].forEach(function (p) { D.rond(g, [c[0] + p[0] * 22, c[1] - p[1] * 22], 7, { fill: C.jeu, stroke: "#fff", ep: 2 }); });
          D.texte(g, k, [c[0] - 120, c[1] - 95], { taille: 24, coul: C.doux });
        });
      } else {
        var d = n.durees, x0 = 170, s = 500, y = 90;
        var t = d.map(function (v, i) { return MOUV[i] ? v / n.vitesse : v; });
        t.forEach(function (v, i) {
          D.texte(g, NOMS[i], [x0 - 14, y + i * 62 + 18], { ancre: "end", taille: 18, gras: false });
          E.s("rect", { x: x0, y: y + i * 62, width: Math.max(2, v * s), height: 36, rx: 8, fill: MOUV[i] ? "#3b5bdb" : "#c6cbd8" }, g);
          D.texte(g, E.fmt(v, MOUV[i] && n.vitesse !== 1 ? 3 : 2) + " s", [x0 + v * s + 12, y + i * 62 + 18], { ancre: "start", taille: 17, mono: true });
        });
        var yt = y + 6 * 62 + 20;
        D.ligne(g, [x0, yt - 8], [640, yt - 8], C.pale, 2);
        var acc = 0;
        t.forEach(function (v, i) { E.s("rect", { x: x0 + acc * s * 0.25, y: yt, width: v * s * 0.25, height: 30, fill: MOUV[i] ? "#3b5bdb" : "#c6cbd8", stroke: "#fff", "stroke-width": 2 }, g); acc += v; });
        D.texte(g, "cycle", [x0 - 14, yt + 15], { ancre: "end", taille: 18 });
        if (n.total) D.texte(g, E.fmt(acc, 2) + " s", [x0 + acc * s * 0.25 + 12, yt + 15], { ancre: "start", taille: 18, coul: C.jeu });
        D.texte(g, "bleu : mouvement    gris : temps fixe", [340, 60], { taille: 15, coul: C.doux, gras: false });
      }
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (n.mode !== "cibles" || !n.surCible) return false;
        Object.keys(POS).forEach(function (k) { var c = POS[k]; if (Math.abs(p[0] - c[0]) < 145 && Math.abs(p[1] - c[1]) < 120) n.surCible(k); });
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Groupées", jouer: function (j, n) {
      j.fig.astuce("Chaque cible : cinq pièces posées par un robot qui vise P.");
      j.titre("Un robot pose ses cinq pièces bien groupées, mais à 2 mm de P. Touche sa cible.");
      var fini = false, AIDE = { A: "A : groupées et sur P. Ce robot est précis et répétable.", C: "C : les pièces sont dispersées.", D: "D : dispersées et loin de P." };
      n.surCible = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "B"; n.dessin();
        if (k !== "B") { j.erreur(AIDE[k]); return; }
        fini = true; n.surCible = null;
        j.bravo("B : répétable, mais pas précis.", n.POS.B);
        j.expliquer("<p>La <b>précision</b> dit si le robot atteint le point demandé : c'est l'écart entre position atteinte et position demandée. La <b>répétabilité</b> dit s'il reproduit le même mouvement, avec des positions peu dispersées. Un robot peut être très répétable sans être précis : il atteint toujours P' au lieu de P, avec un écart constant.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surCible) n.surCible("B"); });
    } },
    { nom: "Ce qui manque", jouer: function (j, n) {
      n.choisi = "C"; n.bon = null; n.dessin();
      j.fig.astuce("");
      j.titre("Cible C : pièces dispersées, mais leur moyenne est proche de P. Qu'est-ce qui manque à ce robot ?");
      j.choix([{ html: "La précision", aide: "En moyenne, il tombe près de P : sa précision est moyenne. C'est la dispersion qui pose problème." }, { html: "La répétabilité", juste: true }], { colonnes: 2, ok: function () {
        j.bravo("Précision moyenne, répétabilité faible.");
        j.suite();
      } });
    } },
    { nom: "Temps de cycle", jouer: function (j, n) {
      n.mode = "cycle"; n.durees = [0.30, 0.20, 0.55, 0.15, 0.45, 0.35]; n.vitesse = 1; n.total = false; n.dessin();
      j.fig.astuce("Un cycle de pick and place, étape par étape.");
      j.titre("Combien dure un cycle ? Et combien de cycles en une heure ?");
      j.nombre({ avant: "T_{cycle},\\ N :", cases: [{ attendu: 2, tol: 0.001 }, { attendu: 1800, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Additionne les six durées." : "Une heure fait 3600 s : \\(N = 3600 / T_{cycle}\\)."; },
        ok: function () {
          n.total = true; n.dessin();
          j.bravo("2,00 s par cycle, 1800 cycles/h.");
          j.expliquer("\\[ \\begin{aligned} T_{cycle} = {} & T_{approche} + T_{prise} + T_{transfert} \\\\ & + T_{dépose} + T_{retour} + T_{synchronisation} \\end{aligned} \\]\\[ N = \\frac{3600}{T_{cycle}} \\ \\text{cycles/h} \\]<p>Le <b>temps de cycle</b> est la durée d'une opération complète, retour à l'état initial compris. Cette cadence est théorique : arrêts, défauts et maintenance la réduisent.</p>");
          j.suite();
        } });
    } },
    { nom: "Vitesse × 2", jouer: function (j, n) {
      n.total = false; n.dessin();
      j.fig.astuce("Double la vitesse et regarde ce qui raccourcit.");
      j.titre("On double la vitesse du robot. Combien dure le cycle maintenant ?");
      var bt = E.h("button", "btn clair", "Vitesse × 2", j.el); bt.type = "button";
      bt.addEventListener("click", function () { n.vitesse = n.vitesse === 1 ? 2 : 1; bt.textContent = n.vitesse === 1 ? "Vitesse × 2" : "Vitesse × 1"; n.dessin(); });
      j.nombre({ avant: "T_{cycle} =", apres: "\\text{s}", cases: [{ attendu: 1.35, tol: 0.001 }], ligne: true,
        aide: function () { return "Seuls l'approche, le transfert et le retour (en bleu) sont divisés par deux."; },
        ok: function () {
          n.vitesse = 2; n.total = true; n.dessin(); bt.remove();
          j.bravo("1,35 s, soit environ 2667 cycles/h : la cadence n'est pas doublée.");
          j.expliquer("\\[ T_{cycle} = T_{mouvement} + T_{prise} + T_{dépose} + T_{attente} \\]<p>Si \\(v\\) augmente, \\(T_{mouvement}\\) diminue, mais la vitesse ne supprime pas les temps de prise, de dépose et d'attente.</p>");
          j.suite();
        } });
    } },
    { nom: "À toi", jouer: function (j, n) {
      n.durees = [0.40, 0.25, 0.60, 0.25, 0.50, 0.40]; n.vitesse = 1; n.total = false; n.dessin();
      j.fig.astuce("Un autre robot.");
      j.titre("Temps de cycle et cadence de ce robot ?");
      j.nombre({ avant: "T_{cycle},\\ N :", cases: [{ attendu: 2.4, tol: 0.001 }, { attendu: 1500, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Additionne les six durées." : "\\(N = 3600 / T_{cycle}\\)."; },
        ok: function () {
          n.total = true; n.dessin();
          j.bravo("2,40 s et 1500 cycles/h, soit 25 cycles/min.");
          j.suite();
        } });
    } }
  ]
});
