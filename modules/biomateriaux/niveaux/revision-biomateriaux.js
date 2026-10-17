/* Révision du chapitre 1 : classes, ingénierie tissulaire, croissance, définition actuelle, vocabulaire, sur des cas nouveaux. */
NIVEAU({
  id: "revision-biomateriaux",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { actif: null };
    var PTS = { oeil: [372, 118, "œil", 470, 90], peau: [270, 250, "peau du bras", 140, 200], coeur: [365, 250, "cœur", 500, 230], perf: [250, 330, "perfusion", 120, 360], hanche: [320, 400, "hanche", 480, 420] };
    n.dessin = function () {
      E.vider(g);
      var peau = "#ffe6da";
      D.rond(g, [340, 120], 52, { fill: peau, stroke: C.encre, ep: 3 });
      E.s("path", { d: "M260 190 Q340 170 420 190 L440 400 Q340 430 240 400 Z", fill: peau, stroke: C.encre, "stroke-width": 3 }, g);
      E.s("path", { d: "M262 200 L200 360 M418 200 L480 360", stroke: peau, "stroke-width": 34, "stroke-linecap": "round", fill: "none" }, g);
      E.s("path", { d: "M262 200 L200 360 M418 200 L480 360", stroke: C.encre, "stroke-width": 3, fill: "none", opacity: 0.25 }, g);
      E.s("path", { d: "M270 410 L260 560 M410 410 L420 560", stroke: peau, "stroke-width": 40, "stroke-linecap": "round", fill: "none" }, g);
      Object.keys(PTS).forEach(function (k) {
        var p = PTS[k], a = n.actif === k;
        D.rond(g, [p[0], p[1]], a ? 14 : 8, { fill: a ? D.C.jeu : C.gris, stroke: "#fff", ep: 3 });
        if (a) { D.ligne(g, [p[0], p[1]], [p[3], p[4]], D.C.jeu, 2.5); D.texte(g, p[2], [p[3], p[4] - 4], { taille: 18, coul: D.C.jeu, ancre: p[3] > 340 ? "start" : "end" }); }
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Une lentille souple", jouer: function (j, n) {
      n.actif = "oeil"; n.dessin();
      j.fig.astuce("");
      j.titre("Une lentille de contact souple en hydrogel, portée une journée. Dans quelle classe ?");
      j.choix([{ html: "I", aide: "La classe I regroupe les DM non invasifs. La lentille est posée sur l'œil." }, { html: "IIa", juste: true }, { html: "III", aide: "Pas de contact avec le cœur, le SCC ou le SNC, pas d'effet biologique." }], { ok: function () {
        j.bravo("IIa : invasif de courte durée.");
        j.suite();
      } });
    } },
    { nom: "Une peau cultivée", jouer: function (j, n) {
      n.actif = "peau"; n.dessin();
      j.titre("Après une brûlure, on cultive en laboratoire une peau à partir des cellules du patient, sur un support qui se dégrade, puis on la greffe une fois mature. Quelle voie de l'ingénierie tissulaire ?");
      j.choix([
        { html: "La voie in vitro : générer le tissu fonctionnel avant l'implantation", juste: true },
        { html: "La voie in vivo : implanter un greffon immature qui mûrit sur place", aide: "Ici la peau est greffée « une fois mature » : la maturation s'est faite où ?" },
        { html: "Ce n'est pas de l'ingénierie tissulaire : il n'y a pas de matériau", aide: "Il y a bien un support qui se dégrade, des cellules et une culture : la triade est là." }
      ], { colonnes: 1, ok: function () {
        j.bravo("In vitro, avec des cellules autologues (celles du patient).");
        j.suite();
      } });
    } },
    { nom: "Croissance de 2013 à 2015", jouer: function (j, n) {
      n.actif = null; n.dessin();
      j.titre("Le marché de l'ingénierie tissulaire et de la médecine régénérative est passé de 17 milliards de dollars en 2013 à 27,3 en 2015. Taux annuel moyen, en % ?");
      j.nombre({ avant: "t \\approx", apres: "\\%", cases: [{ attendu: Math.round(BIO.croissanceAnnuelle(17, 27.3, 2) * 100), tol: 1 }], ligne: true,
        aide: function () { return "Deux années : \\(t = (27{,}3/17)^{1/2} - 1\\)."; },
        ok: function () { j.bravo("Environ 27 % par an, comme le dit le cours."); j.suite(); } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.actif = "perf"; n.dessin();
      j.titre("Une fiche de stage dit : « La pompe à perfusion est un DM de classe I, car elle ne touche pas le cœur. » Où est l'erreur ?");
      j.choix([
        { html: "La pompe à perfusion est un DM invasif à usage prolongé : classe IIb", juste: true },
        { html: "La pompe à perfusion est un médicament", aide: "Elle délivre un médicament, mais son mode d'action à elle est mécanique." },
        { html: "Il n'y a pas d'erreur", aide: "Ne pas toucher le cœur n'enlève pas le caractère invasif. Relis les exemples de la classe IIb." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Classe IIb, avec les implants chirurgicaux et le matériel d'hémodialyse.");
        j.suite();
      } });
    } },
    { nom: "La définition actuelle", jouer: function (j, n) {
      n.actif = "hanche"; n.dessin();
      j.titre("Complète la définition actuelle d'un biomatériau, telle qu'elle est donnée dans le cours.");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.4">« Matériau destiné à <span class="trou" data-attendu="a"></span> ou à <span class="trou" data-attendu="r"></span> tout ou partie d\'un organe <span class="trou" data-attendu="d"></span> »</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "d", html: "déficient" }, { id: "x", html: "inerte" }, { id: "r", html: "remplacer" }, { id: "a", html: "alimenter" }, { id: "y", html: "synthétique" }],
        aide: "La définition actuelle parle d'un organe qui ne fonctionne plus bien. « Inerte » et « synthétique » viennent des anciennes définitions.",
        ok: function () {
          j.bravo("« Matériau destiné à alimenter ou à remplacer tout ou partie d'un organe déficient ».");
          j.expliquer("<p>Elle intègre l'environnement biologique (système vivant, fluides, protéines, cellules, tissus) et les contraintes biologiques : un biomatériau doit exister au contact des tissus sans degré de défense inacceptable ni réponse hostile de l'hôte.</p>");
          j.suite();
        }
      });
    } }
  ]
});
