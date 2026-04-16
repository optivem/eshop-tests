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
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod02 (raw) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod02/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod03: Raw ===
        @{  Id = "mod03-smoke";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod03 (raw) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod03/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod03-e2e";
            SampleTest = "shouldPlaceOrder";
            Name = "mod03 (raw) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/legacy/mod03/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod04: Clients ===
        @{  Id = "mod04-smoke";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod04 (clients) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod04/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod04-e2e";
            SampleTest = "shouldPlaceOrder";
            Name = "mod04 (clients) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/legacy/mod04/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod05: Drivers ===
        @{  Id = "mod05-smoke";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod05 (drivers) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod05/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod05-e2e";
            SampleTest = "shouldPlaceOrder";
            Name = "mod05 (drivers) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/legacy/mod05/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod06: Channels ===
        @{  Id = "mod06-smoke";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod06 (channels) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod06/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod06-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod06 (channels) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod06/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod06-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod06 (channels) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod06/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod07: App DSL ===
        @{  Id = "mod07-smoke";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod07 (app dsl) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod07/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod07-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod07 (app dsl) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod07/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod07-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod07 (app dsl) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod07/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod08: Scenario DSL ===
        @{  Id = "mod08-smoke";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod08 (scenario dsl) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod08/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod08-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod08 (scenario dsl) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod08/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod08-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod08 (scenario dsl) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod08/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod09: External Stubs ===
        @{  Id = "mod09-smoke-stub";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod09 (external stubs) - Smoke (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=smoke-test tests/legacy/mod09/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod09-smoke-real";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "mod09 (external stubs) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/legacy/mod09/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod10: Acceptance ===
        @{  Id = "mod10-acceptance-api";
            SampleTest = "shouldBeAbleToBrowseCoupons";
            Name = "mod10 (acceptance) - Acceptance (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod10-acceptance-ui";
            SampleTest = "shouldBeAbleToBrowseCoupons";
            Name = "mod10 (acceptance) - Acceptance (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod10-acceptance-isolated-api";
            SampleTest = "shouldBeAbleToCancelOrder";
            Name = "mod10 (acceptance) - Acceptance Isolated (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod10-acceptance-isolated-ui";
            SampleTest = "shouldBeAbleToCancelOrder";
            Name = "mod10 (acceptance) - Acceptance Isolated (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/legacy/mod10/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === mod11: Contract ===
        @{  Id = "mod11-contract-stub";
            SampleTest = "shouldBeAbleToGetTime";
            Name = "mod11 (contract) - Contract (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=external-system-contract-test tests/legacy/mod11/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod11-contract-real";
            SampleTest = "shouldBeAbleToGetTime";
            Name = "mod11 (contract) - Contract (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=external-system-contract-test tests/legacy/mod11/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod11-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod11 (contract) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/legacy/mod11/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "mod11-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod11 (contract) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/legacy/mod11/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === latest ===
        @{  Id = "smoke-stub";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "latest - Smoke (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=smoke-test tests/latest/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "smoke-real";
            SampleTest = "shouldBeAbleToGoToShop";
            Name = "latest - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/latest/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-api";
            SampleTest = "shouldBeAbleToBrowseCoupons";
            Name = "latest - Acceptance (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-ui";
            SampleTest = "shouldBeAbleToBrowseCoupons";
            Name = "latest - Acceptance (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-api";
            SampleTest = "shouldBeAbleToCancelOrder";
            Name = "latest - Acceptance Isolated (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-ui";
            SampleTest = "shouldBeAbleToCancelOrder";
            Name = "latest - Acceptance Isolated (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test tests/latest/acceptance --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-stub";
            SampleTest = "shouldBeAbleToGetTime";
            Name = "latest - Contract (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=external-system-contract-test tests/latest/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-real";
            SampleTest = "shouldBeAbleToGetTime";
            Name = "latest - Contract (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=external-system-contract-test tests/latest/contract --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "latest - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/latest/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "e2e-ui";
            SampleTest = "shouldPlaceOrder";
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
