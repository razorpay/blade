<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    stepLineClass,
    stepLineVerticalClass,
    stepLineHorizontalClass,
    straightLineVerticalClass,
    straightLineVerticalDottedClass,
    straightLineVerticalTopClass,
    straightLineHorizontalClass,
    straightLineHorizontalDottedClass,
    markerWrapperClass,
    markerDefaultClass,
    markerIndentedClass,
    markerTopOffsetClass,
    lineIndentedClass,
  } from '@razorpay/blade-core/styles';
  import StepItemIndicator from './StepItemIndicator.svelte';

  type StepType = 'single-item' | 'start' | 'middle' | 'end' | 'default';
  type StepProgress = 'start' | 'end' | 'full' | 'none';

  type Props = {
    stepType: StepType;
    shouldShowStartBranch: boolean;
    shouldShowEndBranch: boolean;
    marker?: Snippet;
    stepProgress: StepProgress;
    orientation: 'horizontal' | 'vertical';
    size: 'medium' | 'large';
  };

  let {
    stepType,
    shouldShowStartBranch,
    shouldShowEndBranch,
    marker,
    stepProgress,
    orientation,
    size,
  }: Props = $props();

  // Compute which branches are dotted based on stepProgress
  const isStartBranchDotted = $derived(stepProgress === 'none' || stepProgress === 'end');
  const isEndBranchDotted = $derived(stepProgress === 'none' || stepProgress === 'start');

  // Line classes based on dotted state
  const startVertLineClass = $derived(
    `${straightLineVerticalTopClass} ${isStartBranchDotted ? straightLineVerticalDottedClass : straightLineVerticalClass}`,
  );
  const endVertLineClass = $derived(
    isEndBranchDotted ? straightLineVerticalDottedClass : straightLineVerticalClass,
  );
  const startHorzLineClass = $derived(
    isStartBranchDotted ? straightLineHorizontalDottedClass : straightLineHorizontalClass,
  );
  const endHorzLineClass = $derived(
    isEndBranchDotted ? straightLineHorizontalDottedClass : straightLineHorizontalClass,
  );

  // SVG stroke color via CSS variable
  const svgStrokeColor = 'var(--surface-border-gray-subtle)';
  const topCurveDashArray = $derived(isStartBranchDotted ? '2 4' : undefined);
  const bottomCurveDashArray = $derived(isEndBranchDotted ? '2 4' : undefined);

  // Bottom curve path depends on size
  const bottomCurvePath = $derived(
    size === 'large'
      ? 'M1 6V6C1 4.36914 2.31973 3.04584 3.95058 3.04142L31.04 2.96802C32.6761 2.96359 34 1.63606 34 0V0'
      : 'M1 5V5C1 3.63251 2.108 2.52363 3.47549 2.52255L29.5 2.50198C30.881 2.50088 32 1.38103 32 0V0',
  );
  const bottomCurveViewBox = $derived(size === 'large' ? '0 0 35 6' : '0 0 33 5');
  const bottomCurveWidth = $derived(size === 'large' ? '35' : '33');
  const bottomCurveHeight = $derived(size === 'large' ? '6' : '5');
</script>

