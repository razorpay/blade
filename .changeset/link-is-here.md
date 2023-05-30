---
'@razorpay/blade': minor
---

feat(Button): Support `href`, `target`, and `rel` on Button component.

You can now use `href` on Button which renders as `a` tag instead of button automatically.

```jsx
<Button href="https://youtu.be/iPaBUhIsslA" target="_blank" rel="noopener noreferrer">
  I am Link!
</Button>
```
