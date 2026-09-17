// Type-only augmentation so `@testing-library/jest-dom` matchers
// (toBeInTheDocument, toBeDisabled, toHaveTextContent, ...) are recognized on
// Vitest's `expect` by tsc / svelte-check. Runtime registration lives in
// vitest-setup.ts. Excluded from the published types build via
// tsconfig-generate-types.json.
import '@testing-library/jest-dom/vitest';
