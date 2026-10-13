<script lang="ts">
  import { cx } from '../../cx';
  import {
    type ScreenBehaviourProps,
    resolveScreen,
    type ScreenStyleProps,
  } from './styles';

  type Props = ScreenBehaviourProps & ScreenStyleProps;

  let {
    isDisabled = false,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    footer,
    ...styleProps
  }: Props = $props();
</script>

<section
  class={cx(
    resolveScreen(styleProps).root,
    isDisabled && resolveScreen(styleProps).disabled,
    className
  )}
  aria-label={accessibilityLabel}
  inert={isDisabled}
  data-testid={testID}
>
  <div class={resolveScreen(styleProps).body}>
    {@render children()}
  </div>
  {@render footer?.()}
</section>
