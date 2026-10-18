(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : un message I2C bit par bit ---------- */
  (function () {
    var f = R.figure("fig-chrono", {
      largeur: 960, hauteur: 470,
      titre: "Message I2C : adresse, R/W et un octet de données",
      essai: "<strong>Essaie</strong> : change l'adresse, le sens R/W, l'octet et la réponse finale ; fais défiler le curseur « impulsion ». <strong>Observe</strong> : SDA ne change que quand SCL est à 0, sauf pour START et STOP ; chaque octet occupe 8 impulsions et l'accusé la 9e."
    });
    var g = EMB.el("g", null, f.svg);
    var ca = R.curseur(f.reglages, { nom: "Adresse (7 bits)", min: 0, max: 127, pas: 1, val: 87, surChange: dessiner });
    var cd = R.curseur(f.reglages, { nom: "Octet de données", min: 0, max: 255, pas: 1, val: 37, surChange: dessiner });
    var ct = R.curseur(f.reglages, { nom: "Impulsion", min: 0, max: 20, pas: 1, val: 0, surChange: dessiner });
    var b = R.boutons(f.reglages);
    var lect = R.bascule(b, "Lecture (R/W = 1)", true, dessiner);
    var nack = R.bascule(b, "Finir par NACK", true, dessiner);
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      var a = EMB.binaire(ca.v, 7), d = EMB.binaire(cd.v, 8), rw = lect.checked ? 1 : 0;
      // créneaux : [type, valeur SDA, étiquette, groupe]
      var S = [["S", null, "S", "s"]];
      a.split("").forEach(function (x, i) { S.push(["b", +x, "A" + (6 - i), "a"]); });
      S.push(["b", rw, "R/W", "r"], ["b", 0, "ACK", "k"]);
      d.split("").forEach(function (x, i) { S.push(["b", +x, "D" + (7 - i), "d"]); });
      S.push(["b", nack.checked ? 1 : 0, nack.checked ? "NACK" : "ACK", "n"], ["P", null, "P", "p"]);
      var X0 = 70, P = 42, yH = 70, yB = 130, cH = 210, cB = 270;
      EMB.texte(g, "SDA", [X0 - 12, 100], { taille: 17, ancre: "end" });
      EMB.texte(g, "SCL", [X0 - 12, 240], { taille: 17, ancre: "end" });
      var dS = "", dC = "", imp = 0, cur = ct.v;
      S.forEach(function (s, i) {
        var x = X0 + i * P, yv = s[1] ? yH : yB;
        var grp = { s: C.v, a: C.acc, r: C.ko, k: C.ok, d: C.bleu, n: C.ok, p: C.v }[s[3]];
        EMB.el("rect", { x: x + 1, y: yH - 16, width: P - 2, height: cB - yH + 32, fill: grp, opacity: 0.08 }, g);
        if (s[0] === "S") { dS += "M" + x + " " + yH + " L" + (x + P * 0.5) + " " + yH + " L" + (x + P * 0.6) + " " + yB + " L" + (x + P) + " " + yB; dC += "M" + x + " " + cH + " L" + (x + P * 0.75) + " " + cH + " L" + (x + P * 0.8) + " " + cB + " L" + (x + P) + " " + cB; }
        else if (s[0] === "P") { dS += " L" + x + " " + yB + " L" + (x + P * 0.5) + " " + yB + " L" + (x + P * 0.6) + " " + yH + " L" + (x + P) + " " + yH; dC += " L" + (x + P * 0.2) + " " + cB + " L" + (x + P * 0.25) + " " + cH + " L" + (x + P) + " " + cH; }
        else {
          imp++;
          dS += " L" + x + " " + yv + " L" + (x + P) + " " + yv;
          dC += " L" + (x + P * 0.2) + " " + cB + " L" + (x + P * 0.25) + " " + cH + " L" + (x + P * 0.75) + " " + cH + " L" + (x + P * 0.8) + " " + cB + " L" + (x + P) + " " + cB;
          var num = s[3] === "a" ? 7 - (+s[2].slice(1)) : s[3] === "d" ? 8 - (+s[2].slice(1)) : s[3] === "r" ? 8 : 9;
          EMB.texte(g, String(num), [x + P / 2, cB + 22], { taille: 13, mono: true, coul: C.doux });
          EMB.texte(g, String(s[1]), [x + P / 2, yB + 24], { taille: 16, mono: true, coul: grp });
        }
        EMB.texte(g, s[2], [x + P / 2, 30], { taille: s[2].length > 3 ? 11 : 13, coul: grp });
      });
      EMB.el("path", { d: dS, fill: "none", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      EMB.el("path", { d: dC, fill: "none", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      // curseur temporel
      var xc = X0 + cur * P + P / 2;
      EMB.el("line", { x1: xc, y1: 44, x2: xc, y2: 300, stroke: C.ko, "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
      var s = S[cur];
      var lib = { s: "START : SDA descend pendant que SCL est à 1.", a: "Bit d'adresse " + s[2] + " (poids fort d'abord).", r: "Bit R/W : " + (rw ? "1, lecture." : "0, écriture."), k: "9e impulsion : l'esclave met SDA à 0 (ACK).", d: "Bit de donnée " + s[2] + ".", n: nack.checked ? "9e impulsion : SDA reste à 1, NACK : le maître ne veut plus de données." : "9e impulsion : ACK.", p: "STOP : SDA monte pendant que SCL est à 1." }[s[3]];
      EMB.texte(g, lib, [480, 350], { taille: 18 });
      // légende des champs
      [["adresse", C.acc], ["R/W", C.ko], ["ACK", C.ok], ["données", C.bleu], ["START / STOP", C.v]].forEach(function (l, i) {
        EMB.el("rect", { x: 90 + i * 170, y: 400, width: 18, height: 18, rx: 4, fill: l[1], opacity: 0.5 }, g);
        EMB.texte(g, l[0], [116 + i * 170, 410], { taille: 15, ancre: "start", gras: false });
      });
      R.rendre(zone, "\\text{adresse} = " + a + "_2 = " + ca.v + "\\qquad R/\\overline{W} = " + rw + "\\qquad \\text{premier octet : } " + a + rw + "\\qquad N_{SCL} = 2 \\times 9 = 18");
    }
    dessiner();
  })();
})();
