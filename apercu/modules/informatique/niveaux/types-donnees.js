/* Niveau : trois types de données, exemple FHIR, supports de données dans un SIH (S1S2, diapos 47 et 48). */
NIVEAU(SIS.rejouable({
  id: "types-donnees",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.JSON = ["{", '  "resourceType": "Observation",', '  "code": {"text": "Tension artérielle"},', '  "valueQuantity": {"value": 122, "unit": "mmHg"}', "}"];
    n.json = function (g2, etat) {
      A.s("rect", { x: 20, y: 150, width: 640, height: 260, rx: 14, fill: "#15171f" }, g2);
      n.JSON.forEach(function (l, i) {
        var ok = etat && etat.trouve[i], f = etat && etat.faux === i;
        if (ok || f) A.s("rect", { x: 30, y: 172 + i * 46, width: 620, height: 40, rx: 6, fill: ok ? C.ok : C.ko, opacity: 0.35 }, g2);
        A.texte(g2, l, [44, 192 + i * 46], { taille: 16, mono: true, ancre: "start", coul: "#e8ecf4", halo: false, gras: 500 });
      });
      A.texte(g2, "Exemple FHIR du cours", [340, 120], { taille: 16, coul: C.doux });
    };
    return n;
  },
  etapes: [
    { nom: "Trois types", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque donnée du SIH dans son type.");
      var cartes = [{ t: "Table SQL des patients", bac: 0 }, { t: "Message HL7 FHIR en JSON", bac: 1 }, { t: "Compte rendu en texte libre", bac: 2 }, { t: "Fichier CSV des admissions", bac: 0 }, { t: "Message d'interopérabilité en XML", bac: 1 }, { t: "Enregistrement vocal d'une dictée", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Structuré", sous: "BD, CSV" }, { t: "Semi-structuré", sous: "messages d'interopérabilité" }, { t: "Non structuré", sous: "texte libre, voix" }],
        pos: A.grille(6, 2, 20, 20, 640, 80, 14), bacsPos: function (k) { return { x: 14 + k * 222, y: 330, w: 208, h: 220 }; },
        tailleBac: 19,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Des lignes et des colonnes fixes : chaque valeur a sa case.", "Des balises ou des clés nomment chaque valeur, mais la forme peut varier d'un message à l'autre.", "Aucune case, aucune clé : le sens est dans les mots."][b]; },
        fin: function () { j.bravo("Structuré, semi-structuré, non structuré."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Lire un message FHIR", jouer: function (j, n) {
      j.titre("Dans ce message FHIR du cours, touche la ligne qui porte la valeur mesurée et son unité.");
      var r = SIS.reperer({ g: n.g, zones: n.JSON.map(function (l, i) { return { x: 30, y: 172 + i * 46, w: 620, h: 40, bon: i === 3 }; }), dessiner: n.json,
        erreur: j.erreur, aide: function (i) { return i === 2 ? "Cette ligne dit ce qu'on a mesuré, pas combien." : "Cherche le nombre et son unité."; },
        fin: function () {
          j.bravo("valueQuantity : 122 mmHg.");
          j.expliquer("<p>Chaque valeur est nommée par une clé (<code>resourceType</code>, <code>code</code>, <code>valueQuantity</code>) : c'est ce qui rend le message <b>semi-structuré</b>. Un programme peut le lire, à condition de faire un parsing spécifique.</p>");
          j.suite();
        } });
      j.reponse(function () { r.resoudre(); });
    } },
    { nom: "Le séparateur", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.texte(n.g, "Ligne exportée (séparateur ; et virgule décimale)", [340, 120], { taille: 16, coul: C.doux });
      A.boite(n.g, 60, 150, 560, 80, { titre: "BENNANI;Salma;37,8", taille: 30, mono: true, fond: C.fond, bord: C.trait });
      A.texte(n.g, "L'outil d'import coupe à chaque virgule", [340, 300], { taille: 18, gras: 700 });
      A.icone(n.g, "alerte", [340, 380], 70, C.ko);
      j.titre("Un outil d'import lit ce fichier en coupant les colonnes à chaque virgule. Combien de colonnes voit-il dans cette ligne ?");
      j.nombre({ cases: [{ attendu: 2 }], apres: "\\text{ colonnes}", aide: function () { return "Cherche les virgules dans la ligne : il n'y en a qu'une, celle de 37,8."; }, ok: function () {
        A.boite(n.g, 60, 450, 330, 70, { titre: "BENNANI;Salma;37", mono: true, taille: 22, fond: C.koPale, bord: C.ko });
        A.boite(n.g, 410, 450, 210, 70, { titre: "8", mono: true, taille: 22, fond: C.koPale, bord: C.ko });
        j.bravo("Deux colonnes, et une température coupée en deux.");
        j.expliquer("<p>Pour les fichiers plats (CSV, TXT), le cours met en garde : attention à l'<b>encodage</b> (latin-1 ou utf-8) et au <b>séparateur</b> (; ou ,).</p>");
        j.suite();
      } });
    } },
    { nom: "Hélène devient HÃ©lÃ¨ne", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 60, 170, 250, 90, { titre: "Hélène", taille: 30, fond: C.okPale, bord: C.ok });
      A.fleche(n.g, [320, 215], [370, 215], { ep: 5 });
      A.boite(n.g, 380, 170, 250, 90, { titre: "HÃ©lÃ¨ne", taille: 30, fond: C.koPale, bord: C.ko });
      j.titre("Après un export, le prénom « Hélène » s'affiche « HÃ©lÃ¨ne ». Quel piège des fichiers plats ?");
      j.choix([
        { html: "L'encodage : un fichier écrit en utf-8 a été lu comme du latin-1", juste: true },
        { html: "Le séparateur : la virgule a coupé le prénom", aide: "Aucune colonne n'est coupée : ce sont les lettres accentuées qui changent." },
        { html: "Une faute de frappe à l'admission", aide: "Seules les lettres accentuées sont abîmées, et toujours de la même façon : c'est la lecture du fichier." }
      ], { colonnes: 1, ok: function () { j.bravo("Encodage mal lu : utf-8 pris pour du latin-1."); j.suite(); } });
    } },
    { nom: "Chaque support son usage", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque support de données à son usage dans le SIH.");
      var p = A.paires({
        g: n.g, gauche: ["Bases relationnelles (Oracle, PostgreSQL...)", "Fichiers plats (CSV, TXT)", "Excel", "HL7 v2, FHIR, DICOM", "Entrepôts, data marts"],
        droite: ["Exports entre systèmes", "Analyse des indicateurs (schéma en étoile)", "Cœur du DPI et de l'entrepôt", "Interopérabilité", "Tableaux de bord, saisies ponctuelles"],
        bon: [2, 0, 4, 3, 1],
        xg: 10, wg: 330, xd: 380, wd: 290, y0: 20, h: 96, pas: 114, taille: 16, tailleD: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Le cœur du système : accès par habilitations, jamais de copie non maîtrisée.", "Un simple fichier texte, pour passer d'un système à l'autre.", "Le tableur : pratique, mais attention aux dates et aux cellules fusionnées.", "Des formats d'échange, qui demandent un parsing spécifique.", "Pour analyser des indicateurs."][i]; },
        fin: function () { j.bravo("Base : cœur du DPI. CSV : exports. Excel : tableaux. HL7, FHIR, DICOM : interopérabilité. Entrepôt : indicateurs."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } }
  ]
}));
