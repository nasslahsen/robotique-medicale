# 2. Caractéristiques techniques et introduction à la robotique médicale

La première moitié de ce cours donne les grandeurs qui servent à décrire et à choisir un robot (DDL, configurations, espace de travail, charge utile, précision, vitesse, temps de cycle). La seconde moitié montre ce qui change quand le robot travaille sur un patient au lieu d'une pièce.

## 5. Principales caractéristiques techniques

Les caractéristiques techniques permettent d'évaluer les capacités et les limites d'un robot : axes et degrés de liberté, espace de travail, charge utile, précision, répétabilité, vitesse et temps de cycle, intégration. Le choix d'un robot dépend de l'ensemble de ces caractéristiques et des exigences du procédé.

### 5-1 Vocabulaire fondamental { #vocabulaire }

| # | Terme | Définition du cours |
|---|---|---|
| 1 | Base | partie fixe qui supporte le robot |
| 2 | Segment | élément mécanique rigide reliant deux articulations |
| 3 | Articulation | liaison mécanique mobile entre deux segments |
| 4 | Axe | direction selon laquelle s'effectue le mouvement de l'articulation |
| 5 | Poignet | ensemble de plusieurs articulations terminales assurant principalement l'orientation de l'effecteur |
| 6 | Effecteur (organe terminal) | outil fixé à l'extrémité du robot pour réaliser la tâche |

L'effecteur dépend de la tâche, de la pièce et du procédé. En industrie : pince de préhension, ventouse, torche de soudage, pistolet de peinture, outil de vissage, caméra d'inspection. En médecine, l'**effecteur médical est un instrument adapté à un geste clinique** : pince chirurgicale (préhension de tissus), ciseaux (section contrôlée), porte-aiguille (suture), caméra endoscopique (visualisation), instrument de biopsie (prélèvement), électrode de coagulation.

### 5-2 Articulation, axe et mouvement

Intuition
{ .etape }

Une articulation relie deux segments et autorise un seul type de mouvement entre eux. Soit elle tourne (comme une charnière de porte), soit elle coulisse (comme un tiroir). L'axe dit autour de quoi elle tourne, ou le long de quoi elle coulisse.

Définitions
{ .etape }

- **Articulation** : liaison mécanique entre deux segments permettant un mouvement relatif.
- **Axe** : direction autour de laquelle une articulation tourne, ou le long de laquelle elle se déplace. Il correspond à un mouvement indépendant commandé par le robot.
- **Articulation rotoïde (R)** : mouvement angulaire autour de l'axe de rotation.
- **Articulation prismatique (P)** : mouvement linéaire le long de l'axe de translation.

Relation entre les notions : l'articulation (relie deux segments) **définit** l'axe (direction du mouvement), qui **produit** le mouvement (déplacement relatif).

Exemples selon la nature du mouvement : robot articulé R-R-R-R-R-R (rotations successives), robot cartésien P-P-P (translations selon X, Y et Z), robot SCARA ou cylindrique R + P (rotation et translation combinées).

**Lecture d'une chaîne robotique** : un robot est une succession de segments reliés par des articulations,

\[
\text{Segment}_i \;\rightarrow\; \text{Articulation}_i \;\rightarrow\; \text{Segment}_{i+1}
\]

### 5-3 Degrés de liberté d'un robot { #ddl }

Intuition
{ .etape }

Compter les degrés de liberté, c'est compter combien de « boutons » indépendants on peut tourner pour faire bouger le robot. Chaque moteur d'articulation est un bouton.

Définition
{ .etape }

> Un degré de liberté représente un mouvement indépendant qu'un système mécanique peut réaliser.

Articulation active → mouvement indépendant → 1 DDL. Une articulation rotoïde a une variable angulaire \(\theta_i\) (1 DDL angulaire) ; une articulation prismatique a une variable linéaire \(d_i\) (1 DDL linéaire). Chaque articulation active contribue généralement à un degré de liberté.

**Pose complète dans l'espace.** L'effecteur peut au maximum :

