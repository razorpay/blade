<script lang="ts">
  import {
    Alert,
    Button,
    icons,
    Link,
    type AlertStyleProps,
  } from '../../index';

  interface Props {
    args: AlertStyleProps & {
      title?: string;
      content?: string;
      closeLabel?: string;
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(true);
</script>

<div class="flex max-w-96 flex-col items-start gap-3">
  <Alert
    {isOpen}
    color={args.color}
    title={args.title || undefined}
    icon={icons.info}
    closeLabel={args.closeLabel || undefined}
    onDismiss={() => (isOpen = false)}
  >
    {args.content}
    {#snippet actions()}
      <Link href="#banks" color="neutral">See other banks</Link>
    {/snippet}
  </Alert>
  {#if !isOpen}
    <Button type="button" size="small" onClick={() => (isOpen = true)}>
      Show it again
    </Button>
  {/if}
</div>
