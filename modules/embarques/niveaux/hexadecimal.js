/* Niveau : hexadécimal et registres. Un chiffre hexadécimal = 4 bits, préfixe 0x, adresses, offset 0x88 + 0x4·n, champs de bits, KiB. */
NIVEAU({
  id: "hexadecimal",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "octet", bits: [0, 0, 0, 0, 0, 0, 0, 0], reg: [], libre: false, surBit: null, cible: null, champ: false, bit2: false, montreN3: false };
    n.valeur = function (b) { return (b || n.bits).reduce(function (s, x) { return s * 2 + x; }, 0); };
    n.regler = function (v) { n.bits = []; for (var k = 7; k >= 0; k--) n.bits.push((v >> k) & 1); };
    // octet : deux quartets séparés
    var W = 62, H = 80, Y = 190, XQ = [70, 70 + 4 * W + 40];
    n.zones = function () {
      var z = {};
      if (n.mode === "octet") n.bits.forEach(function (b, k) { z[k] = [XQ[k < 4 ? 0 : 1] + (k % 4) * W, Y, W, H]; });
      else if (n.mode === "registre") n.reg.forEach(function (b, k) { z[k] = [52 + k * 48, 250, 48, 76]; });
      return z;
    };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "octet") {
        if (n.cible) EMB.texte(g, "Objectif : " + n.cible, [340, 88], { taille: 22, coul: C.acc });
        [0, 1].forEach(function (q) {
          var bq = n.bits.slice(4 * q, 4 * q + 4), v = n.valeur(bq);
          EMB.bits(g, XQ[q], Y, n.cacheBits ? ["", "", "", ""] : bq, { w: W, h: H, indices: [7 - 4 * q, 6 - 4 * q, 5 - 4 * q, 4 - 4 * q], taille: 32 });
          EMB.el("path", { d: "M" + (XQ[q] + 4) + " " + (Y + H + 14) + " q0 14 14 14 h" + (4 * W - 36) + " q14 0 14 -14", fill: "none", stroke: C.acc, "stroke-width": 3 }, g);
          EMB.texte(g, EMB.hexa(v), [XQ[q] + 2 * W, Y + H + 64], { taille: 46, mono: true, coul: C.acc });
          if (!n.cacheDec) EMB.texte(g, "= " + v, [XQ[q] + 2 * W, Y + H + 108], { taille: 16, mono: true, coul: C.doux, gras: false });
        });
        EMB.el("rect", { x: 150, y: 470, width: 380, height: 84, rx: 18, fill: n.cible && n.valeur() === parseInt(n.cible, 16) ? "#e3f7ee" : C.fond, stroke: C.pale, "stroke-width": 2 }, g);
        EMB.texte(g, "0x" + EMB.hexa(n.valeur(), 2) + "  = " + (n.cacheDec ? "?" : n.valeur()), [340, 512], { taille: 34, mono: true });
        if (n.libre) EMB.texte(g, "touche un bit pour le basculer", [340, 130], { taille: 16, coul: C.doux, gras: false });
      } else if (n.mode === "adresses") {
        EMB.texte(g, "Un registre par broche n", [340, 88], { taille: 22 });
        var lignes = [["n = 0", "0x88"], ["n = 1", "0x8C"], ["n = 2", n.montreN3 ? "0x90" : "?"], ["n = 3", n.montreN3 ? "0x94" : "?"]];
        lignes.forEach(function (l, k) {
          var y = 110 + k * 100, actif = k === 3;
          EMB.bloc(g, 120, y, 160, 74, l[0], { taille: 22, mono: true, fill: C.fond });
          EMB.fleche(g, [290, y + 37], [380, y + 37], { ep: 3 });
          EMB.bloc(g, 390, y, 180, 74, l[1], { taille: 28, mono: true, actif: actif });
          if (k) EMB.texte(g, "+ 0x4", [600, y - 13], { taille: 16, mono: true, coul: C.doux, ancre: "start", gras: false });
        });
      } else if (n.mode === "registre") {
        EMB.texte(g, "Registre d'exemple (12 bits)", [340, 88], { taille: 22 });
        var ind = [], marques = {};
        for (var k = 0; k < 12; k++) ind.push(11 - k);
        if (n.champ) [2, 3, 4].forEach(function (k) { marques[k] = EMB.teinte(0.25); });
        if (n.bit2) marques[9] = "#c9f0dc";
        EMB.bits(g, 52, 250, n.reg, { w: 48, h: 76, indices: ind, marques: marques, taille: 28 });
        if (n.champ) {
          EMB.el("path", { d: "M" + (52 + 2 * 48 + 4) + " 340 q0 14 14 14 h" + (3 * 48 - 36) + " q14 0 14 -14", fill: "none", stroke: C.acc, "stroke-width": 3 }, g);
          EMB.texte(g, "champ TYPE", [52 + 3.5 * 48, 380], { taille: 17, coul: C.acc });
          EMB.texte(g, "bits 9 à 7", [52 + 3.5 * 48, 404], { taille: 14, coul: C.doux, gras: false });
        }
        if (n.bit2 !== null) {
          EMB.texte(g, "ENA", [52 + 9.5 * 48, 380], { taille: 17, coul: n.bit2 ? C.ok : C.doux });
          EMB.texte(g, "bit 2", [52 + 9.5 * 48, 404], { taille: 14, coul: C.doux, gras: false });
        }
        EMB.texte(g, "0x" + EMB.hexa(n.valeur(n.reg), 3), [340, 500], { taille: 38, mono: true });
        if (n.libre) EMB.texte(g, "touche un bit pour le basculer", [340, 180], { taille: 16, coul: C.doux, gras: false });
      } else {
        // mémoire : 1 KiB = 1024 octets
        EMB.texte(g, "SRAM du domaine RTC : 16 KB", [340, 88], { taille: 24 });
        for (var b = 0; b < 16; b++) {
          var x = 90 + (b % 8) * 64, y = 130 + Math.floor(b / 8) * 80;
          EMB.el("rect", { x: x, y: y, width: 56, height: 70, rx: 6, fill: b === 0 ? C.acc : EMB.teinte(0.18), stroke: "#fff" }, g);
        }
        EMB.texte(g, "1 KiB", [118, 165], { taille: 14, coul: "#fff", halo: false });
        EMB.texte(g, "chaque case : 1 KiB", [340, 315], { taille: 16, coul: C.doux, gras: false });
        EMB.bloc(g, 140, 380, 400, 110, "1 KiB = 1024 octets\n1 octet = 8 bits", { taille: 24, fill: C.fond, mono: true });
      }
    };
    EMB.toucher(fig.svg, function () { return n.libre ? n.zones() : {}; }, function (k) {
      if (!n.libre) return;
      if (n.mode === "octet") n.bits[+k] = 1 - n.bits[+k]; else n.reg[+k] = 1 - n.reg[+k];
      n.dessin();
      if (n.surBit) n.surBit(+k);
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Écrire 0xA5", jouer: function (j, n) {
      n.mode = "octet"; n.cacheBits = false; n.cacheDec = false; n.regler(0); n.cible = "0xA5"; n.libre = true; n.dessin();
      j.fig.astuce("Un quartet de 4 bits donne un chiffre hexadécimal.");
      j.titre("Écris l'octet 0xA5 en touchant les bits. Chaque groupe de 4 bits donne un chiffre.");
      var fini = false;
      function gagne() {
        if (fini) return;
        fini = true; n.libre = false; n.surBit = null; n.regler(0xA5); n.dessin();
        j.bravo("A = 1010 et 5 = 0101 : 0xA5 = 10100101 = 165.");
        j.expliquer("<p>L'<b>hexadécimal</b> compte en base 16 : 0 à 9 puis A (10) à F (15). Un chiffre hexadécimal remplace exactement 4 bits, d'où son usage pour écrire registres et adresses. Le préfixe 0x signale un nombre hexadécimal.</p>\\[ \\texttt{0xA5} = 10 \\times 16 + 5 = 165 \\]");
        j.suite();
      }
      n.surBit = function () { if (n.valeur() === 0xA5) gagne(); };
      j.reponse(gagne);
    } },
    { nom: "0x3C", jouer: function (j, n) {
      n.mode = "octet"; n.cible = null; n.regler(0x3C); n.cacheBits = true; n.cacheDec = true; n.dessin();
      j.fig.astuce("");
      j.titre("Quel est le binaire de 0x3C ?");
      j.choix([
        { html: "<span class='mono'>0011 1100</span>", juste: true },
        { html: "<span class='mono'>0011 1010</span>", aide: "C vaut 12 : 8 + 4, donc 1100. 1010, c'est A." },
        { html: "<span class='mono'>1100 0011</span>", aide: "Le premier chiffre (3) donne le quartet de gauche, celui de poids fort." }
      ], { colonnes: 1, ok: function () {
        n.cacheBits = false; n.dessin();
        j.bravo("3 = 0011, C = 1100. Et en décimal ?");
        j.nombre({ avant: "\\texttt{0x3C} =", cases: [{ attendu: 60, tol: 0 }], ligne: true,
          aide: function () { return "\\(3 \\times 16 + 12\\)."; },
          ok: function () {
            n.cacheDec = false; n.dessin();
            j.bravo("\\(3 \\times 16 + 12 = 60\\).");
            j.suite();
          } });
      } });
    } },
    { nom: "Adresse suivante", jouer: function (j, n) {
      n.mode = "adresses"; n.montreN3 = false; n.dessin();
      j.titre("Chaque broche n a son registre, à l'offset 0x88 + 0x4·n. Complète l'offset de la broche 3.");
      var z = j.zone("", '<p style="font-size:24px;font-family:JetBrains Mono,monospace">0x<span class="trou" data-attendu="9"></span><span class="trou" data-attendu="4"></span></p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "8", html: "8" }, { id: "4", html: "4" }, { id: "C", html: "C" }, { id: "9", html: "9" }, { id: "A", html: "A" }],
        aide: "0x4 × 3 = 0xC, et 0x88 + 0xC : 8 + 12 = 20 = 16 + 4, une retenue passe au chiffre de gauche.",
        ok: function () {
          n.montreN3 = true; n.dessin();
          j.bravo("0x88 + 0xC = 0x94.");
          j.expliquer("<p>Les registres 32 bits occupent 4 octets chacun : d'une broche à la suivante, l'adresse avance de 0x4. Tu retrouveras \\(\\texttt{0x88} + \\texttt{0x4} \\times n\\) avec le registre GPIO_PINn_REG au chapitre 5.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Lire un champ", jouer: function (j, n) {
      n.mode = "registre"; n.reg = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]; n.champ = true; n.bit2 = null; n.dessin();
      j.titre("Dans un registre, un groupe de bits forme un champ. Quelle valeur contient le champ TYPE (bits 9 à 7) ?");
      j.nombre({ avant: "\\text{TYPE} =", cases: [{ attendu: 2, tol: 0 }], ligne: true,
        aide: function () { return "Lis les trois cases colorées comme un petit nombre binaire : 010."; },
        ok: function () {
          j.bravo("010 = 2.");
          j.expliquer("<p>Un <b>registre</b> est un mot de bits où chaque champ a un rôle. On lit un champ comme un nombre à part, en partant de son propre bit de poids faible.</p>");
          j.suite();
        } });
    } },
    { nom: "Activer", jouer: function (j, n) {
      n.mode = "registre"; n.reg = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]; n.champ = true; n.bit2 = false; n.libre = true; n.dessin();
      j.fig.astuce("Touche le bon bit.");
      j.titre("Le bit 2 (ENA) active la fonction. Mets-le à 1 sans toucher au reste.");
      var fini = false;
      function gagne() {
        if (fini) return;
        fini = true; n.libre = false; n.surBit = null;
        n.reg = [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1]; n.bit2 = true; n.dessin();
        j.bravo("Bit 2 à 1 : le registre passe de 0x101 à 0x105.");
        j.expliquer("<p>Mettre un bit à 1 ajoute son poids : ici \\(2^2 = 4\\), donc \\(\\texttt{0x101} + 4 = \\texttt{0x105}\\). Le rang se compte depuis la droite, en partant de 0.</p>");
        j.suite();
      }
      n.surBit = function (k) {
        if (fini) return;
        if (k === 9 && n.reg[9] === 1) { gagne(); return; }
        n.reg[k] = 1 - n.reg[k]; n.dessin();
        j.erreur("Ce bit est le bit " + (11 - k) + ". Compte depuis la droite : le bit de droite est le bit 0.");
      };
      j.reponse(gagne);
    } },
    { nom: "16 KB", jouer: function (j, n) {
      n.mode = "memoire"; n.libre = false; j.fig.astuce(""); n.dessin();
      j.titre("La fiche de l'ESP32 annonce 16 KB de SRAM dans le domaine RTC. Combien d'octets ?");
      j.nombre({ avant: "16 \\text{ KB} =", apres: "\\text{octets}", cases: [{ attendu: 16384, tol: 0 }], ligne: true,
        aide: function () { return "1 KiB = 1024 octets, pas 1000 : \\(16 \\times 1024\\)."; },
        ok: function () {
          j.bravo("\\(16 \\times 1024 = 16\\,384\\) octets.");
          j.expliquer("<p>En informatique, 1 KiB (kibioctet) vaut \\(2^{10} = 1024\\) octets. Les fiches écrivent souvent KB dans le même sens : « 520 KiB SRAM », « 448 KB ROM », « 16 KB SRAM in RTC ».</p>");
          j.suite();
        } });
    } }
  ]
});
