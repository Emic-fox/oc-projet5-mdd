# MDD — Frontend

MDD (Monde de Dév) est un réseau social destiné aux développeurs. Il permet à ses utilisateurs de créer un compte, se connecter, s'abonner à des thèmes de programmation pour suivre les articles associés dans leur fil d'actualité, ainsi que de rédiger des articles et des commentaires visibles par les autres membres.

Ce dépôt contient le front-end de l'application, développé pour ORION dans le cadre de la validation d'un MVP interne.

## Stack technique

- **Framework** : Angular 22 (standalone components, généré via Angular CLI)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS 4
- **Tests unitaires** : Vitest (via `@angular/build`) + jsdom
- **Tests end-to-end** : Playwright

## Prérequis

- Node.js (version compatible Angular 22, Node 20+)
- npm
- Le back-end (`mdd-back`) démarré et accessible sur `http://localhost:8080`

## Installation

```bash
npm install
```

## Configuration

L'URL de l'API est définie dans `src/environments/` :

- `environment.development.ts` — utilisé par `npm start` : `http://localhost:8080`
- `environment.ts` — utilisé par le build de production : URL relative (même origine)

## Démarrage

```bash
npm start
```

L'application est servie sur `http://localhost:4200/` et se recharge automatiquement à chaque modification des sources.

## Build

```bash
npm run build
```

Les artefacts sont générés dans `dist/`.

## Tests

### Tests unitaires (Vitest)

```bash
npm test
```

#### Couverture de code

```bash
npm run test:coverage
```

Le résumé s'affiche dans la console et un rapport détaillé est généré dans
`coverage/mdd-front/` (`index.html` navigable, `clover.xml`,
`coverage-final.json`). Le dossier `coverage/` est ignoré par Git.

### Tests end-to-end (Playwright)

```bash
npm run e2e
```

Playwright démarre automatiquement `ng serve` (config `development`, source maps
activées) puis exécute les specs de `e2e/` sur Chromium, Firefox et WebKit. Le
rapport est généré dans `playwright-report/` (`npx monocart show-report
playwright-report/index.html`).

#### Couverture de code

```bash
npm run e2e:coverage
```

La couverture est collectée via l'API V8 de Playwright (Chromium uniquement,
d'où le `--project=chromium`), puis remappée vers les sources TypeScript par
`monocart-reporter`. La collecte est branchée automatiquement sur tous les
tests via la fixture `e2e/fixtures/coverage.fixtures.ts` (neutre sur les autres
navigateurs). Le résumé s'affiche dans la console et les rapports sont générés
dans `coverage/e2e/` (`index.html` V8, `html-spa/` façon Istanbul, `lcov.info`).
Le dossier `coverage/` est ignoré par Git.