/* Niveau : forme des macromolécules. Structures et familles, œuf cuit ou en chocolat, dégradation, exemples, zone cristalline. */
NIVEAU({
  id: "macromolecules",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "trois", T: 20, libre: true };
    // chaîne ondulée le long d'un segment
    function ondule(gr, a, b, amp, fr, ph, coul, ep) {
      var pts = [], L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
      for (var t = 0; t <= 30; t++) { var s = t / 30, o = amp * Math.sin(s * fr * Math.PI * 2 + ph); pts.push([a[0] + u[0] * s * L - u[1] * o, a[1] + u[1] * s * L + u[0] * o]); }
      E.s("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: coul || C.encre, "stroke-width": ep || 3, "stroke-linecap": "round" }, gr);
      return function (s) { var o = amp * Math.sin(s * fr * Math.PI * 2 + ph); return [a[0] + u[0] * s * L - u[1] * o, a[1] + u[1] * s * L + u[0] * o]; };
    }
    n.ondule = ondule;
    // pelote : marche lisse, ramenée doucement vers le centre (pas de rebond anguleux)
    function pelote(graine, nb, c, R, pas) {
      var r = BIO.hasard(graine), a = r() * 6.28, w = 0, x = c[0] + (r() - 0.5) * R[0], y = c[1] + (r() - 0.5) * R[1], pts = [[x, y]];
      for (var i = 0; i < nb; i++) {
        w = 0.85 * w + (r() - 0.5) * 0.5;
        var dx = (x - c[0]) / R[0], dy = (y - c[1]) / R[1];
        if (dx * dx + dy * dy > 0.6) { var vise = Math.atan2(c[1] - y, c[0] - x), d = E.angle360((vise - a) / D.DEG) * D.DEG; a += 0.25 * d; }
        a += w; x += pas * Math.cos(a); y += pas * Math.sin(a); pts.push([x, y]);
      }
      return pts;
    }
    function panneau(x, y, w, h, type) {
      E.s("rect", { x: x, y: y, width: w, height: h, rx: 18, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2 }, g);
      var lignes = [];
      for (var k = 0; k < 4; k++) lignes.push(ondule(g, [x + 14, y + 24 + k * (h - 48) / 3], [x + w - 14, y + 24 + k * (h - 48) / 3], 9, 2 + k * 0.3, k, C.encre, 3));
      if (type === "ramif") lignes.forEach(function (f, k) { [0.3, 0.7].forEach(function (s) { var p = f(s); D.ligne(g, p, [p[0] + 14, p[1] - 16], C.encre, 3); }); });
      if (type === "large" || type === "serre") {
        var pos = type === "large" ? [0.25, 0.75] : [0.12, 0.3, 0.5, 0.7, 0.88];
        for (k = 0; k < 3; k++) pos.forEach(function (s, i) { var s2 = s + (k % 2 ? 0.06 : 0); D.ligne(g, lignes[k](s2), lignes[k + 1](s2), D.C.jeu, 4); });
      }
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "trois") {
        var noms = ["A", "B", "C"];
        [["ramif", 30], ["large", 250], ["serre", 470]].forEach(function (p, i) { panneau(p[1], 150, 180, 310, p[0]); D.texte(g, noms[i], [p[1] + 90, 495], { taille: 30 }); });
        D.texte(g, "ponts entre chaînes", [300, 545], { ancre: "start", taille: 17, coul: D.C.jeu });
        D.ligne(g, [255, 545], [290, 545], D.C.jeu, 4);
      } else if (n.mode === "chauffe") {
        fig.chip("T = " + Math.round(n.T) + " °C");
        var t = Math.max(0, Math.min(1, (n.T - 20) / 160));
        // thermoplastique : se ramollit et s'affaisse ; thermodurcissable : garde sa forme puis brunit
        var hA = 180 * (1 - 0.65 * Math.max(0, (n.T - 110) / 70)), wA = 140 + 90 * Math.max(0, (n.T - 110) / 70);
        E.s("rect", { x: 170 - wA / 2, y: 430 - Math.max(60, hA), width: wA, height: Math.max(60, hA), rx: 20 + 30 * t, fill: PLATEFORME.teinte(0.45), stroke: C.jeu, "stroke-width": 3 }, g);
        var brun = n.T > 200 ? Math.min(1, (n.T - 200) / 60) : 0;
        E.s("rect", { x: 440, y: 250, width: 140, height: 180, rx: 12, fill: brun ? "rgb(" + Math.round(225 - 120 * brun) + "," + Math.round(214 - 130 * brun) + "," + Math.round(190 - 140 * brun) + ")" : "#e1d6be", stroke: C.encre, "stroke-width": 3 }, g);
        D.ligne(g, [60, 432], [620, 432], C.gris, 4);
        D.texte(g, "pièce 1", [170, 470], { taille: 20 }); D.texte(g, "pièce 2", [510, 470], { taille: 20 });
        if (brun) D.texte(g, "se dégrade", [510, 220], { taille: 17, coul: C.ko });
        else if (n.T > 130) D.texte(g, "ramollit", [170, 220], { taille: 17, coul: C.jeu });
      } else {
        fig.chip(null);
        // pelote amorphe avec une zone cristalline (chaînes repliées alignées)
        E.s("rect", { x: 60, y: 140, width: 560, height: 360, rx: 24, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2 }, g);
        for (var k = 0; k < 7; k++) E.s("path", { d: BIO.cheminLisse(pelote(100 + k, 60, [300, 320], [230, 150], 16)), fill: "none", stroke: "#9aa0ad", "stroke-width": 2.5, "stroke-linecap": "round" }, g);
        var zx = 380, zy = 220;
        E.s("rect", { x: zx - 10, y: zy - 14, width: 180, height: 150, rx: 14, fill: n.zoneOk ? PLATEFORME.teinte(0.18) : "rgba(255,255,255,0.9)" }, g);
        var d = "M" + zx + " " + zy;
        for (k = 0; k < 7; k++) { var y = zy + k * 20; d += (k ? " L" : " L") + (zx + 160) + " " + y + " Q" + (zx + 172) + " " + (y + 10) + " " + (zx + 160) + " " + (y + 20); k++; if (k < 7) { y = zy + k * 20; d += " L" + zx + " " + y + " Q" + (zx - 12) + " " + (y + 10) + " " + zx + " " + (y + 20); } }
        E.s("path", { d: d, fill: "none", stroke: D.C.jeu, "stroke-width": 3.5, "stroke-linejoin": "round" }, g);
      }
    };
    svg.addEventListener("click", function (ev) {
      if (!n.libre || !n.surZone) return;
      var p = E.point(svg, ev);
      n.surZone(p[0] > 365 && p[0] < 555 && p[1] > 200 && p[1] < 370);
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Trois structures", jouer: function (j, n) {
      j.fig.astuce("Regarde les ponts violets entre les chaînes.");
      j.titre("Associe chaque structure à sa famille de polymères.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;font-size:20px">A <span class="trou" data-attendu="tp" style="min-width:220px"></span>B <span class="trou" data-attendu="el" style="min-width:220px"></span>C <span class="trou" data-attendu="td" style="min-width:220px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "td", html: "thermodurcissable" }, { id: "tp", html: "thermoplastique" }, { id: "el", html: "élastomère" }],
        aide: "Pas de pont : chaînes libres, éventuellement ramifiées. Quelques ponts : réseau à mailles larges. Beaucoup de ponts : réseau à mailles serrées.",
        ok: function () {
          j.bravo("Linéaire, mailles larges, mailles serrées.");
          j.expliquer("<p><b>Thermoplastiques</b> : macromolécules linéaires ou ramifiées. <b>Élastomères</b> : réseau à mailles larges. <b>Thermodurcissables</b> : réseau à mailles serrées.</p>");
          j.suite();
        }
      });
    } },
    { nom: "On chauffe", jouer: function (j, n) {
      n.mode = "chauffe"; n.T = 20; n.dessin();
      j.fig.astuce("Monte la température et compare les deux pièces.");
      j.titre("Chauffe les deux pièces moulées. Laquelle est un thermoplastique, qu'on pourra remouler ?");
      j.curseur({ nom: "T", min: 20, max: 260, pas: 5, val: 20, unite: " °C", change: function (v) { n.T = v; n.dessin(); } });
      j.choix([
        { html: "La pièce 1", juste: true },
        { html: "La pièce 2", aide: "Monte jusqu'à 260 °C : la pièce 2 ne ramollit jamais, elle brunit et se dégrade." }
      ], { ok: function () {
        n.T = 170; n.dessin();
        j.bravo("La pièce 1 ramollit : on peut la remettre en forme.");
        j.expliquer("<p>Un <b>thermoplastique</b> est ramolli par chauffage et mis en forme dans un moule à l'état ramolli, comme un œuf en chocolat qu'on refond. Un <b>thermodurcissable</b>, une fois durci et moulé, ne peut plus être reformé : comme un œuf cuit, il se dégrade si on le chauffe.</p>");
        j.suite();
      } });
    } },
    { nom: "Pourquoi pas de gaz ?", jouer: function (j, n) {
      n.T = 260; n.dessin();
      j.fig.astuce("");
      j.titre("Pourquoi un thermoplastique qu'on chauffe toujours plus ne devient-il jamais gazeux ?");
      j.choix([
        { html: "Ses chaînes se dégradent avant de pouvoir s'évaporer", juste: true },
        { html: "Il devient un thermodurcissable", aide: "Chauffer ne crée pas de réseau à mailles serrées." },
        { html: "Il cristallise", aide: "Au-dessus de la fusion, il n'y a justement plus de cristaux." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Il se dégrade avant.");
        j.expliquer("<p>Les macromolécules sont trop grandes pour passer à l'état gazeux. Les thermoplastiques sont livrés en granules, en feuilles ou en poudre, puis transformés (chapitre 7).</p>");
        j.suite();
      } });
    } },
    { nom: "Ranger les polymères", jouer: function (j, n) {
      n.mode = "trois"; j.fig.chip(null); n.dessin();
      j.titre("Range chaque polymère dans sa famille.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;font-size:16px"><b>thermoplastiques</b><b>thermodurcissables</b><b>élastomères</b>' +
        '<span class="trou" data-attendu="tp"></span><span class="trou" data-attendu="td"></span><span class="trou" data-attendu="el"></span>' +
        '<span class="trou" data-attendu="tp"></span><span class="trou" data-attendu="td"></span><span></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "td", html: "époxy" }, { id: "tp", html: "PE" }, { id: "el", html: "caoutchouc naturel" }, { id: "tp", html: "PS" }, { id: "td", html: "phénolique" }],
        aide: "Seringues et tubes en PE et PS sont moulés à chaud ; époxy et phénolique durcissent une fois pour toutes ; le caoutchouc est élastique.",
        ok: function () {
          j.bravo("Bien rangé.");
          j.expliquer("<p>Thermoplastiques : PE, PC, PS (seringues, tubes). Thermodurcissables (amorphes) : polyester insaturé (UP), époxy, phénolique, moulés en semi-produits résine + catalyseur. Élastomères (amorphes) : caoutchouc naturel et synthétique.</p>");
          j.suite();
        }
      });
    } },
    { nom: "La zone cristalline", jouer: function (j, n) {
      n.mode = "pelote"; n.zoneOk = false; n.libre = true; n.dessin();
      j.titre("Ce thermoplastique est partiellement cristallin. Touche la zone cristalline.");
      n.surZone = function (ok) {
        if (!ok) { j.erreur("Une zone cristalline est ordonnée : cherche des chaînes alignées et repliées, pas une pelote."); return; }
        n.surZone = null; n.libre = false; n.zoneOk = true; n.dessin();
        j.bravo("Les chaînes y sont alignées et repliées.");
        j.expliquer("<p>Un thermoplastique peut être <b>amorphe</b> (pelote désordonnée) ou <b>partiellement cristallin</b> (semi-cristallin) : des zones ordonnées dans une phase amorphe. Thermodurcissables et élastomères sont amorphes.</p>");
        j.suite();
      };
      j.reponse(function () { n.libre = true; if (n.surZone) n.surZone(true); });
    } }
  ]
});
