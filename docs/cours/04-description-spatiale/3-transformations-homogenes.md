# 4.3 Transformations homogènes et mouvement rigide

Partie 3 du chapitre 2. Objectif pédagogique : comprendre comment unifier mathématiquement les rotations et les translations dans l'espace 3D. C'est le fondement algorithmique indispensable pour décrire le mouvement rigide d'un instrument chirurgical ou d'un bras robotique.

> Pour qu'un logiciel puisse calculer la trajectoire d'un robot, il doit traduire ces déplacements en **matrices 4 × 4** (transformations homogènes). Cette astuce mathématique permet d'enchaîner les mouvements par de simples multiplications. **La règle absolue** : l'ordre compte (tourner puis avancer n'est pas pareil qu'avancer puis tourner), et maîtriser l'inverse de ces matrices permet de changer instantanément de point de vue (par exemple, passer du repère de la caméra à celui de l'organe).

## 1. Pourquoi les matrices homogènes ? { #pourquoi }

Intuition
{ .etape }

La relation (1.3) du [cours 4.2](2-reperes-orientation.md#changement-repere) mélange une multiplication (la rotation) et une addition (la translation). Dès qu'il y a plusieurs segments, ces opérations s'empilent et deviennent pénibles. La matrice homogène range rotation et translation dans un seul tableau, pour que **tout** devienne une multiplication.

Pour une étude géométrique, cinématique ou dynamique d'un objet, il est commode de rassembler sa position et son orientation dans une seule représentation. Au lieu de manipuler séparément :

- une matrice 3 × 3 pour l'orientation (\(R^{0,S}\) ou \(R_0^S\)),
- un vecteur 3 × 1 pour la position (\(O_0O_s\)),

on combine les deux dans une seule matrice 4 × 4.

## 2. Définition de la matrice homogène { #definition }

Si les coordonnées du centre \(O_s\) du repère \(R_s\) sont

\[
O_0O_s^0 = \begin{pmatrix} X \\ Y \\ Z \end{pmatrix}
\]

et si l'orientation est définie par \(R^{0,S}\), alors la **matrice homogène** qui représente le solide S par rapport à \(R_0\) est :

\[
T^{0,s} =
\begin{pmatrix} R^{0,S} & O_0O_s^0 \\ 0\ 0\ 0 & 1 \end{pmatrix}
=
\begin{pmatrix}
a_x & b_x & c_x & X \\
a_y & b_y & c_y & Y \\
a_z & b_z & c_z & Z \\
0 & 0 & 0 & 1
\end{pmatrix}
\]

Les trois premières colonnes du bloc 3 × 3 sont \([\vec{x}_s]_{R_0} = (a_x, a_y, a_z)^T\), \([\vec{y}_s]_{R_0} = (b_x, b_y, b_z)^T\), \([\vec{z}_s]_{R_0} = (c_x, c_y, c_z)^T\) ; la 4<sup>e</sup> colonne est la position de l'origine \(O_s\).

**Principe général (notation \(T_0^1\)).** La matrice de transformation homogène \(T_0^1\) est composée de deux blocs majeurs :

\[
T_0^1 =
\begin{pmatrix} \mathbf{R}_0^1 & \mathbf{P}_0^1 \\ 0_{1 \times 3} & 1 \end{pmatrix}
=
\begin{pmatrix}
r_{11} & r_{12} & r_{13} & P_x \\
r_{21} & r_{22} & r_{23} & P_y \\
r_{31} & r_{32} & r_{33} & P_z \\
0 & 0 & 0 & 1
\end{pmatrix}
\]

- \(\mathbf{R}_0^1\) (matrice de rotation 3 × 3) exprime l'orientation des axes du repère \(R_1\) par rapport aux axes du repère de base \(R_0\).
- \(\mathbf{P}_0^1\) (vecteur de translation 3 × 1) exprime les coordonnées du centre \(O_1\) du repère dans le repère \(R_0\).

### Utiliser la matrice homogène : la relation (1.3) en une multiplication { #utilisation }

On ajoute un 1 comme 4<sup>e</sup> coordonnée des points (coordonnées homogènes). Alors :

\[
\begin{pmatrix} O_0M^0 \\ 1 \end{pmatrix}
= T^{0,s}
\begin{pmatrix} O_sM^s \\ 1 \end{pmatrix}
\]

En effectuant le produit par blocs, on retrouve exactement (1.3) : \(O_0M^0 = R^{0,s}\,O_sM^s + O_0O_s^0\), et la dernière ligne donne \(0 + 1 = 1\). Le 1 « active » la 4<sup>e</sup> colonne, c'est-à-dire la translation. *(complément)*

Exemple
{ .etape }

Reprise de l'exemple du cours 4.2 : origine en \((1;\ 2;\ 0)\), rotation de 90° autour de \(\vec{z}_0\), pointe en \(O_sM^s = (0{,}5;\ 0;\ 0)\).

\[
T^{0,s} = \begin{pmatrix} 0 & -1 & 0 & 1 \\ 1 & 0 & 0 & 2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}
\qquad
T^{0,s}\begin{pmatrix} 0{,}5 \\ 0 \\ 0 \\ 1 \end{pmatrix}
= \begin{pmatrix} 0 \cdot 0{,}5 + 1 \\ 1 \cdot 0{,}5 + 2 \\ 0 \\ 1 \end{pmatrix}
= \begin{pmatrix} 1 \\ 2{,}5 \\ 0 \\ 1 \end{pmatrix}
\]

