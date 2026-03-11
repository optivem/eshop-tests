Pick the top story from the GitHub project board and implement it using the multi-agent ATDD workflow defined in `docs/prompts/atdd/workflow.md`.

Input: $ARGUMENTS

**Autonomous mode:** if `--autonomous` is present, pass it through to `/implement-story` so all human approval touchpoints are skipped.

## Steps

1. Launch **manager-agent**. It will:
   - Read the GitHub project board
   - Pick the top card in the Ready column
   - Move it to In Progress
   - Return the issue number

2. Pass the issue number (and `--autonomous` if provided) to `/implement-story` and run the full pipeline to completion.

## Rules

- If the Ready column is empty, stop and report it to the user.
- If the pipeline is blocked at any point, stop and present the blocker to the user before continuing — even in autonomous mode.
