---
name: blade-figma-sync
description: Verify and sync Blade Design System components with Figma designs. Use when user provides a Figma link to check component styles, design tokens, and update code to match Figma specs. Supports comparing old vs new designs using Figma URLs, screenshots, or current code. Triggers on Figma URLs for Blade components (e.g., figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL), requests to verify component styles against Figma, sync design tokens, compare Figma versions, or update test snapshots after Figma changes.
---

# Blade Figma Sync

Verify Blade Design System components against Figma designs and sync code/styles/tests.

**Input Requirements:**
- **New Figma URL** (REQUIRED) - The updated/target Figma design
- **Old Design** (OPTIONAL) - Can be provided as:
  - Screenshot of old design
  - Old Figma URL
  - Nothing (will compare against current code implementation)

**Three workflows available:**
1. **New Figma Only** - Compare new Figma against current code implementation
2. **Screenshot Comparison** - Compare new Figma against screenshot of old design
3. **Figma-to-Figma Diff** - Compare two Figma versions to identify changes

## Workflow

### Step 1: Parse Input and Determine Workflow

**Identify what the user provided:**

| Input Provided | Workflow to Use |
|----------------|-----------------|
| New Figma URL only | Compare against current code |
| New Figma URL + Screenshot of old design | Screenshot comparison workflow |
| New Figma URL + Old Figma URL | Figma-to-Figma diff workflow |

**Extract from user request:**
- **New Figma URL** (REQUIRED): e.g., `https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300`
- **Old design reference** (OPTIONAL): Screenshot image path OR old Figma URL
- **Storybook URL** (optional): e.g., `http://localhost:9009/?path=/story/components-kitchensink-link--link`
- **Component name**: Infer from Figma node or Storybook path

**From Figma URL, extract:**
- `fileKey`: The ID after `/design/` (e.g., `jubmQL9Z8V7881ayUD95ps`)
- `nodeId`: The `node-id` parameter, replacing `-` with `:` (e.g., `59519-143300` → `59519:143300`)

### Step 2: Fetch Design Information

**Fetch these in PARALLEL for efficiency:**

1. **New Figma design context** (REQUIRED)
2. **New Figma variable definitions** (REQUIRED)
3. **Old design screenshot** (if provided as image - use Read tool)
4. **Current component code** (use Read/Glob tools)

```json
// 1. Fetch new Figma design context
CallMcpTool: {
  "server": "user-figma-desktop",
  "toolName": "get_design_context",
  "arguments": {
    "nodeId": "59519:143300",
    "clientLanguages": "typescript",
    "clientFrameworks": "react"
  }
}

// 2. Fetch new Figma variable definitions (tokens)
CallMcpTool: {
  "server": "user-figma-desktop",
  "toolName": "get_variable_defs",
  "arguments": { "nodeId": "59519:143300" }
}
```

**If design context is too large**, fetch sublayers individually using the node IDs from the sparse response.

**Extract from Figma response:**
- Component structure and variants
- Design tokens: colors, spacing, typography, sizing
- States: default, hover, focus, disabled, active
- Icon specifications and sizes

### Step 3: Analyze Old Design (Based on Input Type)

**Scenario A: Screenshot of Old Design Provided**
- Read the screenshot image using the Read tool
- Visually analyze the old design for:
  - Component structure and variants visible
  - Approximate icon sizes and spacing
  - Color variants and states shown
  - Any visible differences from new Figma

**Scenario B: Old Figma URL Provided**
- Fetch old Figma design context and variables (same as Step 2)
- Compare token values between old and new

**Scenario C: No Old Design Provided**
- Read current component implementation files
- Compare new Figma specs against current code
- Check existing test snapshots for current state

### Step 4: Locate Component Files

Blade component structure:

```
packages/blade/src/components/{ComponentName}/
├── {ComponentName}/
│   ├── {ComponentName}.tsx          # Main component
│   ├── {ComponentName}.stories.tsx  # Storybook stories
│   ├── _KitchenSink.{ComponentName}.stories.tsx
│   ├── index.ts
│   └── __tests__/
│       ├── {ComponentName}.web.test.tsx
│       ├── {ComponentName}.native.test.tsx
│       ├── {ComponentName}.ssr.test.tsx
│       └── __snapshots__/
├── Base{ComponentName}/             # If exists
│   ├── Base{ComponentName}.tsx
│   ├── types.ts
│   └── Styled*.tsx
└── index.ts
```

