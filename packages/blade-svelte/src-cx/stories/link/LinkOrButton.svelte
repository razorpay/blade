<script lang="ts">
  import { Button, Icon, icons, Link, Text } from '../../index';

  let resent = $state(0);

  function resend(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resent += 1;
        resolve();
      }, 1200);
    });
  }
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

  <Text size="small" color="subtle">
    Did not get the code?
    <Button
      variant="link"
      size="small"
      type="button"
      loadingAnnouncement="Resending"
      onClick={resend}
    >
      Resend
    </Button>
    (sent {resent}×)
  </Text>

  <Button variant="link" color="neutral" type="button" class="self-start">
    Change currency <Icon
      source={icons.chevronDown}
      size="small"
      class="-rotate-90"
    />
  </Button>
</div>
