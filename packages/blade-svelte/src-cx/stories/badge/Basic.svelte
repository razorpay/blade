<script lang="ts">
  import { Badge, type BadgeStyleProps } from '../../index';

  interface Props {
    args: BadgeStyleProps & { content?: string };
  }

  let { args }: Props = $props();
</script>

<Badge color={args.color} emphasis={args.emphasis} size={args.size}>
  {args.content}
</Badge>
