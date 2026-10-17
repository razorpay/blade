<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
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
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Display', () => styleProps);
</script>

<svelte:element
  this={as}
  class={cx(resolveDisplay(style.current), className)}
  data-testid={testID}
>
  {@render children()}
</svelte:element>
