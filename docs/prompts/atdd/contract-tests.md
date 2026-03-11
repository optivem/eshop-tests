# Contract Tests Process

_This process is only triggered when the DSL Agent (RED 2) reports **external system interfaces changed = yes** — i.e. new methods were added to interfaces under `external/` (e.g. `driver-port/.../external/erp`). It is initiated by the orchestrator after RED 3 - Driver (COMMIT)._

_If the External System does not even exist yet, make Smoke Tests pass first._

## RED 1 - Contract Tests (WRITE + STOP)

1. Write External System Contract Tests.
   - If new DSL methods are needed, call them directly as if they exist — compile errors are expected.
2. Verify that they pass when executed against the Real External System:
   ```
   .\Run-SystemTests.ps1 -Suite <suite-contract-real> -Test <TestMethodName>
   ```
   If they don't pass, ask the user for support. STOP. Do NOT continue.
3. Verify that they fail when executed against the Stub External System:
   ```
   .\Run-SystemTests.ps1 -Suite <suite-contract-stub> -Test <TestMethodName>
   ```
4. Mark the tests as disabled with reason `"RED 1 - Contract Tests"` (see `language-equivalents.md` for syntax).
5. STOP. Present the contract tests to the user and ask for approval. Do NOT continue.

## RED 1 - Contract Tests (COMMIT)

1. If there were compile-time errors in RED 1 (WRITE + STOP):
   a. Extend the DSL interfaces with the new methods.
   b. Implement the new methods by throwing a "TODO: DSL" not-implemented exception (see `language-equivalents.md`).
   c. Run the tests and verify they fail with a runtime error.
2. COMMIT with message `<Scenario> | RED 1 - Contract Tests`.
3. STOP. Do not proceed further. Phase progression is controlled by the orchestrator, not by this agent.

## RED 2 - DSL (WRITE + STOP)

1. Enable the tests marked disabled with reason `"RED 1 - Contract Tests"`.
2. Implement the DSL for real — replace the "TODO: DSL" stub with actual logic.
3. Update the Driver interfaces as needed.
4. **Do NOT check for external system interface changes** — this cycle is already the contract test sub-process; recursive triggering does not apply.
5. STOP. Present the DSL implementation and Driver interface changes to the user and ask for approval. Do NOT continue.

## RED 2 - DSL (COMMIT)

1. Implement the Drivers by throwing a "TODO: Driver" not-implemented exception (see `language-equivalents.md`).
2. Run the tests and verify they fail with a runtime error:
   ```
   .\Run-SystemTests.ps1 -Suite <suite-contract-stub> -Test <TestMethodName>
   ```
3. Mark the tests as disabled with reason `"RED 2 - DSL"` (see `language-equivalents.md` for syntax).
4. COMMIT with message `<Scenario> | RED 2 - DSL [Contract]`.
5. Automatically proceed to RED 3 (WRITE + STOP).

## RED 3 - Driver (WRITE + STOP)

1. Enable the tests marked disabled with reason `"RED 2 - DSL"`.
2. Implement the Drivers — replace the "TODO: Driver" stub with actual logic.
3. Run the tests and verify they fail with a runtime error.
4. STOP. Present the Driver implementation to the user and ask for approval. Do NOT continue.

## RED 3 - Driver (COMMIT)

1. Mark the tests as disabled with reason `"RED 3 - Driver"` (see `language-equivalents.md` for syntax).
2. COMMIT with message `<Scenario> | RED 3 - Driver [Contract]`.
3. STOP. Do not proceed further. Phase progression is controlled by the orchestrator, not by this agent.

## GREEN - External System Stubs (WRITE + STOP)

1. Enable the tests marked disabled with reason `"RED 3 - Driver"`.
2. Implement the External System Stubs.
3. Run the External System Contract Tests:
   ```
   .\Run-SystemTests.ps1 -Suite <suite-contract-stub> -Test <TestMethodName> -Rebuild
   ```
4. Verify that the tests pass. If they fail, ask the user. STOP. Do NOT continue.
5. STOP. Present the stub implementation to the user and ask for approval. Do NOT continue.

## GREEN - External System Stubs (COMMIT)

1. Remove the disabled annotation (reason `"RED 3 - Driver"`) from the tests.
2. Run the tests and verify they pass.
3. COMMIT with message `<Scenario> | GREEN - External System Stubs`.
4. STOP. Do not proceed further. Phase progression is controlled by the orchestrator, not by this agent.
