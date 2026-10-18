/* Niveau : le dispositif médical. DM ou médicament, critère du mode d'action, finalités, un secteur de PME. */
NIVEAU({
  id: "dispositif-medical",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { voie: null, mode: "arbre" };
    function boite(x, y, l, h, txt, actif, coul) {
      E.s("rect", { x: x - l / 2, y: y - h / 2, width: l, height: h, rx: 16, fill: actif ? (coul || PLATEFORME.teinte(0.16)) : "#fff", stroke: actif ? C.jeu : "#c6cbd8", "stroke-width": 2.5 }, g);
      txt.split("|").forEach(function (t, k, a) { D.texte(g, t, [x, y + (k - (a.length - 1) / 2) * 22], { taille: 17 }); });
    }
    n.dessin = function () {
      E.vider(g);
      var v = n.voie;
      D.texte(g, "Produit de santé à usage médical", [340, 50], { taille: 21 });
      boite(340, 140, 470, 84, "Mode d'action principal voulu :|pharmacologique, immunologique|ou par métabolisme ?", true, "#f3f5fa");
      D.ligne(g, [340, 50 + 16], [340, 98], C.gris, 3);
      D.fleche(g, [250, 182], [150, 270], v === "med" ? C.jeu : C.gris, 4);
      D.fleche(g, [430, 182], [530, 270], v === "dm" ? C.jeu : C.gris, 4);
      D.texte(g, "oui", [175, 214], { taille: 18, coul: C.doux });
      D.texte(g, "non", [505, 214], { taille: 18, coul: C.doux });
      boite(150, 320, 230, 84, "Médicament", v === "med");
      boite(530, 320, 230, 84, "Dispositif|médical", v === "dm");
      // petits pictogrammes : comprimé et vaccin d'un côté, valve et seringue de l'autre
      E.s("rect", { x: 98, y: 400, width: 60, height: 26, rx: 13, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.ligne(g, [128, 400], [128, 426], C.encre, 2.5);
      E.s("rect", { x: 172, y: 404, width: 44, height: 18, rx: 4, fill: "#e8edff", stroke: C.encre, "stroke-width": 2 }, g);
      D.ligne(g, [216, 413], [234, 413], C.encre, 3);
      D.texte(g, "comprimé, vaccin", [150, 456], { taille: 15, coul: C.doux, gras: false });
      D.rond(g, [500, 413], 22, { fill: "#fff", stroke: C.encre, ep: 3 });
      [0, 120, 240].forEach(function (a) { var t = a * D.DEG; D.ligne(g, [500, 413], [500 + 22 * Math.cos(t), 413 - 22 * Math.sin(t)], C.encre, 2.5); });
      E.s("rect", { x: 540, y: 404, width: 60, height: 18, rx: 4, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      D.ligne(g, [600, 413], [622, 413], C.encre, 2);
      D.ligne(g, [520, 413], [540, 413], C.encre, 4);
      D.texte(g, "valve cardiaque, seringue", [530, 456], { taille: 15, coul: C.doux, gras: false });
      D.texte(g, "article R5211-2 du Code de la santé publique", [340, 520], { taille: 15, coul: C.doux, gras: false });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "DM ou médicament ?", jouer: function (j, n) {
      j.fig.astuce("Tout se joue sur la façon dont le produit agit, pas sur sa taille ni son prix.");
      j.titre("Range ces produits de santé : dispositif médical ou médicament ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:17px"><b>Dispositif médical</b><b>Médicament</b>' + [0, 1, 2].map(function () { return '<span class="trou" data-attendu="dm"></span><span class="trou" data-attendu="med"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "dm", html: "Logiciel d'aide au diagnostic" }, { id: "med", html: "Comprimé d'antibiotique" }, { id: "dm", html: "Prothèse de hanche" }, { id: "med", html: "Vaccin" }, { id: "dm", html: "Pansement" }, { id: "med", html: "Insuline injectée" }],
        aide: "Le vaccin agit par la voie immunologique, l'antibiotique par la voie pharmacologique, l'insuline par le métabolisme : ce sont des médicaments. Les logiciels à usage médical sont bien des DM.",
        ok: function () {
          n.voie = "dm"; n.dessin();
          j.bravo("Le logiciel aussi : la définition inclut les logiciels.");
          j.expliquer("<p>Les <b>dispositifs médicaux</b> sont des produits de santé, y compris les logiciels, revendiquant un usage à des fins médicales et dont le mode d'action principal délibéré n'est obtenu ni par des voies pharmacologiques, ni immunologiques, ni par métabolisme. Sinon, le produit est un médicament (article R5211-2 du Code de la santé publique).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le critère", jouer: function (j, n) {
      n.voie = null; n.dessin();
      j.titre("Une seringue et l'insuline qu'elle contient servent au même patient. Qu'est-ce qui fait de la seringue un DM et de l'insuline un médicament ?");
      j.choix([
        { html: "La seringue est en plastique, l'insuline est liquide", aide: "Un DM peut être liquide ou logiciel : la matière ne décide pas. Regarde la question posée dans la case du haut." },
        { html: "La seringue agit mécaniquement ; l'insuline agit par le métabolisme", juste: true },
        { html: "La seringue est jetable", aide: "Beaucoup de DM sont réutilisables. Le critère est le mode d'action principal." }
      ], { colonnes: 1, ok: function () {
        n.voie = "dm"; n.dessin();
        j.bravo("Même usage médical, mais pas le même mode d'action principal.");
        j.suite();
      } });
    } },
    { nom: "Les finalités", jouer: function (j, n) {
      j.titre("Les DM ont trois familles de finalités. Associe chaque dispositif à la sienne.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;font-size:16px"><span>Diagnostic, prévention, contrôle, traitement <b>d\'une maladie</b></span><span class="trou" data-attendu="mal"></span><span>Diagnostic, contrôle, traitement, réparation <b>d\'une blessure ou d\'un handicap</b></span><span class="trou" data-attendu="hand"></span><span>Étude, remplacement, modification <b>de l\'anatomie ou d\'un processus physiologique</b></span><span class="trou" data-attendu="ana"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "ana", html: "Prothèse de hanche" }, { id: "mal", html: "Appareil d'imagerie médicale" }, { id: "hand", html: "Fauteuil roulant" }],
        aide: "La prothèse remplace une partie de l'anatomie ; le fauteuil compense un handicap ; l'imagerie sert à diagnostiquer une maladie.",
        ok: function () {
          j.bravo("Remplacer, compenser, diagnostiquer.");
          j.expliquer("<p>Dans les applications médicales, les biomatériaux sont rarement utilisés seuls : ils sont intégrés dans des dispositifs plus ou moins complexes. D'où une très grande diversité, du simple patch à la valve cardiaque la plus sophistiquée, de la seringue au cathéter et à la prothèse vasculaire.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Un secteur de PME", jouer: function (j, n) {
      j.titre("Le secteur des DM en France compte 1 à 2 millions de produits référencés (rapport IGAS 2010). Qui les fabrique surtout ?");
      j.choix([
        { html: "Quelques très grands groupes", aide: "Le cours donne une proportion très forte pour les entreprises de moins de 250 personnes." },
        { html: "Des petites et moyennes entreprises (94 %), souvent sur des marchés de niche", juste: true },
        { html: "Les hôpitaux eux-mêmes", aide: "Les hôpitaux utilisent les DM ; ils ne sont pas le tissu industriel décrit." }
      ], { colonnes: 1, ok: function () {
        j.bravo("94 % de PME, dont 45 % de très petites entreprises (rapport PIPAME 2011).");
        j.expliquer("<p>Beaucoup de DM répondent aux besoins de petits groupes de patients (par exemple les endoprothèses aortiques, quelques milliers de patients en France). Le marché représente plusieurs centaines de milliards d'euros ; la France y occupe la 4e ou 5e place, avec 10 % du marché mondial.</p>");
        j.suite();
      } });
    } }
  ]
});
