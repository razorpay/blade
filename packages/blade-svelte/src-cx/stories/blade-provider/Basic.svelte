<script lang="ts">
  import {
    BladeProvider,
    Button,
    Checkbox,
    LayerHost,
    Modal,
    RadioGroup,
    Radio,
    Switch,
    Text,
    TextInput,
    type ComponentDefaults,
  } from '../../index';

  interface Props {
    args: {
      size?: 'small' | 'medium' | 'large';
      checkout?: boolean;
      modalVariant?: 'modal' | 'sheet' | 'adaptive';
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(false);

  const defaults = $derived<ComponentDefaults>({
    ...(args.checkout
      ? {
          Button: { color: 'neutral' },
          Checkbox: { size: 'small' },
          CardGroup: { variant: 'filled' },
        }
      : {}),
    Modal: {
      variant: args.modalVariant === 'adaptive' ? { base: 'sheet', m: 'modal' } : args.modalVariant,
    },
  });
</script>

<BladeProvider size={args.size} {defaults}>
  <div class="relative flex min-h-[34rem] max-w-96 flex-col items-stretch gap-4 overflow-hidden p-4">
    <TextInput label="Email" placeholder="you@example.com" />
    <RadioGroup label="Pay with" value="upi">
      <Radio value="upi">UPI</Radio>
      <Radio value="card">Card</Radio>
    </RadioGroup>
    <Checkbox>Save this card</Checkbox>
    <Switch accessibilityLabel="Remember me" />
    <Button onClick={() => (isOpen = true)}>Continue</Button>
    <Button variant="secondary" size="small">Own prop: small</Button>
    <Text size="small" color="muted">
      Resize across 768px with the modal open: its variant follows.
    </Text>
    <LayerHost />
  </div>
  <Modal bind:isOpen title="Confirm payment">
    {#snippet body()}
      <Text>Pay ₹1,200 to Acme?</Text>
    {/snippet}
    {#snippet footer()}
      <Button onClick={() => (isOpen = false)}>Pay</Button>
    {/snippet}
  </Modal>
</BladeProvider>
