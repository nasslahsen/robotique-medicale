# 4.2 Description spatiale et systèmes de coordonnées

Partie 2 du chapitre 2. Objectif : comprendre comment localiser mathématiquement un point dans l'espace 3D, puis comment décrire l'orientation d'un objet. C'est la base pour contrôler la position d'un instrument chirurgical ou interpréter des données d'imagerie médicale.

> Pour qu'un logiciel « comprenne » où se trouve un objet dans le monde réel (un organe, un bras robotique), il doit traduire cette réalité en **nombres** (coordonnées) et en **matrices**.

## I. Repère et systèmes de coordonnées

### 1. Notion de repère { #repere }

Intuition
{ .etape }

Un repère, c'est un point de départ et trois directions de référence. Dire « la cible est à 3 cm » n'a de sens que si l'on sait d'où l'on mesure et dans quelle direction. En salle d'opération, il y a plusieurs repères à la fois (la salle, le robot, l'outil, le patient), et tout le travail consiste à passer de l'un à l'autre.

Définition
{ .etape }

> Un repère \(R = \{O, \vec{x}, \vec{y}, \vec{z}\}\) est constitué d'une origine \(O\) et de trois vecteurs unitaires orthogonaux, formant une base orthonormée directe, orientée selon la règle de la main droite.

| Élément | Rôle |
|---|---|
| L'origine \(O\) | le point de référence |
| L'axe X | la direction principale |
| L'axe Y | la direction secondaire, perpendiculaire à X |
| L'axe Z | son sens est fixé par la règle de la main droite |

\[
\text{Règle de la main droite : } \vec{z} = \vec{x} \times \vec{y}
\]

L'ordre X → Y fixe le sens de Z. (Le produit vectoriel est noté \(\wedge\) dans le [module de rappel](../03-rappels-cinematique.md#produit-vectoriel).)

Les repères d'une scène chirurgicale :

| Repère | Définition |
|---|---|
| Repère monde {M} | référence fixe de la salle d'opération |
| Repère robot {R} | lié à la base du bras robotisé |
| Repère outil {T} | origine située à la pointe active de l'instrument |
| Repère patient {P} | lié à l'anatomie, aux marqueurs ou à l'imagerie |

Relier ces repères permet de localiser et d'orienter l'outil par rapport au patient.

### 2. Coordonnées cartésiennes { #cartesiennes }

> Dans un repère fixe orthonormé \(R = (O, \vec{x}, \vec{y}, \vec{z})\), un point P est décrit par trois coordonnées \((x, y, z)\). Chacune est la projection orthogonale du vecteur position \(\overrightarrow{OP}\) sur l'axe correspondant.

\[
x = \overrightarrow{OP} \cdot \vec{x}
\qquad
y = \overrightarrow{OP} \cdot \vec{y}
\qquad
z = \overrightarrow{OP} \cdot \vec{z}
\]

\[
\overrightarrow{OP} = x\,\vec{x} + y\,\vec{y} + z\,\vec{z}
\qquad
\left[\overrightarrow{OP}\right]_R = \begin{bmatrix} x \\ y \\ z \end{bmatrix}
\]

Distance entre \(P_1(x_1, y_1, z_1)\) et \(P_2(x_2, y_2, z_2)\) dans le même repère :

\[
d(P_1, P_2) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}
\]

**Application : robot cartésien (PPP).** Trois glissières orthogonales, une translation par articulation, axes alignés et décalages nuls :

\[
x = q_1 \qquad y = q_2 \qquad z = q_3
\]

Espace de travail : un parallélépipède rectangle. Exemples : portiques de soudage, imprimantes 3D, machines CNC.

Avantages : intuitif, simple, distances faciles à calculer. Limites : ne décrit pas l'orientation à lui seul ; pour les robots à pivots, les angles articulaires sont plus naturels.

Exemple
{ .etape }

Pointe d'aiguille en \(P_1(10,\ 20,\ 5)\) mm, cible en \(P_2(13,\ 24,\ 5)\) mm : \(d = \sqrt{3^2 + 4^2 + 0^2} = 5\) mm.

### 3. Coordonnées polaires (2D) { #polaires }

Un point du plan est défini par deux valeurs :

