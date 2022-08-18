---
"@razorpay/blade": minor
---

fix: icon sizes for `Icon`, `IconButton`, `Button`, `Link` & `Spinner` components

### Breaking changes
**❗️This version introduces a breaking change for the `Icon` component's `size` prop**

Earlier, the `size` prop had the following size to pixel mapping:
- **xxsmall:** 10px
- **xsmall**: 12px
- **small**: 16px
- **medium**: 20px
- **large**: 24px
- **xlarge**: 32px

Now, the correct `size` prop will have the following size to pixel mapping:
- **xsmall**: 8px
- **small**: 12px
- **medium**: 16px
- **large**: 20px
- **xlarge**: 24px
- **2xlarge**: 32px

> ⚠️ `xxsmall` is not an accepted value anymore. Instead, we have a new acceptable value of `2xlarge`.
