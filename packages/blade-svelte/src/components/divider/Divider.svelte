<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import {
    type DividerBehaviourProps,
    resolveDivider,
    type DividerStyleProps,
  } from './styles';

  type Props = DividerBehaviourProps & DividerStyleProps;

  let { testID, class: className = '', ...rest }: Props = $props();

  const style = useComponentDefaults('Divider', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
</script>

<hr
  class={cx(resolveDivider(style.current), className)}
  aria-orientation={style.current.orientation === 'vertical'
    ? 'vertical'
    : undefined}
  data-testid={testID}
  {...analytics}
/>
