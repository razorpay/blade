<script lang="ts">
  import { SearchInput, type TextInputStyleProps } from '../../index';

  interface Props {
    args: Omit<TextInputStyleProps, 'size'> & {
      size?: 'medium' | 'large';
      label?: string;
      placeholder?: string;
      helpText?: string;
      isDisabled?: boolean;
      showSearchIcon?: boolean;
    };
  }

  let { args }: Props = $props();

  let value = $state<string | number | null | undefined>('');
  let log = $state<string[]>([]);
</script>

<div class="grid max-w-96 gap-4">
  <SearchInput
    bind:value
    label={args.label || undefined}
    accessibilityLabel="Search banks"
    placeholder={args.placeholder}
    helpText={args.helpText || undefined}
    isDisabled={args.isDisabled}
    showSearchIcon={args.showSearchIcon}
    size={args.size}
    name="bank"
    onChange={(change) => (log = [`onChange ${JSON.stringify(change)}`, ...log].slice(0, 5))}
    onClearButtonClick={() => (log = ['onClearButtonClick', ...log].slice(0, 5))}
    testID="search-input"
  />
  <ul class="text-75 leading-50 text-surface-gray-subtle">
    {#each log as line, index (index)}<li>{line}</li>{/each}
  </ul>
</div>
