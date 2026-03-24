import type { TestType } from '@playwright/test';

/**
 * Extends a Playwright test object with a `scenario` fixture derived from the `useCase` fixture.
 *
 * Usage:
 * ```typescript
 * const appTest = withApp();
 * const test = withScenario(appTest, (useCase) => new ScenarioDsl(useCase));
 * test('my test', async ({ scenario }) => { ... });
 * ```
 */
export function withScenario<TApp, TScenario>(
    appTest: TestType<{ useCase: TApp }, any>,
    createScenario: (useCase: TApp) => TScenario,
) {
    return appTest.extend<{ scenario: TScenario }>({
        scenario: async ({ useCase }: { useCase: TApp }, use: (scenario: TScenario) => Promise<void>) => {
            const scenario = createScenario(useCase);
            await use(scenario);
        },
    });
}
