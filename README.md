# eShop Tests

[Java](https://github.com/optivem/eshop-tests-java)

[![acceptance-stage](https://github.com/optivem/eshop-tests-java/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-java/actions/workflows/acceptance-stage.yml)

[.NET](https://github.com/optivem/eshop-tests-dotnet)

[![acceptance-stage](https://github.com/optivem/eshop-tests-dotnet/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-dotnet/actions/workflows/acceptance-stage.yml)

[TypeScript](https://github.com/optivem/eshop-tests-typescript)

[![acceptance-stage](https://github.com/optivem/eshop-tests-typescript/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-typescript/actions/workflows/acceptance-stage.yml)

## Usage

### Implement a single ticket

```
/implement-ticket #42
/implement-ticket #42 --autonomous
```

Runs the full ATDD pipeline (Story → Test → DSL → Driver → Backend → Frontend → Release) for a single GitHub issue.

- Without `--autonomous`: pauses at each human touchpoint (Gherkin approval, test approval, DSL approval, driver approval, outcome review).
- With `--autonomous`: skips all approval stops and runs end-to-end. Escalations (stuck agents, unexplained failures) always pause regardless.

### Process the project board

[GitHub Project Board](https://github.com/orgs/optivem/projects/15)

```
/manage-project
/manage-project --autonomous
```

Picks the top card from the **Ready** column of the GitHub project board, moves it to **In Progress**, and runs `/implement-ticket` on it.

## Pipeline

```
GitHub Project Board       GitHub Issue (#)
         │                               │
         ▼                               │
 [Manager Agent]                         │
   picks top Ready card                  │
   moves card to In Progress             │
         │                               │
         └─────────────┬─────────────────┘
                       │
                       ▼
              [Story Agent]
                produces Gherkin scenarios + Legacy Coverage
                       │
                       │            ← HUMAN APPROVES GHERKIN + LEGACY COVERAGE
                       │
                       ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  Per-scenario loop (repeats until all scenarios GREEN)           │
    │                                                                  │
    │  [Test Agent]    →  writes tests     AT - RED - TEST - WRITE     │
    │                                                                  │
    │                              ← HUMAN APPROVES TESTS             │
    │                                                                  │
    │  [Test Agent]    →  commits tests    AT - RED - TEST - COMMIT    │
    │                                                                  │
    │  [DSL Agent]     →  writes DSL       AT - RED - DSL - WRITE      │
    │                                                                  │
    │                              ← HUMAN APPROVES DSL               │
    │                                                                  │
    │  [DSL Agent]     →  commits DSL      AT - RED - DSL - COMMIT     │
    │                                                                  │
    │  [Driver Agent]  →  writes drivers   AT - RED - DRIVER - WRITE   │
    │                                                                  │
    │                              ← HUMAN APPROVES DRIVERS           │
    │                                                                  │
    │  [Driver Agent]  →  commits drivers  AT - RED - DRIVER - COMMIT  │
    │                                                                  │
    │      ├── external/ changed? ──► CT sub-process (see below)       │
    │                                                                  │
    │  [Backend Agent] →  backend passing  AT - GREEN - SYSTEM - WRITE │
    │  [Frontend Agent]→  frontend passing AT - GREEN - SYSTEM - WRITE │
    │  [Release Agent] →  final commit     AT - GREEN - SYSTEM - COMMIT│
    │                                                                  │
    │      └── remaining // TODO: scenarios? ──► loop back             │
    └──────────────────────────────────────────────────────────────────┘
                       │
                       │            ← HUMAN REVIEWS OUTCOME
```

**CT sub-process** (only when `external/` interfaces changed):

```
CT - RED - TEST - WRITE  →  CT - RED - TEST - COMMIT
CT - RED - DSL - WRITE   →  CT - RED - DSL - COMMIT
CT - RED - DRIVER - WRITE →  CT - RED - DRIVER - COMMIT
CT - GREEN - STUBS - WRITE →  CT - GREEN - STUBS - COMMIT
```

**New DSL needed:** the loop processes one scenario at a time — the Test Agent implements the first and leaves the rest as `// TODO:` comments.
**Existing DSL only:** all scenarios are implemented in a single pass.

## License

[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contributors

- [Valentina Jemuović](https://github.com/valentinajemuovic)
- [Jelena Cupać](https://github.com/jcupac)