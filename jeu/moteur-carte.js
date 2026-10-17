/* Carte des niveaux : chapitres, chemin, étoiles, déblocage. */
(function () {
  "use strict";
  var CLE = "rm-progres", TOUT = "rm-tout";
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || "{}") || {}; } catch (e) { return {}; } }
  function tout() { try { return localStorage.getItem(TOUT) === "1"; } catch (e) { return false; } }
  var ETOILE = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8z" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var prog = lire(), libre = tout(), liste = CATALOGUE.niveaux;

  // Statut de chaque niveau : un niveau prêt s'ouvre quand le niveau prêt précédent est fini.
  var precedentFini = true, suivant = null, total = 0, max = 0;
  var statut = liste.map(function (n) {
    if (!n.pret) return "bientot";
    max += 3;
    var fait = !!prog[n.id];
    if (fait) total += prog[n.id].etoiles || 0;
    var ouvert = libre || precedentFini || fait;
    precedentFini = fait;
    if (fait) return "fait";
    if (ouvert && !suivant) { suivant = n; return "suivant"; }
    return ouvert ? "ouvert" : "ferme";
  });
  document.getElementById("total").textContent = total + " / " + max;
  document.getElementById("total-sous").textContent = "étoiles gagnées";

  if (suivant) {
    var r = document.getElementById("reprendre");
    var a = E.h("a", "btn", (total ? "Continuer : " : "Commencer : ") + suivant.titre, r);
    a.href = "jouer.html#" + suivant.id; a.style.cssText = "display:inline-flex;align-items:center;text-decoration:none";
  }

  var zone = document.getElementById("chapitres"), numero = 0;
  CATALOGUE.chapitres.forEach(function (ch) {
    var sec = E.h("section", "chapitre", "", zone); sec.id = "ch" + ch.id;
    E.h("header", "", '<span class="num">CHAPITRE ' + ch.id + '</span><h2>' + ch.titre + "</h2><p>" + ch.sous + "</p>", sec);
    var chemin = E.h("div", "chemin", "", sec);
    var trace = E.s("svg", { class: "trace" }, chemin);
    var grille = E.h("div", "noeuds", "", chemin);
    var noeuds = [];
    liste.forEach(function (n, i) {
      if (n.chapitre !== ch.id) return;
      if (!n.boss && !n.revision) numero++;
      var st = statut[i], k = noeuds.length, rangee = Math.floor(k / 4), col = rangee % 2 === 0 ? k % 4 : 3 - (k % 4);
      var el = E.h(st === "ferme" || st === "bientot" ? "div" : "a", "noeud " + st + (n.boss ? " boss" : "") + (n.revision ? " revision" : ""), "", grille);
      el.style.gridRow = rangee + 1; el.style.gridColumn = col + 1;
      if (st !== "ferme" && st !== "bientot") el.href = "jouer.html#" + n.id;
      E.h("div", "rond", n.boss ? "<span>BOSS</span>" : n.revision ? "<span>RÉV</span>" : String(numero), el);
      E.h("div", "nomn", n.titre, el);
      if (st === "bientot") E.h("div", "bientot-txt", "bientôt", el);
      else {
        var nb = prog[n.id] ? prog[n.id].etoiles || 0 : 0, h = "";
        for (var s = 0; s < 3; s++) h += '<span class="' + (s < nb ? "pleine" : "vide") + '">' + ETOILE + "</span>";
        E.h("div", "mini", h, el);
      }
      noeuds.push(el);
    });
    // chemin qui relie les niveaux dans l'ordre
    function relier() {
      E.vider(trace);
      var b0 = chemin.getBoundingClientRect();
      var pts = noeuds.map(function (el) { var b = el.querySelector(".rond").getBoundingClientRect(); return [b.left + b.width / 2 - b0.left, b.top + b.height / 2 - b0.top]; });
      if (pts.length < 2) return;
      var d = "M" + pts[0];
      for (var k = 1; k < pts.length; k++) {
        var a = pts[k - 1], b = pts[k];
        d += a[1] === b[1] ? " L" + b : " C" + [a[0] + (k % 8 === 4 ? 90 : -90), a[1]] + " " + [b[0] + (k % 8 === 4 ? 90 : -90), b[1]] + " " + b;
      }
      E.s("path", { d: d, fill: "none", stroke: "#d9dde6", "stroke-width": 8, "stroke-linecap": "round", "stroke-dasharray": "2 16" }, trace);
    }
    requestAnimationFrame(relier);
    addEventListener("resize", relier);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relier);
  });

  // fin de la carte : la suite du cours viendra ici
  var fini = liste.every(function (n, i) { return !n.pret || statut[i] === "fait"; });
  var suite = E.h("section", "chapitre a-venir", "", zone);
  E.h("header", "", '<span class="num">LA SUITE</span><h2>Prochains chapitres</h2>', suite);
  E.h("div", "a-venir-carte", (fini ? "<b>Tout le cours actuel est terminé.</b> " : "") + "Les chapitres suivants s'ajouteront ici, au fil du cours.", suite);

  var bT = document.getElementById("tout");
  bT.textContent = libre ? "Remettre le déblocage dans l'ordre" : "Tout débloquer";
  bT.addEventListener("click", function () { try { localStorage.setItem(TOUT, libre ? "0" : "1"); } catch (e) { /* rien */ } location.reload(); });
  document.getElementById("effacer").addEventListener("click", function () {
    if (!confirm("Effacer toutes tes étoiles et ta progression ?")) return;
    try { localStorage.removeItem(CLE); } catch (e) { /* rien */ }
    location.reload();
  });
  if (location.hash) { var cible = document.querySelector(location.hash); if (cible) cible.scrollIntoView(); }
})();
