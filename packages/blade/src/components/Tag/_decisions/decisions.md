# Tag 🏷️

These are set of interactive keywords that help organise & categorise objects. Tags can be added or removed from an object by the users.

<img width="426" alt="image" src="https://github.com/razorpay/blade/assets/30949385/75d8068d-d6fc-47e7-aa75-21686ed1c27d">

## Design

- [Tags Figma Design](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=29210-567576&t=HLRjz3OTofBtFdDl-0)

## Proposed API

```jsx
<Tag
  size="medium"
  onDismiss={() => {
    console.log('Close Icon Clicked');
  }}
>
  Unpaid
</Tag>
```

### Props

```ts
type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * Callback when close icon on Tag is clicked
   */
  onDismiss?: () => void;

  /**
   * Text that renders inside Tag
   */
  children: ReactText;
};
```

_Didn't consider any alternate API. Kept `size` and `children` similar to `<Badge />` and `onDismiss` similar to `<Alert />` and `<Dropdown />`_

## Accessibility

- Ensure Close Icon is focussable
- Close Icon to have appropriate `aria-label`

## Integration with Inputs

<img width="358" alt="image" src="https://github.com/razorpay/blade/assets/30949385/71cd236a-93e7-46f0-9da6-12d519b958d4">

Tags can be added inside other input components -

- TextArea
- SelectInput (in Dropdown)
- TextInput
- AutoComplete

<details>
<summary>Implementation Details</summary>

> **Note**
>
> This section goes into implementation details and does not impact the API of existing components or above proposed Tag component API in any way.

This will require some refactor in BaseInput to add a slot before the actual Input element.

E.g. This is AutoComplete from Primer where the tags go into a slot and input gets pushed forward. We will be implementing something similar in our BaseInput.

<img width="419" alt="image" src="https://github.com/razorpay/blade/assets/30949385/be01cdfb-1171-4970-b381-76e4c44d1854">

</details>
<br/>

### Proposed API for Integration with Inputs

On consumer end, the APIs would look like -

// TODO

New `tagsSlot` prop for Inputs that support rendering tags.

```jsx
<TextInput tagsSlot={} value="" onChange={} />
```

Alternate names

- `leading`
- `beforeInput`

```jsx
<TextInput hasTags value="tagone, tagtwo, tagthree" />
```

### References

- `TagsInput` component by PluralSight Design System
- `tokens` prop by Primer AutoComplete.Input
- [Carbon just putting everything outside of Inputs](https://carbondesignsystem.com/components/tag/usage)
- `elemBeforeInput` prop on Atlassian