Même résultat qu'avec (1.3), en une seule multiplication.

## 3. Propriétés des matrices homogènes

### 3-1 Composition des transformations (chaîne cinématique) { #composition }

Intuition
{ .etape }

Dans un bras série, chaque segment est posé sur le précédent. On connaît facilement la pose du segment 1 par rapport à la base, du segment 2 par rapport au segment 1, etc. Pour avoir la pose de l'outil par rapport à la base, on enchaîne : c'est une multiplication de matrices, de la base vers l'outil.

Formalisation
{ .etape }

En robotique, l'étude d'un système multicorps en mouvement relatif nécessite un outil mathématique adapté ; les matrices homogènes offrent une représentation particulièrement efficace pour modéliser ces transformations géométriques. Pour une chaîne cinématique ouverte de \(n\) solides articulés en série, de repères \(R_0, R_1, \dots, R_n\), la position et l'orientation du solide \(S_n\) par rapport au solide de base \(S_0\) (immobile) est donnée par :

\[
\boxed{T^{0,n} = T^{0,1}\,T^{1,2} \cdots T^{n-1,n}}
\]

Cette relation permet de définir les expressions géométriques de l'organe terminal du robot par rapport à la base fixe.

Lecture des indices : les indices « intérieurs » s'enchaînent (0,**1**)(**1**,2)(2,…), comme des dominos ; il reste les indices extérieurs (0, n). Un produit dont les indices ne s'enchaînent pas, comme \(T^{0,1}T^{2,3}\), n'a pas de sens physique. *(complément)*

### L'ordre compte

Le produit matriciel n'est pas commutatif ([module de rappel](../03-rappels-cinematique.md#matrices)). Tourner puis avancer sur le nouvel axe ne mène pas au même endroit qu'avancer puis tourner :

<div class="widget" data-widget="ordre"></div>

Exemple
{ .etape }

\(\alpha = 90°\), \(d = 1\). Tourner puis avancer : \(\text{Rot}(z, 90°)\,\text{Trans}(x, 1)\) amène l'origine en \((0;\ 1;\ 0)\), car on avance selon le nouvel axe x, qui pointe selon \(\vec{y}_0\). Avancer puis tourner : \(\text{Trans}(x, 1)\,\text{Rot}(z, 90°)\) amène l'origine en \((1;\ 0;\ 0)\). L'orientation finale est la même, la position non. *(complément)*

### 3-2 Exemple : bras plan à deux segments { #bras-plan }

