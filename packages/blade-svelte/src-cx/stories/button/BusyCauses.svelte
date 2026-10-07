<script lang="ts">
  import { Button, Form } from '../../index';
  import { delay } from '../helpers';

  interface Props {
    args: { isLoading?: boolean };
  }

  let { args }: Props = $props();
</script>

<div class="grid max-w-96 gap-6">
  <section class="grid gap-2">
    <h2 class="text-75 leading-50 font-blade-medium">host: the isLoading prop</h2>
    <Button isLoading={args.isLoading} loadingAnnouncement="Please wait">
      Toggle isLoading in Controls
    </Button>
  </section>

  <section class="grid gap-2">
    <h2 class="text-75 leading-50 font-blade-medium">press: an async onClick settling</h2>
    <Button
      variant="secondary"
      loadingAnnouncement="Please wait"
      onClick={() => delay(1500)}
    >
      Press me (1.5s)
    </Button>
  </section>

  <section class="grid gap-2">
    <h2 class="text-75 leading-50 font-blade-medium">form: the enclosing form submitting</h2>
    <Form name="busy" onSubmit={() => delay(1500)}>
      <Button variant="secondary" loadingAnnouncement="Submitting">
        Submit form (1.5s)
      </Button>
    </Form>
  </section>
</div>
