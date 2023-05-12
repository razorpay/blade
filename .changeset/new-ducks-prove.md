---
'@razorpay/blade': minor
---

feat(blade): added bottomsheet component


### Migration guide from prerelease version

Update the imports:

```diff
import {
-  BottomSheet_PRE_RELEASE,
+  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter
} from "@razorpay/blade/components"
```

Changed Header Footer API:

**Header**

Prop changes: 

- Removed prefix/suffix props and added new props

```diff
-  title: string;
+  title?: string;
  subtitle?: string;
-  prefix?: React.ReactNode;
-  suffix?: React.ReactNode;
+  leading?: React.ReactNode;
+  trailing?: React.ReactNode;
+  titleSuffix?: React.ReactNode;
+  showDivider?: boolean;
+  showBackButton?: boolean;
+  onBackButtonClick?: () => void;
+  closeButtonRef: React.MutableRefObject<any>;
```

**Footer**

Footer component now accepts JSX content

Before:

```jsx
<BottomSheetFooter
  trailing={{
    primary: {
      text: 'Hello',
      onClick: () => {},
    },
    secondary: {
      text: 'World',
      onClick: () => {},
    },
  }}
/>
```

After:

```jsx
<BottomSheetFooter>
  <Button isFullWidth variant="secondary" onClick={() => {}}>
    Hello
  </Button>
  <Button isFullWidth marginTop="spacing.5" onClick={() => {}}>
    World
  </Button>
</BottomSheetFooter>
```
