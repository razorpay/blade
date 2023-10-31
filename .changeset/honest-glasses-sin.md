---
'@razorpay/blade': minor
---

feat: update popup token, migrate overlay tokens

> **Warning**
>
> `theme.colors.overlay.background` is moved to `theme.colors.surface.overlay.background[800]`.
>
> Based on our analytics data, its a rarely used token hence, its a non-breaking change for most consumers (1 instance in razorpay/x repo).
> Although it is recommended to search for `colors.overlay.background` in your repo and confirm once if its not being used. If it is used you can follow migration step below.

```diff
- background={theme.colors.overlay.background}
+ background={theme.colors.surface.overlay.background[800]}
```
