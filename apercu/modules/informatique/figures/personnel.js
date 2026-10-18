/* Figure : les acteurs internes et externes autour du SI. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-acteurs", {
    largeur: 960, hauteur: 520, titre: "Les acteurs d'un SI",
    essai: "<strong>Essaie</strong> : touche chaque acteur. <strong>Observe</strong> : trois directions à l'intérieur, quatre familles à l'extérieur."
  });
  var I = [
    { x: 300, y: 70, w: 360, h: 80, t: "Direction de gestion", sous: "management", texte: "acteur interne : la direction qui pilote l'établissement." },
    { x: 300, y: 190, w: 360, h: 80, t: "Direction métier", sous: "corps métiers, utilisateurs", texte: "acteur interne : médecins, infirmiers, agents qui utilisent le SI." },
    { x: 300, y: 310, w: 360, h: 120, t: "Direction SI", sous: "DSI, RSSI, administrateur réseau / système, chef de projet, développeurs, data analyst...", texte: "acteur interne : ceux qui construisent, font tourner et protègent le SI." }
  ].map(function (x) { x.coul = C.jeu; x.pale = C.jeuPale; x.taille = 19; x.tailleSous = 14; return x; });
  var E = [
    { x: 20, y: 40, w: 220, h: 80, t: "Partenaires", texte: "acteur externe : par exemple un organisme payeur comme la CNSS, un autre établissement." },
    { x: 720, y: 40, w: 220, h: 80, t: "Fournisseurs", texte: "acteur externe : éditeurs de logiciels, fabricants, prestataires de maintenance." },
    { x: 20, y: 400, w: 220, h: 80, t: "Clients", texte: "acteur externe : à l'hôpital, les patients et leurs proches." },
    { x: 720, y: 400, w: 220, h: 80, t: "Régulateurs", texte: "acteur externe : autorités qui fixent les règles, comme le ministère de la Santé." }
  ].map(function (x) { x.coul = C.acc; x.pale = C.accPale; x.taille = 19; return x; });
  A.explorer(f, I.concat(E), { fond: function (g) {
    A.s("rect", { x: 280, y: 30, width: 400, height: 430, rx: 26, fill: C.fond, stroke: C.jeu, "stroke-width": 3, "stroke-dasharray": "10 7" }, g);
    A.texte(g, "Acteurs internes", [480, 50], { taille: 15, gras: 800, coul: C.jeuTexte });
    A.texte(g, "Acteurs externes", [130, 260], { taille: 15, gras: 800, coul: C.acc }); A.texte(g, "Acteurs externes", [830, 260], { taille: 15, gras: 800, coul: C.acc });
  } });
})();
