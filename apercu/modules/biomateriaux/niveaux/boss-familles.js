/* Boss du chapitre 2 : choisir le matériau de chaque pièce d'une prothèse de hanche et d'un câble de sonde. */
NIVEAU({
  id: "boss-familles",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { piece: null, choix: {} };
    var H = [320, 250];
    var PIECES = {
      tige: { nom: "tige fémorale", p: [282, 430], l: [120, 470], ancre: "middle" },
      tete: { nom: "tête fémorale", p: [345, 262], l: [640, 330], ancre: "end" },
      insert: { nom: "insert du cotyle", p: [365, 205], l: [640, 250], ancre: "end" },
      cotyle: { nom: "cotyle", p: [385, 180], l: [640, 140], ancre: "end" }
    };
    n.PIECES = PIECES;
    function anneau(r1, r2) {
      var a0 = 8 * D.DEG, a1 = 172 * D.DEG, P = function (r, a) { return (H[0] + r * Math.cos(a)).toFixed(1) + " " + (H[1] - r * Math.sin(a)).toFixed(1); };
      return "M" + P(r2, a0) + " A" + r2 + " " + r2 + " 0 0 0 " + P(r2, a1) + " L" + P(r1, a1) + " A" + r1 + " " + r1 + " 0 0 1 " + P(r1, a0) + " Z";
    }
    n.dessin = function () {
      E.vider(g);
      function coul(id, base) { return n.choix[id] ? base : "#fff"; }
      // os : bassin autour du cotyle, fémur autour de la tige (schématiques)
      E.s("path", { d: "M200 230 Q210 120 320 110 Q470 100 560 160 Q600 230 520 280 Q450 220 410 262 L230 262 Q205 260 200 230 Z", fill: "#f4ead8", stroke: "#cbb893", "stroke-width": 2 }, g);
      E.s("path", { d: "M250 300 Q270 280 300 292 L330 320 Q312 360 312 420 L318 560 L238 560 L246 420 Q236 340 250 300 Z", fill: "#f4ead8", stroke: "#cbb893", "stroke-width": 2 }, g);
      E.s("path", { d: anneau(62, 80), fill: coul("cotyle", "#8e97a6"), stroke: C.encre, "stroke-width": 3 }, g);
      E.s("path", { d: anneau(45, 62), fill: coul("insert", PLATEFORME.teinte(0.6)), stroke: C.encre, "stroke-width": 3 }, g);
      // col et tige
      E.s("path", { d: "M308 262 L330 280 Q300 320 296 360 L284 530 Q279 545 272 530 L264 360 Q262 310 296 262 Z", fill: coul("tige", "#b8c0cc"), stroke: C.encre, "stroke-width": 3 }, g);
      D.rond(g, H, 42, { fill: coul("tete", "#efe3cc"), stroke: C.encre, ep: 3 });
      Object.keys(PIECES).forEach(function (k) {
        var P = PIECES[k], fin = P.ancre === "end" ? [P.l[0] - 4, P.l[1] + 8] : [P.l[0] + 40, P.l[1] - 30];
        D.ligne(g, P.p, fin, n.piece === k ? D.C.acc : C.gris, 2, "4 4");
        D.rond(g, P.p, 5, { fill: n.piece === k ? D.C.acc : C.gris });
        D.texte(g, P.nom + (n.choix[k] ? " : " + n.choix[k] : ""), [P.l[0], P.l[1] - 6], { taille: 17, ancre: P.ancre, coul: n.piece === k ? D.C.acc : C.encre });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La tige", jouer: function (j, n) {
      n.piece = "tige"; n.dessin();
      j.fig.astuce("");
      j.titre("La tige fémorale porte le poids du corps à chaque pas : elle doit être résistante, ductile (ne pas casser net) et résister à la corrosion. Quelle famille ?");
      j.consigne("Boss : chaque erreur compte.");
      j.choix([
        { html: "Céramique", aide: "Une céramique est fragile : elle casse sans se déformer, dangereux pour une pièce longue chargée en flexion." },
        { html: "Métal (alliage de titane)", juste: true },
        { html: "Polymère", aide: "Module bien trop faible pour porter le corps." }
      ], { colonnes: 1, ok: function () {
        n.choix.tige = "métal"; n.dessin();
        j.bravo("Alliage métallique : résistant, ductile, résistant à la corrosion.");
        j.suite();
      } });
    } },
    { nom: "La tête", jouer: function (j, n) {
      n.piece = "tete"; n.dessin();
      j.titre("La tête frotte des millions de fois contre l'insert : elle doit être très dure, résister à l'abrasion, être inerte. Quelle famille ?");
      j.choix([
        { html: "Céramique (zircone ou alumine)", juste: true },
        { html: "Polymère", aide: "Un polymère s'userait vite : il n'est pas dur." },
        { html: "Élastomère", aide: "Un élastomère est souple : tout le contraire de ce qu'on cherche." }
      ], { colonnes: 1, ok: function () {
        n.choix.tete = "céramique"; n.dessin();
        j.bravo("Dure, résistante à l'abrasion.");
        j.suite();
      } });
    } },
    { nom: "L'insert", jouer: function (j, n) {
      n.piece = "insert"; n.dessin();
      j.titre("L'insert du cotyle sert de surface de glissement un peu souple, facile à mettre en forme. Quelle famille ?");
      j.choix([
        { html: "Polymère (polyéthylène)", juste: true },
        { html: "Métal", aide: "Un métal est rigide, pas « un peu souple »." },
        { html: "Céramique", aide: "Une céramique n'est ni souple ni facile à mettre en forme." }
      ], { colonnes: 1, ok: function () {
        n.choix.insert = "polymère"; n.dessin();
        j.bravo("Polyéthylène : souple, facile à mouler.");
        j.suite();
      } });
    } },
    { nom: "Le bilan des masses", jouer: function (j, n) {
      n.piece = "cotyle"; n.choix.cotyle = "métal"; n.dessin();
      j.titre("Masses : tige de 50 cm³ en Ti-6Al-4V (4,43 g/cm³) et tête de 8 cm³ en zircone (5,8 g/cm³). Masse de chaque pièce ?");
      j.nombre({ avant: "m_{tige},\\ m_{tête} =", apres: "\\text{g}", cases: [{ attendu: 221.5, tol: 0.6 }, { attendu: 46.4, tol: 0.2 }], ligne: true,
        aide: function (k) { return k === 0 ? "m = ρ × V : 4,43 × 50." : "m = ρ × V : 5,8 × 8."; },
        ok: function () {
          j.bravo("221,5 g et 46,4 g.");
          j.expliquer("<p>Chaque pièce a la famille de ses exigences : métal pour porter, céramique pour frotter sans s'user, polymère pour glisser et amortir. Volumes : exemple ajouté.</p>");
          j.suite();
        } });
    } },
    { nom: "Le câble de la sonde", jouer: function (j, n) {
      j.titre("Une sonde implantée : âme conductrice, gaine souple, pointe isolante très dure. Complète.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:18px">' +
        '<span>Âme conductrice</span><span class="trou" data-attendu="m" style="min-width:140px"></span>' +
        '<span>Gaine souple isolante</span><span class="trou" data-attendu="p" style="min-width:140px"></span>' +
        '<span>Pointe isolante très dure</span><span class="trou" data-attendu="c" style="min-width:140px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "céramique" }, { id: "m", html: "métal" }, { id: "p", html: "polymère" }],
        aide: "Conduire : électrons libres. Souple et isolant : chaînes covalentes. Dur et isolant : liaisons ioniques et covalentes rigides.",
        ok: function () {
          j.bravo("Boss vaincu : chaque famille à sa place.");
          j.suite();
        }
      });
    } }
  ]
});
