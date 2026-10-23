<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { type CodeBehaviourProps, resolveCode, type CodeStyleProps } from '../shared/typography';

  type Props = CodeBehaviourProps & CodeStyleProps;

  let { testID, class: className = '', children, ...rest }: Props = $props();

  const style = useComponentDefaults('Code', () => rest as CodeStyleProps);
  const classes = $derived(resolveCode(style.current as CodeStyleProps));
  const analytics = $derived(analyticsAttributes(rest));
</script>

<!-- Inline: sits in a line of Text. -->
<span class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  <code class={classes.code}>{@render children()}</code>
</span>
