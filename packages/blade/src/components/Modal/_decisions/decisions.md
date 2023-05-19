# Modal <!-- omit in toc -->

Modal components are often used to present information, notifications, or requests that require immediate attention or confirmation from the user. 

This document outlines the API of `Modal` component.

<!-- TODO: Add this -->
<img src="./modal-thumbnail.png" width="380" alt="Thumbnail of modal" />

- [Design](#design)
- [Anatomy](#anatomy)
- [API](#api)
  - [`Modal` API](#modal-api)
  - [`ModalBody` API](#modalbody-api)
  - [`ModalHeader` API](#modalheader-api)
  - [`ModalFooter` API](#modalfooter-api)
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
```

### `Modal` API

| Prop            | Type                       | Default             | Description                                                                                                                                                                | Required |
| --------------- | -------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| isOpen          | `boolean`                  | `false`             | Toggles modal state                                                                                                                                                 |          |
| size          | `small`, `medium`, `large`                  | `small`             | Size of the modal                                                                                                                                                 |          |
| showOverflowContent          | `boolean`                  | `false`             | TBD                                                                                                                                                 |          |
| onDismiss       | `Callback`                 | `undefined`         | Called when the modal is closed, either by user state, hitting `esc` or tapping backdrop                                                                            |          |
| initialFocusRef | `React.Ref`                | `undefined`         | ref element you want to get keyboard focus when opening the modal                                                                                                          |          |
| children | `React.ReactNode`                | `undefined`         | Accepts other Modal sub components like ModalHeader,ModalBody,ModalFooter                                                                                                          |          |

### `ModalBody` API

| Prop       | Type              | Default     | Description                 | Required |
| ---------- | ----------------- | ----------- | --------------------------- | -------- |
| `children` | `React.ReactNode` | `undefined` | Content of the Modal | ✅       |

### `ModalHeader` API

| Prop      | Type            | Default     | Description                           | Required |
| --------- | --------------- | ----------- | ------------------------------------- | -------- |
| `title`   | `string`        | `undefined` | Title of the Header                   |       |
| `subtitle`   | `string`        | `undefined` | Subtitle of the Header                   |       |
| `leading` | `React.ReactNode` | `undefined` | leading asset or icon to be placed at the left most side of the ModalHeader |          |
| `trailing` | `Badge, Link, Text, IconButton`, `undefined` | undefined  |     trailing component to be placed at the right most side of the ModalHeader     |    |
| `titleSuffix` | `Counter` | `undefined` | A component to be placed adjacent to the title text |          |
| `showBackButton` | `boolean` | `false` | Show or hide back button |          |
| `onBackButtonClick` | `boolean` | `false` | Event handler for the back button |          |

### `ModalFooter` API


| Prop       | Type              | Default     | Description                 | Required |
| ---------- | ----------------- | ----------- | --------------------------- | -------- |
| `children` | `React.ReactNode` | `undefined` | Contents of the ModalFooter | ✅       |

## Accessibility
- aria-labelledby
- aria-describedby
- Modal traps focus inside its root element, which means that using any type of keyboard navigation will keep the focus inside the Backdrop while it's opened.
- Modal triggers its onClose handler on Esc key press.

## Open questions

## References

- https://mui.com/material-ui/react-modal/
- https://reshaped.so/content/docs/components/modal
- https://carbondesignsystem.com/components/modal/usage/
- https://primer.style/react/drafts/Dialog
- https://atlassian.design/components/modal-dialog/examples
- https://design-system.pluralsight.com/components/dialog#modal
