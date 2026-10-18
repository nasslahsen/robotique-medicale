(function () {
  "use strict";
  var R = RM, C = R.C, PI = Math.PI, DEG = PI / 180;
  var NORMAUX = [0.3, 0.5, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

  /* ---------- Figure 1 : vue rapprochée d'une denture ---------- */
  (function () {
    var f = R.figure("fig-denture", {
      largeur: 960, hauteur: 540,
      titre: "Denture vue de près : cercles, hauteurs, pas, angle de pression",
      essai: "<strong>Essaie</strong> : affiche un élément après l'autre. " +
        "<strong>Observe</strong> : la saillie (du primitif à la tête) vaut m, le creux (du primitif au pied) vaut 1,25 m ; le pas se mesure sur le cercle primitif et vaut l'épaisseur plus l'intervalle ; la ligne d'action est inclinée de α = 20° et tangente au cercle de base."
    });
    var g = R.el("g", null, f.svg), mode = "cercles", btns = {};
    var O = [480, 760], MZ = 64, Z = 20, rp = MZ * Z / 2, ra = rp + MZ, rf = rp - 1.25 * MZ, rb = rp * Math.cos(20 * DEG);
    var b = R.boutons(f.reglages);
    [["cercles", "Cercles"], ["hauteurs", "Saillie, creux, hauteur"], ["pas", "Pas, épaisseur, intervalle"], ["alpha", "Angle de pression"], ["dent", "Parties d'une dent"]].forEach(function (p) {
      btns[p[0]] = R.bouton(b, p[1], function () { mode = p[0]; maj(); });
    });
    var info = R.h("p", null, "", f.direct);
    var TXT = {
      cercles: "Cercle de tête (sommet des dents), cercle primitif (diamètre d = mZ), cercle de pied (fond des dents), cercle de base (d'où part le profil des flancs).",
      hauteurs: "Saillie h_a = m, creux h_f = 1,25 m, hauteur h = h_a + h_f = 2,25 m. Le creux est plus grand que la saillie : il reste un jeu au fond de la dent d'en face.",
      pas: "Pas primitif p = π m, mesuré sur le cercle primitif, d'un flanc au flanc homologue de la dent suivante. p = s + e (épaisseur + intervalle).",
      alpha: "Angle de pression α (20° pour la denture normalisée) : inclinaison de la ligne d'action, le long de laquelle les dents se poussent. Elle est tangente au cercle de base.",
      dent: "Tête : partie de la dent au-dessus du cercle primitif ; pied : en dessous. Le flanc se divise en flanc de saillie et flanc de creux ; le sommet est le dessus de la dent, le fond le bas de l'intervalle."
    };
    function maj() { Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === mode); }); dessiner(); }
    function P(r, a) { return [O[0] + r * Math.cos(a), O[1] - r * Math.sin(a)]; }
    function yA(r, x) { return O[1] - Math.sqrt(r * r - (x - O[0]) * (x - O[0])); }
    function cercle(r, coul, ep, tirets) { R.el("circle", { cx: O[0], cy: O[1], r: r, fill: "none", stroke: coul, "stroke-width": ep, "stroke-dasharray": tirets }, g); }
    function cote(x, r0, r1, nom, coul) {
      var y0 = yA(r0, x), y1 = yA(r1, x);
      R.fleche(g, [x, (y0 + y1) / 2], [x, y0], { couleur: coul, epaisseur: 2.5, tete: 11 }); R.fleche(g, [x, (y0 + y1) / 2], [x, y1], { couleur: coul, epaisseur: 2.5, tete: 11 });
      R.texte(g, nom, [x + 14, (y0 + y1) / 2], { couleur: coul, gras: true, taille: 20, ancre: "start" });
    }
    function dessiner() {
      R.vider(g);
      MECA.roue(g, O, { m: MZ, Z: Z, rot: PI / 2, fill: "#eef0f5", trou: 0, toile: false, repere: false, ep: 2.5 });
      var dim = mode === "cercles" ? 1 : 0.45;
      R.el("g", null, g);
      cercle(ra, C.fonce, 2.2, "10 6"); cercle(rp, C.z, 3, "10 6"); cercle(rf, "#9aa0ad", 2.2, "10 6"); cercle(rb, C.v, 2, "3 5");
      if (mode === "cercles" || mode === "hauteurs") {
        [["cercle de tête", ra, C.fonce], ["cercle primitif", rp, C.z], ["cercle de base", rb, C.v], ["cercle de pied", rf, "#5b6172"]].forEach(function (l) {
          R.texte(g, l[0], [40, yA(l[1], 40) - 10], { italique: false, couleur: l[2], gras: true, taille: 17, ancre: "start", opacite: mode === "cercles" ? 1 : 0.6 });
        });
      }
      if (mode === "hauteurs") {
        var x = O[0] + rp * Math.cos(72 * DEG);
        cote(x, rp, ra, "ha = m", C.acc); cote(x, rf, rp, "hf = 1,25 m", C.acc);
        cote(O[0], rf, ra, "h = 2,25 m", C.z);
      }
      if (mode === "pas") {
        var a0 = PI / 2 + PI / (2 * Z), dp = 2 * PI / Z;
        R.el("path", { d: "M" + P(rp, a0) + " A" + rp + " " + rp + " 0 0 1 " + P(rp, a0 - PI / Z), fill: "none", stroke: C.y, "stroke-width": 7 }, g);
        R.el("path", { d: "M" + P(rp, a0 - PI / Z) + " A" + rp + " " + rp + " 0 0 1 " + P(rp, a0 - dp), fill: "none", stroke: C.acc, "stroke-width": 7 }, g);
        [a0, a0 - dp].forEach(function (a) { R.ligne(g, P(rp - 30, a), P(ra + 34, a), { couleur: C.fonce, epaisseur: 1.5, tirets: "4 4" }); });
        R.el("path", { d: "M" + P(ra + 28, a0) + " A" + (ra + 28) + " " + (ra + 28) + " 0 0 1 " + P(ra + 28, a0 - dp), fill: "none", stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.texte(g, "p = π m", P(ra + 54, a0 - PI / Z), { italique: false, gras: true, taille: 21 });
        R.texte(g, "s", P(rp - 26, a0 - PI / (2 * Z)), { couleur: C.y, gras: true, taille: 22 });
        R.texte(g, "e", P(rp - 26, a0 - 1.5 * PI / Z), { couleur: C.acc, gras: true, taille: 22 });
      }
      if (mode === "alpha") {
        var Pp = P(rp, PI / 2 + PI / Z), a = PI / 2 + PI / Z, t = [Math.sin(a), Math.cos(a)];
        // tangente au cercle primitif en Pp et ligne d'action inclinée de 20°
        var c20 = Math.cos(20 * DEG), s20 = Math.sin(20 * DEG), dir = [t[0] * c20 - (-Math.cos(a)) * s20 * -1, t[1] * c20 - Math.sin(a) * s20 * -1];
        var nrm = [Math.cos(a), -Math.sin(a)];
        dir = [t[0] * c20 - nrm[0] * s20, t[1] * c20 - nrm[1] * s20];
        R.ligne(g, [Pp[0] - t[0] * 260, Pp[1] - t[1] * 260], [Pp[0] + t[0] * 260, Pp[1] + t[1] * 260], { couleur: C.z, epaisseur: 2, tirets: "8 5" });
        R.ligne(g, [Pp[0] - dir[0] * 300, Pp[1] - dir[1] * 300], [Pp[0] + dir[0] * 360, Pp[1] + dir[1] * 360], { couleur: C.acc, epaisseur: 3.5 });
        R.arc(g, Pp, 90, Math.atan2(-t[1], t[0]), Math.atan2(-dir[1], dir[0]), { couleur: C.acc, epaisseur: 3 });
        R.texte(g, "α = 20°", [Pp[0] + 124, Pp[1] + 6], { couleur: C.acc, gras: true, taille: 20, ancre: "start" });
        R.texte(g, "ligne d'action", [Pp[0] + dir[0] * 330, Pp[1] + dir[1] * 330 - 18], { couleur: C.acc, italique: false, taille: 17 });
        R.texte(g, "tangente au cercle primitif", [Pp[0] - t[0] * 240, Pp[1] - t[1] * 240 - 18], { couleur: C.z, italique: false, taille: 16 });
        R.point(g, Pp, { couleur: C.fonce, r: 6 });
      }
      if (mode === "dent") {
        var ac = PI / 2, top = P(ra, ac);
        [["tête", P((rp + ra) / 2, ac + 0.012), "middle"], ["pied", P((rf + rp) / 2 + 6, ac + 0.012), "middle"]].forEach(function (l) { R.texte(g, l[0], l[1], { italique: false, gras: true, taille: 18, couleur: C.acc }); });
        R.texte(g, "sommet", [top[0], top[1] - 22], { italique: false, gras: true, taille: 17 });
        var fl = P((rp + ra) / 2, ac - PI / (2 * Z) + 0.02), fc = P((rf + rp) / 2 + 4, ac - PI / (2 * Z) - 0.012), fd = P(rf + 8, ac - PI / Z);
        R.fleche(g, [fl[0] + 120, fl[1] - 60], fl, { couleur: C.fonce, epaisseur: 2 }); R.texte(g, "flanc de saillie", [fl[0] + 124, fl[1] - 72], { italique: false, taille: 16, ancre: "start" });
        R.fleche(g, [fc[0] + 150, fc[1] + 10], fc, { couleur: C.fonce, epaisseur: 2 }); R.texte(g, "flanc de creux", [fc[0] + 154, fc[1] + 10], { italique: false, taille: 16, ancre: "start" });
        R.fleche(g, [fd[0] + 40, fd[1] + 90], fd, { couleur: C.fonce, epaisseur: 2 }); R.texte(g, "fond", [fd[0] + 44, fd[1] + 104], { italique: false, taille: 16, ancre: "start" });
      }
      info.textContent = TXT[mode];
    }
    maj();
  })();

  /* ---------- Figure 2 : roue entière, module et nombre de dents ---------- */
  (function () {
    var f = R.figure("fig-roue", {
      largeur: 960, hauteur: 500,
      titre: "Roue dentée : diamètres en fonction de m et Z",
      essai: "<strong>Essaie</strong> : change le module, puis le nombre de dents. " +
        "<strong>Observe</strong> : le dessin est remis à l'échelle à chaque réglage (barre de 10 mm). À Z fixé, changer m ne change pas la forme : toutes les dimensions sont proportionnelles au module, seule la barre d'échelle bouge. À m fixé, plus de dents donne une roue plus grande avec des dents de même taille. Le pignon gris a le même module : il peut engrener."
    });
    var g = R.el("g", null, f.svg);
    var cm = R.curseur(f.reglages, { nom: "m [mm]", min: 0, max: NORMAUX.length - 1, pas: 1, val: 6, dec: 0, surChange: dessiner });
    var cz = R.curseur(f.reglages, { nom: "Z", min: 10, max: 60, pas: 1, val: 17, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var m = NORMAUX[Math.round(cm.v)], Z = cz.v, d = m * Z, da = d + 2 * m, df = d - 2.5 * m;
      cm.input.nextSibling.textContent = R.fmt(m, m < 1 && m * 10 % 1 ? 1 : (m % 1 ? (m * 100 % 10 ? 2 : 1) : 0));
      // échelle : la roue tient dans 440 px
      // dessin à l'échelle de l'écran, recalculée à chaque réglage ; la barre donne 10 mm
      var k = Math.min(380 / (m * (Z + 2)), 840 / (m * (Z + 16))), c = [60 + m * k * (Z + 2) / 2, 240], r = MECA.roue(g, c, { m: m * k, Z: Z, fill: PLATEFORME.teinte(0.2), trou: Math.max(4, Math.min(30, m * k * Z * 0.12)) });
      [[r.ra, C.fonce, "d_a"], [r.rp, C.z, "d"], [r.rf, "#9aa0ad", "d_f"]].forEach(function (l, i) {
        R.el("circle", { cx: c[0], cy: c[1], r: l[0], fill: "none", stroke: l[1], "stroke-width": 2, "stroke-dasharray": "8 5" }, g);
      });
      // pignon témoin de 12 dents, même module
      MECA.roue(g, [c[0] + m * k * (Z + 12) / 2, c[1]], { m: m * k, Z: 12, rot: PI + PI / 12, fill: "#dfe3ea", trou: Math.max(3, m * k * 1.4) });
      R.texte(g, "même module, 12 dents", [Math.min(880, c[0] + m * k * (Z + 12) / 2), c[1] + m * k * 7 + 26], { italique: false, couleur: C.doux, taille: 15 });
      R.texte(g, "Z = " + Z, [c[0], c[1] + r.ra + 26], { italique: false, gras: true, taille: 18 });
      var L = 10 * k; R.ligne(g, [900 - L, 470], [900, 470], { couleur: C.fonce, epaisseur: 4 });
      R.texte(g, "10 mm", [900 - L / 2, 450], { italique: false, taille: 15 });
      R.rendre(zone, "d = mZ = " + R.tc(d, 2) + "\\ \\text{mm} \\quad d_a = d + 2m = " + R.tc(da, 2) + "\\ \\text{mm} \\quad d_f = d - 2{,}5\\,m = " + R.tc(df, 3) + "\\ \\text{mm} \\quad p = \\pi m = " + R.tn(PI * m, 2) + "\\ \\text{mm} \\quad h = 2{,}25\\,m = " + R.tc(2.25 * m, 3) + "\\ \\text{mm}");
    }
    dessiner();
  })();

  /* ---------- Figure 3 : taille réelle des dentures et calcul du module ---------- */
  (function () {
    var f = R.figure("fig-module", {
      largeur: 960, hauteur: 520,
      titre: "Taille réelle des dentures et choix du module",
      essai: "<strong>Essaie</strong> : règle l'effort tangentiel, le coefficient de largeur et la résistance du matériau. " +
        "<strong>Observe</strong> : la formule donne un module approché ; la denture surlignée est le module normalisé immédiatement supérieur. Un effort quatre fois plus grand ne double que le module (racine carrée)."
    });
    var g = R.el("g", null, f.svg);
    var cF = R.curseur(f.reglages, { nom: "F_t [N]", min: 100, max: 5000, pas: 50, val: 1000, surChange: dessiner });
    var ck = R.curseur(f.reglages, { nom: "k", min: 6, max: 10, pas: 0.5, val: 8, dec: 1, surChange: dessiner });
    var cR = R.curseur(f.reglages, { nom: "Rp_e [MPa]", min: 50, max: 300, pas: 10, val: 100, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    var MS = [0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4];
    function dessiner() {
      R.vider(g);
      var m = 2.34 * Math.sqrt(cF.v / (ck.v * cR.v)), mn = NORMAUX.filter(function (x) { return x >= m - 1e-9; })[0];
      R.texte(g, "taille réelle approximative (écran d'iPad)", [480, 24], { italique: false, couleur: C.doux, taille: 15 });
      MS.forEach(function (x, i) {
        var y = 62 + i * 58, on = x === mn;
        R.texte(g, "m = " + R.fmt(x, x % 1 ? (x * 100 % 10 ? 2 : 1) : 0), [130, y + 6], { italique: false, gras: on, couleur: on ? C.acc : C.fonce, taille: 17, ancre: "end" });
        MECA.cremaillere(g, 150, 920, y, { m: x * 6.3, dx: 150, fill: on ? PLATEFORME.teinte(0.35) : "#dfe3ea", epaisseur: 6 });
      });
      if (mn > 4) R.texte(g, "module normalisé : " + R.fmt(mn, 0) + " mm (hors de l'échelle)", [535, 510], { italique: false, couleur: C.acc, gras: true, taille: 17 });
      R.rendre(zone, "m = 2{,}34\\sqrt{\\frac{" + cF.v + "}{" + R.tc(ck.v, 1) + " \\times " + cR.v + "}} = " + R.tn(m, 2) + "\\ \\text{mm} \\ \\Rightarrow\\ m_{normalisé} = " + R.tc(mn, 2) + "\\ \\text{mm}");
    }
    dessiner();
  })();

  /* ---------- Figure 4 : nombre minimal de dents ---------- */
  (function () {
    var f = R.figure("fig-dents-min", {
      largeur: 960, hauteur: 460,
      titre: "Pignon et roue : nombre minimal de dents",
      essai: "<strong>Essaie</strong> : choisis le nombre de dents du pignon, puis augmente celui de la roue. " +
        "<strong>Observe</strong> : au-delà de la plage du tableau, le montage est refusé (interférence). Plus le pignon a de dents, plus la roue en face peut être grande ; à partir de 17 dents, toutes les roues conviennent."
    });
    var g = R.el("g", null, f.svg);
    var MAX = { 13: 16, 14: 26, 15: 45, 16: 101, 17: Infinity };
    var cA = R.curseur(f.reglages, { nom: "Z_A (pignon)", min: 13, max: 17, pas: 1, val: 14, surChange: dessiner });
    var cB = R.curseur(f.reglages, { nom: "Z_B (roue)", min: 13, max: 120, pas: 1, val: 40, surChange: dessiner });
    var info = R.h("p", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var ZA = cA.v, ZB = cB.v, ok = ZB <= MAX[ZA], m = Math.min(9, 860 / (ZA + ZB + 2), 360 / (ZB + 2));
      var c1 = [480 - m * (ZA + ZB + 2) / 2 + m * (ZA / 2 + 1), 220], c2 = [c1[0] + m * (ZA + ZB) / 2, 240];
      MECA.roue(g, c1, { m: m, Z: ZA, fill: ok ? "#cfe0ff" : "#fdecec", trou: Math.max(3, m * 2) });
      MECA.roue(g, c2, { m: m, Z: ZB, rot: PI + PI / ZB, fill: ok ? "#dfe3ea" : "#fdecec", trou: Math.max(4, m * 4) });
      R.texte(g, "pignon Z_A = " + ZA, [c1[0], 220 + m * ZA / 2 + 34], { italique: false, gras: true, taille: 16 });
      R.texte(g, "roue Z_B = " + ZB, [c2[0], 220 + m * (ZB / 2 + 1) + 34], { italique: false, gras: true, taille: 16 });
      info.innerHTML = ok ? "Pignon de " + ZA + " dents : roue de 13 à " + (MAX[ZA] === Infinity ? "∞" : MAX[ZA]) + " dents. Montage possible." :
        '<span class="alerte">Interférence : un pignon de ' + ZA + " dents ne peut engrener qu'avec 13 à " + MAX[ZA] + " dents.</span>";
    }
    dessiner();
  })();
})();
