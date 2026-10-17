/* Niveau : vitesse de rotation, couple, puissance, réducteur. ω = 2πn/60, P = Cω, i = ωe/ωs, Cs ≃ η i Ce. */
NIVEAU({
  id: "vitesse-couple-puissance",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), M = window.MECA;
    var n = { mode: "disque", nTr: 60, angle: 0, balaye: 0, couple: 0.1, i: 50, eta: 0.8, Ce: 0.32, montrer: false };
    var W = function () { return 2 * Math.PI * n.nTr / 60; };
    n.W = W;

    function disque(c, r, angle, balaye) {
      D.rond(g, c, r, { fill: "#eef0f5", stroke: C.encre, ep: 4 });
      if (balaye > 0.01) {
        var a0 = 0, a1 = Math.min(balaye, 2 * Math.PI - 0.001), p0 = [c[0] + r * 0.92, c[1]], p1 = [c[0] + r * 0.92 * Math.cos(a1), c[1] - r * 0.92 * Math.sin(a1)];
        E.s("path", { d: "M" + c + " L" + p0 + " A" + r * 0.92 + " " + r * 0.92 + " 0 " + (a1 > Math.PI ? 1 : 0) + " 0 " + p1 + " Z", fill: PLATEFORME.teinte(0.22) }, g);
        if (balaye >= 2 * Math.PI - 0.01) D.rond(g, c, r * 0.92, { fill: PLATEFORME.teinte(0.22) });
      }
      for (var k = 0; k < 12; k++) { var t = k * Math.PI / 6; D.ligne(g, [c[0] + r * 0.86 * Math.cos(t), c[1] - r * 0.86 * Math.sin(t)], [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)], "#9aa0ad", 3); }
      D.ligne(g, c, [c[0] + r * 0.9 * Math.cos(angle), c[1] - r * 0.9 * Math.sin(angle)], D.C.jeu, 8);
      D.rond(g, [c[0] + r * 0.9 * Math.cos(angle), c[1] - r * 0.9 * Math.sin(angle)], 12, { fill: D.C.jeu, stroke: C.encre, ep: 3 });
      D.rond(g, c, 14, { fill: C.encre });
    }
    function moteur(c) {
      E.s("rect", { x: c[0] - 60, y: c[1] - 50, width: 120, height: 100, rx: 14, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
      for (var k = 0; k < 5; k++) D.ligne(g, [c[0] - 44 + k * 22, c[1] - 50], [c[0] - 44 + k * 22, c[1] + 50], "#9aa0ad", 2);
    }
    function barre(x, y0, h, val, max, coul, nom) {
      E.s("rect", { x: x, y: y0 - h, width: 70, height: h, rx: 8, fill: "#f6f7fa", stroke: C.pale, "stroke-width": 2 }, g);
      var hv = Math.min(h, h * val / max);
      E.s("rect", { x: x, y: y0 - hv, width: 70, height: hv, rx: 8, fill: coul }, g);
      D.texte(g, nom, [x + 35, y0 + 24], { taille: 18 });
      D.texte(g, E.fmt(val, 1) + " W", [x + 35, y0 + 54], { taille: 20, mono: true, coul: coul });
    }

    n.dessin = function () {
      E.vider(g);
      if (n.mode === "disque") {
        D.texte(g, "n = " + n.nTr + " tr/min", [340, 60], { taille: 30, mono: true });
        disque([340, 330], 210, n.angle, n.balaye);
        if (n.balaye > 0.01 && n.montrer) D.texte(g, E.fmt(n.balaye, 2) + " rad en 1 s", [340, 575], { taille: 24, coul: D.C.jeu });
      } else if (n.mode === "puissance") {
        moteur([120, 300]);
        M.arbre(g, 180, 270, 300, 14, { axe: false });
        disque([350, 300], 110, 0.6, 0);
        D.texte(g, "n = 3000 tr/min", [300, 120], { taille: 22, mono: true });
        D.texte(g, "C = " + E.fmt(n.couple, 2) + " N·m", [300, 470], { taille: 24, mono: true, coul: C.z });
        var P = n.couple * 2 * Math.PI * 3000 / 60, y0 = 520, h = 400, max = 200;
        D.ligne(g, [545, y0 - h * 100 / max], [645, y0 - h * 100 / max], C.encre, 3, "8 6");
        D.texte(g, "100 W", [538, y0 - h * 100 / max], { taille: 17, ancre: "end" });
        barre(560, y0, h, P, max, Math.abs(P - 100) <= 1.6 ? C.ok : "#3b5bdb", "P = Cω");
      } else {
        // moteur → réducteur → sortie, avec les puissances en barres
        moteur([90, 210]);
        M.arbre(g, 150, 210, 210, 12, { axe: false });
        E.s("rect", { x: 210, y: 130, width: 150, height: 160, rx: 18, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
        M.roue(g, [250, 180], { m: 3, Z: 12, fill: "#fff", repere: false, trou: 4 });
        M.roue(g, [250 + 3 * 42 / 2, 222], { m: 3, Z: 30, rot: Math.PI / 30, fill: "#fff", repere: false, trou: 6 });
        D.texte(g, "i = " + n.i + "   η = " + E.fmt(n.eta, 1).replace(",0", ""), [285, 320], { taille: 20, mono: true });
        M.arbre(g, 360, 430, 210, 16, { axe: false });
        disque([510, 210], 80, 1.2, 0);
        D.texte(g, "ωe = 314 rad/s", [90, 100], { taille: 18, mono: true, coul: C.z });
        D.texte(g, "Ce = " + E.fmt(n.Ce, 2) + " N·m", [90, 300], { taille: 18, mono: true, coul: C.z });
        D.texte(g, n.montrer ? "ωs = " + E.fmt(314.159 / n.i, 2) + " rad/s" : "ωs = ?", [510, 100], { taille: 18, mono: true, coul: C.v });
        D.texte(g, n.montrer ? "Cs = " + E.fmt(n.eta * n.i * n.Ce, 1) + " N·m" : "Cs = ?", [510, 320], { taille: 18, mono: true, coul: C.v });
        if (n.barres) {
          var Pe = n.Ce * 2 * Math.PI * 3000 / 60, Ps = n.eta * Pe;
          E.s("rect", { x: 80, y: 400, width: Pe * 4.6, height: 40, rx: 8, fill: C.z }, g);
          D.texte(g, "P entrée " + E.fmt(Pe, 1) + " W", [90, 386], { taille: 17, ancre: "start" });
          E.s("rect", { x: 80, y: 500, width: Ps * 4.6, height: 40, rx: 8, fill: C.v }, g);
          E.s("rect", { x: 80 + Ps * 4.6, y: 500, width: (Pe - Ps) * 4.6, height: 40, rx: 8, fill: "#f6c3c4" }, g);
          D.texte(g, "P sortie " + E.fmt(Ps, 1) + " W", [90, 486], { taille: 17, ancre: "start" });
          D.texte(g, "pertes", [80 + Ps * 4.6 + (Pe - Ps) * 2.3, 560], { taille: 16, coul: C.ko });
        }
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Un tour par seconde", jouer: function (j, n) {
      j.fig.astuce("Lance la rotation : la zone colorée montre l'angle balayé.");
      j.titre("Le disque tourne à 60 tr/min. Quel angle balaie-t-il en une seconde, en radians ?");
      var bt = E.h("button", "btn clair", "Tourner pendant 1 s", j.el); bt.type = "button";
      bt.addEventListener("click", function () {
        bt.disabled = true; n.montrer = false;
        E.anime(1400, function (u) { n.angle = u * n.W(); n.balaye = n.angle; n.dessin(); }, function () { bt.disabled = false; });
      });
      j.nombre({ avant: "\\text{angle en 1 s} =", apres: "\\text{rad}", cases: [{ attendu: 2 * Math.PI, tol: 0.01 }], ligne: true,
        aide: function () { return "60 tr/min, c'est un tour par seconde. Un tour vaut \\(2\\pi\\) rad."; },
        ok: function () {
          bt.remove(); n.angle = n.balaye = 2 * Math.PI; n.montrer = true; n.dessin();
          j.bravo("Un tour : \\(2\\pi \\approx 6{,}28\\) rad en une seconde.");
          j.expliquer("<p>La vitesse angulaire \\(\\omega\\) est l'angle balayé par seconde, en rad/s. La vitesse de rotation \\(n\\) compte des tours par minute. Un tour vaut \\(2\\pi\\) rad et une minute 60 s :</p>\\[ \\omega = \\frac{2\\pi n}{60} \\]");
          j.suite();
        } });
    } },
    { nom: "Moteur rapide", jouer: function (j, n) {
      n.nTr = 3000; n.angle = 0.3; n.balaye = 0; n.montrer = false; n.dessin();
      j.fig.astuce("");
      j.titre("Un moteur d'axe tourne à 3000 tr/min. Calcule sa vitesse angulaire.");
      j.nombre({ avant: "\\omega =", apres: "\\text{rad/s}", cases: [{ attendu: 2 * Math.PI * 3000 / 60, tol: 0.1 }], ligne: true,
        aide: function () { return "\\(\\omega = 2\\pi n / 60\\) avec \\(n = 3000\\)."; },
        ok: function () {
          j.bravo("\\(\\omega = 2\\pi \\times 3000 / 60 \\approx 314{,}16\\) rad/s.");
          j.suite();
        } });
    } },
    { nom: "Viser 100 W", jouer: function (j, n) {
      n.mode = "puissance"; n.couple = 0.1; n.dessin();
      j.fig.astuce("La barre montre la puissance mécanique fournie.");
      j.titre("Toujours à 3000 tr/min : règle le couple pour que le moteur fournisse 100 W.");
      var fini = false;
      var cu = j.curseur({ nom: "C", min: 0, max: 0.6, pas: 0.01, val: 0.1, unite: " N·m", dec: 2, change: function (v) {
        if (fini) return;
        n.couple = v; n.dessin();
        if (Math.abs(v * 2 * Math.PI * 50 - 100) <= 1.6) gagne();
      } });
      function gagne() {
        if (fini) return;
        fini = true; cu.input.disabled = true;
        j.bravo("Environ 0,32 N·m : \\(P = C\\omega = 0{,}32 \\times 314{,}16 \\approx 100\\) W.");
        j.expliquer("<p>La puissance mécanique de rotation vaut</p>\\[ P = C\\,\\omega \\]<p>avec \\(P\\) en W, \\(C\\) en N·m et \\(\\omega\\) en rad/s. À vitesse donnée, la puissance est proportionnelle au couple.</p>");
        j.suite();
      }
      j.reponse(function () { cu.regler(0.32); n.couple = 0.32; n.dessin(); gagne(); });
    } },
    { nom: "Le réducteur", jouer: function (j, n) {
      n.mode = "reducteur"; n.i = 50; n.eta = 0.8; n.Ce = 0.32; n.montrer = false; n.barres = false; n.dessin();
      j.fig.astuce("i = ωe / ωs : le réducteur divise la vitesse par 50.");
      j.titre("Ce moteur entraîne un réducteur de rapport \\(i = 50\\) et de rendement \\(\\eta = 0{,}8\\). Vitesse et couple en sortie ?");
      j.nombre({ avant: "\\omega_s,\\ C_s :", cases: [{ attendu: 2 * Math.PI * 50 / 50, tol: 0.02 }, { attendu: 0.8 * 50 * 0.32, tol: 0.05 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(i = \\omega_e / \\omega_s\\), donc \\(\\omega_s = \\omega_e / i\\)." : "\\(C_s \\simeq \\eta\\, i\\, C_e\\)."; },
        ok: function () {
          n.montrer = true; n.dessin();
          j.bravo("\\(\\omega_s \\approx 6{,}28\\) rad/s et \\(C_s \\simeq 0{,}8 \\times 50 \\times 0{,}32 = 12{,}8\\) N·m.");
          j.expliquer("<p>Pour une transmission de rapport \\(i = \\omega_e / \\omega_s\\) et de rendement \\(\\eta\\) :</p>\\[ C_s \\simeq \\eta\\, i\\, C_e \\]<p>La vitesse est divisée par \\(i\\), le couple multiplié par \\(i\\), moins les pertes.</p>");
          j.suite();
        } });
    } },
    { nom: "Comparer", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("On remplace le réducteur par un réducteur de rapport 100, même rendement, même moteur. Que devient le couple de sortie ?");
      j.choix([{ html: "Il double, et la vitesse de sortie est divisée par deux", juste: true }, { html: "Il ne change pas", aide: "Regarde le rôle de \\(i\\) dans \\(C_s \\simeq \\eta\\, i\\, C_e\\)." }, { html: "Il double, et la vitesse de sortie double aussi", aide: "\\(\\omega_s = \\omega_e / i\\) : si \\(i\\) grandit, la sortie ralentit." }], { colonnes: 1, ok: function () {
        n.i = 100; n.montrer = true; n.dessin();
        j.bravo("25,6 N·m à 3,14 rad/s.");
        j.suite();
      } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.i = 50; n.barres = true; n.dessin();
      j.fig.astuce("Les barres comparent la puissance qui entre et celle qui sort.");
      j.titre("Un camarade écrit : « le réducteur multiplie le couple par 50, donc il multiplie aussi la puissance ». Où est l'erreur ?");
      j.choix([{ html: "La vitesse est divisée d'autant : la puissance de sortie vaut \\(\\eta\\) fois celle d'entrée", juste: true }, { html: "Le couple n'est pas multiplié, seulement la vitesse", aide: "Si : \\(C_s \\simeq \\eta\\, i\\, C_e\\). Regarde plutôt ce que devient la vitesse." }, { html: "Il n'y a pas d'erreur", aide: "Compare les deux barres de la figure." }], { colonnes: 1, ok: function () {
        j.bravo("\\(P_s = C_s\\,\\omega_s = \\eta\\,P_e\\) : 80 W sortent pour 100 W entrés.");
        j.expliquer("<p>Un réducteur échange de la vitesse contre du couple. Il ne crée pas de puissance : il en perd une partie, d'où \\(\\eta < 1\\).</p>");
        j.suite();
      } });
    } }
  ]
});
