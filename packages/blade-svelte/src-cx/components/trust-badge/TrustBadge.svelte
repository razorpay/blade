<script lang="ts">
  import Image from '../image/Image.svelte';
  import { cx } from '../../cx';
  // An Image, not an Icon: icons are single-colour font glyphs, and a brand
  // mark keeps its own colours whatever the theme.
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
  <Image
    src={razorpayTrust}
    alt={styleProps.variant === 'icon-only' ? label : ''}
    class="w-4 h-4"
  />
  {#if styleProps.variant !== 'icon-only'}
    <span class={resolveTrustBadge(styleProps).label}>{label}</span>
  {/if}
</span>
