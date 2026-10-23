<script lang="ts">
  import { imageUrl } from '../../runes/image/source';
  import { cx } from '../../cx';
  import { useComponentDefaults } from '../defaults';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  // An image, not an Icon: icons are single-colour font glyphs, and a brand
  // mark keeps its own colours whatever the theme.
  import razorpayTrust from './razorpay-trust.svg?raw';
  import {
    type TrustBadgeBehaviourProps,
    resolveTrustBadge,
    type TrustBadgeStyleProps,
  } from './styles';

  type Props = TrustBadgeBehaviourProps & TrustBadgeStyleProps;

  let { label, testID, class: className = '', ...rest }: Props = $props();

  const style = useComponentDefaults('TrustBadge', () => rest);
  const classes = $derived(resolveTrustBadge(style.current));
  const analytics = $derived(analyticsAttributes(rest));
  const isIconOnly = $derived(style.current.variant === 'icon-only');
</script>

<!-- Alone, the shield is an image named by the label; beside it, decoration. -->
<span class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  <img src={imageUrl(razorpayTrust)} alt={isIconOnly ? label : ''} class={classes.shield} />
  {#if !isIconOnly}
    <span class={classes.label}>{label}</span>
  {/if}
</span>
