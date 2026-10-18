/* Niveau : domaines d'alimentation de l'ESP32 (Section III, diapositive 11). VDD3P3_RTC, VDD3P3_CPU, VDD_SDIO, LDO. */
NIVEAU({
  id: "alimentation",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { sdio: null, actif: {}, faux: null, surTouche: null, zones: {} };
    n.dessin = function () {
      EMB.vider(g); n.zones = {};
      var a = n.actif, s = n.sdio;
      var cRail = a.rail ? C.acc : C.encre, ep = a.rail ? 4 : 2.5;
      // entrées
      EMB.texte(g, "VDD3P3_RTC", [350, 96], { taille: 17, mono: true, coul: a.rtcpin ? C.acc : C.encre });
      EMB.texte(g, "VDD3P3_CPU", [560, 96], { taille: 17, mono: true, coul: a.cpupin ? C.acc : C.encre });
      n.zones.rtcpin = [290, 76, 120, 44]; n.zones.cpupin = [500, 76, 120, 44];
      if (n.faux === "rtcpin" || n.faux === "cpupin") { var z = n.zones[n.faux]; EMB.el("rect", { x: z[0], y: z[1], width: z[2], height: z[3], rx: 8, fill: "none", stroke: C.ko, "stroke-width": 3 }, g); }
      EMB.el("line", { x1: 350, y1: 110, x2: 350, y2: 160, stroke: cRail, "stroke-width": ep }, g);
      EMB.el("line", { x1: 560, y1: 110, x2: 560, y2: 160, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("polyline", { points: "130,200 130,160 560,160", fill: "none", stroke: cRail, "stroke-width": ep }, g);
      EMB.el("circle", { cx: 350, cy: 160, r: 6, fill: cRail }, g);
      EMB.el("line", { x1: 230, y1: 160, x2: 230, y2: 200, stroke: cRail, "stroke-width": ep }, g);
      EMB.el("line", { x1: 350, y1: 160, x2: 350, y2: 205, stroke: cRail, "stroke-width": ep }, g);
      EMB.el("line", { x1: 560, y1: 160, x2: 560, y2: 205, stroke: cRail, "stroke-width": ep }, g);
      // colonne SDIO : LDO 1,8 V ou résistance 6 Ω, puis multiplexeur
      var on18 = s === "18", on33 = s === "33";
      EMB.bloc(g, 86, 205, 88, 46, "LDO", { taille: 16, actif: on18, stroke: n.faux === "ldo18" ? C.ko : null });
      EMB.texte(g, "1,8 V", [60, 228], { taille: 15, ancre: "end", mono: true });
      EMB.el("rect", { x: 216, y: 200, width: 28, height: 56, rx: 3, fill: on33 ? C.clair : "#fff", stroke: n.faux === "r6" ? C.ko : on33 ? C.acc : C.encre, "stroke-width": on33 ? 3.5 : 2.2 }, g);
      EMB.texte(g, "R = 6 Ω", [254, 186], { taille: 15, ancre: "start", mono: true });
      n.zones.ldo18 = [70, 195, 120, 66]; n.zones.r6 = [200, 192, 90, 72];
      EMB.el("line", { x1: 130, y1: 251, x2: 130, y2: 290, stroke: on18 ? C.acc : C.encre, "stroke-width": on18 ? 4 : 2.5 }, g);
      EMB.el("polyline", { points: "230,256 230,275 190,275 190,290", fill: "none", stroke: on33 ? C.acc : C.encre, "stroke-width": on33 ? 4 : 2.5 }, g);
      EMB.el("polygon", { points: "110,290 210,290 185,322 135,322", fill: s ? C.clair : "#fff", stroke: s ? C.acc : C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: 160, y1: 322, x2: 160, y2: 410, stroke: s ? C.acc : C.encre, "stroke-width": s ? 4 : 2.5 }, g);
      EMB.el("circle", { cx: 160, cy: 365, r: 5, fill: C.encre }, g);
      EMB.el("line", { x1: 40, y1: 365, x2: 160, y2: 365, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "VDD_SDIO", [86, 344], { taille: 15, mono: true, coul: a.sdiopin ? C.acc : C.encre });
      EMB.texte(g, s === "18" ? "1,8 V" : s === "33" ? "3,3 V" : "3,3 V / 1,8 V", [86, 386], { taille: 15, mono: true, coul: s ? C.acc : C.doux });
      // colonnes RTC et CPU
      EMB.bloc(g, 306, 205, 88, 46, "LDO", { taille: 16, actif: a.rtc });
      EMB.texte(g, "1,1 V", [404, 228], { taille: 15, ancre: "start", mono: true });
      EMB.bloc(g, 516, 205, 88, 46, "LDO", { taille: 16, actif: a.cpu });
      EMB.texte(g, "1,1 V", [614, 228], { taille: 15, ancre: "start", mono: true });
      EMB.el("line", { x1: 350, y1: 251, x2: 350, y2: 410, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: 560, y1: 251, x2: 560, y2: 410, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.bloc(g, 90, 410, 140, 150, "SDIO\nDomain", { taille: 18, actif: !!s });
      EMB.bloc(g, 280, 410, 140, 150, "RTC\nDomain", { taille: 18, actif: a.rtc });
      EMB.bloc(g, 490, 410, 140, 150, "CPU\nDomain", { taille: 18, actif: a.cpu });
      EMB.el("rect", { x: 20, y: 136, width: 645, height: 444, rx: 12, fill: "none", stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "8 6" }, g);
    };
    EMB.toucher(fig.svg, function () { return n.surTouche ? n.zones : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La broche commune", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Une de ces broches d'alimentation alimente aussi les régulateurs du RTC et du CPU. Touche-la.");
      n.surTouche = function (id) {
        if (id === "rtcpin") {
          n.surTouche = null; n.actif = { rtcpin: true, rail: true, rtc: true, cpu: true }; n.dessin();
          j.bravo("VDD3P3_RTC : elle alimente les LDO des trois domaines.");
          j.expliquer("<p>Les broches numériques de l'ESP32 sont réparties en trois <b>domaines d'alimentation</b> : VDD3P3_RTC, VDD3P3_CPU et VDD_SDIO. VDD3P3_RTC est aussi l'alimentation d'entrée du RTC et du CPU.</p>");
          j.suite();
        } else if (id === "cpupin") {
          n.faux = id; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800);
          j.erreur("Suis le trait qui part de chaque broche : laquelle arrive sur la ligne horizontale qui relie les trois LDO ?");
        }
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("rtcpin"); });
    } },
    { nom: "Régler VDD_SDIO", jouer: function (j, n) {
      j.titre("VDD_SDIO peut valoir 3,3 V ou 1,8 V, selon l'entrée choisie par le multiplexeur.");
      var Q = [["ldo18", "Une mémoire flash externe demande 1,8 V : touche l'entrée à choisir."], ["r6", "Une autre demande 3,3 V : touche l'entrée à choisir."]], k = 0;
      var cons = j.consigne("");
      function poser() { cons.innerHTML = Q[k][1]; }
      poser();
      n.surTouche = function (id) {
        if (k >= Q.length || (id !== "ldo18" && id !== "r6")) return;
        if (id === Q[k][0]) {
          n.sdio = id === "ldo18" ? "18" : "33"; n.dessin(); k++;
          if (k < Q.length) { j.info("Oui : VDD_SDIO = 1,8 V."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          j.bravo("1,8 V par le LDO, 3,3 V par la résistance de 6 Ω.");
          j.expliquer("<p>Pour 1,8 V, VDD_SDIO vient d'un LDO 1,8 V. Pour 3,3 V, il vient directement de VDD3P3_RTC à travers une résistance R = 6 Ω.</p>");
          j.suite();
        } else {
          n.faux = id; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800);
          j.erreur(id === "r6" ? "La résistance ne fait presque pas baisser la tension : elle donne environ 3,3 V." : "Le LDO de cette colonne sort 1,8 V.");
        }
      };
      j.reponse(function () { for (var s = 0; s < 4 && n.surTouche; s++) n.surTouche(Q[k][0]); });
    } },
    { nom: "Chute du LDO", jouer: function (j, n) {
      n.actif = { cpu: true, rail: true }; n.dessin();
      j.titre("Le LDO du CPU reçoit 3,3 V et sort 1,1 V. Quelle tension retranche-t-il ?");
      j.nombre({ avant: "3{,}3 - 1{,}1 =", apres: "\\text{ V}", cases: [{ attendu: 2.2, tol: 0.001 }], ligne: true,
        aide: function () { return "Entrée moins sortie."; },
        ok: function () {
          j.bravo("2,2 V.");
          j.expliquer("<p>Un <b>LDO</b> (<i>Low Dropout Regulator</i>) est un régulateur de tension linéaire qui fonctionne même quand l'entrée est à peine plus haute que la sortie. Le domaine RTC et le domaine CPU travaillent à 1,1 V.</p>");
          j.suite();
        } });
    } },
    { nom: "La résistance", jouer: function (j, n) {
      n.actif = {}; n.sdio = "33"; n.dessin();
      j.titre("Exemple ajouté : la mémoire SDIO tire 50 mA à travers R = 6 Ω. Quelle chute de tension, et que vaut VDD_SDIO si VDD3P3_RTC = 3,3 V ?");
      j.nombre({ avant: "U,\\ V_{SDIO} :", apres: "\\text{ V}", cases: [{ attendu: 0.3, tol: 0.001 }, { attendu: 3, tol: 0.001 }], ligne: true,
        aide: function (k) { return k === 0 ? "Loi d'Ohm : \\(U = R \\times I\\), avec \\(I = 0{,}05\\) A." : "Retire cette chute aux 3,3 V."; },
        ok: function () {
          j.bravo("0,3 V de chute : VDD_SDIO ≈ 3,0 V.");
          j.suite();
        } });
    } },
    { nom: "Domaine et tension", jouer: function (j, n) {
      n.sdio = null; n.actif = { rail: true }; n.dessin();
      j.titre("Associe chaque domaine à sa tension.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><span>SDIO Domain</span><span class="trou" data-attendu="s"></span><span>RTC Domain</span><span class="trou" data-attendu="u"></span><span>CPU Domain</span><span class="trou" data-attendu="u"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "u", html: "1,1 V" }, { id: "s", html: "3,3 V ou 1,8 V" }, { id: "u", html: "1,1 V" }, { id: "x", html: "5 V" }],
        aide: "Lis la tension écrite à côté de chaque LDO.",
        ok: function () {
          n.actif = { rail: true, rtc: true, cpu: true }; n.sdio = "18"; n.dessin();
          j.bravo("SDIO : 3,3 V ou 1,8 V. RTC et CPU : 1,1 V.");
          j.suite();
        }
      });
    } }
  ]
});
