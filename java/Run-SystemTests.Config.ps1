# System Test Configuration
# This file contains configuration values for Run-SystemTests.ps1

$Config = @{

    TestFilter = "--tests '*.<test>'"

    BuildCommands = @(
        @{  Name = "Clean Build";
            Command = ".\gradlew.bat clean compileJava compileTestJava"
        }
    )

    Suites = @(

        # === mod02: Smoke ===
        @{  Id = "mod02-smoke";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod02 (smoke) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod02 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod03: E2E ===
        @{  Id = "mod03-smoke";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod03 (e2e) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod03 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod03-e2e";
            SampleTest = "shouldPlaceOrder";
            Name = "mod03 (e2e) - E2E (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod03 -Dtype=e2e -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod04: Clients ===
        @{  Id = "mod04-smoke";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod04 (clients) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod04 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod04-e2e";
            SampleTest = "shouldPlaceOrder";
            Name = "mod04 (clients) - E2E (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod04 -Dtype=e2e -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod05: Drivers ===
        @{  Id = "mod05-smoke";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod05 (drivers) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod05 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod05-e2e";
            SampleTest = "shouldPlaceOrder";
            Name = "mod05 (drivers) - E2E (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod05 -Dtype=e2e -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod06: Channels ===
        @{  Id = "mod06-smoke";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod06 (channels) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod06 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod06-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod06 (channels) - E2E (real) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod06 -Dtype=e2e -DexternalSystemMode=real -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod06-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod06 (channels) - E2E (real) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod06 -Dtype=e2e -DexternalSystemMode=real -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod07: App DSL ===
        @{  Id = "mod07-smoke";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod07 (app dsl) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod07 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod07-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod07 (app dsl) - E2E (real) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod07 -Dtype=e2e -DexternalSystemMode=real -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod07-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod07 (app dsl) - E2E (real) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod07 -Dtype=e2e -DexternalSystemMode=real -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod08: Scenario DSL ===
        @{  Id = "mod08-smoke";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod08 (scenario dsl) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod08 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod08-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod08 (scenario dsl) - E2E (real) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod08 -Dtype=e2e -DexternalSystemMode=real -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod08-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod08 (scenario dsl) - E2E (real) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod08 -Dtype=e2e -DexternalSystemMode=real -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod09: External Stubs ===
        @{  Id = "mod09-smoke-stub";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod09 (external stubs) - Smoke (stub)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod09 -Dtype=smoke -DexternalSystemMode=stub -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod09-smoke-real";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "mod09 (external stubs) - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod09 -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod10: Acceptance Tests ===
        @{  Id = "mod10-acceptance-api";
            SampleTest = "shouldBeAbleToPlaceOrderForValidInput";
            Name = "mod10 (acceptance) - Acceptance (stub) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod10 -Dtype=acceptance -DexcludeTags=isolated -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod10-acceptance-ui";
            SampleTest = "shouldBeAbleToPlaceOrderForValidInput";
            Name = "mod10 (acceptance) - Acceptance (stub) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod10 -Dtype=acceptance -DexcludeTags=isolated -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod10-acceptance-isolated-api";
            SampleTest = "shouldRecordPlacementTimestamp";
            Name = "mod10 (acceptance) - Acceptance Isolated (stub) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod10 -Dtype=acceptance -DincludeTags=isolated -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod10-acceptance-isolated-ui";
            SampleTest = "shouldRecordPlacementTimestamp";
            Name = "mod10 (acceptance) - Acceptance Isolated (stub) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod10 -Dtype=acceptance -DincludeTags=isolated -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === mod11: Contract Tests ===
        @{  Id = "mod11-contract-stub";
            SampleTest = "shouldBeAbleToGetProduct";
            Name = "mod11 (contract) - Contract (stub)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod11 -Dtype=contract -DexternalSystemMode=stub -Dmode=stub -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod11-contract-real";
            SampleTest = "shouldBeAbleToGetProduct";
            Name = "mod11 (contract) - Contract (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod11 -Dtype=contract -DexternalSystemMode=real -Dmode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod11-e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "mod11 (contract) - E2E (real) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod11 -Dtype=e2e -DexternalSystemMode=real -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "mod11-e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "mod11 (contract) - E2E (real) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=mod11 -Dtype=e2e -DexternalSystemMode=real -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },

        # === latest ===
        @{  Id = "smoke-stub";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "latest - Smoke (stub)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=smoke -DexternalSystemMode=stub -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "smoke-real";
            SampleTest = "shouldBeAbleToGoToClock";
            Name = "latest - Smoke (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=smoke -DexternalSystemMode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "acceptance-api";
            SampleTest = "shouldBeAbleToPlaceOrderForValidInput";
            Name = "latest - Acceptance (stub) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=acceptance -DexcludeTags=isolated -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "acceptance-ui";
            SampleTest = "shouldBeAbleToPlaceOrderForValidInput";
            Name = "latest - Acceptance (stub) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=acceptance -DexcludeTags=isolated -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "acceptance-isolated-api";
            SampleTest = "shouldRecordPlacementTimestamp";
            Name = "latest - Acceptance Isolated (stub) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=acceptance -DincludeTags=isolated -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "acceptance-isolated-ui";
            SampleTest = "shouldRecordPlacementTimestamp";
            Name = "latest - Acceptance Isolated (stub) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=acceptance -DincludeTags=isolated -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "contract-stub";
            SampleTest = "shouldBeAbleToGetProduct";
            Name = "latest - Contract (stub)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=contract -DexternalSystemMode=stub -Dmode=stub -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "contract-real";
            SampleTest = "shouldBeAbleToGetProduct";
            Name = "latest - Contract (real)";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=contract -DexternalSystemMode=real -Dmode=real -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "e2e-api";
            SampleTest = "shouldPlaceOrder";
            Name = "latest - E2E (real) - API";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=e2e -DexternalSystemMode=real -Dchannel=API -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; },
        @{  Id = "e2e-ui";
            SampleTest = "shouldPlaceOrder";
            Name = "latest - E2E (real) - UI";
            Command = "& .\gradlew.bat :system-test:test -Dversion=latest -Dtype=e2e -DexternalSystemMode=real -Dchannel=UI -Denvironment=local";
            Path = ".";
            TestReportPath = "system-test\build\reports\tests\test\index.html";
            TestInstallCommands = $null; }

    )
}

# Export the configuration
return $Config
