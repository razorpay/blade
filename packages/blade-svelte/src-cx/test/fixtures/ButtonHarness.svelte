<script lang="ts">
  import Button from '../../components/button/Button.svelte';

  interface Props {
    onClick?: (event: MouseEvent) => void;
    type?: 'submit' | 'button';
    validateForm?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingAnnouncement?: string;
    variant?: 'primary' | 'secondary' | 'link';
    color?: 'primary' | 'neutral' | 'positive' | 'negative';
    className?: string;
    autoPressAfter?: number;
  }

  let {
    onClick,
    type = 'button',
    validateForm,
    isDisabled,
    isLoading = false,
    loadingAnnouncement,
    variant,
    color,
    className,
    autoPressAfter,
  }: Props = $props();
</script>

<Button
  {type}
  {validateForm}
  {onClick}
  {isDisabled}
  {isLoading}
  {loadingAnnouncement}
  {variant}
  {color}
  {autoPressAfter}
  class={className}
  testID="solo"
>
  Go
</Button>
