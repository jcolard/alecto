# Règles et Instructions Projet : Alekto

## REGLE ABSOLUE : Verrouillage de la logique métier
Ne JAMAIS modifier, altérer ou réécrire la logique fonctionnelle de l'application, sauf demande explicite et directe de l'utilisateur. Toute modification d'UX (style, CSS, animations, habillage figma, modification du HTML structurel) ne doit en aucun cas interférer avec la logique existante.

---

## Rappel de la Logique Métier figée

L'application comporte uniquement **2 vues distinctes** : la **Vue Générale** et la **Vue Détail**.

### 1. Vue Générale
* **Tri par Type** : Les publications sont regroupées par type (`type`). Chaque groupe possède son propre carrousel.
* **Ordre Chronologique** : Les éléments dans les carrousels sont classés par ordre décroissant de date/heure (`datetime`).
* **Format des Cartes** : Chaque carte affiche l'image de la publication avec son titre en dessous.
* **Navigation Carrousel** : Le défilement se fait par glissement tactile/souris ET via des flèches directionnelles (Gauche / Droite).
* **Filtres & Recherche** :
  * Recherche textuelle en temps réel via un champ de saisie (titres et descriptions).
  * Filtre par tags via des boutons cliquables.
  * La liste des tags est calculée dynamiquement à partir de l'ensemble des tags uniques présents dans le fichier `publication.json`.

### 2. Comportement au Clic (Routage)
* **Cas PDF** : Si la publication cliquée possède un fichier se terminant par `.pdf`, l'application l'ouvre directement (redirection/nouvel onglet via `window.open`). Elle ne doit PAS afficher la vue détail.
* **Autres cas** : Ouvre la vue détail correspondante.

### 3. Vue Détail
* **Cas Audio (.mp3)** :
  * Affiche l'image de couverture dans un cadre.
  * Affiche un lecteur audio fonctionnel.
  * Affiche le titre, la description de l'auteur et les tags associés.
* **Cas Texte (Contenu non vide)** :
  * Affiche le titre, la date, la description de l'auteur et les tags.
  * Le contenu textuel est affiché avec une **pagination horizontale**. L'utilisateur lit de gauche à droite (pas de scroll vertical).
  * Le nombre de pages est dynamique et géré par navigation via boutons "Page Précédente" / "Page Suivante".

---

## Objectif Actuel : UX & Habillage
À partir de maintenant, le travail se concentre exclusivement sur :
1. **L'habillage graphique (UI)** : Couleurs, gradients, ombres, styles premium, intégrations visuelles, polices de caractères, thèmes de couleurs.
2. **La structure visuelle** : Alignements, gestion responsive, mise en page sans toucher au comportement JavaScript logique.
3. **Les micro-animations** : Transitions lors du changement de vue, effets au survol des cartes de publication, feedback interactif sur les boutons.
