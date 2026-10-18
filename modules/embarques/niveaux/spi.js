/* Niveau : SPI, l'échange par registres à décalage (Section II, diapositives 8 à 13). Animation du cours : maître 10101010, esclave 11000011, états à T = 1, 2 et 8. */
NIVEAU({
  id: "spi",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var MX = 70, SX = 400, W = 30, MY = 330, SY = 110;
    var n = { T: 0, noms: false };
    function depart() {
      n.T = 0;
      n.m = "10101010".split("").map(function (b) { return { v: +b, o: "m" }; });
      n.s = "11000011".split("").map(function (b) { return { v: +b, o: "s" }; });
    }
    depart();
    n.depart = function () { depart(); n.dessin(); };
    // un coup d'horloge : le maître décale vers la gauche, l'esclave (dessiné MSB à droite) vers la droite
    n.coup = function () {
      var sortM = n.m[0], sortS = n.s[7];
      n.m = n.m.slice(1).concat([sortS]);
      n.s = [sortM].concat(n.s.slice(0, 7));
      n.T++; n.dessin();
    };
    n.texteM = function () { return n.m.map(function (b) { return b.v; }).join(""); };
    n.texteS = function () { return n.s.map(function (b) { return b.v; }).join(""); };
    function registre(x, y, bits) {
      bits.forEach(function (b, k) {
        EMB.el("rect", { x: x + k * W, y: y, width: W, height: 46, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, String(b.v), [x + k * W + W / 2, y + 24], { taille: 24, mono: true, halo: false, coul: b.o === "m" ? C.ko : C.acc });
      });
      EMB.el("rect", { x: x, y: y, width: 8 * W, height: 46, fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
    }
    n.dessin = function () {
      EMB.vider(g);
      // connecteurs
      [345, 375].forEach(function (x) { EMB.el("line", { x1: x, y1: 90, x2: x, y2: 500, stroke: C.encre, "stroke-width": 4 }, g); });
      EMB.texte(g, "Maître SPI", [190, 290], { taille: 22 });
      EMB.texte(g, "Esclave SPI", [520, 82], { taille: 22 });
      // sortie du maître (MSB, à gauche) vers l'entrée de l'esclave (à gauche)
      EMB.el("polyline", { points: [[MX, MY + 23], [40, MY + 23], [40, SY + 23], [SX - 12, SY + 23]].join(" "), fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [SX - 30, SY + 23], [SX, SY + 23], { ep: 2.5 });
      // sortie de l'esclave (à droite) vers l'entrée du maître (à droite)
      EMB.el("polyline", { points: [[SX + 8 * W, SY + 23], [660, SY + 23], [660, MY + 23], [MX + 8 * W + 12, MY + 23]].join(" "), fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [MX + 8 * W + 40, MY + 23], [MX + 8 * W, MY + 23], { ep: 2.5 });
      // horloge
      EMB.el("line", { x1: 40, y1: 450, x2: 540, y2: 450, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [190, 450], [190, MY + 46], { ep: 2.5 });
      EMB.el("line", { x1: 540, y1: 450, x2: 540, y2: SY + 60, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [540, SY + 80], [540, SY + 46], { ep: 2.5 });
      EMB.el("circle", { cx: 190, cy: 450, r: 7, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
      [[SY + 23, "Sortie", "Entrée", n.noms ? "MOSI" : ""], [MY + 23, "Entrée", "Sortie", n.noms ? "MISO" : ""], [450, "Horloge SPI", "", n.noms ? "SCK" : ""]].forEach(function (l) {
        [345, 375].forEach(function (x) { EMB.el("rect", { x: x - 7, y: l[0] - 7, width: 14, height: 14, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g); });
        if (l[3]) EMB.texte(g, l[3], [360, l[0] - 24], { taille: 17, coul: C.acc });
      });
      EMB.texte(g, "Registre à décalage", [MX + 4 * W, MY - 22], { taille: 15, coul: C.doux, gras: false });
      registre(MX, MY, n.m); registre(SX, SY, n.s);
      EMB.texte(g, "MSB", [MX - 2, MY + 66], { taille: 15, ancre: "start", coul: C.doux });
      EMB.texte(g, "MSB", [SX + 8 * W + 2, SY - 16], { taille: 15, ancre: "end", coul: C.doux });
      // impulsions déjà données
      for (var k = 0; k < 8; k++) {
        var x = 60 + k * 34, fait = k < n.T;
        EMB.el("path", { d: "M" + x + " 560 v-28 h17 v28 h17", fill: "none", stroke: fait ? C.acc : C.pale, "stroke-width": 3 }, g);
      }
      EMB.texte(g, "T = " + n.T, [390, 546], { taille: 24, mono: true, ancre: "start" });
      EMB.texte(g, "rouge : bits du maître", [520, 520], { taille: 14, coul: C.ko, ancre: "start" });
      EMB.texte(g, "bleu : bits de l'esclave", [520, 546], { taille: 14, coul: C.acc, ancre: "start" });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Premier bit", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Maître : 10101010. Esclave : 11000011. Au premier coup d'horloge, quel bit quitte le maître ?");
      j.choix([
        { html: "Le bit de gauche (MSB), un 1", juste: true },
        { html: "Le bit de droite (LSB), un 0", aide: "Suis le fil « Sortie » du maître : il part du côté gauche du registre, celui du MSB." }
      ], { colonnes: 1, ok: function () {
        n.coup();
        j.bravo("Le MSB du maître part ; le bit de droite de l'esclave entre à droite du maître.");
        j.expliquer("<p>À T = 1 : maître 01010101, esclave 11100001. Les deux registres décalent en même temps, sur le même coup d'horloge : c'est une <b>écriture et lecture simultanée</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Prédire T = 2", jouer: function (j, n) {
      j.titre("Que contiendra le registre du maître à T = 2 ?");
      j.choix([
        { html: "<span class='mono'>10101011</span>", juste: true },
        { html: "<span class='mono'>00101010</span>", aide: "Le bit qui entre à droite du maître vient de l'esclave : c'est son bit de droite, qui vaut 1." },
        { html: "<span class='mono'>10101010</span>", aide: "Le registre bouge à chaque coup : décale 01010101 d'un cran vers la gauche." },
        { html: "<span class='mono'>11010101</span>", aide: "Le maître décale vers la gauche, pas vers la droite." }
      ], { colonnes: 2, ok: function () {
        n.coup();
        j.bravo("Maître 10101011, esclave 01110000 : les états de la diapositive à T = 2.");
        j.suite();
      } });
    } },
    { nom: "Huit coups", jouer: function (j, n) {
      j.titre("Donne des coups d'horloge jusqu'à ce que le maître contienne l'octet de départ de l'esclave.");
      var fini = false, b = E.h("button", "btn bleu", "Coup d'horloge", j.el); b.type = "button";
      function tester() {
        if (n.T === 8 && n.texteM() === "11000011") {
          fini = true; b.remove();
          j.bravo("T = 8 : maître 11000011, esclave 01010101.", [190, 353]);
          j.expliquer("<p>Les deux registres forment un anneau de 16 bits. Après 8 coups d'horloge, ils ont échangé leur contenu : le maître a l'octet de l'esclave. L'esclave a celui du maître, 10101010 ; il est dessiné à l'envers (MSB à droite), d'où l'écriture 01010101 de la diapositive.</p>");
          j.suite();
        }
      }
      b.addEventListener("click", function () { if (fini) return; if (n.T >= 8) { n.depart(); return; } n.coup(); tester(); });
      j.reponse(function () { while (!fini && n.T < 8) { n.coup(); tester(); } });
    } },
    { nom: "Les trois fils", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le SPI transmet 8 bits avec seulement 3 fils. Nomme-les.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px 14px;align-items:center;font-size:17px">' +
        '<span>sortie du maître, entrée de l\'esclave</span><span class="trou" data-attendu="o"></span>' +
        '<span>sortie de l\'esclave, entrée du maître</span><span class="trou" data-attendu="i"></span>' +
        '<span>horloge, donnée par le maître</span><span class="trou" data-attendu="k"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "k", html: "SCK" }, { id: "i", html: "MISO" }, { id: "o", html: "MOSI" }],
        aide: "MOSI : <i>Master Out, Slave In</i>. MISO : <i>Master In, Slave Out</i>.",
        ok: function () {
          n.noms = true; n.dessin();
          j.bravo("MOSI, MISO, SCK.");
          j.expliquer("<p>Le <b>SPI</b> est une interface série synchrone, basée sur un registre à décalage qui transforme un mot binaire parallèle en série et l'inverse. Protocole maître/esclaves, fréquence élevée (plus de 1 Mbit/s). Usages : communication entre microcontrôleurs, mémoires, commande de moteurs pas-à-pas, capteurs de température. Sur le PIC18F4520, les broches s'appellent <b>SDO</b> (sortie) et <b>SDI</b> (entrée).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Durée", jouer: function (j, n) {
      j.titre("Une mémoire d'enregistreur ECG reçoit un octet sur un SPI dont l'horloge SCK est à 2 MHz. Combien de µs dure l'échange de l'octet ?");
      j.nombre({ avant: "t =", apres: "\\mu\\text{s}", cases: [{ attendu: 4, tol: 0.001 }], ligne: true,
        aide: function () { return "Un bit par coup d'horloge, 8 coups ; une période dure \\(1 / 2\\,\\text{MHz} = 0{,}5\\ \\mu\\text{s}\\)."; },
        ok: function () {
          j.bravo("8 × 0,5 µs = 4 µs.");
          j.expliquer("<p>Exemple ajouté. Pas de start ni de stop bit : l'horloge partagée suffit à synchroniser. Pendant ces 4 µs, un octet est aussi revenu de l'esclave.</p>");
          j.suite();
        } });
    } },
    { nom: "PIC18F4520", jouer: function (j, n) {
      j.titre("Sur le PIC18F4520, le mode SPI se choisit avec SSPM3:SSPM0. Maître : 00xx. Esclave : 010x. On écrit 0101 : quel rôle ?");
      j.choix([{ html: "Maître", aide: "Maître commence par 00. Ici, les trois premiers bits sont 010." }, { html: "Esclave", juste: true }], { colonnes: 2, ok: function () {
        j.bravo("010x : esclave (x peut valoir 0 ou 1).");
        j.expliquer("<p>Dans chaque PIC, le registre à décalage s'appelle <b>SSPSR</b> ; l'octet reçu est recopié dans le tampon <b>SSPBUF</b>, que lit le programme. SDO du maître va sur SDI de l'esclave, SDO de l'esclave sur SDI du maître, et SCK du maître sur SCK de l'esclave.</p>");
        j.suite();
      } });
    } }
  ]
});