- \(r\) (rayon) : la distance en ligne droite depuis l'origine, \(r = OP \geq 0\) ;
- \(\theta\) (thêta) : l'angle de rotation par rapport à un axe de référence, mesuré depuis X, positif dans le sens trigonométrique.

\[
P : (r, \theta)
\]

Analogie médicale : une sonde pivotante posée sur la peau décrit la cible par « 5 cm dans la direction de 45° » (distance + direction). Une commande de mouvement s'écrit naturellement « avance de 3 cm et tourne de 10° ».

### 4. Coordonnées cylindriques (3D) : « le pivot + la hauteur » { #cylindriques }

Extension 3D des coordonnées polaires. Un point est défini par :

- \(r\) : la distance horizontale depuis l'axe central (l'axe Z) ;
- \(\theta\) : l'angle de rotation autour de cet axe central (azimut dans le plan X, Y) ;
- \(z\) : la hauteur (comme en cartésien).

\[
P : (r, \theta, z)
\qquad
r = OQ \text{ où } Q \text{ est la projection de } P \text{ dans le plan } (X, Y)
\]

Analogie : un arceau d'imagerie autour d'un patient. \(\theta\) : tourner autour du patient ; \(r\) : avancer ou reculer le bras ; \(z\) : monter ou descendre le lit.

### 5. Conversions entre systèmes { #conversions }

| Départ ↓ / Arrivée → | Cartésien \((x, y, z)\) | Cylindrique \((r, \theta, z)\) |
|---|---|---|
| Cartésien \((x, y, z)\) | identique | \(r = \sqrt{x^2 + y^2}\), \(\theta = \operatorname{atan2}(y, x)\), \(z = z\) |
| Cylindrique \((r, \theta, z)\) | \(x = r\cos\theta\), \(y = r\sin\theta\), \(z = z\) | identique |

