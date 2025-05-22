## Component Name

AutoComplete

## Description

AutoComplete is an enhanced dropdown trigger component that combines text input functionality with dropdown selection. It extends the capabilities of SelectInput by allowing users to type and filter options, making it ideal for scenarios where users need to search through a large set of options. Like SelectInput, it must be used within a Dropdown component and pairs with ActionList to create interactive, filterable selection experiences.

## TypeScript Types

The following types define the props that the AutoComplete component accepts. These types are essential for proper usage of the component in TypeScript projects.

```typescript
type AutoCompleteProps = {
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
   * Whether the input should be focused on mount
   */
  autoFocus?: boolean;

  /**
   * Callback that is called when the input value changes
   */
  onInputChange?: (params: { name?: string; value: string }) => void;

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
   * Controlled value of the AutoComplete. Used in combination with `onChange`.
   */
  value?: string | string[];

  /**
   * Controlled input value of the AutoComplete. Used in combination with `onInputChange`.
   */
  inputValue?: string;

  /**
   * Used to set the default value of AutoComplete when it's uncontrolled.
   */
  defaultValue?: string | string[];

  /**
   * Used to set the default input value of AutoComplete when it's uncontrolled.
   */
  defaultInputValue?: string;

  /**
   * Callback that is called when the selection changes
   */
  onChange?: ({ name, values }: { name?: string; values: string[] }) => void;

  /**
   * Whether to keep the input value after selection
   * @default false
   */
  shouldKeepInputValueOnSelect?: boolean;

  /**
   * Whether to open the dropdown when the input is focused
   * @default true
   */
  shouldOpenOnFocus?: boolean;

  /**
   * Function to filter options based on input value
   */
  filter?: (inputValue: string, option: string) => boolean;

  /**
   * Function to format display text from option value
   */
  formatValue?: (value: string) => string;

  /**
   * Constraints the height of input to given number rows
   * @default 'single'
   */
  maxRows?: 'single' | 'multiple' | 'expandable';
} & DataAnalyticsAttribute;
```

## Example

### Basic AutoComplete with Client-Side Filtering

This example demonstrates a basic AutoComplete with client-side filtering, showing how to use it within a Dropdown component.

```jsx
import { useState } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  AutoComplete,
  ActionList,
  ActionListItem,
  Box,
  Text,
  SearchIcon,
} from '@razorpay/blade/components';

function BasicAutoCompleteExample() {
  const [selectedItem, setSelectedItem] = useState('');
  const [inputValue, setInputValue] = useState('');

  const fruits = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'dragonfruit', name: 'Dragon Fruit' },
    { id: 'elderberry', name: 'Elderberry' },
    { id: 'fig', name: 'Fig' },
    { id: 'grape', name: 'Grape' },
    { id: 'honeydew', name: 'Honeydew Melon' },
  ];

  const handleSelectionChange = ({ values }) => {
    setSelectedItem(values[0] || '');
  };

  const handleInputChange = ({ value }) => {
    setInputValue(value);
  };

  // Custom filter that searches by name
  const filterFruits = (inputValue, optionValue) => {
    const fruit = fruits.find((f) => f.id === optionValue);
    return fruit ? fruit.name.toLowerCase().includes(inputValue.toLowerCase()) : false;
  };

  // Format the display value
  const formatFruitValue = (value) => {
    const fruit = fruits.find((f) => f.id === value);
    return fruit ? fruit.name : value;
  };

  return (
    <Box width="100%" maxWidth="400px">
      <Text marginBottom="spacing.4">
        Selected fruit: {selectedItem ? formatFruitValue(selectedItem) : 'None'}
      </Text>

      <Dropdown selectionType="single">
        <AutoComplete
          label="Search Fruits"
          name="fruit"
          placeholder="Type to search..."
          icon={SearchIcon}
          value={selectedItem}
          inputValue={inputValue}
          onChange={handleSelectionChange}
          filter={filterFruits}
          formatValue={formatFruitValue}
          helpText="Start typing to see matching fruits"
          size="medium"
          data-analytics-section="fruit-search"
        />
        <DropdownOverlay>
          <ActionList>
            {fruits.map((fruit) => (
              <ActionListItem key={fruit.id} title={fruit.name} value={fruit.id} />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
}
```

