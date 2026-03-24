/**
 * Fixture shape for v5 system DSL test.
 * Holds useCase (UseCaseDsl). Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), useCase = new UseCaseDsl(configuration); tearDown Closer.close(useCase).
 */
export interface BaseSystemDslTestFixture {
    /** UseCaseDsl instance */
    useCase?: unknown;
}
