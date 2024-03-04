# ButtonGroup Decisions <!-- omit in toc -->

The `ButtonGroup` component is used to group related buttons together. This component allows to organize and visually associate multiple buttons that share a common purpose or functionality.

This document outlines the API details of the `ButtonGroup` component, encompassing their structural composition, functional attributes, and visual representation.

<img width="100%" src="./button-group-variants.png" alt="Button Group Variants">

- [Design](#design)
- [`ButtonGroup` API](#buttongroup-api)
- [Usage](#usage)
- [Accessibility](#accessibility)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=80700%3A197616&mode=design&t=7DAMvXAfVzPVN7Kl-1) to all variants of the `ButtonGroup` component.

## `ButtonGroup` API

```ts
type ButtonGroupProps = {
  /**
   * Specifies the visual style variant of the ButtonGroup.
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Specifies the size of the ButtonGroup.
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Specifies whether the ButtonGroup should take up the full width of its container.
   */
  isFullWidth?: boolean;
  /**
   * Disables or enables the ButtonGroup component
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Test ID for automation
   */
  testID?: string;
};
```

## Usage

- Use button groups to visually associate multiple buttons that share a common purpose or functionality.

  <img width="50%"  src="./button-group-usage.png" alt="Button Group Usage" />

  ```tsx
  import {
    ButtonGroup,
    Button,
    RefreshIcon,
    ShareIcon,
    DownloadIcon,
  } from '@razorpay/blade/components';

  const App = () => {
    return (
      <ButtonGroup>
        <Button icon={RefreshIcon} />
        <Button icon={ShareIcon}>Share</Button>
        <Button icon={DownloadIcon}>Download</Button>
      </ButtonGroup>
    );
  };
  ```

- Buttons inside a `ButtonGroup` can be used to trigger a dropdown.

  <img width="100%" src="./button-group-dropdown-usage.png" alt="Button Group Usage with Dropdown" />

  ```tsx
  import {
    ButtonGroup,
    Button,
    Dropdown,
    DropdownOverlay,
    DropdownButton,
    ActionList,
    ActionListItem,
    ChevronDownIcon,
  } from '@razorpay/blade/components';

  const App = () => {
    return (
      <ButtonGroup>
        <Button icon={PlusIcon}>Payout</Button>
        <Dropdown>
          <DropdownButton icon={ChevronDownIcon} />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem>Bulk Payout</ActionListItem>
              <ActionListItem>Upload Invoice</ActionListItem>
              <ActionListItem>Add Contact</ActionListItem>
              <ActionListItem>Team Member</ActionListItem>
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </ButtonGroup>
    );
  };
  ```

## Accessibility

- A button group does not behave like a [toolbar](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/toolbar_role), so assistive technologies still interpret the buttons as unrelated. The grouping is purely visual.
