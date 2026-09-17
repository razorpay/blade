<script lang="ts">
  let {
    id,
    value,
    min = 0,
    max = 48,
    step = 1,
    unit = 'px',
    accessibilityLabel,
    onChange,
  }: {
    id?: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    accessibilityLabel: string;
    onChange: (value: number) => void;
  } = $props();

  const clamp = (next: number): number => Math.max(min, Math.min(max, next));

  function handleInput(event: Event & { currentTarget: HTMLInputElement }): void {
    const parsed = Number.parseInt(event.currentTarget.value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    onChange(clamp(parsed));
  }
</script>

<div class="studio-slider">
  <input
    {id}
    class="studio-slider-range"
    type="range"
    {min}
    {max}
    {step}
    {value}
    aria-label={accessibilityLabel}
    oninput={handleInput}
  />
  <div class="studio-slider-value">
    <input
      class="studio-slider-number"
      type="number"
      {min}
      {max}
      {step}
      {value}
      aria-label="{accessibilityLabel} value"
      oninput={handleInput}
    />
    <span class="studio-slider-unit">{unit}</span>
  </div>
</div>

<style>
  .studio-slider {
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--spacing-3);
    min-width: 0;
  }

  .studio-slider-range {
    flex: 1;
    min-width: 0;
    height: 2px;
    margin: 0;
    border-radius: var(--border-radius-max);
    background-color: var(--interactive-background-gray-disabled);
    appearance: none;
    cursor: pointer;
  }

  .studio-slider-range::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    border: none;
    border-radius: var(--border-radius-max);
    background-color: var(--surface-icon-gray-normal);
    appearance: none;
    cursor: pointer;
  }

  .studio-slider-range::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border: none;
    border-radius: var(--border-radius-max);
    background-color: var(--surface-icon-gray-normal);
    cursor: pointer;
  }

  .studio-slider-range:focus-visible {
    outline: 2px solid var(--surface-border-primary-normal);
    outline-offset: 4px;
  }

  .studio-slider-value {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: var(--spacing-2);
    height: 32px;
    padding: 0 var(--spacing-3);
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-small);
    background-color: var(--surface-background-gray-intense);
  }

  .studio-slider-number {
    width: 26px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--surface-text-gray-normal);
    font-family: var(--font-family-text);
    font-size: var(--font-size-75);
    text-align: right;
    appearance: textfield;
  }

  .studio-slider-number::-webkit-outer-spin-button,
  .studio-slider-number::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }

  .studio-slider-number:focus-visible {
    outline: none;
  }

  .studio-slider-unit {
    color: var(--surface-text-gray-muted);
    font-family: var(--font-family-text);
    font-size: var(--font-size-75);
  }
</style>