### AutoComplete with Asynchronous Data Loading

This example shows how to implement an AutoComplete with asynchronous data loading to fetch options based on user input.

```jsx
import { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  AutoComplete,
  ActionList,
  ActionListItem,
  Box,
  Text,
  Spinner,
} from '@razorpay/blade/components';

function AsyncAutoCompleteExample() {
  const [inputValue, setInputValue] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate API call to fetch cities based on input
  useEffect(() => {
    if (inputValue.length < 2) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data - in real app would be an API call
        const allCities = [
          { id: 'nyc', name: 'New York City', country: 'USA' },
          { id: 'london', name: 'London', country: 'UK' },
          { id: 'paris', name: 'Paris', country: 'France' },
          { id: 'tokyo', name: 'Tokyo', country: 'Japan' },
          { id: 'mumbai', name: 'Mumbai', country: 'India' },
          { id: 'sydney', name: 'Sydney', country: 'Australia' },
          { id: 'berlin', name: 'Berlin', country: 'Germany' },
          { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil' },
          { id: 'cairo', name: 'Cairo', country: 'Egypt' },
          { id: 'toronto', name: 'Toronto', country: 'Canada' },
        ];

        const filteredCities = allCities.filter(
          (city) =>
            city.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            city.country.toLowerCase().includes(inputValue.toLowerCase()),
        );

        setCities(filteredCities);
      } catch (err) {
        setError('Failed to fetch cities. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [inputValue]);

  const handleInputChange = ({ value }) => {
    setInputValue(value);
  };

  const handleSelectionChange = ({ values }) => {
    setSelectedCity(values[0] || '');
  };

  const formatCityValue = (value) => {
    const city = cities.find((c) => c.id === value);
    return city ? `${city.name}, ${city.country}` : value;
  };

  return (
    <Box width="100%" maxWidth="400px">
      <Text marginBottom="spacing.4">
        Selected city: {selectedCity ? formatCityValue(selectedCity) : 'None'}
      </Text>

      <Dropdown selectionType="single">
        <AutoComplete
          label="Search Cities"
          name="city"
          placeholder="Enter city or country name..."
          value={selectedCity}
          inputValue={inputValue}
          onChange={handleSelectionChange}
          formatValue={formatCityValue}
          helpText="Type at least 2 characters to search"
          validationState={error ? 'error' : 'none'}
          errorText={error}
          size="large"
          data-analytics-section="city-search"
        />
        <DropdownOverlay>
          {isLoading ? (
            <Box padding="spacing.4" display="flex" justifyContent="center">
              <Spinner size="medium" accessibilityLabel="Loading cities" />
            </Box>
          ) : cities.length === 0 ? (
            <Box padding="spacing.4" textAlign="center">
              <Text>No cities found. Try a different search.</Text>
            </Box>
          ) : (
            <ActionList>
              {cities.map((city) => (
                <ActionListItem
                  key={city.id}
                  title={city.name}
                  description={city.country}
                  value={city.id}
                />
              ))}
            </ActionList>
          )}
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
}
```

### AutoComplete with Create Option Feature

This example demonstrates an AutoComplete with the ability to create new options when no matching options are found.

