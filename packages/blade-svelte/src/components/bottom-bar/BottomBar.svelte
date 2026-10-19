<script lang="ts">
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { type BottomBarBehaviourProps, resolveBottomBar } from './styles';

  let {
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...rest
  }: BottomBarBehaviourProps = $props();

  const classes = resolveBottomBar();
  const analytics = $derived(analyticsAttributes(rest));
</script>

<!-- Only the surface: where it sits (fixed, sticky, in the flow) is the
     consumer's `class`. -->
<div
  class={cx(classes.root, className)}
  role="group"
  aria-label={accessibilityLabel}
  data-testid={testID}
  {...analytics}
>
  {@render children()}
</div>
