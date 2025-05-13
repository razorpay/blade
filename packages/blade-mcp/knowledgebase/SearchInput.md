## Component Name

SearchInput

## Description

SearchInput is a specialized input component designed for search functionality. It features a built-in search icon, clear button, and loading state, making it ideal for search interfaces, filters, and global application search. The component integrates with Dropdown for displaying search results and can be used within other components like tables for filtering data.

## TypeScript Types

The following types define the props that the SearchInput component accepts. These types are essential for proper usage of the component in TypeScript projects.

```typescript
type SearchInputSizes = 'medium' | 'large';

type SearchInputCommonProps = {
  label?: string;
  accessibilityLabel?: string;
  labelPosition?: 'top' | 'left';
  helpText?: string;
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  onChange?: ({ name, value }: { name?: string; value?: string }) => void;
  onFocus?: ({ name, value }: { name?: string; value?: string }) => void;
  onBlur?: ({ name, value }: { name?: string; value?: string }) => void;
  value?: string;
  isDisabled?: boolean;
  autoFocus?: boolean;
  onSubmit?: ({ name, value }: { name?: string; value?: string }) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  testID?: string;
  onClick?: ({ name, value }: { name?: string; value?: string }) => void;
  size?: SearchInputSizes;
  onClearButtonClick?: () => void;
  isLoading?: boolean;
  showSearchIcon?: boolean;
} & DataAnalyticsAttribute &
  StyledPropsBlade;

type SearchInputPropsWithA11yLabel = {
  label?: undefined;
  accessibilityLabel: string;
} & SearchInputCommonProps;

type SearchInputPropsWithLabel = {
  label: string;
  accessibilityLabel?: string;
} & SearchInputCommonProps;

type SearchInputProps = SearchInputPropsWithA11yLabel | SearchInputPropsWithLabel;
```

## Example

### Basic Search Input

This example demonstrates a basic search input with label and help text, showing the most common usage pattern.

```jsx
import { useState } from 'react';
import { SearchInput, Box } from '@razorpay/blade/components';

function BasicSearchExample() {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = ({ value }) => {
    setSearchValue(value || '');
    console.log('Searching for:', value);
  };

  const handleClear = () => {
    console.log('Search cleared');
  };

  return (
    <Box marginBottom="spacing.4">
      <SearchInput
        label="Search Products"
        placeholder="Search for products, categories, or SKUs"
        name="productSearch"
        value={searchValue}
        onChange={handleChange}
        onClearButtonClick={handleClear}
        helpText="Enter product name or SKU code"
        size="medium"
        data-analytics-section="product-catalog"
        data-analytics-action="search"
      />
    </Box>
  );
}
```

### Search Input with Dropdown Results

This example shows how to integrate SearchInput with Dropdown to display search results, demonstrating a common pattern for global search functionality.

```jsx
import { useState, useEffect } from 'react';
import {
  SearchInput,
  Box,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  ActionListSection,
  ActionListItemIcon,
  Spinner,
  TransactionsIcon,
  SettingsIcon,
  UserIcon,
  HelpCircleIcon,
} from '@razorpay/blade/components';

function SearchWithDropdownExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for search results
  const searchItems = [
    { id: '1', title: 'Transactions', icon: TransactionsIcon, category: 'pages' },
    { id: '2', title: 'Settings', icon: SettingsIcon, category: 'pages' },
    { id: '3', title: 'Profile', icon: UserIcon, category: 'pages' },
    { id: '4', title: 'Help Center', icon: HelpCircleIcon, category: 'support' },
  ];

  // Simulate loading state when searching
  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Filter items based on search term
  const filteredItems = searchTerm
    ? searchItems.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : searchItems;

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <Box width="400px">
      <Dropdown>
        <SearchInput
          accessibilityLabel="Global Search"
          placeholder="Search pages, settings and more"
          name="globalSearch"
          onChange={({ value }) => setSearchTerm(value || '')}
          isLoading={isLoading}
          autoCapitalize="none"
          size="large"
          showSearchIcon={true}
          data-analytics-section="global-search"
        />

        <DropdownOverlay>
          {isLoading ? (
            <Box display="flex" justifyContent="center" padding="spacing.4">
              <Spinner accessibilityLabel="Loading search results" />
            </Box>
          ) : filteredItems.length === 0 ? (
            <Box padding="spacing.4" textAlign="center">
              No results found for "{searchTerm}"
            </Box>
          ) : (
            <ActionList>
              {Object.entries(groupedItems).map(([category, items]) => (
                <ActionListSection
                  key={category}
                  title={category === 'pages' ? 'Pages' : 'Support'}
                >
                  {items.map((item) => (
                    <ActionListItem
                      key={item.id}
                      title={item.title}
                      leading={<ActionListItemIcon icon={item.icon} />}
                      onClick={() => console.log(`Selected: ${item.title}`)}
                    />
                  ))}
                </ActionListSection>
              ))}
            </ActionList>
          )}
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
}
```
