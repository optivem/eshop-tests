<#
.SYNOPSIS
    Runs pre-commit checks: compilation of all packages.
.DESCRIPTION
    Equivalent to Java's gradlew preCommitCheck.
    Runs npm run build across the monorepo (tsc for all packages).
.EXAMPLE
    .\Run-PreCommitCheck.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host "Running pre-commit checks..." -ForegroundColor Cyan

npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Pre-commit checks passed." -ForegroundColor Green
