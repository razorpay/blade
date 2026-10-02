<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import {
    type TextBehaviourProps,
    resolveText,
    type TextStyleProps,
  } from '../shared/typography';

  type Props = TextBehaviourProps & TextStyleProps;

  let {
    as = 'p',
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Text', () => styleProps);
</script>

<svelte:element
  this={as}
  class={cx(resolveText(style.current), className)}
  data-testid={testID}
>
  {@render children()}
</svelte:element>
