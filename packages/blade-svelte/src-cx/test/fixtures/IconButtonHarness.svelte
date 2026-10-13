<script lang="ts">
  import IconButton from '../../components/icon-button/IconButton.svelte';
  import Form from '../../components/form/Form.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';
  import { CloseIcon } from '../../icons';

  interface Props {
    onClick?: (event: MouseEvent) => void | Promise<void>;
    type?: 'submit' | 'button';
    isDisabled?: boolean;
    isLoading?: boolean;
    emphasis?: 'intense' | 'subtle';
    isHighlighted?: boolean;
    size?: 'small' | 'medium' | 'large';
    onSubmit?: (data: Record<string, unknown>) => void;
  }

  let { onClick, type, isDisabled, isLoading, emphasis, isHighlighted, size, onSubmit }: Props =
    $props();
</script>

<Form onSubmit={(data) => onSubmit?.(data)}>
  <TextInput name="query" label="Search" value="upi" />
  <IconButton
    icon={CloseIcon}
    accessibilityLabel="Dismiss"
    {onClick}
    {type}
    {isDisabled}
    {isLoading}
    {emphasis}
    {isHighlighted}
    {size}
    loadingAnnouncement="Working"
    testID="dismiss"
    class="ml-2"
  />
</Form>
