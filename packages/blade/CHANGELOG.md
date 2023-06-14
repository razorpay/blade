# @razorpay/blade

## 8.8.3

### Patch Changes

- 163717cf: fix(DropdownOverlay): DropdownOverlay width in SelectInput trigger

## 8.8.2

### Patch Changes

- 40f05a94: fix(blade): BottomSheet unable to find ActionList component
- ab4f10c4: fix: make Badge and Counter display inline-flex

## 8.8.1

### Patch Changes

- 9456e9d3: fix(BaseInput): large label alignment
- c8727e89: fix(tokens): update primary color theme tokens
- 19749c7a: fix(blade): jsdoc comments

## 8.8.0

### Minor Changes

- 20c9fc03: feat(Input): add `generic` value in `autoCompleteSuggestionType`
- 9db8c219: feat: add Modal component

### Patch Changes

- 9db8c219: chore: update overlay color tokens
- f78834ea: fix(Amount): Make Amount display `inline-flex`

## 8.7.0

### Minor Changes

- fc46b240: feat(Code): add `isHighlighted` prop
- f0b7a66b: feat(Typography): expose `color` from Typography components like `Text`, `Heading`, `Title`, `Code`

### Patch Changes

- b9394c66: fix: update migrate-typography script

## 8.6.1

### Patch Changes

- 93626965: fix: ActionList border style

## 8.6.0

### Minor Changes

- 8348634c: feat(Link): add `xsmall` Link size
- 26a7d38c: feat(Button): Support `href`, `target`, and `rel` on Button component.

  You can now use `href` on Button which renders as `a` tag instead of button automatically.

  ```jsx
  <Button href="https://youtu.be/iPaBUhIsslA" target="_blank" rel="noopener noreferrer">
    I am Link!
  </Button>
  ```

