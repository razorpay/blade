# UI Critique

Visually verify changed components in Storybook using `agent-browser`.

## Steps

### 1. Get the Storybook URL

```bash
gh pr checks {PR_NUMBER} --repo razorpay/blade --json name,description,link --jq '.[] | select(.name == "Storybook Publish: blade") | .link'
```

### 2. Determine stories to test

Scan the diff for changed component names and map them to Storybook story IDs.

- Open stories via iframe: `{STORYBOOK_URL}/iframe.html?args=&id={story-id}&viewMode=story`
- If svelte files changed, also check `{STORYBOOK_URL}/svelte/`

### 3. Open and test each story

```bash
agent-browser close           # close any existing session first
agent-browser open {url}      # add --headed if running headed
```

Test the main flows and interactions for each changed component. Close when done:

```bash
agent-browser close
```

## What to check

For each story, verify:

- Visual correctness of the changed variant/state
- Hover, focus, active, and disabled states where applicable
- Dark mode if the change touches theming
- Responsive behaviour if the change affects layout
