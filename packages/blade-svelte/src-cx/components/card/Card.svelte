<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { resolveCard, type CardStyleProps } from './styles';

  type Props = CardStyleProps & {
    /**
     * Makes the card clickable: a button laid over it, so links and buttons
     * inside the card stay usable.
     */
    onClick?: (event: MouseEvent) => void;
    /** Makes the card a link, laid over it the same way. */
    href?: string;
    target?: string;
    /** @default 'noreferrer noopener' with `target="_blank"` */
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
    /** Blade's CardHeader: over a hairline, 12px either side of it. */
    header?: Snippet;
    /** Blade's CardFooter: under a hairline, 12px either side of it. */
    footer?: Snippet;
    /** The body, between them. */
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
    header,
    footer,
    children,
    ...styleProps
  }: Props = $props();

  const selected = $derived(isSelected && !isDisabled);
  const classes = $derived(resolveCard(styleProps, selected));
  const linkRel = $derived(
    rel ?? (target === '_blank' ? 'noreferrer noopener' : undefined)
  );
</script>

<svelte:element
  this={as ?? 'div'}
  class={cx(
    classes.root,
    classes.ring[selected ? 'selected' : 'none'],
    isDisabled && classes.disabled,
    className
  )}
  role={!as && accessibilityLabel && !href && !onClick ? 'group' : undefined}
  aria-label={as || (!href && !onClick) ? accessibilityLabel : undefined}
  aria-disabled={isDisabled ? 'true' : undefined}
  data-testid={testID}
>
  <div class={classes.surface}>
    {#if !isDisabled && href}
      <a
        {href}
        {target}
        rel={linkRel}
        class={classes.overlay}
        aria-label={accessibilityLabel}
        data-card-overlay
        onclick={(event) => onClick?.(event)}
      ></a>
    {:else if !isDisabled && onClick}
      <button
        type="button"
        class={classes.overlay}
        aria-label={accessibilityLabel}
        aria-pressed={isSelected}
        data-card-overlay
        onclick={(event) => onClick(event)}
      ></button>
    {/if}
    <div class={classes.content}>
      {#if header}
        <div class={classes.header}>{@render header()}</div>
      {/if}
      {@render children?.()}
      {#if footer}
        <div class={classes.footer}>{@render footer()}</div>
      {/if}
    </div>
  </div>
</svelte:element>
