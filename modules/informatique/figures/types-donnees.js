/* Figure : trois types de données, avec un exemple de chaque, et le message FHIR du cours. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-types", {
    largeur: 960, hauteur: 540, titre: "Structuré, semi-structuré, non structuré",
    essai: "<strong>Essaie</strong> : touche chaque type. <strong>Observe</strong> : plus on va vers la droite, plus il faut d'effort pour qu'un programme comprenne la donnée."
  });
  var g = A.s("g", null, f.svg), ch = 0;
  var T = [
    { t: "Structuré", sous: "BD (SGBDR), CSV", coul: C.acc, pale: C.accPale, d: "chaque valeur a sa case fixe (ligne et colonne). Exemple du cours : les données d'identification." },
    { t: "Semi-structuré", sous: "messages d'interopérabilité", coul: C.v, pale: C.vPale, d: "chaque valeur est nommée par une clé ou une balise, mais la forme varie d'un message à l'autre. Exemple du cours : un message HL7 FHIR en JSON ou XML." },
    { t: "Non structuré", sous: "texte libre", coul: C.turq, pale: C.turqPale, d: "ni case ni clé : le sens est dans les mots ou la voix. Exemples du cours : compte rendu, enregistrement vocal." }
  ];
  function exemple(k) {
    var y = 200;
    if (k === 0) {
      A.tableau(g, 120, y, [120, 200, 160, 200], 52, [["ID", "Nom", "Sexe", "Naissance"], ["P-2231", "ALAOUI", "M", "12/05/1957"], ["P-2232", "BENNANI", "F", "03/09/1988"]], { taille: 17 });
    } else if (k === 1) {
      A.s("rect", { x: 120, y: y, width: 720, height: 230, rx: 14, fill: "#15171f" }, g);
      ["{", '  "resourceType": "Observation",', '  "code": {"text": "Tension artérielle"},', '  "valueQuantity": {"value": 122, "unit": "mmHg"}', "}"].forEach(function (l, i) {
        A.texte(g, l, [140, y + 30 + i * 42], { taille: 18, mono: true, ancre: "start", coul: "#e8ecf4", halo: false, gras: 500 });
      });
      A.texte(g, "exemple FHIR du cours", [480, y + 260], { taille: 15, coul: C.doux });
    } else {
      A.boite(g, 120, y, 720, 200, { titre: "« Patient de 68 ans admis pour douleur thoracique. ECG sans sus-décalage. Troponine à contrôler à H+3. Retour à domicile si négative. »", taille: 19, gras: 500, fond: C.fond, bord: C.trait });
      A.icone(g, "document", [80, y + 100], 50, C.doux);
    }
  }
  function dessiner() {
    A.vider(g);
    T.forEach(function (t, k) {
      var on = k === ch;
      A.boite(g, 30 + k * 310, 30, 280, 110, { titre: t.t, sous: t.sous, taille: 22, fond: on ? t.pale : "#fff", bord: on ? t.coul : C.encre, ep: on ? 4.5 : 2.5, coul: on ? t.coul : C.encre });
      A.cible(g, 30 + k * 310, 30, 280, 110, function () { ch = k; dessiner(); });
    });
    A.fleche(g, [40, 165], [920, 165], { ep: 3, coul: C.gris });
    A.texte(g, "de plus en plus difficile à lire pour un programme", [480, 182], { taille: 14, coul: C.doux });
    exemple(ch);
    f.direct.innerHTML = "<strong>" + T[ch].t + "</strong> : " + T[ch].d;
  }
  dessiner();
})();
