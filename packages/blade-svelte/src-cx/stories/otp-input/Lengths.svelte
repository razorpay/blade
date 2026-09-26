<script lang="ts">
  import { OTPInput } from '../../index';

  const lengths = [4, 6, 9];
</script>

<div class="grid max-w-96 gap-6">
  {#each lengths as otpLength (otpLength)}
    <OTPInput {otpLength} label={`${otpLength} cells`} value="12" />
  {/each}
</div>
