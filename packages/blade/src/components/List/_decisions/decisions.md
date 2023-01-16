# List <!-- omit in toc -->
Lists display a set of related items that are composed of text/links. Each list item begins with a bullet or a number.

<img src="./list-thumbnail.png" width="380" />

- [Design](#design)
  - [Unordered List](#unordered-list)
    - [Unordered List with 3 levels of nesting](#unordered-list-with-3-levels-of-nesting)
    - [Unordered List with custom icons for bullets](#unordered-list-with-custom-icons-for-bullets)
    - [Unordered List with inline Link in items](#unordered-list-with-inline-link-in-items)
  - [Ordered List](#ordered-list)
    - [Ordered List with 3 levels of nesting](#ordered-list-with-3-levels-of-nesting)
    - [Ordered List with 3 levels of nesting and _filled background_ numbers](#ordered-list-with-3-levels-of-nesting-and-filled-background-numbers)
    - [Ordered List with inline Link in items](#ordered-list-with-inline-link-in-items)
- [API](#api)
  - [List Component](#list-component)
  - [List.Item Component](#listitem-component)
  - [List.Item.Link Component](#listitemlink-component)
  - [Sample Usage](#sample-usage)
  - [Alternative APIs](#alternative-apis)
    - [Hierarchial without explicit nested `List` grouping](#hierarchial-without-explicit-nested-list-grouping)
    - [Hierarchial with a `nested` prop](#hierarchial-with-a-nested-prop)
    - [Non-Hierarchial with a `level` prop](#non-hierarchial-with-a-level-prop)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)
- [References](#references)


## Design
- [Figma - List](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=23205%3A446859&t=dT849yOxgX5WHgby-4)

### Unordered List
#### Unordered List with 3 levels of nesting

<img src="./unordered-list.png" width="380" />

#### Unordered List with custom icons for bullets

<img src="./unordered-list-icon.png" width="380" />

#### Unordered List with inline Link in items

<img src="./unordered-list-link.png" width="380" />

### Ordered List
#### Ordered List with 3 levels of nesting

<img src="./ordered-list.png" width="380" />

#### Ordered List with 3 levels of nesting and _filled background_ numbers

<img src="./ordered-list-filled.png" width="380" />

#### Ordered List with inline Link in items

<img src="./ordered-list-link.png" width="380" />


## API

### List Component
| Prop | Type | Default | Description | Required |
|---|---|---|---|---|
| children | `List.Item` | `undefined` | List items to render. | ✅ |
| variant | `ordered`, `unordered` | `unordered` | Sets the list as ordered or unordered. |  |
| isOrderedFilled | `boolean` | `false` | Sets whether the numbers in ordered list have a filled background.  |  |
| icon | `BladeIcon` | `undefined` | Icon to be used for the items in the list. This can only be set when `variant` is `unordered`. |  |
| size | `small`, `medium` | `medium` | Size of the list items. |  |

### List.Item Component
| Prop | Type | Default | Description | Required |
|---|---|---|---|---|
| children | `string`, `List.Item.Link`, `List` | `undefined` | String to render in the list item. You may also pass a `List.Item.Link` to render an inline link. You may also pass a `List` component which contains its own `List.Item` components to create a nested list.| ✅ |
| icon | `BladeIcon` | `undefined` | Icon to be used for the items in the list. This can only be set when `variant` is `unordered`. |  |

### List.Item.Link Component
| Prop | Type | Default | Description | Required |
|---|---|---|---|---|
| children | `string` | `undefined` | The text to be rendered within the link.| ✅ |
| onClick | `Function` | `undefined` | The function to be called when the link is clicked. | |
| href | `string` | `undefined` | The href for the link component. | |
| target | `string` | `undefined` | The target for the link component. | |
| rel | `string` | `undefined` | The rel for the link component.<br>-When `target` prop is set to `_blank`, `rel` will be automatically set to `noopener noreferrer` which can be overridden by passing the `rel` prop. | |
| accessibilityLabel | `string` | `undefined` | The `aria-label` (web) & `accessibilityLabel` (native) of the link component. | |


### Sample Usage
```jsx
import { List, InfoIcon, EditIcon } from '@razorpay/components';

<List variant='ordered' icon={InfoIcon} size='medium'>
  <List.Item icon={EditIcon}>
    Item 1
    <List variant='ordered'>
      <List.Item>
        Item 1.1
        <List variant='ordered'>
          <List.Item>
            Item 1.1.1
          <List.Item/>
        <List/>
      <List.Item/>
    <List/>
  <List.Item/>
  <List.Item>
    Item 2		
  <List.Item/>
</List>
```

### Alternative APIs
#### Hierarchial without explicit nested `List` grouping
```jsx
<List variant='ordered'>
  <List.Item>
    Item 1
    <List.Item>
      Item 1.1		
      <List.Item>
        Item 1.1.1		
      <List.Item/>
    <List.Item>
      Item 1.2		
    <List.Item />		
  <List.Item/>		
  <List.Item/>
  <List.Item>
    Item 2		
  <List.Item/>
</List>
```

#### Hierarchial with a `nested` prop
```jsx
<List variant='ordered'>
  <List.Item 
    nested={
      <List.Item
        nested={
          <List.Item>
            Item 1.1.1
          <List.Item/>
        }
      >
        Item 1.1
      <List.Item/>
    }
  >
    Item 1
  <List.Item/>
  <List.Item>
    Item 2		
  <List.Item/>
</List>
```

#### Non-Hierarchial with a `level` prop
```jsx
<List variant='ordered'>
  <List.Item level='1'>
    Item 1
  <List.Item/>
  <List.Item level='2'>
    Item 1.1
  <List.Item/>
  <List.Item level='2'>
    Item 1.2
  <List.Item/>
  <List.Item level='3'>
    Item 1.2.1
  <List.Item/>
  <List.Item level='1'>
    Item 2		
  <List.Item/>
</List>
```

## Accessibility
- I will explore using `<ol>`,`<ul>` & `<li>` directly and see if it allows us to do all the customizations that we need for our use-cases instead of using `role` on a `<div>` for web since that's the recommended practice for lists.
  - We will be able to hide default styling & icons using `list-style-type: none; padding: 0px, margin: 0px`
  - [POC CodeSandbox Link](https://codesandbox.io/s/festive-sanne-2rb18j?file=/src/App.js)
- Set `role` as `list` for the `List` component
  - This does not work well with screen readers. It doesn't announce the total number of items in the list.
- Set `role` as `listitem` for the `List.Item` component
  - This does not work well with screen readers. It doesn't announce the item number, remaining number of items in the list and the current nesting level of the list.

## Open Questions
- Discuss alternative APIs with the team
- Would we allow different sizes within the same list?
- What should we call `isOrderedFilled` instead?
- Do we allow ordered list within unordered list and vice versa?
- Should we call it `List.Item.Link` or `List.Link` or `List.ItemLink`?

## References
- [Polaris](https://polaris.shopify.com/components/list#list-items)
- [Chakra](https://chakra-ui.com/docs/components/list/)
- [Skyscanner Backpack](https://backpack.github.io/components/list/?platform=web#usage)
- [Mantine](https://mantine.dev/core/list/)
- [Carbon](https://carbondesignsystem.com/components/list/usage/)
- [PluralSight](https://design-system.pluralsight.com/components/text-list#lists)
- [Twilio Pase](https://paste.twilio.design/components/list/)
