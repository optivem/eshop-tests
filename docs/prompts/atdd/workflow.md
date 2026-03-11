# Multi-Agent ATDD Workflow

## Overview

This workflow takes a user story and produces a working, tested feature using a pipeline of
specialized agents. Human input is required at five points.

## Human Touchpoints

1. **Gherkin approval** — after the Story Agent produces Gherkin scenarios, the human reviews and approves them. This is the opportunity to correct business intent before implementation begins.
2. **Test approval** — after the Test Agent writes the acceptance tests (RED 1 WRITE), the human reviews the test code before it is committed. This catches translation errors from Gherkin to code before DSL, drivers, and backend are built on top.
3. **DSL approval** — after the DSL Agent implements the DSL (RED 2 WRITE), the human reviews the DSL design and driver interface signatures before they are committed. DSL method names and driver DTOs are the architectural contract — errors here cascade into all downstream agents.
4. **Driver approval** — after the Driver Agent completes RED 3, the human reviews the driver implementation before backend/frontend work begins. This validates the full test spec (tests + DSL + drivers) as a unit, preventing agents from chasing false failures caused by a wrong driver.
5. **Outcome review** — after all agents complete, the human reviews the working feature.

## Pipeline

```
User Story
    │
    ▼
[Story Agent]      →  Gherkin scenarios           ← HUMAN APPROVES
    │
    ▼
    ┌─────────────────────────────────────────────────────────┐
    │  Per-scenario loop (repeats until all scenarios GREEN)  │
    │                                                         │
    │  [Test Agent]    →  Acceptance tests   RED 1 WRITE      │
    │      │                                                  │
    │      │                              ← HUMAN APPROVES TESTS
    │      │                                                  │
    │  [Test Agent]    →  Commit tests      RED 1 COMMIT      │
    │      │                                                  │
    │      ▼                                                  │
    │  [DSL Agent]     →  DSL + interfaces   RED 2 WRITE      │
    │      │                                                  │
    │      │                              ← HUMAN APPROVES DSL
    │      │                                                  │
    │  [DSL Agent]     →  Commit DSL        RED 2 COMMIT      │
    │      │                                                  │
    │      ▼                                                  │
    │  [Driver Agent]  →  Drivers            RED 3 WRITE      │
    │      │                                                  │
    │      │                              ← HUMAN APPROVES DRIVERS
    │      │                                                  │
    │  [Driver Agent]  →  Commit drivers     RED 3 COMMIT     │
    │      │                                                  │
    │      ├── external/ changed? ► RED 1/2 (contract-tests)    │
    │      │                                                  │
    │  [Backend Agent] →  Working backend    GREEN 2          │
    │      │                                                  │
    │      ▼                                                  │
    │  [Frontend Agent]→  Working frontend   GREEN 2          │
    │      │                                                  │
    │      ▼                                                  │
    │  [Release Agent] →  Final commit       GREEN 2 (COMMIT) │
    │      │                                                  │
    │      └── remaining scenarios? ──► loop back             │
    └─────────────────────────────────────────────────────────┘
    │
    ▼
                                                   ← HUMAN REVIEWS OUTCOME
```

### When does the loop apply?

The approach depends on whether new DSL is needed:

- **New DSL needed (compile errors in RED 1):** The Test Agent implements only the **first scenario** and leaves the rest as `// TODO:` comments. Each loop cycle picks up the next scenario. This validates the DSL design before multiplying it across all scenarios.
- **Existing DSL only (no compile errors):** All scenarios are implemented together in a single pass — no looping needed.

## Agent Definitions

### Story Agent
- **Input:** User story in natural language
- **Output:** Gherkin scenarios (Given/When/Then)
- **Rules:** One scenario per acceptance criterion. Minimal, focused — no noise.
- **Handoff:** Present Gherkin to human and wait for approval before proceeding.

### Test Agent
- **Input:** Approved Gherkin scenarios
- **WRITE output:** Written test code, presented to human for approval — not yet committed
- **COMMIT output:** Committed acceptance tests (`@Disabled("RED 1 - Tests")`)
- **Governed by:** `acceptance-tests.md` — RED 1 (WRITE + STOP) and RED 1 (COMMIT) phases
- **Handoff:** Tests committed, test class name passed to DSL Agent

### DSL Agent
- **Input:** Test class name and failing tests
- **WRITE output:** DSL implementation + driver interface signatures, presented to human for approval — not yet committed
- **COMMIT output:** Driver stubs added, tests committed (`@Disabled("RED 2 - DSL")`)
- **Governed by:** `acceptance-tests.md` — RED 2 phases; `dsl-core.md` for coding rules
- **Handoff:** Driver interface signatures passed to Driver Agent

### Driver Agent
- **Input:** Driver interface signatures and disabled tests
- **WRITE output:** Implemented drivers, presented to human for approval — not yet committed
- **COMMIT output:** Tests committed (`@Disabled("RED 3 - Driver")`)
- **Governed by:** `acceptance-tests.md` — RED 3 phases; `driver-port.md` for coding rules
- **Handoff:** Orchestrator routes to contract-tests sub-process or GREEN 2 based on DSL agent's external system flag

### Backend Agent
- **Input:** Driver interfaces, existing backend codebase
- **Output:** Backend changes that make API acceptance tests pass
- **Governed by:** `acceptance-tests.md` — GREEN 2 (backend)
- **Constraint:** Must NOT change tests, DSL, or drivers — only backend code.
- **Handoff:** API acceptance tests passing

### Frontend Agent
- **Input:** Working backend, existing frontend codebase
- **Output:** Frontend changes that make UI acceptance tests pass
- **Governed by:** `acceptance-tests.md` — GREEN 2 (frontend)
- **Constraint:** Must NOT change tests, DSL, or drivers — only frontend code.
- **Handoff:** All acceptance tests passing

### Release Agent
- **Input:** All acceptance tests passing
- **Output:** `@Disabled` removed, final commit `<Scenario> | GREEN - System`
- **Governed by:** `acceptance-tests.md` — GREEN 2 (COMMIT)
- **Handoff:** Present outcome to human for review.

## Escalation Rule

Any agent that encounters a situation not covered by existing patterns must STOP and ask the
human rather than guess. Examples:
- A new abstraction with no existing precedent in the codebase
- A test failure with an unclear cause after one retry
- An ambiguous acceptance criterion that could map to multiple implementations

## Optional Sub-Process

If the DSL Agent reports **external system interfaces changed = yes** (i.e. any new methods were added to interfaces under `external/`), the orchestrator invokes the Contract Tests pipeline defined in `contract-tests.md` (RED 1 WRITE → RED 1 COMMIT → GREEN WRITE → GREEN COMMIT) before proceeding to GREEN 2.
