# Dropdown & ActionList

> **Warning**
>
> This document is in progress. Come back later 🏗 🚧 👷🏽

TODO

- [ ] `onSelect` props
- [ ] Finalize ActionList API
- [ ] Create props tables
- [ ] Cleanup

**Top-View Skeleton**

```jsx
<Dropdown variant="single">
  <Dropdown.SelectInput />
  <Dropdown.Overlay>
    <ActionList>{/* ActionList components ... */}</ActionList>
  </Dropdown.Overlay>
</Dropdown>
```

---

- [Dropdown](#dropdown)
  - [Dropdown.SelectInput](#dropdownselectinput)
  - [Dropdown.Overlay](#dropdownoverlay)
- [ActionList](#actionlist)
- [Why `x` instead of `y`](#why-x-instead-of-y)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)
- [Referrences](#referrences)

---

## Dropdown

`Dropdown` will be a wrapper component which will handle to logic of opening and closing of the dropdown. It won't separately render anything in UI apart from the first children. (E.g. `Dropdown.SelectInput` in above example)

### API

Usage

```jsx
<Dropdown>{/* Dropdown sub-components */}</Dropdown>
```

Props

```ts
type DropdownProps = {
  /**
   * Variant of the Dropdown.
   *
   * @default single
   */
  variant: 'single' | 'multiple';
};
```

### Dropdown.SelectInput

<img src="2022-11-24-16-33-30.png" alt="Select Field Figma Designs" width="500" />

Select is an Input Field that can open a dropdown on click. It can be extended from `BaseInput` component which covers most decisions like validations, focus, etc.

#### Designs

- [Figma - Select](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13590%3A171090&t=KTWGvEUBEuUdQh9K-0)

#### API

Sample Usage

```jsx
<Dropdown.SelectInput
  icon={CalendarIcon}
  label="Your favorite Design System"
  labelPosition="top"
  helpText="Select only one"
/>
```

Props

_All props are similar to the `BaseInput` props._

#### A11y

Would be ideal if we can render it as `Button` with `aria-expanded` prop to handle state of dropdown open and close

### `Dropdown.Overlay`

An Overlay that positions dropdown correctly. Also a wrapper for `React Portal`.

The animations for dropdown and Aria attributes like `aria-multiselectable="true"` `role="listbox"` like things can be added on Dropdown overlay here based on variant passed to `Dropdown` component.

#### API

```jsx
<Dropdown>
  <Dropdown.SelectInput label="Click For Greetings" />
  <Dropdown.Overlay>Hi</Dropdown.Overlay>
</Dropdown>
```

It won't accept any props apart from children.

## ActionList

<img src="2022-11-23-09-50-05.png" alt="ActionList figma screenshot" width="300" />

### Design

- [Figma - ActionList]()

### API

#### Simplest Usage Possible

```jsx
<ActionList backgroundLevel={2}>
  <ActionList.Item
    title="Accept API"
    value="accept"
    desciption="Accept this API"
    leading={<StarIcon />}
    trailing={<Text>⌘ + Space + A</Text>}
  />
  <ActionList.Item
    title="Delete"
    desciption="Delete this value"
    value="delete"
    intent="negative"
    leading={<TrashIcon />}
    trailing={<Text>⌘ + Space + D</Text>}
  />
</ActionList>
```

#### Most Complex Usage Possible

```jsx
<ActionList backgroundLevel={2}>
  <ActionList.Header title="Recent Searches" icon={HistoryIcon} />
  <ActionList.Section title="Section Heading">
    <ActionList.Item
      title="Accept API"
      value="accept"
      desciption="Accept this API"
      leading={<StarIcon />}
      trailing={<Text>⌘ + Space</Text>}
    />
  </ActionList.Section>
  <ActionList.Item
    title="Delete"
    desciption="Delete this value"
    value="delete"
    intent="negative"
    leading={<TrashIcon />}
    trailing={<Text>⌘ + Space + D</Text>}
  />
  <ActionList.Footer
    title="Footer Title"
    description="Footer Description"
    leading={<DocIcon />}
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
<ActionList backgroundLevel={2}>
  <ActionList.Header title="Recent Searches" icon={HistoryIcon} />
  <ActionList.SectionHeading title="Hello" />
  <ActionList.Item
    title="Item Value"
    desciption="Item Description"
    leading={StarIcon} // Can be IconComponent type or Image URL
    trailing="⌘ + Space"
  />
  <ActionList.Divider />
  <ActionList.Footer
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

<br/><br/>

`TODO: Create props table for compound components`

## Why `X` instead of `Y`?

### Why Flexible instead of Constrained API

So far we've been having constrained APIs which worked well. The difference here is, Dropdown in itself is a large component so if one of those contrains don't work for a particular team, they should not have to completely opt-out of the Dropdown. There has to be a simpler escape-hatch for them.

For this reason, you would see us going with the compound components to give that flexibility to users.

### Why not library instead of custom implementation

> **Note**
>
> Didn't get too much into implementation details during API decisions. Would recommend evaluating this once again while implementing the Dropdown.

TLDR; Felt like our Dropdown was a bit more complicated than other dropdowns we've seen so we might have to fight against existing opinions from libraries if we go with libraries.

Some libraries we evaluated

- [downshift-js](https://github.com/downshift-js/downshift)

  - 😄 Covers the accessibility and gives controls to consumers for styling
  - 🙁 Their API seemed a bit verbose and difficult to implement at first so unsure if it's worth adding library. (We should definitely refer to their Markup for accessibility practices though)
  - 🙁 Around 20kb (~10kb for Select and ~10kb for MultiSelect)

- [@radix-ui/react-dropdown-menu](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
  - 😄 Covers the accessibility gives basic styling
  - 🙁 The items are also `Dropdown` compound components so we will have to tie our `ActionList.Item` to `DropdownMenu.Item`. Which means `ActionList` can't be used outside of `Dropdown`?
  - 🙁 Opinionated so we might face more of such ^^ blockers as we discover more usecases.

## Accessibility

- For single select, we should have `role=menu` on the container and `role=menuitem` on list items
- For multiple select,
  - we should have `role=listbox` and `aria-multiselectable=true` on the container (because `role=menu` is expected to close after one item is selected)
  - Input search/filter should be outside of this container
    Refer: https://primer.style/react/storybook/?path=/story/components-selectpanel--multi-select-story

## Open Questions

### Dev

- Vote: `variant` or `type` attribute on `Dropdown`?

  `<Dropdown variant="multiple" />` vs `<Dropdown type="multiple" />`

- Should we call description/subtitle as `subtitle` everywhere, `description` everywhere, or change based on usage (E.g. See `ActionList.Item` component above).

### Design

- Should we have some type of "Select All" button to select all in multiple select variant?

## Referrences

- https://www.radix-ui.com/docs/primitives/components/dropdown-menu
- Primer React
- Sid's talk on API designs
- [MDN `role="menu"` Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role)
- [downshift-js](https://www.downshift-js.com/use-multiple-selection)
- [ ]()

---

## Archive

```jsx
<ActionList backgroundLevel={2}>
  <ActionList.Header title="Recent Searches" icon={HistoryIcon} />
  <ActionList.SectionHeading title="Hello" />
  <ActionList.Item title="Item Value" desciption="Item Description" variant="negative">
    <ActionList.Leading>
      <StarIcon />
    </ActionList.Leading>
    <ActionList.Trailing>
      <Text>⌘ + Space</Text>
    </ActionList.Trailing>
  </ActionList.Item>
  <ActionList.Divider />
  <ActionList.Footer title="Footer Title" description="Footer Description">
    <ActionList.Leading>
      <DocIcon />
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
