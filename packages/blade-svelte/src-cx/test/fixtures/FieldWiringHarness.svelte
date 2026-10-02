<script lang="ts">
  import type { FormData } from '../../runes';
  import type { ElementHandle } from '../../runes/dom/element';
  import { provideAdapters } from '../../adapters';
  import Form from '../../components/form/Form.svelte';
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';
  import ChipGroup from '../../components/chip/ChipGroup.svelte';
  import Chip from '../../components/chip/Chip.svelte';
  import OptionList from '../../components/option-list/OptionList.svelte';
  import OptionItem from '../../components/option-list/OptionItem.svelte';

  interface Props {
    /** Which choice group the form holds. */
    which: 'cards' | 'chips' | 'options';
    onInput?: (data: FormData) => void;
    revealField?: (handle: ElementHandle, name: string) => void;
  }

  let { which, onInput, revealField }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ revealField });
</script>

<Form name="checkout" onInput={(data) => onInput?.(data)}>
  {#if which === 'cards'}
    <CardGroup name="plan" isRequired label="Plan" testID="plans">
      <CardGroupItem value="monthly" title="Monthly">
        {#snippet body()}<p>Billed monthly</p>{/snippet}
      </CardGroupItem>
      <CardGroupItem value="yearly" title="Yearly">
        {#snippet body()}<p>Billed yearly</p>{/snippet}
      </CardGroupItem>
    </CardGroup>
  {:else if which === 'chips'}
    <ChipGroup name="tip" isRequired label="Tip">
      <Chip value="10" testID="tip-10">₹10</Chip>
      <Chip value="20" testID="tip-20">₹20</Chip>
    </ChipGroup>
  {:else}
    <OptionList name="bank" isRequired label="Bank">
      <OptionItem value="hdfc" title="HDFC" />
      <OptionItem value="sbi" title="SBI" />
    </OptionList>
  {/if}
  <button type="submit" data-testid="submit">Pay</button>
</Form>
