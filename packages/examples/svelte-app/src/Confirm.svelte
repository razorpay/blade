<script lang="ts">
  import { Button, OTPInput, Text } from '@razorpay/blade-svelte/components';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '@razorpay/blade-svelte/components';

  let {
    isOpen = $bindable(false),
    method,
    onPaid,
  }: { isOpen?: boolean; method: string | null; onPaid: () => void } = $props();

  let otp = $state('');
</script>

<!-- Loaded on demand (App.svelte): Modal and its parts arrive in this chunk. -->
<Modal bind:isOpen size="small">
  <ModalHeader title="Confirm payment" subtitle={method === 'upi' ? 'UPI' : 'Card'} />
  <ModalBody>
    <div class="flex flex-col gap-3">
      <Text>Enter the 6-digit code sent to your phone.</Text>
      <OTPInput bind:value={otp} otpLength={6} label="One-time password" />
    </div>
  </ModalBody>
  <ModalFooter>
    <div class="flex justify-end gap-3">
      <Button variant="secondary" onClick={() => (isOpen = false)}>Cancel</Button>
      <Button isDisabled={otp.length < 6} onClick={onPaid}>Confirm</Button>
    </div>
  </ModalFooter>
</Modal>
