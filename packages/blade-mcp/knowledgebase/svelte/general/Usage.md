# Usage

## Importing Components

Import Blade Svelte components from the components entry:

```typescript
import { Button, Text, Heading } from '@razorpay/blade-svelte/components';
```

## Dark Mode

Enable dark mode by setting `data-theme="dark"` on the document root:

```html
<body data-theme="dark">
  <!-- Your app -->
</body>
```

## Svelte 5 Patterns

Blade Svelte targets Svelte 5. Use runes for reactive state and snippets for slot-like content.

### Runes

```svelte
<script lang="ts">
  let isLoading = $state(false);

  function handleClick(): void {
    isLoading = true;
  }
</script>
```

### Snippets for Button children

Button accepts `children` as a snippet or string:

```svelte
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte/components';
</script>

<Button variant="primary" onClick={() => console.log('clicked')}>
  Pay Now
</Button>
```

### Icons

Import icons from the same components entry:

```svelte
<script lang="ts">
  import { Button, SearchIcon } from '@razorpay/blade-svelte/components';
</script>

<Button icon={SearchIcon} iconPosition="left">Search</Button>
```
