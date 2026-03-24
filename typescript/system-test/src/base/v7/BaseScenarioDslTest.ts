/**
 * Fixture shape for v7 scenario DSL test.
 * Same as v6: useCase (UseCaseDsl), scenario (ScenarioDsl). Adds BrowserLifecycleExtension.
 * Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), useCase = new UseCaseDsl(config), scenario = new ScenarioDsl(useCase); tearDown close(useCase).
 */
export interface BaseScenarioDslTestFixture {
    /** UseCaseDsl instance */
    useCase?: unknown;
    /** ScenarioDsl instance */
    scenario?: unknown;
}