### Step 5: Extract and Compare Tokens (MANDATORY)

**This is a MUST step.** Create a comprehensive comparison of Figma tokens vs current code.

#### 5.1: Extract All Tokens from Figma Variable Definitions

From the `get_variable_defs` response, extract and categorize ALL tokens:

```markdown
## Figma Tokens for {ComponentName}

### Colors
| Token Name | Value | Usage |
|------------|-------|-------|
| `interactive.text.primary.normal` | #2950da | Default text color |
| `interactive.text.primary.subtle` | #305eff | Hover text color |
| `interactive.text.primary.disabled` | #305eff52 | Disabled text color |
| `interactive.icon.primary.normal` | #2950da | Default icon color |
| `interactive.icon.primary.subtle` | #305eff | Hover icon color |
| `link.border.primary` | #305eff | Underline border color |
| `surface.border.primary.muted` | #305eff2e | Focus ring color |

### Spacing
| Token Name | Value | Usage |
|------------|-------|-------|
| `spacing[0]` | 0px | No spacing |
| `spacing[2]` | 4px | Icon gap |

### Typography
| Token Name | Value | Usage |
|------------|-------|-------|
| `font-size-200` | 16px | Large size |
| `font-size-100` | 14px | Medium size |
| `font-size-75` | 12px | Small size |
| `font-size-25` | 10px | XSmall size |
| `line-height-200` | 24px | Large line height |
| `line-height-100` | 20px | Medium line height |
| `font-weight-500` | Medium | Default weight |

### Sizing (Icons, etc.)
| Token Name | Value | Usage |
|------------|-------|-------|
| `Link.Large.main-icon` | 16px | Icon size for large |
| `Link.Medium.main-icon` | 16px | Icon size for medium |
| `Link.Small.main-icon` | 12px | Icon size for small |
| `Link.XSmall.main-icon` | 12px | Icon size for xsmall |

### Border & Radius
| Token Name | Value | Usage |
|------------|-------|-------|
| `border.radius.none` | 0px | No border radius |
| `border.width.thin` | 1px | Border width |
```

#### 5.2: Extract All States from Figma Design Context

From the `get_design_context` response, identify ALL component states:

```markdown
## Component States

| State | Figma Variant Name | What Changes |
|-------|-------------------|--------------|
| Default | `state=default` | Base styling |
| Hover | `state=hover` | Text/icon color becomes `subtle` |
| Focus | `state=focus` | Focus ring appears, text/icon `subtle` |
| Disabled | `isDisabled=True` | Text/icon color becomes `disabled` |
```

#### 5.3: Read Current Code and Extract Used Tokens

Read the component's styled files and extract what tokens are currently being used:

```typescript
// Example: From BaseLink.tsx, extract:
// - getColorToken() function mappings
// - iconSize assignments
// - spacing values (iconPadding)
// - focus ring color
// - typography tokens
```

#### 5.4: Create Comparison Table (REQUIRED OUTPUT)

**You MUST create this comparison table before making any changes:**

```markdown
## Token Comparison: Figma vs Code

### Colors
| Property | Figma Token | Figma Value | Code Token | Code Value | Match? |
|----------|-------------|-------------|------------|------------|--------|
| Text (default) | interactive.text.primary.normal | #2950da | interactive.text.primary.normal | #2950da | ✓ |
| Text (hover) | interactive.text.primary.subtle | #305eff | interactive.text.primary.subtle | #305eff | ✓ |
| Icon (default) | interactive.icon.primary.normal | #2950da | interactive.icon.primary.normal | #2950da | ✓ |
| Focus ring | surface.border.primary.muted | #305eff2e | surface.border.primary.muted | #305eff2e | ✓ |

### Sizing
| Property | Figma Value | Code Value | Match? |
|----------|-------------|------------|--------|
| Icon (large) | 16px | 20px (Icon.large) | ❌ MISMATCH |
| Icon (medium) | 16px | 16px (Icon.medium) | ✓ |
| Icon (small) | 12px | 12px (Icon.small) | ✓ |
| Icon (xsmall) | 12px | 8px (Icon.xsmall) | ❌ MISMATCH |

### Spacing
| Property | Figma Value | Code Value | Match? |
|----------|-------------|------------|--------|
| Icon gap | spacing[2] (4px) | spacing.2 (4px) | ✓ |

### States
| State | Figma Behavior | Code Behavior | Match? |
|-------|----------------|---------------|--------|
| Hover | text-decoration: underline, color: subtle | text-decoration: underline, color: subtle | ✓ |
| Focus | focus ring 4px, color: subtle | focus ring 4px, color: subtle | ✓ |
| Disabled | color: disabled, cursor: not-allowed | color: disabled, cursor: not-allowed | ✓ |

### Visual Effects
| Property | Figma Value | Code Value | Match? |
|----------|-------------|------------|--------|
| Box shadow (focus) | 0px 0px 0px 4px {focusRingColor} | 0px 0px 0px 4px {focusRingColor} | ✓ |
| Background | transparent | transparent | ✓ |
| Gradient | none | none | ✓ |
```

