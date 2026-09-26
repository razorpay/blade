<script lang="ts">
  import Icon from '../icon/Icon.svelte';
  import { close } from '../icons';
  import type { ToastStyleProps } from './styles';

  // Decorative only: the dismiss button and its accessible name belong to
  // Toast, so the icon carries no label and inherits the button's colour.
  const _props: ToastStyleProps = $props();
</script>

<Icon source={close} />
