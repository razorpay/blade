# Bottom Sheet

Bottom sheet is a container that presents additional information to a user in an overlay.

This document outlines the API of `BottomSheet` component.

<img src="./bottom-sheet-thumbnail.png" width="380" alt="Thumbnail of bottom sheet" />

- [Bottom Sheet](#bottom-sheet)
  - [Design](#design)
  - [Anatomy](#anatomy)
  - [API](#api)
    - [`BottomSheet`](#bottomsheet)
    - [`BottomSheetBody`](#bottomsheetbody)
    - [`BottomSheetHeaderLeading` API](#bottomsheetheaderleading-api)
    - [`BottomSheetHeaderTrailing` API](#bottomsheetheadertrailing-api)
    - [`BottomSheetFooterLeading` API](#bottomsheetfooterleading-api)
    - [`BottomSheetFooterTrailing` API](#bottomsheetfootertrailing-api)
  - [Composition with DropDown](#composition-with-dropdown)
    - [Composition Example](#composition-example)
  - [Accessibility](#accessibility)
  - [Open questions](#open-questions)
  - [References](#references)

## Design

- [Figma - BottomSheet](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=26477%3A578228&t=1RMqjs99P33Udj0C-0)

## Anatomy

Components:

- BottomSheet
  - BottomSheetHeader
    - BottomSheetHeaderLeading
    - BottomSheetHeaderTrailing
  - BottomSheetBody
  - BottomSheetFooter
    - BottomSheetFooterLeading
    - BottomSheetFooterTrailing

## API

Sample usage:

```jsx
import { BottomSheet } from '@razorpay/blade';

<BottomSheet open={boolean} snapPoints={[]}>
  <BottomSheetHeader>
    <BottomSheetHeaderLeading title="Payments Links" prefix={BladeIcon} />
    <BottomSheetHeaderTrailing visual={Link | Action | Icon} />
  </BottomSheetHeader>
  <BottomSheetBody>
    <Text>Body Content<Text>
  </BottomSheetBody>
  <BottomSheetFooter>
    <BottomSheetFooterLeading title="Footer Title" prefix={icon} />
    <BottomSheetFooterTrailing
      actions={{
        primaryAction: { text: 'Know more', onClick: () => {} },
        secondaryAction: { text: 'Read Docs', onClick: () => {} },
      }}
    />
  </BottomSheetFooter>
</BottomSheet>;
```

**Design Constraints**

- BottomSheetHeader:
  - Leading:
    - Title
    - Prefix
  - Trailing:
    - empty
    - icon
    - link
    - action

- BottomSheetFooter:
  - Leading
    - title
    - prefix
  - Trailing
    - Primary action button
    - Secondary action button

- The BottomSheetFooter will behave similar to Card's footer.
- The Header, Footer can be individually omitted

### `BottomSheet`

We'll expose a `BottomSheet` component with the following API:

| Prop            | Type        | Default                 | Description                                                                                     | Required |
| --------------- | ----------- | ----------------------- | ----------------------------------------------------------------------------------------------- | -------- |
| open            | `boolean`   | `false`                 | toggles bottom sheet state content                                                              |          |
| snapPoints      | `[number, number, number]`  | `[0.35, 0.5, 0.85]` | Snappoints in which the bottom sheeet will rest on, this accepts a number between 0 & 1 which maps to the total view height of the screen. 0.5 means 50% of screen height.                                              |          |
| onDismiss       | `Callback`  | `undefined`             | called when the bottom sheet is closed, either by user state, hitting `esc` or tapping backdrop |          |
| initialFocusRef | `React.Ref` | `undefined`             | ref element you want to get keyboard focus when opening the sheet                               |          |

### `BottomSheetBody`

| Prop       | Type              | Default     | Description                 | Required |
| ---------- | ----------------- | ----------- | --------------------------- | -------- |
| `children` | `React.ReactNode` | `undefined` | Contents of the BottomSheet | ✅       |

### `BottomSheetHeaderLeading` API

| Prop     | Type            | Default     | Description                          | Required |
| -------- | --------------- | ----------- | ------------------------------------ | -------- |
| `title`  | `string`        | `undefined` | Title of the Header                    | ✅       |
| `prefix` | `IconComponent` | `undefined` | Prefix icon placed before title text |          |

### `BottomSheetHeaderTrailing` API

| Prop     | Type                 | Default     | Description                                                | Required |
| -------- | -------------------- | ----------- | ---------------------------------------------------------- | -------- |
| `visual` | `Link, Action, Icon` | `undefined` | Trailing visual element placed on right side of the header |          |

### `BottomSheetFooterLeading` API

| Prop     | Type            | Default     | Description                          | Required |
| -------- | --------------- | ----------- | ------------------------------------ | -------- |
| `title`  | `string`        | `undefined` | Title of the BottomSheet footer      | ✅       |
| `prefix` | `IconComponent` | `undefined` | Prefix icon placed before title text |          |

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
  iconPosition: 'left' | 'right';
};
```

## Composition with Dropdown

We will export `BottomSheet` component separately as an independant component but generally the pattern will be to use it with SelectInput, where in mobile devices the Select's dropdown will be replaced by the BottomSheet.

There are two approaches to doing it:

1. We coupled the BottomSheet & SelectInput tightly and internally conditionally switch the components

Pros:

- Easy implementation for user's end
- User's don't have to think about breakpoints, conditional rendering etc
- From blade side, we will have greater control over the pattern

Cons:

- Bundle size will be impacted, even if users are desktop they will get the bundle of BottomSheet (vice versa)

2. We expose BottomSheet indepandantly and let users lazy load the component as needed

Pros:

- No uneccesary bundle size impact for any of the platforms

Cons:

- Not trivial to implement from user's end, they will have to compose the BottomSheet & Select as per their needs.


Considering the bundle size downside to approach 1, we decided to go ahead with approach 2.

### Composition Example

```jsx
import { Spinner, useTheme, useBreakpoint } from "@razorpay/blade";

const BottomSheet = React.lazy();
const DropdownOverlay = React.lazy();

const App = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Dropdown selectionType={selectionType}>
      <SelectInput label="Select Action" />
      {/* We can either put a fallback spinner or show skeleton loaders */}
      <React.Suspense fallback={<Spinner />}>
        {isMobile ? (
          <BottomSheet>
            <BottomSheetHeader>
              <BottomSheetHeaderLeading title="Payments Links" prefix={PayIcon} />
            </BottomSheetHeader>
            <BottomSheetBody>
              <SelectContent />
            </BottomSheetBody>
            <BottomSheet>
              <BottomSheetLeading title="Footer Title" prefix={icon} />
              <BottomSheetTrailing
                actions={{
                  primaryAction: { text: 'Confirm' },
                  secondaryAction: { text: 'Close' },
                }}
              />
            </BottomSheet>
          </BottomSheet>
        ) : (
          <DropdownOverlay>
            <SelectContent />
          </DropdownOverlay>
        )}
      </React.Suspense>
    </Dropdown>
  );
};

const SelectContent = () => {
  return (
    <ActionList>
      <ActionListItem
        leading={<ActionListItemIcon icon={SettingsIcon} />}
        title="Settings"
        value="settings"
      />
      <ActionListItem leading={<ActionListItemIcon icon={InfoIcon} />} title="Info" value="info" />
    </ActionList>
  );
};

```

**Q.** Why can't we lazy load from blade side? 

There are two major reasons: 


1. It's generally not feasible to lazy load components from library side, We can't possibly know where & how a blade component can be used or imported in the user's codebase. Even if we know that it will also require changes in how we bundle blade, since right now blade distributes the bundle in single index.js chunks, introducing lazy loading will create more fragmented chunks. 

2. There are multiple ways to lazy load react components and it depends on the app's architecture. For example, React.lazy only does client side lazy loading while loadable support SSR too, thus the descision needs to be handed over to the consumers to import & integrate the components as they fit on their stack.


## Accessibility

The bottom sheet will follow the accessibility charechtaristics of a Modal.

[APG Guidelines for Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

Behaviours:

- Tab, Shift+Tab should cycle the focused elements
- The focus should be trapped inside the bottom sheet
- Escape closes the bottom sheet, after closing the focus will go to the triggered element
- When opening the bottom sheet it should either focus on the first focusable element on the sheet or element provided by the user via `initialFocusRef` prop

## Open questions

1. What is `action` in the header trailing visual?
2. In BottomSheetHeaderLeaing & BottomSheetFooterLeading will the `prefix` only support Icon component?
3. In BottomSheetBody will we only have ActionList or users can add any of their own components too? 

## References

- https://github.com/stipsan/react-spring-bottom-sheet
- https://github.com/gorhom/react-native-bottom-sheet
- https://m2.material.io/components/sheets-bottom
