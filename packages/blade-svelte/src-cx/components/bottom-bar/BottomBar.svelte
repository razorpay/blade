<script lang="ts">
  import { cx } from '../../cx';
  import { type BottomBarBehaviourProps, resolveBottomBar } from './styles';

  let { testID, class: className = '', children }: BottomBarBehaviourProps = $props();

  const classes = resolveBottomBar();
</script>

<!-- Only the surface: where it sits (fixed, sticky, in the flow) is the
     consumer's `class`. -->
<div class={cx(classes.root, className)} data-testid={testID}>
  {@render children()}
</div>
