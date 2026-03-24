<#
.SYNOPSIS
    Runs pre-commit checks: auto-fixes formatting, then runs format/lint/compilation checks.
.DESCRIPTION
    Equivalent to the gradlew installPreCommitHook pre-commit hook.
    Runs spotlessApply to auto-fix formatting, then preCommitCheck (spotlessCheck, sonarlint, compile).
.EXAMPLE
    .\Run-PreCommitCheck.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host "Running pre-commit checks..." -ForegroundColor Cyan

./gradlew spotlessApply
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

./gradlew preCommitCheck
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Pre-commit checks passed." -ForegroundColor Green
