<script lang="ts">
  import { Button, Form, TextInput } from '../../index';
  import type { FormErrors } from '../../runes';
  import { describeConstraint } from '../helpers';

  let lastFailure = $state<string[]>([]);

  function onValidationFailed(errors: FormErrors) {
    lastFailure = Object.keys(errors);
  }
</script>

<Form
  name="validate"
  {onValidationFailed}
  formatConstraintError={describeConstraint}
  class="grid max-w-96 gap-4"
>
  <TextInput name="name" label="Name" isRequired placeholder="Required" />
  <TextInput
    name="email"
    label="Email"
    type="email"
    isRequired
    placeholder="Required, must be an email"
  />
  <Button type="button" validateForm>Validate only</Button>
  <p class="text-75 leading-50 text-surface-gray-subtle">
    {lastFailure.length
      ? `Blocked: ${lastFailure.join(', ')}`
      : 'Press with empty fields to see the shake.'}
  </p>
</Form>
