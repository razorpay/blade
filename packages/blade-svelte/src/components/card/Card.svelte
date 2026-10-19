<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { createLink } from '../../runes/link/link';
  import { createHeaderRegistry } from '../../runes/base/header-registry.svelte';
  import { provideCardHeaders } from '../../runes/card/header.svelte';
  import { resolveCard, type CardStyleProps } from './styles';

  type Props = CardStyleProps & Partial<AnalyticsAttributes> & {
    /**
     * Makes the card clickable: a button laid over it, so links and buttons
     * inside the card stay usable.
     */
    onClick?: (event: MouseEvent) => void;
    /** Makes the card a link, laid over it the same way; routed as Link is (`adapters.navigate`). */
    href?: string;
    target?: string;
    /** `noopener noreferrer` is added for `target="_blank"`. */
    rel?: string;
    /** Blade's 2px primary ring; the surface drops its rim. @default false */
    isSelected?: boolean;
    /** No overlay, no ring; beats `isSelected`. @default false */
    isDisabled?: boolean;
    /**
     * `label`: the card is a `<label>`, for a visually hidden radio or
     * checkbox inside it whose checked state drives `isSelected`.
     */
    as?: 'label';
    /** Names the card, or its overlay when it is clickable or a link. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /**
     * The content: CardHeader, CardBody, CardFooter (or parts built from
     * their classes), or anything. A CardHeader's title names the card.
     */
    children?: Snippet;
  };

  let {
    onClick,
    href,
    target,
    rel,
    isSelected = false,
    isDisabled = false,
    as,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('Card', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
  const link = createLink(() => ({ href, target, rel, isDisabled }));

  const uid = $props.id();
  // A CardHeader inside registers: its title names the card, or its
  // overlay, when no label is given.
  const headers = createHeaderRegistry(uid);
  provideCardHeaders(headers);
  const labelledBy = $derived(
    !accessibilityLabel && headers.hasTitle ? headers.titleId : undefined
  );
  const isNamed = $derived(Boolean(accessibilityLabel || headers.hasTitle));

  const selected = $derived(isSelected && !isDisabled);
  const classes = $derived(resolveCard(style.current, selected));
</script>

<svelte:element
  this={as ?? 'div'}
  class={cx(
    classes.root,
    classes.ring[selected ? 'selected' : 'none'],
    isDisabled && classes.disabled,
    className
  )}
  role={!as && isNamed && !href && !onClick ? 'group' : undefined}
  aria-label={as || (!href && !onClick) ? accessibilityLabel : undefined}
  aria-labelledby={as || (!href && !onClick) ? labelledBy : undefined}
  aria-disabled={isDisabled ? 'true' : undefined}
  data-testid={testID}
  {...analytics}
>
  <div class={classes.surface}>
    {#if !isDisabled && href}
      <a
        {href}
        {target}
        rel={link.rel}
        class={classes.overlay}
        aria-label={accessibilityLabel}
        aria-labelledby={labelledBy}
        data-card-overlay
        onclick={(event) => link.click(event, onClick)}
      ></a>
    {:else if !isDisabled && onClick}
      <button
        type="button"
        class={classes.overlay}
        aria-label={accessibilityLabel}
        aria-labelledby={labelledBy}
        aria-pressed={isSelected}
        data-card-overlay
        onclick={(event) => onClick(event)}
      ></button>
    {/if}
    <div class={classes.content}>
      {@render children?.()}
    </div>
  </div>
</svelte:element>
