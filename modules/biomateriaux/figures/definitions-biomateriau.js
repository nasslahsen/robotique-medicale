(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Carte du chapitre ---------- */
  (function () {
    var f = R.figure("fig-carte", {
      largeur: 960, hauteur: 300, titre: "Carte du chapitre 1",
      essai: "<strong>Essaie</strong> : touche une étape de la carte. <strong>Observe</strong> : chaque notion s'appuie sur la précédente, du mot « biomatériau » jusqu'au marché."
    });
    var ETAPES = [
      ["definitions-biomateriau", "Définitions", "Du dictionnaire à la définition actuelle : un matériau qui remplace tout ou partie d'un organe déficient, sans réponse hostile de l'hôte."],
      ["generations", "Générations", "Quatre générations : non contrôlés, matériaux choisis, surfaces modifiées et biodégradables, puis ingénierie tissulaire et nanomédecine."],
      ["dispositif-medical", "Dispositif médical", "Le biomatériau est intégré dans un DM. Un DM n'agit ni par voie pharmacologique, ni immunologique, ni par métabolisme."],
      ["classes-risque", "Classes de risque", "I, IIa, IIb, III selon le caractère invasif, la durée du contact et la partie du corps. Plus de risque, plus de tests."],
      ["vocabulaire", "Vocabulaire", "Implant, prothèse, organe artificiel (hybride), bioprothèse, greffe (auto, allo, xéno)."],
      ["ingenierie-tissulaire", "Ingénierie tissulaire", "Échafaudage biodégradable + cellules vivantes + facteurs bioactifs ; médecine régénérative."],
      ["nanomedecine", "Nanomédecine", "Objets de 1 à 100 nm pour prévenir, diagnostiquer et traiter."],
      ["marche", "Marché", "Un marché en forte croissance, tiré par le vieillissement de la population."]
    ];
    var g = R.el("g", null, f.svg), choisi = 0;
    function dessin() {
      R.vider(g);
      for (var i = 1; i < ETAPES.length; i++) R.ligne(g, [70 + (i - 1) * 117, (i - 1) % 2 ? 190 : 110], [70 + i * 117, i % 2 ? 190 : 110], { couleur: "#d9dde6", epaisseur: 5 });
      ETAPES.forEach(function (e, k) {
        var x = 70 + k * 117, y = k % 2 ? 190 : 110, act = k === choisi;
        var grp = R.el("g", { style: "cursor:pointer" }, g);
        R.el("circle", { cx: x, cy: y, r: 30, fill: act ? C.acc : "#fff", stroke: act ? C.acc : "#9aa0a6", "stroke-width": 3 }, grp);
        R.texte(grp, String(k + 1), [x, y + 1], { italique: false, gras: true, couleur: act ? "#fff" : C.fonce, taille: 20, halo: false });
        R.texte(grp, e[1], [x, k % 2 ? y + 52 : y - 50], { italique: false, gras: act, couleur: C.fonce, taille: 15 });
        grp.addEventListener("click", function () { choisi = k; dessin(); });
      });
      f.direct.innerHTML = "<p><strong>" + ETAPES[choisi][1] + "</strong> : " + ETAPES[choisi][2] + ' <a href="' + ETAPES[choisi][0] + '.html">Ouvrir la page</a></p>';
    }
    dessin();
  })();

  /* ---------- Prothèse : biomatériau, mécanisme, fonction ---------- */
  (function () {
    var f = R.figure("fig-prothese", {
      largeur: 960, hauteur: 520, titre: "Prothèse totale de hanche",
      essai: "<strong>Essaie</strong> : touche chacun des quatre boutons. <strong>Observe</strong> : le matériau, ce qui bouge et ce qui est remplacé sont trois choses différentes ; l'interface avec l'os et les tissus est l'endroit où se joue la biocompatibilité."
    });
    var g = R.el("g", null, f.svg), sel = "materiau";
    var TXT = {
      materiau: "<strong>Biomatériaux</strong> : la tige est en alliage métallique, la tête et la cupule peuvent être en céramique ou en polymère. Le choix dépend de la fonction, du design, de la mise en forme et de la biocompatibilité.",
      mecanisme: "<strong>Mécanisme</strong> : la tête sphérique tourne dans la cupule, comme une rotule. C'est la partie biomécanique de la prothèse.",
      fonction: "<strong>Fonction</strong> : remplacer l'articulation de la hanche pour que le patient remarche. La prothèse remplace un organe ou une partie d'organe.",
      interface: "<strong>Interface hôte / biomatériau</strong> : là où le matériau touche l'os, le sang et les tissus. On y étudie la réponse de l'organisme et la dégradation en service : vieillissement, dissolution, oxydation, corrosion, usure, érosion."
    };
    var b = R.boutons(f.reglages), btn = {};
    [["materiau", "Biomatériau"], ["mecanisme", "Mécanisme"], ["fonction", "Fonction"], ["interface", "Interface hôte / biomatériau"]].forEach(function (x) {
      btn[x[0]] = R.bouton(b, x[1], function () { sel = x[0]; dessin(); });
    });
    g.setAttribute("transform", "translate(60,0)");
    function dessin() {
      R.vider(g);
      Object.keys(btn).forEach(function (k) { btn[k].classList.toggle("actif", k === sel); });
      var os = "#f3ead8", bord = "#b9a77f", hl = function (k) { return sel === k; };
      // jambe (fonction) : silhouette pâle à droite
      if (hl("fonction")) {
        // une personne qui marche : la fonction retrouvée
        var cx = 740;
        R.el("circle", { cx: cx, cy: 120, r: 30, fill: PLATEFORME.teinte(0.25), stroke: C.acc, "stroke-width": 5 }, g);
        R.el("path", { d: "M" + cx + " 155 L" + cx + " 300 M" + cx + " 190 L" + (cx - 50) + " 260 M" + cx + " 190 L" + (cx + 50) + " 245 M" + cx + " 300 L" + (cx - 45) + " 430 M" + cx + " 300 L" + (cx + 55) + " 420", stroke: C.acc, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }, g);
        R.el("circle", { cx: cx, cy: 300, r: 12, fill: C.acc }, g);
        R.texte(g, "le patient remarche", [cx, 475], { italique: false, couleur: C.acc, taille: 18, gras: true });
        R.ligne(g, [430, 236], [cx - 14, 300], { couleur: C.acc, tirets: "6 5", epaisseur: 2 });
      }
      R.el("path", { d: "M150 60 Q330 30 470 90 Q520 160 490 240 Q420 270 380 230 Q320 180 220 210 Q140 190 150 60 Z", fill: os, stroke: bord, "stroke-width": 3 }, g);
      R.texte(g, "bassin", [240, 120], { italique: false, couleur: "#8a7650", taille: 17 });
      R.el("path", { d: "M380 320 Q410 270 470 285 L510 315 Q490 360 500 500 L410 500 Q420 400 380 320 Z", fill: os, stroke: bord, "stroke-width": 3 }, g);
      R.texte(g, "fémur", [540, 450], { italique: false, couleur: "#8a7650", taille: 17, ancre: "start" });
      var cMat = hl("materiau") ? C.acc : "#b8c0cc";
      R.el("path", { d: "M340 222 A70 70 0 0 1 476 222 Z", fill: hl("materiau") ? PLATEFORME.teinte(0.5) : "#d9dde6", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.el("circle", { cx: 408, cy: 236, r: 45, fill: hl("mecanisme") ? PLATEFORME.teinte(0.55) : hl("materiau") ? PLATEFORME.teinte(0.3) : "#f7f2e6", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("path", { d: "M416 262 L450 276 Q470 350 462 480 L440 480 Q438 350 416 262 Z", fill: cMat, stroke: C.fonce, "stroke-width": 2.5 }, g);
      if (hl("mecanisme")) {
        R.arc(g, [408, 236], 70, 0.3, 2.6, { couleur: C.acc, epaisseur: 4 });
        R.fleche(g, [408 + 70 * Math.cos(2.4), 236 - 70 * Math.sin(2.4)], [408 + 70 * Math.cos(2.6), 236 - 70 * Math.sin(2.6)], { couleur: C.acc, epaisseur: 4 });
        R.texte(g, "rotation de la tête dans la cupule", [408, 130], { italique: false, couleur: C.acc, taille: 18, gras: true });
      }
      if (hl("materiau")) {
        R.texte(g, "tige en alliage", [480, 400], { italique: false, couleur: C.fonce, taille: 17, ancre: "start", gras: true });
        R.texte(g, "tête et cupule", [240, 290], { italique: false, couleur: C.fonce, taille: 17, ancre: "end", gras: true });
        R.ligne(g, [245, 290], [368, 250], { couleur: C.fonce });
      }
      if (hl("interface")) {
        R.el("path", { d: "M340 222 A70 70 0 0 1 476 222", fill: "none", stroke: C.acc, "stroke-width": 10, opacity: 0.6 }, g);
        R.el("path", { d: "M440 480 Q438 350 416 262 M462 480 Q470 350 450 276", fill: "none", stroke: C.acc, "stroke-width": 10, opacity: 0.6 }, g);
        R.texte(g, "contact avec l'os et les tissus", [600, 250], { italique: false, couleur: C.acc, taille: 18, gras: true, ancre: "start" });
      }
      f.direct.innerHTML = "<p>" + TXT[sel] + "</p>";
    }
    dessin();
  })();

  /* ---------- Frise des définitions ---------- */
  (function () {
    var f = R.figure("fig-definitions", {
      largeur: 960, hauteur: 300, titre: "Frise des définitions d'un biomatériau",
      essai: "<strong>Essaie</strong> : touche chaque carte de la frise. <strong>Observe</strong> : la définition s'élargit, d'un matériau synthétique et inerte à tout matériau, même vivant, qui remplace une fonction sans réponse hostile."
    });
    var CARTES = [
      ["vers 1970", "Le mot naît", "Symposium de l'université de Clemson (États-Unis) et conférence de Chester (Europe)."],
      ["1975", "SFB", "Society for Biomaterials (États-Unis). Le comité de Clemson : « une substance systématiquement et pharmacologiquement inerte conçue pour être implantée ou incorporée dans des systèmes vivants »."],
      ["1976", "ESB", "European Society for Biomaterials. Consensus de Chester, Pr D. Williams : « un matériau non viable utilisé dans un dispositif médical, destiné à interagir avec des systèmes biologiques »."],
      ["1979", "IUS-BSE", "Union internationale des sociétés de sciences et d'ingénierie des biomatériaux : le domaine devient mondial."],
      ["ensuite", "Intermédiaire", "« Tout matériau, naturel ou non, incluant tout ou partie d'une structure vivante ou d'un dispositif biomédical qui exécute ou remplace une fonction corporelle. » Un greffon peut en être un."],
      ["aujourd'hui", "Actuelle", "« matériau destiné à alimenter ou à remplacer tout ou partie d'un organe déficient », au contact du vivant sans défense inacceptable ni réponse hostile de l'hôte."]
    ];
    var g = R.el("g", null, f.svg), choisi = 5;
    function dessin() {
      R.vider(g);
      R.fleche(g, [40, 200], [930, 200], { couleur: C.fonce, epaisseur: 4 });
      CARTES.forEach(function (c, k) {
        var x = 110 + k * 150, act = k === choisi, grp = R.el("g", { style: "cursor:pointer" }, g);
        R.el("circle", { cx: x, cy: 200, r: 9, fill: act ? C.acc : "#fff", stroke: C.fonce, "stroke-width": 2.5 }, grp);
        R.el("rect", { x: x - 66, y: 70, width: 132, height: 86, rx: 16, fill: act ? PLATEFORME.teinte(0.18) : "#fff", stroke: act ? C.acc : "#c6cbd8", "stroke-width": 2.5 }, grp);
        R.texte(grp, c[1], [x, 112], { italique: false, gras: true, taille: 18, halo: false });
        R.texte(grp, c[0], [x, 236], { italique: false, couleur: C.doux, taille: 16 });
        R.ligne(grp, [x, 156], [x, 191], { couleur: act ? C.acc : "#c6cbd8", epaisseur: 2.5 });
        grp.addEventListener("click", function () { choisi = k; dessin(); });
      });
      f.direct.innerHTML = "<p><strong>" + CARTES[choisi][1] + " (" + CARTES[choisi][0] + ")</strong> : " + CARTES[choisi][2] + "</p>";
    }
    dessin();
  })();
})();
