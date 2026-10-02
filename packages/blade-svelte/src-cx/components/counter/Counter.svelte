<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { resolveCounter, type CounterStyleProps } from './styles';

  interface Props extends CounterStyleProps {
    value: number;
    /** Above it, the counter reads `max+`. */
    max?: number;
    testID?: string;
    class?: string;
  }

  let { value, max, testID, class: className = '', ...styleProps }: Props = $props();

  const style = useComponentDefaults('Counter', () => styleProps);
  const classes = $derived(resolveCounter(style.current));
  const content = $derived(max && value > max ? `${max}+` : `${value}`);
</script>

<span class={cx(classes.root, className)} data-testid={testID}>
  <span class={classes.pill}>
    <span class={cx(classes.content, value > 9 && classes.wide)}>
      <span class={classes.text}>{content}</span>
    </span>
  </span>
</span>
