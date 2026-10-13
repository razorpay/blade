<script lang="ts">
  import { Code, Text, type CodeStyleProps } from '../../index';

  interface Props {
    args: { size?: CodeStyleProps['size']; weight?: CodeStyleProps['weight']; isHighlighted?: boolean; content?: string };
  }

  let { args }: Props = $props();
</script>

<Text>
  Set
  {#if args.isHighlighted === false}
    <Code size={args.size} weight={args.weight} isHighlighted={false}>{args.content}</Code>
  {:else}
    <Code size={args.size} weight={args.weight}>{args.content}</Code>
  {/if}
  in your environment before the build.
</Text>
