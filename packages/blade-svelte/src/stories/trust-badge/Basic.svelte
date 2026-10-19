<script lang="ts">
  import { TrustBadge, type TrustBadgeStyleProps } from '../../index';

  interface Props {
    args: TrustBadgeStyleProps & { label?: string };
  }

  let { args }: Props = $props();
</script>

<TrustBadge
  variant={args.variant}
  label={args.label ?? 'Razorpay Trusted Business'}
/>
