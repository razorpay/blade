<script lang="ts">
  import { Link, TextInput, type TextInputStyleProps } from '../../index';
  import { InfoIcon, SearchIcon } from '../../icons';

  interface Props {
    args: TextInputStyleProps & { prefix?: string; suffix?: string };
  }

  let { args }: Props = $props();
</script>

<!-- Figma's slots: a glyph and text 8px (12px from medium) in from the edge,
     a selector on the field's 4px padding, the trailing items after the
     text with the field's gap. -->
<div class="grid max-w-96 gap-4">
  <TextInput
    label="UPI ID"
    placeholder="handle"
    size={args.size}
    prefix={args.prefix || undefined}
    suffix={args.suffix || undefined}
  />

  <TextInput
    label="Search"
    placeholder="Bank name"
    size={args.size}
    leadingIcon={SearchIcon}
    trailingIcon={InfoIcon}
  />

  <TextInput label="Amount" placeholder="0.00" size={args.size} prefix="₹">
    {#snippet trailing()}
      <Link href="#rates" size="small">Rates</Link>
    {/snippet}
  </TextInput>
</div>
