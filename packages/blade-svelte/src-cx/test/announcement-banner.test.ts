import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { AnnouncementBanner } from '../index';
import { OffersIcon } from '../icons';
import { expectGlyph } from './classes';

const children = createRawSnippet(() => ({ render: () => '<span>Zero setup fees</span>' }));

describe('AnnouncementBanner', () => {
  it('is a labelled region with the message on one line, centred by default', () => {
    const { getByRole } = render(AnnouncementBanner, { props: { children, testID: 'banner' } });
    const banner = getByRole('region', { name: 'Announcement' });
    expect(banner.dataset.testid).toBe('banner');
    expect(banner.className).toContain('bg-surface-gray-subtle');
    expect(banner.className).toContain('px-4 py-2');
    expect(banner.className).toContain('justify-center');
    const message = banner.lastElementChild!;
    expect(message.textContent).toBe('Zero setup fees');
    expect(message.className).toContain('text-75 [line-height:1.125rem] font-blade-medium');
    expect(message.className).toContain('clamp-1');
  });

  it('leads with an icon when given one, and aligns left on request', () => {
    const { getByRole } = render(AnnouncementBanner, {
      props: { children, icon: OffersIcon, alignment: 'left', accessibilityLabel: 'Offer' },
    });
    const banner = getByRole('region', { name: 'Offer' });
    expect(banner.className).toContain('justify-start');
    expectGlyph(banner.firstElementChild, OffersIcon);
  });
});
