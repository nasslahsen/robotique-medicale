/* Niveau : menace (délibérée, accidentelle), vulnérabilité, attaque (cyber, diapos 16 à 18). */
NIVEAU(SIS.rejouable({
  id: "menace-vulnerabilite",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    // cercles concentriques avec ouvertures (figure de l'attaque du cours)
    n.cible = function (g2, etat) {
      var c = [400, 330], R = [220, 160, 100], ouv = [200, 118, 250];
      function pol(r, a) { var t = a * Math.PI / 180; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]; }
      R.forEach(function (r, k) {
        var a1 = ouv[k] * Math.PI / 180, lg = 0.26, debut = a1 + lg / 2, fin = a1 - lg / 2 + 2 * Math.PI;
        A.s("path", { d: "M" + (c[0] + r * Math.cos(debut)) + " " + (c[1] + r * Math.sin(debut)) + " A" + r + " " + r + " 0 1 1 " + (c[0] + r * Math.cos(fin)) + " " + (c[1] + r * Math.sin(fin)), fill: "none", stroke: C.ok, "stroke-width": 26, opacity: 0.35 }, g2);
        var q = pol(r + 24, ouv[k]);
        if (etat >= 1) A.texte(g2, "vulnérabilité " + (k + 1), [q[0], q[1] - 6], { taille: 13, coul: C.ko, gras: 700 });
      });
      A.s("circle", { cx: c[0], cy: c[1], r: 46, fill: C.ko }, g2); A.texte(g2, "bien", c, { taille: 16, coul: "#fff", halo: false, gras: 800 });
      if (etat >= 1) {
        var pts = [[20, pol(250, 200)[1]], pol(250, 200), pol(190, 200)], a;
        for (a = 190; a >= 118; a -= 8) pts.push(pol(190, a));
        pts.push(pol(190, 118)); pts.push(pol(130, 118));
        for (a = 126; a <= 250; a += 8) pts.push(pol(130, a));
        pts.push(pol(130, 250)); pts.push(pol(60, 250));
        A.chemin(g2, pts, { coul: "#b07d14", ep: 4, tirets: "12 6" });
        A.texte(g2, "menace", [40, pol(250, 200)[1] - 22], { taille: 15, coul: "#b07d14", gras: 800, ancre: "start" });
      }
    };
    return n;
  },
  etapes: [
    { nom: "Menace ou vulnérabilité ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque élément : menace, ou vulnérabilité ?");
      var cartes = [{ t: "Rançongiciel", bac: 0 }, { t: "Système d'exploitation non patché", bac: 1 }, { t: "Mot de passe faible", bac: 1 }, { t: "Stagiaire malintentionné", bac: 0 }, { t: "Incendie volontaire du local serveur", bac: 0 }, { t: "Port USB ouvert sur un poste du hall", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Menace", sous: "cause potentielle d'un incident" }, { t: "Vulnérabilité", sous: "faiblesse au niveau d'un bien" }],
        pos: A.grille(6, 2, 20, 20, 640, 80, 14), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 220 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "C'est ce qui pourrait causer un dommage : une origine, un danger." : "C'est un défaut du bien : conception, installation, configuration ou utilisation."; },
        fin: function () {
          j.bravo("Menaces : rançongiciel, stagiaire, incendie. Vulnérabilités : OS non patché, mot de passe faible, port ouvert.");
          j.expliquer("<p><b>Menace</b> : cause potentielle d'un incident, ou origine d'un événement qui pourrait entraîner des dommages sur un bien ou un actif informationnel, si elle se concrétisait. <b>Vulnérabilité</b> : faiblesse au niveau d'un bien (conception, réalisation, installation, configuration ou utilisation).</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Délibérée ou accidentelle ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours distingue deux sortes de menaces. Range chacune.");
      var cartes = [{ t: "Personne extérieure malveillante", bac: 0 }, { t: "Perte de service sur un serveur", bac: 1 }, { t: "Vol des supports de sauvegarde", bac: 0 }, { t: "Divulgation après un accès à un site web", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Menace délibérée" }, { t: "Menace accidentelle" }],
        pos: A.grille(4, 2, 20, 30, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Quelqu'un l'a voulu." : "Personne ne l'a voulu."; },
        fin: function () { j.bravo("Délibérées : malveillance, vol, divulgation. Accidentelle : perte de service."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Ce qu'est une attaque", jouer: function (j, n) {
      var A = SIS;
      A.vider(n.g); n.cible(n.g, 1);
      j.titre("Complète la définition d'une attaque, en t'aidant de la figure.");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.4">Une attaque est une action malveillante. Elle représente la concrétisation d\'une <span class="trou" data-attendu="m"></span>, et nécessite l\'exploitation d\'une <span class="trou" data-attendu="v"></span>.</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "v", html: "vulnérabilité" }, { id: "i", html: "incident" }, { id: "m", html: "menace" }],
        aide: "Le trait pointillé vient de l'extérieur (le danger) et passe par les ouvertures (les faiblesses).",
        ok: function () { j.bravo("Une menace qui se concrétise, en exploitant une vulnérabilité."); j.suite(); }
      });
    } },
    { nom: "Sans faille", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["bouclier", "pirate"], titre: "Une menace, aucune faille exploitable" });
      j.titre("Une menace existe (un groupe de rançongiciel vise les hôpitaux), mais elle ne trouve aucune vulnérabilité exploitable. Y a-t-il attaque réussie ?");
      j.choix([{ html: "Non : une attaque nécessite l'exploitation d'une vulnérabilité", juste: true }, { html: "Oui : la menace suffit", aide: "Relis la définition : il faut une menace ET une vulnérabilité." }], { colonnes: 1, ok: function () { j.bravo("Sans vulnérabilité, la menace reste une menace. Mais rien n'est sûr à 100 %."); j.suite(); } });
    } }
  ]
}));
