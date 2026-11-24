---
name: pr-screenshots
description: Capture before and after screenshots of a Blade change and embed them in the PR description. Use every time a razorpay/blade pull request is opened or its description is written or edited, including via `gh pr create`, `/create-pr`, or a migration's Final Gate, and whenever someone asks to add screenshots, visuals, or a before/after comparison to a PR.
---

# PR Screenshots

Every Blade PR description has a **Before / After** section. Reviewers should see what changed without checking out the branch.

## When it applies

- **Visual change** (styles, tokens, layout, motion, new prop that renders differently, new component): real before and after images are required.
- **New component or new variant**: there is no "before". Put `N/A (new)` in the Before cell and show the after.
- **No visual change** (CI, types, tests, docs-only, build, refactor with identical output): keep the section and write one line, `No visual change: <reason>`. Never delete the section silently.

## Step 1: Pick the stories

Pick the 1 to 4 stories that show the change best. Prefer:

- the exact variant/state that changed (hover, focus, disabled, error, loading)
- a story that shows the change at a glance over the KitchenSink
- both light and dark theme if colours changed
- a small and large size if sizing changed

## Step 2: Capture "after"

Start local Storybook from the PR branch (`cd packages/blade && yarn start:web`, port is usually 9011) and open each story in iframe view so the Storybook chrome is hidden:

```
http://localhost:9011/iframe.html?id=components-<component>--<story>&viewMode=story
```

Use whichever browser tool is available (`npx agent-browser`, see the `verify-with-browser` skill; Playwright; or the built-in browser). Use a fixed viewport (for example 1280x800) and crop to the component when possible.

## Step 3: Capture "before"

Capture the same story, same viewport, same theme, from code without your change. In order of preference:

1. **Published Storybook** (latest release): `https://blade.razorpay.com/iframe.html?id=components-<component>--<story>&viewMode=story`. Good when the story existed before your change.
2. **Local master**: when master has unreleased changes in the same area, run Storybook from a worktree of `origin/master` (`git worktree add ../blade-before origin/master`) on another port.

If a story is new in this PR, use the closest existing story for "before", or mark it `N/A (new)`.

Motion or interaction changes: record a short GIF for each side instead of a still.

## Step 4: Name the files

Use only letters, digits, `.`, `_`, `-`. Pattern: `<component>-<story>-before.png` / `-after.png`, for example `button-neutral-before.png`.

## Step 5: Upload

```bash
.agents/skills/pr-screenshots/scripts/upload-screenshots.sh button-neutral-before.png button-neutral-after.png
```

This pushes the images to the `__ci_artifacts` branch (the one the review bot already uses), under `artifacts/pr-screenshots/<your-branch>/`, without touching your branch or its diff. It prints one URL per image, pinned to that commit so it never changes. Run it from the repo root, on the PR branch. Re-running adds images; it never removes earlier ones. If the push is rejected because someone else pushed at the same moment, run it again.

Do not commit screenshots into the PR branch itself.

Fallback if pushing is not possible: drag the images into the PR description in the GitHub web editor, which hosts them for you.

## Step 6: Embed in the PR body

Put this under `## Before / After` in the PR description (the PR template has the heading):

```markdown
## Before / After

| Story | Before | After |
| --- | --- | --- |
| Neutral, light | <img src="URL_BEFORE" width="360" /> | <img src="URL_AFTER" width="360" /> |
| Neutral, dark | <img src="URL_BEFORE" width="360" /> | <img src="URL_AFTER" width="360" /> |
```

Same width on both sides so they line up. Add one sentence under the table if the difference is subtle ("the border is now 1px lighter").

If the PR is already open, update it with `gh pr edit <number> --body-file <file>` after editing the body, and keep everything else in the body as it was.

## React Native changes

Take before/after screenshots from the iOS or Android simulator (the `verify-rn-migration` agent already captures them) and embed them the same way. Label the platform in the Story column.

## Before calling the PR done

- [ ] Body has a `## Before / After` section
- [ ] Every visual change has a matching before and after (or `N/A (new)`)
- [ ] Images load (open one URL)
- [ ] Non-visual PRs say `No visual change: <reason>`
