<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { IconSource } from '../../runes/icon/source';
  import { isRoutableClick, linkRel } from '../../runes/link/link';
  import { getAdapters } from '../../adapters';
  import { cx } from '../../cx';
  import Icon from '../icon/Icon.svelte';
  import { resolveLink, type LinkStyleProps } from './styles';

  interface BehaviourProps {
    /** Where it goes. A Link always goes somewhere: to act, use a Button. */
    href: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
    /** `noopener noreferrer` is added for `_blank`. */
    rel?: string;
    /** Saves the target instead of opening it; a string names the file. */
    download?: boolean | string;
    icon?: IconSource;
    iconPosition?: 'leading' | 'trailing';
    /** Before navigation; `event.preventDefault()` cancels it. */
    onClick?: (event: MouseEvent) => void;
    isDisabled?: boolean;
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    children: Snippet;
  }

  type Props = BehaviourProps & LinkStyleProps;

  let {
    href,
    target,
    rel,
    download,
    icon,
    iconPosition = 'leading',
    onClick,
    isDisabled = false,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const adapters = getAdapters();
  const classes = $derived(resolveLink(styleProps));

  function handleClick(event: MouseEvent) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    // An app router takes plain clicks on internal links; everything else
    // (new tab, download, another origin) stays the browser's.
    if (
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

<!-- A disabled anchor is one without an href, announced as a disabled link. -->
<a
  href={isDisabled ? undefined : href}
  target={isDisabled ? undefined : target}
  rel={linkRel(target, rel)}
  download={isDisabled ? undefined : download}
  role={isDisabled ? 'link' : undefined}
  aria-disabled={isDisabled ? 'true' : undefined}
  aria-label={accessibilityLabel}
  class={cx(classes.root, isDisabled && classes.disabled, className)}
  data-testid={testID}
  onclick={handleClick}
>
  {@render glyph('leading')}{@render children()}{@render glyph('trailing')}
</a>