```jsx
import { useState } from 'react';
import {
  Dropdown,
  DropdownOverlay,
  AutoComplete,
  ActionList,
  ActionListItem,
  ActionListSection,
  Box,
  Button,
  Text,
  PlusIcon,
  TagIcon,
} from '@razorpay/blade/components';

function CreatableAutoCompleteExample() {
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    { id: 'important', name: 'Important' },
    { id: 'urgent', name: 'Urgent' },
    { id: 'review', name: 'Needs Review' },
    { id: 'bug', name: 'Bug' },
    { id: 'feature', name: 'Feature Request' },
    { id: 'documentation', name: 'Documentation' },
  ]);

  const handleInputChange = ({ value }) => {
    setInputValue(value);
  };

  const handleSelectionChange = ({ values }) => {
    setSelectedTags(values);
  };

  const filterTags = (inputValue, optionValue) => {
    // Handle special "create" option
    if (optionValue.startsWith('create:')) return true;

    const tag = availableTags.find((t) => t.id === optionValue);
    return tag ? tag.name.toLowerCase().includes(inputValue.toLowerCase()) : false;
  };

  const formatTagValue = (value) => {
    if (value.startsWith('create:')) {
      return value.replace('create:', '');
    }

    const tag = availableTags.find((t) => t.id === value);
    return tag ? tag.name : value;
  };

  const handleCreateTag = () => {
    // Only create if there's input and it doesn't match existing tags
    if (!inputValue.trim()) return;

    const normalizedInput = inputValue.trim();
    const tagExists = availableTags.some(
      (t) => t.name.toLowerCase() === normalizedInput.toLowerCase(),
    );

    if (!tagExists) {
      const newTagId = normalizedInput.toLowerCase().replace(/\s+/g, '-');
      const newTag = { id: newTagId, name: normalizedInput };

      setAvailableTags((prev) => [...prev, newTag]);
      setSelectedTags((prev) => [...prev, newTagId]);
      setInputValue('');
    }
  };

  // Check if current input exists in available tags
  const shouldShowCreateOption =
    inputValue.trim() !== '' &&
    !availableTags.some((t) => t.name.toLowerCase() === inputValue.trim().toLowerCase());

  // Get display names for selected tags
  const selectedTagNames = selectedTags.map((tagId) => {
    const tag = availableTags.find((t) => t.id === tagId);
    return tag ? tag.name : tagId;
  });

  return (
    <Box
      width="100%"
      maxWidth="450px"
      padding="spacing.5"
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
    >
      <Text size="large" weight="semibold" marginBottom="spacing.4">
        Task Tags
      </Text>

      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Add Tags"
          name="tags"
          placeholder="Search or create new tags..."
          icon={TagIcon}
          value={selectedTags}
          inputValue={inputValue}
          onChange={handleSelectionChange}
          filter={filterTags}
          formatValue={formatTagValue}
          shouldKeepInputValueOnSelect={true}
          maxRows="multiple"
          size="medium"
          data-analytics-section="task-tagging"
        />
        <DropdownOverlay>
          <ActionList>
            {shouldShowCreateOption && (
              <ActionListSection title="Create New">
                <ActionListItem
                  title={`Create "${inputValue}"`}
                  value={`create:${inputValue}`}
                  leading={<PlusIcon />}
                  onClick={handleCreateTag}
                />
              </ActionListSection>
            )}

            <ActionListSection title="Available Tags">
              {availableTags.length === 0 ? (
                <Box padding="spacing.3">
                  <Text>No tags available</Text>
                </Box>
              ) : (
                availableTags.map((tag) => (
                  <ActionListItem key={tag.id} title={tag.name} value={tag.id} />
                ))
              )}
            </ActionListSection>
          </ActionList>
        </DropdownOverlay>
      </Dropdown>

      <Box marginTop="spacing.4">
        <Text size="small" weight="medium">
          Selected Tags:
        </Text>
        <Box display="flex" flexWrap="wrap" gap="spacing.2" marginTop="spacing.2">
          {selectedTagNames.length > 0 ? (
            selectedTagNames.map((tagName, index) => (
              <Box
                key={index}
                backgroundColor="surface.background.gray.subtle"
                padding={['spacing.1', 'spacing.3']}
                borderRadius="medium"
              >
                {tagName}
              </Box>
            ))
          ) : (
            <Text size="small">No tags selected</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}
```
