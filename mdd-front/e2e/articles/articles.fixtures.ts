import { mergeTests, test as base } from '@playwright/test';

import { test as authApiTest } from '../auth/auth-api.fixtures';
import { test as coverageTest } from '../fixtures/coverage.fixtures';
import { test as articlesApiTest } from './articles-api.fixtures';
import { ArticlesPage } from './articles.page';

interface ArticlesPomFixtures {
  articlesPage: ArticlesPage;
}

const pomTest = base.extend<ArticlesPomFixtures>({
  articlesPage: async ({ page }, use) => {
    await use(new ArticlesPage(page));
  },
});

export const test = mergeTests(coverageTest, authApiTest, articlesApiTest, pomTest);

export { expect } from '@playwright/test';
