---
'@razorpay/blade': major
---

feat(Typography): streamline typography scale

> **Warning**
>
> Breaking Change!
> This is a breaking change for typography components and lineHeight scale

### Component Changes:

- Title:
  - Added `xlarge` size
- Text:
  - Added `large` size
- Link:
  - Added `large` size
- Code:
  - Added `weight=bold`

### Breaking Changes:

- Title:
  - Replace all `large` size variants to `xlarge`

```diff
- <Title size="large">hello world</Title>
+ <Title size="xlarge">hello world</Title>
```

---

### Line-height scale changes

New scale has been changed to use numbered values for more flexibility, to read more about the changes [check this doc](https://docs.google.com/document/d/16j8dIKuQF9GjDgkhkZwnokVGNeoK7R-7zzIXHCgvveA/edit).

#### **Migration guide:**

Replace old named tokens to corresponding numbered values:

For example:

```diff
- theme.typography.lineHeights.s
+ theme.typography.lineHeights[50]
```

**Old vs New mappings:**

| old | new |
| --- | --- |
| s   | 50  |
| m   | 50  |
| l   | 100 |
| xl  | 200 |
| 2xl | 300 |
| 3xl | 400 |
| 4xl | 600 |
| 5xl | 700 |
| 6xl | 800 |

#### **Migrate with Codemod:**

To change all instances of `theme.typography.lineHeights` to the new scale automatically use this codemod:

**Step1:** Install this version of blade

**Step2:** Run the codemod with the following command

> use `--parser=tsx` for typescript projects and `--parser=jsx` for js projects

```sh
npx migrate-typography ./YOUR_DIR --parser=tsx
```

> **Note**
>
> This codemod will cover 80% of the usecases, but it might miss certain edge cases, it is advised to thoroughly test & check the code to ensure nothing is missed.
