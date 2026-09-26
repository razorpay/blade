<script lang="ts">
  import { Divider, Text, type DividerStyleProps } from '../../index';

  interface Props {
    args: DividerStyleProps;
  }

  let { args }: Props = $props();
</script>

<div
  class={args.orientation === 'vertical'
    ? 'flex h-10 max-w-96 items-center gap-3'
    : 'grid max-w-96 gap-3'}
>
  <Text size="small">Before</Text>
  <Divider orientation={args.orientation} line={args.line} />
  <Text size="small">After</Text>
</div>
