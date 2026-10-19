## Component Name

Card

## Description

Card is a surface that groups related content: an order summary, a payment method, a settings block. It is composed as in Blade React, from `CardHeader` (a title, subtitle, prefix icon or asset, a suffix and a trailing item), `CardBody` and `CardFooter` (a title and subtitle, and a primary and a secondary action), or any content of your own. It comes in a raised white (`primary`) and a flat gray (`secondary`) variant with five paddings. With `onClick` or `href` the whole card becomes clickable through an overlay laid over it, so links and buttons inside it stay usable; `isSelected` draws Blade's 2px primary ring.

## Important Constraints

- Import `Card`, `CardHeader`, `CardBody` and `CardFooter` from `@razorpay/blade-svelte/components`; the parts go in Card's `children`
- A `CardHeader`'s `title` names the card (or its overlay when clickable); give `accessibilityLabel` when there is no header title, especially on a clickable card
- `onClick` lays a button over the card (`aria-pressed` follows `isSelected`), `href` a link routed through `adapters.navigate`; links, buttons and labels inside the card sit above the overlay
- `isDisabled` removes the overlay and the ring, and beats `isSelected`
- `CardFooter`'s `actions` take data (`{ text, onClick, … }`), drawn as a secondary then a primary Button; pass `children` instead for your own footer layout
- `CardHeader` `prefix` takes an icon source or a snippet; `suffix` and `trailing` take snippets
- Width and placement go in Card's `class` (`w-full`, `max-w-[24rem]`); the padding is `padding`, never a `p-*` class. React's `size`, `elevation`, `backgroundColor`, `borderRadius` and `onHover` don't exist

## Props

```typescript
type CardVariant = 'primary' | 'secondary';
type CardPadding = 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';

interface CardFooterAction {
  text: string;
  onClick?: (event: MouseEvent) => void;
  /** @default 'button' */
  type?: 'button' | 'submit';
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconSource;
  /** @default 'left' */
  iconPosition?: 'left' | 'right';
  accessibilityLabel?: string;
}

interface CardProps {
  /** `primary`: Blade's raised white surface (rim, shadow). `secondary`: a flat gray one. @default 'primary' */
  variant?: CardVariant;
  /** Around everything in the card: 0, 8, 12, 16 or 24px. @default 'spacing.7' */
  padding?: CardPadding;
  /** CardHeader, CardBody, CardFooter, or any content. */
  children?: Snippet;
  /** Makes the whole card clickable: a button laid over it. */
  onClick?: (event: MouseEvent) => void;
  /** Makes the card a link laid over it, routed through `adapters.navigate`. */
  href?: string;
  target?: string;
  /** `noopener noreferrer` is added for `target="_blank"`. */
  rel?: string;
  /** Blade's 2px primary ring; the surface drops its rim. @default false */
  isSelected?: boolean;
  /** No overlay, no ring, `aria-disabled`; beats `isSelected`. @default false */
  isDisabled?: boolean;
  /** `label`: the card is a `<label>`, for a visually hidden radio or checkbox inside it whose checked state you pass as `isSelected`. */
  as?: 'label';
  /** Names the card (a `group`), or its overlay when clickable; wins over the header's title. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only: width, margin, its part in a flex or grid parent. */
  class?: string;
}

interface CardHeaderProps {
  /** The title (large semibold); names the card. */
  title?: string | Snippet;
  /** One muted line under the title. */
  subtitle?: string | Snippet;
  /** Before the title: an icon source, or a snippet with an asset or an Avatar. */
  prefix?: IconSource | Snippet;
  /** Beside the title: a Counter or a Badge. Shows without a title too. */
  suffix?: Snippet;
  /** At the end of the row: a Badge, an Amount, a Link, an IconButton. */
  trailing?: Snippet;
  /** A hairline under the header, 12px either side. @default true */
  showDivider?: boolean;
  /** Advanced, for headers built on CardHeader: the whole look in place of Card's. @default resolveCardHeader({ showDivider }) */
  classes?: HeaderClasses;
  /** Advanced: first in the row, before the prefix (a back button). */
  start?: Snippet;
  /** Advanced: in place of the title block; receives the drawn `title` and `subtitle` snippets. */
  content?: Snippet<[{ title: Snippet; subtitle: Snippet }]>;
  /** Under the row, inside the header. */
  children?: Snippet;
  /** Advanced: the title's id, so something else is named by it. */
  titleId?: string;
  /** Advanced: the subtitle's id, so something else is described by it. */
  subtitleId?: string;
  /** Advanced: an attachment on the header's root (a drag zone). */
  attach?: Attachment<HTMLElement>;
  testID?: string;
  /** Placement only. */
  class?: string;
}

interface CardBodyProps {
  /** The content between the header and the footer. */
  children: Snippet;
  /** Advanced: the look in place of Card's. @default resolveCardBody() */
  classes?: BodyClasses;
  testID?: string;
  /** Placement only. */
  class?: string;
}

interface CardFooterProps {
  /** The leading title (semibold). */
  title?: string;
  /** A muted line under the footer's title. */
  subtitle?: string;
  /** The trailing actions: a primary and a secondary medium Button, secondary first. */
  actions?: { primary?: CardFooterAction; secondary?: CardFooterAction };
  /** A hairline above the footer, 12px either side. @default true */
  showDivider?: boolean;
  /** Advanced: the whole look in place of Card's. @default resolveCardFooter({ showDivider }) */
  classes?: FooterClasses;
  /** Your own footer, in place of the title, subtitle and actions. */
  children?: Snippet;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Compose a card from `CardHeader`, `CardBody` and `CardFooter` when it has a title and actions; for a small tile (a selectable option, a metric) put content straight in `children`.
- Use `padding="spacing.5"` (16px) for compact cards and tiles; keep the default 24px for content cards.
- Use `variant="secondary"` for a card nested on a white surface or for a quieter block.
- For a picker made of cards, prefer CardGroup; for a one-off selectable card, pass `onClick` and `isSelected`, plus `accessibilityLabel` when it has no header title.
- Set `showDivider={false}` on the header or footer when the body is short and the hairline would crowd it.
- Don't put padding, background, border or radius classes on Card: use `variant` and `padding`.
- Don't wrap a Card in your own `<button>` or `<a>`: use `onClick` or `href`, so controls inside keep working.
- Leave `classes`, `start`, `content`, `titleId`, `subtitleId` and `attach` alone in app code: they exist for headers built on CardHeader (ModalHeader, BottomSheetHeader, DrawerHeader).

## Examples

### Header, body and footer

```svelte
<script lang="ts">
  import { Badge, Card, CardBody, CardFooter, CardHeader, Text } from '@razorpay/blade-svelte/components';
  import { FileTextIcon } from '@razorpay/blade-svelte/icons';

  async function pay(): Promise<void> {
    await fetch('/api/pay', { method: 'POST' });
  }
