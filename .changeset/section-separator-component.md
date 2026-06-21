---
"@razorpay/blade": minor
---

feat(SectionSeparator): new component — section label with gradient fade line

A new `SectionSeparator` component that renders a section heading label alongside a 1px line that fades to transparent via CSS `linear-gradient`. Useful for visually delineating content sections with an elegant gradient rule.

**Usage:**
```tsx
import { SectionSeparator } from '@razorpay/blade/components';

<SectionSeparator label="Payment Details" variant="muted" />
```

**Props:**
- `label` — optional section heading text
- `variant` — `'normal' | 'subtle' | 'muted'` (default: `'muted'`) — controls line color intensity
- Supports all standard `StyledPropsBlade` layout props
