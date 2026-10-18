/* Figure : un petit réseau d'hôpital ; équipements actifs et passifs, liaisons filaires et sans fil. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-reseau", {
    largeur: 960, hauteur: 540, titre: "Matériel et réseau d'un service",
    essai: "<strong>Essaie</strong> : touche chaque équipement, puis affiche actifs et passifs. <strong>Observe</strong> : les actifs sont alimentés et dirigent le trafic, les passifs le transportent."
  });
  var montrer = false;
  var E = [
    { x: 40, y: 40, w: 180, h: 80, t: "Serveur", actif: null, texte: "il calcule et stocke (local ou cloud : SaaS, PaaS, IaaS). Son choix décide de la capacité de traitement et de stockage." },
    { x: 390, y: 40, w: 180, h: 80, t: "Routeur", actif: true, texte: "équipement actif : il relie le réseau de l'hôpital aux autres réseaux." },
    { x: 390, y: 220, w: 180, h: 80, t: "Switch", actif: true, texte: "équipement actif : il distribue le trafic entre les postes du service." },
    { x: 700, y: 220, w: 200, h: 80, t: "Borne wifi", actif: true, texte: "équipement actif, liaison sans fil : elle relie tablettes et moniteurs mobiles. Débit et fiabilité du lien à surveiller." },
    { x: 40, y: 220, w: 180, h: 80, t: "Câble Ethernet", actif: false, texte: "équipement passif, liaison filaire : il transporte le signal sans le traiter." },
    { x: 220, y: 420, w: 200, h: 80, t: "Postes et imprimante", actif: null, texte: "ordinateurs et imprimantes : l'aisance de manipulation dépend de leur choix." },
    { x: 700, y: 420, w: 200, h: 80, t: "Tablette au lit", actif: null, texte: "elle suit l'infirmière : aisance de manipulation, liaison sans fil." },
    { x: 460, y: 420, w: 200, h: 80, t: "Fibre optique", actif: false, texte: "équipement passif, liaison filaire à haut débit entre bâtiments." }
  ];
  var ex, items;
  function lancer() {
    items = E.map(function (e) { var it = Object.assign({}, e); it.taille = 18; it.sous = montrer && e.actif !== null ? (e.actif ? "actif" : "passif") : null; if (montrer && e.actif !== null) { it.fond = e.actif ? C.accPale : C.brunPale; it.bord = e.actif ? C.acc : C.brun; } return it; });
    if (ex) ex.g.remove();
    ex = A.explorer(f, items, { fond: function (g) {
      [[130, 120, 390, 80], [480, 120, 480, 220], [220, 260, 390, 260], [480, 300, 320, 420], [480, 300, 560, 420]].forEach(function (l) { A.s("line", { x1: l[0], y1: l[1], x2: l[2], y2: l[3], stroke: C.encre, "stroke-width": 4 }, g); });
      A.s("line", { x1: 572, y1: 260, x2: 698, y2: 260, stroke: C.encre, "stroke-width": 4 }, g);
      A.s("line", { x1: 800, y1: 302, x2: 800, y2: 418, stroke: C.acc, "stroke-width": 4, "stroke-dasharray": "4 8" }, g);
      A.texte(g, "sans fil", [850, 360], { taille: 15, coul: C.acc, gras: 700 });
    } });
  }
  var b = R.boutons(f.reglages);
  var bt = R.bouton(b, "Montrer actifs et passifs", function () { montrer = !montrer; bt.classList.toggle("actif", montrer); lancer(); });
  lancer();
})();
