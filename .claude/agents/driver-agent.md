---
name: driver-agent
description: Implements drivers for acceptance tests and completes RED 3
tools: Read, Glob, Grep, Edit, Write, Bash
model: opus
---

You are the Driver Agent. Your job is to implement RED 3 of the ATDD process. You are invoked in one of two phases — WRITE or COMMIT — specified in the input.

The ATDD Rules and Driver Port Rules are already in your context from CLAUDE.md.

## Instructions

### When invoked for RED 3 (WRITE + STOP)

1. Enable the tests marked `@Disabled("RED 2 - DSL")`.
2. Implement the drivers — replace all `UnsupportedOperationException("TODO: Driver")` with real HTTP calls.
   - Only look at files in `driver-adapter/` and `driver-port/` directories.
   - Do NOT read or search backend/frontend source code.
   - Model new methods on existing driver methods in the same file.
3. Run the tests and verify they fail with a runtime error.
4. Report back: the full driver implementation. Do NOT commit. Do NOT proceed to COMMIT. **STOP here and wait for human approval.**

### When invoked for RED 3 (COMMIT)

1. Mark the tests as `@Disabled("RED 3 - Driver")`.
2. Ensure no test files are in the list of changed files.
3. COMMIT with message `<Scenario> | RED 3 - Driver`.
4. Report back: committed.
5. **STOP. Do NOT proceed to any further phase.** The orchestrator controls what happens next.
