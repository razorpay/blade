# Blade Design System

Blade is Razorpay's cross-platform Design System with React Web and React Native components. This monorepo contains the core design system, tooling, and multiple supporting packages.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Ensure Node.js >= 18.12.1 is installed
- Install dependencies:
  ```bash
  yarn install
  ```
  **NEVER CANCEL** - Takes 10-12 minutes. Set timeout to 15+ minutes minimum.

### Build Process
- Build all packages:
  ```bash
  yarn build
  ```
  **NEVER CANCEL** - Takes 2-3 minutes. Set timeout to 5+ minutes minimum.

- Build only core Blade package:
  ```bash
  cd packages/blade && yarn build
  ```

### Development Workflow
- Start Storybook for web development:
  ```bash
  cd packages/blade && yarn start:web
  ```
  **NEVER CANCEL** - Takes 2-3 minutes to start. Set timeout to 5+ minutes minimum.
  Access at http://localhost:9009

- TypeScript type checking:
  ```bash
  cd packages/blade && yarn typecheck
  ```
  Takes ~25 seconds. Always run before committing.

### Testing
- Run all tests:
  ```bash
  cd packages/blade && yarn test
  ```
  **NEVER CANCEL** - Takes 2-3 minutes. Set timeout to 5+ minutes minimum.
  **Note**: Currently has 2 locale-related test failures that are unrelated to functionality.

- Run web tests only:
  ```bash
  cd packages/blade && yarn test:react
  ```

- Run React Native tests only:
  ```bash
  cd packages/blade && yarn test:react-native
  ```

### Validation Before Committing
- Always run linting (currently has existing lint errors in codebase):
  ```bash
  yarn lint
  ```
  Takes ~2 minutes. **Note**: Repository currently has existing lint errors that are unrelated to new changes.

- Run TypeScript checks:
  ```bash
  cd packages/blade && yarn typecheck
  ```

## React Native Development Setup

React Native development requires additional setup for iOS and Android. Only set up if contributing to React Native components.

### iOS Setup Requirements
- Install Xcode with iOS 13+ simulator
- Install CocoaPods: `sudo gem install cocoapods`
- Install pods: `cd packages/blade/ios && pod install`
- For M1 Macs, follow React Native's M1 setup guide

### Android Setup Requirements  
- Install Android Studio with Android 12 SDK
- Create AVD with sufficient storage (4GB+) and memory (2GB+)
- Set `ANDROID_SDK_ROOT` environment variable

### React Native Storybook
- Start iOS simulator:
  ```bash
  cd packages/blade && yarn start:ios
  ```

- Start Android emulator:
  ```bash
  cd packages/blade && yarn start:android
  ```

## Validation Scenarios

Always manually validate changes by running through these scenarios:

### Web Component Validation
1. Start Storybook: `cd packages/blade && yarn start:web`
2. Navigate to http://localhost:9009
3. Browse to the component you modified
4. Test different component states and props
5. Verify accessibility using browser dev tools
6. Test responsive behavior at different screen sizes

### Cross-Platform Validation
- Always test both `.web.tsx` and `.native.tsx` implementations if they exist
- Ensure imports don't mix platform-specific files
- Test component behavior matches between platforms

### Build Validation
- Always build after changes: `yarn build`
- Ensure no build errors are introduced
- Verify TypeScript compilation: `cd packages/blade && yarn typecheck`

## Important Environment Variables

The build system uses these critical environment variables:
- `FRAMEWORK=REACT` - for web builds
- `FRAMEWORK=REACT_NATIVE` - for React Native builds
- `NODE_OPTIONS=--openssl-legacy-provider` - required for Storybook

**Critical**: If you see "FRAMEWORK environment variable not set" error, ensure the commands use the proper cross-env settings.

## Repository Structure

### Monorepo Packages
- `packages/blade/` - Core design system components and tokens
- `packages/blade-mcp/` - Model Context Protocol server for AI development
- `packages/eslint-plugin-blade/` - ESLint rules for Blade usage
- `packages/plugin-figma-*` - Figma plugins for design workflows

### Cross-Platform File Structure
- `.web.tsx` - Web-specific implementations
- `.native.tsx` - React Native-specific implementations  
- `.tsx` - Shared cross-platform code
- **Never import** `.web` files in `.native` files or vice versa

### Key Directories
- `src/components/` - All UI components with decisions docs
- `src/tokens/` - Design tokens (colors, spacing, typography)
- `src/utils/` - Shared utilities and hooks
- `.storybook/` - Storybook configuration
- `android/` and `ios/` - React Native platform code

## Timing Expectations

Set these minimum timeouts for commands:

| Command | Expected Time | Minimum Timeout |
|---------|---------------|-----------------|
| `yarn install` | 10-12 minutes | 15 minutes |
| `yarn build` | 2-3 minutes | 5 minutes |
| `yarn start:web` | 2-3 minutes | 5 minutes |
| `yarn test` | 2-3 minutes | 5 minutes |
| `yarn typecheck` | 25 seconds | 2 minutes |
| `yarn lint` | 2 minutes | 3 minutes |

## Common Issues and Solutions

### Build Failures
- Clean build cache: `cd packages/blade && yarn build:clean`
- Clear Jest cache: `cd packages/blade && yarn clearCache`
- Ensure correct Node.js version (>=18.12.1)

### React Native Issues
- For Android: Clean Gradle cache in `android/` directory with `./gradlew clean`
- For iOS: Clean derived data and rebuild pods
- Ensure `ANDROID_SDK_ROOT` is set for Android development

### Import Errors
- VSCode auto-imports can mix `.web` and `.native` files
- Always verify imports use correct platform-specific files
- Check for missing `.d.ts` file imports that can break type checking

## Peer Dependencies

When consuming Blade in applications, these peer dependencies are required:
- `react` >= 18
- `react-dom` >= 18 (web only)
- `styled-components` ^5
- `framer-motion` >= 4
- React Native specific: `react-native` ^0.72, various RN libraries for native components

## CI/CD Compatibility

The repository uses GitHub Actions with:
- Node.js 18.12.1
- Yarn package manager
- Sharded test execution (4 shards)
- Coverage reporting
- Visual regression testing via Chromatic

Always ensure changes pass:
1. Build validation
2. TypeScript checks  
3. Test suite (allowing for 2 existing locale-related failures)
4. Lint validation (existing lint errors are pre-existing)

## Documentation

- Component documentation: https://blade.razorpay.com
- Component decisions: See `_decisions/decisions.md` files in component directories
- RFCs: `/rfcs/` directory for major design decisions
- Migration guides: `packages/blade/docs/migration-docs/`