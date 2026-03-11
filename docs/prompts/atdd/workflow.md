# Multi-Agent ATDD Workflow

## Overview

This workflow takes a user story and produces a working, tested feature using a pipeline of
specialized agents. Human input is required at five points.

## Human Touchpoints

1. **Gherkin + coverage gap approval** — after the Story Agent produces Gherkin scenarios and identifies coverage gaps in existing functionality, the human reviews and approves both. This is the opportunity to correct business intent and confirm which existing behaviours should be retroactively covered before new work begins.
2. **Test approval** — after the Test Agent writes the acceptance tests (RED · WRITE TEST), the human reviews the test code before it is committed. This catches translation errors from Gherkin to code before DSL, drivers, and backend are built on top.
3. **DSL approval** — after the DSL Agent implements the DSL (RED · WRITE DSL), the human reviews the DSL design and driver interface signatures before they are committed. DSL method names and driver DTOs are the architectural contract — errors here cascade into all downstream agents.
4. **Driver approval** — after the Driver Agent completes RED · WRITE DRIVER, the human reviews the driver implementation before backend/frontend work begins. This validates the full test spec (tests + DSL + drivers) as a unit, preventing agents from chasing false failures caused by a wrong driver.
5. **Outcome review** — after all agents complete, the human reviews the working feature.

## Pipeline

```
User Story
    │
    ▼
[Story Agent]      →  Gherkin scenarios
                   →  Legacy Coverage             ← HUMAN APPROVES BOTH
    │
    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  Per-scenario loop (repeats until all scenarios GREEN)        │
    │                                                               │
    │  [Test Agent]    →  Acceptance tests   RED · WRITE TEST       │
    │      │                                                        │
    │      │                              ← HUMAN APPROVES TESTS    │
    │      │                                                        │
    │  [Test Agent]    →  Commit tests       RED · COMMIT TEST      │
    │      │                                                        │
    │      ▼                                                        │
    │  [DSL Agent]     →  DSL + interfaces   RED · WRITE DSL        │
    │      │                                                        │
    │      │                              ← HUMAN APPROVES DSL      │
    │      │                                                        │
    │  [DSL Agent]     →  Commit DSL         RED · COMMIT DSL       │
    │      │                                                        │
    │      ▼                                                        │
    │  [Driver Agent]  →  Drivers            RED · WRITE DRIVER     │
    │      │                                                        │
    │      │                              ← HUMAN APPROVES DRIVERS  │
    │      │                                                        │
    │  [Driver Agent]  →  Commit drivers     RED · COMMIT DRIVER    │
    │      │                                                        │
    │      ├── external/ changed? ► contract-tests sub-process      │
    │      │                                                        │
    │  [Backend Agent] →  Working backend    GREEN · WRITE SYSTEM   │
    │      │                                                        │
    │      ▼                                                        │
    │  [Frontend Agent]→  Working frontend   GREEN · WRITE SYSTEM   │
    │      │                                                        │
    │      ▼                                                        │
    │  [Release Agent] →  Final commit       GREEN · COMMIT SYSTEM  │
    │      │                                                        │
    │      └── remaining scenarios? ──► loop back                   │
    └───────────────────────────────────────────────────────────────┘
    │
    ▼
                                                   ← HUMAN REVIEWS OUTCOME
```

### When does the loop apply?

The approach depends on whether new DSL is needed:

- **New DSL needed (compile errors in RED · WRITE TEST):** The Test Agent implements only the **first scenario** and leaves the rest as `// TODO:` comments. Each loop cycle picks up the next scenario. This validates the DSL design before multiplying it across all scenarios.
- **Existing DSL only (no compile errors):** All scenarios are implemented together in a single pass — no looping needed.

## Agent Definitions

