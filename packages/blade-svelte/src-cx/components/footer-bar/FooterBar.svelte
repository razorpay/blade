<script lang="ts">
  import { cx } from '../../cx';
  import {
    type FooterBarBehaviourProps,
    resolveFooterBar,
    type FooterBarStyleProps,
  } from './styles';

  type Props = FooterBarBehaviourProps & FooterBarStyleProps;

  let {
    testID,
    class: className = '',
    summary,
    children,
    ...styleProps
  }: Props = $props();
</script>

<footer
  class={cx(resolveFooterBar(styleProps).root, className)}
  data-testid={testID}
>
  {#if summary}
    <div class={resolveFooterBar(styleProps).summary}>
      {@render summary()}
    </div>
  {/if}
  {@render children()}
</footer>
