/* Niveau : le chronogramme I2C (Section II, diapositive 17). START, adresse 7 bits, R/W, ACK, données 8 bits, ACK/NACK, STOP, impulsions de SCL. */
NIVEAU({
  id: "i2c-trame",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    // segments : [id, largeur, impulsions SCL, étiquette, numéros]
    var SEG = [["s", 34, 0, "S", ""], ["a", 120, 7, "7-Bit\nADDRESS", "1 - 7"], ["r", 52, 1, "R/W", "8"], ["k1", 56, 1, "ACK", "9"], ["d1", 112, 8, "8-Bit\nDATA", "1 - 8"], ["k2", 56, 1, "ACK", "9"], ["d2", 112, 8, "8-Bit\nDATA", "1 - 8"], ["k3", 58, 1, "ACK/\nNACK", "9"], ["p", 34, 0, "P", ""]];
    var X0 = 33, YH = 170, YB = 230, CH = 300, CB = 350;
    var n = { etiq: false, choisi: null, bon: null, surTouche: null, allume: {} };
    var pos = [], x = X0;
    SEG.forEach(function (s) { pos.push(x); x += s[1]; });
    n.SEG = SEG; n.pos = pos;
    n.dessin = function () {
      EMB.vider(g);
      EMB.texte(g, "SDA", [X0 - 4, YH - 34], { taille: 17, ancre: "start" });
      EMB.texte(g, "SCL", [X0 - 4, CH - 34], { taille: 17, ancre: "start" });
      SEG.forEach(function (s, i) {
        var x = pos[i], w = s[1], on = n.allume[s[0]], ch = n.choisi === s[0];
        if (on || ch) EMB.el("rect", { x: x, y: YH - 12, width: w, height: CB - YH + 24, fill: ch ? (s[0] === n.bon ? "#e3f7ee" : "#fdecec") : EMB.teinte(0.12) }, g);
        // SDA
        if (s[0] === "s") EMB.el("path", { d: "M" + x + " " + YH + " L" + (x + 10) + " " + YH + " L" + (x + 20) + " " + YB + " L" + (x + w) + " " + YB, fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
        else if (s[0] === "p") EMB.el("path", { d: "M" + x + " " + YB + " L" + (x + 14) + " " + YB + " L" + (x + 24) + " " + YH + " L" + (x + w) + " " + YH, fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
        else {
          var d = "M" + x + " " + (YH + YB) / 2 + " L" + (x + 6) + " " + YH + " L" + (x + w - 6) + " " + YH + " L" + (x + w) + " " + (YH + YB) / 2 + " L" + (x + w - 6) + " " + YB + " L" + (x + 6) + " " + YB + " Z";
          EMB.el("path", { d: d, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
          EMB.texte(g, n.etiq ? s[3] : "?", [x + w / 2, (YH + YB) / 2], { taille: n.etiq ? 13 : 20, halo: false, coul: n.etiq ? C.encre : C.gris });
        }
        // SCL : niveau haut, une impulsion basse puis haute par bit
        var k = s[2], dd = "M" + x + " " + CH;
        if (s[0] === "s" || s[0] === "p") dd += " L" + (x + w) + " " + CH;
        else {
          var p = w / k;
          for (var q = 0; q < k; q++) { var a = x + q * p; dd += " L" + (a + p * 0.12) + " " + CH + " L" + (a + p * 0.22) + " " + CB + " L" + (a + p * 0.5) + " " + CB + " L" + (a + p * 0.6) + " " + CH + " L" + (a + p) + " " + CH; }
        }
        EMB.el("path", { d: dd, fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
        if (s[4]) EMB.texte(g, s[4], [x + w / 2, CB + 26], { taille: 14, mono: true, coul: C.doux });
      });
      // START et STOP
      EMB.el("rect", { x: pos[0] + 8, y: YH - 20, width: 16, height: CB - YH + 40, fill: "rgba(150,150,160,0.18)" }, g);
      EMB.el("rect", { x: pos[8] + 11, y: YH - 20, width: 16, height: CB - YH + 40, fill: "rgba(150,150,160,0.18)" }, g);
      if (n.etiq) {
        EMB.texte(g, "START\nCondition", [pos[0] + 16, CB + 70], { taille: 13 });
        EMB.texte(g, "STOP\nCondition", [pos[8] - 6, CB + 70], { taille: 13 });
      }
      if (n.total) {
        EMB.el("path", { d: "M" + pos[1] + " 460 v12 h" + (pos[8] - pos[1]) + " v-12", fill: "none", stroke: C.acc, "stroke-width": 2.5 }, g);
        EMB.texte(g, "9 + 9 + 9 = 27 impulsions", [(pos[1] + pos[8]) / 2, 500], { taille: 18, coul: C.acc });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var z = {}; SEG.forEach(function (s, i) { z[s[0]] = [pos[i], YH - 20, Math.max(s[1], 30), CB - YH + 60]; }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Remettre en ordre", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un MCU écrit deux octets dans une EEPROM. Remets les champs de la trame dans l'ordre du chronogramme.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:repeat(3,auto);gap:8px;justify-content:start">' + ["s", "a", "r", "k", "d", "k", "d", "n", "p"].map(function (id) { return '<span class="trou" data-attendu="' + id + '"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "d", html: "Données 8 bits" }, { id: "k", html: "ACK" }, { id: "p", html: "P (STOP)" }, { id: "a", html: "Adresse 7 bits" }, { id: "n", html: "ACK/NACK" }, { id: "s", html: "S (START)" }, { id: "k", html: "ACK" }, { id: "r", html: "R/W" }, { id: "d", html: "Données 8 bits" }],
        aide: "Lis les cases de gauche à droite, ligne par ligne. Après l'adresse vient le bit qui dit lire ou écrire ; chaque octet est suivi d'un accusé.",
        ok: function () {
          n.etiq = true; n.dessin();
          j.bravo("S, adresse, R/W, ACK, données, ACK, données, ACK/NACK, P.");
          j.expliquer("<p>Le maître envoie la condition <b>START</b>, l'<b>adresse</b> de l'esclave sur 7 bits et le bit <b>R/W</b> (lecture ou écriture). L'esclave répond <b>ACK</b>. Viennent ensuite les octets de données, chacun suivi d'un ACK ; le dernier peut recevoir un NACK. La condition <b>STOP</b> libère le bus.</p>");
          j.suite();
        }
      });
    } },
    { nom: "L'accusé", jouer: function (j, n) {
      j.titre("L'EEPROM a reconnu son adresse. Touche sur le chronogramme le moment où elle répond.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "k1"; n.dessin();
        if (k !== "k1") { j.erreur(k === "k2" || k === "k3" ? "Cet accusé suit un octet de données. Celui qui suit l'adresse vient plus tôt." : "Cherche le 9e coup d'horloge après l'adresse et le bit R/W."); return; }
        fini = true; n.surTouche = null; n.choisi = null; n.allume = { k1: true }; n.dessin();
        j.bravo("Au 9e coup de SCL : ACK.", [n.pos[3] + 28, 260]);
        j.expliquer("<p>Les impulsions 1 à 7 portent l'adresse, la 8e le bit R/W, la 9e l'accusé de réception (ACK) donné par l'esclave.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("k1"); });
    } },
    { nom: "Compter", jouer: function (j, n) {
      n.allume = {}; n.dessin();
      j.titre("Combien d'impulsions sur SCL entre START et STOP pour cette trame (adresse et deux octets) ?");
      j.nombre({ avant: "N_{SCL} =", cases: [{ attendu: 27, tol: 0 }], ligne: true,
        aide: function () { return "Chaque octet transmis (adresse + R/W, ou données) prend 8 impulsions, plus 1 pour l'accusé."; },
        ok: function () {
          n.total = true; n.dessin();
          j.bravo("3 × 9 = 27 impulsions.");
          j.suite();
        } });
    } },
    { nom: "START", jouer: function (j, n) {
      n.allume = { s: true }; n.total = false; n.dessin();
      j.titre("Regarde la bande grise de gauche (S). Qu'est-ce qui marque la condition START ?");
      j.choix([
        { html: "SDA passe de 1 à 0 pendant que SCL reste à 1", juste: true },
        { html: "SDA passe de 0 à 1 pendant que SCL reste à 1", aide: "Ça, c'est la bande de droite : la condition STOP." },
        { html: "SCL passe à 0 pendant que SDA reste à 1", aide: "Regarde la bande grise : SCL ne bouge pas, c'est SDA qui change." }
      ], { colonnes: 1, ok: function () {
        n.allume = { s: true, p: true }; n.dessin();
        j.bravo("START : SDA descend, SCL haut. STOP : SDA monte, SCL haut.");
        j.expliquer("<p>Pendant les données, SDA ne change que quand SCL est à 0. Un changement de SDA quand SCL est à 1 est donc réservé à START et STOP : impossible de les confondre avec des données.</p>");
        j.suite();
      } });
    } },
    { nom: "Adresses", jouer: function (j, n) {
      n.allume = { a: true }; n.dessin();
      j.titre("Avec une adresse sur 7 bits, combien de combinaisons d'adresse différentes ?");
      j.nombre({ avant: "N =", cases: [{ attendu: 128, tol: 0 }], ligne: true,
        aide: function () { return "Chaque bit double le nombre de combinaisons : \\(2^7\\)."; },
        ok: function () {
          j.bravo("\\(2^7 = 128\\) combinaisons.");
          j.expliquer("<p>Tous les circuits voient passer l'adresse sur SDA ; seul celui dont l'adresse correspond répond par un ACK. C'est ainsi que deux fils suffisent pour plusieurs esclaves, sans ligne de sélection.</p>");
          j.suite();
        } });
    } },
    { nom: "Lire ou écrire", jouer: function (j, n) {
      n.allume = { r: true }; n.dessin();
      j.titre("Le bit s'écrit \\(R/\\overline{W}\\) : la barre est sur le W. Le MCU veut lire la température d'un thermomètre I2C. Que vaut ce bit ?");
      j.choix([{ html: "1", juste: true }, { html: "0", aide: "La barre sur W veut dire « écriture quand le bit vaut 0 ». Ici on lit." }], { colonnes: 2, ok: function () {
        j.bravo("\\(R/\\overline{W} = 1\\) : lecture.");
        j.suite();
      } });
    } }
  ]
});