On considère un bras plan formé de deux segments de longueurs \(l_1\) et \(l_2\) (exemple du cours) :

- **Repère fixe \(R_0(O_0, x_0, y_0, z_0)\)** : repère de base fixe lié à la terre en \(O_0\) (\(O_0 = O_1\)).
- **Repère \(R_1(O_1, x_1, y_1, z_1)\)** : centré en \(O_1\) ; son axe \(x_1\) est porté par le segment 1 de longueur \(l_1\) et orienté d'un angle \(\theta_1\) par rapport à \(x_0\), autour de l'axe commun \(z_0 = z_1\).
- **Repère \(R_2(O_2, x_2, y_2, z_2)\)** : centré en \(O_2\) ; son axe \(x_2\) est porté par le segment 2 de longueur \(l_2\) et orienté d'un angle \(\theta_2\) par rapport à \(x_1\), autour de l'axe commun \(z_1 = z_2\).
- Le point M est l'extrémité du segment 2 (l'organe terminal).

<svg class="schema" viewBox="0 0 340 260" width="340" role="img" aria-label="Bras plan à deux segments avec ses repères">
  <defs>
    <marker id="ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#5b6474"/></marker>
    <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#c0392b"/></marker>
    <marker id="av" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1e8449"/></marker>
  </defs>
  <line x1="40" y1="220" x2="320" y2="220" stroke="#5b6474" stroke-width="1.2" marker-end="url(#ag)"/>
  <line x1="40" y1="220" x2="40" y2="20" stroke="#5b6474" stroke-width="1.2" marker-end="url(#ag)"/>
  <text x="318" y="238" font-size="14" font-style="italic" fill="#5b6474">x₀</text>
  <text x="48" y="24" font-size="14" font-style="italic" fill="#5b6474">y₀</text>
  <line x1="218" y1="149.2" x2="290" y2="120.5" stroke="#5b6474" stroke-dasharray="4 4"/>
  <line x1="40" y1="220" x2="218" y2="149.2" stroke="#1f7a7a" stroke-width="6" stroke-linecap="round"/>
  <line x1="218" y1="149.2" x2="268" y2="49.2" stroke="#7d3c98" stroke-width="6" stroke-linecap="round"/>
  <line x1="40" y1="220" x2="96" y2="197.7" stroke="#c0392b" stroke-width="1.8" marker-end="url(#ar)"/>
  <line x1="40" y1="220" x2="17.7" y2="164" stroke="#1e8449" stroke-width="1.8" marker-end="url(#av)"/>
  <text x="96" y="214" font-size="13" font-style="italic" fill="#c0392b">x₁</text>
  <text x="6" y="160" font-size="13" font-style="italic" fill="#1e8449">y₁</text>
  <line x1="218" y1="149.2" x2="245" y2="95.3" stroke="#c0392b" stroke-width="1.8" marker-end="url(#ar)"/>
  <line x1="218" y1="149.2" x2="164.1" y2="122.3" stroke="#1e8449" stroke-width="1.8" marker-end="url(#av)"/>
  <text x="240" y="100" font-size="13" font-style="italic" fill="#c0392b" dx="10">x₂</text>
  <text x="150" y="116" font-size="13" font-style="italic" fill="#1e8449">y₂</text>
  <path d="M 110 220 A 70 70 0 0 0 105 194.1" fill="none" stroke="#1d2330"/>
  <text x="114" y="206" font-size="14" font-style="italic">θ₁</text>
  <path d="M 255.2 134.4 A 40 40 0 0 0 235.9 113.4" fill="none" stroke="#1d2330"/>
  <text x="262" y="134" font-size="14" font-style="italic">θ₂</text>
  <circle cx="40" cy="220" r="6" fill="#fff" stroke="#1d2330" stroke-width="1.5"/>
  <circle cx="218" cy="149.2" r="6" fill="#fff" stroke="#1d2330" stroke-width="1.5"/>
  <circle cx="268" cy="49.2" r="3.5" fill="#1d2330"/>
  <text x="276" y="48" font-size="14" font-style="italic">M</text>
  <text x="34" y="244" font-size="12">O₀ = O₁</text>
  <text x="222" y="170" font-size="12">O₂</text>
  <text x="118" y="178" font-size="13" font-style="italic" fill="#1f7a7a">l₁</text>
  <text x="250" y="95" font-size="13" font-style="italic" fill="#7d3c98" dx="-34" dy="-30">l₂</text>
