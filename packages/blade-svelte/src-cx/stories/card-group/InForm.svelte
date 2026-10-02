<script lang="ts">
  import { CardGroup, CardGroupItem, Button, Form, Text } from '../../index';

  const methods = [
    { name: 'upi', title: 'UPI' },
    { name: 'wallet', title: 'Wallets' },
  ];
  let submitted = $state('');
</script>

<div class="max-w-96">
  <Form
    onSubmit={(data) => {
      submitted = JSON.stringify(data);
    }}
  >
    <div class="flex flex-col gap-3">
      <CardGroup name="instrument" isRequired label="Pay using">
        {#each methods as method (method.name)}
          <CardGroupItem value={method.name} title={method.title}>
            {#snippet body()}
              <Text color="subtle">{method.title} options</Text>
            {/snippet}
          </CardGroupItem>
        {/each}
      </CardGroup>
      <Button type="submit" class="w-full">Continue</Button>
      <Text size="small" color="muted">submitted: {submitted || '—'}</Text>
    </div>
  </Form>
</div>
