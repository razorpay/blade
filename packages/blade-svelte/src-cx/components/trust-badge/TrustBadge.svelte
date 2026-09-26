<script lang="ts">
  import Icon from '../icon/Icon.svelte';
  import { cx } from '../../cx';
  // Not in `icons`: that set is currentColor-only, and a brand mark keeps
  // its own colours whatever the theme.
  import razorpayTrust from './razorpay-trust.svg?raw';
  import {
    type TrustBadgeBehaviourProps,
    resolveTrustBadge,
    type TrustBadgeStyleProps,
  } from './styles';

  type Props = TrustBadgeBehaviourProps & TrustBadgeStyleProps;

  let { label, testID, class: className = '', ...styleProps }: Props = $props();
</script>

<!-- Alone, the shield is an image named by the label; beside it, decoration. -->
<span
  class={cx(resolveTrustBadge(styleProps).root, className)}
  data-testid={testID}
>
  <Icon
    source={razorpayTrust}
    size="medium"
    accessibilityLabel={styleProps.variant === 'icon-only' ? label : undefined}
  />
  {#if styleProps.variant !== 'icon-only'}
    <span class={resolveTrustBadge(styleProps).label}>{label}</span>
  {/if}
</span>
