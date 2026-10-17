/* Niveau : géométrie d'une denture. Cercles, saillie, creux, hauteur, d = mZ, pas p = πm, module normalisé, nombre minimal de dents. */
NIVEAU({
  id: "denture",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "zoom", trouves: {}, faux: null, cotes: false, surTouche: null, pas: false };
    // vue rapprochée : roue Z = 20, module 60 px, centre sous le cadre
    var O = [340, 790], MZ = 60, Z = 20, rp = MZ * Z / 2, ra = rp + MZ, rf = rp - 1.25 * MZ, rb = rp * Math.cos(20 * Math.PI / 180);
    n.R = { tete: ra, primitif: rp, pied: rf }; n.O = O;
    var COUL = { tete: C.encre, primitif: "#3b5bdb", pied: "#9aa0ad", base: C.v };
    var NOM = { tete: "cercle de tête", primitif: "cercle primitif", pied: "cercle de pied", base: "cercle de base" };
    function cercle(r, coul, ep, tirets) { E.s("circle", { cx: O[0], cy: O[1], r: r, fill: "none", stroke: coul, "stroke-width": ep, "stroke-dasharray": tirets }, g); }
    function cote(x, r0, r1, nom, coul) {
      // cote radiale verticale à l'abscisse x, entre les rayons r0 et r1
      var y0 = O[1] - Math.sqrt(r0 * r0 - (x - O[0]) * (x - O[0])), y1 = O[1] - Math.sqrt(r1 * r1 - (x - O[0]) * (x - O[0]));
      D.fleche(g, [x, (y0 + y1) / 2], [x, y0], coul, 2.5); D.fleche(g, [x, (y0 + y1) / 2], [x, y1], coul, 2.5);
      D.texte(g, nom, [x + 12, (y0 + y1) / 2], { coul: coul, taille: 19, ancre: "start" });
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "zoom") {
        MECA.roue(g, O, { m: MZ, Z: Z, rot: Math.PI / 2, fill: "#eef0f5", trou: 0, toile: false, repere: false, ep: 2.5 });
        cercle(ra, COUL.tete, 2.5, "10 6"); cercle(rp, COUL.primitif, 3, "10 6"); cercle(rf, COUL.pied, 2.5, "10 6"); cercle(rb, COUL.base, 2, "3 5");
        ["tete", "primitif", "pied"].forEach(function (k) {
          if (n.trouves[k]) D.texte(g, NOM[k], [24, O[1] - Math.sqrt(n.R[k] * n.R[k] - 316 * 316) - 14], { coul: COUL[k], taille: 17, ancre: "start" });
        });
        if (n.trouves.tete && n.trouves.primitif && n.trouves.pied) D.texte(g, NOM.base, [24, O[1] - Math.sqrt(rb * rb - 316 * 316) - 12], { coul: COUL.base, taille: 15, ancre: "start", gras: false });
        if (n.faux) cercle(n.R[n.faux], C.ko, 6);
        if (n.cotes) {
          // cotes sur l'axe de deux dents : h sur la dent du milieu, h_a et h_f sur la dent de droite
          var x = O[0] + rp * Math.cos(72 * Math.PI / 180);
          cote(x, rp, ra, "ha", C.jeu); cote(x, rf, rp, "hf", C.jeu);
          cote(O[0], rf, ra, "h", "#3b5bdb");
        }
        if (n.pas) {
          // pas primitif : arc entre deux flancs homologues, épaisseur s et intervalle e
          var a0 = Math.PI / 2 - Math.PI / (2 * Z), a1 = a0 - 2 * Math.PI / Z, am = a0 - Math.PI / Z;
          var P = function (r, a) { return [O[0] + r * Math.cos(a), O[1] - r * Math.sin(a)]; };
          E.s("path", { d: "M" + P(rp + 2, a0 + 2 * Math.PI / Z) + " A" + rp + " " + rp + " 0 0 1 " + P(rp + 2, a0), fill: "none", stroke: "#12a26b", "stroke-width": 6 }, g);
          E.s("path", { d: "M" + P(rp + 2, a0) + " A" + rp + " " + rp + " 0 0 1 " + P(rp + 2, a1), fill: "none", stroke: C.jeu, "stroke-width": 6 }, g);
          D.texte(g, "p = pas primitif", P(rp + 120, am - 0.02), { coul: C.jeu, taille: 20 });
          D.texte(g, "s", P(rp - 28, a0 + Math.PI / (2 * Z)), { coul: "#12a26b", taille: 20 });
          D.texte(g, "e", P(rp - 28, a0 - Math.PI / (2 * Z)), { coul: C.doux, taille: 20 });
        }
      } else if (n.mode === "entier") {
        var c = [280, 290], m = 18;
        var r = MECA.roue(g, c, { m: m, Z: 17, fill: "#eef0f5", trou: 22 });
        [["d_a", r.ra, C.encre, -0.5], ["d", r.rp, "#3b5bdb", 0], ["d_f", r.rf, "#9aa0ad", 0.5]].forEach(function (l) {
          E.s("circle", { cx: c[0], cy: c[1], r: l[1], fill: "none", stroke: l[2], "stroke-width": 2.5, "stroke-dasharray": "9 5" }, g);
          var y = c[1] + l[3] * 60;
          D.ligne(g, [c[0] + Math.sqrt(l[1] * l[1] - (y - c[1]) * (y - c[1])), y], [560, y], l[2], 1.5, "3 4");
          D.texte(g, l[0], [575, y], { coul: l[2], taille: 22, ancre: "start" });
        });
        D.texte(g, "m = 2 mm   Z = 17", [300, 520], { taille: 22, mono: true });
      } else if (n.mode === "tailles") {
        // taille réelle des dentures : crémaillères de module croissant, 10 px pour 1 mm
        [0.8, 1, 1.25, 1.5, 2, 2.5, 3].forEach(function (m, i) {
          var y = 90 + i * 70;
          D.texte(g, "m = " + E.fmt(m, m % 1 ? (m * 100 % 10 ? 2 : 1) : 0), [130, y + 12], { taille: 18, mono: true, ancre: "end" });
          MECA.cremaillere(g, 150, 620, y, { m: m * 10, dx: 150, fill: i === n.choixM ? PLATEFORME.teinte(0.3) : "#dfe3ea", epaisseur: 6 });
        });
      } else if (n.mode === "tableau") {
        var ZA = [13, 14, 15, 16, 17], ZB = ["13 à 16", "13 à 26", "13 à 45", "13 à 101", "13 à ∞"];
        D.texte(g, "Nombre minimal de dents", [340, 130], { taille: 22 });
        E.s("rect", { x: 40, y: 170, width: 600, height: 150, rx: 14, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        D.ligne(g, [40, 245], [640, 245], C.pale, 2); D.ligne(g, [130, 170], [130, 320], C.pale, 2);
        D.texte(g, "Z_A", [85, 207], { taille: 20 }); D.texte(g, "Z_B", [85, 283], { taille: 20 });
        ZA.forEach(function (z, i) {
          var x = 130 + 102 * i + 51, ch = n.colonne === i;
          if (ch) E.s("rect", { x: x - 49, y: 172, width: 98, height: 146, fill: "#e3f7ee" }, g);
          D.texte(g, String(z), [x, 207], { taille: 20, mono: true }); D.texte(g, ZB[i], [x, 283], { taille: 17, mono: true });
        });
        D.texte(g, "Z_A : pignon     Z_B : roue avec laquelle il peut engrener", [340, 360], { taille: 16, coul: C.doux, gras: false });
        MECA.roue(g, [250, 480], { m: 4, Z: 14, fill: PLATEFORME.teinte(0.22), trou: 8 });
        MECA.roue(g, [250 + 4 * 54 / 2, 480], { m: 4, Z: 40, rot: Math.PI / 40 + Math.PI, fill: "#dfe3ea", trou: 10 });
        D.texte(g, "Z_A = ?", [250, 548], { taille: 17, mono: true });
        D.texte(g, "Z_B = 40", [358, 580], { taille: 17, mono: true });
      }
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche) return false;
        var d = Math.hypot(p[0] - O[0], p[1] - O[1]), best = null, dm = 26;
        Object.keys(n.R).forEach(function (k) { var e = Math.abs(d - n.R[k]); if (e < dm) { dm = e; best = k; } });
        if (best) n.surTouche(best);
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les cercles", jouer: function (j, n) {
      j.fig.astuce("Touche les cercles en tirets.");
      var ordre = [["primitif", "le <b>cercle primitif</b> : celui sur lequel on mesure le diamètre primitif d (en bleu)"], ["tete", "le <b>cercle de tête</b> : il passe par le sommet des dents"], ["pied", "le <b>cercle de pied</b> : il passe par le fond des dents"]];
      var k = 0, cons;
      j.titre("Tu dois commander une roue dentée de rechange : il faut savoir la décrire. Commence par ses cercles.");
      cons = j.consigne("");
      function poser() { cons.innerHTML = "Touche " + ordre[k][1] + "."; }
      poser();
      n.surTouche = function (id) {
        if (id === ordre[k][0]) {
          n.trouves[id] = true; n.faux = null; n.dessin(); k++;
          if (k < ordre.length) { j.info("Oui."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          j.bravo("Tête, primitif, pied.");
          j.expliquer("<p>La géométrie des engrenages est décrite par un ensemble de paramètres : cercle primitif, cercle de base (en violet, d'où part le profil en développante de cercle), angle de pression \\(\\alpha\\), cercle de tête, cercle de pied, saillie, creux, hauteur, pas primitif, module.</p>");
          j.suite();
        } else {
          n.faux = id; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800);
          j.erreur(id === "tete" ? "Ce cercle passe par le sommet des dents." : id === "pied" ? "Ce cercle passe par le fond des dents." : "C'est le cercle bleu, entre les deux.");
        }
      };
      j.reponse(function () { for (var s = 0; s < 4 && n.surTouche; s++) n.surTouche(ordre[k][0]); });
      j.nettoyer(function () { n.surTouche = null; });
    } },
    { nom: "Saillie et creux", jouer: function (j, n) {
      n.cotes = true; n.dessin();
      j.fig.astuce("Les cotes sont mesurées entre les cercles.");
      j.titre("Écris la saillie, le creux et la hauteur de dent en fonction du module m.");
      var z = j.zone("", [["saillie \\(h_a\\) =", "1"], ["creux \\(h_f\\) =", "125"], ["hauteur \\(h\\) =", "225"]].map(function (l) { return '<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><span style="width:150px">' + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:120px"></span></div>'; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "225", tex: "2{,}25\\,m" }, { id: "05", tex: "0{,}5\\,m" }, { id: "1", tex: "m" }, { id: "pi", tex: "\\pi m" }, { id: "125", tex: "1{,}25\\,m" }],
        aide: "Le creux est un peu plus grand que la saillie, pour laisser un jeu au fond ; la hauteur est leur somme.",
        ok: function () {
          j.bravo("\\(h_a = m\\), \\(h_f = 1{,}25\\,m\\), \\(h = 2{,}25\\,m\\).");
          j.expliquer("\\[ h_a = m \\qquad h_f = 1{,}25\\,m \\qquad h = h_a + h_f = 2{,}25\\,m \\]<p>La saillie va du cercle primitif au cercle de tête, le creux du cercle primitif au cercle de pied.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Diamètres", jouer: function (j, n) {
      n.mode = "entier"; n.dessin();
      j.fig.astuce("Roue de l'exemple du cours.");
      j.titre("Roue de module 2 mm et 17 dents. Diamètre primitif, de tête et de pied ?");
      j.nombre({ avant: "d,\\ d_a,\\ d_f :", apres: "\\text{mm}", cases: [{ attendu: 34, tol: 0.01 }, { attendu: 38, tol: 0.01 }, { attendu: 29, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(d = mZ\\)." : k === 1 ? "Ajoute deux saillies : \\(d_a = d + 2m\\)." : "Enlève deux creux : \\(d_f = d - 2 \\times 1{,}25\\,m\\)."; },
        ok: function () {
          j.bravo("34, 38 et 29 mm.");
          j.expliquer("\\[ d = mZ \\qquad d_a = d + 2m \\qquad d_f = d - 2{,}5\\,m \\]");
          j.suite();
        } });
    } },
    { nom: "Le pas", jouer: function (j, n) {
      n.mode = "zoom"; n.cotes = false; n.pas = true; n.dessin();
      j.fig.astuce("p : du flanc d'une dent au flanc homologue de la suivante, sur le cercle primitif.");
      j.titre("Le module est le quotient du pas par π. Quel est le pas d'une denture de module 1,5 mm ?");
      j.nombre({ avant: "p =", apres: "\\text{mm}", cases: [{ attendu: 4.712, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(m = p/\\pi\\), donc \\(p = \\pi m\\)."; },
        ok: function () {
          j.bravo("4,71 mm.");
          j.expliquer("\\[ p = \\pi\\, m = s + e \\]<p>Le pas est la somme de l'épaisseur \\(s\\) d'une dent et de l'intervalle \\(e\\), mesurés sur le cercle primitif. Exprimer les dimensions avec le module évite de traîner π partout : \\(d = mZ\\) au lieu de \\(d = pZ/\\pi\\).</p>");
          j.suite();
        } });
    } },
    { nom: "Module normalisé", jouer: function (j, n) {
      n.mode = "tailles"; n.choixM = null; n.dessin();
      j.fig.astuce("Taille réelle des dentures pour quelques modules normalisés.");
      j.titre("\\(F_t = 1000\\) N, \\(k = 8\\), \\(Rp_e = 100\\) MPa. Quel module donne la formule ?");
      j.nombre({ avant: "m = 2{,}34\\sqrt{\\dfrac{F_t}{k \\cdot Rp_e}} =", apres: "\\text{mm}", cases: [{ attendu: 2.62, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(F_t / (k \\cdot Rp_e) = 1000 / 800\\), puis la racine, puis × 2,34."; },
        ok: function () {
          j.consigne("Quel module normalisé choisir ?");
          j.choix([{ html: "2,5", aide: "2,5 mm est plus petit que le module calculé : les dents seraient trop faibles." }, { html: "3", juste: true }, { html: "2,62", aide: "On ne fabrique que les modules normalisés : regarde la série du cours." }], { ok: function () {
            n.choixM = 6; n.dessin();
            j.bravo("m = 3 : le module normalisé juste au-dessus.");
            j.expliquer("<p>La formule donne le module en première approximation ; on retient le module normalisé immédiatement supérieur. Série principale : 0,3 ; 0,5 ; 0,8 ; 1 ; 1,25 ; 1,5 ; 2 ; 2,5 ; 3 ; 4 ; 5 ; 6 ; 8 ; 10. \\(k\\) est le coefficient de largeur de denture, choisi entre 6 et 10.</p>");
            j.suite();
          } });
        } });
    } },
    { nom: "Nombre minimal de dents", jouer: function (j, n) {
      n.mode = "tableau"; n.colonne = null; n.dessin();
      j.fig.astuce("Tableau du cours : pour éviter l'interférence entre les dents.");
      j.titre("Une roue a 40 dents. Combien de dents faut-il au minimum au pignon qui l'entraîne ?");
      j.nombre({ avant: "Z_A \\ge", cases: [{ attendu: 15, tol: 0 }], ligne: true,
        aide: function () { return "Cherche la première colonne dont la plage \\(Z_B\\) contient 40."; },
        ok: function () {
          n.colonne = 2; n.dessin();
          j.bravo("15 dents : la colonne 13 à 45 contient 40 ; celle de 14 dents s'arrête à 26.");
          j.expliquer("<p>Avec trop peu de dents, le sommet des dents de la roue vient creuser le pied du pignon : c'est l'<b>interférence</b>. Un pignon de 17 dents peut engrener avec n'importe quelle roue.</p>");
          j.suite();
        } });
    } }
  ]
});
