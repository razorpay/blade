---
'@razorpay/blade': major
---

feat(blade): added 2px spacing token

## Breaking changes

- Added 2px token, thus all spacing tokens have shifted by 1 step. 

## Migration steps

Shifted every spacing tokens by +1

```diff
- <div style={{ margin: theme.spacing[1] }} />
+ <div style={{ margin: theme.spacing[2] }} />
```