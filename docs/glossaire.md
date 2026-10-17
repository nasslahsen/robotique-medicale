# Glossaire

Les définitions reprennent celles du cours lorsqu'elles y figurent. Le lien renvoie à la page où la notion est expliquée.

API (automate programmable industriel)
:   Contrôleur industriel qui envoie les ordres de commande et synchronise la cellule robotisée (en anglais PLC). [Cours 1](cours/01-introduction.md)

Angles d'Euler
:   Trois angles de rotations successives qui décrivent une orientation. Convention ZYX du cours : lacet α autour de z, tangage β autour du nouvel y, roulis γ autour du nouvel x. [Cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#euler)

Articulation
:   Liaison mécanique entre deux segments permettant un mouvement relatif. [Cours 2](cours/02-caracteristiques-robotique-medicale.md#vocabulaire)

Articulation prismatique (P)
:   Articulation à mouvement linéaire le long d'un axe ; variable articulaire \(d_i\). Voir aussi liaison glissière.

Articulation rotoïde (R)
:   Articulation à mouvement angulaire autour d'un axe ; variable articulaire \(\theta_i\). Voir aussi liaison pivot.

atan2
:   Fonction \(\operatorname{atan2}(y, x)\) qui renvoie l'angle d'un point \((x, y)\) dans le bon quadrant. [Rappels](rappels.md#atan2)

Axe
:   Direction autour de laquelle une articulation tourne, ou le long de laquelle elle se déplace ; correspond à un mouvement indépendant commandé par le robot.

Axes mobiles (intrinsèques)
:   Convention où chaque rotation se fait autour d'un axe du repère déjà tourné par les rotations précédentes.

Base (bâti)
:   Partie fixe qui supporte le robot ; solide 0 du schéma cinématique.

Base orthonormée directe
:   Trois vecteurs unitaires deux à deux orthogonaux, avec \(\vec{z} = \vec{x} \times \vec{y}\) (règle de la main droite).

BCI (interface cerveau-machine)
:   IHM qui traduit l'activité cérébrale en commandes pour un dispositif externe, sans passer par les muscles. [Cours 2](cours/02-caracteristiques-robotique-medicale.md)

Cadence théorique
:   Nombre de cycles par heure, \(N = 3600 / T_{cycle}\). [Cours 2](cours/02-caracteristiques-robotique-medicale.md#temps-de-cycle)

Chaîne cinématique
:   Ensemble de solides reliés par des liaisons ; représentation plane ou spatiale des liaisons entre les solides. [Cours 3](cours/03-rappels-cinematique.md#chaine)

Chaîne ouverte simple (série)
:   Chaque solide est relié à au plus deux autres ; pas de boucle ni d'embranchement ; extrémité libre. [Cours 4.1](cours/04-description-spatiale/1-bases-mecaniques.md#topologie)

Chaîne fermée (parallèle)
:   Chaîne comportant au moins une boucle cinématique ; l'organe terminal est relié à la base par plusieurs chaînes en parallèle.

Chaîne arborescente
:   Chaîne avec embranchements mais sans boucle ; chaque extrémité est reliée à la racine par un chemin unique.

Chaîne hybride
:   Association de sous-chaînes série et parallèles ; peut comporter des boucles fermées.

Chaîne d'information, d'énergie, d'action
:   Sous-systèmes d'une cellule robotisée : mesurer et commander (information), alimenter les moteurs (énergie), transformer les ordres en action physique (action). [Cours 1](cours/01-introduction.md)

Charge utile
:   Masse maximale que le robot peut transporter avec son effecteur, tout en conservant ses performances spécifiées.

Chasles (relation de)
:   \(\overrightarrow{O_0 M} = \overrightarrow{O_0 O_s} + \overrightarrow{O_s M}\) (1.1). [Cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#chasles)

Cobot (robot collaboratif)
:   Robot conçu pour travailler à proximité ou en collaboration avec un opérateur dans un espace de travail partagé, en toute sécurité.

Co-manipulation
:   Mode d'interaction où le praticien et le robot manipulent ensemble l'instrument ; le robot guide le geste (exemple : Mako).

Configuration articulaire
:   Position et orientation des segments les uns par rapport aux autres, décrite par \(q = [q_1, \dots, q_n]^T\). [Cours 2](cours/02-caracteristiques-robotique-medicale.md#config-articulaire)

Configuration opérationnelle
:   Position et orientation de l'effecteur par rapport à la base, \(X = [x, y, z, \alpha, \beta, \gamma]^T\). [Cours 2](cours/02-caracteristiques-robotique-medicale.md#config-operationnelle)

Coordonnées cylindriques
:   \((r, \theta, z)\) : distance à l'axe Z, angle autour de Z, hauteur. [Cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#cylindriques)

Coordonnées polaires
:   \((r, \theta)\) dans le plan : distance à l'origine et angle mesuré depuis X.

DDL (degré de liberté)
:   Mouvement indépendant qu'un système mécanique peut réaliser ; pour un solide, nombre de paramètres indépendants nécessaires pour définir sa situation (6 dans l'espace, 3 dans le plan). [Cours 4.1](cours/04-description-spatiale/1-bases-mecaniques.md#ddl)

Degrés de liaison
:   Nombre de mouvements bloqués par une liaison ; degrés de mobilité + degrés de liaison = 6.

Denavit–Hartenberg
:   Méthode de placement des repères sur une chaîne cinématique pour la modélisation, citée dans le cours comme étape suivante.

Effecteur (organe terminal)
:   Outil fixé à l'extrémité du robot pour réaliser la tâche ; en médecine, instrument adapté à un geste clinique.

Espace de travail
:   Ensemble des positions que peut atteindre l'effecteur, pour au moins une configuration des articulations, dans le respect des limites articulaires. [Cours 2](cours/02-caracteristiques-robotique-medicale.md#espace-de-travail)

IHM (interface homme-machine)
:   Ensemble des moyens qui permettent à un professionnel de santé ou à un patient d'interagir avec un système robotisé médical.

Lacet, tangage, roulis
:   Rotations autour de z (lacet, *yaw*), de y (tangage, *pitch*) et de x (roulis, *roll*).

Liaison
:   Connexion physique entre deux segments voisins ; elle définit les mouvements relatifs autorisés et bloqués. [Cours 3](cours/03-rappels-cinematique.md#liaisons)

Liaison glissière (P)
:   Une translation rectiligne le long d'un axe fixe ; 1 DDL ; \(q = d\).

Liaison pivot (R)
:   Une rotation relative autour d'un axe fixe ; 1 DDL ; \(q = \theta\).

Manipulateur mobile
:   Robot hybride associant une base mobile et un bras manipulateur.

Matrice de rotation
:   Matrice 3 × 3 \(R^{A,B}\) dont les colonnes sont les axes du repère B exprimés dans le repère A. [Cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#matrice-rotation)

Matrice homogène
:   Matrice 4 × 4 \(T^{0,s}\) qui réunit la rotation \(R^{0,s}\) et la position \(O_0O_s^0\). [Cours 4.3](cours/04-description-spatiale/3-transformations-homogenes.md#definition)

MGD (modèle géométrique direct)
:   Relation \(p = f(q)\) qui donne la position (et l'orientation) de l'effecteur à partir des variables articulaires. Le MGI (modèle géométrique inverse) fait l'inverse.

Poignet
:   Ensemble de plusieurs articulations terminales assurant principalement l'orientation de l'effecteur.

Précision
:   Capacité du robot à atteindre le point demandé ; proximité de la cible. [Cours 2](cours/02-caracteristiques-robotique-medicale.md#precision)

Produit scalaire
:   \(\vec{a} \cdot \vec{b} = a_x b_x + a_y b_y + a_z b_z = \|\vec{a}\|\,\|\vec{b}\|\cos\theta\) ; un nombre réel.

Produit vectoriel
:   \(\vec{u} \wedge \vec{v}\) (ou \(\vec{u} \times \vec{v}\)) : vecteur perpendiculaire à \(\vec{u}\) et \(\vec{v}\), de norme \(\|\vec{u}\|\,\|\vec{v}\|\sin\theta\), de sens donné par la main droite.

Recalage
:   Mise en correspondance de l'image (modèle préopératoire) et de l'anatomie réelle du patient.

Repère
:   \(R = \{O, \vec{x}, \vec{y}, \vec{z}\}\) : une origine et trois vecteurs unitaires orthogonaux formant une base orthonormée directe. [Cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#repere)

Répétabilité
:   Capacité du robot à reproduire plusieurs fois le même mouvement et à regrouper ses positions autour d'un même point.

Robot
:   Système programmable capable d'exécuter des actions dans son environnement afin d'accomplir une tâche donnée, de manière automatique, semi-autonome ou sous le contrôle d'un opérateur. [Cours 1](cours/01-introduction.md)

Robot industriel
:   Manipulateur programmable, commandé automatiquement, capable de réaliser différents mouvements afin d'effectuer des tâches dans un processus de production.

Robotique médicale
:   Application de la robotique dans laquelle les robots assistent les professionnels de santé, améliorent la précision des interventions et facilitent la prise en charge des patients.

Schéma cinématique
:   Représentation graphique épurée et normalisée de la chaîne cinématique, qui ne conserve que l'information utile au mouvement. [Cours 4.1](cours/04-description-spatiale/1-bases-mecaniques.md#schema)

Segment (lien)
:   Élément mécanique rigide reliant deux articulations ; les « os » du robot.

Singularité (des angles d'Euler)
:   Configuration où le premier et le dernier axe de rotation sont alignés (angle du milieu à ±90°) : deux angles ne sont plus indépendants.

Situation (configuration) d'un corps rigide
:   Combinaison de sa position \(\vec{p}\) et de son orientation \(R\), notée \(\{R, \vec{p}\}\) ; 6 paramètres indépendants.

Solide indéformable
:   Solide dont la distance entre deux points quelconques reste constante au cours du temps. [Cours 4.1](cours/04-description-spatiale/1-bases-mecaniques.md#solide-indeformable)

SO(3)
:   Groupe spécial orthogonal : ensemble des matrices de rotation, \(R^T R = I\), \(\det R = +1\). [Cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#so3)

TCP (Tool Center Point)
:   Point de référence de l'outil, dont on mesure la vitesse linéaire et angulaire.

Téléopération (maître-esclave)
:   Le praticien commande les instruments du robot à distance depuis une console, sans contact physique direct avec le patient.

Temps de cycle
:   Durée nécessaire au robot pour réaliser une opération complète et revenir à son état initial.

Variable articulaire
:   Grandeur pilotée par l'actionneur d'une articulation : angle \(\theta_i\) (pivot) ou distance \(d_i\) (glissière).
