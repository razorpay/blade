import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import DecorHarness from './fixtures/DecorHarness.svelte';
import { expectGlyph } from './classes';

describe('Divider (preset component)', () => {
  it('is a separator with one border per orientation', () => {
    const { getByTestId } = render(DecorHarness);
    const rule = getByTestId('rule');
    expect(rule.tagName).toBe('HR');
    // Blade draws a horizontal line as the bottom border.
    expect(rule.className).toContain('border-b-thin');
    expect(rule.className).toContain('border-surface-gray-muted');
    expect(rule.hasAttribute('aria-orientation')).toBe(false);
    expect(rule.className.endsWith('my-2')).toBe(true);

    const upright = getByTestId('upright');
    expect(upright.getAttribute('aria-orientation')).toBe('vertical');
    expect(upright.className).toContain('border-l-thin');
    expect(upright.className).not.toContain('border-b-thin');
    expect(upright.className).toContain('border-dashed');
  });
});

describe('TrustBadge (preset component)', () => {
  it('is the shield and its line in a pill; the shield is decoration', () => {
    const badge = render(DecorHarness).getByTestId('trust');
    expect(badge.className).toContain('rounded-max');
    expect(badge.className).toContain('select-none');
    expect(badge.className.endsWith('mt-1')).toBe(true);
    expect(badge.textContent?.trim()).toBe('Razorpay Trusted Business');
    // A brand mark keeps its colours: an Image, decorative beside the label.
    const shield = badge.querySelector('img');
    expect(shield?.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    expect(shield?.getAttribute('alt')).toBe('');
  });

  it('icon-only drops the pill and names the shield with the label', () => {
    const { getByTestId, getByRole } = render(DecorHarness);
    const badge = getByTestId('trust-icon');
    expect(badge.className).not.toContain('rounded-max');
    expect(badge.textContent?.trim()).toBe('');
    expect(badge.contains(getByRole('img', { name: 'Razorpay Trusted Business' }))).toBe(true);
  });
});

describe('Screen (preset component)', () => {
  it('a screen scrolls its body, pins its footer, and goes inert when disabled', () => {
    const { getByTestId } = render(DecorHarness);
    const screen = getByTestId('screen');
    expect(screen.getAttribute('aria-label')).toBe('Card');
    expect((screen as HTMLElement & { inert: boolean }).inert).toBe(true);
    expect(screen.className).toContain('grayscale');
    expect(screen.className.endsWith('mt-3')).toBe(true);
    expect(screen.firstElementChild?.className).toContain('overflow-y-auto');
    expect(screen.lastElementChild).toBe(getByTestId('bar'));
  });

});

describe('EmptyState, as Blade', () => {
  it('stacks the asset, the title and description, and the actions', () => {
    const empty = render(DecorHarness).getByTestId('empty');
    const [asset, content, action] = Array.from(empty.children);
    expect(empty.className.endsWith('mt-4')).toBe(true);
    expect(empty.className).toContain('gap-5');
    expect(asset.className).toContain('max-w-[90px]');
    const [title, description] = Array.from(content.children);
    expect(title.tagName).toBe('H6');
    expect(title.textContent?.trim()).toBe('Payment failed');
    expect(description.textContent).toBe('Your money is safe');
    expect(action.tagName).toBe('BUTTON');
  });

  it('sizes the type and picks the heading level from size', async () => {
    const { resolveEmptyState } = await import('../components/empty-state/styles');
    const xl = resolveEmptyState({ size: 'xlarge' });
    expect(xl.headingLevel).toBe('h3');
    expect(xl.title).toContain('text-600');
    expect(xl.description).toContain('tracking-25');
    expect(xl.asset).toBe('max-w-[160px] max-h-[160px]');
  });

  it("leads the title with an icon, in Figma's size and gap; the title sits 4px over the description", async () => {
    const { resolveEmptyState } = await import('../components/empty-state/styles');
    const sizes = [
      ['small', 'small', 'gap-1'],
      ['medium', 'medium', 'gap-2'],
      ['large', 'large', 'gap-3'],
      ['xlarge', '2xlarge', 'gap-3'],
    ] as const;
    for (const [size, iconSize, gap] of sizes) {
      const classes = resolveEmptyState({ size });
      expect(classes.iconSize).toBe(iconSize);
      expect(classes.lead).toContain(gap);
      expect(classes.content).toContain('gap-1');
    }
    const { default: EmptyState } = await import('../components/empty-state/EmptyState.svelte');
    const { InfoIcon } = await import('../icons');
    const { getByTestId } = render(EmptyState, {
      props: { title: 'No data found', description: 'Try another range', icon: InfoIcon, testID: 'es' },
    });
    const lead = getByTestId('es').querySelector('h6')!.parentElement!;
    expect(lead.className).toContain('gap-2');
    expectGlyph(lead, InfoIcon);
  });

  it('renders only the parts it was given', () => {
    const empty = render(DecorHarness).getByTestId('empty-bare');
    expect(empty.children.length).toBe(1);
  });
});

describe('Divider, as Blade', () => {
  it('takes its colour from variant and its width from thickness', async () => {
    const { resolveDivider } = await import('../components/divider/styles');
    const line = resolveDivider({
      variant: 'normal',
      thickness: 'thicker',
      dividerStyle: 'dashed',
    });
    expect(line).toContain('border-surface-gray-normal');
    expect(line).toContain('border-b-thicker');
    expect(line).toContain('border-dashed');
    expect(resolveDivider({ orientation: 'vertical', thickness: 'thinner' })).toContain(
      'border-l-thinner',
    );
  });
});
