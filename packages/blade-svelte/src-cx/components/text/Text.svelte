<script lang="ts">
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
</script>

<svelte:element
  this={as}
  class={cx(resolveText(styleProps), className)}
  data-testid={testID}
>
  {@render children()}
</svelte:element>