\[
6 \text{ DDL} = 3 \text{ DDL de position } (x, y, z) + 3 \text{ DDL d'orientation } (R_x, R_y, R_z)
\]

**Distinction importante.** Trois notions liées mais distinctes :

| Notion | Définition | Ce qu'elle décrit |
|---|---|---|
| Nombre d'axes du robot | nombre de mouvements articulaires commandés | ce que le contrôleur commande |
| DDL articulaires | nombre de mouvements indépendants des articulations | ce que chaque articulation peut faire |
| DDL de l'effecteur | nombre de mouvements indépendants réalisables par l'effecteur | ce que l'outil peut réaliser globalement |

Dans un robot sériel simple, les axes motorisés correspondent souvent aux DDL articulaires, mais pas nécessairement aux DDL de l'effecteur.

Exemples du cours
{ .etape }

| Robot | Nombre d'axes | DDL articulaires | DDL de l'effecteur |
|---|---|---|---|
| Cartésien | 3 | 3 translations indépendantes | 3 DDL de position |
| Articulé | 6 | 6 rotations indépendantes | jusqu'à 6 DDL (position + orientation) |
| Redondant | 7 | 7 mouvements indépendants | au maximum 6 DDL, plus 1 DDL de redondance |

Exemple clé : 7 axes articulaires peuvent produire une pose d'effecteur limitée à 6 DDL, avec une redondance.

### 5-4 Configuration articulaire { #config-articulaire }

Intuition
{ .etape }

La configuration articulaire, c'est la « posture » du robot : on la connaît dès qu'on lit la valeur de chaque moteur.

Définition
{ .etape }

> Position et orientation des différents segments du robot les uns par rapport aux autres. Elle est décrite par l'ensemble des variables articulaires du robot.

\[
q = [\,q_1,\; q_2,\; \dots,\; q_n\,]^T
\]

\(q_i\) est la variable articulaire associée à l'articulation \(i\) : elle définit la position d'un segment par rapport au segment précédent. Pour une articulation rotoïde, \(q_i = \theta_i\) ; pour une prismatique, \(q_i = d_i\).

Configuration articulaire = posture relative des segments du robot.

### 5-5 Configuration opérationnelle { #config-operationnelle }

Intuition
{ .etape }

La configuration opérationnelle décrit uniquement ce qui intéresse l'utilisateur : où est l'outil et comment il est tourné, sans se soucier des articulations intermédiaires.

Définition
{ .etape }

> Une configuration opérationnelle décrit la position et l'orientation du corps terminal (effecteur) par rapport au corps de base, indépendamment de la configuration des articulations.

\[
X = [\,x,\; y,\; z,\; \alpha,\; \beta,\; \gamma\,]^T
\qquad
p = [\,x,\; y,\; z\,]^T
\qquad
R = R(\alpha, \beta, \gamma)
\]

3 translations \(x, y, z\) et 3 rotations \(\alpha, \beta, \gamma\). Configuration opérationnelle = position + orientation de l'effecteur.

Le passage de \(q\) à \(X\) est le **modèle géométrique direct** (MGD), annoncé dans les objectifs du module : \(p = f(q)\). Le [cours 4.3](04-description-spatiale/3-transformations-homogenes.md) en donne le premier exemple complet avec le bras plan à deux segments. *(complément)*

Exemple
{ .etape }

Un bras plan à deux pivots a \(q = [\theta_1, \theta_2]^T\). Avec \(\theta_1 = 30°\) et \(\theta_2 = 45°\), l'outil est orienté à \(\theta_1 + \theta_2 = 75°\) dans le plan. Deux postures différentes (coude en haut, coude en bas) peuvent amener la pointe au même point : même position de l'outil, configurations articulaires différentes. *(complément)*

### 5-6 Espace de travail { #espace-de-travail }

> L'espace de travail d'un robot est l'ensemble des positions que peut atteindre son effecteur, pour au moins une configuration de ses articulations, dans le respect des limites articulaires.

Il dépend de l'architecture cinématique, de la longueur des segments, des limites articulaires, de la présence d'obstacles et de l'orientation imposée à l'effecteur. Il se caractérise par les positions accessibles, la frontière de la zone atteignable et le volume accessible.

| Architecture | Forme idéalisée de l'espace de travail |
|---|---|
| Robot cartésien | parallélépipède |
| Robot cylindrique | cylindre |
| Robot polaire | sphère |
| Robot articulé | forme complexe |

Ces formes sont idéalisées : les limites articulaires et les obstacles réduisent la zone accessible.

Exemple
{ .etape }

Bras plan à deux segments \(l_1 = 0{,}4\) m et \(l_2 = 0{,}3\) m, pivots libres sur 360°. Le point le plus loin est atteint bras tendu : \(l_1 + l_2 = 0{,}7\) m. Le plus proche, bras replié : \(|l_1 - l_2| = 0{,}1\) m. L'espace de travail est l'anneau entre ces deux cercles. On peut le visualiser avec la case « Espace de travail » de la [figure du bras](04-description-spatiale/3-transformations-homogenes.md#bras-plan). *(complément)*

### 5-7 Charge utile

> La charge utile est la masse maximale que le robot peut transporter avec son effecteur, tout en conservant ses performances spécifiées.

La masse à prendre en compte est la masse totale transportée : effecteur + pièce + accessoires. Elle dépend de la configuration du robot, de la position de la charge et des conditions de mouvement. Il faut choisir un robot capable de transporter la masse totale requise.

Exemple
{ .etape }

Pince de 1,2 kg, pièce de 2,5 kg, adaptateur et vis de 0,3 kg : masse totale 4,0 kg. Un robot de charge utile 3 kg ne convient pas, même si la pièce seule pèse moins de 3 kg. *(complément)*

### 5-8 Précision et répétabilité { #precision }

Intuition
{ .etape }

Pensez à un joueur de fléchettes. La précision, c'est viser juste (les fléchettes autour du centre). La répétabilité, c'est viser pareil (les fléchettes groupées), même si le groupe est à côté du centre.

Définitions
{ .etape }

- **Précision** : indique si le robot atteint le point demandé. Précision = proximité de la cible (écart entre position atteinte et position demandée).
- **Répétabilité** : capacité du robot à reproduire plusieurs fois le même mouvement et à regrouper ses positions autour d'un même point. Répétabilité = même mouvement + positions peu dispersées.

> Un robot peut être très répétable sans être parfaitement précis.

| Cas | Précision | Répétabilité | Description |
|---|---|---|---|
| A | bonne | bonne | les 5 pièces arrivent près de P |
| B | faible | bonne | les 5 pièces sont regroupées mais décalées de P (écart constant, point atteint P') |
| C | moyenne | faible | positions dispersées autour de P, la moyenne est proche de P |
| D | faible | faible | positions éloignées de P et dispersées |

<div class="widget" data-widget="precision"></div>

Le cas B est fréquent en pratique : un décalage constant peut se corriger par un étalonnage, alors qu'une forte dispersion ne se corrige pas. *(complément)*

### 5-9 Vitesse et temps de cycle { #temps-de-cycle }

**Vitesse d'un robot** : rapidité de déplacement de ses articulations ou de son outil dans l'espace.

| Vitesse | Ce qu'elle mesure | Unité |
|---|---|---|
| Articulaire | déplacement d'un axe du robot | °/s (axes rotatifs), mm/s (axes linéaires) |
| Linéaire du TCP | déplacement de l'outil dans l'espace | mm/s ou m/s |
| Angulaire du TCP | rotation et orientation de l'outil | °/s |
| Instantanée / moyenne | valeur à un instant \(t\) / moyenne sur un trajet | \(v_{moy} = d / t\) |

TCP : *Tool Center Point*, point de référence de l'outil.

**Temps de cycle** : durée nécessaire au robot pour réaliser une opération complète et revenir à son état initial.

\[
T_{cycle} = T_{approche} + T_{prise} + T_{transfert} + T_{dépose} + T_{retour} + T_{synchronisation}
\]

Unité : s/cycle. **Cadence théorique** (cycles par heure) :

\[
N = \frac{3600}{T_{cycle}}
\]

**Relation entre vitesse et temps de cycle.** La vitesse agit sur le temps de déplacement, mais le temps de cycle contient aussi des temps fixes :

\[
T_{cycle} = T_{mouvement} + T_{prise} + T_{dépose} + T_{attente}
\]

Si \(v\) augmente, \(T_{mouvement}\) diminue, donc \(T_{cycle}\) diminue. La vitesse ne supprime pas les temps de prise, de dépose et d'attente.

Exemple du cours : robot pick and place
{ .etape }

Approche 0,30 s ; prise 0,20 s ; transfert 0,55 s ; dépose 0,15 s ; retour 0,45 s ; synchronisation 0,35 s.

\[
T_{cycle} = 0{,}30 + 0{,}20 + 0{,}55 + 0{,}15 + 0{,}45 + 0{,}35 = 2{,}00 \text{ s/cycle}
\]

\[
N = \frac{3600}{2{,}00} = 1800 \text{ cycles/h, soit } 30 \text{ cycles/min}
\]

Cette cadence est théorique : en production, elle est réduite par les arrêts, les défauts, la maintenance et l'alimentation en pièces.

Si l'on double la vitesse, seules l'approche, le transfert et le retour sont divisés par deux :

\[
T_{cycle} = 0{,}15 + 0{,}20 + 0{,}275 + 0{,}15 + 0{,}225 + 0{,}35 = 1{,}35 \text{ s}
\qquad
N \approx 2667 \text{ cycles/h}
\]

La cadence n'est pas doublée. *(complément)*

<div class="widget" data-widget="temps-cycle"></div>

### 5-10 L'intégration du robot

> L'intégration d'un robot consiste à le connecter aux systèmes de commande, de perception et de communication afin d'assurer le fonctionnement coordonné de la cellule robotisée.

Éléments connectés : système de vision (position de la pièce), API (ordres de commande, synchronisation), effecteur, contrôleur du robot (exécution du programme et des trajectoires), réseau industriel (échange des données et des états). Enchaînement : percevoir → commander → exécuter → informer.

Objectifs : communication, sécurité, performance, synchronisation, flexibilité, supervision et maintenance. Une intégration réussie transforme le robot en une cellule coordonnée, sûre et performante.

## V. Introduction à la robotique médicale

### 1. Définition et spécificités

> La robotique médicale constitue une application particulière de la robotique dans laquelle les robots sont utilisés pour assister les professionnels de santé, améliorer la précision des interventions et faciliter la prise en charge des patients.

Robotique médicale = robot + professionnel de santé + patient + environnement clinique.

**Différences entre robotique industrielle et médicale**

| Critère | Robotique industrielle | Robotique médicale |
|---|---|---|
| Environnement | structuré, statique et contrôlé | vivant, variable et non structuré |
| Objet d'intervention | produit ou pièce standardisée | patient variable, tissus déformables |
| Relation avec l'humain | séparation physique, zone d'exclusion | contact direct ou interaction avec le patient |
| Objectif principal | performance, vitesse, cadence | assistance, précision, sécurité |
| Commande | programmée et déterministe | téléopérée, adaptative et supervisée |
| Sécurité | barrières, clôtures, arrêt d'urgence | limitation des forces, détection de collision, sécurité intrinsèque |

Le cours détaille six ruptures. Pour chacune, la conséquence pour la conception :

| Passage | Conséquence |
|---|---|
| Du produit standardisé au patient variable (anatomie différente, mouvements involontaires, respiration, battements cardiaques) | le robot doit intégrer une **perception adaptative** : imagerie en temps réel, recalage anatomique, suivi des mouvements physiologiques |
| De la zone d'exclusion au contact direct | la **sécurité doit être intrinsèque** : limitation des forces et des couples, détection de collision, arrêt instantané, redondance des capteurs |
| De la précision géométrique à la précision biomécanique (repère cartésien → repère anatomique) | la précision doit suivre l'anatomie : repérage par imagerie, suivi du mouvement physiologique, asservissement visuel |
| De la reprogrammation à la décision assistée | le rôle de l'humain change : il ne programme plus en amont, il supervise et pilote pendant l'acte, avec une responsabilité clinique directe |
| De la fiabilité économique à la fiabilité vitale | développement et validation plus longs : essais cliniques, certification stricte (dispositif médical souvent classe III ; ISO 13485, IEC 60601, ISO 14971 au lieu de l'ISO 10218), traçabilité obligatoire, erreur souvent irréversible |
| De l'environnement contrôlé à l'environnement contraint | matériaux, actionneurs et conception repensés : stérilisation ou usage unique, biocompatibilité, compatibilité IRM (actionneurs piézoélectriques, pas de matériau ferromagnétique), surfaces lisses sans zone de rétention bactérienne |

Les mêmes technologies, mais de nouvelles exigences. Cinq axes de rupture à repenser : **perception, sécurité, commande, précision, validation**.

Le changement de repère cartésien → anatomique est exactement l'outil mathématique du [cours 4](04-description-spatiale/2-reperes-orientation.md) : repère patient {P}, repère outil {T} et matrices qui les relient.

**Objectifs de la robotique médicale** : assister (soutenir le professionnel et le patient), diagnostiquer (détecter et caractériser une pathologie), traiter (intervenir avec précision), rééduquer (restaurer les fonctions motrices).

**Exigences fondamentales** : précision (geste ciblé et exact), sécurité (contrôler le contact, les forces, les collisions), fiabilité (fonctionnement sûr et traçable), interaction avec l'humain (coopérer avec le praticien, respecter le patient).

### 2. Historique

| Date | Robot | Étape |
|---|---|---|
| 1985 | PUMA 200 (industriel) | première biopsie cérébrale stéréotaxique guidée par scanner CT |
| 1992 | ROBODOC | première utilisation humaine pour une arthroplastie totale de la hanche |
| 1994–1996 | AESOP | porte-endoscope robotisé, commande vocale en 1996 |
| 1997–2000 | da Vinci | FDA : assistance en 1997, chirurgie laparoscopique en 2000 |
| 1998–2001 | ZEUS | premières applications cliniques, autorisation FDA 510(k) en 2001 |
| 2001 | Opération Lindbergh | première téléchirurgie transatlantique (New York – Strasbourg) |
| 2010–aujourd'hui | Mako, ROSA, Lokomat, exosquelettes, micro-robots | maturation, diversification, intelligence artificielle |

Évolution : assistance → précision → téléchirurgie → rééducation et intelligence artificielle.

### 3. Classification des robots médicaux

Quatre critères complémentaires et indépendants ; un même robot peut appartenir à plusieurs catégories.

**3-1 Domaine d'application** (rôle principal dans le parcours de soins) : robots chirurgicaux ; robots de rééducation ; exosquelettes et orthèses robotisées ; robots d'assistance et de mobilité ; robots de diagnostic et de navigation ; robots de téléprésence ; robots logistiques hospitaliers.

**3-2 Niveau d'autonomie** (part de contrôle humain et part de décision du robot) :

| Niveau | Principe |
|---|---|
| Téléopérés | le praticien commande directement le robot à distance |
| Programmés / automatisés | le robot exécute une séquence définie à l'avance |
| Adaptatifs | le robot ajuste son comportement à partir des capteurs et des données du patient |
| Autonomes supervisés | le robot prend certaines décisions sous la surveillance et la validation du professionnel |

Plus l'autonomie augmente, plus le robot agit sans commande humaine continue ; la supervision du professionnel reste essentielle en médecine.

**3-3 Mode d'interaction avec l'humain** : sans contact (le robot observe, guide ou communique) ; contact externe (agit sur le corps sans pénétrer les tissus) ; interaction invasive (intervient à l'intérieur du corps ou à travers les tissus) ; co-manipulation avec le praticien (le praticien et le robot réalisent ensemble le geste). Ce mode détermine les exigences de sécurité, de commande, de stérilité et de protection du patient.

**3-4 Fonction médicale** : assister, diagnostiquer, traiter, rééduquer. Un robot peut remplir plusieurs fonctions mais est généralement classé selon sa fonction principale.

### 4. Interfaces homme-machine (IHM) en contexte médical

> Une interface homme-machine (IHM) est l'ensemble des moyens qui permettent à un professionnel de santé ou à un patient d'interagir avec un système robotisé médical.

Elle sert à commander, observer et superviser. Le praticien reste « dans la boucle » et garde la maîtrise du geste. Une mauvaise IHM peut entraîner des erreurs médicales (mauvaise interprétation d'une image, retard de réaction) ; une bonne IHM doit être intuitive, fiable et transparente.

| Forme d'IHM | Principe | Exemple | Avantages | Limites |
|---|---|---|---|---|
| Téléopération (maître-esclave) | le chirurgien commande les instruments à distance depuis une console | da Vinci | ergonomie, vision 3D HD, atténuation des tremblements, mise à l'échelle (1 cm → 3 mm) | retour haptique limité, encombrement, coût |
| Co-manipulation (guidage actif) | chirurgien et robot manipulent ensemble l'instrument ; barrière virtuelle autour de la zone planifiée | Mako (prothèses genou, hanche) | guidage précis, respect de la zone planifiée, contrôle direct | recalage image-patient indispensable ; erreur de recalage = guidage inexact |
| Haptique | restitue les sensations de contact (tactile : texture ; kinesthésique : force, rigidité) | simulateur chirurgical à retour d'effort | perception des contacts, limitation des forces, entraînement | capteurs à miniaturiser, bruit ou retard, coût |
| Multimodale | commande vocale ou gestuelle sans toucher | zoom vocal, défilement d'images IRM par geste | moins de contacts, accès rapide aux images | bruit du bloc, gestes mal reconnus |
| Immersive | RV : planification et formation ; RA : guidage peropératoire | modèle 3D superposé à la vue réelle | compréhension spatiale, entraînement sans risque | recalage en temps réel, déformation des tissus, protection des données |
| Cerveau-machine (BCI) | traduit l'activité cérébrale en commandes (acquisition, décodage, action) | BrainGate | communication assistée, autonomie des personnes paralysées | chirurgie des implants, fiabilité, confidentialité des données neuronales |

**Enjeux des IHM médicales** : clarté (afficher l'essentiel au bon moment), ergonomie et adaptation (au chirurgien, au thérapeute, au patient), précision et fidélité (calibrage, filtrage des tremblements), réactivité (maîtriser la latence totale), sécurité (alertes visibles, état sûr en cas de panne), cybersécurité (chiffrement, authentification, mises à jour).

### 5. Écosystème de la robotique médicale

L'écosystème regroupe les acteurs, compétences et infrastructures nécessaires pour concevoir, évaluer, installer, utiliser et maintenir un système robotique médical :

| Acteur | Contribution |
|---|---|
| Patients et professionnels de santé | expriment les besoins, évaluent et utilisent le dispositif |
| Ingénieurs et chercheurs | conçoivent mécanismes, capteurs, commandes, logiciels et IHM |
| Fabricants et fournisseurs | produisent les dispositifs et assurent le support technique |
| Hôpitaux et centres de simulation | intègrent les robots aux soins et forment les équipes |
| Autorités et organismes de normalisation | encadrent l'évaluation et la sécurité des dispositifs |

**International.** Marché estimé à plus de 16 milliards de dollars, tiré par la précision, la réduction du temps d'hospitalisation et les chirurgies mini-invasives. Trois segments : tissus mous (Intuitive Surgical : da Vinci, Ion ; Medtronic : Hugo RAS), orthopédie et rachis (Stryker : MAKO ; Zimmer Biomet : ROSA ; Globus Medical : ExcelsiusGPS), intervention vasculaire (Siemens Healthineers / Corindus : CorPath GRX). Tendances : IA et big data, miniaturisation (capsules, micro-robots), téléchirurgie 5G/6G. Pôles : Amérique du Nord (logiciel, IA, start-up), Europe (mécanique de précision, recherche clinique), Asie (production à grande échelle, robots d'assistance).

**Maroc.** Adoption clinique croissante dans les CHU (Casablanca, Rabat, Marrakech) et les cliniques privées (urologie, gynécologie, chirurgie viscérale, orthopédie) ; montée des filières d'ingénierie biomédicale et de la simulation médicale ; start-up MedTech dans les technoparcs ; rôle croissant de l'AMMPS dans l'enregistrement des dispositifs médicaux robotisés. Défis : coût (CAPEX et OPEX), ressources humaines (ingénieurs biomédicaux, techniciens certifiés), réglementation. Opportunités : hub de formation régional, maintenance et ingénierie clinique, télémédecine et 5G.

## Formules clés

\[
q = [\,q_1, \dots, q_n\,]^T,\quad q_i = \theta_i \text{ (R) ou } d_i \text{ (P)}
\qquad
X = [\,x, y, z, \alpha, \beta, \gamma\,]^T
\]

\[
6 \text{ DDL} = 3 \text{ (position)} + 3 \text{ (orientation)}
\]

\[
T_{cycle} = T_{approche} + T_{prise} + T_{transfert} + T_{dépose} + T_{retour} + T_{synchronisation}
\qquad
N = \frac{3600}{T_{cycle}} \text{ cycles/h}
\qquad
v_{moy} = \frac{d}{t}
\]

## Questions d'auto-évaluation

1. Quelle différence y a-t-il entre une articulation, un axe et un segment ?

    <details markdown><summary>Réponse</summary>
    Le segment est l'élément rigide ; l'articulation est la liaison mobile entre deux segments ; l'axe est la direction autour de laquelle l'articulation tourne (R) ou le long de laquelle elle coulisse (P).
    </details>

2. Un robot a 7 axes. Combien de DDL peut avoir son effecteur dans l'espace ? Pourquoi ?

    <details markdown><summary>Réponse</summary>
    Au maximum 6 : 3 de position et 3 d'orientation. Le 7<sup>e</sup> axe donne une redondance (plusieurs postures pour la même pose de l'outil), pas un DDL supplémentaire de l'effecteur.
    </details>

3. Écrivez la configuration articulaire d'un robot RRP et sa configuration opérationnelle.

    <details markdown><summary>Réponse</summary>
    \(q = [\theta_1, \theta_2, d_3]^T\). La configuration opérationnelle est \(X = [x, y, z, \alpha, \beta, \gamma]^T\) (position et orientation de l'effecteur), indépendante de la façon dont les articulations sont placées.
    </details>

4. Donnez la définition de l'espace de travail et trois facteurs dont il dépend.

    <details markdown><summary>Réponse</summary>
    Ensemble des positions que peut atteindre l'effecteur pour au moins une configuration des articulations, dans le respect des limites articulaires. Il dépend de l'architecture cinématique, de la longueur des segments, des limites articulaires, des obstacles et de l'orientation imposée à l'effecteur.
    </details>

5. Un robot pose 5 pièces toutes regroupées à 2 mm du point demandé. Est-il précis ? répétable ?

    <details markdown><summary>Réponse</summary>
    Répétable (positions peu dispersées) mais peu précis (écart constant à la cible) : c'est le cas B du cours.
    </details>

6. Un cycle dure 0,40 + 0,25 + 0,60 + 0,25 + 0,50 + 0,40 s. Calculez le temps de cycle et la cadence théorique.

    <details markdown><summary>Réponse</summary>
    \(T_{cycle} = 2{,}40\) s/cycle ; \(N = 3600 / 2{,}40 = 1500\) cycles/h, soit 25 cycles/min.
    </details>

7. Pourquoi doubler la vitesse d'un robot ne double-t-il pas sa cadence ?

    <details markdown><summary>Réponse</summary>
    La vitesse ne réduit que le temps de mouvement. Les temps de prise, de dépose et d'attente (synchronisation) restent identiques.
    </details>

8. Citez trois différences entre robotique industrielle et médicale, avec leur conséquence pour la conception.

    <details markdown><summary>Réponse</summary>
    Patient variable au lieu d'une pièce standard → perception adaptative (imagerie, recalage). Contact direct au lieu d'une zone d'exclusion → sécurité intrinsèque (limitation des forces, détection de collision). Fiabilité vitale → certification stricte, essais cliniques, traçabilité. (On peut aussi citer l'environnement contraint : stérilité, biocompatibilité, compatibilité IRM.)
    </details>

9. Classez le Mako selon le mode d'interaction et la fonction médicale.

    <details markdown><summary>Réponse</summary>
    Interaction : co-manipulation avec le praticien (le chirurgien et le robot tiennent ensemble l'instrument, le robot guide le geste par une barrière virtuelle). Fonction : traiter (pose de prothèses de genou et de hanche). Domaine : robot chirurgical (orthopédie).
    </details>

10. Quel est le principal risque d'une interface de co-manipulation ?

    <details markdown><summary>Réponse</summary>
    Le recalage image-patient : si le modèle 3D préopératoire est mal recalé sur l'anatomie réelle, le guidage et la barrière virtuelle sont inexacts.
    </details>
