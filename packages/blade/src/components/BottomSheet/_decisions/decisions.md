# Bottom Sheet

Bottom sheet is a container that presents additional information to a user in an overlay.

This document outlines the API of `BottomSheet` component.

<img src="./bottom-sheet-thumbnail.png" width="380" alt="" />

## Design

- [Figma - BottomSheet](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=26477%3A578228&t=1RMqjs99P33Udj0C-0)

## API

Sample usage:

```jsx
import { BottomSheet } from '@razorpay/blade';

<BottomSheet open={boolean} snapPoints={[]}>
  <BottomSheetHeader>
    <BottomSheetHeaderLeading title="Payments Links" prefix={} />
    <BottomSheetHeaderTrailing visual={} />
  </BottomSheetHeader>
  <BottomSheetBody>Body Content</BottomSheetBody>
  <BottomSheet>
    <BottomSheetLeading title="Footer Title" prefix={icon} />
    <BottomSheetTrailing
      actions={{
        primaryAction: { text: 'Know more', onClick: () => {} },
        secondaryAction: { text: 'Read Docs', onClick: () => {} },
      }}
    />
  </BottomSheet>
</BottomSheet>;
```

### `BottomSheet`

We'll expose an `BottomSheeet` component with the following API:

| Prop       | Type       | Default                 | Description                                        | Required |
| ---------- | ---------- | ----------------------- | -------------------------------------------------- | -------- |
| open       | `boolean`  | `false`                 | toggles bottom sheet state content                 |       |
| snapPoints | `string[]` | `['25%', '50%', '85%']` | snappoints in which the bottom sheeet will rest on |        |
| snapPoints | `string[]` | `['25%', '50%', '85%']` | snappoints in which the bottom sheeet will rest on |        |
| onDismiss | `Callback` | `undefined` | called when the bottom sheet is closed, either by user state, hitting `esc` or tapping backdrop |        |
| initialFocusRef | `React.Ref` | `undefined` | ref element you want to get keyboard focus when opening the sheet |   |

`PrimaryAction` and `SecondaryAction` will accept objects with the following keys:


### `BottomSheetBody`

| Prop       | Type              | Default     | Description                                                               | Required |
| ---------- | ----------------- | ----------- | ------------------------------------------------------------------------- | -------- |
| `children`    | `React.ReactNode` | `undefined` | Contents of the BottomSheet    | ✅        |


### `BottomSheetHeaderLeading` API


| Prop       | Type              | Default     | Description                                                               | Required |
| ---------- | ----------------- | ----------- | ------------------------------------------------------------------------- | -------- |
| `title`    | `string`          | `undefined` | Title of the Card                                                         | ✅        |
| `prefix`   | `IconComponent` | `undefined` | Prefix icon placed before title text   |          |

### `BottomSheetHeaderTrailing` API

| Prop     | Type              | Default     | Description                                                                                                                                     | Required |
| -------- | ----------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `visual` | `React.ReactNode` | `undefined` | Trailing visual element placed on right side of the header |          |

### `BottomSheetFooterLeading` API

| Prop       | Type     | Default     | Description          | Required |
| ---------- | -------- | ----------- | -------------------- | -------- |
| `title`    | `string` | `undefined` | Title of the BottomSheet footer    | ✅        |
| `prefix`   | `IconComponent` | `undefined` | Prefix icon placed before title text   |          |

### `BottomSheetFooterTrailing` API

| Prop      | Type                                     | Default     | Description                                | Required |
| --------- | ---------------------------------------- | ----------- | ------------------------------------------ | -------- |
| `actions` | `{ primary: Action, secondary: Action }` | `undefined` | Renders a primary/secondary action buttons |          |

```ts
type Action = {
  onClick: () => void;
  text: string;
  type?: 'button' | 'reset' | 'submit';
  accessibilityLabel: string;
  isLoading: boolean;
  isDisabled: boolean;
  icon: React.ReactNode;
  iconPosition: "left" | "right"
}
```

## a11y

Web: tbd

Native: tbd

## Usage

## Open questions

## References
