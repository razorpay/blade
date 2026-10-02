<script lang="ts">
  import { useComponentDefaults } from '../defaults';
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

  const style = useComponentDefaults('Heading', () => styleProps);
</script>

<svelte:element
  this={as}
  class={cx(resolveHeading(style.current), className)}
  data-testid={testID}
>
  {@render children()}
</svelte:element>
