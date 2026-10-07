<script lang="ts">
  import { Display, type DisplayStyleProps } from '../../index';

  interface Props {
    args: DisplayStyleProps & { content?: string };
  }

  let { args }: Props = $props();
</script>

<Display
  size={args.size}
  weight={args.weight}
  color={args.color}
  textAlign={args.textAlign}
>
  {args.content}
</Display>
