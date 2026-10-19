You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Testing

Unit/component tests run on **Vitest** + **@testing-library/svelte** (the React package uses Jest; Svelte 5 requires the Vite/Vitest toolchain, so this is the framework-correct split — see https://svelte.dev/docs/svelte/testing).

- **Commands:** `yarn test` (run once), `yarn test:watch`, `yarn test:coverage`; `yarn svelte-check`; `yarn check:tree-shaking`.
- **Config:** `vitest.config.ts` runs `src/**/*.test.ts` in jsdom with browser resolve conditions and the package's own Vite plugin (icons as font glyphs, as an app builds them).
- **File naming:** `*.test.ts`, next to a rune (`src/runes/**`) or under `src/test/` for components; `src/test/styles-contract.test.ts` enforces the styling contract.
- **blade-core** is resolved from source via aliases in `vitest.config.ts`, so no build step is needed to run tests.
- Coverage thresholds target 75% (React parity) but gate `test:coverage` only; CI runs `yarn test` while coverage ramps up.
- **End-to-end:** `yarn test:e2e` runs `tests/e2e` against the built Storybook (`yarn build-storybook`).
