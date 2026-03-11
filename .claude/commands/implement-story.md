Implement the following user story using the multi-agent ATDD workflow defined in `docs/prompts/atdd/workflow.md`.

Input: $ARGUMENTS

The input is either a GitHub issue number (e.g. `#42`) or free-text user story, optionally followed by flags. Pass the issue/story to the story-agent; keep flags for orchestration use.

**Autonomous mode:** if `--autonomous` is present in the input, skip all STOP/human-approval steps — agents self-approve and the pipeline runs end-to-end without waiting for the user.

**Repositories:** optionally specify which repositories the pipeline operates on:
- `--test-repos <repo1>,<repo2>,...` — the test repositories to implement in (e.g. `eshop-tests-java`, `eshop-tests-dotnet`, `eshop-tests-typescript`)
- `--system-repos <repo1>,<repo2>,...` — the system (backend/frontend) repositories (e.g. `eshop`)

If not specified, infer the appropriate repositories from the GitHub issue context (labels, title, existing tests, etc.) and confirm with the user before proceeding.

## Orchestration Steps

1. Launch **story-agent** with the input. It will read the GitHub issue if given a number, or use the text directly.
   - **Normal mode:** Present the Gherkin scenarios and wait for human approval before continuing.
   - **Autonomous mode:** Auto-approve and proceed immediately.

1a. After the Gherkin scenarios are approved, if a GitHub issue number was provided as input, update the issue body with the approved Gherkin scenarios for precision. Replace the original scenario text in the issue with the exact approved Gherkin (use `gh issue edit <number> --repo <owner/repo> --body "..."` preserving the user story preamble).

Steps 2–14 below form a **per-scenario loop**. Repeat them for each scenario until all are GREEN.

2. Launch **test-agent (AT - RED - TEST - WRITE)** with the approved Gherkin (or the remaining scenarios if looping). It will write the tests and report back without committing.
   - If multiple scenarios remain and new DSL is needed, it will implement only the first and leave the rest as `// TODO:` comments. Note which scenarios remain for subsequent loops.

3. **Normal mode:** STOP. Present the tests to the user and wait for approval. Do NOT continue until approved.
   **Autonomous mode:** Auto-approve and proceed immediately.

4. Launch **test-agent (AT - RED - TEST - COMMIT)**. It will extend DSL interfaces with stubs, mark tests `@Disabled("AT - RED - TEST")`, and commit.
   - If it reports **no new DSL methods were added**: skip steps 5–10 and proceed directly to step 11. The tests remain `@Disabled("AT - RED - TEST")` — the release-agent will remove this at step 13.

5. Launch **dsl-agent (AT - RED - DSL - WRITE)**. It will implement the DSL and report back without committing.

6. **Normal mode:** STOP. Present the DSL implementation and driver interface changes to the user and wait for approval. Do NOT continue until approved.
   **Autonomous mode:** Auto-approve and proceed immediately.

7. Launch **dsl-agent (AT - RED - DSL - COMMIT)**. It will add driver stubs, mark tests `@Disabled("AT - RED - DSL")`, and commit. Note whether it reports **external system interfaces changed = yes**.
   - If it reports **no new driver methods were added**: skip steps 8–10 and proceed directly to step 11. The tests remain `@Disabled("AT - RED - DSL")` — the release-agent will remove this at step 13.

8. Launch **driver-agent (AT - RED - DRIVER - WRITE)**. It will implement the drivers and report back without committing.

9. **Normal mode:** STOP. Present the driver implementation to the user and wait for approval. Do NOT continue until approved.
   **Autonomous mode:** Auto-approve and proceed immediately.

10. Launch **driver-agent (AT - RED - DRIVER - COMMIT)**. It will mark tests `@Disabled("AT - RED - DRIVER")` and commit.
    - If the dsl-agent reported **external system interfaces changed = yes**: execute the **Contract Tests Sub-Process** below before continuing to step 11.
    - Otherwise: proceed directly to step 11.

### Contract Tests Sub-Process

_Only executed when external system interfaces changed = yes._

10a. Launch **test-agent (CT - RED - TEST - WRITE)** for contract tests. It will write the contract tests and report back without committing.

10b. **Normal mode:** STOP. Present the contract tests to the user and wait for approval. Do NOT continue until approved.
     **Autonomous mode:** Auto-approve and proceed immediately.

10c. Launch **test-agent (CT - RED - TEST - COMMIT)** for contract tests. It will extend DSL interfaces with stubs, mark tests `@Disabled("CT - RED - TEST")`, and commit.

10d. Launch **dsl-agent (CT - RED - DSL - WRITE)** for contract DSL. It will implement the DSL and report back without committing.

10e. **Normal mode:** STOP. Present the DSL implementation and driver interface changes to the user and wait for approval. Do NOT continue until approved.
     **Autonomous mode:** Auto-approve and proceed immediately.

10f. Launch **dsl-agent (CT - RED - DSL - COMMIT)** for contract DSL. It will add driver stubs, mark tests `@Disabled("CT - RED - DSL")`, and commit.

10g. Launch **driver-agent (CT - RED - DRIVER - WRITE)** for contract drivers. It will implement the drivers and report back without committing.

10h. **Normal mode:** STOP. Present the driver implementation to the user and wait for approval. Do NOT continue until approved.
     **Autonomous mode:** Auto-approve and proceed immediately.

10i. Launch **driver-agent (CT - RED - DRIVER - COMMIT)** for contract drivers. It will mark tests `@Disabled("CT - RED - DRIVER")` and commit.

10j. Launch **backend-agent** for external system stubs. It will implement the stubs until contract tests pass, then report back without committing.

10k. **Normal mode:** STOP. Present the stub implementation to the user and wait for approval. Do NOT continue until approved.
     **Autonomous mode:** Auto-approve and proceed immediately.

10l. Launch **release-agent** for contract stubs. It will remove `@Disabled` and commit `<Scenario> | CT - GREEN - STUBS - COMMIT`.

_Resume main process at step 11._

11. Launch **backend-agent**. It will implement the backend until API tests pass.

12. Launch **frontend-agent**. It will implement the frontend until UI tests pass.

13. Launch **release-agent**. It will remove `@Disabled` and commit `<Scenario> | AT - GREEN - SYSTEM - COMMIT`.

14. If there are remaining `// TODO:` scenarios in the test file, loop back to step 2 for the next scenario. Otherwise, present the final outcome to the user for review.

## Escalation

If any agent reports it cannot proceed (stuck, unexpected pattern, test failure it cannot explain), STOP and present the blocker to the user before continuing — **even in autonomous mode**.
