<script lang="ts">
  import { cx } from '../../cx';
  import { createAvatarGroup, provideAvatarGroup } from '../../runes/avatar/group.svelte';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { useComponentDefaults } from '../defaults';
  import {
    resolveAvatarGroup,
    type AvatarGroupBehaviourProps,
    type AvatarGroupShared,
    type AvatarGroupStyleProps,
  } from './styles';

  type Props = AvatarGroupBehaviourProps & AvatarGroupStyleProps;

  let {
    maxCount,
    accessibilityLabel,
    overflowLabel = (count) => `${count} more`,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('AvatarGroup', () => rest);
  const analytics = $derived(analyticsAttributes(rest));
  const classes = $derived(resolveAvatarGroup(style.current));

  const group = createAvatarGroup<AvatarGroupShared>({
    maxCount: () => maxCount,
    shared: () => ({ size: style.current.size ?? 'medium', overlap: classes.overlap }),
  });
  provideAvatarGroup(group);
</script>

<div
  class={cx(classes.root, className)}
  role="group"
  aria-label={accessibilityLabel}
  data-testid={testID}
  {...analytics}
>
  {@render children()}
  {#if group.overflow > 0}
    <span class={cx(classes.more.root, classes.overlap)} role="img" aria-label={overflowLabel(group.overflow)}>
      <span class={classes.more.face}>
        <span class={classes.more.text} aria-hidden="true">+{group.overflow}</span>
      </span>
    </span>
  {/if}
</div>
