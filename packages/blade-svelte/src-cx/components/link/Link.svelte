<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { IconSource } from '../../runes/icon/source';
  import { isRoutableClick, linkRel } from '../../runes/link/link';
  import { getAdapters } from '../../adapters';
  import { cx } from '../../cx';
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
    icon?: IconSource;
    iconPosition?: 'leading' | 'trailing';
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

  type Props = (AnchorProps | ButtonProps) & CommonProps & LinkStyleProps;

  let {
    variant = 'anchor',
    href,
    target,
    rel,
    download,
    icon,
    iconPosition = 'leading',
    onClick,
    isDisabled = false,
    accessibilityLabel,
    htmlTitle,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Link', () => styleProps);

  const adapters = getAdapters();
  const classes = $derived(resolveLink(style.current));

  function handleClick(event: MouseEvent) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    // An app router takes plain clicks on internal links; everything else
    // (new tab, download, another origin) stays the browser's.
    if (
      href !== undefined &&
      adapters.navigate &&
      download === undefined &&
      isRoutableClick(event, { href, target }) &&
      adapters.navigate(href, event)
    ) {
      event.preventDefault();
    }
  }
</script>

{#snippet glyph(side: 'leading' | 'trailing')}
  {#if icon && iconPosition === side}
    <span class={classes.iconSlot[side]}>
      <Icon source={icon} {...classes.icon} />
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
    onclick={handleClick}
  >
    {@render glyph('leading')}{@render children?.()}{@render glyph('trailing')}
  </button>
{:else}
<!-- A disabled anchor is one without an href, announced as a disabled link. -->
<a
  href={isDisabled ? undefined : href}
  target={isDisabled ? undefined : target}
  rel={linkRel(target, rel)}
  download={isDisabled ? undefined : download}
  role={isDisabled ? 'link' : undefined}
  aria-disabled={isDisabled ? 'true' : undefined}
  aria-label={accessibilityLabel}
  title={htmlTitle}
  class={cx(classes.root, classes.anchor, isDisabled && classes.disabled, className)}
  data-testid={testID}
  onclick={handleClick}
>
  {@render glyph('leading')}{@render children?.()}{@render glyph('trailing')}
</a>
{/if}
