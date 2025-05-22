## Component Name

Dropdown

## Description

Dropdown is a versatile component that displays a floating overlay with content beneath a trigger element. It supports various trigger types (buttons, links, inputs) and content patterns including selection menus, filter chips, and autocomplete. Dropdown offers controlled and uncontrolled modes, with built-in positioning logic to ensure the overlay appears in the optimal location regardless of available space.

## TypeScript Types

The following types represent the props that the Dropdown component and its subcomponents accept.

```typescript
/**
 * Props for the Dropdown component
 */
type DropdownProps = {
  /**
   * The type of selection the dropdown supports
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';

  /**
   * Children of the dropdown (typically a trigger and overlay)
   */
  children: React.ReactNode;

  /**
   * Controls whether the dropdown is open (controlled mode)
   */
  isOpen?: boolean;

  /**
   * Controls whether the dropdown is initially open (uncontrolled mode)
   */
  defaultIsOpen?: boolean;

  /**
   * Callback fired when the open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * If true, dropdown will close when clicking outside
   * @default true
   */
  shouldCloseOnClickOutside?: boolean;

  /**
   * If true, dropdown will close when pressing the escape key
   * @default true
   */
  shouldCloseOnEscape?: boolean;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the DropdownOverlay component
 */
type DropdownOverlayProps = {
  /**
   * Children of the overlay
   */
  children: React.ReactNode;

  /**
   * Width of the overlay
   */
  width?: string | number;

  /**
   * Maximum width of the overlay
   */
  maxWidth?: string | number;

  /**
   * Maximum height of the overlay
   */
  maxHeight?: string | number;
} & StyledPropsBlade;

/**
 * Props for the DropdownButton component
 */
type DropdownButtonProps = {
  /**
   * Children of the button (typically text content)
   */
  children: React.ReactNode;

  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;
} & StyledPropsBlade;

/**
 * Props for the DropdownLink component
 */
type DropdownLinkProps = {
  /**
   * Children of the link (typically text content)
   */
  children: React.ReactNode;

  /**
   * Icon to display with the link
   */
  icon?: IconComponent;

  /**
   * Position of the icon
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Whether the link is disabled
   * @default false
   */
  isDisabled?: boolean;
} & StyledPropsBlade;

/**
 * Props for the DropdownIconButton component
 */
type DropdownIconButtonProps = {
  /**
   * Icon to display in the button
   */
  icon: IconComponent;

  /**
   * Accessibility label for the button
   */
  accessibilityLabel: string;

  /**
   * Size of the icon button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;
} & StyledPropsBlade;

/**
 * Props for the DropdownHeader component
 */
type DropdownHeaderProps = {
  /**
   * Title of the header
   */
  title?: string;

  /**
   * Subtitle of the header
   */
  subtitle?: string;

  /**
   * Content to display at the start of the header
   */
  leading?: React.ReactNode;

  /**
   * Content to display at the end of the header
   */
  trailing?: React.ReactNode;

  /**
   * Content to display after the title
   */
  titleSuffix?: React.ReactNode;

  /**
   * Children of the header (typically for custom content)
   */
  children?: React.ReactNode;
} & StyledPropsBlade;

/**
 * Props for the DropdownFooter component
 */
type DropdownFooterProps = {
  /**
   * Children of the footer
   */
  children: React.ReactNode;
} & StyledPropsBlade;

/**
 * Props for the FilterChipSelectInput component
 */
type FilterChipSelectInputProps = {
  /**
   * Label text for the filter chip
   */
  label: string;

  /**
   * Current value(s) selected
   */
  value?: string | string[];

  /**
   * Callback when selection changes
   */
  onChange?: (value: string | string[]) => void;

  /**
   * Callback when clear button is clicked
   */
  onClearButtonClick?: (value: string | string[]) => void;

  /**
   * Whether the filter chip is disabled
   * @default false
   */
  isDisabled?: boolean;
} & StyledPropsBlade;

/**
 * Props for the FilterChipGroup component
 */
type FilterChipGroupProps = {
  /**
   * Children of the filter chip group (typically FilterChipSelectInput components)
   */
  children: React.ReactNode;
} & StyledPropsBlade;

/**
 * Type for the Icon component
 */
type IconComponent = React.ComponentType<any>;
```

## Examples

### Basic Dropdown with Button Trigger

This example shows a simple dropdown with a button trigger and action list items.

```tsx
import React, { useState } from 'react';
import {
  Dropdown,
  DropdownButton,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
} from '@razorpay/blade/components';

const BasicDropdownExample = () => {
  const [status, setStatus] = useState<string | undefined>();

  return (
    <Dropdown>
      {/* Button trigger with dynamic text based on selection */}
      <DropdownButton variant="tertiary" size="medium">
        Status: {status || 'Select'}
      </DropdownButton>

      <DropdownOverlay width="240px">
        <ActionList>
          <ActionListItem
            onClick={({ name }) => setStatus(name)}
            leading={<ActionListItemIcon icon={CheckIcon} />}
            isSelected={status === 'approve'}
            title="Approve"
            value="approve"
          />

          <ActionListItem
            onClick={({ name }) => setStatus(name)}
            leading={<ActionListItemIcon icon={ClockIcon} />}
            isSelected={status === 'in-progress'}
            title="In Progress"
            value="in-progress"
          />

          <ActionListItem
            onClick={({ name }) => setStatus(name)}
            leading={<ActionListItemIcon icon={CloseIcon} />}
            isSelected={status === 'reject'}
            title="Reject"
            value="reject"
            intent="negative"
          />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
```

