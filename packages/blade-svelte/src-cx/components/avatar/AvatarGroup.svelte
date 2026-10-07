<script lang="ts">
  import { cx } from '../../cx';
  import { createAvatarGroup, provideAvatarGroup } from '../../runes/avatar/group.svelte';
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
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('AvatarGroup', () => styleProps);
  const classes = $derived(resolveAvatarGroup(style.current));

  const group = createAvatarGroup<AvatarGroupShared>({
    maxCount: () => maxCount,
    shared: () => ({ size: style.current.size ?? 'medium', overlap: classes.overlap }),
  });
  provideAvatarGroup(group);
</script>

<div class={cx(classes.root, className)} role="group" aria-label={accessibilityLabel} data-testid={testID}>
  {@render children()}
  {#if group.overflow > 0}
    <span class={cx(classes.more.root, classes.overlap)} role="img" aria-label="{group.overflow} more">
      <span class={classes.more.face}>
        <span class={classes.more.text} aria-hidden="true">+{group.overflow}</span>
      </span>
    </span>
  {/if}
</div>
