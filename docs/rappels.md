# Rappels : les prérequis du cours

Cette page reprend les notions de mathématiques que le cours suppose acquises. Chaque rappel suit le même ordre que les pages de cours : l'idée, la formule, un petit exemple. Le [module de rappel du cours (cours 3)](cours/03-rappels-cinematique.md) traite déjà les vecteurs, les produits et les matrices avec les notations du professeur ; ici, on revient un cran plus bas.

## Trigonométrie { #trigo }

### Sinus, cosinus, tangente

Intuition
{ .etape }

Un segment de robot de longueur \(l\), incliné d'un angle \(\theta\), « projette » une longueur \(l\cos\theta\) à l'horizontale et \(l\sin\theta\) à la verticale. C'est presque toute la trigonométrie dont on a besoin en cinématique.

Formules
{ .etape }

Dans un triangle rectangle, pour un angle aigu \(a\) :

\[
\sin a = \frac{\text{côté opposé}}{\text{hypoténuse}}
\qquad
\cos a = \frac{\text{côté adjacent}}{\text{hypoténuse}}
\qquad
\tan a = \frac{\sin a}{\cos a} = \frac{\text{opposé}}{\text{adjacent}}
\]

Pour un segment de longueur \(l\) faisant l'angle \(\theta\) avec l'axe x : extrémité en \((l\cos\theta,\ l\sin\theta)\).

Exemple
{ .etape }

Segment de 0,4 m à 30° : \(x = 0{,}4 \times 0{,}866 = 0{,}346\) m ; \(y = 0{,}4 \times 0{,}5 = 0{,}2\) m. Vérification : \(0{,}346^2 + 0{,}2^2 = 0{,}16 = 0{,}4^2\).

### Degrés et radians

Un tour complet vaut \(360° = 2\pi\) rad. Donc \(180° = \pi\) rad et

\[
\theta_{\text{rad}} = \theta_{\text{deg}} \times \frac{\pi}{180}
\]

Exemple : \(45° = \pi/4 \approx 0{,}785\) rad ; \(1\) rad \(\approx 57{,}3°\). Les calculatrices et les logiciels (MATLAB, Python) travaillent souvent en radians : vérifier le mode avant de calculer un cosinus.

### Le cercle trigonométrique

Intuition
{ .etape }

Le triangle rectangle ne marche que pour des angles entre 0 et 90°. Un robot, lui, tourne dans les deux sens et sur 360°. Le cercle trigonométrique étend sinus et cosinus à tous les angles : on fait tourner un rayon de longueur 1 depuis l'axe x ; \(\cos\theta\) est l'abscisse de son extrémité, \(\sin\theta\) son ordonnée.

Règles
{ .etape }

