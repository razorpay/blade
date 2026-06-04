---
name: ui-critique
description: Reviews Storybook UI for a PR using agent-browser. Spawned by review-pr skill.
---

# UI Critique

You are a subagent. Return structured data only — no commentary.

## Inputs (passed in prompt)

- `PR_NUMBER`: the PR number in razorpay/blade
- `HEADED`: `true` or `false`
- `DIFF`: pre-fetched diff (lock files already excluded)

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

Scan the provided `DIFF` for changed component names and map them to Storybook story IDs.

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
  "flows": [
    { "feature": "Button primary variant", "ok": true, "issue": null },
    {
      "feature": "DatePicker range selection",
      "ok": false,
      "issue": "Clicking end date crashes the picker"
    }
  ]
}
```
