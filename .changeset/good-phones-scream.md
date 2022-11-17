---
"@razorpay/blade": major
---

chore: Badge design changes

- Adds a new small size
- Bumps existing small & medium to medium & large respectively
- Horizontal padding changes in the large size

### Migration Guide for Badge Consumers
1. For existing `small` size badge, bump the size from `small` to `medium`
```diff
- <Badge size='small'>...</Badge>
+ <Badge size='medium'>...</Badge>
```
2. For existing `medium` size badge, bump the size from `medium` to `large`
```diff
- <Badge size='medium'>...</Badge>
+ <Badge size='large'>...</Badge>
```
3. For existing badge with no `size` specified, add `size='large'` since default size is `medium`
> Note: The horizontal padding is changed from `8px` to `12px` for the new `large` size which makes it visually bigger than the existing `medium` size
```diff
- <Badge>...</Badge>
+ <Badge size='large'>...</Badge>
```
