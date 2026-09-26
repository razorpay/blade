<script lang="ts">
  import { Switch, Text, type SwitchStyleProps } from '../../index';

  interface Props {
    args: SwitchStyleProps & { isDisabled?: boolean; label?: string };
  }

  let { args }: Props = $props();

  let isChecked = $state(false);
  let saved = $state(false);
  let isSaving = $state(false);

  // The thumb moves at once and spins until the server has the setting.
  function save(next: boolean) {
    isSaving = true;
    setTimeout(() => {
      saved = next;
      isSaving = false;
    }, 1200);
  }
</script>

<div class="flex flex-col items-start gap-4">
  <Switch size={args.size} isDisabled={args.isDisabled} bind:isChecked>
    {args.label}
  </Switch>
  <Switch
    size={args.size}
    isDisabled={args.isDisabled}
    isChecked={saved}
    isLoading={isSaving}
    onChange={save}
  >
    Saved on the server
  </Switch>
  <Text size="small" color="muted"
    >bound: {isChecked ? 'on' : 'off'} · saved: {saved ? 'on' : 'off'}</Text
  >
</div>
