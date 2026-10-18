// Parcours de test du module Biomatériaux : pour chaque niveau, la suite de gestes qui le réussit sans erreur.
// Un fichier par chapitre dans parcours/biomateriaux/ (ch0.js ... ch7.js), réunis ici.
// Lancer : node tests/navigateur/jouer.js biomateriaux [id ...]
"use strict";
const fs = require("fs"), path = require("path");
const tous = {};
const d = path.join(__dirname, "biomateriaux");
for (const f of fs.readdirSync(d).filter(f => f.endsWith(".js")).sort()) Object.assign(tous, require("./biomateriaux/" + f));
module.exports = tous;
