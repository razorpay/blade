# Modal <!-- omit in toc -->

Modal components are often used to present information, notifications, or requests that require immediate attention or confirmation from the user. 

This document outlines the API of `Modal` component.

<!-- TODO: Add this -->
<!-- <img src="./modal-thumbnail.png" width="380" alt="Thumbnail of modal" /> -->

- [Design](#design)
- [Anatomy](#anatomy)
- [API](#api)
  - [`Modal` API](#modal-api)
  - [`ModalBody` API](#modalbody-api)
  - [`ModalHeader` API](#modalheader-api)
  - [`ModalFooter` API](#modalfooter-api)
- [Behaviors](#behaviors)
  - [Modal Stacking](#modal-stacking)
  - [Modal Sizes \& Responsiveness](#modal-sizes--responsiveness)
  - [Modal Height](#modal-height)
  - [Modal Usage on mWeb \& native apps](#modal-usage-on-mweb--native-apps)
  - [Modal for React Native](#modal-for-react-native)
- [Accessibility](#accessibility)
- [Open questions](#open-questions)
- [References](#references)

## Design

- [Figma - Modal](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=35860-607833&t=hEZsxB4yG6A3Gmib-0)

## Anatomy
<!-- TODO: Add a better screenshot -->
<img src="./modal-anatomy.png" alt="Modal Anatomy" width="100%" />


## API

Sample usage:

```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Text } from '@razorpay/blade/components';

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
  <ModalHeader title="Modal Title" />
  <ModalBody>
    <Text>This is the Modal Body</Text>
  </ModalBody>
  <ModalFooter>
    <Button variant='secondary'>Cancel</Button>
    <Button variant='primary'>Save</Button>
  </ModalFooter>
</Modal>
```

### `Modal` API

| Prop            | Type                       | Default             | Description                                                                                                                                                                | Required |
| --------------- | -------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| isOpen          | `boolean`                  | `false`             | Toggles modal state                                                                                                                                                 |          |
| size          | `small`, `medium`, `large`                  | `small`             | Size of the modal                                                                                                                                                 |          |
| onDismiss       | `Callback`                 | `undefined`         | Called when the modal is closed, either by user state, hitting `esc` or tapping backdrop                                                                            |          |
| initialFocusRef | `React.Ref`                | `undefined`         | ref element you want to get keyboard focus when opening the modal                                                                                                          |          |
| children | `React.ReactNode`                | `undefined`         | Accepts other Modal sub components like ModalHeader,ModalBody,ModalFooter                                                                                                          |          |

### `ModalBody` API

| Prop       | Type              | Default     | Description                 | Required |
| ---------- | ----------------- | ----------- | --------------------------- | -------- |
| `children` | `React.ReactNode` | `undefined` | Content of the Modal | ✅       |

### `ModalHeader` API
> `ModalHeader` API will be similar to [`BottomSheetHeader` API](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/BottomSheet/_decisions/decisions.md#bottomsheetheader-api) with the exception of `showBackButton` & `onBackButtonClick` props.

| Prop      | Type            | Default     | Description                           | Required |
| --------- | --------------- | ----------- | ------------------------------------- | -------- |
| `title`   | `string`        | `undefined` | Title of the Header                   |       |
| `subtitle`   | `string`        | `undefined` | Subtitle of the Header                   |       |
| `leading` | `React.ReactNode` | `undefined` | leading asset or icon to be placed at the left most side of the ModalHeader |          |
| `trailing` | `Badge, Link, Text, IconButton`, `undefined` | undefined  |     trailing component to be placed at the right most side of the ModalHeader     |    |
| `titleSuffix` | `Counter` | `undefined` | A component to be placed adjacent to the title text |          |

### `ModalFooter` API
> `ModalFooter` API will be similar to [`BottomSheetFooter` API](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/BottomSheet/_decisions/decisions.md#bottomsheetfooter-api).

| Prop       | Type              | Default     | Description                 | Required |
| ---------- | ----------------- | ----------- | --------------------------- | -------- |
| `children` | `React.ReactNode` | `undefined` | Contents of the ModalFooter | ✅       |

## Behaviors
### Modal Stacking
- We're at consensus that we do need to support modal stacking.
- Design is not yet aligned on how the modal should look like when stacked and what the motion should be.
- As an interim solution we can implement a basic stacking behavior with the same exit/entry animations as the current modal and look into enhancing this motion later.

### Modal Sizes & Responsiveness
- We will offer Modal in 3 sizes - small, medium and large.
- Each size corresponds to a max-width for the Modal
- As of today these are the max-widths we're using for each size:
  - small: `400px`
  - medium: `760px`
  - large: `1024px`
- All the Modals will have a min-width of `320px` regardless of the size.
- This would mean that the Modal will be responsive and will scale down to `320px` on smaller screens but will not scale up beyond the max-width as per its size mentioned above.

### Modal Height
- Each Modal will have a max-height of `80vh` (80% of viewport height) and will be scrollable if the content exceeds this height.


### Modal Usage on mWeb & native apps
- We will not be using the Modal component on mWeb or native apps.
- We will only use the BottomSheet component on mWeb and native apps.
- Our Modal will be responsive and will not break up till 320px on mWeb but will not be usable on native apps.
- We will throw a warning when a Modal is opened on smaller screens.
- Designers would need to be mindful of this while designing for mWeb and native apps.
- On Figma, we have added guardrails to ensure that when screenSize is selected Mobile on Figma, Modal component will turn into a BottomSheet component.
- We are not automatically changing our Modal to BottomSheet on code to avoid bundle size overhead as well as to avoid any flow to break unless mindfully implemented with BottomSheet on code.

### Modal for React Native
- Since we want to restrict the usage of Modals on native apps, we will not be implementing the Modal component for React Native.
- We will implement a dummy export which will only warn the consumer that this component is not supported on native apps.
- We will also add this to our documentation.

## Accessibility
- Trap keyboard focus within the modal.
- Close the modal when the user hits the `esc` key.
- Add `aria-modal='true'`
- Add `aria-role='dialog'`

## Open questions
- Should we have an upper limit on Modal stacking the same way we have an upper limit of 3 stacks on BottomSheet?

## References

- https://mui.com/material-ui/react-modal/
- https://reshaped.so/content/docs/components/modal
- https://carbondesignsystem.com/components/modal/usage/
- https://primer.style/react/drafts/Dialog
- https://atlassian.design/components/modal-dialog/examples
- https://design-system.pluralsight.com/components/dialog#modal
