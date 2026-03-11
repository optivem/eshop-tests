# Multi-Agent ATDD Workflow

## Overview

This workflow takes a user story and produces a working, tested feature using a pipeline of
specialized agents. Human input is required at five points.

## Human Touchpoints

1. **Gherkin + coverage gap approval** — after the Story Agent produces Gherkin scenarios and identifies coverage gaps in existing functionality, the human reviews and approves both. This is the opportunity to correct business intent and confirm which existing behaviours should be retroactively covered before new work begins.
2. **Test approval** — after the Test Agent writes the acceptance tests (AT · RED · TEST · WRITE), the human reviews the test code before it is committed. This catches translation errors from Gherkin to code before DSL, drivers, and backend are built on top.
3. **DSL approval** — after the DSL Agent implements the DSL (AT · RED · DSL · WRITE), the human reviews the DSL design and driver interface signatures before they are committed. DSL method names and driver DTOs are the architectural contract — errors here cascade into all downstream agents.
4. **Driver approval** — after the Driver Agent completes AT · RED · DRIVER · WRITE, the human reviews the driver implementation before backend/frontend work begins. This validates the full test spec (tests + DSL + drivers) as a unit, preventing agents from chasing false failures caused by a wrong driver.
5. **Outcome review** — after all agents complete, the human reviews the working feature.

## Pipeline

```
User Story
    │
    ▼
[Story Agent]      →  Gherkin scenarios
                   →  Legacy Coverage               ← HUMAN APPROVES BOTH
    │
    ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  Per-scenario loop (repeats until all scenarios GREEN)          │
    │                                                                 │
    │  [Test Agent]    →  Acceptance tests   AT · RED · TEST · WRITE  │
    │      │                                                          │
    │      │                              ← HUMAN APPROVES TESTS      │
    │      │                                                          │
    │  [Test Agent]    →  Commit tests      AT · RED · TEST · COMMIT  │
    │      │                                                          │
    │      ▼                                                          │
    │  [DSL Agent]     →  DSL + interfaces  AT · RED · DSL · WRITE    │
    │      │                                                          │
    │      │                              ← HUMAN APPROVES DSL        │
    │      │                                                          │
    │  [DSL Agent]     →  Commit DSL        AT · RED · DSL · COMMIT   │
    │      │                                                          │
    │      ▼                                                          │
    │  [Driver Agent]  →  Drivers           AT · RED · DRIVER · WRITE │
    │      │                                                          │
    │      │                              ← HUMAN APPROVES DRIVERS    │
    │      │                                                          │
    │  [Driver Agent]  →  Commit drivers    AT · RED · DRIVER · COMMIT│
    │      │                                                          │
    │      ├── external/ changed? ► contract-tests sub-process        │
    │      │                                                          │
    │  [Backend Agent] →  Working backend   AT · GREEN · SYSTEM · WRITE│
    │      │                                                          │
    │      ▼                                                          │
    │  [Frontend Agent]→  Working frontend  AT · GREEN · SYSTEM · WRITE│
    │      │                                                          │
    │      ▼                                                          │
    │  [Release Agent] →  Final commit      AT · GREEN · SYSTEM · COMMIT│
    │      │                                                          │
    │      └── remaining scenarios? ──► loop back                     │
    └─────────────────────────────────────────────────────────────────┘
    │
    ▼
                                                   ← HUMAN REVIEWS OUTCOME
```

### When does the loop apply?

The approach depends on whether new DSL is needed:

- **New DSL needed (compile errors in AT · RED · TEST · WRITE):** The Test Agent implements only the **first scenario** and leaves the rest as `// TODO:` comments. Each loop cycle picks up the next scenario. This validates the DSL design before multiplying it across all scenarios.
- **Existing DSL only (no compile errors):** All scenarios are implemented together in a single pass — no looping needed.

## Agent Definitions

### Story Agent
- **Input:** User story in natural language
- **Output (new scenarios):** Gherkin scenarios (Given/When/Then) for the new feature — one scenario per acceptance criterion, minimal and focused.
- **Output (coverage gaps):** Proposed **Legacy Coverage** — Gherkin scenarios for existing functionality related to the user story that is not yet covered by acceptance tests. These describe behaviour that already exists in the system but has never been formally specified.
- **Analysis:** Scan existing acceptance test files for the relevant use case(s). Identify behaviours that are exercised by the application but not described by any existing scenario. Propose these as Legacy Coverage.
- **Ticket update:** If the human approves any Legacy Coverage, add them to the GitHub issue under a `## Legacy Coverage` section.
- **Handoff:** Present both sets of scenarios to the human and wait for approval before proceeding.

