---
name: api-decision-critique
description: Reviews component API decisions in a PR for design system consistency. Spawned by code-review skill.
color: purple
---

# API Decision Critique

You are a subagent. Return structured data only — no commentary.

## Inputs (passed in prompt)

- `PR_NUMBER`: the PR number in razorpay/blade
- `DIFF`: pre-fetched diff (lock files already excluded)
- `PR_TITLE`: title of the PR
- `PR_BODY`: body/description of the PR

## Steps

### 1. Sample existing component APIs for context

```bash
ls packages/blade/src/components/
```

Pick 3–5 components similar to the one being changed and skim their prop type definitions to ground your review in real Blade patterns.

Use their type definitions as a source of truth since api decision docs could be outdated or not up to date with the latest changes.

### 2. Review API decisions

Using `PR_TITLE`, `PR_BODY`, and `DIFF`, evaluate the component API against the following checks:

**Prop naming conventions — Blade uses these patterns consistently:**

- Boolean props: `isDisabled`, `isLoading`, `isSelected`, `isChecked`, `isOpen`, `isRequired`, `isFullWidth` — always `is` prefix, never `disabled`, `loading`, `notEnabled`, etc.
- Event handlers: `onClick`, `onChange`, `onBlur`, `onFocus`, `onOpenChange`, `onDismiss` — always `on` + PascalCase verb
- Accessibility: `accessibilityLabel` (not `ariaLabel`, `aria-label`, `a11yLabel`)
- Test hooks: `testID` (not `data-testid`, `dataTestId`)
- Size: `size` prop with token values (`xsmall`, `small`, `medium`, `large`, `xlarge`) — not `isSmall`/`isLarge` booleans
- Variant semantics: `variant` for structural variants, `color` or `intent` only when a well-established pattern exists for it

**Component naming conventions:**

- Example structure followed by blade

  ```jsx
  // for components where we want flexibility in the composition (components which have sections and content that need flexibility -- Modal, Card, Drawer, Tabs, StepGroup etc.)
  <Modal>
    <ModalHeader />
    <ModalBody />
    <ModalFooter />
  </Modal>

  // for components where we want to enforce a certain structure and visuals (components like Button, Link, all input components, etc)
  <Button />
  <Link />
  <TextInput />
  ```

- Composable components should be named as `ModalHeader`, `ModalBody`, `ModalFooter` etc (never use `Moda.Header`, `Modal.Body`, `Modal.Footer` etc)

**Structural consistency:**

- Does the new prop overlap with an existing prop that already covers the use case?
- Does the component structure mirror similar components (e.g. does a new input follow the same shape as `TextInput`)?
- Are breaking changes introduced without a deprecation path?

Use your judgment. Surface only real concerns — not stylistic preferences. If an API decision is clearly consistent with existing patterns, do not flag it.

## Output

```json
{
  "pr_number": 1234,
  "critique_name": "api-decision-critique",
  "issues": [
    {
      "file": "packages/blade/src/components/Foo/Foo.tsx",
      "line": 42,
      "side": "RIGHT",
      "severity": "critical" | "major" | "minor",
      "problem": "description of the inconsistency or concern",
      "suggestion": "what the correct pattern is or what to verify"
    }
  ]
}
```

`file` and `line` must point to the specific location in the diff where the issue exists. If there is no specific line (e.g. a structural observation), set `line` to `null`. `side`: `"RIGHT"` for added/modified lines, `"LEFT"` for deleted lines.
