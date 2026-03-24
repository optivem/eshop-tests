# eShop Tests (Java)

[![acceptance-stage](https://github.com/optivem/eshop-tests-java/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-java/actions/workflows/acceptance-stage.yml)

## Prerequisites

- Java 21
- Docker Desktop
- PowerShell 7+
- Node 22+

Ensure you have JDK 21 installed

```shell
java -version
```

Check that JAVA_HOME is set correctly & points to your JDK 21 installation

```shell
echo $env:JAVA_HOME
```

Check that you have Powershell 7

```shell
$PSVersionTable.PSVersion
```

## Run Everything

```powershell
.\Run-SystemTests.ps1
```

This will:

1. Build the Frontend (TypeScript compilation and bundling with Vite)
2. Build the Backend (Java compilation and JAR creation)
3. Start Docker containers (Frontend, Backend, PostgreSQL, & Mock External APIs)
4. Wait for all services to be healthy
5. Run all System Tests (E2E API, E2E UI, and Smoke Tests)

You can open these URLs in your browser:

- **Frontend UI**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:8081/api](http://localhost:8081/api)
- **ERP API**: [http://localhost:9001/erp/health](http://localhost:9001/erp/health)
- **Tax API**: [http://localhost:9001/tax/health](http://localhost:9001/tax/health)

## Separate Commands

### Run with Local Build (Default)

Builds locally and runs all system tests:

```powershell
.\Run-SystemTests.ps1
# or explicitly:
.\Run-SystemTests.ps1 local
```

### Run with Pipeline Images

Uses pre-built Docker images from registry:

```powershell
.\Run-SystemTests.ps1 pipeline
```

### Quick Test Re-run

Skip build/start phases and just run tests (assumes services are already running):

```powershell
.\Run-SystemTests.ps1 -SkipTests $false
```

### Run a Specific Suite

Run only a specific test suite by ID:

```powershell
.\Run-SystemTests.ps1 -Suite v7-acceptance-api
```

### Run a Single Test

Run only one test method within a suite:

```powershell
.\Run-SystemTests.ps1 -Suite v7-acceptance-api -Test canPlaceOrder
```

### Individual Component Builds

You can also build components separately:

**Backend:**

```powershell
cd backend
.\Build-Backend.ps1
```

**Frontend:**

```powershell
cd frontend
.\Build-Frontend.ps1
```

### Docker Commands

For manual Docker management:

**View Logs:**

```powershell
docker compose -f docker-compose.local.yml logs
# or for pipeline:
docker compose -f docker-compose.pipeline.yml logs
```

**Stop Services:**

```powershell
docker compose -f docker-compose.local.yml down
# or for pipeline:
docker compose -f docker-compose.pipeline.yml down
```

**Service URLs:**

You can open these URLs in your browser:

- **Frontend UI**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:8081/api](http://localhost:8081/api)
- **ERP API**: [http://localhost:9001/erp/health](http://localhost:9001/erp/health)
- **Tax API**: [http://localhost:9001/tax/health](http://localhost:9001/tax/health)
- **PostgreSQL Database**: localhost:5401 (database: `eshop`, user: `eshop_user`, password: `eshop_password`)

## Implementing User Stories with Claude Code

This project uses a multi-agent ATDD workflow. To implement a user story end-to-end, run:

```
/implement-story <input>
```

You can pass a GitHub issue number — the agent reads the issue directly and closes it when done:

```
/implement-story #42
```

To reference an issue from another repository, use the full `owner/repo#number` format:

```
/implement-story optivem/eshop#42
```

Or provide a user story as free text:

```
/implement-story As a customer, I want to place an order for a product
```

Or include acceptance criteria for more precision:

```
/implement-story As a customer, I want to place an order for a product

Acceptance Criteria:
- Given a product in the catalogue, when I place an order with a valid quantity, then it succeeds
- Given a product in the catalogue, when I place an order with an invalid quantity, then it fails
```

**One-time setup** — authenticate the GitHub MCP server:

```
/mcp
```

The pipeline runs 7 specialized agents (Story → Test → DSL → Driver → Backend → Frontend → Release)
and only requires human input at two points: approving the Gherkin scenarios and reviewing the
final outcome. See [docs/prompts/atdd/workflow.md](docs/prompts/atdd/workflow.md) for details.

## Pre-commit Checks

Before each commit, the following checks run automatically: **Spotless** (formatting), **SonarLint** (static analysis), and **compilation** (Java + tests).

**One-time setup:**

```powershell
.\gradlew installPreCommitHook
```

**Bypass** (when needed): `git commit --no-verify`

**Run checks manually:** `.\gradlew preCommitCheck`

## License

[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contributors

- [Valentina Jemuović](https://github.com/valentinajemuovic)
- [Jelena Cupać](https://github.com/jcupac)
