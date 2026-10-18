// Carte unique par sous-module et liens entre les étapes, pour un module :
// - chaque carte a une étape par page de cours et par niveau, dans l'ordre cours → exercices, révision et boss en fin de chapitre ;
// - « Passer aux exercices » (barre et bas de page) mène au niveau de la même notion ; arriver en bas marque la page lue ;
// - l'écran de fin d'un niveau mène à l'étape suivante de la carte ;
// - une erreur affiche « Revoir dans le cours », qui ouvre la page de cours par-dessus l'exercice ;
// - « Continuer » (carte et tableau de bord) mène à la première étape pas faite ; les étoiles déjà gagnées restent.
// Lancer : node tests/navigateur/carte.js <module>     (aperçu : RACINE=apercu BASE=http://127.0.0.1:8765/apercu/)
"use strict";
const { BASE, lancer, W, H } = require("./commun");
const mid = process.argv[2];
if (!mid) { console.error("usage : node tests/navigateur/carte.js <module>"); process.exit(2); }

(async () => {
  const b = await lancer();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true });
  const pg = await ctx.newPage();
  const errs = []; pg.on("pageerror", e => errs.push(String(e)));
  let ko = 0;
  const verifier = (ok, msg) => { if (!ok) ko++; console.log((ok ? "ok    " : "ÉCHEC ") + msg); };

  // progression de départ : une étoile gagnée sur le site publié (même clé de stockage)
  await pg.goto(BASE + "index.html", { waitUntil: "networkidle" });
  const plan = await pg.evaluate(mid => new Promise(ok => {
    const s = document.createElement("script"); s.src = PLATEFORME.racine + "modules/" + mid + "/module.js";
    s.onload = () => ok(PLATEFORME.sousModules(mid).filter(x => x.chapitres.length).map(x => ({ sm: x.id, etapes: PLATEFORME.etapes(mid, x.id) })));
    document.body.appendChild(s);
  }), mid);
  const premier = plan[0].etapes.find(x => x.type === "exos");
  await pg.evaluate(([mid, id]) => { localStorage.clear(); localStorage.setItem("s5-progres", JSON.stringify({ [mid]: { niveaux: { [id]: { etoiles: 2 } } } })); }, [mid, premier.id]);

  for (const { sm, etapes } of plan) {
    // ordre de la carte : dans chaque chapitre, cours puis exercices de la même notion ; révision puis boss à la fin
    let ordre = true;
    etapes.forEach((x, i) => {
      if (x.type === "cours" && !(etapes[i + 1] && etapes[i + 1].type === "exos" && etapes[i + 1].id === x.id)) ordre = false;
      if (x.boss && !(etapes[i - 1] && etapes[i - 1].revision)) ordre = false;
      if (x.revision && etapes[i + 1] && etapes[i + 1].chapitre === x.chapitre && !etapes[i + 1].boss) ordre = false;
    });
    verifier(ordre, `${sm || mid} : ordre de la carte (${etapes.length} étapes)`);
    await pg.goto(BASE + `modules/${mid}/index.html?sm=${sm}`, { waitUntil: "networkidle" }); await pg.waitForTimeout(300);
    const carte = await pg.evaluate(() => ({
      noeuds: [...document.querySelectorAll("[data-etape]")].map(a => a.dataset.etape),
      livres: document.querySelectorAll(".noeud-cours").length,
      continuer: (document.getElementById("continuer") || {}).href || "",
      tous: !!document.querySelector(".lien-cours"),
      onglets: !!document.querySelector(".onglets"),
      large: document.documentElement.scrollWidth > innerWidth + 1
    }));
    verifier(carte.noeuds.join() === etapes.map(x => x.type + ":" + x.id).join(), `${sm || mid} : un nœud par étape, dans l'ordre`);
    verifier(carte.livres === etapes.filter(x => x.type === "cours").length, `${sm || mid} : nœuds livre pour les cours (${carte.livres})`);
    verifier(carte.tous && !carte.onglets && !carte.large, `${sm || mid} : lien « Tous les cours », pas d'onglets, pas de défilement horizontal`);
    const attendu = etapes.find(x => !(x.type === "exos" && x.id === premier.id && sm === plan[0].sm));
    verifier(carte.continuer.endsWith(attendu.url), `${sm || mid} : Continuer → ${attendu.url}`);
    // chevauchement des noms sous les nœuds
    const chev = await pg.evaluate(() => {
      const r = [...document.querySelectorAll(".unite .nomn, .unite .forme")].map(e => e.getBoundingClientRect());
      let n = 0;
      for (let a = 0; a < r.length; a++) for (let c = a + 1; c < r.length; c++) {
        const ix = Math.min(r[a].right, r[c].right) - Math.max(r[a].left, r[c].left), iy = Math.min(r[a].bottom, r[c].bottom) - Math.max(r[a].top, r[c].top);
        if (ix > 2 && iy > 2) n++;
      }
      return n;
    });
    verifier(!chev, `${sm || mid} : aucun nom ne chevauche un nœud ou un autre nom`);
  }

  // une notion : cours → exercices → étape suivante
  const etapes = plan[0].etapes, c = etapes.find(x => x.type === "cours");
  if (c) {
    await pg.goto(BASE + c.url, { waitUntil: "networkidle" }); await pg.waitForTimeout(300);
    const haut = await pg.$eval(".site-barre .btn-barre", a => a.getAttribute("href")).catch(() => "");
    const bas = await pg.$eval("nav.suite a.aller", a => a.getAttribute("href")).catch(() => "");
    verifier(haut.endsWith("jouer.html#" + c.id) && bas.endsWith("jouer.html#" + c.id), `cours ${c.id} : « Passer aux exercices » en haut et en bas`);
    const avant = await pg.evaluate(([mid, id]) => PLATEFORME.lu(mid, id), [mid, c.id]);
    await pg.evaluate(() => document.querySelector("nav.suite").scrollIntoView()); await pg.waitForTimeout(400);
    const apres = await pg.evaluate(([mid, id]) => PLATEFORME.lu(mid, id), [mid, c.id]);
    verifier(!avant && apres, `cours ${c.id} : marqué lu en arrivant en bas`);
    // exercices : une erreur, puis le lien vers le cours ; fin du niveau → étape suivante
    await pg.goto(BASE + `modules/${mid}/jouer.html#${c.id}`, { waitUntil: "networkidle" }); await pg.waitForTimeout(900);
    const faux = await pg.$(".etape:not(.sortie) .choix button:not(.bon)");
    let revoir = "";
    for (const bt of await pg.$$(".etape:not(.sortie) .choix button")) {
      await bt.click(); await pg.waitForTimeout(300);
      revoir = await pg.$eval(".etape:not(.sortie) .revoir", a => a.getAttribute("href")).catch(() => "");
      if (revoir) break;
    }
    if (!faux && !revoir) {
      await pg.click('.etape:not(.sortie) .aide-q button >> text="Voir la réponse"');
      await pg.waitForTimeout(1500);
      revoir = await pg.$eval(".etape:not(.sortie) .revoir", a => a.getAttribute("href")).catch(() => "");
    }
    verifier(/^cours\/[^#]+\.html(#.+)?$/.test(revoir), `exercices ${c.id} : « Revoir dans le cours » → ${revoir}`);
    if (revoir) {
      await pg.click(".etape:not(.sortie) .revoir"); await pg.waitForTimeout(1500);
      const fen = await pg.evaluate(() => { const f = document.getElementById("fenetre-cours"); return f && f.classList.contains("on") ? f.querySelector("iframe").getAttribute("src") : ""; });
      verifier(fen.includes("dans=1"), "le cours s'ouvre par-dessus l'exercice");
      await pg.click("#fenetre-cours .btn"); await pg.waitForTimeout(300);
    }
    // finir le niveau avec « Voir la réponse » partout, puis lire le bouton de fin
    const nb = await pg.$$eval("#segments span", s => s.length);
    for (let k = 0; k < nb; k++) {
      await pg.waitForTimeout(500);
      if (!(await pg.$(".etape:not(.sortie) .btn.suite"))) {
        await pg.click('.etape:not(.sortie) .aide-q button >> text="Voir la réponse"').catch(() => {});
        await pg.waitForSelector(".etape:not(.sortie) .btn.suite", { timeout: 6000 }).catch(() => {});
      }
      await pg.click(".etape:not(.sortie) .btn.suite").catch(() => {});
    }
    await pg.waitForTimeout(900);
    const suivant = await pg.$eval("#resultat .btn-suivant", a => a.getAttribute("href")).catch(() => "");
    const i = etapes.findIndex(x => x.type === "exos" && x.id === c.id), att = etapes[i + 1];
    verifier(att && suivant.endsWith(att.url), `fin de ${c.id} : bouton vers l'étape suivante (${att ? att.url : "aucune"})`);
  }

  // tableau de bord : Continuer mène à une étape pas faite, les étoiles gagnées comptent
  await pg.goto(BASE + "index.html", { waitUntil: "networkidle" }); await pg.waitForTimeout(400);
  const tb = await pg.evaluate(mid => {
    const carte = [...document.querySelectorAll(".carte-module")].find(a => a.querySelector(`a[href*="modules/${mid}/"]`));
    return { continuer: carte ? carte.querySelector(".btn-continuer").href : "", progres: carte ? carte.querySelector(".progres b").textContent : "" };
  }, mid);
  const lus = await pg.evaluate(([mid]) => PLATEFORME.continuer(mid).url, [mid]);
  verifier(tb.continuer === lus && /^\d+ \/ \d+$/.test(tb.progres.replace(/\s+/g, " ")), `tableau de bord : Continuer → ${tb.continuer.replace(BASE, "")} (${tb.progres})`);
  verifier(!errs.length, "aucune erreur JavaScript" + (errs.length ? " : " + errs.join(" | ") : ""));
  await b.close();
  console.log(ko ? ko + " vérification(s) en échec" : "carte et liens du module " + mid + " vérifiés");
  process.exit(ko ? 1 : 0);
})();
