## Component Name

Tooltip

## Description

The Tooltip component provides additional context about elements or their functions. It's triggered by mouse hover on desktop and on tap on mobile devices. Tooltips appear in a small overlay that floats near its target element, offering supplementary information without disrupting the main workflow.

## TypeScript Types

These types represent the props that the Tooltip component and its subcomponents accept.

```typescript
// Main Tooltip component props
type TooltipProps = {
  /**
   * Tooltip title
   */
  title?: string;
  /**
   * Tooltip content
   */
  content: string;
  /**
   * Placement of tooltip
   *
   * @default "top"
   */
  placement?: Exclude<
    UseFloatingOptions['placement'],
    'left-end' | 'left-start' | 'right-end' | 'right-start'
  >;
  children: React.ReactElement;
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Sets the z-index of the modal
   * @default 1100
   */
  zIndex?: number;
} & DataAnalyticsAttribute;

// Props for TooltipInteractiveWrapper - used for non-interactive triggers like icons
// Accepts all BaseBox props except 'as'
type TooltipInteractiveWrapperProps = Omit<BaseBoxProps, 'as'>;
```

## Example

### Basic Usage

```tsx
import { Tooltip, Button } from '@razorpay/blade/components';

function BasicTooltipExample() {
  return (
    <Tooltip content="Additional information about this action" placement="bottom">
      <Button>Hover over me</Button>
    </Tooltip>
  );
}
```

### Tooltip with Title

```tsx
import { Tooltip, Button } from '@razorpay/blade/components';

function TooltipWithTitleExample() {
  return (
    <Tooltip
      title="Important Information"
      content="This action will submit your form data"
      placement="top"
      onOpenChange={({ isOpen }) => console.log(`Tooltip is ${isOpen ? 'open' : 'closed'}`)}
    >
      <Button>Submit Form</Button>
    </Tooltip>
  );
}
```

### Using with Non-Interactive Elements

When using non-interactive elements like icons as tooltip triggers, wrap them with TooltipInteractiveWrapper:

```tsx
import {
  Tooltip,
  TooltipInteractiveWrapper,
  InfoIcon,
  Box,
  Text,
} from '@razorpay/blade/components';

function NonInteractiveTooltipExample() {
  return (
    <Box display="flex" alignItems="center" gap="spacing.2">
      <Text>Transaction Details</Text>
      <Tooltip content="View detailed information about this transaction" placement="bottom-start">
        <TooltipInteractiveWrapper>
          <InfoIcon size="medium" />
        </TooltipInteractiveWrapper>
      </Tooltip>
    </Box>
  );
}
```

### Different Placements

```tsx
import { Tooltip, Button, Box } from '@razorpay/blade/components';

function TooltipPlacementExample() {
  return (
    <Box display="flex" gap="spacing.8">
      <Tooltip content="Appears on top" placement="top">
        <Button>Top</Button>
      </Tooltip>

      <Tooltip content="Appears on right" placement="right">
        <Button>Right</Button>
      </Tooltip>

      <Tooltip content="Appears on bottom" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>

      <Tooltip content="Appears on left" placement="left">
        <Button>Left</Button>
      </Tooltip>

      <Tooltip content="Appears at top-start" placement="top-start">
        <Button>Top Start</Button>
      </Tooltip>

      <Tooltip content="Appears at bottom-end" placement="bottom-end">
        <Button>Bottom End</Button>
      </Tooltip>
    </Box>
  );
}
```

### Comprehensive Example

```tsx
import {
  Tooltip,
  TooltipInteractiveWrapper,
  Button,
  Box,
  Text,
  Link,
  IconButton,
  InfoIcon,
  BankIcon,
} from '@razorpay/blade/components';

function ComprehensiveTooltipExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* With standard interactive elements */}
      <Box display="flex" gap="spacing.4" alignItems="center">
        <Tooltip
          title="Action Button"
          content="Click this button to perform the main action"
          placement="top"
          onOpenChange={({ isOpen }) => console.log(`Tooltip state: ${isOpen}`)}
        >
          <Button>Primary Action</Button>
        </Tooltip>

        <Tooltip content="Follow this link for more information" placement="bottom">
          <Link href="#more-info">More Information</Link>
        </Tooltip>

        <Tooltip content="View bank details" placement="top-end">
          <IconButton
            size="large"
            icon={BankIcon}
            onClick={() => console.log('Bank details clicked')}
            accessibilityLabel="View bank details"
          />
        </Tooltip>
      </Box>

      {/* With non-interactive elements */}
      <Box display="flex" alignItems="center" gap="spacing.2">
        <Text>Refunds</Text>
        <Tooltip
          title="Refund Information"
          content="Amount reversed to customer bank account"
          placement="bottom-start"
        >
          <TooltipInteractiveWrapper>
            <InfoIcon size="medium" />
          </TooltipInteractiveWrapper>
        </Tooltip>
      </Box>

      {/* With custom z-index */}
      <Tooltip content="This tooltip has a custom z-index" placement="right" zIndex={2000}>
        <Button variant="secondary">Custom Z-Index</Button>
      </Tooltip>
    </Box>
  );
}
```
