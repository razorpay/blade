<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import {
    type TextBehaviourProps,
    resolveText,
    resolveTruncation,
    type TextStyleProps,
  } from '../shared/typography';

  type Props = TextBehaviourProps & TextStyleProps;

  let {
    as = 'p',
    truncateAfterLines,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('Text', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
</script>

<svelte:element
  this={as}
  class={cx(resolveText(style.current), resolveTruncation(truncateAfterLines), className)}
  data-testid={testID}
  {...analytics}
>
  {@render children()}
</svelte:element>
