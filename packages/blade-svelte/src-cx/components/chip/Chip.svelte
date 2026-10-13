<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ControlState } from '../shared/control-state';
  import { cx } from '../../cx';
  import { getChipGroup } from '../../runes/chip/context';
  import { createChip } from '../../runes/chip/chip.svelte';
  import type { IconSource } from '../../runes/icon/source';
  import Icon from '../icon/Icon.svelte';
  import { resolveChip, type ChipColor, type ChipShared } from './styles';

  interface Props {
    /** What the chip stands for in the ChipGroup's value. */
    value: string;
    /** The label; optional with a `leading`. Receives the chip's state. */
    children?: Snippet<[ControlState]>;
    /**
     * Ahead of the label: an icon, or a snippet with an Avatar or a flag,
     * which receives the chip's state.
     */
    leading?: IconSource | Snippet<[ControlState]>;
    /** Picked colour; the group's when omitted. */
    color?: ChipColor;
    /** @default the group's */
    isDisabled?: boolean;
    testID?: string;
    class?: string;
  }

  let {
    value,
    children,
    leading,
    color,
    isDisabled,
    testID,
    class: className = '',
  }: Props = $props();

  const chip = createChip<ChipShared>(getChipGroup(), {
    value: () => value,
    isDisabled: () => Boolean(isDisabled),
  });
  const group = $derived(chip.group);
  const controlState: ControlState = $derived({
    isChecked: chip.isChecked,
    isDisabled: chip.isDisabled,
  });
  const tone = $derived(
    chip.isDisabled
      ? chip.isChecked
        ? 'checkedDisabled'
        : 'uncheckedDisabled'
      : chip.isChecked
        ? 'checked'
        : 'unchecked'
  );
  const classes = $derived(
    resolveChip(
      group?.shared.size ?? 'small',
      tone,
      color ?? group?.shared.color ?? 'primary'
    )
  );
</script>

<span class={cx(classes.root, className)} data-testid={testID}>
  <!-- Blade shrinks the chip while it is held: by pointer, or by Space. The
       listeners only animate; the input owns the semantics. -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <label
    class={cx(classes.label, chip.isDisabled && classes.labelDisabled)}
    onpointerdown={chip.handlePressIn}
    onpointerup={chip.handlePressOut}
    onpointerleave={chip.handlePressOut}
    onkeydown={chip.handleKeyDown}
    onkeyup={chip.handleKeyUp}
  >
    <input
      type={group?.kind ?? 'checkbox'}
      class={classes.control}
      name={group?.name}
      {value}
      checked={chip.isChecked}
      disabled={chip.isDisabled}
      required={group?.isRequired}
      aria-invalid={group?.isInvalid ? 'true' : undefined}
      onchange={chip.handleChange}
      {@attach chip.attach}
      {@attach chip.sync}
    />
    <span class={cx(classes.frame, chip.isPressed && classes.framePressed)}>
      <span class={classes.inner}>
        {#if typeof leading === 'function'}
          <span class="flex items-center">{@render leading(controlState)}</span>
        {:else if leading}
          <span class={classes.icon}><Icon source={leading} size={classes.iconSize} /></span>
        {/if}
        {#if children}
          <span class={classes.text}>{@render children(controlState)}</span>
        {/if}
      </span>
    </span>
  </label>
</span>