- Sens positif : sens trigonométrique (contraire des aiguilles d'une montre). C'est le sens donné par la règle de la main droite autour d'un axe z qui sort de la feuille.
- \(\cos^2\theta + \sin^2\theta = 1\).
- Angle opposé : \(\cos(-\theta) = \cos\theta\), \(\sin(-\theta) = -\sin\theta\).
- Signes : quadrant 1 (0° à 90°) \(\cos > 0, \sin > 0\) ; quadrant 2 (90° à 180°) \(\cos < 0, \sin > 0\) ; quadrant 3 \(\cos < 0, \sin < 0\) ; quadrant 4 \(\cos > 0, \sin < 0\).

Valeurs à connaître :

| \(\theta\) | 0° | 30° | 45° | 60° | 90° | 180° |
|---|---|---|---|---|---|---|
| \(\cos\theta\) | 1 | \(\sqrt{3}/2 \approx 0{,}866\) | \(\sqrt{2}/2 \approx 0{,}707\) | 0,5 | 0 | −1 |
| \(\sin\theta\) | 0 | 0,5 | \(\sqrt{2}/2 \approx 0{,}707\) | \(\sqrt{3}/2 \approx 0{,}866\) | 1 | 0 |

### Angles associés : π/2 ± α { #angles-associes }

Ce sont les formules utilisées dans l'exercice des [deux repères](cours/03-rappels-cinematique.md#deux-reperes-scalaire) :

\[
\cos\!\left(\tfrac{\pi}{2} - \alpha\right) = \sin\alpha
\qquad
\cos\!\left(\tfrac{\pi}{2} + \alpha\right) = -\sin\alpha
\qquad
\sin\!\left(\tfrac{\pi}{2} - \alpha\right) = \cos\alpha
\qquad
\sin\!\left(\tfrac{\pi}{2} + \alpha\right) = \cos\alpha
\]

Moyen de les retrouver : avec \(\alpha = 30°\), \(\cos 60° = 0{,}5 = \sin 30°\) et \(\cos 120° = -0{,}5 = -\sin 30°\).

### Formules d'addition { #addition }

Elles servent à simplifier le produit de deux rotations, par exemple dans le [bras plan à deux segments](cours/04-description-spatiale/3-transformations-homogenes.md#bras-plan) :

\[
\cos(a + b) = \cos a \cos b - \sin a \sin b
\qquad
\sin(a + b) = \sin a \cos b + \cos a \sin b
\]

Conséquence : \(R_z(\theta_1)\,R_z(\theta_2) = R_z(\theta_1 + \theta_2)\). Deux rotations successives autour du même axe s'additionnent.

Exemple
{ .etape }

\[
\cos 75° = \cos(30° + 45°) = 0{,}866 \times 0{,}707 - 0{,}5 \times 0{,}707 = 0{,}612 - 0{,}354 = 0{,}259
\]

### La fonction atan2 { #atan2 }

Intuition
{ .etape }

Pour retrouver un angle à partir de \(x\) et \(y\), \(\arctan(y/x)\) ne suffit pas : \((1, 1)\) et \((-1, -1)\) donnent le même quotient \(y/x = 1\), alors que ce sont deux directions opposées. La fonction \(\operatorname{atan2}(y, x)\) regarde les signes de \(x\) et de \(y\) séparément et renvoie le bon angle, entre −180° et 180°.

Exemple
{ .etape }

\(\operatorname{atan2}(1, 1) = 45°\) ; \(\operatorname{atan2}(-1, -1) = -135°\) ; \(\operatorname{atan2}(1, -1) = 135°\) ; \(\operatorname{atan2}(-2, 0) = -90°\). Attention à l'ordre des arguments : \(y\) d'abord, puis \(x\). Utilisé dans les [conversions de coordonnées](cours/04-description-spatiale/2-reperes-orientation.md#conversions).

## Vecteurs { #vecteurs }

Intuition
{ .etape }

Un vecteur est une flèche : une direction, un sens, une longueur. Un point est un endroit ; le vecteur \(\overrightarrow{AB}\) est le déplacement qui mène de A à B.

Règles
{ .etape }

- Composantes : si \(A = (x_A, y_A, z_A)\) et \(B = (x_B, y_B, z_B)\), alors \(\overrightarrow{AB} = (x_B - x_A,\ y_B - y_A,\ z_B - z_A)^T\).
- Addition composante par composante ; multiplication par un nombre : chaque composante est multipliée.
- Relation de Chasles : \(\overrightarrow{AC} = \overrightarrow{AB} + \overrightarrow{BC}\) (les déplacements s'enchaînent).
- Norme et vecteur unitaire : voir le [cours 3](cours/03-rappels-cinematique.md#norme).

Exemple
{ .etape }

\(A = (1, 2, 0)\), \(B = (4, 6, 0)\) : \(\overrightarrow{AB} = (3, 4, 0)^T\), de longueur \(\sqrt{9 + 16} = 5\).

## Produit scalaire { #produit-scalaire }

Le produit scalaire \(\vec{a} \cdot \vec{b} = a_x b_x + a_y b_y + a_z b_z = \|\vec{a}\|\,\|\vec{b}\|\cos\theta\) est un nombre.

- Si \(\vec{u}\) est unitaire, \(\vec{a} \cdot \vec{u}\) est la **projection** de \(\vec{a}\) sur la direction de \(\vec{u}\) : la « longueur de l'ombre » de \(\vec{a}\) sur cet axe. C'est ainsi qu'on obtient les coordonnées d'un point : \(x = \overrightarrow{OP} \cdot \vec{x}\).
- Signe : positif si l'angle est aigu, nul à 90°, négatif si l'angle est obtus.
- Angle entre deux vecteurs : \(\theta = \arccos\dfrac{\vec{a} \cdot \vec{b}}{\|\vec{a}\|\,\|\vec{b}\|}\).

Exemple : la projection de \(\vec{a} = (3, 4, 0)\) sur \(\vec{x} = (1, 0, 0)\) vaut 3. Suite et exercices : [cours 3, produit scalaire](cours/03-rappels-cinematique.md#produit-scalaire).

## Produit vectoriel et règle de la main droite { #produit-vectoriel }

Intuition
{ .etape }

Main droite ouverte : les doigts pointent selon le premier vecteur, on les replie vers le second ; le pouce donne le sens du résultat. Avec \(\vec{x}\) puis \(\vec{y}\), le pouce indique \(\vec{z}\) : c'est la définition d'un repère direct.

Règles
{ .etape }

\[
\vec{x} \wedge \vec{y} = \vec{z}
\qquad
\vec{y} \wedge \vec{z} = \vec{x}
\qquad
\vec{z} \wedge \vec{x} = \vec{y}
\qquad
\vec{y} \wedge \vec{x} = -\vec{z}
\qquad
\vec{u} \wedge \vec{u} = \vec{0}
\]

Moyen mnémotechnique : dans l'ordre cyclique x → y → z → x, le produit de deux axes consécutifs donne le troisième avec un signe +, et avec un signe − dans l'ordre inverse. Formule en coordonnées et exercices : [cours 3, produit vectoriel](cours/03-rappels-cinematique.md#produit-vectoriel).

La même règle de la main droite fixe le **sens positif d'une rotation** : pouce le long de l'axe, les doigts enroulés indiquent le sens dans lequel l'angle augmente.

## Matrices { #matrices }

### Produit matrice × vecteur

Intuition
{ .etape }

Multiplier une matrice par un vecteur, c'est faire une combinaison des colonnes de la matrice, avec pour coefficients les composantes du vecteur. Pour une matrice de rotation, \(R\,(1, 0, 0)^T\) donne la première colonne : l'axe \(\vec{x}\) tourné.

\[
\begin{pmatrix} a & b \\ c & d \end{pmatrix}\begin{pmatrix} u \\ v \end{pmatrix}
= \begin{pmatrix} a u + b v \\ c u + d v \end{pmatrix}
= u \begin{pmatrix} a \\ c \end{pmatrix} + v \begin{pmatrix} b \\ d \end{pmatrix}
\]

Exemple : \(\begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix}\begin{pmatrix} 1 \\ 2 \end{pmatrix} = \begin{pmatrix} 4 \\ 6 \end{pmatrix}\).

### Produit de deux matrices, transposée

Voir le [cours 3](cours/03-rappels-cinematique.md#matrices) : règle d'or des dimensions, élément \((i, j)\) = ligne \(i\) × colonne \(j\), non-commutativité, transposée.

Une règle utile : \((AB)^T = B^T A^T\) (l'ordre s'inverse).

### Matrice identité et inverse

- L'**identité** \(I\) a des 1 sur la diagonale et des 0 ailleurs ; \(A I = I A = A\). C'est « ne rien faire » : \(R_z(0) = I\).
- L'**inverse** \(A^{-1}\) d'une matrice carrée vérifie \(A A^{-1} = A^{-1} A = I\) : c'est l'opération qui défait \(A\). Pour une rotation, défaire une rotation d'angle α, c'est tourner de −α, et l'on a \(R^{-1} = R^T\) ([cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#so3)).

### Déterminant

\[
\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc
\]

\[
\det\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}
= a(ei - fh) - b(di - fg) + c(dh - eg)
\]

Interprétation : facteur de changement de volume (d'aire en 2D), avec un signe. Une rotation ne change ni les volumes ni le « sens » du repère : \(\det R = +1\). Un déterminant −1 correspondrait à un miroir (repère indirect).

Exemple (en développant sur la 3<sup>e</sup> ligne de \(R_z(\alpha)\)) :

\[
\det R_z(\alpha) = \cos\alpha \cdot \cos\alpha - (-\sin\alpha)\sin\alpha = \cos^2\alpha + \sin^2\alpha = 1
\]

## Rotation dans le plan { #rotation-plan }

Intuition
{ .etape }

Faire tourner un repère d'un angle α, c'est faire tourner ses deux vecteurs de base. Le vecteur \(\vec{x}\) devient \((\cos\alpha, \sin\alpha)\), le vecteur \(\vec{y}\) devient \((-\sin\alpha, \cos\alpha)\) (il reste perpendiculaire, 90° plus loin). La matrice de rotation est simplement ces deux vecteurs rangés en colonnes.

\[
R(\alpha) = \begin{pmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{pmatrix}
\]

C'est le bloc 2 × 2 en haut à gauche de \(R_z(\alpha)\).

Exemple
{ .etape }

Rotation de 90° appliquée à \((1, 0)\) : \((0, 1)\). Appliquée à \((0, 1)\) : \((-1, 0)\). Le point tourne bien d'un quart de tour dans le sens trigonométrique. Figure interactive : [cours 4.2](cours/04-description-spatiale/2-reperes-orientation.md#r0s).

## Dérivées { #derivees }

Les cours 1 à 4 ne dérivent encore rien, mais le module annonce la suite : vitesses, matrice jacobienne \(\dot{x} = J(q)\,\dot{q}\), dynamique.

Intuition
{ .etape }

La dérivée mesure la vitesse de variation. Si \(\theta(t)\) est l'angle d'un pivot au cours du temps, \(\dot{\theta} = \dfrac{d\theta}{dt}\) est la vitesse articulaire (en rad/s ou °/s). Le point au-dessus d'une lettre signifie « dérivée par rapport au temps ».

Règles utiles
{ .etape }

| Fonction | Dérivée |
|---|---|
| \(c\) (constante) | 0 |
| \(t^n\) | \(n\,t^{n-1}\) |
| \(\sin t\) | \(\cos t\) |
| \(\cos t\) | \(-\sin t\) |
| \(f(g(t))\) | \(f'(g(t))\,g'(t)\) (dérivée composée) |

Dérivée composée, la plus utilisée en robotique : \(\dfrac{d}{dt}\cos\theta(t) = -\sin\theta(t)\,\dot{\theta}\).

Exemple
{ .etape }

Un segment de longueur \(l\) tourne : son extrémité est en \(x = l\cos\theta\), \(y = l\sin\theta\). En dérivant :

\[
\dot{x} = -l\sin\theta\,\dot{\theta}
\qquad
\dot{y} = l\cos\theta\,\dot{\theta}
\]

Avec \(l = 0{,}4\) m, \(\theta = 30°\), \(\dot{\theta} = 1\) rad/s : \(\dot{x} = -0{,}2\) m/s, \(\dot{y} = 0{,}346\) m/s, vitesse \(= 0{,}4\) m/s \(= l\,\dot{\theta}\). La vitesse de l'extrémité est perpendiculaire au segment, comme sur un cercle.
