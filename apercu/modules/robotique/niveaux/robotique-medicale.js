/* Niveau : spécificités de la robotique médicale. Cible qui respire, mise à l'échelle, industriel ou médical, normes. */
NIVEAU({
  id: "robotique-medicale",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "aiguille", t: 0, suivi: false, pique: null, main: 2, rapport: 0.3 };
    var PLAN = [340, 360], AMP = 34;
    n.cibleY = function () { return PLAN[1] + AMP * Math.sin(n.t); };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "aiguille") {
        var dy = AMP * Math.sin(n.t);
        // coupe du thorax : la peau et l'organe montent et descendent avec la respiration
        E.s("path", { d: "M40 " + (250 + dy * 0.5) + " Q340 " + (200 + dy * 0.6) + " 640 " + (250 + dy * 0.5) + " L640 560 L40 560 Z", fill: "#ffe6da", stroke: "#e7a98e", "stroke-width": 2 }, g);
        E.s("ellipse", { cx: 340, cy: PLAN[1] + dy, rx: 120, ry: 70, fill: "#f6c2b0", stroke: "#d98c74", "stroke-width": 2 }, g);
        var cy = n.cibleY();
        D.rond(g, [340, cy], 16, { fill: C.jeu, stroke: "#fff", ep: 3 });
        // point planifié
        D.ligne(g, [318, PLAN[1]], [362, PLAN[1]], C.acc, 2.5, "5 4"); D.ligne(g, [340, PLAN[1] - 22], [340, PLAN[1] + 22], C.acc, 2.5, "5 4");
        D.texte(g, "point planifié", [372, PLAN[1] - 2], { ancre: "start", taille: 15, coul: C.acc });
        // aiguille
        var bout = n.pique ? n.pique.y : 120, x = 340;
        E.s("rect", { x: x - 18, y: 30, width: 36, height: 60, rx: 6, fill: "#9aa0ad" }, g);
        D.ligne(g, [x, 90], [x, bout], C.encre, 4);
        if (n.pique && n.pique.fini) D.texte(g, n.pique.ok ? "touché" : "manqué", [x - 30, bout - 30], { ancre: "end", taille: 18, coul: n.pique.ok ? C.ok : C.ko });
        fig.chip(n.suivi ? "suivi activé" : "sans suivi");
      } else if (n.mode === "echelle") {
        fig.chip(null);
        var u = 90, xa = 120;
        D.texte(g, "main", [xa - 20, 190], { ancre: "end", taille: 19 });
        D.texte(g, "instrument", [xa - 20, 390], { ancre: "end", taille: 19 });
        for (var k = 0; k <= 5; k++) { D.ligne(g, [xa + k * u, 225], [xa + k * u, 240], C.gris, 2); D.texte(g, k + " cm", [xa + k * u, 258], { taille: 13, coul: C.gris, gras: false }); }
        D.ligne(g, [xa, 232], [xa + 5 * u, 232], C.pale, 2);
        for (k = 0; k <= 5; k++) { D.ligne(g, [xa + k * u, 425], [xa + k * u, 440], C.gris, 2); D.texte(g, k + " cm", [xa + k * u, 458], { taille: 13, coul: C.gris, gras: false }); }
        D.ligne(g, [xa, 432], [xa + 5 * u, 432], C.pale, 2);
        var m = n.main, ins = m * n.rapport;
        if (m > 0) D.fleche(g, [xa, 190], [xa + m * u, 190], "#8b3fd9", 6);
        if (ins > 0) D.fleche(g, [xa, 390], [xa + ins * u, 390], C.jeu, 6);
        D.rond(g, [xa + m * u, 150], 12, { fill: "#8b3fd9", stroke: "#fff", ep: 3 });
        D.ligne(g, [xa + m * u, 162], [xa + ins * u, 378], C.gris, 1.5, "5 5");
      } else {
        fig.chip(null);
        D.texte(g, "industrie", [180, 80], { taille: 22 }); D.texte(g, "médical", [500, 80], { taille: 22 });
        D.ligne(g, [340, 110], [340, 540], C.pale, 2);
        // cellule industrielle : robot derrière une clôture, pièces identiques
        E.s("rect", { x: 90, y: 420, width: 70, height: 30, rx: 5, fill: "#9aa0ad" }, g);
        D.ligne(g, [125, 420], [125, 300], "#ff8a5c", 18); D.ligne(g, [125, 300], [215, 340], "#ff8a5c", 15);
        [0, 1, 2].forEach(function (i) { E.s("rect", { x: 200 + i * 34, y: 410, width: 26, height: 26, fill: "#c5d2fb", stroke: C.encre, "stroke-width": 1.5 }, g); });
        for (var x = 70; x <= 300; x += 23) D.ligne(g, [x, 470], [x, 520], C.jeu, 3);
        D.ligne(g, [70, 480], [300, 480], C.jeu, 3); D.ligne(g, [70, 510], [300, 510], C.jeu, 3);
        // bloc : robot au contact du patient
        E.s("rect", { x: 380, y: 400, width: 240, height: 24, rx: 8, fill: "#c6cbd8" }, g);
        E.s("ellipse", { cx: 520, cy: 388, rx: 90, ry: 22, fill: "#ffe6da", stroke: "#e7a98e", "stroke-width": 2 }, g);
        D.rond(g, [420, 384], 20, { fill: "#ffe6da", stroke: "#e7a98e", ep: 2 });
        E.s("rect", { x: 560, y: 470, width: 60, height: 40, rx: 5, fill: "#9aa0ad" }, g);
        D.ligne(g, [590, 470], [590, 270], "#8b3fd9", 16); D.ligne(g, [590, 270], [520, 330], "#8b3fd9", 12); D.ligne(g, [520, 330], [520, 362], C.encre, 4);
      }
    };
    var anim = setInterval(function () { if (n.mode === "aiguille") { n.t += 0.045; if (n.pique && !n.pique.fini) n.avance(); n.dessin(); } }, 40);
    n.avance = function () {
      var p = n.pique, vise = n.suivi ? n.cibleY() : PLAN[1];
      p.y += 14;
      if (p.y >= vise) {
        p.y = vise; p.fini = true; p.ecart = vise - n.cibleY(); p.ok = Math.abs(p.ecart) < 10;
        if (n.surFin) n.surFin(p.ok);
      }
    };
    n.piquer = function () { n.pique = { y: 120, fini: false }; };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La cible respire", jouer: function (j, n) {
      j.fig.astuce("La cible (orange) monte et descend avec la respiration. Le robot vise le point planifié (bleu).");
      j.titre("Le robot doit piquer la cible avec une aiguille. Lance-le.");
      var bt = E.h("button", "btn bleu", "Piquer", j.el); bt.type = "button";
      var fois = 0, q = false;
      bt.addEventListener("click", function () { if (n.pique && !n.pique.fini) return; n.piquer(); });
      n.surFin = function (ok) {
        fois++;
        if (fois === 1 || (!q && fois === 2)) j.info(ok ? "Touché, cette fois. Recommence pour voir." : "Manqué.");
        if (fois >= 2 && !q) {
          q = true; bt.remove();
          j.consigne("Pourquoi l'aiguille manque-t-elle la cible ?");
          j.choix([{ html: "L'aiguille est trop lente", aide: "Même très rapide, elle irait au point planifié, où la cible n'est presque jamais." }, { html: "La cible bouge avec la respiration, le robot vise un point fixe", juste: true }, { html: "Le robot n'est pas répétable", aide: "Il revient toujours au même point planifié : il est répétable. C'est la cible qui se déplace." }], { colonnes: 1, ok: function () {
            j.bravo("L'erreur suit l'amplitude de la respiration.");
            j.suite();
          } });
        }
      };
      j.reponse(function () { while (!q) n.surFin(false); });
    } },
    { nom: "Le suivi", jouer: function (j, n) {
      n.pique = null;
      j.fig.astuce("");
      j.titre("Qu'ajouter au robot pour ne plus manquer la cible ?");
      j.choix([{ html: "Une barrière immatérielle", aide: "Elle protège les personnes autour du robot ; elle ne voit pas la cible." }, { html: "Le suivi du mouvement physiologique par imagerie en temps réel", juste: true }, { html: "Une cadence plus élevée", aide: "La cadence est un objectif industriel ; ici le problème est de voir où est la cible." }], { colonnes: 1, ok: function () {
        n.suivi = true;
        j.info("Suivi activé. Pique à nouveau.");
        var bt = E.h("button", "btn bleu", "Piquer", j.el); bt.type = "button";
        bt.addEventListener("click", function () { if (n.pique && !n.pique.fini) return; n.piquer(); });
        n.surFin = function (ok) {
          if (!ok) return;
          n.surFin = null; bt.remove();
          j.bravo("Touché : le robot suit la cible.");
          j.expliquer("<p>Premier écart avec l'industrie : du <b>produit standardisé</b> au <b>patient variable</b>. Le robot a besoin d'une <b>perception adaptative</b> : imagerie en temps réel, recalage anatomique, suivi des mouvements physiologiques (respiration, battements cardiaques, mouvements involontaires).</p>");
          j.suite();
        };
        j.reponse(function () { if (n.surFin) n.surFin(true); });
      } });
    } },
    { nom: "Mise à l'échelle", jouer: function (j, n) {
      n.mode = "echelle"; n.dessin();
      j.fig.astuce("Téléopération : la console réduit l'amplitude des gestes du chirurgien.");
      j.titre("Le rapport est de 0,3 : 1 cm de la main donne 3 mm à l'instrument. Combien pour 2 cm, puis pour 1,5 cm ?");
      j.curseur({ nom: "main", min: 0, max: 5, pas: 0.5, val: n.main, unite: " cm", dec: 1, change: function (v) { n.main = v; n.dessin(); } });
      j.nombre({ avant: "2\\ \\text{cm} \\to,\\ 1{,}5\\ \\text{cm} \\to", apres: "\\text{mm}", cases: [{ attendu: 6, tol: 0.001 }, { attendu: 4.5, tol: 0.001 }], ligne: true,
        aide: function (k) { return "Déplacement de l'instrument = rapport × déplacement de la main, puis 1 cm = 10 mm."; },
        ok: function () {
          j.bravo("6 mm et 4,5 mm.");
          j.expliquer("<p>En téléopération maître-esclave (comme le da Vinci), le chirurgien commande les instruments depuis une console. La mise à l'échelle réduit aussi les tremblements : 1 mm de tremblement de la main ne fait plus que 0,3 mm à l'instrument, avant même tout filtrage.</p>");
          j.suite();
        } });
    } },
    { nom: "Deux mondes", jouer: function (j, n) {
      n.mode = "comparer"; n.dessin();
      j.fig.astuce("");
      j.titre("Range chaque caractéristique : robotique industrielle ou médicale ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><b>Industrielle</b><b>Médicale</b>' + [0, 1, 2].map(function () { return '<span class="trou" data-attendu="i"></span><span class="trou" data-attendu="m"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", html: "Patient variable" }, { id: "i", html: "Zone d'exclusion" }, { id: "m", html: "Contact direct" }, { id: "i", html: "Pièce standardisée" }, { id: "i", html: "Cadence" }, { id: "m", html: "Assistance, sécurité" }],
        aide: "Industrie : environnement structuré, humain séparé, performance. Médical : vivant, contact avec le patient, assistance et sécurité.",
        ok: function () {
          j.bravo("Deux objectifs : la cadence d'un côté, l'assistance et la sécurité de l'autre.");
          j.expliquer("<p>Robotique médicale = robot + professionnel de santé + patient + environnement clinique. Le contact direct impose une <b>sécurité intrinsèque</b> : limitation des forces et des couples, détection de collision, arrêt instantané, redondance des capteurs. L'humain ne programme plus en amont : il supervise et pilote pendant l'acte.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Normes", jouer: function (j, n) {
      j.titre("Un robot chirurgical est un dispositif médical. Quelle norme de qualité s'applique à la place de l'ISO 10218 des robots industriels ?");
      j.choix([{ html: "ISO 10218", aide: "C'est justement la norme de sécurité des robots industriels." }, { html: "ISO 13485", juste: true }, { html: "Aucune, il suffit d'un arrêt d'urgence", aide: "Une erreur est souvent irréversible : certification, essais cliniques et traçabilité sont obligatoires." }], { colonnes: 1, ok: function () {
        j.bravo("ISO 13485, avec l'IEC 60601 et l'ISO 14971.");
        j.expliquer("<p>De la fiabilité économique à la <b>fiabilité vitale</b> : dispositif souvent de classe III, normes ISO 13485, IEC 60601 et ISO 14971, traçabilité, essais cliniques, certification. L'environnement est aussi contraint : stérilisation ou usage unique, biocompatibilité, compatibilité IRM.</p>");
        j.suite();
      } });
    } }
  ]
});
