/* Boss du chapitre 3 : la plaque du TD 1.1 (courbe, masse, trempe) et les fibres du devoir (polymères impossibles, ressort). */
NIVEAU({
  id: "boss-polymeres",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "courbes", sel: {} };
    var TAB = [["A", -120, -75, 0], ["B", -120, -75, 0.1], ["C", 80, 175, 0], ["D", 175, 175, 0], ["E", -20, 175, 0.9], ["F", 175, -80, 0.9], ["G", 175, 275, 0], ["H", 50, 275, 0.9], ["I", 175, 275, 0.9], ["J", 75, 275, 0]];
    n.TAB = TAB;
    // trois courbes candidates pour Tg = 100 °C, Tf = 200 °C, X = 0,5, masse extrêmement élevée
    var CAND = [
      { nom: "A", o: { Tg: 100, Tf: 200, X: 0.5, Tl: Infinity, larg: 6 } },
      { nom: "B", o: { Tg: 100, Tl: Infinity, larg: 6 } },
      { nom: "C", o: { Tg: 100, Tf: 200, X: 0.5, Tl: 210, larg: 6 } }
    ];
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "courbes") {
        CAND.forEach(function (c, k) {
          var O = [90, 190 + k * 150], W = 520, h = 110;
          var px = function (T) { return O[0] + T / 260 * W; }, py = function (l) { return O[1] - (l - 2.5) / 7.5 * h; };
          D.ligne(g, O, [O[0] + W + 10, O[1]], C.encre, 2.5); D.ligne(g, O, [O[0], O[1] - h - 8], C.encre, 2.5);
          [100, 200].forEach(function (T) { D.ligne(g, [px(T), O[1] - h], [px(T), O[1]], C.gris, 1.5, "4 4"); D.texte(g, T + " °C", [px(T), O[1] + 16], { taille: 13, mono: true, gras: false }); });
          var pts = [];
          for (var T = 0; T <= 260; T += 2) pts.push([px(T), py(BIO.logModule(T, c.o))]);
          E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: n.choisie === k ? D.C.acc : C.jeu, "stroke-width": 4.5, "stroke-linejoin": "round" }, g);
          D.texte(g, c.nom, [O[0] - 40, O[1] - h / 2], { taille: 28 });
        });
        D.texte(g, "log Er en fonction de T", [350, 70], { taille: 16, coul: C.doux, gras: false });
      } else {
        fig.chip(null);
        // tableau du devoir
        D.texte(g, "polymères purs, masse très élevée, filés en fibres ; X mesuré à 20 °C", [340, 75], { taille: 15, coul: C.doux, gras: false });
        var y0 = 120;
        ["", "Tg (°C)", "Tf (°C)", "X"].forEach(function (t, i) { D.texte(g, t, [110 + i * 140, y0], { taille: 17 }); });
        TAB.forEach(function (r, k) {
          var y = y0 + 40 + k * 40, s = n.sel[r[0]];
          E.s("rect", { x: 70, y: y - 17, width: 540, height: 34, rx: 8, fill: s ? "#fde8e8" : k % 2 ? "#f6f7fa" : "#fff" }, g);
          r.forEach(function (v, i) { D.texte(g, i === 0 ? v : String(v).replace("-", "−").replace(".", ","), [110 + i * 140, y], { taille: 17, mono: i > 0, gras: i === 0, coul: s ? C.ko : C.encre, fond: false }); });
          if (s) D.ligne(g, [90, y], [590, y], C.ko, 2.5);
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La bonne courbe", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("TD 1.1 : masse moléculaire extrêmement élevée, Tg = 100 °C, Tf = 200 °C, X = 50 %. Quelle courbe du module de relaxation ?");
      j.consigne("Boss : chaque erreur compte.");
      j.choix([
        { html: "A", juste: true },
        { html: "B", aide: "B chute entièrement à Tg : c'est un amorphe. Ici la moitié est cristalline." },
        { html: "C", aide: "C coule après Tf : une masse extrêmement élevée empêche l'état liquide." }
      ], { ok: function () {
        n.choisie = 0; n.dessin();
        j.bravo("Vitreux, puis cristallin dans une matrice caoutchouteuse, puis plateau caoutchouteux.");
        j.expliquer("<p>Solution du TD : environ 3 GPa avant Tg (log Er ≈ 9,48), lente diminution entre Tg et Tf (cristaux dispersés dans une matrice caoutchouteuse), puis 1 MPa après Tf : le polymère reste caoutchouteux, sa masse l'empêche de couler.</p>");
        j.suite();
      } });
    } },
    { nom: "Masse et trempe", jouer: function (j, n) {
      j.titre("La plaque fait 10 × 10 × 0,1 cm, ρa = 1 et ρc = 1,2 g/cm³. Donne sa masse, puis son volume après chauffage à 250 °C et refroidissement instantané.");
      j.nombre({ avant: "m,\\ V =", apres: "\\text{g},\\ \\text{cm}^3", cases: [{ attendu: BIO.densiteSemiCristallin(1.2, 1, 0.5) * 10, tol: 0.01 }, { attendu: BIO.densiteSemiCristallin(1.2, 1, 0.5) * 10 / 1, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "ρ = ρc X + ρa (1 − X), puis m = ρ V avec V = 10 cm³." : "Fondue puis trempée : X = 0, donc ρ = ρa ; V = m / ρa."; },
        ok: function () { j.bravo("11 g, puis 11 cm³."); j.suite(); } });
    } },
    { nom: "Les impossibles", jouer: function (j, n) {
      n.mode = "tableau"; n.sel = {}; n.dessin();
      j.titre("Devoir : touche les polymères qui ne peuvent pas exister (combinaison de Tg, Tf et X contradictoire, ou fibre impossible à 20 °C), puis vérifie.");
      var ATT = ["A", "B", "C", "D", "F", "G", "J"];
      var z = j.zone("", ""); z.style.cssText = "display:grid;grid-template-columns:repeat(5,1fr);gap:8px";
      var bts = {};
      n.TAB.forEach(function (r) {
        var b = E.h("button", "btn clair", r[0], z); b.type = "button"; bts[r[0]] = b; b.style.minWidth = "0";
        b.addEventListener("click", function () { if (n.fini) return; n.sel[r[0]] = !n.sel[r[0]]; b.classList.toggle("bleu", !!n.sel[r[0]]); b.classList.toggle("clair", !n.sel[r[0]]); n.dessin(); });
      });
      var v = E.h("button", "btn bleu", "Vérifier", j.el); v.type = "button";
      var verifier = function () {
        var ok = n.TAB.every(function (r) { return !!n.sel[r[0]] === (ATT.indexOf(r[0]) >= 0); });
        if (!ok) { j.erreur("Vérifie quatre conditions : Tf > Tg ; au-dessus de Tf, X = 0 ; à 20 °C, une fibre doit être cristalline (X > 0) ; et rigide, donc pas caoutchouteuse ni fondue à 20 °C."); return; }
        n.fini = true; v.remove();
        j.bravo("Restent E, H et I.");
        j.expliquer("<p>A : caoutchouteux ou fondu à 20 °C. B : au-dessus de Tf mais cristallin, impossible. C, G, J : amorphes à 20 °C, pas cristallins. D : Tf = Tg, incompatible. F : Tf < Tg.</p>");
        j.suite();
      };
      v.addEventListener("click", verifier);
      j.reponse(function () { n.sel = {}; ATT.forEach(function (k) { n.sel[k] = true; bts[k].classList.add("bleu"); bts[k].classList.remove("clair"); }); n.dessin(); verifier(); });
    } },
    { nom: "Le ressort", jouer: function (j, n) {
      j.titre("La fibre tient un ressort tendu. Il faut un module très supérieur à 3 GPa à 20 °C, et que le ressort se relâche entre 150 et 200 °C quand on chauffe. Quelle fibre ?");
      j.choix([
        { html: "E", juste: true },
        { html: "H", aide: "H reste cristallin jusqu'à 275 °C : rien ne lâche entre 150 et 200 °C." },
        { html: "I", aide: "Même problème que H : Tf = 275 °C." }
      ], { ok: function () {
        j.bravo("E : sa phase cristalline fond à 175 °C.");
        j.expliquer("<p>Fibres orientées : chaînes parallèles à l'axe, module bien au-delà des 3 GPa d'un semi-cristallin non orienté. Le ressort lâche quand la phase cristalline fond, donc à Tf.</p>");
        j.suite();
      } });
    } },
    { nom: "Pourquoi pas sous Tg ?", jouer: function (j, n) {
      j.titre("E a Tg = −20 °C : à 20 °C sa phase amorphe est caoutchouteuse. Pourquoi la fibre reste-t-elle rigide ?");
      j.choix([
        { html: "Ses cristaux (X = 0,9) orientés portent la charge jusqu'à Tf", juste: true },
        { html: "Sa masse moléculaire est infinie", aide: "La masse empêche l'écoulement, pas le passage au plateau caoutchouteux." },
        { html: "Elle est réticulée", aide: "Rien dans l'énoncé : ce sont des polymères purs filés." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Boss vaincu : ce sont les cristaux qui tiennent.");
        j.suite();
      } });
    } }
  ]
});