#### 5.5: Identify All Mismatches

List ALL mismatches that need to be fixed:

```markdown
## Required Changes

1. **Icon Size Mapping** - MISMATCH
   - Issue: Code passes link size directly to icon size
   - Figma: Large/Medium → 16px, Small/XSmall → 12px
   - Code: Large → 20px, XSmall → 8px
   - Fix: Create `linkSizeToIconSizeMap` mapping

2. **[Other mismatch]** - MISMATCH
   - Issue: ...
   - Figma: ...
   - Code: ...
   - Fix: ...
```

### Step 6: Verify All Aspects Covered

Before proceeding, confirm you've checked:

| Aspect | Figma Source | Code Location | Checked? |
|--------|--------------|---------------|----------|
| **Text Colors** | Variable definitions | Token imports, color props | ☐ |
| **Icon Colors** | Variable definitions | Icon color props | ☐ |
| **Background Colors** | Fill properties | backgroundColor props | ☐ |
| **Gradients** | Fill properties (if any) | background/gradient props | ☐ |
| **Box Shadows** | Effects (drop shadow) | boxShadow props | ☐ |
| **Focus Ring** | Focus state effects | focus-visible styles | ☐ |
| **Hover State** | Hover variant colors | hover styles | ☐ |
| **Disabled State** | Disabled variant styles | disabled styles | ☐ |
| **Border Colors** | Stroke properties | border props | ☐ |
| **Border Radius** | Corner radius | borderRadius props | ☐ |
| **Spacing (padding)** | Auto-layout padding | padding props | ☐ |
| **Spacing (gap)** | Auto-layout gap | gap props | ☐ |
| **Typography (size)** | Text style size | fontSize props | ☐ |
| **Typography (weight)** | Text style weight | fontWeight props | ☐ |
| **Typography (lineHeight)** | Text style lineHeight | lineHeight props | ☐ |
| **Icon Sizes** | Icon frame dimensions | icon size props | ☐ |
| **Motion/Animation** | Transitions (if any) | transition props | ☐ |

### Step 7: Verify in Storybook (Recommended)

Use browser automation to visually verify changes. **Recommended: `user-playwright` MCP**

#### Using user-playwright MCP (Recommended)

```json
// 1. Navigate to Storybook Kitchen Sink
CallMcpTool: {
  "server": "user-playwright",
  "toolName": "browser_navigate",
  "arguments": { "url": "http://localhost:9009/?path=/story/components-kitchensink-link--link" }
}

// 2. Wait for content to load
CallMcpTool: {
  "server": "user-playwright",
  "toolName": "browser_wait_for",
  "arguments": { "time": 3000 }
}

// 3. Take screenshot for visual verification
CallMcpTool: {
  "server": "user-playwright",
  "toolName": "browser_take_screenshot",
  "arguments": {}
}

// 4. Scroll to see more content (optional)
CallMcpTool: {
  "server": "user-playwright",
  "toolName": "browser_press_key",
  "arguments": { "key": "End" }
}

// 5. Take another screenshot after scrolling
CallMcpTool: {
  "server": "user-playwright",
  "toolName": "browser_take_screenshot",
  "arguments": {}
}
```

#### Fallback Options

**If `user-playwright` fails**, check MCP status and try alternatives:

1. **Check MCP Status**: Look for STATUS.md file in the MCP folder
   - If it says "errored", try alternative MCP or manual verification

2. **Alternative: `user-browsermcp`** (may have issues):
```json
CallMcpTool: {
  "server": "user-browsermcp",
  "toolName": "browser_navigate",
  "arguments": { "url": "http://localhost:9009/..." }
}
```

