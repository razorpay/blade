## Component Name

Menu

## Description

Action Menu displays a list of actions on temporary surfaces. They allow users to perform actions from multiple options. Menus appear when users interact with a button, action, or other control, creating a contextual interface for related actions. Note that Menus are not responsive by default and are not intended for selection - use Dropdown with Select or AutoComplete for selectable options.

## TypeScript Types

The following types represent the props that the Menu component and its subcomponents accept. These types should be used when implementing the Menu component in your application.

```typescript
// The main Menu component props
type MenuProps = {
  /**
   * First children is trigger and second children is MenuOverlay
   */
  children: [React.ReactElement, React.ReactElement];

  /**
   * Open controlled state
   */
  isOpen?: boolean;

  /**
   * On Menu open change callback
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;

  /**
   * Should menu open on click or hover
   *
   * @default 'click'
   */
  openInteraction?: 'hover' | 'click';
};

// MenuItem props
type MenuItemProps = {
  /**
   * title of item
   */
  title?: string;

  /**
   * Description text for the item
   */
  description?: string;

  /**
   * Slot to render custom menu items
   */
  children?: React.ReactNode;

  /**
   * HTML element to render as
   */
  as?: React.ElementType;

  /**
   * Click handler for MenuItem
   *
   * Absence of this prop and href will turn the item into non-interactive item
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Focus handler for MenuItem
   *
   * Absence of this prop and href will turn the item into non-interactive item
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * Link to open when item is clicked.
   *
   * Absence of this prop and onClick will turn the item into non-interactive item
   */
  href?: string;

  /**
   * HTML target of the link
   */
  target?: string;

  /**
   * Item that goes on left-side of item.
   *
   * Will be overridden in multiselect
   */
  leading?: React.ReactNode;

  /**
   * Item that goes on right-side of item.
   */
  trailing?: React.ReactNode;

  /**
   * Item that goes immediately next to the title.
   */
  titleSuffix?: React.ReactElement;

  /**
   * disabled state of item
   */
  isDisabled?: boolean;

  /**
   * Color of item. set to negative for dangerous actions like Delete, Remove, etc
   */
  color?: 'negative';
} & DataAnalyticsAttribute;

// MenuOverlay props
type MenuOverlayProps = {
  /**
   * JSX Slot for MenuItem or anything else
   */
  children: React.ReactElement[] | React.ReactElement | React.ReactNode;

  /**
   * zIndex override
   */
  zIndex?: number | string;

  /**
   * width override.
   *
   * By default width is not set
   */
  width?: string | number;

  /**
   * minWidth override
   */
  minWidth?: string | number;

  /**
   * maxWidth override
   */
  maxWidth?: string | number;
} & TestID &
  DataAnalyticsAttribute;

// MenuHeader props
type MenuHeaderProps = {
  /**
   * Title of the menu header
   */
  title: string;

  /**
   * Subtitle of the menu header
   */
  subtitle?: string;

  /**
   * Leading element of the menu header
   */
  leading?: React.ReactNode;

  /**
   * Trailing element of the menu header
   */
  trailing?: React.ReactNode;

  /**
   * Item that goes immediately next to the title
   */
  titleSuffix?: React.ReactNode;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Data analytics attributes
   */
  'data-analytics'?: string;
};

// MenuFooter props
type MenuFooterProps = {
  /**
   * Children of the menu footer
   */
  children: React.ReactNode;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Data analytics attributes
   */
  'data-analytics'?: string;
};

// MenuDivider props
type MenuDividerProps = TestID & DataAnalyticsAttribute;
```

## Example

### Comprehensive Profile Menu

This example demonstrates a comprehensive menu with an Avatar trigger and various menu components including MenuHeader, MenuItem, nested menus, MenuDivider, and MenuFooter. It shows how to structure a user profile menu with details, actions, and a footer message.