### Story Agent
- **Input:** User story in natural language
- **Output (new scenarios):** Gherkin scenarios (Given/When/Then) for the new feature — one scenario per acceptance criterion, minimal and focused.
- **Output (coverage gaps):** Proposed **Legacy Coverage** — Gherkin scenarios for existing functionality related to the user story that is not yet covered by acceptance tests. These describe behaviour that already exists in the system but has never been formally specified.
- **Analysis:** Scan existing acceptance test files for the relevant use case(s). Identify behaviours that are exercised by the application but not described by any existing scenario. Propose these as Legacy Coverage.
- **Ticket update:** If the human approves any Legacy Coverage, add them to the GitHub issue under a `## Legacy Coverage` section.
- **Handoff:** Present both sets of scenarios to the human and wait for approval before proceeding.

### Test Agent
- **Input:** Approved Gherkin scenarios (Legacy Coverage first, then new feature scenarios)
- **WRITE output:** Written test code, presented to human for approval — not yet committed
- **COMMIT output:** Committed acceptance tests (`@Disabled("RED · WRITE TEST")`)
- **Governed by:** `acceptance-tests.md` — RED · WRITE TEST and RED · COMMIT TEST phases
- **Ordering:** Legacy Coverage scenarios are written before new feature scenarios within the same test class.
- **Handoff:** Tests committed, test class name passed to DSL Agent

### DSL Agent
- **Input:** Test class name and failing tests
- **WRITE output:** DSL implementation + driver interface signatures, presented to human for approval — not yet committed
- **COMMIT output:** Driver stubs added, tests committed (`@Disabled("RED · WRITE DSL")`)
- **Governed by:** `acceptance-tests.md` — RED · WRITE DSL and RED · COMMIT DSL phases; `dsl-core.md` for coding rules
- **Handoff:** Driver interface signatures passed to Driver Agent

### Driver Agent
- **Input:** Driver interface signatures and disabled tests
- **WRITE output:** Implemented drivers, presented to human for approval — not yet committed
- **COMMIT output:** Tests committed (`@Disabled("RED · WRITE DRIVER")`)
- **Governed by:** `acceptance-tests.md` — RED · WRITE DRIVER and RED · COMMIT DRIVER phases; `driver-port.md` for coding rules
- **Handoff:** Orchestrator routes to contract-tests sub-process or GREEN · WRITE SYSTEM based on DSL agent's external system flag

### Backend Agent
- **Input:** Driver interfaces, existing backend codebase
- **Output:** Backend changes that make API acceptance tests pass
- **Governed by:** `acceptance-tests.md` — GREEN · WRITE SYSTEM (backend)
- **Constraint:** Must NOT change tests, DSL, or drivers — only backend code.
- **Handoff:** API acceptance tests passing

### Frontend Agent
- **Input:** Working backend, existing frontend codebase
- **Output:** Frontend changes that make UI acceptance tests pass
- **Governed by:** `acceptance-tests.md` — GREEN · WRITE SYSTEM (frontend)
- **Constraint:** Must NOT change tests, DSL, or drivers — only frontend code.
- **Handoff:** All acceptance tests passing

### Release Agent
- **Input:** All acceptance tests passing
- **Output:** `@Disabled` removed, final commit `<Scenario> | GREEN · COMMIT SYSTEM`
- **Governed by:** `acceptance-tests.md` — GREEN · COMMIT SYSTEM phase
- **Handoff:** Present outcome to human for review.

## Escalation Rule

Any agent that encounters a situation not covered by existing patterns must STOP and ask the
human rather than guess. Examples:
- A new abstraction with no existing precedent in the codebase
- A test failure with an unclear cause after one retry
- An ambiguous acceptance criterion that could map to multiple implementations

## Optional Sub-Process

If the DSL Agent reports **external system interfaces changed = yes** (i.e. any new methods were added to interfaces under `external/`), the orchestrator invokes the Contract Tests pipeline defined in `contract-tests.md` (RED · WRITE TEST → RED · COMMIT TEST → GREEN · WRITE STUBS → GREEN · COMMIT STUBS) before proceeding to GREEN · WRITE SYSTEM.
