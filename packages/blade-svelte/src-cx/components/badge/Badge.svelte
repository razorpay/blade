<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { titleWhenTruncated } from '../../runes/dom/truncation';
  import Icon from '../icon/Icon.svelte';
  import {
    type BadgeBehaviourProps,
    resolveBadge,
    type BadgeStyleProps,
  } from './styles';

  type Props = BadgeBehaviourProps & BadgeStyleProps;

  let {
    icon,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Badge', () => styleProps);

  const classes = $derived(resolveBadge(style.current));
</script>

<span class={cx(classes.root, className)} data-testid={testID}>
  {#if icon}
    <span class={classes.icon}>
      <Icon source={icon} size={classes.iconSize} />
    </span>
  {/if}
  <span class={classes.text} {@attach titleWhenTruncated}>{@render children()}</span>
</span>
