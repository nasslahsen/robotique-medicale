// Vérifications sans navigateur, pour tous les modules du registre :
// équations KaTeX (pages et scripts), liens internes, cohérence registre / module.js / fichiers, règles d'écriture.
// Lancer : node tests/static-check.js
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const katex = require("../commun/vendor/katex/katex.min.js");
// racine vérifiée : le dépôt, ou un dossier passé en argument (aperçu : node tests/static-check.js apercu)
const racine = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, "..");
const APERCU = !!process.argv[2];
let erreurs = 0, nbMaths = 0, nbPages = 0, nbNiveaux = 0;
const err = (m) => { erreurs++; console.error("ERREUR", m); };
const lire = (p) => fs.readFileSync(path.join(racine, p), "utf8");
const existe = (p) => fs.existsSync(path.join(racine, p));
const liste = (d, re) => existe(d) ? fs.readdirSync(path.join(racine, d)).filter(f => re.test(f)).map(f => d + "/" + f) : [];

// Registre et module.js, exécutés dans un bac à sable
const bac = { window: {}, parcours: {} };
bac.PLATEFORME = { parcours: (id, p) => { bac.parcours[id] = p; }, couleur: () => "#000", clair: () => "#fff", teinte: () => "#000" };
vm.createContext(bac);
vm.runInContext(lire("registre.js"), bac);
const REG = bac.window.REGISTRE;
if (!REG || !REG.modules) { err("registre.js illisible"); process.exit(1); }

