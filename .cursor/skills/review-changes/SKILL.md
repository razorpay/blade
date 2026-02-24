---
name: review-changes
description: Review blade PRs by fetching diff, checking CI status, and getting Storybook URL. Use when reviewing PRs, checking PR status, or getting preview links for razorpay/blade PRs.
disable-model-invocation: true
---

# Review Blade PR

Review PRs in the razorpay/blade repository by fetching the diff, checking CI status, and extracting the Storybook preview URL.

## Arguments / Clarifications (Use Cursor's AskQuestion tool to get clarifications)

- PR: Link / Number of the PR to review
- ShouldReviewUI: Whether UI should be reviewed or not. Get it clarified if not mentioned.
- ShouldRunHeadedBrowser: Whether to run the browser in headed mode or not. Get it clarified if not mentioned.

## Prerequisites

- GitHub CLI (`gh`) must be installed and authenticated
- `agent-browser` command must be installed (if ShouldReviewUI is true)

## Guidelines

- Avoid printing intermediate commentary; only output the final review in the main chat

## Steps (Create checklist for each step)

### 1. Fetch the PR Diff and CI Status in Main Agent

```
https://patch-diff.githubusercontent.com/raw/razorpay/blade/pull/{PR_NUMBER}.diff
```

(Ignore the lock file changes from diff)

Fetch status checks once and extract both CI status and Storybook URL:

```bash
gh pr checks {PR_NUMBER} --repo razorpay/blade
```

#### If checks are failing / skipped, get the details from the checks on why they are failing / skipped

Use the following command (replace `{JOB_ID}` with the job id from the previous `gh pr checks` output):

```bash
gh run view --job {JOB_ID} --repo razorpay/blade
```

### 2. UI Review the Changes (if ShouldReviewUI is true)

- Using agent-browser (Do NOT use Playwright MCP), open the Storybook URL (returned by earlier subagent)
  - `agent-browser --help` on docs on how to use it
- Determine which URL to open based on the PR changes
- `agent-browser close` to close any earlier opened browser instances
- Open the URL with the agent-browser and test the functionality of the changes
  ```sh
  agent-browser open {storybook_url} --headed (if ShouldRunHeadedBrowser is true)
  ```
- Close the agent-browser at the end with `agent-browser close`

#### How to Find Changes

- You can open the story outside iframe using the `iframe.html` url of storybook
  - E.g. `https://61c19ee8d3d282003ac1d81c-rzqbxanzgn.chromatic.com/?path=/story/components-datepicker--date-picker-presets-with-display-format-compact` this story can be opened as an iframe in `https://61c19ee8d3d282003ac1d81c-rzqbxanzgn.chromatic.com/iframe.html?args=&id=components-datepicker--date-picker-presets-with-display-format-compact&viewMode=story`
  - If iframe is not working, open the storybook url directly and find the story in the sidebar
- If changes are in svelte components, check the svelte version of storybook on `{storybook_base_url}/svelte/` route

Report the flows / features that were tested, if they are working as expected or not, and the issues found.

### 3. Code Review the Changes

Analyze the diff for:

- Potential bugs or logic errors
- TypeScript/type safety issues
- Missing tests for new functionality
- Accessibility concerns
- Performance implications
- API Breaking changes
- Do not review the changes in the codebase, only review the changes in the diff.

## Output Format

The subagent should return all the gathered information. Then in the main chat strictly following the output format mentioned in references/output-format.md

- [Output Format](./references/output-format.md)
