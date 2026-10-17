/* Niveau : qu'est-ce qu'un biomatériau ? Naissance du mot, définitions du dictionnaire et des experts, définition actuelle, prothèse = matériau + mécanisme + fonction. */
NIVEAU({
  id: "definitions-biomateriau",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "frise", dates: [null, null, null], parties: {}, zone: null };
    // frise des années 1970 : SFB (1975), ESB (1976), IUS-BSE (1979)
    function frise() {
      D.texte(g, "Naissance du mot « biomatériau »", [340, 70], { taille: 24 });
      D.texte(g, "début des années 1970 : symposium de Clemson (États-Unis), conférence de Chester (Europe)", [340, 108], { taille: 15, coul: C.doux, gras: false });
      var x0 = 80, x1 = 600, y = 300;
      D.fleche(g, [x0 - 20, y], [x1 + 40, y], C.encre, 4);
      function X(a) { return x0 + (a - 1970) / 10 * (x1 - x0); }
      for (var a = 1970; a <= 1980; a++) D.ligne(g, [X(a), y - 8], [X(a), y + 8], C.gris, 2);
      [1970, 1975, 1980].forEach(function (a) { D.texte(g, String(a), [X(a), y + 34], { taille: 16, coul: C.doux, mono: true }); });
      var noms = ["SFB", "ESB", "IUS-BSE"], cles = [1975, 1976, 1979], hauts = [170, 230, 170];
      cles.forEach(function (a, k) {
        var x = X(a), ok = n.dates[k];
        D.ligne(g, [x, y], [x, hauts[k] + 26], ok ? C.jeu : C.pale, 3, ok ? null : "5 5");
        D.rond(g, [x, y], 9, { fill: ok ? C.jeu : "#fff", stroke: C.encre, ep: 2.5 });
        E.s("rect", { x: x - 62, y: hauts[k] - 26, width: 124, height: 52, rx: 14, fill: ok ? PLATEFORME.teinte(0.16) : "#fff", stroke: ok ? C.jeu : "#c6cbd8", "stroke-width": 2.5, "stroke-dasharray": ok ? null : "6 5" }, g);
        D.texte(g, ok ? noms[k] : "?", [x, hauts[k]], { taille: 20, coul: ok ? C.encre : C.gris });
        if (ok && a !== 1975) D.texte(g, String(a), [x, y + (a === 1976 ? 62 : 34)], { taille: 16, mono: true, coul: C.jeu });
      });
      D.texte(g, "SFB : Society for Biomaterials", [80, 400], { ancre: "start", taille: 16, gras: false });
      D.texte(g, "ESB : European Society for Biomaterials", [80, 430], { ancre: "start", taille: 16, gras: false });
      D.texte(g, "IUS-BSE : union internationale des sociétés de biomatériaux", [80, 460], { ancre: "start", taille: 16, gras: false });
    }
    // une hanche : os du bassin, fémur, prothèse (tige, tête, cupule) et tissus autour
    function hanche() {
      var pz = n.parties;
      E.s("path", { d: "M90 70 Q250 40 380 90 Q430 150 400 230 Q340 260 300 220 Q250 170 160 200 Q90 180 90 70 Z", fill: "#f3ead8", stroke: "#b9a77f", "stroke-width": 3 }, g);
      D.texte(g, "bassin", [170, 120], { taille: 16, coul: "#8a7650" });
      // fémur
      E.s("path", { d: "M300 300 Q330 260 380 270 L420 300 Q400 340 410 560 L330 560 Q340 380 300 300 Z", fill: "#f3ead8", stroke: "#b9a77f", "stroke-width": 3 }, g);
      D.texte(g, "fémur", [440, 470], { taille: 16, coul: "#8a7650", ancre: "start" });
      // cupule et tête
      E.s("path", { d: "M262 214 A62 62 0 0 1 382 214 Z", fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.rond(g, [322, 226], 40, { fill: "#f7f2e6", stroke: C.encre, ep: 3 });
      // tige
      E.s("path", { d: "M330 250 L360 262 Q378 330 372 500 L352 500 Q350 340 330 250 Z", fill: "#b8c0cc", stroke: C.encre, "stroke-width": 2.5 }, g);
      var lab = [["mat", "biomatériau", [372, 420], [520, 400]], ["meca", "mécanisme", [322, 226], [520, 200]], ["fonc", "fonction", [300, 320], [130, 330]]];
      lab.forEach(function (l) {
        var ok = pz[l[0]];
        D.ligne(g, l[2], l[3], ok ? C.jeu : C.gris, 2, ok ? null : "5 4");
        D.rond(g, l[2], 7, { fill: ok ? C.jeu : C.gris });
        D.texte(g, ok || "?", l[3], { taille: 18, coul: ok ? C.encre : C.gris, ancre: l[3][0] > 340 ? "start" : "end" });
      });
      if (n.zone) {
        E.s("path", { d: "M262 214 A62 62 0 0 1 382 214", fill: "none", stroke: C.jeu, "stroke-width": 9, opacity: 0.6 }, g);
        E.s("path", { d: "M352 500 Q350 340 330 250 M372 500 Q378 330 360 262", fill: "none", stroke: C.jeu, "stroke-width": 9, opacity: 0.6 }, g);
        D.texte(g, "interface hôte / biomatériau", [520, 560], { taille: 17, coul: C.jeu });
      }
    }
    n.dessin = function () { E.vider(g); if (n.mode === "frise") frise(); else hanche(); };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Naissance du mot", jouer: function (j, n) {
      j.fig.astuce("Le mot apparaît au début des années 1970. Trois sociétés savantes suivent.");
      j.titre("Place les trois sociétés de biomatériaux dans l'ordre de leur création.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;font-size:19px"><b>1975</b><span class="trou" data-attendu="sfb"></span><b>1976</b><span class="trou" data-attendu="esb"></span><b>1979</b><span class="trou" data-attendu="ius"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "ius", html: "IUS-BSE (union internationale)" }, { id: "sfb", html: "Society for Biomaterials (États-Unis)" }, { id: "esb", html: "European Society for Biomaterials" }],
        aide: "Clemson est aux États-Unis, Chester en Europe : la société américaine naît un an avant l'européenne. L'union qui les regroupe vient en dernier.",
        ok: function () {
          n.dates = [1, 1, 1]; n.dessin();
          j.bravo("SFB en 1975, ESB en 1976, IUS-BSE en 1979.");
          j.expliquer("<p>Le mot naît vers 1970, après le symposium de l'université de Clemson (États-Unis) et la conférence de Chester (Europe). L'union internationale de 1979 montre que la science des biomatériaux a vite pris une dimension mondiale.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Qui inclut le greffon ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un chirurgien prélève un morceau d'os sur la hanche du patient pour combler un trou dans sa mâchoire. Quelle définition compte ce greffon comme un biomatériau ?");
      j.choix([
        { html: "Collins : « tout matériau synthétique utilisé dans les prothèses ou le remplacement de tissus naturels »", aide: "Relis le mot « synthétique » : un os prélevé sur le patient n'est pas synthétique." },
        { html: "Clemson : « une substance systématiquement et pharmacologiquement inerte conçue pour être implantée »", aide: "« Conçue » et « inerte » : un tissu vivant prélevé n'a été ni conçu ni rendu inerte." },
        { html: "Définition intermédiaire : « tout matériau, naturel ou non, incluant tout ou partie d'une structure vivante... »", juste: true }
      ], { colonnes: 1, ok: function () {
        j.bravo("« Naturel ou non, incluant tout ou partie d'une structure vivante ».");
        j.expliquer("<p>La définition intermédiaire ouvre le domaine : un biomatériau est <b>tout matériau, naturel ou non, incluant tout ou partie d'une structure vivante ou d'un dispositif biomédical, qui exécute ou remplace une fonction corporelle</b>. Un greffon (autogreffe, allogreffe, même xénogreffe) peut donc en être un.</p>");
        j.suite();
      } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Une camarade résume : « Un biomatériau doit être totalement inerte : le corps ne doit avoir aucune réaction. » Qu'est-ce qui ne va pas ?");
      j.choix([
        { html: "Rien, c'est la définition actuelle", aide: "La définition actuelle parle d'une défense « inacceptable » : une réaction acceptable reste possible." },
        { html: "La définition actuelle demande d'exister au contact du vivant sans degré de défense inacceptable ni réponse hostile, pas l'absence de toute réaction", juste: true },
        { html: "Un biomatériau doit au contraire provoquer une forte réponse du corps", aide: "Aucune définition ne demande une forte réponse. Cherche le mot qui fixe une limite à la réaction." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Une réaction est tolérée tant qu'elle reste acceptable.");
        j.expliquer("<p>Définition actuelle : un biomatériau est un <b>matériau destiné à alimenter ou à remplacer tout ou partie d'un organe déficient</b>. Elle intègre l'environnement biologique (fluides, protéines, cellules, tissus) : le matériau doit pouvoir exister au contact du vivant sans degré de défense inacceptable ni réponse hostile de l'hôte. C'est l'idée de <b>biocompatibilité</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Une prothèse, trois parties", jouer: function (j, n) {
      n.mode = "hanche"; n.dessin();
      j.fig.astuce("Prothèse totale de hanche : cupule, tête, tige dans le fémur.");
      j.titre("Le module découpe une prothèse en trois. Mets chaque mot sur la bonne partie.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;font-size:17px"><span>La tige en alliage, en contact avec l\'os</span><span class="trou" data-attendu="mat"></span><span>La tête qui tourne dans la cupule</span><span class="trou" data-attendu="meca"></span><span>Marcher : remplacer l\'articulation</span><span class="trou" data-attendu="fonc"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "meca", html: "mécanisme" }, { id: "fonc", html: "fonction" }, { id: "mat", html: "biomatériau" }],
        aide: "Le matériau, c'est ce dont la pièce est faite ; le mécanisme, ce qui bouge ; la fonction, ce que la prothèse remplace.",
        ok: function () {
          n.parties = { mat: "biomatériau", meca: "mécanisme", fonc: "fonction" }; n.zone = true; n.dessin();
          j.bravo("Prothèse = biomatériaux + mécanisme + fonction qui remplace un organe ou une partie d'organe.");
          j.expliquer("<p>Le sous-module étudie la première partie : les <b>biomatériaux</b>. Le surligné montre l'<b>interface hôte / biomatériau</b> : c'est là que se joue la biocompatibilité, et là que le matériau subit la dégradation en service (vieillissement, dissolution, oxydation, corrosion, usure, érosion).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Vendre la prothèse", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("La prothèse est prête. Pour la vendre en Europe, puis aux États-Unis, quelles approbations faut-il ?");
      j.choix([
        { html: "Europe : FDA ; États-Unis : marquage CE", aide: "Les lettres CE renvoient à l'Europe ; la FDA est une agence américaine." },
        { html: "Europe : marquage CE ; États-Unis : FDA", juste: true },
        { html: "Aucune : un biomatériau n'est pas réglementé", aide: "Le cours insiste sur les normes et la certification pour le marché de destination." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Marquage CE pour l'Europe, FDA pour le marché américain.");
        j.expliquer("<p>Concevoir un dispositif médical, c'est choisir le matériau selon sa fonction, son design, sa mise en forme et sa biocompatibilité, puis suivre les étapes d'approbation du marché de destination. La classe de risque du dispositif fixe le niveau d'exigence.</p>");
        j.suite();
      } });
    } }
  ]
});
