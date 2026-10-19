<script lang="ts">
  import { Button, ButtonGroup, type ButtonGroupStyleProps } from '../../index';

  interface Props {
    args: ButtonGroupStyleProps & { isDisabled?: boolean };
  }

  let { args }: Props = $props();
</script>

<ButtonGroup
  variant={args.variant}
  color={args.color}
  size={args.size}
  isDisabled={args.isDisabled}
>
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>