</script>

{#snippet status()}<Badge color="positive">New</Badge>{/snippet}

<Card class="w-full max-w-[24rem]">
  <CardHeader title="Order summary" subtitle="2 items" prefix={FileTextIcon} trailing={status} />
  <CardBody>
    <Text size="small" color="muted">Delivery in 3–5 working days.</Text>
  </CardBody>
  <CardFooter
    title="₹2,000"
    subtitle="Incl. taxes"
    actions={{ primary: { text: 'Pay', onClick: pay }, secondary: { text: 'Later' } }}
  />
</Card>
```

### Selectable cards

```svelte
<script lang="ts">
  import { Card, Text } from '@razorpay/blade-svelte/components';

  const banks = ['HDFC Bank', 'ICICI Bank', 'Axis Bank'];
  let picked = $state<string | null>(null);
</script>

<div class="flex max-w-[24rem] flex-col gap-blade-4">
  {#each banks as bank (bank)}
    <Card
      padding="spacing.5"
      isSelected={picked === bank}
      accessibilityLabel={bank}
      onClick={() => (picked = bank)}
    >
      <Text weight="semibold">{bank}</Text>
      <Text size="small" color="muted">Netbanking</Text>
    </Card>
  {/each}
</div>
```

### A card that is a link, with a link inside

```svelte
<script lang="ts">
  import { Card, CardBody, CardHeader, Link, Text } from '@razorpay/blade-svelte/components';
</script>

{#snippet help()}<Link href="/help/settlements" size="small">Help</Link>{/snippet}

<!-- The whole card goes to the settlement; the Help link sits above the overlay. -->
<Card href="/settlements/4521" variant="secondary" class="w-full">
  <CardHeader title="Settlement 4521" subtitle="Settled on 12 Oct" trailing={help} showDivider={false} />
  <CardBody>
    <Text size="small" color="muted">₹48,200 to HDFC Bank ••••1234</Text>
  </CardBody>
</Card>
```

### Your own footer

```svelte
<script lang="ts">
  import { Button, Card, CardBody, CardFooter, CardHeader, Text } from '@razorpay/blade-svelte/components';
  import { DownloadIcon } from '@razorpay/blade-svelte/icons';
</script>

<Card>
  <CardHeader title="Monthly report" subtitle="September 2026" />
  <CardBody>
    <Text size="small">1,204 payments, ₹12.4L collected.</Text>
  </CardBody>
  <CardFooter>
    <div class="flex justify-end">
      <Button variant="secondary" size="small" icon={DownloadIcon}>Download CSV</Button>
    </div>
  </CardFooter>
</Card>
```
