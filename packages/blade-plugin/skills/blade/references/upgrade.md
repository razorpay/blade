# Upgrading Blade

Fetches `packages/blade/CHANGELOG.md` from GitHub and prints only the requested versions. The full changelog is over 250KB, so never fetch or read it directly.

## Steps

1. Work out the range from the user's intent:
   - "help me upgrade" or "what changed since my version": read the consumer's `package.json` for the installed `@razorpay/blade` version, use it as `from` and `latest` as `to`.
   - "what changed in 12.3.0": `from` only.
   - "what changed between 12.0.0 and 12.5.0": `from` and `to`.
   - "what is the latest version": `from` = `latest`.
2. Run the script:

```bash
node scripts/changelog.mjs <from> [to]
```

   Examples: `12.0.0 latest`, `latest`, `12.3.0`.

3. Summarise the output in this format. Omit empty sections.

```
# Key Changes to Watch Out For:
- **XYZ component changed (v12.0.0):** what changed and how it affects the consumer
# Breaking Changes:
- **XYZ** was removed (v12.0.0)
# Visual Changes:
- **XYZ** now uses new design tokens (v12.0.0)
# New Components:
- **XYZ** was added (v12.0.0)
# Enhancements:
- **XYZ** now supports a new prop (v12.0.0)
# Bug Fixes:
- **XYZ** fixed (v12.0.0)
```

4. Link every version mention to its release: `(v12.0.0)` becomes `[(v12.0.0)](https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade%4012.0.0)`.

5. If the user is upgrading, list the concrete code edits they need for breaking changes, then offer to apply them. Read component docs from the `blade` skill for the new APIs before editing.
