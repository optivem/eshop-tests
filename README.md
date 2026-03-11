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

## License

[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contributors

- [Valentina Jemuović](https://github.com/valentinajemuovic)
- [Jelena Cupać](https://github.com/jcupac)