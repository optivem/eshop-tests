# System Test Configuration
# This file contains configuration values for Run-SystemTests.ps1

$Config = @{

    TestFilter = "--grep '<test>'"

    BuildCommands = @(
        @{  Name = "Clean Install";
            Command = "npm ci"
        },
        @{  Name = "Build Packages";
            Command = "npm run build"
        }
    )

    Suites = @(

        # === mod02: Raw (Smoke only) ===
        @{  Id = "mod02-smoke";
            Name = "mod02 (raw) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod02/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod03: Raw ===
        @{  Id = "mod03-smoke";
            Name = "mod03 (raw) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod03/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod03-e2e";
            Name = "mod03 (raw) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/legacy/mod03/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod04: Clients ===
        @{  Id = "mod04-smoke";
            Name = "mod04 (clients) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod04/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod04-e2e";
            Name = "mod04 (clients) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/legacy/mod04/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod05: Drivers ===
        @{  Id = "mod05-smoke";
            Name = "mod05 (drivers) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod05/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod05-e2e";
            Name = "mod05 (drivers) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/legacy/mod05/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod06: Channels ===
        @{  Id = "mod06-smoke";
            Name = "mod06 (channels) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod06/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod06-e2e-api";
            Name = "mod06 (channels) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod06/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod06-e2e-ui";
            Name = "mod06 (channels) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod06/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod07: App DSL ===
        @{  Id = "mod07-smoke";
            Name = "mod07 (app dsl) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod07/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod07-e2e-api";
            Name = "mod07 (app dsl) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod07/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod07-e2e-ui";
            Name = "mod07 (app dsl) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod07/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod08: Scenario DSL ===
        @{  Id = "mod08-smoke";
            Name = "mod08 (scenario dsl) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod08/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod08-e2e-api";
            Name = "mod08 (scenario dsl) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod08/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod08-e2e-ui";
            Name = "mod08 (scenario dsl) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod08/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod09: External Stubs ===
        @{  Id = "mod09-smoke-stub";
            Name = "mod09 (external stubs) - Smoke (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=smoke-test tests/legacy/mod09/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod09-smoke-real";
            Name = "mod09 (external stubs) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod09/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod10: Acceptance ===
        @{  Id = "mod10-acceptance-api";
            Name = "mod10 (acceptance) - Acceptance (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod10-acceptance-ui";
            Name = "mod10 (acceptance) - Acceptance (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod10-acceptance-isolated-api";
            Name = "mod10 (acceptance) - Acceptance Isolated (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod10-acceptance-isolated-ui";
            Name = "mod10 (acceptance) - Acceptance Isolated (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod11: Contract ===
        @{  Id = "mod11-contract-stub";
            Name = "mod11 (contract) - Contract (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=external-system-contract-test tests/legacy/mod11/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod11-contract-real";
            Name = "mod11 (contract) - Contract (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=external-system-contract-test tests/legacy/mod11/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod11-e2e-api";
            Name = "mod11 (contract) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod11/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod11-e2e-ui";
            Name = "mod11 (contract) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod11/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === latest ===
        @{  Id = "smoke-stub";
            Name = "latest - Smoke (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=smoke-test tests/latest/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "smoke-real";
            Name = "latest - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/latest/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-api";
            Name = "latest - Acceptance (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-ui";
            Name = "latest - Acceptance (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-api";
            Name = "latest - Acceptance Isolated (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-ui";
            Name = "latest - Acceptance Isolated (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-stub";
            Name = "latest - Contract (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=external-system-contract-test tests/latest/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-real";
            Name = "latest - Contract (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=external-system-contract-test tests/latest/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "e2e-api";
            Name = "latest - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/latest/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "e2e-ui";
            Name = "latest - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/latest/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) }
    )
}

# Export the configuration
return $Config
