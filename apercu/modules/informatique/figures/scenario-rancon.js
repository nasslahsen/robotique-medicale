/* Figure : l'hôpital à 13 h 45, partie par partie, et ce que chaque service fait dans l'heure. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-hopital", {
    largeur: 960, hauteur: 520, titre: "Lundi, 13 h 45",
    essai: "<strong>Essaie</strong> : touche chaque partie de l'hôpital. <strong>Observe</strong> : rouge, compromis ; orange, dégradé ; et pour chaque service, son geste dans l'heure."
  });
  var KO = { coul: C.ko, pale: C.koPale }, DG = { coul: "#b07d14", pale: "#fbf1d9" }, OK = { coul: C.acc, pale: C.accPale };
  var it = [
    { x: 20, y: 30, w: 290, h: 110, t: "Administratif", sous: "postes chiffrés", st: KO, texte: "compromis : tous les postes affichent la rançon." },
    { x: 335, y: 30, w: 290, h: 110, t: "Serveurs, PACS", sous: "indisponibles", st: KO, texte: "compromis : le PACS est inaccessible." },
    { x: 650, y: 30, w: 290, h: 110, t: "Urgences", sous: "restent ouvertes", st: OK, texte: "bascule papier ; tri des urgences. Les soins continuent." },
    { x: 20, y: 190, w: 290, h: 110, t: "Imagerie", sous: "scanner actif", st: DG, texte: "dégradé : isoler le scanner du réseau, stocker les images en local." },
    { x: 335, y: 190, w: 290, h: 110, t: "Laboratoire", sous: "envoi des résultats bloqué", st: DG, texte: "dégradé : résultats sur papier, contacter la DSI." },
    { x: 650, y: 190, w: 290, h: 110, t: "Biomédical", sous: "dispositifs médicaux", st: OK, texte: "isoler le réseau ; repérer les DM touchés ou exposés." },
    { x: 180, y: 350, w: 600, h: 110, t: "RSSI", sous: "pilote la réponse", st: OK, texte: "alerter la DGSSI ; isoler le SI." }
  ].map(function (x) { x.coul = x.st.coul; x.pale = x.st.pale; x.fond = x.st.pale; x.bord = x.st.coul; x.taille = 22; x.tailleSous = 16; return x; });
  A.explorer(f, it, { devant: function (g) {
    [[C.ko, "compromis / indisponible"], ["#b07d14", "fonctionnement dégradé"]].forEach(function (l, k) { A.s("rect", { x: 250 + k * 270, y: 488, width: 22, height: 22, rx: 6, fill: "#fff", stroke: l[0], "stroke-width": 3 }, g); A.texte(g, l[1], [282 + k * 270, 499], { taille: 15, ancre: "start", coul: l[0], gras: 700 }); });
  } });
})();
