// Cours d'un chapitre en sections : réunit les pages de cours (notions) de chaque section de module.js
// dans une page modules/<id>/<dossierChapitres>/cours/<section>.html, sans rien changer à leur contenu.
// Chaque notion devient un <article class="notion" id="n-<notion>"> : son titre passe en h2, ses sections en h3, h4.
// Lancer : node outils/regrouper.js <module>     (tests/static-check.js vérifie que les pages sont à jour)
"use strict";
const fs = require("fs"), path = require("path");

// Page d'une section s du module mid (dossier d, module.js P).
function pageSection(mid, d, P, s) {
  const profond = "../".repeat(3 + (P.dossierChapitres ? 1 : 0));
  let corps = "", figures = [];
  for (const nid of s.notions) {
    const html = fs.readFileSync(path.join(d, "cours", nid + ".html"), "utf8");
    let m = html.match(/<main>([\s\S]*?)<\/main>/)[1];
    m = m.replace(/\s*<p class="etiquette" data-etiquette><\/p>\s*/, "\n")
      .replace(/<(\/?)h3>/g, "<$1h4>").replace(/<(\/?)h2>/g, "<$1h3>").replace(/<(\/?)h1>/g, "<$1h2>");
    corps += '<article class="notion" id="n-' + nid + '">' + m.replace(/\s+$/, "\n") + "</article>\n\n";
    for (const f of html.matchAll(/<script src="\.\.\/figures\/([^"]+)"><\/script>/g)) figures.push(f[1]);
  }
  const page = `<!doctype html>
<html lang="fr" data-module="${mid}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<title>${s.titre}</title>
<link rel="stylesheet" href="${profond}commun/vendor/katex/katex.min.css">
<link rel="stylesheet" href="${profond}commun/css/cours.css">
<link rel="stylesheet" href="${profond}commun/css/barre.css">
<script src="${profond}registre.js"></script>
<script src="${profond}commun/js/plateforme.js"></script>
<script src="${P.dossierChapitres ? "../../" : "../"}module.js"></script>
</head>
<body>
<!-- Généré par outils/regrouper.js à partir des pages de cours : ${s.notions.join(", ")}. -->
<main class="section-cours" data-section="${s.id}">
<p class="etiquette" data-etiquette></p>
<h1>${s.titre}</h1>

${corps}</main>
<script src="${profond}commun/vendor/katex/katex.min.js"></script>
<script src="${profond}commun/vendor/katex/auto-render.min.js"></script>
<script src="${profond}commun/js/lib.js"></script>
<script src="${profond}commun/js/section.js"></script>
${figures.map(f => `<script src="${P.dossierChapitres ? "../../" : "../"}figures/${f}"></script>`).join("\n")}
</body>
</html>
`;
  return page;
}
module.exports = { pageSection };

if (require.main === module) {
  const mid = process.argv[2];
  if (!mid) { console.error("usage : node outils/regrouper.js <module>"); process.exit(2); }
  const d = path.join(__dirname, "..", "modules", mid);
  let P = null;
  global.PLATEFORME = { parcours: (id, p) => { P = p; } };
  require(path.join(d, "module.js"));
  if (!P.sections) { console.error("module.js n'a pas de sections"); process.exit(1); }
  const dossier = path.join(d, P.dossierChapitres || "", "cours");
  fs.mkdirSync(dossier, { recursive: true });
  for (const s of P.sections) {
    fs.writeFileSync(path.join(dossier, s.id + ".html"), pageSection(mid, d, P, s));
    console.log(s.id + ".html", "←", s.notions.join(", "));
  }
}
