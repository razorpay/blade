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

- Ensure Storybook is running (check terminals folder or start with `yarn react:storybook`)
- Use `npx agent-browser` to run commands (no installation required)
- Agent-browser will automatically start a daemon in the background on first use

### Step 2: Available Agent Browser Commands

Use Shell tool to run these commands with `npx`:

- `npx agent-browser open <url>` - Navigate to a URL
- `npx agent-browser snapshot` - Get current page structure with element refs
- `npx agent-browser snapshot -i` - Interactive snapshot with clickable elements
- `npx agent-browser screenshot <filename>` - Capture screenshot and save to file
- `npx agent-browser click @<ref>` - Click element using ref from snapshot
- `npx agent-browser type @<ref> "text"` - Type text into element
- `npx agent-browser close` - Close browser session

### Step 3: Navigate to Storybook

**Option 1: Full Storybook View**

```bash
npx agent-browser open "http://localhost:9011/?path=/story/components-<component>--<story>"
```

**Option 2: Iframe View (Recommended for Screenshots)**

```bash
npx agent-browser open "http://localhost:9011/iframe.html?id=components-<component>--<story>&viewMode=story"
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
   npx agent-browser snapshot
   ```
3. **Take a screenshot**:
   ```bash
   npx agent-browser screenshot <component-name>-<story>.png
   ```
4. **Compare with Figma design** - Verify all visual changes match

### Step 5: Example Workflow

```bash
# Open the component story in iframe view
npx agent-browser open "http://localhost:9011/iframe.html?id=components-popover--uncontrolled&viewMode=story"

# Get snapshot to see page structure and verify loaded
npx agent-browser snapshot

# Take screenshot for visual verification
npx agent-browser screenshot popover-uncontrolled.png

# If interactive testing needed, get snapshot with refs
npx agent-browser snapshot -i
# Output will show elements like:
# - button "Open Popover" [ref=e1]
# - text "Click to toggle" [ref=e2]

# Click elements using refs
npx agent-browser click @e1

# Take another screenshot of the active state
npx agent-browser screenshot popover-open.png

# Close browser when done
npx agent-browser close
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
- **Verify interactions** - Use `npx agent-browser click` and `npx agent-browser type` to test interactive states
- **Compare screenshots** - Save screenshots with descriptive names for easy comparison with Figma designs
