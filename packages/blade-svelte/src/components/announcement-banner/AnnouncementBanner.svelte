<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { titleWhenTruncated } from '../../runes/dom/truncation';
  import Icon from '../icon/Icon.svelte';
  import {
    type AnnouncementBannerBehaviourProps,
    resolveAnnouncementBanner,
    type AnnouncementBannerStyleProps,
  } from './styles';

  type Props = AnnouncementBannerBehaviourProps & AnnouncementBannerStyleProps;

  let {
    icon,
    accessibilityLabel = 'Announcement',
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('AnnouncementBanner', () => rest);
  const analytics = $derived(analyticsAttributes(rest));

  const classes = $derived(resolveAnnouncementBanner(style.current));
</script>

<div
  class={cx(classes.root, className)}
  role="region"
  aria-label={accessibilityLabel}
  data-testid={testID}
  {...analytics}
>
  {#if icon}
    <span class={classes.icon}>
      <Icon source={icon} size="medium" />
    </span>
  {/if}
  <p class={classes.text} {@attach titleWhenTruncated}>{@render children()}</p>
</div>
