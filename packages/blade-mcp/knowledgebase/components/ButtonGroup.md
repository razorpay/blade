## Component Name

ButtonGroup

## Description

The ButtonGroup component is used to group related buttons together, creating a cohesive set of actions with consistent styling and spacing. It's ideal for toolbars, segmented controls, or action areas where multiple related options are presented. ButtonGroup automatically handles proper spacing and visual connection between buttons to create a unified control.

## Important Constraints

- `ButtonGroup` component only accepts `Button`, `Dropdown`, `Tooltip`, and `Popover` components as children

## TypeScript Types

The following types represent the props that the ButtonGroup component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the ButtonGroup component
 */
type ButtonGroupProps = {
  /**
   * The buttons to be grouped
   */
  children: React.ReactNode;

  /**
   * The visual style of the buttons
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * The size of the buttons
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * The color theme of the buttons
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative';
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;
```

## Usage Guidelines

**Do**

- Use `ButtonGroup` to visually associate related actions in toolbars or action areas.
- Only pass `Button`, `Dropdown`, `Tooltip`, or `Popover` as children — other components are not allowed.
- Use with `Dropdown` for split-button patterns (primary action + dropdown for alternatives).
- Use consistent `variant` across the group — it's inherited via context.

**Don't**

- Don't pass non-allowed children (only Button, Dropdown, Tooltip, Popover are accepted).
- Don't use `ButtonGroup` for unrelated actions — group only semantically related buttons.
- Don't try to override individual button `variant`/`size`/`color` — they inherit from the group.
- Don't use `ButtonGroup` for navigation — use `Tabs` or `BottomNav` instead.

## Examples

### ButtonGroup with Variants and State Management

This example demonstrates a ButtonGroup with different variants, loading state, and event handling.

```tsx
import React, { useState } from 'react';
import {
  ButtonGroup,
  Button,
  Box,
  Text,
  RefreshIcon,
  ShareIcon,
  DownloadIcon,
} from '@razorpay/blade/components';

const ButtonGroupExample = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Box padding="spacing.5">
      <Text marginBottom="spacing.4">Primary variant (default)</Text>
      <ButtonGroup
        variant="primary"
        size="medium"
        data-analytics="document-actions"
        testID="document-actions"
        marginBottom="spacing.6"
      >
        <Button icon={RefreshIcon} isLoading={isLoading} onClick={handleSync}>
          Sync
        </Button>
        <Button icon={ShareIcon} onClick={() => console.log('Share clicked')}>
          Share
        </Button>
        <Button icon={DownloadIcon} onClick={() => console.log('Download clicked')}>
          Download
        </Button>
      </ButtonGroup>

      <Text marginBottom="spacing.4">Secondary variant with small size</Text>
      <ButtonGroup variant="secondary" size="small">
        <Button icon={RefreshIcon}>Sync</Button>
        <Button icon={ShareIcon}>Share</Button>
        <Button icon={DownloadIcon}>Download</Button>
      </ButtonGroup>
    </Box>
  );
};

export default ButtonGroupExample;
```

### ButtonGroup with Dropdown Integration

This example demonstrates how to integrate ButtonGroup with Dropdown for split button patterns.

```tsx
import React, { useState } from 'react';
import {
  ButtonGroup,
  Button,
  Box,
  Text,
  Dropdown,
  DropdownButton,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  PlusIcon,
  ChevronDownIcon,
} from '@razorpay/blade/components';

const ButtonGroupWithDropdownExample = () => {
  const [selectedAction, setSelectedAction] = useState('');

  const handleActionSelect = (value: string) => {
    setSelectedAction(value);
    console.log(`Selected action: ${value}`);
  };

  return (
    <Box padding="spacing.5">
      <Text marginBottom="spacing.4">Split button with dropdown:</Text>

      <ButtonGroup variant="primary" size="medium">
        <Button icon={PlusIcon} onClick={() => console.log('Create new payout')}>
          Payout
        </Button>
        <Dropdown>
          <DropdownButton icon={ChevronDownIcon} accessibilityLabel="More payout options" />
          <DropdownOverlay defaultPlacement="bottom-end">
            <ActionList>
              <ActionListItem
                title="Bulk Payout"
                value="bulk-payout"
                onClick={() => handleActionSelect('bulk-payout')}
              />
              <ActionListItem
                title="Upload Invoice"
                value="upload-invoice"
                onClick={() => handleActionSelect('upload-invoice')}
              />
              <ActionListItem
                title="Add Contact"
                value="add-contact"
                onClick={() => handleActionSelect('add-contact')}
              />
              <ActionListItem
                title="Team Member"
                value="team-member"
                onClick={() => handleActionSelect('team-member')}
              />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </ButtonGroup>

      {selectedAction && (
        <Box marginTop="spacing.4">
          <Text>Selected: {selectedAction}</Text>
        </Box>
      )}
    </Box>
  );
};

export default ButtonGroupWithDropdownExample;
```
