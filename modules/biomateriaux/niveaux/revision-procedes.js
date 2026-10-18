/* Révision du chapitre 7 : les procédés mélangés dans des situations nouvelles. Atelier de pièces, matière, indices, cycle. */
NIVEAU({
  id: "revision-procedes",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { surligne: null };
    // ligne de production schématique : six postes, un par procédé
    var POSTES = [["e", "extrusion", "profilé continu"], ["i", "injection", "petit point"], ["s", "soufflage", "fond du contenant"], ["r", "rotomoulage", "creux, sans soudure"], ["t", "thermoformage", "découpe au pourtour"], ["c", "compression", "bavure"]];
    n.dessin = function () {
      E.vider(g);
      D.texte(g, "Les six procédés et leur indice", [340, 100], { taille: 20 });
      POSTES.forEach(function (p, k) {
        var x = 130 + (k % 2) * 290, y = 180 + Math.floor(k / 2) * 150, on = n.surligne === p[0];
        E.s("rect", { x: x - 110, y: y - 52, width: 262, height: 112, rx: 16, fill: on ? PLATEFORME.teinte(0.16) : "#fff", stroke: on ? C.jeu : "#d9dde6", "stroke-width": 3 }, g);
        D.rond(g, [x - 66, y + 4], 26, { fill: on ? C.jeu : "#eef0f5", stroke: C.encre, ep: 2.5 });
        D.texte(g, String(k + 1), [x - 66, y + 5], { taille: 19, coul: on ? "#fff" : C.encre, fond: false });
        D.texte(g, p[1], [x - 26, y - 10], { taille: 19, ancre: "start" });
        D.texte(g, p[2], [x - 26, y + 20], { taille: 15, coul: C.doux, gras: false, ancre: "start" });
      });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La poche à urine", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Exemple ajouté : une poche souple à usage médical est faite d'un film de PVC plastifié, mince et sans fin, enroulé sur bobine. Quel procédé produit ce film ?");
      j.choix([
        { html: "Extrusion-gonflage", juste: true },
        { html: "Rotomoulage", aide: "Le rotomoulage donne des pièces creuses rigides, une à une, avec un cycle long : pas un film sur bobine." },
        { html: "Injection", aide: "L'injection donne des pièces finies dans un moule fermé, une à la fois, pas un film continu." }
      ], { colonnes: 1, ok: function () {
        n.surligne = "e"; n.dessin();
        j.bravo("Une bulle de pellicule aplatie et enroulée.");
        j.expliquer("<p>L'extrusion-gonflage est une variante de l'extrusion : le tube sortant de la filière est gonflé d'air, refroidi, aplati et enroulé sur des bobines.</p>");
        j.suite();
      } });
    } },
    { nom: "Associer les indices", jouer: function (j, n) {
      n.surligne = null; n.dessin();
      j.titre("On te montre seulement l'indice laissé sur la pièce. Retrouve le procédé.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:center">' +
        [["Point d'injection au fond du contenant", "is"], ["Ligne de soudure au fond", "es"], ["Pièce creuse de toute dimension, cycle long", "r"], ["Petit point, pièce prête à l'emploi", "i"]].map(function (q) { return "<span>" + q[0] + '</span><span class="trou" data-attendu="' + q[1] + '" style="min-width:190px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "i", html: "Injection" }, { id: "r", html: "Rotomoulage" }, { id: "es", html: "Extrusion-soufflage" }, { id: "is", html: "Injection-soufflage" }],
        aide: "Au fond d'un contenant soufflé : un point si la préforme était injectée, une ligne si c'était un tube extrudé.",
        ok: function () {
          j.bravo("Quatre indices, quatre procédés.");
          j.expliquer("<p>Les indices viennent du chemin de la matière : un seuil laisse un point, un tube pincé laisse une ligne, un moule qui tourne ne laisse aucune soudure.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Thermoplastique ou thermodurcissable ?", jouer: function (j, n) {
      j.titre("Une pièce en résine phénolique (thermodurcissable). Quel procédé du cours lui convient ?");
      j.choix([
        { html: "Le thermoformage", aide: "Il faut une feuille qui se ramollit quand on la chauffe : c'est le comportement d'un thermoplastique." },
        { html: "Le moulage par compression, avec maintien jusqu'à la fin de la cuisson", juste: true },
        { html: "L'extrusion-gonflage", aide: "On gonfle un tube encore mou ; un thermodurcissable réticulé ne se ramollit plus." }
      ], { colonnes: 1, ok: function () {
        n.surligne = "c"; n.dessin();
        j.bravo("Compression, cuisson comprise.");
        j.expliquer("<p>La compression (et la compression-transfert) prévoit un maintien de la chauffe et de la pression jusqu'à la fin de la cuisson (réticulation) : c'est fait pour les thermodurcissables, comme les plateaux moulés du cours.</p>");
        j.suite();
      } });
    } },
    { nom: "Le cycle mélangé", jouer: function (j, n) {
      n.surligne = "s"; n.dessin();
      j.titre("Injection-soufflage d'un flacon de collyre : remets les étapes dans l'ordre.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        ["p", "c", "a", "d"].map(function (id, k) { return "<b>" + (k + 1) + '</b><span class="trou" data-attendu="' + id + '" style="justify-content:flex-start"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "Air comprimé contre les parois" }, { id: "x", html: "Extruder un tube" }, { id: "p", html: "Injecter une préforme" }, { id: "d", html: "Démouler le flacon" }, { id: "c", html: "Chauffer la préforme" }],
        aide: "En injection-soufflage, pas de tube extrudé : on part d'une préforme injectée.",
        ok: function () {
          j.bravo("Préforme, chauffe, air, démoulage.");
          j.expliquer("<p>Le jeton « Extruder un tube » appartient à l'extrusion-soufflage. Les deux soufflages ne diffèrent que par la façon d'obtenir l'ébauche : préforme injectée ou tube extrudé.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi pas ?", jouer: function (j, n) {
      n.surligne = "r"; n.dessin();
      j.titre("Pourquoi ne fabrique-t-on pas des bouchons de flacon par rotomoulage ?");
      j.choix([
        { html: "Le temps de cycle est assez long : pour des millions de petites pièces, ce n'est pas rentable", juste: true },
        { html: "Le rotomoulage ne fonctionne qu'avec des métaux", aide: "La matière du rotomoulage est une poudre de plastique." },
        { html: "Le rotomoulage laisse une ligne de soudure", aide: "Au contraire : il donne des pièces creuses sans soudure ni collage." }
      ], { colonnes: 1, ok: function () {
        j.bravo("C'est une question de rentabilité.");
        j.expliquer("<p>Pour des bouchons, le cours cite l'injection : cycle court, pièce prête à l'emploi. Le rotomoulage est fait pour les pièces creuses, même très grandes : citernes, kayaks, réservoirs.</p>");
        j.suite();
      } });
    } }
  ]
});
