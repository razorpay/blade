<script lang="ts">
  import { Link, type LinkStyleProps } from '../../index';
  import { ExternalLinkIcon, InfoIcon } from '../../icons';

  interface Props {
    args: LinkStyleProps & {
      withIcon?: boolean;
      withTrailingIcon?: boolean;
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
  icon={args.withIcon ? InfoIcon : undefined}
  trailingIcon={args.withTrailingIcon ? ExternalLinkIcon : undefined}
  isDisabled={args.isDisabled}
>
  Contact support
</Link>
