/* Niveau : le moulage par injection. Cycle, remplissage du moule, seuil et point d'injection, produits, matière. */
NIVEAU({
  id: "injection",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), gz = E.s("g", null, fig.svg);
    var n = { phase: 0, remplissage: 0, noms: true, libre: false, surZone: null, choisie: null };
    var X0 = 340; // axe vertical du moule
    function mat(a) { return PLATEFORME.teinte(a); }
    // morceaux du chemin de la matière, remplis dans l'ordre : carotte, canaux, seuils, empreintes
    n.dessin = function () {
      E.vider(g); E.vider(gz);
      var ph = n.phase, r = n.remplissage;
      // unité d'injection : cylindre horizontal, trémie, vis-piston, moteur
      var avance = ph >= 2 ? 60 * Math.min(1, r) : 0, dose = ph >= 1 ? 1 : 0;
      E.s("path", { d: "M520 92 L600 92 L578 160 L542 160 Z", fill: "#f3f5fa", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      for (var i = 0; i < 8; i++) D.rond(g, [534 + (i % 4) * 14 + (i > 3 ? 7 : 0), 108 + (i > 3 ? 16 : 0)], 6, { fill: mat(0.55), stroke: C.encre, ep: 1 });
      E.s("rect", { x: 352, y: 160, width: 270, height: 64, rx: 6, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
      [410, 470, 530].forEach(function (x) { E.s("rect", { x: x - 18, y: 150, width: 36, height: 84, rx: 5, fill: "rgba(229,72,77,0.22)", stroke: "#e5484d", "stroke-width": 2 }, g); });
      // matière dosée devant la vis
      if (dose && r < 1) E.s("rect", { x: 356, y: 166, width: Math.max(0, 70 - avance), height: 52, fill: mat(0.7) }, g);
      // vis-piston
      var xv = 430 - avance;
      E.s("rect", { x: xv, y: 182, width: 190 + avance, height: 20, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      for (var x = xv + 12; x < 610; x += 24) D.ligne(g, [x, 218], [x + 14, 166], C.encre, 3.5);
      E.s("rect", { x: 622, y: 158, width: 46, height: 68, rx: 8, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
      if (ph >= 2 && r < 1) D.fleche(g, [500, 132], [420, 132], "#3b5bdb", 4);
      // buse coudée vers le moule
      E.s("path", { d: "M352 176 L" + (X0 - 4) + " 176 L" + (X0 - 4) + " 262 L" + (X0 + 4) + " 262 L" + (X0 + 4) + " 208 L352 208 Z", fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
      // moule : demi-moule fixe (haut) et mobile (bas)
      var ouvert = ph >= 4 ? 60 : 0;
      E.s("rect", { x: 90, y: 262, width: 500, height: 104, rx: 6, fill: "#dfe3ec", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("rect", { x: 90, y: 366 + ouvert, width: 500, height: 92, rx: 6, fill: "#cfd5e1", stroke: C.encre, "stroke-width": 3 }, g);
      // chemin de la matière (vide en blanc, rempli en couleur du module)
      var pr = function (a, b) { return Math.max(0, Math.min(1, (r - a) / (b - a))); };
      var fCar = pr(0, 0.2), fCan = pr(0.2, 0.45), fEmp = pr(0.5, 1);
      var plein = function (f) { return f > 0 ? mat(ph >= 3 ? 0.95 : 0.75) : "#fff"; };
      // carotte
      E.s("rect", { x: X0 - 9, y: 262, width: 18, height: 104, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      if (fCar > 0) E.s("rect", { x: X0 - 8, y: 263, width: 16, height: 102 * fCar, fill: plein(1) }, g);
      // canaux
      [-1, 1].forEach(function (s) {
        E.s("rect", { x: s < 0 ? 210 : X0, y: 357, width: 130, height: 18, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        if (fCan > 0) E.s("rect", { x: s < 0 ? X0 - 130 * fCan : X0, y: 358, width: 130 * fCan, height: 16, fill: plein(1) }, g);
      });
      // empreintes (pièce en forme de godet) et seuils
      [150, 530].forEach(function (cx) {
        var d = "M" + (cx - 50) + " 346 L" + (cx + 50) + " 346 L" + (cx + 44) + " 396 L" + (cx - 44) + " 396 Z";
        E.s("path", { d: d, fill: fEmp > 0 ? plein(1) : "#fff", stroke: C.encre, "stroke-width": 2.5, opacity: 1, transform: ph >= 4 ? "translate(0,30)" : null }, g);
        if (ph < 4 && fEmp > 0 && fEmp < 1) E.s("rect", { x: cx - 50, y: 346, width: 100, height: 50 * (1 - fEmp), fill: "#fff" }, g);
        var sx = cx < X0 ? 205 : 475;
        E.s("rect", { x: sx - 5, y: 360, width: 10, height: 12, fill: fCan >= 1 ? plein(1) : "#fff", stroke: C.encre, "stroke-width": 1.5 }, g);
        // éjecteurs
        var dy = ph >= 4 ? -34 : 0;
        E.s("rect", { x: cx - 30, y: 400 + ouvert + dy, width: 12, height: 118 - ouvert - dy, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: cx + 18, y: 400 + ouvert + dy, width: 12, height: 118 - ouvert - dy, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      });
      if (ph === 3) D.texte(g, "refroidissement", [X0, 430], { taille: 17, coul: "#3b5bdb" });
      if (n.noms) {
        D.texte(g, "trémie", [560, 76], { taille: 15, coul: C.doux });
        D.texte(g, "cylindre chauffé", [420, 252], { taille: 15, coul: C.doux });
        D.texte(g, "vis-piston", [575, 252], { taille: 15, coul: C.doux });
        D.texte(g, "buse", [310, 196], { taille: 15, coul: C.doux, ancre: "end" });
        D.texte(g, "carotte", [X0 + 16, 300], { taille: 15, coul: C.doux, ancre: "start" });
        D.texte(g, "canaux", [270, 392], { taille: 15, coul: C.doux });
        if (ph < 4) { D.texte(g, "seuil", [205, 336], { taille: 15, coul: C.doux }); D.texte(g, "empreinte", [150, 320], { taille: 15, coul: C.doux }); }
        else D.texte(g, "pièces éjectées", [212, 408], { taille: 15, coul: C.jeu, ancre: "start" });
        D.texte(g, "éjecteurs", [530, 532], { taille: 15, coul: C.doux });
      }
      if (n.zones) {
        // zones à toucher, invisibles mais larges
        [["buse", [X0 - 30, 200, 60, 60]], ["carotte", [X0 - 26, 266, 52, 80]], ["canal", [240, 350, 70, 34]], ["seuil", [186, 340, 38, 44]], ["empreinte", [96, 330, 86, 70]], ["ejecteur", [110, 410, 90, 100]]].forEach(function (z) {
          var rr = E.s("rect", { x: z[1][0], y: z[1][1], width: z[1][2], height: z[1][3], fill: n.choisie === z[0] ? "rgba(229,72,77,0.18)" : "transparent", style: "cursor:pointer" }, gz);
          rr.addEventListener("click", function () { if (n.libre && n.surZone) n.surZone(z[0]); });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le cycle", jouer: function (j, n) {
      j.fig.astuce("Une presse à injecter fabrique des corps de seringue.");
      j.titre("Remets dans l'ordre les phases d'un cycle d'injection.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        ["c", "d", "i", "r", "e"].map(function (id, k) { return "<b>" + (k + 1) + '</b><span class="trou" data-attendu="' + id + '" style="justify-content:flex-start"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "i", html: "Injecter : la vis pousse" }, { id: "e", html: "Ouvrir et éjecter" }, { id: "c", html: "Chauffer et ramollir" }, { id: "r", html: "Refroidir dans le moule" }, { id: "d", html: "Doser : la vis tourne" }],
        aide: "Il faut d'abord une matière molle, puis une dose prête, puis la poussée ; la pièce ne sort qu'une fois solide.",
        ok: function () {
          n.phase = 4; n.remplissage = 1; n.dessin();
          j.bravo("Chauffer, doser, injecter, refroidir, éjecter.");
          j.expliquer("<p><b>Moulage par injection</b> : la matière plastique est chauffée et ramollie dans un cylindre ; une vis sans fin y tourne pour préparer la quantité de matière requise, puis se transforme en piston pour l'injecter dans un moule fermé, où elle refroidit.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Remplir le moule", jouer: function (j, n) {
      n.phase = 2; n.remplissage = 0; n.dessin(); n.libre = true;
      j.fig.astuce("La matière passe par la carotte, les canaux, puis entre dans les empreintes.");
      j.titre("Pousse la vis-piston jusqu'à remplir complètement les deux empreintes.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false;
        n.remplissage = 1; n.phase = 3; n.dessin(); c.regler(100);
        j.bravo("Empreintes pleines : la pièce peut refroidir.", [340, 370]);
        j.expliquer("<p>La matière traverse la <b>carotte</b>, se partage dans les <b>canaux</b> puis entre dans chaque <b>empreinte</b>. Une course trop courte donne une pièce incomplète. Le moule reste fermé pendant le refroidissement.</p>");
        j.suite();
      }
      var c = j.curseur({ nom: "course", min: 0, max: 100, pas: 5, val: 0, unite: " %", change: function (v) {
        if (!n.libre) return;
        n.remplissage = v / 100; n.dessin();
        if (v >= 100) gagne();
      } });
      j.reponse(gagne);
    } },
    { nom: "Le petit point", jouer: function (j, n) {
      n.phase = 3; n.remplissage = 1; n.noms = false; n.zones = true; n.libre = true; n.dessin();
      j.fig.astuce("Les noms sont cachés. Suis le chemin de la matière jusqu'à la pièce de gauche.");
      j.titre("Sur un corps de seringue on voit un petit point. Touche l'endroit du moule par où la matière entre dans l'empreinte.");
      var aides = { buse: "La buse est au bout du cylindre : la matière n'y est pas encore dans le moule.", carotte: "La carotte descend de la buse ; la pièce est plus loin.", canal: "Le canal distribue la matière ; regarde le petit passage juste avant l'empreinte.", empreinte: "C'est la pièce elle-même. Cherche le petit passage par lequel elle se remplit.", ejecteur: "Les éjecteurs poussent la pièce hors du moule à l'ouverture ; la matière n'y passe pas." };
      function gagne() {
        n.libre = false; n.surZone = null; n.zones = false; n.noms = true; n.choisie = null; n.dessin();
        j.bravo("Le seuil : la trace qu'il laisse est le point d'injection.", [205, 366]);
        j.expliquer("<p>Le chemin : buse, carotte, canaux, <b>seuils</b>, empreintes ; les éjecteurs sortent la pièce. Indice d'une pièce injectée : elle est souvent prête à être utilisée et l'on voit un petit point par où la matière est arrivée.</p>");
        j.suite();
      }
      n.surZone = function (id) {
        if (id === "seuil") { gagne(); return; }
        n.choisie = id; n.dessin(); j.erreur(aides[id]);
      };
      j.reponse(function () { if (n.surZone) gagne(); });
    } },
    { nom: "Quel objet ?", jouer: function (j, n) {
      n.phase = 4; n.dessin();
      j.fig.astuce("");
      j.titre("Trois objets du service. Lequel a été moulé par injection ?");
      j.choix([
        { html: "Une tubulure de perfusion de 2 m, de section identique sur toute sa longueur", aide: "Même section en continu : c'est l'indice d'un profilé extrudé." },
        { html: "Un corps de seringue, prêt à l'emploi, avec un petit point au bout", juste: true },
        { html: "Un flacon avec une ligne de soudure au fond", aide: "Une ligne de soudure au fond vient d'un tube pincé par un moule de soufflage." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le corps de seringue.");
        j.expliquer("<p>Exemples d'utilisation du cours : bouchons, couvercles, téléphones, boîtes, corps de stylo, pièces automobiles, électriques et <b>médicales</b>. Exemple ajouté : les corps de seringue sont moulés ainsi.</p>");
        j.suite();
      } });
    } },
    { nom: "Quelle matière ?", jouer: function (j, n) {
      j.titre("L'injection met en œuvre des matières thermo-formables, notamment les thermoplastiques. Pourquoi conviennent-ils ?");
      j.choix([
        { html: "Ils se ramollissent à la chaleur et se mettent en forme dans un moule à l'état ramolli", juste: true },
        { html: "Ils durcissent définitivement dès qu'on les chauffe", aide: "Ça, c'est un thermodurcissable : une fois durci, on ne peut plus le chauffer pour le former à nouveau." },
        { html: "Ils sont liquides à température ambiante", aide: "On les chauffe justement dans le cylindre : à température ambiante ils sont solides (granulés)." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Ramollis par chauffage, mis en forme dans le moule.");
        j.expliquer("<p>Un <b>thermoplastique</b> peut être ramolli par chauffage et mis en forme dans un moule lorsqu'il est à l'état ramolli ; en refroidissant il garde la forme. Il arrive en granulés, en feuilles ou en poudre.</p>");
        j.suite();
      } });
    } }
  ]
});
