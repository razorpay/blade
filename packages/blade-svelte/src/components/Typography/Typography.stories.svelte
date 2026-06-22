<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Heading from './Heading/Heading.svelte';
  import Text from './Text/Text.svelte';
  import Code from './Code/Code.svelte';

  const COLUMN_WIDTHS = {
    typestyle: 500,
    font: 120,
    size: 70,
    lineHeight: 100,
    weight: 70,
    letterSpacing: 220,
  };

  const getLetterSpacingPercent = (letterSpacing: string, fontSize: string): string => {
    const lsValue = parseFloat(letterSpacing);
    const fsValue = parseFloat(fontSize);
    if (Number.isNaN(lsValue) || Number.isNaN(fsValue) || fsValue === 0) return '0%';
    return `${((lsValue / fsValue) * 100).toFixed(1)}%`;
  };

  const getLetterSpacingToken = (percent: string): string => {
    const value = parseFloat(percent);
    if (Math.abs(value - -3.3) < 0.5) return 'token: 25';
    if (Math.abs(value - -1.3) < 0.5) return 'token: 50';
    if (Math.abs(value) < 0.5) return 'token: 100';
    return '';
  };

  const cell = (width: number): string => `width:${width}px; min-width:${width}px; flex-shrink:0;`;

  // Measures the rendered typestyle and fills the sibling style cells. getComputedStyle
  // needs the painted DOM, so this runs in an attachment rather than as derived state.
  // Re-measures on resize for responsive typography.
  const measureRow: Attachment<HTMLElement> = (rowEl) => {
    const fill = (): void => {
      const typeStyleCell = rowEl.querySelector('[data-cell="typestyle"]');
      const textElement = typeStyleCell?.querySelector('h1, h2, h3, h4, h5, h6, p, span, code');
      if (!textElement) return;
      const computed = window.getComputedStyle(textElement as HTMLElement);
      const { fontSize, letterSpacing, lineHeight, fontWeight, fontFamily } = computed;
      const lsPercent = getLetterSpacingPercent(letterSpacing, fontSize);
      const token = getLetterSpacingToken(lsPercent);
      const set = (name: string, value: string): void => {
        const node = rowEl.querySelector(`[data-cell="${name}"] [data-value]`);
        if (node) node.textContent = value;
      };
      set('font', fontFamily.split(',')[0].replace(/['"]/g, ''));
      set('size', fontSize);
      set('lineHeight', lineHeight);
      set('weight', fontWeight);
      set('letterSpacing', `${letterSpacing} (${lsPercent})${token ? ` [${token}]` : ''}`);
    };

    let frame = 0;
    const schedule = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(fill);
      });
    };
    schedule();
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
    };
  };

  const { Story } = defineMeta({
    title: 'Components/Typography/All Typography',
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: 'An overview of all typography styles available in Blade Svelte.',
        },
      },
    },
  });
</script>

{#snippet styleCell(name: string, width: number)}
  <div data-cell={name} style={cell(width)}>
    <Text size="small"><span data-value></span></Text>
  </div>
{/snippet}

{#snippet headerCell(label: string, width: number)}
  <div style={cell(width)}>
    <Text size="small" weight="semibold" color="surface.text.gray.muted">{label}</Text>
  </div>
{/snippet}

<!-- Row helper: renders the typestyle + a set of style cells that get filled by measureRow.
     Kept inline (not a separate component) since it is only used by this story. -->
{#snippet row(typestyle: Snippet)}
  <div
    {@attach measureRow}
    style="display:flex; flex-direction:row; align-items:center; padding-top:12px; padding-bottom:12px; border-bottom:1px solid var(--colors-surface-border-gray-subtle, #eceff1);"
  >
    <div data-cell="typestyle" style={cell(COLUMN_WIDTHS.typestyle)}>{@render typestyle()}</div>
    {@render styleCell('font', COLUMN_WIDTHS.font)}
    {@render styleCell('size', COLUMN_WIDTHS.size)}
    {@render styleCell('lineHeight', COLUMN_WIDTHS.lineHeight)}
    {@render styleCell('weight', COLUMN_WIDTHS.weight)}
    {@render styleCell('letterSpacing', COLUMN_WIDTHS.letterSpacing)}
  </div>
{/snippet}

<Story name="All Typography">
  <div style="display:flex; flex-direction:column;">
    <div
      style="display:flex; flex-direction:row; align-items:center; padding-top:8px; padding-bottom:8px; border-bottom:1px solid var(--colors-surface-border-gray-muted, #cfd9e0); background-color:var(--colors-surface-background-gray-subtle, #f7f9fa);"
    >
      {@render headerCell('Typestyle', COLUMN_WIDTHS.typestyle)}
      {@render headerCell('Font', COLUMN_WIDTHS.font)}
      {@render headerCell('Size', COLUMN_WIDTHS.size)}
      {@render headerCell('Line Height', COLUMN_WIDTHS.lineHeight)}
      {@render headerCell('Weight', COLUMN_WIDTHS.weight)}
      {@render headerCell('Letter Spacing', COLUMN_WIDTHS.letterSpacing)}
    </div>

    <!-- Heading -->
    {#snippet headingH2XL()}<Heading size="2xlarge">Heading2XLarge</Heading>{/snippet}
    {#snippet headingXL()}<Heading size="xlarge">HeadingXLarge</Heading>{/snippet}
    {#snippet headingL()}<Heading size="large">HeadingLarge</Heading>{/snippet}
    {#snippet headingM()}<Heading size="medium">HeadingMedium</Heading>{/snippet}
    {#snippet headingS()}<Heading size="small">HeadingSmall</Heading>{/snippet}

    <!-- Body (Text) -->
    {#snippet bodyL()}<Text size="large">BodyLarge</Text>{/snippet}
    {#snippet bodyM()}<Text size="medium">BodyMedium</Text>{/snippet}
    {#snippet bodyS()}<Text size="small">BodySmall</Text>{/snippet}
    {#snippet bodyXS()}<Text size="xsmall">BodyXSmall</Text>{/snippet}

    <!-- Caption -->
    {#snippet captionM()}<Text variant="caption" size="medium">CaptionMedium</Text>{/snippet}

    <!-- Code -->
    {#snippet codeM()}<Code size="medium">CodeMedium</Code>{/snippet}
    {#snippet codeS()}<Code size="small">CodeSmall</Code>{/snippet}

    {@render row(headingH2XL)}
    {@render row(headingXL)}
    {@render row(headingL)}
    {@render row(headingM)}
    {@render row(headingS)}
    {@render row(bodyL)}
    {@render row(bodyM)}
    {@render row(bodyS)}
    {@render row(bodyXS)}
    {@render row(captionM)}
    {@render row(codeM)}
    {@render row(codeS)}
  </div>
</Story>