3. **Manual Verification**:
   - Ask user to open Storybook URL in browser
   - Request screenshot or description of current state

#### Storybook URL Patterns

| Pattern | URL Format |
|---------|------------|
| Kitchen Sink | `http://localhost:9009/?path=/story/components-kitchensink-{component}--{component}` |
| Docs | `http://localhost:9009/?path=/docs/components-{component}--docs` |
| Specific Story | `http://localhost:9009/?path=/story/components-{component}--{story-name}` |

**Examples:**
- Link Kitchen Sink: `http://localhost:9009/?path=/story/components-kitchensink-link--link`
- Link Docs: `http://localhost:9009/?path=/docs/components-link--docs`

#### What to Verify in Storybook

1. **Icon sizes**: Check all size variants (xsmall, small, medium, large)
2. **Colors**: All color variants render correctly (primary, white, neutral, positive, negative)
3. **States**: Interactive states work (hover, focus, disabled)
4. **Spacing**: Gap between icon and text matches Figma
5. **Typography**: Font sizes and line heights match design

### Step 8: Update Component Code

When differences found, update:

1. **Token imports**: Ensure correct design tokens
2. **Style values**: Match Figma spacing/colors/sizes
3. **Variants**: Add missing variants or states
4. **Props**: Update prop types if needed

Style token mapping:

| Figma Variable | Blade Token |
|----------------|-------------|
| `color/action/*` | `colors.interactive.*` |
| `color/feedback/*` | `colors.feedback.*` |
| `spacing/*` | `spacing.*` |
| `font/*` | `typography.*` |

### Step 9: Update Test Snapshots

After code changes, update snapshots:

```bash
# Update web snapshots
cd packages/blade
yarn test:react --updateSnapshot --testPathPattern="ComponentName"

# Update native snapshots  
yarn test:react-native --updateSnapshot --testPathPattern="ComponentName"
```

Verify snapshot changes match expected Figma updates.

### Step 10: Verify Changes

1. Run tests: `yarn test:react --testPathPattern="ComponentName"`
2. Check Storybook visually (use Playwright or BrowserMCP if available)
3. Run typecheck: `yarn typecheck`
4. Run lint: `yarn lint`

## Diff-Based Sync Workflow

Use this workflow when comparing two versions of Blade DSL Figma files to identify and sync token/style changes.

### Step D1: Parse Two Figma URLs

Extract from user request:
- **Old Figma URL**: The previous/baseline version
- **New Figma URL**: The updated version with changes
- **Component name** (optional): Specific component to compare

```
Example input:
Old: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300
New: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143400
```

Extract from each URL:
- `fileKey`: The ID after `/design/`
- `nodeId`: The `node-id` parameter (replace `-` with `:`)

### Step D2: Fetch Both Figma Versions

Fetch design context and variables from **both** versions in parallel:

```json
// Fetch OLD version
CallMcpTool: {
  "server": "user-figma-desktop",
  "toolName": "get_design_context",
  "arguments": { 
    "nodeId": "OLD_NODE_ID",
    "clientLanguages": "typescript",
    "clientFrameworks": "react"
  }
}

CallMcpTool: {
  "server": "user-figma-desktop",
  "toolName": "get_variable_defs",
  "arguments": { "nodeId": "OLD_NODE_ID" }
}

// Fetch NEW version
CallMcpTool: {
  "server": "user-figma-desktop",
  "toolName": "get_design_context",
  "arguments": { 
    "nodeId": "NEW_NODE_ID",
    "clientLanguages": "typescript",
    "clientFrameworks": "react"
  }
}

CallMcpTool: {
  "server": "user-figma-desktop",
  "toolName": "get_variable_defs",
  "arguments": { "nodeId": "NEW_NODE_ID" }
}
```

### Step D3: Compare and Identify Changes

Compare the two versions to identify:

#### Token Changes
| Change Type | What to Look For | Code Impact |
|-------------|------------------|-------------|
| **Color token renamed** | Variable name changed | Update token imports |
| **Color value changed** | Same name, different value | Token file update (if in blade) |
| **Spacing changed** | Auto-layout gap/padding differs | Update spacing props |
| **Typography changed** | Font size/weight/lineHeight differs | Update typography tokens |
| **New token added** | Token exists in new, not in old | Add new token usage |
| **Token removed** | Token exists in old, not in new | Remove deprecated token |

