## Component Name

SelectInput

## Description

SelectInput is a dropdown trigger component that functions as the equivalent of the HTML `<select>` element in Blade Design System. It must be used within a Dropdown component and works with ActionList to create selectable options. SelectInput provides a clean interface for single or multiple item selection with full keyboard accessibility and rich styling options.

## TypeScript Types

The following types define the props that the SelectInput component accepts. These types are essential for proper usage of the component in TypeScript projects.

```typescript
type SelectInputProps = {
  /**
   * Label to be shown for the input field
   */
  label?: string;

  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;

  /**
   * Position of the label.
   * Can be 'top', 'left', or 'inside-input'
   */
  labelPosition?: 'top' | 'left' | 'inside-input';

  /**
   * Indicates whether the field is optional or required
   */
  necessityIndicator?: 'optional' | 'required';

  /**
   * Validation state of the input
   */
  validationState?: 'none' | 'error' | 'success';

  /**
   * Help text to be displayed below the input
   */
  helpText?: string;

  /**
   * Error text to be displayed when validationState is 'error'
   */
  errorText?: string;

  /**
   * Success text to be displayed when validationState is 'success'
   */
  successText?: string;

  /**
   * Name of the input field
   */
  name?: string;

  /**
   * Whether the input is disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the input is required
   */
  isRequired?: boolean;

  /**
   * Prefix text to be displayed before the value
   */
  prefix?: string;

  /**
   * Suffix text to be displayed after the value
   */
  suffix?: string;

  /**
   * Slot to be rendered adjacent to the value
   */
  valueSuffix?: ({ values }: { values: string[] }) => React.ReactNode;

  /**
   * Whether the input should be focused on mount
   */
  autoFocus?: boolean;

  /**
   * Callback that is called when the input is clicked
   */
  onClick?: ({ name, value }: { name?: string; value?: string }) => void;

  /**
   * Callback that is called when the input receives focus
   */
  onFocus?: ({ name, value }: { name?: string; value?: string }) => void;

  /**
   * Callback that is called when the input loses focus
   */
  onBlur?: ({ name, value }: { name?: string; value?: string }) => void;

  /**
   * Placeholder text to be displayed when no value is selected
   */
  placeholder?: string;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Size of the input
   */
  size?: 'medium' | 'large';

  /**
   * Icon to be displayed at the beginning of the input
   */
  icon?: React.ComponentType<any>;

  /**
   * Controlled value of the Select. Use it in combination of `onChange`.
   */
  value?: string | string[];

  /**
   * Used to set the default value of SelectInput when it's uncontrolled.
   */
  defaultValue?: string | string[];

  /**
   * Callback that is called when the selection changes
   */
  onChange?: ({ name, values }: { name?: string; values: string[] }) => void;

  /**
   * Constraints the height of input to given number rows
   * @default 'single'
   */
  maxRows?: 'single' | 'multiple' | 'expandable';
} & DataAnalyticsAttribute;
```

## Usage Guidelines

**When to Use**

Use `SelectInput` (inside `Dropdown`) when you have a **fixed set of more than 5 predefined options** and the user needs to pick one (or multiple). It's the standard form-field dropdown pattern.

For fewer options (2–5 choices), prefer visible selection controls: `Radio` for longer labels, `Chip` with `selectionType="single"` for short consistent labels. For 1 binary option, use `Switch` (immediate) or `Checkbox` (requires confirmation).

**Do**

- Use `SelectInput` for dropdown-based selection from a fixed set of predefined options (typically >5 items).
- Always wrap `SelectInput` inside a `Dropdown` component with `DropdownOverlay` and `ActionList`.
- Use `SelectInput` for lists where users don't need to search/filter options.
- Use `icon` prop for a leading visual icon that provides context about the field type.
- Use `valueSuffix` for badges or indicators after the selected value display.

**Don't**

- Don't use `SelectInput` standalone without a `Dropdown` wrapper — it won't function.
- Don't use `SelectInput` for 5 or fewer options — use `Radio` or `Chip` to show choices inline without extra interaction.
- Don't use `SelectInput` for large lists (10+ items) where users need to search — use `AutoComplete` instead.
- Don't use `SelectInput` for inline tag-based selection — use `Chip`/`ChipGroup` instead.
- Don't use React Fragments as children in the `Dropdown` wrapper.
- Don't confuse with `SearchInput` — SelectInput has no text input capability.

## Example

### Basic SelectInput with Single Selection

This example demonstrates a basic SelectInput with single selection, showing how to use it within a Dropdown component.

```tsx
import { useState } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
  Box,
  Text,
  UserIcon,
} from '@razorpay/blade/components';

function BasicSelectExample() {
  const [selectedUser, setSelectedUser] = useState('');

  const handleUserChange = ({ values }) => {
    setSelectedUser(values[0] || '');
  };

  return (
    <Box width="100%" maxWidth="400px">
      <Text marginBottom="spacing.4">Selected user: {selectedUser || 'None'}</Text>

      <Dropdown selectionType="single">
        <SelectInput
          label="Select User"
          name="user"
          placeholder="Choose a user"
          icon={UserIcon}
          onChange={handleUserChange}
          helpText="Select a user to view their profile"
          necessityIndicator="required"
          size="medium"
          data-analytics-section="user-selection"
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="John Doe" value="john" />
            <ActionListItem title="Jane Smith" value="jane" />
            <ActionListItem title="Robert Johnson" value="robert" />
            <ActionListItem title="Emily Davis" value="emily" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
}
```

