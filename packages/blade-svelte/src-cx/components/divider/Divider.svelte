<script lang="ts">
  import { cx } from '../../cx';
  import {
    type DividerBehaviourProps,
    resolveDivider,
    type DividerStyleProps,
  } from './styles';

  type Props = DividerBehaviourProps & DividerStyleProps;

  let { testID, class: className = '', ...styleProps }: Props = $props();
</script>

<hr
  class={cx(resolveDivider(styleProps), className)}
  aria-orientation={styleProps.orientation === 'vertical'
    ? 'vertical'
    : undefined}
  data-testid={testID}
/>
