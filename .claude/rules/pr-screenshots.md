# PR Screenshots: Before / After Is Required

Every pull request opened on razorpay/blade must have a `## Before / After` section in its description.

- Before running `gh pr create`, `/create-pr`, or any step that opens or rewrites a Blade PR description, load the **`pr-screenshots`** skill and follow it.
- Visual changes: embed real before and after screenshots (or GIFs for motion) of the same stories, side by side.
- New components or variants: `N/A (new)` for before, real after.
- No visual change: keep the section and write `No visual change: <reason>`.
- If a PR was opened without the section, add it with `gh pr edit` before reporting the PR as done.
- Do not ask the user for the screenshots first. Capture them yourself; ask only if Storybook cannot be run.