### SelectInput with Multiple Selection and Validation

This example shows how to implement a SelectInput with multiple selection capability along with validation states.

```tsx
import { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
  ActionListSection,
  Box,
  Button,
  TagIcon,
} from '@razorpay/blade/components';

function MultiSelectWithValidationExample(): React.ReactElement {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [validationState, setValidationState] = useState<'none' | 'error' | 'success'>('none');

  // Validate whenever selection changes
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setValidationState('error');
    } else if (selectedCategories.length > 3) {
      setValidationState('error');
    } else {
      setValidationState('success');
    }
  }, [selectedCategories]);

  const handleCategoryChange = ({ values }: { values: string[] }): void => {
    setSelectedCategories(values);
  };

  const handleSubmit = (): void => {
    if (validationState === 'success') {
      // eslint-disable-next-line no-alert
      alert(`Selected categories: ${selectedCategories.join(', ')}`);
    }
  };

  return (
    <Box
      width="100%"
      maxWidth="450px"
      padding="spacing.5"
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
    >
      <Dropdown selectionType="multiple">
        <SelectInput
          label="Product Categories"
          name="categories"
          placeholder="Select categories"
          icon={TagIcon}
          value={selectedCategories}
          onChange={handleCategoryChange}
          validationState={validationState}
          errorText={
            selectedCategories.length === 0
              ? 'At least one category is required'
              : 'Maximum 3 categories allowed'
          }
          successText={`${selectedCategories.length} categories selected`}
          maxRows="multiple"
          isRequired={true}
          size="large"
          data-analytics-field="product-categories"
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListSection title="Electronics">
              <ActionListItem title="Smartphones" value="smartphones" />
              <ActionListItem title="Laptops" value="laptops" />
              <ActionListItem title="Accessories" value="accessories" />
            </ActionListSection>
            <ActionListSection title="Clothing">
              <ActionListItem title="Men's Wear" value="mens-wear" />
              <ActionListItem title="Women's Wear" value="womens-wear" />
              <ActionListItem title="Children's Wear" value="childrens-wear" />
            </ActionListSection>
            <ActionListSection title="Home">
              <ActionListItem title="Furniture" value="furniture" />
              <ActionListItem title="Decor" value="decor" />
              <ActionListItem title="Kitchen" value="kitchen" />
            </ActionListSection>
          </ActionList>
        </DropdownOverlay>
      </Dropdown>

      <Button
        marginTop="spacing.4"
        onClick={handleSubmit}
        isDisabled={validationState !== 'success'}
      >
        Save Categories
      </Button>
    </Box>
  );
}

export default MultiSelectWithValidationExample;

```
### Controlled SelectInput with Custom Formatting

This example demonstrates a controlled SelectInput with custom formatting and state management for a more complex use case.

```tsx
import { useState } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  Box,
  Button,
  Heading,
  Text,
  GlobeIcon,
} from '@razorpay/blade/components';

function CurrencySelectExample() {
  // Pre-defined currency data
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [amount, setAmount] = useState('1000');

  const handleCurrencyChange = ({ values }) => {
    if (values && values.length > 0) {
      setSelectedCurrency(values[0]);
    }
  };

  // Get current currency data
  const currentCurrency = currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  return (
    <Box
      width="100%"
      maxWidth="450px"
      padding="spacing.5"
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
      borderWidth="thinner"
      borderStyle="solid"
      borderColor="surface.border.gray.subtle"
    >
      <Heading size="xlarge" weight="semibold" marginBottom="spacing.4">
        Currency Converter
      </Heading>

      <Box display="flex" alignItems="flex-end" gap="spacing.3" marginBottom="spacing.5">
        <Box width="150px">
          <Dropdown selectionType="single">
            <SelectInput
              label="Currency"
              name="currency"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              labelPosition="top"
              prefix={currentCurrency.symbol}
              defaultValue="INR"
              size="medium"
              data-analytics-field="currency-selector"
            />
            <DropdownOverlay>
              <ActionList>
                {currencies.map((currency) => (
                  <ActionListItem
                    key={currency.code}
                    title={`${currency.flag} ${currency.code} - ${currency.name}`}
                    value={currency.code}
                  />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>

        <Box flexGrow={1}>
          <Heading size="xlarge" weight="semibold">
            {currentCurrency.symbol} {amount}
          </Heading>
        </Box>
      </Box>

      <Box>
        <Text size="small">
          Selected currency: {currentCurrency.flag} {currentCurrency.name} ({currentCurrency.code})
        </Text>
      </Box>

      <Button marginTop="spacing.4" icon={GlobeIcon} iconPosition="left" isFullWidth>
        View Exchange Rates
      </Button>
    </Box>
  );
}
```
