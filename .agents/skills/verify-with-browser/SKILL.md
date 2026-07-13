---
name: verify-with-browser
description: Visually verify component changes in Storybook using the agent-browser CLI tool
---

# Verify with Browser

Visually verify component changes in Storybook using the agent-browser CLI tool.

## Usage

```
/verify-with-browser <ComponentName>
```

**Example:**

```
/verify-with-browser Popover
/verify-with-browser Button
```

## Instructions

### Step 1: Prerequisites

- Ensure Storybook is running (check terminals folder or start with `yarn start:web` in `packages/blade` or `packages/blade-svelte` depending on the package you are verifying)
- Call the globally installed `agent-browser` binary directly — do NOT use `npx agent-browser`.
  - `agent-browser` is installed globally (e.g. `/opt/homebrew/bin/agent-browser`); verify with `which agent-browser`.
  - Going through `npx` adds npm resolution overhead on every call and can churn/restart the daemon between commands, which surfaces as a blank/refreshing page. Calling the binary directly keeps a single persistent daemon and session.
- Run **headed** (visible browser window) by passing `--headed` to `agent-browser open`, so you can watch the flow. The daemon remembers the mode for the session — to switch modes, `agent-browser close --all` first, then re-`open` with (or without) `--headed`.
- Agent-browser will automatically start a daemon in the background on first use

### Step 2: Available Agent Browser Commands

Use the Shell tool to run these commands (call `agent-browser` directly, not via `npx`):

- `agent-browser --help` - Show help for agent-browser commands
- `agent-browser open <url>` - Navigate to a URL
- `agent-browser snapshot` - Get current page structure with element refs
- `agent-browser snapshot -i` - Interactive snapshot with clickable elements
- `agent-browser screenshot <filename>` - Capture screenshot and save to file
- `agent-browser click @<ref>` - Click element using ref from snapshot
- `agent-browser type @<ref> "text"` - Type text into element
- `agent-browser close` - Close browser session

### Step 3: Navigate to Storybook

> Note: the localhost port number might vary. Find the right port where storybook is running.

> Pass `--headed` to `open` so the browser window is visible while the flow runs (drop it, or set `AGENT_BROWSER_HEADED=0`, only if you want a headless/background run).

**Option 1: Full Storybook View**

```bash
agent-browser open "http://localhost:9011/?path=/story/components-<component>--<story>" --headed
```

**Option 2: Iframe View (Recommended for Screenshots)**

```bash
agent-browser open "http://localhost:9011/iframe.html?id=components-<component>--<story>&viewMode=story" --headed
```

**Why use iframe view?**

- Cleaner screenshots without Storybook UI
- Shows only the component being tested
- Better for visual comparison with Figma
- Smaller file size and faster loading

### Step 4: Take Screenshots

1. **Navigate to the story** (use iframe URL for best results)
2. **Get snapshot to verify page loaded**:
   ```bash
   agent-browser snapshot
   ```
3. **Take a screenshot**:
   ```bash
   agent-browser screenshot <component-name>-<story>.png
   ```
4. **Compare with Figma design** - Verify all visual changes match

### Step 5: Example Workflow

```bash
# Open the component story in iframe view (--headed shows the browser window)
agent-browser open "http://localhost:9011/iframe.html?id=components-popover--uncontrolled&viewMode=story" --headed

# Get snapshot to see page structure and verify loaded
agent-browser snapshot

# Take screenshot for visual verification
agent-browser screenshot popover-uncontrolled.png

# If interactive testing needed, get snapshot with refs
agent-browser snapshot -i
# Output will show elements like:
# - button "Open Popover" [ref=e1]
# - text "Click to toggle" [ref=e2]

# Click elements using refs
agent-browser click @e1

# Take another screenshot of the active state
agent-browser screenshot popover-open.png

# Close browser when done
agent-browser close
```

### Step 6: Verification Checklist

Verify the following match the Figma design:

- ✅ Padding and spacing match design tokens
- ✅ Colors and borders are correct
- ✅ Typography sizes are accurate
- ✅ Shadows and effects are applied
- ✅ Component behavior works as expected

## Storybook URL Patterns

Storybook runs on `http://localhost:9011/` (port may vary, check terminals).

**URL Formats:**

- **Full Storybook**: `http://localhost:9011/?path=/story/components-<component>--<story-name>`
- **Iframe (Clean View)**: `http://localhost:9011/iframe.html?id=components-<component>--<story-name>&viewMode=story`
- **Docs Page**: `http://localhost:9011/?path=/docs/components-<component>--docs`

**Story Name Conversion:**

- Storybook story names use kebab-case
- "Uncontrolled" → `uncontrolled`
- "Product Usecase: Dark Mode" → `product-use-case-2`
- Check the actual story names in the component's `.stories.tsx` file

## Tips for Testing

- **Use "Uncontrolled" or "Default" stories** - These often show the component in its open/active state
- **Test multiple variants** - Check different placements, sizes, or states if applicable
- **Check responsive behavior** - Test on different viewport sizes if relevant
- **Verify interactions** - Use `agent-browser click` and `agent-browser type` to test interactive states
- **Compare screenshots** - Save screenshots with descriptive names for easy comparison with Figma designs
