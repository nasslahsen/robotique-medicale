/* Niveau : structure interne d'un pad (Section III, diapositive 16). IE, OE, WPU, WPD, bonding pad. */
NIVEAU({
  id: "pad",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { IE: false, OE: false, WPU: false, WPD: false, sortie: 1, bouton: null };
    // niveau du nœud du pad et valeur lue par le périphérique
    n.niveau = function () {
      if (n.OE) return n.sortie;
      if (n.bouton === true) return 0;
      if (n.WPU && n.WPD) return "?";
      if (n.WPU) return 1;
      if (n.WPD) return 0;
      return "flottant";
    };
    n.lu = function () { var v = n.niveau(); return !n.IE ? 0 : v; };
    function fil(pts, on) { EMB.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: on ? C.acc : C.encre, "stroke-width": on ? 5 : 2.5, "stroke-linejoin": "round" }, g); }
    function resistance(x, y0, y1) {
      var d = "M" + x + " " + y0, k, h = (y1 - y0) / 8;
      for (k = 1; k < 8; k++) d += " L" + (x + (k % 2 ? 12 : -12)) + " " + (y0 + k * h);
      d += " L" + x + " " + y1;
      EMB.el("path", { d: d, fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
    }
    function interrupteur(x, y, ferme) {
      EMB.el("circle", { cx: x, cy: y, r: 4, fill: C.encre }, g); EMB.el("circle", { cx: x, cy: y + 40, r: 4, fill: C.encre }, g);
      EMB.el("line", { x1: x, y1: y + 40, x2: ferme ? x : x + 22, y2: ferme ? y : y + 6, stroke: ferme ? C.acc : C.encre, "stroke-width": ferme ? 5 : 3, "stroke-linecap": "round" }, g);
    }
    n.dessin = function () {
      EMB.vider(g);
      var v = n.niveau(), y = 330;
      // VDD3P3, WPU
      EMB.texte(g, "VDD3P3", [530, 80], { taille: 17 });
      EMB.el("line", { x1: 505, y1: 98, x2: 555, y2: 98, stroke: C.encre, "stroke-width": 3 }, g);
      fil([[530, 98], [530, 110]]); resistance(530, 110, 180); fil([[530, 180], [530, 205]], n.WPU);
      interrupteur(530, 205, n.WPU); fil([[530, 245], [530, y]], n.WPU);
      EMB.texte(g, "WPU", [580, 160], { taille: 18, coul: n.WPU ? C.acc : C.encre });
      // WPD, GND
      fil([[530, y], [530, 415]], n.WPD); interrupteur(530, 415, n.WPD); fil([[530, 455], [530, 470]], n.WPD); resistance(530, 470, 540);
      fil([[530, 540], [530, 552]]);
      EMB.el("line", { x1: 505, y1: 552, x2: 555, y2: 552, stroke: C.encre, "stroke-width": 3 }, g);
      EMB.el("line", { x1: 515, y1: 560, x2: 545, y2: 560, stroke: C.encre, "stroke-width": 3 }, g);
      EMB.texte(g, "GND", [530, 582], { taille: 16 });
      EMB.texte(g, "WPD", [580, 505], { taille: 18, coul: n.WPD ? C.acc : C.encre });
      // nœud et bonding pad
      fil([[400, y], [600, y]], v === 1);
      EMB.el("circle", { cx: 400, cy: y, r: 5, fill: C.encre }, g); EMB.el("circle", { cx: 530, cy: y, r: 5, fill: C.encre }, g);
      EMB.bloc(g, 600, y - 34, 74, 68, "Bonding\npad", { taille: 14 });
      // IE et porte ET vers le périphérique
      EMB.texte(g, "IE = " + (n.IE ? 1 : 0), [420, 80], { taille: 17, coul: n.IE ? C.acc : C.encre });
      fil([[400, 98], [400, 170], [300, 170]], n.IE);
      fil([[400, y], [400, 220], [300, 220]], v === 1);
      EMB.el("path", { d: "M260 150 L300 150 L300 240 L260 240 A45 45 0 0 1 260 150 Z", fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      var lu = n.lu();
      EMB.fleche(g, [218, 195], [40, 195], { coul: lu === 1 ? C.acc : C.encre, ep: lu === 1 ? 5 : 2.5 });
      EMB.texte(g, "vers un\npériphérique", [100, 240], { taille: 15, coul: C.doux, gras: false });
      EMB.texte(g, "lu : " + (typeof lu === "number" ? lu : lu === "?" ? "?" : "au hasard"), [110, 160], { taille: 18, coul: lu === 1 ? C.acc : C.encre });
      // OE et tampon depuis le périphérique
      EMB.texte(g, "OE = " + (n.OE ? 1 : 0), [270, 385], { taille: 17, coul: n.OE ? C.acc : C.encre });
      fil([[270, 400], [270, 438]], n.OE);
      EMB.el("polygon", { points: "230,425 230,505 300,465", fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.texte(g, "Buf", [252, 465], { taille: 15, halo: false });
      fil([[40, 465], [230, 465]], n.sortie === 1);
      EMB.texte(g, "depuis un périphérique : " + n.sortie, [130, 500], { taille: 15, coul: C.doux, gras: false });
      fil([[300, 465], [400, 465], [400, y]], n.OE && n.sortie === 1);
      if (!n.OE) EMB.el("line", { x1: 330, y1: 450, x2: 360, y2: 480, stroke: C.ko, "stroke-width": 4 }, g);
      // bouton extérieur vers la masse
      if (n.bouton !== null) {
        fil([[674, y], [674, 395]]);
        interrupteur(650, 395, n.bouton);
        EMB.el("line", { x1: 650, y1: 395, x2: 674, y2: 395, stroke: C.encre, "stroke-width": 2.5 }, g);
        fil([[650, 435], [650, 470]]);
        EMB.el("line", { x1: 632, y1: 470, x2: 668, y2: 470, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.texte(g, "bouton", [628, 412], { taille: 14, ancre: "end", coul: C.doux });
      }
      // niveau de la broche
      var t = v === 1 ? "1" : v === 0 ? "0" : v === "?" ? "conflit" : "flottante";
      EMB.el("rect", { x: 420, y: y - 78, width: 96, height: 40, rx: 10, fill: v === 1 || v === 0 ? C.clair : "#fdecec", stroke: v === 1 || v === 0 ? C.acc : C.ko, "stroke-width": 2 }, g);
      EMB.texte(g, t, [468, y - 58], { taille: v === 1 || v === 0 ? 22 : 15, mono: true, halo: false, coul: v === 1 || v === 0 ? C.encre : C.ko });
    };
    // commandes IE, OE, WPU, WPD dans la carte de l'étape
    n.commandes = function (j, change) {
      var z = j.zone("", ""); z.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;margin:8px 0";
      ["IE", "OE", "WPU", "WPD"].forEach(function (k) {
        var b = E.h("button", "btn clair", "", z); b.type = "button"; b.style.minWidth = "100px";
        function maj() { b.textContent = k + " : " + (n[k] ? 1 : 0); b.style.borderColor = n[k] ? EMB.C.acc : ""; }
        b.addEventListener("click", function () { if (!n.libre) return; n[k] = !n[k]; maj(); n.dessin(); if (change) change(); });
        maj(); b.maj = maj;
      });
      n.majCommandes = function () { [].forEach.call(z.children, function (b) { if (b.maj) b.maj(); }); };
      return z;
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Un 1 stable", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Rien n'est branché sur la broche. Le périphérique doit lire un 1 stable. Règle le pad.");
      n.libre = true;
      n.commandes(j);
      var bV = E.h("button", "btn bleu", "Vérifier", j.el); bV.type = "button";
      function verifier() {
        if (!n.libre) return;
        if (n.OE) { j.erreur("Avec OE à 1, c'est le périphérique qui impose le niveau. Ici on veut lire, pas écrire."); return; }
        if (!n.IE) { j.erreur("Le niveau n'arrive pas au périphérique : regarde la porte ET, son autre entrée est IE."); return; }
        if (n.WPD || !n.WPU) { j.erreur("La broche n'est pas tirée vers 1. Quelle résistance la relie à VDD3P3 ?"); return; }
        n.libre = false; bV.remove();
        j.bravo("IE = 1, OE = 0, WPU = 1, WPD = 0 : la broche est tirée à 1 et lue.");
        j.expliquer("<p><b>IE</b> (<i>input enable</i>) laisse passer le niveau de la broche vers le périphérique. <b>WPU</b> (<i>weak pull-up</i>) relie la broche à VDD3P3 par une résistance interne faible : sans rien d'autre, la broche est à 1.</p>");
        j.suite();
      }
      bV.addEventListener("click", verifier);
      j.reponse(function () { n.IE = true; n.OE = false; n.WPU = true; n.WPD = false; n.majCommandes(); n.dessin(); verifier(); });
    } },
    { nom: "Le bouton", jouer: function (j, n) {
      n.IE = true; n.OE = false; n.WPU = true; n.WPD = false; n.bouton = false; n.dessin();
      j.titre("On ajoute un bouton entre la broche et la masse. Prédis : bouton appuyé, que lit le périphérique ?");
      j.choix([{ html: "0", juste: true }, { html: "1", aide: "Appuyé, le bouton relie directement la broche à la masse. Le pull-up est faible." }, { html: "Un niveau au hasard", aide: "La broche n'est pas flottante : elle est reliée soit à VDD3P3 par la résistance, soit à la masse par le bouton." }], { ok: function () {
        n.bouton = true; n.dessin();
        j.bravo("0 : le bouton l'emporte sur le tirage faible.");
        j.expliquer("<p>Le pull-up est dit <i>weak</i> (faible) : c'est une résistance de forte valeur. Un contact franc vers la masse impose 0 ; relâché, la résistance ramène la broche à 1. C'est le montage classique d'un bouton.</p>");
        j.suite();
      } });
    } },
    { nom: "IE éteint", jouer: function (j, n) {
      n.bouton = false; n.IE = false; n.dessin();
      j.titre("Même montage, bouton relâché, mais IE = 0. Que lit le périphérique ?");
      j.choix([{ html: "0, quel que soit le niveau de la broche", juste: true }, { html: "1, comme avant", aide: "Regarde la porte ET : sa sortie n'est à 1 que si ses deux entrées sont à 1." }, { html: "La broche se met à flotter", aide: "IE ne touche pas aux résistances : la broche reste tirée à 1. C'est la lecture qui change." }], { colonnes: 1, ok: function () {
        j.bravo("La porte ET bloque la lecture : sortie 0.");
        j.suite();
      } });
    } },
    { nom: "Écrire", jouer: function (j, n) {
      n.bouton = null; n.IE = false; n.WPU = false; n.sortie = 0; n.dessin();
      j.titre("La broche doit maintenant allumer une LED : le périphérique envoie un 1. Règle le pad.");
      n.libre = true;
      n.commandes(j);
      var bS = E.h("button", "btn clair", "Le périphérique envoie 1", j.el); bS.type = "button";
      bS.addEventListener("click", function () { if (!n.libre) return; n.sortie = 1; bS.disabled = true; n.dessin(); });
      var bV = E.h("button", "btn bleu", "Vérifier", j.el); bV.type = "button"; bV.style.marginLeft = "10px";
      function verifier() {
        if (!n.libre) return;
        if (n.sortie !== 1) { j.erreur("Le périphérique envoie encore 0 : touche « Le périphérique envoie 1 »."); return; }
        if (!n.OE) { j.erreur("Le tampon Buf est coupé (croix rouge). Quel signal l'active ?"); return; }
        if (n.WPU && n.WPD) { j.erreur("Les deux tirages en même temps n'ont pas de sens : coupe-les."); return; }
        n.libre = false; bV.remove(); bS.remove();
        j.bravo("OE = 1 : le tampon impose le niveau du périphérique sur la broche.");
        j.expliquer("<p><b>OE</b> (<i>output enable</i>) active le tampon Buf : le signal qui vient d'un périphérique arrive sur la broche et l'impose. Les tirages faibles ne servent qu'en entrée.</p>");
        j.suite();
      }
      bV.addEventListener("click", verifier);
      j.reponse(function () { n.sortie = 1; n.OE = true; n.WPU = false; n.WPD = false; n.majCommandes(); n.dessin(); verifier(); });
    } },
    { nom: "Les mots du pad", jouer: function (j, n) {
      n.libre = false;
      j.titre("Place chaque nom sur sa définition.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center;font-size:16px">' +
        '<span class="trou" data-attendu="ie"></span><span>autorise la lecture de la broche</span>' +
        '<span class="trou" data-attendu="oe"></span><span>autorise l\'écriture sur la broche</span>' +
        '<span class="trou" data-attendu="wpd"></span><span>résistance interne faible vers GND</span>' +
        '<span class="trou" data-attendu="bp"></span><span>point qui relie la puce à la broche du boîtier</span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "bp", html: "Bonding pad" }, { id: "wpd", html: "WPD" }, { id: "wpu", html: "WPU" }, { id: "oe", html: "OE" }, { id: "ie", html: "IE" }],
        aide: "I pour input, O pour output, U pour up, D pour down.",
        ok: function () {
          j.bravo("IE, OE, WPD, bonding pad.");
          j.expliquer("<p>Le <b>bonding pad</b> est un point terminal de la logique de la puce, qui sert à faire la liaison physique entre la puce (<i>chip die</i>) et la broche GPIO du boîtier.</p>");
          j.suite();
        }
      });
    } }
  ]
});
