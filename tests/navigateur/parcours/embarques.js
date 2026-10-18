// Parcours de test du module Systèmes embarqués (assemblage provisoire des parties par chapitre).
"use strict";
const fs = require("fs"), path = require("path");
const tous = {};
const d = path.join(__dirname, "embarques");
for (const f of fs.readdirSync(d).sort()) if (f.endsWith(".js")) Object.assign(tous, require(path.join(d, f)));
module.exports = tous;
