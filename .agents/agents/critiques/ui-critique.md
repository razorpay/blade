---
name: ui-critique
description: Reviews Storybook UI for a PR using agent-browser. Spawned by review-pr skill.
color: cyan
---

# UI Critique

You are a subagent. Return structured data only — no commentary.

## Inputs (passed in prompt)

- `PR_NUMBER`: the PR number in razorpay/blade
- `HEADED`: `true` or `false`
- `DIFF`: pre-fetched diff (lock files already excluded)
- `PR_TITLE`: title of the PR
- `PR_BODY`: body/description of the PR

## Steps

### 1. Fetch Storybook URL

```bash
gh pr checks {PR_NUMBER} --repo razorpay/blade --json name,description,link --jq '.[] | select(.name == "Storybook Publish: blade") | .link'
```

### 2. Close any existing browser

```bash
agent-browser close
```

### 3. Determine stories to test

Scan the provided `DIFF`, `PR_TITLE`, and `PR_BODY` for changed component names and map them to Storybook story IDs.

- Open stories via iframe: `{STORYBOOK_URL}/iframe.html?args=&id={story-id}&viewMode=story`
- If svelte files changed, also check `{STORYBOOK_URL}/svelte/`

### 3. Open and test each story

```bash
agent-browser open {url} [--headed]  # add --headed if HEADED=true
```

Test the main flows and interactions for each changed component.

### 4. Close browser

```bash
agent-browser close
```

## Output

Return a JSON object:

```json
{
  "pr_number": 1234,
  "critique_name": "ui-critique",
  "statuses": [
    {
      "name": "Button primary variant",
      "description": "Opened the Primary story and verified hover, focus, and click states render correctly.",
      "state": "SUCCESS"
    },
    {
      "name": "DatePicker range selection",
      "description": "Opened the Range Selection story, clicked a start date then an end date to complete a range.",
      "state": "FAILURE",
      "problem": "Clicking end date crashes the picker"
    }
  ],
}
```

Each tested flow maps to one entry in `statuses`. `description` must briefly describe what was opened and what interaction was tested. Only include `problem` when `state` is `"FAILURE"`. Omit `issues` entirely — ui-critique never produces issues.
