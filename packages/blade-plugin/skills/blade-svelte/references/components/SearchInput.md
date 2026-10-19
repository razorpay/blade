## Component Name

SearchInput

## Description

SearchInput is the field for searching or filtering a list: a `searchbox` text control with the search key, led by the search glyph, with a clear button whenever it holds text. It is TextInput's field underneath, with the same label and help line, and takes a `trailing` icon or snippet after the clear button. It comes in `medium` and `large`.

## Important Constraints

- Name it with `label` (a plain string above the field) or, for a bare search bar, `accessibilityLabel`
- `onChange` receives `{ name, value }` on every edit; bind the value with `bind:value`
- The clear button is always on while there is text: it empties the field, fires `onChange`, refocuses, then calls `onClearButtonClick`
- The control is `type="text"` with `role="searchbox"` and `enterkeyhint="search"`, as Blade; there is no `onSubmit`: Enter submits an enclosing `<form>` natively, or handle it in `onKeyDown`
- `showSearchIcon` (default on) shows the leading search glyph; there is no other `leading`
- It has only `helpText`: no validation state, error or success text
- `size` is `medium` (36px, default) or `large` (48px); there is no `small`

## Props

```typescript
interface SearchInputProps {
  /** Plain text above the field. */
  label?: string;
  /** Names the control when there is no visible `label`. */
  accessibilityLabel?: string;
  /** Bindable. @default '' */
  value?: string | number | null | undefined;
  placeholder?: string;
  /** Every edit, the clear button's included: `{ name, value }`. */
  onChange?: (change: { name: string | undefined; value: string | number | null | undefined }) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onClick?: (event: MouseEvent) => void;
  /** Enter, arrows: for moving into results or running the search. */
  onKeyDown?: (event: KeyboardEvent) => void;
  /** The clear button was pressed; the field is already empty. */
  onClearButtonClick?: () => void;
  /** @default false */
  isDisabled?: boolean;
  /** The line under the field. */
  helpText?: string | Snippet;
  /** @default false */
  autoFocus?: boolean;
  /** HTML `autocapitalize`. */
  autoCapitalize?: string;
  /** The key the app's form submits it under. */
  name?: string;
  /** After the clear button: an icon (a glyph) or a snippet. */
  trailing?: IconSource | Snippet;
  /** Lands on the `<input>`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** A composition's attachment on the `<input>`. */
  attach?: (node: HTMLInputElement) => void | (() => void);
  /** The search glyph ahead of the text. @default true */
  showSearchIcon?: boolean;
  /** 36 or 48px tall. @default 'medium' (or BladeProvider's `size`) */
  size?: 'medium' | 'large';
}
```

## Guidelines

- Filter as the user types from the bound value (a `$derived` list), or debounce `onChange` for a server search.
- Give a search bar with no visible label an `accessibilityLabel` that says what it searches ("Search banks").
- Use `class="w-full"` to make it span its container.
- Don't use TextInput with a `SearchIcon` for search: SearchInput brings the role, key and clear button.
- Don't add your own clear button; use `onClearButtonClick` to react to the built-in one.

## Examples

### Filtering a list as you type

```svelte
<script lang="ts">
  import { SearchInput, Text } from '@razorpay/blade-svelte/components';

  const banks = ['Axis Bank', 'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Yes Bank'];
  let query = $state<string | number | null | undefined>('');
  const matches = $derived(
    banks.filter((bank) => bank.toLowerCase().includes(String(query ?? '').toLowerCase()))
  );
</script>

<div class="flex flex-col gap-blade-4">
  <SearchInput bind:value={query} accessibilityLabel="Search banks" placeholder="Search banks" class="w-full" />
  {#each matches as bank (bank)}
    <Text>{bank}</Text>
  {:else}
    <Text color="muted">No bank matches “{query}”</Text>
  {/each}
</div>
```

### Running a search on Enter

```svelte
<script lang="ts">
  import { SearchInput } from '@razorpay/blade-svelte/components';

  let query = $state<string | number | null | undefined>('');

  function search(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      void fetch(`/api/payments?q=${encodeURIComponent(String(query ?? ''))}`);
    }
  }
</script>

<SearchInput
  bind:value={query}
  label="Payments"
  placeholder="Payment ID, email or phone"
  helpText="Press Enter to search"
  size="large"
  onKeyDown={search}
  onClearButtonClick={() => console.debug('cleared')}
/>
```
