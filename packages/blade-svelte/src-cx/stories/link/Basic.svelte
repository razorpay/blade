<script lang="ts">
  import { icons, Link, type LinkStyleProps } from '../../index';

  interface Props {
    args: LinkStyleProps & {
      iconPosition?: 'leading' | 'trailing';
      withIcon?: boolean;
      isDisabled?: boolean;
      newTab?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<Link
  href="https://razorpay.com/support"
  target={args.newTab ? '_blank' : undefined}
  color={args.color}
  size={args.size}
  icon={args.withIcon ? icons.external : undefined}
  iconPosition={args.iconPosition}
  isDisabled={args.isDisabled}
>
  Contact support
</Link>
