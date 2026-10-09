# New Blade project

Creates a new Blade app from the `base-blade-template` in the razorpay/blade repository.

## Steps

1. The current directory must be empty. Check with:

```bash
[ "$(ls -A)" ] && echo "not empty" || echo "empty"
```

   If it is not empty, stop and ask the user for an empty directory.

2. Copy the template:

```bash
npx degit razorpay/blade/packages/blade-mcp/base-blade-template
```

3. Install dependencies and the latest Blade:

```bash
npm install --legacy-peer-deps && npm install @razorpay/blade@latest --legacy-peer-deps
```

4. Start the dev server once, before writing code, and leave it running:

```bash
npm run dev
```

5. Build the UI in `src/App.tsx`. Use the `blade` skill to read component docs before using any component.