function verifierMaths(fichier, texte, js) {
  // dans un script, « \\( » s'écrit avec deux barres : on enlève l'échappement JavaScript
  const s = js ? texte.replace(/\\\\/g, "\\").replace(/\\'/g, "'") : texte.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const re = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
  let x;
  while ((x = re.exec(s))) {
    const tex = x[1] !== undefined ? x[1] : x[2];
    if (js && /PLATEFORME\./.test(tex)) continue; // couleur du module insérée au chargement : vérifiée dans le navigateur
    nbMaths++;
    try { katex.renderToString(tex, { displayMode: x[1] !== undefined, throwOnError: true, strict: "ignore" }); }
    catch (e) { err(`${fichier} : KaTeX « ${tex.slice(0, 60)} » : ${e.message}`); }
  }
}
function verifierLiens(fichier, html) {
  for (const l of html.matchAll(/(?:href|src)="([^"#:]+)(#[^"]*)?"/g)) {
    if (!existe(path.join(path.dirname(fichier), l[1]))) err(`${fichier} : lien cassé ${l[1]}`);
  }
}
function verifierEcriture(fichier, s) {
  if (s.includes("—")) err(`${fichier} : tiret cadratin`);
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(s)) err(`${fichier} : emoji`);
  if (/\.(png|jpe?g|pdf)\b/i.test(s)) err(`${fichier} : référence à une image ou un PDF`);
}

// Registre : couleurs et statut
const hex = /^#[0-9A-Fa-f]{6}$/;
for (const m of REG.modules) {
  for (const k of ["couleur", "clair", "texte"]) if (!hex.test(m[k] || "")) err(`registre : ${m.id}.${k} n'est pas une couleur #RRGGBB`);
  if (!["actif", "a-venir"].includes(m.statut)) err(`registre : statut inconnu pour ${m.id}`);
  if (m.statut !== "actif") continue;
  const d = "modules/" + m.id;
  for (const f of ["index.html", "jouer.html", "module.js", "cours/index.html"]) if (!existe(d + "/" + f)) err(`${d} : fichier manquant ${f}`);
  if (existe(d + "/module.js")) vm.runInContext(lire(d + "/module.js"), bac);
}

// Chaque module actif (et le modèle)
const modules = REG.modules.filter(m => m.statut === "actif").map(m => m.id);
if (existe("modules/_modele/module.js")) { vm.runInContext(lire("modules/_modele/module.js"), bac); modules.push("_modele"); }
for (const id of modules) {
  const d = "modules/" + id, P = bac.parcours[id], reg = REG.modules.find(m => m.id === id);
  if (!P) { err(`${d}/module.js n'appelle pas PLATEFORME.parcours("${id}", ...)`); continue; }
  const sms = reg ? reg.sousModules.map(s => s.id) : null;
  for (const ch of P.chapitres) if (sms && sms.length && !sms.includes(ch.sousModule)) err(`${d} : chapitre ${ch.id}, sous-module inconnu « ${ch.sousModule} »`);
  // niveaux
  for (const n of P.niveaux) {
    const f = `${d}/niveaux/${n.id}.js`;
    if (!P.chapitres.some(c => c.id === n.chapitre)) err(`${d} : niveau ${n.id}, chapitre inconnu`);
    if (n.pret && !existe(f)) err(`niveau prêt sans script : ${f}`);
    if (!n.pret && existe(f)) err(`script présent mais niveau pas marqué prêt : ${f}`);
    if (n.cours && !existe(`${d}/cours/${n.id}.html`)) err(`${d} : niveau ${n.id} marqué cours sans page de cours`);
  }
  for (const f of liste(d + "/niveaux", /\.js$/)) {
    const nid = path.basename(f, ".js"), src = lire(f);
    if (!P.niveaux.some(n => n.id === nid)) err(`${f} absent de module.js`);
    if (!src.includes(`id: "${nid}"`)) err(`${f} : l'id ne correspond pas au nom du fichier`);
    verifierEcriture(f, src); verifierMaths(f, src, true);
  }
  nbNiveaux += P.niveaux.filter(n => n.pret).length;
  // pages de cours
  const pagesCours = liste(d + "/cours", /\.html$/).filter(f => !f.endsWith("/index.html"));
  for (const c of P.cours || []) if (!existe(`${d}/cours/${c.id}.html`)) err(`${d} : page de cours manquante ${c.id}.html`);
  for (const f of pagesCours) {
    const slug = path.basename(f, ".html"), html = lire(f);
    if (!(P.cours || []).some(c => c.id === slug)) err(`${f} absente de la liste cours de module.js`);
    if (!html.includes(`data-module="${id}"`)) err(`${f} : <html data-module="${id}"> manquant`);
    for (const t of ["<h2>Intuition</h2>", "<h2>Formalisation</h2>", "<h2>Formules clés</h2>"]) if (!html.includes(t)) err(`${f} : section manquante ${t}`);
    if (!/<div id="fig-/.test(html)) err(`${f} : aucune figure`);
    if (!/<h2>Exemple/.test(html)) err(`${f} : section Exemple manquante`);
    if (html.includes("<h2>Questions</h2>")) err(`${f} : les questions sont dans le jeu, pas dans les pages de cours`);
  }
  for (const f of [d + "/index.html", d + "/jouer.html", d + "/cours/index.html"].concat(pagesCours)) {
    if (!existe(f)) continue;
    const html = lire(f); nbPages++;
    verifierLiens(f, html); verifierMaths(f, html, false); verifierEcriture(f, html);
    if (!html.includes(`data-module="${id}"`)) err(`${f} : <html data-module="${id}"> manquant`);
  }
  for (const f of liste(d + "/figures", /\.js$/)) { verifierEcriture(f, lire(f)); verifierMaths(f, lire(f), true); }
}

// Racine : tableau de bord, anciennes adresses, socle commun
for (const f of (APERCU ? ["index.html"] : ["index.html", "jouer.html", "cours.html"]).concat(liste("concepts", /\.html$/))) {
  if (!existe(f)) { err(`${f} manquant`); continue; }
  const html = lire(f); nbPages++;
  verifierLiens(f, html); verifierEcriture(f, html);
  const cible = (html.match(/location\.replace\("([^"]+)"/) || [])[1];
  if (cible && !existe(path.join(path.dirname(f), cible))) err(`${f} : redirection vers une page absente ${cible}`);
}
for (const f of liste("commun/js", /\.js$/).concat(liste("commun/jeu", /\.js$/), ["registre.js"])) { verifierEcriture(f, lire(f)); verifierMaths(f, lire(f), true); }
if (fs.readdirSync(racine).some(f => /\.pdf$/i.test(f))) err("PDF présent à la racine du dépôt");

console.log(`${REG.modules.length} modules au registre, ${modules.length} vérifiés (${modules.join(", ")})`);
console.log(`${nbNiveaux} niveaux prêts, ${nbPages} pages, ${nbMaths} équations vérifiées`);
if (erreurs) { console.error(`${erreurs} erreur(s)`); process.exit(1); }
console.log("vérification statique réussie");
