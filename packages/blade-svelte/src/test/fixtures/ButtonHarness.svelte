<script lang="ts">
  import Button from '../../components/button/Button.svelte';
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import type { BladeAdapters } from '../../adapters';

  interface Props {
    onClick?: (event: MouseEvent) => void;
    type?: 'submit' | 'button';
    validateForm?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingAnnouncement?: string;
    loadedAnnouncement?: string;
    variant?: 'primary' | 'secondary';
    color?: 'primary' | 'neutral' | 'positive' | 'negative';
    className?: string;
    href?: string;
    target?: string;
    adapters?: BladeAdapters;
  }

  let {
    onClick,
    type = 'button',
    validateForm,
    isDisabled,
    isLoading = false,
    loadingAnnouncement,
    loadedAnnouncement,
    variant,
    color,
    className,
    href,
    target,
    adapters,
  }: Props = $props();
</script>

<BladeProvider {adapters} testID="host">
  <Button
    {type}
    {validateForm}
    {onClick}
    {isDisabled}
    {isLoading}
    {loadingAnnouncement}
    {loadedAnnouncement}
    {variant}
    {color}
    {href}
    {target}
    class={className}
    testID="solo"
    data-analytics-action="pay"
  >
    Go
  </Button>
</BladeProvider>
