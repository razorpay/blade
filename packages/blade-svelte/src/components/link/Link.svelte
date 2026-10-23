<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { IconSource } from '../../runes/icon/source';
  import { createLink } from '../../runes/link/link';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import Icon from '../icon/Icon.svelte';
  import { resolveLink, type LinkStyleProps } from './styles';

  /** An anchor: it goes somewhere. */
  interface AnchorProps {
    /** @default 'anchor' */
    variant?: 'anchor';
    /** Where it goes. */
    href: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
    /** `noopener noreferrer` is added for `_blank`. */
    rel?: string;
    /** Saves the target instead of opening it; a string names the file. */
    download?: boolean | string;
  }

  /** Blade's BaseLink `button`: it acts, and reads as a link. */
  interface ButtonProps {
    variant: 'button';
    href?: undefined;
    target?: undefined;
    rel?: undefined;
    download?: undefined;
  }

  interface CommonProps {
    /** Before the text (Figma's leading icon); alone, it is the link and needs a name. */
    icon?: IconSource;
    /** After the text (Figma's trailing icon); both may show. */
    trailingIcon?: IconSource;
    /** Before navigation; `event.preventDefault()` cancels it. */
    onClick?: (event: MouseEvent) => void;
    isDisabled?: boolean;
    /** Names the link; required when it is an icon alone. */
    accessibilityLabel?: string;
    /** A tooltip on hover: the element's `title`. */
    htmlTitle?: string;
    testID?: string;
    class?: string;
    /** The text; omit for an icon-only link (then name it). */
    children?: Snippet;
  }

  type Props = (AnchorProps | ButtonProps) & CommonProps & LinkStyleProps & AnalyticsAttributes;

  let {
    variant = 'anchor',
    href,
    target,
    rel,
    download,
    icon,
    trailingIcon,
    onClick,
    isDisabled = false,
    accessibilityLabel,
    htmlTitle,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  // The rest is the style props, and the analytics attributes.
  const style = useComponentDefaults('Link', () => rest);
  const analytics = $derived(analyticsAttributes(rest));

  const classes = $derived(resolveLink(style.current));
  // An app router takes plain clicks on internal links; everything else
  // (new tab, download, another origin) stays the browser's.
  const link = createLink(() => ({ href, target, rel, download, isDisabled }));

  function handleClick(event: MouseEvent) {
    link.click(event, onClick);
  }
</script>

{#snippet glyph(side: 'leading' | 'trailing')}
  {@const source = side === 'leading' ? icon : trailingIcon}
  {#if source}
    <span class={classes.iconSlot[side]}>
      <Icon {source} {...classes.icon} />
    </span>
  {/if}
{/snippet}

{#if variant === 'button'}
  <button
    type="button"
    disabled={isDisabled}
    aria-label={accessibilityLabel}
    title={htmlTitle}
    class={cx(classes.root, classes.button, isDisabled && classes.disabled, className)}
    data-testid={testID}
    {...analytics}
    onclick={handleClick}
  >
    {@render glyph('leading')}{@render children?.()}{@render glyph('trailing')}
  </button>
{:else}
<!-- A disabled anchor is one without an href, announced as a disabled link. -->
<a
  href={isDisabled ? undefined : href}
  target={isDisabled ? undefined : target}
  rel={link.rel}
  download={isDisabled ? undefined : download}
  role={isDisabled ? 'link' : undefined}
  aria-disabled={isDisabled ? 'true' : undefined}
  aria-label={accessibilityLabel}
  title={htmlTitle}
  class={cx(classes.root, classes.anchor, isDisabled && classes.disabled, className)}
  data-testid={testID}
  {...analytics}
  onclick={handleClick}
>
  {@render glyph('leading')}{@render children?.()}{@render glyph('trailing')}
</a>
{/if}
