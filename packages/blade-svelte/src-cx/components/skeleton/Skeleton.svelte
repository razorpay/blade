<script lang="ts">
  import { cx } from '../../cx';
  import { resolveSkeleton, type SkeletonBehaviourProps } from './styles';

  let { testID, class: className = '' }: SkeletonBehaviourProps = $props();
</script>

<span
  class={cx(resolveSkeleton(), className)}
  aria-hidden="true"
  data-testid={testID}
></span>
