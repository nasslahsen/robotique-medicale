/* Niveau : organisation d'un système embarqué en couches (Section I, diapositive 11). */
NIVEAU({
  id: "organisation",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    // couches, de haut en bas, comme sur la diapositive
    var COUCHES = [
      { id: "app", nom: "Embedded Application Code" },
      { id: "drv", nom: "Device Drivers (API)" },
      { id: "rtos", nom: "A Real-Time Operating System (RTOS)\nEmbedded OS" },
      { id: "hal", nom: "Hardware abstraction layer(s)" },
      { id: "boot", nom: "System initialization routines\n(Boot)" }
    ];
    var X = 170, W = 410, Y0 = 70, H = 84;
    var n = { visibles: { app: true, drv: true, rtos: true, hal: true, boot: true }, allume: {}, surTouche: null, requete: -1, inconnu: {}, plateformes: false };
    n.COUCHES = COUCHES;
    n.zone = function (k) { return [X, Y0 + k * H, W, H]; };
    n.dessin = function () {
      EMB.vider(g);
      COUCHES.forEach(function (c, k) {
        var r = n.zone(k), on = n.allume[c.id], cache = n.inconnu[c.id];
        EMB.el("rect", { x: r[0], y: r[1], width: r[2], height: r[3], fill: on ? C.clair : "#eef6ea", stroke: on ? C.acc : C.encre, "stroke-width": on ? 3.5 : 2 }, g);
        if (cache) EMB.texte(g, "?", [X + W / 2, r[1] + H / 2], { taille: 34, coul: C.gris, halo: false });
        else EMB.texte(g, c.nom, [X + W / 2, r[1] + H / 2], { taille: 18, coul: c.id === "hal" ? C.ok : c.id === "boot" ? C.ko : C.encre, halo: false });
      });
      // matériel, entrées, sorties
      var yh = Y0 + 5 * H + 6;
      EMB.el("rect", { x: X - 40, y: yh, width: W + 80, height: 56, rx: 4, fill: n.allume.hw ? C.acc : "#4f7fc8", stroke: "none" }, g);
      EMB.texte(g, "Hardware", [X + W / 2, yh + 28], { taille: 22, coul: "#fff", halo: false });
      EMB.fleche(g, [40, yh + 28], [X - 44, yh + 28], { ep: 8, coul: "#4f7fc8", tete: 22 });
      EMB.texte(g, "Inputs", [64, yh - 18], { taille: 18, coul: C.ko });
      EMB.fleche(g, [X + W + 40, yh + 28], [668, yh + 28], { ep: 8, coul: "#4f7fc8", tete: 22 });
      EMB.texte(g, "Outputs", [628, yh - 18], { taille: 18, coul: C.ko });
      if (n.plateformes) {
        EMB.bloc(g, 8, Y0 + 50, 150, 60, "Software\nPlatform", { taille: 16, fill: "#4f7fc8", stroke: "#4f7fc8", coul: "#fff" });
        EMB.bloc(g, 8, Y0 + 3 * H + 12, 150, 60, "Hardware\nPlatform", { taille: 16, fill: "#4f7fc8", stroke: "#4f7fc8", coul: "#fff" });
      }
      // une requête qui descend
      if (n.requete >= 0) {
        var y = Y0 + n.requete * H + H / 2;
        EMB.el("circle", { cx: X + W - 26, cy: Math.min(y, yh + 28), r: 13, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var z = {}; COUCHES.forEach(function (c, k) { z[c.id] = n.zone(k); }); z.hw = [X - 40, Y0 + 5 * H + 6, W + 80, 56]; return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Empiler", jouer: function (j, n) {
      n.inconnu = { app: true, drv: true, rtos: true, hal: true, boot: true }; n.dessin();
      j.fig.astuce("Le matériel est en bas. Que met-on au-dessus ?");
      j.titre("Reconstruis la pile du cours, de la couche du haut à celle qui touche le matériel.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center;font-size:17px"><b>1</b><span class="trou" data-attendu="app"></span><b>2</b><span class="trou" data-attendu="drv"></span><b>3</b><span class="trou" data-attendu="rtos"></span><b>4</b><span class="trou" data-attendu="hal"></span><b>5</b><span class="trou" data-attendu="boot"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "hal", html: "Hardware abstraction layer" }, { id: "app", html: "Application Code" }, { id: "boot", html: "Boot" }, { id: "rtos", html: "RTOS" }, { id: "drv", html: "Device Drivers (API)" }],
        aide: "En haut, ce que fait l'appareil (l'application). Juste au-dessus du matériel, ce qui démarre la carte (Boot). Entre les deux : pilotes, système d'exploitation temps réel, couche d'abstraction.",
        ok: function () {
          n.inconnu = {}; n.dessin();
          j.bravo("Application, pilotes, RTOS, HAL, Boot, puis le matériel.");
          j.expliquer("<p>Le logiciel d'un système embarqué s'empile en couches au-dessus du <b>matériel</b>, qui reçoit les entrées et produit les sorties. Chaque couche ne parle qu'à ses voisines : l'application n'a pas besoin de connaître les registres de la puce.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Au démarrage", jouer: function (j, n) {
      j.fig.astuce("Touche une couche.");
      j.titre("On allume la semelle. Quelle couche s'exécute en premier, avant même le système d'exploitation ?");
      var fini = false, AIDE = { app: "L'application a besoin de tout le reste : elle démarre en dernier.", drv: "Les pilotes sont chargés après le démarrage de la carte.", rtos: "Le RTOS a besoin que la carte soit déjà initialisée.", hal: "La HAL suppose que les horloges et la mémoire sont déjà prêtes.", hw: "Le matériel ne s'exécute pas : c'est lui qui exécute le code." };
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "boot") { j.erreur(AIDE[k]); return; }
        fini = true; n.surTouche = null; n.allume = { boot: true }; n.dessin();
        j.bravo("Les routines d'initialisation (Boot).", [375, 448]);
        j.expliquer("<p>Les <b>System initialization routines (Boot)</b> préparent la puce juste après la mise sous tension : horloges, mémoire, puis lancement du reste du logiciel.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("boot"); });
    } },
    { nom: "Changer de puce", jouer: function (j, n) {
      n.allume = {}; n.dessin();
      j.fig.astuce("");
      j.titre("Le fabricant change le microcontrôleur de la semelle. On veut garder l'application telle quelle. Quelle couche est faite pour absorber ce changement ?");
      j.choix([
        { html: "Embedded Application Code", aide: "C'est justement elle qu'on veut garder intacte." },
        { html: "Hardware abstraction layer(s)", juste: true },
        { html: "Il faut tout réécrire", aide: "Les couches servent précisément à éviter cela. Cherche celle dont le nom contient « abstraction »." }
      ], { colonnes: 1, ok: function () {
        n.allume = { hal: true }; n.dessin();
        j.bravo("La couche d'abstraction du matériel.");
        j.expliquer("<p>La <b>HAL</b> (<i>Hardware abstraction layer</i>) cache les détails d'une puce derrière des fonctions communes. On la réécrit pour la nouvelle puce ; les couches du dessus ne voient pas la différence.</p>");
        j.suite();
      } });
    } },
    { nom: "Une requête descend", jouer: function (j, n) {
      n.allume = {}; n.requete = 0; n.dessin();
      j.fig.astuce("Touche les couches dans l'ordre où la demande les traverse.");
      j.titre("L'application veut lire un capteur de force. Fais descendre sa demande jusqu'au matériel, couche par couche.");
      // la demande ne passe pas par Boot : Boot ne sert qu'au démarrage
      var ordre = ["drv", "rtos", "hal", "hw"], k = 0, fini = false;
      var pos = { drv: 1, rtos: 2, hal: 3, hw: 5 };
      n.surTouche = function (id) {
        if (fini) return;
        if (id !== ordre[k]) {
          j.erreur(id === "boot" ? "Boot ne sert qu'au démarrage : une lecture de capteur ne passe pas par lui." : id === "app" ? "La demande part déjà de l'application : touche la couche juste en dessous." : "Pas encore : la demande passe d'abord par la couche juste en dessous de la dernière touchée.");
          return;
        }
        n.allume[id] = true; n.requete = pos[id]; n.dessin(); k++;
        if (k < ordre.length) { j.info("Oui. Ensuite ?"); return; }
        fini = true; n.surTouche = null;
        j.bravo("Application, pilotes, RTOS, HAL, matériel.", [375, 524]);
        j.expliquer("<p>L'application appelle l'<b>API</b> des pilotes (<i>Device Drivers</i>) ; le <b>RTOS</b> (<i>Real-Time Operating System</i>, système d'exploitation temps réel) ordonne les tâches pour respecter les délais ; la HAL agit sur les registres du matériel. Boot n'intervient qu'à la mise sous tension.</p>");
        j.suite();
      };
      j.reponse(function () { for (var s = 0; s < 6 && n.surTouche; s++) n.surTouche(ordre[k]); });
    } },
    { nom: "Deux plateformes", jouer: function (j, n) {
      n.requete = -1; n.allume = {}; n.dessin();
      j.fig.astuce("");
      j.titre("La diapositive place deux étiquettes à gauche de la pile. Laquelle est à hauteur de la couche d'abstraction et du Boot, juste au-dessus du matériel ?");
      j.choix([
        { html: "Software Platform", aide: "Elle est plus haut, à hauteur des pilotes et du RTOS." },
        { html: "Hardware Platform", juste: true }
      ], { colonnes: 2, ok: function () {
        n.plateformes = true; n.dessin();
        j.bravo("Hardware Platform, près du matériel ; Software Platform, plus haut.");
        j.expliquer("<p>Le cours distingue une <b>plateforme matérielle</b> (le matériel et le logiciel qui le prépare et l'abstrait) et une <b>plateforme logicielle</b> (le système d'exploitation et les pilotes sur lesquels l'application s'appuie).</p>");
        j.suite();
      } });
    } }
  ]
});
