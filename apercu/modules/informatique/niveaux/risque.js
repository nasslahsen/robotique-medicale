/* Niveau : le risque, matrice probabilité × impact, analogie des clés sous le tapis (cyber, diapos 21 et 22).
   Les notes de 1 à 4 sur chaque axe sont ajoutées pour calculer Risque = Probabilité × Impact. */
NIVEAU(SIS.rejouable({
  id: "risque",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, montrer: false };
    n.PROB = [["Très improbable", "exceptionnel"], ["Improbable", "rare"], ["Probable", "fréquent"], ["Très probable", "très fréquent"]];
    n.IMP = [["Mineur", "faible"], ["Modéré", "moyen"], ["Important", "grave"], ["Majeur", "vital"]];
    n.X0 = 190; n.Y0 = 40; n.L = 118; n.H = 96;
    n.cell = function (p, i) { return { x: n.X0 + (i - 1) * n.L, y: n.Y0 + (4 - p) * n.H, w: n.L, h: n.H }; };
    n.teinte = function (r) { return r >= 9 ? "#b98ce6" : r >= 4 ? "#dcc6f3" : "#f3ebfb"; };
    n.matrice = function (g2, etat, marques) {
      for (var p = 1; p <= 4; p++) for (var i = 1; i <= 4; i++) {
        var r = n.cell(p, i), k = (p - 1) * 4 + (i - 1), ok = etat && etat.trouve[k], f = etat && etat.faux === k;
        A.s("rect", { x: r.x, y: r.y, width: r.w, height: r.h, fill: f ? C.koPale : n.teinte(p * i), stroke: "#fff", "stroke-width": 3 }, g2);
        if (n.montrer) A.texte(g2, String(p * i), [r.x + r.w / 2, r.y + r.h / 2], { taille: 22, mono: true, gras: 700, coul: C.encre, halo: false });
        if (ok) A.s("rect", { x: r.x + 5, y: r.y + 5, width: r.w - 10, height: r.h - 10, rx: 8, fill: "none", stroke: C.ok, "stroke-width": 6 }, g2);
      }
      (marques || []).forEach(function (m) { var r = n.cell(m[0], m[1]); A.s("circle", { cx: r.x + r.w - 20, cy: r.y + 20, r: 13, fill: m[3] || C.acc }, g2); A.texte(g2, m[2], [r.x + r.w - 20, r.y + 20], { taille: 13, coul: "#fff", halo: false, gras: 800 }); });
      n.PROB.forEach(function (t, k) { A.texte(g2, t[0], [96, n.Y0 + (3 - k) * n.H + 40], { taille: 14, gras: 700, halo: false }); A.texte(g2, t[1] + " (" + (k + 1) + ")", [96, n.Y0 + (3 - k) * n.H + 62], { taille: 12, coul: C.doux, halo: false }); });
      n.IMP.forEach(function (t, k) { A.texte(g2, t[0] + " (" + (k + 1) + ")", [n.X0 + k * n.L + n.L / 2, 446], { taille: 14, gras: 700, halo: false }); A.texte(g2, t[1], [n.X0 + k * n.L + n.L / 2, 468], { taille: 12, coul: C.doux, halo: false }); });
      A.texte(g2, "Probabilité ↑", [96, 22], { taille: 14, gras: 800, coul: C.v });
      A.texte(g2, "Impact →", [420, 500], { taille: 14, gras: 800, coul: C.v });
      A.texte(g2, "Notes de 1 à 4 : exemple ajouté", [420, 530], { taille: 13, coul: C.doux });
    };
    return n;
  },
  etapes: [
    { nom: "Placer un risque", jouer: function (j, n) {
      var A = SIS, zones = [];
      for (var p = 1; p <= 4; p++) for (var i = 1; i <= 4; i++) { var r = n.cell(p, i); zones.push({ x: r.x, y: r.y, w: r.w, h: r.h, bon: p === 3 && i === 4 }); }
      j.titre("Risque : un rançongiciel chiffre le PACS. On le juge probable (fréquent), avec un impact majeur. Touche sa case.");
      var r = A.reperer({ g: n.g, zones: zones, dessiner: function (g2, e) { n.matrice(g2, e); },
        erreur: j.erreur, aide: function (k) { var p = Math.floor(k / 4) + 1, i = k % 4 + 1; return p !== 3 ? "Regarde d'abord la ligne : « probable ». Les lignes sont les probabilités." : "La ligne est bonne. Pour la colonne : un impact « majeur »."; },
        fin: function () {
          j.bravo("Probable × majeur : en haut à droite, zone foncée.");
          j.expliquer("<p>Le <b>risque</b> est la probabilité qu'une menace exploite une vulnérabilité d'un SI, entraînant des conséquences négatives. Le cours l'écrit : <b>Risque = Probabilité (ou Menace) × Impact (ou Vulnérabilité / Gravité)</b>.</p>");
          j.suite();
        } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Le chiffrer", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.matrice(n.g, null, [[3, 4, "R"]]);
      j.titre("Note la probabilité et l'impact de 1 à 4. Combien vaut le risque du rançongiciel ?");
      j.nombre({ cases: [{ attendu: 12 }], avant: "R = P \\times I =", aide: function () { return "Probable = 3, majeur = 4."; }, ok: function () {
        n.montrer = true; A.vider(n.g); n.matrice(n.g, null, [[3, 4, "R"]]);
        j.bravo("\\(R = 3 \\times 4 = 12\\).");
        j.suite();
      } });
    } },
    { nom: "Lequel d'abord ?", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.matrice(n.g, null, [[3, 4, "R"], [4, 2, "C"]]);
      j.titre("Autre risque : la climatisation du local serveur tombe en panne, très probable, impact modéré (C). Avec un seul budget, lequel traiter d'abord ?");
      j.choix([
        { html: "Le rançongiciel : R = 12", juste: true },
        { html: "La climatisation : elle est plus probable", aide: "Calcule les deux produits : 4 × 2 et 3 × 4." },
        { html: "Les deux se valent", aide: "Les produits sont différents : 8 et 12." }
      ], { colonnes: 1, ok: function () { j.bravo("12 contre 8 : le rançongiciel d'abord, même s'il est moins probable."); j.suite(); } });
    } },
    { nom: "Faire baisser le risque", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.matrice(n.g, null, [[3, 4, "R"]]);
      j.titre("L'hôpital met en place des sauvegardes hors ligne testées : en cas de rançongiciel, on restaure vite. L'impact passe de majeur à modéré. Nouveau risque ?");
      j.nombre({ cases: [{ attendu: 6 }], avant: "R =", aide: function () { return "La probabilité ne change pas (3), l'impact devient modéré (2)."; }, ok: function () {
        A.vider(n.g); n.matrice(n.g, null, [[3, 4, "R", A.C.gris], [3, 2, "R", A.C.ok]]);
        j.bravo("\\(3 \\times 2 = 6\\) : on a réduit l'impact, pas la menace.");
        j.suite();
      } });
    } },
    { nom: "Les clés sous le tapis", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours explique le risque avec des clés sous le tapis. Range chaque élément de la version hôpital.");
      var cartes = [{ t: "Mot de passe collé sous le clavier d'un poste des urgences", bac: 0 }, { t: "Un visiteur malveillant cherche un poste ouvert", bac: 1 }, { t: "Dossiers de patients copiés sur une clé USB", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Vulnérabilité", sous: "clés sous le tapis" }, { t: "Menace", sous: "intrusion" }, { t: "Incident", sous: "vol des objets de valeur" }],
        pos: function (i) { return { x: 14 + i * 222, y: 30, w: 208, h: 180 }; },
        bacsPos: function (k) { return { x: 14 + k * 222, y: 320, w: 208, h: 200 }; },
        taille: 16, tailleBac: 20,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["C'est la faiblesse, comme la clé cachée.", "C'est le danger qui rôde, comme le cambrioleur.", "C'est ce qui finit par arriver, comme le vol."][i]; },
        fin: function () { j.bravo("La vulnérabilité donne un risque d'exploitation à la menace, qui conduit à l'incident."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } }
  ]
}));
