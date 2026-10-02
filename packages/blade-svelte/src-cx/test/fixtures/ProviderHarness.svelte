<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import Button from '../../components/button/Button.svelte';
  import Badge from '../../components/badge/Badge.svelte';
  import Checkbox from '../../components/checkbox/Checkbox.svelte';
  import Switch from '../../components/switch/Switch.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';
  import type { ComponentDefaults, DefaultSize } from '../../components/defaults';
  import type { Breakpoints } from '../../runes/defaults/breakpoints.svelte';
  import type { Responsive } from '../../runes/defaults/responsive';
  import type { BladeAdapters } from '../../adapters';
  import AdapterProbe from './AdapterProbe.svelte';

  interface Props {
    size?: Responsive<DefaultSize>;
    defaults?: ComponentDefaults;
    innerSize?: DefaultSize;
    innerDefaults?: ComponentDefaults;
    breakpoints?: Breakpoints;
    adapters?: BladeAdapters;
    innerAdapters?: BladeAdapters;
    buttonSize?: 'xsmall' | 'small' | 'medium' | 'large';
  }

  let {
    size,
    defaults,
    innerSize,
    innerDefaults,
    breakpoints,
    adapters,
    innerAdapters,
    buttonSize,
  }: Props = $props();
</script>

<BladeProvider {size} {defaults} {breakpoints} {adapters}>
  <Button testID="button" size={buttonSize}>Pay</Button>
  <TextInput label="Email" testID="input" />
  <Checkbox testID="checkbox">Save</Checkbox>
  <Switch accessibilityLabel="Dark mode" testID="switch" />
  <Badge testID="badge">New</Badge>
  <BladeProvider size={innerSize} defaults={innerDefaults} adapters={innerAdapters}>
    <Button testID="inner-button">Cancel</Button>
    <AdapterProbe />
  </BladeProvider>
</BladeProvider>
