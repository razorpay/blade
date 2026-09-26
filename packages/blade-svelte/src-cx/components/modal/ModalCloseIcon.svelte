<script lang="ts">
  import Icon from '../icon/Icon.svelte';
  import { close } from '../icons';
  import type { ModalStyleProps } from './styles';

  // Decorative only: the close button and its accessible name belong to
  // Modal, so the icon carries no label and inherits the button's colour.
  const _props: ModalStyleProps = $props();
</script>

<Icon source={close} />