### Dropdown with Select Input (Single and Multiple Selection)

This example demonstrates a form-style dropdown for selecting values, supporting both single and multiple selection modes.

```tsx
import React, { useState } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  DropdownHeader,
  DropdownFooter,
  ActionList,
  ActionListItem,
  SelectInput,
  Button,
  Box,
  CheckIcon,
  ClockIcon,
  CloseIcon,
} from '@razorpay/blade/components';

const SelectDropdownExample = () => {
  // Single selection state
  const [singleValue, setSingleValue] = useState<string>('');

  // Multiple selection state
  const [multiValues, setMultiValues] = useState<string[]>([]);

  // Controlled open state for multiple selection dropdown
  const [isMultiOpen, setIsMultiOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Single Selection Dropdown */}
      <Dropdown>
        <SelectInput
          label="Select City"
          placeholder="Choose a city"
          value={singleValue}
          onChange={(args) => {
            if (args) {
              setSingleValue(args.values[0]);
            }
          }}
          helpText="Select your preferred city"
          size="medium"
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Delhi" value="delhi" />
            <ActionListItem title="Chennai" value="chennai" />
            <ActionListItem title="Hyderabad" value="hyderabad" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>

      {/* Multiple Selection Dropdown with Header and Footer */}
      <Dropdown selectionType="multiple" isOpen={isMultiOpen} onOpenChange={setIsMultiOpen}>
        <SelectInput
          label="Select Multiple Cities"
          placeholder="Choose cities"
          value={multiValues}
          onChange={(args) => {
            if (args) {
              setMultiValues(args.values);
            }
          }}
          maxRows="multiple" // Show multiple selected values as tags
          validationState={multiValues.length === 0 ? 'error' : 'none'}
          errorText="Please select at least one city"
          isRequired
        />

        <DropdownOverlay width="300px">
          <DropdownHeader title="Available Cities" subtitle="Select one or more" />

          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Delhi" value="delhi" />
            <ActionListItem title="Chennai" value="chennai" />
            <ActionListItem title="Hyderabad" value="hyderabad" />
          </ActionList>

          <DropdownFooter>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button variant="tertiary" size="small" onClick={() => setMultiValues([])}>
                Clear All
              </Button>
              <Button size="small" onClick={() => setIsMultiOpen(false)}>
                Apply
              </Button>
            </Box>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};
```

### AutoComplete Dropdown

This example demonstrates the AutoComplete dropdown for searching and selecting options with filtering capabilities.

```tsx
import React, { useState } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  DropdownHeader,
  ActionList,
  ActionListItem,
  AutoComplete,
  Box,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  TextInput,
} from '@razorpay/blade/components';

const AutoCompleteDropdownExample = () => {
  const fruits = [
    'Apples',
    'Apricots',
    'Avocados',
    'Bananas',
    'Blueberries',
    'Cherries',
    'Cranberries',
    'Grapes',
    'Lemons',
    'Mangoes',
    'Oranges',
    'Peaches',
    'Pears',
    'Pineapples',
    'Strawberries',
  ];

  const [query, setQuery] = useState('');
  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);

  // Filter fruits based on search query
  const filteredFruits = query
    ? fruits.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))
    : fruits;

  // Toggle selection of a fruit
  const toggleFruit = (fruit: string) => {
    if (selectedFruits.includes(fruit)) {
      setSelectedFruits(selectedFruits.filter((f) => f !== fruit));
    } else {
      setSelectedFruits([...selectedFruits, fruit]);
    }
  };

  return (
    <Box maxWidth="300px">
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Select Fruits"
          placeholder="Search fruits..."
          value={selectedFruits}
          onChange={(args) => {
            if (args) {
              setSelectedFruits(args.values);
              // Update query when input changes
              if (args.inputValue !== undefined) {
                setQuery(args.inputValue);
              }
            }
          }}
          maxRows="multiple"
          size="medium"
        />

        <DropdownOverlay>
          <DropdownHeader>
            <TextInput
              label="Search Fruits"
              value={query}
              onChange={({ value }) => setQuery(value)}
              autoFocus
            />
          </DropdownHeader>

          <ActionList>
            {filteredFruits.map((fruit) => (
              <ActionListItem
                key={fruit}
                title={fruit}
                value={fruit}
                isSelected={selectedFruits.includes(fruit)}
                onClick={() => toggleFruit(fruit)}
              />
            ))}

            {filteredFruits.length === 0 && (
              <Box padding="spacing.4" textAlign="center">
                No matching fruits found
              </Box>
            )}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};
```
