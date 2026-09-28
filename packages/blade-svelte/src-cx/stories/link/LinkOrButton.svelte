<script lang="ts">
  import { Link, Text } from '../../index';
</script>

<div class="flex max-w-96 flex-col gap-4">
  <Text size="small" color="subtle">
    By continuing you agree to the
    <Link href="https://razorpay.com/terms" target="_blank" size="small">
      terms of use
    </Link>
    and the
    <Link href="https://razorpay.com/privacy" target="_blank" size="small">
      privacy policy
    </Link>. The links wrap with the sentence they sit in.
  </Text>

  <!-- Actions that read as links wait for Link's button form (Link pass). -->
</div>
