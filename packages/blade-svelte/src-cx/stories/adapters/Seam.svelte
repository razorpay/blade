<script lang="ts">
  import { BladeProvider, Button, Form, TextInput } from '../../index';
  import type { BladeAdapters } from '../../index';
  import { delay, describeConstraint, stamp } from '../helpers';

  const FIELDS = ['line1', 'line2', 'city', 'state', 'pincode', 'landmark'];

  let log = $state<string[]>([]);

  function record(line: string) {
    log = [`${stamp()} ${line}`, ...log].slice(0, 30);
  }

  // BladeProvider provides them to everything under it.
  const adapters: BladeAdapters = {
    track: (event, payload) =>
      record(`track ${event} ${JSON.stringify(payload)}`),
    haptics: {
      warning: () => record('haptics.warning'),
      medium: () => record('haptics.medium'),
    },
    captureError: (error) => record(`captureError ${String(error)}`),
    revealField: (handle, name) => {
      record(`revealField ${name}`);
      handle.scrollIntoView();
      handle.focus();
    },
  };
</script>

<div class="grid max-w-[760px] [grid-template-columns:1fr_1fr] gap-8">
  <BladeProvider {adapters}>
    <Form
      name="address"
      formatConstraintError={describeConstraint}
      onSubmit={() => delay(800)}
      class="grid gap-3"
    >
      {#each FIELDS as name (name)}
        <TextInput {name} label={name} isRequired={name !== 'landmark'} />
      {/each}
      <Button type="submit" loadingAnnouncement="Saving">Save address</Button>
    </Form>
  </BladeProvider>

  <section class="grid [align-content:start] gap-2">
    <h2 class="text-75 leading-50 font-medium">Adapter log</h2>
    <ul class="font-mono grid gap-1 text-25 leading-50 text-surface-gray-subtle">
      {#each log as line (line)}
        <li>{line}</li>
      {:else}
        <li>Edit a field or submit to see calls.</li>
      {/each}
    </ul>
  </section>
</div>
