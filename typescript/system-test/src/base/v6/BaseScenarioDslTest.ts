/**
 * Fixture shape for v6 scenario DSL test.
 * Holds useCase (UseCaseDsl) and scenario (ScenarioDsl). Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), useCase = new UseCaseDsl(config), scenario = new ScenarioDsl(useCase); tearDown close(useCase).
 */
export interface BaseScenarioDslTestFixture {
    /** UseCaseDsl instance */
    useCase?: unknown;
    /** ScenarioDsl instance */
    scenario?: unknown;
}
