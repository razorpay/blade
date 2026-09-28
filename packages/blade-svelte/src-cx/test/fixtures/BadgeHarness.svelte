<script lang="ts">
  import { Badge } from '../../components/badge';
  import type { BadgeStyleProps } from '../../components/badge';
  import { check } from '../../components/icons';

  interface Props extends BadgeStyleProps {
    label?: string;
    withIcon?: boolean;
    class?: string;
  }

  let { label = 'Paid', withIcon = false, class: className, ...style }: Props = $props();
</script>

<Badge {...style} icon={withIcon ? check : undefined} testID="badge" class={className}>
  {label}
</Badge>
