(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Figure 1 : carte du chapitre 4 ---------- */
  (function () {
    var f = R.figure("fig-chapitre", {
      largeur: 960, hauteur: 220, titre: "Les quatre pages du chapitre 4",
      essai: "<strong>Essaie</strong> : touche une étape du chemin. <strong>Observe</strong> : chaque page répond à la question laissée par la précédente, du latex brut au caoutchouc prêt pour une application."
    });
    var g = R.el("g", null, f.svg), choisi = 0, zone = R.h("div", null, "", f.direct);
    var E = [
      ["Élastomère", "Qu'est-ce que c'est ?", "Un polymère à base de gomme collante, élastique après réticulation. Le caoutchouc naturel vient du latex de l'hévéa."],
      ["Tv et ambiante", "Pourquoi souple ?", "Parce que sa Tv est sous l'ambiante : à 20 °C il est sur son plateau caoutchouteux, module de l'ordre de 1 MPa."],
      ["Vulcanisation", "Ne plus couler", "En reliant les chaînes par des ponts covalents (soufre, peroxyde, oxydes métalliques)."],
      ["Formulation", "L'adapter à l'usage", "En ajoutant charges, plastifiants, accélérateurs, noir de carbone et protections : un caoutchouc pour une application."]
    ];
    function dessin() {
      R.vider(g);
      E.forEach(function (e, i) {
        var x = 30 + i * 232, sel = i === choisi;
        if (i) R.fleche(g, [x - 22, 90], [x - 4, 90], { couleur: C.gris, epaisseur: 3 });
        R.el("rect", { x: x, y: 40, width: 196, height: 100, rx: 18, fill: sel ? PLATEFORME.teinte(0.16) : "#fff", stroke: sel ? C.acc : "#c6cbd8", "stroke-width": sel ? 4 : 2.5, style: "cursor:pointer" }, g)
          .addEventListener("click", function () { choisi = i; dessin(); });
        T(g, e[0], [x + 98, 78], { gras: true, taille: 18, couleur: sel ? C.acc : C.fonce });
        T(g, e[1], [x + 98, 108], { taille: 15, couleur: C.doux });
      });
      T(g, "page " + (choisi + 1) + " sur 4 du chapitre", [480, 190], { taille: 16, couleur: C.doux });
      zone.innerHTML = "<strong>" + ["Élastomère", "Élastomère ou plastomère", "Vulcanisation", "Formulation"][choisi] + "</strong> : " + E[choisi][2];
    }
    dessin();
  })();

  /* ---------- Figure 2 : du latex brut au caoutchouc réticulé ---------- */
  (function () {
    var f = R.figure("fig-latex", {
      largeur: 960, hauteur: 460, titre: "Latex brut, chaînes libres et chaînes réticulées",
      essai: "<strong>Essaie</strong> : place le latex brut au soleil, au chaud, au froid, à l'air, puis passe à l'échelle des chaînes et réticule. <strong>Observe</strong> : le latex brut change d'état avec la température ; réticulé, le réseau tire les chaînes vers leur forme de départ."
    });
    var g = R.el("g", null, f.svg), etat = "neutre", vue = "latex", tire = 0;
    var b = R.boutons(f.reglages);
    var boutonsEtat = [["soleil", "Au soleil"], ["chaud", "Température élevée"], ["froid", "Basse température"], ["air", "Laissé à l'air"]].map(function (e) {
      return R.bouton(b, e[1], function () { etat = e[0]; vue = "latex"; dessin(); });
    });
    var b2 = R.boutons(f.reglages);
    R.bouton(b2, "Voir les chaînes", function () { vue = "chaines"; reticule = false; dessin(); });
    R.bouton(b2, "Réticuler", function () { vue = "chaines"; reticule = true; dessin(); });
    var reticule = false;
    var ct = R.curseur(f.reglages, { nom: "Étirer les chaînes", min: 0, max: 1, pas: 0.05, val: 0, surChange: function () { tire = ct.v; if (vue !== "chaines") vue = "chaines"; dessin(); } });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      boutonsEtat.forEach(function (x, i) { x.classList.toggle("actif", ["soleil", "chaud", "froid", "air"][i] === etat && vue === "latex"); });
      if (vue === "latex") {
        // godet de latex : la goutte change d'aspect selon la situation
        var coul = { neutre: "#fbfaf5", soleil: "#fbf3d0", chaud: "#fff8e6", froid: "#eef2f6", air: "#c9a46a" }[etat];
        R.el("path", { d: "M380 200 L580 200 L555 400 L405 400 Z", fill: "#8b9bb3", stroke: C.fonce, "stroke-width": 3 }, g);
        if (etat === "chaud") R.el("path", { d: "M400 205 Q480 260 560 205 L548 300 Q480 330 412 300 Z", fill: coul, stroke: C.fonce, "stroke-width": 2 }, g);
        else R.el("ellipse", { cx: 480, cy: 208, rx: 98, ry: 20, fill: coul, stroke: C.fonce, "stroke-width": 2 }, g);
        if (etat === "froid") R.el("path", { d: "M430 205 l20 8 l-10 6 l25 6", fill: "none", stroke: C.fonce, "stroke-width": 2 }, g);
        if (etat === "soleil") { R.el("circle", { cx: 760, cy: 110, r: 40, fill: "#ffd166" }, g); for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; R.ligne(g, [760 + 52 * Math.cos(a), 110 + 52 * Math.sin(a)], [760 + 72 * Math.cos(a), 110 + 72 * Math.sin(a)], { couleur: "#ffb703", epaisseur: 4 }); } }
        if (etat === "chaud") [430, 530].forEach(function (x) { R.el("path", { d: "M" + x + " 450 q-18 -26 0 -54 q18 30 0 54 Z", fill: "#ff9f6b", stroke: "#e5484d", "stroke-width": 2 }, g); });
        if (etat === "froid") T(g, "−20 °C", [760, 110], { taille: 26, couleur: C.z, gras: true });
        if (etat === "air") T(g, "quelques heures à l'air", [760, 110], { taille: 18, couleur: C.doux });
        var txt = { neutre: "latex frais, récolté par saignée", soleil: "il devient collant", chaud: "il fond", froid: "il devient cassant", air: "il brunit et se coagule" }[etat];
        T(g, txt, [480, 160], { taille: 22, gras: true, couleur: etat === "neutre" ? C.fonce : C.acc });
        zone.innerHTML = "Latex brut : " + txt + ". Ce n'est pas un matériau prêt à l'emploi.";
      } else {
        // trois chaînes de polyisoprène ; étirées, elles s'allongent ; réticulées, des ponts les relient
        for (var c = 0; c < 3; c++) {
          var pts = [];
          for (var x = 0; x <= 40; x++) {
            var u = x / 40, amp = 40 * (1 - 0.8 * tire);
            pts.push([160 + u * (520 + 120 * tire) + (reticule ? 0 : tire * 60 * (c - 1)), 140 + c * 110 + amp * Math.sin(u * 14 + c * 2)]);
          }
          R.el("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: C.fonce, "stroke-width": 3.5, "stroke-linecap": "round" }, g);
        }
        if (reticule) [[0.2, 0], [0.55, 0], [0.85, 0], [0.35, 1], [0.7, 1]].forEach(function (p) {
          var x = 160 + p[0] * (520 + 120 * tire), amp = 40 * (1 - 0.8 * tire);
          R.ligne(g, [x, 140 + p[1] * 110 + amp * Math.sin(p[0] * 14 + p[1] * 2)], [x, 140 + (p[1] + 1) * 110 + amp * Math.sin(p[0] * 14 + (p[1] + 1) * 2)], { couleur: C.acc, epaisseur: 6 });
        });
        T(g, reticule ? "chaînes reliées par des ponts : un réseau" : "chaînes libres de polyisoprène", [480, 420], { taille: 19, gras: true, couleur: reticule ? C.acc : C.fonce });
        zone.innerHTML = reticule ? "Réticulé : étiré, le réseau se déroule entre les ponts ; relâché, il reprend sa forme. Ce sont les propriétés élastiques de la définition." :
          "Sans ponts, les chaînes glissent les unes sur les autres quand on tire : la gomme reste collante et peut couler.";
      }
    }
    dessin();
  })();

  /* ---------- Figure 3 : applications ---------- */
  (function () {
    var f = R.figure("fig-applications", {
      largeur: 960, hauteur: 350, titre: "Applications du caoutchouc et du silicone",
      essai: "<strong>Essaie</strong> : touche chaque application. <strong>Observe</strong> : toutes exploitent le faible module et la grande déformation réversible des élastomères."
    });
    var g = R.el("g", null, f.svg), choisi = -1, zone = R.h("div", null, "", f.direct);
    var A = [
      ["corde de bungee", "Elle s'étire sous le sauteur puis le fait remonter : capacité de remonter de 85 %."],
      ["catapulte de porte-avions", "Le caoutchouc stocke l'énergie élastique puis la rend."],
      ["appuis de bâtiments et de ponts", "Des blocs de caoutchouc supportent la structure et absorbent ses mouvements."],
      ["coussins et amortisseurs", "Coussins de montage : ils filtrent les vibrations d'une machine."],
      ["transmission de puissance", "Accouplements flexibles et courroies : ils transmettent un couple en acceptant des défauts d'alignement."],
      ["pneus d'avions", "Ils encaissent l'impact de l'atterrissage."],
      ["pieds prothétiques en silicone", "Silicone : élastomère minéral, souple et proche de la peau."],
      ["masques et implant en silicone", "Masques de visage, tête en caoutchouc artificiel, implant en silicone (images du cours)."]
    ];
    function dessin() {
      R.vider(g);
      A.forEach(function (a, i) {
        var x = 20 + (i % 4) * 232, y = 30 + Math.floor(i / 4) * 140, sel = i === choisi, med = i >= 6;
        R.el("rect", { x: x, y: y, width: 216, height: 116, rx: 18, fill: sel ? PLATEFORME.teinte(0.16) : (med ? "#fbf7fd" : "#fff"), stroke: sel ? C.acc : "#c6cbd8", "stroke-width": sel ? 4 : 2.5, style: "cursor:pointer" }, g)
          .addEventListener("click", function () { choisi = i; dessin(); });
        var mots = a[0].split(" "), l1 = mots.slice(0, 2).join(" "), l2 = mots.slice(2).join(" ");
        T(g, l1, [x + 108, y + (l2 ? 48 : 58)], { taille: 17, gras: true, couleur: med ? C.acc : C.fonce });
        if (l2) T(g, l2, [x + 108, y + 72], { taille: 17, gras: true, couleur: med ? C.acc : C.fonce });
      });
      T(g, "industrie", [20, 330], { taille: 15, couleur: C.doux, ancre: "start" });
      T(g, "en violet : médical et prothétique", [940, 330], { taille: 15, couleur: C.acc, ancre: "end" });
      zone.innerHTML = choisi < 0 ? "Touche une application." : "<strong>" + A[choisi][0] + "</strong> : " + A[choisi][1];
    }
    dessin();
  })();
})();
