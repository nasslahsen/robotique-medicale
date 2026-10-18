/* Niveau : architecture d'une salle d'opération (diapo 19), dimensions et surfaces (diapo 20), hauteur et volume (diapo 21). */
NIVEAU({
  id: "salle-dimensions",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "table", L: 7.0, l: 6.0, plenum: 0.2, libre: true, pl: { P: function (v) { return v; } } };
    // vue de dessus : table au centre, puis ce qui l'entoure
    n.dessinSalle = function (etat) {
      var cx = 340, cy = 320;
      var murs = etat.murs;
      A.s("rect", { x: cx - murs[0] / 2, y: cy - murs[1] / 2, width: murs[0], height: murs[1], fill: "#fff", stroke: C.encre, "stroke-width": 6 }, g);
      if (etat.couches.circulation) A.s("rect", { x: cx - 230, y: cy - 200, width: 460, height: 400, rx: 30, fill: "none", stroke: C.acc, "stroke-width": 3, "stroke-dasharray": "10 8" }, g);
      if (etat.couches.equipe) [[cx - 70, cy - 95], [cx + 70, cy - 95], [cx - 70, cy + 95], [cx + 70, cy + 95], [cx - 150, cy]].forEach(function (q) { A.icone(g, "personne", q, 40, C.personnel); });
      if (etat.couches.equipements) {
        A.boite(g, cx + 150, cy - 160, 70, 90, { fond: C.vPale, bord: C.v, rx: 8, ep: 2, titre: "Anesth.", taille: 13 });
        A.boite(g, cx - 220, cy + 110, 80, 70, { fond: C.vPale, bord: C.v, rx: 8, ep: 2, titre: "Colonne", taille: 13 });
        A.boite(g, cx + 140, cy + 120, 90, 60, { fond: C.vPale, bord: C.v, rx: 8, ep: 2, titre: "Bistouri", taille: 13 });
      }
      if (etat.couches.maintenance) A.s("rect", { x: cx + 145, y: cy - 175, width: 80, height: 260, fill: "none", stroke: C.gris, "stroke-width": 2.5, "stroke-dasharray": "4 5" }, g);
      if (etat.couches.securite) { A.s("rect", { x: cx - 30, y: cy + murs[1] / 2 - 3, width: 90, height: 6, fill: C.ok }, g); A.texte(g, "issue dégagée", [cx + 15, cy + murs[1] / 2 + 20], { taille: 14, coul: C.ok }); }
      // table et patient
      A.s("rect", { x: cx - 30, y: cy - 90, width: 60, height: 180, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
      A.s("circle", { cx: cx, cy: cy - 68, r: 14, fill: "#f6c2b0" }, g);
      A.s("rect", { x: cx - 18, y: cy - 50, width: 36, height: 120, rx: 14, fill: "#f6c2b0" }, g);
    };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "table" || n.mode === "formule") {
        var c = n.couches || {};
        var grand = n.mode === "formule" && n.formuleOk;
        n.dessinSalle({ murs: grand ? [520, 460] : [170, 260], couches: grand ? { equipe: 1, equipements: 1, circulation: 1, maintenance: 1, securite: 1 } : c });
        A.texte(g, grand ? "Salle dimensionnée sur l'ensemble" : "Salle calculée sur la table seule", [340, 46], { taille: 18, coul: grand ? C.ok : C.ko, gras: 800 });
      } else if (n.mode === "hybride") {
        // plan coté de la salle hybride : 1 m = 52 px
        var u = 52, w = n.L * u, h = n.l * u, x0 = 340 - w / 2, y0 = 300 - h / 2;
        var okS = n.L * n.l >= 55.74 - 1e-9, okD = Math.min(n.L, n.l) >= 6.10 - 1e-9;
        A.s("rect", { x: x0, y: y0, width: w, height: h, fill: okS && okD ? C.okPale : "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.s("rect", { x: 340 - 30, y: 300 - 90, width: 60, height: 180, rx: 8, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2 }, g);
        // arceau d'angiographie
        A.s("path", { d: "M" + (340 - 70) + " " + (300 - 30) + " A70 70 0 0 1 " + (340 + 70) + " " + (300 - 30), fill: "none", stroke: C.v, "stroke-width": 10, "stroke-linecap": "round" }, g);
        A.texte(g, String(n.L.toFixed(2)).replace(".", ",") + " m", [340, y0 - 22], { taille: 17, mono: true, coul: n.L >= 6.1 ? C.encre : C.ko });
        A.texte(g, String(n.l.toFixed(2)).replace(".", ",") + " m", [x0 - 14, 300], { taille: 17, mono: true, ancre: "end", coul: n.l >= 6.1 ? C.encre : C.ko });
        var S = n.L * n.l;
        fig.chip("S = " + S.toFixed(2).replace(".", ",") + " m²");
      } else if (n.mode === "coupe") {
        // coupe verticale : salle visible + espace technique entre le plafond et la dalle du dessus
        var sol = 560, plafond = 380, haut = plafond - 30 - n.plenum * 800;
        A.s("rect", { x: 40, y: haut, width: 600, height: plafond - haut, fill: C.fond }, g);
        A.s("rect", { x: 40, y: plafond, width: 600, height: sol - plafond, fill: "#fff" }, g);
        A.texte(g, "Salle visible", [110, 540], { taille: 16, coul: C.doux });
        // table, scialytique et bras plafonnier
        A.s("rect", { x: 270, y: 500, width: 140, height: 14, fill: C.doux }, g); A.s("rect", { x: 330, y: 514, width: 20, height: 44, fill: C.doux }, g);
        A.s("line", { x1: 340, y1: plafond, x2: 340, y2: 430, stroke: C.encre, "stroke-width": 6 }, g);
        A.s("path", { d: "M300 450 A40 22 0 0 1 380 450 Z", fill: "#ffe9a8", stroke: C.encre, "stroke-width": 2.5 }, g);
        A.s("line", { x1: 340, y1: 430, x2: 340, y2: 450, stroke: C.encre, "stroke-width": 4 }, g);
        A.s("line", { x1: 520, y1: plafond, x2: 520, y2: 420, stroke: C.encre, "stroke-width": 6 }, g); A.s("rect", { x: 500, y: 420, width: 40, height: 64, rx: 6, fill: C.vPale, stroke: C.v, "stroke-width": 2.5 }, g);
        // réseaux à loger au-dessus du plafond (hauteurs relatives)
        var R = [["Gaine de ventilation", 120, C.acc, 50, 210], ["Chemins de câbles", 40, C.ko, 270, 120], ["Réseaux médicaux", 40, C.ok, 400, 110], ["Supports des bras", 64, C.encre, 520, 110]];
        var okTout = true;
        R.forEach(function (r) {
          var hh = r[1], y = plafond - 4 - hh, tient = y >= haut + 4;
          if (!tient) okTout = false;
          A.s("rect", { x: r[3], y: y, width: r[4], height: hh, rx: 6, fill: tient ? "#fff" : C.koPale, stroke: tient ? r[2] : C.ko, "stroke-width": 3 }, g);
          A.texte(g, r[0], [r[3] + r[4] / 2, y + hh / 2], { taille: 13, coul: tient ? C.encre : C.ko, largeur: r[4] - 10, halo: false });
        });
        // dalle de l'étage au-dessus et faux plafond
        A.s("rect", { x: 30, y: haut - 26, width: 620, height: 26, fill: "#9aa0ad", opacity: 0.85 }, g);
        A.texte(g, "Dalle de l'étage au-dessus", [340, haut - 13], { taille: 14, coul: "#fff", halo: false });
        A.s("line", { x1: 40, y1: plafond, x2: 640, y2: plafond, stroke: C.encre, "stroke-width": 4 }, g);
        A.texte(g, "Faux plafond", [600, plafond + 16], { taille: 13, coul: C.doux, ancre: "end" });
        A.s("line", { x1: 40, y1: sol, x2: 640, y2: sol, stroke: C.encre, "stroke-width": 5 }, g);
        n.toutTient = okTout;
        fig.chip(okTout ? "tout tient" : "ça ne tient pas");
      } else {
        // deux salles à comparer
        A.boite(g, 24, 80, 300, 460, { fond: "#fff", bord: n.cmp === "a" ? C.jeu : C.trait, ep: n.cmp === "a" ? 3.5 : 2 });
        A.boite(g, 356, 80, 300, 460, { fond: "#fff", bord: n.cmp === "b" ? C.jeu : C.trait, ep: n.cmp === "b" ? 3.5 : 2 });
        A.texte(g, "Salle A", [174, 112], { taille: 22, gras: 800, halo: false }); A.texte(g, "Salle B", [506, 112], { taille: 22, gras: 800, halo: false });
        ["Petite chirurgie de la main", "Un opérateur", "Anesthésie locorégionale", "Peu d'équipements"].forEach(function (t, i) { A.texte(g, t, [174, 170 + i * 50], { taille: 16, largeur: 270, halo: false, gras: 500 }); });
        ["Neurochirurgie", "Deux opérateurs", "Microscope opératoire", "Imagerie peropératoire", "Robot chirurgical", "Anesthésie générale"].forEach(function (t, i) { A.texte(g, t, [506, 170 + i * 50], { taille: 16, largeur: 270, halo: false, gras: 500 }); });
        A.texte(g, "exemple ajouté", [340, 570], { taille: 14, coul: C.doux });
        A.cible(g, 24, 80, 300, 460, function () { if (n.surCmp) n.surCmp("a"); });
        A.cible(g, 356, 80, 300, 460, function () { if (n.surCmp) n.surCmp("b"); });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La salle calculée sur la table", jouer: function (j, n) {
      n.mode = "formule"; n.formuleOk = false; n.dessin();
      j.titre("Un bureau d'études a dimensionné la salle autour de la table opératoire seule. Complète ce que la surface doit prendre en compte.");
      var res = j.zone("", "");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.5">Patient + <span class="trou" data-attendu="a"></span> + <span class="trou" data-attendu="b"></span> + <span class="trou" data-attendu="c"></span> + <span class="trou" data-attendu="d"></span> + <span class="trou" data-attendu="e"></span></p>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "d", html: "maintenance" }, { id: "a", html: "équipe" }, { id: "x", html: "décoration" }, { id: "e", html: "sécurité" }, { id: "c", html: "circulation" }, { id: "b", html: "équipements" }],
        aide: "Qui travaille autour du patient ? Avec quoi ? Comment circule-t-on ? Qui répare ? Que faut-il pour sortir en cas de danger ?",
        ok: function () {
          n.formuleOk = true; n.dessin();
          j.bravo("Patient + équipe + équipements + circulation + maintenance + sécurité.");
          j.expliquer("<p>La surface ne doit pas être déterminée uniquement par la taille de la table. Une salle d'opération doit permettre l'installation de la table, la circulation de l'équipe, l'installation des équipements, l'accès du patient, l'accès aux équipements de secours, l'utilisation des bras plafonniers, la maintenance des équipements, le nettoyage et la désinfection.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Comparer deux salles", jouer: function (j, n) {
      n.mode = "comparer"; n.cmp = null; n.dessin();
      j.titre("Il n'existe pas de surface universelle. Laquelle de ces deux salles demande le plus de place ? Touche-la.");
      n.surCmp = function (k) {
        n.cmp = k; n.dessin();
        if (k === "a") { j.erreur("Compte ce qui doit tenir autour de la table : opérateurs, microscope, imagerie, robot..."); return; }
        n.surCmp = null;
        j.bravo("La salle B : plus d'opérateurs, un microscope, de l'imagerie, un robot.");
        j.expliquer("<p>La surface dépend notamment du <b>type de chirurgie</b>, du <b>nombre d'opérateurs</b>, du <b>nombre d'équipements</b>, de la <b>présence d'imagerie</b>, de l'<b>utilisation d'un microscope</b>, de la <b>chirurgie robotique</b>, du <b>type d'anesthésie</b> et des <b>besoins de transfert</b>.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surCmp) n.surCmp("b"); });
    } },
    { nom: "Dimensionner une salle hybride", jouer: function (j, n) {
      n.mode = "hybride"; n.L = 7; n.l = 6; n.dessin();
      j.titre("Pour une salle hybride, le FGI 2022 indique une surface libre minimale de 55,74 m² et une dimension libre minimale de 6,10 m. Règle la salle.");
      var cL = j.curseur({ nom: "Longueur", min: 5, max: 10, pas: 0.1, val: 7, unite: " m", dec: 2, change: function (v) { if (!n.libre) return; n.L = v; n.dessin(); } });
      var cl = j.curseur({ nom: "Largeur", min: 5, max: 10, pas: 0.1, val: 6, unite: " m", dec: 2, change: function (v) { if (!n.libre) return; n.l = v; n.dessin(); } });
      var bt = E.h("button", "btn bleu", "Vérifier", j.el); bt.type = "button";
      function gagner() {
        n.libre = false; bt.remove(); n.dessin();
        j.bravo("Surface et dimension minimale respectées.");
        j.expliquer("<p>Les deux conditions comptent : une salle de 5,5 m × 11 m dépasse 55,74 m², mais elle est trop étroite pour faire tourner l'arceau autour de la table. Voilà pourquoi une salle hybride ne doit pas être dimensionnée comme une salle opératoire conventionnelle. (55,74 m² et 6,10 m correspondent à 600 pieds carrés et 20 pieds, les unités du FGI.)</p>");
        j.suite();
      }
      bt.addEventListener("click", function () {
        var S = n.L * n.l;
        if (Math.min(n.L, n.l) < 6.10 - 1e-9) { j.erreur("Une des dimensions est sous 6,10 m (en rouge) : la surface ne suffit pas, il faut aussi la largeur."); return; }
        if (S < 55.74 - 1e-9) { j.erreur("La surface vaut " + E.fmt(S, 2) + " m² : il manque " + E.fmt(55.74 - S, 2) + " m²."); return; }
        gagner();
      });
      j.reponse(function () { n.L = 7.5; n.l = 7.5; cL.regler(7.5); cl.regler(7.5); gagner(); });
    } },
    { nom: "Vérifier un plan", jouer: function (j, n) {
      n.mode = "hybride"; n.L = 9.2; n.l = 6.1; n.dessin();
      j.titre("Un plan propose une salle hybride de 9,20 m × 6,10 m de surface libre. Calcule sa surface.");
      j.nombre({ avant: "S = 9{,}20 \\times 6{,}10 =", apres: "\\text{m}^2", cases: [{ attendu: 56.12, tol: 0.005 }], ligne: true,
        aide: function () { return "Multiplie les deux dimensions : 9,20 × 6 puis ajoute 9,20 × 0,10."; },
        ok: function () {
          j.bravo("56,12 m² ≥ 55,74 m², et la largeur vaut exactement 6,10 m : le plan passe, de justesse.");
          j.suite();
        } });
    } },
    { nom: "Le volume caché", jouer: function (j, n) {
      n.mode = "coupe"; n.plenum = 0.02; n.libre = true; n.dessin();
      j.titre("Le volume compte autant que la surface. Agrandis l'espace technique au-dessus du plafond jusqu'à ce que tous les réseaux tiennent.");
      j.consigne("Coupe verticale de la salle, proportions illustratives.");
      var c = j.curseur({ nom: "Espace technique", min: 0, max: 20, pas: 1, val: 1, unite: "", change: function (v) {
        if (!n.libre) return;
        n.plenum = v / 100; n.dessin();
        if (n.toutTient) fini();
      } });
      function fini() {
        n.libre = false;
        j.bravo("Ventilation, câbles, réseaux médicaux et supports logent au-dessus du plafond.");
        j.expliquer("<p>Le volume disponible est important pour la ventilation, les plafonds techniques, les bras plafonniers, les scialytiques, les réseaux médicaux, les chemins de câbles et les équipements d'imagerie. <b>Erreur fréquente</b> : dimensionner uniquement la salle visible, sans dimensionner le volume technique nécessaire à son fonctionnement.</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(14); n.plenum = 0.14; n.dessin(); if (n.toutTient) fini(); });
    } }
  ]
});
