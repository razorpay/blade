<script lang="ts">
  import { Badge, icons, type BadgeStyleProps } from '../../index';

  interface Props {
    args: BadgeStyleProps & { content?: string; withIcon?: boolean };
  }

  let { args }: Props = $props();
</script>

<Badge
  color={args.color}
  emphasis={args.emphasis}
  size={args.size}
  icon={args.withIcon ? icons.checkCircle : undefined}
>
  {args.content}
</Badge>
