# Adapters

## Description

The app's services reach Blade through `BladeProvider`'s `adapters` (`BladeAdapters`). Every adapter is optional: components run on no-op defaults. Adapters are live (a swapped adapter reaches mounted components), an adapter left out is the enclosing provider's, and `null` unsets it for a subtree (`BladeAdaptersOverride`).

## The adapters

| Adapter | Signature | What it does |
| --- | --- | --- |
| `track` | `(event: string, payload?: Record<string, unknown>) => void` | Analytics events from the components; `field_change` sends `{ name }` only |
| `navigate` | `(href: string, event: MouseEvent) => boolean` | The app's router: every `href` (Link, a link Button, a link Card or CardGroupItem, a link tab) offers it plain clicks on internal hrefs; return `true` once handled |
| `vibrate` | `(kind: 'press' \| 'select' \| 'toggle' \| 'warning') => void` | What a press or a pick meant; the app decides whether the device vibrates |
| `announce` | `(message: string) => void` | Says a message to a screen reader (a Button starting and stopping loading). Default: the live region BladeProvider renders |
| `locale` | `string` | The BCP 47 locale Amount formats with; i18nify's own locale without one |
| `reportError` | `(error: unknown) => void` | Errors the components catch: a rejected press or toast action, a failed `readOTP` or `presentDropdown` |
| `toasts` | `Toasts` (`{ showToast }`) | The toast queue under this provider: `createToasts()` (shown by a `ToastContainer` under it), or the app's own `{ showToast }`. Default: the page's queue (`showToast`) |
| `form` | `FormAdapter` | The app's form around the fields: what they register with, report edits to, show errors from, and what submit Buttons submit |
| `presentDropdown` | `PresentDropdownAdapter` | Shows a library dropdown (PhoneNumberInput's country list) the app's own way, returning a promise of the pick; return `undefined` for Blade's dropdown |
| `readOTP` | `({ length, cancelled }) => Promise<string \| undefined>` | Reads a one-time code for OTPInput (an SMS retriever, the WebOTP API); a resolved code fills the cells |

## Example

```svelte
<script lang="ts">
  import { BladeProvider, ToastContainer, createToasts } from '@razorpay/blade-svelte/components';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  const toasts = createToasts();
  const adapters = {
    toasts,
    track: (event: string, payload?: Record<string, unknown>) => console.debug(event, payload),
    navigate: (href: string) => {
      history.pushState({}, '', href);
      return true;
    },
    reportError: (error: unknown) => console.error(error),
  };
</script>

<BladeProvider {adapters} size="medium" defaults={{ Button: { color: 'primary' } }}>
  {@render children()}
  <ToastContainer />
</BladeProvider>
```

`toasts.showToast(…)` then shows a toast in this provider's container; `showToast` from `/components` uses the page's queue.

## Cancellation

Across the boundary go plain functions, promises and data. A withdrawal is `cancelled: Promise<void>`, which resolves once and never rejects (no `AbortSignal`): `createCancel()` makes one (`{ cancelled, cancel(), isCancelled }`), and a request Blade hands an adapter carries one too.
