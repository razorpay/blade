# Accordion

An accordion is used to allow users to toggle between different content sections in a compact vertical stack.

This document outlines the API of `Accordion` component.

<img src="./accordion-thumbnail.png" width="500px" alt="" />

## Design

- [Figma - Accordion](https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=79-619941&t=Rcrabprdzrz7JdId-0)

## Interactions

### Accordion open

https://github.com/razorpay/blade/assets/6682655/1a02d680-1832-4a70-a0a3-1a1f56f2b8b9

### Accordion close

https://github.com/razorpay/blade/assets/6682655/b54eaeb9-7257-4da4-bf3b-89e10785e4f9

## API

<img src="./accordion-annotations.png" width="500px" alt="" />

Sample usage, composes `Accordion` `AccordionItem`, `AccordionItemHeader`, and `AccordionItemBody`

```jsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
} from '@razorpay/blade/components';

<Accordion showNumberPrefix defaultExpandedIndex={0}>
  <AccordionItem>
    {/* With title and description defined */}
    <AccordionItemHeader title="Can I create linked accounts using Route?" />
    <AccordionItemBody>
      <Text>
        You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers.
      </Text>
    </AccordionItemBody>
  </AccordionItem>
  {/* With custom slot for trigger */}
  <AccordionItem>
    <AccordionItemHeader>
      <div>Trigger Slot</div>
    </AccordionItemHeader>
    <AccordionItemBody>
      <div>Slot</div>
    </AccordionItemBody>
  </AccordionItem>
</Accordion>;
```

<details>
<summary>Deprecated Accordion API</summary>

```jsx
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
} from '@razorpay/blade/components';

<Accordion showNumberPrefix defaultExpandedIndex={0}>
  <AccordionItem>
    {/* With title and description defined */}
    <AccordionItemHeader title="Can I create linked accounts using Route?" />
    <AccordionItemBody>
      <Text>
        You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers.
      </Text>
    </AccordionItemBody>
  </AccordionItem>
  {/* With custom slot for trigger */}
  <AccordionItem>
    <AccordionItemHeader>
      <div>Trigger Slot</div>
    </AccordionItemHeader>
    <AccordionItemBody>
      <div>Slot</div>
    </AccordionItemBody>
  </AccordionItem>
</Accordion>;
```

<details>
<summary>Deprecated Accordion API</summary>

```jsx
import { Accordion, AccordionItem } from '@razorpay/blade';

<Accordion showNumberPrefix defaultExpandedIndex={0}>
  <AccordionItem
    title="Can I create linked accounts using Route?"
    description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers."
  >
    <div>Slot</div>
  </AccordionItem>
  <AccordionItem title="How can I transfer money to customers?" description="Just use Razorpay" />
</Accordion>;
```

</details>

#### Diff between deprecated version and new version

1. AccordionItem accepts AccordionItemHeader and AccordionItemBody components now
2. `title`, `icon` props from AccordionItem will now be available on AccordionItemHeader
3. `description` prop is removed from AccordionItem. Consumers can use slot of AccordionBody as replacement
4. The JSX for body content goes inside AccordionItemBody

```diff
  <AccordionItem
-   title="Accordion Title"
-   icon={QRIcon}
-   description="Information inside Accordion"
  />

  ⬇️

  <AccordionItem>
    <AccordionItemHeader
+     title="Accordion Title"
+     icon={QRIcon}
    />
    <AccordionItemBody>
+     Information inside Accordion
    </AccordionItemBody>
  </AccordionItem>
```

### Accordion

| Prop                 | Type                    | Default       | Description                                                    | Required |
| -------------------- | ----------------------- | ------------- | -------------------------------------------------------------- | -------- |
| defaultExpandedIndex | `number`                | `undefined`   | Makes the passed item index expanded by default (uncontrolled) |          |
| expandedIndex        | `number`                | `undefined`   | Expands the passed index (controlled)                          |          |
| size                 | `large`, `medium`       | `large`       | Size of the Accordion                                          |          |
| variant              | `filled`, `transparent` | `transparent` | Visual variant of Accordion                                    |          |
| onExpandChange       | `function`              | `undefined`   | Callback for change in any item's expanded state               |          |
| showNumberPrefix     | `boolean`               | `false`       | Adds numeric index at the beginning of items                   |          |