{#if orientation === 'horizontal'}
  <!-- Horizontal layout -->
  <div class="{stepLineClass} {stepLineHorizontalClass}">
    <div
      class={startHorzLineClass}
      style={shouldShowStartBranch ? undefined : 'visibility: hidden'}
    ></div>
    <div class={markerWrapperClass}>
      {#if marker}
        {@render marker()}
      {:else}
        <StepItemIndicator color="neutral" />
      {/if}
    </div>
    <div
      class={endHorzLineClass}
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    ></div>
  </div>
{:else if stepType === 'default'}
  <!-- Vertical default: top-level items, no indentation -->
  <div class="{stepLineClass} {stepLineVerticalClass}">
    <div
      class={startVertLineClass}
      style={shouldShowStartBranch ? undefined : 'visibility: hidden'}
    ></div>
    <div class="{markerWrapperClass} {markerDefaultClass}">
      {#if marker}
        {@render marker()}
      {:else}
        <StepItemIndicator color="neutral" />
      {/if}
    </div>
    <div
      class={endVertLineClass}
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    ></div>
  </div>
{:else if stepType === 'start'}
  <!-- Vertical start: first item in nested group -->
  <div class="{stepLineClass} {stepLineVerticalClass}">
    <!-- Top curve -->
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      style={shouldShowStartBranch ? undefined : 'visibility: hidden'}
    >
      <path
        d="M1 0V5C1 9.41828 4.58172 13 9 13H20"
        stroke={svgStrokeColor}
        stroke-width="2"
        stroke-dasharray={topCurveDashArray}
      />
    </svg>
    <!-- Marker: indented + top offset from curve -->
    <div class="{markerWrapperClass} {markerIndentedClass} {markerTopOffsetClass}">
      {#if marker}
        {@render marker()}
      {:else}
        <StepItemIndicator color="neutral" />
      {/if}
    </div>
    <!-- End branch: indented straight line -->
    <div
      class="{endVertLineClass} {lineIndentedClass}"
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    ></div>
  </div>
{:else if stepType === 'middle'}
  <!-- Vertical middle: middle item in nested group (indented) -->
  <div class="{stepLineClass} {stepLineVerticalClass}">
    <div
      class="{startVertLineClass} {lineIndentedClass}"
      style={shouldShowStartBranch ? undefined : 'visibility: hidden'}
    ></div>
    <div class="{markerWrapperClass} {markerIndentedClass}">
      {#if marker}
        {@render marker()}
      {:else}
        <StepItemIndicator color="neutral" />
      {/if}
    </div>
    <div
      class="{endVertLineClass} {lineIndentedClass}"
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    ></div>
  </div>
{:else if stepType === 'end'}
  <!-- Vertical end: last item in nested group -->
  <div class="{stepLineClass} {stepLineVerticalClass}">
    <div
      class="{startVertLineClass} {lineIndentedClass}"
      style={shouldShowStartBranch ? undefined : 'visibility: hidden'}
    ></div>
    <div class="{markerWrapperClass} {markerIndentedClass}">
      {#if marker}
        {@render marker()}
      {:else}
        <StepItemIndicator color="neutral" />
      {/if}
    </div>
    <div
      class="{endVertLineClass} {lineIndentedClass}"
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    ></div>
    <!-- Bottom curve -->
    <svg
      width={bottomCurveWidth}
      height={bottomCurveHeight}
      viewBox={bottomCurveViewBox}
      fill="none"
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    >
      <path
        d={bottomCurvePath}
        stroke={svgStrokeColor}
        stroke-width="2"
        stroke-dasharray={bottomCurveDashArray}
      />
    </svg>
  </div>
{:else if stepType === 'single-item'}
  <!-- Vertical single-item: only item in nested group -->
  <div class="{stepLineClass} {stepLineVerticalClass}">
    <!-- Top curve -->
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      style={shouldShowStartBranch ? undefined : 'visibility: hidden'}
    >
      <path
        d="M1 0V5C1 9.41828 4.58172 13 9 13H20"
        stroke={svgStrokeColor}
        stroke-width="2"
        stroke-dasharray={topCurveDashArray}
      />
    </svg>
    <!-- Marker: indented + top offset -->
    <div class="{markerWrapperClass} {markerIndentedClass} {markerTopOffsetClass}">
      {#if marker}
        {@render marker()}
      {:else}
        <StepItemIndicator color="neutral" />
      {/if}
    </div>
    <!-- Indented straight end line -->
    <div
      class="{endVertLineClass} {lineIndentedClass}"
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    ></div>
    <!-- Bottom curve -->
    <svg
      width={bottomCurveWidth}
      height={bottomCurveHeight}
      viewBox={bottomCurveViewBox}
      fill="none"
      style={shouldShowEndBranch ? undefined : 'visibility: hidden'}
    >
      <path
        d={bottomCurvePath}
        stroke={svgStrokeColor}
        stroke-width="2"
        stroke-dasharray={bottomCurveDashArray}
      />
    </svg>
  </div>
{/if}
