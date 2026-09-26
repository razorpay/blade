<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { resolveCard, type CardStyleProps } from './styles';

  // The sections are padding and hairlines only; what goes in them is the
  // caller's. Raw `children` skip them all and own their box, as a modal's do.
  type Props = CardStyleProps & {
    /**
     * Makes the whole card one button. Its content must then hold no control
     * of its own — a button inside a button is not valid.
     */
    onPress?: (event: MouseEvent) => void;
    isDisabled?: boolean;
    /** Names the card: a `group`, or the button's name. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** The padded top section, a hairline under it. */
    header?: Snippet;
    /** The padded middle section. Ignored when `children` is given. */
    body?: Snippet;
    /** The padded bottom section, a hairline over it. */
    footer?: Snippet;
    /** Raw content: no section, no padding — the content owns its box. */
    children?: Snippet;
  };

  let {
    onPress,
    isDisabled = false,
    accessibilityLabel,
    testID,
    class: className = '',
    header,
    body,
    footer,
    children,
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveCard(styleProps));
</script>

<!-- Spans, so the sections are valid inside the pressable card's button. -->
{#snippet sections()}
  {#if header}
    <span class={classes.header}>{@render header()}</span>
  {/if}
  {#if children}
    {@render children()}
  {:else if body}
    <span class={classes.body}>{@render body()}</span>
  {/if}
  {#if footer}
    <span class={classes.footer}>{@render footer()}</span>
  {/if}
{/snippet}

{#if onPress}
  <button
    type="button"
    class={cx(classes.root, classes.pressable, className)}
    disabled={isDisabled}
    aria-label={accessibilityLabel}
    data-testid={testID}
    onclick={(event) => {
      // The platform drops clicks on a disabled button; a synthetic one is not.
      if (!isDisabled) {
        onPress(event);
      }
    }}
  >
    {@render sections()}
  </button>
{:else}
  <div
    class={cx(classes.root, className)}
    role={accessibilityLabel ? 'group' : undefined}
    aria-label={accessibilityLabel}
    data-testid={testID}
  >
    {@render sections()}
  </div>
{/if}
