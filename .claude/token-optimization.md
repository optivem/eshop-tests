# Token Optimization Guide

## Priority 1 — Conversation Hygiene (biggest impact)

- **Start fresh conversations for each task.** Context accumulates with every message. Once a task is committed, start a new conversation for the next one. A single long conversation can use 10x the tokens of several short ones.
- **Use `/compact` proactively.** Don't wait until context runs out. Compact after every 2-3 commits or when switching focus within a conversation.
- **Be direct and specific.** "Rename X to Y and commit" is one round-trip. "Maybe we could rename this?" → "yes" → "should I commit?" → "yes" is four. Each round-trip costs context.
- **Batch related requests.** "Rename A, B, C and commit" is cheaper than three separate requests.

## Priority 2 — CLAUDE.md and @includes

- **Keep root CLAUDE.md minimal.** Only universal rules (Git Push, Git Safety). All ATDD/architecture docs are now in agent definitions — don't add them back.
- **Avoid large @includes for niche docs.** If a doc is only relevant to one workflow, put it in the agent that uses it, not in CLAUDE.md.
- **Review CLAUDE.md periodically.** Every line loads into every conversation. Ask: "Does every conversation need this?"

## Priority 3 — IDE Context

- **Close IDE tabs you're not working on.** Open files are sent as context with each message. If you have 10 tabs open, that's 10 file paths (and sometimes selections) sent every turn.
- **Don't highlight code unless relevant.** IDE selections are included in context. If you're typing a message, deselect any highlighted code that isn't related to your question.

## Priority 4 — Agent Configuration

- **Use `sonnet` for simple agents.** Agents that do straightforward work (release-agent, story-agent) don't need `opus`. Sonnet is faster and uses fewer tokens.
- **Keep agent prompts concise.** Agent definitions are loaded when spawned. Shorter prompts = less overhead per agent call.

## Priority 5 — Memory Management

- **Keep MEMORY.md under 200 lines.** Lines beyond 200 are truncated but still count toward the load.
- **Remove stale memories.** Memories about completed projects or outdated decisions waste context every conversation.
- **Don't duplicate what's in code or git.** Memory should store non-obvious context only — not file paths, architecture, or recent changes.

## Priority 6 — Request Patterns

- **Say "yes" or "do it" instead of "maybe..."** Ambiguity triggers exploration, clarification questions, and extra tool calls.
- **Provide file paths when you know them.** "Edit line 42 of src/foo.ts" is cheaper than "find where we define foo and change it."
- **Use slash commands.** `/commit` is cheaper than explaining what you want committed.

## Anti-Patterns to Avoid

- Keeping one conversation open all day across unrelated tasks
- Opening many files in IDE "just in case"
- Asking Claude to explore before giving specific instructions
- Saying "look at everything in this directory" when you know which file matters
- Re-explaining context that's already in CLAUDE.md or memory
