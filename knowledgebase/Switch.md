## Component Name

Switch

## Description

A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turns the switch on/off. The component supports controlled and uncontrolled modes, different sizes, and accessibility features to ensure proper screen reader support.

## TypeScript Types

The following types represent the props that the Switch component accepts. These types are essential for properly implementing and using the Switch component in your applications.

```typescript
type OnChange = ({
  isChecked,
  value,
  event,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

type SwitchProps = {
  /**
   * If `true`, The switch will be checked. This also makes the switch controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the switch will be initially checked. This also makes the switch uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Switch` changes.
   */
  onChange?: OnChange;
  /**
   * The name of the input field in a switch
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the switch input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the switch will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the switch
   *
   * @default "medium"
   */
  size?: 'small' | 'medium';
  /**
   * Provides accessible label for internal checkbox component that sets the aria-label prop for screen readers.
   */
  accessibilityLabel: string;
  /**
   * The id of the input field in a switch, useful for associating a label element with the input via htmlFor prop
   */
  id?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;
```

## Example

### Basic Usage

This example demonstrates the basic usage of the Switch component with essential props:

```jsx
import React from 'react';
import { Switch } from '@razorpay/blade/components';

function BasicExample() {
  return (
    <Switch
      accessibilityLabel="Toggle dark mode"
      onChange={(e) => console.log('Switch toggled:', e.isChecked)}
    />
  );
}

export default BasicExample;
```

### Controlled and Uncontrolled Switches

The Switch component can be used in both controlled and uncontrolled modes:

```jsx
import React, { useState } from 'react';
import { Switch, Box, Text } from '@razorpay/blade/components';

function SwitchExamples() {
  // Controlled switch state
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {/* Uncontrolled switch with default value */}
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <Switch
          accessibilityLabel="Toggle notifications"
          defaultChecked={true}
          onChange={(e) => console.log('Uncontrolled switch:', e.isChecked)}
          id="uncontrolled-switch"
        />
        <Text weight="regular" variant="body" size="medium">
          Notifications (Uncontrolled)
        </Text>
      </Box>

      {/* Controlled switch */}
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <Switch
          accessibilityLabel="Toggle dark mode"
          isChecked={isChecked}
          onChange={(e) => setIsChecked(e.isChecked)}
          id="controlled-switch"
        />
        <Text weight="regular" variant="body" size="medium">
          Dark Mode (Controlled): {isChecked ? 'On' : 'Off'}
        </Text>
      </Box>

      {/* Disabled switch */}
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <Switch
          accessibilityLabel="Toggle location services"
          isDisabled={true}
          id="disabled-switch"
        />
        <Text weight="regular" variant="body" size="medium">
          Location Services (Disabled)
        </Text>
      </Box>

      {/* Small size switch */}
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <Switch accessibilityLabel="Toggle WiFi" size="small" id="small-switch" />
        <Text weight="regular" variant="body" size="medium">
          WiFi (Small Size)
        </Text>
      </Box>
    </Box>
  );
}

export default SwitchExamples;
```

### Switch in Form Groups

This example demonstrates using multiple switches in a settings-like interface:

```jsx
import React from 'react';
import { Switch, Box, Text, Card, CardBody } from '@razorpay/blade/components';
import { MapPinIcon, GlobeIcon, WifiIcon } from '@razorpay/blade/components';

function SwitchFormExample() {
  return (
    <Card width="350px">
      <CardBody>
        <Text size="small" weight="semibold" marginBottom="spacing.4">
          Card Transaction Settings
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Box
            as="label"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="spacing.2"
          >
            <Box display="flex" alignItems="center" gap="spacing.2">
              <MapPinIcon color="surface.icon.gray.subtle" size="small" />
              <Text weight="regular" variant="body" size="medium">
                International transaction
              </Text>
            </Box>
            <Switch
              accessibilityLabel="International transaction"
              size="small"
              onChange={(e) => console.log('International transactions:', e.isChecked)}
            />
          </Box>

          <Box
            as="label"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="spacing.2"
          >
            <Box display="flex" alignItems="center" gap="spacing.2">
              <GlobeIcon color="surface.icon.gray.muted" size="small" />
              <Text weight="regular" variant="body" size="medium">
                Online transaction
              </Text>
            </Box>
            <Switch
              accessibilityLabel="Online transaction"
              size="small"
              defaultChecked={true}
              onChange={(e) => console.log('Online transactions:', e.isChecked)}
            />
          </Box>

          <Box
            as="label"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="spacing.2"
          >
            <Box display="flex" alignItems="center" gap="spacing.2">
              <WifiIcon color="surface.icon.gray.muted" size="small" />
              <Text weight="regular" variant="body" size="medium">
                Contactless Transaction
              </Text>
            </Box>
            <Switch
              accessibilityLabel="Contactless Transaction"
              size="small"
              onChange={(e) => console.log('Contactless transactions:', e.isChecked)}
            />
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}

export default SwitchFormExample;
```

### Using the Switch with Refs

This example shows how to use a ref with the Switch component:

```tsx
import React, { useRef } from 'react';
import { Switch, Box, Button } from '@razorpay/blade/components';
import type { BladeElementRef } from '@razorpay/blade/utils';

function SwitchWithRef() {
  const switchRef = useRef<BladeElementRef>(null);

  return (
    <Box display="flex" alignItems="center" gap="spacing.3">
      <Switch accessibilityLabel="Toggle dark mode" ref={switchRef} />
      <Button onClick={() => switchRef?.current?.focus()} variant="tertiary">
        Focus the switch
      </Button>
    </Box>
  );
}

export default SwitchWithRef;
```
