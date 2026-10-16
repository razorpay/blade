## Component Name

SearchInput

## Description

SearchInput is a text field preset for search and filtering: it shows a leading search icon, a clear button once there is a value, and an optional loading spinner for async lookups. Use it for filtering payments or settlements lists, searching a product catalog, or a global dashboard search.

## Important Constraints

- Either `label` or `accessibilityLabel` is required; without a visible `label`, `accessibilityLabel` names the field
- `onChange` fires on every keystroke with `{ name, value }`
- The clear button does not call `onChange`; in controlled mode it does not clear the field either, so reset `value` in `onClearButtonClick`
- The `trailing` snippet is hidden while the clear button or the loading spinner is shown
- The search icon is always on the leading side; `showSearchIcon={false}` removes it
- Partial port of React: Dropdown integration (search results as a trigger), `onSubmit`, `showHelpTextOnFocus` and TopNav/Modal theming are not available

## TypeScript Types

These are the props the SearchInput component accepts.

```typescript
type BaseInputSize = 'xsmall' | 'small' | 'medium' | 'large';
type LabelPosition = 'top' | 'left';
type AutoCapitalize = 'none' | 'sentences' | 'words' | 'characters';

/**
 * Payload shape for input value events (`onChange`/`onFocus`/`onBlur`/`onClick`).
 * `value` is extracted from the DOM event internally.
 */
type FormInputOnEvent = (event: { name?: string; value?: string; rawValue?: string }) => void;

type SearchInputPropsWithLabel = {
  /** Label shown for the input. */
  label: string;
  /** Accessibility label (optional when `label` is provided). */
  accessibilityLabel?: string;
};

type SearchInputPropsWithA11yLabel = {
  /** Label shown for the input. */
  label?: undefined;
  /** Accessibility label (required when `label` is absent). */
  accessibilityLabel: string;
};

interface SearchInputCommonProps extends StyledPropsBlade {
  /** Label position. @default 'top' */
  labelPosition?: LabelPosition;
  /** Suffix element rendered after the label text. */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row. */
  labelTrailing?: Snippet;
  /** Help text below the input. */
  helpText?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Controlled value. */
  value?: string;
  /** Name of the input. */
  name?: string;
  /** Change callback. Fires on every keystroke (matches React SearchInput onChange). */
  onChange?: FormInputOnEvent;
  /** Focus callback. */
  onFocus?: FormInputOnEvent;
  /** Blur callback. */
  onBlur?: FormInputOnEvent;
  /** Click callback. */
  onClick?: FormInputOnEvent;
  /** Click handler for the clear button. */
  onClearButtonClick?: () => void;
  /** Shows a loading spinner in the trailing slot. */
  isLoading?: boolean;
  /** Toggle visibility of the search icon. @default true */
  showSearchIcon?: boolean;
  /** Trailing element rendered at the end of the input. */
  trailing?: Snippet;
  /** Disables the input. */
  isDisabled?: boolean;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Autocapitalize behaviour. */
  autoCapitalize?: AutoCapitalize;
  /** Input size. @default 'medium' */
  size?: BaseInputSize;
  /** Test ID for the element. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

type SearchInputProps = (SearchInputPropsWithLabel | SearchInputPropsWithA11yLabel) &
  SearchInputCommonProps;
```

## Usage Guidelines

**Do**

- Use `SearchInput` for search and filter fields: payments list filters, customer lookup, product catalog search.
- Set `isLoading` while an async search runs and turn it off when results arrive or the query is empty.
- Reset the controlled `value` (and any results) in `onClearButtonClick`.
- Use `accessibilityLabel` with a descriptive placeholder for compact search bars without a visible label.
- Use `size="small"` or `size="xsmall"` above dense tables.

**Don't**

- Don't use `SearchInput` for general text entry; use `TextInput`.
- Don't add prefix, suffix, a character counter or `format`; SearchInput doesn't support them, so use `TextInput` when you need them.
- Don't put essential content in `trailing`; it is hidden while the clear button or spinner is visible.
- Don't use `bind:value`; use `value` with `onChange`.

## Examples

### Filter payments by ID or email

A controlled search that filters a list as the user types and resets it from the clear button.

```svelte
<script lang="ts">
  import { SearchInput, Box, Text } from '@razorpay/blade-svelte/components';

  const payments = [
    { id: 'pay_29QQoUBi66xm2f', email: 'riya@example.com' },
    { id: 'pay_2A1fXkO9lZ3Kq8', email: 'arjun@example.com' },
    { id: 'pay_2B7hTzP0mN5Rw4', email: 'meera@example.com' },
  ];

  let query = $state('');

  const results = $derived(
    payments.filter(
      (payment) => payment.id.includes(query) || payment.email.includes(query.toLowerCase()),
    ),
  );
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <SearchInput
    label="Search payments"
    name="paymentSearch"
    placeholder="Search by payment ID or email"
    helpText="Matches are shown as you type"
    value={query}
    onChange={({ value }) => (query = value ?? '')}
    onClearButtonClick={() => (query = '')}
    data-analytics-section="payments-search"
  />
  {#each results as payment (payment.id)}
    <Text size="small">{payment.id} · {payment.email}</Text>
  {/each}
</Box>
```

### Compact async search without a visible label

A small search bar above a settlements table that shows a spinner while results load.

```svelte
<script lang="ts">
  import { SearchInput } from '@razorpay/blade-svelte/components';

  let query = $state('');
  let isSearching = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const search = (value: string): void => {
    query = value;
    clearTimeout(timer);
    isSearching = value.length > 0;
    if (value) timer = setTimeout(() => (isSearching = false), 800);
  };
</script>

<SearchInput
  accessibilityLabel="Search settlements"
  placeholder="Search by settlement ID or UTR"
  size="small"
  isLoading={isSearching}
  value={query}
  onChange={({ value }) => search(value ?? '')}
  onClearButtonClick={() => search('')}
/>
```