#### Style Changes
| Change Type | What to Look For | Code Impact |
|-------------|------------------|-------------|
| **Border radius** | Corner radius values differ | Update borderRadius prop |
| **Shadow** | Drop shadow properties differ | Update shadow tokens |
| **Opacity** | Layer opacity changed | Update opacity values |
| **Icon size** | Icon frame dimensions differ | Update icon size prop |

#### Component Structure Changes
| Change Type | What to Look For | Code Impact |
|-------------|------------------|-------------|
| **New variant** | Variant added in component set | Add variant prop option |
| **Removed variant** | Variant missing in new version | Deprecate/remove variant |
| **New state** | State added (hover, focus, etc.) | Add state styles |
| **Layout change** | Flex direction/alignment changed | Update layout props |

### Step D4: Generate Change Report

Create a structured diff report:

```markdown
## Token Changes Summary

### Colors
| Token | Old Value | New Value | Status |
|-------|-----------|-----------|--------|
| `color/action/text/link/default` | `#0066FF` | `#0052CC` | CHANGED |
| `color/action/text/link/visited` | - | `#5243AA` | ADDED |

### Spacing
| Location | Old Value | New Value | Status |
|----------|-----------|-----------|--------|
| Icon gap | 4px | 8px | CHANGED |

### Typography
| Property | Old Value | New Value | Status |
|----------|-----------|-----------|--------|
| Line height (medium) | 20px | 24px | CHANGED |

### Affected Components
- Link
- Button (if shared tokens)
```

### Step D5: Verify Changes in Browser (Optional)

Use browser MCP to visually compare if Storybook is running:

```json
// Take screenshot of current implementation
CallMcpTool: {
  "server": "user-browsermcp",
  "toolName": "browser_navigate",
  "arguments": { "url": "http://localhost:9009/?path=/story/components-link--default" }
}

CallMcpTool: {
  "server": "user-browsermcp",
  "toolName": "browser_screenshot",
  "arguments": {}
}
```

Compare against Figma screenshot:

```json
CallMcpTool: {
  "server": "user-figma-desktop",
  "toolName": "get_screenshot",
  "arguments": { "nodeId": "NEW_NODE_ID" }
}
```

### Step D6: Update Code Based on Diff

For each identified change, update the appropriate files:

#### Token Value Changes (in Blade tokens)
```
packages/blade/src/tokens/theme/
├── paymentTheme/
│   └── colors.ts
├── bankingTheme/
│   └── colors.ts
└── baseTheme/
    ├── spacing.ts
    └── typography.ts
```

#### Component Style Changes
```
packages/blade/src/components/{ComponentName}/
├── Styled{ComponentName}.tsx  # Update style values
├── {ComponentName}.tsx        # Update prop defaults
└── types.ts                   # Update type definitions
```

#### Mapping Reference
See `references/token-mapping.md` for Figma → Blade token mappings.

### Step D7: Validate and Test

1. **Run affected component tests:**
```bash
yarn test:react --testPathPattern="ComponentName"
```

2. **Update snapshots if styles changed:**
```bash
yarn test:react -u --testPathPattern="ComponentName"
```

3. **Visual verification in Storybook:**
```json
CallMcpTool: {
  "server": "user-browsermcp",
  "toolName": "browser_navigate",
  "arguments": { "url": "http://localhost:9009/?path=/docs/components-{component}--docs" }
}
```

4. **Run full validation:**
```bash
yarn typecheck && yarn lint
```

### Diff Workflow Example

**User request:**
> Compare these two Figma versions and update the Link component:
> Old: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300
> New: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143400

**Execution:**
1. Parse both URLs → oldNodeId=`59519:143300`, newNodeId=`59519:143400`
2. Fetch design context and variables for both versions
3. Compare tokens/styles → Found: icon gap changed 4px→8px, hover color updated
4. Generate change report
5. Take Storybook screenshot for current state
6. Update `StyledLink.tsx` with new spacing value
7. Update token if color changed in tokens file
8. Run tests and update snapshots
9. Verify in Storybook matches new Figma

## Quick Reference

### MCP Servers

| Server | Purpose | Key Tools | Status Check |
|--------|---------|-----------|--------------|
| `user-figma-desktop` | Figma design data | `get_design_context`, `get_variable_defs`, `get_screenshot` | Required |
| `user-playwright` | Browser automation (RECOMMENDED) | `browser_navigate`, `browser_take_screenshot`, `browser_wait_for`, `browser_press_key`, `browser_snapshot` | Check STATUS.md |
| `user-browsermcp` | Browser automation (fallback) | `browser_navigate`, `browser_screenshot`, `browser_snapshot`, `browser_click` | Check STATUS.md |

**Important:** 
- Check MCP server status in Cursor Settings if tools fail
- Look for `STATUS.md` file in MCP folder - if it says "errored", use alternative
- Browser MCPs require a browser to be available

### Common Figma URL Patterns

```
# Standard design URL
https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}

