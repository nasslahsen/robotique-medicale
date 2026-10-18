/* Niveau : le robot et le système robotisé. Boucle percevoir-traiter-décider-agir, composants, chaînes, classement. */
NIVEAU({
  id: "robot-systeme",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { surligne: null, boucle: [null, null, null, null], mode: "boucle", t: 0 };
    var ZONES = {
      camera: [470, 120], bras: [300, 300], pince: [395, 260], convoyeur: [470, 440], barriere: [110, 300], controleur: [170, 470], moteur: [255, 405]
    };
    n.zones = ZONES;
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "boucle") {
        var c = [340, 300], r = 170, noms = n.boucle;
        E.s("circle", { cx: c[0], cy: c[1], r: r, fill: "none", stroke: "#e3e6ee", "stroke-width": 16 }, g);
        for (var k = 0; k < 4; k++) {
          var a = (90 - k * 90) * D.DEG, a2 = (90 - (k + 1) * 90 + 22) * D.DEG, p = [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)];
          var q1 = [c[0] + r * Math.cos(a - 22 * D.DEG), c[1] - r * Math.sin(a - 22 * D.DEG)], q2 = [c[0] + r * Math.cos(a2), c[1] - r * Math.sin(a2)];
          E.s("path", { d: "M" + q1 + " A" + r + " " + r + " 0 0 1 " + q2, fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
          D.fleche(g, [q2[0] + (q1[0] - q2[0]) * 0.02, q2[1] + (q1[1] - q2[1]) * 0.02], q2, C.acc, 4);
          E.s("rect", { x: p[0] - 78, y: p[1] - 30, width: 156, height: 60, rx: 16, fill: noms[k] ? "#e3f7ee" : "#fff", stroke: noms[k] ? C.ok : "#c6cbd8", "stroke-width": 2.5, "stroke-dasharray": noms[k] ? null : "6 5" }, g);
          D.texte(g, noms[k] || String(k + 1), p, { coul: noms[k] ? C.encre : C.gris, taille: 20 });
        }
        D.texte(g, "environnement", c, { coul: C.doux, taille: 18, gras: false });
      } else {
        // la cellule robotisée, vue de face, schématique
        var S = n.surligne;
        function zone(id, el) { if (S === id) el.setAttribute("filter", "url(#lueur)"); return el; }
        var defs = E.s("defs", null, g), f = E.s("filter", { id: "lueur", x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs);
        E.s("feDropShadow", { dx: 0, dy: 0, stdDeviation: 6, "flood-color": PLATEFORME.couleur(), "flood-opacity": 0.9 }, f);
        E.s("rect", { x: 30, y: 510, width: 620, height: 12, fill: "#d9dde6" }, g);
        zone("convoyeur", E.s("rect", { x: 380, y: 430, width: 250, height: 40, rx: 20, fill: "#c9cfdc", stroke: C.encre, "stroke-width": 2 }, g));
        E.s("rect", { x: 450, y: 405, width: 46, height: 26, fill: "#ffb38f", stroke: C.encre, "stroke-width": 2 }, g);
        zone("controleur", E.s("rect", { x: 120, y: 420, width: 100, height: 90, rx: 8, fill: "#e8edff", stroke: C.encre, "stroke-width": 2 }, g));
        D.texte(g, "contrôleur", [170, 465], { taille: 15 });
        zone("barriere", E.s("rect", { x: 92, y: 140, width: 18, height: 370, fill: "#ffe0d3", stroke: C.jeu, "stroke-width": 2 }, g));
        for (var y = 160; y < 500; y += 40) D.ligne(g, [110, y], [140, y], C.jeu, 2, "4 4");
        zone("camera", E.s("rect", { x: 445, y: 100, width: 52, height: 36, rx: 6, fill: "#2b3a5c" }, g));
        D.ligne(g, [471, 136], [471, 400], "#8fb3ff", 2, "6 6");
        // bras
        E.s("rect", { x: 255, y: 470, width: 90, height: 40, rx: 6, fill: "#9aa0ad" }, g);
        zone("moteur", E.s("circle", { cx: 300, cy: 410, r: 22, fill: "#5b6172", stroke: C.encre, "stroke-width": 2 }, g));
        var t = n.t;
        var e1 = [300 + 120 * Math.cos((70 - 10 * Math.sin(t)) * D.DEG), 410 - 120 * Math.sin((70 - 10 * Math.sin(t)) * D.DEG)];
        zone("bras", E.s("line", { x1: 300, y1: 410, x2: e1[0], y2: e1[1], stroke: "#ff8a5c", "stroke-width": 22, "stroke-linecap": "round" }, g));
        var e2 = [e1[0] + 95, e1[1] + 40];
        E.s("line", { x1: e1[0], y1: e1[1], x2: e2[0], y2: e2[1], stroke: "#ff8a5c", "stroke-width": 18, "stroke-linecap": "round" }, g);
        D.rond(g, e1, 12, { fill: "#fff", stroke: C.encre, ep: 3 });
        zone("pince", E.s("path", { d: "M" + (e2[0]) + " " + (e2[1]) + " l18 0 l0 26 M" + e2[0] + " " + e2[1] + " l-4 26", fill: "none", stroke: C.encre, "stroke-width": 6, "stroke-linecap": "round" }, g));
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La boucle", jouer: function (j, n) {
      j.fig.astuce("Un robot tourne en boucle avec son environnement.");
      j.titre("Un robot, c'est une boucle. Range les quatre actions dans l'ordre.");
      j.consigne("L'action modifie l'environnement, qui renvoie de nouvelles informations.");
      var noms = ["Percevoir", "Traiter", "Décider", "Agir"];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' + noms.map(function (s, k) { return '<b>' + (k + 1) + '</b><span class="trou" data-attendu="' + k + '" style="min-width:160px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "3", html: "Agir" }, { id: "0", html: "Percevoir" }, { id: "2", html: "Décider" }, { id: "1", html: "Traiter" }],
        aide: "On commence par acquérir des informations (capteurs), et on finit par l'action (actionneurs).",
        ok: function () {
          n.boucle = noms; n.dessin();
          j.bravo("Percevoir, traiter, décider, agir.");
          j.expliquer("<p>Définition retenue par le cours : un robot est un <b>système programmable</b> capable d'exécuter des <b>actions</b> dans son <b>environnement</b> afin d'accomplir une <b>tâche</b> donnée, de manière automatique, semi-autonome ou sous le contrôle d'un opérateur.</p><p>Percevoir avec des capteurs (entrées), traiter avec le système de commande, décider d'un plan d'action, agir avec des actionneurs (sorties).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Capteur ou actionneur", jouer: function (j, n) {
      n.mode = "cellule"; n.dessin();
      var anim = setInterval(function () { n.t += 0.08; n.dessin(); }, 60); j.nettoyer(function () { clearInterval(anim); });
      j.fig.astuce("Une cellule robotisée : bras, pince, convoyeur, caméra, barrière.");
      j.titre("Range ces composants : lesquels perçoivent, lesquels agissent ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><b>Capteurs</b><b>Actionneurs</b><span class="trou" data-attendu="c"></span><span class="trou" data-attendu="a"></span><span class="trou" data-attendu="c"></span><span class="trou" data-attendu="a"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "Servomoteur" }, { id: "c", html: "Codeur absolu" }, { id: "a", html: "Vérin" }, { id: "c", html: "Caméra de vision" }],
        aide: "Un capteur mesure (position, image) ; un actionneur produit un mouvement.",
        ok: function () {
          j.bravo("Bien trié.");
          j.expliquer("<p>Composants d'un robot industriel : le <b>manipulateur</b> (bras, articulations, réducteurs), les <b>actionneurs</b>, les <b>capteurs</b>, le <b>contrôleur</b>, l'<b>effecteur terminal</b> (pince, ventouse, torche) et le <b>teach pendant</b> pour programmer.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Les chaînes", jouer: function (j, n) {
      j.titre("Un système robotisé se lit en chaînes. Place chaque élément dans sa chaîne.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 12px;align-items:center"><span>Information</span><span class="trou" data-attendu="i" style="min-width:160px"></span><span>Énergie</span><span class="trou" data-attendu="e"></span><span>Action</span><span class="trou" data-attendu="a"></span><span>Sécurité</span><span class="trou" data-attendu="s"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "Pince" }, { id: "s", html: "Barrière immatérielle" }, { id: "i", html: "Contrôleur" }, { id: "e", html: "Variateur" }],
        aide: "Information : mesurer et commander. Énergie : alimenter et moduler. Action : transformer en mouvement. Sécurité : protéger.",
        ok: function () {
          n.surligne = "barriere"; n.dessin();
          j.bravo("Les quatre sous-systèmes d'une cellule.");
          j.expliquer("<p>Le robot n'est qu'un élément de la cellule. Le <b>système robotisé</b>, c'est l'ensemble : chaîne d'information (capteurs, contrôleur, API, IHM), chaîne d'énergie (alimentation, variateurs, moteurs), chaîne d'action (actionneurs, manipulateur, effecteur) et sécurité (arrêt d'urgence, barrière, scanner laser).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Classer", jouer: function (j, n) {
      n.surligne = null; n.dessin();
      j.titre("Un bras robotisé monté sur une base à roues aide dans une pharmacie d'hôpital. Quelle est sa mobilité ?");
      j.consigne("Le cours classe les robots selon cinq critères ; un même robot peut appartenir à plusieurs catégories.");
      j.choix([{ html: "Fixe", aide: "Sa base roule : il n'est pas fixe." }, { html: "Mobile", aide: "Il est mobile, mais il porte aussi un bras manipulateur." }, { html: "Hybride", juste: true }], { ok: function () {
        j.bravo("Base mobile + bras : un manipulateur mobile, hybride.");
        j.expliquer("<p>Les cinq critères du cours : <b>mobilité</b> (fixe, mobile, hybride), <b>architecture</b> (sériel, parallèle, hybride), <b>interaction avec l'humain</b> (conventionnel, cobot, service), <b>autonomie</b> (téléopéré, programmé, adaptatif, autonome) et <b>domaine</b> (industriel, service, médical, militaire, spatial).</p>");
        j.suite();
      } });
    } }
  ]
});
