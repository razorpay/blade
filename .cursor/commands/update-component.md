# Update Component

Update an existing Blade component (web only) using Figma designs and knowledgebase documentation.

## Usage

```
/update-component <ComponentName> <FigmaURL>
```

**Example:**
```
/update-component Popover https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=115756-259386
```

## Instructions

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

Returns:
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

Returns a JSON object with all design tokens used in the component.

#### 2.3 Get Screenshot (Visual Reference)

```
Tool: user-Figma → get_screenshot
Arguments:
  - fileKey: "<extracted-file-key>"
  - nodeId: "<extracted-node-id>"
```

Returns a visual screenshot of the component for reference.

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

### Step 5: Check for Errors

Use `ReadLints` tool on modified files to check for linter errors and fix them.

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

## Guidelines

- **Web only**: Only update `.web.tsx` files, ignore `.native.tsx`
- **Follow existing patterns**: Study similar components for consistency
- **Maintain backward compatibility**: Don't remove existing props without deprecation
- **Keep knowledgebase in sync**: Always update the documentation
- **Use design tokens**: Use theme tokens instead of hardcoded values