# Dev mode URL  
https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}&m=dev
```

### Blade Test Commands

```bash
# Run specific component tests
yarn test:react --testPathPattern="Link"

# Update snapshots
yarn test:react -u --testPathPattern="Link"

# Run all tests
yarn test
```

## Example Usage

### Example 1: New Figma Only (Compare Against Current Code)

**User request:**
> Verify the Link component against Figma: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300&m=dev

**Execution:**
1. Parse: fileKey=`jubmQL9Z8V7881ayUD95ps`, nodeId=`59519:143300`
2. Fetch Figma design context and variables
3. Read current component implementation (`BaseLink.tsx`, etc.)
4. **MANDATORY: Create token comparison table**
   - Extract all tokens from Figma (colors, spacing, typography, sizing)
   - Extract all states (default, hover, focus, disabled)
   - Compare with current code tokens
   - List all mismatches
5. Identify differences (e.g., icon sizes don't match)
6. Update component code based on mismatches
7. Run tests: `yarn test:react --testPathPattern="Link/Link"`
8. Verify in Storybook using `user-playwright` MCP

### Example 2: Screenshot of Old Design + New Figma

**User request:**
> This is the new Link component Figma: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300
> And this is a screenshot of the old design: [attached image]
> Can you check what changed and update the component?

**Execution:**
1. Parse new Figma URL: nodeId=`59519:143300`
2. Fetch in parallel:
   - New Figma design context and variables
   - Read the old design screenshot image
3. Analyze screenshot to understand old design:
   - Visible icon sizes across variants
   - Component structure shown
4. Read current component code
5. **MANDATORY: Create comprehensive token comparison table**
   - Extract ALL tokens from Figma variables:
     - Colors (text, icon, background, border, focus ring)
     - Spacing (gap, padding)
     - Typography (size, weight, lineHeight)
     - Sizing (icon sizes per variant)
   - Extract ALL states from Figma:
     - Default, hover, focus, disabled
   - Compare each with current code
   - Create mismatch list
6. Generate change report:
   - Icon sizes: XSmall/Small should be 12px, Medium/Large should be 16px
   - Found: Old code passed size directly, causing wrong icon sizes
7. Update `BaseLink.tsx` with `linkSizeToIconSizeMap`
8. Run tests and update snapshots
9. Verify in Storybook at `http://localhost:9009/?path=/story/components-kitchensink-link--link`

### Example 3: Figma-to-Figma Diff

**User request:**
> Compare old and new Figma and sync the Button component:
> Old: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=12345-67890
> New: https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=12345-99999

**Execution:**
1. Parse both URLs → oldNodeId=`12345:67890`, newNodeId=`12345:99999`
2. Fetch design context and variables for **both** versions (in parallel)
3. **MANDATORY: Create comprehensive token comparison (Old Figma vs New Figma vs Code)**
   - Extract ALL tokens from BOTH Figma versions
   - Compare old vs new to identify what changed
   - Compare new Figma vs current code
   - Check ALL aspects:
     - Colors (all states: default, hover, focus, disabled)
     - Background colors and gradients
     - Box shadows and focus rings
     - Border colors and radius
     - Spacing (padding, gap)
     - Typography (size, weight, lineHeight)
     - Icon sizes
4. Generate change report with old vs new vs code values:
   - Token changes: `color/action/background/primary` value changed
   - Spacing changes: button padding increased from 12px to 16px
   - New variant: `size="xlarge"` added
5. Take Storybook screenshot of current Button implementation
6. Update affected files:
   - `StyledButton.tsx`: Update padding values
   - `types.ts`: Add `xlarge` to size union
   - `Button.tsx`: Add xlarge variant handling
7. Run `yarn test:react -u --testPathPattern="Button"`
8. Verify in Storybook matches new Figma design
