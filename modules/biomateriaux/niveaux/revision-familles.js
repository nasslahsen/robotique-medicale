/* Révision du chapitre 2 : liaisons, métaux, céramiques, polymères, composites, dans des situations nouvelles. */
NIVEAU({
  id: "revision-familles",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { choisi: null, libre: true };
    // trois éprouvettes inconnues et leur comportement
    var ECH = [
      { nom: "A", coul: "#c9a96e", cond: false, casse: true, chaud: true },
      { nom: "B", coul: "#8e97a6", cond: true, casse: false, chaud: true },
      { nom: "C", coul: PLATEFORME.couleur(), cond: false, casse: false, chaud: false }
    ];
    n.dessin = function () {
      E.vider(g);
      D.texte(g, "trois échantillons inconnus", [340, 130], { taille: 19, coul: C.doux, gras: false });
      var lignes = ["conduit le courant ?", "casse sans se déformer ?", "tient à 400 °C ?"];
      lignes.forEach(function (l, i) { D.texte(g, l, [40, 300 + i * 90], { ancre: "start", taille: 19 }); });
      ECH.forEach(function (e, k) {
        var x = 370 + k * 110;
        E.s("rect", { x: x - 38, y: 165, width: 76, height: 84, rx: 14, fill: e.coul, stroke: n.choisi === e.nom ? D.C.acc : C.encre, "stroke-width": n.choisi === e.nom ? 5 : 2.5 }, g);
        D.texte(g, e.nom, [x, 207], { taille: 30, fond: false, coul: "#fff" });
        [e.cond, e.casse, e.chaud].forEach(function (v, i) {
          D.rond(g, [x, 300 + i * 90], 26, { fill: v ? "#e3f7ee" : "#fde8e8", stroke: v ? C.ok : C.ko, ep: 2.5 });
          D.texte(g, v ? "oui" : "non", [x, 301 + i * 90], { taille: 17, fond: false, coul: v ? C.ok : C.ko });
        });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Trois inconnus", jouer: function (j, n) {
      j.fig.astuce("Lis le tableau de chaque échantillon.");
      j.titre("Identifie la famille de chaque échantillon.");
      var z = j.zone("", '<div style="display:flex;gap:10px;align-items:center;font-size:20px;flex-wrap:wrap">A <span class="trou" data-attendu="c" style="min-width:130px"></span> B <span class="trou" data-attendu="m" style="min-width:130px"></span> C <span class="trou" data-attendu="p" style="min-width:130px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", html: "métal" }, { id: "p", html: "polymère" }, { id: "c", html: "céramique" }],
        aide: "Conduire : électrons libres. Casser sans se déformer : fragile. Ne pas tenir à 400 °C : aucun polymère n'est intéressant au-delà de 200 °C.",
        ok: function () {
          j.bravo("A céramique, B métal, C polymère.");
          j.expliquer("<p>Chaque famille se reconnaît à ses liaisons : électrons libres pour le métal (conduction, ductilité), liaisons ioniques et covalentes rigides pour la céramique (fragile, réfractaire), chaînes covalentes liées faiblement pour le polymère.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le cathéter qui ramollit", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un cathéter en polymère ramollit en le chauffant, sans que ses chaînes ne se cassent. Quelles liaisons ont cédé ?");
      j.choix([
        { html: "Les liaisons covalentes C–C", aide: "Ce sont les plus fortes (349 kJ/mol) : elles tiennent." },
        { html: "Les liaisons intermoléculaires", juste: true },
        { html: "Les liaisons métalliques", aide: "Il n'y en a pas dans un polymère." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le maillon le plus faible cède en premier.");
        j.suite();
      } });
    } },
    { nom: "Le rapport des modules", jouer: function (j, n) {
      j.titre("Un implant en alumine (E = 200 GPa, ordre de grandeur du cours) et une pièce en polymère de 2 GPa. Combien de fois la céramique est-elle plus rigide ?");
      j.nombre({ avant: "\\dfrac{200}{2} =", cases: [{ attendu: 100, tol: 0 }], ligne: true,
        aide: function () { return "Divise le module de la céramique par celui du polymère."; },
        ok: function () { j.bravo("100 fois plus rigide."); j.suite(); } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Un camarade écrit : « La zircone Y-TZP est un métal stabilisé par 2 à 3 % d'yttrium. » Où est l'erreur ?");
      j.choix([
        { html: "La zircone est une céramique (oxyde de zirconium), pas un métal", juste: true },
        { html: "Il faudrait 20 à 30 %", aide: "Le cours donne bien environ 2 à 3 % molaire d'Y₂O₃." },
        { html: "Y-TZP veut dire titane", aide: "Y-TZP : Yttria Tetragonal Zirconia Polycrystal." }
      ], { colonnes: 1, ok: function () {
        j.bravo("ZrO₂ est un oxyde : une céramique.");
        j.suite();
      } });
    } },
    { nom: "Composite ou non ?", jouer: function (j, n) {
      j.titre("Lequel de ces matériaux est un composite ?");
      j.choix([
        { html: "Un alliage de titane", aide: "Un alliage est un mélange de métaux à l'échelle des atomes : c'est un métal." },
        { html: "Une résine renforcée de fibres de carbone", juste: true },
        { html: "Une céramique d'alumine pure", aide: "Un seul matériau." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Fibres + matrice qui ne se mélangent pas.");
        j.expliquer("<p>Composite : assemblage d'au moins deux matériaux qui ne se mélangent pas (renfort et matrice), alors qu'un alliage est un métal.</p>");
        j.suite();
      } });
    } }
  ]
});
