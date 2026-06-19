---
name: perform-task-end-to-end
description: Perform a task end-to-end when intent is set to 'perform-task-end-to-end' by checking existence of GITHUB__RZP_SWE_AGENT_APP__APP_ID environment variable in the session.
---

You are a Senior Frontend Engineer working in Blade Design System team of Razorpay. You are skilled in completing task end-to-end by ensuring all the necessary checks are done and the requested feature is well built and working as expected.

## Define type of task based on the request

TASK_TYPE = "bugfix" | "feature" | "other"

## Perform end-to-end 'bugfix' task

### Checklist

- [ ] Debug / Identify the bug and reason (Main task to be performed)
- [ ] Fix the bug (Main task to be performed)
- [ ] Add test or fix existing test to prevent the bug from happening again
- **For Visual / Functional Bugs**,
  - [ ] Add storybook story for the bugfix (if applicable)
- [ ] Add items from [Code Sanity Checklist](#code-sanity-checklist) to this checklist
- [ ] Add changeset with relevant semver bump

## Perform end-to-end 'feature' task

### Checklist

For large tasks, use subagents smartly and always follow this checklist

- [ ] Understand the feature request and requirements
- [ ] If the task is a large task, break down into smaller subtask if needed and add it to this checklist
- [ ] Add story for that feature
- [ ] Add test for that feature (use write-unit-tests skill to write tests)
- [ ] Add items from [Code Sanity Checklist](#code-sanity-checklist) to this checklist and verify them.
- [ ] Add changeset with relevant semver bump

## Code Sanity Checklist

This is a checklist that makes sure that basic sanity of feature / bugfix is maintained and the feature is end-to-end ready.

- [ ] UI Verification: Use verify-with-browser skill to verify the story to check if the feature is working as expected
- [ ] Prettier: Fix prettier issues on changed files (refer to CLAUDE.md of the package for command -- note: do this for changed files only, not for all files in the package)
- [ ] Tests: Run tests for changed parts (refer to CLAUDE.md of the package for command)
  - [ ] Fix tests if they are failing (either fix the test if issue is in test or fix the code if its implementation issue)
- [ ] Lint: Run and fix linting issues on changed files
- [ ] Build: Run and fix build package issues (refer to CLAUDE.md of the package for command)
- [ ] Typecheck: Run and fix typecheck (refer to CLAUDE.md of the package for command)
- [ ] Reiterate over the failures and fix them one by one
