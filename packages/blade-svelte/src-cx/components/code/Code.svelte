<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { type CodeBehaviourProps, resolveCode, type CodeStyleProps } from '../shared/typography';

  type Props = CodeBehaviourProps & CodeStyleProps;

  let { testID, class: className = '', children, ...styleProps }: Props = $props();

  const style = useComponentDefaults('Code', () => styleProps as CodeStyleProps);
  const classes = $derived(resolveCode(style.current as CodeStyleProps));
</script>

<!-- Inline: sits in a line of Text. -->
<span class={cx(classes.root, className)} data-testid={testID}>
  <code class={classes.code}>{@render children()}</code>
</span>
