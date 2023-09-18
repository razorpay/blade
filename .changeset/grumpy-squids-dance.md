---
"@razorpay/blade": minor
---

feat(Dropdown): add isOpen and onOpenChange

> **Warning**
>
> This PR marks `onDismiss` as deprecated. While it continues to work, we recommend consumers to move to onOpenChange using migration steps below

### Migration from `onDismiss` on Dropdown

```diff
<Dropdown
- onDismiss={() => console.log('dismissed')}
+ onOpenChange={(isOpen) => {
+  if (!isOpen) {
+    console.log('dismissed');
+  }
+ }}
/>
```
