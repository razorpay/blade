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

### Step 5: Verify Changes with Browser MCP

Use the Browser MCP to visually verify your changes in Storybook.

#### 5.1 Prerequisites

- Ensure Storybook is running (check terminals folder or start with `yarn react:storybook`)
- **Browser MCP Connection Required**: User must connect the Browser MCP extension first:
  1. Click the **Browser MCP extension icon** in the browser toolbar
  2. Click the **'Connect' button**
  3. Only then can you proceed with automation

#### 5.2 Available Browser MCP Tools

All browser tools are available under the `user-browsermcp` server:

- `browser_navigate` - Navigate to a URL
- `browser_snapshot` - Get current page structure and elements
- `browser_screenshot` - Capture screenshot (supports `fullPage: true`)
- `browser_click` - Click elements (requires `element` parameter with ref)
- `browser_hover` - Hover over elements
- `browser_type` - Type text into inputs
- `browser_go_back` / `browser_go_forward` - Navigate history

#### 5.3 Navigate to Storybook

**Option 1: Full Storybook View**

```
Tool: user-browsermcp → browser_navigate
Arguments:
  url: "http://localhost:9011/?path=/story/components-<component>--<story>"
```

**Option 2: Iframe View (Recommended for Screenshots)**

```
Tool: user-browsermcp → browser_navigate
Arguments:
  url: "http://localhost:9011/iframe.html?id=components-<component>--<story>&viewMode=story"
```

**Why use iframe view?**

- Cleaner screenshots without Storybook UI
- Shows only the component being tested
- Better for visual comparison with Figma
- Smaller file size and faster loading

#### 5.4 Take Screenshots

1. **Navigate to the story** (use iframe URL for best results)
2. **Take a full-page screenshot**:
   ```
   Tool: user-browsermcp → browser_screenshot
   Arguments:
     fullPage: true
   ```
3. **Compare with Figma design** - Verify all visual changes match

#### 5.5 Example Workflow

```
1. browser_navigate to http://localhost:9011/iframe.html?id=components-popover--uncontrolled
2. browser_snapshot to check page loaded
3. browser_screenshot with fullPage: true
4. Compare screenshot with Figma design reference
5. Verify:
   - Padding and spacing match design tokens
   - Colors and borders are correct
   - Typography sizes are accurate
   - Shadows and effects are applied
   - Component behavior works as expected
```

#### 5.6 Tips for Testing

- **Use "Uncontrolled" or "Default" stories** - These often show the component in its open/active state
- **Test multiple variants** - Check different placements, sizes, or states if applicable
- **Check responsive behavior** - Test on different viewport sizes if relevant
- **Verify interactions** - Use `browser_click`, `browser_hover` to test interactive states

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
- **Test with Browser MCP**: Always verify changes visually in Storybook using browser automation
  - Use iframe URLs for cleaner screenshots
  - Take full-page screenshots for verification
  - Compare with Figma design reference
