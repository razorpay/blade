# blade-core — Agent Context

Core utilities and shared functionality for the Blade Design System. Contains shared logic consumed by `@razorpay/blade` and other Blade packages.

Important: This package is only used in `@razorpay/blade-svelte` package right now and not in `@razorpay/blade` package.

## Package Structure

```
src/   # Core utilities and shared code
  tokens/   # Core theme tokens of blade
  styles/   # Shared styles
  utils/    # Shared utilities
  types/    # Shared types
  index.ts  # Entry point
```

## Quick Commands

> **Note:** Run these commands from the `packages/blade-core` directory.

| Task          | Command            |
| ------------- | ------------------ |
| Build         | `yarn build`       |
| Build (watch) | `yarn build:watch` |
| Type check    | `yarn typecheck`   |
| Run tests     | `yarn test`        |
