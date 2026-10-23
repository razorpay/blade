<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { resolveCounter, type CounterStyleProps } from './styles';

  interface Props extends CounterStyleProps, Partial<AnalyticsAttributes> {
    value: number;
    /** Above it, the counter reads `max+`; `0` too. */
    max?: number;
    testID?: string;
    class?: string;
  }

  let { value, max, testID, class: className = '', ...rest }: Props = $props();

  const style = useComponentDefaults('Counter', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
  const classes = $derived(resolveCounter(style.current));
  const content = $derived(max !== undefined && value > max ? `${max}+` : `${value}`);
</script>

<span class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  <span class={classes.pill}>
    <span class={cx(classes.content, value > 9 && classes.wide)}>
      <span class={classes.text}>{content}</span>
    </span>
  </span>
</span>
