# MDD — Frontend

MDD (Monde de Dév) est un réseau social destiné aux développeurs. Il permet à ses utilisateurs de créer un compte, se connecter, s'abonner à des thèmes de programmation pour suivre les articles associés dans leur fil d'actualité, ainsi que de rédiger des articles et des commentaires visibles par les autres membres.

Ce dépôt contient le front-end de l'application, développé pour ORION dans le cadre de la validation d'un MVP interne.

## Stack technique

- **Framework** : Angular 22 (standalone components, généré via Angular CLI)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS 4
- **Tests unitaires** : Vitest (via `@angular/build`) + jsdom
- **Tests end-to-end** : Cypress 16

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

### Tests end-to-end (Cypress)

Le front (`npm start`) et le back doivent être démarrés au préalable.

```bash
npm run cypress:open   # mode interactif
npm run cypress:run    # mode headless
```

Les scénarios se trouvent dans `cypress/e2e/`.
