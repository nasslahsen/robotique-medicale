/* Niveau : UART, la trame asynchrone (Section II, diapositives 4 et 5). Start bit, bits de données bit 0 d'abord, stop bit, durée d'une trame, half et full duplex. */
NIVEAU({
  id: "uart",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var X0 = 22, PAS = 53, NOMS = ["repos", "start", "bit 0", "bit 1", "bit 2", "bit 3", "bit 4", "bit 5", "bit 6", "bit 7", "stop", "repos"];
    var n = { mode: "trame", bits: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], libre: false, chiffres: true, surTouche: null, marque: {} };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "trame") {
        EMB.texte(g, "TX (pin)", [X0, 204], { taille: 17, ancre: "start", coul: C.doux });
        // cases de bits
        n.bits.forEach(function (b, k) {
          var x = X0 + k * PAS, fixe = k === 0 || k === 11, m = n.marque[k];
          EMB.el("rect", { x: x + 3, y: 96, width: PAS - 6, height: 70, rx: 8, fill: m ? (m === "ok" ? "#e3f7ee" : "#fdecec") : fixe ? C.fond : (n.libre ? EMB.teinte(0.12) : "#fff"), stroke: m ? (m === "ok" ? C.ok : C.ko) : fixe ? C.pale : C.encre, "stroke-width": 2 }, g);
          if (n.chiffres) EMB.texte(g, String(b), [x + PAS / 2, 131], { taille: 26, mono: true, halo: false, coul: fixe ? C.gris : C.encre });
        });
        // signal
        EMB.el("line", { x1: X0, y1: 240, x2: X0 + 12 * PAS, y2: 240, stroke: C.pale, "stroke-width": 1.5, "stroke-dasharray": "4 6" }, g);
        EMB.el("line", { x1: X0, y1: 320, x2: X0 + 12 * PAS, y2: 320, stroke: C.pale, "stroke-width": 1.5, "stroke-dasharray": "4 6" }, g);
        EMB.texte(g, "1", [X0 - 10, 240], { taille: 15, mono: true, coul: C.doux });
        EMB.texte(g, "0", [X0 - 10, 320], { taille: 15, mono: true, coul: C.doux });
        EMB.onde(g, X0, 240, PAS, 80, n.bits, { coul: C.acc, ep: 4, fronts: true });
        for (var k = 1; k < 12; k++) EMB.el("line", { x1: X0 + k * PAS, y1: 225, x2: X0 + k * PAS, y2: 335, stroke: C.pale, "stroke-width": 1 }, g);
        NOMS.forEach(function (t, k) {
          var x = X0 + k * PAS + PAS / 2;
          EMB.el("text", { x: x, y: 362, transform: "rotate(-55 " + x + " 362)", "text-anchor": "end", "font-size": 15, "font-family": "Inter, sans-serif", fill: k === 1 || k === 10 ? C.acc : C.doux, "font-weight": k === 1 || k === 10 ? 700 : 500 }, g).textContent = t;
        });
        // accolade du mot
        EMB.el("path", { d: "M" + (X0 + 2 * PAS) + " 440 v12 h" + 8 * PAS + " v-12", fill: "none", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "8 bits de données, bit 0 en premier", [X0 + 6 * PAS, 476], { taille: 17, gras: false });
        EMB.el("path", { d: "M" + (X0 + PAS) + " 510 v12 h" + 10 * PAS + " v-12", fill: "none", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "une trame : 10 bits", [X0 + 6 * PAS, 546], { taille: 17, gras: false });
      } else {
        // deux appareils reliés TX -> RX
        EMB.bloc(g, 40, 160, 200, 230, "Holter\nECG", { taille: 24, actif: n.duplex === "full" });
        EMB.bloc(g, 440, 160, 200, 230, "PC", { taille: 24, actif: n.duplex === "full" });
        EMB.texte(g, "TX", [215, 225], { taille: 17, mono: true }); EMB.texte(g, "RX", [215, 325], { taille: 17, mono: true });
        EMB.texte(g, "RX", [465, 225], { taille: 17, mono: true }); EMB.texte(g, "TX", [465, 325], { taille: 17, mono: true });
        EMB.fleche(g, [240, 225], [440, 225], { coul: C.acc, ep: 4 });
        EMB.fleche(g, [440, 325], [240, 325], { coul: C.acc, ep: 4 });
        EMB.texte(g, "données ECG", [340, 200], { taille: 16, gras: false });
        EMB.texte(g, "commandes", [340, 350], { taille: 16, gras: false });
        EMB.texte(g, "masse commune", [340, 450], { taille: 15, coul: C.doux, gras: false });
        EMB.el("line", { x1: 140, y1: 390, x2: 140, y2: 420, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("line", { x1: 540, y1: 390, x2: 540, y2: 420, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("line", { x1: 140, y1: 420, x2: 540, y2: 420, stroke: C.encre, "stroke-width": 2.5 }, g);
      }
    };
    EMB.toucher(fig.svg, function () {
      if (n.mode !== "trame" || !n.libre) return {};
      var z = {}; for (var k = 1; k <= 10; k++) z[k] = [X0 + k * PAS, 90, PAS, 260]; return z;
    }, function (k) { if (!n.libre) return; k = +k; n.bits[k] = 1 - n.bits[k]; n.marque = {}; n.dessin(); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le début", jouer: function (j, n) {
      j.fig.astuce("Une trame UART sur la broche TX.");
      j.titre("Au repos, la ligne TX est à 1. Sans horloge commune, comment le récepteur sait-il qu'une trame commence ?");
      j.choix([
        { html: "La ligne passe à 0 pendant un bit : le start bit", juste: true },
        { html: "L'émetteur envoie une horloge sur un autre fil", aide: "L'UART est asynchrone : aucune horloge ne voyage avec les données. Regarde ce que fait le signal juste après le repos." },
        { html: "Le premier bit de données est toujours à 1", aide: "Un bit de données peut valoir 0 ou 1. Regarde la case « start »." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le front descendant du start bit lance la lecture.");
        j.expliquer("<p>L'<b>UART</b> fait de la transmission asynchrone de données : émetteur et récepteur ont chacun leur horloge, réglée au même débit. Le <b>start bit</b> (à 0) synchronise le récepteur, les bits de données suivent, le <b>stop bit</b> (à 1) ramène la ligne au repos.</p>");
        j.suite();
      } });
    } },
    { nom: "Construire", jouer: function (j, n) {
      n.libre = true; n.bits = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; n.marque = {}; n.dessin();
      j.fig.astuce("Touche une case pour la basculer entre 0 et 1.");
      j.titre("Un oxymètre envoie le pouls 75 = 01001011 (bit 7 à gauche). Construis la trame sur la figure.");
      var CIBLE = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1], fini = false;
      var b = E.h("button", "btn bleu", "Vérifier", j.el); b.type = "button";
      function verifier() {
        if (fini) return;
        n.marque = {};
        for (var k = 1; k <= 10; k++) n.marque[k] = n.bits[k] === CIBLE[k] ? "ok" : "ko";
        n.dessin();
        if (n.bits[1] !== 0) { j.erreur("Le start bit doit être à 0 : c'est lui qui annonce la trame."); return; }
        if (n.bits[10] !== 1) { j.erreur("Le stop bit est à 1 : la ligne revient au niveau de repos."); return; }
        var envers = [0, 1, 0, 0, 1, 0, 1, 1].every(function (v, k) { return n.bits[2 + k] === v; });
        if (envers) { j.erreur("Tu as écrit 01001011 de gauche à droite. Sur la ligne, le bit 0 (celui de droite) part en premier."); return; }
        if (CIBLE.some(function (v, k) { return n.bits[k] !== v; })) { j.erreur("Les cases rouges sont fausses. Lis 01001011 de droite à gauche : bit 0 = 1, bit 1 = 1, bit 2 = 0…"); return; }
        fini = true; n.libre = false; b.remove(); n.dessin();
        j.bravo("Start 0, puis 1 1 0 1 0 0 1 0, puis stop 1.", [340, 280]);
        j.expliquer("<p>Le chronogramme du cours envoie le start bit, puis bit 0, bit 1, …, bit 7 (ou bit 8 en mode 9 bits), puis le stop bit : le bit de poids faible part en premier.</p>");
        j.suite();
      }
      b.addEventListener("click", verifier);
      j.reponse(function () { n.bits = CIBLE.slice(); n.dessin(); verifier(); });
    } },
    { nom: "Lire", jouer: function (j, n) {
      n.libre = false; n.chiffres = false; n.marque = {}; n.bits = [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1]; n.dessin();
      j.fig.astuce("Seul le signal est affiché : lis les niveaux.");
      j.titre("Un thermomètre envoie cette trame. Quelle valeur, en décimal ?");
      j.nombre({ avant: "\\text{valeur} =", cases: [{ attendu: 37, tol: 0 }], ligne: true,
        aide: function () { return "Lis les 8 bits après le start bit : le premier lu est le bit 0, qui vaut 1. Puis \\(\\text{valeur} = \\sum b_i \\, 2^i\\)."; },
        ok: function () {
          n.chiffres = true; n.dessin();
          j.bravo("bit 0 = 1, bit 2 = 1, bit 5 = 1 : 1 + 4 + 32 = 37 °C.");
          j.suite();
        } });
    } },
    { nom: "Durée", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("À 9600 bits par seconde, combien de temps dure une trame de 10 bits (en ms) ? Combien d'octets au plus par seconde ?");
      j.nombre({ avant: "t \\ (\\text{ms}),\\ N :", cases: [{ attendu: 1.042, tol: 0.005 }, { attendu: 960, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "Un bit dure \\(1/9600\\) s ; il y a 10 bits." : "Chaque octet coûte une trame de 10 bits : \\(9600 / 10\\)."; },
        ok: function () {
          j.bravo("1,04 ms par trame, 960 octets par seconde.");
          j.expliquer("<p>Exemple ajouté.</p>\\[ t_{trame} = \\frac{1 + 8 + 1}{\\text{débit}} = \\frac{10}{9600} \\approx 1{,}04 \\text{ ms} \\]<p>Le start et le stop bit coûtent 2 bits sur 10 : seuls 80 % du débit portent des données.</p>");
          j.suite();
        } });
    } },
    { nom: "Duplex", jouer: function (j, n) {
      n.mode = "duplex"; n.duplex = null; n.dessin();
      j.fig.astuce("Un fil dans chaque sens, plus la masse.");
      j.titre("Le holter envoie l'ECG au PC pendant que le PC lui envoie des commandes, en même temps. Quel mode ?");
      j.choix([
        { html: "Half duplex", aide: "En half duplex, on parle chacun son tour : un seul sens à la fois. Ici, les deux flèches sont actives ensemble." },
        { html: "Full duplex", juste: true }
      ], { colonnes: 2, ok: function () {
        n.duplex = "full"; n.dessin();
        j.bravo("Full duplex : les deux sens en même temps.");
        j.expliquer("<p>Le cours donne pour l'UART : mode <b>half duplex</b> (un sens à la fois) ou <b>full duplex</b> (les deux sens en même temps) ; couche physique <b>RS232</b> ou <b>RS485</b>.</p>");
        j.suite();
      } });
    } }
  ]
});
