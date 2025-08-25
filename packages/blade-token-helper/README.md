# Blade Token Helper

VS Code extension that surfaces Razorpay's Blade design system token values.

Hover over tokens like `spacing.1` or `color.theme.black` to see their
corresponding values.

## Development

1. Install dependencies
   ```bash
   yarn install
   ```
2. Compile the extension
   ```bash
   yarn compile
   ```
3. Press `F5` in VS Code to launch the extension in a new Extension Development Host.
   The hover information will appear for recognized tokens.

Run `yarn watch` to recompile on changes.
