<script lang="ts">
  import {
    InputGroup,
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
    <TextInput label="Card number" placeholder="Card number" type="tel" />
    <TextInput label="Expiry" placeholder="MM / YY" type="tel" span="1/2" />
    <TextInput label="CVV" placeholder="CVV" type="password" span="1/2" />
    <TextInput label="Name on card" placeholder="Name on card" />
  </InputGroup>
</div>
