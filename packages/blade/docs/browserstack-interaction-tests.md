# BrowserStack Interaction Tests

Blade's Storybook interaction tests (`.test.stories.{ts,tsx}`) can be run against
real older browsers via [BrowserStack](https://www.browserstack.com/) + Playwright
CDP, without rewriting any interaction test code.

## How It Works

1. The existing Jest config (`test-runner-jest.config.js`) detects
   `BROWSERSTACK_USERNAME` / `BROWSERSTACK_ACCESS_KEY` and, when present, replaces
   the local Playwright browser launch with a **remote CDP connection** to a
   BrowserStack browser session.
2. **BrowserStack Local** creates a tunnel so the remote browser can reach the local
   Storybook static server at `127.0.0.1:9009`.
3. The existing `test-storybook` runner + Jest + `.test.stories.{ts,tsx}` files run
   unchanged — only the browser target changes.

## Prerequisites

### GitHub Secrets (for CI)

Add these as repository secrets (`Settings → Secrets and variables → Actions`):

| Secret | Description |
|--------|-------------|
| `BROWSERSTACK_USERNAME` | Your BrowserStack account username |
| `BROWSERSTACK_ACCESS_KEY` | Your BrowserStack access key |

### Local Setup (for manual runs)

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
# Optional overrides (defaults shown):
export BROWSERSTACK_OS="Windows"
export BROWSERSTACK_OS_VERSION="10"
export BROWSERSTACK_BROWSER="chrome"
export BROWSERSTACK_BROWSER_VERSION="83"

# Start BrowserStack Local in another terminal:
npx browserstack-local --key "$BROWSERSTACK_ACCESS_KEY" --local-identifier "local-dev"

# Build Storybook + serve + run interaction tests:
cd packages/blade
yarn test:react:interaction:browserstack:ci
```

## Running in CI

### Option 1: Manual Dispatch

Go to **Actions → Blade BrowserStack Interaction Tests → Run workflow** and choose
the browser, version, OS, and OS version.

### Option 2: PR Label

Add the label **`Run BrowserStack Interaction Tests`** to a PR. The workflow will
run against the matrix defined in the workflow file.

### Supported Browser Matrix (First PR)

| OS | Browser | Version |
|----|---------|---------|
| Windows 10 | Chrome | 83 |
| Windows 10 | Edge | 83 |

> These are the lowest commonly-available versions that BrowserStack Playwright
> CDP supports. The matrix can be expanded in follow-up PRs.

## npm Scripts

| Script | Purpose |
|--------|---------|
| `test:react:interaction:browserstack` | Run interaction tests via BrowserStack (assumes Storybook is already served) |
| `test:react:interaction:browserstack:ci` | Build Storybook, serve it, wait, run BrowserStack interaction tests, then shut down |
| `react:storybook:serve:test:browserstack` | Wait for Storybook to be ready, then run BrowserStack interaction tests |

All existing local/CI interaction test scripts remain unchanged.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BROWSERSTACK_USERNAME` | Yes | — | BrowserStack username |
| `BROWSERSTACK_ACCESS_KEY` | Yes | — | BrowserStack access key |
| `BROWSERSTACK_OS` | No | `Windows` | Target OS |
| `BROWSERSTACK_OS_VERSION` | No | `10` | Target OS version |
| `BROWSERSTACK_BROWSER` | No | `chrome` | Browser: `chrome`, `edge`, `firefox` |
| `BROWSERSTACK_BROWSER_VERSION` | No | `latest` | Browser version |
| `BROWSERSTACK_LOCAL_IDENTIFIER` | No | — | Unique Local tunnel identifier (set by CI; required for parallel matrix jobs) |
| `GITHUB_RUN_ID` | No | — | Used for BrowserStack build name |

## Limitations & Future Work

### Why Not Safari or Old Firefox?

BrowserStack's Playwright CDP integration does **not** reliably support Safari or
very old Firefox versions. Playwright itself only supports Chromium, Firefox, and
WebKit — and BrowserStack's CDP tunnel currently works best with Chromium-based
browsers (Chrome, Edge).

### Selenium/WebDriver Fallback (Follow-up)

For true legacy Safari or old Firefox coverage that Playwright cannot drive, a
small Selenium/WebDriver fallback may be needed. This would:

- Cover a **curated subset** of critical stories/interactions (not the full suite).
- Use Selenium Grid via BrowserStack (not Playwright).
- Be a **separate workflow** so it doesn't affect the Playwright-based tests.

This first PR intentionally avoids Selenium to keep the scope minimal and prove
that BrowserStack + existing Storybook play-function tests work on supported
older Chromium targets.

### Files Added/Modified

| File | Change |
|------|--------|
| `packages/blade/test-runner-jest.config.js` | Modified — adds BrowserStack CDP mode, gated on `BROWSERSTACK_USERNAME`/`BROWSERSTACK_ACCESS_KEY` |
| `packages/blade/package.json` | Added 3 new scripts (existing scripts untouched) |
| `.github/workflows/blade-browserstack-interaction-tests.yml` | New — opt-in CI workflow |
| `packages/blade/docs/browserstack-interaction-tests.md` | This document |
