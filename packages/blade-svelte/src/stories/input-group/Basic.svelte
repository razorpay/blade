<script lang="ts">
  import {
    InputGroup,
    PasswordInput,
    TextInput,
    type InputGroupStyleProps,
  } from '../../index';

  interface Props {
    args: InputGroupStyleProps & {
      label?: string;
      helpText?: string;
      isDisabled?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<div class="max-w-96">
  <InputGroup
    label={args.label}
    helpText={args.helpText || undefined}
    isDisabled={args.isDisabled}
  >
    <TextInput label="Card number" placeholder="Card number" inputMode="numeric" />
    <TextInput label="Expiry" placeholder="MM / YY" inputMode="numeric" span="1/2" />
    <PasswordInput label="CVV" placeholder="CVV" span="1/2" showRevealButton={false} />
    <TextInput label="Name on card" placeholder="Name on card" />
  </InputGroup>
</div>
