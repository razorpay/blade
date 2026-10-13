<script lang="ts">
  import { Text, type TextStyleProps } from '../../index';

  interface Props {
    args: TextStyleProps & { content?: string };
  }

  let { args }: Props = $props();
</script>

<div class="max-w-96">
  <Text
    size={args.size}
    weight={args.weight}
    color={args.color}
    textAlign={args.textAlign}
    truncate={args.truncate}
  >
    {args.content}
  </Text>
</div>
