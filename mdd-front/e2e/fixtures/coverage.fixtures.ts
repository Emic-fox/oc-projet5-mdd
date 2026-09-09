import { test as base } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';

/**
 * Fixture automatique de collecte de la couverture de code.
 *
 * Uniquement sur le projet `chromium` : c'est le seul navigateur qui expose
 * l'API V8 `page.coverage` de Playwright. Sur les autres projets la fixture
 * est neutre (aucune collecte).
 *
 * Le flux : on démarre l'enregistrement JS/CSS avant le test, on l'arrête
 * après, puis on transmet le résultat brut V8 à monocart-reporter via
 * `addCoverageReport`. Le reporter agrège toutes les entrées et les remappe
 * vers les sources TypeScript grâce aux source maps servies par `ng serve`
 * (configuration `development`, `sourceMap: true`).
 */
export const test = base.extend<{ autoCoverage: void }>({
  autoCoverage: [
    async ({ page }, use) => {
      const collect: boolean = test.info().project.name === 'chromium';

      if (collect) {
        await Promise.all([
          page.coverage.startJSCoverage({ resetOnNavigation: false }),
          page.coverage.startCSSCoverage({ resetOnNavigation: false }),
        ]);
      }

      await use();

      if (collect) {
        const [jsCoverage, cssCoverage] = await Promise.all([
          page.coverage.stopJSCoverage(),
          page.coverage.stopCSSCoverage(),
        ]);
        await addCoverageReport([...jsCoverage, ...cssCoverage], test.info());
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
