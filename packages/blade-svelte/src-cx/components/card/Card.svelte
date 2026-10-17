<script lang="ts">
  import { useComponentDefaults } from '../defaults';
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
    /**
     * Blade's CardHeaderLeading title, first in the header: a string or a
     * snippet. Names the card when there is no `accessibilityLabel`.
     */
    title?: string | Snippet;
    /** One muted line under the title. */
    subtitle?: string | Snippet;
    /**
     * Blade's CardHeader: over a hairline, 12px either side of it. Its
     * items, laid in a row 16px apart and centred, the ends pushed apart:
     * it receives the drawn title and subtitle as snippets (`title`,
     * `subtitle`; each renders nothing when its prop is unset) to place
     * among a prefix, a suffix, a trailing action. Without `header` the two
     * render on their own, stacked.
     */
    header?: Snippet<[{ title: Snippet; subtitle: Snippet }]>;
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
    title,
    subtitle,
    header,
    footer,
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Card', () => styleProps);

  const uid = $props.id();
  const titleId = `${uid}-title`;
  // The title names the card, or its overlay, when no label is given.
  const labelledBy = $derived(!accessibilityLabel && title ? titleId : undefined);
  const isNamed = $derived(Boolean(accessibilityLabel || title));

  const selected = $derived(isSelected && !isDisabled);
  const classes = $derived(resolveCard(style.current, selected));
  const linkRel = $derived(
    rel ?? (target === '_blank' ? 'noreferrer noopener' : undefined)
  );
</script>

{#snippet text(slot: string | Snippet, className: string, id?: string)}
  {#if typeof slot === 'string'}
    <p {id} class={className}>{slot}</p>
  {:else}
    <div {id} class={className}>{@render slot()}</div>
  {/if}
{/snippet}

<!-- The drawn title and subtitle: on their own, or handed to `header`. -->
{#snippet titleSlot()}
  {#if title}
    {@render text(title, classes.title, titleId)}
  {/if}
{/snippet}

{#snippet subtitleSlot()}
  {#if subtitle}
    {@render text(subtitle, classes.subtitle)}
  {/if}
{/snippet}

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
>
  <div class={classes.surface}>
    {#if !isDisabled && href}
      <a
        {href}
        {target}
        rel={linkRel}
        class={classes.overlay}
        aria-label={accessibilityLabel}
        aria-labelledby={labelledBy}
        data-card-overlay
        onclick={(event) => onClick?.(event)}
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
      {#if header}
        <div class={classes.header}>
          {@render header({ title: titleSlot, subtitle: subtitleSlot })}
        </div>
      {:else if title || subtitle}
        <div class={classes.header}>
          <div class={classes.titleBlock}>
            {@render titleSlot()}
            {@render subtitleSlot()}
          </div>
        </div>
      {/if}
      {@render children?.()}
      {#if footer}
        <div class={classes.footer}>{@render footer()}</div>
      {/if}
    </div>
  </div>
</svelte:element>
