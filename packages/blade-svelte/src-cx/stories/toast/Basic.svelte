<script lang="ts">
  import {
    Button,
    LayerHost,
    showToast,
    Text,
    ToastStack,
    type ToastStackStyleProps,
    type ToastStyleProps,
  } from '../../index';

  interface Props {
    args: ToastStyleProps & ToastStackStyleProps & { duration?: number };
  }

  let { args }: Props = $props();

  let count = $state(0);
  let last = $state('—');

  function show() {
    count += 1;
    showToast({
      content: `Card ending 4${count}21 removed`,
      color: args.color,
      duration: args.duration,
      action: { text: 'Undo', onClick: () => (last = 'undone') },
    })
      .dismissed.then((reason) => {
        last = reason;
      })
      .catch(() => undefined);
  }
</script>

<div
  class="relative flex h-80 w-full max-w-96 flex-col items-start gap-3 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted p-4"
>
  <Button type="button" onClick={show}>Show a toast</Button>
  <Text size="small" color="muted">last exit: {last}</Text>
  <ToastStack placement={args.placement} accessibilityLabel="Notifications" />
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
