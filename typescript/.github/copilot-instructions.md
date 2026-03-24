# Copilot instructions

## Reference projects - dependency comparison

Checked against:
- **Java:** `C:\GitHub\optivem\eshop-tests-java`
- **.NET:** `C:\GitHub\optivem\eshop-tests-dotnet`

---

## Java (Gradle)

| Project | Depends on |
|--------|------------|
| **commons** | (external only: Lombok, Jackson, Spring, Playwright, JUnit, AssertJ, WireMock) |
| **test-infrastructure** | `:commons`, `:core` (+ optivem-testing, Spring, etc.) |
| **dsl** | `:dsl:system`, `:dsl:gherkin` |
| **dsl/system** | `:core:clock`, `:core:erp`, `:core:shop`, `:core:tax`, `:commons` |
| **dsl/gherkin** | `:dsl:system` |
| **core** | (parent/aggregator) |
| **system-test/smoke-test** | `testImplementation project(':test-infrastructure')` |
| **system-test/acceptance-test** | `testImplementation project(':test-infrastructure')` |
| **system-test/e2e-test** | `testImplementation project(':test-infrastructure')` |
| **system-test/external-system-contract-test** | `testImplementation project(':test-infrastructure')` |

**Note:** `BaseScenarioDslTest` (in test-infrastructure) uses `SystemDsl` and `ScenarioDsl` (from dsl). test-infrastructure's `build.gradle` only declares `:commons` and `:core`; it does **not** declare `:dsl`. So either `:core` (or another path) brings in dsl transitively, or the Java reference is missing an explicit `project(':dsl')` in test-infrastructure.

---

## .NET (csproj)

| Project | ProjectReference(s) |
|--------|----------------------|
| **Commons** | (none) |
| **Core.Shop** (and other Core.*) | Commons |
| **Dsl.System** | Core.Clock, Core.Erp, Core.Shop, Core.Tax, Commons |
| **Dsl.Gherkin** | Dsl.System, Core.Shop |
| **TestInfrastructure** | **Dsl.System**, **Dsl.Gherkin** |
| **SmokeTests** | TestInfrastructure, Commons |
| **AcceptanceTests** | TestInfrastructure, Commons |
| **E2eTests** | TestInfrastructure, Commons |
| **ExternalSystemContractTests** | (not read; likely TestInfrastructure) |

Test projects get DSL **only** via TestInfrastructure (no direct reference to Dsl).

---

## TypeScript (npm workspaces)

| Package | dependencies |
|---------|----------------|
| **commons** | (none internal) |
| **driver-port** | (none internal) |
| **driver-adapter** | @optivem/common, @optivem/driver-port |
| **dsl-port** | @optivem/driver-port |
| **dsl-core** | @optivem/common, @optivem/driver-port, @optivem/driver-adapter, @optivem/dsl-port, @optivem/optivem-testing |
| **test-infrastructure** | @optivem/common, @optivem/driver-port, @optivem/driver-adapter, @optivem/dsl-core, @optivem/optivem-testing |
| **system-test** | @optivem/common, @optivem/driver-port, @optivem/driver-adapter, @optivem/dsl-port, @optivem/dsl-core, @optivem/optivem-testing, @optivem/test-infrastructure |

---

## Alignment summary

| Aspect | Java | .NET | TypeScript |
|--------|------|------|------------|
| **Test project depends on** | test-infrastructure only | TestInfrastructure (+ Commons) | test-infrastructure **and** dsl |
| **Who depends on dsl** | Unclear (test-infrastructure uses it but doesn't declare `:dsl`) | TestInfrastructure | test-infrastructure and system-test (via dsl-core / dsl-port) |
| **test-infrastructure depends on dsl?** | No (only commons, core) | **Yes** (Dsl.System, Dsl.Gherkin) | **Yes** (depends on dsl-core) |

Current TypeScript setup uses split packages (`dsl-port`, `dsl-core`) and no longer has a standalone `core` workspace. It is broadly aligned with .NET in that `test-infrastructure` consumes DSL; `system-test` still keeps direct DSL dependencies for convenience.
