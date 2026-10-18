/* Boss du chapitre 5 : formuler le PVC d'un poste de perfusion (tubulure souple et transparente, lubrifiant, dose, boîtier, mousse de calage). */
NIVEAU({
  id: "boss-additifs",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { fait: {} };
    var b = fig.bande("");
    n.dessin = function () {
      E.vider(g);
      var f = n.fait;
      // potence, poche, tubulure, boîtier de pompe, cale en mousse
      D.ligne(g, [150, 60], [150, 520], "#9aa0ad", 8);
      D.ligne(g, [150, 70], [250, 70], "#9aa0ad", 6);
      E.s("path", { d: "M215 90 L285 90 Q295 90 295 100 L295 210 Q295 240 250 240 Q205 240 205 210 L205 100 Q205 90 215 90 Z", fill: f.tub ? PLATEFORME.teinte(0.25) : "#eef6fb", stroke: C.encre, "stroke-width": 3 }, g);
      D.texte(g, "poche", [250, 160], { taille: 16 });
      E.s("path", { d: "M250 240 C250 330 330 330 380 330 C440 330 440 300 470 300", fill: "none", stroke: f.tub ? C.jeu : "#c6cbd8", "stroke-width": 8, "stroke-linecap": "round", opacity: 0.85 }, g);
      D.texte(g, "tubulure", [330, 360], { taille: 16, coul: f.tub ? C.jeu : C.doux });
      E.s("rect", { x: 470, y: 240, width: 150, height: 120, rx: 14, fill: f.boitier ? "#d6dbe6" : "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("rect", { x: 495, y: 262, width: 100, height: 40, rx: 6, fill: "#2b3a5c" }, g);
      D.texte(g, "pompe", [545, 330], { taille: 16 });
      E.s("rect", { x: 450, y: 380, width: 190, height: 70, rx: 10, fill: f.mousse ? PLATEFORME.teinte(0.18) : "#fff", stroke: C.encre, "stroke-width": 2.5, "stroke-dasharray": f.mousse ? null : "6 5" }, g);
      if (f.mousse) { var r = BIO.hasard(9); for (var i = 0; i < 24; i++) D.rond(g, [460 + 170 * r(), 390 + 50 * r()], 3 + 4 * r(), { fill: "#fff", stroke: C.jeu, ep: 1.5 }); }
      D.texte(g, "cale en mousse", [545, 474], { taille: 16 });
      var champ = function (k, v) { return "\\text{" + k + "} : " + (v ? "\\checkmark" : "\\,?\\,"); };
      E.k(b, champ("tubulure", f.tub) + " \\quad " + champ("extrusion", f.lub) + " \\quad " + champ("dose", f.dose) + " \\quad " + champ("boîtier", f.boitier) + " \\quad " + champ("mousse", f.mousse));
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La tubulure", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("La tubulure en PVC doit être souple et légèrement teintée, tout en laissant voir le liquide. Choisis les deux adjuvants.");
      j.consigne("Boss : chaque erreur compte.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><b>Souple</b><b>Teintée et transparente</b><span class="trou" data-attendu="p"></span><span class="trou" data-attendu="c"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "g", html: "pigment" }, { id: "c", html: "colorant soluble" }, { id: "f", html: "fibres de verre" }, { id: "p", html: "plastifiant" }],
        aide: "Un pigment insoluble rend opaque. Des fibres rigidifient.",
        ok: function () {
          n.fait.tub = true; n.dessin();
          j.bravo("Plastifiant et colorant soluble.");
          j.suite();
        }
      });
    } },
    { nom: "L'extrusion", jouer: function (j, n) {
      j.titre("À l'extrusion, le PVC frotte et colle sur l'acier de la filière. Quel adjuvant, et comment agit-il ?");
      j.choix([
        { html: "Un lubrifiant interne, qui réduit le frottement du polymère sur lui-même", aide: "Le problème est le contact entre le polymère et le métal." },
        { html: "Un lubrifiant externe, insoluble, qui exsude et forme une couche en surface", juste: true },
        { html: "Un agent de germination", aide: "Il agit sur la cristallisation, pas sur le frottement." }
      ], { colonnes: 1, ok: function () {
        n.fait.lub = true; n.dessin();
        j.bravo("Lubrifiant externe.");
        j.suite();
      } });
    } },
    { nom: "La dose", jouer: function (j, n) {
      j.titre("On prépare 200 kg de mélange avec un lubrifiant à la concentration habituelle du cours, environ 0,1 % en masse. Combien de grammes de lubrifiant ?");
      j.nombre({ avant: "m =", apres: "\\text{g}", cases: [{ attendu: 200000 * 0.001, tol: 0.5 }], ligne: true,
        aide: function () { return "0,1 % = 0,001. Mets 200 kg en grammes d'abord."; },
        ok: function () { n.fait.dose = true; n.dessin(); j.bravo("200 g pour 200 kg."); j.suite(); } });
    } },
    { nom: "Le boîtier", jouer: function (j, n) {
      j.titre("Le boîtier de pompe en PVC rigide casse s'il tombe. Quel adjuvant, à quelle dose ?");
      j.choix([
        { html: "Un anti-choc de type MBS ou ABS, à quelques %", juste: true },
        { html: "Du carbonate de calcium, à 40 %", aide: "Le CaCO₃ diminue la résistance au choc." },
        { html: "Un plastifiant, à 40 %", aide: "Il rendrait le boîtier souple : ce n'est plus un boîtier rigide." }
      ], { colonnes: 1, ok: function () {
        n.fait.boitier = true; n.dessin();
        j.bravo("Anti-choc, quelques %, surtout utilisé dans le PVC.");
        j.suite();
      } });
    } },
    { nom: "La mousse", jouer: function (j, n) {
      j.titre("La cale est en PVC gonflé à 0,3 g/cm³ (le PVC plein fait 1,45 g/cm³). Par combien le volume a-t-il été multiplié ? (deux décimales)");
      j.nombre({ avant: "\\dfrac{V_{\\text{mousse}}}{V_{\\text{plein}}} =", cases: [{ attendu: 1.45 / 0.3, tol: 0.006 }], ligne: true,
        aide: function () { return "À masse égale, \\(\\rho V\\) reste constant : le rapport des volumes est l'inverse du rapport des densités."; },
        ok: function () {
          n.fait.mousse = true; n.dessin();
          j.bravo("Environ 4,83 fois.");
          j.expliquer("<p>Un seul polymère, le PVC, et cinq formulations : plastifié, coloré, lubrifié, renforcé au choc, gonflé. C'est tout l'intérêt des adjuvants et des renforts.</p>");
          j.suite();
        } });
    } }
  ]
});
