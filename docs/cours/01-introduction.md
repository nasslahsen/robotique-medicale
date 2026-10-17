# 1. Introduction générale et domaines d'application de la robotique

Ce premier cours pose le vocabulaire : ce qu'est un robot, comment il fonctionne, comment on classe les robots et de quoi est fait un système robotisé industriel. Il n'y a pas encore de calcul ; l'objectif est de savoir décrire et classer un robot avec les bons mots.

## Le module de robotique médicale

Le génie biomédical réunit les sciences de l'ingénieur, les sciences médicales et les technologies de santé pour concevoir des solutions pour la santé. La robotique médicale en est une application spécialisée : elle mobilise les capteurs, l'instrumentation médicale, l'automatique, la commande, la biomécanique, le traitement des images et des signaux, les systèmes embarqués et l'intelligence artificielle.

Le module étudie des systèmes robotiques capables de **percevoir** leur environnement, de **traiter** les informations recueillies et d'**agir** avec précision en contexte clinique, afin d'assister les professionnels de santé et d'améliorer la prise en charge des patients.

Objectifs annoncés pour l'élément « Robotique biomédicale » :

| # | Objectif | Contenu |
|---|---|---|
| 1 | Maîtriser les fondamentaux | principes, terminologie, concepts de base de la robotique et de la mécatronique appliqués au médical |
| 2 | Modélisation mathématique | cinématique (MGD et MGI), matrice jacobienne, modèles statique et dynamique, centre de rotation déporté (RCM) |
| 3 | Architecture mécatronique | actionneurs, capteurs, unités de commande, IHM, imagerie et navigation |
| 4 | Applications cliniques | chirurgie, diagnostic, rééducation, logistique hospitalière |
| 5 | Simulation et prototypage | ROS, MATLAB/Simulink, mini-projet |

