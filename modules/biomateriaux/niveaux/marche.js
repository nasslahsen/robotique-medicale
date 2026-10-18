/* Niveau : le marché des biomatériaux. Taux de croissance annuel, projection, part de l'Amérique du Nord, applications par domaine. */
NIVEAU({
  id: "marche",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var DON = [[2013, 48], [2014, 54.6], [2015, 62.07], [2016, 70.9], [2017, 88.4], ["2019p", 102.5], ["2020p", 130.57], ["2021p", 149.17]];
    var n = { taux: null, partNA: false, mode: "barres", deux: null };
    var X0 = 90, Y0 = 480, H = 380 / 160;
    function Y(v) { return Y0 - v * H; }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "deux") {
        // 2023 -> 2030 : deux barres
        D.texte(g, "Marché des biomatériaux (milliards de $)", [340, 60], { taille: 20 });
        var b = [[2023, 43.5], [2030, 69.86]];
        b.forEach(function (d, k) {
          var x = 190 + k * 220, h = d[1] * 4.6;
          E.s("rect", { x: x, y: Y0 - h, width: 110, height: h, rx: 8, fill: k ? D.C.jeu : PLATEFORME.teinte(0.45) }, g);
          D.texte(g, E.fmt(d[1], 2), [x + 55, Y0 - h - 22], { taille: 20, mono: true });
          D.texte(g, String(d[0]), [x + 55, Y0 + 28], { taille: 17, mono: true });
        });
        D.ligne(g, [140, Y0], [580, Y0], C.encre, 3);
        if (n.deux) D.fleche(g, [310, Y0 - 43.5 * 4.6 - 30], [400, Y0 - 69.86 * 4.6 + 20], "#3b5bdb", 4);
        if (n.deux) D.texte(g, "7 % par an", [330, Y0 - 300], { taille: 20, coul: "#3b5bdb" });
        return;
      }
      D.texte(g, "Évolution du marché mondial (milliards de $)", [340, 50], { taille: 20 });
      for (var v = 0; v <= 160; v += 40) { D.ligne(g, [X0 - 6, Y(v)], [640, Y(v)], v ? "#eef0f5" : C.encre, v ? 1.5 : 3); D.texte(g, String(v), [X0 - 14, Y(v)], { ancre: "end", taille: 14, mono: true, coul: C.doux }); }
      DON.forEach(function (d, k) {
        var x = X0 + 10 + k * 66, proj = typeof d[0] === "string";
        var na = n.partNA && d[0] === 2015;
        E.s("rect", { x: x, y: Y(d[1]), width: 46, height: d[1] * H, rx: 6, fill: proj ? PLATEFORME.teinte(0.35) : D.C.jeu, stroke: proj ? D.C.jeu : "none", "stroke-width": 2, "stroke-dasharray": proj ? "5 4" : null }, g);
        if (na) E.s("rect", { x: x, y: Y(22.75), width: 46, height: 22.75 * H, rx: 6, fill: "#3b5bdb" }, g);
        D.texte(g, E.fmt(d[1], d[1] % 1 ? (String(d[1]).split(".")[1].length) : 0), [x + 23, Y(d[1]) - 16], { taille: 14, mono: true });
        D.texte(g, String(d[0]), [x + 23, Y0 + 22], { taille: 14, mono: true, coul: C.doux });
      });
      if (n.partNA) D.texte(g, "en bleu : Amérique du Nord, 22,75", [110, 130], { ancre: "start", taille: 16, coul: "#3b5bdb" });
      if (n.taux !== null) {
        var p = BIO.projection(62.07, n.taux / 100, 6), xp = X0 + 10 + 7 * 66;
        D.ligne(g, [xp - 10, Y(p)], [xp + 56, Y(p)], "#3b5bdb", 5);
        D.texte(g, "projection " + E.fmt(p, 1), [xp + 20, Y(p) - 18 - (Math.abs(p - 149.17) < 8 ? 26 : 0)], { taille: 15, coul: "#3b5bdb", ancre: "end" });
        D.texte(g, "p : projection", [110, 100], { ancre: "start", taille: 15, coul: C.doux, gras: false });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Taux de croissance", jouer: function (j, n) {
      n.mode = "deux"; n.dessin();
      j.fig.astuce("Taux annuel moyen t : la valeur est multipliée par (1 + t) chaque année.");
      j.titre("Le marché passe de 43,50 milliards de dollars en 2023 à 69,86 en 2030. Quel taux de croissance annuel moyen, en % ?");
      j.nombre({ avant: "t \\approx", apres: "\\%", cases: [{ attendu: Math.round(BIO.croissanceAnnuelle(43.5, 69.86, 7) * 1000) / 10, tol: 0.3 }], ligne: true,
        aide: function () { return "Sept années : \\(69{,}86 = 43{,}50\\,(1+t)^7\\). Calcule \\((69{,}86/43{,}50)^{1/7} - 1\\)."; },
        ok: function () {
          n.deux = true; n.dessin();
          j.bravo("7 % par an : c'est le TCAC (CAGR en anglais) annoncé.");
          j.expliquer("<p>Taux de croissance annuel moyen : \\(t = (V_{fin}/V_{début})^{1/n} - 1\\). Ce n'est pas l'augmentation totale divisée par le nombre d'années : la croissance se compose d'année en année.</p>");
          j.suite();
        } });
    } },
    { nom: "Viser 2021", jouer: function (j, n) {
      n.mode = "barres"; n.taux = 10; n.dessin();
      j.fig.astuce("Le trait bleu est la valeur 2021 calculée à partir de 2015 (62,07) avec ton taux.");
      j.titre("Le cours annonce un taux de croissance annuel moyen pour 2016–2021. Retrouve-le : règle le taux pour que la projection depuis 2015 tombe sur 149,17.");
      var fait = false;
      function verifier(v) {
        n.taux = v; n.dessin();
        if (fait || Math.abs(BIO.projection(62.07, v / 100, 6) - 149.17) > 3) return;
        fait = true; c.input.disabled = true;
        j.bravo("Environ 16 % par an.");
        j.expliquer("<p>Le marché mondial des biomatériaux valait 48 milliards de dollars en 2013 et 62 en 2015, soit environ 14 % par an. De 2016 à 2021, il devait croître de 16 % par an pour dépasser 149 milliards. Ce marché qui « explose » dynamise celui de l'ingénierie tissulaire.</p>");
        j.suite();
      }
      var c = j.curseur({ nom: "taux", min: 5, max: 25, pas: 0.5, val: 10, unite: " %", dec: 1, change: verifier });
      j.reponse(function () { c.regler(16); verifier(16); });
    } },
    { nom: "Part de l'Amérique du Nord", jouer: function (j, n) {
      n.taux = null; n.partNA = true; n.dessin();
      j.fig.astuce("");
      j.titre("En 2015, l'Amérique du Nord représentait 22,75 milliards de dollars sur 62,07. Quelle part du marché mondial, en % ?");
      j.nombre({ avant: "\\text{part} \\approx", apres: "\\%", cases: [{ attendu: Math.round(22.75 / 62.07 * 100), tol: 1 }], ligne: true,
        aide: function () { return "Part = valeur de la région ÷ valeur mondiale, × 100."; },
        ok: function () {
          j.bravo("Environ 37 %, une part qui devait baisser légèrement vers 34 % en 2020.");
          j.expliquer("<p>En 2021, une autre étude donne 42 % pour l'Amérique du Nord et 58 % pour le reste du monde. Les chiffres varient selon les sources et les périmètres : ce sont des ordres de grandeur.</p>");
          j.suite();
        } });
    } },
    { nom: "Les domaines", jouer: function (j, n) {
      n.partNA = false; n.dessin();
      j.titre("Les biomatériaux avancés ouvrent de nouvelles générations de dispositifs. Associe chaque application à son domaine médical.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;font-size:17px"><span>Traitement des maladies cardiovasculaires</span><span class="trou" data-attendu="c"></span><span>Chirurgie orthopédique</span><span class="trou" data-attendu="o"></span><span>Ophtalmologie</span><span class="trou" data-attendu="y"></span><span>Autres</span><span class="trou" data-attendu="a"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "y", html: "Lentilles de contact" }, { id: "a", html: "Libération contrôlée de médicaments" }, { id: "c", html: "Valves cardiaques" }, { id: "o", html: "Tendons artificiels" }],
        aide: "Valves : le cœur. Tendons : l'appareil locomoteur. Lentilles : l'œil. Le reste va dans « autres ».",
        ok: function () {
          j.bravo("Cardiovasculaire, orthopédie, ophtalmologie, autres.");
          j.expliquer("<p>Cardiovasculaire : stimulateurs cardiaques, prothèses et endoprothèses vasculaires, cathéters, valves, stents. Orthopédie : orthèses, prothèses de hanche, tendons artificiels, comblement osseux, réparation de fracture. Ophtalmologie : implants, lentilles. Autres : biocapteurs, libération contrôlée de médicaments, pompes portables et implantables.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi ça croît", jouer: function (j, n) {
      j.titre("Selon plusieurs analystes, quels facteurs jouent un rôle important dans la croissance du marché des biomatériaux ?");
      j.choix([
        { html: "Le vieillissement de la population et l'augmentation de l'espérance de vie", juste: true },
        { html: "La baisse des dépenses de santé dans le monde", aide: "Le cours montre au contraire des dépenses de santé élevées (8 971 € par habitant aux États-Unis en 2018)." },
        { html: "La disparition des normes", aide: "Les normes restent au cœur du domaine." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Plus de personnes âgées, plus longtemps : plus de prothèses, d'implants et de dispositifs.");
        j.suite();
      } });
    } }
  ]
});
