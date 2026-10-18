/*
 * Module Biomatériaux : calculs purs partagés par les niveaux, les figures et les tests (tests/biomateriaux/).
 * Chargé dans jouer.html et dans chaque page de cours (window.BIO) ; en Node : require("../../modules/biomateriaux/calculs.js").
 * Notations du cours : σ = F/S0, ε = Δl/l0, ρ = ρc X + ρa (1 − X), ECL = Ef φf + Em φm, 1/ECT = φf/Ef + φm/Em, Ko = Σ an cos⁴θn.
 */
(function (global) {
  "use strict";
  var DEG = Math.PI / 180;

  /* ---------- Rappels de mécanique ---------- */
  // σ = F / S0 (N et mm² donnent des MPa)
  function contrainte(F, S0) { return F / S0; }
  // ε = Δl / l0
  function deformation(dl, l0) { return dl / l0; }
  // E = σ / ε dans le domaine élastique (droite de Hooke)
  function moduleElastique(sigma, eps) { return sigma / eps; }
  // isotrope : G = E / (2 (1 + ν))
  function moduleCisaillement(E, nu) { return E / (2 * (1 + nu)); }
  // ρ = m / V
  function masseVolumique(m, V) { return m / V; }

  /* ---------- Taux de cristallinité ---------- */
  // ρ = ρc X + ρa (1 − X)
  function densiteSemiCristallin(rhoC, rhoA, X) { return rhoC * X + rhoA * (1 - X); }
  // X = (ρ − ρa) / (ρc − ρa)
  function tauxCristallinite(rho, rhoA, rhoC) { return (rho - rhoA) / (rhoC - rhoA); }
  // ρc tiré de ρ = ρc X + ρa (1 − X)
  function densiteCristalline(rho, rhoA, X) { return (rho - rhoA * (1 - X)) / X; }
  // TD 1.2 f : vitesse de cristallisation la plus élevée vers (Tf + Tg) / 2
  function temperatureCristallisationMax(Tg, Tf) { return (Tf + Tg) / 2; }

  /* ---------- Composites (micromécanique de la monocouche unidirectionnelle) ---------- */
  // charge parallèle aux fibres : εCL = εf = εm, ECL = Ef φf + Em φm (loi des mélanges)
  function moduleLongitudinal(Ef, Em, phiF) { return Ef * phiF + Em * (1 - phiF); }
  // charge perpendiculaire : σCT = σf = σm, 1/ECT = φf/Ef + φm/Em
  function moduleTransversal(Ef, Em, phiF) { return 1 / (phiF / Ef + (1 - phiF) / Em); }
  // σCL = σf φf + σm φm, avec σf = Ef ε et σm = Em ε (même déformation)
  function contraintesLongitudinales(Ef, Em, phiF, eps) {
    var sf = Ef * eps, sm = Em * eps;
    return { sf: sf, sm: sm, sc: sf * phiF + sm * (1 - phiF), partFibres: sf * phiF / (sf * phiF + sm * (1 - phiF)) };
  }
  // composite chargé à σ suivant les fibres : ε = σ / ECL, puis σf = Ef ε, σm = Em ε
  function repartitionSousCharge(Ef, Em, phiF, sigma) {
    var E = moduleLongitudinal(Ef, Em, phiF), eps = sigma / E;
    return { E: E, eps: eps, sf: Ef * eps, sm: Em * eps };
  }
  // fraction volumique de fibres d'après la densité du composite : ρ = ρf φf + ρm (1 − φf)
  function fractionFibres(rho, rhoF, rhoM) { return (rho - rhoM) / (rhoF - rhoM); }
  // Ko = Σ an (cos θn)⁴ ; plis : [{ a: fraction, theta: degrés }]
  function coefOrientation(plis) {
    return plis.reduce(function (s, p) { var c = Math.cos(p.theta * DEG); return s + p.a * c * c * c * c; }, 0);
  }
  // ECL = Ko Ef φf + Em φm
  function moduleOriente(Ko, Ef, Em, phiF) { return Ko * Ef * phiF + Em * (1 - phiF); }

  /* ---------- Marché : taux de croissance annuel moyen ---------- */
  // v1 = v0 (1 + t)^n  ->  t = (v1 / v0)^(1/n) − 1
  function croissanceAnnuelle(v0, v1, n) { return Math.pow(v1 / v0, 1 / n) - 1; }
  function projection(v0, t, n) { return v0 * Math.pow(1 + t, n); }

  /* ---------- Fils de verre : masse linéique en tex (10⁻⁶ kg/m = 1 g/km) ---------- */
  function masseFil(tex, longueurM) { return tex * 1e-6 * longueurM * 1000; } // grammes

  /* ---------- Rapport de forme d'un renfort ---------- */
  // quotient de la plus grande et de la plus petite dimension ; groupes du tableau 5.2
  function rapportForme(grande, petite) { return grande / petite; }
  function groupeRenfort(geometrie, rapport) {
    // geometrie : "grain", "plaquette" ou "batonnet" (ce qu'on voit) ; le rapport sépare aiguilles et fibres longues
    if (geometrie === "grain") return "granulaire";
    if (geometrie === "plaquette") return "lamellaire";
    return rapport >= 100 ? "fibrillaire" : "aciculaire";
  }

  /* ---------- Courbe du module de relaxation en fonction de la température ----------
     Modèle qualitatif (formes des courbes du cours), en log10 du module en Pa.
     o : { Tg, verre (log du plateau vitreux, 9,5 ≈ 3 GPa), caout (log du plateau caoutchouteux, 6 = 1 MPa),
           X (taux de cristallinité, 0 à 1), Tf (fusion de la phase cristalline), Tl (début de l'écoulement liquide,
           Infinity pour une masse moléculaire infinie ou un réseau réticulé), larg (largeur des transitions en °C) } */
  function sigmo(u) { return 1 / (1 + Math.exp(-u)); }
  function logModule(T, o) {
    var Tg = o.Tg, verre = o.verre === undefined ? 9.5 : o.verre, caout = o.caout === undefined ? 6 : o.caout;
    var w = o.larg || 6, X = o.X || 0;
    var sg = sigmo((T - Tg) / w);
    var amorphe = caout - 0.0025 * Math.max(0, T - Tg);
    var plateau = amorphe;
    if (X > 0 && o.Tf !== undefined) {
      // phase cristalline dispersée dans une matrice caoutchouteuse : chute à Tg d'autant plus faible que X est grand
      var sc = caout + (verre - 0.25 - caout) * Math.pow(X, 0.55) - 0.0015 * Math.max(0, T - Tg);
      var sf = sigmo((T - o.Tf) / (w * 0.6));
      plateau = sc * (1 - sf) + amorphe * sf;
    }
    var v = (verre - 0.001 * (T - Tg)) * (1 - sg) + plateau * sg;
    if (o.Tl !== undefined && isFinite(o.Tl)) v -= 3.2 * sigmo((T - o.Tl) / (w * 1.2));
    return Math.max(2.5, v);
  }
  // zone de la courbe d'un polymère amorphe (numéros du cours : 0-1, 1-2, 2-3, 3-4, 5)
  function zoneAmorphe(T, Tg, Tl, larg) {
    var w = larg || 6;
    if (T < Tg - 2 * w) return "0-1";
    if (T < Tg + 2 * w) return "1-2";
    if (!isFinite(Tl) || T < Tl - 2 * w) return "2-3";
    if (T < Tl + 2 * w) return "3-4";
    return "5";
  }

  /* ---------- Dessin : chaîne de polymère pseudo-aléatoire (même graine, même chaîne) ---------- */
  function hasard(graine) {
    var a = graine >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  // marche persistante dans le rectangle [x0, x0 + l] × [y0, y0 + h] : n points espacés de pas
  function chaine(graine, n, cadre, pas, raideur) {
    var r = hasard(graine), x = cadre[0] + cadre[2] * (0.2 + 0.6 * r()), y = cadre[1] + cadre[3] * (0.2 + 0.6 * r());
    var a = r() * 2 * Math.PI, pts = [[x, y]], k = raideur === undefined ? 0.7 : raideur;
    for (var i = 1; i < n; i++) {
      a += (r() - 0.5) * 2 * (1.4 - k);
      var nx = x + pas * Math.cos(a), ny = y + pas * Math.sin(a);
      if (nx < cadre[0] || nx > cadre[0] + cadre[2]) { a = Math.PI - a; nx = x + pas * Math.cos(a); }
      if (ny < cadre[1] || ny > cadre[1] + cadre[3]) { a = -a; ny = y + pas * Math.sin(a); }
      x = nx; y = ny; pts.push([x, y]);
    }
    return pts;
  }
  // chemin SVG lissé (courbes de Bézier quadratiques par les milieux)
  function cheminLisse(pts) {
    if (pts.length < 3) return "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L");
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length - 1; i++) {
      var m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      d += " Q" + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1) + " " + m[0].toFixed(1) + " " + m[1].toFixed(1);
    }
    var z = pts[pts.length - 1];
    return d + " L" + z[0].toFixed(1) + " " + z[1].toFixed(1);
  }

  var BIO = {
    DEG: DEG, contrainte: contrainte, deformation: deformation, moduleElastique: moduleElastique, moduleCisaillement: moduleCisaillement, masseVolumique: masseVolumique,
    densiteSemiCristallin: densiteSemiCristallin, tauxCristallinite: tauxCristallinite, densiteCristalline: densiteCristalline,
    temperatureCristallisationMax: temperatureCristallisationMax,
    moduleLongitudinal: moduleLongitudinal, moduleTransversal: moduleTransversal, contraintesLongitudinales: contraintesLongitudinales,
    repartitionSousCharge: repartitionSousCharge, fractionFibres: fractionFibres, coefOrientation: coefOrientation, moduleOriente: moduleOriente,
    croissanceAnnuelle: croissanceAnnuelle, projection: projection, masseFil: masseFil, rapportForme: rapportForme, groupeRenfort: groupeRenfort,
    logModule: logModule, zoneAmorphe: zoneAmorphe, hasard: hasard, chaine: chaine, cheminLisse: cheminLisse
  };
  if (typeof module !== "undefined" && module.exports) module.exports = BIO;
  global.BIO = BIO;
})(typeof window !== "undefined" ? window : globalThis);