> **Note**
>
> - Also includes layout based styling props
> - By default the accordion renders in all items collapsed state, at max only one item can be expanded at a time (design restriction)
> - `defaultExpandedIndex` can accept an accordion item index to render the accordion in an uncontrolled state
> - For using accordion in controlled state, use `expandedIndex` coupled with `onExpandChange`
> - `onExpandChange` callback signature `({ expandedIndex }) => {}`, `expandedIndex` represents the expanded item's index, if there are no expanded items it'll be `-1`

### AccordionItem

| Key                         | Type              | Default     | Description                                                                                                                                     | Required |
| --------------------------- | ----------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| title (⚠️ deprecated)       | `string`          | `undefined` | Title text content                                                                                                                              |          |
| description (⚠️ deprecated) | `string`          | `undefined` | Body text content                                                                                                                               |          |
| icon (⚠️ deprecated)        | `IconComponent`   | `undefined` | Renders a Blade icon as title prefix (requires `showNumberPrefix={false}`)                                                                      |          |
| children                    | `React.ReactNode` | `undefined` | Accepts [`AccordionItemHeader`](#AccordionItemHeader) and [`AccordionItemBody`](#accordionitembody). Accepting other JSX elements is deprecated | ✅       |

#### AccordionItemHeader

| Key         | Type              | Default     | Description                                              | Required |
| ----------- | ----------------- | ----------- | -------------------------------------------------------- | -------- |
| title       | `string`          | `undefined` | Title text content                                       |          |
| subtitle    | `string`          | `undefined` | Subtitle text content                                    |          |
| titleSuffix | `React.ReactNode` | `undefined` | Suffix part of title. Mostly for Badge                   |          |
| description | `string`          | `undefined` | Body text content                                        |          |
| leading     | `React.ReactNode` | `undefined` | Leading Part of Header. Mostly for icon or prefix text   |          |
| trailing    | `React.ReactNode` | `undefined` | Trailing Part of Header. Mostly for action link / button |          |
| children    | `React.ReactNode` | `undefined` | Slot                                                     |          |

#### AccordionItemBody

| Key      | Type                        | Default     | Description | Required |
| -------- | --------------------------- | ----------- | ----------- | -------- |
| children | `React.ReactNode`, `string` | `undefined` | Slot        | ✅       |

## a11y

Web:

Follows the standard practices (aria expanded, controls, etc.) [ARIA guide](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/), [example](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/#rps_label):

- <kbd>Enter</kbd> or <kbd>Space</kbd> can toggle accordion
- <kbd>Tab</kbd> key to cycle focus
- `aria-expanded` and `aria-controls` in the button trigger
- `aria-labelledby` and `role: region` in the content

Native:

- Some related properties from web will be applicable to native as well ([a11y guide](https://reactnative.dev/docs/accessibility))

## Usage

### With icons

<div align="center">
  <img src="./accordion-with-icons.png" width="400" alt="" />
</div>

```tsx
<Accordion defaultExpandedIndex={0}>
  <AccordionItem>
    <AccordionItemHeader title="How can I setup Route?" icon={SomeIcon} />
    <AccordionItemBody>
      <Text>
        You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers.
      </Text>
    </AccordionItemBody>
  </AccordionItem>
  <AccordionItem>
    <AccordionItemHeader title="How can I setup QR Codes?" icon={QRCodeIcon} />
    <AccordionItemBody>
      <Text>Just use Razorpay</Text>
    </AccordionItemBody>
  </AccordionItem>
</Accordion>
```

### Controlled state

```tsx
const App = () => {
  const [index, setIndex] = useState(0);
  const onExpandChange = ({ expandedIndex }) => setIndex(expandedIndex);

  return (
    <Accordion expandedIndex={index} onExpandChange={onExpandChange}>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Route?" />
        <AccordionItemBody>
          You can use Razorpay Route from the Dashboard or using APIs to transfer money to
          customers.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup QR Codes?" />
        <AccordionItemBody>Just use Razorpay</AccordionItemBody>
      </AccordionItem>
    </Accordion>
  );
};
```

#### With Individual Item

Individual Item Accordion is same as normal accordion but with one item only

```tsx
const App = () => {
  return (
    <Accordion variant="filled">
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Route?" />
        <AccordionItemBody>
          You can use Razorpay Route from the Dashboard or using APIs to transfer money to
          customers.
        </AccordionItemBody>
      </AccordionItem>
    </Accordion>
  );
};
```

## Alternatives

- Instead of `expandedIndex`, `defaultExpandedIndex` considered `value`, `defaultValue`, however it doesn't co-relate well with how these APIs work in other components where they're mostly being used for user inputs (eg. in forms) and therefore termed values. On the other hand, accordion is mostly a presentational component and shouldn't be used for user inputs _(what do we treat as value in accordion)_.
- Instead of `expandedIndex`, `defaultExpandedIndex` on the root `Accordion` component, considered an approach to instead put relatable props such as `isExpanded`, `isDefaultExpanded` on the child `AccordionItem` component. However, with this, controlled usecase becomes tricky since we would still ideally want a single callback listener for `onExpandChange`:
  - if we put this `onExpandChange` at the root `Accordion`, we would still need some sort of `index` or value in the callback
  - if we put this `onExpandChange` on individual `AccordionItem` components, either a user would need to pass different callback handlers to each or we would need to pass an `index` or some value (same dilemma)
  - it's slightly inconvenient to have callback handlers and the expanded index value at different places (one at root and one at child)

### Alternate API for Custom Trigger

```jsx
<Accordion>
  <AccordionItem trigger={<div>Trigger SLOT</div>}>
    <div>Content SLOT</div>
  </AccordionItem>
</Accordion>
```

- Pros
  - Not breaking (similar to current API with additional prop `trigger`)
  - Does not require us to introduce AccordionItemHeader and AccordionItemBody
- Cons
  - Inconsistent with other API decisions of Blade
  - Inconsistent with implementations from other design systems

## Implementation notes

For SEO purposes the collapsed content can be hidden with CSS.

Behavior wise Accordion's interaction is similar to Radio / Checkbox _with slight differences_

Accordion shares the toggle interaction with Collapsible. We can create abstractions that work for both plus other components such as tabs, switch, etc. (different from this public API spec):

- Build accordion interaction on top of a base collapsible component
- A disclosure based hook (references - [Chakra](https://chakra-ui.com/docs/hooks/use-disclosure), [Mantine](https://mantine.dev/hooks/use-disclosure/), [Paste](https://paste.twilio.design/components/disclosure))

Find in page (automatically expanding the accordion if someone does <kbd>Cmd</kbd> + <kbd>F</kbd>) is a tricky feat, need to check feasibility and should be taken up as an enhancement (references - [blog by Anurag](https://dev.to/anuraghazra/thoughts-on-find-in-page-with-custom-accordion-elements-5573), [`hidden="until-found"`](https://github.com/WICG/display-locking/blob/main/explainers/hidden-content-explainer.md)).

## Open questions

- **Q1.** Is the deviation in props and using index for controlled state a fine tradeoff? Please post alternatives with usecase and rationale otherwise.
  - **Ans:** Yes.
- **Q2.** `AccordionItemHeader` vs `AccordionItemHeader` vs `AccordionItemControl`
  - **Ans:** `AccordionItemHeader`
- **Q3.** [Proposed API](#api) vs [Alternate API](#alternate-api-for-custom-trigger)
  - **Ans:** Proposed API with deprecations for earlier API
- **Q4.** `variant="bordered | borderless"` vs `variant="filled | transparent"`
  - **Ans:** We're going with `filled | transparent`

## References

Prior art:

- [Chakra](https://chakra-ui.com/docs/components/accordion/usage)
- [Mantine](https://mantine.dev/core/accordion/)
- [Reshaped](https://reshaped.so/content/docs/utilities/accordion)
- [Polaris](https://polaris.shopify.com/components/utilities/collapsible)
- [MUI](https://mui.com/material-ui/react-accordion)
- [Paste](https://paste.twilio.design/components/disclosure#api)
- [`react-native-collapsible`](https://github.com/oblador/react-native-collapsible)