```tsx
import React from 'react';
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuOverlay,
  MenuHeader,
  MenuFooter,
  Button,
  Box,
  Link,
  Text,
  Avatar,
  CopyIcon,
  LogOutIcon,
  ShareIcon,
  TestIcon,
  TicketIcon,
  UserIcon,
} from '@razorpay/blade/components';

function BasicMenu() {
  return (
    <Box>
      <Menu>
        <Avatar name="Saurabh Daware" size="large" color="primary" />
        <MenuOverlay>
          <MenuHeader title="Saurabh Daware" subtitle="Admin" leading={<UserIcon />} />
          <Box paddingY="spacing.4" paddingX="spacing.3">
            <Text display="block" size="medium" weight="semibold">
              Razorpay Pvt Ltd
            </Text>
            <Box display="flex" alignItems="center" gap="spacing.3">
              <Text size="small">MID: Xyzyspoon13857</Text>
              <Link variant="button" size="small" icon={CopyIcon} />
            </Box>
          </Box>
          <Button variant="tertiary" isFullWidth size="xsmall">
            Switch Merchant
          </Button>
          <MenuDivider marginY="spacing.3" />
          <MenuItem
            title="Enable Test Mode"
            leading={<TestIcon size="small" />}
            description="Enable test mode"
          />
          <MenuItem
            title="View Support Tickets"
            leading={<TicketIcon size="small" />}
            description="View all your support tickets"
          />
          <Menu>
            <MenuItem leading={<ShareIcon size="small" />} title="Share Profile" />
            <MenuOverlay>
              <MenuItem title="Mail" />
              <Menu>
                <MenuItem title="Instagram" />
                <MenuOverlay>
                  <MenuItem title="Instagram Stories" />
                  <MenuItem title="Instagram Post" />
                  <MenuItem title="Instagram Chat" />
                </MenuOverlay>
              </Menu>
            </MenuOverlay>
          </Menu>
          <MenuItem
            leading={<LogOutIcon size="small" color="feedback.icon.negative.intense" />}
            title="Log Out"
            color="negative"
          />
          <MenuFooter>
            <Text variant="caption" size="small">
              Partner with us and start earning on every referral
            </Text>
          </MenuFooter>
        </MenuOverlay>
      </Menu>
    </Box>
  );
}

export default BasicMenu;
```

### Controlled Menu

This example shows how to create a controlled menu where the open state is managed by the component's state. It uses a button to explicitly open the menu and demonstrates the `isOpen` and `onOpenChange` props for programmatic control of the menu's visibility.

```tsx
import React, { useState } from 'react';
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuOverlay,
  MenuHeader,
  MenuFooter,
  Button,
  Box,
  Link,
  Text,
  Avatar,
  CopyIcon,
  LogOutIcon,
  ShareIcon,
  TestIcon,
  TicketIcon,
  UserIcon,
} from '@razorpay/blade/components';

function ControlledMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Button marginY="spacing.4" onClick={() => setIsOpen(true)}>
        Open Menu
      </Button>

      <Menu isOpen={isOpen} onOpenChange={({ isOpen }) => setIsOpen(isOpen)}>
        <Avatar name="Saurabh Daware" size="large" color="primary" />
        <MenuOverlay>
          <MenuHeader title="Saurabh Daware" subtitle="Admin" leading={<UserIcon />} />
          <Box paddingY="spacing.4" paddingX="spacing.3">
            <Text display="block" size="medium" weight="semibold">
              Razorpay Pvt Ltd
            </Text>
            <Box display="flex" alignItems="center" gap="spacing.3">
              <Text size="small">MID: Xyzyspoon13857</Text>
              <Link variant="button" size="small" icon={CopyIcon} />
            </Box>
          </Box>
          <Button variant="tertiary" isFullWidth size="xsmall">
            Switch Merchant
          </Button>
          <MenuDivider marginY="spacing.3" />
          <MenuItem
            title="Enable Test Mode"
            leading={<TestIcon size="small" />}
            description="Enable test mode"
          />
          <MenuItem
            title="View Support Tickets"
            leading={<TicketIcon size="small" />}
            description="View all your support tickets"
          />
          <MenuItem
            leading={<LogOutIcon size="small" color="feedback.icon.negative.intense" />}
            title="Log Out"
            color="negative"
            onClick={() => console.log('Logging out')}
          />
        </MenuOverlay>
      </Menu>
    </Box>
  );
}

export default ControlledMenu;
```
