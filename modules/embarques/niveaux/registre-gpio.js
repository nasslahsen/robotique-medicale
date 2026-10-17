/* Niveau : le registre GPIO_PINn_REG, ses champs et son adresse (Section III, diapositive 18). */
NIVEAU({
  id: "registre-gpio",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var X0 = 36, W = 19, Y = 200, H = 52;
    // champs de la diapo : [nom, bit haut, bit bas, modifiable]
    var CHAMPS = [["réservé", 31, 18, false], ["INT_ENA", 17, 13, true], ["réservé", 12, 11, false], ["WAKEUP_ENABLE", 10, 10, true], ["INT_TYPE", 9, 7, true], ["réservé", 6, 3, false], ["PAD_DRIVER", 2, 2, true], ["réservé", 1, 0, false]];
    var n = { bits: [], libre: false, surChamp: null, surBit: null, marque: null, valeur: false, n: 4 };
    for (var i = 0; i < 32; i++) n.bits.push(0);
    function xb(b) { return X0 + (31 - b) * W; }
    n.champ = function (nom) { var c = CHAMPS.filter(function (c) { return c[0] === nom; })[0], v = 0; for (var b = c[1]; b >= c[2]; b--) v = v * 2 + n.bits[b]; return v; };
    n.regler = function (nom, v) { var c = CHAMPS.filter(function (c) { return c[0] === nom; })[0]; for (var b = c[2]; b <= c[1]; b++) { n.bits[b] = v & 1; v >>= 1; } };
    n.total = function () { var v = 0; for (var b = 31; b >= 0; b--) v = v * 2 + n.bits[b]; return v; };
    n.zones = function () {
      var z = {};
      if (n.surChamp) CHAMPS.forEach(function (c, k) { if (c[3]) z["c" + c[0]] = EMB.zoneMin([xb(c[1]), Y, (c[1] - c[2] + 1) * W, H]); });
      if (n.surBit) for (var b = 0; b < 32; b++) z["b" + b] = [xb(b), Y - 4, W, H + 8];
      return z;
    };
    n.dessin = function () {
      EMB.vider(g);
      EMB.texte(g, "GPIO_PIN" + n.n + "_REG", [340, 110], { taille: 24, mono: true });
      EMB.texte(g, "décalage : 0x88 + 0x4 × " + n.n + (n.adresse ? " = 0x" + EMB.hexa(0x88 + 4 * n.n, 2) : ""), [340, 145], { taille: 18, mono: true, coul: C.doux, gras: false });
      CHAMPS.forEach(function (c) {
        var mod = c[3], m = n.marque === c[0];
        for (var b = c[1]; b >= c[2]; b--) {
          EMB.el("rect", { x: xb(b), y: Y, width: W, height: H, fill: m ? C.clair : mod ? "#fff" : "#eef0f5", stroke: C.encre, "stroke-width": 1.2 }, g);
          EMB.texte(g, String(n.bits[b]), [xb(b) + W / 2, Y + H / 2 + 1], { taille: 17, mono: true, coul: mod ? C.encre : C.gris, halo: false });
        }
        EMB.el("rect", { x: xb(c[1]), y: Y, width: (c[1] - c[2] + 1) * W, height: H, fill: "none", stroke: m ? C.acc : C.encre, "stroke-width": m ? 4 : 2.5 }, g);
        EMB.texte(g, String(c[1]), [xb(c[1]) + W / 2, Y - 14], { taille: 12, mono: true, coul: C.doux, gras: false, halo: false });
        if (c[2] !== c[1]) EMB.texte(g, String(c[2]), [xb(c[2]) + W / 2, Y - 14], { taille: 12, mono: true, coul: C.doux, gras: false, halo: false });
      });
      // étiquettes des champs modifiables, en escalier
      [["INT_ENA", 320], ["WAKEUP_ENABLE", 365], ["INT_TYPE", 410], ["PAD_DRIVER", 455]].forEach(function (e) {
        var c = CHAMPS.filter(function (x) { return x[0] === e[0]; })[0], cx = xb(c[1]) + (c[1] - c[2] + 1) * W / 2, m = n.marque === c[0];
        EMB.el("polyline", { points: cx + "," + (Y + H) + " " + cx + "," + e[1] + " 330," + e[1], fill: "none", stroke: m ? C.acc : C.gris, "stroke-width": 2 }, g);
        EMB.el("circle", { cx: cx, cy: Y + H + 4, r: 4, fill: m ? C.acc : C.gris }, g);
        var txt = "GPIO_PINn_" + e[0] + " = " + n.champ(e[0]);
        EMB.texte(g, txt, [320, e[1]], { taille: 16, mono: true, coul: m ? C.acc : C.encre, ancre: "end" });
      });
      if (n.valeur) EMB.texte(g, "valeur = 0x" + EMB.hexa(n.total(), 8), [340, 530], { taille: 24, mono: true, coul: C.acc });
    };
    EMB.toucher(fig.svg, n.zones, function (k) {
      if (k.charAt(0) === "c" && n.surChamp) n.surChamp(k.slice(1));
      else if (k.charAt(0) === "b" && n.surBit) n.surBit(+k.slice(1));
    });
    n.CHAMPS = CHAMPS;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le bon champ", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Tu veux choisir comment la broche déclenche son interruption (front, niveau). Touche le champ à modifier sur le registre.");
      var fini = false;
      n.surChamp = function (nom) {
        if (fini) return;
        if (nom !== "INT_TYPE") { j.erreur(nom === "INT_ENA" ? "INT_ENA dit quel CPU reçoit l'interruption, pas comment elle se déclenche." : nom === "PAD_DRIVER" ? "PAD_DRIVER choisit sortie normale ou drain ouvert." : "WAKEUP_ENABLE sert au réveil, pas au type de déclenchement."); return; }
        fini = true; n.surChamp = null; n.marque = "INT_TYPE"; n.dessin();
        j.bravo("INT_TYPE, bits 9 à 7.", [200, 226]);
        j.expliquer("<p>Le registre <b>GPIO_PINn_REG</b> existe pour n = 0 à 19, 21 à 23, 25 à 27 et 32 à 39. Ses champs : INT_ENA (bits 17 à 13), WAKEUP_ENABLE (bit 10), INT_TYPE (bits 9 à 7), PAD_DRIVER (bit 2). Les autres bits sont réservés et valent 0 au reset.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surChamp) n.surChamp("INT_TYPE"); });
    } },
    { nom: "L'adresse", jouer: function (j, n) {
      n.marque = null; n.dessin();
      j.titre("Le registre de la broche n se trouve au décalage 0x88 + 0x4·n. Quel est celui de GPIO 4 ?");
      j.choix([{ html: "0x8C", aide: "0x4·n avec n = 4, ce n'est pas 0x4." }, { html: "0x98", juste: true }, { html: "0x92", aide: "4 × 4 = 16, et 16 en hexadécimal s'écrit 0x10, pas 0x0A." }], { ok: function () {
        n.adresse = true; n.dessin();
        j.bravo("0x88 + 0x10 = 0x98.");
        j.expliquer("<p>Chaque registre fait 4 octets, d'où le pas de 0x4. 0x88 + 0x4·n est un décalage dans le bloc des registres GPIO, pas une adresse absolue.</p>");
        j.suite();
      } });
    } },
    { nom: "Front descendant", jouer: function (j, n) {
      j.fig.astuce("Touche un bit pour le basculer.");
      j.titre("Écris un front descendant dans INT_TYPE en touchant ses bits.");
      n.marque = "INT_TYPE"; n.dessin();
      var fini = false;
      n.surBit = function (b) {
        if (fini) return;
        if (b < 7 || b > 9) { j.erreur("Ce bit n'est pas dans INT_TYPE : reste entre 9 et 7."); return; }
        n.bits[b] = 1 - n.bits[b]; n.dessin();
      };
      var bV = E.h("button", "btn bleu", "Vérifier", j.el); bV.type = "button";
      function verifier() {
        if (fini) return;
        var v = n.champ("INT_TYPE");
        if (v !== 2) { j.erreur("INT_TYPE vaut " + v + ". Front descendant, c'est 2, soit 010 en binaire."); return; }
        fini = true; n.surBit = null; bV.remove(); j.fig.astuce("");
        j.bravo("INT_TYPE = 010 = 2.");
        j.suite();
      }
      bV.addEventListener("click", verifier);
      j.reponse(function () { n.regler("INT_TYPE", 2); n.dessin(); verifier(); });
    } },
    { nom: "Quel CPU", jouer: function (j, n) {
      n.marque = "INT_ENA"; n.dessin();
      j.titre("Seul le PRO CPU doit recevoir l'interruption, en interruption normale (masquable). Quelle valeur écrire dans INT_ENA ?");
      j.zone("", '<p style="font-size:16px;line-height:1.6">bit0 : APP CPU interrupt enable<br>bit1 : APP CPU non-maskable interrupt enable<br>bit2 : PRO CPU interrupt enable<br>bit3 : PRO CPU non-maskable interrupt enable</p>');
      j.nombre({ avant: "\\text{INT\\_ENA} =", cases: [{ attendu: 4, tol: 0 }], ligne: true,
        aide: function () { return "Un seul bit à 1 : le bit 2. Son poids est \\(2^2\\)."; },
        ok: function () { n.regler("INT_ENA", 4); n.dessin(); j.bravo("00100 en binaire, soit 4."); j.suite(); } });
    } },
    { nom: "La valeur", jouer: function (j, n) {
      n.marque = null; n.dessin();
      j.titre("INT_ENA = 4, INT_TYPE = 2, tout le reste à 0. Quelle valeur 32 bits contient le registre ?");
      j.choix([{ html: "0x8100", juste: true }, { html: "0x0402", aide: "Les champs ne sont pas collés à droite : INT_TYPE commence au bit 7, INT_ENA au bit 13." }, { html: "0x4100", aide: "INT_ENA = 4 au bit 13 donne \\(4 \\times 2^{13} = 2^{15}\\) : c'est le bit 15." }], { ok: function () {
        n.valeur = true; n.dessin();
        j.bravo("\\(4 \\times 2^{13} + 2 \\times 2^{7} = 32768 + 256 = 33024\\), soit 0x8100.");
        j.suite();
      } });
    } },
    { nom: "Drain ouvert", jouer: function (j, n) {
      n.marque = "PAD_DRIVER"; n.dessin();
      j.titre("La broche partage une ligne avec d'autres circuits, comme SDA en I2C : elle doit pouvoir tirer à 0 sans jamais imposer 1. Que vaut PAD_DRIVER ?");
      j.choix([{ html: "0 : sortie normale", aide: "Une sortie normale impose aussi le 1. Sur une ligne partagée, deux sorties en désaccord se battraient." }, { html: "1 : drain ouvert", juste: true }], { colonnes: 2, ok: function () {
        n.bits[2] = 1; n.valeur = true; n.dessin();
        j.bravo("PAD_DRIVER = 1 : sortie en drain ouvert.");
        j.expliquer("<p><b>GPIO_PINn_PAD_DRIVER</b> : 0 pour une sortie normale, 1 pour une sortie en drain ouvert (<i>open drain</i>). En drain ouvert, la broche ne sait que tirer à 0 ; le 1 vient d'une résistance de tirage.</p>");
        j.suite();
      } });
    } }
  ]
});