La partie « modélisation » s'écrit avec deux relations que l'on retrouvera plus tard : \(p = f(q)\) (la position de l'outil est une fonction des variables articulaires) et \(\dot{x} = J(q)\,\dot{q}\) (les vitesses sont reliées par la matrice jacobienne).

## I. Introduction générale à la robotique

### 1. Définition de la robotique

Intuition
{ .etape }

La robotique n'est pas une seule discipline : construire un robot demande de la mécanique pour la structure, de l'électronique pour les moteurs et les capteurs, de l'informatique pour le programme et des mathématiques pour calculer les mouvements.

Définition du cours
{ .etape }

> La robotique est un domaine pluridisciplinaire consacré à l'étude, la conception, la réalisation, la programmation, la commande et l'utilisation des robots.

Elle est à l'intersection de l'ingénierie électrique et mécanique, de la science des matériaux, des mathématiques, de l'informatique, des sciences cognitives et de la biologie.

Les six activités de la robotique :

1. **Étude** : analyse des besoins, compréhension des problèmes, modélisation et simulation.
2. **Conception** : conception du robot et de ses composants (mécaniques, électriques, électroniques, logiciels).
3. **Réalisation** : fabrication, assemblage et intégration des composants.
4. **Programmation** : écriture des programmes et algorithmes qui décrivent les tâches.
5. **Commande** : pilotage et contrôle des mouvements, traitement des informations issues des capteurs.
6. **Utilisation** : mise en service et exploitation du robot dans des applications industrielles ou de service.

### 2. Notion de robot

Le cours compare trois définitions.

- **Larousse** : (1) dans la science-fiction, machine à l'aspect humain capable de se mouvoir, d'exécuter des opérations, de parler ; (2) appareil automatique capable de manipuler des objets ou d'exécuter des opérations selon un programme fixe, modifiable ou adaptable. Synonyme : automate.
- **Wikipédia** : un robot est un **dispositif mécatronique** (mécanique, électronique et informatique) conçu pour accomplir automatiquement des tâches imitant ou reproduisant, dans un domaine précis, des actions humaines.
- **Définition retenue dans le cours** :

> Un robot est un système **programmable** capable d'exécuter des **actions** dans son **environnement** afin d'accomplir une **tâche** donnée, de manière automatique, semi-autonome ou sous le contrôle d'un opérateur.

Les quatre mots clés à retenir : programmable, action, environnement, tâche.

Exemple
{ .etape }

Un lave-vaisselle exécute un programme, mais il n'agit pas sur son environnement par des mouvements adaptés à une tâche de manipulation : on ne le classe pas comme robot. Un bras qui saisit des tubes de prélèvement et les place dans une centrifugeuse coche les quatre mots clés : il est programmable, il agit (saisir, déplacer), dans un environnement (le laboratoire), pour une tâche (préparer les échantillons). *(complément)*

### 3. Principe général de fonctionnement d'un robot

Intuition
{ .etape }

Un robot fonctionne en boucle, comme un humain qui fait un geste : il regarde, réfléchit, décide, bouge, puis regarde à nouveau le résultat.

Les quatre actions essentielles
{ .etape }

| Étape | Rôle | Moyens |
|---|---|---|
| 1. Percevoir | acquérir des informations sur l'environnement et sur son propre état | capteurs (entrées) |
| 2. Traiter | traiter les informations reçues | système de commande : ordinateur, API |
| 3. Décider | analyser les données et choisir une action selon le programme et la situation | plan d'action |
| 4. Agir | exécuter l'action décidée | actionneurs (sorties) |

Le résultat de l'action modifie l'environnement, qui fournit de nouvelles informations : c'est l'**interaction avec l'environnement**, qui referme la boucle.

> **Idée clé** : un robot est un système programmable qui perçoit son environnement grâce à ses capteurs, traite les informations, agit sur cet environnement et interagit en permanence avec lui.

### 4. Caractère multidisciplinaire

| Discipline | Apport à la robotique |
|---|---|
| Ingénierie mécanique | conception mécanique, cinématique, dynamique, structures, vibrations |
| Ingénierie électrique et électronique | actionneurs, capteurs, électronique de puissance, interfaces, réseaux |
| Informatique | programmation, algorithmes, intelligence artificielle, vision, systèmes embarqués |
| Mathématiques | algèbre linéaire, calcul différentiel, optimisation, modélisation, automatique |
| Science des matériaux | matériaux structurels et avancés, légèreté, résistance, fiabilité |
| Sciences cognitives et biologie | perception, apprentissage, interaction, inspiration du vivant |

L'algèbre linéaire (vecteurs, matrices) est l'outil principal des cours 3 et 4 ; voir les [Rappels](../rappels.md).

## II. Bref historique

| Date | Étape |
|---|---|
| 1920 | Naissance du mot « robot » dans la pièce *R.U.R.* de Karel Čapek |
| 1942 | Isaac Asimov emploie et popularise le terme « robotique » |
| 1954 | George Devol dépose le brevet du premier manipulateur programmable |
| 1961 | Unimate, premier robot industriel, chez General Motors (manutention) |
| 1970–1980 | Robots articulés et SCARA, capteurs, actionneurs, langages de programmation |
| 1990–2000 | Robots plus rapides et précis, vision industrielle, diversification des applications |
| 2000–2010 | Robots mobiles (AGV, AMR), robots collaboratifs (cobots) |
| 2010–aujourd'hui | Robots autonomes et adaptatifs, intelligence artificielle, IoT, industrie 4.0 |

En un siècle, la robotique est passée d'un concept littéraire à des systèmes intelligents, autonomes et connectés.

## III. Classification globale des robots

Intuition
{ .etape }

Un même robot peut être décrit sous plusieurs angles : est-ce qu'il se déplace ? Comment sa structure est-elle organisée ? Travaille-t-il à côté d'un humain ? Décide-t-il seul ? Dans quel secteur ? Chaque question donne un critère de classification.

Les cinq critères
{ .etape }

| Critère | Question | Catégories |
|---|---|---|
| 1. Mobilité | le robot se déplace-t-il ? | fixes, mobiles, hybrides |
| 2. Architecture cinématique | comment le mécanisme est-il structuré ? | série, parallèle, hybride |
| 3. Mode d'interaction avec l'humain | comment interagit-il avec l'opérateur ? | conventionnels, collaboratifs (cobots), de service |
| 4. Niveau d'autonomie | quelle part d'intervention humaine ? | téléopérés, programmés, adaptatifs, autonomes |
| 5. Domaine d'application | dans quel secteur ? | industriel, médical, agricole, logistique, domestique, spatial… |

Un robot peut appartenir à plusieurs catégories selon le critère considéré.

### 1. Classification selon la mobilité

**Robots fixes.** Installés sur une base immobile, à un emplacement déterminé ; ils ne se déplacent pas et leur espace de travail est limité autour de la base. Exemples : robot cartésien (PPP), cylindrique (RPP), articulé (6 axes), SCARA (RRP), parallèle (Delta).

| Avantages | Inconvénients |
|---|---|
| haute précision et répétabilité | absence de mobilité |
| grande stabilité et rigidité | espace de travail limité |
| vitesse et productivité élevées | reconfiguration difficile |
| intégration simple dans les lignes de production | peu adaptés aux environnements étendus ou changeants |
| coûts d'exploitation faibles | dépendance à l'aménagement de la cellule |

**Robots mobiles.** Ils se déplacent grâce à un système de locomotion ; leur espace d'évolution n'est pas limité à la portée d'un manipulateur.

| Type | Points forts | Points faibles | Applications |
|---|---|---|---|
| Terrestres à roues | rapides et efficaces sur sol plat, simples | difficultés sur terrain irrégulier | transport de charges, logistique |
| Terrestres à chenilles | adhérence, franchissement d'obstacles | plus lents, encombrants | inspection, sauvetage, chantiers |
| Terrestres à pattes | adaptation au terrain accidenté | coût, contrôle complexe | exploration, zones dangereuses |
| Aériens (drones) | accès rapide aux zones difficiles | autonomie de vol limitée, météo | inspection, cartographie, livraison |
| Aquatiques (USV, ROV/AUV) | accès aux milieux sous-marins | coût, communication sous l'eau | inspection sous-marine, exploration |

**Robots hybrides (manipulateurs mobiles).** Un manipulateur mobile associe une base mobile et un bras manipulateur afin de se déplacer et de réaliser des tâches de manipulation : la précision de manipulation du robot fixe plus la capacité de déplacement du robot mobile. Architecture : base mobile, bras manipulateur, effecteur, capteurs de perception, capteurs de navigation, système de commande.

- Avantages : grand espace de travail, polyvalence, gain de productivité, adaptation aux environnements dynamiques, sécurité (intervention à la place de l'humain).
- Limites : commande et planification complexes, coût plus élevé, stabilité et précision (la mobilité peut dégrader la précision du bras), consommation énergétique, intégration et maintenance plus difficiles.

### 2. Classification selon l'architecture cinématique

L'architecture cinématique décrit la structure de la chaîne cinématique du robot (disposition des liaisons et des axes). Elle détermine le volume de travail, la dextérité et les performances.

| Robots sériels (chaîne ouverte) | Mouvement |
|---|---|
| Cartésiens (rectilignes) | déplacements linéaires selon X, Y, Z |
| Cylindriques | rotation autour de Z + translations verticale et radiale |
| Sphériques (polaires) | rotations + translation radiale |
| Articulés (anthropomorphes) | articulations en série, comme un bras humain |
| SCARA | 2 rotations dans le plan horizontal + 1 translation verticale |

| Robots parallèles (chaîne fermée) | Particularité |
|---|---|
| Delta (3 bras) | structure parallèle très rapide et précise |
| Plateforme de Stewart (6 DDL) | 6 actionneurs reliant la base à la plateforme mobile |
| Parallèles planaires | mouvements principalement dans un plan |

**Sériels** : flexibilité, grande enveloppe de travail, dextérité, polyvalence, programmation plus simple, coût souvent inférieur, maintenance aisée.
**Parallèles** : très grande précision et répétabilité, rigidité, vitesse et accélération élevées, bonne capacité de charge par rapport au poids propre, moins d'inertie mobile car les actionneurs sont fixés à la base.

Le choix dépend de l'application : précision, charge utile, vitesse, espace de travail, coût. Ces architectures sont reprises en détail au [cours 4.1](04-description-spatiale/1-bases-mecaniques.md#topologie).

### 3. Classification selon le mode d'interaction avec l'humain

Cette classification décrit la manière dont l'opérateur et le robot partagent l'espace de travail, les tâches et éventuellement les actions physiques.

- **Robots industriels conventionnels** : robot programmable conçu pour réaliser automatiquement des tâches de production dans un espace sécurisé et **séparé** de l'opérateur (barrières, interverrouillage, arrêt d'urgence). L'opérateur intervient pour la programmation, la supervision, le réglage ou la maintenance.
- **Robots collaboratifs (cobots)** : conçus pour travailler à proximité ou en collaboration avec un opérateur dans un **espace de travail partagé**, en toute sécurité. Sécurité intégrée : détection de collision, limitation de force et de puissance, surveillance de la vitesse et de la position, arrêt ou réduction automatique du mouvement. Modes de collaboration : coopération, coexistence, séquence, assistance.
- **Robots de service** : conçus pour réaliser des tâches utiles pour l'être humain en dehors des applications industrielles (assistance, information, transport, soins, nettoyage, sécurité).

### 4. Classification selon le niveau d'autonomie

L'autonomie d'un robot est sa capacité à prendre des décisions sans intervention humaine. Quatre niveaux, de complexité croissante en perception et en traitement :

| Niveau | Type | Principe | Exemples |
|---|---|---|---|
| 1 | Téléopéré | l'opérateur contrôle directement chaque mouvement | télémanipulateurs, robots pilotés à distance |
| 2 | Programmé | exécution automatique de tâches préprogrammées | chaîne de montage, robots industriels classiques |
| 3 | Adaptatif | adaptation aux variations de l'environnement | cobots, robots intelligents à interaction limitée |
| 4 | Autonome | décision et action autonomes | robots mobiles autonomes, drones, véhicules intelligents |

Plus le niveau d'autonomie est élevé, plus le robot perçoit son environnement, prend des décisions et agit sans intervention humaine.

### 5. Classification selon le domaine d'application

Robots industriels ; robots de service professionnels ; robots de service personnels ou domestiques ; robots médicaux et d'assistance ; robots militaires et de défense ; robots spatiaux et sous-marins. Le domaine détermine l'environnement, les tâches, le niveau d'interaction avec l'humain et les exigences de conception (précision, autonomie, robustesse, sécurité).

Exemple
{ .etape }

Classer le robot chirurgical téléopéré da Vinci avec les cinq critères *(complément)* :

| Critère | Classement |
|---|---|
| Mobilité | fixe pendant l'intervention (chariot positionné près du patient) |
| Architecture | bras sériels |
| Interaction | contact direct avec le patient, commandé par le chirurgien |
| Autonomie | niveau 1 : téléopéré |
| Domaine | médical (chirurgie) |

## IV. Introduction à la robotique industrielle

### Pourquoi commencer par l'industrie ?

L'industrie est « l'école des fondamentaux » : un environnement contrôlé où l'on apprend la cinématique, la dynamique et la commande sans les perturbations du vivant. Les robots médicaux reprennent ensuite les mêmes actionneurs, capteurs et algorithmes. L'industrie a développé pendant des décennies des standards de fiabilité (normes ISO, redondances) désormais exigés en médecine. L'approche du cours est descendante : d'abord le socle industriel, puis les spécificités médicales (stérilité, interaction humain-robot, variabilité anatomique).

### 1. Définition de la robotique industrielle

> La robotique industrielle est la branche de la robotique consacrée à l'utilisation de systèmes robotisés pour automatiser des opérations de production, de manipulation, d'assemblage, de contrôle ou de traitement dans un environnement industriel.

Applications : soudage, peinture, manipulation et pick and place, assemblage, chargement et déchargement de machines, contrôle et inspection, palettisation.

### 2. Définition d'un robot industriel

> Un robot industriel est un **manipulateur programmable**, **commandé automatiquement**, capable de réaliser différents **mouvements** afin d'effectuer des **tâches** dans un processus de **production**.

Programme (mouvements et tâches définis) → robot industriel (exécute le programme) → action sur le processus.

### 3. Pourquoi utiliser des robots dans l'industrie ?

Les robots ne remplacent pas l'humain : ils l'assistent en prenant en charge les tâches **répétitives** (pick and place, vissage), **pénibles** (charges lourdes), **dangereuses** (soudage, produits toxiques) ou exigeant des **performances constantes** (contrôle qualité, travail 24 h/24).

Bénéfices : productivité, répétabilité, précision, flexibilité, sécurité, qualité.

### 4. Constitution d'un système robotisé

Intuition
{ .etape }

Le bras n'est qu'une partie de l'installation. Pour qu'il fasse quelque chose d'utile, il faut des capteurs, une armoire de commande, un outil au bout du bras, des dispositifs de sécurité et des machines autour. L'ensemble s'appelle un système (ou cellule) robotisé.

> Un système robotisé est un ensemble de composants qui coopèrent pour réaliser automatiquement une tâche industrielle.

Les six composants d'un robot industriel :

1. **Manipulateur** : bras mécanique (structure, articulations, transmissions, réducteurs).
2. **Actionneurs** : servomoteurs (couple élevé, réponse dynamique rapide).
3. **Capteurs** : codeurs absolus, capteurs de couple, vision.
4. **Contrôleur** : armoire de commande, cartes de puissance, calcul cinématique, interface de programmation.
5. **Effecteur terminal** (EOAT, *End Of Arm Tooling*) : pince, ventouse, torche, outil de mesure.
6. **Teach pendant** : pupitre de programmation portable.

Les sous-systèmes de la cellule :

| Chaîne | Rôle | Éléments |
|---|---|---|
| Chaîne d'information | mesurer l'état du système, traiter les informations, générer les commandes | capteurs, vision, contrôleur, API, IHM, réseau |
| Chaîne d'énergie | alimenter et moduler l'énergie | alimentation, variateurs, moteurs |
| Chaîne d'action | transformer les ordres en action physique | manipulateur, effecteur, pièce ou procédé |
| Sécurité | prévenir les accidents | arrêt d'urgence, barrières, interverrouillage |

**Chaîne d'information** : acquérir (capteurs, vision) → traiter (contrôleur, API) → communiquer (IHM, réseau industriel) → commander (ordres vers les actionneurs), avec un retour d'information.

**Chaîne d'action** : transformer l'énergie (actionneurs et transmissions) → transmettre le mouvement (le manipulateur positionne et oriente l'outil) → agir sur le procédé (l'effecteur réalise l'opération). Autrement dit : consigne → mouvement des axes → action sur la pièce.

**Sécurité de la cellule** : arrêt d'urgence, barrière immatérielle, porte interverrouillée, scanner laser, automate de sécurité. La sécurité est une fonction intégrée à la cellule.

**Équipements périphériques** : convoyeur, magasin de pièces, montage ou gabarit, machine-outil, système de vision, IHM de supervision.

Exemple : fonctionnement d'une cellule
{ .etape }

1. **Détection** : la caméra détecte la pièce entrante sur le convoyeur.
2. **Autorisation** : l'API autorise le cycle.
3. **Approche** : le robot se déplace vers la pièce.
4. **Préhension** : la pince saisit la pièce.
5. **Déplacement** : le robot déplace la pièce selon la trajectoire programmée.
6. **Dépose** : la pièce est déposée sur le convoyeur de sortie.

Chaque étape mobilise la chaîne d'information, la chaîne d'énergie, la chaîne d'action et la sécurité. Par exemple, l'étape 1 relève de la chaîne d'information (acquérir), l'étape 4 de la chaîne d'action (agir sur la pièce).

## À retenir

- Robot : système **programmable** qui exécute des **actions** dans son **environnement** pour une **tâche**.
- Boucle de fonctionnement : percevoir → traiter → décider → agir, puis nouvelle perception.
- Cinq critères de classification : mobilité, architecture cinématique, interaction avec l'humain, autonomie, domaine.
- Sériel = chaîne ouverte (flexibilité, grand espace) ; parallèle = chaîne fermée (précision, rigidité, vitesse).
- Système robotisé = chaîne d'information + chaîne d'énergie + chaîne d'action + sécurité.

## Questions d'auto-évaluation

1. Quels sont les quatre mots clés de la définition d'un robot retenue dans le cours ?

    <details markdown><summary>Réponse</summary>
    Programmable, action, environnement, tâche : un robot est un système programmable capable d'exécuter des actions dans son environnement afin d'accomplir une tâche donnée.
    </details>

2. Décrivez les quatre actions essentielles d'un robot et l'élément matériel associé à chacune.

    <details markdown><summary>Réponse</summary>
    Percevoir (capteurs), traiter (système de commande : ordinateur, API), décider (programme, plan d'action), agir (actionneurs). L'action modifie l'environnement, ce qui produit de nouvelles informations pour les capteurs.
    </details>

3. Citez les cinq critères de classification des robots.

    <details markdown><summary>Réponse</summary>
    Mobilité, architecture cinématique, mode d'interaction avec l'humain, niveau d'autonomie, domaine d'application.
    </details>

4. Quelle différence fondamentale y a-t-il entre un robot sériel et un robot parallèle ? Donnez un avantage de chacun.

    <details markdown><summary>Réponse</summary>
    Le robot sériel a une chaîne cinématique ouverte (une seule suite de segments de la base à l'effecteur) ; le robot parallèle a une chaîne fermée (plusieurs chaînes relient la base à la plateforme). Sériel : grand espace de travail et polyvalence. Parallèle : précision, rigidité et vitesse.
    </details>

5. Qu'est-ce qui distingue un cobot d'un robot industriel conventionnel ?

    <details markdown><summary>Réponse</summary>
    Le robot conventionnel travaille dans une zone séparée de l'opérateur (sécurité par séparation). Le cobot partage l'espace de travail avec l'humain ; sa sécurité est intégrée (détection de collision, limitation de force et de puissance, surveillance de la vitesse).
    </details>

6. Un robot exécute automatiquement une séquence de soudure identique à chaque pièce, sans capteur pour s'adapter. Quel est son niveau d'autonomie ?

    <details markdown><summary>Réponse</summary>
    Niveau 2, robot programmé : exécution automatique de tâches préprogrammées, sans adaptation à l'environnement.
    </details>

7. Citez les six composants d'un robot industriel.

    <details markdown><summary>Réponse</summary>
    Manipulateur, actionneurs, capteurs, contrôleur, effecteur terminal, teach pendant.
    </details>

8. À quelle chaîne appartiennent : un codeur absolu, un variateur, une pince, un scanner laser ?

    <details markdown><summary>Réponse</summary>
    Codeur absolu : chaîne d'information (capteur). Variateur : chaîne d'énergie. Pince : chaîne d'action (effecteur). Scanner laser : sécurité.
    </details>

9. Pourquoi le cours commence-t-il par la robotique industrielle avant la robotique médicale ?

    <details markdown><summary>Réponse</summary>
    L'industrie offre un environnement contrôlé pour apprendre cinématique, dynamique et commande sans la complexité du vivant, et les robots médicaux réutilisent les mêmes composants et algorithmes. On ajoute ensuite les contraintes médicales : stérilité, interaction avec le patient, variabilité anatomique.
    </details>
