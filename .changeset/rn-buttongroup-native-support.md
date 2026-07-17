---
"@razorpay/blade": minor
---

feat(rn): add React Native support for ButtonGroup

Also includes supporting native changes for grouped buttons:
- BaseButton press/active border color and per-corner radii inside ButtonGroup
- Dropdown height / overlay behavior when used as a split-button trigger
- Popover native trigger now listens to both `onClick`/`onPress` and `onTouchEnd` (debounced) so taps open reliably inside ScrollView / ButtonGroup
