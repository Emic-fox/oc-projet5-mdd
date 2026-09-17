# MDD — Monde de Dév

MDD (Monde de Dév) est un réseau social destiné aux développeurs. Il permet à ses utilisateurs de créer un compte, se connecter, s'abonner à des thèmes de programmation pour suivre les articles associés dans leur fil d'actualité, ainsi que de rédiger des articles et des commentaires visibles par les autres membres.

Ce dépôt a été développé pour ORION dans le cadre de la validation d'un MVP interne. Il regroupe deux projets indépendants :

- [`mdd-back`](mdd-back/README.md) — API back-end (Java / Spring Boot)
- [`mdd-front`](mdd-front/README.md) — application front-end (Angular)

Chaque projet a son propre README avec ses instructions d'installation, de démarrage et de tests. Ce README ne couvre que ce qui est commun aux deux : l'analyse de qualité de code avec SonarQube.

## Analyse de qualité de code (SonarQube)

L'analyse tourne en local via Docker, sans intégration CI. Elle est à lancer manuellement quand on le souhaite (avant une PR, après une feature conséquente, etc.).

### Prérequis

- Docker Desktop (ou le démon Docker) démarré
- `mdd-back` : JDK 25 + Maven (ou `mvnw`)
- `mdd-front` : Node.js 22.12+ (le scanner `sonarqube-scanner` l'exige) et `npm`

### 1. Démarrer le serveur SonarQube

Depuis la racine du dépôt (là où se trouve ce README) :

```powershell
docker compose up -d
```

Cela démarre un conteneur `mdd-sonarqube` exposé sur `http://localhost:9000`. Les données sont persistées dans des volumes Docker nommés, donc rien n'est perdu entre deux redémarrages.

Pour l'arrêter :

```powershell
docker compose stop
```

(`docker compose down` arrête et supprime le conteneur, mais conserve les volumes ; `docker compose down -v` repart d'une instance totalement vierge.)

### 2. Configuration initiale (une seule fois)

1. Ouvrir `http://localhost:9000`, se connecter avec `admin` / `admin` et changer le mot de passe demandé.
2. Créer les deux projets manuellement (**Projects > Create Project > Manually**) avec les clés :
   - `mdd-back`
   - `mdd-front`
3. Générer un token d'analyse : **My Account > Security > Generate Token** (un token par projet, ou un seul token utilisateur réutilisé pour les deux).
4. Renseigner ce(s) token(s) dans le `.env` de chaque projet (déjà non commité et documenté par un `.env.example`, comme le reste de la config locale) :
   - `mdd-back/.env` : `sonar.token=<votre_token>`
   - `mdd-front/.env` : `SONAR_TOKEN=<votre_token>`

   Chaque commande lit ensuite directement son `.env` — plus besoin de saisir le token à chaque analyse ni de le faire transiter par une variable d'environnement de session.

### 3. Lancer l'analyse du back (`mdd-back`)

Depuis `mdd-back/` :

```powershell
./mvnw clean verify sonar:sonar
```

- `clean verify` exécute les tests et génère le rapport de couverture JaCoCo (`target/site/jacoco/jacoco.xml`), consommé automatiquement par l'analyse Sonar.
- Le plugin `properties-maven-plugin` charge le `.env` en propriétés Maven dès la phase `initialize` ; `sonar.token` (ainsi que la clé de projet et l'URL du serveur, déjà définies dans le `pom.xml`) sont donc disponibles pour `sonar:sonar` sans rien ajouter à la commande.

### 4. Lancer l'analyse du front (`mdd-front`)

Depuis `mdd-front/` :

```powershell
npm run qa
```

Équivalent de :

```powershell
npm run test:coverage
npm run e2e:coverage
npm run sonar
```

- `test:coverage` (Vitest) et `e2e:coverage` (Playwright) génèrent chacun un rapport de couverture au format `lcov` (`coverage/mdd-front/lcov.info` et `coverage/e2e/lcov.info`) ; l'analyse Sonar les fusionne.
- `npm run e2e:coverage` est optionnel : s'il n'a pas été lancé, Sonar affiche un simple avertissement pour le rapport E2E manquant et n'utilise que la couverture unitaire.
- `npm run sonar` charge le `.env` via `dotenv-cli` puis lance `sonar-scanner-npm`, qui lit la configuration du projet dans `sonar-project.properties` (clé de projet, URL du serveur, sources et tests analysés — `src` et `e2e`) et le token dans la variable d'environnement `SONAR_TOKEN` ainsi injectée.

### 5. Consulter les résultats

Sur `http://localhost:9000`, ouvrir le dashboard de `mdd-back` ou `mdd-front` pour voir bugs, vulnérabilités, code smells, duplication et couverture de code, ainsi que le statut du Quality Gate.
