/* Niveau : trains d'engrenages. R_{4/1} = Z₁Z₃/(Z₂Z₄), roue inverseuse, rendement en cascade, C_s ≃ C_m i_tot η_tot (convention i = ω_e/ω_s). */
NIVEAU({
  id: "trains-engrenages",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { Z: { 1: 15, 2: 45, 3: 12, 4: 36, 5: 14 }, inv: false, th: 0, libre: true, tourne: false, fleches: false };
    var M = 6.5, RAD = Math.PI / 180;
    function engr(rA, ZA, phi, ZB) { return phi + Math.PI + Math.PI / ZB + (phi - rA) * ZA / ZB; }
    function vers(c, d, ang) { return [c[0] + d * Math.cos(ang), c[1] - d * Math.sin(ang)]; }
    function pos() {
      var Z = n.Z, c2 = [250, 300], P = { 2: c2, 3: c2 }, phi = { 12: -45 * RAD };
      // la roue 1 est en haut à gauche : la direction de 1 vers 2 vaut -45°
      P[1] = vers(c2, M * (Z[1] + Z[2]) / 2, 135 * RAD);
      if (!n.inv) { phi[34] = -20 * RAD; P[4] = vers(c2, M * (Z[3] + Z[4]) / 2, phi[34]); }
      else {
        phi[35] = 10 * RAD; phi[54] = -35 * RAD;
        P[5] = vers(c2, M * (Z[3] + Z[5]) / 2, phi[35]);
        P[4] = vers(P[5], M * (Z[5] + Z[4]) / 2, phi[54]);
      }
      return { P: P, phi: phi };
    }
    n.pos = pos;
    function fleche(c, r, sens, coul) {
      var a0 = 60 * Math.PI / 180, a1 = 120 * Math.PI / 180, Q = function (a) { return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]; };
      var dep = sens > 0 ? a0 : a1, arr = sens > 0 ? a1 : a0, p0 = Q(dep), p1 = Q(arr);
      E.s("path", { d: "M" + p0 + " A" + r + " " + r + " 0 0 " + (sens > 0 ? 0 : 1) + " " + p1, fill: "none", stroke: coul, "stroke-width": 4.5, "stroke-linecap": "round" }, g);
      var t = sens > 0 ? [-Math.sin(arr), -Math.cos(arr)] : [Math.sin(arr), Math.cos(arr)];
      E.s("polygon", { points: [[p1[0] + t[0] * 14, p1[1] + t[1] * 14], [p1[0] - t[1] * 8, p1[1] + t[0] * 8], [p1[0] + t[1] * 8, p1[1] - t[0] * 8]].map(function (p) { return p.join(","); }).join(" "), fill: coul }, g);
    }
    n.dessin = function () {
      E.vider(g);
      var Z = n.Z, Q = pos(), P = Q.P, rot = {};
      rot[1] = n.th;
      rot[2] = engr(rot[1], Z[1], Q.phi[12], Z[2]);
      rot[3] = rot[2] * 1;
      if (!n.inv) rot[4] = engr(rot[3], Z[3], Q.phi[34], Z[4]);
      else { rot[5] = engr(rot[3], Z[3], Q.phi[35], Z[5]); rot[4] = engr(rot[5], Z[5], Q.phi[54], Z[4]); }
      var coul = { 1: "#cfe0ff", 2: "#d6f0e2", 3: "#d6f0e2", 4: PLATEFORME.teinte(0.25), 5: "#cfe0ff" };
      MECA.roue(g, P[2], { m: M, Z: Z[2], rot: rot[2], fill: coul[2], op: 0.75, trou: 0, repere: false });
      MECA.roue(g, P[1], { m: M, Z: Z[1], rot: rot[1], fill: coul[1], trou: 8 });
      MECA.roue(g, P[3], { m: M, Z: Z[3], rot: rot[3], fill: "#a8dcc0", trou: 8 });
      if (n.inv) MECA.roue(g, P[5], { m: M, Z: Z[5], rot: rot[5], fill: coul[5], trou: 7 });
      MECA.roue(g, P[4], { m: M, Z: Z[4], rot: rot[4], fill: coul[4], trou: 9 });
      // numéros, à l'extérieur des roues
      var lab = { 1: [90, 58], 2: [215, 30], 3: [100, 22], 4: [-75, 38], 5: [70, 30] };
      Object.keys(P).forEach(function (k) {
        var q = vers(P[k], M * Z[k] / 2 + M + lab[k][1], lab[k][0] * RAD);
        D.texte(g, k + " (Z = " + Z[k] + ")", q, { taille: 17, mono: true, coul: k === "4" ? C.jeu : C.encre });
      });
      if (n.fleches) {
        var s4 = n.inv ? -1 : 1;
        fleche(P[1], M * Z[1] / 2 + 20, -1, "#3b5bdb");
        fleche(P[4], M * Z[4] / 2 + 16, -s4, C.jeu);
      }
      if (n.libre) D.poignee(g, [P[1][0] + 18 * Math.cos(n.th), P[1][1] - 18 * Math.sin(n.th)], "#3b5bdb");
      var t1 = n.th / (2 * Math.PI), r41 = (Z[1] * Z[3]) / (Z[2] * Z[4]);
      fig.chip(n.tourne ? "roue 1 : " + E.fmt(Math.abs(t1), 2) + " tour    roue 4 : " + E.fmt(Math.abs(t1 * r41), 3) + " tour" : null);
    };
    var dernier = null;
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.libre) return false;
        var c = pos().P[1];
        if (Math.hypot(p[0] - c[0], p[1] - c[1]) > M * n.Z[1] / 2 + 40) return false;
        dernier = Math.atan2(c[1] - p[1], p[0] - c[0]); return true;
      },
      bouge: function (p) {
        if (!n.libre || dernier === null) return;
        var c = pos().P[1], a = Math.atan2(c[1] - p[1], p[0] - c[0]), d = a - dernier;
        if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
        dernier = a; n.th += d; n.tourne = true; n.dessin();
      },
      fin: function () { dernier = null; }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Deux étages", jouer: function (j, n) {
      j.fig.astuce("La roue 3 est fixée sur l'arbre de la roue 2. Tu peux faire tourner la roue 1.");
      j.titre("Le réducteur d'une articulation a deux étages. La roue 1 du moteur tourne à 900 tr/min. À quelle vitesse tourne la roue 4 ?");
      j.nombre({ avant: "n_4 =", apres: "\\text{tr/min}", cases: [{ attendu: 100, tol: 0.5 }], ligne: true,
        aide: function () { return "Premier étage : \\(n_2 = n_1 \\times Z_1/Z_2\\). La roue 3 tourne comme la roue 2. Second étage : \\(n_4 = n_3 \\times Z_3/Z_4\\)."; },
        ok: function () {
          j.bravo("100 tr/min : 900 × 15/45 × 12/36.");
          j.expliquer("<p>Chaque étage multiplie la vitesse par son rapport : 1/3 puis 1/3, soit 1/9 au total. Pour plusieurs étages, les rapports se multiplient :</p>\\[ i_{tot} = \\prod_{k=1}^{N} i_k \\]");
          j.suite();
        } });
    } },
    { nom: "La formule du train", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Complète le rapport du train à deux étages, comme dans le cours.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:21px">\\(R_{4/1} = \\dfrac{n_4}{n_1} = R_{4/3} \\cdot R_{2/1} =\\) <span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px"><span class="trou" data-attendu="num"></span><span style="width:110px;border-top:2.5px solid #15171f"></span><span class="trou" data-attendu="den"></span></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "den", tex: "Z_4 \\cdot Z_2" }, { id: "x1", tex: "Z_2 \\cdot Z_3" }, { id: "num", tex: "Z_3 \\cdot Z_1" }, { id: "x2", tex: "Z_4 \\cdot Z_1" }],
        aide: "Au numérateur, les roues menantes de chaque étage (1 et 3) ; au dénominateur, les menées (2 et 4).",
        ok: function () {
          j.bravo("\\(R_{4/1} = \\dfrac{Z_3 Z_1}{Z_4 Z_2} = \\dfrac{d_3 d_1}{d_4 d_2}\\).");
          j.expliquer("<p>Dans chaque étage, la roue menante est au numérateur : \\(R_{2/1} = Z_1/Z_2\\), \\(R_{4/3} = Z_3/Z_4\\). Ici, \\(R_{4/1} = \\dfrac{12 \\times 15}{36 \\times 45} = \\dfrac{1}{9}\\).</p>");
          j.suite();
        }
      });
    } },
    { nom: "L'inverseur", jouer: function (j, n) {
      n.th = 0; n.fleches = true; n.dessin();
      j.fig.astuce("Flèches : sens de rotation de la roue 1 (bleu) et de la roue 4.");
      j.titre("On intercale une roue 5 entre les roues 3 et 4. Que devient \\(R_{4/1}\\) ?");
      var bt = E.h("button", "btn clair", "Intercaler la roue 5", j.el); bt.type = "button";
      bt.addEventListener("click", function () { n.inv = !n.inv; bt.textContent = n.inv ? "Enlever la roue 5" : "Intercaler la roue 5"; n.dessin(); });
      j.choix([
        { html: "Même valeur, signe opposé : la roue 4 change de sens", juste: true },
        { html: "Il est multiplié par \\(Z_5\\)", aide: "La roue 5 est menée par 3 puis menante pour 4 : \\(Z_5\\) apparaît au numérateur et au dénominateur." },
        { html: "Rien ne change", aide: "Intercale la roue 5 et regarde la flèche de la roue 4." }
      ], { colonnes: 1, ok: function () {
        n.inv = true; n.dessin(); bt.remove();
        j.bravo("\\(R_{4/1} = -R_{4/3} \\cdot R_{2/1} = -\\dfrac{Z_3 Z_1}{Z_4 Z_2}\\).");
        j.expliquer("<p>Chaque contact extérieur inverse le sens. Avec deux contacts, la roue 4 tourne comme la roue 1 ; avec la roue 5, il y en a trois. \\(Z_5\\) se simplifie : la roue 5 change le sens, pas la valeur du rapport.</p>");
        j.suite();
      } });
    } },
    { nom: "Rendement et couple", jouer: function (j, n) {
      n.inv = false; n.dessin();
      j.fig.astuce("Exemple ajouté : rendement de 0,97 par étage.");
      j.titre("Chaque étage a un rendement de 0,97. Le moteur donne \\(C_m = 0{,}5\\) N·m. Rendement global et couple de sortie ?");
      j.texte("Dans \\(C_s \\simeq C_m\\, i_{tot}\\, \\eta_{tot}\\) (4.7), le rapport est \\(i_{tot} = \\omega_e/\\omega_s = 9\\).");
      j.nombre({ avant: "\\eta_{tot},\\ C_s :", cases: [{ attendu: 0.9409, tol: 0.0006 }, { attendu: 4.23, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "Les rendements se multiplient : \\(\\eta_{tot} = \\eta_1 \\times \\eta_2\\)." : "\\(C_s \\simeq 0{,}5 \\times 9 \\times \\eta_{tot}\\), en N·m."; },
        ok: function () {
          j.bravo("\\(\\eta_{tot} \\approx 0{,}941\\) et 4,23 N·m en sortie.");
          j.expliquer("\\[ \\eta_{tot} = \\prod_{k=1}^{N} \\eta_k \\qquad C_s \\simeq C_m\\, i_{tot}\\, \\eta_{tot} \\]<p>Dans (4.7), comme dans (1.3), le rapport est entrée sur sortie (\\(\\omega_e/\\omega_s\\), plus grand que 1 pour un réducteur) : la vitesse est divisée par 9, le couple multiplié par 9, moins les pertes.</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Un camarade écrit : « \\(C_s \\simeq C_m \\times R_{4/1} \\times \\eta_{tot} = 0{,}5 \\times \\tfrac{1}{9} \\times 0{,}94 = 0{,}052\\) N·m ». Où est l'erreur ?");
      j.choix([
        { html: "\\(R_{4/1} = n_4/n_1\\) est le rapport sortie/entrée ; la formule (4.7) attend \\(\\omega_e/\\omega_s = 9\\)", juste: true },
        { html: "Il faut ajouter le rendement, pas le multiplier", aide: "Le rendement est un nombre entre 0 et 1 qui multiplie : c'est la part de puissance qui passe." },
        { html: "Il n'y a pas d'erreur : un réducteur diminue le couple", aide: "Un réducteur diminue la vitesse. À puissance presque égale, que fait le couple ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le couple d'un réducteur augmente : 4,2 N·m, pas 0,05.");
        j.expliquer("<p>Le cours utilise deux écritures du rapport : \\(i_{12} = Z_1/Z_2\\) et \\(R_{4/1} = n_4/n_1\\) (sortie sur entrée), et \\(i = \\omega_e/\\omega_s\\) dans (1.3) et (4.7) (entrée sur sortie). Avant chaque calcul, vérifie lequel la formule attend : le couple doit augmenter quand la vitesse diminue.</p>");
        j.suite();
      } });
    } }
  ]
});
