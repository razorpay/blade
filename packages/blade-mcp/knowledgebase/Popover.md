## Component Name

Popover

## Description

The Popover component displays additional context or interactive content that appears when a user interacts with a trigger element. It typically provides contextual information or actions without requiring navigation to a different page. Popovers are designed with a subtle appearance, can be positioned in various placements, and support both controlled and uncontrolled usage patterns.

## TypeScript Types

The following types are the props that the Popover component and its subcomponents accept. Use these types as a reference when implementing Popover in your application.

```typescript
import type { UseFloatingOptions } from '@floating-ui/react';
import type React from 'react';
import type { DataAnalyticsAttribute } from '~utils/types';

// Main Popover component props
type PopoverProps = {
  /**
   * Popover title
   */
  title?: string;
  /**
   * Leading content placed before the title
   *
   * Can be any blade icon or asset.
   */
  titleLeading?: React.ReactNode;
  /**
   * Footer content
   */
  footer?: React.ReactNode;
  /**
   * Popover content
   */
  content: React.ReactElement;
  /**
   * Placement of Popover
   *
   * @default "top"
   */
  placement?: UseFloatingOptions['placement'];
  /**
   * Popover trigger
   */
  children: React.ReactElement;
  /**
   * Open state of Popover
   * If set to true makes the popover controlled
   */
  isOpen?: boolean;
  /**
   * Uncontrolled state of the popover
   */
  defaultIsOpen?: boolean;
  /**
   * Called when popover open state is changed, this can be used to detect when popover opens or closed
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Sets the z-index of the Popover
   * @default 1000
   */
  zIndex?: number;
  /**
   * The ref of the element that should receive focus when the popover opens.
   *
   * @default PopoverCloseButton
   */
  initialFocusRef?: React.RefObject<any>;
} & DataAnalyticsAttribute;

// For when creating custom trigger components
type PopoverTriggerProps = {
  onMouseDown?: React.MouseEventHandler;
  onPointerDown?: React.PointerEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
  onClick?: React.MouseEventHandler;
  onTouchEnd?: React.TouchEventHandler;
};

// Props for the PopoverInteractiveWrapper component
type PopoverInteractiveWrapperProps = {
  /**
   * A label for screen readers to announce when the popover is opened.
   */
  accessibilityLabel?: string;
  /**
   * The content of the PopoverInteractiveWrapper.
   */
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
} & Omit<BaseBoxProps, 'as'> &
  DataAnalyticsAttribute;
```

## Example

### Basic Usage

Here's a comprehensive example showing how to use the Popover component with its various props:

```jsx
import React from 'react';
import { Popover, Button, Box, Text, InfoIcon } from '@razorpay/blade/components';

const App = () => {
  return (
    <Box padding="spacing.5">
      {/* Popover with title and icon */}
      <Box marginBottom="spacing.5">
        <Text weight="semibold" size="large" marginBottom="spacing.3">
          Popover with Title and Icon
        </Text>
        <Popover
          title="Settlement breakup"
          titleLeading={<InfoIcon color="interactive.icon.gray.normal" size="medium" />}
          content={
            <Box padding="spacing.2">
              <Text>Detailed information about the settlement goes here.</Text>
            </Box>
          }
          placement="right"
        >
          <Button variant="secondary">View Settlement</Button>
        </Popover>
      </Box>
    </Box>
  );
};

export default App;
```

### Popover on Non Interactive Elements

You can add Popover to non-interactive elements like Icon, Badge, etc using PopoverInteractiveWrapper

```jsx
import React from 'react';
import {
  Popover,
  PopoverInteractiveWrapper,
  Box,
  Text,
  InfoIcon,
} from '@razorpay/blade/components';

const App = () => {
  return (
    <Box marginBottom="spacing.5">
      <Text weight="semibold" size="large" marginBottom="spacing.3">
        Using PopoverInteractiveWrapper
      </Text>
      <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
        <Popover
          title="Information"
          content={<Text padding="spacing.2">This icon triggers a popover.</Text>}
          placement="top"
        >
          <PopoverInteractiveWrapper
            display="inline-block"
            accessibilityLabel="View more information"
          >
            <InfoIcon color="interactive.icon.gray.normal" size="large" />
          </PopoverInteractiveWrapper>
        </Popover>
      </Box>
    </Box>
  );
};

export default App;
```

### Creating a Custom Trigger Component

You can create custom trigger components for the Popover by forwarding the necessary props:

```jsx
import React from 'react';
import {
  Popover,
  Box,
  Text,
  type PopoverTriggerProps
} from '@razorpay/blade/components';

// Custom trigger component with forwardRef
const CustomTrigger = React.forwardRef<
  HTMLDivElement,
  { children: string } & PopoverTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      borderRadius="medium"
      role="button"
      tabIndex={0}
      ref={ref}
      style={{ cursor: 'pointer' }}
      {...props} // Forward all required props
    >
      {children}
    </Box>
  );
});

const CustomTriggerExample = () => {
  return (
    <Popover
      title="Custom Trigger Example"
      content={<Text padding="spacing.3">This popover is triggered by a custom component.</Text>}
      placement="top"
    >
      <CustomTrigger>Click me to open popover</CustomTrigger>
    </Popover>
  );
};

export default CustomTriggerExample;
```
