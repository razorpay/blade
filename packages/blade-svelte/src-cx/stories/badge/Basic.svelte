<script lang="ts">
  import { Badge, type BadgeStyleProps } from '../../index';
  import { CheckCircleIcon } from '../../icons';

  interface Props {
    args: BadgeStyleProps & { content?: string; withIcon?: boolean };
  }

  let { args }: Props = $props();
</script>

<Badge
  color={args.color}
  emphasis={args.emphasis}
  size={args.size}
  icon={args.withIcon ? CheckCircleIcon : undefined}
>
  {args.content}
</Badge>
