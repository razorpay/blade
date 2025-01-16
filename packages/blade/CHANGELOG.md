# @razorpay/blade

## 12.2.1

### Patch Changes

- dbd53024: fix(blade): date picker on level change typo

## 12.2.0

### Minor Changes

- a9e46afb: feat(ActionList): add Virtualization in ActionList

  ```jsx
  <ActionList isVirtualized></ActionList>
  ```

  > [!NOTE]
  >
  > Current version only supports virtulization of fixed height list where items do not have descriptions. We'll be adding support for dynamic height lists in future versions

### Patch Changes

- 70259329: feat(blade): add dateformat and placeholder prop for datepicker input
  fix(blade): Removed the chevron icon when the picker prop is used.

## 12.1.1

### Patch Changes

- 6aae282a: chore(blade): change TabNavItem,TopNavActions background color & update examples
- c676f3ed: fix(SideNav): empty padding in banner when banner component returns null

## 12.1.0

### Minor Changes

- e00172bf: feat(blade): Changes in components for X migration

  **Drawer:**

  - Changed the drawer's showOverlay behaviour to not mandate the overlay on level2 stacking
  - Exposed ref

  **RadioGroup:**

  - Exposed event in onChange

  **ButtonGroup:**

  - Added styled props
  - Added support for Tooltip inside ButtonGroup

  **IconButton:**

  - Added styledProps

  **SideNavLink:**

  - Added onClick

### Patch Changes

- 41354f63: fix(blade): cleanup bodyscroll locks if bottomsheet is force unmounted

## 12.0.3

### Patch Changes

- 0b5dc72d: fix: interactive card selected borderRadius

## 12.0.2

### Patch Changes

- 95a58247: fix(blade): Add backwards compat for React17 - fallback for useInsertionEffect

## 12.0.1

### Patch Changes

- 4178c595: docs: remove stackblitz and add story code
  fix: export Stagger and AnimateInteractions

## 12.0.0

### Major Changes

