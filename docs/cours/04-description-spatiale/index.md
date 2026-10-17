# 4. Chapitre 2 : Description spatiale et transformation

C'est le cœur mathématique du cours. La question posée est simple : **comment décrire avec des nombres où se trouve un objet et comment il est tourné**, puis comment passer d'un repère à un autre (robot, outil, patient, imagerie).

## Pourquoi ce chapitre ?

Levez votre bras et touchez votre épaule opposée avec votre index : votre cerveau résout un problème cinématique sans effort conscient. Le cours en tire un modèle simplifié :

| Corps humain | Robot |
|---|---|
| os (humérus, radius, ulna), supposés rigides, longueurs constantes | segments rigides |
| articulations : épaule (rotule, 3 DDL), coude (pivot, 1 DDL, flexion et extension), poignet | liaisons |
| muscles | moteurs |

Deux points de vue :

- **Mécanique** : comprendre la structure. Quels os sont reliés, et par quel type de liaison ? Les os rigides et les articulations définissent la chaîne mécanique.
- **Cinématique** : comprendre le mouvement. Comment les angles articulaires déterminent-ils la position de l'index dans l'espace ?

Exemple médical du cours : un exosquelette de marche. (1) **Perception** : un capteur d'inclinaison fixé au buste mesure le mouvement dans le repère lié au corps. (2) **Changement de repère** : une matrice de transformation relie le repère du corps et le repère du robot, selon la posture. (3) **Commande** : le contrôleur interprète la mesure et commande le moteur du genou. Une mauvaise conversion peut produire une commande inadaptée et perturber l'équilibre. La **rotation** relie l'orientation des axes ; la **translation** relie la position des origines.

## Organisation

| Partie | Contenu |
|---|---|
| [4.1 Bases mécaniques et théorie des mécanismes](1-bases-mecaniques.md) | solide indéformable, DDL, liaisons normalisées, schémas cinématiques plan et spatial, topologie des architectures |
| [4.2 Description spatiale et systèmes de coordonnées](2-reperes-orientation.md) | repères, coordonnées cartésiennes, polaires et cylindriques, position, relation de Chasles, matrice de rotation, SO(3), angles d'Euler, changement de repère |
| [4.3 Transformations homogènes et mouvement rigide](3-transformations-homogenes.md) | matrice homogène 4 × 4, composition le long d'une chaîne, bras plan à deux segments |

## Notations du cours

| Objet | Notation | Lecture |
|---|---|---|
| Repère | \(R_0 = (O_0, \vec{x}_0, \vec{y}_0, \vec{z}_0)\) | origine et trois vecteurs unitaires orthogonaux |
| Position de \(O_1\) dans \(R_0\) | \(\vec{p} = \overrightarrow{O_0 O_1}\), \([\vec{p}]_{R_0} = (p_x, p_y, p_z)^T\) | vecteur colonne des coordonnées dans la base de \(R_0\) |
| Vecteur exprimé dans le repère \(i\) | \(V^i\), \(O_0M^0\) | l'exposant indique le repère de projection |
| Rotation du repère \(j\) par rapport au repère \(i\) | \(R^{i,j} = {}^iR_j = R_{ij} = R^i_j\) | colonnes = axes de \(j\) exprimés dans \(i\) |
| Rotations élémentaires | \(R_z(\alpha)\), \(R_y(\beta)\), \(R_x(\gamma)\) | lacet, tangage, roulis |
| Matrice homogène | \(T^{0,s}\) (ou \(T_0^s\)) | position et orientation du solide S par rapport à \(R_0\) |
| Composition | \(T^{0,n} = T^{0,1} T^{1,2} \cdots T^{n-1,n}\) | de la base à l'organe terminal |
| Produit vectoriel | \(\wedge\) (module de rappel), \(\times\) (chapitre 2) | même opération |

Quelques petites incohérences des diapositives, à connaître pour ne pas être surpris en relisant le support :

- En 3-5, le texte parle de « la matrice de rotation \(A^{i,j}\) » : il s'agit de \(R^{i,j}\).
- En partie 3, « l'orientation est définie par \(T^{0,S}\) » : l'orientation est définie par \(R^{0,S}\), le bloc 3 × 3 de \(T^{0,S}\).
- Sur la dernière diapositive, \(P_0^1\) est un vecteur 3 × 1 (et non 3 × 3).
- L'exemple du téléphone nomme les angles \(\psi, \theta, \varphi\) ; les matrices élémentaires utilisent \(\alpha, \beta, \gamma\). Ici : \(\alpha\) autour de z (lacet), \(\beta\) autour de y (tangage), \(\gamma\) autour de x (roulis).
