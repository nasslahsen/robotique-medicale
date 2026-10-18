// Outils communs aux tests dans le navigateur (Chromium piloté par playwright-core).
// Prérequis : un serveur statique à la racine du dépôt (python3 -m http.server 8765)
// et playwright-core installé (npm install --no-save playwright-core). Voir CLAUDE.md, « Vérifier ».
"use strict";
const fs = require("fs"), path = require("path");
const BASE = process.env.BASE || "http://127.0.0.1:8765/";
// RACINE : dossier servi sous BASE (aperçu : RACINE=apercu BASE=http://127.0.0.1:8765/apercu/)
const RACINE = process.env.RACINE ? path.resolve(process.env.RACINE) : path.join(__dirname, "..", "..");
const CAPTURES = path.join(__dirname, "captures");

async function lancer() {
  const { chromium } = require("playwright-core");
  const chemin = process.env.CHROMIUM || ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find(p => fs.existsSync(p));
  return chromium.launch(chemin ? { executablePath: chemin } : {});
}
function dossier(...p) { const d = path.join(CAPTURES, ...p); fs.mkdirSync(d, { recursive: true }); return d; }
// Pages de cours d'un module, d'après le dossier modules/<id>/cours/
function pagesCours(mid) {
  const d = path.join(RACINE, "modules", mid, "cours");
  return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith(".html") && f !== "index.html").map(f => f.replace(".html", "")) : [];
}

module.exports = { BASE, RACINE, lancer, dossier, pagesCours, W: +(process.env.W || 1180), H: +(process.env.H || 820) };
