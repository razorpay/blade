<script lang="ts">
  import { cx } from '../../cx';
  import {
    type BadgeBehaviourProps,
    resolveBadge,
    type BadgeStyleProps,
  } from './styles';

  type Props = BadgeBehaviourProps & BadgeStyleProps;

  let {
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();
</script>

<span class={cx(resolveBadge(styleProps), className)} data-testid={testID}>
  {@render children()}
</span>
