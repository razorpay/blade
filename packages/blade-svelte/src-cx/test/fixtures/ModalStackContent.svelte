<script lang="ts">
  import type { ModalControl } from '../../components/modal/overlays';

  interface Props {
    bank: string;
    modal: ModalControl<boolean>;
  }

  let { bank, modal }: Props = $props();
</script>

<p data-testid="bank">{bank}</p>
<button type="button" data-testid="continue" onclick={() => modal.close(true)}>
  Continue
</button>
