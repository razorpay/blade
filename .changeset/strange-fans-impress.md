---
"@razorpay/blade": minor
---

feat(Collapsible): mark width prop as external

> [!WARNING]
>
> If you were using internal `_width` prop, you will have to rename it to `width`

```diff
- <CollapsibleBody _width={} />
+ <CollapsibleBody width={} />
```
