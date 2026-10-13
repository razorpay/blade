<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import {
    type DividerBehaviourProps,
    resolveDivider,
    type DividerStyleProps,
  } from './styles';

  type Props = DividerBehaviourProps & DividerStyleProps;

  let { testID, class: className = '', ...styleProps }: Props = $props();

  const style = useComponentDefaults('Divider', () => styleProps);
</script>

<hr
  class={cx(resolveDivider(style.current), className)}
  aria-orientation={style.current.orientation === 'vertical'
    ? 'vertical'
    : undefined}
  data-testid={testID}
/>
