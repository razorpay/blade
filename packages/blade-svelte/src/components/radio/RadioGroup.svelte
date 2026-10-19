<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { useComponentDefaults } from '../defaults';
  import BaseRadioGroup from './BaseRadioGroup.svelte';
  import { resolveRadioGroup, type RadioGroupStyleProps } from './styles';

  // Blade's RadioGroup: BaseRadioGroup in its own look, from style props.
  // The rest, `data-analytics-*` attributes included, is the base's: it
  // puts those on the radiogroup root.
  type Props = Omit<ComponentProps<typeof BaseRadioGroup>, 'classes'> & RadioGroupStyleProps;

  let { value = $bindable(), orientation, size, ...props }: Props = $props();

  const style = useComponentDefaults('RadioGroup', () => ({ orientation, size }));
  const classes = $derived(resolveRadioGroup(style.current));
</script>

<BaseRadioGroup bind:value {classes} {...props} />
