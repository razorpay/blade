<script lang="ts">
  import { icons, Link, Text } from '../../index';
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

  <div class="flex items-center gap-4">
    <Link variant="button" size="small">Resend code</Link>
    <Link variant="button" size="small" isDisabled>Resend code</Link>
    <Link
      href="https://razorpay.com/support"
      target="_blank"
      icon={icons.info}
      accessibilityLabel="Help"
      htmlTitle="Help"
    />
  </div>
</div>
