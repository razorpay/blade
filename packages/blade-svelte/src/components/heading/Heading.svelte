<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
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
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('Heading', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
</script>

<svelte:element
  this={as}
  class={cx(resolveHeading(style.current), className)}
  data-testid={testID}
  {...analytics}
>
  {@render children()}
</svelte:element>