- 4ff72975: feat(DropdownLink): add `DropdownLink` trigger for Dropdown

  Checkout [Checkout DropdownLink Documentation](https://blade.razorpay.com/?path=/story/components-dropdown-with-button-and-link--with-link&globals=measureEnabled:false)

- 3fe1ff8f: feat(blade): add textAlign to Box

### Patch Changes

- 14e5057e: fix: add min-width and max-width in Menu trigger Dropdown to fix width issues
- 69a1bcef: chore(blade): improve BottomSheet documentation & added jsdoc
- 4df0b721: fix(SelectInput): single select value clear

  - You can pass `''` (empty string) in single select `value` prop to clear the selected value now.

## 8.5.0

### Minor Changes

- 4a6ae99c: feat(Switch): add Switch component

### Patch Changes

- 245f677c: chore(blade): export switch

## 8.4.1

### Patch Changes

- d30a7fd4: fix(blade): fix code & amount typography alignment issues

## 8.4.0

### Minor Changes

- 4fb0f3fe: feat(Box): add `onScroll`, `onMouseOver`, `onMouseEnter`, `onMouseLeave` events

## 8.3.0

### Minor Changes

- 06da7a2f: feat(Box): add `ref` support

## 8.2.3

### Patch Changes

- ec18776c: fix: blade builds on npm & github

## 8.2.2

> **Warning**
>
> There were some build issues associated with this release, please upgrade to version >= 8.2.3 where this issue was resolved

### Patch Changes

- e4dcdfc4: build: fix npm publish by generating .npmrc in monorepo root

## 8.2.1

> **Warning**
>
> There were some build issues associated with this release, please upgrade to version >= 8.2.3 where this issue was resolved

### Patch Changes

- 1ab67fc7: fix: css vars build script with new elevation tokens

## 8.2.0

> **Warning**
>
> There were some build issues associated with this release, please upgrade to version >= 8.2.3 where this issue was resolved

### Minor Changes

- 16d0e9e3: feat: add new `elevation` tokens
  This release adds new shadow tokens. Previously we had the following shadow tokens

1. `level1`
2. `level2`
3. `level3`
4. `level4`
5. `level5`

Plus we didn't had proper ways of using tokens across web and native like we have for our other tokens like Colors, Typography, Spacing, Motion, etc.

Now the new introduced levels are:

1. `none`
2. `lowRaised`
3. `midRasied`
4. `highRaised`

These tokens now will work across ios, android and web and will add all the require properties automatically for eg:

- on web we have 2 layers of shadow as per new token values

```
{
  /** offset-x | offset-y | blur-radius | spread-radius | color, offset-x | offset-y | blur-radius | spread-radius | color */
  lowRaised: `0 4px 8px -2px hsla(217, 56%, 17%, 0.1), 0 2px 4px -2px hsla(217, 56%, 17%, 0.06)`,
  midRaised: `0 12px 16px -4px hsla(217, 56%, 17%, 0.08), 0 4px 6px -2px hsla(217, 56%, 17%, 0.03)`,
  highRaised: `0 24px 48px -12px hsla(217, 56%, 17%, 0.18)`
}
```

- for RN, we can't have multi-layer shadows plus android and iOS both treat shadows differently, but now we have parity

```
{
  // android only
  elevation: 4,
  shadowColor: 'hsla(217, 56%, 17%, 0.64)', // works on both
  // ios only
  shadowOpacity: 0.12,
  shadowRadius: 2,
  shadowOffset: {
    width: 0,
    height: 3,
  },
}
```

but all this is now abstracted and as a developer, you can do this across platforms:

```
theme.elevation.lowRaised // this will add necessary props based on the platform
```

Read the entire decision [doc here](https://docs.google.com/document/d/1GQEd-1JXFDbv3JsBMB2TgiSn8EJE43Gtm_Xtb_8dn04/edit)

## 8.1.0

### Minor Changes

- 9f2dabfd: feat: add border support to Box component

## 8.0.0

### Major Changes

- 9917a5cd: feat(Dropdown): Controlled Dropdown and Button Trigger

  - Adds API to seamlessly build controlled dropdown
  - Add DropdownButton component to trigger dropdown using Button
  - Removes `isDefaultSelected` from `ActionListItem` _(see migration guide below)_

  > **Warning**
  >
  > **Breaking change** for consumers who -
  >
  > - Use `isDefaultSelected` on `ActionListItem` component
  > - Use `onChange` on `SelectInput` (under some scenarios. Check migration guide below)
  >
  > Rest of the consumers can safely upgrade without any migration

  ### Migration Guide

  #### `isDefaultSelected` Migration

  We have removed `isDefaultSelected` from `<ActionListItem />` component. [Check out API decision](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Dropdown/_decisions/controlled-dropdown.md) for reasoning

  If you were using it as a workaround for controlled selection,

  - We now have a first class controlled selection support with `value` and `onChange` prop on `SelectInput`.

    Checkout CodeSandbox Example for new API - https://codesandbox.io/s/blade-controlled-select-vxg30b

  If you were using `isDefaultSelected` for default selections, you can now use `defaultValue` on SelectInput

  - Remove `isDefaultSelected` and use `defaultValue` on SelectInput. You can pass array of values to `defaultValue` in case of multiselect
    ```diff
    <Dropdown>
      <SelectInput
        label="Select City"
    +   defaultValue="mumbai"
      />
      <DropdownOverlay>
        <ActionListItem
          title="Mumbai"
          value="mumbai"
    -     isDefaultSelected
         />
        <ActionListItem title="Bangalore" value="bangalore" />
      </DropdownOverlay>
    </Dropdown>
    ```

  #### `onChange` on SelectInput Migration

  As a part of [bug fix](https://github.com/razorpay/blade/issues/1102), `onChange` will now **NOT** be called on initial render
  like it previously did. This will only require migration if you were earlier relying on `onChange` to set initial value.

  If you were relying on `onChange` to set initial value, you can now move those values to your `useState`'s initial value.

  ```tsx
  const Example = (): JSX.Element => {
    const [cities, setCities] = React.useState();
    return (
      <>
        <Dropdown>
          <SelectInput label="Cities" onChange={({values}) => setCities(values) } />
          <DropdownOverlay>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
          </DropdownOverlay>
        </Dropdown>
        <Text>{cities}</Text>
        {/*
          In earlier versions, value of `cities` would've been `['']`
          (because onChange would've been called initially to set array with empty string value)

          Now it will output undefined (anything you pass in your useState) as the onChange wouldn't be called on initial render
        */}
      <>
    )
  }
  ```

## 7.2.2

### Patch Changes

- 2a6b8c89: chore: add meta attribute `data-component-from-blade='true'` to native components

## 7.2.1

### Patch Changes

- 40a16da7: fix(blade): BottomSheet body dynamic height
- e0f80522: feat(blade): added bottomsheet component ids

## 7.2.0

### Minor Changes

- 1333e756: feat(blade): added bottomsheet component

  > For react-native consumers make sure to [go through the installation guide](https://blade.razorpay.com/?path=/docs/guides-installation--page#-add-blade-to-your-application) on how to setup the peer dependencies

  <details>
    <summary>⚠️ Migration guide from prerelease version</summary>

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

  </details>

## 7.1.3

### Patch Changes

- 73011827: fix(BottomSheet): ensure that the BottomSheet's lower snappoint will have a buffer
- f2130469: fix(blade): bottomsheet isOpen state, simplify isOpen logic & glue code

  Previously if users did not changed the isOpen state to false inside `onDismiss` the bottomsheet's internal state will still remain "open", but the bottomsheet would visually be hidden and the backdrop will still remain, this fixes the bug so that internally we won't modify the bottomsheet's position instead we will just call the `onDismiss`. [Check the loom](https://www.loom.com/share/f24fcb51b245431fbf1a0aeb53cea287) video here for more info.

- 24d2a0b0: fix(cardFooter): alignment issue

## 7.1.2

### Patch Changes

- 69ef5042: fix(blade): BottomSheet unable to scroll content

## 7.1.1

### Patch Changes

- 85737340: fix(SelectInput): dropdown without label takes up margin space

  A dropdown without any label will now correctly take no extra space for the margin

## 7.1.0

### Minor Changes

- 85289118: feat(blade): BottomSheet prerelease

  > **Warning**
  >
  > The final `BottomSheet` API isn't final and subjected to change as we work on stabilizing the component.

## 7.0.4

### Patch Changes

- e3d5321c: perf(blade): integrate SectionList in ActionList

## 7.0.3

### Patch Changes

- 6f7ec83f: fix(Box): add correct prop types in react native Box
- abc4c156: fix(colors): incorrect value of ashGrayLight.1200

  There was a typo earlier in the value of the token.

- fce1c767: feat(TextInput): add note on `type="number"` attribute
- c0701725: fix: remove internal BaseBox export (no change for consumers)

## 7.0.2

### Patch Changes

- 71b4a85b: feat: add `htmlTitle` prop support for Link component on web

## 7.0.1

### Patch Changes

- 0f6e2ad7: fix: ref breakage on react native
- 9963a7be: feat(package.json): add "main" field to package.json

## 7.0.0

### Major Changes

- 5248ea66: feat(Typography): streamline typography scale

  > **Warning**
  >
  > Breaking Change!
  > This is a breaking change for typography components and lineHeight scale
  >
  > We have written codemod to ease this process so please follow the [migration guide thoroughly](#breaking-changes)

  ### Component Changes:

  - Title:
    - Added `xlarge` size
  - Text:
    - Added `large` size
  - Link:
    - Added `large` size
  - Code:
    - Added `weight=bold`

  ### Breaking Changes:

  - Title:
    - Replace all `large` size variants to `xlarge`

  ```diff
  - <Title size="large">hello world</Title>
  + <Title size="xlarge">hello world</Title>
  ```

  ***

  ### Line-height scale changes

  New scale has been changed to use numbered values for more flexibility, to read more about the changes [check this doc](https://docs.google.com/document/d/16j8dIKuQF9GjDgkhkZwnokVGNeoK7R-7zzIXHCgvveA/edit).

  #### **Migration guide:**

  Replace old named tokens to corresponding numbered values:

  For example:

  ```diff
  - theme.typography.lineHeights.s
  + theme.typography.lineHeights[50]
  ```

  **Old vs New mappings:**

  | old | new |
  | --- | --- |
  | s   | 50  |
  | m   | 50  |
  | l   | 100 |
  | xl  | 200 |
  | 2xl | 300 |
  | 3xl | 400 |
  | 4xl | 600 |
  | 5xl | 700 |
  | 6xl | 800 |

  #### **Migrate with Codemod:**

  To change all instances of `theme.typography.lineHeights` to the new scale automatically use this codemod:

  **Step1:** Install this version of blade

  **Step2:** Run the codemod with the following command

  > Checkout [jscodeshift docs](https://github.com/facebook/jscodeshift) for further cli usage help.

  ```sh
  npx jscodeshift ./YOUR_DIR --extensions=tsx,ts,jsx,js -t ./node_modules/@razorpay/blade/codemods/migrate-typography/transformers/migrate-typography.ts --ignore-pattern="**/node_modules/**"
  ```

  > **Note**
  >
  > This codemod will cover 80% of the usecases, but it might miss certain edge cases, it is advised to thoroughly test & check the code to ensure nothing is missed.

## 6.7.0

### Minor Changes

- 0c8e5f1b: feat: add `Amount` component

  ### Usage

  ```tsx
  <Amount value={10000} />
  ```

## 6.6.3

### Patch Changes

- 0d7bb723: fix(blade): FileTextIcon alignment
- b62358cb: perf: improve dropdown/actionlist performance

## 6.6.2

### Patch Changes

- c7c66051: fix: ListItemLink alignment

## 6.6.1

### Patch Changes

- fe89e6f6: fix: tree-shaking in blade components
- 7817c9e3: feat(Box): add different types for `display` on react native
- c6512ba0: fix(Alert, Card): set `box-sizing` as `border-box` for Alert and Card

## 6.6.0

### Minor Changes

- 5863f939: feat(OTPInput): add `onFocus` & `onBlur` props
- 75daaa3c: feat(theme): add `name` property in `theme` to watch on theme changes

### Patch Changes

- 6a8524ab: feat(Link): add `hitSlop` support for native

## 6.5.2

### Patch Changes

- 2700667f: fix(SelectInput): call user passed onBlur callback
- 3855a583: fix(Card): CardHeader title alignment when subtitle is not present

## 6.5.1

### Patch Changes

- 86cd05a6: chore(blade): update meta constant of Box

## 6.5.0

### Minor Changes

- a4be1b06: feat(Layout Primitives): Add `Box` Component and Styled Props to Blade Components

  Documentation: https://blade.razorpay.com/?path=/docs/components-layout-primitives-box-layout-primitives-tutorial--page

  **Breakpoint Token Changes**

  `max` breakpoint is removed as it wasn't used and had same value as `xl`.
  Through our audit, we didn't find any usage of this token. If you happen to use this somewhere, you can rename `breakpoints.max` to `breakpoints.xl`

- 2c7034b7: feat(Input): add onSubmit prop on BaseInput, TextInput, TextArea, & PasswordInput for react-native

## 6.4.0

### Minor Changes

- 4145d553: feat: add `testID` prop to all components
- a7826b0b: feat(Input): add `autoCapitalize` support to `BaseInput`, `TextInput` & `PasswordInput`
- bdd74d7a: feat(Text): add `textAlign` prop

### Patch Changes

- da4489b3: fix: lodash tree shaking to reduce effective bundle-size.

## 6.3.0

### Minor Changes

- a2518742: feat(icons): add BulkPayoutsIcon

## 6.2.3

### Patch Changes

- cbb1424b: fix: change import to default in package exports

  Jest does not support the "import" condition in exports. This was causing tests to fail for Blade consumers. Changed "import" to "default" which is supported by all tools. Since Blade is not exporting a dual package, we don't need the "import" condition.

## 6.2.2

### Patch Changes

- 559d97d9: feat: support string array in children

  Users can now use dynamic variables inside children and don't have to wrap it around with string literals

  ```jsx
  <Button onClick={}>{someVariable} hello</Button>
  ```

## 6.2.1

### Patch Changes

- 7016c215: fix(Dropdown): infinite render onChange, positioning in flex container

## 6.2.0

### Minor Changes

- bb2f1561: feat(Dropdown): Add `Dropdown`, `Select`, `ActionList`.

  Check out [Dropdown Story](https://blade.razorpay.com/?path=/docs/components-dropdown-with-select) for usage

### Patch Changes

- 505ca975: fix(checkbox): fixed screen reader styles

  Fixed a bug where if we have lots of checkboxes in a small overflowed container the browser is trying to jump to the hidden inputs which is causing unexpected jumps in the scroll.

## 6.1.0

### Minor Changes

- aff735ba: feat: add `List`, `ListItem`, `ListItemLink` & `ListItemCode` components

## 6.0.5

### Patch Changes

- 38e8e6d0: chore(OTPInput): add `autoCompleteSuggestionType` prop and disable password manager with `isMasked`

  We wanted to disable the password managers for OTPInput when `isMasked` is set. The straightforward way to do this is set autocomplete='off' (i.e autoCompleteSuggestionType='none'). The issue with autocomplete is that its not an enforcement but a suggestion to the browser to follow. Safari mostly adheres to it but Chrome and Firefox ignores it and shows the password managers anyway. We decided on a workaround to unset `type` on first render and set it to `password` once a value is entered. This way the password managers won't make any suggestions when the user is on an empty OTP input field.

## 6.0.4

### Patch Changes

- 26ffc564: fix: add types field to package exports for ESM TypeScript projects

## 6.0.3

### Patch Changes

- c95e814a: chore(blade): fix dependabot alerts
- d2cfab2d: fix(blade): checkbox icon wrapper position

  Fixed a bug in checkbox where the checkbox icon was flaoting outside it's wrapper because we've added `position: absolute` in the FadeIn animation component but forgot to add `position: relative` in the parent wrapper.

## 6.0.2

### Patch Changes

- ba5ec1ac: fix: mark react-native peerDependencies as optional
- 4a178a79: fix(Alert): color of title and description

  - The color of title and description will look slightly subtle now to match the current designs.
  - Internally uses the `subtle` type correctly now to fix a discrepancy in color for title and description.

## 6.0.1

### Patch Changes

- 62a98bb1: fix(blade): update BaseInput background color

## 6.0.0

### Major Changes

- 980bc038: fix(Alert)!: fix typo in prop `isDismissible`

  > **Warning**
  >
  > Breaking change. Update prop `isDismissable` to `isDismissible`.

  ### Migration guide

  Find and replace:

  ```diff
  <Alert
  - isDismissable
  + isDismissible
  />
  ```

- 5f7e4876: feat(blade): added all icons from figma

  **Breaking Changes:**

  - Renamed `RefreshLeft` icon to `Refresh`

### Minor Changes

- 82d75b71: chore(blade): added new icons
- 29238f1e: feat(blade): added ref support for input components

## 5.5.1

### Patch Changes

- 735e370: fix(blade): update peerDependencies to support react v18

## 5.5.0

### Minor Changes

- a094736: feat: expose `onFocus` on `TextInput` and `TextArea`
- 2c2841a: added transaction icon
- 46425d3: feat(blade): add ClockIcon
- 1dd920e: feat(Icons): add BankIcon
- 227be3d: added tag, shuffle, user, book, and settlements icons
- e64d7cc: chore: design changes for Badge, Counter, Spinner

### Patch Changes

- ba16503: fix(blade): TextInput clear button state on initial render

## 5.4.3

### Patch Changes

- e6c3ea9: fix(blade): restrict childrens in Card component

## 5.4.2

### Patch Changes

- da470b0: fix: remove `maxWidth` from Badge

## 5.4.1

### Patch Changes

- 7eb6e4c: feat(Code): Use alpha 50 token in Code component's background

## 5.4.0

### Minor Changes

- 5c8005f: feat: add `ProgressBar` component

## 5.3.0

### Minor Changes

- 26baa81: feat(blade): added Card component

## 5.2.1

### Patch Changes

- 9966931: chore: fix dom nesting in form label component
- e660831: fix: change acceptable BaseInput `type` from `numeric` to `number`

## 5.2.0

### Minor Changes

- d03de10: feat(Alert): update `isFullWidth` to make inline borderless alerts on desktop

  > **Warning**
  >
  > `isBorderless` prop is removed and its usage is now replaced by `isFullWidth`. The layout is updated to match the designs and is now centered on desktop resolutions.

  ### Steps for migration:

  ```diff
  <Alert
  - isBorderless
  + isFullWidth
  />
  ```

## 5.1.5

### Patch Changes

- 756f4b4: feat: allow masked otp input

`OTPInput` now supports an `isMasked` prop

## 5.1.4

### Patch Changes

- 71f274e: fix(Checkbox): allow Checkbox to accept `childern` prop of type `React.ReactNode`

## 5.1.3

### Patch Changes

- af9bdc9: fix(Alert): responsive design alignment

## 5.1.2

### Patch Changes

- bd0b675: chore(blade): added blade component data attributes

## 5.1.1

### Patch Changes

- 5a6b980: feat: add Mail icon

## 5.1.0

### Minor Changes

- d4b981e: fix: show `Spinner` on `TextInput` when `isLoading=true`
  - Adds spinner when `isLoading: true` is passed to `TextInput`. This was a long pending TODO
  - Update Spinner sizes after the design was updated \* This doesn't need any code mod since there are 9 instances of spinner being used with default variant i.e medium

## 5.0.1

### Patch Changes

- 96cf25f: feat: add new icons (lock, settings, file-text, users, slash)

## 5.0.0

### Major Changes

- fc2a3bf:

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

### Patch Changes

- bb170bb: fix: set input type='text' when type='search' passed

## 4.0.0

### Major Changes

- d747de4: chore: Badge design changes

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

## 3.8.0

### Minor Changes

- 32c1f05: feat(Counter): design changes

  - Added small variant in Counter
  - Fixed italic font

## 3.7.1

### Patch Changes

- 03bb818: feat(tokens): add new tokens
  - updates color tokens of banking theme to match the designs
- 002e0a2: feat(tokens): add new tokens
  - Updates tokens for payment theme to match the designs
- 66f473e: fix: remove aria-hidden for checkbox and radio

## 3.7.0

### Minor Changes

- 67e5059: feat(Indicator): add Indicator component

## 3.6.2

### Patch Changes

- 63c950a: feat(IconButton): export IconButton
  - Adds a new `IconButton` component useful for making transparent icon only buttons

## 3.6.1

### Patch Changes

- add9b3e: fix(Typography): inherit `text-align` property from parent in Typography components

## 3.6.0

### Minor Changes

- 0f4df3a: feat(blade): added counter component
- c5b28bc: feat(tokens): add new tokens to neutral palette

## 3.5.3

### Patch Changes

- 92cfa80: fix(Alert): throw error if `secondaryAction` is defined without `primaryAction`

## 3.5.2

### Patch Changes

- ffe9872: fix: `@babel-runtime` issues when importing in codesandbox and vite

## 3.5.1

### Patch Changes

- dea879d: fix(IconButton): add `type="button"` to stop form submission

## 3.5.0

### Minor Changes

- 8dc131d: feat(blade): added `small` variant in Checkbox/Radio

## 3.4.2

### Patch Changes

- 48c36af: feat: add README to npm

## 3.4.1

### Patch Changes

- 49894f2: feat: adding Link icon

## 3.4.0

### Minor Changes

- 6429d93: feat(Link): add `size` prop and support for `small` size

  > **Note**
  >
  > Icons in links are slightly bumped up now to match the designs

  <img width="379" alt="image" src="https://user-images.githubusercontent.com/6682655/196698626-e73dcc07-3d35-49e1-8ead-95c5826f3c41.png">

## 3.3.0

### Minor Changes

- 37c00c0: feat: publish `@razorpay/blade` package on NPM

  _No changes are required for consumer. We will be publishing on both, github package registry and npm._

## 3.2.0

### Minor Changes

- f7e8941: added RotateCounterClockWiseIcon, TrendingUpIcon, TrendingDownIcon, ExternalLinkIcon, HelpCircleIcon

## 3.1.6

### Patch Changes

- 66d3184: Update few tokens value which was typo on figma

## 3.1.5

### Patch Changes

- a539fe5: feat(tokens): add new tokens

## 3.1.4

### Patch Changes

- f0b901d: chore: remove border from Badge component

## 3.1.3

### Patch Changes

- 2576ce3: fix(link): add type prop for button variant

## 3.1.2

### Patch Changes

- ba0c74d: fix: use the correct maxWidth for OTPInput

## 3.1.1

### Patch Changes

- aee7e57: feat(Icons): add MinusIcon

## 3.1.0

### Minor Changes

- c3d9d2f: feat: add OTPInput component

## 3.0.0

### Major Changes

- 3aebc58: feat(Typography): make `size` prop consistent for `Heading`, `Title`, and `Text`

  > **Warning**
  >
  > Breaking Change!
  > This is a breaking change for apps that are using `Title` or `Heading` component from blade. Rest of the apps can upgrade without any migrations.

  #### Migration

  _**Tip:** If you're using TypeScript, run `yarn tsc` and that should throw errors wherever a change is required._

  1. **`<Title />`:** Rename `variant` prop to `size` in Title

  ```diff
  - <Title variant="small">Some Title</Title>
  + <Title size="small">Some Title</Title>
  ```

  2. **`<Heading />`:** Rename `variant` prop to `size` if the value is `small`, `medium,` or `large`. No change is required on `variant="subheading"`.

  ```diff
  <Heading variant="subheading">Nothing changes here</Heading> // No change here

  - <Heading variant="medium">Medium Heading</Heading>
  + <Heading size="medium">Medium Heading</Heading>
  ```

  ##### Edge Cases

  Make sure to follow migration on new component if `Title` or `Heading` from blade is overriden with styled-components.

  ```diff
  const MyTitle = styled(Title)`
    // some styles
  `

  - <MyTitle variant="large" />
  + <MyTitle size="large" />
  ```

- e16c154: feat(PasswordInput)!: rename from `PasswordField` to `PasswordInput`

  #### Migration

  > **Warning**
  >
  > Breaking change!

  Rename occurences of `PasswordField` to `PasswordInput`, no changes in the API.

  ```diff
  - PasswordField
  + PasswordInput
  ```

### Minor Changes

- eeba339: feat(Code): add `<Code />` component :shipit:

## 2.5.1

### Patch Changes

- 0ce8390: fix(BaseInput): use cursor not-allowed for disabled inputs

## 2.5.0

### Minor Changes

- d0017cd: feat(PasswordField): add final export :tada:
  - adds a new `PasswordField` component

## 2.4.0

### Minor Changes

- bf92637: feat(blade): Improve platform types with TS 4.7

  ### Added support for platform dependant types

  Migration Steps

  1. Upgrade to TypeScript 4.7+
  2. In `tsconfig.json` add `moduleSuffix: ['.web', '']` or `moduleSuffix: ['.native', '']` (depending on the platform)

  ```js
  {
    "compilerOptions": {
      // For react-native use `.native`
      // For web use `.web` extension
      "moduleSuffixes": [".web", ""]
    }
  }
  ```

  > **Note**:
  > if you are on <TS 4.7 or don't specify the `moduleSuffixes` blade will fallback to resolving `web` types

## 2.3.0

### Minor Changes

- 887cd11: feat(blade): added TextArea component

## 2.2.2

### Patch Changes

- a8c5c08: tests: add tests for `TextInput`
  fix: render clear button on mount when the `defaultValue` or `value` is passed

## 2.2.1

### Patch Changes

- 4b6bfda: fix: update spinner easing

## 2.2.0

### Minor Changes

- 7c272be: feat: add `Spinner` component
  - Also adds an internal `BaseSpinner` component

## 2.1.0

### Minor Changes

- a6bf780: feat(TextInput): add TextInput Field

  ### This release publishes **`TextField`** Input

  #### [Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A210737)

  #### Capabilities

  - Support for various `type` of TextInput i.e `'text' | 'telephone' | 'email' | 'url' | 'numeric' | 'search'`
  - Automatically decide `keyboardType`, `keyboardReturnKeyType`, `autoCompleteSuggestionType` based on `type` attribute alone

  ![image](https://user-images.githubusercontent.com/11384858/188391913-d45e40b4-1b92-4fab-8bf8-8d49891929f8.png)

  - Max characters to be accepted by the input field which will in turn also render a counter
    ![image](https://user-images.githubusercontent.com/11384858/188390436-2854807d-5fb0-42de-8171-3ba61be4b9f6.png)

  - Clear the content of the input field with the help of a clear button
    ![image](https://user-images.githubusercontent.com/11384858/188391183-8e262200-7424-4a80-a5fe-1c7166be26ce.png)

  - Attach `prefix` and `suffix` to the input field
  - Fully Accessible

### Patch Changes

- a8c7620: ## Internal changes

  tests(BaseInput): add web tests and fix onBlur

  - Adds `onBlur`

- 1417e90: changed native text-input helptext color

## 2.0.0

### Major Changes

- cc4355a: feat(blade): added 2px spacing token

  #### Breaking changes

> **Note**
>
> This breaking change affects you only if you're using the tokens directly somewhere. If you're only using the components then nothing needs to be updated at your end.

- Added 2px token, thus all spacing tokens have shifted by 1 step.

#### Migration steps

Shift every spacing token other than the first one (`0th` index) by +1

```diff
- <div style={{ margin: theme.spacing[1] }} />
+ <div style={{ margin: theme.spacing[2] }} />
```

### Patch Changes

- a402ef1: feat(icons): add `RefreshLeft` icon

## 1.1.0

### Minor Changes

- 5f1033c: feat: add `Alert` component :tada:

### Patch Changes

- cd5f61f: feat(tokens): add new tokens
- e8d932a: feat: add `blue` variant to `Badge`
- acfd566: feat(icons): arrow up and arrow left

## 1.0.2

### Patch Changes

- 771981c: fix(blade): radio & checkbox icon alignment

## 1.0.1

### Patch Changes

- ef7f459: fix: font weight of `Link` component

## 1.0.0

### Major Changes

- 51a6787: feat: add `Radio` & `RadioGroup` component

  ## ⚠️ Breaking change for `Checkbox`

  - We've renamed the `neccessityIndicator` prop to `necessityIndicator` to fix a spelling error

- 65834be: fix: icon sizes for `Icon`, `IconButton`, `Button`, `Link` & `Spinner` components

  ## ⚠️ Breaking changes for `Icon`

  **❗️This version introduces a breaking change for the `Icon` component's `size` prop**

  Earlier, the `size` prop had the following size to pixel mapping:

  - **xxsmall:** 10px
  - **xsmall**: 12px
  - **small**: 16px
  - **medium**: 20px
  - **large**: 24px
  - **xlarge**: 32px

  Now, the correct `size` prop will have the following size to pixel mapping:

  - **xsmall**: 8px
  - **small**: 12px
  - **medium**: 16px
  - **large**: 20px
  - **xlarge**: 24px
  - **2xlarge**: 32px

  > ⚠️ `xxsmall` is not an accepted value anymore. Instead, we have a new acceptable value of `2xlarge`.

### Minor Changes

- 61a17fe: feat: add `Badge` component

## 0.13.6

### Patch Changes

- b365464: fix: button spinner layout
- f3abfbe: feat(Icons): add new icons

## 0.13.5

### Patch Changes

- 7909d7c: fix(blade): Checkbox design changes

## 0.13.4

### Patch Changes

- 2778973: chore: add appropriate types for onClick of Button & BaseButton

## 0.13.3

### Patch Changes

- 3ea6d6c: fix(blade): fixes checkbox helptext and errortext alignment for individual checkboxes

## 0.13.2

### Patch Changes

- 17b2c71: fix: button styling for native

## 0.13.1

### Patch Changes

- 985f82a: refactor: use Box component on BaseButton

## 0.13.0

### Minor Changes

- b8cc7df: feat: add checkbox component
- eb65c30: feat: add support for css theme variables
- f61675e: feat: add `Link` & `BaseLink` components

## 0.12.0

### Minor Changes

- 381e9c7: fix(Blade): add `size` prop to Text component and update tokens

  This PR updates the typography tokens scale for mobile devices to create better visual hierarchy which we received as feedback from other teams as well.

  It also adds a new `size` prop to `Text` component for `variant='body'`

## 0.11.4

### Patch Changes

- 66f9b24: feat(tokens): add new tokens

## 0.11.3

### Patch Changes

- e0a2631: feat: add Download, Edit, History, Plus, Pause, & Trash icons

## 0.11.2

### Patch Changes

- b2b86b4: fix: SkipNav export

## 0.11.1

### Patch Changes

- 873676f: fix: button export to components

## 0.11.0

### Minor Changes

- 5d022f4: feat: add `Button` component

### Patch Changes

- cddd298: chore: update currency icons

## 0.10.1

### Patch Changes

- 7b9baf7: fix(blade): broken gray color types in theme.d.ts file

## 0.10.0

### Minor Changes

- a800a96: feat(blade): added makeAccessible function

  makeAccessible function is a compatibility layer between web & native for accessibility props
  More [info in RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-04-09-accessibility.md#platform-specific-implementation--5)

### Patch Changes

- a800a96: fix(blade): added aria hidden in icons

## 0.9.0

### Minor Changes

- 0c3a951: feat(blade): Added SkipNav component

  Learn more about [Skip Navigations in Accessibility RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-04-09-accessibility.md#skip-navigations)

- 5c750bb: feat(blade): add VisuallyHidden component

  This component is used specifically when you want to hide certain things visually for people who are not visually impaired but also want to make your content is accessible to visually impaired people via assistive technologies.

  You can play around with it on [Storybook](https://master--61c19ee8d3d282003ac1d81c.chromatic.com/?path=/docs/components-accessibility-visuallyhidden--visually-hidden)

## 0.8.0

### Minor Changes

- 002fce2: fix: icon colors & remove `surface.action.icon.link.*` colors from `theme`

  ## Breaking Changes

  - Remove the following tokens from `paymentTheme` & `bankingTheme` theme of Blade:

    - `colors.surface.action.icon.link.default.lowContrast`
    - `colors.surface.action.icon.link.default.highContrast`
    - `colors.surface.action.icon.link.hover.lowContrast`
    - `colors.surface.action.icon.link.hover.highContrast`
    - `colors.surface.action.icon.link.focus.lowContrast`
    - `colors.surface.action.icon.link.focus.highContrast`
    - `colors.surface.action.icon.link.active.lowContrast`
    - `colors.surface.action.icon.link.active.highContrast`
    - `colors.surface.action.icon.link.disabled.lowContrast`
    - `colors.surface.action.icon.link.disabled.highContrast`

    If you are using any of these tokens, they will no longer be available in your `theme`. Make sure you remove usage of these tokens from your codebase.

  ## Fixes

  1. Fix incorrect Icon colors that were supported & suggested by TypeScript

## 0.7.2

### Patch Changes

- 9f0bb83: feat: add Dollar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, Close icons

## 0.7.1

### Patch Changes

- 25a7b89: fix(blade): add contrast prop to Typography components

  Add `contrast` prop to all the Typography components so that consumers can change the intent to grab the attention towards the text. The possible values for `contrast` are `high` or `low` and accordingly the color token will be used to set the color of the Typography components

## 0.7.0

### Minor Changes

- 52efedb: fix(blade): set defaults for all typography components

  Make all the props optional to have a better DX and add default values for all the important props

## 0.6.0

### Minor Changes

- e352eef: fix(blade): add `Heading` component

## 0.5.0

### Minor Changes

- 75882a7: feat(Blade): add `Title`component

  The API for `Title` component can be found under [Typography/Text/\_decisions](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Typography/_decisions/decisions.md)

## 0.4.0

### Minor Changes

- 294173e: - Add the following components that would act as building blocks for our icons:
  1. `Svg`
  2. `Path`
  3. `Rect`
  4. `Defs`
  5. `ClipPath`
  6. `G`
  - Add `CreditCardIcon` component
  - Add `RupeeIcon` component

### Patch Changes

- e76cd01: feat/add-text-component

## 0.3.0

### Minor Changes

- a20b608: feat(blade): add motion tokens

  ### Motion tokens

  We have added tokens for

  1. Delay
  2. Duration
  3. Easing

  You can find a detailed RFC for motion here: [View Formatted RFC](https://github.com/razorpay/blade/blob/rfc/2022-03-22-motion-rfc/rfcs/2022-03-22-motion-rfc.md)

## 0.2.0

### Minor Changes

- 6885ac3: feat(blade): add BaseText component

## 0.1.6

### Patch Changes

- 33e3930: feat(blade): add listener for toggling breakpoints

  **Updates**

  - Add `breakpoints` token to the themes.
  - Out of the box responsiveness support for typography tokens.
  - Publish `useBreakpoint` hook.
  - Following breakpoints are supported as of today.
    ```
    /** max width: 320px  */
    xs: 320;
    /** min width: 321px and max width: 480px */
    s: 480;
    /** min width: 481px and max width: 768px */
    m: 768;
    /** min width: 769 and max width: 1024px */
    l: 1024;
    /** min width: 1025 and max width: 1200px */
    xl: 1200;
    /** min width: 1201px  */
    max: 1201;
    ```
  - For web the typography scale will toggle between mobile and desktop
    - `xs, s, m` are considered as mobile
    - `l, xl, xl` are considered as desktop
  - For react native we always default to mobile typography scale

  **What does it mean for me(as a developer)?**

  - If you’re already using Blade tokens then you can leverage this by just running `yarn upgrade @razorpay/blade@0.1.6` and that’s it you are set 🚀
    - You can use the typography tokens as you were doing previously. Refer the [usage guideline here](https://61c19ee8d3d282003ac1d81c-jukcfyruls.chromatic.com/?path=/story/guides-usage--page&globals=measureEnabled:false#tokens)
  - You can use these `breakpoints` as a base reference to build your next set of features by just following the [usage guidelines here](https://61c19ee8d3d282003ac1d81c-jukcfyruls.chromatic.com/?path=/story/tokens-breakpoints--page&globals=measureEnabled:false).

  This is our first step towards building responsive and adaptive applications. We’ll be publishing Typography Components next which will be built on top of these tokens and you can use them directly for your projects. Meanwhile, [read more about our responsive and adaptive strategy in this RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-02-11-responsive-and-adaptive-layout-strategy.md)

## 0.1.5

### Patch Changes

- 04677a3: fix(blade): add lineheight tokens

## 0.1.4

### Patch Changes

- f992f77: fix(blade): typo in exports field

## 0.1.3

### Patch Changes

- d32dd9d: fix(blade): add overlay color token

## 0.1.2

### Patch Changes

- 8cddfad: fix(blade): update desktop typography scale

## 0.1.1

### Patch Changes

- 6c69a4d: fix(blade): update imports and exports

## 0.1.0

### Minor Changes

- de4124f: ### ⚠️ **Breaking Change** ⚠️
  This PR introduces a major breaking change on how we access tokens.

  ### Why did we want to change the way we access tokens?

  So, previously if you had to start consuming tokens from the new version of Blade you start with importing the theme provider:

  ```jsx
  // App entry point
  import { ThemeProvider } from '@razorpay/blade/components';
  import { paymentTheme } from '@razorpay/blade/tokens';

  function App(): JSX.Element {
    return (
      <React.Fragment>
        <GlobalStyle />
        <ThemeProvider theme={paymentTheme}>
          <Card />
        </ThemeProvider>
      </React.Fragment>
    );
  }

  export default App;
  ```

  And then in one of our components, we'll use the `useTheme()` hook to get the theme and the mode like following 👇

  ```jsx
  const StyledCard = styled.div(
    ({ theme }: { theme: Theme }) => `
    width: 368px;
    background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
    border-radius: ${theme.border.radius.medium}px;
    box-shadow: ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1].onLight}, ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1].onLight};
    padding: ${theme.spacing[5]}px;
    display: flex;
    flex-direction: column;
  `,
  );

  const Card = (): React.ReactElement => {
    const { theme } = useTheme();
    return (
      <React.Fragment>
        <DisplayLarge theme={theme}>Cash Advance </DisplayLarge>
        <StyledCard theme={theme}>
          <AlertInformation theme={theme}>
            The interest charged will be deposited back into your bank account within a day of
            repayment.
          </AlertInformation>
          <Divider theme={theme} />
          <CaptionRegular theme={theme}>
            This amount will be deducted in 3 installments from your settlement balance between Feb
            18-20 on a daily basis.
          </CaptionRegular>
        </StyledCard>
      </React.Fragment>
    );
  };
  ```

  #### Problem with the existing implementation:

  So we pass the raw theme tokens which have everything light mode colors, dark mode colors. Different typography scales for desktop, mobile, etc. But as a consumer look at how do we access the tokens from the above file

  ```jsx

  const { theme } = useTheme();

  background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  font-size: ${theme.typography.desktop.fonts.size[200]}px;
  ```

  - Isn't it weird to explicitly write `onLight`/`onDark` by hand while accessing color tokens?
  - Isn't it weird to explicitly write `desktop` to access the typography scale for desktop?
  - How would you as a developer change things let's say if the user toggles the color mode?
  - How would you as a developer change the typography scale if the user switches from desktop to mobile or vice-versa?

  You can't! Because we have **hardcoded** the object properties and which means we lost the power of dynamically changing these things based on the user's behavior which is incorrect.

  #### What is the root cause of this issue?

  The root cause is the mental model of how we store tokens and how do we consume them. Typically our tokens are nothing but our design decisions. So this means we need to store every decision in our token file, for eg: light mode colors, dark mode colors, typography scale for desktop, typography scale for mobile but when we consume them we want the system to take care of these things and give us single value for the modes and the platform.

  So we want something like this 👇

  ```diff

  const { theme } = useTheme();

  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  -font-size: ${theme.typography.desktop.fonts.size[200]}px;
  +font-size: ${theme.typography.fonts.size[200]}px;
  ```

  Notice the removal of **`onLight`** and **`desktop`** keys from the theme object.

  So we want our system to behave in such a manner that:

  - We input the raw theme(which has color modes and platform types)
  - It will output the flat theme which will have color mode and platform type selected, so we don't have to hardcode `onLight`/`onDark` or `desktop`/`mobile`.

  ### What is the solution?

  The system we spoke about is nothing but our `BladeProvider`(previously known as `ThemeProvider`). It'll accept the raw theme as a prop and then based on the device type and color mode pick those values from `themeTokens` and set it in the context as `theme`. We can then use `useTheme()` hook to get the theme from the context which will be flattened.

  This is how things will look after this change 👇

  ```diff
  // App entry point
  -import { ThemeProvider } from '@razorpay/blade/components';
  +import { BladeProvider } from '@razorpay/blade/components';
  import { paymentTheme } from '@razorpay/blade/tokens';

  function App(): JSX.Element {
    return (
      <React.Fragment>
        <GlobalStyle />
  -      <ThemeProvider theme={paymentTheme}>
  +      <BladeProvider themeTokens={paymentTheme}>
          <Card />
  -      </ThemeProvider>
  +      </BladeProvider>
      </React.Fragment>
    );
  }

  export default App;

  // somewhere in the app
  const { theme } = useTheme();

  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  -font-size: ${theme.typography.desktop.fonts.size[200]}px;
  +font-size: ${theme.typography.fonts.size[200]}px;
  ```

  ### Migration guide for apps using the older version

  1. Rename **ThemeProvider** to **BladeProvider**

  ```diff
  -import { ThemeProvider } from '@razorpay/blade/components';
  +import { BladeProvider } from '@razorpay/blade/components';
  ```

  2. Rename `theme` prop on provider to `themeTokens`

  ```diff
  -<BladeProvider theme={paymentTheme}>
  +<BladeProvider themeTokens={paymentTheme}>
  ```

  3. import `Theme` type to be imported from `@razorpay/blade/components` instead of `@razorpay/blade/tokens`

  ```diff
  -import type { Theme } from '@razorpay/blade/tokens';
  +import type { Theme } from '@razorpay/blade/components';
  ```

  4. Remove all the `onLight`/`onDark` keywords from the theme colors object

  ```diff
  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  ```

  5. Remove all the `desktop`/`mobile` keywords from the theme typography object

  ```diff
  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  ```

## 0.0.8

### Patch Changes

- 7a09800: fix(blade): add description in token types

## 0.0.7

### Patch Changes

- 1aa2961: fix(blade): export all the types of global tokens for consumers
- d8d8027: fix(blade): typo in color tokens

## 0.0.6

### Patch Changes

- 8374dc1: build(blade): generate root `.d.ts`

## 0.0.5

### Patch Changes

- 057cf66: build(blade): add re-exports to `.ts` instead of `.js`

## 0.0.4

### Patch Changes

- efb59d9: feat(blade): add type generation scripts

## 0.0.3

### Patch Changes

- f0b2b01: fix(blade): typo in exports field

## 0.0.2

### Patch Changes

- 55ac5d3: feat(blade): add rollup to build blade
