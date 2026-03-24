import { test as base } from '@playwright/test';
import type { UseCaseDsl } from '@optivem/dsl-core/usecase/UseCaseDsl.js';
import { getDefaultExternalSystemMode } from '../driver/configurationLoaderRegistry.js';
import { SystemDslFactory } from '../system/SystemDslFactory.js';

/**
 * Creates a Playwright test object with a `useCase` (UseCaseDsl) fixture.
 *
 * Usage:
 * ```typescript
 * const test = withApp();
 * test('my test', async ({ useCase }) => { ... });
 * ```
 */
export function withApp() {
    return base.extend<{ useCase: UseCaseDsl }>({
        useCase: async ({}, use) => {
            const useCase = SystemDslFactory.create(getDefaultExternalSystemMode());
            await use(useCase);
            await useCase.close();
        },
    });
}
