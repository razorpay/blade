# Update Blade Component

Update an existing Blade Design System component (web only) using Figma designs and knowledgebase documentation.

## Inputs Required

After typing `/update-blade-component`, provide:

1. **Component Name** - e.g., `Popover`, `Button`, `Modal`
2. **Figma URL** - e.g., `https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=115756-259386`

## Instructions

You are a Design System developer at Razorpay. Follow these steps to update the Blade component (web implementation only).

### Step 1: Gather Component Information

1. **Read the knowledgebase documentation**:

   - Path: `packages/blade-mcp/knowledgebase/components/<ComponentName>.md`
   - Contains: TypeScript types, props, and usage examples

2. **Read the existing component implementation**:
   - Path: `packages/blade/src/components/<ComponentName>/`
   - Key files: `types.ts`, `<ComponentName>.web.tsx`, `index.ts`, `constants.ts`
   - **Skip native files** - Only update `.web.tsx` files

### Step 2: Get Figma Design Context

Parse the provided Figma URL to extract:

- `fileKey`: The unique file identifier from the URL path
- `nodeId`: From `node-id=` param, convert `-` to `:` (e.g., `115756-259386` → `115756:259386`)

Use the **Figma MCP tools** to get complete design information:

#### 2.1 Get Design Context (Component Structure)

```
Tool: user-Figma → get_design_context
Arguments:
  - fileKey: "<extracted-file-key>"
  - nodeId: "<extracted-node-id>"
  - clientLanguages: "typescript"
  - clientFrameworks: "react"
  - disableCodeConnect: true
```

This returns:

- Component hierarchy and structure
- CSS/styling classes (Tailwind format)
- Component descriptions and documentation links
- Asset URLs for images/icons

#### 2.2 Get Variable Definitions (Design Tokens)

```
Tool: user-Figma → get_variable_defs
Arguments:
  - fileKey: "<extracted-file-key>"
  - nodeId: "<extracted-node-id>"
  - clientLanguages: "typescript"
  - clientFrameworks: "react"
```

This returns a JSON object with all design tokens used in the component.
|

#### 2.3 Get Screenshot (Visual Reference)

```
Tool: user-Figma → get_screenshot
Arguments:
  - fileKey: "<extracted-file-key>"
  - nodeId: "<extracted-node-id>"
```

This returns a visual screenshot of the component for reference.

### Step 3: Analyze and Plan Changes

Compare the Figma design with the current implementation:

1. **Compare design tokens**: Match Figma variable values with existing Blade constants
2. **Identify new props or variants**: Check if new configurations are needed
3. **Check types**: Determine if TypeScript types need updating
4. **Plan implementation**: Focus on web only (`.web.tsx` files)
5. **Plan documentation updates**: If API changes, update knowledgebase docs

### Step 4: Make Changes

Follow this order:

1. **Update types** (`types.ts`) - Add new props, update existing types
2. **Update constants** (`constants.ts`) - Add new defaults or constants
3. **Update web implementation** (`*.web.tsx`) - Implement the changes
4. **Update exports** (`index.ts`) - Export new types/components if needed
5. **Update knowledgebase** (`packages/blade-mcp/knowledgebase/components/<ComponentName>.md`)
6. **Update stories** (`*.stories.tsx`) - Add Storybook examples for new features
7. **Check for linter errors** using `ReadLints` tool on modified files

### Step 5: Verify Changes with Agent Browser

Use `agent-browser` CLI tool to visually verify your changes in Storybook.

#### 5.1 Prerequisites

- Ensure Storybook is running (check terminals folder or start with `yarn react:storybook`)
- Use `npx agent-browser` to run commands (no installation required)
- Agent-browser will automatically start a daemon in the background on first use

#### 5.2 Available Agent Browser Commands

Use Shell tool to run these commands with `npx`:

- `npx agent-browser open <url>` - Navigate to a URL
- `npx agent-browser snapshot` - Get current page structure with element refs
- `npx agent-browser snapshot -i` - Interactive snapshot with clickable elements
- `npx agent-browser screenshot <filename>` - Capture screenshot and save to file
- `npx agent-browser click @<ref>` - Click element using ref from snapshot
- `npx agent-browser type @<ref> "text"` - Type text into element
- `npx agent-browser close` - Close browser session

#### 5.3 Navigate to Storybook

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

#### 5.4 Take Screenshots

1. **Navigate to the story** (use iframe URL for best results)
2. **Get snapshot to verify page loaded**:
   ```bash
   npx agent-browser snapshot
   ```
3. **Take a screenshot**:
   ```bash
   npx agent-browser screenshot storybook-component.png
   ```
4. **Compare with Figma design** - Verify all visual changes match

#### 5.5 Example Workflow

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

**Verify:**
- Padding and spacing match design tokens
- Colors and borders are correct
- Typography sizes are accurate
- Shadows and effects are applied
- Component behavior works as expected

#### 5.6 Tips for Testing

