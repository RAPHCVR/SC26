# Analyseur de Trajectoires de Vie

Une application web pour la modélisation et la visualisation de parcours de vie complexes, inspirée par la "Méthode d'analyse par les trajectoires" de Claire Littaye.

Ce projet a été réalisé dans le cadre de l'unité d'enseignement SC26 à l'Université de Technologie de Compiègne (UTC).

<img width="1919" height="879" alt="903ca4a7-8dfd-4c62-b095-5844014481b2" src="https://github.com/user-attachments/assets/2c2dd473-f442-4010-99ef-7f81f7274458" />

## 📖 Le Concept

Les parcours de vie, notamment dans le contexte de la recherche en sciences sociales, sont rarement linéaires. Une simple frise chronologique (timeline) ne suffit pas à capturer la complexité des interactions entre les événements, les ressentis, les contextes et les actions d'un individu.

Ce projet met en œuvre les concepts théoriques de la recherche de Claire Littaye pour offrir un outil de "trajectorisation". Il permet de dépasser la représentation 2D pour construire une cartographie **réticulaire** et **systémique** d'un parcours de vie, où les liens entre les éléments sont aussi importants que les éléments eux-mêmes.

Le modèle de données s'articule autour de la hiérarchie suivante :
- **Périodes** : Grandes phases de la vie (ex: "Adolescence", "Radicalisation").
- **Événements** : Moments clés au sein d'une période (ex: "Rencontre avec Anissa M.", "Tentative d'attentat").
- **Éléments** : Composants atomiques d'un événement, chacun avec une nature spécifique :
    - **Fait** : Un événement objectif et extérieur.
    - **Contexte** : L'environnement diffus qui influence l'individu.
    - **Vécu** : Le ressenti intérieur, la perception subjective.
    - **Action** : Ce que l'individu fait concrètement.
    - **Encapacitation** : Une action qui augmente la capacité d'agir de l'individu.
- **Liens Sémantiques** : Les connexions entre les éléments ne sont pas neutres. Elles sont qualifiées (ex: *engendre*, *produit*, *influe sur*, *mène à*) pour construire le sens de la trajectoire.

## ✨ Fonctionnalités

- **Gestion de Trajectoires** : Créez, chargez, et sauvegardez plusieurs trajectoires d'individus.
- **Construction Hiérarchique** : Organisez visuellement les Événements à l'intérieur des Périodes, et les Éléments à l'intérieur des Événements.
- **Visualisation Graphique Interactive** : Basée sur ReactFlow, la vue principale permet de manipuler les nœuds et les liens de manière intuitive.
- **Création de Liens Sémantiques** : Connectez les éléments en spécifiant la nature de leur relation pour enrichir l'analyse.
- **Auto-Layout** : Réorganisez automatiquement les éléments au sein d'un événement pour une meilleure lisibilité.
- **Filtres Avancés** : Isolez des nœuds spécifiques en fonction de tags, de lieux, de personnes impliquées ou d'une période temporelle.
- **Vues Adaptatives** :
    - **Vue Détaillée** : Zoomez pour voir tous les détails des nœuds.
    - **Vue Minimaliste** : Dézoomez pour obtenir une vue d'ensemble schématique avec des formes géométriques distinctes pour chaque type d'élément.
- **Modes d'Affichage Thématiques** : Basculez entre une vue "Temporelle" classique et une vue "Plans de Vie" qui met en évidence les `Actions` et `Encapacitations`.
- **Cas d'Étude Prédéfini** : Chargez la trajectoire d'Inès Madani, basée sur le papier de recherche, pour explorer un exemple concret.

## 🛠️ Stack Technique

| Domaine | Technologies |
| :--- | :--- |
| **Frontend** | React, ReactFlow, Axios, Dagre |
| **Backend** | Node.js, Express.js |
| **Base de Données** | En mémoire (in-memory) pour la simplicité du PoC |
| **Déploiement** | Docker, Nginx, Kubernetes (avec Ingress & Cert-Manager) |

## 🏗️ Architecture

L'application suit une architecture client-serveur classique, déployée sur Kubernetes en utilisant un pattern **multi-conteneurs dans un même pod**.

1.  **Frontend** : Une Single Page Application (SPA) en React, servie par un conteneur **Nginx**. Il est responsable de toute l'interface utilisateur et de la logique de visualisation.
2.  **Backend** : Une API REST simple en Node.js/Express. Elle gère la persistance des trajectoires (ici, en mémoire) via des endpoints CRUD.
3.  **Communication** :
    - **Externe** : Un Ingress Kubernetes expose l'application au monde extérieur. Il route le trafic `/api/*` vers le service du backend et tout le reste (`/`) vers le service du frontend.
    - **Interne** : Le frontend et le backend étant dans le même pod, ils peuvent communiquer via `localhost`, ce qui simplifie la configuration réseau.
4.  **Persistance** : Le backend utilise un simple tableau en mémoire pour stocker les données. Pour une utilisation en production, il faudrait le remplacer par une base de données persistante (ex: PostgreSQL ou une base de données orientée graphe comme Neo4j).

## 🚀 Démarrage en Local

Assurez-vous d'avoir [Node.js](https://nodejs.org/) (v16+) et `npm` ou `yarn` installés.

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/RAPHCVR/SC26.git
    cd SC26
    ```

2.  **Lancez le Backend :**
    ```bash
    cd backend
    npm install
    npm start
    # Le serveur backend écoute sur http://localhost:5001
    ```

3.  **Lancez le Frontend (dans un autre terminal) :**
    ```bash
    cd ../frontend
    npm install
    npm start
    # L'application sera accessible sur http://localhost:3000
    ```

Le frontend est configuré pour communiquer avec le backend sur le port 5001.

## 🐳 Déploiement

Le projet est conçu pour être déployé sur un cluster Kubernetes. Le fichier `k8s-trajectory-app.yaml` contient les manifestes nécessaires :
- **Deployment** : Gère le pod contenant les deux conteneurs (frontend-nginx, backend-node).
- **Services** : Deux services de type `ClusterIP` pour exposer en interne le frontend et le backend.
- **Ingress** : Gère l'accès externe, le routage basé sur les chemins (`/` et `/api`) et la terminaison TLS (certificats gérés par Cert-Manager).

Pour déployer, vous aurez besoin d'un cluster Kubernetes, d'un Ingress Controller (comme Nginx Ingress) et de Cert-Manager configurés.

## 💡 Améliorations Possibles

- **Persistance des Données** : Remplacer le stockage en mémoire par une base de données robuste (PostgreSQL pour le relationnel, ou **Neo4j** qui serait idéal pour la nature graphique des données).
- **Authentification Utilisateur** : Mettre en place un système de comptes pour que chaque utilisateur puisse gérer ses propres trajectoires.
- **Collaboration en Temps Réel** : Permettre à plusieurs analystes de travailler sur la même trajectoire simultanément (via WebSockets).
- **Export/Import** : Ajouter des fonctionnalités pour exporter une trajectoire en JSON, PDF ou en image (PNG/SVG).
- **Algorithmes de Layout Avancés** : Intégrer des algorithmes plus sophistiqués pour l'organisation automatique des graphes complexes.
