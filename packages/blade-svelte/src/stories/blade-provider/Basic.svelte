<script lang="ts">
  import {
    BladeProvider,
    Button,
    Checkbox,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
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
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(false);

  const defaults = $derived<ComponentDefaults>({
    ...(args.checkout
      ? {
          Button: { color: 'neutral' },
          Checkbox: { size: 'small' },
        }
      : {}),
  });
</script>

<!-- The provider renders the overlay host after its content: in this frame. -->
<div class="relative flex min-h-[34rem] max-w-96 flex-col items-stretch gap-4 overflow-hidden p-4">
  <BladeProvider size={args.size} {defaults}>
    <TextInput label="Email" placeholder="you@example.com" />
    <RadioGroup label="Pay with" value="upi">
      <Radio value="upi">UPI</Radio>
      <Radio value="card">Card</Radio>
    </RadioGroup>
    <Checkbox>Save this card</Checkbox>
    <Switch accessibilityLabel="Remember me" />
    <Button onClick={() => (isOpen = true)}>Continue</Button>
    <Button variant="secondary" size="small">Own prop: small</Button>
    <Modal bind:isOpen closeLabel="Close">
      <ModalHeader title="Confirm payment" />
      <ModalBody><Text>Pay ₹1,200 to Acme?</Text></ModalBody>
      <ModalFooter><Button onClick={() => (isOpen = false)}>Pay</Button></ModalFooter>
    </Modal>
  </BladeProvider>
</div>
