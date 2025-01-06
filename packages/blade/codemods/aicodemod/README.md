# Blade AI Codemod

## 1. Install Blade Globally

```sh
npm install -g @razorpay/blade
```

## 2. Run `aicodemod` Command to Migrate

```sh
aicodemod <path-to-migrate>
  --code-knowledge presets/dashboard/table-pattern-1
```

`--code-knowledge`: The AI needs some info about existing codebase and some patterns on how to migrate. We currently have created a preset knowledge for migrating one of the patterns in table.

## 3. Fix any visual or syntax issues if there

AI Codemod is there to help you get going with migration. You might still have 10% work left to review if the code logic is in place and visually things are looking as expected.

> [!NOTE]
>
> **POC Limitations**
>
> As currently its just POC, its optimized to only migrate to Blade Table component. It can also
