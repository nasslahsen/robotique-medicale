// Vérifications sans navigateur : équations KaTeX, liens internes, liste des pages, règles d'écriture.
// Lancer : node tests/static-check.js
"use strict";
const fs = require("fs"), path = require("path");
const katex = require("../assets/vendor/katex/katex.min.js");
const racine = path.join(__dirname, "..");
let erreurs = 0;
const err = (m) => { erreurs++; console.error("ERREUR", m); };

const pages = ["index.html", "cours.html"].concat(fs.readdirSync(path.join(racine, "concepts")).filter(f => f.endsWith(".html")).map(f => "concepts/" + f));

// Liste des concepts dans nav.js
const nav = fs.readFileSync(path.join(racine, "assets/js/nav.js"), "utf8");
const concepts = [...nav.matchAll(/slug: "([^"]+)", titre: "[^"]+", pret: (true|false)/g)].map(x => ({ slug: x[1], pret: x[2] === "true" }));
if (!concepts.length) err("aucun concept trouvé dans nav.js");
for (const c of concepts) {
  const existe = fs.existsSync(path.join(racine, "concepts", c.slug + ".html"));
  if (c.pret && !existe) err(`concept prêt sans page : ${c.slug}`);
  if (!c.pret && existe) err(`page présente mais marquée en préparation : ${c.slug}`);
}
for (const p of pages.filter(p => p.startsWith("concepts/"))) {
  const slug = path.basename(p, ".html");
  if (!concepts.some(c => c.slug === slug)) err(`page absente de nav.js : ${p}`);
}

let nbMaths = 0;
for (const p of pages) {
  const html = fs.readFileSync(path.join(racine, p), "utf8");
  // équations
  const re = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
  let x;
  while ((x = re.exec(html))) {
    const tex = (x[1] !== undefined ? x[1] : x[2]).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    nbMaths++;
    try { katex.renderToString(tex, { displayMode: x[1] !== undefined, throwOnError: true, strict: "ignore" }); }
    catch (e) { err(`${p} : KaTeX « ${tex.slice(0, 60)} » : ${e.message}`); }
  }
  // liens et ressources internes
  for (const l of html.matchAll(/(?:href|src)="([^"#:]+)(#[^"]*)?"/g)) {
    const cible = path.normalize(path.join(racine, path.dirname(p), l[1]));
    if (!fs.existsSync(cible)) err(`${p} : lien cassé ${l[1]}`);
  }
  // structure attendue d'une page de concept
  if (p.startsWith("concepts/")) {
    for (const t of ["<h2>Intuition</h2>", "<h2>Formalisation</h2>", "<h2>Formules clés</h2>", "class=\"fig\""]) {
      if (t === "class=\"fig\"") { if (!/<div id="fig-/.test(html)) err(`${p} : aucune figure`); continue; }
      if (!html.includes(t)) err(`${p} : section manquante ${t}`);
    }
    if (!/<h2>Exemple/.test(html)) err(`${p} : section Exemple manquante`);
    if (html.includes("<h2>Questions</h2>")) err(`${p} : les questions sont dans le jeu, pas dans les pages de cours`);
  }
}
// règles d'écriture sur les pages et les scripts
const fichiers = pages.concat(fs.readdirSync(path.join(racine, "assets/js/pages")).map(f => "assets/js/pages/" + f), ["assets/js/lib.js", "assets/js/nav.js"]);
for (const f of fichiers) {
  const s = fs.readFileSync(path.join(racine, f), "utf8");
  if (s.includes("—")) err(`${f} : tiret cadratin`);
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(s)) err(`${f} : emoji`);
  if (/\.(png|jpe?g|pdf)\b/i.test(s)) err(`${f} : référence à une image ou un PDF`);
}
if (fs.readdirSync(racine).some(f => /\.pdf$/i.test(f))) err("PDF présent dans le dépôt");

// Jeu et niveaux : pages, scripts, équations écrites dans les chaînes JavaScript
const aVerifier = [];
for (const d of ["jeu", "niveaux"]) {
  const dos = path.join(racine, d);
  if (fs.existsSync(dos)) for (const f of fs.readdirSync(dos).filter(f => /\.(html|js)$/.test(f))) aVerifier.push([d, f]);
}
aVerifier.push([".", "jouer.html"]);
{
  for (const [d, f] of aVerifier) {
    const brut = fs.readFileSync(path.join(racine, d, f), "utf8");
    if (brut.includes("—")) err(`${d}/${f} : tiret cadratin`);
    if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(brut)) err(`${d}/${f} : emoji`);
    if (/\.(png|jpe?g|pdf)\b/i.test(brut)) err(`${d}/${f} : référence à une image ou un PDF`);
    // dans un script, « \\( » s'écrit avec deux barres : on enlève l'échappement JavaScript
    const s = f.endsWith(".js") ? brut.replace(/\\\\/g, "\\").replace(/\\'/g, "'") : brut;
    const re = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
    let x;
    while ((x = re.exec(s))) {
      const tex = x[1] !== undefined ? x[1] : x[2];
      nbMaths++;
      try { katex.renderToString(tex, { displayMode: x[1] !== undefined, throwOnError: true, strict: "ignore" }); }
      catch (e) { err(`${d}/${f} : KaTeX « ${tex.slice(0, 60)} » : ${e.message}`); }
    }
    if (f.endsWith(".html")) for (const l of brut.matchAll(/(?:href|src)="([^"#:]+)(#[^"]*)?"/g)) {
      if (!fs.existsSync(path.normalize(path.join(racine, d, l[1])))) err(`${d}/${f} : lien cassé ${l[1]}`);
    }
  }
}

const cat = fs.readFileSync(path.join(racine, "jeu/catalogue.js"), "utf8");
const niveaux = [...cat.matchAll(/\{ id: "([^"]+)", chapitre: \d[^}]*\}/g)].map(x => ({ id: x[1], pret: /pret: true/.test(x[0]) }));
for (const n of niveaux) {
  const existe = fs.existsSync(path.join(racine, "niveaux", n.id + ".js"));
  if (n.pret && !existe) err(`niveau prêt sans script : ${n.id}`);
  if (!n.pret && existe) err(`script présent mais niveau pas marqué prêt : ${n.id}`);
}
for (const f of fs.readdirSync(path.join(racine, "niveaux"))) {
  const id = path.basename(f, ".js");
  if (!niveaux.some(n => n.id === id)) err(`niveaux/${f} absent du catalogue`);
  const src = fs.readFileSync(path.join(racine, "niveaux", f), "utf8");
  if (!src.includes(`id: "${id}"`)) err(`niveaux/${f} : l'id ne correspond pas au nom du fichier`);
}
console.log(`${niveaux.length} niveaux au catalogue, ${niveaux.filter(n => n.pret).length} prêts`);
console.log(`${pages.length} pages, ${concepts.filter(c => c.pret).length} concepts prêts, ${nbMaths} équations vérifiées`);
if (erreurs) { console.error(`${erreurs} erreur(s)`); process.exit(1); }
console.log("vérification statique réussie");
