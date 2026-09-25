import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { getIconProps } from '../getIconProps';
import { iconSizeMap } from '../iconSizeMap';
import { iconMap } from '../iconMap';
import { CheckIcon } from '../CheckIcon';
import { DotIcon } from '../DotIcon';
import { PinIcon } from '../PinIcon';
import { MoreFilledIcon } from '../MoreFilledIcon';

describe('getIconProps', () => {
  it('maps size tokens to pixel dimensions', () => {
    for (const [size, px] of Object.entries(iconSizeMap)) {
      const props = getIconProps({ size: size as keyof typeof iconSizeMap });
      expect(props.width).toBe(px);
      expect(props.height).toBe(px);
    }
  });

  it('defaults to medium size and gray icon color', () => {
    const props = getIconProps({});
    expect(props.width).toBe(iconSizeMap.medium);
    expect(props.iconColor).toContain('var(--');
  });

  it('passes currentColor through untouched', () => {
    expect(getIconProps({ color: 'currentColor' }).iconColor).toBe('currentColor');
  });
});

describe('generated icons', () => {
  it('renders a path-based icon with size, color and a11y attributes', () => {
    const { container } = render(CheckIcon, {
      props: { size: 'large', color: 'feedback.icon.neutral.intense' },
    });
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('width')).toBe(String(iconSizeMap.large));
    expect(svg?.getAttribute('height')).toBe(String(iconSizeMap.large));
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');

    const path = container.querySelector('path');
    expect(path?.getAttribute('d')).toMatch(/^M20\.7071 5\.29289/);
    expect(path?.getAttribute('fill')).toBe(
      getIconProps({ color: 'feedback.icon.neutral.intense' }).iconColor,
    );
  });

  it('renders a circle-based icon', () => {
    const { container } = render(DotIcon);
    const circle = container.querySelector('circle');
    expect(circle?.getAttribute('r')).toBe('8');
    expect(circle?.getAttribute('fill')).toBe(getIconProps({}).iconColor);
  });

  it('renders icons that use g, defs, clipPath and rect', () => {
    const { container } = render(PinIcon);
    expect(container.querySelector('g')?.getAttribute('clip-path')).toMatch(/^url\(#/);
    expect(container.querySelector('defs clipPath rect')).not.toBeNull();
  });

  it('renders filled icons', () => {
    const { container } = render(MoreFilledIcon);
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('exposes every generic icon through iconMap, sorted, without branded icons', () => {
    const names = Object.keys(iconMap).filter((name) => name !== 'None');
    expect(names.length).toBeGreaterThan(400);
    expect(names).toContain('CheckIcon');
    expect(names).not.toContain('RazorpayTrustIcon');
    expect(names).toEqual([...names].sort());
  });
});
