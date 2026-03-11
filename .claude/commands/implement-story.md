Implement the following user story using the multi-agent ATDD workflow defined in `docs/prompts/atdd/workflow.md`.

Input: $ARGUMENTS

The input is either a GitHub issue number (e.g. `#42`) or free-text user story. Pass it as-is to the story-agent — it will handle both formats.

## Orchestration Steps

1. Launch **story-agent** with the input. It will read the GitHub issue if given a number, or use the text directly. Present the Gherkin scenarios it produces and wait for human approval before continuing.

Steps 2–14 below form a **per-scenario loop**. Repeat them for each scenario until all are GREEN.

2. Launch **test-agent (WRITE + STOP)** with the approved Gherkin (or the remaining scenarios if looping). It will write the tests and report back without committing.
   - If multiple scenarios remain and new DSL is needed, it will implement only the first and leave the rest as `// TODO:` comments. Note which scenarios remain for subsequent loops.

3. STOP. Present the tests to the user and wait for approval. Do NOT continue until approved.

4. Launch **test-agent (COMMIT)**. It will extend DSL interfaces with stubs, mark tests `@Disabled("RED 1 - Tests")`, and commit RED 1.
   - If it reports **no new DSL methods were added**: skip steps 5–10 and proceed directly to step 11. The tests remain `@Disabled("RED 1 - Tests")` — the release-agent will remove this at step 13.

5. Launch **dsl-agent (WRITE + STOP)**. It will implement the DSL and report back without committing.

6. STOP. Present the DSL implementation and driver interface changes to the user and wait for approval. Do NOT continue until approved.

7. Launch **dsl-agent (COMMIT)**. It will add driver stubs, mark tests `@Disabled("RED 2 - DSL")`, and commit RED 2. Note whether it reports **external system interfaces changed = yes**.
   - If it reports **no new driver methods were added**: skip steps 8–10 and proceed directly to step 11. The tests remain `@Disabled("RED 2 - DSL")` — the release-agent will remove this at step 13.

8. Launch **driver-agent (WRITE + STOP)**. It will implement the drivers and report back without committing.

9. STOP. Present the driver implementation to the user and wait for approval. Do NOT continue until approved.

10. Launch **driver-agent (COMMIT)**. It will mark tests `@Disabled("RED 3 - Driver")` and commit RED 3.
    - If the dsl-agent reported **external system interfaces changed = yes**: execute the **Contract Tests Sub-Process** below before continuing to step 11.
    - Otherwise: proceed directly to step 11.

### Contract Tests Sub-Process

_Only executed when external system interfaces changed = yes._

10a. Launch **test-agent (WRITE + STOP)** for contract tests. It will write the contract tests and report back without committing.

10b. STOP. Present the contract tests to the user and wait for approval. Do NOT continue until approved.

10c. Launch **test-agent (COMMIT)** for contract tests. It will extend DSL interfaces with stubs, mark tests `@Disabled("RED 1 - Contract Tests")`, and commit.

10d. Launch **dsl-agent (WRITE + STOP)** for contract DSL. It will implement the DSL and report back without committing.

10e. STOP. Present the DSL implementation and driver interface changes to the user and wait for approval. Do NOT continue until approved.

10f. Launch **dsl-agent (COMMIT)** for contract DSL. It will add driver stubs, mark tests `@Disabled("RED 2 - DSL")`, and commit.

10g. Launch **driver-agent (WRITE + STOP)** for contract drivers. It will implement the drivers and report back without committing.

10h. STOP. Present the driver implementation to the user and wait for approval. Do NOT continue until approved.

10i. Launch **driver-agent (COMMIT)** for contract drivers. It will mark tests `@Disabled("RED 3 - Driver")` and commit.

10j. Launch **backend-agent** for external system stubs. It will implement the stubs until contract tests pass, then report back without committing.

10k. STOP. Present the stub implementation to the user and wait for approval. Do NOT continue until approved.

10l. Launch **release-agent** for contract stubs. It will remove `@Disabled` and commit GREEN - External System Stubs.

_Resume main process at step 11._

11. Launch **backend-agent**. It will implement the backend until API tests pass.

12. Launch **frontend-agent**. It will implement the frontend until UI tests pass.

13. Launch **release-agent**. It will remove @Disabled and commit the final GREEN.

14. If there are remaining `// TODO:` scenarios in the test file, loop back to step 2 for the next scenario. Otherwise, present the final outcome to the user for review.

## Escalation

If any agent reports it cannot proceed (stuck, unexpected pattern, test failure it cannot explain), STOP and present the blocker to the user before continuing.