- **Use "Uncontrolled" or "Default" stories** - These often show the component in its open/active state
- **Test multiple variants** - Check different placements, sizes, or states if applicable
- **Check responsive behavior** - Test on different viewport sizes if relevant
- **Verify interactions** - Use `npx agent-browser click` and `npx agent-browser type` to test interactive states
- **Compare screenshots** - Save screenshots with descriptive names for easy comparison with Figma designs

### Step 6: Run Tests

Run the test suite to ensure your changes don't break existing functionality.

#### 6.1 Run Unit Tests

```bash
# Run all tests (web + native)
yarn test

# Or run only web tests
cd packages/blade && yarn test:react

# Or run only native tests  
cd packages/blade && yarn test:react-native
```

Tests run in sharded mode in CI. Locally they run all together.

#### 6.2 Fix Failing Tests

If tests fail after your changes:

1. **Review the failure** - Check if it's a legitimate issue or needs updating
2. **Update snapshots** - If visual/structural changes are intentional:
   ```bash
   cd packages/blade && yarn test:react --updateSnapshot
   ```
3. **Fix test logic** - Update test files in `__tests__/` folder if needed
4. **Re-run tests** - Verify all tests pass before proceeding

#### 6.3 Run Linting and Type Checks

```bash
# Run lint checks
yarn lint:blade

# Run TypeScript checks  
cd packages/blade && yarn typecheck
```

Fix any linter errors or type issues before creating the PR.

### Step 7: Create Pull Request

Once all tests pass and linting is clean, create a PR using the GitHub CLI.

#### 7.1 Create a New Branch

```bash
# Create and checkout a new branch from spark
git checkout spark
git pull origin spark
git checkout -b feat/update-<component-name>
```

#### 7.2 Commit Your Changes

```bash
# Stage all changes
git add .

# Commit with a conventional commit message
git commit -m "feat(ComponentName): update component with new design"
```

**Important:** Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature or enhancement
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build/tooling changes

Examples:
- `feat(Popover): add new placement options`
- `fix(Button): correct padding in small variant`
- `docs(Tooltip): update knowledgebase with new props`

#### 7.3 Push and Create PR

```bash
# Push branch to remote
git push -u origin HEAD

# Create PR using gh cli with spark as base
gh pr create --base spark --title "feat(ComponentName): brief description" --body "$(cat <<'EOF'
## Summary
- Updated ComponentName with latest Figma designs
- Added/Modified [list specific changes]

## Changes
- Updated design tokens for spacing/colors
- Added new props: [list new props if any]
- Updated knowledgebase documentation
- Updated stories

## Visual Verification
[Add screenshots from Storybook if helpful]

## Testing
- ✅ All unit tests passing
- ✅ Visual verification in Storybook
- ✅ Linting and type checks passing

## Related
Figma: [link to Figma design]
EOF
)"
```

**PR Title Requirements:**
- Must follow Conventional Commits specification
- Will be checked by `blade-pr-title-check` GitHub action
- Format: `type(scope): description`
- Example: `feat(Popover): update design tokens and add new placement`

#### 7.4 Verify PR Checks

After creating the PR, verify:
- ✅ PR title check passes
- ✅ Lint and validation checks pass
- ✅ Unit tests pass
- ✅ Type checks pass

If any checks fail, push fixes to the same branch to update the PR.

## Component File Structure

```
packages/blade/src/components/<ComponentName>/
├── __tests__/
├── _decisions/
│   └── decisions.md
├── constants.ts
├── index.ts
├── <ComponentName>.native.tsx   ← IGNORE (native)
├── <ComponentName>.stories.tsx
├── <ComponentName>.web.tsx      ← UPDATE THIS
└── types.ts
```

## Storybook URL Patterns

Storybook runs on `http://localhost:9011/` (port may vary, check terminals).

**URL Formats:**

- **Full Storybook**: `http://localhost:9011/?path=/story/components-<component>--<story-name>`
- **Iframe (Clean View)**: `http://localhost:9011/iframe.html?id=components-<component>--<story-name>&viewMode=story`
- **Docs Page**: `http://localhost:9011/?path=/docs/components-<component>--docs`

**Example URLs:**

- Popover Default: `http://localhost:9011/?path=/story/components-popover--default`
- Popover Iframe: `http://localhost:9011/iframe.html?id=components-popover--uncontrolled&viewMode=story`
- Button Docs: `http://localhost:9011/?path=/docs/components-button--docs`

**Story Name Conversion:**

- Storybook story names use kebab-case
- "Uncontrolled" → `uncontrolled`
- "Product Usecase: Dark Mode" → `product-use-case-2`
- Check the actual story names in the component's `.stories.tsx` file

## Guidelines

- **Web only**: Only update `.web.tsx` files, ignore `.native.tsx`
- **Follow existing patterns**: Study similar components for consistency
- **Maintain backward compatibility**: Don't remove existing props without deprecation
- **Keep knowledgebase in sync**: Always update the documentation
- **Use design tokens**: Use theme tokens instead of hardcoded values
- **Test with agent-browser**: Always verify changes visually in Storybook using `npx agent-browser`
  - Use iframe URLs for cleaner screenshots
  - Take screenshots for verification (`npx agent-browser screenshot <filename>`)
  - Compare with Figma design reference
  - Test interactions using refs from snapshots
