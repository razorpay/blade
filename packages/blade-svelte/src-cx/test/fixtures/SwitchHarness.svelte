<script lang="ts">
  import Switch from '../../components/switch/Switch.svelte';

  interface Props {
    isChecked?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    onChange?: (isChecked: boolean) => void;
    label?: string;
  }

  let {
    isChecked = false,
    isDisabled,
    isLoading,
    onChange,
    label = 'Save this card',
  }: Props = $props();
</script>

<Switch
  {isChecked}
  {isDisabled}
  {isLoading}
  {onChange}
  accessibilityLabel="Save card"
  testID="save"
  class="mt-1"
>
  {label}
</Switch>
