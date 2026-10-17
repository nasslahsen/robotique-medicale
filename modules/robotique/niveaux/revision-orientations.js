/* Révision du chapitre 3 : lire une colonne sans calcul, erreur de signe dans Ry, pourquoi R^T, ordre ZYX, singularité. */
NIVEAU({
  id: "revision-orientations",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [340, 360], ech: 165, az: 35, el: 24 });
    var I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    var n = { R: I, montreR0: true, noms: ["x₁", "y₁", "z₁"], b: E.Rz(90 * D.DEG) };
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle();
      if (n.montreR0) sc.repere(l, [0, 0, 0], I, 1.25, ["x₀", "y₀", "z₀"], { ep: 2.5, pale: true, op: 0.45 });
      sc.repere(l, [0, 0, 0], n.R, 1.0, n.noms, { ep: 5 });
      sc.dessiner(g, l);
    };
    n.vers = function (R, ms) {
      var de = n.R; E.anime(ms || 900, function (e) { n.R = de.map(function (li, i) { return li.map(function (x, k) { return x + (R[i][k] - x) * e; }); }); n.dessin(); }, function () { n.R = R; n.dessin(); });
    };
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.sc = sc;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Lire sans calculer", jouer: function (j, n) {
      n.vers(E.Rz(90 * D.DEG), 1200);
      j.fig.astuce("R₁ a tourné de 90° autour de z₀. Les axes pâles : R₀. Tourne la vue.");
      j.titre("Sans écrire la formule : quelle est la 1\\(^\\text{re}\\) colonne de \\(R^{0,1}\\) ?");
      j.consigne("La colonne \\(k\\) de \\(R^{0,1}\\) donne l'axe \\(k\\) de \\(R_1\\) exprimé dans \\(R_0\\).");
      j.nombre({ avant: "[\\vec{x}_1]_{R_0} =", cases: [{ attendu: 0, tol: 0.001 }, { attendu: 1, tol: 0.001 }, { attendu: 0, tol: 0.001 }], ligne: true,
        aide: function () { return "Regarde la figure : \\(\\vec{x}_1\\) pointe maintenant là où pointait \\(\\vec{y}_0\\)."; },
        ok: function () {
          j.bravo("\\(\\vec{x}_1 = \\vec{y}_0\\), donc la colonne 1 est \\((0 \\,;\\ 1 \\,;\\ 0)\\).");
          j.expliquer("<p>On n'a pas besoin de connaître \\(R_z\\) par cœur : on dessine le repère tourné, et on lit chaque nouvel axe dans l'ancien. Les trois colonnes ainsi lues forment la matrice. C'est la meilleure vérification en examen.</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.vers(E.Ry(30 * D.DEG), 900); n.noms = ["x₁", "y₁", "z₁"];
      j.fig.astuce("Une rotation de 30° autour de y₀ : regarde où part x₁.");
      j.titre("Un camarade écrit \\(R_y(\\beta)\\) ainsi. Que se passe-t-il ?");
      j.texte("\\[ R_y(\\beta) = \\begin{pmatrix} \\cos\\beta & 0 & -\\sin\\beta \\\\ 0 & 1 & 0 \\\\ \\sin\\beta & 0 & \\cos\\beta \\end{pmatrix} \\]");
      j.choix([{ html: "Les deux sinus ont le signe inversé", juste: true }, { html: "Le 1 devrait être sur la 3\\(^\\text{e}\\) ligne", aide: "Pour une rotation autour de y, c'est y qui est conservé : le 1 est bien en position (2, 2)." }, { html: "Rien, c'est correct", aide: "Sa première colonne dirait que \\(\\vec{x}_1\\) monte (\\(+\\sin\\beta\\) en z)… mais sur la figure, \\(\\vec{x}_1\\) part vers \\(-\\vec{z}_0\\) ?" }], { colonnes: 1, ok: function () {
        j.bravo("Dans \\(R_y\\), le \\(-\\sin\\beta\\) est en bas à gauche.");
        j.expliquer("\\[ R_y(\\beta) = \\begin{pmatrix} \\cos\\beta & 0 & \\sin\\beta \\\\ 0 & 1 & 0 \\\\ -\\sin\\beta & 0 & \\cos\\beta \\end{pmatrix} \\]<p>Vérification par la colonne 1 : tourner \\(\\vec{x}_0\\) autour de \\(\\vec{y}_0\\) le fait passer vers \\(-\\vec{z}_0\\), car \\(\\vec{z} \\wedge \\vec{x} = \\vec{y}\\). D'où \\(-\\sin\\beta\\) en troisième ligne.</p>");
        j.suite();
      } });
    } },
    { nom: "Pourquoi Rᵀ ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Pourquoi l'inverse d'une matrice de rotation est-elle sa transposée ?");
      j.choix([{ html: "Ses colonnes sont unitaires et perpendiculaires deux à deux, donc \\(R^T R = I\\)", juste: true }, { html: "Parce que \\(R\\) est symétrique", aide: "\\(R_z(90°)\\) n'est pas symétrique : sa case (1, 2) vaut \\(-1\\), sa case (2, 1) vaut 1." }, { html: "Parce que son déterminant vaut 0", aide: "Son déterminant vaut 1 ; une matrice de déterminant 0 n'aurait pas d'inverse." }], { colonnes: 1, ok: function () {
        j.bravo("Case \\((i, k)\\) de \\(R^T R\\) : colonne \\(i\\) · colonne \\(k\\), donc 1 ou 0.");
        j.expliquer("<p>Les colonnes sont les axes d'un repère orthonormé : un axe scalaire lui-même donne 1, deux axes différents donnent 0. D'où \\(R^T R = I\\) et \\(R^{s,0} = (R^{0,s})^T\\), sans aucun calcul d'inverse.</p>");
        j.suite();
      } });
    } },
    { nom: "L'ordre", jouer: function (j, n) {
      n.vers(E.mm(E.Rz(40 * D.DEG), E.Ry(-30 * D.DEG)), 1200); n.noms = ["x₂", "y₂", "z₂"];
      j.fig.astuce("Lacet de 40° autour de z₀, puis tangage autour du nouvel axe y₁.");
      j.titre("Axes mobiles : d'abord \\(R_z(\\alpha)\\), puis \\(R_y(\\beta)\\) autour du nouvel axe. Quelle écriture donne \\(R^{(0,2)}\\) ?");
      j.choix([{ tex: "R_z(\\alpha)\\,R_y(\\beta)", juste: true }, { tex: "R_y(\\beta)\\,R_z(\\alpha)", aide: "Chaque nouvelle rotation est décrite dans le repère obtenu juste avant : elle se multiplie à droite, comme un maillon de plus." }], { colonnes: 2, ok: function () {
        j.bravo("\\(R^{(0,2)} = R^{(0,1)} R^{(1,2)} = R_z(\\alpha) R_y(\\beta)\\).");
        j.suite();
      } });
    } },
    { nom: "Singularité", jouer: function (j, n) {
      n.vers(E.mm(E.Rz(0), E.Ry(90 * D.DEG)), 1200); n.noms = ["x₂", "y₂", "z₂"];
      j.fig.astuce("Tangage de 90° : regarde où est passé x₂.");
      j.titre("En ZYX, avec \\(\\beta = 90°\\), pourquoi perd-on un degré de liberté ?");
      j.choix([{ html: "L'axe du roulis \\(\\vec{x}_2\\) devient vertical, aligné avec l'axe du lacet", juste: true }, { html: "La matrice devient nulle", aide: "Une matrice de rotation n'est jamais nulle : son déterminant vaut toujours 1." }, { html: "Le tangage ne peut pas dépasser 90°", aide: "Il peut, mais le problème apparaît justement à 90° : regarde la direction de \\(\\vec{x}_2\\)." }], { colonnes: 1, ok: function () {
        j.bravo("Lacet et roulis tournent autour du même axe : ils font le même mouvement.");
        j.expliquer("<p>Quand l'angle du milieu vaut \\(\\pm 90°\\), le premier et le dernier axe sont alignés. Deux angles décrivent alors une seule rotation : seule leur combinaison compte, et on ne peut plus les retrouver séparément à partir de la matrice.</p>");
        j.suite();
      } });
    } }
  ]
});
