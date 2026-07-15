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

- **Commands:** `yarn test` (run once), `yarn test:watch`, `yarn test:coverage`.
- **Config:** `vitest.config.ts` defines two projects mirroring the React package's CSR/SSR split:
  - `client` — jsdom environment, browser resolve conditions; component tests via Testing Library + `@testing-library/user-event`.
  - `ssr` — node environment; server-render smoke tests via `render` from `svelte/server`.
- **Setup:** `vitest-setup.ts` registers jest-dom matchers, Testing Library auto-cleanup, and jsdom shims (ResizeObserver/IntersectionObserver/matchMedia). `src/testing.d.ts` type-augments `expect` for tsc/svelte-check and is excluded from the published types build.
- **File naming:** client tests `*.test.ts`, server tests `*.ssr.test.ts`; co-locate under a component's `__tests__/` directory (see `src/components/Button/__tests__/`).
- **blade-core** is resolved from source via aliases in `vitest.config.ts` (mirroring `.storybook/main.js`), so no build step is needed to run tests.
- Coverage thresholds target 75% (React parity) but gate `test:coverage` only; CI runs `yarn test` while coverage ramps up.