</svg>

Le cours s'arrête à la mise en place des repères et au principe de la matrice \(T_0^1\). La suite du calcul ci-dessous applique les définitions précédentes. *(complément)*

Étape 1 : transformation de \(R_0\) vers \(R_1\)
{ .etape }

\(R_1\) a la même origine que \(R_0\) et a tourné de \(\theta_1\) autour de \(z_0\) :

\[
T^{0,1} =
\begin{pmatrix}
\cos\theta_1 & -\sin\theta_1 & 0 & 0 \\
\sin\theta_1 & \cos\theta_1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
\]

Étape 2 : transformation de \(R_1\) vers \(R_2\)
{ .etape }

\(R_2\) a tourné de \(\theta_2\) autour de \(z_1\), et son origine \(O_2\) est au bout du segment 1, donc à \(l_1\) sur l'axe \(x_1\) : \(O_1O_2^1 = (l_1;\ 0;\ 0)^T\).

\[
T^{1,2} =
\begin{pmatrix}
\cos\theta_2 & -\sin\theta_2 & 0 & l_1 \\
\sin\theta_2 & \cos\theta_2 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
\]

Étape 3 : composition
{ .etape }

On note \(c_1 = \cos\theta_1\), \(s_1 = \sin\theta_1\), \(c_{12} = \cos(\theta_1 + \theta_2)\), \(s_{12} = \sin(\theta_1 + \theta_2)\). Le produit du bloc 3 × 3 donne \(c_1 c_2 - s_1 s_2 = c_{12}\) et \(s_1 c_2 + c_1 s_2 = s_{12}\) (formules d'addition, voir [Rappels](../../rappels.md#addition)) :

\[
T^{0,2} = T^{0,1}\,T^{1,2} =
\begin{pmatrix}
c_{12} & -s_{12} & 0 & l_1 c_1 \\
s_{12} & c_{12} & 0 & l_1 s_1 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
\]

Lecture : le repère \(R_2\) est tourné de \(\theta_1 + \theta_2\) par rapport à \(R_0\), et son origine \(O_2\) est en \((l_1 c_1;\ l_1 s_1;\ 0)\).

Étape 4 : position de l'organe terminal M
{ .etape }

M est sur l'axe \(x_2\), à la distance \(l_2\) de \(O_2\) : \(O_2M^2 = (l_2;\ 0;\ 0)^T\).

\[
\begin{pmatrix} O_0M^0 \\ 1 \end{pmatrix} = T^{0,2} \begin{pmatrix} l_2 \\ 0 \\ 0 \\ 1 \end{pmatrix}
\quad\Rightarrow\quad
\boxed{
\begin{aligned}
x_M &= l_1\cos\theta_1 + l_2\cos(\theta_1 + \theta_2) \\
y_M &= l_1\sin\theta_1 + l_2\sin(\theta_1 + \theta_2)
\end{aligned}
}
\]

C'est le **modèle géométrique direct** du bras plan : \(p = f(q)\) avec \(q = (\theta_1, \theta_2)\). On retrouve la même chose avec la relation de Chasles : \(\overrightarrow{O_0M} = \overrightarrow{O_0O_2} + \overrightarrow{O_2M}\), le premier vecteur de longueur \(l_1\) dans la direction \(\theta_1\), le second de longueur \(l_2\) dans la direction \(\theta_1 + \theta_2\).

Exemple numérique
{ .etape }

\(l_1 = 0{,}4\) m, \(l_2 = 0{,}3\) m, \(\theta_1 = 30°\), \(\theta_2 = 45°\), donc \(\theta_1 + \theta_2 = 75°\).

\[
x_M = 0{,}4 \cos 30° + 0{,}3 \cos 75° = 0{,}4 \times 0{,}866 + 0{,}3 \times 0{,}259 = 0{,}346 + 0{,}078 = 0{,}424 \text{ m}
\]

\[
y_M = 0{,}4 \sin 30° + 0{,}3 \sin 75° = 0{,}4 \times 0{,}5 + 0{,}3 \times 0{,}966 = 0{,}200 + 0{,}290 = 0{,}490 \text{ m}
\]

\[
T^{0,2} =
\begin{pmatrix}
0{,}259 & -0{,}966 & 0 & 0{,}346 \\
0{,}966 & 0{,}259 & 0 & 0{,}200 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
\]

Vérification : \(OM = \sqrt{0{,}424^2 + 0{,}490^2} \approx 0{,}648\) m, bien compris entre \(|l_1 - l_2| = 0{,}1\) m et \(l_1 + l_2 = 0{,}7\) m ([espace de travail](../02-caracteristiques-robotique-medicale.md#espace-de-travail)).

<div class="widget" data-widget="bras-2r"></div>

## 4. Inverse d'une matrice homogène { #inverse }

L'objectif de la partie 3 mentionne l'inverse : changer de point de vue, par exemple passer du repère de la caméra à celui de l'organe. Les diapositives ne donnent pas la formule ; la voici, déduite de \(R^{-1} = R^T\). *(complément)*

Si \(T^{0,1} = \begin{pmatrix} R & P \\ 0 & 1 \end{pmatrix}\), alors

\[
T^{1,0} = \left(T^{0,1}\right)^{-1} = \begin{pmatrix} R^T & -R^T P \\ 0 & 1 \end{pmatrix}
\]

Justification : si \(X^0 = R\,X^1 + P\), alors \(X^1 = R^T (X^0 - P) = R^T X^0 - R^T P\).

Exemple
{ .etape }

Avec \(T^{0,s}\) de l'exemple du paragraphe 2 (rotation de 90°, origine en \((1;\ 2;\ 0)\)) : \(R^T = \begin{pmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}\) et \(-R^T P = -(2;\ -1;\ 0)^T = (-2;\ 1;\ 0)^T\). Appliquée au point \(O_0M^0 = (1;\ 2{,}5;\ 0)\), l'inverse redonne

\[
O_sM^s = R^T O_0M^0 - R^T P = (0 \cdot 1 + 1 \cdot 2{,}5 - 2;\ -1 + 0 + 1;\ 0) = (0{,}5;\ 0;\ 0)
\]

## Formules clés

\[
T^{0,s} = \begin{pmatrix} R^{0,S} & O_0O_s^0 \\ 0\ 0\ 0 & 1 \end{pmatrix}
\qquad
\begin{pmatrix} O_0M^0 \\ 1 \end{pmatrix} = T^{0,s} \begin{pmatrix} O_sM^s \\ 1 \end{pmatrix}
\]

\[
T^{0,n} = T^{0,1}\,T^{1,2} \cdots T^{n-1,n}
\qquad
(T^{0,1})^{-1} = \begin{pmatrix} R^T & -R^T P \\ 0 & 1 \end{pmatrix}
\]

Bras plan à deux segments :

\[
x_M = l_1\cos\theta_1 + l_2\cos(\theta_1 + \theta_2)
\qquad
y_M = l_1\sin\theta_1 + l_2\sin(\theta_1 + \theta_2)
\qquad
\text{orientation : } \theta_1 + \theta_2
\]

## Questions d'auto-évaluation

1. Quelle est la dimension d'une matrice homogène et que contient chacun de ses blocs ?

    <details markdown><summary>Réponse</summary>
    4 × 4. Bloc 3 × 3 en haut à gauche : la matrice de rotation (orientation). Colonne 3 × 1 en haut à droite : la position de l'origine du repère mobile dans le repère de référence. Dernière ligne : \((0\ 0\ 0\ 1)\).
    </details>

2. Pourquoi ajoute-t-on un 1 comme 4<sup>e</sup> coordonnée d'un point ?

    <details markdown><summary>Réponse</summary>
    Pour que la multiplication par \(T\) applique à la fois la rotation et la translation : le 1 multiplie la 4<sup>e</sup> colonne (la position) et l'ajoute au résultat. On retrouve ainsi \(O_0M^0 = R\,O_sM^s + O_0O_s^0\) en une seule multiplication.
    </details>

3. Écrivez \(T^{0,3}\) pour une chaîne de trois solides. Le produit \(T^{1,2}\,T^{0,1}\) a-t-il un sens ?

    <details markdown><summary>Réponse</summary>
    \(T^{0,3} = T^{0,1}\,T^{1,2}\,T^{2,3}\). Le produit \(T^{1,2}\,T^{0,1}\) n'a pas de sens : les indices ne s'enchaînent pas, et le produit matriciel n'est pas commutatif.
    </details>

4. Un repère \(R_1\) est tourné de 90° autour de \(z_0\) et son origine est en \((0;\ 0;\ 0{,}5)\). Écrivez \(T^{0,1}\).

    <details markdown><summary>Réponse</summary>
    \(T^{0,1} = \begin{pmatrix} 0 & -1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0{,}5 \\ 0 & 0 & 0 & 1 \end{pmatrix}\).
    </details>

5. Pour le bras plan, pourquoi \(T^{1,2}\) contient-il \(l_1\) et pas \(l_2\) ?

    <details markdown><summary>Réponse</summary>
    La 4<sup>e</sup> colonne de \(T^{1,2}\) est la position de l'origine \(O_2\) dans \(R_1\) : \(O_2\) est au bout du segment 1, à \(l_1\) sur \(x_1\). La longueur \(l_2\) intervient seulement quand on place M dans \(R_2\) : \(O_2M^2 = (l_2;\ 0;\ 0)\).
    </details>

6. Calculez la position de M pour \(l_1 = l_2 = 0{,}5\) m, \(\theta_1 = 90°\), \(\theta_2 = -90°\).

    <details markdown><summary>Réponse</summary>
    \(x_M = 0{,}5 \cos 90° + 0{,}5 \cos 0° = 0{,}5\) m ; \(y_M = 0{,}5 \sin 90° + 0{,}5 \sin 0° = 0{,}5\) m. Le segment 1 monte verticalement, le segment 2 repart horizontalement ; l'outil est orienté à \(0°\).
    </details>

7. Avec \(\theta_2 = 0\), où se trouve M ? Et avec \(\theta_2 = 180°\) ?

    <details markdown><summary>Réponse</summary>
    \(\theta_2 = 0\) : bras tendu, M à la distance \(l_1 + l_2\) de \(O_0\) dans la direction \(\theta_1\). \(\theta_2 = 180°\) : bras replié, M à la distance \(|l_1 - l_2|\). Ce sont les deux frontières de l'espace de travail.
    </details>

8. Rotation de α puis translation de d sur le nouvel axe x, ou translation de d sur \(x_0\) puis rotation de α : quelle différence ?

    <details markdown><summary>Réponse</summary>
    Même orientation finale, positions différentes : \((d\cos\alpha;\ d\sin\alpha;\ 0)\) dans le premier cas, \((d;\ 0;\ 0)\) dans le second. L'ordre des transformations compte.
    </details>

9. Donnez l'inverse de \(T = \begin{pmatrix} R & P \\ 0 & 1 \end{pmatrix}\) et expliquez pourquoi il est peu coûteux à calculer.

    <details markdown><summary>Réponse</summary>
    \(T^{-1} = \begin{pmatrix} R^T & -R^T P \\ 0 & 1 \end{pmatrix}\). Il suffit de transposer \(R\) (propriété de SO(3) : \(R^{-1} = R^T\)) et de faire un produit matrice × vecteur ; aucune inversion de matrice 4 × 4 n'est nécessaire.
    </details>
