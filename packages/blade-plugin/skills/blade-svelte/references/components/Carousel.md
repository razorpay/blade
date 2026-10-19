## Component Name

Carousel

## Description

Carousel shows a row of full-width slides one at a time, swiped, scrolled or picked from the dots under them: offers, onboarding tips, featured cards. It takes its slides as data (`items` with `itemKey`) and renders each with the `children(item, index)` snippet; it binds `activeSlide`, reports `onChange(slideIndex)` with the bare index, can `autoPlay` every 6 seconds (held while the pointer or focus is inside, off under reduced motion), and names its slides and dots through localizable label props.

## Important Constraints

- Slides are data: `items` and `itemKey` are required, and `children` is a snippet `(item, index)` that renders one slide. There is no CarouselItem
- `activeSlide` is a zero-based index, bindable; there is no `defaultActiveSlide`. `onChange` gets the bare index
- Every slide is full width; slides not on show are `inert`. There is no `visibleItems` and no previous/next buttons
- The dots show only with more than one slide; `showIndicators={false}` hides them
- The track is a native scroll-snap row: touch, wheel and keyboard scrolling are the platform's
- Carousel has no style props; size it with `class` on it or its parent

## Props

```typescript
interface CarouselProps<T> {
  /** One slide per item. */
  items: readonly T[];
  /** Keys the slides and dots. */
  itemKey: (item: T) => string;
  /** The slide on show, zero-based: initial, bound, or host-driven (it scrolls there). @default 0 */
  activeSlide?: number;
  /** The slide on show changed. */
  onChange?: (slideIndex: number) => void;
  /** Moves to the next slide every 6 seconds, wrapping; held while the pointer or focus is inside, never under reduced motion. @default false */
  autoPlay?: boolean;
  /** The dots under the slides, each going to its slide. @default true */
  showIndicators?: boolean;
  /** Names the carousel. */
  accessibilityLabel?: string;
  /** Localized; names each slide. @default (position, count) => `${position} of ${count}` */
  slideLabel?: (position: number, count: number) => string;
  /** Localized; names each dot. @default (position) => `Slide ${position}` */
  indicatorLabel?: (position: number) => string;
  /** Localized; names the row of dots. @default 'Slides' */
  indicatorsAccessibilityLabel?: string;
  testID?: string;
  /** Placement and width only. */
  class?: string;
  /** Renders one slide. */
  children: Snippet<[T, number]>;
}
```

## Guidelines

- Use Carousel for a few promotional or explanatory slides of equal weight; don't hide content the user must see in a later slide.
- Give it an `accessibilityLabel` that says what the slides are ("Offers").
- Localize `slideLabel`, `indicatorLabel` and `indicatorsAccessibilityLabel` for non-English apps.
- Use `autoPlay` only for short promotional content.
- Bind `activeSlide` to drive it from your own controls or to read where the user is.

## Examples

### Offers

```svelte
<script lang="ts">
  import { Card, Carousel, Text } from '@razorpay/blade-svelte/components';

  const offers = [
    { id: 'hdfc', title: '10% off with HDFC cards', note: 'Up to ₹500 off.' },
    { id: 'emi', title: 'No-cost EMI', note: 'On 3 and 6 month plans.' },
    { id: 'upi', title: 'Cashback on UPI', note: 'Credited in 48 hours.' },
  ];
</script>

<Carousel items={offers} itemKey={(offer) => offer.id} accessibilityLabel="Offers" class="w-80 max-w-full">
  {#snippet children(offer)}
    <div class="p-blade-1">
      <Card variant="secondary">
        <Text weight="semibold">{offer.title}</Text>
        <Text size="small" color="muted">{offer.note}</Text>
      </Card>
    </div>
  {/snippet}
</Carousel>
```

### Bound, autoplaying, with localized labels

```svelte
<script lang="ts">
  import { Button, Carousel, Heading, Text } from '@razorpay/blade-svelte/components';

  const tips = [
    { id: 'links', title: 'Payment Links', body: 'Share a link and get paid on any app.' },
    { id: 'pages', title: 'Payment Pages', body: 'A store page in minutes.' },
    { id: 'qr', title: 'QR codes', body: 'Accept UPI at your counter.' },
  ];

  let activeSlide = $state(0);
</script>

<div class="flex flex-col gap-blade-3">
  <Carousel
    items={tips}
    itemKey={(tip) => tip.id}
    bind:activeSlide
    autoPlay
    accessibilityLabel="Getting started"
    slideLabel={(position, count) => `Tip ${position} of ${count}`}
    indicatorLabel={(position) => `Go to tip ${position}`}
    indicatorsAccessibilityLabel="Tips"
    onChange={(index) => console.log('Tip', index)}
  >
    {#snippet children(tip, index)}
      <div class="flex flex-col gap-blade-2 rounded-medium bg-surface-gray-moderate p-blade-5">
        <Text size="small" color="muted">{index + 1} / {tips.length}</Text>
        <Heading size="small">{tip.title}</Heading>
        <Text>{tip.body}</Text>
      </div>
    {/snippet}
  </Carousel>
  <Button variant="secondary" size="small" class="self-start" onClick={() => (activeSlide = 0)}>Back to the first tip</Button>
</div>
```
