import { mergeTests, test as base } from '@playwright/test';

import { test as authApiTest } from '../auth/auth-api.fixtures';
import { test as coverageTest } from '../fixtures/coverage.fixtures';
import { test as topicsApiTest } from '../topics/topics-api.fixtures';
import { test as profileApiTest } from './profile-api.fixtures';
import { ProfilePage } from './profile.page';

interface ProfilePomFixtures {
  profilePage: ProfilePage;
}

const pomTest = base.extend<ProfilePomFixtures>({
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});

export const test = mergeTests(coverageTest, authApiTest, topicsApiTest, profileApiTest, pomTest);

export { expect } from '@playwright/test';