### Manager Agent

The Manager Agent is the entry point for the entire pipeline. It:

1. Reads the GitHub project board and picks the **top card in the Ready column**.
2. Moves that card to **In Progress**.
3. Feeds the story into the Story Agent and orchestrates the full pipeline to completion.
4. Stories are processed **sequentially** — one at a time, top card first.

### Test Agent
- **Input:** Approved Gherkin scenarios (Legacy Coverage first, then new feature scenarios)
- **WRITE output:** Written test code, presented to human for approval — not yet committed
- **COMMIT output:** Committed acceptance tests (`@Disabled("AT · RED · TEST · WRITE")`)
- **Governed by:** `acceptance-tests.md` — AT · RED · TEST · WRITE and AT · RED · TEST · COMMIT phases
- **Ordering:** Legacy Coverage scenarios are written before new feature scenarios within the same test class.
- **Handoff:** Tests committed, test class name passed to DSL Agent

### DSL Agent
- **Input:** Test class name and failing tests
- **WRITE output:** DSL implementation + driver interface signatures, presented to human for approval — not yet committed
- **COMMIT output:** Driver stubs added, tests committed (`@Disabled("AT · RED · DSL · WRITE")`)
- **Governed by:** `acceptance-tests.md` — AT · RED · DSL · WRITE and AT · RED · DSL · COMMIT phases; `dsl-core.md` for coding rules
- **Handoff:** Driver interface signatures passed to Driver Agent

### Driver Agent
- **Input:** Driver interface signatures and disabled tests
- **WRITE output:** Implemented drivers, presented to human for approval — not yet committed
- **COMMIT output:** Tests committed (`@Disabled("AT · RED · DRIVER · WRITE")`)
- **Governed by:** `acceptance-tests.md` — AT · RED · DRIVER · WRITE and AT · RED · DRIVER · COMMIT phases; `driver-port.md` for coding rules
- **Handoff:** Orchestrator routes to contract-tests sub-process or AT · GREEN · SYSTEM · WRITE based on DSL agent's external system flag

### Backend Agent
- **Input:** Driver interfaces, existing backend codebase
- **Output:** Backend changes that make API acceptance tests pass
- **Governed by:** `acceptance-tests.md` — AT · GREEN · SYSTEM · WRITE (backend)
- **Constraint:** Must NOT change tests, DSL, or drivers — only backend code.
- **Handoff:** API acceptance tests passing

### Frontend Agent
- **Input:** Working backend, existing frontend codebase
- **Output:** Frontend changes that make UI acceptance tests pass
- **Governed by:** `acceptance-tests.md` — AT · GREEN · SYSTEM · WRITE (frontend)
- **Constraint:** Must NOT change tests, DSL, or drivers — only frontend code.
- **Handoff:** All acceptance tests passing

### Release Agent
- **Input:** All acceptance tests passing
- **Output:** `@Disabled` removed, final commit `<Scenario> | AT · GREEN · SYSTEM · COMMIT`
- **Governed by:** `acceptance-tests.md` — AT · GREEN · SYSTEM · COMMIT phase
- **Handoff:** Present outcome to human for review.

## Escalation Rule

Any agent that encounters a situation not covered by existing patterns must STOP and ask the
human rather than guess. Examples:
- A new abstraction with no existing precedent in the codebase
- A test failure with an unclear cause after one retry
- An ambiguous acceptance criterion that could map to multiple implementations

## Optional Sub-Process

If the DSL Agent reports **external system interfaces changed = yes** (i.e. any new methods were added to interfaces under `external/`), the orchestrator invokes the Contract Tests pipeline defined in `contract-tests.md` (CT · RED · TEST · WRITE → CT · RED · TEST · COMMIT → CT · GREEN · STUBS · WRITE → CT · GREEN · STUBS · COMMIT) before proceeding to AT · GREEN · SYSTEM · WRITE.
