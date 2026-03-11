@docs/prompts/atdd/acceptance-tests.md
@docs/prompts/atdd/contract-tests.md
@docs/prompts/atdd/workflow.md
@docs/prompts/architecture/dsl-core.md
@docs/prompts/architecture/driver-port.md
@docs/prompts/architecture/test.md
@docs/prompts/architecture/language-equivalents.md

## Git Push

Always push to the remote after every commit. This applies to all repositories (eshop, eshop-tests-java, eshop-tests-dotnet, eshop-tests-typescript, etc.).

## Git Safety

Before running any destructive or hard-to-reverse git command — including but not limited to `git reset --hard`, `git push --force`, `git rebase`, `git branch -D`, or anything that rewrites or removes commits — always explain what the command will do and ask the user for explicit confirmation first. Do not assume "start over" or similar phrasing is an implicit approval for destructive operations.
