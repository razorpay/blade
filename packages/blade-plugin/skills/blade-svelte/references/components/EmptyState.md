## Component Name

EmptyState

## Description

EmptyState is the centred stack a screen or section shows instead of content: nothing here yet, no search results, or something went wrong. It stacks an `asset` (an illustration or a large icon, capped per size), a `title` (a Heading whose level follows the size), a `description` (text, or a snippet with a Link in it) and the caller's actions in `children`, in four sizes. An `icon` can lead the title, or the description when there is no title.

## Important Constraints

- The actions are your own Buttons or Links in `children`, laid under the description; EmptyState has no action props
- `asset` is a snippet: an `<img alt="…">` illustration, or an `Icon`; the box caps it at 60, 90, 120 or 160px by size
- `icon` takes an icon source and is sized with the title (12, 16, 20 or 32px); don't also put the same icon in `asset`
- The title's tag follows its size: `h6` at small and medium, `h5` at large, `h3` at xlarge
- It has no padding or background of its own: the surrounding layout gives it room; `class` places it

## Props

```typescript
type EmptyStateSize = 'small' | 'medium' | 'large' | 'xlarge';

interface EmptyStateProps {
  /** The heading: text, or a snippet in the heading's box. */
  title?: string | Snippet;
  /** Under the title: text, or a snippet (with a Link in it). */
  description?: string | Snippet;
  /** A glyph before the title (before the description when there is no title). */
  icon?: IconSource;
  /** An illustration or an icon, above the title. */
  asset?: Snippet;
  /** Actions, under the description. */
  children?: Snippet;
  /** The gaps, the asset's cap and the text sizes. @default 'medium' */
  size?: EmptyStateSize;
  testID?: string;
  /** Placement only: margin, width, its place in a parent. */
  class?: string;
}
```

## Guidelines

- Say what is empty in the title and what to do next in the description, and offer one primary action in `children`.
- Use `small` inside a card or panel, `medium` in a section, and `large` or `xlarge` for a whole empty screen.
- Give an illustration in `asset` real `alt` text when it carries meaning, and `alt=""` when it is decoration.
- Centre it in its region with your own layout (`flex min-h-[20rem] items-center justify-center`).
- Don't rebuild an empty state from Heading, Text and an image: use EmptyState, which spaces and sizes them.

## Examples

### With an asset and an action

```svelte
<script lang="ts">
  import { Button, EmptyState, Icon } from '@razorpay/blade-svelte/components';
  import { PaymentLinksIcon, PlusIcon } from '@razorpay/blade-svelte/icons';
</script>

<EmptyState
  title="No payment links yet"
  description="Create a payment link and share it to collect money in minutes."
>
  {#snippet asset()}<Icon source={PaymentLinksIcon} size="2xlarge" color="muted" />{/snippet}
  <Button icon={PlusIcon}>Create payment link</Button>
</EmptyState>
```

### A description with a link

```svelte
<script lang="ts">
  import { EmptyState, Link } from '@razorpay/blade-svelte/components';
  import { SearchIcon } from '@razorpay/blade-svelte/icons';

  let query = $state('rzp_4521');
</script>

{#snippet hint()}
  Check the ID, or <Link href="/payments" size="small">see all payments</Link>.
{/snippet}

<EmptyState size="small" icon={SearchIcon} title="No results for “{query}”" description={hint} />
```

### An error, full screen

```svelte
<script lang="ts">
  import { Button, EmptyState, Icon } from '@razorpay/blade-svelte/components';
  import { AlertTriangleIcon, RefreshIcon } from '@razorpay/blade-svelte/icons';

  function retry(): void {
    location.reload();
  }
</script>

<div class="flex min-h-screen items-center justify-center p-blade-5">
  <EmptyState size="large" title="Something went wrong" description="We couldn't load your dashboard.">
    {#snippet asset()}<Icon source={AlertTriangleIcon} size="2xlarge" color="negative" />{/snippet}
    <Button variant="secondary" icon={RefreshIcon} onClick={retry}>Try again</Button>
  </EmptyState>
</div>
```