On utilise \(\operatorname{atan2}(y, x)\) et non \(\arctan(y/x)\) : atan2 tient compte des signes de \(x\) et \(y\) et donne le bon quadrant (voir [Rappels : atan2](../../rappels.md#atan2)).

Exemple
{ .etape }

\(P = (-1,\ 1,\ 2)\) : \(r = \sqrt{1 + 1} = \sqrt{2} \approx 1{,}414\) ; \(\theta = \operatorname{atan2}(1, -1) = 135°\) (et non \(\arctan(-1) = -45°\)) ; \(z = 2\). Retour : \(x = \sqrt{2}\cos 135° = -1\), \(y = \sqrt{2}\sin 135° = 1\).

<div class="widget" data-widget="coordonnees"></div>

## II. Descriptions spatiales d'un corps rigide

Pour décrire complètement un objet rigide (un os, un instrument chirurgical), il faut **6 informations** : 3 paramètres de position + 3 paramètres d'orientation.

### 1. Position { #position }

> La position d'un corps rigide est définie par le vecteur reliant l'origine \(O_0\) du repère fixe \(R_0\) à l'origine \(O_1\) du repère mobile \(R_1\) attaché au corps.

\[
\vec{p} = \overrightarrow{O_0 O_1}
\qquad
\vec{p} = p_x\,\vec{x}_0 + p_y\,\vec{y}_0 + p_z\,\vec{z}_0
\qquad
[\vec{p}]_{R_0} = \begin{bmatrix} p_x \\ p_y \\ p_z \end{bmatrix}
\]

Cette colonne donne les coordonnées de \(O_1\) dans la base fixe \((\vec{x}_0, \vec{y}_0, \vec{z}_0)\) : \(p_x = \vec{p} \cdot \vec{x}_0\), \(p_y = \vec{p} \cdot \vec{y}_0\), \(p_z = \vec{p} \cdot \vec{z}_0\).

Exemples du cours
{ .etape }

- **Pointe d'un scalpel robotisé**, exprimée dans le repère lié au patient : \({}^P\mathbf{p}_S = \overrightarrow{O_P S}\).
- **Robot cartésien PPP** : \(q_1\) translate selon \(\vec{x}_0\), \(q_2\) selon \(\vec{y}_0\), \(q_3\) selon \(\vec{z}_0\). Axes alignés sur le repère fixe, décalages constants supposés nuls :

\[
[\vec{p}]_{R_0} = \begin{bmatrix} q_1 \\ q_2 \\ q_3 \end{bmatrix}
\qquad
p_x = q_1,\ p_y = q_2,\ p_z = q_3
\]

### 2. Relation fondamentale de position (Chasles) { #chasles }

Intuition
{ .etape }

Pour aller de l'origine fixe \(O_0\) à un point M du solide, on peut y aller directement, ou passer d'abord par l'origine \(O_s\) du solide puis aller de \(O_s\) à M. Les deux trajets arrivent au même point.

Formalisation
{ .etape }

À tout solide S, on attache un repère \(R_s\) pour décrire sa pose par rapport au repère \(R_0\). Pour un point M appartenant au solide S :

\[
\overrightarrow{O_0 M} = \overrightarrow{O_0 O_s} + \overrightarrow{O_s M}
\qquad (1.1)
\]

L'intérêt : \(\overrightarrow{O_s M}\) est **constant dans \(R_s\)** (le solide est indéformable), alors que \(\overrightarrow{O_0 O_s}\) décrit le mouvement du solide. Il reste un problème : ces deux vecteurs sont naturellement connus dans deux repères différents. C'est ce que règle la matrice de rotation (paragraphe 3-5).

### De la position à l'orientation

La position seule ne suffit pas : une aiguille peut changer d'orientation tout en gardant la même position de pointe. Avec une orientation inadaptée, la trajectoire prévue manque la cible ; avec une orientation adaptée, elle passe par la cible. Même point P(x, y, z), approche horizontale ou verticale : le trajet dans les tissus n'est pas le même.

> **Règle fondamentale** : la position d'un point est décrite par un vecteur \(\vec{P}\) ; l'orientation d'un corps est décrite par un repère attaché {B}.

### 3. Description de l'orientation : matrice de rotation { #matrice-rotation }

#### 3-1 Définition

Intuition
{ .etape }

Pour dire comment un objet est tourné, on lui attache un repère B et on donne les directions de ses trois axes, vues depuis le repère fixe A. Chaque axe est un vecteur unitaire à 3 composantes : 3 axes × 3 composantes = une matrice 3 × 3.

Formalisation
{ .etape }

Deux repères de même origine O, d'orientations différentes : A (repère fixe) et B (repère de l'objet).

\[
R^{A,B} =
\begin{bmatrix}
r_{11} & r_{12} & r_{13} \\
r_{21} & r_{22} & r_{23} \\
r_{31} & r_{32} & r_{33}
\end{bmatrix}
\]

> Chaque colonne donne les coordonnées d'un axe de B dans A : colonne 1 = axe \(x_B\), colonne 2 = axe \(y_B\), colonne 3 = axe \(z_B\).

Notations équivalentes utilisées dans le cours :

\[
R^{i,j} = {}^iR_j = R_{ij} = R^i_j
\]

#### 3-2 Matrice d'orientation du solide S { #r0s }

> L'orientation du solide S par rapport au repère fixe \(R_0\) est décrite par la matrice de rotation \(R^{(0,S)}\). Ses colonnes regroupent les coordonnées des vecteurs unitaires \(\vec{x}_S\), \(\vec{y}_S\), \(\vec{z}_S\) du repère \(R_S\) attaché au solide, toutes exprimées dans le repère fixe \(R_0\).

\[
R^{(0,S)} = \Big[\ [\vec{x}_S]_{R_0} \quad [\vec{y}_S]_{R_0} \quad [\vec{z}_S]_{R_0}\ \Big]
\qquad
[\vec{x}_S]_{R_0} = \begin{bmatrix} r_{11} \\ r_{21} \\ r_{31} \end{bmatrix},\
[\vec{y}_S]_{R_0} = \begin{bmatrix} r_{12} \\ r_{22} \\ r_{32} \end{bmatrix},\
[\vec{z}_S]_{R_0} = \begin{bmatrix} r_{13} \\ r_{23} \\ r_{33} \end{bmatrix}
\]

Lien avec le module de rappel : chaque coefficient est un produit scalaire entre un axe de \(R_0\) et un axe de \(R_S\), par exemple \(r_{21} = \vec{y}_0 \cdot \vec{x}_S\). *(complément)*

Exemple : rotation d'angle α autour de z
{ .etape }

On reprend les [projections du module de rappel](../03-rappels-cinematique.md#projections), avec \(R_0\) à la place de \(R_1\) et \(R_1\) à la place de \(R_2\) : \([\vec{x}_1]_{R_0} = (\cos\alpha, \sin\alpha, 0)^T\), \([\vec{y}_1]_{R_0} = (-\sin\alpha, \cos\alpha, 0)^T\), \([\vec{z}_1]_{R_0} = (0, 0, 1)^T\). En les rangeant en colonnes :

\[
R^{0,1} =
\begin{pmatrix}
\cos\alpha & -\sin\alpha & 0 \\
\sin\alpha & \cos\alpha & 0 \\
0 & 0 & 1
\end{pmatrix}
\qquad\text{pour } \alpha = 30° :\quad
R^{0,1} =
\begin{pmatrix}
0{,}866 & -0{,}5 & 0 \\
0{,}5 & 0{,}866 & 0 \\
0 & 0 & 1
\end{pmatrix}
\]

<div class="widget" data-widget="rotation-2d"></div>

#### 3-3 Propriétés mathématiques (groupe SO(3)) { #so3 }

L'ensemble des matrices de rotation forme le **groupe spécial orthogonal**, noté \(SO(3)\) :

| Propriété | Expression | Signification |
|---|---|---|
| Orthogonalité | \(\mathbf{R}^T\mathbf{R} = \mathbf{I}\) | les colonnes sont orthonormées |
| Inverse = transposée | \(\mathbf{R}^{-1} = \mathbf{R}^T\) | changement de repère facile |
| Déterminant unitaire | \(\det(\mathbf{R}) = +1\) | conservation de l'orientation (pas de réflexion) |
| Norme des colonnes | \(\|\vec{x}'\| = \|\vec{y}'\| = \|\vec{z}'\| = 1\) | vecteurs unitaires |

> **Conséquence pratique** : l'inverse d'une rotation est sa transposée, ce qui est très économique en calcul (pas d'inversion matricielle coûteuse).

Pourquoi \(\mathbf{R}^T\mathbf{R} = \mathbf{I}\) ? L'élément \((i, j)\) de \(\mathbf{R}^T\mathbf{R}\) est le produit scalaire de la colonne \(i\) par la colonne \(j\). Les colonnes sont les axes d'un repère orthonormé : produit scalaire 1 si \(i = j\), 0 sinon. *(complément)*

Exemple
{ .etape }

Avec \(R^{0,1}\) pour \(\alpha = 30°\) : colonne 1 · colonne 1 \(= 0{,}866^2 + 0{,}5^2 = 0{,}75 + 0{,}25 = 1\) ; colonne 1 · colonne 2 \(= 0{,}866 \times (-0{,}5) + 0{,}5 \times 0{,}866 = 0\) ; \(\det = 0{,}866^2 + 0{,}5^2 = 1\).

#### 3-4 Rotations élémentaires et angles d'Euler { #euler }

Objectif : comprendre comment décrire n'importe quelle orientation 3D en utilisant seulement 3 angles de rotation successifs, et identifier les limites de cette méthode (singularités).

**3-4-1 Le principe fondamental.** Une matrice de rotation \(R\ (3 \times 3)\) décrit parfaitement une orientation, mais elle contient 9 nombres, ce qui n'est pas intuitif pour un humain. L'idée des angles d'Euler : au lieu de donner 9 coefficients, on dit « pour arriver à cette orientation, j'ai effectué 3 rotations simples l'une après l'autre ». Il existe 12 conventions (combinaisons d'axes) ; en robotique et en santé digitale, on utilise principalement deux familles : **Z-Y-X (angles RPY)** et **Z-Y-Z**.

**3-4-2 Angles d'Euler ZYX.** C'est la convention par défaut de la plupart des logiciels de robotique (ROS, MATLAB Robotics Toolbox, KUKA, ABB).

- **Séquence** : rotation autour de Z (**lacet**, *yaw*) → autour de Y (**tangage**, *pitch*) → autour de X (**roulis**, *roll*).
- **Type** : axes **mobiles** (intrinsèques). On tourne d'abord autour de l'axe Z du robot, puis autour de son *nouvel* axe Y, puis autour de son *nouvel* axe X.
- **Pourquoi en robotique ?** Elle correspond intuitivement au mouvement d'un véhicule ou d'un effecteur ; l'axe Z est souvent l'axe vertical de la base ; l'axe X pointe souvent vers l'avant de l'outil.

Les trois rotations élémentaires (sens positif : règle de la main droite autour de l'axe de rotation) :

| Étape | Rotation | Matrice | Axe conservé |
|---|---|---|---|
| 1. Lacet | \(R_0\) tourne de α autour de \(\vec{z}_0\) pour devenir \(R_1\) | \(R^{(0,1)} = R_z(\alpha) = \begin{pmatrix} \cos\alpha & -\sin\alpha & 0 \\ \sin\alpha & \cos\alpha & 0 \\ 0 & 0 & 1 \end{pmatrix}\) | \(\vec{z}_0 = \vec{z}_1\) |
| 2. Tangage | à partir de \(R_1\), rotation de β autour du nouvel axe \(\vec{y}_1\) : \(R_2\) | \(R^{(1,2)} = R_y(\beta) = \begin{pmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{pmatrix}\) | \(\vec{y}_1 = \vec{y}_2\) |
| 3. Roulis | à partir de \(R_2\), rotation de γ autour du nouvel axe \(\vec{x}_2\) : \(R_s\) | \(R^{(2,s)} = R_x(\gamma) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\gamma & -\sin\gamma \\ 0 & \sin\gamma & \cos\gamma \end{pmatrix}\) | \(\vec{x}_2 = \vec{x}_s\) |

Les rotations suivent les axes mobiles \(\vec{z}_0\), puis \(\vec{y}_1\), puis \(\vec{x}_2\). Orientation après le lacet, puis le tangage, puis le roulis :

\[
R^{(0,2)} = R_z(\alpha)\,R_y(\beta)
\qquad
\boxed{R^{(0,s)} = R_z(\alpha)\,R_y(\beta)\,R_x(\gamma)}
\]

Comment retrouver \(R_y\) sans l'apprendre : dans \(R_y(\beta)\), le signe moins est en bas à gauche, à l'inverse de \(R_z\) et \(R_x\). C'est parce que l'ordre cyclique des axes est x → y → z → x : pour une rotation autour de y, le « premier » axe du plan tournant est z, puis x. *(complément)*

Pourquoi les matrices se **multiplient à droite** dans l'ordre des rotations : chaque nouvelle rotation est décrite dans le repère obtenu juste avant. C'est la même règle que la composition \(T^{0,n} = T^{0,1} T^{1,2} \cdots\) du [cours 4.3](3-transformations-homogenes.md#composition). *(complément)*

Exemple du cours : le téléphone (ZYX)
{ .etape }

Au départ, le repère du téléphone coïncide avec \(R_0 = (O_0, \vec{x}_0, \vec{y}_0, \vec{z}_0)\) : \(\vec{x}_0\) longitudinal, \(\vec{y}_0\) transversal, \(\vec{z}_0\) vers le plafond (vérification du repère direct : \(\vec{x}_0 \times \vec{y}_0 = \vec{z}_0\)).

1. Lacet : tourner de 90° vers la droite, \(\alpha = -90°\) (sens horaire vu de dessus). Le téléphone reste à plat.
2. Tangage : soulever puis incliner de 90° autour du nouvel axe \(\vec{y}_1\), \(\beta = +90°\). Le téléphone est vertical.

Calcul :

\[
R_z(-90°) = \begin{pmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}
\qquad
R_y(90°) = \begin{pmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{pmatrix}
\qquad
R^{(0,2)} = R_z(-90°)\,R_y(90°) = \begin{pmatrix} 0 & 1 & 0 \\ 0 & 0 & -1 \\ -1 & 0 & 0 \end{pmatrix}
\]

Première colonne : \(\vec{x}_2 = -\vec{z}_0\). L'axe longitudinal du téléphone pointe vers le sol, et le roulis (3<sup>e</sup> rotation, autour de \(\vec{x}_2\)) se fait autour de la verticale, comme le dit le cours : « la rotation reste autour de la verticale ».

**La convention XYZ (téléphone).** Le cours montre aussi la séquence inverse : roulis autour de X → tangage autour de Y → lacet autour de Z (convention intrinsèque, chaque rotation suit un axe mobile du téléphone) :

\[
{}^0R_3 = R_x(\varphi)\,R_y(\theta)\,R_z(\psi)
\]

Avec \(\varphi = +90°\) autour de \(\vec{x}_0\), \(\theta = +90°\) autour de \(\vec{y}_1\), \(\psi = -90°\) autour de \(\vec{z}_2\) : après le roulis, \(\vec{x}_1 = \vec{x}_0\), \(\vec{y}_1 = \vec{z}_0\), \(\vec{z}_1 = -\vec{y}_0\) ; après le tangage, \(\vec{x}_2 = \vec{y}_0\), \(\vec{y}_2 = \vec{z}_0\), \(\vec{z}_2 = \vec{x}_0\) ; après le lacet, \(\vec{x}_3 = -\vec{z}_0\), \(\vec{y}_3 = \vec{y}_0\), \(\vec{z}_3 = \vec{x}_0\).

> À \(\theta = 90°\) : \(\vec{z}_2 = \vec{x}_0\). Le premier et le dernier axe de rotation sont alignés.

C'est la **singularité** annoncée dans l'objectif : quand l'angle du milieu vaut ±90°, la première et la troisième rotation tournent autour du même axe. Elles ne sont plus indépendantes ; on perd un degré de liberté dans la description (les trois angles ne décrivent plus que deux mouvements distincts). Avec ZYX, cela arrive pour \(\beta = \pm 90°\) (\(\vec{x}_2 = \mp\vec{z}_0\)). On peut le constater avec le bouton « β = 90° » de la figure ci-dessous : α et γ produisent alors le même mouvement. *(complément pour l'interprétation)*

<div class="widget" data-widget="euler"></div>

Exemple numérique
{ .etape }

\(\alpha = 90°\), \(\beta = 0\), \(\gamma = 90°\) :

\[
R_z(90°) = \begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix},
\quad
R_x(90°) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{pmatrix},
\quad
R^{(0,s)} = R_z(90°)\,R_x(90°) = \begin{pmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{pmatrix}
\]

Lecture : \(\vec{x}_s = \vec{y}_0\), \(\vec{y}_s = \vec{z}_0\), \(\vec{z}_s = \vec{x}_0\). Dans l'ordre inverse, \(R_x(90°)\,R_z(90°) = \begin{pmatrix} 0 & -1 & 0 \\ 0 & 0 & -1 \\ 1 & 0 & 0 \end{pmatrix}\) : une orientation différente. L'ordre des rotations doit toujours être précisé.

#### 3-5 Changement de repère d'un vecteur { #changement-repere }

Intuition
{ .etape }

Un même vecteur physique (une force, un déplacement, la direction d'un instrument) a des composantes différentes selon le repère dans lequel on le décrit. La matrice de rotation est le « traducteur » qui convertit les composantes d'un repère à l'autre.

Formalisation
{ .etape }

\[
\boxed{V^i = R^{i,j} \cdot V^j} \qquad (1.2)
\]

Si l'on connaît les coordonnées d'un vecteur dans le **repère j**, on obtient ses coordonnées dans le **repère i** en multipliant par la matrice de rotation \(R^{i,j}\).

En projetant la relation de Chasles (1.1) dans \(R_0\) :

\[
\boxed{O_0M^0 = O_0O_s^0 + R^{0,s}\,O_sM^s} \qquad (1.3)
\]

\(O_sM^s\) est constant (coordonnées de M dans le repère du solide) ; \(R^{0,s}\) le ramène dans \(R_0\) ; \(O_0O_s^0\) ajoute la position de l'origine du solide. L'orientation de l'objet S par rapport à \(R_0\) est ainsi définie, entre autres, par la matrice d'orientation \(R^{0,s}\).

Dans l'autre sens, puisque \(R^{-1} = R^T\) : \(V^j = R^{j,i}\,V^i\) avec \(R^{j,i} = (R^{i,j})^T\). *(complément)*

Exemple
{ .etape }

Un instrument est fixé au solide S. Son origine est en \(O_0O_s^0 = (1;\ 2;\ 0)^T\) m, son repère est tourné de \(\alpha = 90°\) autour de \(\vec{z}_0\), et sa pointe M est à \(O_sM^s = (0{,}5;\ 0;\ 0)^T\) m le long de son axe \(\vec{x}_s\).

\[
O_0M^0 =
\begin{pmatrix} 1 \\ 2 \\ 0 \end{pmatrix}
+
\begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}
\begin{pmatrix} 0{,}5 \\ 0 \\ 0 \end{pmatrix}
=
\begin{pmatrix} 1 \\ 2 \\ 0 \end{pmatrix}
+
\begin{pmatrix} 0 \\ 0{,}5 \\ 0 \end{pmatrix}
=
\begin{pmatrix} 1 \\ 2{,}5 \\ 0 \end{pmatrix} \text{ m}
\]

Ce résultat est cohérent : après la rotation de 90°, l'axe \(\vec{x}_s\) de l'instrument pointe selon \(\vec{y}_0\).

### 4. Représentation complète (position + orientation) { #situation }

> La **situation** (ou **configuration**) d'un corps rigide dans l'espace est la combinaison de sa position \(\vec{p}\) et de son orientation \(R\). On la note \(\{\mathbf{R}, \vec{p}\}\) ou \((\mathbf{R}, \vec{p})\).

Elle nécessite **6 paramètres indépendants** : 3 pour la position \((P_x, P_y, P_z)\) et 3 pour l'orientation, par exemple les 3 angles d'Euler, ou les 9 éléments de \(R\) avec 6 contraintes d'orthonormalité (\(9 - 6 = 3\)).

Pourquoi orienter l'outil d'un robot médical ? Position : où placer la pointe de l'aiguille (les coordonnées x, y, z situent le point P). Orientation : dans quelle direction orienter l'aiguille (trois angles décrivent l'orientation de l'outil). Angles d'Euler : décrire une orientation par trois rotations successives ; l'ordre des rotations doit être précisé.

La partie 3 réunit \(\vec{p}\) et \(R\) dans une seule matrice 4 × 4 : [4.3 Transformations homogènes](3-transformations-homogenes.md).

## Formules clés

\[
\vec{z} = \vec{x} \times \vec{y}
\qquad
\overrightarrow{OP} = x\,\vec{x} + y\,\vec{y} + z\,\vec{z},\quad x = \overrightarrow{OP} \cdot \vec{x}
\]

\[
r = \sqrt{x^2 + y^2},\quad \theta = \operatorname{atan2}(y, x)
\qquad
x = r\cos\theta,\quad y = r\sin\theta
\]

\[
\overrightarrow{O_0 M} = \overrightarrow{O_0 O_s} + \overrightarrow{O_s M} \quad (1.1)
\qquad
V^i = R^{i,j}\,V^j \quad (1.2)
\qquad
O_0M^0 = O_0O_s^0 + R^{0,s}\,O_sM^s \quad (1.3)
\]

\[
R^{(0,S)} = \Big[\ [\vec{x}_S]_{R_0}\ \ [\vec{y}_S]_{R_0}\ \ [\vec{z}_S]_{R_0}\ \Big]
\qquad
\mathbf{R}^T\mathbf{R} = \mathbf{I},\quad \mathbf{R}^{-1} = \mathbf{R}^T,\quad \det\mathbf{R} = +1
\]

\[
R_z(\alpha) = \begin{pmatrix} \cos\alpha & -\sin\alpha & 0 \\ \sin\alpha & \cos\alpha & 0 \\ 0 & 0 & 1 \end{pmatrix}
\quad
R_y(\beta) = \begin{pmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{pmatrix}
\quad
R_x(\gamma) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\gamma & -\sin\gamma \\ 0 & \sin\gamma & \cos\gamma \end{pmatrix}
\]

\[
\text{ZYX : } R^{(0,s)} = R_z(\alpha)\,R_y(\beta)\,R_x(\gamma)
\qquad
\text{XYZ : } {}^0R_3 = R_x(\varphi)\,R_y(\theta)\,R_z(\psi)
\]

## Questions d'auto-évaluation

1. Qu'est-ce qu'une base orthonormée directe ? Comment vérifie-t-on qu'elle est directe ?

    <details markdown><summary>Réponse</summary>
    Trois vecteurs unitaires, deux à deux orthogonaux, avec \(\vec{z} = \vec{x} \times \vec{y}\) (règle de la main droite). On vérifie le produit vectoriel des deux premiers axes, ou que la matrice formée par les trois axes a un déterminant égal à +1.
    </details>

2. Convertissez \(P = (0,\ -2,\ 1)\) en coordonnées cylindriques.

    <details markdown><summary>Réponse</summary>
    \(r = \sqrt{0 + 4} = 2\) ; \(\theta = \operatorname{atan2}(-2, 0) = -90°\) ; \(z = 1\). Donc \(P = (2;\ -90°;\ 1)\).
    </details>

3. Que contient la 2<sup>e</sup> colonne de \(R^{0,S}\) ?

    <details markdown><summary>Réponse</summary>
    Les coordonnées du vecteur unitaire \(\vec{y}_S\) (axe y du solide) exprimées dans le repère fixe \(R_0\).
    </details>

4. On donne \(R = \begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}\). Vérifiez que c'est une matrice de rotation et donnez \(R^{-1}\).

    <details markdown><summary>Réponse</summary>
    Colonnes unitaires et deux à deux orthogonales, \(\det R = 0 \cdot 0 - (-1) \cdot 1 = 1\) (développement sur le bloc 2 × 2). C'est \(R_z(90°)\). \(R^{-1} = R^T = \begin{pmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix} = R_z(-90°)\).
    </details>

5. Écrivez \(R_y(\beta)\) et indiquez l'axe conservé.

    <details markdown><summary>Réponse</summary>
    \(R_y(\beta) = \begin{pmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{pmatrix}\). L'axe y est conservé : \(\vec{y}_1 = \vec{y}_2\) (la 2<sup>e</sup> colonne est \((0, 1, 0)^T\)).
    </details>

6. Dans la convention ZYX, autour de quels axes se font les trois rotations ? Pourquoi dit-on « axes mobiles » ?

    <details markdown><summary>Réponse</summary>
    Autour de \(\vec{z}_0\) (lacet α), puis du nouvel axe \(\vec{y}_1\) (tangage β), puis du nouvel axe \(\vec{x}_2\) (roulis γ). Axes mobiles (intrinsèques) : chaque rotation se fait autour d'un axe du repère déjà tourné, pas autour des axes fixes de départ.
    </details>

7. Que se passe-t-il pour la convention ZYX quand \(\beta = 90°\) ?

    <details markdown><summary>Réponse</summary>
    \(\vec{x}_2 = -\vec{z}_0\) : l'axe du roulis est aligné avec l'axe du lacet. Les rotations α et γ se font autour du même axe et ne sont plus indépendantes : c'est une singularité de la représentation.
    </details>

8. Un vecteur vaut \(V^1 = (1;\ 0;\ 0)^T\) dans \(R_1\), avec \(R^{0,1} = R_z(30°)\). Calculez \(V^0\).

    <details markdown><summary>Réponse</summary>
    \(V^0 = R^{0,1} V^1\) = première colonne de \(R_z(30°)\) = \((0{,}866;\ 0{,}5;\ 0)^T\).
    </details>

9. Dans la relation (1.3), quel terme change quand le solide bouge et quel terme reste constant ?

    <details markdown><summary>Réponse</summary>
    \(O_sM^s\) reste constant (M est fixe dans le repère du solide indéformable). \(O_0O_s^0\) (position) et \(R^{0,s}\) (orientation) changent avec le mouvement du solide.
    </details>

10. Pourquoi faut-il 6 paramètres pour la situation d'un corps rigide, alors que \(R\) contient 9 nombres ?

    <details markdown><summary>Réponse</summary>
    3 pour la position et 3 pour l'orientation. Les 9 éléments de \(R\) ne sont pas indépendants : ils sont liés par 6 contraintes d'orthonormalité (3 normes unitaires, 3 orthogonalités), il reste \(9 - 6 = 3\) paramètres libres.
    </details>
