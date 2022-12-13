# Dropdown & ActionList

Dropdown Menu displays a list of choices on temporary surfaces. They allow users to make a selection from multiple options. They appear when users interact with a button, action, or other control.

<br/>

**Top-View Skeleton**

```jsx
<Dropdown>
  <SelectInput label="Item Selection" />
  <DropdownOverlay>
    <ActionList>
      <ActionListItem title="Item Value" value="item-one" />
      <ActionListItem title="Item Value" value="item-two" />
    </ActionList>
  </DropdownOverlay>
</Dropdown>
```

<br/>

## Navigation

- [Dropdown](#dropdown)
  - [SelectInput](#selectinput)
  - [DropdownOverlay](#dropdownoverlay)
- [ActionList](#actionlist)
  - [ActionList Parent Component](#actionlist-parent-component)
  - [ActionListItem](#actionlistitem)
  - [ActionListSection](#actionlistsection)
  - [ActionListHeader](#actionlistheader)
  - [ActionListFooter](#actionlistfooter)
- [Why `x` instead of `y`](#why-x-instead-of-y)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)
- [Referrences](#referrences)

---

<br/>

## Dropdown

`Dropdown` will be a wrapper component which will handle the logic of opening and closing of the dropdown. It won't separately render anything in UI apart from the first children. (E.g. `SelectInput` in above example)

### API

Usage

```jsx
<Dropdown>{/* Dropdown sub-components */}</Dropdown>
```

Props

_No Props Needed_

### SelectInput

<img src="2022-11-24-16-33-30.png" alt="Select Field Figma Designs" width="500" />

Select is an Input Field that can open a dropdown on click. It can be extended from `BaseInput` component which covers most decisions like validations, focus, etc.

#### Designs

- [Figma - Select](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13590%3A171090&t=KTWGvEUBEuUdQh9K-0)

#### API

Sample Usage

```jsx
<SelectInput icon={CalendarIcon} label="Your favorite Design System" helpText="Select only one" />
```

Props

Mostly similar to other `Input` components extended from `BaseInput`

```ts
type SelectInputProps = {
  // ... FormLabelProps like `label`, `labelPosition`
  // ... FormValidationProps like `validationState`, `helpText`, `errorText`, etc.
  // ... State Props like `isRequired`, `isDisabled`,
  icon: IconComponent;
};
```

#### A11y

Would be ideal if we can render it as `button` with `aria-expanded` prop to handle state of dropdown open and close.

Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded#buttons

### `DropdownOverlay`

An Overlay that positions dropdown correctly.

Should handle the animations for dropdown.

#### API

Usage

```jsx
<Dropdown>
  <SelectInput label="Click For Greetings" />
  <DropdownOverlay>Hi</DropdownOverlay>
</Dropdown>
```

Props

_No Props Needed_

<br/><br/>

## ActionList

Plain list that can be rendered inside dropdown, in navigation menu, or anywhere. It has selectable items that perform some action on click. It can also have multiple selectable items that render as checkboxes

![](2022-12-08-16-58-46.png)

### Design

- [Figma - ActionList]()

### API

#### Simplest Usage Possible

```jsx
<ActionList
  surfaceLevel={2}
  onChange={(e) => {
    console.log({ name: e.name, values: e.values });
  }}
>
  <ActionListItem
    title="Accept API"
    value="accept"
    desciption="Accept this API"
    leading={<ActionListItemIcon icon={StarIcon} />}
    trailing={<ActionListItemText>⌘ + Space + A</ActionListItemText>}
    onClick={() => {}}
  />
  <ActionListItem
    title="Delete"
    desciption="Delete this value"
    value="delete"
    intent="negative"
    leading={<ActionListItemIcon icon={TrashIcon} />}
    trailing={<ActionListItemText>⌘ + Space + D</ActionListItemText>}
    onClick={() => {}}
  />
</ActionList>
```

#### Most Complex Usage Possible

```jsx
<ActionList surfaceLevel={2}>
  <ActionListHeader title="Recent Searches" icon={HistoryIcon} />
  <ActionListSection title="Section Heading">
    <ActionListItem
      title="Accept API"
      value="accept"
      desciption="Accept this API"
      leading={<ActionListItemIcon icon={StarIcon} />}
      trailing={<ActionListItemText>⌘ + Space</ActionListItemText>}
    />
  </ActionListSection>
  <ActionListItem
    title="Delete"
    desciption="Delete this value"
    value="delete"
    intent="negative"
    leading={<ActionListItemIcon icon={TrashIcon} />}
    trailing={<ActionListItemText>⌘ + Space + D</ActionListItemText>}
  />
  <ActionListFooter
    title="Footer Title"
    description="Footer Description"
    leading={<ActionListFooterIcon icon={DocIcon} />}
    trailing={
      <>
        <Button variant="secondary">Secondary Button</Button>
        <Button>Primary Button</Button>
      </>
    }
  />
</ActionList>
```

<details>
<summary>Alternate Prop-based API</summary>

**Props and constrained**

```jsx
<ActionList surfaceLevel={2}>
  <ActionListHeader title="Recent Searches" icon={HistoryIcon} />
  <ActionListSectionHeading title="Hello" />
  <ActionListItem
    title="Item Value"
    desciption="Item Description"
    leading={StarIcon} // Can be IconComponent type or Image URL
    trailing="⌘ + Space"
  />
  <ActionListDivider />
  <ActionListFooter
    title="Footer Title"
    description="Footer Description"
    leading={DocIcon}
    trailing={{
      primary: {
        onClick: () => {},
        text: 'Primary Action',
      },
    }}
    // OR
    trailing={ArrowRightIcon}
    // OR
    trailing={{
      primary: {
        onClick: () => {
          console.log('Feedback Yes Clicked');
        },
        icon: CheckIcon,
      },
      secondary: {
        onClick: () => {
          console.log('Feedback No Clicked');
        },
        icon: CrossIcon,
      },
    }}
  />
</ActionList>
```

</details>

### `ActionList` Parent Component

Wrapper for all ActionList compound components. Should handle the logic of selections.

#### API

Usage

```jsx
<ActionList>{/* Child components */}</ActionList>
```

Props

```ts
type ActionListProps = {
  children: React.ReactNode;

  /**
   * Renders simple menu or checkboxes depending on the type selected here
   *
   * @default single
   */
  selectionType?: 'single' | 'multiple';

  /** Callback that gets called when item is checked/clicked */
  onChange?: () => void;

  /**
   * Changes the background surface level color
   *
   * @default 2
   */
  surfaceLevel: 2 | 3;
};
```

### `ActionListItem`

![](2022-11-29-17-29-01.png)

#### Design

- [Figma - ActionListItem / Body](https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=13136%3A378703&t=RoEboUS3qWdStKK6-0)

#### API

Usage

```jsx
<ActionListItem
  title="Accept API"
  value="accept"
  desciption="Accept this API"
  leading={<ActionListItemIcon icon={StarIcon} />}
  intent="negative"
  trailing={<ActionListItemText>⌘ + Space + A</ActionListItemText>}
  isDefaultSelected={false}
  onClick={() => {
    console.log('Item clicked');
  }}
/>
```

Props

```ts
type ActionListItemProps = {
  title: string;

  description: string;

  /** Value that we use in JS form. Similar to `value` in `Checkbox` */
  value: string;

  /**
   * Leading Icon or assets. Accepts JSX Component
   *
   * Should not be allowed when ActionList selectionType is multiple select
   */
  leading?: React.ReactNode;

  /**
   * Trailing Assets. Should ideally be ActionListItemText component for now
   */
  trailing?: React.ReactNode;

  /**
   * Changes item color to red
   *
   * @default neutral
   */
  intent?: 'negative' | 'neutral';

  /** Click event on item */
  onClick?: () => void;

  /**
   * Set true if you want item to be selected by default
   *
   * Should not be allowed when intent is set to negative
   */
  isDefaultSelected?: boolean;

  /** URL. Should render item as `a` when this is passed */
  href?: string;
};
```

### `ActionListSection`

Just an API that wraps section inside ActionList.

This entire component is optional. So it may not be added in the ActionList that doesn't have any sections.

It should also add divider after all items.

#### API

```jsx
<ActionList>
  <ActionListSection title="Section Heading">
    <ActionListItem
    // ...props
    />
  </ActionListSection>
</ActionList>
```

<details>
<summary>Previously Considered API</summary>

```jsx
<ActionList>
  <ActionListSectionHeading title="Section Heading" />
  <ActionListItem
  // ...props
  />
  <ActionListDivider />
</ActionList>
```

We dropped this because people might tend to put Dividers after every item. It doesn't really explain grouping in any way whereas `ActionListSection` API clearly defines the sections in items.

</details>

#### Props

```ts
type ActionListSectionProps = {
  /** Section Heading. Should be optional */
  title?: string;
};
```

### `ActionListHeader`

Header of the ActionList

<img src="2022-11-29-17-36-50.png" alt="ActionListHeader Figma Design" width="300" />

#### Design

- [Figma - ActionListItem / Header](https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=13136%3A378703&t=RoEboUS3qWdStKK6-0)

#### API

Usage

```jsx
<ActionListHeader title="Recent Searches" icon={HistoryIcon} />
```

Props

```ts
type ActionListHeaderProps = {
  title: string;
  icon: IconComponent;
};
```

### `ActionListFooter`

> **Warning**
>
> API yet to be finalized

Footer of the ActionList

![](2022-11-29-17-40-17.png)

#### Design

- [Figma - ActionListItem / Footer](https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=13136%3A378703&t=RoEboUS3qWdStKK6-0)

#### API

**Usage**

Simple Usage

```jsx
<ActionListFooter title="Footer Title" description="Footer Description" />
```

With Feedback Variant

```jsx
<ActionListFooter
  title="Footer Title"
  description="Footer Description"
  leading={<ActionListFooterIcon icon={DocIcon} />}
  trailing={
    <>
      <IconButton onClick={} icon={CloseIcon} />
      <IconButton onClick={} icon={CheckIcon} />
    </>
  }
/>
```

With Only Primary Button

```jsx
<ActionListFooter trailing={<Button onClick={}>Apply</Button>} />
```

**Props**

```ts
type ActionListFooter = {
  title?: string;

  description?: string;

  /** Leading Asset. Ideally ActionListFooterIcon */
  leading?: React.ReactNode;

  /** Trailing Actions. Buttons, Icons, etc */
  trailing?: React.ReactNode;
};
```

<details>
<summary>Alternate Footer API</summary>

**More restrictive and prop-based**

```jsx
<ActionListFooter
  title="Footer Title"
  description="Footer Description"
  leadingIcon={DocIcon}
  trailingActions={{
    primary: {
      onClick: () => {
        console.log('Apply clicked');
      },
      text: 'Apply',
    },
  }}
  // OR
  trailingActions={{
    feedbackYes: {
      onClick: () => {
        console.log('Feedback Yes Clicked');
      },
    },
    feedbackNo: {
      onClick: () => {
        console.log('Feedback No Clicked');
      },
    },
  }}
  // OR
  trailingIcon={ArrowForward}
/>
```

</details>

<br/><br/>

## Why `X` instead of `Y`?

### Flexible instead Constrained API

So far we've been having constrained APIs which worked well. The difference here is, Dropdown in itself is a large component so if one of those contrains don't work for a particular team, they should not have to completely opt-out of the Dropdown. There has to be a simpler escape-hatch for them.

For this reason, you would see us passing entire JSX components instead of limiting it to specific type like we do in other components.

### Components as JSX props instead of Compound Components

Compound components add complex nesting in larger APIs (Check out previously considered API example below). To avoid complex nesting, we're going ahead with prop-based approach where we pass JSX components as props.

<details>
<summary>Previously considered compound component API</summary>

```jsx
<ActionList surfaceLevel={2}>
  <ActionList.Header title="Recent Searches" icon={HistoryIcon} />
  <ActionList.SectionHeading title="Hello" />
  <ActionList.Item title="Item Value" desciption="Item Description" intent="negative">
    <ActionList.Leading>
      <ActionListItemIcon icon={StarIcon} />
    </ActionList.Leading>
    <ActionList.Trailing>
      <ActionListItemText>⌘ + Space</ActionListItemText>
    </ActionList.Trailing>
  </ActionList.Item>
  <ActionList.Divider />
  <ActionList.Footer title="Footer Title" description="Footer Description">
    <ActionList.Leading>
      <ActionListFooterIcon icon={DocIcon} />
    </ActionList.Leading>
    <ActionList.Trailing>
      <Button variant="secondary" onClick={}>
        Secondary Button
      </Button>
      <Button onClick={}>Primary Button</Button>
    </ActionList.Trailing>
  </ActionList.Footer>
</ActionList>
```

</details>

### Individual Components instead of Compound Components

We use `ActionListItem` naming instead of `ActionList.Item` because for better tree-shaking we have to go by creating separate components like `<ActionListIcon icon={StarIcon} />` for assets, icons, and some of the other components atleast.

Then we're left with 2 naming conventions like `ActionListIcon` for some components and `ActionList.Item` for some components.

We decided to go without dot notation anywhere to remove the confusion and tree-shake better.

### Custom Implementation instead of Library

> **Note**
>
> Didn't get too much into implementation details during API decisions. Would recommend evaluating this once again while implementing the Dropdown.

TLDR; Felt like our Dropdown was a bit more complicated than other dropdowns we've seen so we might have to fight against existing opinions from libraries if we go with libraries.

Some libraries we evaluated

- [downshift-js](https://github.com/downshift-js/downshift)

  If we decide to go with library, this will definitely be the first thing we can explore.

  - 😄 Covers the accessibility and gives controls to consumers for styling
  - 🙁 Their API seemed a bit verbose and difficult to implement at first so unsure if it's worth adding library. (We should definitely refer to their Markup for accessibility practices though)
  - 😐 Around 20kb (~10kb for Select and ~10kb for MultiSelect)

- [@radix-ui/react-dropdown-menu](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
  - 😄 Covers the accessibility gives basic styling
  - 🙁 The items are also `Dropdown` compound components so we will have to tie our `ActionListItem` to `DropdownMenu.Item`. Which means `ActionList` can't be used outside of `Dropdown`?
  - 🙁 Opinionated so we might face more of such ^^ blockers as we discover more usecases.

<br/><br/>

## Accessibility

- For single select, we should have `role=menu` on the container and `role=menuitem` on list items
- For multiple select,

  - we should have `role=listbox` and `aria-multiselectable=true` on the container (because `role=menu` is expected to close after one item is selected)
  - Input search/filter should be outside of this container
    Refer: https://primer.style/react/storybook/?path=/story/components-selectpanel--multi-select-story

- Dropdown is supposed to open when you focus on select and press `ENTER`, `SPACE` or any of the arrow keys. Arrow Up and Down can be pressed to move to next and previous items in the action list. Should close on pressing `ESC`.

<br/><br/>

## Open Questions

### Dev

- Vote: `variant` or `type` attribute on `Dropdown`? `<Dropdown variant="multiple" />` vs `<Dropdown type="multiple" />`

- Should we call description/subtitle as `subtitle` everywhere, `description` everywhere, or change based on usage (E.g. See `ActionListItem` component above).

  Conclusion: Decide based on use-case.

  <details>
  <summary>Discussion Outcomes</summary>

  We will use `subtitle` and `description` based on the usecase. E.g. ActionListItem has description wheras CardHeader has subtitle so we will use prop based on

  </details>

- `ActionListFooter` `trailing` prop should allow all JSX components or limit to existing usecases (check Alternate API in [`ActionListFooter` section](#actionlistfooter))

- Should we use dot-based naming like `ActionList.Item` or create new components like `ActionListItem`?

  Conclusion: Use `ActionListItem` like components without dots. Check out [Individual Components instead of Compound Components](#individual-components-instead-of-compound-components) discussion

- Should we give control to users to open/close dropdown? can't think of any usecase right now 🤔. We can do that using `useDropdown` API

  <details>
  <summary>useDropdown API</summary>

  **`useDropdown` hook**

  A hook that gives state control of dropdown to user. Can be used in cases where you want to open dropdown on certain events (E.g. On pressing some keyboard keys)

  ```ts
  const { isDropdownVisible, setIsDropdownVisible } = useDropdown();

  const onKeyPressed = (e) => {
    // Opens dropdown when CTRL + K is pressed while dropdown was not visible
    if (e.ctrlKey && e.keyCode === 75 && !isDropdownVisible) {
      setIsDropdownVisible(true);
    }
  };
  ```

  Props

  ```ts
  type UseDropdownHookReturns = {
    /**
     * State to tell if dropdown is visible or not
     */
    isDropdownVisible: boolean;
    /**
     * function to call to change the dropdown state
     */
    setIsDropdownVisible: (isDropdownVisible: boolean) => void;
  };
  ```

  </details>

### Design

- Should we have some type of "Select All" button to select all in multiple select variant?
- Will Header always have title and icon only? can it have more things in future?

<br/><br/>

## References

- [Primer React's ActionMenu](https://primer.style/react/storybook/?path=/story/deprecated-components-actionmenu--action-menu-with-external-anchor)
- [Primer React's Select Panel](https://primer.style/react/storybook/?path=/story/components-selectpanel--multi-select-story)
- [Code crimes for good component APIs by Siddharth Kshetrapal - React India 2022](https://youtu.be/kr6V4TN09ws)
- [Radix UI Dropdown](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
- [MDN `role="menu"` Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role)
- [downshift-js](https://www.downshift-js.com/use-multiple-selection)

<br/><br/>

fin 🌻
