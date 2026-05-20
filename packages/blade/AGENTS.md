# Blade Design System — Agent Context

Blade is Razorpay's design system. This package (`@razorpay/blade`) ships React (web) and React Native components from a single shared codebase.

## Package Structure

```
src/
  components/   # Components directory
  tokens/       # theme tokens
  utils/        # Shared utilities and helpers
```

## Quick Commands

> **Note:** Run these commands from the `packages/blade` directory.

### Running Tests

| Task                               | Command                                      |
| ---------------------------------- | -------------------------------------------- |
| Web tests (all)                    | `yarn test:react`                            |
| Web tests (specific components)    | `yarn test:react DatePicker Dropdown`        |
| Native tests                       | `yarn test:react-native`                     |
| Native tests (specific components) | `yarn test:react-native DatePicker Dropdown` |
| Update snapshots                   | `yarn test:react -u`                         |

### Other Commands

| Task                  | Command          |
| --------------------- | ---------------- |
| Type check            | `yarn typecheck` |
| Build blade package   | `yarn build`     |
| Run storybook locally | `yarn start:web` |

## Common Patterns and Best Practices to follow

- **Prop Namings and Component Structures:**
  - While adding a new prop to a component or adding a new component, always refer to types of existing components and ensure that the new prop names and component structures are consistent with existing components (use types and story examples as source of truth as API decisions can be out of date).
  - Follow best practices and give enough thought to prop names and component names as it is an important part of the design system. E.g. do not use negative prop names `isNotVisible` or inconsistent names like `loading` instead of `isLoading` used in other components.
- **When intent is 'perform-task-end-to-end' (as defined by root AGENT context file)**
  - Do the task end-to-end with meaningful assumptions
  - Make sure the core task is still the focus while you also perform the other sanity tasks
