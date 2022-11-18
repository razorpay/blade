---
'@razorpay/blade': major
---

> **Warning**
>
> This is a breaking change for `Alert` component. The UI is updated to match the designs.

feat(Alert): design revamp

- `Alert` is updated to match the new designs
  - Bordered variant is now more compact and smaller in size
- A new `neutral` intent is added. This is the new default if you haven't passed any `intent` explicitly.

### Migration guide for consumers

- Earlier the default `intent` was `information`, this is now updated to `neutral`. If you were earlier using alerts without explicitly passing `intent` you should update that to continue using `information` as intent:

```diff
<Alert
+ intent="information"
/>
```
