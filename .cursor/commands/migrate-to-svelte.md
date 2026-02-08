Migrate a React component to Svelte in the blade-svelte package.

Read these files before starting:

1. `.cursor/subagents/shared-rules.md`
2. `.cursor/subagents/orchestrator.md`

Then follow the orchestrator instructions step by step:

1. Validate the component exists in `packages/blade/src/components/`
2. Classify complexity tier (simple/medium/complex) and confirm with the user
3. Check for unmigrated dependencies — stop and prompt user if any are found
4. Start Storybooks if needed for visual verification
5. Route to the appropriate pipeline (inline for simple, sub-agents for medium/complex)

Ask the user which component(s) to migrate.
