<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import {
    type DisplayBehaviourProps,
    resolveDisplay,
    type DisplayStyleProps,
  } from '../shared/typography';

  type Props = DisplayBehaviourProps & DisplayStyleProps;

  let {
    as = 'h1',
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('Display', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
</script>

<svelte:element
  this={as}
  class={cx(resolveDisplay(style.current), className)}
  data-testid={testID}
  {...analytics}
>
  {@render children()}
</svelte:element>