- 663da58e: feat(Motion): Release Motion Presets

  - Check out [Blade v12 Upgrade Guide](https://github.com/razorpay/blade/blob/master/packages/blade/docs/migration-docs/upgrade-v12.md) for codemod and migration steps

## 11.39.0

### Minor Changes

- 583900a1: feat(blade): add ray icon

## 11.38.1

### Patch Changes

- 65431583: feat: update use-presence hook to latest for react 19 support

## 11.38.0

### Minor Changes

- a51e8f70: feat(StepGroup): spacing enhancements, support for titleColor prop
- 7117bfbc: feat: add support for data-analytics attribute

## 11.37.0

### Minor Changes

- 778e388b: feat(blade): add new icons - IndiaFlag, MagicKonnect, WorldWide

## 11.36.2

### Patch Changes

- f294a414: fix(blade): maxCharacters alignment in Input field
- fa487f1e: fix(blade): Trigger native select events in dropdown/ file upload / Date picker

## 11.36.1

### Patch Changes

- 8846293f: fix: dropdown not opening if user clicks on dropdown backdrop

## 11.36.0

### Minor Changes

- e97ec75b: feat: add new icons

### Patch Changes

- 9294580c: feat: expose textAlign prop types in text input

## 11.35.0

### Minor Changes

- e53905b0: feat(blade): add controlled state to carousel

## 11.34.1

### Patch Changes

- 421a3a8e: fix(blade): bottomsheet body scroll lock not clearing

## 11.34.0

### Minor Changes

- b63190b0: feat(BottomNav): add BottomNav component

### Patch Changes

- 479431ab: feat(BottomNav): remove tap animation

## 11.33.0

### Minor Changes

- e35355af: feat(Table): add hover actions support on `TableRow`

## 11.32.0

### Minor Changes

- a4a61681: feat(blade): revamped top-nav component

  > NOTE:
  > This might be a breaking change for you, if your project uses the older deprecated TopNav.

## 11.31.2

### Patch Changes

- eef992bd: feat(blade): support test id for table row

## 11.31.1

### Patch Changes

- 94b69155: fix(blade): set isDisabled to checkbox for disabled table rows [DSSUP-157]

  Changed the visual styling of disabled checkbox to have 'not-allowed' cursor.

## 11.31.0

### Minor Changes

- 234f1083: feat(Amount): add support for negative amount
  fix(PhoneNumberInput): PhoneNumber input compatibility issues with i18nify

  > [!NOTE]
  >
  > Consumers should upgrade to latest version of `@razorpay/i18nify-js` and `@razorpay/i18nify-react` for support of negative amount

## 11.30.5

### Patch Changes

- 9d4f9b85: feat(blade): add height & styled props to carousel

## 11.30.4

### Patch Changes

- 68e0ec53: fix(blade): Table cell text truncation

## 11.30.3

### Patch Changes

- 98482ca9: fix(blade): interactive card cursor

## 11.30.2

### Patch Changes

- 2f8a5029: fix(BaseHeader): Handle word break on single word. Fixes for AccordionItemHeader, DropdownHeader, etc

## 11.30.1

### Patch Changes

- c050c1d9: fix: AccordionItemHeader to take full width

## 11.30.0

### Minor Changes

- 6e059a68: feat: fix datepicker range selection bug & add onApply handler

### Patch Changes

- 98770d68: fix(Input): required necessity indicator label break
- 3c31990d: feat(Table): add `defaultSelectedIds` prop

## 11.29.0

### Minor Changes

- eaa75c64: feat(ActionList): add ActionListItemAvatar component for leading prop

### Patch Changes

- c6f8bc72: fix(blade): support overriding tooltip interactive wrapper display prop

## 11.28.2

### Patch Changes

- 12f30712: fix(input): change `wordBreak` behaviour of input hint text & fix alignment
- 601cedc8: feat(StepItem): add `isDisabled` prop to StepItem

## 11.28.1

### Patch Changes

- 830c8744: fix(Table): table sticky column overlapping with relative cell

## 11.28.0

### Minor Changes

- 95f19f49: feat: expose link negative/positive colors

## 11.27.1

### Patch Changes

- 8ba3eab7: fix: datepicker necessityIndicator

## 11.27.0

### Minor Changes

- f036ef58: feat: add EqualsIcon

## 11.26.1

### Patch Changes

- 5d7317ca: fix: remove default `rel` values

  > [!NOTE]
  >
  > While its non-ui-breaking change, you might want to add `rel="noopener noreferrer"` to your Button if that is what you're expecting. This PR removes the defaults in-order to not break analytics that relies on referrer.

- 4dcad016: fix: set min-width on Radio to avoid shrinking

## 11.26.0

### Minor Changes

- f26cf80d: chore: expose brand colors
- 39742907: feat(TableEditableCell): refactor TableEditableCell and add TableEditableDropdownCell

### Patch Changes

- e13023de: fix: table footer background color
- fb58be12: fix: Spinner colors

## 11.25.0

### Minor Changes

- 45ed9267: feat: add avatar addons, added new topAddon and bottomAddon props

## 11.24.3

### Patch Changes

- 343d494d: fix(ActionListItem, MenuItem): truncate text without spaces and add htmlTitle

## 11.24.2

### Patch Changes

- 733b9545: fix: change onRemove/onReupload params

## 11.24.1

### Patch Changes

- b38943c0: fix: table multiselect with pagination bug
- 636952b6: feat: add multiselection-mode prop to Table
- caee2688: fix: add button type button

## 11.24.0

### Minor Changes

- 03837f9f: feat: add `TableEditableCell` component for Table

## 11.23.3

### Patch Changes

- 5b3c42db: fix: white-labeling issue with surface text primary

## 11.23.2

### Patch Changes

- 59a333b4: fix(FileUpload): correctly update errortText
- bb06013f: fix(ProgressBar): show percentage with decimal when using as meter

## 11.23.1

### Patch Changes

- 00238183: feat(Menu, Dropdown): add width props on MenuOverlay and allow it in SelectInput Dropdown

## 11.23.0

### Minor Changes

- fe9a0cff: feat(blade): add TopNav component

## 11.22.0

### Minor Changes

- 2cb7668b: feat(Menu): add Menu component

## 11.21.9

### Patch Changes

- d12977d5: fix(FileUpload): correctly udpate state in controlled mode

## 11.21.8

### Patch Changes

- 9b2883f8: feat: add iconColor prop to List & ListItem

## 11.21.7

### Patch Changes

- be353128: fix: Spinner's white color

## 11.21.6

### Patch Changes

- 0d6d7cf7: fix: bottomsheet initial focus triggering everytime
- cc40b48e: fix(Accordion): add `maxWidth` prop

## 11.21.5

### Patch Changes

- 25fe56db: fix(DatePicker): correct input alignment without label
- e179dd50: fix(FileUpload): remove excessive margins

## 11.21.4

### Patch Changes

- d3789888: fix: datepicker zIndex issue and expose zIndex prop

## 11.21.3

### Patch Changes

- 4643a992: fix(blade): datepicker input width
- c7ed69b4: chore: add petty cash budget icon

## 11.21.2

### Patch Changes

- 2a4d1673: feat(FileUpload): add `onReupload` prop to use in case of error state

## 11.21.1

### Patch Changes

- 04c84eb4: fix: datepicker label alignment

## 11.21.0

### Minor Changes

- 0d3e260e: feat(SideNav): add SideNav component

  Checkout [SideNav Documentation](https://blade.razorpay.com/?path=/docs/components-sidenav--docs)

### Patch Changes

- 2d82e41c: fix(FileUpload): allow re-uploading of the same file

## 11.20.0

### Minor Changes

- d9bb5223: refactor(blade): downgrade mantine to v6

## 11.19.1

### Patch Changes

- 634eefd3: fix(Card, Switch): card border width, switch colors
- 8f8b795e: fix: DatePicker necessityIndicator alignment

## 11.19.0

### Minor Changes

- 2ed5299e: feat(blade): add DatePicker component

## 11.18.3

### Patch Changes

- d500ec14: feat: add placeholder prop in phone input

## 11.18.2

### Patch Changes

- 00c87e88: fix(blade): radio helptext being negative

## 11.18.1

### Patch Changes

- 14f70c96: fix: update circular progress percentage color

## 11.18.0

### Minor Changes

- 0c009edc: feat: add `SearchInput` component
- 00edb732: feat: add `Avatar` & `AvatarGroup` components

## 11.17.1

### Patch Changes

- 3d69bc9d: fix(blade): modal component failing to verify null component

## 11.17.0

### Minor Changes

- 64108d77: feat(blade): add new icons and add figma icon importer script

## 11.16.1

### Patch Changes

- 51c04c81: feat(Table): add compact rowDensity & update existing densities
- 906e7f4f: fix(DropdownOverlay): Fix DropdownOverlay getting cropped in Sticky Table Column

## 11.16.0

### Minor Changes

- afddbf27: feat: add label & validation related props to ChipGroup

### Patch Changes

- ef0fb059: feat(tokens): update dark mode tokens

## 11.15.2

### Patch Changes

- 102dc873: fix: i18nify-react version upgraded to resolve duplicate i18nify-js copies

## 11.15.1

### Patch Changes

- 989172ab: fix(blade): tab item button type

## 11.15.0

### Minor Changes

- ada461c8: feat(StepGroup): add StepGroup component

  Documentation: https://blade.razorpay.com/?path=/docs/components-stepgroup--docs

## 11.14.0

### Minor Changes

- 23a8364b: feat(blade): add leading prop in Alert

## 11.13.1

### Patch Changes

- 2f0d96fb: fix(blade): phone number input dropdown not opening

## 11.13.0

### Minor Changes

- 410cfb55: feat: add `circular` variant for the `ProgressBar` component

  #### Changes

  - The `"meter"` & `"progress"` values for the `variant` prop are deprecated in favor of the new `type?: "meter" | "progress"` prop.
  - The `variant` prop now accepts `"linear"` & `"circular"` values.
  - **Usage:**

    ```js
      <ProgressBar variant="circular" value={20}> label="Label" />
    ```

  #### Migration with Codemod

  - The codemod will automatically update the `ProgressBar` component. Execute the codemod on the file/directory that needs to be migrated for the page via the following command:

    > Need help? Check out [jscodeshift docs](https://github.com/facebook/jscodeshift) for CLI usage tips.

    ```sh
    npx jscodeshift ./PATH_TO_YOUR_DIR --extensions=tsx,ts,jsx,js -t ./node_modules/@razorpay/blade/codemods/migrate-progressbar/transformers/index.ts --ignore-pattern="**/node_modules/**"
    ```

  - There might be some situations where the codemod falls short, If you encounter errors, refer the following examples to migrate the component manually:

    ```diff
    - <ProgressBar value={20}> label="Label" />
    + <ProgressBar type="progress" value={20}> label="Label" />

    - <ProgressBar variant="progress" value={20}> label="Label" />
    + <ProgressBar type="progress" variant="linear" value={20}> label="Label" />

    - <ProgressBar variant="meter" value={20}> label="Label" />
    + <ProgressBar type="meter" variant="linear" value={20}> label="Label" />
    ```

## 11.12.0

### Minor Changes

- c5f24eae: feat(TextArea, TextInput): Support Tagged Inputs with `tags` and `isTaggedInput` prop
  feat(Tag): max-width is removed from Tag component

## 11.11.1

### Patch Changes

- cc69004a: fix: additional parameters added to retain fraction digits in humanize Amount figure

## 11.11.0

### Minor Changes

- 8c5231d4: feat: add large size in FileUpload component

  #### Usage

  ```js
  <FileUpload
    size="large"
    uploadType="single"
    label="Upload GST certificate"
    helpText="Upload .jpg, .jpeg, or .png file only"
    accept="image/*"
  />
  ```

## 11.10.0

### Minor Changes

- a75d2e3c: feat(blade): add PhoneNumber input

## 11.9.1

### Patch Changes

- 38d97633: fix(Table): selection toggle for multiselect table

## 11.9.0

### Minor Changes

- 015e6828: feat: Redesign all `Input` components

  > Note: No breaking changes to the existing API. The Input components will continue to work as before but with an updated design.

  ## Changes

  ### TextInput

  - Redesigned UI
  - Add `leadingIcon` prop
  - ⚠️ Deprecate `icon` prop in favour of `leadingIcon` which will be removed in the next major version
  - Add `trailingIcon` prop
  - Add `trailingLinkButton` prop
  - Add `size` prop

  ### TextArea

  - Redesigned UI
  - Add `size` prop

  ### PasswordInput

  - Redesigned UI
  - Adds `size` prop

  ### OTPInput

  - Redesigned UI
  - Add `size` prop

  ### SelectInput

  - Redesigned UI
  - Add `size` prop

  ### Autocomplete

  - Redesigned UI
  - Add `size` prop

  ### Radio

  - Add `size` prop

  ### Checkbox

  - Add `size` prop

## 11.8.2

### Patch Changes

- 5be1dedb: fix: update ButtonGroup focus ring styles

## 11.8.1

### Patch Changes

- 9dcc2914: fix(Button): use height and width to fix sizes in Icon Only Button

## 11.8.0

### Minor Changes

- fd304e47: feat: add the `ButtonGroup` component

## 11.7.0

### Minor Changes

- 524fa924: feat(Accordion): add new `filled` variant

  New variant can be used to build individual filled Accordions like these

  <img width="400" alt="image" src="https://github.com/razorpay/blade/assets/30949385/7f3d737f-149a-42b0-be1b-1c86d5a0fd83">

  > [!Warning]
  >
  > Accordion has a new API and the current API will be deprecated and removed in next major version

  #### Migration from existing API

  We have added `AccordionItemHeader` and `AccordionItemBody` components.

  Props like `icon`, `title`, `description` from AccordionItem are deprecated.

  - `icon` on AccordionItem can be replicated with `leading` on AccordionItemHeader
  - `title` moves from AccordionItem to AccordionItemHeader
  - `description` from AccordionItem can be passed to AccordionItemBody as children

  ##### Diff

  ```diff
  <Accordion>
    <AccordionItem
  -    icon={StarIcon}
  -    title="This is title"
  -    description="Body content of Accordion"
    />
  </Accordion>
  ```

  ```diff
  <Accordion>
    <AccordionItem>
  +    <AccordionItemHeader leading={<StarIcon size="large" />} title="This is title" />
  +    <AccordionItemBody>Body content of Accordion</AccordionItemBody>
    </AccordionItem>
  </Accordion>
  ```

  Checkout full documentation at https://blade.razorpay.com/?path=/docs/components-accordion--docs

## 11.6.3

### Patch Changes

- 2c64f181: feat: support `defaultPlacement` prop on `DropdownOverlay`
- ef68789a: fix(DropdownButton): scroll handling issues on keyboard navigations

## 11.6.2

### Patch Changes

- a6a59686: fix: cover more cases with codemod
- 902e28b4: fix: i18nify-js dependency updated

## 11.6.1

### Patch Changes

- af39cab2: fix: add FileUpload exports
- 26317e0e: feat: add adjusted font fallbacks for Inter and TASA

## 11.6.0

### Minor Changes

- 9ebaf986: feat: add `FileUpload` component

## 11.5.0

### Minor Changes

- bb7466e7: feat(blade): add `Breadcrumb` component

## 11.4.0

### Minor Changes

- 51208914: feat(Drawer): add Drawer component

  Checkout https://blade.razorpay.com/?path=/docs/components-drawer--docs

### Patch Changes

- ab028b6c: fix(Tag): tag truncation in Select and AutoComplete

## 11.3.1

### Patch Changes

- 85f229d0: refactor(blade): add meta attributes to Toast

## 11.3.0

### Minor Changes

- 497799df: feat(blade): add toast component

## 11.2.1

### Patch Changes

- 16a0e737: fix(Dropdown): remove scrollbar on tag slot and allow clicks on DropdownLink and DropdownButton chevron icons

## 11.2.0

### Minor Changes

- f104cbf3: **feat: Added internationalization in Amount component via i18nify.
  References**

  - **i18nify-js:** https://www.npmjs.com/package/@razorpay/i18nify-js
  - **i18nify-react:** https://www.npmjs.com/package/@razorpay/i18nify-react

  **What changes ?**

  1. The `<Amount />` component will now automatically format numbers based on the user's browser locale. For example, `<Amount value={123456.789} currency="INR">` will render `₹1,23,456.79` for browsers with the `en-IN` default locale, whereas it will render `₹123,456.79` for browsers with the `en-US` locale.

  2. If you want to enable users to change the locale of your page, add the `@razorpay/i18nify-react` package and wrap your app inside the `I18nProvider`. Utilize the `setI18nState` utility to modify the locale. For more details, please refer to the [documentation](https://www.npmjs.com/package/@razorpay/i18nify-react).

  3. Additionally, if you prefer to maintain a fixed locale for your page and amount component, enclose your app within `<I18nProvider initData={{locale: 'locale-you-want'}}>..`. For more details, please refer to the [documentation](https://www.npmjs.com/package/@razorpay/i18nify-react).

  **How to update ?**

  1. Install i18nify as dependency `yarn add @razorpay/i18nify-js`
  2. _[Optional]_: Install i18nify-react as dependency to manage state effectively `yarn add @razorpay/i18nify-react`
  3. Install latest Blade `yarn add @razorpay/blade@latest`

## 11.1.1

### Patch Changes

- 9801ff86: - feat(Dropdown): add E2E tests

  - fix(Dropdown): dropdown getting closed without explicit isOpen={false} in controlled dropdown

  > [!Note]
  >
  > if you have used ControlledDropdown in a similar way how it was documented, things should work fine.
  >
  > If you have used `isOpen` from Controlled Dropdown but you're not handling it inside `onOpenChange`, you will have to handle that state as well. E.g. `isOpen={isDropdownOpen} onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}`

## 11.1.0

### Minor Changes

- b21e3aea: chore: add server-side pagination with `totalItemCount` & `paginationType`

## 11.0.0

### Major Changes

- abd99bba: feat: revamp Blade with brand refresh changes

  > [!WARNING]
  >
  > Breaking Change!
  > This is a breaking change for all components in the library.
  >
  > Refer the [detailed v11 upgrade guide](https://github.com/razorpay/blade/blob/master/packages/blade/upgrade-v11.md) that contains instructions on how to use codemods for auto-upgrade along with manual steps if required

## 10.23.5

### Patch Changes

- 3ac92ae4: fix(blade): expose card event type

## 10.23.4

### Patch Changes

- d2a27c8a: feat(blade): add minHeight prop to Card

## 10.23.3

### Patch Changes

- eebe574b: fix: remove page change check that would cause infinite renders
- 3ab8c0ef: feat: add `onHover` & `onClick` callback to `TableRow`

## 10.23.2

### Patch Changes

- bd7d8dc5: feat(Skeleton): add minHeight and minWidth prop

## 10.23.1

### Patch Changes

- 6f89de9f: fix(Table): handle case where currentPage is greater than total pages

## 10.23.0

### Minor Changes

- 469b2d72: feat: add `getBladeCoverage` and `assertBladeCoverage` utilities

  Read more about it in the [Blade Coverage documentation](http://blade.razorpay.com/?path=/story/utils-blade-coverage--page).

## 10.22.0

### Minor Changes

- 40e51a56: feat(blade): optimize bundle size with isolated modules & enable codesplitting

  **Migration:**

  ## Jest

  **transformIgnorePatterns:**

  In your jest config's [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring) add `@table-library` so that it gets transpiled by jest.

  ```diff
  // jest.config.js
  transformIgnorePatterns: [
  -  '/node_modules/(?!(@razorpay/blade|commander)|uuid|@babel/runtime/)',
  +  '/node_modules/(?!(@razorpay/blade|commander)|uuid|@babel/runtime|@table-library/)',
  ],
  ```

  **moduleNameMapper:**

  In your jest config's [`moduleNameMapper`](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring), you can remove the aliased blade modules:

  This is present in [x](https://github.com/razorpay/x/blob/master/jest.config.js#L49-L51), [frontend-website](https://github.com/razorpay/frontend-website/blob/master/jest.config.js#L14-L16) & [admin-dashboard](https://github.com/razorpay/admin-dashboard/blob/master/jest.config.js#L14-L16) repo.

  ```diff
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)
  ```

## 10.21.0

### Minor Changes

- 32d188e6: feat(Collapsible): mark width prop as external

  > [!WARNING]
  >
  > If you were using internal `_width` prop, you will have to rename it to `width`

  ```diff
  - <CollapsibleBody _width={} />
  + <CollapsibleBody width={} />
  ```

## 10.20.1

### Patch Changes

- e89018c4: feat(Dropdown): Support `width` prop on DropdownOverlay
- 37fa68cb: fix: define stylis plugin name property

## 10.20.0

### Minor Changes

- 87d9638b: feat: increase the CSS specificity of all components

  > [!WARNING]
  >
  > **We've enhanced the specificity of styles for Blade components. If you've defined styles in separate CSS at a root level targeting blade components, please note that they may no longer take effect as expected.
  > The styles within the blade components will now take precedence.**
  >
  > **Your existing component snapshots may update, there is no change in the visual appearance of components. Please feel free to add the updated snapshots.**

### Patch Changes

- 1da66413: fix(blade): page gets scrolled to top on iOS when bottomsheet open
- 2219e9a1: fix: refined text input label truncation for single-word overflow

## 10.19.1

### Patch Changes

- 0d0e72ea: fix(blade): fixed SpotlightPopoverTour bugs

  - Safari body-scroll-lock causing the page to get clipped because storybook doesn't set width/height on body - fixed by setting width/height
  - Initial delay of opening the mask - fixed by immediately updating the mask size on initial render
  - Delay of transitioning between steps which occurs because we need to wait for the animation to finish before scrolling otherwise the scroll gets interrupted - fixed by reduced this to 100ms

## 10.19.0

### Minor Changes

- 23a3e111: feat: Add `Table` component

## 10.18.2

### Patch Changes

- 9967cd96: fix: set default breakpoint without computing

## 10.18.1

### Patch Changes

- 77b31aa1: fix(blade): remove extra margin left on carousel

## 10.18.0

### Minor Changes

- 88aba1d6: feat(blade): added SpotlightPopoverTour web implementation

## 10.17.4

### Patch Changes

- 97b9b4cc: fix(TextInput): white placeholder on autoFocus in android

## 10.17.3

### Patch Changes

- 49db8d7c: chore(blade): only allow CarouselItem in Carousel children
- ab2b1800: fix(blade): fixed react-native bottomsheet state bugs

## 10.17.2

### Patch Changes

- f0d4dce5: fix: react native text input alignment with prefix

## 10.17.1

### Patch Changes

- a0d3b13d: chore(blade): add file zip icon
- 66a16267: fix(Dropdown): use popup background color token in DropdownOverlay and Popover

  > **Note**
  >
  > For consumers, this changes the color of Dropdown overlay to fainter version in dark mode. It shouldn't break anything and hence the snapshots can be safely updated.

## 10.17.0

### Minor Changes

- a35f5dfc: feat: update popup token, migrate overlay tokens

  > **Warning**
  >
  > `theme.colors.overlay.background` is moved to `theme.colors.surface.overlay.background[800]`.
  >
  > Based on our analytics data, its a rarely used token hence, its a non-breaking change for most consumers (1 instance in razorpay/x repo).
  > Although it is recommended to search for `colors.overlay.background` in your repo and confirm once if its not being used. If it is used you can follow migration step below.

  ```diff
  - background={theme.colors.overlay.background}
  + background={theme.colors.surface.overlay.background[800]}
  ```

## 10.16.0

### Minor Changes

- fc7c8408: feat(blade): tabs implementation

  > [!NOTE]
  > We've updated `@floating-ui/react` to version `0.25.4`
  > Consumers may need to update their jest snapshots

### Patch Changes

- c6d1ad9b: fix: update carousel nav button tokens
- a17076b8: chore: fix popover close button background

## 10.15.3

### Patch Changes

- f1ab23c8: fix(blade): remove preventDefault in selector label

## 10.15.2

### Patch Changes

- 360abe73: fix(Autocomplete): enhance input handling for controlled scenarios
- 69098f16: fix(checkbox): fixed alignment
- 71ea0ac5: fix(Dropdown): enhance tag selection handling
- 44153ba4: feat(Typography): accept `brand.secondary.500` as a valid `color` prop value
- 8fdef8a7: docs: improve documentation aesthetics
- 277ba6fa: fix(AutoComplete, SelectInput): disable tags in input when `isDisabled` is set to true
- 08c161b6: fix(ActionListItem): checkbox spacing

## 10.15.1

### Patch Changes

- f9d16dc4: fix(Alert): correct color prop behavior

## 10.15.0

### Minor Changes

- 87c5a6ee: feat(Box): add `transform`, `transformOrigin`, `clipPath`, `opacity`, & `visibility` props

### Patch Changes

- 76d80dc2: fix(Input): ensure correct value passing for trailingFooterSlot & trailingHeaderSlot

## 10.14.7

### Patch Changes

- 59f0b92c: fix: carousel indicator sync bug

## 10.14.6

### Patch Changes

- 7738f70b: fix(Tooltip): prevent overriding the `aria-label` attribute
- f38f7c0a: fix: react native crash with reanimated

## 10.14.5

### Patch Changes

- 47b8149d: feat(ListItemText): make span as default tag for ListItemText

## 10.14.4

### Patch Changes

- 87f75b03: feat: support `brand*` colors on Icon and borderColor styled prop

## 10.14.3

### Patch Changes

- 4d6e6aeb: fix(AutoComplete): hide ActionListSection when items are filtered out

## 10.14.2

### Patch Changes

- 3b76e389: fix(blade): remove FloatingFocusManager and added more tests

  Fixes bug with floating ui where it was adding aria-hidden to dropdown trigger. more context [here](https://razorpay.slack.com/archives/CMQ3RBHEU/p1695972277506429?thread_ts=1693739607.070049&cid=CMQ3RBHEU).

## 10.14.1

### Patch Changes

- a65ebf9c: feat(blade): update to use focus-visible

  This will ensure that focus will only appear while using keyboard.
  Note that this is a non-breaking change but you might need to update UT snapshots.

## 10.14.0

### Minor Changes

- dc3e240b: feat: add `color` prop to `Alert`, `Badge`, `Button`, `Chip`, `ChipGroup`, `Counter`, `Link`, & `Spinner`

  #### Color Tokens Update

  **[New White Color Tokens:](https://blade.razorpay.com/?path=/docs/tokens-colors--page)** Introducing white color tokens, enabling white buttons and links for enhanced design options.

  #### Deprecated `intent` prop in favor of the new `color` prop

  - **Alert** - Deprecated `intent` prop.
  - **Badge** - Deprecated `variant` prop.
  - **Chip & ChipGroup** - Deprecated `intent` prop.
  - **Counter** - Deprecated `variant` and `intent` prop.
  - **Spinner** - Deprecated the `contrast` prop.

  #### Jest Snapshots

  Your existing component snapshots may update, there is no change in the visual appearance of components. Feel free to commit the updated snapshots.

## 10.13.2

### Patch Changes

- a047ea61: fix(AutoComplete): handle focus ring on option change

## 10.13.1

### Patch Changes

- d22cbd3d: fix(AutoComplete): Handle inputValue in Controlled Single Selection
- acd0f7b0: fix: change autocomplete search logic from startsWith to includes

## 10.13.0

### Minor Changes

- e99730d7: feat: support customizing Blade Theme with a single brand color

  You can find a detailed documentation [here](https://blade.razorpay.com/?path=/docs/guides-theming-createtheme--page)

  ### Example Usage

      ```tsx
      const customTheme = createTheme({ brandColor: '#19BEA2' })

      <BladeProvider themeTokens={customTheme} colorScheme={colorScheme}>
       {App}
      </BladeProvider>
      ```

## 10.12.1

### Patch Changes

- 68820c36: feat: radio & checkbox integration with card

## 10.12.0

### Minor Changes

- 2f2fcab4: feat(blade): add ref to OTP Input

### Patch Changes

- dc42ae1e: fix(Box): correctly apply border styles

## 10.11.0

### Minor Changes

- c4242ad4: feat(Dropdown): add isOpen and onOpenChange

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

- 18748f1f: feat(ActionListItem): add ActionListItemBadge component and `titleSuffix` option on ActionListItem

## 10.10.0

### Minor Changes

- 18bdaed2: feat(blade): added Popover component

  **Tooltip Changes**

  - Added a new prop `title`

### Patch Changes

- c4ef32f8: chore: export popover & update status table

## 10.9.2

### Patch Changes

- 86c57372: fix: type exports for Select and AutoComplete types

## 10.9.1

### Patch Changes

- 1be2fecf: fix(AutoComplete): AutoComplete Storybook panel and React Native Icon Alignment in PasswordInput

## 10.9.0

### Minor Changes

- 31fa01eb: feat(AutoComplete): add AutoComplete component

## 10.8.1

### Patch Changes

- 09ca73d2: fix(ActionList): divider being added to last ActionListSection

## 10.8.0

### Minor Changes

- ac405dfc: chore(blade): added id to Box component

## 10.7.1

### Patch Changes

- 52288df2: fix(blade): carousel bug in safari

## 10.7.0

### Minor Changes

- f43d9b35: feat(Icon): add default value for `size` & `color` props

## 10.6.0

### Minor Changes

- 1732199a: fix(blade): fix firefox bug in carousel & fixed visible items not switching to `1` on mobile devices.

## 10.5.0

### Minor Changes

- 3fc6ba3a: feat(Typography): add a new `Display` component

  The Display component adds a strong visual touch. Utilize it to create eye-catching sections on your landing pages.

## 10.4.4

### Patch Changes

- f1478f1b: fix(blade): extra left/right padding on amount component

## 10.4.3

### Patch Changes

- 6b69d0e5: fix(blade): fixed card link overlay not working when wrapper is set to position:relative

## 10.4.2

### Patch Changes

- 3d3bef8e: chore(blade): remove broken figma link from Card

## 10.4.1

### Patch Changes

- 6ca6d35b: fix(Amount): correctly round the value upto 2 decimal places

## 10.4.0

### Minor Changes

- a561aaca: feat: Add new `Chip` and `ChipGroup` components

### Patch Changes

- 9278e808: fix(blade): use thicker border in selected card

## 10.3.2

### Patch Changes

- 67e0ae96: feat(blade): added interactive Card

  Enables cards to be used as clickable, linkable & selectable.

## 10.3.1

### Patch Changes

- 5f500f3d: fix(DropdownOverlay): Dropdown clipping issue in overflow scroll containers

## 10.3.0

### Minor Changes

- 5872d7ea: refactor(blade): remove useBladeInnerRef & expose native DOM nodes via ref

## 10.2.1

### Patch Changes

- 98291854: chore: make accordion min-width 360px for large screens
- 5f2f3e44: feat: add large size to List component

## 10.2.0

### Minor Changes

- 30109b99: feat(blade): added Carousel component

## 10.1.0

### Minor Changes

- 0e2d5154: feat(Box): add `draggable`, `onDragStart`, `onDragEnd`, `onDragEnter`, `onDragLeave`, `onDragOver`, `onDrop`, `pointerEvents`, & `placeItems` props

## 10.0.0

### Major Changes

- abf52f07: build: upgrade react `v18.2.0`, react-native `v0.72.3` & other libraries

  ### Upgrade the following packages:

  - `react` to `18.2.0`
  - `react-native` to `0.72.3`
  - `react-dom` to `18.2.0`
  - `react-native-reanimated` to `3.4.1`
  - `react-test-renderer` to `18.2.0`
  - `@react-native-async-storage/async-storage` to `1.19.1`
  - `@testing-library/react` to `13.4.0`
  - `@testing-library/react-native` to `12.2.0`

  ### Migration Guide

  - You can follow [React's](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) & [React Native's](https://react-native-community.github.io/upgrade-helper/?from=0.66.5&to=0.72.3) guides to update your packages to the latest version
  - If you are using `npm` as your package manager and continue to remain on `react` `v17`, you will have to run `npm install` with `--legacy-peer-deps` flag otherwise you will encounter react version mismatch errors
  - React Native consumers will need to upgrade to `react-native-reanimated` `v3`

## 9.7.0

### Minor Changes

- d5d174fa: feat: make `Badge`, `Counter`, & `Indicator` components `inline-flex` by default

### Patch Changes

- f4624db2: fix: react native errors with floating-ui/react
- 2e20ce04: feat(Box): add support for the `transparent` background color

## 9.6.1

### Patch Changes

- 5fb722d8: fix(Switch): correct cursor style in disabled state

## 9.6.0

### Minor Changes

- 50d55a5f: feat(Amount): add support for more currencies

## 9.5.3

### Patch Changes

- d7183b49: fix(SelectInput): truncate text in select input
- 59518acb: feat(BottomSheet): add `zindex` prop & improve focus management logic

  Thanks to @archie252000 for his contribution!

## 9.5.2

### Patch Changes

- a1e75040: fix: standardize logs & errors
- 37bdc811: fix(Box): handle `undefined` for `backgroundColor` prop
- e8a81131: fix: remove className from Button, svg, Link

  > **Note**
  >
  > There was an internal bug introduced with styled-props which allowed certain props like className to pass through and get added on DOM. This release fixes that bug.

  This will be non-breaking for most projects (especially if you're using TypeScript).

  If your project happened to use `className` prop on Button, SVG Icons, or Link, it will stop working post this release.

## 9.5.1

### Patch Changes

- 14271605: refactor: move to `React.ReactElement` type

## 9.5.0

### Minor Changes

- cbed430f: feat: strip off logs & errors in production builds

#### Jest v27 and Custom Resolver Compatibility

For users on Jest v27 or older, or those with custom Jest resolvers (like `jest-directory-named-resolve`) not supporting `package.json` exports, a `moduleNameMapper` update is needed. This ensures compatibility with the `@razorpay/blade` package:

```diff
  moduleNameMapper: {
    // ...rest of your config
+   '@razorpay/blade/components': '<rootDir>/node_modules/@razorpay/blade/build/components/index.development.web.js',
+   '@razorpay/blade/utils': '<rootDir>/node_modules/@razorpay/blade/build/utils/index.development.web.js',
+   '@razorpay/blade/tokens': '<rootDir>/node_modules/@razorpay/blade/build/tokens/index.development.web.js',
  },
```

### Patch Changes

- 2be798d9: feat: add zIndex prop to Tooltip

## 9.4.1

### Patch Changes

- ebd3cbda: feat: add zIndex prop for Modal

## 9.4.0

### Minor Changes

- 5bddbe08: feat(Input): make `label` prop optional & add `accessibilityLabel` prop to `TextInput`, `TextArea`, `PasswordInput`, `SelectInput`, and `OTPInput` components

  #### Key Updates

  - **Optional `label` Prop**: We understand that not all use cases require a label for the Input components. Therefore, we have made the label prop optional, providing you with the freedom to choose whether to display a label or not, depending on your specific application requirements.

  - **Introducing `accessibilityLabel`:** Recognizing the significance of accessibility in modern applications, we have added the `accessibilityLabel` prop to the Input components. This prop enables developers to assign a descriptive label for the input field, making it more user-friendly for individuals using assistive technologies or screen readers.

  - **Enhanced User Guidance:** To maintain usability, we have implemented a requirement that either the `label` or `accessibilityLabel` prop must be provided. This ensures that users will always have clear guidance when interacting with Inputs, promoting a seamless user experience.

## 9.3.0

### Minor Changes

- d28d8a72: feat(Tag): add Tag component

## 9.2.0

### Minor Changes

- 37d84ce7: feat: support `display` prop for all components with styled props

  Restructures few components to ensure adding a display prop doesn't break the components

## 9.1.2

### Patch Changes

- 6763f5fa: fix(List): re-export ListItemText

## 9.1.1

### Patch Changes

- fe31363e: fix(Input): correct helpText and input box alignment
- e7317212: fix: add border-style when border width or color is set

## 9.1.0

### Minor Changes

- b1a1faef: feat(blade): added Skeleton Component

### Patch Changes

- 199d6f0e: fix(Card): fix spacing between header & leading on react native
- dd234a65: feat: add support for ListItemText within List

## 9.0.3

### Patch Changes

- 538390be: feat(Box, Typography): expose brand colors

  - On Box, we're exposing all `brand.*` tokens on the background.
  - On Typography, we're exposing all `brand.primary.*` tokens as color prop

- d880e8e9: fix(Dropdown, BottomSheet): prioritise bottomsheet controlled state over dropdown

## 9.0.2

### Patch Changes

- 8f4bc791: fix: CollapsibleLink arrow orientation when `direction` is top

## 9.0.1

### Patch Changes

- dfea4962: fix(DropdownOverlay): position of Overlay with label on left

## 9.0.0

### Major Changes

- 3d10cecb: fix: make OTPInput fluid width

  ## ⚠️ Breaking change for OTPInput component

  Changes the OTPInput to have a fluid width compared to a fixed width of 36px per field earlier

  ### Migration guide

  **It is recommended to let the OTPInput take the entire width of the parent form in order to ensure consistency with the rest of the Input elements.**

  If you still want to keep the UI for OTPInput on your existing screens the same, you can do the following:

  1. Wrap `OTPInput` with a `Box` component and assign a `maxWidth` of `168px` (for `otpLength` of 4) or `256px` (for `otpLength` of 6)

  ```diff
  + <Box maxWidth='256px' />
    <OTPInput label='Enter OTP' otpLength={6} />
  + </Box>
  ```

  **Before this change (OTPInput with fixed width):**

  <img width="362" alt="Screenshot 2023-06-28 at 2 50 05 PM" src="https://github.com/razorpay/blade/assets/24487274/6d23c4a8-6c27-44f1-bb47-0d2b61025a06">

  **After making OTPInput fluid width (OTPInput with fluid width):**

  <img width="354" alt="Screenshot 2023-06-28 at 2 49 57 PM" src="https://github.com/razorpay/blade/assets/24487274/c3e40176-9f22-451e-a443-1274c4333aec">

### Patch Changes

- 92711d39: feat: standardize isRequired & necessityIndicator across `Checkbox`, `Radio` & `Input` components

  You can now control the `required` property of Checkbox, Radio & Input components with `neccessityIndicator` as well as `isRequired` props

## 8.15.3

### Patch Changes

- 4dd62afd: fix(blade): bottomsheet ssr fix

## 8.15.2

### Patch Changes

- b2f55b7a: fix(blade): tooltip zIndex issue

## 8.15.1

### Patch Changes

- c802e72f: feat: add blue variant to Counter component & change intent to variant

  ## ⚠️ Changes for Counter component with backward compatibility

  Changes the `intent` prop to `variant` since we support more than Feedback colors with the addition of `blue` color for Counter. We will continue to support `intent` prop for backward compatibility but it will be deprecated in an upcoming major release.

  ### Migration guide

  1. Replace all instances of Counter's `intent` prop with `variant
     > The change is only in the naming of the prop, the value will remain unchanged.

  ```diff
   <Counter
  -  intent='positive'
  +  variant='positive'
     value={42}
   />
  ```

## 8.15.0

### Minor Changes

- bd5ededd: feat(DropdownHeaderFooter): add DropdownHeader DropdownFooter components

  We have standardised the Header and Footer between Dropdown, BottomSheet, Modal, and any future components.

  > **Warning**
  >
  > **Breaking Change :** For consumers who use - `ActionListHeader` or `ActionListFooter`.
  >
  > Through our code search we found there weren't any instances of these component in Razorpay code yet thus this is released under minor version

  ## Migration Guide

  > **Note**
  >
  > The Header and Footer are redesigned so it might not be possible to have 1:1 designs. The new header and footer will look different.

  1. Remove `ActionListHeader` and `ActionListFooter` from the inside of the `ActionList`
  2. Add `DropdownHeader` and `DropdownFooter` outside of the `ActionList`, inside `DropdownOverlay`.

  ```diff
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionListHeader,
    ActionListFooter,
    ActionList,
    ActionListItem
  } from '@razorpay/blade/components';

  function App() {
    return (
      <Dropdown>
        <SelectInput label="Select City" />
        <DropdownOverlay>
  +       <DropdownHeader title="Title" />
          <ActionList>
  -          <ActionListHeader title="Title" />
              <ActionListItem />
              <ActionListItem />
  -          <ActionListFooter trailing={<Button>Apply</Button>} />
          </ActionList>
  +       <DropdownFooter>
  +         <Box><Button>Apply</Button></Box>
  +       </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export { App };
  ```

  Checkout [Dropdown Docs](https://blade.razorpay.com/?path=/story/components-dropdown-dropdown--page&globals=showInternalComponents:true;measureEnabled:false) for more details

## 8.14.0

### Minor Changes

- e1f37f69: feat: add `Divider` component

## 8.13.0

### Minor Changes

- 865cd411: refactor: remove internal utilities from index re-exports

  > **Warning**
  >
  > We have removed some of the undocumented internal utilites from re-export of `@razorpay/blade/utils`.
  > We went through the imports usage of Razorpay and made sure to keep exporting the utilities that are currently being used to avoid breaking changes.

  You can take a look at re-exports of [utils/index.ts](https://github.com/razorpay/blade/blob/master/packages/blade/src/utils/index.ts) to know which are the public utilities that we support. This is part of the larger effort in exporting and documenting useful utilities from blade and avoid exporting internal utilities which might break during internal refactors.

  We have marked 2 utilities as `@deprecated` as they are expected to be internal utilities but currently being used in Razorpay. These will be removed in future major versions and won't be documented.

  - `toTitleCase`
  - `usePrevious`

  We would recommend moving these 2 utilities to your local repo utilities.

### Patch Changes

- f4c2afb5: feat: add background-image, size, position, origin, repeat props
- 610422ab: feat: add text decoration support for typography

  Thanks [@archie252000](https://github.com/archie252000) for the contribution!

## 8.12.1

### Patch Changes

- fa8b2361: feat(blade): add and update data attributes in child components

## 8.12.0

### Minor Changes

- 0478669a: feat: add `Accordion` and `Collapsible` components

  > **Note**
  >
  > If you're upgrading from earlier PRE_RELEASE, there are no breaking changes in the API, however there are some changes in the rendered markup which may require updating any snapshots (if any) at your end

- dd0695d7: feat(blade): added bottomsheet body zero padding option

## 8.11.3

### Patch Changes

- e62244f8: fix: Dropdown opening up when clicked on ChevronDownIcon in disabled state

## 8.11.2

### Patch Changes

- f828bc94: fix: react native display style bug

## 8.11.1

### Patch Changes

- 3f72c0df: fix: dynamic positioning of dropdown overlay

## 8.11.0

### Minor Changes

- acc35a2e: fix: support `min-content`, `none`, `fit-content` in SpacingValueType of Box and styled-props

### Patch Changes

- 9fc66217: feat(blade): added support for React.ReactNode on Title & Heading component
- b08d09d8: fix(blade): fix modal portal ssr

## 8.10.3

### Patch Changes

- 62522f3e: fix(dropdown): dropdown overlay positioning

## 8.10.2

### Patch Changes

- 99016aff: feat(blade): add support for as prop for typography components
- f08e6d4f: fix(blade): remove unnecessary attributes from dom

## 8.10.1

### Patch Changes

- 17e5bae0: fix(patch-package): move to dependencies
  - this should fix an issue with `patch-package` when trying to install latest version of blade
- 33b507bc: fix(blade): invalid dom nesting in Link

## 8.10.0

### Minor Changes

- ba05928c: feat: add `Accordion` and `Collapsible` pre-release

  - `Accordion` and `Collapsible` are available on web as pre-release
  - You may import and use the following: `Accordion_PRE_RELEASE` and `Collapsible_PRE_RELEASE`

  > **Warning**
  >
  > These components are in pre-release which means there might be some changes by the stable release and there might be some rough edges.

## 8.9.1

### Patch Changes

- 7613ca13: fix: show decimal upto 2 places when `isAfixSubtle:false`

## 8.9.0

### Minor Changes

- d62a86d4: feat(blade): added tooltip component

  Blade now has a peer dependency on [FloatingUI](https://floating-ui.com/), make sure to install it.

  For web:

  ```
  yarn add @floating-ui/react
  ```

  For native:

  ```
  yarn add @floating-ui/react-native
  ```

## 8.8.4

### Patch Changes

- 333d0e7e: fix(DropdownOverlay): fix incorrect minWidth condition

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
  :

  - '@razorpay/blade/tokens': '@razorpay/blade/build/tokens/index.development.web.js',
  - '@razorpay/blade/utils': '@razorpay/blade/build/utils/index.development.web.js',
  - '@razorpay/blade/components': '@razorpay/blade/build/components/index.development.web.js',
    },

  ```

  ## Third Party Libs

  While this change is not a breaking change, but we've made a few changes in how the dependencies are handled by blade internally.

  - Web:

  In web, we've marked all the dependencies as `external`, that means you don't need to install the peer dependencies manually,
  If you have `@floating-ui/react` in your `package.json` you can safely remove it, yarn/npm will automatically install the appropriate version for you.

  - Native:

  In native, we've marked all the dependencies as peerDependencies, so that web consumers doesn't have to install them + ensures there are no mismatches between blade vs consumer dependencies.
  Please refer to the [installation guide](https://blade.razorpay.com/?path=/docs/guides-installation--page#-add-blade-to-your-application)https://blade.razorpay.com/?path=/docs/guides-installation--page#-add-blade-to-your-application for more details.
  ```

### Patch Changes

- 2b37cf6e: feat(TextInput): onClick prop added to TextInput

## 10.21.0

### Minor Changes

- 32d188e6: feat(Collapsible): mark width prop as external

  > [!WARNING]
  >
  > If you were using internal `_width` prop, you will have to rename it to `width`

  ```diff
  - <CollapsibleBody _width={} />
  + <CollapsibleBody width={} />
  ```

## 10.20.1

### Patch Changes

- e89018c4: feat(Dropdown): Support `width` prop on DropdownOverlay
- 37fa68cb: fix: define stylis plugin name property

## 10.20.0

### Minor Changes

- 87d9638b: feat: increase the CSS specificity of all components

  > [!WARNING]
  >
  > **We've enhanced the specificity of styles for Blade components. If you've defined styles in separate CSS at a root level targeting blade components, please note that they may no longer take effect as expected.
  > The styles within the blade components will now take precedence.**
  >
  > **Your existing component snapshots may update, there is no change in the visual appearance of components. Please feel free to add the updated snapshots.**

### Patch Changes

- 1da66413: fix(blade): page gets scrolled to top on iOS when bottomsheet open
- 2219e9a1: fix: refined text input label truncation for single-word overflow

## 10.19.1

### Patch Changes

- 0d0e72ea: fix(blade): fixed SpotlightPopoverTour bugs

  - Safari body-scroll-lock causing the page to get clipped because storybook doesn't set width/height on body - fixed by setting width/height
  - Initial delay of opening the mask - fixed by immediately updating the mask size on initial render
  - Delay of transitioning between steps which occurs because we need to wait for the animation to finish before scrolling otherwise the scroll gets interrupted - fixed by reduced this to 100ms

## 10.19.0

### Minor Changes

- 23a3e111: feat: Add `Table` component

## 10.18.2

### Patch Changes

- 9967cd96: fix: set default breakpoint without computing

## 10.18.1

### Patch Changes

- 77b31aa1: fix(blade): remove extra margin left on carousel

## 10.18.0

### Minor Changes

- 88aba1d6: feat(blade): added SpotlightPopoverTour web implementation

## 10.17.4

### Patch Changes

- 97b9b4cc: fix(TextInput): white placeholder on autoFocus in android

## 10.17.3

### Patch Changes

- 49db8d7c: chore(blade): only allow CarouselItem in Carousel children
- ab2b1800: fix(blade): fixed react-native bottomsheet state bugs

## 10.17.2

### Patch Changes

- f0d4dce5: fix: react native text input alignment with prefix

## 10.17.1

### Patch Changes

- a0d3b13d: chore(blade): add file zip icon
- 66a16267: fix(Dropdown): use popup background color token in DropdownOverlay and Popover

  > **Note**
  >
  > For consumers, this changes the color of Dropdown overlay to fainter version in dark mode. It shouldn't break anything and hence the snapshots can be safely updated.

## 10.17.0

### Minor Changes

- a35f5dfc: feat: update popup token, migrate overlay tokens

  > **Warning**
  >
  > `theme.colors.overlay.background` is moved to `theme.colors.surface.overlay.background[800]`.
  >
  > Based on our analytics data, its a rarely used token hence, its a non-breaking change for most consumers (1 instance in razorpay/x repo).
  > Although it is recommended to search for `colors.overlay.background` in your repo and confirm once if its not being used. If it is used you can follow migration step below.

  ```diff
  - background={theme.colors.overlay.background}
  + background={theme.colors.surface.overlay.background[800]}
  ```

## 10.16.0

### Minor Changes

- fc7c8408: feat(blade): tabs implementation

  > [!NOTE]
  > We've updated `@floating-ui/react` to version `0.25.4`
  > Consumers may need to update their jest snapshots

### Patch Changes

- c6d1ad9b: fix: update carousel nav button tokens
- a17076b8: chore: fix popover close button background

## 10.15.3

### Patch Changes

- f1ab23c8: fix(blade): remove preventDefault in selector label

## 10.15.2

### Patch Changes

- 360abe73: fix(Autocomplete): enhance input handling for controlled scenarios
- 69098f16: fix(checkbox): fixed alignment
- 71ea0ac5: fix(Dropdown): enhance tag selection handling
- 44153ba4: feat(Typography): accept `brand.secondary.500` as a valid `color` prop value
- 8fdef8a7: docs: improve documentation aesthetics
- 277ba6fa: fix(AutoComplete, SelectInput): disable tags in input when `isDisabled` is set to true
- 08c161b6: fix(ActionListItem): checkbox spacing

## 10.15.1

### Patch Changes

- f9d16dc4: fix(Alert): correct color prop behavior

## 10.15.0

### Minor Changes

- 87c5a6ee: feat(Box): add `transform`, `transformOrigin`, `clipPath`, `opacity`, & `visibility` props

### Patch Changes

- 76d80dc2: fix(Input): ensure correct value passing for trailingFooterSlot & trailingHeaderSlot

## 10.14.7

### Patch Changes

- 59f0b92c: fix: carousel indicator sync bug

## 10.14.6

### Patch Changes

- 7738f70b: fix(Tooltip): prevent overriding the `aria-label` attribute
- f38f7c0a: fix: react native crash with reanimated

## 10.14.5

### Patch Changes

- 47b8149d: feat(ListItemText): make span as default tag for ListItemText

## 10.14.4

### Patch Changes

- 87f75b03: feat: support `brand*` colors on Icon and borderColor styled prop

## 10.14.3

### Patch Changes

- 4d6e6aeb: fix(AutoComplete): hide ActionListSection when items are filtered out

## 10.14.2

### Patch Changes

- 3b76e389: fix(blade): remove FloatingFocusManager and added more tests

  Fixes bug with floating ui where it was adding aria-hidden to dropdown trigger. more context [here](https://razorpay.slack.com/archives/CMQ3RBHEU/p1695972277506429?thread_ts=1693739607.070049&cid=CMQ3RBHEU).

## 10.14.1

### Patch Changes

- a65ebf9c: feat(blade): update to use focus-visible

  This will ensure that focus will only appear while using keyboard.
  Note that this is a non-breaking change but you might need to update UT snapshots.

## 10.14.0

### Minor Changes

- dc3e240b: feat: add `color` prop to `Alert`, `Badge`, `Button`, `Chip`, `ChipGroup`, `Counter`, `Link`, & `Spinner`

  #### Color Tokens Update

  **[New White Color Tokens:](https://blade.razorpay.com/?path=/docs/tokens-colors--page)** Introducing white color tokens, enabling white buttons and links for enhanced design options.

  #### Deprecated `intent` prop in favor of the new `color` prop

  - **Alert** - Deprecated `intent` prop.
  - **Badge** - Deprecated `variant` prop.
  - **Chip & ChipGroup** - Deprecated `intent` prop.
  - **Counter** - Deprecated `variant` and `intent` prop.
  - **Spinner** - Deprecated the `contrast` prop.

  #### Jest Snapshots

  Your existing component snapshots may update, there is no change in the visual appearance of components. Feel free to commit the updated snapshots.

## 10.13.2

### Patch Changes

- a047ea61: fix(AutoComplete): handle focus ring on option change

## 10.13.1

### Patch Changes

- d22cbd3d: fix(AutoComplete): Handle inputValue in Controlled Single Selection
- acd0f7b0: fix: change autocomplete search logic from startsWith to includes

## 10.13.0

### Minor Changes

- e99730d7: feat: support customizing Blade Theme with a single brand color

  You can find a detailed documentation [here](https://blade.razorpay.com/?path=/docs/guides-theming-createtheme--page)

  ### Example Usage

      ```tsx
      const customTheme = createTheme({ brandColor: '#19BEA2' })

      <BladeProvider themeTokens={customTheme} colorScheme={colorScheme}>
       {App}
      </BladeProvider>
      ```

## 10.12.1

### Patch Changes

- 68820c36: feat: radio & checkbox integration with card

## 10.12.0

### Minor Changes

- 2f2fcab4: feat(blade): add ref to OTP Input

### Patch Changes

- dc42ae1e: fix(Box): correctly apply border styles

## 10.11.0

### Minor Changes

- c4242ad4: feat(Dropdown): add isOpen and onOpenChange

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

- 18748f1f: feat(ActionListItem): add ActionListItemBadge component and `titleSuffix` option on ActionListItem

## 10.10.0

### Minor Changes

- 18bdaed2: feat(blade): added Popover component

  **Tooltip Changes**

  - Added a new prop `title`

### Patch Changes

- c4ef32f8: chore: export popover & update status table

## 10.9.2

### Patch Changes

- 86c57372: fix: type exports for Select and AutoComplete types

## 10.9.1

### Patch Changes

- 1be2fecf: fix(AutoComplete): AutoComplete Storybook panel and React Native Icon Alignment in PasswordInput

## 10.9.0

### Minor Changes

- 31fa01eb: feat(AutoComplete): add AutoComplete component

## 10.8.1

### Patch Changes

- 09ca73d2: fix(ActionList): divider being added to last ActionListSection

## 10.8.0

### Minor Changes

- ac405dfc: chore(blade): added id to Box component

## 10.7.1

### Patch Changes

- 52288df2: fix(blade): carousel bug in safari

## 10.7.0

### Minor Changes

- f43d9b35: feat(Icon): add default value for `size` & `color` props

## 10.6.0

### Minor Changes

- 1732199a: fix(blade): fix firefox bug in carousel & fixed visible items not switching to `1` on mobile devices.

## 10.5.0

### Minor Changes

- 3fc6ba3a: feat(Typography): add a new `Display` component

  The Display component adds a strong visual touch. Utilize it to create eye-catching sections on your landing pages.

## 10.4.4

### Patch Changes

- f1478f1b: fix(blade): extra left/right padding on amount component

## 10.4.3

### Patch Changes

- 6b69d0e5: fix(blade): fixed card link overlay not working when wrapper is set to position:relative

## 10.4.2

### Patch Changes

- 3d3bef8e: chore(blade): remove broken figma link from Card

## 10.4.1

### Patch Changes

- 6ca6d35b: fix(Amount): correctly round the value upto 2 decimal places

## 10.4.0

### Minor Changes

- a561aaca: feat: Add new `Chip` and `ChipGroup` components

### Patch Changes

- 9278e808: fix(blade): use thicker border in selected card

## 10.3.2

### Patch Changes

- 67e0ae96: feat(blade): added interactive Card

  Enables cards to be used as clickable, linkable & selectable.

## 10.3.1

### Patch Changes

- 5f500f3d: fix(DropdownOverlay): Dropdown clipping issue in overflow scroll containers

## 10.3.0

### Minor Changes

- 5872d7ea: refactor(blade): remove useBladeInnerRef & expose native DOM nodes via ref

## 10.2.1

### Patch Changes

- 98291854: chore: make accordion min-width 360px for large screens
- 5f2f3e44: feat: add large size to List component

## 10.2.0

### Minor Changes

- 30109b99: feat(blade): added Carousel component

## 10.1.0

### Minor Changes

- 0e2d5154: feat(Box): add `draggable`, `onDragStart`, `onDragEnd`, `onDragEnter`, `onDragLeave`, `onDragOver`, `onDrop`, `pointerEvents`, & `placeItems` props

## 10.0.0

### Major Changes

- abf52f07: build: upgrade react `v18.2.0`, react-native `v0.72.3` & other libraries

  ### Upgrade the following packages:

  - `react` to `18.2.0`
  - `react-native` to `0.72.3`
  - `react-dom` to `18.2.0`
  - `react-native-reanimated` to `3.4.1`
  - `react-test-renderer` to `18.2.0`
  - `@react-native-async-storage/async-storage` to `1.19.1`
  - `@testing-library/react` to `13.4.0`
  - `@testing-library/react-native` to `12.2.0`

  ### Migration Guide

  - You can follow [React's](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) & [React Native's](https://react-native-community.github.io/upgrade-helper/?from=0.66.5&to=0.72.3) guides to update your packages to the latest version
  - If you are using `npm` as your package manager and continue to remain on `react` `v17`, you will have to run `npm install` with `--legacy-peer-deps` flag otherwise you will encounter react version mismatch errors
  - React Native consumers will need to upgrade to `react-native-reanimated` `v3`

## 9.7.0

### Minor Changes

- d5d174fa: feat: make `Badge`, `Counter`, & `Indicator` components `inline-flex` by default

### Patch Changes

- f4624db2: fix: react native errors with floating-ui/react
- 2e20ce04: feat(Box): add support for the `transparent` background color

## 9.6.1

### Patch Changes

- 5fb722d8: fix(Switch): correct cursor style in disabled state

## 9.6.0

### Minor Changes

- 50d55a5f: feat(Amount): add support for more currencies

## 9.5.3

### Patch Changes

- d7183b49: fix(SelectInput): truncate text in select input
- 59518acb: feat(BottomSheet): add `zindex` prop & improve focus management logic

  Thanks to @archie252000 for his contribution!

## 9.5.2

### Patch Changes

- a1e75040: fix: standardize logs & errors
- 37bdc811: fix(Box): handle `undefined` for `backgroundColor` prop
- e8a81131: fix: remove className from Button, svg, Link

  > **Note**
  >
  > There was an internal bug introduced with styled-props which allowed certain props like className to pass through and get added on DOM. This release fixes that bug.

  This will be non-breaking for most projects (especially if you're using TypeScript).

  If your project happened to use `className` prop on Button, SVG Icons, or Link, it will stop working post this release.

## 9.5.1

### Patch Changes

- 14271605: refactor: move to `React.ReactElement` type

## 9.5.0

### Minor Changes

- cbed430f: feat: strip off logs & errors in production builds

#### Jest v27 and Custom Resolver Compatibility

For users on Jest v27 or older, or those with custom Jest resolvers (like `jest-directory-named-resolve`) not supporting `package.json` exports, a `moduleNameMapper` update is needed. This ensures compatibility with the `@razorpay/blade` package:

```diff
  moduleNameMapper: {
    // ...rest of your config
+   '@razorpay/blade/components': '<rootDir>/node_modules/@razorpay/blade/build/components/index.development.web.js',
+   '@razorpay/blade/utils': '<rootDir>/node_modules/@razorpay/blade/build/utils/index.development.web.js',
+   '@razorpay/blade/tokens': '<rootDir>/node_modules/@razorpay/blade/build/tokens/index.development.web.js',
  },
```

### Patch Changes

- 2be798d9: feat: add zIndex prop to Tooltip

## 9.4.1

### Patch Changes

- ebd3cbda: feat: add zIndex prop for Modal

## 9.4.0

### Minor Changes

- 5bddbe08: feat(Input): make `label` prop optional & add `accessibilityLabel` prop to `TextInput`, `TextArea`, `PasswordInput`, `SelectInput`, and `OTPInput` components

  #### Key Updates

  - **Optional `label` Prop**: We understand that not all use cases require a label for the Input components. Therefore, we have made the label prop optional, providing you with the freedom to choose whether to display a label or not, depending on your specific application requirements.

  - **Introducing `accessibilityLabel`:** Recognizing the significance of accessibility in modern applications, we have added the `accessibilityLabel` prop to the Input components. This prop enables developers to assign a descriptive label for the input field, making it more user-friendly for individuals using assistive technologies or screen readers.

  - **Enhanced User Guidance:** To maintain usability, we have implemented a requirement that either the `label` or `accessibilityLabel` prop must be provided. This ensures that users will always have clear guidance when interacting with Inputs, promoting a seamless user experience.

## 9.3.0

### Minor Changes

- d28d8a72: feat(Tag): add Tag component

## 9.2.0

### Minor Changes

- 37d84ce7: feat: support `display` prop for all components with styled props

  Restructures few components to ensure adding a display prop doesn't break the components

## 9.1.2

### Patch Changes

- 6763f5fa: fix(List): re-export ListItemText

## 9.1.1

### Patch Changes

- fe31363e: fix(Input): correct helpText and input box alignment
- e7317212: fix: add border-style when border width or color is set

## 9.1.0

### Minor Changes

- b1a1faef: feat(blade): added Skeleton Component

### Patch Changes

- 199d6f0e: fix(Card): fix spacing between header & leading on react native
- dd234a65: feat: add support for ListItemText within List

## 9.0.3

### Patch Changes

- 538390be: feat(Box, Typography): expose brand colors

  - On Box, we're exposing all `brand.*` tokens on the background.
  - On Typography, we're exposing all `brand.primary.*` tokens as color prop

- d880e8e9: fix(Dropdown, BottomSheet): prioritise bottomsheet controlled state over dropdown

## 9.0.2

### Patch Changes

- 8f4bc791: fix: CollapsibleLink arrow orientation when `direction` is top

## 9.0.1

### Patch Changes

- dfea4962: fix(DropdownOverlay): position of Overlay with label on left

## 9.0.0

### Major Changes

- 3d10cecb: fix: make OTPInput fluid width

  ## ⚠️ Breaking change for OTPInput component

  Changes the OTPInput to have a fluid width compared to a fixed width of 36px per field earlier

  ### Migration guide

  **It is recommended to let the OTPInput take the entire width of the parent form in order to ensure consistency with the rest of the Input elements.**

  If you still want to keep the UI for OTPInput on your existing screens the same, you can do the following:

  1. Wrap `OTPInput` with a `Box` component and assign a `maxWidth` of `168px` (for `otpLength` of 4) or `256px` (for `otpLength` of 6)

  ```diff
  + <Box maxWidth='256px' />
    <OTPInput label='Enter OTP' otpLength={6} />
  + </Box>
  ```

  **Before this change (OTPInput with fixed width):**

  <img width="362" alt="Screenshot 2023-06-28 at 2 50 05 PM" src="https://github.com/razorpay/blade/assets/24487274/6d23c4a8-6c27-44f1-bb47-0d2b61025a06">

  **After making OTPInput fluid width (OTPInput with fluid width):**

  <img width="354" alt="Screenshot 2023-06-28 at 2 49 57 PM" src="https://github.com/razorpay/blade/assets/24487274/c3e40176-9f22-451e-a443-1274c4333aec">

### Patch Changes

- 92711d39: feat: standardize isRequired & necessityIndicator across `Checkbox`, `Radio` & `Input` components

  You can now control the `required` property of Checkbox, Radio & Input components with `neccessityIndicator` as well as `isRequired` props

## 8.15.3

### Patch Changes

- 4dd62afd: fix(blade): bottomsheet ssr fix

## 8.15.2

### Patch Changes

- b2f55b7a: fix(blade): tooltip zIndex issue

## 8.15.1

### Patch Changes

- c802e72f: feat: add blue variant to Counter component & change intent to variant

  ## ⚠️ Changes for Counter component with backward compatibility

  Changes the `intent` prop to `variant` since we support more than Feedback colors with the addition of `blue` color for Counter. We will continue to support `intent` prop for backward compatibility but it will be deprecated in an upcoming major release.

  ### Migration guide

  1. Replace all instances of Counter's `intent` prop with `variant
     > The change is only in the naming of the prop, the value will remain unchanged.

  ```diff
   <Counter
  -  intent='positive'
  +  variant='positive'
     value={42}
   />
  ```

## 8.15.0

### Minor Changes

- bd5ededd: feat(DropdownHeaderFooter): add DropdownHeader DropdownFooter components

  We have standardised the Header and Footer between Dropdown, BottomSheet, Modal, and any future components.

  > **Warning**
  >
  > **Breaking Change :** For consumers who use - `ActionListHeader` or `ActionListFooter`.
  >
  > Through our code search we found there weren't any instances of these component in Razorpay code yet thus this is released under minor version

  ## Migration Guide

  > **Note**
  >
  > The Header and Footer are redesigned so it might not be possible to have 1:1 designs. The new header and footer will look different.

  1. Remove `ActionListHeader` and `ActionListFooter` from the inside of the `ActionList`
  2. Add `DropdownHeader` and `DropdownFooter` outside of the `ActionList`, inside `DropdownOverlay`.

  ```diff
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionListHeader,
    ActionListFooter,
    ActionList,
    ActionListItem
  } from '@razorpay/blade/components';

  function App() {
    return (
      <Dropdown>
        <SelectInput label="Select City" />
        <DropdownOverlay>
  +       <DropdownHeader title="Title" />
          <ActionList>
  -          <ActionListHeader title="Title" />
              <ActionListItem />
              <ActionListItem />
  -          <ActionListFooter trailing={<Button>Apply</Button>} />
          </ActionList>
  +       <DropdownFooter>
  +         <Box><Button>Apply</Button></Box>
  +       </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export { App };
  ```

  Checkout [Dropdown Docs](https://blade.razorpay.com/?path=/story/components-dropdown-dropdown--page&globals=showInternalComponents:true;measureEnabled:false) for more details

## 8.14.0

### Minor Changes

- e1f37f69: feat: add `Divider` component

## 8.13.0

### Minor Changes

- 865cd411: refactor: remove internal utilities from index re-exports

  > **Warning**
  >
  > We have removed some of the undocumented internal utilites from re-export of `@razorpay/blade/utils`.
  > We went through the imports usage of Razorpay and made sure to keep exporting the utilities that are currently being used to avoid breaking changes.

  You can take a look at re-exports of [utils/index.ts](https://github.com/razorpay/blade/blob/master/packages/blade/src/utils/index.ts) to know which are the public utilities that we support. This is part of the larger effort in exporting and documenting useful utilities from blade and avoid exporting internal utilities which might break during internal refactors.

  We have marked 2 utilities as `@deprecated` as they are expected to be internal utilities but currently being used in Razorpay. These will be removed in future major versions and won't be documented.

  - `toTitleCase`
  - `usePrevious`

  We would recommend moving these 2 utilities to your local repo utilities.

### Patch Changes

- f4c2afb5: feat: add background-image, size, position, origin, repeat props
- 610422ab: feat: add text decoration support for typography

  Thanks [@archie252000](https://github.com/archie252000) for the contribution!

## 8.12.1

### Patch Changes

- fa8b2361: feat(blade): add and update data attributes in child components

## 8.12.0

### Minor Changes

- 0478669a: feat: add `Accordion` and `Collapsible` components

  > **Note**
  >
  > If you're upgrading from earlier PRE_RELEASE, there are no breaking changes in the API, however there are some changes in the rendered markup which may require updating any snapshots (if any) at your end

- dd0695d7: feat(blade): added bottomsheet body zero padding option

## 8.11.3

### Patch Changes

- e62244f8: fix: Dropdown opening up when clicked on ChevronDownIcon in disabled state

## 8.11.2

### Patch Changes

- f828bc94: fix: react native display style bug

## 8.11.1

### Patch Changes

- 3f72c0df: fix: dynamic positioning of dropdown overlay

## 8.11.0

### Minor Changes

- acc35a2e: fix: support `min-content`, `none`, `fit-content` in SpacingValueType of Box and styled-props

### Patch Changes

- 9fc66217: feat(blade): added support for React.ReactNode on Title & Heading component
- b08d09d8: fix(blade): fix modal portal ssr

## 8.10.3

### Patch Changes

- 62522f3e: fix(dropdown): dropdown overlay positioning

## 8.10.2

### Patch Changes

- 99016aff: feat(blade): add support for as prop for typography components
- f08e6d4f: fix(blade): remove unnecessary attributes from dom

## 8.10.1

### Patch Changes

- 17e5bae0: fix(patch-package): move to dependencies
  - this should fix an issue with `patch-package` when trying to install latest version of blade
- 33b507bc: fix(blade): invalid dom nesting in Link

## 8.10.0

### Minor Changes

- ba05928c: feat: add `Accordion` and `Collapsible` pre-release

  - `Accordion` and `Collapsible` are available on web as pre-release
  - You may import and use the following: `Accordion_PRE_RELEASE` and `Collapsible_PRE_RELEASE`

  > **Warning**
  >
  > These components are in pre-release which means there might be some changes by the stable release and there might be some rough edges.

## 8.9.1

### Patch Changes

- 7613ca13: fix: show decimal upto 2 places when `isAfixSubtle:false`

## 8.9.0

### Minor Changes

- d62a86d4: feat(blade): added tooltip component

  Blade now has a peer dependency on [FloatingUI](https://floating-ui.com/), make sure to install it.

  For web:

  ```
  yarn add @floating-ui/react
  ```

  For native:

  ```
  yarn add @floating-ui/react-native
  ```

## 8.8.4

### Patch Changes

- 333d0e7e: fix(DropdownOverlay): fix incorrect minWidth condition

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
