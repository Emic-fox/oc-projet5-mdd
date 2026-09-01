# MDD — Backend

MDD (Monde de Dév) est un réseau social destiné aux développeurs. Il permet à ses utilisateurs de créer un compte, se connecter, s'abonner à des thèmes de programmation pour suivre les articles associés dans leur fil d'actualité, ainsi que de rédiger des articles et des commentaires visibles par les autres membres.

Ce dépôt contient le back-end de l'application, développé pour ORION dans le cadre de la validation d'un MVP interne.

## Stack technique

- **Langage** : Java 25 (LTS)
- **Framework** : Spring Boot 4.1.1
- **Build** : Maven
- **Base de données** : MariaDB (conteneurisée via Docker Compose)
- **ORM** : Spring Data JPA
- **Sécurité** : Spring Security (authentification JWT)
- **Validation** : Bean Validation (Hibernate Validator)
- **Mapping DTO/Entity** : MapStruct
- **Réduction de boilerplate** : Lombok
- **Tests** : JUnit 5 + Mockito

## Prérequis

- JDK 25
- Maven (ou le wrapper `mvnw` fourni avec le projet)
- Docker Desktop (ou le démon Docker) démarré et disponible en local

## Installation

1. Cloner le dépôt.
2. Copier `.env.example` en `.env` à la racine du projet, puis renseigner des valeurs pour :
   - `DB_NAME` — nom de la base de données
   - `DB_USER` / `DB_PASSWORD` — identifiants applicatifs
   - `DB_ROOT_PASSWORD` — mot de passe root MariaDB
   - `DB_HOST_PORT` — port exposé sur la machine hôte pour se connecter à la base (par défaut `3306` ; à modifier uniquement en cas de conflit avec une instance déjà installée en local)

   Ce fichier `.env` est local à chaque développeur et n'est pas versionné.

3. S'assurer que Docker est bien lancé.
4. Démarrer l'application :

   ```bash
   ./mvnw spring-boot:run
   ```

   Grâce au support Docker Compose de Spring Boot, le conteneur MariaDB défini dans `compose.yaml` est automatiquement démarré au lancement de l'application, et arrêté à sa fermeture. La configuration de connexion à la base (host, port, identifiants) est injectée automatiquement — aucune valeur à dupliquer dans `application.properties`.

## Connexion à la base de données depuis un client SQL (DBeaver, etc.)

Une fois l'application démarrée, connecte ton client SQL avec :

- **Host** : `localhost`
- **Port** : la valeur de `DB_HOST_PORT` dans ton `.env` (`3306` par défaut)
- **Database** : la valeur de `DB_NAME`
- **User / Password** : les valeurs de `DB_USER` / `DB_PASSWORD`

## Gestion des conteneurs

- Le conteneur MariaDB est nommé `mdd-mariadb` et persiste ses données dans un volume Docker nommé (`mdd-mariadb-data`).
- Les variables `MARIADB_*` définies dans `compose.yaml` (nom de la base, utilisateur, mots de passe) ne sont appliquées qu'à la toute première initialisation du volume. Pour repartir d'une base vierge avec de nouvelles valeurs, supprimer le volume :

  ```bash
  docker compose down -v
  ```
