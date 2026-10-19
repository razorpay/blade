<script lang="ts">
  import {
    BladeProvider,
    Button,
    createCancel,
    showToast,
    Text,
    ToastContainer,
    type ToastContainerStyleProps,
    type ToastStyleProps,
  } from '../../index';

  interface Props {
    args: ToastStyleProps & ToastContainerStyleProps & { duration?: number };
  }

  let { args }: Props = $props();

  let count = $state(0);
  let last = $state('—');

  // Undo takes a moment: the action shows busy until its promise settles,
  // then the toast goes (its `cancelled` resolves).
  const undo = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 800));

  function show() {
    count += 1;
    const request = createCancel();
    void showToast(
      {
        content: `Card ending 4${count}21 removed`,
        testID: `toast-${count}`,
        color: args.color,
        duration: args.duration,
        action: {
          text: 'Undo',
          onClick: async () => {
            await undo();
            request.cancel();
          },
        },
      },
      { cancelled: request.cancelled },
    ).then((reason) => {
      last = request.isCancelled ? 'undone' : reason;
    });
  }
</script>

<div
  class="relative flex h-80 w-full max-w-96 flex-col items-start gap-3 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted p-4"
>
  <BladeProvider>
    <Button type="button" onClick={show} testID="show">Show a toast</Button>
    <Text size="small" color="muted">last exit: <span data-testid="last">{last}</span></Text>
    <!-- Rendered once, inside the provider: it shows what showToast asks for. -->
    <ToastContainer placement={args.placement} testID="toasts" />
  </BladeProvider>
</div>
