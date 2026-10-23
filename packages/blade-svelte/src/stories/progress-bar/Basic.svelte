<script lang="ts">
  import { ProgressBar, type ProgressBarStyleProps } from '../../index';

  interface Props {
    args: {
      variant?: 'linear' | 'circular';
      type?: 'progress' | 'meter';
      size?: 'small' | 'medium' | 'large';
      color?: ProgressBarStyleProps['color'] | '';
      value?: number;
      label?: string;
      isIndeterminate?: boolean;
      showPercentage?: boolean;
    };
  }

  let { args }: Props = $props();

  // A linear bar has no large; the story snaps it to medium.
  const style = $derived(
    (args.variant === 'circular'
      ? { variant: 'circular', size: args.size, color: args.color || undefined }
      : {
          variant: 'linear',
          size: args.size === 'large' ? 'medium' : args.size,
          color: args.color || undefined,
        }) as ProgressBarStyleProps,
  );
</script>

<div class="w-72">
  {#if args.type === 'meter'}
    <ProgressBar {...style} type="meter" value={args.value} label={args.label} />
  {:else}
    <ProgressBar
      {...style}
      value={args.value}
      label={args.label}
      isIndeterminate={args.isIndeterminate}
      showPercentage={args.showPercentage}
    />
  {/if}
</div>
