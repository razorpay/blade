<script lang="ts">
  import type { Snippet } from 'svelte';
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import type { ComponentDefaults } from '../../components/defaults';
  import BottomSheet from '../../components/bottom-sheet/BottomSheet.svelte';
  import BottomSheetBody from '../../components/modal-children/BottomSheetBody.svelte';
  import BottomSheetHeader from '../../components/modal-children/BottomSheetHeader.svelte';
  import PhoneCountryList from '../../components/phone-number-input/PhoneCountryList.svelte';
  import type { BladeAdapters } from '../../adapters';
  import { createTestPresenter } from './presenter.svelte';

  interface Props {
    adapters?: BladeAdapters;
    /** Library dropdowns (the phone field's country list) show as sheets, as an app's presenter would. */
    presentsDropdowns?: boolean;
    defaults?: ComponentDefaults;
    testID?: string;
    children: Snippet;
  }

  let { adapters, presentsDropdowns = false, defaults, testID, children }: Props = $props();

  // A BladeProvider with a presenter that shows library dropdowns as a
  // BottomSheet: the stand-in for an app's own, for stories and tests.
  const presenter = createTestPresenter();
</script>

<BladeProvider
  adapters={{
    ...adapters,
    ...(presentsDropdowns ? { presentDropdown: presenter.presentDropdown } : {}),
  }}
  {defaults}
  {testID}
>
  {@render children()}
  {#each presenter.entries as entry (entry.id)}
    <BottomSheet
      isOpen={entry.isOpen}
      closeLabel={entry.request.closeLabel ?? 'Close'}
      onDismiss={() => entry.close()}
      testID={entry.request.testID ? `${entry.request.testID}-picker` : undefined}
    >
      <BottomSheetHeader title={entry.request.label} />
      <BottomSheetBody padding="spacing.0">
        <PhoneCountryList
          items={entry.request.items}
          value={entry.request.value}
          label={entry.request.label}
          testID={entry.request.testID ? `${entry.request.testID}-countries` : undefined}
          onPick={entry.close}
        />
      </BottomSheetBody>
    </BottomSheet>
  {/each}
</BladeProvider>
