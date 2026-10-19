<script lang="ts">
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { resolveSkeleton, type SkeletonBehaviourProps } from './styles';

  let { testID, class: className = '', ...rest }: SkeletonBehaviourProps = $props();

  const analytics = $derived(analyticsAttributes(rest));
</script>

<span
  class={cx(resolveSkeleton(), className)}
  aria-hidden="true"
  data-testid={testID}
  {...analytics}
></span>
