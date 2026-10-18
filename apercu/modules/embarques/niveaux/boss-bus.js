/* Boss du chapitre 3 : un oxymètre de pouls (exemple ajouté) avec un capteur I2C, un afficheur et une carte SD en SPI, une liaison UART vers le PC. */
NIVEAU({
  id: "boss-bus",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "systeme", octet: [0, 0, 0, 0, 0, 0, 0, 0], libre: false, marque: null, allume: null };
    var X0 = 84, W = 64;
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "systeme") {
        var A = n.allume;
        EMB.bloc(g, 250, 230, 180, 120, "MCU", { taille: 26, actif: true });
        EMB.bloc(g, 20, 90, 190, 90, "Capteur SpO2\nadresse 1010111", { taille: 16, actif: A === "i2c" });
        EMB.bloc(g, 470, 70, 190, 80, "Afficheur OLED\nesclave 1", { taille: 16, actif: A === "spi" });
        EMB.bloc(g, 470, 190, 190, 80, "Carte SD\nesclave 2", { taille: 16, actif: A === "spi" });
        EMB.bloc(g, 250, 460, 180, 90, "PC", { taille: 24, actif: A === "uart" });
        EMB.fleche(g, [210, 150], [250, 260], { double: true, ep: 3, coul: A === "i2c" ? C.acc : C.encre });
        EMB.texte(g, "I2C : SDA, SCL", [150, 230], { taille: 16 });
        EMB.fleche(g, [430, 260], [470, 120], { double: true, ep: 3, coul: A === "spi" ? C.acc : C.encre });
        EMB.fleche(g, [430, 280], [470, 230], { double: true, ep: 3, coul: A === "spi" ? C.acc : C.encre });
        EMB.texte(g, "SPI : SCK, MOSI,\nMISO, SS1, SS2", [560, 330], { taille: 16 });
        EMB.fleche(g, [340, 350], [340, 460], { double: true, ep: 3, coul: A === "uart" ? C.acc : C.encre });
        EMB.texte(g, "UART : TX, RX", [430, 405], { taille: 16 });
      } else {
        EMB.texte(g, "premier octet après START", [340, 120], { taille: 19, coul: C.doux });
        n.octet.forEach(function (b, k) {
          var m = n.marque ? (n.marque[k] ? "ok" : "ko") : null;
          EMB.el("rect", { x: X0 + k * W + 3, y: 170, width: W - 6, height: 90, rx: 10, fill: m ? (m === "ok" ? "#e3f7ee" : "#fdecec") : n.libre ? EMB.teinte(0.12) : "#fff", stroke: m ? (m === "ok" ? C.ok : C.ko) : C.encre, "stroke-width": 2.5 }, g);
          EMB.texte(g, String(b), [X0 + k * W + W / 2, 216], { taille: 34, mono: true, halo: false });
          EMB.texte(g, k < 7 ? "A" + (6 - k) : "R/W", [X0 + k * W + W / 2, 290], { taille: 15, mono: true, coul: C.doux });
        });
        EMB.el("path", { d: "M" + X0 + " 320 v12 h" + 7 * W + " v-12", fill: "none", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "adresse 7 bits", [X0 + 3.5 * W, 356], { taille: 17, gras: false });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (n.mode !== "octet" || !n.libre) return {};
      var z = {}; for (var k = 0; k < 8; k++) z[k] = [X0 + k * W, 160, W, 150]; return z;
    }, function (k) { if (!n.libre) return; k = +k; n.octet[k] = 1 - n.octet[k]; n.marque = null; n.dessin(); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Adresser le capteur", jouer: function (j, n) {
      n.mode = "octet"; n.libre = true; n.dessin();
      j.fig.astuce("");
      j.titre("Un oxymètre de pouls. Le MCU veut lire la SpO2 dans le capteur d'adresse 1010111. Écris sur la figure le premier octet qu'il envoie après START.");
      var CIBLE = [1, 0, 1, 0, 1, 1, 1, 1], fini = false;
      var b = E.h("button", "btn bleu", "Vérifier", j.el); b.type = "button";
      function verifier() {
        if (fini) return;
        n.marque = n.octet.map(function (v, k) { return v === CIBLE[k]; }); n.dessin();
        if (n.marque.every(function (x) { return x; })) {
          fini = true; n.libre = false; b.remove(); n.marque = null; n.dessin();
          j.bravo("1010111 puis \\(R/\\overline{W} = 1\\) : 10101111.", [340, 216]);
          j.suite();
          return;
        }
        j.erreur("Les cases rouges sont fausses.");
      }
      b.addEventListener("click", verifier);
      j.reponse(function () { n.octet = CIBLE.slice(); n.dessin(); verifier(); });
    } },
    { nom: "Deux octets", jouer: function (j, n) {
      n.mode = "systeme"; n.allume = "i2c"; n.dessin();
      j.titre("La SpO2 tient sur deux octets. Combien d'impulsions SCL pour toute la lecture, entre START et STOP ?");
      j.nombre({ avant: "N_{SCL} =", cases: [{ attendu: 27, tol: 0 }], ligne: true,
        aide: function () { return "Trois octets passent sur SDA (adresse et R/W, puis deux données), chacun suivi d'un accusé."; },
        ok: function () { j.bravo("3 × 9 = 27."); j.suite(); } });
    } },
    { nom: "Fin de lecture", jouer: function (j, n) {
      j.titre("Le MCU a reçu les deux octets et ne veut plus rien lire. Que met-il au 9e coup d'horloge du dernier octet, avant STOP ?");
      j.choix([
        { html: "NACK : pas d'accusé", juste: true },
        { html: "ACK", aide: "Un ACK dirait au capteur « continue, envoie l'octet suivant ». Le chronogramme du cours termine par ACK/NACK." },
        { html: "Une nouvelle adresse", aide: "L'adresse ne vient qu'après un START. Au 9e coup, il n'y a que l'accusé." }
      ], { colonnes: 1, ok: function () { j.bravo("NACK, puis STOP."); j.suite(); } });
    } },
    { nom: "Vers le PC", jouer: function (j, n) {
      n.allume = "uart"; n.dessin();
      j.titre("Le MCU envoie la valeur 98 = 01100010 au PC par l'UART. Quelle suite de niveaux sort sur TX (start, 8 bits, stop) ?");
      j.choix([
        { html: "<span class='mono'>0 01000110 1</span>", juste: true },
        { html: "<span class='mono'>0 01100010 1</span>", aide: "Le bit 0 (celui de droite dans 01100010) part en premier." },
        { html: "<span class='mono'>1 01000110 0</span>", aide: "Start et stop sont inversés : la ligne au repos est à 1, le start la fait passer à 0." }
      ], { colonnes: 1, ok: function () { j.bravo("Start 0, puis le bit 0 d'abord, puis stop 1."); j.suite(); } });
    } },
    { nom: "Débit", jouer: function (j, n) {
      j.titre("Il envoie trois octets (SpO2, pouls, état) à 9600 bps, un octet par trame de 10 bits. Combien de ms en tout ?");
      j.nombre({ avant: "t =", apres: "\\text{ms}", cases: [{ attendu: 3.125, tol: 0.005 }], ligne: true,
        aide: function () { return "30 bits à 9600 bits par seconde."; },
        ok: function () { j.bravo("30 / 9600 s = 3,125 ms."); j.suite(); } });
    } },
    { nom: "Enregistrer", jouer: function (j, n) {
      n.allume = "spi"; n.dessin();
      j.titre("Le MCU écrit maintenant la mesure dans la carte SD (esclave 2). Quel état pour les lignes de sélection ?");
      j.choix([
        { html: "\\(\\overline{SS_1} = 1,\\ \\overline{SS_2} = 0\\)", juste: true },
        { html: "\\(\\overline{SS_1} = 0,\\ \\overline{SS_2} = 1\\)", aide: "Ça sélectionne l'afficheur. La barre veut dire : actif à 0." },
        { html: "\\(\\overline{SS_1} = 1,\\ \\overline{SS_2} = 1\\)", aide: "Aucun esclave n'est sélectionné : personne n'écoute." },
        { html: "\\(\\overline{SS_1} = 0,\\ \\overline{SS_2} = 0\\)", aide: "Deux esclaves à la fois se battraient sur MISO." }
      ], { colonnes: 2, ok: function () { j.bravo("Seule la carte SD est sélectionnée."); j.suite(); } });
    } }
  ]
});
