# eShop Tests

[Java](https://github.com/optivem/eshop-tests-java)

[![acceptance-stage](https://github.com/optivem/eshop-tests-java/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-java/actions/workflows/acceptance-stage.yml)

[.NET](https://github.com/optivem/eshop-tests-dotnet)

[![acceptance-stage](https://github.com/optivem/eshop-tests-dotnet/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-dotnet/actions/workflows/acceptance-stage.yml)

[TypeScript](https://github.com/optivem/eshop-tests-typescript)

[![acceptance-stage](https://github.com/optivem/eshop-tests-typescript/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-typescript/actions/workflows/acceptance-stage.yml)

## Usage

### Implement a single story

```
/implement-story #42
/implement-story #42 --autonomous
```

Runs the full ATDD pipeline (Story → Test → DSL → Driver → Backend → Frontend → Release) for a single GitHub issue or free-text story.

- Without `--autonomous`: pauses at each human touchpoint (Gherkin approval, test approval, DSL approval, driver approval, outcome review).
- With `--autonomous`: skips all approval stops and runs end-to-end. Escalations (stuck agents, unexplained failures) always pause regardless.

### Process the project board

```
/manage-project
/manage-project --autonomous
```

Picks the top card from the **Ready** column of the GitHub project board, moves it to **In Progress**, and runs `/implement-story` on it.

## Pipeline

```
GitHub Project Board          User Story (free text or issue #)
        │                                  │
        ▼                                  │
[Manager Agent]                            │
  picks top Ready card                     │
  moves to In Progress                     │
        │                                  │
        └──────────────┬───────────────────┘
                       │
                       ▼
              [Story Agent]      →  Gherkin scenarios
                                 →  Legacy Coverage        ← HUMAN APPROVES BOTH
                       │
                       ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  Per-scenario loop (repeats until all scenarios GREEN)          │
    │                                                                 │
    │  [Test Agent]    →  Acceptance tests   AT · RED · TEST · WRITE  │
    │      │                                              ← HUMAN     │
    │  [Test Agent]    →  Commit tests      AT · RED · TEST · COMMIT  │
    │      ▼                                                          │
    │  [DSL Agent]     →  DSL + interfaces   AT · RED · DSL · WRITE   │
    │      │                                              ← HUMAN     │
    │  [DSL Agent]     →  Commit DSL         AT · RED · DSL · COMMIT  │
    │      ▼                                                          │
    │  [Driver Agent]  →  Drivers          AT · RED · DRIVER · WRITE  │
    │      │                                              ← HUMAN     │
    │  [Driver Agent]  →  Commit drivers  AT · RED · DRIVER · COMMIT  │
    │      │                                                          │
    │      ├── external/ changed? ► CT sub-process                    │
    │      │                                                          │
    │  [Backend Agent] →  Working backend  AT · GREEN · SYSTEM · WRITE│
    │  [Frontend Agent]→  Working frontend AT · GREEN · SYSTEM · WRITE│
    │  [Release Agent] →  Final commit    AT · GREEN · SYSTEM · COMMIT│
    │      │                                                          │
    │      └── remaining scenarios? ──► loop back                     │
    └─────────────────────────────────────────────────────────────────┘
                       │
                       ▼
                                                   ← HUMAN REVIEWS OUTCOME
```

**New DSL needed:** the loop processes one scenario at a time — the Test Agent implements the first and leaves the rest as `// TODO:` comments.
**Existing DSL only:** all scenarios are implemented in a single pass.

## License

[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contributors

- [Valentina Jemuović](https://github.com/valentinajemuovic)
- [Jelena Cupać](https://github.com/jcupac)