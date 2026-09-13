import { mergeTests, test as base } from '@playwright/test';

import { test as authApiTest } from '../auth/auth-api.fixtures';
import { test as coverageTest } from '../fixtures/coverage.fixtures';
import { test as topicsApiTest } from './topics-api.fixtures';
import { TopicsPage } from './topics.page';

interface TopicsPomFixtures {
  topicsPage: TopicsPage;
}

const pomTest = base.extend<TopicsPomFixtures>({
  topicsPage: async ({ page }, use) => {
    await use(new TopicsPage(page));
  },
});

export const test = mergeTests(coverageTest, authApiTest, topicsApiTest, pomTest);

export { expect } from '@playwright/test';
