<script lang="ts">
  import { cx } from '../../cx';
  import {
    type HeadingBehaviourProps,
    resolveHeading,
    type HeadingStyleProps,
  } from '../shared/typography';

  type Props = HeadingBehaviourProps & HeadingStyleProps;

  let {
    as = 'h2',
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();
</script>

<svelte:element
  this={as}
  class={cx(resolveHeading(styleProps), className)}
  data-testid={testID}
>
  {@render children()}
</svelte:element>
