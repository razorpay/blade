# SearchInput

The Search Input lets you type and find what you need in a wide range of data or choices.

This document outlines the API of `SearchInput` component.

<img src="./searchinput-thumbnail.png" width="50%" alt="Thumbnail" />

<img src="./searchinput-dropdown.png" width="50%" alt="Input with results in dropdown" />

## Design

- [Figma - SearchInput](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=85072%3A160345&mode=design&t=Pv93G8LK6OtL4wwk-1)

## Anatomy

<img src="./searchinput-anatomy.png" width="50%" alt="Anatomy" />

## API

SearchInput will extend the `BaseInput` and will have overlapping props such as:

```ts
type CommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'name'
  | 'value'
  | 'helpText'
  | 'isDisabled'
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'onSubmit'
>;

type SearchInputProps = CommonProps & {
  /**
   * The size of the input field.
   *
   * @default medium
   */
  size?: 'medium' | 'large';
  /**
   * Toggles the loading state of the component
   *
   * @default true
   */
  isLoading?: boolean;
  /**
   * Callback that is called when the clear button is clicked.
   */
  onClearButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
```

## Usage

- Table search
- Dropdown nav search
- Async state

### Without Dropdown

```jsx
import React from 'react';
import { Box, SearchInput } from '@razorpay/blade/components';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuItems = ['Settings', 'Profile', 'Transactions', 'Help', 'Refunds', 'Settlements', 'Payouts'];

  return (
    <Box>
      <SearchInput
        label="Search"
        onChange={({ value }): void => setSearchTerm(value)})}
        placeholder="Search here"
      />
    </Box>
  );
};
```

### With Dropdown

```jsx
import React from 'react';
import {
  Dropdown,
  DropdownOverlay,
  SearchInput,
  ActionList,
  ActionListItem,
  Box,
} from '@razorpay/blade/components';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuItems = ['Settings', 'Profile', 'Transactions', 'Help', 'Refunds', 'Settlements', 'Payouts'];
  const popularItems = ['Transactions', 'Settlements'];

  return (
    <Dropdown>
      <SearchInput
        label="Search"
        onChange={({ value }): void => setSearchTerm(value)})}
        placeholder="Search here"

      />
      <DropdownOverlay>
        <ActionList>
          {searchTerm.length === 0 ? (
            popularItems.map((item, index) => (
              <ActionListItem key={index} title={item} value={item} />
            ))
          ) : (
            menuItems.filter(item => item.includes(searchTerm)).map((item, index) => (
              <ActionListItem key={index} title={item} value={item} />
            )
          )}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
```

## Accessibility

- The country selector will be accessible via keyboard navigation and be composed with blade's Dropdown component.
- The input field will have a `aria-label` attribute to describe the input field.

## Open questions

NA.
