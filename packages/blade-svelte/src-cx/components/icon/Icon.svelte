<script lang="ts">
  import { cx } from '../../cx';
  import { isIconMarkup } from '../../runes/icon/source';
  import {
    resolveIcon,
    type IconBehaviourProps,
    type IconStyleProps,
  } from './styles';

  type Props = IconBehaviourProps & IconStyleProps;

  let {
    source,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveIcon(styleProps));
</script>

<span
  class={cx(classes.root, className)}
  role={accessibilityLabel ? 'img' : undefined}
  aria-label={accessibilityLabel}
  aria-hidden={accessibilityLabel ? undefined : 'true'}
  data-testid={testID}
>
  {#if isIconMarkup(source)}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- a bundled ?raw SVG asset, never user content -->
    {@html source}
  {:else}
    <img src={source} alt="" />
  {/if}
</span>
