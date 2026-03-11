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

| Agent | Governed by |
|---|---|
| story-agent | This file (Story Agent definition) |
| manager-agent | This file (Manager Agent definition) |
| test-agent | `acceptance-tests.md` + `contract-tests.md` |
| dsl-agent | `acceptance-tests.md` + `contract-tests.md` + `dsl-core.md` |
| driver-agent | `acceptance-tests.md` + `contract-tests.md` + `driver-port.md` |
| backend-agent | `acceptance-tests.md` |
| frontend-agent | `acceptance-tests.md` |
| release-agent | `acceptance-tests.md` |

### Story Agent

- Scan existing acceptance tests to find behaviours not yet covered by any scenario — propose these as **Legacy Coverage**.
- Produce Gherkin scenarios for the new feature (one per acceptance criterion) and the Legacy Coverage proposals.
- If the human approves Legacy Coverage, add them to the GitHub issue under a `## Legacy Coverage` section.
- Present both sets to the human and wait for approval. STOP — do not proceed further.

### Manager Agent

- Read the GitHub project board and pick the **top card in the Ready column**.
- Move that card to **In Progress**.
- Pass the issue to the orchestrator to run the full pipeline.
- Stories are processed **sequentially** — one at a time, top card first.
